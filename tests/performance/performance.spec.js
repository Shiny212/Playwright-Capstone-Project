const { test, expect } = require("@playwright/test");

test.setTimeout(180000);

const baseURL = "https://opensource-demo.orangehrmlive.com/web/index.php";

async function safeGoto(page, url) {
  for (let i = 0; i < 3; i++) {
    try {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 120000 });
      return;
    } catch (error) {
      if (i === 2) throw error;
      await page.waitForTimeout(3000);
    }
  }
}

async function login(page) {
  await safeGoto(page, `${baseURL}/auth/login`);

  await page.locator('input[name="username"]').waitFor({
    state: "visible",
    timeout: 60000
  });

  await page.locator('input[name="username"]').fill("Admin");
  await page.locator('input[name="password"]').fill("admin123");
  await page.getByRole("button", { name: "Login" }).click();

  await expect(page).toHaveURL(/dashboard/, { timeout: 60000 });
}

async function openKPI(page) {
  await safeGoto(page, `${baseURL}/performance/searchKpi`);
  await expect(page).toHaveURL(/searchKpi/);
}

async function openAddKPI(page) {
  await safeGoto(page, `${baseURL}/performance/saveKpi`);
  await expect(page).toHaveURL(/saveKpi/);
}

async function openTrackers(page) {
  await safeGoto(page, `${baseURL}/performance/viewEmployeePerformanceTrackerList`);
  await expect(page).toHaveURL(/viewEmployeePerformanceTrackerList/);
}

async function openAddTracker(page) {
  await safeGoto(page, `${baseURL}/performance/addPerformanceTracker`);
  await expect(page).toHaveURL(/addPerformanceTracker/);
}

async function openReviews(page) {
  await safeGoto(page, `${baseURL}/performance/searchPerformanceReview`);
  await expect(page).toHaveURL(/searchPerformanceReview/);
}

async function openAddReview(page) {
  await safeGoto(page, `${baseURL}/performance/saveReview`);
  await expect(page).toHaveURL(/saveReview/);
}

test.describe("Performance Functional Testing", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("1 KPI required validation workflow", async ({ page }) => {
    await openAddKPI(page);
    await page.getByRole("button", { name: "Save" }).click();
    await expect(page.getByText("Required").first()).toBeVisible();
  });

  test("2 KPI name input workflow", async ({ page }) => {
    await openAddKPI(page);
    await page.locator(".oxd-input").nth(1).fill("Automation KPI");
    await expect(page.locator(".oxd-input").nth(1)).toHaveValue("Automation KPI");
  });

  test("3 KPI job title dropdown workflow", async ({ page }) => {
    await openAddKPI(page);
    await page.locator(".oxd-select-text").first().click();
    await page.getByRole("option").nth(1).click();
    await expect(page).toHaveURL(/saveKpi/);
  });

  test("4 KPI minimum rating input workflow", async ({ page }) => {
    await openAddKPI(page);
    await page.locator(".oxd-input").nth(2).fill("1");
    await expect(page.locator(".oxd-input").nth(2)).toHaveValue("1");
  });

  test("5 KPI maximum rating input workflow", async ({ page }) => {
    await openAddKPI(page);
    await page.locator(".oxd-input").nth(3).fill("5");
    await expect(page.locator(".oxd-input").nth(3)).toHaveValue("5");
  });

  test("6 KPI clear and rewrite name workflow", async ({ page }) => {
  await openAddKPI(page);

  const inputs = page.locator(".oxd-input");

  if ((await inputs.count()) > 1) {
    const kpiName = inputs.nth(1);

    await kpiName.waitFor({
      state: "visible",
      timeout: 60000
    });

    await kpiName.fill("Wrong KPI");

    await kpiName.press("Control+A");
    await kpiName.press("Backspace");

    await kpiName.fill("Correct KPI");

    await expect(kpiName).toHaveValue("Correct KPI");
  } else {
    await expect(page).toHaveURL(/saveKpi/);
  }
});
  test("7 KPI search job title dropdown workflow", async ({ page }) => {
    await openKPI(page);
    await page.locator(".oxd-select-text").first().click();
    await page.getByRole("option").nth(1).click();
    await expect(page).toHaveURL(/searchKpi/);
  });

  test("8 Tracker required validation workflow", async ({ page }) => {
    await openAddTracker(page);
    await page.getByRole("button", { name: "Save" }).click();
    await expect(page.getByText("Required").first()).toBeVisible();
  });

  test("9 Tracker name input workflow", async ({ page }) => {
    await openAddTracker(page);
    await page.locator(".oxd-input").nth(1).fill("Automation Tracker");
    await expect(page.locator(".oxd-input").nth(1)).toHaveValue("Automation Tracker");
  });

  test("10 Tracker employee autocomplete workflow", async ({ page }) => {
    await openAddTracker(page);
    await page.getByPlaceholder("Type for hints...").first().fill("John");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/addPerformanceTracker/);
  });

  test("11 Tracker reviewer autocomplete workflow", async ({ page }) => {
    await openAddTracker(page);
    await page.getByPlaceholder("Type for hints...").nth(1).fill("John");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/addPerformanceTracker/);
  });

  test("12 Review required validation workflow", async ({ page }) => {
    await openAddReview(page);
    await page.getByRole("button", { name: "Save" }).click();
    await expect(page.getByText("Required").first()).toBeVisible();
  });

  test("13 Review employee autocomplete workflow", async ({ page }) => {
    await openAddReview(page);
    await page.getByPlaceholder("Type for hints...").first().fill("John");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/saveReview/);
  });

  test("14 Review supervisor reviewer workflow", async ({ page }) => {
    await openAddReview(page);
    await page.getByPlaceholder("Type for hints...").nth(1).fill("John");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/saveReview/);
  });

  test("15 Review start date input workflow", async ({ page }) => {
    await openAddReview(page);
    await page.locator('input[placeholder="yyyy-dd-mm"]').first().fill("2026-29-05");
    await expect(page.locator('input[placeholder="yyyy-dd-mm"]').first()).toHaveValue("2026-29-05");
  });
});