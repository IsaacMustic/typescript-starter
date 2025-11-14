# Next.js 16 + Pulumi AWS Production Starter Template

A production-ready, full-stack TypeScript starter template with Next.js 16 frontend/backend, AWS infrastructure managed by Pulumi, PostgreSQL with Drizzle ORM, and complete SaaS features including authentication, payments, monitoring, and email.

## Overview

This starter template provides everything you need to build and deploy a modern SaaS application:

- **Full-stack TypeScript** - End-to-end type safety from database to frontend
- **Next.js 16** with App Router and React Server Components
- **Authentication** - Better Auth with email/password and OAuth (Google, GitHub)
- **Payments** - Stripe integration with subscription management
- **Database** - PostgreSQL with Drizzle ORM
- **Infrastructure** - AWS resources managed with Pulumi
- **Monitoring** - Sentry, PostHog, and CloudWatch integration
- **Email** - React Email templates with AWS SES

## Tech Stack

### Frontend
- Next.js 16 (App Router)
- React 19
- TypeScript 5.7+
- Tailwind CSS 4
- shadcn/ui components
- Lucide React icons

### Backend
- Next.js 16 API Routes
- tRPC 11 for type-safe APIs
- Better Auth for authentication
- Stripe for payments
- React Email for transactional emails

### Database
- PostgreSQL 16
- Drizzle ORM
- Drizzle Kit for migrations

### Infrastructure
- Pulumi (TypeScript) for IaC
- AWS (VPC, RDS, ECS, S3, CloudFront, SES, etc.)

## Prerequisites

- Node.js 20+
- pnpm 9+
- Docker & Docker Compose
- AWS account (for deployment)
- Stripe account (test mode for development)

## Getting Started

### 1. Clone and Install

```bash
git clone <repo-url>
cd typescript-starter
pnpm install
```

### 2. Environment Variables

Copy the example environment file and fill in your values:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration. At minimum, you need:

- `DATABASE_URL` - PostgreSQL connection string
- `BETTER_AUTH_SECRET` - Random secret (min 32 characters)
- `BETTER_AUTH_URL` - Your app URL (http://localhost:3000 for dev)
- `NEXT_PUBLIC_APP_URL` - Public app URL

### 3. Start Local Services

```bash
docker-compose up -d
```

This starts PostgreSQL and Redis containers.

### 4. Database Setup

```bash
# Generate migrations
pnpm db:generate

# Run migrations
pnpm db:migrate

# Seed database
pnpm db:seed
```

### 5. Start Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
/
├── apps/
│   └── web/                    # Next.js application
│       ├── app/                # App Router pages
│       ├── components/         # React components
│       ├── lib/                # Utilities and configs
│       ├── server/             # Server-side code
│       │   ├── db/             # Database schema
│       │   └── trpc/           # tRPC routers
│       └── emails/             # Email templates
│
├── packages/
│   └── infrastructure/         # Pulumi IaC
│
└── docker-compose.yml          # Local services
```

## Development

### Available Scripts

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm start            # Start production server

# Database
pnpm db:generate      # Generate migrations
pnpm db:migrate       # Run migrations
pnpm db:push          # Push schema (dev only)
pnpm db:studio        # Open Drizzle Studio
pnpm db:seed          # Seed database

# Testing
pnpm test             # Run unit tests
pnpm test:ui          # Run tests with UI
pnpm test:e2e         # Run E2E tests

# Code Quality
pnpm lint             # Lint code
pnpm lint:fix         # Fix linting issues
pnpm format           # Format code
pnpm type-check       # Type check
```

### Database Management

Use Drizzle Studio to view and edit data:

```bash
pnpm db:studio
```

### Email Preview

Preview email templates in development:

```bash
pnpm email:dev
```

## Deployment

### Infrastructure Setup

1. Install Pulumi CLI: https://www.pulumi.com/docs/get-started/install/

2. Configure AWS credentials:

```bash
aws configure
```

3. Initialize Pulumi stack:

```bash
cd packages/infrastructure
pulumi stack init dev
pulumi config set aws:region us-east-1
```

4. Preview infrastructure:

```bash
pulumi preview
```

5. Deploy:

```bash
pulumi up
```

### Environment Configuration

Set environment variables in AWS Secrets Manager or your deployment platform.

## Testing

### Unit Tests

```bash
pnpm test
```

### Integration Tests

```bash
pnpm test
```

### E2E Tests

```bash
pnpm test:e2e
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

### Code Style

- Use Biome for linting and formatting
- Follow TypeScript strict mode
- Avoid `any` types
- Use meaningful variable names

## Troubleshooting

### Database Connection Issues

- Ensure PostgreSQL is running: `docker ps`
- Check `DATABASE_URL` in `.env.local`
- Verify database exists

### Build Errors

- Clear `.next` directory: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && pnpm install`

### Type Errors

- Run `pnpm type-check` to see all errors
- Ensure all dependencies are installed

## License

MIT

