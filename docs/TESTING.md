# Testing Guide

This guide explains how to run tests, write new tests, and understand the testing structure.

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

### All Tests

```bash
cd apps/web
pnpm test
```

### Unit Tests Only

```bash
pnpm test tests/unit
```

### Integration Tests Only

```bash
pnpm test tests/integration
```

### E2E Tests

```bash
pnpm test:e2e
```

### E2E Tests with UI

```bash
pnpm test:e2e:ui
```

### Watch Mode

```bash
pnpm test --watch
```

### Coverage

```bash
pnpm test:coverage
```

## Writing Tests

### Unit Tests

Unit tests test individual functions and utilities in isolation.

**Example:**

```typescript
import { describe, expect, it } from "vitest";
import { myFunction } from "@/lib/my-utils";

describe("myFunction", () => {
  it("should return expected value", () => {
    const result = myFunction("input");
    expect(result).toBe("expected");
  });
});
```

### Integration Tests

Integration tests test how different parts of the system work together.

**Example:**

```typescript
import { describe, expect, it } from "vitest";
import { createTRPCClient } from "@trpc/client";

describe("tRPC Integration", () => {
  it("should call procedure successfully", async () => {
    const client = createTRPCClient(/* config */);
    const result = await client.todo.getAll.query();
    expect(result).toBeDefined();
  });
});
```

### E2E Tests

E2E tests test the full user flow in a real browser.

**Example:**

```typescript
import { expect, test } from "@playwright/test";

test("should create todo", async ({ page }) => {
  await page.goto("/dashboard/todos");
  await page.fill('input[name="title"]', "New Todo");
  await page.click('button[type="submit"]');
  await expect(page.locator("text=New Todo")).toBeVisible();
});
```

## Test Setup

### Test Database

For integration tests, use a separate test database:

```typescript
// tests/setup.ts
process.env.DATABASE_URL = "postgresql://test:test@localhost:5432/test_db";
```

### Mocking External Services

Mock Stripe, SES, and other external services:

```typescript
import { vi } from "vitest";

vi.mock("@/lib/stripe", () => ({
  stripe: {
    customers: {
      create: vi.fn(),
    },
  },
}));
```

### Test Fixtures

Create reusable test data:

```typescript
// tests/fixtures.ts
export function createTestUser(overrides = {}) {
  return {
    id: "test-id",
    email: "test@example.com",
    name: "Test User",
    ...overrides,
  };
}
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

Tests run automatically in CI on:
- Push to main/develop branches
- Pull requests

### CI Test Jobs

1. **Lint** - Code quality checks
2. **Type Check** - TypeScript validation
3. **Unit Tests** - Fast unit tests
4. **Integration Tests** - API and tRPC tests
5. **E2E Tests** - Full browser tests
6. **Build** - Production build verification

### Skipping Tests in CI

Use environment checks:

```typescript
test("should test something", async () => {
  if (process.env.CI) {
    test.skip(); // Skip in CI if needed
  }
  // test code
});
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

- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Library](https://testing-library.com/)

