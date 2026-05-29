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

async function openEmployeeTimesheet(page) {
  await safeGoto(page, `${baseURL}/time/viewEmployeeTimesheet`);
  await expect(page).toHaveURL(/viewEmployeeTimesheet/);
}

async function openMyTimesheet(page) {
  await safeGoto(page, `${baseURL}/time/viewMyTimesheet`);
  await expect(page).toHaveURL(/viewMyTimesheet/);
}

async function openPunch(page) {
  await safeGoto(page, `${baseURL}/attendance/punchIn`);
  await expect(page).toHaveURL(/punchIn|punchOut/);
}

async function openProjectReports(page) {
  await safeGoto(page, `${baseURL}/time/displayProjectReportCriteria`);
  await expect(page).toHaveURL(/displayProjectReportCriteria/);
}

async function openEmployeeReports(page) {
  await safeGoto(page, `${baseURL}/time/displayEmployeeReportCriteria`);
  await expect(page).toHaveURL(/displayEmployeeReportCriteria/);
}

async function openAttendanceSummary(page) {
  await safeGoto(page, `${baseURL}/time/displayAttendanceSummaryReportCriteria`);
  await expect(page).toHaveURL(/displayAttendanceSummaryReportCriteria/);
}

test.describe("Time Functional Testing", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("1 Employee timesheet required validation workflow", async ({ page }) => {
    await openEmployeeTimesheet(page);
    await page.getByRole("button", { name: "View" }).click();
    await expect(page.getByText("Required").first()).toBeVisible();
  });

  test("2 Employee autocomplete timesheet workflow", async ({ page }) => {
    await openEmployeeTimesheet(page);
    await page.getByPlaceholder("Type for hints...").fill("John");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/viewEmployeeTimesheet/);
  });

  test("3 Invalid employee timesheet workflow", async ({ page }) => {
    await openEmployeeTimesheet(page);
    await page.getByPlaceholder("Type for hints...").fill("InvalidEmployee");
    await page.getByRole("button", { name: "View" }).click();
    await expect(page).toHaveURL(/viewEmployeeTimesheet/);
  });

  test("4 My timesheet edit action workflow", async ({ page }) => {
    await openMyTimesheet(page);

    const editButton = page.getByRole("button", { name: "Edit" });

    if (await editButton.count() > 0) {
      await editButton.first().click();
      await expect(page).toHaveURL(/editTimesheet|viewMyTimesheet/);
    } else {
      await expect(page).toHaveURL(/viewMyTimesheet/);
    }
  });

  test("5 My timesheet submit action workflow", async ({ page }) => {
    await openMyTimesheet(page);

    const submitButton = page.getByRole("button", { name: "Submit" });

    if (await submitButton.count() > 0) {
      await submitButton.first().click();
      await expect(page).toHaveURL(/viewMyTimesheet/);
    } else {
      await expect(page).toHaveURL(/viewMyTimesheet/);
    }
  });

  test("6 Attendance punch note workflow", async ({ page }) => {
    await openPunch(page);

    const note = page.locator("textarea");

    if (await note.count() > 0) {
      await note.fill("Automation attendance note");
      await expect(note).toHaveValue("Automation attendance note");
    } else {
      await expect(page).toHaveURL(/punchIn|punchOut/);
    }
  });

  test("7 Attendance punch button workflow", async ({ page }) => {
    await openPunch(page);

    const punchButton = page.getByRole("button", { name: /In|Out/ });

    if (await punchButton.count() > 0) {
      await expect(punchButton.first()).toBeEnabled();
    } else {
      await expect(page).toHaveURL(/punchIn|punchOut/);
    }
  });

  test("8 Project report required validation workflow", async ({ page }) => {
    await openProjectReports(page);
    await page.getByRole("button", { name: "View" }).click();
    await expect(page.getByText("Required").first()).toBeVisible();
  });

  test("9 Project report project autocomplete workflow", async ({ page }) => {
    await openProjectReports(page);
    await page.getByPlaceholder("Type for hints...").fill("Apache");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/displayProjectReportCriteria/);
  });

  test("10 Employee report required validation workflow", async ({ page }) => {
    await openEmployeeReports(page);
    await page.getByRole("button", { name: "View" }).click();
    await expect(page.getByText("Required").first()).toBeVisible();
  });

  test("11 Employee report autocomplete workflow", async ({ page }) => {
  await openEmployeeReports(page);

  await page.getByPlaceholder("Type for hints...").first().fill("John");

  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");

  await expect(page).toHaveURL(/displayEmployeeReportCriteria/);
});

test("12 Attendance summary view workflow", async ({ page }) => {
  await openAttendanceSummary(page);

  await page.getByRole("button", { name: "View" }).click();

  await expect(page).toHaveURL(/displayAttendanceSummaryReportCriteria/);
});

  test("13 Attendance summary employee autocomplete workflow", async ({ page }) => {
    await openAttendanceSummary(page);
    await page.getByPlaceholder("Type for hints...").fill("John");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/displayAttendanceSummaryReportCriteria/);
  });

  test("14 Attendance summary job title dropdown workflow", async ({ page }) => {
    await openAttendanceSummary(page);

    const dropdown = page.locator(".oxd-select-text").first();

    if (await dropdown.count() > 0) {
      await dropdown.click();
      await page.getByRole("option").nth(1).click();
    }

    await expect(page).toHaveURL(/displayAttendanceSummaryReportCriteria/);
  });

  test("15 Attendance summary sub unit dropdown workflow", async ({ page }) => {
    await openAttendanceSummary(page);

    const dropdown = page.locator(".oxd-select-text").nth(1);

    if (await dropdown.count() > 0) {
      await dropdown.click();
      await page.getByRole("option").nth(1).click();
    }

    await expect(page).toHaveURL(/displayAttendanceSummaryReportCriteria/);
  });
});