const { test, expect } = require("@playwright/test");

const baseURL = "https://opensource-demo.orangehrmlive.com/web/index.php";

async function login(page) {
  await page.goto(`${baseURL}/auth/login`, {
    waitUntil: "domcontentloaded",
    timeout: 120000
  });

  await page.locator('input[name="username"]').waitFor({
    state: "visible",
    timeout: 60000
  });

  await page.locator('input[name="username"]').fill("Admin");
  await page.locator('input[name="password"]').fill("admin123");
  await page.getByRole("button", { name: "Login" }).click();

  await expect(page).toHaveURL(/dashboard/, { timeout: 60000 });
}

async function openMyInfo(page) {
  await page.goto(`${baseURL}/pim/viewPersonalDetails/empNumber/7`, {
    waitUntil: "domcontentloaded",
    timeout: 120000
  });

  await expect(page).toHaveURL(/viewPersonalDetails/);
}

test.describe("My Info Functional Testing", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await openMyInfo(page);
  });

  test("1 Update nickname workflow", async ({ page }) => {
    await page.locator(".oxd-input").nth(4).fill("AutoNick");
    await page.getByRole("button", { name: "Save" }).first().click();
    await expect(page).toHaveURL(/viewPersonalDetails/);
  });

  test("2 Update other id workflow", async ({ page }) => {
    await page.locator(".oxd-input").nth(5).fill("OTHER123");
    await page.getByRole("button", { name: "Save" }).first().click();
    await expect(page).toHaveURL(/viewPersonalDetails/);
  });

  test("3 Nationality dropdown workflow", async ({ page }) => {
    await page.locator(".oxd-select-text").first().click();
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");
    await page.getByRole("button", { name: "Save" }).first().click();
    await expect(page).toHaveURL(/viewPersonalDetails/);
  });

  test("4 Marital status dropdown workflow", async ({ page }) => {
    await page.locator(".oxd-select-text").nth(1).click();
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");
    await page.getByRole("button", { name: "Save" }).first().click();
    await expect(page).toHaveURL(/viewPersonalDetails/);
  });

  test("5 Contact street update workflow", async ({ page }) => {
    await page.getByRole("link", { name: "Contact Details" }).click();
    await page.locator(".oxd-input").nth(1).fill("Automation Street");
    await page.getByRole("button", { name: "Save" }).click();
    await expect(page).toHaveURL(/contactDetails/);
  });

  test("6 Contact city update workflow", async ({ page }) => {
    await page.getByRole("link", { name: "Contact Details" }).click();
    await page.locator(".oxd-input").nth(3).fill("Chennai");
    await page.getByRole("button", { name: "Save" }).click();
    await expect(page).toHaveURL(/contactDetails/);
  });

  test("7 Emergency contact required validation workflow", async ({ page }) => {
    await page.getByRole("link", { name: "Emergency Contacts" }).click();
    await page.getByRole("button", { name: "Add" }).first().click();
    await page.getByRole("button", { name: "Save" }).click();
    await expect(page.getByText("Required").first()).toBeVisible();
  });

  test("8 Emergency contact input cancel workflow", async ({ page }) => {
    await page.getByRole("link", { name: "Emergency Contacts" }).click();
    await page.getByRole("button", { name: "Add" }).first().click();
    await page.locator(".oxd-input").nth(1).fill("Father");
    await page.locator(".oxd-input").nth(2).fill("Parent");
    await page.locator(".oxd-input").nth(3).fill("9876543210");
    await page.getByRole("button", { name: "Cancel" }).click();
    await expect(page).toHaveURL(/viewEmergencyContacts/);
  });

  test("9 Dependent required validation workflow", async ({ page }) => {
    await page.getByRole("link", { name: "Dependents" }).click();
    await page.getByRole("button", { name: "Add" }).first().click();
    await page.getByRole("button", { name: "Save" }).click();
    await expect(page.getByText("Required").first()).toBeVisible();
  });

  test("10 Dependent relationship dropdown workflow", async ({ page }) => {
    await page.getByRole("link", { name: "Dependents" }).click();
    await page.getByRole("button", { name: "Add" }).first().click();
    await page.locator(".oxd-input").nth(1).fill("Child One");
    await page.locator(".oxd-select-text").click();
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");
    await page.getByRole("button", { name: "Cancel" }).click();
    await expect(page).toHaveURL(/viewDependents/);
  });

  test("11 Immigration required validation workflow", async ({ page }) => {
    await page.getByRole("link", { name: "Immigration" }).click();
    await page.getByRole("button", { name: "Add" }).first().click();
    await page.getByRole("button", { name: "Save" }).click();
    await expect(page.getByText("Required").first()).toBeVisible();
  });

  test("12 Immigration passport option workflow", async ({ page }) => {
    await page.getByRole("link", { name: "Immigration" }).click();
    await page.getByRole("button", { name: "Add" }).first().click();
    await page.locator('input[type="radio"]').first().check({ force: true });
    await page.locator(".oxd-input").nth(1).fill("P1234567");
    await page.getByRole("button", { name: "Cancel" }).click();
    await expect(page).toHaveURL(/viewImmigration/);
  });

  test("13 Qualification work experience validation workflow", async ({ page }) => {
    await page.getByRole("link", { name: "Qualifications" }).click();
    await page.getByRole("button", { name: "Add" }).first().click();
    await page.getByRole("button", { name: "Save" }).click();
    await expect(page.getByText("Required").first()).toBeVisible();
  });

  test("14 Qualification work experience input workflow", async ({ page }) => {
    await page.getByRole("link", { name: "Qualifications" }).click();
    await page.getByRole("button", { name: "Add" }).first().click();
    await page.locator(".oxd-input").nth(1).fill("Automation Company");
    await page.locator(".oxd-input").nth(2).fill("Tester");
    await page.getByRole("button", { name: "Cancel" }).click();
    await expect(page).toHaveURL(/viewQualifications/);
  });

  test("15 Membership required validation workflow", async ({ page }) => {
    await page.getByRole("link", { name: "Memberships" }).click();
    await page.getByRole("button", { name: "Add" }).first().click();
    await page.getByRole("button", { name: "Save" }).click();
    await expect(page.getByText("Required").first()).toBeVisible();
  });
});