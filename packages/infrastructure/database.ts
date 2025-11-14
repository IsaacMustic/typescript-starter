import * as aws from "@pulumi/aws";
import { tags, environment } from "./config";
import { dbSubnet1, dbSubnet2, rdsSecurityGroup } from "./network";

// DB Subnet Group
export const dbSubnetGroup = new aws.rds.SubnetGroup("main", {
  subnetIds: [dbSubnet1.id, dbSubnet2.id],
  tags: { ...tags, Name: "main-db-subnet-group" },
});

// DB Parameter Group
export const dbParameterGroup = new aws.rds.ParameterGroup("main", {
  family: "postgres16",
  description: "Parameter group for PostgreSQL 16",
  tags: { ...tags, Name: "main-db-parameter-group" },
});

// RDS Instance
export const dbInstance = new aws.rds.Instance("main", {
  engine: "postgres",
  engineVersion: "16.1",
  instanceClass: environment === "production" ? "db.t4g.medium" : "db.t4g.micro",
  allocatedStorage: 20,
  maxAllocatedStorage: 100,
  storageType: "gp3",
  dbName: "appdb",
  username: "postgres",
  password: "changeme", // Should be in Secrets Manager
  dbSubnetGroupName: dbSubnetGroup.name,
  parameterGroupName: dbParameterGroup.name,
  vpcSecurityGroupIds: [rdsSecurityGroup.id],
  publiclyAccessible: false,
  multiAz: environment === "production",
  backupRetentionPeriod: 7,
  skipFinalSnapshot: environment !== "production",
  tags: { ...tags, Name: "main-db" },
});

export const dbEndpoint = dbInstance.endpoint;
export const dbConnectionString = dbInstance.endpoint.apply(
  (endpoint) => `postgresql://postgres:changeme@${endpoint}/appdb`,
);

