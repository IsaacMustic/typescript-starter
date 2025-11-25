# Testing Guide

This guide explains how to run tests, write new tests, and understand the testing structure in this project.

## Table of Contents

- [Test Structure](#test-structure)
- [Running Tests](#running-tests)
- [Writing Tests](#writing-tests)
- [Test Setup](#test-setup)
- [Test Conventions](#test-conventions)
- [Debugging Tests](#debugging-tests)
- [CI/CD Testing](#cicd-testing)
- [Best Practices](#best-practices)
- [Common Issues](#common-issues)
- [Resources](#resources)

## Test Structure

```
apps/web/tests/
├── e2e/              # End-to-end tests (Playwright)
│   ├── auth.spec.ts
│   ├── todos.spec.ts
│   └── billing.spec.ts
├── integration/      # Integration tests (Vitest)
│   ├── api.test.ts
│   └── trpc.test.ts
├── unit/            # Unit tests (Vitest)
│   ├── subscription.test.ts
│   └── utils.test.ts
└── setup.ts         # Test setup and fixtures
```

## Running Tests

All test commands should be run from the `apps/web` directory:

```bash
cd apps/web
```

### All Tests

Run all unit and integration tests:

```bash
pnpm test
```

### Unit Tests Only

Run only unit tests:

```bash
pnpm test tests/unit
```

### Integration Tests Only

Run only integration tests:

```bash
pnpm test tests/integration
```

### E2E Tests

Run end-to-end tests with Playwright:

```bash
pnpm test:e2e
```

### E2E Tests with UI

Run E2E tests with Playwright's interactive UI:

```bash
pnpm test:e2e:ui
```

### Watch Mode

Run tests in watch mode (re-runs on file changes):

```bash
pnpm test --watch
```

### Coverage Report

Generate and view coverage report:

```bash
pnpm test:coverage
```

This will:
1. Run all tests with coverage collection
2. Generate coverage reports in `coverage/` directory
3. Display coverage summary in terminal

### Run Specific Test File

Run a specific test file:

```bash
pnpm test tests/unit/subscription.test.ts
```

### Run Tests Matching Pattern

Run tests matching a pattern:

```bash
pnpm test -t "should allow unlimited todos"
```

## Writing Tests

### Unit Tests

Unit tests test individual functions and utilities in isolation. They should be fast and not depend on external services.

**Example - Testing a utility function:**

```typescript
import { describe, expect, it } from "vitest";
import { formatCurrency } from "@/lib/utils";

describe("formatCurrency", () => {
  it("should format USD correctly", () => {
    expect(formatCurrency(1000, "usd")).toBe("$10.00");
  });

  it("should handle zero", () => {
    expect(formatCurrency(0, "usd")).toBe("$0.00");
  });

  it("should handle negative values", () => {
    expect(formatCurrency(-100, "usd")).toBe("-$1.00");
  });
});
```

**Example - Testing with mocks:**

```typescript
import { describe, expect, it, vi, beforeEach } from "vitest";
import { sendEmail } from "@/lib/email";

vi.mock("@/lib/email", () => ({
  sendEmail: vi.fn(),
}));

describe("notification service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should send email when user signs up", async () => {
    await notifyUserSignup("user@example.com");
    expect(sendEmail).toHaveBeenCalledWith(
      "user@example.com",
      "Welcome!",
      expect.any(String)
    );
  });
});
```

### Integration Tests

Integration tests test how different parts of the system work together, such as API endpoints, database operations, and tRPC procedures.

**Example - Testing tRPC procedure:**

```typescript
import { describe, expect, it, beforeAll, afterAll } from "vitest";
import { createCaller } from "@/server/trpc/root";
import { db } from "@/lib/db";

describe("todo.getAll", () => {
  let caller: ReturnType<typeof createCaller>;
  let testUserId: string;

  beforeAll(async () => {
    // Create test user
    const user = await db.insert(users).values({
      email: "test@example.com",
      name: "Test User",
    }).returning();
    testUserId = user[0].id;

    // Create authenticated caller
    caller = createCaller({
      session: { userId: testUserId },
    });
  });

  afterAll(async () => {
    // Clean up test data
    await db.delete(todos).where(eq(todos.userId, testUserId));
    await db.delete(users).where(eq(users.id, testUserId));
  });

  it("should return todos for authenticated user", async () => {
    // Create test todos
    await db.insert(todos).values([
      { userId: testUserId, title: "Todo 1" },
      { userId: testUserId, title: "Todo 2" },
    ]);

    const result = await caller.todo.getAll({});
    
    expect(result.todos).toHaveLength(2);
    expect(result.total).toBe(2);
  });

  it("should filter by completion status", async () => {
    await db.insert(todos).values([
      { userId: testUserId, title: "Done", completed: true },
      { userId: testUserId, title: "Pending", completed: false },
    ]);

    const completed = await caller.todo.getAll({ completed: true });
    const pending = await caller.todo.getAll({ completed: false });

    expect(completed.todos).toHaveLength(1);
    expect(pending.todos).toHaveLength(1);
  });
});
```

**Example - Testing API route:**

```typescript
import { describe, expect, it } from "vitest";
import { GET } from "@/app/api/health/route";

describe("GET /api/health", () => {
  it("should return 200 with status ok", async () => {
    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ status: "ok" });
  });
});
```

### E2E Tests

E2E tests test the full user flow in a real browser using Playwright. They test the application as a user would interact with it.

**Example - Authentication flow:**

```typescript
import { expect, test } from "@playwright/test";

test.describe("Authentication", () => {
  test("should sign up new user", async ({ page }) => {
    await page.goto("/en/signup");
    
    await page.fill('input[name="name"]', "Test User");
    await page.fill('input[name="email"]', "test@example.com");
    await page.fill('input[name="password"]', "password123");
    await page.click('button[type="submit"]');

    // Wait for redirect to dashboard
    await expect(page).toHaveURL(/\/en\/dashboard/);
    await expect(page.locator("text=Test User")).toBeVisible();
  });

  test("should sign in existing user", async ({ page }) => {
    await page.goto("/en/login");
    
    await page.fill('input[name="email"]', "user@example.com");
    await page.fill('input[name="password"]', "password123");
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/\/en\/dashboard/);
  });
});
```

**Example - Todo management flow:**

```typescript
import { expect, test } from "@playwright/test";

test.describe("Todo Management", () => {
  test.beforeEach(async ({ page }) => {
    // Sign in before each test
    await page.goto("/en/login");
    await page.fill('input[name="email"]', "user@example.com");
    await page.fill('input[name="password"]', "password123");
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/en\/dashboard/);
  });

  test("should create todo", async ({ page }) => {
    await page.goto("/en/dashboard/todos");
    
    await page.fill('input[name="title"]', "New Todo");
    await page.fill('textarea[name="description"]', "Todo description");
    await page.click('button[type="submit"]');

    await expect(page.locator("text=New Todo")).toBeVisible();
    await expect(page.locator("text=Todo description")).toBeVisible();
  });

  test("should toggle todo completion", async ({ page }) => {
    await page.goto("/en/dashboard/todos");
    
    // Assume a todo exists from previous test or seed data
    const checkbox = page.locator('input[type="checkbox"]').first();
    await checkbox.click();

    await expect(checkbox).toBeChecked();
  });

  test("should delete todo", async ({ page }) => {
    await page.goto("/en/dashboard/todos");
    
    const todoCount = await page.locator('[data-testid="todo-item"]').count();
    
    await page.click('button[aria-label="Delete todo"]').first();
    await page.click('button:has-text("Confirm")');

    await expect(page.locator('[data-testid="todo-item"]')).toHaveCount(todoCount - 1);
  });
});
```

**Example - Using test fixtures:**

```typescript
import { test as base } from "@playwright/test";

// Extend base test with custom fixtures
const test = base.extend({
  authenticatedPage: async ({ page }, use) => {
    await page.goto("/en/login");
    await page.fill('input[name="email"]', "user@example.com");
    await page.fill('input[name="password"]', "password123");
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/en\/dashboard/);
    await use(page);
  },
});

test("should access protected route", async ({ authenticatedPage }) => {
  await authenticatedPage.goto("/en/dashboard");
  await expect(authenticatedPage.locator("text=Dashboard")).toBeVisible();
});
```

## Test Setup

### Test Database

For integration tests, use a separate test database to avoid affecting development data:

```typescript
// tests/setup.ts
import { beforeAll, afterAll } from "vitest";

beforeAll(() => {
  // Use test database
  process.env.DATABASE_URL = "postgresql://test:test@localhost:5432/test_db";
});

afterAll(async () => {
  // Clean up test database
  // Close connections, etc.
});
```

**Alternative:** Use a test container or in-memory database for faster tests.

### Mocking External Services

Mock external services to avoid API calls and costs during testing:

**Example - Mocking Stripe:**

```typescript
import { vi } from "vitest";

vi.mock("@/lib/stripe", () => ({
  stripe: {
    customers: {
      create: vi.fn().mockResolvedValue({
        id: "cus_test123",
        email: "test@example.com",
      }),
    },
    subscriptions: {
      create: vi.fn().mockResolvedValue({
        id: "sub_test123",
        status: "active",
      }),
    },
  },
}));
```

**Example - Mocking AWS SES:**

```typescript
vi.mock("@aws-sdk/client-ses", () => ({
  SESClient: vi.fn(),
  SendEmailCommand: vi.fn(),
}));
```

**Example - Mocking environment variables:**

```typescript
vi.mock("@/env", () => ({
  env: {
    STRIPE_SECRET_KEY: "sk_test_mock",
    DATABASE_URL: "postgresql://test:test@localhost:5432/test",
  },
}));
```

### Test Fixtures

Create reusable test data and helpers:

```typescript
// tests/fixtures.ts
import { db } from "@/lib/db";
import { users, todos } from "@/server/db/schema";

export async function createTestUser(overrides = {}) {
  const [user] = await db.insert(users).values({
    email: `test-${Date.now()}@example.com`,
    name: "Test User",
    ...overrides,
  }).returning();
  return user;
}

export async function createTestTodo(userId: string, overrides = {}) {
  const [todo] = await db.insert(todos).values({
    userId,
    title: "Test Todo",
    ...overrides,
  }).returning();
  return todo;
}

export async function cleanupTestData(userId: string) {
  await db.delete(todos).where(eq(todos.userId, userId));
  await db.delete(users).where(eq(users.id, userId));
}
```

### Global Test Setup

Configure global test settings:

```typescript
// vitest.config.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    setupFiles: ["./tests/setup.ts"],
    // ... other config
  },
});
```

## Test Conventions

### Naming

- Test files: `*.test.ts` or `*.spec.ts`
- Describe blocks: Use descriptive names
- Test cases: Use "should" format: "should do something"

### Organization

- Group related tests in `describe` blocks
- Use nested `describe` blocks for sub-features
- Keep tests focused on one thing

### Assertions

- Use specific assertions: `toBe`, `toEqual`, `toContain`
- Test both success and failure cases
- Test edge cases and boundaries

## Debugging Tests

### Debug Unit/Integration Tests

```bash
# Run specific test file
pnpm test tests/unit/subscription.test.ts

# Run specific test
pnpm test -t "should allow unlimited todos"

# Debug mode
node --inspect-brk node_modules/.bin/vitest
```

### Debug E2E Tests

```bash
# Run in headed mode
pnpm test:e2e --headed

# Run with UI
pnpm test:e2e:ui

# Debug mode
PWDEBUG=1 pnpm test:e2e
```

### View Test Output

```bash
# Verbose output
pnpm test --reporter=verbose

# JSON output
pnpm test --reporter=json
```

## CI/CD Testing

Tests should run automatically in CI/CD pipelines. Configure your CI to run tests on:
- Push to main/develop branches
- Pull requests
- Scheduled runs (optional)

### CI Test Jobs

A typical CI pipeline should include:

1. **Install Dependencies**
   ```bash
   pnpm install --frozen-lockfile
   ```

2. **Lint** - Code quality checks
   ```bash
   pnpm lint
   ```

3. **Type Check** - TypeScript validation
   ```bash
   pnpm type-check
   ```

4. **Unit Tests** - Fast unit tests
   ```bash
   pnpm test tests/unit
   ```

5. **Integration Tests** - API and tRPC tests
   ```bash
   pnpm test tests/integration
   ```

6. **E2E Tests** - Full browser tests (may run in parallel)
   ```bash
   pnpm test:e2e
   ```

7. **Build** - Production build verification
   ```bash
   pnpm build
   ```

### Example GitHub Actions Workflow

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test_db
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm type-check
      - run: pnpm test
      - run: pnpm build
      
      - name: Install Playwright
        run: pnpm exec playwright install --with-deps
        
      - run: pnpm test:e2e
```

### Skipping Tests in CI

Use environment checks to conditionally skip tests:

```typescript
test("should test something", async () => {
  if (process.env.CI) {
    test.skip(); // Skip in CI if needed
  }
  // test code
});
```

Or use test tags:

```typescript
test("slow test", { tag: "@slow" }, async () => {
  // This test can be skipped in CI
});

// Run with: pnpm test --exclude-tag @slow
```

## Best Practices

### 1. Test Independence

Each test should be independent and not rely on other tests.

### 2. Clean Up

Clean up test data after each test:

```typescript
afterEach(async () => {
  await cleanTestData();
});
```

### 3. Use Mocks

Mock external services and APIs to avoid dependencies:

```typescript
vi.mock("@/lib/stripe");
```

### 4. Test User Flows

Focus on testing user-facing functionality, not implementation details.

### 5. Keep Tests Fast

- Use unit tests for fast feedback
- Reserve E2E tests for critical flows
- Mock slow operations

### 6. Test Error Cases

Don't just test happy paths:

```typescript
it("should handle invalid input", () => {
  expect(() => myFunction(null)).toThrow();
});
```

## Common Issues

### Tests Failing Intermittently

- Add proper waits/timeouts
- Ensure test isolation
- Check for race conditions

### Database Connection Errors

- Verify test database is running
- Check connection string
- Ensure migrations are run

### E2E Tests Timing Out

- Increase timeout: `test.setTimeout(60000)`
- Add explicit waits: `await page.waitForSelector(...)`
- Check if server is running

## Resources

### Official Documentation

- [Vitest Documentation](https://vitest.dev/) - Unit and integration testing
- [Playwright Documentation](https://playwright.dev/) - E2E testing
- [Testing Library](https://testing-library.com/) - React component testing utilities

### Best Practices Articles

- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [E2E Testing Guide](https://playwright.dev/docs/best-practices)
- [Test Organization](https://vitest.dev/guide/test-context.html)

### Related Project Documentation

- [API Documentation](../docs/API.md) - Understanding API endpoints to test
- [Deployment Guide](../docs/DEPLOYMENT.md) - Testing in production-like environments

---

## Quick Reference

### Common Test Patterns

```typescript
// Test async function
it("should handle async operation", async () => {
  const result = await asyncFunction();
  expect(result).toBeDefined();
});

// Test error handling
it("should throw error on invalid input", () => {
  expect(() => functionWithError(null)).toThrow();
});

// Test with timeouts
it("should complete within timeout", async () => {
  await expect(slowOperation()).resolves.toBeDefined();
}, 10000); // 10 second timeout

// Test array operations
it("should filter items", () => {
  const filtered = items.filter(item => item.active);
  expect(filtered).toHaveLength(2);
});

// Test object properties
it("should have required properties", () => {
  expect(user).toHaveProperty("id");
  expect(user).toHaveProperty("email");
  expect(user.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
});
```

