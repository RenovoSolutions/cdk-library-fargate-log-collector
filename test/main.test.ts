import { readFileSync } from 'fs';
import {
  App,
  Stack,
  aws_ec2 as ec2,
  aws_ecs as ecs,
  aws_efs as efs,
  aws_logs as logs,
} from 'aws-cdk-lib';
import {
  Template,
  Annotations,
  Match,
} from 'aws-cdk-lib/assertions';
import { FargateLogCollectorService } from '../src/index';

const labEnv = {
  account: '134322753743',
  region: 'us-east-1',
};

describe('FargateLogCollectorService', () => {
  // Constructs that the tests require.
  let stack: Stack;
  let vpc: ec2.IVpc;
  let filesystem: efs.FileSystem;
  let logsAccessPoint: efs.IAccessPoint;
  let stateAccessPoint: efs.IAccessPoint;
  let cluster: ecs.ICluster;
  let logGroup: logs.ILogGroup;

  /**
   * This section sets up the test environment.
   * It creates a new stack and adds the constructs that the tests require.
   * This section runs once before each test.
   * Each test gets a fresh stack, so they don't interfere with each other.
   * Also, we can only call synth() once, so if we used beforeAll(), we would
   * only be allowed to create a template in one test.
   */
  beforeEach(() => {
    const app = new App();
    stack = new Stack(app, 'MyStack', {
      env: labEnv,
    });

    vpc = new ec2.Vpc(stack, 'MyVpc');

    filesystem = new efs.FileSystem(stack, 'MyEfsFileSystem', {
      vpc,
      lifecyclePolicy: efs.LifecyclePolicy.AFTER_7_DAYS,
    });

    logsAccessPoint = filesystem.addAccessPoint('logs', {
      path: '/var/log',
    });

    stateAccessPoint = filesystem.addAccessPoint('state', {
      path: '/var/agent-state',
    });

    cluster = new ecs.Cluster(stack, 'MyCluster', {
      vpc,
      containerInsightsV2: ecs.ContainerInsights.ENABLED,
      enableFargateCapacityProviders: true,
    });

    logGroup = new logs.LogGroup(stack, 'NewLogGroup', {
      logGroupName: 'new-log-group',
      retention: logs.RetentionDays.ONE_WEEK,
    });
  });

  /**
   * This is the main test. It creates a FargateLogCollectorService with a contrived
   * set of log mappings and other properties, so as to test as much code as possible.
   * It then checks that it has the right properties and doesn't throw any errors
   * or have any annotations.
   */
  test('Should create a Fargate service with the correct properties and match template', () => {
    const logcollector = new FargateLogCollectorService(stack, 'FargateLogCollectorService', {
      logMappings: [
        {
          filePath: 'my-first-log-file.log',
          createLogGroup: {
            logGroupName: 'my-log-group',
            retention: logs.RetentionDays.ONE_WEEK,
          },
          multilinePattern: 'start-anchor',
        },
        {
          filePath: 'my-second-log-file.log',
          logGroup, // mix and match new with existing log groups
          timestampFormat: '%Y-%m-%d %H:%M:%S', // this is a format string that will be used to parse the timestamp from the log message
          timezone: 'UTC', // Use UTC time when writing log events to CloudWatch
        },
        {
          filePath: 'my-third-log-file.log',
          createLogGroup: {
            logGroupName: 'my-log-group', // this one is a duplicate, but it should still work
            retention: logs.RetentionDays.ONE_WEEK, // this will be ignored
          },
          filters: [
            {
              type: 'exclude',
              expression: 'SECRET',
            },
          ],
        },
        {
          filePath: 'my-fourth-log-file.log',
          createLogGroup: { // no name for this group, so it will be auto-generated
            retention: logs.RetentionDays.INFINITE, // other properties are still allowed without a name
          },
        },
        {
          filePath: 'my-fifth-log-file.log', // no log group config at all, so it will be auto-generated
        },
      ],
      efsLogsAccessPoint: logsAccessPoint,
      efsStateAccessPoint: stateAccessPoint,
      cluster,
      containerLogging: ecs.LogDrivers.awsLogs({
        logGroup: new logs.LogGroup(stack, 'ContainerLogGroup', {
          logGroupName: 'container-log-group',
          retention: logs.RetentionDays.ONE_WEEK,
        }),
        streamPrefix: 'container',
        mode: ecs.AwsLogDriverMode.NON_BLOCKING,
      }),
      restartFunctionLogGroup: new logs.LogGroup(stack, 'LambdaLogGroup', {
        logGroupName: 'lambda-log-group',
        retention: logs.RetentionDays.ONE_YEAR,
      }),
    });

    /**
     * This section tests that the right properties are exposed.
     * The test won't compile if they aren't, and that's the point.
     * If you want to test the values, use the template assertions below.
     */
    expect(logcollector).toBeDefined();
    expect(logcollector.serviceName).toBeDefined();
    expect(logcollector.serviceArn).toBeDefined();
    expect(logcollector.cluster).toBeDefined();
    expect(logcollector.connections).toBeDefined();
    expect(logcollector.cloudMapService); // this just tests that the property is part of the class
    expect(logcollector.taskDefinition).toBeDefined();
    expect(logcollector.taskDefinition.executionRole).toBeDefined();
    expect(logcollector.taskDefinition.taskRole).toBeDefined();
    expect(logcollector.taskDefinition.findContainer('cloudwatch-agent')).toBeDefined();
    expect(logcollector.taskDefinition.findContainer('cloudwatch-agent')!.logDriverConfig).toBeDefined();
    expect(logcollector.restartFunction).toBeDefined();
    expect(logcollector.restartFunction.role).toBeDefined();
    expect(logcollector.restartFunction.logGroup).toBeDefined();
    expect(logcollector.restartScheduleRule).toBeDefined();
    expect(logcollector.efsLogsAccessPoint).toBeDefined();
    expect(logcollector.efsStateAccessPoint).toBeDefined();
    expect(logcollector.agentCpu).toBeDefined();
    expect(logcollector.agentMemory).toBeDefined();

    // This is the one static property we have.
    expect(FargateLogCollectorService.PROPERTY_INJECTION_ID).toBe('@renovosolutions.cdk-library-fargate-log-collector.FargateLogCollectorService');

    // This one is worth checking in detail.
    expect(logcollector.logMappings).toStrictEqual(
      expect.arrayContaining([
        expect.objectContaining({
          filePath: 'my-first-log-file.log',
          logGroup: expect.objectContaining({
            physicalName: 'my-log-group',
          }),
          multilinePattern: 'start-anchor',
        }),
        expect.objectContaining({
          filePath: 'my-second-log-file.log',
          logGroup: expect.objectContaining({
            physicalName: 'new-log-group',
          }),
          timestampFormat: '%Y-%m-%d %H:%M:%S',
          timezone: 'UTC',
        }),
        expect.objectContaining({
          filePath: 'my-third-log-file.log',
          logGroup: expect.objectContaining({
            physicalName: 'my-log-group',
          }),
          filters: expect.arrayContaining([
            expect.objectContaining(
              {
                type: 'exclude',
                expression: 'SECRET',
              }),
          ]),
        }),
        expect.objectContaining({
          filePath: 'my-fourth-log-file.log',
          logGroup: expect.objectContaining({
            physicalName: expect.stringMatching(/Token.*TOKEN/),
          }),
        }),
        expect.objectContaining({
          filePath: 'my-fifth-log-file.log',
          logGroup: expect.objectContaining({
            physicalName: expect.stringMatching(/Token.*TOKEN/),
          }),
        }),
      ]),
    );

    // Check that the generated interface is correct.
    const generatedFile = readFileSync('src/NarrowedFargateServiceProps.generated.ts', 'utf8');
    expect(generatedFile).toContain('readonly serviceName?: string;'); // one of the inherited properties we want
    expect(generatedFile).not.toContain('readonly taskDefinition:'); // one of the properties we don't want
    expect(generatedFile).not.toContain('readonly desiredCount?:'); // one of the properties we don't want

    //Get the template and annotations from the stack.
    const template = Template.fromStack(stack);
    const annotations = Annotations.fromStack(stack);

    /**
     * This section checks resource counts.
     * We don't check any resource type that is only in the stack from
     * the beforeEach() setup, because those are not created by this construct.
     */
    template.resourceCountIs('AWS::EC2::SecurityGroup', 2); // one for the service, one from the VPC in the setup
    template.resourceCountIs('AWS::EC2::SecurityGroupIngress', 1);
    template.resourceCountIs('AWS::ECS::Service', 1);
    template.resourceCountIs('AWS::ECS::TaskDefinition', 1);
    template.resourceCountIs('AWS::Events::Rule', 1);
    template.resourceCountIs('AWS::IAM::Policy', 3);
    template.resourceCountIs('AWS::IAM::Role', 3);
    template.resourceCountIs('AWS::Lambda::Function', 1);
    template.resourceCountIs('AWS::Lambda::Permission', 1);
    template.resourceCountIs('AWS::Logs::LogGroup', 6);

    /**
     * This section tests that the right resources are created.
     * We don't test every resource, just the ones that are complex enough
     * that they might not be created correctly.
     */

    // Task definition for the log collector
    template.hasResourceProperties('AWS::ECS::TaskDefinition', {
      ContainerDefinitions: [
        {
          Name: 'cloudwatch-agent',
          LogConfiguration: {
            LogDriver: 'awslogs',
            Options: {
              'awslogs-group': {
                Ref: Match.stringLikeRegexp('ContainerLogGroup'),
              },
              'awslogs-region': 'us-east-1',
              'awslogs-stream-prefix': 'container',
              'mode': 'non-blocking',
            },
          },
          Essential: true,
          Image: 'amazon/cloudwatch-agent:latest',
          MountPoints: [
            {
              ContainerPath: '/mnt/logs',
              ReadOnly: true,
              SourceVolume: 'logs',
            },
            {
              ContainerPath: '/opt/aws/amazon-cloudwatch-agent/logs/state',
              ReadOnly: false,
              SourceVolume: 'agent-state',
            },
          ],
          Environment: [
            {
              Name: 'CW_CONFIG_CONTENT',
              Value: {
                'Fn::Join': [
                  '',
                  [
                    '{"logs":{"logs_collected":{"files":{"collect_list":[{"file_path":"/mnt/logs/my-first-log-file.log","log_group_name":"my-log-group","log_stream_name":"{date}","multi_line_start_pattern":"start-anchor"},{"file_path":"/mnt/logs/my-second-log-file.log","log_group_name":"',
                    {
                      Ref: Match.stringLikeRegexp('NewLogGroup'),
                    },
                    '","log_stream_name":"{date}","timestamp_format":"%Y-%m-%d %H:%M:%S","timezone":"UTC"},{"file_path":"/mnt/logs/my-third-log-file.log","log_group_name":"my-log-group","log_stream_name":"{date}","filters":[{"type":"exclude","expression":"SECRET"}]},{"file_path":"/mnt/logs/my-fourth-log-file.log","log_group_name":"my-fourth-log-file.log","log_stream_name":"{date}"},{"file_path":"/mnt/logs/my-fifth-log-file.log","log_group_name":"my-fifth-log-file.log","log_stream_name":"{date}"}]}}}}',
                  ],
                ],
              },
            },
          ],
        },
      ],
      Volumes: [
        {
          Name: 'logs',
          EFSVolumeConfiguration: {
            FilesystemId: {
              Ref: Match.stringLikeRegexp('MyEfsFileSystem'),
            },
            TransitEncryption: 'ENABLED',
            AuthorizationConfig: {
              AccessPointId: {
                Ref: Match.stringLikeRegexp('MyEfsFileSystemlogs'),
              },
            },
          },
        },
        {
          Name: 'agent-state',
          EFSVolumeConfiguration: {
            FilesystemId: {
              Ref: Match.stringLikeRegexp('MyEfsFileSystem'),
            },
            TransitEncryption: 'ENABLED',
            AuthorizationConfig: {
              AccessPointId: {
                Ref: Match.stringLikeRegexp('MyEfsFileSystemstate'),
              },
            },
          },
        },
      ],
      Cpu: '256',
      Memory: '512',
      NetworkMode: 'awsvpc',
      RequiresCompatibilities: ['FARGATE'],
      ExecutionRoleArn: {
        'Fn::GetAtt': [
          Match.stringLikeRegexp('LogCollectorExecutionRole'),
          'Arn',
        ],
      },
      TaskRoleArn: {
        'Fn::GetAtt': [
          Match.stringLikeRegexp('LogCollectorTaskRole'),
          'Arn',
        ],
      },
      Family: Match.stringLikeRegexp('MyStackLogCollectorTaskDefinition'),
    });

    // Fargate service for the log collector
    template.hasResourceProperties('AWS::ECS::Service', {
      Cluster: {
        Ref: Match.stringLikeRegexp('MyCluster'),
      },
      DesiredCount: 1,
      LaunchType: 'FARGATE',
      TaskDefinition: {
        Ref: Match.stringLikeRegexp('LogCollectorTaskDefinition'),
      },
      NetworkConfiguration: {
        AwsvpcConfiguration: {
          AssignPublicIp: 'DISABLED',
          SecurityGroups: [
            {
              'Fn::GetAtt': [
                Match.stringLikeRegexp('FargateLogCollectorServiceSecurityGroup'),
                'GroupId',
              ],
            },
          ],
          Subnets: [
            {
              Ref: Match.stringLikeRegexp('MyVpcPrivateSubnet1'),
            },
            {
              Ref: Match.stringLikeRegexp('MyVpcPrivateSubnet2'),
            },
            {
              Ref: Match.stringLikeRegexp('MyVpcPrivateSubnet3'),
            },
          ],
        },
      },
    });

    // Task tole policy for EFS access
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              'elasticfilesystem:ClientMount',
              'elasticfilesystem:ClientRead',
              'elasticfilesystem:ClientWrite',
              'elasticfilesystem:DescribeMountTargets',
              'elasticfilesystem:ClientRootAccess',
            ],
            Condition: {
              StringEquals: {
                'elasticfilesystem:AccessPointArn': [
                  {
                    'Fn::Join': [
                      '',
                      [
                        'arn:',
                        {
                          Ref: 'AWS::Partition',
                        },
                        ':elasticfilesystem:us-east-1:134322753743:access-point/',
                        {
                          Ref: Match.stringLikeRegexp('MyEfsFileSystemstate'),
                        },
                      ],
                    ],
                  },
                ],
              },
            },
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': [
                Match.stringLikeRegexp('MyEfsFileSystem'),
                'Arn',
              ],
            },
          },
          {
            Action: [
              'elasticfilesystem:ClientMount',
              'elasticfilesystem:ClientRead',
              'elasticfilesystem:DescribeMountTargets',
              'elasticfilesystem:ClientRootAccess',
            ],
            Condition: {
              StringEquals: {
                'elasticfilesystem:AccessPointArn': [
                  {
                    'Fn::Join': [
                      '',
                      [
                        'arn:',
                        {
                          Ref: 'AWS::Partition',
                        },
                        ':elasticfilesystem:us-east-1:134322753743:access-point/',
                        {
                          Ref: Match.stringLikeRegexp('MyEfsFileSystemlogs'),
                        },
                      ],
                    ],
                  },
                ],
              },
            },
            Effect: 'Allow',
            Resource: {
              'Fn::GetAtt': [
                Match.stringLikeRegexp('MyEfsFileSystem'),
                'Arn',
              ],
            },
          },
        ],
      },
      PolicyName: Match.stringLikeRegexp('LogCollectorTaskRoleDefaultPolicy'),
      Roles: [
        {
          Ref: Match.stringLikeRegexp('LogCollectorTaskRole'),
        },
      ],
    });

    // Task role policy for CloudWatch Logs access
    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              'logs:CreateLogStream',
              'logs:PutLogEvents',
            ],
            Effect: 'Allow',
            Resource: [
              {
                'Fn::GetAtt': [
                  Match.stringLikeRegexp('FargateLogCollectorServicemyloggroup'),
                  'Arn',
                ],
              },
              {
                'Fn::Join': [
                  '',
                  [
                    {
                      'Fn::GetAtt': [
                        Match.stringLikeRegexp('FargateLogCollectorServicemyloggroup'),
                        'Arn',
                      ],
                    },
                    ':*:*',
                  ],
                ],
              },
              {
                'Fn::GetAtt': [
                  Match.stringLikeRegexp('NewLogGroup'),
                  'Arn',
                ],
              },
              {
                'Fn::Join': [
                  '',
                  [
                    {
                      'Fn::GetAtt': [
                        Match.stringLikeRegexp('NewLogGroup'),
                        'Arn',
                      ],
                    },
                    ':*:*',
                  ],
                ],
              },
              {
                'Fn::GetAtt': [
                  Match.stringLikeRegexp('FargateLogCollectorServicemyfourthlogfilelog'),
                  'Arn',
                ],
              },
              {
                'Fn::Join': [
                  '',
                  [
                    {
                      'Fn::GetAtt': [
                        Match.stringLikeRegexp('FargateLogCollectorServicemyfourthlogfilelog'),
                        'Arn',
                      ],
                    },
                    ':*:*',
                  ],
                ],
              },
              {
                'Fn::GetAtt': [
                  Match.stringLikeRegexp('FargateLogCollectorServicemyfifthlogfilelog'),
                  'Arn',
                ],
              },
              {
                'Fn::Join': [
                  '',
                  [
                    {
                      'Fn::GetAtt': [
                        Match.stringLikeRegexp('FargateLogCollectorServicemyfifthlogfilelog'),
                        'Arn',
                      ],
                    },
                    ':*:*',
                  ],
                ],
              },
            ],
          },
        ],
      },
      PolicyName: Match.stringLikeRegexp('FargateLogCollectorServiceCloudWatchAgentPolicy'),
      Roles: [
        {
          Ref: Match.stringLikeRegexp('LogCollectorTaskRole'),
        },
      ],
    });

    // Lambda function for restarting the service
    template.hasResourceProperties('AWS::Lambda::Function', {
      Code: {
        ZipFile: {
          'Fn::Join': [
            '',
            [
              `
import boto3
def handler(event, context):
    ecs = boto3.client('ecs')
    response = ecs.update_service(
        cluster='`,
              {
                Ref: Match.stringLikeRegexp('MyCluster'),
              },
              `',
        service='`,
              {
                'Fn::GetAtt': [
                  Match.stringLikeRegexp('FargateLogCollectorService'),
                  'Name',
                ],
              },
              `',
        forceNewDeployment=True
    )
    return {'status': 200}
    `,
            ],
          ],
        },
      },

      Handler: 'index.handler',
      Runtime: 'python3.13',
      LoggingConfig: {
        LogGroup: {
          Ref: Match.stringLikeRegexp('LambdaLogGroup'),
        },
      },
      Role: {
        'Fn::GetAtt': [
          Match.stringLikeRegexp('FargateLogCollectorServiceRestartServiceFunctionRole'),
          'Arn',
        ],
      },
    });

    // Lambda role for restarting the service
    template.hasResourceProperties('AWS::IAM::Role', {
      ManagedPolicyArns: [
        {
          'Fn::Join': [
            '',
            [
              'arn:',
              {
                Ref: 'AWS::Partition',
              },
              ':iam::aws:policy/service-role/AWSLambdaBasicExecutionRole',
            ],
          ],
        },
      ],
      Policies: [
        {
          PolicyDocument: {
            Statement: [
              {
                Action: 'ecs:UpdateService',
                Effect: 'Allow',
                Resource: {
                  Ref: Match.stringLikeRegexp('FargateLogCollectorService'),
                },
              },
            ],
          },
          PolicyName: 'RestartServicePolicy',
        },
      ],
    });

    // Rule for restarting the service
    template.hasResourceProperties('AWS::Events::Rule', {
      ScheduleExpression: 'cron(0 0 * * ? *)',
      State: 'ENABLED',
      Targets: [
        {
          Arn: {
            'Fn::GetAtt': [
              Match.stringLikeRegexp('FargateLogCollectorServiceRestartServiceFunction'),
              'Arn',
            ],
          },
          Id: 'Target0',
        },
      ],
    });

    // The usual snapshot test
    expect(template).toMatchSnapshot();

    // There should be no errors or warnings in this stack
    annotations.hasNoError('*', Match.anyValue());
    annotations.hasNoWarning('*', Match.anyValue());
  });

  /**
   * This test checks that we can use the static method `fromFargateServiceAttributes`
   * inherited from the parent class.
   */
  test('Should be able to import the service by attributes', () => {
    expect(() => {
      FargateLogCollectorService.fromFargateServiceAttributes(
        stack,
        'ImportedServiceFromAttributes',
        {
          serviceName: 'log-collector',
          cluster,
        },
      );
    }).not.toThrow();
  });

  /**
   * This test checks that we can use the static method `fromFargateServiceArn`
   * inherited from the parent class.
   */
  test('Should be able to import the service by ARN', () => {
    expect(() => {
      FargateLogCollectorService.fromFargateServiceArn(
        stack,
        'ImportedServiceFromArn',
        'arn:aws:ecs:us-east-1:123456789012:service/log-collector',
      );
    }).not.toThrow();
  });

  /**
   * This test checks that we can use the static method `fromFargateServiceArnWithCluster`
   * inherited from the parent class.
   */
  test('Should be able to import the service by ARN with cluster', () => {
    expect(() => {
      FargateLogCollectorService.fromServiceArnWithCluster(
        stack,
        'ImportedServiceFromArnWithCluster',
        'arn:aws:ecs:us-east-1:123456789012:service/clustername/log-collector',
      );
    }).not.toThrow();
  });

  // We should have an error if we don't pass any log mappings.
  test('Should annotate an error if no log mappings are provided', () => {
    new FargateLogCollectorService(stack, 'FargateLogCollectorService', {
      logMappings: [],
      efsLogsAccessPoint: logsAccessPoint,
      efsStateAccessPoint: stateAccessPoint,
      cluster,
    });

    Annotations.fromStack(stack).hasError(
      '*',
      'At least one log mapping must be provided.');
  });

  /**
   * The cursed code in this test passes every kind of wrong log mappings,
   * so we can exercise the validation code.
   */
  test('Should annotate multiple errors and warnings when log mappings are invalid', () => {
    new FargateLogCollectorService(stack, 'FargateLogCollectorService', {
      logMappings: [
        {
          filePath: 'logs/log-file.log',
          timezone: 'UTC', // timezone without timestampFormat does nothing and produces a warning
        },
        {
          filePath: '/absolute-path.log', // this is an absolute path, which produces an error
        },
        {
          filePath: '', // this is an empty path, which produces an error
          createLogGroup: { // both createLogGroup and logGroup are given, which produces a warning
            logGroupName: 'my-log-group',
          },
          logGroup: logGroup,
        },
        {
          filePath: 'logs/log-file.log', // this is a duplicate path, which produces an error
        },
        {
          filePath: 'otherpath/log-file.log', // this is a collision for auto-generated log group names, which produces a warning
        },
      ],
      efsLogsAccessPoint: logsAccessPoint,
      efsStateAccessPoint: stateAccessPoint,
      cluster,
    });

    const annotations = Annotations.fromStack(stack);

    annotations.hasError(
      '/MyStack/FargateLogCollectorService',
      'logMapping 1: (/absolute-path.log): filePath must be a relative path from the root of the logs access point.',
    );

    annotations.hasError(
      '/MyStack/FargateLogCollectorService',
      'logMapping 2: One of the filePaths is empty.',
    );

    annotations.hasError(
      '/MyStack/FargateLogCollectorService',
      'logMapping 3: (logs/log-file.log): filePath is a duplicate. This is not supported.',
    );

    annotations.hasWarning(
      '/MyStack/FargateLogCollectorService',
      'logMapping 0: (logs/log-file.log): timestampFormat should be specified if timezone is specified. CloudWatch Agent will ignore timezone if timestampFormat is not specified. [ack: fargate-log-collector:timezone-without-timestampFormat]',
    );

    annotations.hasWarning(
      '/MyStack/FargateLogCollectorService',
      'logMapping 2: (): createLogGroup and logGroup should not be used together. Only one should be specified. Using logGroup and ignoring createLogGroup. [ack: fargate-log-collector:logGroup-with-createLogGroup]',
    );

    annotations.hasWarning(
      '/MyStack/FargateLogCollectorService',
      'logMapping 4: (otherpath/log-file.log): Multiple filePaths for which we are creating logGroups with no name provided have the same final part. All of these files will be forwarded to the same logGroup. This is probably not what you want. You should probably use createLogGroup with a name instead. [ack: fargate-log-collector:filename-collision]',
    );
  });
});
