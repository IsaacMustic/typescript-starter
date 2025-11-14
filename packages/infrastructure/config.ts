import * as pulumi from "@pulumi/pulumi";

const config = new pulumi.Config();

export const stack = pulumi.getStack();
export const region = config.get("aws:region") ?? "us-east-1";
export const environment = stack === "prod" ? "production" : "development";

export const tags = {
  Environment: environment,
  Project: "typescript-starter",
  ManagedBy: "pulumi",
};

