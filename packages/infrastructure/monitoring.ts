import * as aws from "@pulumi/aws";
import { tags } from "./config";

// CloudWatch Log Group
export const ecsLogGroup = new aws.cloudwatch.LogGroup("ecs-app", {
  name: "/ecs/app",
  retentionInDays: 30,
  tags: { ...tags, Name: "ecs-app-logs" },
});

// CloudWatch Alarm for ECS CPU
export const ecsCpuAlarm = new aws.cloudwatch.MetricAlarm("ecs-cpu-high", {
  name: "ecs-cpu-high",
  comparisonOperator: "GreaterThanThreshold",
  evaluationPeriods: 2,
  metricName: "CPUUtilization",
  namespace: "AWS/ECS",
  period: 300,
  statistic: "Average",
  threshold: 80,
  alarmDescription: "Alert when ECS CPU exceeds 80%",
  tags: { ...tags, Name: "ecs-cpu-alarm" },
});
