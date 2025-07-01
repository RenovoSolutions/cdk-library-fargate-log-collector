import { ProjenStruct, Struct } from '@mrgrain/jsii-struct-builder';
import { awscdk, javascript } from 'projen';

const project = new awscdk.AwsCdkConstructLibrary({
  author: 'Renovo Solutions',
  authorAddress: 'webmaster+cdk@renovo1.com',
  cdkVersion: '2.202.0',
  defaultReleaseBranch: 'master',
  jsiiVersion: '~5.8.0',
  name: '@renovosolutions/cdk-library-fargate-log-collector',
  projenrcTs: true,
  repositoryUrl: 'https://github.com/RenovoSolutions/cdk-library-fargate-log-collector.git',
  description: 'AWS CDK Construct Library to deploy CloudWatch Agent as a Fargate service',
  keywords: [
    'cdk',
    'aws-cdk',
    'aws-cdk-construct',
    'ecs',
    'fargate',
    'log',
    'logging',
    'monitoring',
    'cloudwatch',
    'cloudwatch-agent',
    'projen',
  ],
  devDeps: [
    '@mrgrain/jsii-struct-builder',
  ],
  depsUpgrade: true,
  depsUpgradeOptions: {
    workflow: false,
    exclude: ['projen'],
  },
  gitignore: [
    'test/read*',
  ],
  githubOptions: {
    mergify: false,
    pullRequestLintOptions: {
      semanticTitle: false,
    },
  },
  stale: false,
  releaseToNpm: true,
  release: true,
  npmAccess: javascript.NpmAccess.PUBLIC,
  docgen: true,
  eslint: true,
  publishToPypi: {
    distName: 'renovosolutions.aws-cdk-fargate-log-collector',
    module: 'renovosolutions_fargate_log_collector',
  },
  publishToNuget: {
    dotNetNamespace: 'renovosolutions',
    packageId: 'Renovo.AWSCDK.FargateLogCollector',
  },
  experimentalIntegRunner: true,
});

new ProjenStruct(project, {
  name: 'NarrowedFargateServiceProps',
  filePath: 'src/NarrowedFargateServiceProps.generated.ts', // this name excludes it from eslint, which complains about no write access
  docs: {
    summary: 'ecs.FargateServiceProps without taskDefinition and desiredCount',
    remarks: `We do not want to allow the user to specify a task definition or desired count,
as this construct is meant to deploy a single service with a single task definition and
desired count of 1. So we narrow the ecs.FargateServiceProps type to exclude these properties.`,
    custom: {
      internal: 'true', // this is required to avoid the jsii error about not being exported
    },
  },
})
  .mixin(Struct.fromFqn('aws-cdk-lib.aws_ecs.FargateServiceProps'))
  .omit('taskDefinition', 'desiredCount');

new javascript.UpgradeDependencies(project, {
  include: ['projen'],
  taskName: 'upgrade-projen',
  workflow: true,
  workflowOptions: {
    schedule: javascript.UpgradeDependenciesSchedule.WEEKLY,
  },
});

project.synth();