const { test, expect } = require("@playwright/test");

test.setTimeout(240000);

const baseURL = "https://opensource-demo.orangehrmlive.com/web/index.php";

async function safeGoto(page, url) {
  await page.goto(url, {
    waitUntil: "networkidle",
    timeout: 120000
  });
}

async function login(page) {
  await safeGoto(page, `${baseURL}/auth/login`);

  const username = page.locator('input[name="username"]');
  const password = page.locator('input[name="password"]');

  await username.waitFor({
    state: "visible",
    timeout: 120000
  });

  await username.fill("Admin");
  await password.fill("admin123");

  await page.getByRole("button", { name: "Login" }).click();

  await expect(page).toHaveURL(/dashboard/, {
    timeout: 120000
  });
}

async function openCandidates(page) {
  await safeGoto(page, `${baseURL}/recruitment/viewCandidates`);
  await expect(page).toHaveURL(/viewCandidates/, { timeout: 60000 });
}

async function openAddCandidate(page) {
  await safeGoto(page, `${baseURL}/recruitment/addCandidate`);
  await expect(page).toHaveURL(/addCandidate/, { timeout: 60000 });
}

async function openAddVacancy(page) {
  await safeGoto(page, `${baseURL}/recruitment/addJobVacancy`);
  await expect(page).toHaveURL(/addJobVacancy/, { timeout: 60000 });
}

async function selectDropdownOption(page, dropdownIndex = 0, optionIndex = 1) {
  const dropdown = page.locator(".oxd-select-text").nth(dropdownIndex);

  if ((await dropdown.count()) > 0) {
    await dropdown.waitFor({ state: "visible", timeout: 60000 });
    await dropdown.click();

    const option = page.locator(".oxd-select-dropdown .oxd-select-option").nth(optionIndex);
    await option.waitFor({ state: "visible", timeout: 60000 });
    await option.click();
  }
}

test.describe("Recruitment Functional Testing", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("1 Candidate required validation workflow", async ({ page }) => {
    await openAddCandidate(page);
    await page.getByRole("button", { name: "Save" }).click();
    await expect(page.getByText("Required").first()).toBeVisible({ timeout: 60000 });
  });

  test("2 Candidate name and email input workflow", async ({ page }) => {
    await openAddCandidate(page);
    await page.locator('input[name="firstName"]').fill("Auto");
    await page.locator('input[name="lastName"]').fill("Candidate");
    await page.locator(".oxd-input").nth(5).fill("auto@test.com");
    await page.getByRole("button", { name: "Cancel" }).click();
    await expect(page).toHaveURL(/viewCandidates/, { timeout: 60000 });
  });

  test("3 Candidate vacancy dropdown workflow", async ({ page }) => {
    await openAddCandidate(page);
    await selectDropdownOption(page, 0, 1);
    await expect(page).toHaveURL(/addCandidate/);
  });

  test("4 Candidate contact number workflow", async ({ page }) => {
    await openAddCandidate(page);
    await page.locator('input[name="firstName"]').fill("Auto");
    await page.locator('input[name="lastName"]').fill("Candidate");
    await page.locator(".oxd-input").nth(6).fill("9876543210");
    await expect(page.locator(".oxd-input").nth(6)).toHaveValue("9876543210");
  });

  test("5 Candidate keywords workflow", async ({ page }) => {
    await openAddCandidate(page);
    await page.locator("textarea").first().fill("playwright, automation, testing");
    await expect(page.locator("textarea").first()).toHaveValue("playwright, automation, testing");
  });

  test("6 Candidate consent checkbox workflow", async ({ page }) => {
    await openAddCandidate(page);

    const checkbox = page.locator(".oxd-checkbox-input").first();

    if ((await checkbox.count()) > 0) {
      await checkbox.click();
    }

    await expect(page).toHaveURL(/addCandidate/);
  });

  test("7 Candidate invalid email input workflow", async ({ page }) => {
    await openAddCandidate(page);
    await page.locator('input[name="firstName"]').fill("Auto");
    await page.locator('input[name="lastName"]').fill("Candidate");
    await page.locator(".oxd-input").nth(5).fill("wrongemail");
    await expect(page.locator(".oxd-input").nth(5)).toHaveValue("wrongemail");
  });

  test("8 Candidate clear and rewrite workflow", async ({ page }) => {
    await openAddCandidate(page);

    const firstName = page.locator('input[name="firstName"]');

    await firstName.fill("Wrong");
    await firstName.clear();
    await firstName.fill("Correct");

    await expect(firstName).toHaveValue("Correct");
  });

  test("9 Candidate job title filter workflow", async ({ page }) => {
    await openCandidates(page);
    await selectDropdownOption(page, 0, 1);
    await expect(page).toHaveURL(/viewCandidates/);
  });

  test("10 Candidate vacancy filter workflow", async ({ page }) => {
    await openCandidates(page);
    await selectDropdownOption(page, 1, 1);
    await expect(page).toHaveURL(/viewCandidates/);
  });

  test("11 Candidate hiring manager filter workflow", async ({ page }) => {
    await openCandidates(page);
    await selectDropdownOption(page, 2, 1);
    await expect(page).toHaveURL(/viewCandidates/);
  });

  test("12 Vacancy required validation workflow", async ({ page }) => {
    await openAddVacancy(page);
    await page.getByRole("button", { name: "Save" }).click();
    await expect(page.getByText("Required").first()).toBeVisible({ timeout: 60000 });
  });

  test("13 Vacancy name input workflow", async ({ page }) => {
    await openAddVacancy(page);

    const vacancyName = page.locator(".oxd-input").nth(1);

    await vacancyName.waitFor({
      state: "visible",
      timeout: 60000
    });

    await vacancyName.fill("Automation Vacancy");

    await expect(vacancyName).toHaveValue("Automation Vacancy");
  });

  test("14 Vacancy job title dropdown workflow", async ({ page }) => {
    await openAddVacancy(page);
    await selectDropdownOption(page, 0, 1);
    await expect(page).toHaveURL(/addJobVacancy/);
  });

  test("15 Vacancy description workflow", async ({ page }) => {
    await openAddVacancy(page);

    const description = page.locator("textarea");

    await description.waitFor({
      state: "visible",
      timeout: 60000
    });

    await description.fill("Automation vacancy description");

    await expect(description).toHaveValue("Automation vacancy description");
  });
});