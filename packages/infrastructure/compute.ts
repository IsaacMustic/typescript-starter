import * as aws from "@pulumi/aws";
import { tags, environment } from "./config";
import { publicSubnet1, publicSubnet2, ecsSecurityGroup, albSecurityGroup } from "./network";

// ECR Repository
export const ecrRepository = new aws.ecr.Repository("app", {
  imageTagMutability: "MUTABLE",
  imageScanningConfiguration: {
    scanOnPush: true,
  },
  tags: { ...tags, Name: "app-repo" },
});

// ECS Cluster
export const ecsCluster = new aws.ecs.Cluster("main", {
  tags: { ...tags, Name: "main-cluster" },
});

// Application Load Balancer
export const alb = new aws.lb.LoadBalancer("main", {
  loadBalancerType: "application",
  subnets: [publicSubnet1.id, publicSubnet2.id],
  securityGroups: [albSecurityGroup.id],
  enableDeletionProtection: environment === "production",
  tags: { ...tags, Name: "main-alb" },
});

// Target Group
export const targetGroup = new aws.lb.TargetGroup("main", {
  port: 3000,
  protocol: "HTTP",
  vpcId: alb.vpcId,
  targetType: "ip",
  healthCheck: {
    enabled: true,
    path: "/api/health",
    protocol: "HTTP",
    healthyThreshold: 2,
    unhealthyThreshold: 3,
    timeout: 5,
    interval: 30,
  },
  tags: { ...tags, Name: "main-tg" },
});

// ALB Listener
export const albListener = new aws.lb.Listener("main", {
  loadBalancerArn: alb.arn,
  port: 80,
  protocol: "HTTP",
  defaultActions: [
    {
      type: "forward",
      targetGroupArn: targetGroup.arn,
    },
  ],
});

// ECS Task Definition (placeholder - would need actual image)
export const taskDefinition = new aws.ecs.TaskDefinition("app", {
  family: "app",
  networkMode: "awsvpc",
  requiresCompatibilities: ["FARGATE"],
  cpu: environment === "production" ? "1024" : "512",
  memory: environment === "production" ? "2048" : "1024",
  containerDefinitions: JSON.stringify([
    {
      name: "app",
      image: `${ecrRepository.repositoryUrl}:latest`,
      portMappings: [
        {
          containerPort: 3000,
          protocol: "tcp",
        },
      ],
      environment: [],
      logConfiguration: {
        logDriver: "awslogs",
        options: {
          "awslogs-group": "/ecs/app",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs",
        },
      },
    },
  ]),
  tags: { ...tags, Name: "app-task" },
});

// ECS Service
export const ecsService = new aws.ecs.Service("app", {
  cluster: ecsCluster.id,
  taskDefinition: taskDefinition.arn,
  desiredCount: environment === "production" ? 2 : 1,
  launchType: "FARGATE",
  networkConfiguration: {
    subnets: [publicSubnet1.id, publicSubnet2.id],
    securityGroups: [ecsSecurityGroup.id],
    assignPublicIp: true,
  },
  loadBalancers: [
    {
      targetGroupArn: targetGroup.arn,
      containerName: "app",
      containerPort: 3000,
    },
  ],
  tags: { ...tags, Name: "app-service" },
});

