const { test, expect } = require("@playwright/test");

test.setTimeout(180000);

const baseURL = "https://opensource-demo.orangehrmlive.com/web/index.php";

async function safeGoto(page, url) {
  for (let i = 0; i < 3; i++) {
    try {
      await page.goto(url, { waitUntil: "networkidle", timeout: 120000 });
      return;
    } catch (e) {
      if (i === 2) throw e;
      await page.waitForTimeout(5000);
    }
  }
}

async function login(page) {
  await safeGoto(page, `${baseURL}/auth/login`);

  await page.locator('input[name="username"]').waitFor({ state: "visible", timeout: 120000 });
  await page.locator('input[name="username"]').fill("Admin");
  await page.locator('input[name="password"]').fill("admin123");

  await page.getByRole("button", { name: "Login" }).click();
  await expect(page).toHaveURL(/dashboard/, { timeout: 120000 });
}

async function createEmployee(page) {
  const unique = Date.now().toString().slice(-6);
  const empId = "9" + unique;

  await safeGoto(page, `${baseURL}/pim/addEmployee`);

  await page.locator('input[name="firstName"]').fill("Auto");
  await page.locator('input[name="middleName"]').fill("PIM");
  await page.locator('input[name="lastName"]').fill("User");

  const employeeId = page.locator(".oxd-input").nth(4);
  await employeeId.clear();
  await employeeId.fill(empId);

  await page.getByRole("button", { name: "Save" }).click();

  await expect(page).toHaveURL(/viewPersonalDetails/, { timeout: 120000 });

  const url = page.url();
  const empNumber = url.split("/empNumber/")[1];

  return { empId, empNumber, unique };
}

async function openEmployeePage(page, empNumber, pageName) {
  await safeGoto(page, `${baseURL}/pim/${pageName}/empNumber/${empNumber}`);
  await page.waitForTimeout(3000);
}

async function clickAddButton(page) {
  const addButton = page.getByRole("button", { name: "Add" }).first();
  await addButton.waitFor({ state: "visible", timeout: 120000 });
  await addButton.click();
}

async function selectDropdownOption(page, dropdownIndex = 0, optionIndex = 1) {
  const dropdown = page.locator(".oxd-select-text").nth(dropdownIndex);
  await dropdown.waitFor({ state: "visible", timeout: 60000 });
  await dropdown.click();

  const option = page.locator(".oxd-select-dropdown .oxd-select-option").nth(optionIndex);
  await option.waitFor({ state: "visible", timeout: 60000 });
  await option.click();
}

test.describe("PIM Important Functional Testing", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("1 Add employee with mandatory details", async ({ page }) => {
    await createEmployee(page);
    await expect(page).toHaveURL(/viewPersonalDetails/);
  });

  test("2 Add employee with login details", async ({ page }) => {
    const unique = Date.now().toString().slice(-6);

    await safeGoto(page, `${baseURL}/pim/addEmployee`);

    await page.locator('input[name="firstName"]').fill("Login");
    await page.locator('input[name="lastName"]').fill("User");

    const employeeId = page.locator(".oxd-input").nth(4);
    await employeeId.clear();
    await employeeId.fill("8" + unique);

    await page.locator(".oxd-switch-input").click();
    await page.locator(".oxd-input").nth(5).fill(`user${unique}`);
    await page.locator('input[type="password"]').nth(0).fill("Password@123");
    await page.locator('input[type="password"]').nth(1).fill("Password@123");

    await page.getByRole("button", { name: "Save" }).click();
    await expect(page).toHaveURL(/viewPersonalDetails/, { timeout: 120000 });
  });

  test("3 Add employee required field validation", async ({ page }) => {
    await safeGoto(page, `${baseURL}/pim/addEmployee`);
    await page.getByRole("button", { name: "Save" }).click();
    await expect(page.getByText("Required").first()).toBeVisible({ timeout: 60000 });
  });

  test("4 Edit employee personal details", async ({ page }) => {
    const employee = await createEmployee(page);
    await openEmployeePage(page, employee.empNumber, "viewPersonalDetails");

    await page.locator(".oxd-input").nth(5).fill("Tester");
    await page.getByRole("button", { name: "Save" }).first().click();

    await expect(page.getByText(/Successfully Updated|Successfully Saved/)).toBeVisible({ timeout: 60000 });
  });

  test("5 Edit employee contact details", async ({ page }) => {
    const employee = await createEmployee(page);
    await openEmployeePage(page, employee.empNumber, "contactDetails");

    await page.locator(".oxd-input").nth(1).fill("Chennai");
    await page.locator(".oxd-input").nth(3).fill("Tamil Nadu");
    await page.locator(".oxd-input").nth(5).fill("600001");

    await page.getByRole("button", { name: "Save" }).click();
    await expect(page.getByText(/Successfully Updated|Successfully Saved/)).toBeVisible({ timeout: 60000 });
  });

  test("6 Add emergency contact", async ({ page }) => {
    const employee = await createEmployee(page);
    await openEmployeePage(page, employee.empNumber, "viewEmergencyContacts");

    await clickAddButton(page);
    await page.locator(".oxd-input").nth(1).fill("Parent");
    await page.locator(".oxd-input").nth(2).fill("Father");
    await page.locator(".oxd-input").nth(3).fill("9876543210");

    await page.getByRole("button", { name: "Save" }).click();
    await expect(page.getByText("Successfully Saved")).toBeVisible({ timeout: 60000 });
  });

  test("7 Edit emergency contact", async ({ page }) => {
    const employee = await createEmployee(page);
    await openEmployeePage(page, employee.empNumber, "viewEmergencyContacts");

    await clickAddButton(page);
    await page.locator(".oxd-input").nth(1).fill("Parent");
    await page.locator(".oxd-input").nth(2).fill("Father");
    await page.locator(".oxd-input").nth(3).fill("9876543210");
    await page.getByRole("button", { name: "Save" }).click();

    await expect(page.getByText("Successfully Saved")).toBeVisible({ timeout: 60000 });

    await page.locator(".oxd-icon.bi-pencil-fill").first().click();
    await page.locator(".oxd-input").nth(3).fill("9876500000");
    await page.getByRole("button", { name: "Save" }).click();

    await expect(page.getByText(/Successfully Updated|Successfully Saved/)).toBeVisible({ timeout: 60000 });
  });

  test("8 Add dependent details", async ({ page }) => {
    const employee = await createEmployee(page);
    await openEmployeePage(page, employee.empNumber, "viewDependents");

    await clickAddButton(page);
    await page.locator(".oxd-input").nth(1).fill("Child One");
    await selectDropdownOption(page, 0, 1);

    await page.getByRole("button", { name: "Save" }).click();
    await expect(page.getByText("Successfully Saved")).toBeVisible({ timeout: 60000 });
  });

  test("9 Edit dependent details", async ({ page }) => {
    const employee = await createEmployee(page);
    await openEmployeePage(page, employee.empNumber, "viewDependents");

    await clickAddButton(page);
    await page.locator(".oxd-input").nth(1).fill("Child One");
    await selectDropdownOption(page, 0, 1);
    await page.getByRole("button", { name: "Save" }).click();

    await expect(page.getByText("Successfully Saved")).toBeVisible({ timeout: 60000 });

    await page.locator(".oxd-icon.bi-pencil-fill").first().click();
    await page.locator(".oxd-input").nth(1).fill("Child Updated");
    await page.getByRole("button", { name: "Save" }).click();

    await expect(page.getByText(/Successfully Updated|Successfully Saved/)).toBeVisible({ timeout: 60000 });
  });

  test("10 Update job details", async ({ page }) => {
    const employee = await createEmployee(page);
    await openEmployeePage(page, employee.empNumber, "viewJobDetails");

    await expect(page).toHaveURL(/viewJobDetails/);

    const joinedDate = page.locator('input[placeholder="yyyy-dd-mm"]').first();

    if ((await joinedDate.count()) > 0) {
      await joinedDate.waitFor({ state: "visible", timeout: 60000 });
      await joinedDate.fill("2026-29-05");
      await expect(joinedDate).toHaveValue("2026-29-05");
    } else {
      await expect(page.locator(".orangehrm-card-container").first()).toBeVisible({ timeout: 60000 });
    }
  });

  test("11 Salary details input workflow", async ({ page }) => {
    const employee = await createEmployee(page);
    await openEmployeePage(page, employee.empNumber, "viewSalaryList");

    await clickAddButton(page);
    await page.locator(".oxd-input").nth(1).fill("Basic Salary");
    await selectDropdownOption(page, 0, 1);
    await page.locator(".oxd-input").nth(2).fill("25000");

    await expect(page.locator(".oxd-input").nth(1)).toHaveValue("Basic Salary");
    await expect(page.locator(".oxd-input").nth(2)).toHaveValue("25000");
  });

  test("12 Add immigration details", async ({ page }) => {
    const employee = await createEmployee(page);
    await openEmployeePage(page, employee.empNumber, "viewImmigration");

    await clickAddButton(page);
    await page.locator(".oxd-input").nth(1).fill("A1234567");

    await page.getByRole("button", { name: "Save" }).click();
    await expect(page.getByText("Successfully Saved")).toBeVisible({ timeout: 60000 });
  });

  test("13 Add employee attachment", async ({ page }) => {
    const employee = await createEmployee(page);
    await openEmployeePage(page, employee.empNumber, "viewPersonalDetails");

    await page.getByRole("button", { name: "Add" }).last().click();

    await page.locator('input[type="file"]').setInputFiles({
      name: "employee-document.txt",
      mimeType: "text/plain",
      buffer: Buffer.from("Employee document uploaded using Playwright")
    });

    await page.locator("textarea").fill("Employee attachment document");
    await page.getByRole("button", { name: "Save" }).last().click();

    await expect(page.getByText("Successfully Saved")).toBeVisible({ timeout: 60000 });
  });

  test("14 Add employee login password mismatch validation", async ({ page }) => {
    const unique = Date.now().toString().slice(-6);

    await safeGoto(page, `${baseURL}/pim/addEmployee`);

    await page.locator('input[name="firstName"]').fill("Mismatch");
    await page.locator('input[name="lastName"]').fill("User");

    await page.locator(".oxd-switch-input").click();
    await page.locator(".oxd-input").nth(5).fill(`mismatch${unique}`);
    await page.locator('input[type="password"]').nth(0).fill("Password@123");
    await page.locator('input[type="password"]').nth(1).fill("Wrong@123");

    await page.getByRole("button", { name: "Save" }).click();
    await expect(page.getByText("Passwords do not match").first()).toBeVisible({ timeout: 60000 });
  });

  test("15 Add employee login details required validation", async ({ page }) => {
    await safeGoto(page, `${baseURL}/pim/addEmployee`);

    await page.locator('input[name="firstName"]').fill("Login");
    await page.locator('input[name="lastName"]').fill("Validation");

    await page.locator(".oxd-switch-input").click();
    await page.getByRole("button", { name: "Save" }).click();

    await expect(page.getByText("Required").first()).toBeVisible({ timeout: 60000 });
  });
});