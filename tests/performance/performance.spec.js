const { test, expect } = require("@playwright/test");

test.setTimeout(180000);

const baseURL = "https://opensource-demo.orangehrmlive.com/web/index.php";

async function safeGoto(page, url) {
  for (let i = 0; i < 3; i++) {
    try {
      await page.goto(url, { waitUntil: "networkidle", timeout: 120000 });
      return;
    } catch (error) {
      if (i === 2) throw error;
      await page.waitForTimeout(5000);
    }
  }
}

async function login(page) {
  await safeGoto(page, `${baseURL}/auth/login`);

  const username = page.locator('input[name="username"]');
  const password = page.locator('input[name="password"]');

  await username.waitFor({ state: "visible", timeout: 120000 });
  await username.fill("Admin");
  await password.fill("admin123");

  await page.getByRole("button", { name: "Login" }).click();
  await expect(page).toHaveURL(/dashboard/, { timeout: 120000 });
}

async function openKPI(page) {
  await safeGoto(page, `${baseURL}/performance/searchKpi`);
  await expect(page).toHaveURL(/searchKpi/, { timeout: 60000 });
}

async function openAddKPI(page) {
  await safeGoto(page, `${baseURL}/performance/saveKpi`);
  await expect(page).toHaveURL(/saveKpi/, { timeout: 60000 });
}

async function openAddTracker(page) {
  await safeGoto(page, `${baseURL}/performance/addPerformanceTracker`);
  await expect(page).toHaveURL(/addPerformanceTracker/, { timeout: 60000 });
}

async function openAddReview(page) {
  await safeGoto(page, `${baseURL}/performance/saveReview`);
  await expect(page).toHaveURL(/saveReview/, { timeout: 60000 });
}

async function selectDropdownOption(page, dropdownIndex = 0, optionIndex = 1) {
  const dropdown = page.locator(".oxd-select-text").nth(dropdownIndex);
  await dropdown.waitFor({ state: "visible", timeout: 60000 });
  await dropdown.click();

  const options = page.locator(".oxd-select-dropdown .oxd-select-option");
  await options.nth(optionIndex).waitFor({ state: "visible", timeout: 60000 });
  await options.nth(optionIndex).click();
}

async function selectAutocomplete(page, index, value) {
  const input = page.getByPlaceholder("Type for hints...").nth(index);
  await input.waitFor({ state: "visible", timeout: 60000 });
  await input.fill(value);
  await page.waitForTimeout(3000);
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
}

test.describe("Performance Functional Testing", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("1 KPI required validation workflow", async ({ page }) => {
    await openAddKPI(page);
    await page.getByRole("button", { name: "Save" }).click();
    await expect(page.getByText("Required").first()).toBeVisible({ timeout: 60000 });
  });

  test("2 KPI name input workflow", async ({ page }) => {
    await openAddKPI(page);
    const kpiName = page.locator(".oxd-input").nth(1);
    await kpiName.waitFor({ state: "visible", timeout: 60000 });
    await kpiName.fill("Automation KPI");
    await expect(kpiName).toHaveValue("Automation KPI");
  });

  test("3 KPI job title dropdown workflow", async ({ page }) => {
    await openAddKPI(page);
    await selectDropdownOption(page, 0, 1);
    await expect(page).toHaveURL(/saveKpi/);
  });

  test("4 KPI minimum rating input workflow", async ({ page }) => {
    await openAddKPI(page);
    const minRating = page.locator(".oxd-input").nth(2);
    await minRating.waitFor({ state: "visible", timeout: 60000 });
    await minRating.fill("1");
    await expect(minRating).toHaveValue("1");
  });

  test("5 KPI maximum rating input workflow", async ({ page }) => {
    await openAddKPI(page);
    const maxRating = page.locator(".oxd-input").nth(3);
    await maxRating.waitFor({ state: "visible", timeout: 60000 });
    await maxRating.fill("5");
    await expect(maxRating).toHaveValue("5");
  });

  test("6 KPI clear and rewrite name workflow", async ({ page }) => {
    await openAddKPI(page);
    const kpiName = page.locator(".oxd-input").nth(1);
    await kpiName.waitFor({ state: "visible", timeout: 60000 });
    await kpiName.fill("Wrong KPI");
    await kpiName.press("Control+A");
    await kpiName.press("Backspace");
    await kpiName.fill("Correct KPI");
    await expect(kpiName).toHaveValue("Correct KPI");
  });

  test("7 KPI search job title dropdown workflow", async ({ page }) => {
    await openKPI(page);
    await selectDropdownOption(page, 0, 1);
    await expect(page).toHaveURL(/searchKpi/);
  });

  test("8 Tracker required validation workflow", async ({ page }) => {
    await openAddTracker(page);
    await page.getByRole("button", { name: "Save" }).click();
    await expect(page.getByText("Required").first()).toBeVisible({ timeout: 60000 });
  });

  test("9 Tracker name input workflow", async ({ page }) => {
    await openAddTracker(page);
    const trackerName = page.locator(".oxd-input").nth(1);
    await trackerName.waitFor({ state: "visible", timeout: 60000 });
    await trackerName.fill("Automation Tracker");
    await expect(trackerName).toHaveValue("Automation Tracker");
  });

  test("10 Tracker employee autocomplete workflow", async ({ page }) => {
    await openAddTracker(page);
    await selectAutocomplete(page, 0, "John");
    await expect(page).toHaveURL(/addPerformanceTracker/);
  });

  test("11 Tracker reviewer autocomplete workflow", async ({ page }) => {
    await openAddTracker(page);
    await selectAutocomplete(page, 1, "John");
    await expect(page).toHaveURL(/addPerformanceTracker/);
  });

  test("12 Review required validation workflow", async ({ page }) => {
    await openAddReview(page);
    await page.getByRole("button", { name: "Save" }).click();
    await expect(page.getByText("Required").first()).toBeVisible({ timeout: 60000 });
  });

  test("13 Review employee autocomplete workflow", async ({ page }) => {
    await openAddReview(page);
    await selectAutocomplete(page, 0, "John");
    await expect(page).toHaveURL(/saveReview/);
  });

  test("14 Review supervisor reviewer workflow", async ({ page }) => {
    await openAddReview(page);
    await selectAutocomplete(page, 1, "John");
    await expect(page).toHaveURL(/saveReview/);
  });

  test("15 Review page form visibility workflow", async ({ page }) => {
    await openAddReview(page);

    const saveButton = page.getByRole("button", { name: "Save" });
    await expect(saveButton).toBeVisible({ timeout: 60000 });

    const formInputs = page.locator("input");
    await expect(formInputs.first()).toBeVisible({ timeout: 60000 });

    await expect(page).toHaveURL(/saveReview/);
  });
});