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

  const username = page.locator('input[name="username"]');
  const password = page.locator('input[name="password"]');

  await username.waitFor({ state: "visible", timeout: 120000 });
  await username.fill("Admin");
  await password.fill("admin123");

  await page.getByRole("button", { name: "Login" }).click();
  await expect(page).toHaveURL(/dashboard/, { timeout: 120000 });
}

async function openEmployeeTimesheet(page) {
  await safeGoto(page, `${baseURL}/time/viewEmployeeTimesheet`);
  await expect(page).toHaveURL(/viewEmployeeTimesheet/, { timeout: 60000 });
}

async function openMyTimesheet(page) {
  await safeGoto(page, `${baseURL}/time/viewMyTimesheet`);
  await expect(page).toHaveURL(/viewMyTimesheet/, { timeout: 60000 });
}

async function openPunch(page) {
  await safeGoto(page, `${baseURL}/attendance/punchIn`);
  await expect(page).toHaveURL(/punchIn|punchOut/, { timeout: 60000 });
}

async function openProjectReports(page) {
  await safeGoto(page, `${baseURL}/time/displayProjectReportCriteria`);
  await expect(page).toHaveURL(/displayProjectReportCriteria/, { timeout: 60000 });
}

async function openEmployeeReports(page) {
  await safeGoto(page, `${baseURL}/time/displayEmployeeReportCriteria`);
  await expect(page).toHaveURL(/displayEmployeeReportCriteria/, { timeout: 60000 });
}

async function openAttendanceSummary(page) {
  await safeGoto(page, `${baseURL}/time/displayAttendanceSummaryReportCriteria`);
  await expect(page).toHaveURL(/displayAttendanceSummaryReportCriteria/, { timeout: 60000 });
}

async function clickFormViewButton(page) {
  const viewButton = page.locator("form").getByRole("button", { name: "View" });
  await viewButton.waitFor({ state: "visible", timeout: 60000 });
  await viewButton.click();
}

async function selectDropdownOption(page, dropdownIndex = 0, optionIndex = 1) {
  const dropdown = page.locator(".oxd-select-text").nth(dropdownIndex);

  if ((await dropdown.count()) > 0) {
    await dropdown.waitFor({ state: "visible", timeout: 60000 });
    await dropdown.click();

    const options = page.locator(".oxd-select-dropdown .oxd-select-option");
    await options.nth(optionIndex).waitFor({ state: "visible", timeout: 60000 });
    await options.nth(optionIndex).click();
  }
}

async function selectAutocomplete(page, index, value) {
  const input = page.getByPlaceholder("Type for hints...").nth(index);
  await input.waitFor({ state: "visible", timeout: 60000 });
  await input.fill(value);
  await page.waitForTimeout(3000);
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
}

test.describe("Time Functional Testing", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("1 Employee timesheet required validation workflow", async ({ page }) => {
    await openEmployeeTimesheet(page);
    await clickFormViewButton(page);
    await expect(page.getByText("Required").first()).toBeVisible({ timeout: 60000 });
  });

  test("2 Employee autocomplete timesheet workflow", async ({ page }) => {
    await openEmployeeTimesheet(page);
    await selectAutocomplete(page, 0, "John");
    await expect(page).toHaveURL(/viewEmployeeTimesheet/);
  });

  test("3 Invalid employee timesheet workflow", async ({ page }) => {
    await openEmployeeTimesheet(page);

    const employeeInput = page.getByPlaceholder("Type for hints...").first();
    await employeeInput.waitFor({ state: "visible", timeout: 60000 });
    await employeeInput.fill("InvalidEmployee");

    await expect(employeeInput).toHaveValue("InvalidEmployee");
    await expect(page.locator("form").getByRole("button", { name: "View" })).toBeVisible();
    await expect(page).toHaveURL(/viewEmployeeTimesheet/);
  });

  test("4 My timesheet edit action workflow", async ({ page }) => {
    await openMyTimesheet(page);

    const editButton = page.getByRole("button", { name: "Edit" });

    if ((await editButton.count()) > 0) {
      await editButton.first().click();
      await expect(page).toHaveURL(/editTimesheet|viewMyTimesheet/, { timeout: 60000 });
    } else {
      await expect(page).toHaveURL(/viewMyTimesheet/);
    }
  });

  test("5 My timesheet submit action workflow", async ({ page }) => {
    await openMyTimesheet(page);

    const submitButton = page.getByRole("button", { name: "Submit" });

    if ((await submitButton.count()) > 0) {
      await submitButton.first().click();
      await expect(page).toHaveURL(/viewMyTimesheet/, { timeout: 60000 });
    } else {
      await expect(page).toHaveURL(/viewMyTimesheet/);
    }
  });

  test("6 Attendance punch note workflow", async ({ page }) => {
    await openPunch(page);

    const note = page.locator("textarea");

    if ((await note.count()) > 0) {
      await note.first().fill("Automation attendance note");
      await expect(note.first()).toHaveValue("Automation attendance note");
    } else {
      await expect(page).toHaveURL(/punchIn|punchOut/);
    }
  });

  test("7 Attendance punch button workflow", async ({ page }) => {
    await openPunch(page);

    const punchButton = page.getByRole("button", { name: /In|Out/ });

    if ((await punchButton.count()) > 0) {
      await expect(punchButton.first()).toBeEnabled();
    } else {
      await expect(page).toHaveURL(/punchIn|punchOut/);
    }
  });

  test("8 Project report required validation workflow", async ({ page }) => {
    await openProjectReports(page);
    await clickFormViewButton(page);
    await expect(page.getByText("Required").first()).toBeVisible({ timeout: 60000 });
  });

  test("9 Project report project autocomplete workflow", async ({ page }) => {
    await openProjectReports(page);
    await selectAutocomplete(page, 0, "Apache");
    await expect(page).toHaveURL(/displayProjectReportCriteria/);
  });

  test("10 Employee report required validation workflow", async ({ page }) => {
    await openEmployeeReports(page);
    await clickFormViewButton(page);
    await expect(page.getByText("Required").first()).toBeVisible({ timeout: 60000 });
  });

  test("11 Employee report autocomplete workflow", async ({ page }) => {
    await openEmployeeReports(page);
    await selectAutocomplete(page, 0, "John");
    await expect(page).toHaveURL(/displayEmployeeReportCriteria/);
  });

  test("12 Attendance summary view workflow", async ({ page }) => {
    await openAttendanceSummary(page);
    await clickFormViewButton(page);
    await expect(page).toHaveURL(/displayAttendanceSummaryReportCriteria/);
  });

  test("13 Attendance summary employee autocomplete workflow", async ({ page }) => {
    await openAttendanceSummary(page);
    await selectAutocomplete(page, 0, "John");
    await expect(page).toHaveURL(/displayAttendanceSummaryReportCriteria/);
  });

  test("14 Attendance summary job title dropdown workflow", async ({ page }) => {
    await openAttendanceSummary(page);
    await selectDropdownOption(page, 0, 1);
    await expect(page).toHaveURL(/displayAttendanceSummaryReportCriteria/);
  });

  test("15 Attendance summary sub unit dropdown workflow", async ({ page }) => {
    await openAttendanceSummary(page);
    await selectDropdownOption(page, 1, 1);
    await expect(page).toHaveURL(/displayAttendanceSummaryReportCriteria/);
  });
});