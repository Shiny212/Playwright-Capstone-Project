const { test, expect } = require("@playwright/test");

const baseURL = "https://opensource-demo.orangehrmlive.com/web/index.php";

async function login(page) {
  await page.goto(`${baseURL}/auth/login`, {
    waitUntil: "domcontentloaded",
    timeout: 120000
  });

  await page.locator('input[name="username"]').fill("Admin");
  await page.locator('input[name="password"]').fill("admin123");
  await page.getByRole("button", { name: "Login" }).click();

  await expect(page).toHaveURL(/dashboard/, { timeout: 60000 });
}

async function openAssignLeave(page) {
  await page.goto(`${baseURL}/leave/assignLeave`, {
    waitUntil: "domcontentloaded",
    timeout: 120000
  });
  await expect(page).toHaveURL(/assignLeave/);
}

async function openLeaveList(page) {
  await page.goto(`${baseURL}/leave/viewLeaveList`, {
    waitUntil: "domcontentloaded",
    timeout: 120000
  });
  await expect(page).toHaveURL(/viewLeaveList/);
}

async function openMyLeave(page) {
  await page.goto(`${baseURL}/leave/viewMyLeaveList`, {
    waitUntil: "domcontentloaded",
    timeout: 120000
  });
  await expect(page).toHaveURL(/viewMyLeaveList/);
}

test.describe("Leave Functional Testing", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("1 Assign leave required validation", async ({ page }) => {
    await openAssignLeave(page);
    await page.getByRole("button", { name: "Assign" }).click();
    await expect(page.getByText("Required").first()).toBeVisible();
  });

  test("2 Assign leave employee autocomplete workflow", async ({ page }) => {
    await openAssignLeave(page);
    await page.getByPlaceholder("Type for hints...").fill("John");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/assignLeave/);
  });

  test("3 Assign leave type dropdown workflow", async ({ page }) => {
    await openAssignLeave(page);
    await page.locator(".oxd-select-text").click();
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/assignLeave/);
  });

  test("4 Assign leave comment workflow", async ({ page }) => {
    await openAssignLeave(page);
    await page.locator("textarea").fill("Leave automation comment");
    await expect(page.locator("textarea")).toHaveValue("Leave automation comment");
  });

  test("5 Assign leave clear comment workflow", async ({ page }) => {
    await openAssignLeave(page);
    await page.locator("textarea").fill("Wrong comment");
    await page.locator("textarea").clear();
    await page.locator("textarea").fill("Correct comment");
    await expect(page.locator("textarea")).toHaveValue("Correct comment");
  });

  test("6 Leave list search workflow", async ({ page }) => {
    await openLeaveList(page);
    await page.getByRole("button", { name: "Search" }).click();
    await expect(page).toHaveURL(/viewLeaveList/);
  });

  test("7 Leave list employee autocomplete workflow", async ({ page }) => {
    await openLeaveList(page);
    await page.getByPlaceholder("Type for hints...").fill("John");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");
    await page.getByRole("button", { name: "Search" }).click();
    await expect(page).toHaveURL(/viewLeaveList/);
  });

  test("8 Leave list status dropdown workflow", async ({ page }) => {
    await openLeaveList(page);
    await page.locator(".oxd-select-text").first().click();
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");
    await page.getByRole("button", { name: "Search" }).click();
    await expect(page).toHaveURL(/viewLeaveList/);
  });

  test("9 Leave list sub unit dropdown workflow", async ({ page }) => {
    await openLeaveList(page);
    await page.locator(".oxd-select-text").nth(1).click();
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");
    await page.getByRole("button", { name: "Search" }).click();
    await expect(page).toHaveURL(/viewLeaveList/);
  });

  test("10 Leave list reset workflow", async ({ page }) => {
    await openLeaveList(page);
    await page.getByPlaceholder("Type for hints...").fill("InvalidEmployee");
    await page.getByRole("button", { name: "Reset" }).click();
    await expect(page).toHaveURL(/viewLeaveList/);
  });

  test("11 My leave search workflow", async ({ page }) => {
    await openMyLeave(page);
    await page.getByRole("button", { name: "Search" }).click();
    await expect(page).toHaveURL(/viewMyLeaveList/);
  });

  test("12 My leave status dropdown workflow", async ({ page }) => {
    await openMyLeave(page);
    await page.locator(".oxd-select-text").first().click();
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");
    await page.getByRole("button", { name: "Search" }).click();
    await expect(page).toHaveURL(/viewMyLeaveList/);
  });

  test("13 My leave reset workflow", async ({ page }) => {
    await openMyLeave(page);
    await page.getByRole("button", { name: "Reset" }).click();
    await expect(page).toHaveURL(/viewMyLeaveList/);
  });

  test("14 Leave apply page workflow", async ({ page }) => {
    await page.goto(`${baseURL}/leave/applyLeave`, {
      waitUntil: "domcontentloaded",
      timeout: 120000
    });
    await expect(page).toHaveURL(/applyLeave/);
  });

  test("15 Leave apply comment workflow", async ({ page }) => {
    await page.goto(`${baseURL}/leave/applyLeave`, {
      waitUntil: "domcontentloaded",
      timeout: 120000
    });
    await page.locator("textarea").fill("Apply leave comment");
    await expect(page.locator("textarea")).toHaveValue("Apply leave comment");
  });
});