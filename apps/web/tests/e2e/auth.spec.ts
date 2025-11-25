import { expect, test } from "@playwright/test";

test.describe("Authentication", () => {
  test.describe("Pages", () => {
    test("should display login page", async ({ page }) => {
      await page.goto("/login");
      await expect(page.locator("h1, h2")).toContainText(/login/i);
    });

    test("should display signup page", async ({ page }) => {
      await page.goto("/signup");
      await expect(page.locator("h1, h2")).toContainText(/sign up|create an account/i);
    });

    test("should display forgot password page", async ({ page }) => {
      await page.goto("/forgot-password");
      await expect(page.locator("h1, h2")).toContainText(/forgot password|reset password/i);
    });
  });

  test.describe("Signup Flow", () => {
    test("should show validation errors for invalid form data", async ({ page }) => {
      await page.goto("/signup");

      // Try to submit empty form
      await page.getByRole("button", { name: /sign up|create account/i }).click();

      // Should show validation errors
      await expect(page.locator("text=Name must be at least")).toBeVisible();
      await expect(page.locator("text=Invalid email")).toBeVisible();
      await expect(page.locator("text=Password must be")).toBeVisible();
    });

    test("should show password requirements", async ({ page }) => {
      await page.goto("/signup");

      // Enter weak password
      await page.getByLabel(/password/i).fill("weak");
      await page.getByLabel(/password/i).blur();

      // Should show password requirements
      await expect(
        page.locator("text=/must be at least 8 characters|uppercase|lowercase|number|special/i")
      ).toBeVisible();
    });

    test("should require terms acceptance", async ({ page }) => {
      await page.goto("/signup");

      // Fill form but don't accept terms
      await page.getByLabel(/name/i).fill("Test User");
      await page.getByLabel(/email/i).fill("test@example.com");
      await page.getByLabel(/password/i).fill("Test123!@#");

      // Try to submit without accepting terms
      await page.getByRole("button", { name: /sign up|create account/i }).click();

      // Should show terms error
      await expect(page.locator("text=/accept.*terms|terms.*conditions/i")).toBeVisible();
    });

    test("should navigate to login from signup page", async ({ page }) => {
      await page.goto("/signup");
      await page.getByRole("link", { name: /sign in|login/i }).click();
      await expect(page).toHaveURL(/\/login/);
    });
  });

  test.describe("Login Flow", () => {
    test("should show validation errors for empty form", async ({ page }) => {
      await page.goto("/login");

      // Try to submit empty form
      await page.getByRole("button", { name: /sign in|login/i }).click();

      // Should show validation errors
      await expect(page.locator("text=/email|password/i")).toBeVisible();
    });

    test("should navigate to signup from login page", async ({ page }) => {
      await page.goto("/login");
      await page.getByRole("link", { name: /sign up|create account/i }).click();
      await expect(page).toHaveURL(/\/signup/);
    });

    test("should navigate to forgot password from login page", async ({ page }) => {
      await page.goto("/login");
      await page.getByRole("link", { name: /forgot password/i }).click();
      await expect(page).toHaveURL(/\/forgot-password/);
    });
  });

  test.describe("Password Reset Flow", () => {
    test("should show validation error for invalid email", async ({ page }) => {
      await page.goto("/forgot-password");

      // Enter invalid email
      await page.getByLabel(/email/i).fill("invalid-email");
      await page.getByRole("button", { name: /send|reset/i }).click();

      // Should show validation error
      await expect(page.locator("text=/invalid email/i")).toBeVisible();
    });

    test("should show success message after submitting valid email", async ({ page }) => {
      await page.goto("/forgot-password");

      // Enter valid email
      await page.getByLabel(/email/i).fill("test@example.com");
      await page.getByRole("button", { name: /send|reset/i }).click();

      // Should show success message (even if email doesn't exist, for security)
      await expect(page.locator("text=/check your email|reset link/i")).toBeVisible({
        timeout: 5000,
      });
    });
  });

  test.describe("Protected Routes", () => {
    test("should redirect to login when accessing dashboard without auth", async ({ page }) => {
      await page.goto("/dashboard");
      // Should redirect to login
      await expect(page).toHaveURL(/\/login/, { timeout: 5000 });
    });

    test("should redirect to login when accessing profile without auth", async ({ page }) => {
      await page.goto("/dashboard/profile");
      // Should redirect to login
      await expect(page).toHaveURL(/\/login/, { timeout: 5000 });
    });

    test("should redirect to login when accessing billing without auth", async ({ page }) => {
      await page.goto("/dashboard/billing");
      // Should redirect to login
      await expect(page).toHaveURL(/\/login/, { timeout: 5000 });
    });
  });

  test.describe("OAuth Buttons", () => {
    test("should display OAuth buttons on signup page", async ({ page }) => {
      await page.goto("/signup");
      await expect(page.getByRole("button", { name: /google/i })).toBeVisible();
      await expect(page.getByRole("button", { name: /github/i })).toBeVisible();
    });

    test("should display OAuth buttons on login page", async ({ page }) => {
      await page.goto("/login");
      await expect(page.getByRole("button", { name: /google/i })).toBeVisible();
      await expect(page.getByRole("button", { name: /github/i })).toBeVisible();
    });
  });
});
