import {
  aws_ec2 as ec2,
  aws_ecs as ecs,
  aws_efs as efs,
  aws_events as events,
  aws_events_targets as eventsTargets,
  aws_iam as iam,
  aws_lambda as lambda,
  aws_logs as logs,
  Annotations,
  RemovalPolicy,
} from 'aws-cdk-lib';
import { Construct } from 'constructs';

/**
 * A filter entry for a log.
 * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-Configuration-File-Details.html
 */
export interface LogFilter {
  /**
   * The type of filter. Either 'include' or 'exclude'.
   */
  readonly type: 'include' | 'exclude';
  /**
   * The filter pattern. This is a regular expression that matches the log lines to include or exclude.
   */
  readonly expression: string;
};

/**
 * A mapping of a log file to a CloudWatch log group.
 */
export interface LogMapping {
  /**
   * The path to the log file on the EFS access point.
   * This should be a relative path from the root of the access point.
   * It must not start with a '/'.
   *
   * @example 'my-log-file.log' if the main service mounts the logs access point at '/mnt/logs' and the file is at '/mnt/logs/my-log-file.log'. 'logs/my-log-file.log' if the main service mounts the logs access point at '/opt/app' and the file is at '/opt/app/logs/my-log-file.log/'.
   */
  readonly filePath: string;
  /**
   * The props for a log group to create.
   * Do not pass props for an existing log group here,
   * or a duplicate will be created and you will get
   * a deployment failure.
   *
   * If both `createLogGroup` and `logGroup` are absent,
   * a new log group will be created with a name
   * derived from last part of the file path
   * and default props.
   *
   * If both `createLogGroup` and `logGroup` are provided,
   * the `logGroup` will be used, and the `createLogGroup` will be ignored.
   *
   * @default - None
   */
  readonly createLogGroup?: logs.LogGroupProps;
  /**
   * The log group to use.
   * 
   * This should be an existing log group.
   *
   * If both `createLogGroup` and `logGroup` are provided,
   * the `logGroup` will be used, and the `createLogGroup` will be ignored.
   *
   * @default - None
   */
  readonly logGroup?: logs.ILogGroup;
  /**
   * The format of the timestamp in the log file.
   * This is not quite the same as a strftime format string.
   * If this is not provided, the agent will forward all messages
   * with a timestamp matching the time it sees the message.
   *
   * @default - None
   */
  readonly timestampFormat?: string;
  /**
   * Whether to use UTC or local time for messages added to the log group.
   * Either 'UTC' or 'Local'. It does not allow arbitrary timezones to be set.
   * This is only used if `timestampFormat` is provided.
   * If this is not provided, the agent will use local time.
   *
   * @default - None
   */
  readonly timezone?: 'Local' | 'UTC';
  /**
   * The pattern to use for recognizing multi-line log messages.
   * This is a regular expression that matches the start of a new log message.
   * If this is not provided, the agent will treat each line that begins with
   * a non-whitespace character as starting a new log message.
   * If you include this field, you can specify `{timestamp_format}` to use
   * the same regular expression as your timestamp format. Otherwise, you can
   * specify a different regular expression for CloudWatch Logs to use to determine
   * the start lines of multi-line entries.
   *
   * @default - None
   */
  readonly multilinePattern?: string;
  /**
 * A list of filters to apply to the log file.
 * Each filter is a regular expression that matches the log lines to include or exclude.
 * If you include this field, the agent processes each log message with all of the
 * filters that you specify, and only the log events that pass all of the filters
 * are published to CloudWatch Logs. The log entries that don’t pass all of the
 * filters will still remain in the host's log file, but will not be sent to CloudWatch Logs.
 * If you omit this field, all logs in the log file are published to CloudWatch Logs.
 */
  readonly filters?: LogFilter[];
};

/**
 * An item in the collect list for the CloudWatch agent configuration.
 * This is similar to the `LogMapping` interface, but with slightly different
 * properties, and different names for those that are otherwise the same.
 * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-Configuration-File-Details.html
 */
interface CollectListEntry {
  /**
   * The absolute path to the log file as the agent sees it.
   * This is constructed by prepending `/mnt/logs/` to the `filePath` property of the `LogMapping`.
   */
  file_path: string;
  /**
   * The name of the log group to use.
   * This is derived from either `LogMapping.createLogGroup` or `LogMapping.logGroupName`.
   */
  log_group_name: string;
  /**
   * The name of the log stream to use.
   * This is always set to `{date}` for the purposes of this library.
   * This means that a new log stream will be created every day with the format `YYYY-MM-DD`.
   */
  log_stream_name: '{date}';
  /**
   * A list of filters to apply to the log file.
   * Each filter is a regular expression that matches the log lines to include or exclude.
   * This is derived from the `LogMapping.filters` property.
   */
  filters?: LogFilter[];
  /**
   * The format of the timestamp in the source log file.
   * This is derived from the `LogMapping.timestampFormat` property.
   */
  timestamp_format?: string;
  /**
   * The timezone to use for the log stream entries.
   * This is derived from the `LogMapping.timezone` property.
   */
  timezone?: string;
  /**
   * The pattern to use for recognizing multi-line log messages.
   * This is derived from the `LogMapping.multilinePattern` property.
   */
  multi_line_start_pattern?: string;
};

/**
 * Narrowed version of `FargateServiceProps` that omits the `taskDefinition` and `desiredCount` properties.
 * We don't need or want these properties, so we remove them from the type.
 *
 * This is generated by projen. See the .projenrc.ts and the NarrowedFargateServiceProps.ts files
 * for details.
 */
import { NarrowedFargateServiceProps } from './NarrowedFargateServiceProps.generated';

/**
 * Constructor properties for the FargateLogCollectorService.
 * This uses the private NarrowedFargateServiceProps interface in this project as a base.
 */
export interface FargateLogCollectorServiceProps extends NarrowedFargateServiceProps {
  /**
   * A list of log mappings.
   * This is used to create the CloudWatch agent configuration.
   * It is also used to create log groups if that is requested.
   * At least one log mapping must be provided.
   */
  readonly logMappings: LogMapping[];
  /**
   * The EFS access point where the logs are read from.
   */
  readonly efsLogsAccessPoint: efs.IAccessPoint;
  /**
   * The EFS access point where the agent state is stored.
   * This allows the agent to be restarted without losing its place in the logs.
   * Otherwise, the agent would forward every log file from the start
   * each time it is restarted.
   *
   * May be on a different EFS file system than `efsLogsAccessPoint` if desired.
   */
  readonly efsStateAccessPoint: efs.IAccessPoint;
  /**
   * The amount of memory (in MB) to allocate to the agent.
   * This is passed to the Fargate task definition.
   * You might need to increase this if you have a lot of logs to process.
   * Only some combinations of memory and CPU are valid.
   * @see https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ecs.TaskDefinition.html#cpu
   *
   * @default 512
   */
  readonly agentMemory?: number;
  /**
   * The amount of CPU units to allocate to the agent.
   * 1024 CPU units = 1 vCPU.
   * This is passed to the Fargate task definition.
   * You might need to increase this if you have a lot of logs to process.
   * Only some combinations of memory and CPU are valid.
   * @see https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ecs.TaskDefinition.html#memorymib
   *
   * @default 256
   */
  readonly agentCpu?: number;
  /**
   * The logging configuration for the container.
   *
   * @default ecs.LogDrivers.awsLogs({
                logGroup: new logs.LogGroup(scope, 'ContainerLogGroup', {
                  logGroupName: `/${props.cluster.clusterName}/${props.serviceName || 'log-collector'}/ecs/tasks`,
                  retention: logs.RetentionDays.TWO_YEARS,
                  removalPolicy: RemovalPolicy.RETAIN_ON_UPDATE_OR_DELETE,
                }),
                streamPrefix: 'log-collector-task-logs',
                mode: ecs.AwsLogDriverMode.NON_BLOCKING,
               }),
   */
  readonly containerLogging?: ecs.LogDriver;
  /**
   * The log Group to use for the restart function.
   *
   * @default new logs.LogGroup(this, 'RestartServiceFunctionLogGroup', {
                logGroupName: `/aws/lambda/${props.cluster.clusterName}/${props.serviceName || 'log-collector'}/restart-service`,
                retention: logs.RetentionDays.TWO_YEARS,
                removalPolicy: RemovalPolicy.RETAIN_ON_UPDATE_OR_DELETE,
              }),
   */
  readonly restartFunctionLogGroup?: logs.ILogGroup;
};

/**
 * A Fargate service that collects logs from a list of specified files on an EFS access point
 * and sends them to CloudWatch.
 * There is a single container in the task definition that runs the CloudWatch agent.
 *
 * There is a Lambda function included that restarts the agent service daily at 00:00 UTC.
 * This is to ensure that a new log stream is created every day for each log, named for the date,
 * with format `YYYY-MM-DD`. This is to make it easy to find the right log stream and
 * prevent the log streams from getting too large.
 *
 * There are two defaults changed from the parent class:
 *
 * - Deployment circuit breaker is enabled, with rollback, by default.
 * - minimum healthy percent is set to 0 by default, so we don't get a warning for having one task.
 */
export class FargateLogCollectorService extends ecs.FargateService {
  /**
   * Uniquely identifies this class.
   */
  public static readonly PROPERTY_INJECTION_ID: string = '@renovosolutions.cdk-library-fargate-log-collector.FargateLogCollectorService';
  /**
   * The EFS access point where the logs are read from.
   */
  public readonly efsLogsAccessPoint: efs.IAccessPoint;
  /**
   * The EFS access point where the agent state is stored.
   * This allows the agent to be restarted without losing its place in the logs.
   * Otherwise, the agent would forward the whole logs each time it is restarted.
   */
  public readonly efsStateAccessPoint: efs.IAccessPoint;
  /**
   * The list of log mappings, as processed from the input.
   * This can be used to see how the input log mappings were understood.
   * It is not the same as the log mappings passed in to the constructor.
   */
  public readonly logMappings: LogMapping[] = [];
  /**
   * The Lambda function that restarts the agent service.
   */
  public readonly restartFunction: lambda.Function;
  /**
   * The CloudWatch event rule that triggers the Lambda function to restart the agent service.
   * It is set to run daily at 00:00 UTC. The purpose of this is to ensure that a new log stream
   * is created every day, named for the date.
   */
  public readonly restartScheduleRule: events.Rule;
  /**
   * The amount of memory (in MB) allocated to the agent.
   * This was passed to the Fargate task definition.
   */
  readonly agentMemory: number;
  /**
   * The amount of CPU units allocated to the agent.
   * 1024 CPU units = 1 vCPU.
   * This was passed to the Fargate task definition.
   */
  readonly agentCpu: number;

  /**
   * The constructor for the FargateLogCollectorService.
   * This creates the IAM task and execution roles for the task, the task definition,
   * the CloudWatch agent container, the configuration for the agent, and the Fargate service.
   * It also creates a Lambda function that restarts the agent service.
   * @param scope The scope in which to create this Construct. Normally this is a stack.
   * @param id The Construct ID of the service.
   * @param props The properties for the service, as defined in the `FargateLogCollectorServiceProps` interface.
   */
  constructor(scope: Construct, id: string, props: FargateLogCollectorServiceProps) {
    // Default the service name to 'log-collector' if not provided.
    const name = props.serviceName || 'log-collector';

    /**
     * The execution role for the Fargate task.
     * This role is used by the ECS agent to pull the container image.
     * We don't add any additional permissions to this role.
     */
    const executionRole = new iam.Role(scope, 'LogCollectorExecutionRole', {
      assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          'service-role/AmazonECSTaskExecutionRolePolicy',
        ),
      ],
    });

    /**
     * The task role for the Fargate task.
     * This role is used by the CloudWatch agent to write logs to CloudWatch.
     * We add permissions to this role to allow the agent to access the EFS file system.
     */
    const taskRole = new iam.Role(scope, 'LogCollectorTaskRole', {
      assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
    });

    /**
     * The task role needs write permission to the state access point.
     * This is where the agent stores its state.
     * It is also given `elasticfilesystem:ClientRootAccess` because we don't know
     * how this access point was set up by the consumer.
     */
    taskRole.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          'elasticfilesystem:ClientMount',
          'elasticfilesystem:ClientRead',
          'elasticfilesystem:ClientWrite',
          'elasticfilesystem:DescribeMountTargets',
          'elasticfilesystem:ClientRootAccess',
        ],
        resources: [
          props.efsStateAccessPoint.fileSystem.fileSystemArn,
        ],
        conditions: {
          StringEquals: {
            'elasticfilesystem:AccessPointArn': [
              props.efsStateAccessPoint.accessPointArn,
            ],
          },
        },
      }),
    );

    /**
     * The task role needs permissions to read logs from the source access point.
     * It isn't allowed to write to this access point.
     * It is give `elasticfilesystem:ClientRootAccess` because the source files
     * may only be readable by the root user.
     */
    taskRole.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          'elasticfilesystem:ClientMount',
          'elasticfilesystem:ClientRead',
          'elasticfilesystem:DescribeMountTargets',
          'elasticfilesystem:ClientRootAccess',
        ],
        resources: [
          props.efsLogsAccessPoint.fileSystem.fileSystemArn,
        ],
        conditions: {
          StringEquals: {
            'elasticfilesystem:AccessPointArn': [
              props.efsLogsAccessPoint.accessPointArn,
            ],
          },
        },
      }),
    );

    /**
     * The task definition for the Fargate task.
     * It will always be named 'log-collector'.
     */
    const taskDefinition = new ecs.FargateTaskDefinition(
      scope,
      'LogCollectorTaskDefinition',
      {
        memoryLimitMiB: props.agentMemory || 512,
        cpu: props.agentCpu || 256,
        executionRole: executionRole,
        taskRole: taskRole,
      },
    );

    /**
     * The container for the CloudWatch agent.
     * This is the latest version of the Amazon-provided image.
     */
    const container = taskDefinition.addContainer('agentImage', {
      containerName: 'cloudwatch-agent',
      image: ecs.ContainerImage.fromRegistry('amazon/cloudwatch-agent:latest'),
      logging: props.containerLogging || ecs.LogDrivers.awsLogs({
        logGroup: new logs.LogGroup(scope, 'ContainerLogGroup', {
          logGroupName: `/${props.cluster.clusterName}/${name}/ecs/tasks`,
          retention: logs.RetentionDays.TWO_YEARS,
          removalPolicy: RemovalPolicy.RETAIN_ON_UPDATE_OR_DELETE,
        }),
        streamPrefix: `${name}-task-logs`,
        mode: ecs.AwsLogDriverMode.NON_BLOCKING,
      }),
    });

    /**
     * The volume where the logs come from.
     */
    taskDefinition.addVolume({
      name: 'logs',
      efsVolumeConfiguration: {
        fileSystemId: props.efsLogsAccessPoint.fileSystem.fileSystemId,
        authorizationConfig: {
          accessPointId: props.efsLogsAccessPoint.accessPointId,
          iam: 'ENABLED',
        },
        transitEncryption: 'ENABLED',
      },
    });

    /**
     * The volume where the agent state is stored.
     */
    taskDefinition.addVolume({
      name: 'agent-state',
      efsVolumeConfiguration: {
        fileSystemId: props.efsStateAccessPoint.fileSystem.fileSystemId,
        authorizationConfig: {
          accessPointId: props.efsStateAccessPoint.accessPointId,
          iam: 'ENABLED',
        },
        transitEncryption: 'ENABLED',
      },
    });

    /**
     * The logs volume is mounted at /mnt/logs in the container.
     * This path is prepended to the file path in the log mapping to create the
     * absolute path to the log file in the agent configuration.
     */
    container.addMountPoints({
      sourceVolume: 'logs',
      containerPath: '/mnt/logs',
      readOnly: true,
    });

    /**
     * The agent state volume is mounted at /opt/aws/amazon-cloudwatch-agent/logs/state in the container.
     * This path isn't configurable, because it is hardcoded in the agent.
     */
    container.addMountPoints({
      sourceVolume: 'agent-state',
      containerPath: '/opt/aws/amazon-cloudwatch-agent/logs/state',
      readOnly: false,
    });

    /**
     * Call the parent constructor to create the actual Fargate service.
     * We override some of the passed-in properties to force some of them,
     * or to change defaults.
     */
    super(scope, id, {
      // The props passed to this constructor.
      ...props,
      // Always use our own task definition.
      taskDefinition: taskDefinition,
      // Only one agent can read from the logs at a time.
      desiredCount: 1,
      // The minimum healthy percent is set to 0 by default.
      minHealthyPercent: props.minHealthyPercent || 0,
      // It will be named 'log-collector' if no name is provided.
      serviceName: props.serviceName || name,
      // Enable the deployment circuit breaker by default.
      circuitBreaker: props.circuitBreaker || {
        // Stop the deployment if it fails.
        enable: true,
        // Roll back the deployment if it fails.
        rollback: true,
      },
    });

    /**
     * Now that super has been called, we set the instance properties.
     */
    this.efsLogsAccessPoint = props.efsLogsAccessPoint;
    this.efsStateAccessPoint = props.efsStateAccessPoint;
    this.agentMemory = props.agentMemory || 512;
    this.agentCpu = props.agentCpu || 256;

    /**
     * The service needs to be able to connect to the EFS file system(s).
     */
    this.connections.allowTo(this.efsLogsAccessPoint.fileSystem, ec2.Port.tcp(2049), 'Allow access to the logs EFS file system');
    this.connections.allowTo(this.efsStateAccessPoint.fileSystem, ec2.Port.tcp(2049), 'Allow access to the agent state EFS file system');

    Annotations.of(this).acknowledgeWarning('@aws-cdk/aws-ec2:ipv4IgnoreEgressRule', 'The EFS access rule has to be added to the EFS stack, not this one.');

    /**
     * This big section is where we process the log mappings.
     * We create the log groups if requested.
     * There is a lot of error checking here to make sure that the
     * log mappings are valid.
     */

    // This is the list of log mappings that will go into the agent configuration.
    let collectList: CollectListEntry[] = [];
    /**
     * This is the list of log group and log stream ARNs that will be used in the
     * policy granting write access for the agent.
     */
    let logResources: string[] = [];
    /**
     * This is a Map of log group names to log groups.
     * This is used to prevent creating duplicate log groups.
     * Neither `collectList` nor `logResources` have both pieces of information,
     * and this makes it easier than if they did anyway.
     */
    let logGroupNameMap: Map<string, logs.ILogGroup> = new Map();

    // Add an error if no log mappings are provided.
    if (props.logMappings.length === 0) {
      Annotations.of(this).addError('At least one log mapping must be provided.');
    }

    // Process each log mapping.
    props.logMappings.forEach((logMapping, idx) => {
      /**
       * Add an error if the file path starts with a /.
       * The file path must be a relative path from the root of the logs access point.
       * So if we see a /, it's very likely that the consumer didn't understand
       * and gave us an absolute path.
       */
      if (logMapping.filePath.charAt(0) === '/') {
        Annotations.of(this).addError(`logMapping ${idx}: (${logMapping.filePath}): filePath must be a relative path from the root of the logs access point.`);
      }

      // Add an error if the file path is empty.
      if (logMapping.filePath.length === 0) {
        Annotations.of(this).addError(`logMapping ${idx}: One of the filePaths is empty.`);
      }

      /**
       * Add an error if the same filePath is used in multiple log mappings.
       * This works because we are processing props.logMappings in this loop
       * and checking against this.logMappings, which only contains the
       * log mappings we have already processed.
       */
      if (this.logMappings.some((mapping) => mapping.filePath === logMapping.filePath)) {
        Annotations.of(this).addError(`logMapping ${idx}: (${logMapping.filePath}): filePath is a duplicate. This is not supported.`);
        return;
      }

      /**
       * Add a warning if both createLogGroup and logGroup are provided.
       * We will ignore createLogGroup and use logGroup.
       * But the consumer should know that this is not expected.
       */
      if (logMapping.createLogGroup && logMapping.logGroup) {
        Annotations.of(this).addWarningV2('fargate-log-collector:logGroup-with-createLogGroup', `logMapping ${idx}: (${logMapping.filePath}): createLogGroup and logGroup should not be used together. Only one should be specified. Using logGroup and ignoring createLogGroup.`);
      }

      /**
       * Add a warning if we have a timezone, but no timestampFormat.
       * The agent will ignore the timezone if timestampFormat is not specified.
       * This is a warning, not an error, because the agent will still work.
       * But the consumer should know that this is not expected.
       */
      if (logMapping.timezone && !logMapping.timestampFormat) {
        Annotations.of(this).addWarningV2('fargate-log-collector:timezone-without-timestampFormat', `logMapping ${idx}: (${logMapping.filePath}): timestampFormat should be specified if timezone is specified. CloudWatch Agent will ignore timezone if timestampFormat is not specified.`);
      }

      /**
       * We can't modify the logMapping we are given because it's readonly.
       * So create new variables to hold the values we might need to change.
       */
      let logGroupName: string;
      let logGroup: logs.ILogGroup;

      // A logGroup was provided.
      if (logMapping.logGroup) {
        // Use the name from the log group.
        logGroupName = logMapping.logGroup.logGroupName;
        // Use the log group from the log mapping.
        logGroup = logMapping.logGroup;
        // Add the log group to the map of log groups.
        logGroupNameMap.set(logGroupName, logGroup);

      // We are creating a logGroup.
      } else {
        // If we are creating a log group, we need a Construct ID for it.
        let logGroupId: string;

        // A name was provided for the new log group.
        if (logMapping.createLogGroup && logMapping.createLogGroup.logGroupName) {
          // Use the log group name from the log mapping.
          logGroupName = logMapping.createLogGroup.logGroupName;
          /**
           * Create a construct ID from the log group name.
           * This is done by removing all non-alphanumeric characters.
           * We want it to have the same name every time we process
           * the same logGroupName.
           */
          logGroupId = logMapping.createLogGroup.logGroupName.replace(/[^0-9a-zA-Z]/gi, '');

        // No name was provided for the new log group.
        } else {
          /**
           * We create a name and ID from the filePath.
           * This is done by removing all non-alphanumeric characters and only
           * using the final part of the path.
           */
          logGroupName = logMapping.filePath.replace(/^.*\//, '');
          logGroupId = logGroupName.replace(/[^0-9a-zA-Z_\-\.#]/gi, '');

          /**
           * If we saw this logGroupName before, we have a collision.
           * Multiple filePaths had the same final part.
           * This is probably undesirable, so we add a warning.
           */
          if (logGroupNameMap.has(logGroupName)) {
            Annotations.of(this).addWarningV2('fargate-log-collector:filename-collision', `logMapping ${idx}: (${logMapping.filePath}): Multiple filePaths for which we are creating logGroups with no name provided have the same final part. All of these files will be forwarded to the same logGroup. This is probably not what you want. You should probably use createLogGroup with a name instead.`);
          }
        }
        /**
         * Check the Map of log groups to see if we already saw one with this name.
         * If we did, we use that one.
         * This prevents trying to create duplicate logGroups
         * if the same logGroupName or logGroup is used in multiple logMappings.
         */
        if (logGroupNameMap.has(logGroupName)) {
          logGroup = logGroupNameMap.get(logGroupName)!;

        // We didn't find it, so create a new log group and use that.
        } else {
          logGroup = new logs.LogGroup(this, logGroupId, logMapping.createLogGroup);
          logGroupNameMap.set(logGroupName, logGroup);
        }
      }

      // Add the ARNs of the log group and log streams to the list of resources.
      logResources.push((logGroup).logGroupArn);
      logResources.push((logGroup).logGroupArn + ':*:*');

      // Push the result of processing the log mapping to the collect list.
      collectList.push({
        file_path: `/mnt/logs/${logMapping.filePath}`,
        log_group_name: logGroupName,
        log_stream_name: '{date}',
        filters: logMapping.filters,
        timestamp_format: logMapping.timestampFormat,
        timezone: logMapping.timezone,
        multi_line_start_pattern: logMapping.multilinePattern,
      });

      /**
       *  Push the logMapping to the exposed list of log mappings.
       *  This will be available to the consumer of the class so they can
       *  see how the input logMappings were understood.
       */
      this.logMappings.push({
        filePath: logMapping.filePath,
        logGroup: logGroup,
        timestampFormat: logMapping.timestampFormat,
        timezone: logMapping.timezone,
        multilinePattern: logMapping.multilinePattern,
        filters: logMapping.filters,
      });
    });
    // End of processing the log mappings.

    /**
     * The CloudWatch agent needs permissions to write to the log groups.
     * This is done by attaching an inline policy to the task role.
     * The policy allows the agent to create log streams and put log events.
     * The policy is created from the log groups we found while processing
     * the log mappings above.
     *
     * We skip this if there were no log mappings. It will throw an error if
     * we don't. We want to show our more specific error annotation instead.
     */
    if (logResources.length !== 0) {
      this.taskDefinition.taskRole.attachInlinePolicy(
        new iam.Policy(this, 'CloudWatchAgentPolicy', {
          statements: [
            new iam.PolicyStatement({
              actions: [
                'logs:CreateLogStream',
                'logs:PutLogEvents',
              ],
              /**
               * There  could be duplicates in the log resources, which could
               * cause errors and make the policy hard to read, so we use a
               * spread-Set operation to remove them.
               */
              resources: [...new Set(logResources)],
            }),
          ],
        }),
      );
    }

    /**
     * The full CloudWatch agent configuration.
     * This is built from the collect list we created above.
     * It is converted to JSON and passed to the agent
     * as an environment variable.
     */
    const agentConfig = {
      logs: {
        logs_collected: {
          files: {
            collect_list: collectList,
          },
        },
      },
    };

    /**
     * Add the CloudWatch agent configuration to the container as an environment variable.
     * Because this probably contains tokens, we are supposed to use `Stack.toJsonString()`
     * instead of `JSON.stringify()`. However, in my testing, it seems to produce the same
     * result. But better safe than sorry.
     */
    this.taskDefinition.findContainer('cloudwatch-agent')!.addEnvironment('CW_CONFIG_CONTENT', this.stack.toJsonString(agentConfig));

    /**
     * The role for the Lambda function that restarts the agent service.
     * Using an inline policy for lambdas breaks the integration test snapshot comparison,
     * so we create a separate role instead.
     *
     * It just needs permission to update the ECS service.
     */
    const restartFunctionRole = new iam.Role(this, 'RestartServiceFunctionRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
      ],
      inlinePolicies: {
        RestartServicePolicy: new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: ['ecs:UpdateService'],
              resources: [this.serviceArn],
            }),
          ],
        }),
      },
    });

    /**
     * This function is used to restart the agent service.
     * It is triggered by a CloudWatch event rule that runs daily at 00:00 UTC.
     * This is to ensure that a new log stream is created every day.
     * The log stream is named for the date, so it is easy to find and doesn't get too large.
     */
    this.restartFunction = new lambda.Function(this, 'RestartServiceFunction', {
      runtime: lambda.Runtime.PYTHON_3_13,
      handler: 'index.handler',
      role: restartFunctionRole,
      logGroup: props.restartFunctionLogGroup || new logs.LogGroup(this, 'RestartServiceFunctionLogGroup', {
        logGroupName: `/aws/lambda/${this.cluster.clusterName}/${name}/restart-service`,
        retention: logs.RetentionDays.TWO_YEARS,
        removalPolicy: RemovalPolicy.RETAIN_ON_UPDATE_OR_DELETE,
      }),
      code: lambda.Code.fromInline(`
import boto3
def handler(event, context):
    ecs = boto3.client('ecs')
    response = ecs.update_service(
        cluster='${props.cluster.clusterName}',
        service='${this.serviceName}',
        forceNewDeployment=True
    )
    return {'status': 200}
    `),
    });

    /**
     * This schedule rule triggers the Lambda function to restart the agent service.
     * It is set to run daily at 00:00 UTC.
     */
    this.restartScheduleRule = new events.Rule(this, 'RestartServiceRule', {
      schedule: events.Schedule.expression('cron(0 0 * * ? *)'),
    });

    /**
     * Attach the Lambda function to the schedule rule as a target.
     */
    this.restartScheduleRule.addTarget(new eventsTargets.LambdaFunction(this.restartFunction));
  };
};
