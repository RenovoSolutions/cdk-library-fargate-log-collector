# API Reference <a name="API Reference" id="api-reference"></a>

## Constructs <a name="Constructs" id="Constructs"></a>

### FargateLogCollectorService <a name="FargateLogCollectorService" id="@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService"></a>

A Fargate service that collects logs from a list of specified files on an EFS access point and sends them to CloudWatch.

There is a single container in the task definition that runs the CloudWatch agent.

There is a Lambda function included that restarts the agent service daily at 00:00 UTC.
This is to ensure that a new log stream is created every day for each log, named for the date,
with format `YYYY-MM-DD`. This is to make it easy to find the right log stream and
prevent the log streams from getting too large.

There are two defaults changed from the parent class:

- Deployment circuit breaker is enabled, with rollback, by default.
- minimum healthy percent is set to 0 by default, so we don't get a warning for having one task.

#### Initializers <a name="Initializers" id="@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.Initializer"></a>

```typescript
import { FargateLogCollectorService } from '@renovosolutions/cdk-library-fargate-log-collector'

new FargateLogCollectorService(scope: Construct, id: string, props: FargateLogCollectorServiceProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | The scope in which to create this Construct. |
| <code><a href="#@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.Initializer.parameter.id">id</a></code> | <code>string</code> | The Construct ID of the service. |
| <code><a href="#@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.Initializer.parameter.props">props</a></code> | <code><a href="#@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorServiceProps">FargateLogCollectorServiceProps</a></code> | The properties for the service, as defined in the `FargateLogCollectorServiceProps` interface. |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

The scope in which to create this Construct.

Normally this is a stack.

---

##### `id`<sup>Required</sup> <a name="id" id="@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.Initializer.parameter.id"></a>

- *Type:* string

The Construct ID of the service.

---

##### `props`<sup>Required</sup> <a name="props" id="@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.Initializer.parameter.props"></a>

- *Type:* <a href="#@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorServiceProps">FargateLogCollectorServiceProps</a>

The properties for the service, as defined in the `FargateLogCollectorServiceProps` interface.

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.applyRemovalPolicy">applyRemovalPolicy</a></code> | Apply the given removal policy to this resource. |
| <code><a href="#@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.addVolume">addVolume</a></code> | Adds a volume to the Service. |
| <code><a href="#@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.associateCloudMapService">associateCloudMapService</a></code> | Associates this service with a CloudMap service. |
| <code><a href="#@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.attachToApplicationTargetGroup">attachToApplicationTargetGroup</a></code> | This method is called to attach this service to an Application Load Balancer. |
| <code><a href="#@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.attachToClassicLB">attachToClassicLB</a></code> | Registers the service as a target of a Classic Load Balancer (CLB). |
| <code><a href="#@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.attachToNetworkTargetGroup">attachToNetworkTargetGroup</a></code> | This method is called to attach this service to a Network Load Balancer. |
| <code><a href="#@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.autoScaleTaskCount">autoScaleTaskCount</a></code> | An attribute representing the minimum and maximum task count for an AutoScalingGroup. |
| <code><a href="#@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.enableCloudMap">enableCloudMap</a></code> | Enable CloudMap service discovery for the service. |
| <code><a href="#@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.enableDeploymentAlarms">enableDeploymentAlarms</a></code> | Enable Deployment Alarms which take advantage of arbitrary alarms and configure them after service initialization. |
| <code><a href="#@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.enableServiceConnect">enableServiceConnect</a></code> | Enable Service Connect on this service. |
| <code><a href="#@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.loadBalancerTarget">loadBalancerTarget</a></code> | Return a load balancing target for a specific container and port. |
| <code><a href="#@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.metric">metric</a></code> | This method returns the specified CloudWatch metric name for this service. |
| <code><a href="#@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.metricCpuUtilization">metricCpuUtilization</a></code> | This method returns the CloudWatch metric for this service's CPU utilization. |
| <code><a href="#@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.metricMemoryUtilization">metricMemoryUtilization</a></code> | This method returns the CloudWatch metric for this service's memory utilization. |
| <code><a href="#@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.registerLoadBalancerTargets">registerLoadBalancerTargets</a></code> | Use this function to create all load balancer targets to be registered in this service, add them to target groups, and attach target groups to listeners accordingly. |

---

##### `toString` <a name="toString" id="@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `applyRemovalPolicy` <a name="applyRemovalPolicy" id="@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.applyRemovalPolicy"></a>

```typescript
public applyRemovalPolicy(policy: RemovalPolicy): void
```

Apply the given removal policy to this resource.

The Removal Policy controls what happens to this resource when it stops
being managed by CloudFormation, either because you've removed it from the
CDK application or because you've made a change that requires the resource
to be replaced.

The resource can be deleted (`RemovalPolicy.DESTROY`), or left in your AWS
account for data recovery and cleanup later (`RemovalPolicy.RETAIN`).

###### `policy`<sup>Required</sup> <a name="policy" id="@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.applyRemovalPolicy.parameter.policy"></a>

- *Type:* aws-cdk-lib.RemovalPolicy

---

##### `addVolume` <a name="addVolume" id="@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.addVolume"></a>

```typescript
public addVolume(volume: ServiceManagedVolume): void
```

Adds a volume to the Service.

###### `volume`<sup>Required</sup> <a name="volume" id="@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.addVolume.parameter.volume"></a>

- *Type:* aws-cdk-lib.aws_ecs.ServiceManagedVolume

---

##### `associateCloudMapService` <a name="associateCloudMapService" id="@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.associateCloudMapService"></a>

```typescript
public associateCloudMapService(options: AssociateCloudMapServiceOptions): void
```

Associates this service with a CloudMap service.

###### `options`<sup>Required</sup> <a name="options" id="@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.associateCloudMapService.parameter.options"></a>

- *Type:* aws-cdk-lib.aws_ecs.AssociateCloudMapServiceOptions

---

##### `attachToApplicationTargetGroup` <a name="attachToApplicationTargetGroup" id="@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.attachToApplicationTargetGroup"></a>

```typescript
public attachToApplicationTargetGroup(targetGroup: IApplicationTargetGroup): LoadBalancerTargetProps
```

This method is called to attach this service to an Application Load Balancer.

Don't call this function directly. Instead, call `listener.addTargets()`
to add this service to a load balancer.

###### `targetGroup`<sup>Required</sup> <a name="targetGroup" id="@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.attachToApplicationTargetGroup.parameter.targetGroup"></a>

- *Type:* aws-cdk-lib.aws_elasticloadbalancingv2.IApplicationTargetGroup

---

##### `attachToClassicLB` <a name="attachToClassicLB" id="@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.attachToClassicLB"></a>

```typescript
public attachToClassicLB(loadBalancer: LoadBalancer): void
```

Registers the service as a target of a Classic Load Balancer (CLB).

Don't call this. Call `loadBalancer.addTarget()` instead.

###### `loadBalancer`<sup>Required</sup> <a name="loadBalancer" id="@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.attachToClassicLB.parameter.loadBalancer"></a>

- *Type:* aws-cdk-lib.aws_elasticloadbalancing.LoadBalancer

---

##### `attachToNetworkTargetGroup` <a name="attachToNetworkTargetGroup" id="@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.attachToNetworkTargetGroup"></a>

```typescript
public attachToNetworkTargetGroup(targetGroup: INetworkTargetGroup): LoadBalancerTargetProps
```

This method is called to attach this service to a Network Load Balancer.

Don't call this function directly. Instead, call `listener.addTargets()`
to add this service to a load balancer.

###### `targetGroup`<sup>Required</sup> <a name="targetGroup" id="@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.attachToNetworkTargetGroup.parameter.targetGroup"></a>

- *Type:* aws-cdk-lib.aws_elasticloadbalancingv2.INetworkTargetGroup

---

##### `autoScaleTaskCount` <a name="autoScaleTaskCount" id="@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.autoScaleTaskCount"></a>

```typescript
public autoScaleTaskCount(props: EnableScalingProps): ScalableTaskCount
```

An attribute representing the minimum and maximum task count for an AutoScalingGroup.

###### `props`<sup>Required</sup> <a name="props" id="@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.autoScaleTaskCount.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_applicationautoscaling.EnableScalingProps

---

##### `enableCloudMap` <a name="enableCloudMap" id="@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.enableCloudMap"></a>

```typescript
public enableCloudMap(options: CloudMapOptions): Service
```

Enable CloudMap service discovery for the service.

###### `options`<sup>Required</sup> <a name="options" id="@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.enableCloudMap.parameter.options"></a>

- *Type:* aws-cdk-lib.aws_ecs.CloudMapOptions

---

##### `enableDeploymentAlarms` <a name="enableDeploymentAlarms" id="@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.enableDeploymentAlarms"></a>

```typescript
public enableDeploymentAlarms(alarmNames: string[], options?: DeploymentAlarmOptions): void
```

Enable Deployment Alarms which take advantage of arbitrary alarms and configure them after service initialization.

If you have already enabled deployment alarms, this function can be used to tell ECS about additional alarms that
should interrupt a deployment.

New alarms specified in subsequent calls of this function will be appended to the existing list of alarms.

The same Alarm Behavior must be used on all deployment alarms. If you specify different AlarmBehavior values in
multiple calls to this function, or the Alarm Behavior used here doesn't match the one used in the service
constructor, an error will be thrown.

If the alarm's metric references the service, you cannot pass `Alarm.alarmName` here. That will cause a circular
dependency between the service and its deployment alarm. See this package's README for options to alarm on service
metrics, and avoid this circular dependency.

###### `alarmNames`<sup>Required</sup> <a name="alarmNames" id="@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.enableDeploymentAlarms.parameter.alarmNames"></a>

- *Type:* string[]

---

###### `options`<sup>Optional</sup> <a name="options" id="@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.enableDeploymentAlarms.parameter.options"></a>

- *Type:* aws-cdk-lib.aws_ecs.DeploymentAlarmOptions

---

##### `enableServiceConnect` <a name="enableServiceConnect" id="@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.enableServiceConnect"></a>

```typescript
public enableServiceConnect(config?: ServiceConnectProps): void
```

Enable Service Connect on this service.

###### `config`<sup>Optional</sup> <a name="config" id="@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.enableServiceConnect.parameter.config"></a>

- *Type:* aws-cdk-lib.aws_ecs.ServiceConnectProps

---

##### `loadBalancerTarget` <a name="loadBalancerTarget" id="@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.loadBalancerTarget"></a>

```typescript
public loadBalancerTarget(options: LoadBalancerTargetOptions): IEcsLoadBalancerTarget
```

Return a load balancing target for a specific container and port.

Use this function to create a load balancer target if you want to load balance to
another container than the first essential container or the first mapped port on
the container.

Use the return value of this function where you would normally use a load balancer
target, instead of the `Service` object itself.

*Example*

```typescript
declare const listener: elbv2.ApplicationListener;
declare const service: ecs.BaseService;
listener.addTargets('ECS', {
  port: 80,
  targets: [service.loadBalancerTarget({
    containerName: 'MyContainer',
    containerPort: 1234,
  })],
});
```


###### `options`<sup>Required</sup> <a name="options" id="@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.loadBalancerTarget.parameter.options"></a>

- *Type:* aws-cdk-lib.aws_ecs.LoadBalancerTargetOptions

---

##### `metric` <a name="metric" id="@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.metric"></a>

```typescript
public metric(metricName: string, props?: MetricOptions): Metric
```

This method returns the specified CloudWatch metric name for this service.

###### `metricName`<sup>Required</sup> <a name="metricName" id="@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.metric.parameter.metricName"></a>

- *Type:* string

---

###### `props`<sup>Optional</sup> <a name="props" id="@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.metric.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricCpuUtilization` <a name="metricCpuUtilization" id="@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.metricCpuUtilization"></a>

```typescript
public metricCpuUtilization(props?: MetricOptions): Metric
```

This method returns the CloudWatch metric for this service's CPU utilization.

###### `props`<sup>Optional</sup> <a name="props" id="@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.metricCpuUtilization.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `metricMemoryUtilization` <a name="metricMemoryUtilization" id="@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.metricMemoryUtilization"></a>

```typescript
public metricMemoryUtilization(props?: MetricOptions): Metric
```

This method returns the CloudWatch metric for this service's memory utilization.

###### `props`<sup>Optional</sup> <a name="props" id="@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.metricMemoryUtilization.parameter.props"></a>

- *Type:* aws-cdk-lib.aws_cloudwatch.MetricOptions

---

##### `registerLoadBalancerTargets` <a name="registerLoadBalancerTargets" id="@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.registerLoadBalancerTargets"></a>

```typescript
public registerLoadBalancerTargets(targets: ...EcsTarget[]): void
```

Use this function to create all load balancer targets to be registered in this service, add them to target groups, and attach target groups to listeners accordingly.

Alternatively, you can use `listener.addTargets()` to create targets and add them to target groups.

*Example*

```typescript
declare const listener: elbv2.ApplicationListener;
declare const service: ecs.BaseService;
service.registerLoadBalancerTargets(
  {
    containerName: 'web',
    containerPort: 80,
    newTargetGroupId: 'ECS',
    listener: ecs.ListenerConfig.applicationListener(listener, {
      protocol: elbv2.ApplicationProtocol.HTTPS
    }),
  },
)
```


###### `targets`<sup>Required</sup> <a name="targets" id="@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.registerLoadBalancerTargets.parameter.targets"></a>

- *Type:* ...aws-cdk-lib.aws_ecs.EcsTarget[]

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |
| <code><a href="#@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.isOwnedResource">isOwnedResource</a></code> | Returns true if the construct was created by CDK, and false otherwise. |
| <code><a href="#@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.isResource">isResource</a></code> | Check whether the given construct is a Resource. |
| <code><a href="#@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.fromServiceArnWithCluster">fromServiceArnWithCluster</a></code> | Import an existing ECS/Fargate Service using the service cluster format. |
| <code><a href="#@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.fromFargateServiceArn">fromFargateServiceArn</a></code> | Imports from the specified service ARN. |
| <code><a href="#@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.fromFargateServiceAttributes">fromFargateServiceAttributes</a></code> | Imports from the specified service attributes. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.isConstruct"></a>

```typescript
import { FargateLogCollectorService } from '@renovosolutions/cdk-library-fargate-log-collector'

FargateLogCollectorService.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

##### `isOwnedResource` <a name="isOwnedResource" id="@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.isOwnedResource"></a>

```typescript
import { FargateLogCollectorService } from '@renovosolutions/cdk-library-fargate-log-collector'

FargateLogCollectorService.isOwnedResource(construct: IConstruct)
```

Returns true if the construct was created by CDK, and false otherwise.

###### `construct`<sup>Required</sup> <a name="construct" id="@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.isOwnedResource.parameter.construct"></a>

- *Type:* constructs.IConstruct

---

##### `isResource` <a name="isResource" id="@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.isResource"></a>

```typescript
import { FargateLogCollectorService } from '@renovosolutions/cdk-library-fargate-log-collector'

FargateLogCollectorService.isResource(construct: IConstruct)
```

Check whether the given construct is a Resource.

###### `construct`<sup>Required</sup> <a name="construct" id="@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.isResource.parameter.construct"></a>

- *Type:* constructs.IConstruct

---

##### `fromServiceArnWithCluster` <a name="fromServiceArnWithCluster" id="@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.fromServiceArnWithCluster"></a>

```typescript
import { FargateLogCollectorService } from '@renovosolutions/cdk-library-fargate-log-collector'

FargateLogCollectorService.fromServiceArnWithCluster(scope: Construct, id: string, serviceArn: string)
```

Import an existing ECS/Fargate Service using the service cluster format.

The format is the "new" format "arn:aws:ecs:region:aws_account_id:service/cluster-name/service-name".

> [https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-account-settings.html#ecs-resource-ids](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-account-settings.html#ecs-resource-ids)

###### `scope`<sup>Required</sup> <a name="scope" id="@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.fromServiceArnWithCluster.parameter.scope"></a>

- *Type:* constructs.Construct

---

###### `id`<sup>Required</sup> <a name="id" id="@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.fromServiceArnWithCluster.parameter.id"></a>

- *Type:* string

---

###### `serviceArn`<sup>Required</sup> <a name="serviceArn" id="@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.fromServiceArnWithCluster.parameter.serviceArn"></a>

- *Type:* string

---

##### `fromFargateServiceArn` <a name="fromFargateServiceArn" id="@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.fromFargateServiceArn"></a>

```typescript
import { FargateLogCollectorService } from '@renovosolutions/cdk-library-fargate-log-collector'

FargateLogCollectorService.fromFargateServiceArn(scope: Construct, id: string, fargateServiceArn: string)
```

Imports from the specified service ARN.

###### `scope`<sup>Required</sup> <a name="scope" id="@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.fromFargateServiceArn.parameter.scope"></a>

- *Type:* constructs.Construct

---

###### `id`<sup>Required</sup> <a name="id" id="@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.fromFargateServiceArn.parameter.id"></a>

- *Type:* string

---

###### `fargateServiceArn`<sup>Required</sup> <a name="fargateServiceArn" id="@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.fromFargateServiceArn.parameter.fargateServiceArn"></a>

- *Type:* string

---

##### `fromFargateServiceAttributes` <a name="fromFargateServiceAttributes" id="@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.fromFargateServiceAttributes"></a>

```typescript
import { FargateLogCollectorService } from '@renovosolutions/cdk-library-fargate-log-collector'

FargateLogCollectorService.fromFargateServiceAttributes(scope: Construct, id: string, attrs: FargateServiceAttributes)
```

Imports from the specified service attributes.

###### `scope`<sup>Required</sup> <a name="scope" id="@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.fromFargateServiceAttributes.parameter.scope"></a>

- *Type:* constructs.Construct

---

###### `id`<sup>Required</sup> <a name="id" id="@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.fromFargateServiceAttributes.parameter.id"></a>

- *Type:* string

---

###### `attrs`<sup>Required</sup> <a name="attrs" id="@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.fromFargateServiceAttributes.parameter.attrs"></a>

- *Type:* aws-cdk-lib.aws_ecs.FargateServiceAttributes

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.property.env">env</a></code> | <code>aws-cdk-lib.ResourceEnvironment</code> | The environment this resource belongs to. |
| <code><a href="#@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.property.stack">stack</a></code> | <code>aws-cdk-lib.Stack</code> | The stack in which this resource is defined. |
| <code><a href="#@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.property.cluster">cluster</a></code> | <code>aws-cdk-lib.aws_ecs.ICluster</code> | The cluster that hosts the service. |
| <code><a href="#@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.property.connections">connections</a></code> | <code>aws-cdk-lib.aws_ec2.Connections</code> | The security groups which manage the allowed network traffic for the service. |
| <code><a href="#@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.property.serviceArn">serviceArn</a></code> | <code>string</code> | The Amazon Resource Name (ARN) of the service. |
| <code><a href="#@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.property.serviceName">serviceName</a></code> | <code>string</code> | The name of the service. |
| <code><a href="#@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.property.taskDefinition">taskDefinition</a></code> | <code>aws-cdk-lib.aws_ecs.TaskDefinition</code> | The task definition to use for tasks in the service. |
| <code><a href="#@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.property.cloudMapService">cloudMapService</a></code> | <code>aws-cdk-lib.aws_servicediscovery.IService</code> | The CloudMap service created for this service, if any. |
| <code><a href="#@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.property.agentCpu">agentCpu</a></code> | <code>number</code> | The amount of CPU units allocated to the agent. |
| <code><a href="#@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.property.agentMemory">agentMemory</a></code> | <code>number</code> | The amount of memory (in MB) allocated to the agent. |
| <code><a href="#@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.property.efsLogsAccessPoint">efsLogsAccessPoint</a></code> | <code>aws-cdk-lib.aws_efs.IAccessPoint</code> | The EFS access point where the logs are read from. |
| <code><a href="#@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.property.efsStateAccessPoint">efsStateAccessPoint</a></code> | <code>aws-cdk-lib.aws_efs.IAccessPoint</code> | The EFS access point where the agent state is stored. |
| <code><a href="#@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.property.logMappings">logMappings</a></code> | <code><a href="#@renovosolutions/cdk-library-fargate-log-collector.LogMapping">LogMapping</a>[]</code> | The list of log mappings, as processed from the input. |
| <code><a href="#@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.property.restartFunction">restartFunction</a></code> | <code>aws-cdk-lib.aws_lambda.Function</code> | The Lambda function that restarts the agent service. |
| <code><a href="#@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.property.restartScheduleRule">restartScheduleRule</a></code> | <code>aws-cdk-lib.aws_events.Rule</code> | The CloudWatch event rule that triggers the Lambda function to restart the agent service. |

---

##### `node`<sup>Required</sup> <a name="node" id="@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `env`<sup>Required</sup> <a name="env" id="@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.property.env"></a>

```typescript
public readonly env: ResourceEnvironment;
```

- *Type:* aws-cdk-lib.ResourceEnvironment

The environment this resource belongs to.

For resources that are created and managed by the CDK
(generally, those created by creating new class instances like Role, Bucket, etc.),
this is always the same as the environment of the stack they belong to;
however, for imported resources
(those obtained from static methods like fromRoleArn, fromBucketName, etc.),
that might be different than the stack they were imported into.

---

##### `stack`<sup>Required</sup> <a name="stack" id="@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.property.stack"></a>

```typescript
public readonly stack: Stack;
```

- *Type:* aws-cdk-lib.Stack

The stack in which this resource is defined.

---

##### `cluster`<sup>Required</sup> <a name="cluster" id="@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.property.cluster"></a>

```typescript
public readonly cluster: ICluster;
```

- *Type:* aws-cdk-lib.aws_ecs.ICluster

The cluster that hosts the service.

---

##### `connections`<sup>Required</sup> <a name="connections" id="@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.property.connections"></a>

```typescript
public readonly connections: Connections;
```

- *Type:* aws-cdk-lib.aws_ec2.Connections

The security groups which manage the allowed network traffic for the service.

---

##### `serviceArn`<sup>Required</sup> <a name="serviceArn" id="@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.property.serviceArn"></a>

```typescript
public readonly serviceArn: string;
```

- *Type:* string

The Amazon Resource Name (ARN) of the service.

---

##### `serviceName`<sup>Required</sup> <a name="serviceName" id="@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.property.serviceName"></a>

```typescript
public readonly serviceName: string;
```

- *Type:* string

The name of the service.

---

##### `taskDefinition`<sup>Required</sup> <a name="taskDefinition" id="@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.property.taskDefinition"></a>

```typescript
public readonly taskDefinition: TaskDefinition;
```

- *Type:* aws-cdk-lib.aws_ecs.TaskDefinition

The task definition to use for tasks in the service.

---

##### `cloudMapService`<sup>Optional</sup> <a name="cloudMapService" id="@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.property.cloudMapService"></a>

```typescript
public readonly cloudMapService: IService;
```

- *Type:* aws-cdk-lib.aws_servicediscovery.IService

The CloudMap service created for this service, if any.

---

##### `agentCpu`<sup>Required</sup> <a name="agentCpu" id="@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.property.agentCpu"></a>

```typescript
public readonly agentCpu: number;
```

- *Type:* number

The amount of CPU units allocated to the agent.

1024 CPU units = 1 vCPU.
This was passed to the Fargate task definition.

---

##### `agentMemory`<sup>Required</sup> <a name="agentMemory" id="@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.property.agentMemory"></a>

```typescript
public readonly agentMemory: number;
```

- *Type:* number

The amount of memory (in MB) allocated to the agent.

This was passed to the Fargate task definition.

---

##### `efsLogsAccessPoint`<sup>Required</sup> <a name="efsLogsAccessPoint" id="@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.property.efsLogsAccessPoint"></a>

```typescript
public readonly efsLogsAccessPoint: IAccessPoint;
```

- *Type:* aws-cdk-lib.aws_efs.IAccessPoint

The EFS access point where the logs are read from.

---

##### `efsStateAccessPoint`<sup>Required</sup> <a name="efsStateAccessPoint" id="@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.property.efsStateAccessPoint"></a>

```typescript
public readonly efsStateAccessPoint: IAccessPoint;
```

- *Type:* aws-cdk-lib.aws_efs.IAccessPoint

The EFS access point where the agent state is stored.

This allows the agent to be restarted without losing its place in the logs.
Otherwise, the agent would forward the whole logs each time it is restarted.

---

##### `logMappings`<sup>Required</sup> <a name="logMappings" id="@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.property.logMappings"></a>

```typescript
public readonly logMappings: LogMapping[];
```

- *Type:* <a href="#@renovosolutions/cdk-library-fargate-log-collector.LogMapping">LogMapping</a>[]

The list of log mappings, as processed from the input.

This can be used to see how the input log mappings were understood.
It is not the same as the log mappings passed in to the constructor.

---

##### `restartFunction`<sup>Required</sup> <a name="restartFunction" id="@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.property.restartFunction"></a>

```typescript
public readonly restartFunction: Function;
```

- *Type:* aws-cdk-lib.aws_lambda.Function

The Lambda function that restarts the agent service.

---

##### `restartScheduleRule`<sup>Required</sup> <a name="restartScheduleRule" id="@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.property.restartScheduleRule"></a>

```typescript
public readonly restartScheduleRule: Rule;
```

- *Type:* aws-cdk-lib.aws_events.Rule

The CloudWatch event rule that triggers the Lambda function to restart the agent service.

It is set to run daily at 00:00 UTC. The purpose of this is to ensure that a new log stream
is created every day, named for the date.

---

#### Constants <a name="Constants" id="Constants"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.property.PROPERTY_INJECTION_ID">PROPERTY_INJECTION_ID</a></code> | <code>string</code> | Uniquely identifies this class. |

---

##### `PROPERTY_INJECTION_ID`<sup>Required</sup> <a name="PROPERTY_INJECTION_ID" id="@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorService.property.PROPERTY_INJECTION_ID"></a>

```typescript
public readonly PROPERTY_INJECTION_ID: string;
```

- *Type:* string

Uniquely identifies this class.

---

## Structs <a name="Structs" id="Structs"></a>

### FargateLogCollectorServiceProps <a name="FargateLogCollectorServiceProps" id="@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorServiceProps"></a>

Constructor properties for the FargateLogCollectorService.

This uses the private NarrowedFargateServiceProps interface in this project as a base.

#### Initializer <a name="Initializer" id="@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorServiceProps.Initializer"></a>

```typescript
import { FargateLogCollectorServiceProps } from '@renovosolutions/cdk-library-fargate-log-collector'

const fargateLogCollectorServiceProps: FargateLogCollectorServiceProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorServiceProps.property.cluster">cluster</a></code> | <code>aws-cdk-lib.aws_ecs.ICluster</code> | The name of the cluster that hosts the service. |
| <code><a href="#@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorServiceProps.property.efsLogsAccessPoint">efsLogsAccessPoint</a></code> | <code>aws-cdk-lib.aws_efs.IAccessPoint</code> | The EFS access point where the logs are read from. |
| <code><a href="#@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorServiceProps.property.efsStateAccessPoint">efsStateAccessPoint</a></code> | <code>aws-cdk-lib.aws_efs.IAccessPoint</code> | The EFS access point where the agent state is stored. |
| <code><a href="#@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorServiceProps.property.logMappings">logMappings</a></code> | <code><a href="#@renovosolutions/cdk-library-fargate-log-collector.LogMapping">LogMapping</a>[]</code> | A list of log mappings. |
| <code><a href="#@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorServiceProps.property.agentCpu">agentCpu</a></code> | <code>number</code> | The amount of CPU units to allocate to the agent. |
| <code><a href="#@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorServiceProps.property.agentMemory">agentMemory</a></code> | <code>number</code> | The amount of memory (in MB) to allocate to the agent. |
| <code><a href="#@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorServiceProps.property.assignPublicIp">assignPublicIp</a></code> | <code>boolean</code> | Specifies whether the task's elastic network interface receives a public IP address. |
| <code><a href="#@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorServiceProps.property.availabilityZoneRebalancing">availabilityZoneRebalancing</a></code> | <code>aws-cdk-lib.aws_ecs.AvailabilityZoneRebalancing</code> | Whether to use Availability Zone rebalancing for the service. |
| <code><a href="#@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorServiceProps.property.capacityProviderStrategies">capacityProviderStrategies</a></code> | <code>aws-cdk-lib.aws_ecs.CapacityProviderStrategy[]</code> | A list of Capacity Provider strategies used to place a service. |
| <code><a href="#@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorServiceProps.property.circuitBreaker">circuitBreaker</a></code> | <code>aws-cdk-lib.aws_ecs.DeploymentCircuitBreaker</code> | Whether to enable the deployment circuit breaker. |
| <code><a href="#@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorServiceProps.property.cloudMapOptions">cloudMapOptions</a></code> | <code>aws-cdk-lib.aws_ecs.CloudMapOptions</code> | The options for configuring an Amazon ECS service to use service discovery. |
| <code><a href="#@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorServiceProps.property.containerLogging">containerLogging</a></code> | <code>aws-cdk-lib.aws_ecs.LogDriver</code> | The logging configuration for the container. |
| <code><a href="#@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorServiceProps.property.deploymentAlarms">deploymentAlarms</a></code> | <code>aws-cdk-lib.aws_ecs.DeploymentAlarmConfig</code> | The alarm(s) to monitor during deployment, and behavior to apply if at least one enters a state of alarm during the deployment or bake time. |
| <code><a href="#@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorServiceProps.property.deploymentController">deploymentController</a></code> | <code>aws-cdk-lib.aws_ecs.DeploymentController</code> | Specifies which deployment controller to use for the service. |
| <code><a href="#@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorServiceProps.property.enableECSManagedTags">enableECSManagedTags</a></code> | <code>boolean</code> | Specifies whether to enable Amazon ECS managed tags for the tasks within the service. |
| <code><a href="#@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorServiceProps.property.enableExecuteCommand">enableExecuteCommand</a></code> | <code>boolean</code> | Whether to enable the ability to execute into a container. |
| <code><a href="#@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorServiceProps.property.healthCheckGracePeriod">healthCheckGracePeriod</a></code> | <code>aws-cdk-lib.Duration</code> | The period of time, in seconds, that the Amazon ECS service scheduler ignores unhealthy Elastic Load Balancing target health checks after a task has first started. |
| <code><a href="#@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorServiceProps.property.maxHealthyPercent">maxHealthyPercent</a></code> | <code>number</code> | The maximum number of tasks, specified as a percentage of the Amazon ECS service's DesiredCount value, that can run in a service during a deployment. |
| <code><a href="#@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorServiceProps.property.minHealthyPercent">minHealthyPercent</a></code> | <code>number</code> | The minimum number of tasks, specified as a percentage of the Amazon ECS service's DesiredCount value, that must continue to run and remain healthy during a deployment. |
| <code><a href="#@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorServiceProps.property.platformVersion">platformVersion</a></code> | <code>aws-cdk-lib.aws_ecs.FargatePlatformVersion</code> | The platform version on which to run your service. |
| <code><a href="#@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorServiceProps.property.propagateTags">propagateTags</a></code> | <code>aws-cdk-lib.aws_ecs.PropagatedTagSource</code> | Specifies whether to propagate the tags from the task definition or the service to the tasks in the service. |
| <code><a href="#@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorServiceProps.property.restartFunctionLogGroup">restartFunctionLogGroup</a></code> | <code>aws-cdk-lib.aws_logs.ILogGroup</code> | The log Group to use for the restart function. |
| <code><a href="#@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorServiceProps.property.securityGroups">securityGroups</a></code> | <code>aws-cdk-lib.aws_ec2.ISecurityGroup[]</code> | The security groups to associate with the service. |
| <code><a href="#@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorServiceProps.property.serviceConnectConfiguration">serviceConnectConfiguration</a></code> | <code>aws-cdk-lib.aws_ecs.ServiceConnectProps</code> | Configuration for Service Connect. |
| <code><a href="#@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorServiceProps.property.serviceName">serviceName</a></code> | <code>string</code> | The name of the service. |
| <code><a href="#@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorServiceProps.property.taskDefinitionRevision">taskDefinitionRevision</a></code> | <code>aws-cdk-lib.aws_ecs.TaskDefinitionRevision</code> | Revision number for the task definition or `latest` to use the latest active task revision. |
| <code><a href="#@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorServiceProps.property.volumeConfigurations">volumeConfigurations</a></code> | <code>aws-cdk-lib.aws_ecs.ServiceManagedVolume[]</code> | Configuration details for a volume used by the service. |
| <code><a href="#@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorServiceProps.property.vpcSubnets">vpcSubnets</a></code> | <code>aws-cdk-lib.aws_ec2.SubnetSelection</code> | The subnets to associate with the service. |

---

##### `cluster`<sup>Required</sup> <a name="cluster" id="@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorServiceProps.property.cluster"></a>

```typescript
public readonly cluster: ICluster;
```

- *Type:* aws-cdk-lib.aws_ecs.ICluster

The name of the cluster that hosts the service.

---

##### `efsLogsAccessPoint`<sup>Required</sup> <a name="efsLogsAccessPoint" id="@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorServiceProps.property.efsLogsAccessPoint"></a>

```typescript
public readonly efsLogsAccessPoint: IAccessPoint;
```

- *Type:* aws-cdk-lib.aws_efs.IAccessPoint

The EFS access point where the logs are read from.

---

##### `efsStateAccessPoint`<sup>Required</sup> <a name="efsStateAccessPoint" id="@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorServiceProps.property.efsStateAccessPoint"></a>

```typescript
public readonly efsStateAccessPoint: IAccessPoint;
```

- *Type:* aws-cdk-lib.aws_efs.IAccessPoint

The EFS access point where the agent state is stored.

This allows the agent to be restarted without losing its place in the logs.
Otherwise, the agent would forward every log file from the start
each time it is restarted.

May be on a different EFS file system than `efsLogsAccessPoint` if desired.

---

##### `logMappings`<sup>Required</sup> <a name="logMappings" id="@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorServiceProps.property.logMappings"></a>

```typescript
public readonly logMappings: LogMapping[];
```

- *Type:* <a href="#@renovosolutions/cdk-library-fargate-log-collector.LogMapping">LogMapping</a>[]

A list of log mappings.

This is used to create the CloudWatch agent configuration.
It is also used to create log groups if that is requested.
At least one log mapping must be provided.

---

##### `agentCpu`<sup>Optional</sup> <a name="agentCpu" id="@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorServiceProps.property.agentCpu"></a>

```typescript
public readonly agentCpu: number;
```

- *Type:* number
- *Default:* 256

The amount of CPU units to allocate to the agent.

1024 CPU units = 1 vCPU.
This is passed to the Fargate task definition.
You might need to increase this if you have a lot of logs to process.
Only some combinations of memory and CPU are valid.

> [https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ecs.TaskDefinition.html#memorymib](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ecs.TaskDefinition.html#memorymib)

---

##### `agentMemory`<sup>Optional</sup> <a name="agentMemory" id="@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorServiceProps.property.agentMemory"></a>

```typescript
public readonly agentMemory: number;
```

- *Type:* number
- *Default:* 512

The amount of memory (in MB) to allocate to the agent.

This is passed to the Fargate task definition.
You might need to increase this if you have a lot of logs to process.
Only some combinations of memory and CPU are valid.

> [https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ecs.TaskDefinition.html#cpu](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ecs.TaskDefinition.html#cpu)

---

##### `assignPublicIp`<sup>Optional</sup> <a name="assignPublicIp" id="@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorServiceProps.property.assignPublicIp"></a>

```typescript
public readonly assignPublicIp: boolean;
```

- *Type:* boolean
- *Default:* false

Specifies whether the task's elastic network interface receives a public IP address.

If true, each task will receive a public IP address.

---

##### `availabilityZoneRebalancing`<sup>Optional</sup> <a name="availabilityZoneRebalancing" id="@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorServiceProps.property.availabilityZoneRebalancing"></a>

```typescript
public readonly availabilityZoneRebalancing: AvailabilityZoneRebalancing;
```

- *Type:* aws-cdk-lib.aws_ecs.AvailabilityZoneRebalancing
- *Default:* AvailabilityZoneRebalancing.DISABLED

Whether to use Availability Zone rebalancing for the service.

If enabled, `maxHealthyPercent` must be greater than 100, and the service must not be a target
of a Classic Load Balancer.

---

##### `capacityProviderStrategies`<sup>Optional</sup> <a name="capacityProviderStrategies" id="@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorServiceProps.property.capacityProviderStrategies"></a>

```typescript
public readonly capacityProviderStrategies: CapacityProviderStrategy[];
```

- *Type:* aws-cdk-lib.aws_ecs.CapacityProviderStrategy[]
- *Default:* undefined

A list of Capacity Provider strategies used to place a service.

---

##### `circuitBreaker`<sup>Optional</sup> <a name="circuitBreaker" id="@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorServiceProps.property.circuitBreaker"></a>

```typescript
public readonly circuitBreaker: DeploymentCircuitBreaker;
```

- *Type:* aws-cdk-lib.aws_ecs.DeploymentCircuitBreaker
- *Default:* disabled

Whether to enable the deployment circuit breaker.

If this property is defined, circuit breaker will be implicitly
enabled.

---

##### `cloudMapOptions`<sup>Optional</sup> <a name="cloudMapOptions" id="@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorServiceProps.property.cloudMapOptions"></a>

```typescript
public readonly cloudMapOptions: CloudMapOptions;
```

- *Type:* aws-cdk-lib.aws_ecs.CloudMapOptions
- *Default:* AWS Cloud Map service discovery is not enabled.

The options for configuring an Amazon ECS service to use service discovery.

---

##### `containerLogging`<sup>Optional</sup> <a name="containerLogging" id="@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorServiceProps.property.containerLogging"></a>

```typescript
public readonly containerLogging: LogDriver;
```

- *Type:* aws-cdk-lib.aws_ecs.LogDriver
- *Default:* ecs.LogDrivers.awsLogs({   logGroup: new logs.LogGroup(scope, 'ContainerLogGroup', {     logGroupName: `/${props.cluster.clusterName}/${props.serviceName || 'log-collector'}/ecs/tasks`,     retention: logs.RetentionDays.TWO_YEARS,     removalPolicy: RemovalPolicy.RETAIN_ON_UPDATE_OR_DELETE,   }),   streamPrefix: 'log-collector-task-logs',   mode: ecs.AwsLogDriverMode.NON_BLOCKING,  }),

The logging configuration for the container.

---

##### `deploymentAlarms`<sup>Optional</sup> <a name="deploymentAlarms" id="@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorServiceProps.property.deploymentAlarms"></a>

```typescript
public readonly deploymentAlarms: DeploymentAlarmConfig;
```

- *Type:* aws-cdk-lib.aws_ecs.DeploymentAlarmConfig
- *Default:* No alarms will be monitored during deployment.

The alarm(s) to monitor during deployment, and behavior to apply if at least one enters a state of alarm during the deployment or bake time.

---

##### `deploymentController`<sup>Optional</sup> <a name="deploymentController" id="@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorServiceProps.property.deploymentController"></a>

```typescript
public readonly deploymentController: DeploymentController;
```

- *Type:* aws-cdk-lib.aws_ecs.DeploymentController
- *Default:* Rolling update (ECS)

Specifies which deployment controller to use for the service.

For more information, see
[Amazon ECS Deployment Types](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/deployment-types.html)

---

##### `enableECSManagedTags`<sup>Optional</sup> <a name="enableECSManagedTags" id="@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorServiceProps.property.enableECSManagedTags"></a>

```typescript
public readonly enableECSManagedTags: boolean;
```

- *Type:* boolean
- *Default:* false

Specifies whether to enable Amazon ECS managed tags for the tasks within the service.

For more information, see
[Tagging Your Amazon ECS Resources](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-using-tags.html)

---

##### `enableExecuteCommand`<sup>Optional</sup> <a name="enableExecuteCommand" id="@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorServiceProps.property.enableExecuteCommand"></a>

```typescript
public readonly enableExecuteCommand: boolean;
```

- *Type:* boolean
- *Default:* undefined

Whether to enable the ability to execute into a container.

---

##### `healthCheckGracePeriod`<sup>Optional</sup> <a name="healthCheckGracePeriod" id="@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorServiceProps.property.healthCheckGracePeriod"></a>

```typescript
public readonly healthCheckGracePeriod: Duration;
```

- *Type:* aws-cdk-lib.Duration
- *Default:* defaults to 60 seconds if at least one load balancer is in-use and it is not already set

The period of time, in seconds, that the Amazon ECS service scheduler ignores unhealthy Elastic Load Balancing target health checks after a task has first started.

---

##### `maxHealthyPercent`<sup>Optional</sup> <a name="maxHealthyPercent" id="@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorServiceProps.property.maxHealthyPercent"></a>

```typescript
public readonly maxHealthyPercent: number;
```

- *Type:* number
- *Default:* 100 if daemon, otherwise 200

The maximum number of tasks, specified as a percentage of the Amazon ECS service's DesiredCount value, that can run in a service during a deployment.

---

##### `minHealthyPercent`<sup>Optional</sup> <a name="minHealthyPercent" id="@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorServiceProps.property.minHealthyPercent"></a>

```typescript
public readonly minHealthyPercent: number;
```

- *Type:* number
- *Default:* 0 if daemon, otherwise 50

The minimum number of tasks, specified as a percentage of the Amazon ECS service's DesiredCount value, that must continue to run and remain healthy during a deployment.

---

##### `platformVersion`<sup>Optional</sup> <a name="platformVersion" id="@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorServiceProps.property.platformVersion"></a>

```typescript
public readonly platformVersion: FargatePlatformVersion;
```

- *Type:* aws-cdk-lib.aws_ecs.FargatePlatformVersion
- *Default:* Latest

The platform version on which to run your service.

If one is not specified, the LATEST platform version is used by default. For more information, see
[AWS Fargate Platform Versions](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/platform_versions.html)
in the Amazon Elastic Container Service Developer Guide.

---

##### `propagateTags`<sup>Optional</sup> <a name="propagateTags" id="@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorServiceProps.property.propagateTags"></a>

```typescript
public readonly propagateTags: PropagatedTagSource;
```

- *Type:* aws-cdk-lib.aws_ecs.PropagatedTagSource
- *Default:* PropagatedTagSource.NONE

Specifies whether to propagate the tags from the task definition or the service to the tasks in the service.

Valid values are: PropagatedTagSource.SERVICE, PropagatedTagSource.TASK_DEFINITION or PropagatedTagSource.NONE

---

##### `restartFunctionLogGroup`<sup>Optional</sup> <a name="restartFunctionLogGroup" id="@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorServiceProps.property.restartFunctionLogGroup"></a>

```typescript
public readonly restartFunctionLogGroup: ILogGroup;
```

- *Type:* aws-cdk-lib.aws_logs.ILogGroup
- *Default:* new logs.LogGroup(this, 'RestartServiceFunctionLogGroup', {   logGroupName: `/aws/lambda/${props.cluster.clusterName}/${props.serviceName || 'log-collector'}/restart-service`,   retention: logs.RetentionDays.TWO_YEARS,   removalPolicy: RemovalPolicy.RETAIN_ON_UPDATE_OR_DELETE, }),

The log Group to use for the restart function.

---

##### `securityGroups`<sup>Optional</sup> <a name="securityGroups" id="@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorServiceProps.property.securityGroups"></a>

```typescript
public readonly securityGroups: ISecurityGroup[];
```

- *Type:* aws-cdk-lib.aws_ec2.ISecurityGroup[]
- *Default:* A new security group is created.

The security groups to associate with the service.

If you do not specify a security group, a new security group is created.

---

##### `serviceConnectConfiguration`<sup>Optional</sup> <a name="serviceConnectConfiguration" id="@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorServiceProps.property.serviceConnectConfiguration"></a>

```typescript
public readonly serviceConnectConfiguration: ServiceConnectProps;
```

- *Type:* aws-cdk-lib.aws_ecs.ServiceConnectProps
- *Default:* No ports are advertised via Service Connect on this service, and the service cannot make requests to other services via Service Connect.

Configuration for Service Connect.

---

##### `serviceName`<sup>Optional</sup> <a name="serviceName" id="@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorServiceProps.property.serviceName"></a>

```typescript
public readonly serviceName: string;
```

- *Type:* string
- *Default:* CloudFormation-generated name.

The name of the service.

---

##### `taskDefinitionRevision`<sup>Optional</sup> <a name="taskDefinitionRevision" id="@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorServiceProps.property.taskDefinitionRevision"></a>

```typescript
public readonly taskDefinitionRevision: TaskDefinitionRevision;
```

- *Type:* aws-cdk-lib.aws_ecs.TaskDefinitionRevision
- *Default:* Uses the revision of the passed task definition deployed by CloudFormation

Revision number for the task definition or `latest` to use the latest active task revision.

---

##### `volumeConfigurations`<sup>Optional</sup> <a name="volumeConfigurations" id="@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorServiceProps.property.volumeConfigurations"></a>

```typescript
public readonly volumeConfigurations: ServiceManagedVolume[];
```

- *Type:* aws-cdk-lib.aws_ecs.ServiceManagedVolume[]
- *Default:* undefined

Configuration details for a volume used by the service.

This allows you to specify
details about the EBS volume that can be attched to ECS tasks.

---

##### `vpcSubnets`<sup>Optional</sup> <a name="vpcSubnets" id="@renovosolutions/cdk-library-fargate-log-collector.FargateLogCollectorServiceProps.property.vpcSubnets"></a>

```typescript
public readonly vpcSubnets: SubnetSelection;
```

- *Type:* aws-cdk-lib.aws_ec2.SubnetSelection
- *Default:* Public subnets if `assignPublicIp` is set, otherwise the first available one of Private, Isolated, Public, in that order.

The subnets to associate with the service.

---

### LogFilter <a name="LogFilter" id="@renovosolutions/cdk-library-fargate-log-collector.LogFilter"></a>

A filter entry for a log.

> [https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-Configuration-File-Details.html](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Agent-Configuration-File-Details.html)

#### Initializer <a name="Initializer" id="@renovosolutions/cdk-library-fargate-log-collector.LogFilter.Initializer"></a>

```typescript
import { LogFilter } from '@renovosolutions/cdk-library-fargate-log-collector'

const logFilter: LogFilter = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-fargate-log-collector.LogFilter.property.expression">expression</a></code> | <code>string</code> | The filter pattern. |
| <code><a href="#@renovosolutions/cdk-library-fargate-log-collector.LogFilter.property.type">type</a></code> | <code>string</code> | The type of filter. |

---

##### `expression`<sup>Required</sup> <a name="expression" id="@renovosolutions/cdk-library-fargate-log-collector.LogFilter.property.expression"></a>

```typescript
public readonly expression: string;
```

- *Type:* string

The filter pattern.

This is a regular expression that matches the log lines to include or exclude.

---

##### `type`<sup>Required</sup> <a name="type" id="@renovosolutions/cdk-library-fargate-log-collector.LogFilter.property.type"></a>

```typescript
public readonly type: string;
```

- *Type:* string

The type of filter.

Either 'include' or 'exclude'.

---

### LogMapping <a name="LogMapping" id="@renovosolutions/cdk-library-fargate-log-collector.LogMapping"></a>

A mapping of a log file to a CloudWatch log group.

#### Initializer <a name="Initializer" id="@renovosolutions/cdk-library-fargate-log-collector.LogMapping.Initializer"></a>

```typescript
import { LogMapping } from '@renovosolutions/cdk-library-fargate-log-collector'

const logMapping: LogMapping = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@renovosolutions/cdk-library-fargate-log-collector.LogMapping.property.filePath">filePath</a></code> | <code>string</code> | The path to the log file on the EFS access point. |
| <code><a href="#@renovosolutions/cdk-library-fargate-log-collector.LogMapping.property.createLogGroup">createLogGroup</a></code> | <code>aws-cdk-lib.aws_logs.LogGroupProps</code> | The props for a log group to create. |
| <code><a href="#@renovosolutions/cdk-library-fargate-log-collector.LogMapping.property.filters">filters</a></code> | <code><a href="#@renovosolutions/cdk-library-fargate-log-collector.LogFilter">LogFilter</a>[]</code> | A list of filters to apply to the log file. |
| <code><a href="#@renovosolutions/cdk-library-fargate-log-collector.LogMapping.property.logGroup">logGroup</a></code> | <code>aws-cdk-lib.aws_logs.ILogGroup</code> | The log group to use. |
| <code><a href="#@renovosolutions/cdk-library-fargate-log-collector.LogMapping.property.multilinePattern">multilinePattern</a></code> | <code>string</code> | The pattern to use for recognizing multi-line log messages. |
| <code><a href="#@renovosolutions/cdk-library-fargate-log-collector.LogMapping.property.timestampFormat">timestampFormat</a></code> | <code>string</code> | The format of the timestamp in the log file. |
| <code><a href="#@renovosolutions/cdk-library-fargate-log-collector.LogMapping.property.timezone">timezone</a></code> | <code>string</code> | Whether to use UTC or local time for messages added to the log group. |

---

##### `filePath`<sup>Required</sup> <a name="filePath" id="@renovosolutions/cdk-library-fargate-log-collector.LogMapping.property.filePath"></a>

```typescript
public readonly filePath: string;
```

- *Type:* string

The path to the log file on the EFS access point.

This should be a relative path from the root of the access point.
It must not start with a '/'.

---

*Example*

```typescript
'my-log-file.log' if the main service mounts the logs access point at '/mnt/logs' and the file is at '/mnt/logs/my-log-file.log'. 'logs/my-log-file.log' if the main service mounts the logs access point at '/opt/app' and the file is at '/opt/app/logs/my-log-file.log/'.
```


##### `createLogGroup`<sup>Optional</sup> <a name="createLogGroup" id="@renovosolutions/cdk-library-fargate-log-collector.LogMapping.property.createLogGroup"></a>

```typescript
public readonly createLogGroup: LogGroupProps;
```

- *Type:* aws-cdk-lib.aws_logs.LogGroupProps
- *Default:* None

The props for a log group to create.

Do not pass props for an existing log group here,
or a duplicate will be created and you will get
a deployment failure.

If both `createLogGroup` and `logGroup` are absent,
a new log group will be created with a name
derived from last part of the file path
and default props.

If both `createLogGroup` and `logGroup` are provided,
the `logGroup` will be used, and the `createLogGroup` will be ignored.

---

##### `filters`<sup>Optional</sup> <a name="filters" id="@renovosolutions/cdk-library-fargate-log-collector.LogMapping.property.filters"></a>

```typescript
public readonly filters: LogFilter[];
```

- *Type:* <a href="#@renovosolutions/cdk-library-fargate-log-collector.LogFilter">LogFilter</a>[]

A list of filters to apply to the log file.

Each filter is a regular expression that matches the log lines to include or exclude.
If you include this field, the agent processes each log message with all of the
filters that you specify, and only the log events that pass all of the filters
are published to CloudWatch Logs. The log entries that don’t pass all of the
filters will still remain in the host's log file, but will not be sent to CloudWatch Logs.
If you omit this field, all logs in the log file are published to CloudWatch Logs.

---

##### `logGroup`<sup>Optional</sup> <a name="logGroup" id="@renovosolutions/cdk-library-fargate-log-collector.LogMapping.property.logGroup"></a>

```typescript
public readonly logGroup: ILogGroup;
```

- *Type:* aws-cdk-lib.aws_logs.ILogGroup
- *Default:* None

The log group to use.

This should be an existing log group.

If both `createLogGroup` and `logGroup` are provided,
the `logGroup` will be used, and the `createLogGroup` will be ignored.

---

##### `multilinePattern`<sup>Optional</sup> <a name="multilinePattern" id="@renovosolutions/cdk-library-fargate-log-collector.LogMapping.property.multilinePattern"></a>

```typescript
public readonly multilinePattern: string;
```

- *Type:* string
- *Default:* None

The pattern to use for recognizing multi-line log messages.

This is a regular expression that matches the start of a new log message.
If this is not provided, the agent will treat each line that begins with
a non-whitespace character as starting a new log message.
If you include this field, you can specify `{timestamp_format}` to use
the same regular expression as your timestamp format. Otherwise, you can
specify a different regular expression for CloudWatch Logs to use to determine
the start lines of multi-line entries.

---

##### `timestampFormat`<sup>Optional</sup> <a name="timestampFormat" id="@renovosolutions/cdk-library-fargate-log-collector.LogMapping.property.timestampFormat"></a>

```typescript
public readonly timestampFormat: string;
```

- *Type:* string
- *Default:* None

The format of the timestamp in the log file.

This is not quite the same as a strftime format string.
If this is not provided, the agent will forward all messages
with a timestamp matching the time it sees the message.

---

##### `timezone`<sup>Optional</sup> <a name="timezone" id="@renovosolutions/cdk-library-fargate-log-collector.LogMapping.property.timezone"></a>

```typescript
public readonly timezone: string;
```

- *Type:* string
- *Default:* None

Whether to use UTC or local time for messages added to the log group.

Either 'UTC' or 'Local'. It does not allow arbitrary timezones to be set.
This is only used if `timestampFormat` is provided.
If this is not provided, the agent will use local time.

---



