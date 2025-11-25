# Deployment Guide

This guide walks you through deploying the TypeScript Starter to production on AWS.

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

Copy `.env.example` to `.env.production` and fill in all required values:

```bash
cp .env.example .env.production
```

### 2.2 Required Variables

**Database:**
- `DATABASE_URL` - PostgreSQL connection string (will be provided by RDS)

**Authentication:**
- `BETTER_AUTH_SECRET` - Generate with: `openssl rand -base64 32`
- `BETTER_AUTH_URL` - Your production URL (e.g., `https://yourdomain.com`)

**Application:**
- `NEXT_PUBLIC_APP_URL` - Your production URL

**Stripe:**
- `STRIPE_SECRET_KEY` - Production Stripe secret key
- `STRIPE_PUBLISHABLE_KEY` - Production Stripe publishable key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook secret

**AWS SES:**
- `AWS_SES_REGION` - AWS region for SES
- `AWS_SES_FROM_EMAIL` - Verified email address in SES
- `AWS_SES_FROM_NAME` - Display name for emails

**Monitoring (Optional but Recommended):**
- `SENTRY_DSN` - Sentry DSN for error tracking
- `NEXT_PUBLIC_POSTHOG_KEY` - PostHog API key
- `NEXT_PUBLIC_POSTHOG_HOST` - PostHog host URL

## Step 3: Database Setup

### 3.1 Deploy Infrastructure

Navigate to the infrastructure package:

```bash
cd packages/infrastructure
```

### 3.2 Initialize Pulumi Stack

```bash
pulumi stack init production
pulumi config set aws:region us-east-1
```

### 3.3 Configure Stack

Set required configuration:

```bash
pulumi config set database:instanceClass db.t3.micro
pulumi config set database:allocatedStorage 20
pulumi config set app:domain yourdomain.com
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

### 3.6 Get Database Connection String

After deployment, get the database URL:

```bash
pulumi stack output databaseUrl
```

Update your `.env.production` with this value.

## Step 4: Database Migrations

### 4.1 Run Migrations

```bash
cd apps/web
pnpm db:migrate
```

### 4.2 Seed Database (Optional)

```bash
pnpm db:seed
```

## Step 5: Build Docker Image

### 5.1 Build Image

```bash
cd apps/web
docker build -t typescript-starter:latest .
```

### 5.2 Tag for ECR

Get your ECR repository URL from Pulumi:

```bash
cd packages/infrastructure
ECR_URL=$(pulumi stack output ecrRepositoryUrl)
cd ../../apps/web
docker tag typescript-starter:latest $ECR_URL:latest
```

### 5.3 Push to ECR

```bash
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin $ECR_URL
docker push $ECR_URL:latest
```

## Step 6: Deploy Application

### 6.1 Update ECS Service

The ECS service should automatically pick up the new image. If not, force a new deployment:

```bash
cd packages/infrastructure
SERVICE_NAME=$(pulumi stack output ecsServiceName)
CLUSTER_NAME=$(pulumi stack output ecsClusterName)
aws ecs update-service --cluster $CLUSTER_NAME --service $SERVICE_NAME --force-new-deployment
```

## Step 7: Configure DNS

### 7.1 Get CloudFront Distribution URL

```bash
cd packages/infrastructure
pulumi stack output cloudFrontUrl
```

### 7.2 Update DNS

Point your domain to the CloudFront distribution:

- Create a CNAME record: `yourdomain.com` → CloudFront URL
- Or use Route 53 hosted zone (if configured in Pulumi)

## Step 8: Verify Deployment

### 8.1 Health Check

```bash
curl https://yourdomain.com/api/health
```

Should return: `{"status":"ok"}`

### 8.2 Test Application

1. Visit `https://yourdomain.com`
2. Create an account
3. Verify email functionality
4. Test subscription flow (in Stripe test mode first)

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

- Verify security groups allow connections from ECS tasks
- Check RDS endpoint in environment variables
- Verify database credentials in Secrets Manager

### Application Not Starting

- Check ECS task logs: `aws logs tail /ecs/typescript-starter --follow`
- Verify all environment variables are set
- Check health endpoint

### Email Not Sending

- Verify SES email address is verified
- Check SES is out of sandbox mode (for production)
- Review CloudWatch logs for SES errors

### Build Failures

- Ensure all dependencies are in `package.json`
- Check Node.js version matches (20+)
- Verify environment variables for build

## Rollback

### Rollback Application

```bash
# Get previous image
PREVIOUS_IMAGE=$(aws ecs describe-services --cluster $CLUSTER_NAME --services $SERVICE_NAME --query 'services[0].deployments[1].taskDefinition' --output text)

# Update service to previous task definition
aws ecs update-service --cluster $CLUSTER_NAME --service $SERVICE_NAME --task-definition $PREVIOUS_IMAGE
```

### Rollback Infrastructure

```bash
cd packages/infrastructure
pulumi stack --show-urns
pulumi destroy  # Use with caution!
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

- [ ] All secrets in AWS Secrets Manager (not in code)
- [ ] Database not publicly accessible
- [ ] HTTPS enabled (CloudFront)
- [ ] Security groups properly configured
- [ ] Regular security updates
- [ ] Monitoring and alerting configured
- [ ] Backup strategy in place

