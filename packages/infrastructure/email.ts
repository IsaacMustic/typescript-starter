import * as aws from "@pulumi/aws";

// SES Configuration Set
export const sesConfigurationSet = new aws.ses.ConfigurationSet("main", {
  name: "main-config-set",
});

// Note: Domain verification and DKIM setup would be done manually
// or through additional resources
