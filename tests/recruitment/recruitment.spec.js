const { test, expect } = require("@playwright/test");

test.setTimeout(180000);

const baseURL = "https://opensource-demo.orangehrmlive.com/web/index.php";

async function safeGoto(page, url) {
  for (let i = 0; i < 3; i++) {
    try {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 120000 });
      return;
    } catch (e) {
      if (i === 2) throw e;
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

async function openCandidates(page) {
  await safeGoto(page, `${baseURL}/recruitment/viewCandidates`);
  await expect(page).toHaveURL(/viewCandidates/);
}

async function openAddCandidate(page) {
  await safeGoto(page, `${baseURL}/recruitment/addCandidate`);
  await expect(page).toHaveURL(/addCandidate/);
}

async function openVacancies(page) {
  await safeGoto(page, `${baseURL}/recruitment/viewJobVacancy`);
  await expect(page).toHaveURL(/viewJobVacancy/);
}

async function openAddVacancy(page) {
  await safeGoto(page, `${baseURL}/recruitment/addJobVacancy`);
  await expect(page).toHaveURL(/addJobVacancy/);
}

test.describe("Recruitment Functional Testing", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("1 Candidate required validation workflow", async ({ page }) => {
    await openAddCandidate(page);
    await page.getByRole("button", { name: "Save" }).click();
    await expect(page.getByText("Required").first()).toBeVisible();
  });

  test("2 Candidate name and email input workflow", async ({ page }) => {
    await openAddCandidate(page);
    await page.locator('input[name="firstName"]').fill("Auto");
    await page.locator('input[name="lastName"]').fill("Candidate");
    await page.locator(".oxd-input").nth(5).fill("auto@test.com");
    await page.getByRole("button", { name: "Cancel" }).click();
    await expect(page).toHaveURL(/viewCandidates/);
  });

  test("3 Candidate vacancy dropdown workflow", async ({ page }) => {
    await openAddCandidate(page);
    await page.locator(".oxd-select-text").click();
    await page.getByRole("option").nth(1).click();
    await page.getByRole("button", { name: "Cancel" }).click();
    await expect(page).toHaveURL(/viewCandidates/);
  });

  test("4 Candidate contact number workflow", async ({ page }) => {
    await openAddCandidate(page);
    await page.locator('input[name="firstName"]').fill("Auto");
    await page.locator('input[name="lastName"]').fill("Candidate");
    await page.locator(".oxd-input").nth(6).fill("9876543210");
    await page.getByRole("button", { name: "Cancel" }).click();
    await expect(page).toHaveURL(/viewCandidates/);
  });

  test("5 Candidate keywords workflow", async ({ page }) => {
    await openAddCandidate(page);
    await page.locator("textarea").first().fill("playwright, automation, testing");
    await page.getByRole("button", { name: "Cancel" }).click();
    await expect(page).toHaveURL(/viewCandidates/);
  });

  test("6 Candidate consent checkbox workflow", async ({ page }) => {
    await openAddCandidate(page);
    await page.locator(".oxd-checkbox-input").click();
    await page.getByRole("button", { name: "Cancel" }).click();
    await expect(page).toHaveURL(/viewCandidates/);
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
    await page.locator('input[name="firstName"]').fill("Wrong");
    await page.locator('input[name="firstName"]').clear();
    await page.locator('input[name="firstName"]').fill("Correct");
    await expect(page.locator('input[name="firstName"]')).toHaveValue("Correct");
  });

  test("9 Candidate job title filter workflow", async ({ page }) => {
    await openCandidates(page);
    await page.locator(".oxd-select-text").first().click();
    await page.getByRole("option").nth(1).click();
    await expect(page).toHaveURL(/viewCandidates/);
  });

  test("10 Candidate vacancy filter workflow", async ({ page }) => {
    await openCandidates(page);
    await page.locator(".oxd-select-text").nth(1).click();
    await page.getByRole("option").nth(1).click();
    await expect(page).toHaveURL(/viewCandidates/);
  });

  test("11 Candidate hiring manager filter workflow", async ({ page }) => {
    await openCandidates(page);
    await page.locator(".oxd-select-text").nth(2).click();
    await page.getByRole("option").nth(1).click();
    await expect(page).toHaveURL(/viewCandidates/);
  });

  test("12 Vacancy required validation workflow", async ({ page }) => {
    await openAddVacancy(page);
    await page.getByRole("button", { name: "Save" }).click();
    await expect(page.getByText("Required").first()).toBeVisible();
  });

  test("13 Vacancy name input workflow", async ({ page }) => {
    await openAddVacancy(page);
    await page.locator(".oxd-input").nth(1).fill("Automation Vacancy");
    await expect(page.locator(".oxd-input").nth(1)).toHaveValue("Automation Vacancy");
  });

  test("14 Vacancy job title dropdown workflow", async ({ page }) => {
    await openAddVacancy(page);
    await page.locator(".oxd-select-text").first().click();
    await page.getByRole("option").nth(1).click();
    await expect(page).toHaveURL(/addJobVacancy/);
  });

  test("15 Vacancy description workflow", async ({ page }) => {
    await openAddVacancy(page);
    await page.locator("textarea").fill("Automation vacancy description");
    await expect(page.locator("textarea")).toHaveValue("Automation vacancy description");
  });
});