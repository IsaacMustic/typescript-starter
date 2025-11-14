# Next.js 16 + Pulumi AWS Production Starter Template

## Overview
A production-ready, full-stack TypeScript starter template with Next.js 16 frontend/backend, AWS infrastructure managed by Pulumi, PostgreSQL with Drizzle ORM, and complete SaaS features including authentication, payments, monitoring, and email.

---

## Tech Stack

### Frontend
- **Next.js 16** (App Router with React Server Components)
- **React 19**
- **TypeScript 5.7+**
- **Tailwind CSS 4** for styling
- **shadcn/ui** for a component library (Radix UI primitives)
- **Lucide React** for icons
- **React Hook Form** for form state management
- **next-themes** for dark mode support

### Backend
- **Next.js 16 API Routes** (App Router route handlers)
- **tRPC 11** for type-safe API layer
- **Zod** for runtime validation and schema definition
- **Better Auth** for authentication (email/password, OAuth providers)
- **Stripe** for payment processing and subscription management
- **React Email** for transactional emails
- **Upstash Rate Limit** for API rate limiting and abuse prevention

### Database
- **PostgreSQL 16** (AWS RDS)
- **Drizzle ORM** for type-safe database queries
- **Drizzle Kit** for migrations and schema management
- **Drizzle Studio** for database GUI

### Infrastructure (AWS via Pulumi)
- **Pulumi** (TypeScript) for Infrastructure as Code
- **AWS S3** for static asset storage
- **AWS CloudFront** for CDN and edge caching
- **AWS RDS PostgreSQL** for database
- **AWS VPC** for network isolation
- **AWS Secrets Manager** for sensitive credentials
- **AWS SES** for sending transactional emails
- **AWS ECR** for container registry
- **AWS ECS Fargate** for Next.js app hosting
- **AWS Application Load Balancer** for traffic distribution
- **AWS CloudWatch** for logging and monitoring

### Monitoring & Observability
- **Sentry** for error tracking and performance monitoring
- **Pino** for structured JSON logging
- **PostHog** for product analytics and feature flags
- **Better Uptime** for uptime monitoring and status pages
- **AWS CloudWatch** for infrastructure metrics and alarms

### Developer Experience
- **Turborepo** for monorepo management
- **Biome** for linting and formatting
- **Vitest** for unit and integration testing
- **Playwright** for E2E testing
- **tsx** for running TypeScript scripts
- **t3-env** for type-safe environment variables
- **Docker** for containerization
- **pnpm** for package management

---

## Project Structure

```
/
├── apps/
│   └── web/                    # Next.js 16 application
│       ├── app/                # Next.js App Router
│       │   ├── (auth)/         # Auth-related pages (login, signup)
│       │   ├── (dashboard)/    # Protected dashboard pages
│       │   ├── (marketing)/    # Public marketing pages
│       │   ├── api/            # API route handlers
│       │   │   ├── trpc/       # tRPC endpoint
│       │   │   ├── auth/       # Better Auth endpoints
│       │   │   ├── webhooks/   # Webhook handlers (Stripe, etc.)
│       │   │   └── health/     # Health check endpoint
│       │   ├── layout.tsx
│       │   └── page.tsx
│       ├── components/         # React components
│       │   ├── ui/             # shadcn/ui components
│       │   ├── auth/           # Auth-specific components
│       │   ├── billing/        # Stripe/billing components
│       │   └── ...             # Custom components
│       ├── emails/             # React Email templates
│       │   ├── welcome.tsx
│       │   ├── password-reset.tsx
│       │   ├── payment-success.tsx
│       │   └── ...
│       ├── lib/                # Utility functions
│       │   ├── auth.ts         # Better Auth configuration
│       │   ├── db.ts           # Drizzle client setup
│       │   ├── trpc.ts         # tRPC client setup
│       │   ├── stripe.ts       # Stripe client setup
│       │   ├── email.ts        # Email sending utilities
│       │   ├── rate-limit.ts   # Upstash rate limiting
│       │   ├── logger.ts       # Pino logger configuration
│       │   └── analytics.ts    # PostHog client
│       ├── server/             # Server-side code
│       │   ├── db/             # Database schema and queries
│       │   │   ├── schema/     # Drizzle schema definitions
│       │   │   │   ├── auth.ts # Auth tables (users, sessions, accounts)
│       │   │   │   ├── billing.ts # Billing tables (subscriptions, invoices)
│       │   │   │   └── app.ts  # Application tables (todos, etc.)
│       │   │   └── index.ts
│       │   ├── trpc/           # tRPC router and procedures
│       │   │   ├── routers/
│       │   │   │   ├── auth.ts
│       │   │   │   ├── user.ts
│       │   │   │   ├── billing.ts
│       │   │   │   └── todo.ts
│       │   │   ├── middleware/ # tRPC middleware
│       │   │   │   ├── rate-limit.ts
│       │   │   │   ├── auth.ts
│       │   │   │   └── logging.ts
│       │   │   ├── context.ts
│       │   │   └── root.ts
│       │   ├── services/       # Business logic services
│       │   │   ├── stripe.ts   # Stripe service layer
│       │   │   └── email.ts    # Email service layer
│       │   └── auth.ts         # Server-side auth utilities
│       ├── hooks/              # Custom React hooks
│       │   ├── use-user.ts
│       │   ├── use-subscription.ts
│       │   └── ...
│       ├── types/              # TypeScript type definitions
│       │   ├── stripe.ts
│       │   └── ...
│       ├── public/             # Static assets
│       ├── drizzle/            # Migration files
│       ├── tests/              # Test files
│       │   ├── unit/
│       │   ├── integration/
│       │   └── e2e/
│       ├── env.ts              # Environment variable validation (t3-env)
│       ├── Dockerfile          # Container definition
│       ├── next.config.ts
│       ├── tailwind.config.ts
│       ├── tsconfig.json
│       ├── drizzle.config.ts
│       ├── vitest.config.ts
│       ├── playwright.config.ts
│       ├── sentry.client.config.ts
│       ├── sentry.server.config.ts
│       └── package.json
│
├── packages/
│   └── infrastructure/         # Pulumi IaC
│       ├── index.ts            # Main Pulumi program
│       ├── network.ts          # VPC, subnets, security groups
│       ├── database.ts         # RDS PostgreSQL
│       ├── storage.ts          # S3 buckets
│       ├── cdn.ts              # CloudFront distribution
│       ├── compute.ts          # ECS/App Runner for Next.js
│       ├── secrets.ts          # Secrets Manager
│       ├── email.ts            # SES configuration
│       ├── monitoring.ts       # CloudWatch alarms and dashboards
│       ├── config.ts           # Pulumi configuration
│       ├── Pulumi.yaml
│       ├── Pulumi.dev.yaml
│       ├── Pulumi.prod.yaml
│       ├── tsconfig.json
│       └── package.json
│
├── turbo.json                  # Turborepo configuration
├── package.json                # Root package.json
├── pnpm-workspace.yaml         # pnpm workspace configuration
├── biome.json                  # Biome configuration
├── .env.example
├── .sentryclirc                # Sentry CLI configuration
├── docker-compose.yml          # Local development services
└── README.md
```

---

## Infrastructure Architecture

### Network Layer
**VPC Configuration:**
- Create a VPC with CIDR block 10.0.0.0/16
- Public subnets (10.0.1.0/24, 10.0.2.0/24) in 2 availability zones for load balancer
- Private subnets (10.0.10.0/24, 10.0.11.0/24) in 2 availability zones for ECS tasks
- Database subnets (10.0.20.0/24, 10.0.21.0/24) in 2 availability zones for RDS
- Internet Gateway for public subnet access
- NAT Gateway in public subnets for private subnet internet access
- Route tables configured appropriately

**Security Groups:**
- ALB Security Group: Allow inbound 80/443 from 0.0.0.0/0
- ECS Security Group: Allow inbound from ALB security group only
- RDS Security Group: Allow inbound 5432 from ECS security group only

### Database Layer
**RDS PostgreSQL:**
- PostgreSQL 16.x engine
- Instance class: db.t4g.micro (dev) / db.t4g.medium (prod)
- Multi-AZ deployment for production
- Automated backups with 7-day retention
- Placed in private database subnets
- Parameter group for connection pooling optimization
- Encryption at rest enabled
- Database name, master username stored in Secrets Manager

### Compute Layer
**ECS Fargate:**
- ECS Cluster with Fargate launch type
- Task Definition:
    - Next.js container (built from Dockerfile)
    - 0.5 vCPU, 1GB memory (dev) / 1 vCPU, 2GB memory (prod)
    - Environment variables from Secrets Manager
    - CloudWatch Logs for container logs
    - Sentry DSN for error tracking
- ECS Service:
    - Desired count: 2 (for high availability)
    - Target group registration
    - Auto-scaling based on CPU/memory (50-75% threshold)
    - Health checks configured
- Application Load Balancer:
    - Public-facing in public subnets
    - Target group pointing to ECS service
    - Health check path: /api/health
    - HTTPS listener (certificate from ACM)
    - HTTP → HTTPS redirect

### Storage & CDN Layer
**S3 Buckets:**
- Static assets bucket for Next.js build output
- Bucket policy allowing CloudFront OAI access only
- Server-side encryption enabled
- Lifecycle policies for cost optimization

**CloudFront Distribution:**
- Origin: Application Load Balancer
- Origin Protocol Policy: HTTPS only
- Cache behaviors:
    - `/_next/static/*` - long cache (1 year)
    - `/api/*` - no cache
    - `/*` - short cache (5 minutes) with stale-while-revalidate
- Custom domain with ACM certificate
- HTTP/2 and HTTP/3 enabled
- Compression enabled (gzip, brotli)
- Origin request headers forwarded for authentication

### Email Layer
**AWS SES:**
- Verified domain for sending emails
- DKIM and SPL records configured
- Bounce and complaint handling with SNS
- Configuration set for tracking
- Production access (move out of sandbox)

### Secrets & Configuration
**AWS Secrets Manager:**
- Database credentials (auto-rotated)
- Better Auth secret
- OAuth provider secrets (Google, GitHub)
- Stripe API keys (publishable and secret)
- Sentry DSN
- PostHog API key
- Upstash Redis credentials
- External service credentials

### Monitoring & Alerting
**CloudWatch:**
- Log groups for ECS tasks (30-90 day retention)
- Custom metrics from application
- Dashboards showing:
    - ECS CPU/memory utilization
    - RDS connections, CPU, storage
    - ALB request count, latency, error rates
    - CloudFront cache hit ratio
    - Custom business metrics (signups, payments)
- Alarms for:
    - High CPU/memory on ECS tasks
    - RDS connection threshold
    - ALB 5xx error rate spike
    - CloudFront origin errors
    - Failed Stripe webhooks

**Sentry:**
- Error tracking for frontend and backend
- Performance monitoring for slow transactions
- Release tracking with source maps
- Alert rules for new errors or error spikes

**Better Uptime:**
- HTTP checks every 30 seconds
- Multi-region monitoring
- Status page for customers
- Incident notifications via Slack/email

### Container Registry
**ECR Repository:**
- Private repository for Next.js Docker images
- Image scanning enabled
- Lifecycle policy: Keep last 10 images only
- Pull through cache for base images

---

## Database Schema Design

### Auth Tables (Better Auth)

**users table:**
- id (UUID, primary key)
- email (unique, not null)
- emailVerified (timestamp, nullable)
- name (text, nullable)
- image (text, nullable)
- stripeCustomerId (text, nullable, unique) - Link to Stripe customer
- createdAt (timestamp, default now())
- updatedAt (timestamp, default now())
- Index on email
- Index on stripeCustomerId

**sessions table:**
- id (text, primary key)
- userId (UUID, foreign key to users)
- expiresAt (timestamp)
- ipAddress (text, nullable)
- userAgent (text, nullable)
- Index on userId
- Index on expiresAt

**accounts table (OAuth):**
- id (UUID, primary key)
- userId (UUID, foreign key to users)
- provider (text, e.g., 'google', 'github')
- providerAccountId (text)
- accessToken (text, nullable)
- refreshToken (text, nullable)
- expiresAt (timestamp, nullable)
- Unique constraint on (provider, providerAccountId)
- Index on userId

**verificationTokens table:**
- identifier (text, email or user id)
- token (text, unique)
- expires (timestamp)
- Unique constraint on (identifier, token)

### Billing Tables (Stripe Integration)

**subscriptions table:**
- id (UUID, primary key)
- userId (UUID, foreign key to users, unique)
- stripeSubscriptionId (text, unique, not null)
- stripePriceId (text, not null) - Which plan they're on
- stripeCurrentPeriodEnd (timestamp)
- status (enum: 'active', 'canceled', 'incomplete', 'past_due', 'trialing', 'unpaid')
- cancelAtPeriodEnd (boolean, default false)
- createdAt (timestamp, default now())
- updatedAt (timestamp, default now())
- Index on userId
- Index on stripeSubscriptionId
- Index on status

**invoices table:**
- id (UUID, primary key)
- userId (UUID, foreign key to users)
- stripeInvoiceId (text, unique, not null)
- amountPaid (integer) - Amount in cents
- currency (text, default 'usd')
- status (enum: 'draft', 'open', 'paid', 'uncollectible', 'void')
- hostedInvoiceUrl (text, nullable)
- invoicePdf (text, nullable)
- createdAt (timestamp, default now())
- Index on userId
- Index on stripeInvoiceId
- Index on status

**products table (Stripe plans cache):**
- id (UUID, primary key)
- stripePriceId (text, unique, not null)
- stripeProductId (text, not null)
- name (text, not null)
- description (text, nullable)
- price (integer) - Amount in cents
- interval (enum: 'month', 'year')
- features (jsonb) - Array of features
- active (boolean, default true)
- createdAt (timestamp, default now())
- updatedAt (timestamp, default now())
- Index on stripePriceId
- Index on active

### Application Tables

**todos table (example business logic):**
- id (UUID, primary key)
- userId (UUID, foreign key to users)
- title (text, not null)
- description (text, nullable)
- completed (boolean, default false)
- createdAt (timestamp, default now())
- updatedAt (timestamp, default now())
- Index on userId
- Index on (userId, completed)

### Indexes Strategy
- All foreign keys have indexes
- Composite indexes for common query patterns
- Unique indexes for external IDs (Stripe)
- Partial indexes for active subscriptions

### Migration Strategy
- Use Drizzle Kit for generating migrations from schema
- Run migrations during deployment via init container or Pulumi automation
- Migrations must be backward compatible for zero-downtime deploys
- Store migration state in database (Drizzle's default behavior)

---

## Application Features

### Authentication System
**Better Auth Configuration:**
- Email/password authentication with email verification
- OAuth providers: Google, GitHub
- Session management with secure HTTP-only cookies
- Protected routes using middleware
- User profile management
- Password reset flow with time-limited tokens
- Email change with verification
- Account deletion with data cleanup

**Auth Pages:**
- `/login` - Login form with email/password and OAuth buttons
- `/signup` - Registration form with email verification
- `/forgot-password` - Password reset request
- `/reset-password/[token]` - Password reset form
- `/verify-email/[token]` - Email verification callback
- Middleware redirects: authenticated users away from auth pages, unauthenticated users to login

### Billing & Subscription System
**Stripe Integration:**
- Multiple subscription tiers (Free, Pro, Enterprise)
- Monthly and annual billing options
- Upgrade/downgrade flows
- Cancellation flow (with feedback collection)
- Invoice history and PDF downloads
- Payment method management
- Webhook handling for:
    - `checkout.session.completed` - New subscription
    - `customer.subscription.updated` - Subscription changes
    - `customer.subscription.deleted` - Cancellation
    - `invoice.payment_succeeded` - Successful payment
    - `invoice.payment_failed` - Failed payment

**Billing Pages:**
- `/dashboard/billing` - Current plan, usage, and billing details
- `/dashboard/billing/plans` - View and select plans
- `/dashboard/billing/checkout` - Stripe Checkout integration
- `/dashboard/billing/portal` - Redirect to Stripe Customer Portal
- `/dashboard/billing/invoices` - Invoice history

**Subscription Features:**
- Feature gating based on subscription tier
- Usage tracking and limits
- Grace period for failed payments
- Email notifications for billing events
- Prorated upgrades/downgrades

### Dashboard Application
**Protected Routes (requires authentication):**
- `/dashboard` - Main dashboard overview with stats
- `/dashboard/todos` - Todo list management (CRUD operations)
- `/dashboard/profile` - User profile settings
- `/dashboard/settings` - Application preferences
- `/dashboard/billing` - Billing and subscription management
- `/dashboard/usage` - Usage statistics and analytics

**Public Routes:**
- `/` - Landing page with hero, features, pricing, testimonials
- `/pricing` - Pricing table with plan comparison
- `/about` - About page
- `/docs` - Documentation
- `/blog` - Blog posts (optional)
- `/terms` - Terms of service
- `/privacy` - Privacy policy
- `/status` - Status page (Better Uptime)

### API Layer (tRPC)

**Router Structure:**
```
/api/trpc
├── auth.* - Authentication procedures
├── user.* - User management
├── billing.* - Subscription and billing
└── todo.* - Todo CRUD operations
```

**Auth Router:**
- `auth.getSession` - Get current user session
- `auth.signOut` - Sign out user

**User Router:**
- `user.getProfile` - Get user profile
- `user.updateProfile` - Update user profile (name, image)
- `user.changeEmail` - Change email with verification
- `user.deleteAccount` - Delete account with data cleanup

**Billing Router:**
- `billing.getSubscription` - Get current subscription details
- `billing.getPlans` - Get available subscription plans
- `billing.createCheckoutSession` - Create Stripe Checkout session
- `billing.createPortalSession` - Create Stripe Customer Portal session
- `billing.cancelSubscription` - Cancel subscription at period end
- `billing.reactivateSubscription` - Reactivate canceled subscription
- `billing.getInvoices` - Get invoice history
- `billing.getUsage` - Get usage statistics

**Todo Router:**
- `todo.getAll` - Get all todos for current user (with pagination)
- `todo.getById` - Get single todo by ID
- `todo.create` - Create new todo
- `todo.update` - Update existing todo
- `todo.delete` - Delete todo
- `todo.toggleComplete` - Toggle completion status
- `todo.deleteCompleted` - Bulk delete completed todos

**tRPC Middleware:**
- Authentication middleware - Verify user session
- Rate limiting middleware - Prevent abuse
- Logging middleware - Log all requests with Pino
- Error handling middleware - Format errors for Sentry
- Analytics middleware - Track procedure calls in PostHog

### Email System
**React Email Templates:**
- Welcome email - Sent on signup
- Email verification - Link to verify email
- Password reset - Time-limited reset link
- Email change confirmation - Verify new email
- Payment successful - Receipt for successful payment
- Payment failed - Alert for failed payment with retry link
- Subscription canceled - Confirmation of cancellation
- Trial ending - Reminder before trial ends
- Usage limit warning - Alert when approaching limits

**Email Sending:**
- Use AWS SES for sending
- Retry logic for failed sends
- Track email events (delivered, bounced, complained)
- Unsubscribe handling
- Email preferences per user

### Rate Limiting
**Upstash Redis Configuration:**
- Sliding window rate limiting
- Different limits per endpoint:
    - Auth endpoints: 5 requests/minute
    - API endpoints: 100 requests/minute (authenticated)
    - Webhook endpoints: No limit (verified by signature)
    - Public endpoints: 20 requests/minute (by IP)
- Rate limit headers in responses
- Custom error messages with retry-after

### Logging
**Pino Configuration:**
- Structured JSON logging
- Different log levels (debug, info, warn, error)
- Request ID tracking across services
- User ID in logs (when authenticated)
- Stripe webhook event logging
- Database query logging (in development)
- CloudWatch integration for production

### Analytics
**PostHog Integration:**
- Track key events:
    - User signup
    - User login
    - Subscription created/updated/canceled
    - Feature usage (todos created, etc.)
    - Page views
- User properties:
    - Subscription tier
    - Account age
    - Usage metrics
- Feature flags for gradual rollouts
- A/B testing support
- Session recording (opt-in)

### Error Tracking
**Sentry Configuration:**
- Frontend error boundary
- Backend error handler
- Source maps for production
- Breadcrumbs for context
- User context (ID, email, subscription)
- Release tracking
- Performance monitoring:
    - Slow API calls
    - Database query performance
    - Frontend page load times

### UI Components (shadcn/ui)

**Core Components:**
- Button, Input, Label, Textarea
- Card, Dialog, Sheet, Popover
- DropdownMenu, Select, Checkbox, RadioGroup
- Form components with react-hook-form integration
- Toast notifications for user feedback
- Loading states and skeleton loaders
- Data table component with sorting, filtering, pagination
- Theme provider for dark/light mode

**Custom Components:**
- Navigation bar with user menu
- Sidebar for dashboard navigation
- Todo item component with actions
- Auth forms (login, signup) with validation
- Profile form with image upload
- Settings panel
- Pricing cards for subscription plans
- Invoice list with download buttons
- Subscription management card
- Usage metrics dashboard
- Billing alert banners

### Styling & Theming
- Tailwind CSS 4 configured with custom design tokens
- Dark mode support using next-themes
- Responsive design for mobile, tablet, desktop
- shadcn/ui theme customization in tailwind.config
- CSS variables for consistent theming
- Accessible color contrast ratios

---

## Development Workflow

### Local Development Setup
1. Clone repository: `git clone <repo>`
2. Install dependencies: `pnpm install`
3. Copy environment variables: `cp .env.example .env.local`
4. Start local services: `docker-compose up -d` (PostgreSQL, Redis)
5. Generate Drizzle schema: `pnpm db:generate`
6. Run migrations: `pnpm db:migrate`
7. Seed database: `pnpm db:seed` (creates example plans and data)
8. Start development server: `pnpm dev`
9. Open Drizzle Studio: `pnpm db:studio` (database GUI)

### Environment Variables (.env.example)
```
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# Better Auth
BETTER_AUTH_SECRET=your-secret-key-min-32-chars
BETTER_AUTH_URL=http://localhost:3000

# OAuth Providers
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Email (AWS SES)
AWS_SES_REGION=us-east-1
AWS_SES_FROM_EMAIL=noreply@yourdomain.com
AWS_SES_FROM_NAME=Your App

# Upstash Redis (Rate Limiting)
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...

# Sentry
SENTRY_DSN=https://...
NEXT_PUBLIC_SENTRY_DSN=https://...
SENTRY_ORG=your-org
SENTRY_PROJECT=your-project
SENTRY_AUTH_TOKEN=...

# PostHog
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# AWS (for local Pulumi operations)
AWS_REGION=us-east-1
AWS_ACCOUNT_ID=123456789012

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### Package.json Scripts
```json
{
  "scripts": {
    "dev": "next dev --turbo",
    "build": "next build",
    "start": "next start",
    "lint": "biome check .",
    "lint:fix": "biome check --write .",
    "format": "biome format --write .",
    "type-check": "tsc --noEmit",
    
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio",
    "db:seed": "tsx scripts/seed.ts",
    
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    
    "email:dev": "email dev",
    
    "pulumi:preview": "cd ../infrastructure && pulumi preview",
    "pulumi:up": "cd ../infrastructure && pulumi up",
    "pulumi:destroy": "cd ../infrastructure && pulumi destroy",
    
    "docker:build": "docker build -t nextjs-app .",
    "docker:run": "docker run -p 3000:3000 nextjs-app"
  }
}
```

### Testing Strategy

**Unit Tests (Vitest):**
- Test tRPC procedures with mocked database
- Test utility functions and helpers
- Test React components in isolation
- Test email templates
- Test Stripe webhook handlers
- Coverage threshold: 80%

**Integration Tests (Vitest):**
- Test API routes with test database
- Test database queries and migrations
- Test authentication flows
- Test Stripe integration with test mode
- Test email sending (mocked)

**E2E Tests (Playwright):**
- Critical user flows:
    - Signup → Email verification → Login
    - Create subscription → Successful payment
    - CRUD operations on todos
    - Profile updates
    - Subscription cancellation
- Test across browsers (Chromium, Firefox, WebKit)
- Visual regression testing
- Accessibility testing

### Docker Configuration

**Development (docker-compose.yml):**
```yaml
services:
  postgres:
    image: postgres:16-alpine
    ports: ["5432:5432"]
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: dbname
    volumes:
      - postgres_data:/var/lib/postgresql/data
  
  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]
```

**Production (Dockerfile):**
- Multi-stage build
- Node 20 Alpine base image
- Production dependencies only
- Next.js standalone output
- Non-root user
- Health check endpoint
- Optimized layer caching

### CI/CD Pipeline (GitHub Actions)

**Pull Request Workflow:**
1. Checkout code
2. Setup Node.js and pnpm
3. Install dependencies
4. Lint and format check (Biome)
5. Type check (TypeScript)
6. Run unit tests (Vitest)
7. Build Next.js application
8. Run integration tests
9. Build Docker image
10. Pulumi preview (comment on PR with changes)

**Main Branch Workflow:**
1. All PR workflow steps
2. Build and tag Docker image with commit SHA
3. Push image to AWS ECR
4. Run E2E tests against staging
5. Pulumi up to staging environment
6. Run smoke tests
7. Manual approval gate
8. Pulumi up to production environment
9. Run E2E tests against production
10. Create Sentry release
11. Notify team (Slack)
12. Rollback on failure

**Scheduled Workflows:**
- Dependency updates (Dependabot)
- Security scanning (npm audit, Snyk)
- Nightly E2E tests
- Database backup verification

---

## Deployment Strategy

### Environments

**Development (dev stack):**
- Smaller RDS instance (db.t4g.micro)
- Single ECS task
- Longer cache TTLs
- Debug logging enabled
- Test mode Stripe keys
- PostHog development project

**Staging (staging stack):**
- Same configuration as production
- Separate database
- Test mode Stripe keys
- Used for final QA before production

**Production (prod stack):**
- Larger RDS instance (db.t4g.medium+)
- Multi-AZ RDS deployment
- Minimum 2 ECS tasks
- Auto-scaling enabled
- Production Stripe keys
- Shorter cache TTLs
- Enhanced monitoring

### Deployment Process

**Automated Deployment (on merge to main):**
1. CI builds Docker image with git SHA tag
2. Image pushed to ECR
3. Pulumi updates ECS task definition with new image
4. ECS performs rolling deployment:
    - Start new tasks with new image
    - Wait for health checks to pass
    - Drain connections from old tasks
    - Terminate old tasks
5. Zero downtime achieved
6. Sentry notified of new release
7. PostHog notified of deployment

**Manual Deployment (emergency):**
1. Build image locally: `pnpm docker:build`
2. Tag and push to ECR
3. Run Pulumi update: `pnpm pulumi:up`

### Database Migrations

**Development:**
- Run migrations automatically on app start
- Use `drizzle-kit push` for rapid iteration

**Production:**
- Migrations run in init container before app deployment
- Backward compatible migrations only
- Schema changes deployed separately from code changes
- Database backup before major migrations
- Rollback plan for each migration

### Rollback Strategy
- Keep last 10 Docker images in ECR
- Pulumi state allows instant rollback: `pulumi up --target-dependents urn:...:previous-version`
- Database migrations should be backward compatible
- Can manually update ECS service to use previous task definition
- Automated rollback on health check failures

### Blue-Green Deployment (Optional Enhancement)
- Maintain two identical environments
- Switch traffic via Route53 weighted routing
- Full rollback capability
- Increased cost (2x infrastructure)

---

## Stripe Integration Details

### Product Setup

**Subscription Plans:**
```typescript
// Free Tier
{
  name: "Free",
  price: 0,
  interval: null,
  features: [
    "Up to 10 todos",
    "Basic support",
    "Community access"
  ]
}

// Pro Tier
{
  name: "Pro",
  price: 1999, // $19.99/month
  interval: "month",
  stripePriceId: "price_...",
  features: [
    "Unlimited todos",
    "Priority support",
    "Advanced analytics",
    "Export data",
    "API access"
  ]
}

// Pro Annual
{
  name: "Pro Annual",
  price: 19999, // $199.99/year (2 months free)
  interval: "year",
  stripePriceId: "price_...",
  features: [
    "All Pro features",
    "2 months free",
    "Annual invoicing"
  ]
}
```

### Checkout Flow

**1. User selects plan on pricing page:**
- Click "Upgrade to Pro" button
- Frontend calls `billing.createCheckoutSession` tRPC procedure

**2. Backend creates Stripe Checkout Session:**
```typescript
// server/services/stripe.ts
const session = await stripe.checkout.sessions.create({
  customer: user.stripeCustomerId,
  line_items: [{ price: stripePriceId, quantity: 1 }],
  mode: 'subscription',
  success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?success=true`,
  cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?canceled=true`,
  metadata: { userId: user.id }
});
```

**3. User redirected to Stripe Checkout:**
- Stripe handles payment form
- PCI compliance handled by Stripe
- Multiple payment methods supported

**4. Webhook handles successful payment:**
- `checkout.session.completed` webhook received
- Create subscription record in database
- Update user's stripeCustomerId if new customer
- Send "payment successful" email
- Track event in PostHog

**5. User redirected back to app:**
- Success page shows confirmation
- Dashboard now shows Pro features unlocked

### Webhook Handling

**Webhook Endpoint (`/api/webhooks/stripe`):**
- Verify webhook signature using `STRIPE_WEBHOOK_SECRET`
- Parse event type and data
- Handle events in transaction for data consistency
- Return 200 immediately to Stripe
- Process async work after response

**Handled Events:**

**`checkout.session.completed`:**
- Create or update subscription record
- Link customer to user
- Send welcome email
- Track signup in PostHog

**`customer.subscription.updated`:**
- Update subscription status
- Update plan if changed (upgrade/downgrade)
- Update billing period end date
- Handle trial_end, cancellation scheduling

**`customer.subscription.deleted`:**
- Mark subscription as canceled
- Downgrade user to free tier
- Send cancellation confirmation email
- Schedule data retention policy

**`invoice.payment_succeeded`:**
- Record invoice in database
- Send receipt email
- Track payment in PostHog
- Reset usage counters (if applicable)

**`invoice.payment_failed`:**
- Update subscription status to past_due
- Send payment failed email with retry link
- Track failed payment
- Start grace period (3-7 days)

**`customer.subscription.trial_will_end`:**
- Send reminder email 3 days before trial ends
- Encourage payment method addition

### Customer Portal

**Stripe Customer Portal:**
- Managed by Stripe (no custom code needed)
- Allows users to:
    - Update payment method
    - View invoice history
    - Download invoices
    - Update billing information
    - Cancel subscription

**Integration:**
```typescript
// billing.createPortalSession
const session = await stripe.billingPortal.sessions.create({
  customer: user.stripeCustomerId,
  return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing`
});
// Redirect user to session.url
```

### Feature Gating

**Subscription-based Access Control:**
```typescript
// lib/subscription.ts
export function hasFeature(user: User, feature: string): boolean {
  const plan = user.subscription?.plan;
  
  if (!plan) return FREE_FEATURES.includes(feature);
  
  return PLAN_FEATURES[plan].includes(feature);
}

// Usage in tRPC procedure
export const createTodo = protectedProcedure
  .input(z.object({ title: z.string() }))
  .mutation(async ({ ctx, input }) => {
    const todoCount = await ctx.db.query.todos.count({
      where: eq(todos.userId, ctx.user.id)
    });
    
    // Feature gate: free users limited to 10 todos
    if (!hasFeature(ctx.user, 'unlimited_todos') && todoCount >= 10) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Upgrade to Pro for unlimited todos'
      });
    }
    
    // Create todo...
  });
```

### Usage Tracking

**Track usage metrics for billing:**
- Count todos created per user
- Track API requests
- Monitor storage usage
- Log feature usage
- Store in database or Redis for real-time access

### Cancellation Flow

**User-initiated cancellation:**
1. User clicks "Cancel Subscription" in billing settings
2. Show cancellation confirmation dialog
3. Optionally collect cancellation reason (feedback)
4. Call `billing.cancelSubscription` tRPC procedure
5. Backend calls Stripe: `stripe.subscriptions.update(id, { cancel_at_period_end: true })`
6. Update database to reflect pending cancellation
7. Send cancellation confirmation email
8. User retains access until period end
9. On period end, webhook downgrades user to free tier

**Reactivation:**
- User can reactivate before period end
- Call `billing.reactivateSubscription`
- Update Stripe: `stripe.subscriptions.update(id, { cancel_at_period_end: false })`
- Update database
- Send reactivation confirmation email

---

## Monitoring & Observability

### Application Monitoring

**Sentry Configuration:**
- **Frontend (`sentry.client.config.ts`):**
    - Error boundary wraps entire app
    - Automatic error tracking
    - Session replay for debugging
    - User feedback widget
    - Performance monitoring (Web Vitals)

- **Backend (`sentry.server.config.ts`):**
    - Express/Next.js integration
    - Automatic error tracking
    - Performance monitoring for API routes
    - Database query tracking
    - Stripe webhook error tracking

**Sentry Features:**
- Release tracking (tied to git SHA)
- Source maps uploaded in CI/CD
- Email alerts for new errors
- Slack integration for critical errors
- Custom error grouping rules
- User feedback collection

### Logging Strategy

**Pino Logger Configuration:**
```typescript
// lib/logger.ts
import pino from 'pino';

export const logger = pino({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  formatters: {
    level: (label) => ({ level: label }),
  },
  serializers: {
    req: pino.stdSerializers.req,
    res: pino.stdSerializers.res,
    err: pino.stdSerializers.err,
  },
  // CloudWatch-friendly JSON format
  timestamp: () => `,"time":"${new Date().toISOString()}"`,
});
```

**Logging Patterns:**
- Request/response logging in middleware
- Database query logging (development only)
- Stripe webhook events
- Authentication events (login, logout, failed attempts)
- Subscription events
- Error logging with context
- Performance metrics

**Log Levels:**
- `debug`: Detailed debugging information
- `info`: General informational messages
- `warn`: Warning messages (non-critical issues)
- `error`: Error messages with stack traces
- `fatal`: Critical errors requiring immediate attention

### CloudWatch Integration

**Log Groups:**
- `/aws/ecs/web-app-dev` - Development logs
- `/aws/ecs/web-app-prod` - Production logs
- `/aws/rds/postgresql` - Database logs
- `/aws/lambda/migrations` - Migration logs

**CloudWatch Insights Queries:**
- Top error messages
- Slowest API routes
- Failed authentication attempts
- Stripe webhook failures
- High memory usage tasks

**CloudWatch Dashboards:**

**Application Dashboard:**
- Request count (per minute)
- Average response time
- Error rate (5xx)
- Active users (from session count)
- Subscription signups (per day)
- Revenue metrics (from Stripe)

**Infrastructure Dashboard:**
- ECS CPU utilization
- ECS memory utilization
- RDS connections
- RDS CPU/memory
- ALB target health
- CloudFront cache hit ratio

**Business Metrics Dashboard:**
- Daily active users
- New signups
- Trial conversions
- Churn rate
- MRR (Monthly Recurring Revenue)
- Active subscriptions by plan

### CloudWatch Alarms

**Critical Alarms (PagerDuty/Phone):**
- ECS service unhealthy (no healthy tasks)
- RDS instance down
- ALB 5xx error rate > 5% for 5 minutes
- Failed Stripe webhook rate > 50%

**Warning Alarms (Email/Slack):**
- ECS CPU > 80% for 10 minutes
- ECS memory > 80% for 10 minutes
- RDS connections > 80% of max
- RDS storage < 20% free
- ALB 4xx error rate spike
- Slow API response time (p95 > 2s)

**Business Alarms:**
- Failed payment rate > 10%
- Signup conversion rate drops > 50%
- Churn rate spike

### Uptime Monitoring

**Better Uptime Configuration:**
- **Health Checks:**
    - HTTPS check every 30 seconds from 10+ locations
    - Check `/api/health` endpoint
    - Verify response time < 2s
    - Check SSL certificate validity

- **Status Page:**
    - Public status page for customers
    - Show uptime percentage
    - Incident history
    - Subscribe to updates

- **Integrations:**
    - Slack notifications for downtime
    - Email alerts to on-call engineer
    - PagerDuty integration for critical issues
    - Webhook to trigger automated recovery

**Monitored Endpoints:**
- `/` - Homepage
- `/api/health` - Health check
- `/api/trpc` - API availability
- `/dashboard` - Authenticated routes

### Analytics & Product Metrics

**PostHog Configuration:**
- **Event Tracking:**
  ```typescript
  // Track key events
  posthog.capture('user_signed_up', {
    method: 'email', // or 'google', 'github'
    $set: { email: user.email }
  });
  
  posthog.capture('subscription_created', {
    plan: 'pro',
    interval: 'month',
    amount: 1999
  });
  
  posthog.capture('todo_created', {
    userId: user.id
  });
  ```

- **User Properties:**
  ```typescript
  posthog.identify(user.id, {
    email: user.email,
    name: user.name,
    subscription_plan: user.subscription?.plan,
    subscription_status: user.subscription?.status,
    created_at: user.createdAt,
  });
  ```

- **Feature Flags:**
    - Gradual feature rollouts
    - A/B testing new features
    - Kill switches for problematic features

- **Session Recording:**
    - Opt-in for authenticated users
    - Privacy controls (mask sensitive data)
    - Replay user sessions for debugging

**Key Metrics to Track:**
- Acquisition: Signups, traffic sources
- Activation: Email verification rate, first todo created
- Retention: Daily/Weekly/Monthly active users
- Revenue: MRR, ARR, LTV
- Referral: Viral coefficient (if applicable)
- Churn: Cancellation rate, reasons

### Performance Monitoring

**Web Vitals (Frontend):**
- Largest Contentful Paint (LCP) < 2.5s
- First Input Delay (FID) < 100ms
- Cumulative Layout Shift (CLS) < 0.1
- Time to First Byte (TTFB) < 600ms

**API Performance (Backend):**
- tRPC procedure timing middleware
- Database query performance
- External API call timing (Stripe, etc.)
- Cache hit rates

**Sentry Performance:**
- Automatic transaction tracking
- Custom spans for critical operations
- Slow query detection
- N+1 query detection

---

## Security Best Practices

### Infrastructure Security

**Network Security:**
- All services in private subnets (except ALB)
- RDS not publicly accessible
- Security groups follow least privilege principle
- VPC Flow Logs enabled for audit trail
- Network ACLs as additional layer

**Data Security:**
- Encryption at rest for RDS (AES-256)
- Encryption in transit (TLS 1.2+ everywhere)
- S3 bucket encryption enabled
- Secrets in AWS Secrets Manager (not env vars)
- Automatic secret rotation for RDS credentials

**Access Control:**
- IAM roles for ECS tasks (no long-lived credentials)
- Least privilege IAM policies
- MFA required for AWS console access
- Audit logging with CloudTrail
- Regular access reviews

**Compliance:**
- SOC 2 compliance preparation
- GDPR compliance (data deletion, portability)
- PCI compliance handled by Stripe
- Regular security audits
- Vulnerability scanning

### Application Security

**Authentication & Sessions:**
- Secure HTTP-only cookies
- CSRF protection enabled
- Session timeout after 30 days inactivity
- Logout invalidates session immediately
- Password requirements: min 8 chars, complexity rules
- bcrypt for password hashing (Better Auth default)
- Rate limiting on auth endpoints

**API Security:**
- Rate limiting per user and per IP
- Input validation on all endpoints (Zod schemas)
- SQL injection prevention (Drizzle parameterized queries)
- XSS protection (React auto-escaping)
- CORS properly configured
- API key authentication for external access (future)

**Stripe Security:**
- Webhook signature verification
- Idempotency keys for API calls
- Customer IDs validated before operations
- Payment data never stored locally
- Stripe Radar for fraud detection

**Email Security:**
- SPF, DKIM, DMARC records configured
- Unsubscribe links in all emails
- Rate limiting on email sending
- Bounce and complaint handling

**Data Privacy:**
- User data deletion on account closure
- Data export functionality (GDPR)
- Privacy policy clearly displayed
- Cookie consent banner
- Opt-out of analytics/tracking

### Security Headers

**Next.js Configuration:**
```typescript
// next.config.ts
{
  headers: async () => [{
    source: '/:path*',
    headers: [
      {
        key: 'X-DNS-Prefetch-Control',
        value: 'on'
      },
      {
        key: 'Strict-Transport-Security',
        value: 'max-age=31536000; includeSubDomains'
      },
      {
        key: 'X-Frame-Options',
        value: 'SAMEORIGIN'
      },
      {
        key: 'X-Content-Type-Options',
        value: 'nosniff'
      },
      {
        key: 'X-XSS-Protection',
        value: '1; mode=block'
      },
      {
        key: 'Referrer-Policy',
        value: 'strict-origin-when-cross-origin'
      },
      {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=()'
      }
    ]
  }]
}
```

**Content Security Policy:**
- Restrict script sources
- Block inline scripts (use nonces)
- Report violations to Sentry

### Dependency Security

**Regular Updates:**
- Dependabot enabled for automatic PRs
- Weekly review of dependency updates
- Security patches applied immediately
- Lock files committed (pnpm-lock.yaml)

**Scanning:**
- `npm audit` in CI pipeline
- Snyk or Trivy for container scanning
- OWASP dependency check
- Fail build on high/critical vulnerabilities

**Supply Chain:**
- Verify package signatures
- Use official base images
- Pin versions in Dockerfile
- Review new dependencies carefully

---

## Cost Optimization

### Development Environment

**Strategies:**
- Use t4g (ARM) instances for better price/performance
- Single-AZ RDS deployment
- Smaller instance sizes (db.t4g.micro, ECS 0.5 vCPU)
- Auto-stop RDS during non-working hours (manual)
- Short CloudWatch log retention (7-14 days)
- Free tier services where possible

**Estimated Monthly Cost:**
- RDS db.t4g.micro: $12-15
- ECS Fargate (1 task @ 0.5 vCPU, 1GB): $12-15
- ALB: $20
- CloudFront: $1-5
- S3 storage: $1-2
- NAT Gateway: $30-35
- Other services: $5-10
- **Total: ~$80-100/month**

### Production Environment

**Optimization Strategies:**
- Reserved Instances for RDS (save 30-60%)
- Compute Savings Plans for ECS (save 15-20%)
- S3 Intelligent-Tiering for automatic cost optimization
- CloudFront caching to reduce origin requests
- RDS read replicas only when needed
- Auto-scaling to match demand
- Spot instances for non-critical workloads (optional)
- Regular cost reviews and rightsizing

**Estimated Monthly Cost (Low Traffic):**
- RDS db.t4g.medium (Multi-AZ, Reserved): $60-80
- ECS Fargate (2 tasks @ 1 vCPU, 2GB): $60-80
- ALB: $20
- CloudFront: $10-30
- S3 storage: $5-10
- NAT Gateway (2 AZs): $60-70
- Secrets Manager: $2-5
- CloudWatch: $5-10
- SES: $1-5
- ECR: $1-5
- **Total: ~$230-330/month**

**Cost Scaling Factors:**
- Database size and IOPS
- Number of ECS tasks (auto-scaling)
- CloudFront bandwidth
- Number of API requests
- Email sending volume
- Log ingestion volume

### Third-Party Service Costs

**Included in Stack:**
- **Stripe**: 2.9% + $0.30 per transaction
- **Sentry**: $26/month (Team plan) or self-hosted free
- **PostHog**: $0/month (under 1M events) → $450/month (10M events)
- **Upstash Redis**: $0.20 per 100K requests
- **Better Uptime**: $10/month (Starter) → $80/month (Pro)

**Cost Management:**
- Use free tiers during development
- Monitor usage to avoid surprise bills
- Set up billing alerts
- Review costs monthly
- Consider self-hosted alternatives (PostHog, Sentry)

---

## Documentation Requirements

### README.md Structure

**Sections to Include:**
1. **Project Overview**
    - What the project does
    - Key features
    - Tech stack summary
    - Links to deployed app (if public)

2. **Prerequisites**
    - Node.js version (20+)
    - pnpm version
    - Docker & Docker Compose
    - AWS account (for deployment)
    - Stripe account (test mode)
    - Other service accounts

3. **Getting Started**
    - Clone repository
    - Install dependencies
    - Environment variable setup
    - Start local services
    - Run migrations
    - Seed database
    - Start development server

4. **Project Structure**
    - High-level folder organization
    - Key directories explained
    - Where to find things

5. **Development**
    - Available scripts
    - Running tests
    - Database management
    - Email preview
    - Stripe testing

6. **Deployment**
    - Infrastructure setup (Pulumi)
    - Environment configuration
    - CI/CD pipeline
    - Deployment process

7. **Testing**
    - Running unit tests
    - Running integration tests
    - Running E2E tests
    - Writing new tests

8. **Contributing**
    - Code style guidelines
    - Commit message conventions
    - Pull request process
    - Code review standards

9. **Troubleshooting**
    - Common issues and solutions
    - Debug tips
    - Where to get help

10. **License**
    - License type (MIT recommended)

### API Documentation

**tRPC Self-Documentation:**
- tRPC procedures are self-documenting via TypeScript
- Use JSDoc comments for additional context
- Example usage in component files
- Error codes and meanings documented

**Generate API Docs (Optional):**
- Use tRPC Panel for interactive testing
- Create Mintlify docs for public APIs
- Include authentication flow diagrams
- Document rate limits and quotas

### Architecture Documentation

**Diagrams to Create:**

1. **System Architecture Diagram:**
    - All AWS services and connections
    - Data flow between services
    - External integrations (Stripe, etc.)

2. **Database Schema Diagram:**
    - All tables and relationships
    - Key indexes
    - Foreign keys

3. **Authentication Flow Diagram:**
    - Login process
    - OAuth flow
    - Session management
    - Password reset flow

4. **Subscription Flow Diagram:**
    - Checkout process
    - Webhook handling
    - Subscription updates
    - Cancellation flow

5. **Deployment Pipeline Diagram:**
    - CI/CD stages
    - Approval gates
    - Rollback process

**Tools for Diagrams:**
- Mermaid (for code-based diagrams in Markdown)
- Excalidraw (for hand-drawn style)
- Lucidchart or draw.io (for professional diagrams)

### Code Documentation

**TypeScript Documentation:**
- Use JSDoc comments for complex functions
- Document non-obvious business logic
- Explain "why" not "what" (code shows what)
- Link to relevant docs/tickets

**Component Documentation:**
- Props interface with JSDoc
- Usage examples
- Accessibility notes
- Performance considerations

**Database Schema Documentation:**
- Table purpose
- Column descriptions
- Index rationale
- Migration notes

---

## Future Enhancements (Roadmap)

### Phase 2 Features

**Multi-Tenancy:**
- Organizations/teams
- User roles and permissions
- Team billing
- Shared resources

**Advanced Features:**
- File upload to S3 with presigned URLs
- Real-time collaboration (WebSockets)
- Advanced search (Typesense/Meilisearch)
- Export data (CSV, JSON)
- API keys for programmatic access
- Webhooks for integrations

**Background Jobs:**
- Trigger.dev or Inngest integration
- Scheduled reports
- Data cleanup tasks
- Batch operations

**Communication:**
- In-app notifications
- Push notifications (web/mobile)
- SMS notifications (Twilio)
- Slack/Discord integrations

### Phase 3 Features

**Mobile App:**
- React Native app
- Share code with web app (tRPC, shared types)
- Push notifications
- Offline support

**Advanced Analytics:**
- Custom dashboards
- Advanced reporting
- Data exports
- BI tool integration

**AI/ML Features:**
- GPT integration for suggestions
- Automated categorization
- Predictive analytics
- Personalization

**Enterprise Features:**
- SSO (SAML/OIDC)
- Advanced audit logging
- Custom SLAs
- Dedicated infrastructure
- Priority support

### Infrastructure Improvements

**Scalability:**
- Read replicas for RDS
- Redis caching layer
- ElastiCache for sessions
- SQS for async processing
- Lambda for background tasks

**Reliability:**
- Blue-green deployments
- Canary deployments
- Multi-region setup
- Disaster recovery automation
- Chaos engineering

**Security Enhancements:**
- WAF for DDoS protection
- Advanced threat detection
- Penetration testing
- Bug bounty program
- SOC 2 Type II certification

**Cost Optimization:**
- Spot instances for batch jobs
- S3 lifecycle policies
- CloudFront optimization
- Database connection pooling (RDS Proxy)
- Reserved capacity planning

---

## Success Criteria

### Developer Experience Goals

**Setup Speed:**
- Clone to running locally: < 10 minutes
- Deploy to dev environment: < 30 minutes
- Full CI/CD pipeline setup: < 1 hour

**Type Safety:**
- End-to-end type safety (database → API → frontend)
- Zero `any` types in application code
- Automatic type inference throughout

**Development Workflow:**
- Hot reload works perfectly (< 1s)
- Clear error messages
- Fast test execution (unit tests < 10s)
- Easy debugging with source maps

**Documentation Quality:**
- Every feature documented
- Architecture diagrams included
- Onboarding guide for new developers
- Troubleshooting guide

### Production Readiness Goals

**Reliability:**
- 99.9% uptime SLA capability
- Zero-downtime deployments
- Automatic rollback on failures
- Health checks and monitoring

**Security:**
- All security best practices implemented
- Regular security audits
- Dependency scanning in CI
- Secrets properly managed

**Performance:**
- Initial page load: < 2 seconds (LCP)
- API response time (p95): < 200ms
- Database query time (p95): < 50ms
- Lighthouse score: > 90 on all metrics

**Observability:**
- Comprehensive logging
- Error tracking with Sentry
- Business metrics in PostHog
- Infrastructure metrics in CloudWatch
- Uptime monitoring

### Business Goals

**User Experience:**
- Simple signup flow (< 2 minutes)
- Clear pricing and value proposition
- Fast, responsive interface
- Mobile-friendly design

**Conversion Optimization:**
- High signup → email verification rate (> 80%)
- High trial → paid conversion (> 10%)
- Low churn rate (< 5% monthly)

**Operational Efficiency:**
- Automated deployments
- Minimal manual intervention
- Self-service customer support
- Automated billing

---

## Getting Started Checklist

### For Cursor AI Implementation

**Phase 1: Foundation**
- [ ] Initialize Turborepo monorepo structure
- [ ] Set up Next.js 16 app with App Router
- [ ] Configure TypeScript with strict mode
- [ ] Set up pnpm workspaces
- [ ] Configure Biome for linting/formatting
- [ ] Set up t3-env for environment variables
- [ ] Create basic folder structure

**Phase 2: UI & Styling**
- [ ] Install and configure Tailwind CSS 4
- [ ] Set up shadcn/ui CLI
- [ ] Install core shadcn components (Button, Input, Card, Dialog, Form)
- [ ] Configure dark mode with next-themes
- [ ] Create layout components (nav, sidebar, footer)
- [ ] Build landing page with hero and pricing sections
- [ ] Implement responsive design

**Phase 3: Database**
- [ ] Set up Drizzle ORM with PostgreSQL
- [ ] Create schema for users, sessions, accounts
- [ ] Create schema for subscriptions, invoices, products
- [ ] Create schema for application tables (todos)
- [ ] Configure Drizzle Kit
- [ ] Create initial migrations
- [ ] Set up Drizzle Studio
- [ ] Create seed script with sample data

**Phase 4: Authentication**
- [ ] Install and configure Better Auth
- [ ] Set up email/password authentication
- [ ] Configure Google OAuth
- [ ] Configure GitHub OAuth
- [ ] Create auth pages (login, signup, reset password)
- [ ] Implement email verification flow
- [ ] Create protected route middleware
- [ ] Set up session management

**Phase 5: API Layer**
- [ ] Install and configure tRPC 11
- [ ] Create tRPC context with user session
- [ ] Create auth router (session, signout)
- [ ] Create user router (profile, update, delete)
- [ ] Create todo router (CRUD operations)
- [ ] Implement rate limiting middleware (Upstash)
- [ ] Implement logging middleware (Pino)
- [ ] Set up error handling

**Phase 6: Payments**
- [ ] Install Stripe SDK
- [ ] Create Stripe products and prices in dashboard
- [ ] Implement billing schema in database
- [ ] Create billing router (checkout, portal, invoices)
- [ ] Implement Stripe Checkout integration
- [ ] Create webhook endpoint for Stripe events
- [ ] Handle subscription lifecycle webhooks
- [ ] Implement feature gating based on subscription
- [ ] Create billing management UI
- [ ] Test subscription flows in Stripe test mode

**Phase 7: Email**
- [ ] Install React Email
- [ ] Create email templates (welcome, verification, receipts)
- [ ] Configure AWS SES for sending
- [ ] Create email service layer
- [ ] Implement email sending on key events
- [ ] Set up email preview in development
- [ ] Test email delivery

**Phase 8: Monitoring**
- [ ] Install and configure Sentry
- [ ] Set up error boundaries
- [ ] Configure source maps upload
- [ ] Install and configure PostHog
- [ ] Implement event tracking
- [ ] Set up feature flags
- [ ] Configure Pino logger
- [ ] Set up CloudWatch integration

**Phase 9: UI Features**
- [ ] Build dashboard home page
- [ ] Implement todo list with CRUD
- [ ] Create profile settings page
- [ ] Build billing management page
- [ ] Implement pricing page
- [ ] Add loading states and skeletons
- [ ] Implement toast notifications
- [ ] Create forms with React Hook Form
- [ ] Add optimistic updates

**Phase 10: Infrastructure**
- [ ] Create Pulumi infrastructure package
- [ ] Define VPC and networking
- [ ] Configure RDS PostgreSQL
- [ ] Set up ECS Fargate with ALB
- [ ] Configure S3 and CloudFront
- [ ] Set up AWS Secrets Manager
- [ ] Configure AWS SES
- [ ] Set up ECR repository
- [ ] Create CloudWatch alarms and dashboards
- [ ] Test infrastructure deployment

**Phase 11: Docker & Deployment**
- [ ] Create optimized Dockerfile
- [ ] Create docker-compose for local development
- [ ] Set up CI/CD pipeline (GitHub Actions)
- [ ] Implement build and test stages
- [ ] Configure Docker image build and push
- [ ] Implement Pulumi deployment stage
- [ ] Set up staging environment
- [ ] Test full deployment pipeline
- [ ] Create health check endpoint

**Phase 12: Testing**
- [ ] Configure Vitest
- [ ] Write unit tests for utilities
- [ ] Write integration tests for tRPC procedures
- [ ] Configure Playwright
- [ ] Write E2E tests for critical flows
- [ ] Set up test database
- [ ] Configure test coverage reporting
- [ ] Add tests to CI pipeline

**Phase 13: Documentation**
- [ ] Write comprehensive README
- [ ] Create architecture diagrams
- [ ] Document API procedures
- [ ] Create deployment guide
- [ ] Write troubleshooting guide
- [ ] Document environment variables
- [ ] Create contribution guidelines
- [ ] Add code comments where needed

**Phase 14: Polish & Launch Prep**
- [ ] Review security checklist
- [ ] Optimize performance (Lighthouse audit)
- [ ] Test accessibility (WCAG compliance)
- [ ] Review error handling across app
- [ ] Test all email templates
- [ ] Verify Stripe webhook handling
- [ ] Load test API endpoints
- [ ] Review and optimize database queries
- [ ] Set up production monitoring
- [ ] Configure backup and restore procedures
- [ ] Create runbook for common issues
- [ ] Final security audit
- [ ] Prepare launch checklist

---

## Additional Implementation Notes

### Environment Setup Priority

**Must Configure First:**
1. PostgreSQL connection (local or remote)
2. Better Auth secret key
3. Stripe test mode keys
4. Basic AWS credentials for Pulumi

**Configure Later (Not Blocking):**
- OAuth providers (Google, GitHub)
- AWS SES (use console.log for emails initially)
- Upstash Redis (can skip rate limiting initially)
- Sentry DSN (can use console.error initially)
- PostHog key (can skip analytics initially)

### Development Tips

**Hot Reload Optimization:**
- Use `next dev --turbo` for faster builds
- Configure webpack to ignore large node_modules
- Use SWC instead of Babel (Next.js default)
- Minimize global styles that trigger full rebuilds

**Database Development:**
- Use `pnpm db:push` for rapid schema iteration (dev only)
- Always generate proper migrations before committing
- Use Drizzle Studio for quick data inspection
- Keep seed data realistic for testing

**Type Safety Tips:**
- Export all schema types from Drizzle
- Use `inferRouterInputs` and `inferRouterOutputs` for tRPC types
- Create shared types file for common interfaces
- Never use `as` type assertions (fix the types instead)

**Performance Best Practices:**
- Use React Server Components by default
- Add "use client" only when needed (state, events, browser APIs)
- Lazy load heavy components with `next/dynamic`
- Optimize images with Next.js Image component
- Use tRPC's `useQuery` for automatic caching

### Common Pitfalls to Avoid

**Authentication:**
- Don't store passwords in plain text (Better Auth handles this)
- Don't expose session tokens in URLs
- Always validate sessions server-side
- Don't trust client-side authentication state

**Billing:**
- Never trust client-side subscription status
- Always verify webhook signatures from Stripe
- Handle idempotency in webhook handlers
- Test subscription edge cases (failed payments, downgrades)

**Database:**
- Don't forget indexes on foreign keys
- Avoid N+1 queries (use joins or dataloader)
- Use transactions for multi-step operations
- Don't expose internal IDs to users (use UUIDs)

**Security:**
- Never commit secrets to git (use .env.local)
- Always validate and sanitize user input
- Use parameterized queries (Drizzle does this)
- Implement rate limiting on all public endpoints

**Deployment:**
- Test migrations in staging first
- Always have rollback plan
- Don't delete old Docker images immediately
- Monitor deployments closely

---

## Quick Start Commands

### Initial Setup
```bash
# Clone and install
git clone <repo-url>
cd <repo-name>
pnpm install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your values

# Start local services
docker-compose up -d

# Database setup
pnpm db:generate
pnpm db:migrate
pnpm db:seed

# Start development
pnpm dev
```

### Daily Development
```bash
# Start app
pnpm dev

# Run tests (in another terminal)
pnpm test

# Check types
pnpm type-check

# Lint and format
pnpm lint:fix
pnpm format

# Database GUI
pnpm db:studio

# Email preview
pnpm email:dev
```

### Database Operations
```bash
# Create new migration
pnpm db:generate

# Apply migrations
pnpm db:migrate

# Reset database (dev only)
pnpm db:push

# Seed with test data
pnpm db:seed
```

### Testing
```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run with UI
pnpm test:ui

# Run E2E tests
pnpm test:e2e

# Run E2E in UI mode
pnpm test:e2e:ui

# Coverage report
pnpm test:coverage
```

### Infrastructure
```bash
# Preview infrastructure changes
pnpm pulumi:preview

# Deploy infrastructure
pnpm pulumi:up

# View current outputs
pnpm pulumi:output

# Destroy infrastructure (careful!)
pnpm pulumi:destroy
```

### Docker
```bash
# Build image
pnpm docker:build

# Run locally
pnpm docker:run

# Build for production
docker build -t app:prod --target production .

# Push to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account>.dkr.ecr.us-east-1.amazonaws.com
docker tag app:prod <account>.dkr.ecr.us-east-1.amazonaws.com/app:latest
docker push <account>.dkr.ecr.us-east-1.amazonaws.com/app:latest
```

---

## Troubleshooting Guide

### Common Issues

**"Cannot connect to database"**
- Check PostgreSQL is running: `docker ps`
- Verify DATABASE_URL in .env.local
- Check PostgreSQL logs: `docker logs postgres`
- Ensure database exists: `docker exec -it postgres psql -U user -d dbname`

**"Drizzle migration failed"**
- Check migration files in /drizzle folder
- Verify database schema matches migrations
- Try `pnpm db:push` to sync (dev only)
- Check for conflicts in schema definitions

**"tRPC procedure not found"**
- Verify procedure is exported in router
- Check root router includes sub-router
- Restart dev server (Turbopack cache issue)
- Check for TypeScript errors

**"Stripe webhook not working"**
- Verify webhook secret is correct
- Check webhook signature verification code
- Use Stripe CLI for local testing: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
- Check Stripe dashboard for failed webhook attempts
- Ensure endpoint returns 200 status

**"Authentication not persisting"**
- Check cookie settings (httpOnly, secure, sameSite)
- Verify BETTER_AUTH_URL matches actual URL
- Check browser console for cookie warnings
- Ensure session table has valid entry

**"Rate limiting not working"**
- Verify Upstash Redis credentials
- Check Redis is accessible
- Test with curl: `curl -H "Authorization: Bearer $UPSTASH_REDIS_REST_TOKEN" $UPSTASH_REDIS_REST_URL/get/test`
- Check rate limit middleware is applied

**"Email not sending"**
- Check AWS SES is out of sandbox mode
- Verify SES domain/email is verified
- Check AWS credentials have SES permissions
- Look for errors in CloudWatch Logs
- Test with SES console first

**"Docker build fails"**
- Check Dockerfile syntax
- Verify all files are included (check .dockerignore)
- Ensure dependencies install correctly
- Check Node.js version matches
- Try building with `--no-cache`

**"Pulumi deployment fails"**
- Check AWS credentials: `aws sts get-caller-identity`
- Verify Pulumi stack is selected: `pulumi stack`
- Check for resource conflicts
- Review Pulumi logs for specific error
- Ensure AWS quotas not exceeded

**"High RDS connection count"**
- Implement connection pooling
- Check for connection leaks
- Use RDS Proxy for serverless/Lambda
- Monitor active connections in CloudWatch
- Review application code for proper connection handling

---

## Performance Optimization Checklist

### Frontend Performance

**Code Splitting:**
- [ ] Use dynamic imports for heavy components
- [ ] Lazy load routes not in initial view
- [ ] Split vendor chunks appropriately
- [ ] Defer non-critical JavaScript

**Image Optimization:**
- [ ] Use Next.js Image component everywhere
- [ ] Specify width and height to prevent CLS
- [ ] Use appropriate image formats (WebP, AVIF)
- [ ] Implement lazy loading for below-fold images
- [ ] Use CloudFront for image CDN

**CSS Optimization:**
- [ ] Remove unused Tailwind classes (production build)
- [ ] Critical CSS inlined in HTML
- [ ] Minimize custom CSS
- [ ] Use CSS containment where possible

**JavaScript Optimization:**
- [ ] Tree-shake unused code
- [ ] Minimize third-party scripts
- [ ] Use server components when possible
- [ ] Implement incremental static regeneration

**Caching Strategy:**
- [ ] Set appropriate Cache-Control headers
- [ ] Use stale-while-revalidate
- [ ] Implement service worker for offline (optional)
- [ ] Cache static assets aggressively

### Backend Performance

**Database Optimization:**
- [ ] Add indexes on frequently queried columns
- [ ] Use connection pooling
- [ ] Optimize slow queries (use EXPLAIN)
- [ ] Implement read replicas if needed
- [ ] Use database query caching

**API Optimization:**
- [ ] Implement API response caching
- [ ] Use Redis for frequently accessed data
- [ ] Batch database queries
- [ ] Implement pagination on large datasets
- [ ] Use tRPC batching for multiple queries

**Infrastructure Optimization:**
- [ ] Enable HTTP/2 and HTTP/3
- [ ] Configure CloudFront caching properly
- [ ] Use compression (gzip/brotli)
- [ ] Optimize ECS task sizes
- [ ] Implement auto-scaling

---

## Security Checklist

### Pre-Launch Security Review

**Authentication & Authorization:**
- [ ] All sensitive routes protected with middleware
- [ ] Session expiration configured
- [ ] Password complexity enforced
- [ ] Email verification required
- [ ] OAuth scopes minimized
- [ ] Rate limiting on auth endpoints
- [ ] Account lockout on failed attempts

**API Security:**
- [ ] All inputs validated with Zod
- [ ] Rate limiting on all endpoints
- [ ] CORS configured correctly
- [ ] API keys rotated (if applicable)
- [ ] tRPC procedures have proper authorization
- [ ] Error messages don't leak sensitive info

**Data Protection:**
- [ ] Database encrypted at rest
- [ ] TLS 1.2+ enforced everywhere
- [ ] Secrets in AWS Secrets Manager
- [ ] No secrets in source code
- [ ] User data encrypted where needed
- [ ] Backup encryption enabled

**Infrastructure Security:**
- [ ] Security groups follow least privilege
- [ ] No public RDS access
- [ ] VPC Flow Logs enabled
- [ ] CloudTrail logging enabled
- [ ] MFA enforced on AWS accounts
- [ ] Regular security group audits

**Application Security:**
- [ ] Dependency scanning in CI
- [ ] No known vulnerabilities in dependencies
- [ ] Container images scanned
- [ ] Security headers configured
- [ ] CSP policy implemented
- [ ] XSS protection enabled

**Compliance:**
- [ ] Privacy policy published
- [ ] Terms of service published
- [ ] Cookie consent banner (if EU users)
- [ ] Data deletion process documented
- [ ] GDPR compliance verified (if applicable)
- [ ] Data export functionality available

---

## Launch Checklist

### Pre-Launch (1 Week Before)

**Technical:**
- [ ] All tests passing
- [ ] Performance benchmarks met
- [ ] Security audit completed
- [ ] Load testing completed
- [ ] Backup and restore tested
- [ ] Disaster recovery plan documented
- [ ] Monitoring and alerts configured
- [ ] Status page set up

**Business:**
- [ ] Pricing finalized in Stripe
- [ ] Marketing site content finalized
- [ ] Terms of service reviewed
- [ ] Privacy policy reviewed
- [ ] Support documentation written
- [ ] FAQ page created

**Infrastructure:**
- [ ] Production environment deployed
- [ ] SSL certificates configured
- [ ] DNS configured
- [ ] Email sending verified (out of SES sandbox)
- [ ] CDN configured and tested
- [ ] Backups automated

### Launch Day

**Morning:**
- [ ] Final production deployment
- [ ] Smoke tests passed
- [ ] Monitoring dashboards open
- [ ] Team on standby
- [ ] Rollback plan reviewed

**During Launch:**
- [ ] Monitor error rates
- [ ] Monitor server metrics
- [ ] Monitor payment processing
- [ ] Monitor user signups
- [ ] Respond to support requests
- [ ] Track key metrics in PostHog

**Post-Launch (24 Hours):**
- [ ] Review error logs
- [ ] Check performance metrics
- [ ] Verify payment processing
- [ ] Review user feedback
- [ ] Document any issues
- [ ] Celebrate! 🎉

### Post-Launch (1 Week)

**Review:**
- [ ] Analyze launch metrics
- [ ] Review error patterns
- [ ] Check infrastructure costs
- [ ] Review user feedback
- [ ] Identify optimization opportunities
- [ ] Plan next iteration

**Optimization:**
- [ ] Fix critical bugs
- [ ] Optimize slow queries
- [ ] Improve error messages
- [ ] Enhance monitoring
- [ ] Update documentation

---

## Support & Maintenance

### Ongoing Maintenance Tasks

**Daily:**
- Monitor error rates in Sentry
- Check uptime status (Better Uptime)
- Review critical alerts
- Monitor billing (Stripe dashboard)

**Weekly:**
- Review performance metrics
- Check infrastructure costs
- Update dependencies
- Review user feedback
- Plan feature releases

**Monthly:**
- Security audit
- Cost optimization review
- Backup verification
- Database maintenance
- Performance optimization
- User analytics review

**Quarterly:**
- Disaster recovery drill
- Penetration testing
- Compliance review
- Infrastructure rightsizing
- Technology stack review

### On-Call Runbook

**Critical Issues:**

**Site Down (500 errors):**
1. Check ECS tasks are running
2. Check ALB target health
3. Check database connectivity
4. Review recent deployments
5. Check CloudWatch logs for errors
6. Consider rollback if recent deploy

**Database Connection Issues:**
1. Check RDS instance status
2. Check connection count
3. Review security group rules
4. Check application connection pool
5. Consider restarting app if connection leak

**Payment Processing Failing:**
1. Check Stripe status page
2. Review webhook delivery in Stripe
3. Check application logs for errors
4. Verify webhook signature validation
5. Check database for incomplete subscriptions

**High Error Rate:**
1. Check Sentry for error patterns
2. Review recent code changes
3. Check external service status (Stripe, etc.)
4. Review database query performance
5. Check memory/CPU utilization

### Incident Response

**Process:**
1. Acknowledge alert
2. Assess severity and impact
3. Communicate to team
4. Investigate root cause
5. Implement fix or mitigation
6. Verify fix in production
7. Post-mortem (for major incidents)
8. Update runbook

**Communication Templates:**
- Status page updates
- Customer notifications
- Team notifications
- Post-mortem reports

---

## Conclusion

This starter template provides a complete, production-ready foundation for building modern SaaS applications with:

✅ **Full-stack TypeScript** - Type safety from database to frontend
✅ **Production infrastructure** - AWS resources managed with Pulumi
✅ **Complete authentication** - Email/password and OAuth with Better Auth
✅ **Payment processing** - Stripe integration with subscription management
✅ **Monitoring & observability** - Sentry, PostHog, CloudWatch, Better Uptime
✅ **Email system** - Transactional emails with React Email and AWS SES
✅ **Security best practices** - Rate limiting, validation, encryption
✅ **Developer experience** - Fast development, testing, and deployment
✅ **Documentation** - Comprehensive guides and runbooks

**Key Principles:**
- Simple over complex
- Type-safe over error-prone
- Automated over manual
- Observable over opaque
- Secure by default
- Cost-conscious architecture

**Next Steps:**
1. Use this specification to generate the complete codebase
2. Customize for your specific use case
3. Deploy to development environment
4. Test thoroughly
5. Launch to production
6. Iterate based on user feedback
