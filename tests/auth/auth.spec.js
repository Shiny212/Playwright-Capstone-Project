const { test, expect } = require("@playwright/test");

async function openLogin(page) {
  await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/auth/login");
  await page.locator('input[name="username"]').waitFor();
}

test.describe("Authentication Functional Testing", () => {

  test.beforeEach(async ({ page }) => {
    await openLogin(page);
  });

  test("1 Valid login using click", async ({ page }) => {
    await page.locator('input[name="username"]').fill("Admin");
    await page.locator('input[name="password"]').fill("admin123");
    await page.getByRole("button", { name: "Login" }).click();
    await expect(page).toHaveURL(/dashboard/);
  });

  test("2 Valid login using keyboard Enter", async ({ page }) => {
    await page.locator('input[name="username"]').fill("Admin");
    await page.locator('input[name="password"]').fill("admin123");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/dashboard/);
  });

  test("3 Invalid username and password validation", async ({ page }) => {
    await page.locator('input[name="username"]').fill("wronguser");
    await page.locator('input[name="password"]').fill("wrongpass");
    await page.getByRole("button", { name: "Login" }).click();
    await expect(page.getByText("Invalid credentials")).toBeVisible();
  });

  test("4 Empty login form validation", async ({ page }) => {
    await page.getByRole("button", { name: "Login" }).click();
    await expect(page.getByText("Required")).toHaveCount(2);
  });

  test("5 Valid username and empty password validation", async ({ page }) => {
    await page.locator('input[name="username"]').fill("Admin");
    await page.getByRole("button", { name: "Login" }).click();
    await expect(page.getByText("Required").first()).toBeVisible();
  });

  test("6 Empty username and valid password validation", async ({ page }) => {
    await page.locator('input[name="password"]').fill("admin123");
    await page.getByRole("button", { name: "Login" }).click();
    await expect(page.getByText("Required").first()).toBeVisible();
  });

  test("7 Password masking validation", async ({ page }) => {
    await expect(page.locator('input[name="password"]')).toHaveAttribute("type", "password");
  });

  test("8 Clear wrong credentials and login again", async ({ page }) => {
    await page.locator('input[name="username"]').fill("wronguser");
    await page.locator('input[name="password"]').fill("wrongpass");

    await page.locator('input[name="username"]').clear();
    await page.locator('input[name="password"]').clear();

    await page.locator('input[name="username"]').fill("Admin");
    await page.locator('input[name="password"]').fill("admin123");
    await page.getByRole("button", { name: "Login" }).click();

    await expect(page).toHaveURL(/dashboard/);
  });

  test("9 Multiple invalid login attempts", async ({ page }) => {
    await page.locator('input[name="username"]').fill("test1");
    await page.locator('input[name="password"]').fill("test1");
    await page.getByRole("button", { name: "Login" }).click();
    await expect(page.getByText("Invalid credentials")).toBeVisible();

    await page.locator('input[name="username"]').clear();
    await page.locator('input[name="password"]').clear();

    await page.locator('input[name="username"]').fill("test2");
    await page.locator('input[name="password"]').fill("test2");
    await page.getByRole("button", { name: "Login" }).click();
    await expect(page.getByText("Invalid credentials")).toBeVisible();
  });

  test("10 Direct dashboard access without login", async ({ page }) => {
    await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index");
    await expect(page).toHaveURL(/auth\/login/);
  });

  test("11 Logout should destroy user session", async ({ page }) => {
    await page.locator('input[name="username"]').fill("Admin");
    await page.locator('input[name="password"]').fill("admin123");
    await page.getByRole("button", { name: "Login" }).click();

    await expect(page).toHaveURL(/dashboard/);

    await page.locator(".oxd-userdropdown-tab").click();
    await page.getByRole("menuitem", { name: "Logout" }).click();

    await expect(page).toHaveURL(/login/);
  });

  test("12 Browser back after logout should not restore dashboard", async ({ page }) => {
    await page.locator('input[name="username"]').fill("Admin");
    await page.locator('input[name="password"]').fill("admin123");
    await page.getByRole("button", { name: "Login" }).click();

    await expect(page).toHaveURL(/dashboard/);

    await page.locator(".oxd-userdropdown-tab").click();
    await page.getByRole("menuitem", { name: "Logout" }).click();

    await page.goBack();

    await expect(page).not.toHaveURL(/dashboard/);
  });

  test("13 Reload login page and login again", async ({ page }) => {
    await page.reload();

    await page.locator('input[name="username"]').fill("Admin");
    await page.locator('input[name="password"]').fill("admin123");
    await page.getByRole("button", { name: "Login" }).click();

    await expect(page).toHaveURL(/dashboard/);
  });

  test("14 Login with only spaces should not allow dashboard", async ({ page }) => {
    await page.locator('input[name="username"]').fill("   ");
    await page.locator('input[name="password"]').fill("   ");
    await page.getByRole("button", { name: "Login" }).click();

    await expect(page).not.toHaveURL(/dashboard/);
  });

  test("15 Failed login followed by successful login", async ({ page }) => {
    await page.locator('input[name="username"]').fill("wronguser");
    await page.locator('input[name="password"]').fill("wrongpass");
    await page.getByRole("button", { name: "Login" }).click();

    await expect(page.getByText("Invalid credentials")).toBeVisible();

    await page.locator('input[name="username"]').clear();
    await page.locator('input[name="password"]').clear();

    await page.locator('input[name="username"]').fill("Admin");
    await page.locator('input[name="password"]').fill("admin123");
    await page.getByRole("button", { name: "Login" }).click();

    await expect(page).toHaveURL(/dashboard/);
  });

});