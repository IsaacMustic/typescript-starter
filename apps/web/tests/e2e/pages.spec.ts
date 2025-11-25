import { expect, test } from "@playwright/test";

test.describe("Public Pages", () => {
  test("should display pricing page", async ({ page }) => {
    await page.goto("/pricing");
    await expect(page.locator("h1, h2")).toContainText(/pricing/i);
  });

  test("should display about page", async ({ page }) => {
    await page.goto("/about");
    await expect(page.locator("h1, h2")).toContainText(/about/i);
  });

  test("should display contact page", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.locator("h1, h2")).toContainText(/contact/i);
  });

  test("should navigate from landing page to pricing", async ({ page }) => {
    await page.goto("/");
    await page.click('a[href="/pricing"]');
    await expect(page).toHaveURL(/.*pricing/);
  });

  test("should navigate from landing page to about", async ({ page }) => {
    await page.goto("/");
    // Check if about link exists in footer or nav
    const aboutLink = page.locator('a[href="/about"]').first();
    if (await aboutLink.isVisible()) {
      await aboutLink.click();
      await expect(page).toHaveURL(/.*about/);
    }
  });
});

test.describe("Dashboard Pages", () => {
  test("should redirect to login when accessing dashboard without auth", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/.*login/);
  });

  test("should redirect to login when accessing usage page without auth", async ({ page }) => {
    await page.goto("/dashboard/usage");
    await expect(page).toHaveURL(/.*login/);
  });

  test("should redirect to login when accessing checkout without auth", async ({ page }) => {
    await page.goto("/dashboard/billing/checkout");
    await expect(page).toHaveURL(/.*login/);
  });

  test("should redirect to login when accessing portal without auth", async ({ page }) => {
    await page.goto("/dashboard/billing/portal");
    await expect(page).toHaveURL(/.*login/);
  });
});

test.describe("Auth Pages", () => {
  test("should display verify email change page", async ({ page }) => {
    await page.goto("/verify-email-change?token=test&email=test@example.com");
    await expect(page.locator("h1, h2, h3")).toContainText(/verify|email/i);
  });

  test("should show error when verify email change page has no token", async ({ page }) => {
    await page.goto("/verify-email-change");
    await expect(page.locator("text=Invalid")).toBeVisible();
  });
});
