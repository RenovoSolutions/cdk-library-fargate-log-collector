import {
  IntegTest,
  ExpectedResult,
} from '@aws-cdk/integ-tests-alpha';
import {
  App,
  Aspects,
  CfnResource,
  Duration,
  IAspect,
  RemovalPolicy,
  Stack,
  aws_ec2 as ec2,
  aws_ecs as ecs,
  aws_efs as efs,
  aws_iam as iam,
  aws_lambda as lambda,
  aws_logs as logs,
  triggers,
} from 'aws-cdk-lib';
import { RequireApproval } from 'aws-cdk-lib/cloud-assembly-schema';
import { IConstruct } from 'constructs';
import { FargateLogCollectorService } from '../src';

/**
 * This integration test is a live test for the FargateLogCollectorService construct.
 * It deploys a test environment, creates some test data, and verifies that the log
 * collector service collects the logs correctly.
 */

/**
 * This aspect sets removal policy of all resources in a node to DESTROY.
 * This is useful for integration tests where you want to clean up resources after the test run.
 */
export class RemovalPolicyDestroyAspect implements IAspect {
  visit(node: IConstruct): void {
    if (CfnResource.isCfnResource(node)) {
      node.applyRemovalPolicy(RemovalPolicy.DESTROY);
    }
  }
}

// Here is all the setup.
const app = new App();

/**
 * Our test case stack.
 * Must be environment-agnostic.
 */
const stack = new Stack(app, 'FargateLogCollectorTestStack');

// We can't use lookups in the integration test framework, so we have to create a new VPC.
const vpc = new ec2.Vpc(stack, 'Vpc', {
  ipAddresses: ec2.IpAddresses.cidr('10.250.0.0/16'), // We don't care about the CIDR, since this will never interact with any other VPCs.
  maxAzs: 1, // Tiniest VPC possible.
  natGateways: 1,
  subnetConfiguration: [
    {
      name: 'Public',
      subnetType: ec2.SubnetType.PUBLIC,
    },
    {
      name: 'Private',
      subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
    },
    {
      name: 'PrivateIsolated',
      subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
    },
  ],
});

// EFS file system for the test.
const fileSystem = new efs.FileSystem(stack, 'FileSystem', {
  vpc,
  vpcSubnets: {
    subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
  },
  encrypted: true,
  lifecyclePolicy: efs.LifecyclePolicy.AFTER_7_DAYS,
  performanceMode: efs.PerformanceMode.GENERAL_PURPOSE,
  throughputMode: efs.ThroughputMode.BURSTING,
  fileSystemPolicy: new iam.PolicyDocument({
    statements: [
      new iam.PolicyStatement({
        effect: iam.Effect.DENY,
        actions: [
          'elasticfilesystem:ClientMount',
          'elasticfilesystem:ClientWrite',
          'elasticfilesystem:ClientRootAccess',
        ],
        principals: [new iam.AnyPrincipal()],
        conditions: {
          Bool: {
            'aws:SecureTransport': 'false',
          },
        },
      }),
      new iam.PolicyStatement({
        actions: [
          'elasticfilesystem:ClientMount',
          'elasticfilesystem:ClientWrite',
          'elasticfilesystem:ClientRootAccess',
        ],
        principals: [new iam.AnyPrincipal()],
        conditions: {
          Bool: {
            'elasticfilesystem:AccessedViaMountTarget': 'false',
          },
        },
        effect: iam.Effect.DENY,
      }),
    ],
  }),
});

// This access point is used to store the logs collected by the log collector service.
const logsAccessPoint = fileSystem.addAccessPoint('LogsAccessPoint', {
  path: '/logs',
  createAcl: {
    ownerGid: '0',
    ownerUid: '0',
    permissions: '0755',
  },
  posixUser: {
    uid: '0',
    gid: '0',
  },
});

// This access point is used to store the state of the log collector service.
const stateAccessPoint = fileSystem.addAccessPoint('StateAccessPoint', {
  path: '/state',
  createAcl: {
    ownerGid: '0',
    ownerUid: '0',
    permissions: '0755',
  },
  posixUser: {
    uid: '0',
    gid: '0',
  },
});

/**
 * Cluster for the log collector service.
 * If GuardDuty is enabled for the account, it will block
 * the deletion of the VPC and cause the integration test to fail.
 */
const cluster = new ecs.Cluster(stack, 'Cluster', {
  vpc,
  clusterName: 'integ-test-fargate-log-collector',
  enableFargateCapacityProviders: true,
});

// Log group for the first log mapping (precreated).
const logGroup1 = new logs.LogGroup(stack, 'TestLogGroup1', {
  logGroupName: 'integ-test-log-collector-1',
  retention: logs.RetentionDays.ONE_WEEK,
});

/**
 * Role for the test data lambda function.
 * Using an inline policy for lambdas breaks the integration test snapshot comparison,
 * so we create a separate role instead.
 * This role allows the lambda to write to the logs access point.
 */
const testDataLambdaRole = new iam.Role(stack, 'TestDataLambdaRole', {
  assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
  roleName: 'integ-test-log-collector-test-data-lambda-role',
  managedPolicies: [
    iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
    iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaVPCAccessExecutionRole'),
  ],
  inlinePolicies: {
    LambdaEfsAccess: new iam.PolicyDocument({
      statements: [
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: [
            'elasticfilesystem:ClientWrite',
            'elasticfilesystem:ClientRead',
            'elasticfilesystem:ClientRootAccess',
            'elasticfilesystem:ClientMount',
            'elasticfilesystem:DescribeMountTargets',
          ],
          resources: [fileSystem.fileSystemArn],
          conditions: {
            StringEquals: {
              'elasticfilesystem:AccessPointArn': [
                logsAccessPoint.accessPointArn,
              ],
            },
            Bool: {
              'elasticfilesystem:AccessedViaMountTarget': 'true',
            },
          },
        }),
      ],
    }),
  },
});

/**
 * This lambda is used to write test data to the EFS file system.
 * It simulates the log files that the FargateLogCollectorService will collect.
 * It runs as soon as it's deployed.
 */
const testDataLambda = new triggers.TriggerFunction(stack, 'TestDataLambda', {
  functionName: 'integ-test-log-collector-test-data-lambda',
  runtime: lambda.Runtime.PYTHON_3_13,
  role: testDataLambdaRole,
  code: lambda.Code.fromInline(`
import os

def handler(event, context):
    with open('/mnt/logs/file1.log', 'a') as f:
        f.write('This is test log file 1\\n')

    with open('/mnt/logs/file2.log', 'a') as f:
        f.write('This is test log file 2\\n')

    return True
    `),
  handler: 'index.handler',
  filesystem: lambda.FileSystem.fromEfsAccessPoint(logsAccessPoint, '/mnt/logs'),
  logGroup: new logs.LogGroup(stack, 'TestDataLambdaLogGroup', {
    logGroupName: 'integ-test-log-collector-test-data-lambda',
    retention: logs.RetentionDays.ONE_WEEK,
  }),
  vpc,
});

// Ensure the filesystem is fully up before deploying the lambda.
testDataLambda.node.addDependency(fileSystem.mountTargetsAvailable);

// Here is the thing we want to test.
const logcollector = new FargateLogCollectorService(stack, 'LogCollector', {
  logMappings: [
    {
      filePath: 'file1.log',
      logGroup: logGroup1, // precreated log group
    },
    {
      filePath: 'file2.log',
      createLogGroup: {
        logGroupName: 'integ-test-log-collector-2', // this log group will be created by the construct.
        retention: logs.RetentionDays.ONE_WEEK,
      },
    },
  ],
  efsLogsAccessPoint: logsAccessPoint,
  efsStateAccessPoint: stateAccessPoint,
  cluster,
});

// Ensure the filesystem is fully up before deploying the log collector.
logcollector.node.addDependency(fileSystem.mountTargetsAvailable);
logcollector.node.addDependency(testDataLambda);

// Apply the aspect to the stack to set removal policy to DESTROY.
Aspects.of(stack).add(new RemovalPolicyDestroyAspect());

// Get today's date in YYYY-MM-DD format for log stream name.
const today = new Date().toISOString().split('T')[0];

// The integration test options.
const testCase = new IntegTest(app, 'IntegrationTest', {
  testCases: [stack],
  diffAssets: false,
  stackUpdateWorkflow: true,
  regions: [stack.region],
  cdkCommandOptions: {
    deploy: {
      args: {
        requireApproval: RequireApproval.NEVER,
      },
    },
    destroy: {
      args: {
        force: true,
      },
    },
  },
});

// Check the first log group for a log stream with today's date.
const result1 = testCase.assertions.awsApiCall('cloudwatch-logs', 'GetLogEvents', {
  logGroupName: logGroup1.logGroupName,
  logStreamName: today,
  startFromHead: true,
  limit: 1,
})
// Wait up to 5 minutes if needed, in case something is slow.
  .waitForAssertions({
    totalTimeout: Duration.minutes(5),
  });

// Then check the second log group for a log stream with today's date.
const result2 = testCase.assertions.awsApiCall('cloudwatch-logs', 'GetLogEvents', {
  logGroupName: 'integ-test-log-collector-2',
  logStreamName: today,
  startFromHead: true,
  limit: 1,
})
// Wait up to 5 minutes for the second log stream as well. These waits run in parallel.
  .waitForAssertions({
    totalTimeout: Duration.minutes(5),
  });

// Assert that the log streams exist and contain the expected log messages.
result1.assertAtPath('events.0.message', ExpectedResult.stringLikeRegexp('This is test log file 1'));
result2.assertAtPath('events.0.message', ExpectedResult.stringLikeRegexp('This is test log file 2'));
