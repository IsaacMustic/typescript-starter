import * as aws from "@pulumi/aws";
import { tags } from "./config";

// Placeholder for CloudFront distribution
// This would require ALB to be created first
export const cloudFrontDistribution = new aws.cloudfront.Distribution(
  "main",
  {
    enabled: true,
    defaultRootObject: "index.html",
    origins: [
      {
        originId: "alb-origin",
        domainName: "placeholder-alb.amazonaws.com",
        customOriginConfig: {
          httpPort: 80,
          httpsPort: 443,
          originProtocolPolicy: "https-only",
          originSslProtocols: ["TLSv1.2"],
        },
      },
    ],
    defaultCacheBehavior: {
      targetOriginId: "alb-origin",
      viewerProtocolPolicy: "redirect-to-https",
      allowedMethods: ["GET", "HEAD", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"],
      cachedMethods: ["GET", "HEAD"],
      forwardedValues: {
        queryString: true,
        cookies: {
          forward: "all",
        },
        headers: ["Authorization", "Host"],
      },
      minTtl: 0,
      defaultTtl: 300,
      maxTtl: 31536000,
    },
    restrictions: {
      geoRestriction: {
        restrictionType: "none",
      },
    },
    viewerCertificate: {
      cloudfrontDefaultCertificate: true,
    },
    tags: { ...tags, Name: "main-cdn" },
  },
);

