import * as aws from "@pulumi/aws";
import { tags } from "./config";

// S3 Bucket for static assets
export const staticAssetsBucket = new aws.s3.Bucket("static-assets", {
  tags: { ...tags, Name: "static-assets" },
});

// Bucket versioning
new aws.s3.BucketVersioningV2("static-assets-versioning", {
  bucket: staticAssetsBucket.id,
  versioningConfiguration: {
    status: "Enabled",
  },
});

// Bucket encryption
new aws.s3.BucketServerSideEncryptionConfigurationV2("static-assets-encryption", {
  bucket: staticAssetsBucket.id,
  rules: [
    {
      applyServerSideEncryptionByDefault: {
        sseAlgorithm: "AES256",
      },
    },
  ],
});

