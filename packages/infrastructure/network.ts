import * as aws from "@pulumi/aws";
import { tags } from "./config";

// VPC
export const vpc = new aws.ec2.Vpc("main", {
  cidrBlock: "10.0.0.0/16",
  enableDnsHostnames: true,
  enableDnsSupport: true,
  tags: { ...tags, Name: "main-vpc" },
});

// Internet Gateway
export const internetGateway = new aws.ec2.InternetGateway("main", {
  vpcId: vpc.id,
  tags: { ...tags, Name: "main-igw" },
});

// Get availability zones
const azs = aws.getAvailabilityZones({
  state: "available",
});

// Public Subnets
export const publicSubnet1 = new aws.ec2.Subnet("public-1", {
  vpcId: vpc.id,
  cidrBlock: "10.0.1.0/24",
  availabilityZone: azs.then((az) => az.names?.[0] ?? "us-east-1a"),
  mapPublicIpOnLaunch: true,
  tags: { ...tags, Name: "public-subnet-1" },
});

export const publicSubnet2 = new aws.ec2.Subnet("public-2", {
  vpcId: vpc.id,
  cidrBlock: "10.0.2.0/24",
  availabilityZone: azs.then((az) => az.names?.[1] ?? "us-east-1b"),
  mapPublicIpOnLaunch: true,
  tags: { ...tags, Name: "public-subnet-2" },
});

// Private Subnets
export const privateSubnet1 = new aws.ec2.Subnet("private-1", {
  vpcId: vpc.id,
  cidrBlock: "10.0.10.0/24",
  availabilityZone: azs.then((az) => az.names?.[0] ?? "us-east-1a"),
  tags: { ...tags, Name: "private-subnet-1" },
});

export const privateSubnet2 = new aws.ec2.Subnet("private-2", {
  vpcId: vpc.id,
  cidrBlock: "10.0.11.0/24",
  availabilityZone: azs.then((az) => az.names?.[1] ?? "us-east-1b"),
  tags: { ...tags, Name: "private-subnet-2" },
});

// Database Subnets
export const dbSubnet1 = new aws.ec2.Subnet("db-1", {
  vpcId: vpc.id,
  cidrBlock: "10.0.20.0/24",
  availabilityZone: azs.then((az) => az.names?.[0] ?? "us-east-1a"),
  tags: { ...tags, Name: "db-subnet-1" },
});

export const dbSubnet2 = new aws.ec2.Subnet("db-2", {
  vpcId: vpc.id,
  cidrBlock: "10.0.21.0/24",
  availabilityZone: azs.then((az) => az.names?.[1] ?? "us-east-1b"),
  tags: { ...tags, Name: "db-subnet-2" },
});

// NAT Gateway
const natGatewayEip = new aws.ec2.Eip("nat", {
  domain: "vpc",
  tags: { ...tags, Name: "nat-eip" },
});

export const natGateway = new aws.ec2.NatGateway("main", {
  allocationId: natGatewayEip.id,
  subnetId: publicSubnet1.id,
  tags: { ...tags, Name: "main-nat" },
});

// Route Tables
export const publicRouteTable = new aws.ec2.RouteTable("public", {
  vpcId: vpc.id,
  routes: [
    {
      cidrBlock: "0.0.0.0/0",
      gatewayId: internetGateway.id,
    },
  ],
  tags: { ...tags, Name: "public-rt" },
});

export const privateRouteTable = new aws.ec2.RouteTable("private", {
  vpcId: vpc.id,
  routes: [
    {
      cidrBlock: "0.0.0.0/0",
      natGatewayId: natGateway.id,
    },
  ],
  tags: { ...tags, Name: "private-rt" },
});

// Route Table Associations
new aws.ec2.RouteTableAssociation("public-1", {
  subnetId: publicSubnet1.id,
  routeTableId: publicRouteTable.id,
});

new aws.ec2.RouteTableAssociation("public-2", {
  subnetId: publicSubnet2.id,
  routeTableId: publicRouteTable.id,
});

new aws.ec2.RouteTableAssociation("private-1", {
  subnetId: privateSubnet1.id,
  routeTableId: privateRouteTable.id,
});

new aws.ec2.RouteTableAssociation("private-2", {
  subnetId: privateSubnet2.id,
  routeTableId: privateRouteTable.id,
});

// Security Groups
export const albSecurityGroup = new aws.ec2.SecurityGroup("alb", {
  vpcId: vpc.id,
  description: "Security group for ALB",
  ingress: [
    {
      protocol: "tcp",
      fromPort: 80,
      toPort: 80,
      cidrBlocks: ["0.0.0.0/0"],
    },
    {
      protocol: "tcp",
      fromPort: 443,
      toPort: 443,
      cidrBlocks: ["0.0.0.0/0"],
    },
  ],
  egress: [
    {
      protocol: "-1",
      fromPort: 0,
      toPort: 0,
      cidrBlocks: ["0.0.0.0/0"],
    },
  ],
  tags: { ...tags, Name: "alb-sg" },
});

export const ecsSecurityGroup = new aws.ec2.SecurityGroup("ecs", {
  vpcId: vpc.id,
  description: "Security group for ECS tasks",
  ingress: [
    {
      protocol: "tcp",
      fromPort: 3000,
      toPort: 3000,
      securityGroups: [albSecurityGroup.id],
    },
  ],
  egress: [
    {
      protocol: "-1",
      fromPort: 0,
      toPort: 0,
      cidrBlocks: ["0.0.0.0/0"],
    },
  ],
  tags: { ...tags, Name: "ecs-sg" },
});

export const rdsSecurityGroup = new aws.ec2.SecurityGroup("rds", {
  vpcId: vpc.id,
  description: "Security group for RDS",
  ingress: [
    {
      protocol: "tcp",
      fromPort: 5432,
      toPort: 5432,
      securityGroups: [ecsSecurityGroup.id],
    },
  ],
  egress: [
    {
      protocol: "-1",
      fromPort: 0,
      toPort: 0,
      cidrBlocks: ["0.0.0.0/0"],
    },
  ],
  tags: { ...tags, Name: "rds-sg" },
});
