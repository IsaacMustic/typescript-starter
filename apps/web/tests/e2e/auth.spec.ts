import { expect, test } from "@playwright/test";

test.describe("Authentication", () => {
  test("should display login page", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator("h1")).toContainText("Login");
  });

  test("should display signup page", async ({ page }) => {
    await page.goto("/signup");
    await expect(page.locator("h1")).toContainText("Sign Up");
  });
});
