# Deployment Guide

This guide walks you through deploying the TypeScript Starter to production on AWS using Pulumi for infrastructure as code.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Step 1: AWS Setup](#step-1-aws-setup)
- [Step 2: Environment Variables](#step-2-environment-variables)
- [Step 3: Database Setup](#step-3-database-setup)
- [Step 4: Database Migrations](#step-4-database-migrations)
- [Step 5: Build Docker Image](#step-5-build-docker-image)
- [Step 6: Deploy Application](#step-6-deploy-application)
- [Step 7: Configure DNS](#step-7-configure-dns)
- [Step 8: Verify Deployment](#step-8-verify-deployment)
- [Step 9: Configure Monitoring](#step-9-configure-monitoring)
- [Step 10: Set Up Stripe Webhooks](#step-10-set-up-stripe-webhooks)
- [Troubleshooting](#troubleshooting)
- [Rollback](#rollback)
- [Maintenance](#maintenance)
- [Security Checklist](#security-checklist)

## Prerequisites

- AWS account with appropriate permissions
- Node.js 20+ installed
- pnpm 9+ installed
- Docker installed (for local testing)
- Pulumi CLI installed ([Install Pulumi](https://www.pulumi.com/docs/get-started/install/))

## Step 1: AWS Setup

### 1.1 Configure AWS Credentials

```bash
aws configure
```

Enter your AWS Access Key ID, Secret Access Key, default region, and output format.

### 1.2 Verify AWS Access

```bash
aws sts get-caller-identity
```

## Step 2: Environment Variables

### 2.1 Create Production Environment File

Create a `.env.production` file in the `apps/web` directory. You'll configure these in AWS Secrets Manager later, but it's helpful to have them documented:

```bash
cd apps/web
touch .env.production
```

### 2.2 Required Variables

**Minimum required for deployment:**

```env
# Database (will be provided by RDS after deployment)
DATABASE_URL=postgresql://user:password@rds-endpoint:5432/dbname

# Authentication
BETTER_AUTH_SECRET=<generate-with-openssl-rand-base64-32>
BETTER_AUTH_URL=https://yourdomain.com

# Application
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NODE_ENV=production
```

**Generate `BETTER_AUTH_SECRET`:**
```bash
openssl rand -base64 32
```

### 2.3 Optional Variables

**Stripe (for payments):**
```env
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

**AWS SES (for emails):**
```env
AWS_SES_REGION=us-east-1
AWS_SES_FROM_EMAIL=noreply@yourdomain.com
AWS_SES_FROM_NAME=Your App Name
```

**OAuth Providers (optional):**
```env
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
APPLE_CLIENT_ID=...
APPLE_CLIENT_SECRET=...
```

**Monitoring (recommended):**
```env
SENTRY_DSN=https://...@...
NEXT_PUBLIC_SENTRY_DSN=https://...@...
SENTRY_ORG=your-org
SENTRY_PROJECT=your-project
SENTRY_AUTH_TOKEN=...
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

**Redis (for rate limiting):**
```env
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...
```

> **Important:** Never commit `.env.production` to version control. These values will be stored in AWS Secrets Manager.

## Step 3: Database Setup

### 3.1 Deploy Infrastructure

Navigate to the infrastructure package:

```bash
cd packages/infrastructure
```

### 3.2 Initialize Pulumi Stack

Create a new Pulumi stack for production:

```bash
cd packages/infrastructure
pulumi stack init production
```

Set the AWS region:

```bash
pulumi config set aws:region us-east-1
```

### 3.3 Configure Stack

Set required configuration values. Adjust these based on your needs:

```bash
# Database configuration
pulumi config set database:instanceClass db.t3.micro  # or db.t3.small, db.t3.medium
pulumi config set database:allocatedStorage 20        # GB, minimum 20
pulumi config set database:engineVersion "16.1"       # PostgreSQL version

# Application configuration
pulumi config set app:domain yourdomain.com
pulumi config set app:environment production

# Optional: ECS configuration
pulumi config set ecs:desiredCount 2                  # Number of tasks
pulumi config set ecs:cpu 512                         # CPU units (256, 512, 1024, etc.)
pulumi config set ecs:memory 1024                     # Memory in MB
```

View all configuration:

```bash
pulumi config
```

### 3.4 Preview Infrastructure

```bash
pulumi preview
```

Review the planned changes carefully.

### 3.5 Deploy Infrastructure

```bash
pulumi up
```

This will create:
- VPC and networking
- RDS PostgreSQL database
- ECS Fargate cluster
- Application Load Balancer
- S3 bucket for static assets
- CloudFront distribution
- AWS SES configuration
- Secrets Manager for environment variables

### 3.6 Get Deployment Outputs

After deployment, retrieve important values:

```bash
# Database connection string
pulumi stack output databaseUrl

# ECR repository URL (for Docker images)
pulumi stack output ecrRepositoryUrl

# CloudFront distribution URL
pulumi stack output cloudFrontUrl

# ECS cluster and service names
pulumi stack output ecsClusterName
pulumi stack output ecsServiceName

# Application Load Balancer URL
pulumi stack output albUrl
```

**Important:** Save the `databaseUrl` - you'll need it for migrations and environment variables.

## Step 4: Database Migrations

### 4.1 Set Database URL

Before running migrations, set the database URL from Step 3.6:

```bash
export DATABASE_URL="$(cd packages/infrastructure && pulumi stack output databaseUrl)"
```

Or manually set it:

```bash
export DATABASE_URL="postgresql://user:password@rds-endpoint:5432/dbname"
```

### 4.2 Run Migrations

Apply database migrations:

```bash
cd apps/web
pnpm db:migrate
```

This will apply all migrations from the `drizzle/` directory to your production database.

### 4.3 Seed Database (Optional)

If you have seed data, run it:

```bash
pnpm db:seed
```

> **Warning:** Only seed in development or staging. Never seed production with test data.

## Step 5: Build and Push Docker Image

### 5.1 Get ECR Repository URL

```bash
cd packages/infrastructure
ECR_URL=$(pulumi stack output ecrRepositoryUrl)
echo $ECR_URL
```

### 5.2 Authenticate Docker with ECR

```bash
AWS_REGION=$(pulumi config get aws:region)
aws ecr get-login-password --region $AWS_REGION | \
  docker login --username AWS --password-stdin $ECR_URL
```

### 5.3 Build Docker Image

```bash
cd ../../apps/web
docker build -t typescript-starter:latest .
```

### 5.4 Tag and Push Image

Tag the image for ECR:

```bash
docker tag typescript-starter:latest $ECR_URL:latest
```

Push to ECR:

```bash
docker push $ECR_URL:latest
```

> **Tip:** For CI/CD, you can automate this process. The image tag `latest` will trigger ECS to deploy a new version.

## Step 6: Deploy Application

### 6.1 Configure Environment Variables in Secrets Manager

Before deploying, store environment variables in AWS Secrets Manager. The Pulumi infrastructure should create a secret, but you need to populate it:

```bash
# Get the secret ARN from Pulumi
SECRET_ARN=$(cd packages/infrastructure && pulumi stack output secretsManagerArn)

# Create or update the secret (replace with your actual values)
aws secretsmanager put-secret-value \
  --secret-id $SECRET_ARN \
  --secret-string '{
    "DATABASE_URL": "postgresql://...",
    "BETTER_AUTH_SECRET": "...",
    "BETTER_AUTH_URL": "https://yourdomain.com",
    "NEXT_PUBLIC_APP_URL": "https://yourdomain.com",
    "NODE_ENV": "production"
  }'
```

Or use the AWS Console to edit the secret.

### 6.2 Update ECS Service

The ECS service should automatically pick up the new image. If not, force a new deployment:

```bash
cd packages/infrastructure
SERVICE_NAME=$(pulumi stack output ecsServiceName)
CLUSTER_NAME=$(pulumi stack output ecsClusterName)
AWS_REGION=$(pulumi config get aws:region)

aws ecs update-service \
  --cluster $CLUSTER_NAME \
  --service $SERVICE_NAME \
  --force-new-deployment \
  --region $AWS_REGION
```

### 6.3 Monitor Deployment

Watch the deployment progress:

```bash
aws ecs describe-services \
  --cluster $CLUSTER_NAME \
  --services $SERVICE_NAME \
  --region $AWS_REGION \
  --query 'services[0].deployments'
```

Wait for the new deployment to reach `RUNNING` status and the old one to stop.

## Step 7: Configure DNS

### 7.1 Get CloudFront Distribution URL

```bash
cd packages/infrastructure
CLOUDFRONT_URL=$(pulumi stack output cloudFrontUrl)
echo "Point your domain to: $CLOUDFRONT_URL"
```

### 7.2 Update DNS Records

**Option A: CNAME Record (Recommended)**

In your DNS provider, create a CNAME record:

- **Name:** `@` (or your subdomain)
- **Value:** The CloudFront URL (e.g., `d1234567890.cloudfront.net`)
- **TTL:** 300 (or your preference)

**Option B: Route 53 (If using AWS)**

If your domain is in Route 53 and configured in Pulumi, DNS may be automatically configured. Verify:

```bash
aws route53 list-hosted-zones
```

### 7.3 Verify DNS Propagation

Check if DNS has propagated:

```bash
dig yourdomain.com
# or
nslookup yourdomain.com
```

DNS changes can take up to 48 hours, but usually propagate within minutes to hours.

## Step 8: Verify Deployment

### 8.1 Health Check

Test the health endpoint:

```bash
curl https://yourdomain.com/api/health
```

Expected response:
```json
{"status":"ok"}
```

### 8.2 Check Application Logs

View ECS task logs:

```bash
LOG_GROUP=$(cd packages/infrastructure && pulumi stack output logGroupName)
aws logs tail $LOG_GROUP --follow --region us-east-1
```

### 8.3 Test Application Functionality

1. **Visit the application**: `https://yourdomain.com`
2. **Test authentication**:
   - Sign up for a new account
   - Verify email (if configured)
   - Sign in and out
3. **Test core features**:
   - Create a todo
   - Update profile
   - Test protected routes
4. **Test payments** (if configured):
   - View pricing page
   - Create checkout session (use Stripe test mode first)
   - Verify webhook handling

### 8.4 Performance Check

- Check page load times
- Verify images and assets load correctly
- Test on mobile devices
- Check CloudFront cache behavior

## Step 9: Configure Monitoring

### 9.1 Sentry

1. Create a project in Sentry
2. Get the DSN
3. Update environment variables in AWS Secrets Manager
4. Redeploy application

### 9.2 PostHog

1. Create a project in PostHog
2. Get API key and host
3. Update environment variables
4. Redeploy application

## Step 10: Set Up Stripe Webhooks

### 10.1 Create Webhook Endpoint

In Stripe Dashboard:
1. Go to Developers → Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copy the webhook signing secret
5. Update `STRIPE_WEBHOOK_SECRET` in AWS Secrets Manager

## Troubleshooting

### Database Connection Issues

**Symptoms:** Application can't connect to database, errors in logs.

**Solutions:**
1. Verify security groups allow connections from ECS tasks to RDS
2. Check RDS endpoint in Secrets Manager matches actual RDS endpoint
3. Verify database credentials in Secrets Manager
4. Test connection manually:
   ```bash
   psql $DATABASE_URL
   ```
5. Check RDS instance is running: `aws rds describe-db-instances`

### Application Not Starting

**Symptoms:** ECS tasks keep restarting, health checks failing.

**Solutions:**
1. **Check ECS task logs:**
   ```bash
   LOG_GROUP=$(cd packages/infrastructure && pulumi stack output logGroupName)
   aws logs tail $LOG_GROUP --follow
   ```

2. **Verify environment variables:**
   - Check Secrets Manager has all required variables
   - Verify variable names match exactly (case-sensitive)
   - Ensure `NODE_ENV=production` is set

3. **Check health endpoint:**
   ```bash
   ALB_URL=$(cd packages/infrastructure && pulumi stack output albUrl)
   curl $ALB_URL/api/health
   ```

4. **Verify Docker image:**
   - Check image was pushed successfully
   - Test image locally: `docker run -p 3000:3000 $ECR_URL:latest`

### Email Not Sending

**Symptoms:** Emails not being delivered, no errors in logs.

**Solutions:**
1. **Verify SES email address is verified:**
   ```bash
   aws ses list-verified-email-addresses
   ```

2. **Check SES sandbox status:**
   - SES starts in sandbox mode (can only send to verified emails)
   - Request production access in AWS Console for production use

3. **Review CloudWatch logs:**
   ```bash
   aws logs filter-log-events \
     --log-group-name /aws/ses \
     --filter-pattern "ERROR"
   ```

4. **Verify SES configuration:**
   - Check `AWS_SES_REGION` matches your SES region
   - Verify `AWS_SES_FROM_EMAIL` is verified
   - Check IAM permissions for SES

### Build Failures

**Symptoms:** Docker build fails, deployment fails.

**Solutions:**
1. **Check dependencies:**
   - Ensure all dependencies are in `package.json`
   - Run `pnpm install` locally to verify

2. **Verify Node.js version:**
   - Dockerfile should use Node.js 20+
   - Check `package.json` engines field

3. **Check build environment:**
   - Verify build-time environment variables if needed
   - Check Docker build context includes all files

4. **Test build locally:**
   ```bash
   docker build -t test-build .
   ```

### High Latency or Slow Performance

**Symptoms:** Application is slow, high response times.

**Solutions:**
1. **Check CloudFront cache:**
   - Verify static assets are cached
   - Check cache hit ratio in CloudWatch

2. **Database performance:**
   - Check RDS CPU and memory usage
   - Review slow query logs
   - Consider upgrading instance class

3. **ECS resource limits:**
   - Check CPU and memory usage
   - Increase task resources if needed
   - Scale out (more tasks) instead of up

4. **Application-level:**
   - Review application logs for slow operations
   - Check for N+1 queries
   - Verify database indexes

### SSL/TLS Certificate Issues

**Symptoms:** Browser shows certificate errors, HTTPS not working.

**Solutions:**
1. **Verify CloudFront certificate:**
   - Check certificate is issued and valid
   - Ensure domain is in certificate

2. **Check DNS:**
   - Verify CNAME points to CloudFront
   - Check DNS propagation

3. **CloudFront configuration:**
   - Verify custom domain is configured
   - Check viewer protocol policy

## Rollback

### Rollback Application

If a deployment causes issues, rollback to the previous version:

```bash
cd packages/infrastructure
SERVICE_NAME=$(pulumi stack output ecsServiceName)
CLUSTER_NAME=$(pulumi stack output ecsClusterName)
AWS_REGION=$(pulumi config get aws:region)

# Get previous task definition
PREVIOUS_TD=$(aws ecs describe-services \
  --cluster $CLUSTER_NAME \
  --services $SERVICE_NAME \
  --region $AWS_REGION \
  --query 'services[0].deployments[?status==`PRIMARY`].taskDefinition' \
  --output text)

# Get the task definition before the current one
ALL_TDS=$(aws ecs list-task-definitions \
  --family-prefix typescript-starter \
  --sort DESC \
  --max-items 2 \
  --region $AWS_REGION \
  --query 'taskDefinitionArns' \
  --output text)

PREVIOUS_TD=$(echo $ALL_TDS | cut -d' ' -f2)

# Update service to previous task definition
aws ecs update-service \
  --cluster $CLUSTER_NAME \
  --service $SERVICE_NAME \
  --task-definition $PREVIOUS_TD \
  --region $AWS_REGION
```

### Rollback Infrastructure Changes

**⚠️ Warning:** Rolling back infrastructure can cause data loss. Only do this if absolutely necessary.

```bash
cd packages/infrastructure

# Preview what will be destroyed
pulumi preview

# Show all resources
pulumi stack --show-urns

# Destroy specific resources (safer than full destroy)
pulumi destroy --target <resource-urn>

# Full destroy (USE WITH EXTREME CAUTION)
# This will delete ALL infrastructure including databases!
pulumi destroy
```

**Better approach:** Use Pulumi's state management to revert to a previous state:

```bash
# List stack history
pulumi stack history

# Checkout previous state (if using Git-based state backend)
# Or restore from backup
```

## Maintenance

### Database Backups

RDS automated backups are enabled by default. Manual snapshot:

```bash
aws rds create-db-snapshot --db-instance-identifier <instance-id> --db-snapshot-identifier backup-$(date +%Y%m%d)
```

### Update Application

1. Make code changes
2. Build new Docker image
3. Push to ECR
4. Force ECS deployment
5. Monitor CloudWatch logs

### Scale Application

Update ECS service desired count:

```bash
aws ecs update-service --cluster $CLUSTER_NAME --service $SERVICE_NAME --desired-count 3
```

## Security Checklist

Before going to production, verify:

### Secrets Management
- [ ] All secrets stored in AWS Secrets Manager (not in code or environment files)
- [ ] Secrets Manager encryption enabled
- [ ] IAM roles have minimal permissions for Secrets Manager access
- [ ] No secrets committed to version control

### Network Security
- [ ] Database not publicly accessible (only accessible from ECS tasks)
- [ ] Security groups properly configured (least privilege)
- [ ] VPC properly isolated
- [ ] HTTPS enabled everywhere (CloudFront, ALB)
- [ ] HTTP redirects to HTTPS

### Application Security
- [ ] Security headers configured (see `next.config.ts`)
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (using parameterized queries via Drizzle)

### Infrastructure Security
- [ ] IAM roles follow least privilege principle
- [ ] ECS tasks run with minimal permissions
- [ ] CloudFront signed URLs for sensitive content (if needed)
- [ ] WAF rules configured (if applicable)

### Monitoring & Compliance
- [ ] CloudWatch logging enabled
- [ ] CloudTrail enabled for API auditing
- [ ] Monitoring and alerting configured
- [ ] Error tracking (Sentry) configured
- [ ] Security incident response plan

### Data Protection
- [ ] Database backups enabled and tested
- [ ] Backup retention policy configured
- [ ] Encryption at rest enabled (RDS, S3)
- [ ] Encryption in transit (TLS/SSL)
- [ ] Data retention and deletion policies

### Updates & Maintenance
- [ ] Regular security updates scheduled
- [ ] Dependency vulnerability scanning
- [ ] Infrastructure updates planned
- [ ] Disaster recovery plan documented

