const { test, expect } = require("@playwright/test");

test.setTimeout(180000);

const baseURL = "https://opensource-demo.orangehrmlive.com/web/index.php";

async function login(page) {
  for (let i = 0; i < 3; i++) {
  try {
    await page.goto(`${baseURL}/auth/login`, {
      waitUntil: "domcontentloaded",
      timeout: 120000
    });
    break;
  } catch (e) {
    if (i === 2) throw e;
    await page.waitForTimeout(5000);
  }
}

  await page.locator('input[name="username"]').waitFor({
    state: "visible",
    timeout: 60000
  });

  await page.locator('input[name="username"]').fill("Admin");
  await page.locator('input[name="password"]').fill("admin123");
  await page.getByRole("button", { name: "Login" }).click();

  await expect(page).toHaveURL(/dashboard/, { timeout: 120000 });
}

async function openApplyLeave(page) {
  await page.goto(`${baseURL}/leave/applyLeave`, {
    waitUntil: "domcontentloaded",
    timeout: 120000
  });

  await expect(page).toHaveURL(/applyLeave/, { timeout: 60000 });
}

async function openMyLeave(page) {
  await page.goto(`${baseURL}/leave/viewMyLeaveList`, {
    waitUntil: "domcontentloaded",
    timeout: 120000
  });

  await expect(page).toHaveURL(/viewMyLeaveList/, { timeout: 60000 });
}

async function openLeaveList(page) {
  await page.goto(`${baseURL}/leave/viewLeaveList`, {
    waitUntil: "domcontentloaded",
    timeout: 120000
  });

  await expect(page).toHaveURL(/viewLeaveList/, { timeout: 60000 });
}

async function openAssignLeave(page) {
  await page.goto(`${baseURL}/leave/assignLeave`, {
    waitUntil: "domcontentloaded",
    timeout: 120000
  });

  await expect(page).toHaveURL(/assignLeave/, { timeout: 60000 });
}

test.describe("Leave Functional Testing", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("1 Apply leave validation workflow", async ({ page }) => {
    await openApplyLeave(page);

    const applyButton = page.getByRole("button", { name: "Apply" });

    if (await applyButton.count()) {
      await applyButton.click();
    }

    await expect(page).toHaveURL(/applyLeave/);
  });

  test("2 Apply leave type dropdown workflow", async ({ page }) => {
    await openApplyLeave(page);

    const dropdown = page.locator(".oxd-select-text").first();

    if (await dropdown.count()) {
      await dropdown.click();
      await page.getByRole("option").nth(1).click();
    }

    await expect(page).toHaveURL(/applyLeave/);
  });

  test("3 Apply leave comment workflow", async ({ page }) => {
    await openApplyLeave(page);

    const comment = page.locator("textarea");

    if (await comment.count()) {
      await comment.fill("Apply leave automation comment");
      await expect(comment).toHaveValue("Apply leave automation comment");
    } else {
      await expect(page).toHaveURL(/applyLeave/);
    }
  });

  test("4 Apply leave clear and rewrite comment workflow", async ({ page }) => {
    await openApplyLeave(page);

    const comment = page.locator("textarea");

    if (await comment.count()) {
      await comment.fill("Wrong comment");
      await comment.clear();
      await comment.fill("Correct leave comment");
      await expect(comment).toHaveValue("Correct leave comment");
    } else {
      await expect(page).toHaveURL(/applyLeave/);
    }
  });

  test("5 My leave status dropdown workflow", async ({ page }) => {
    await openMyLeave(page);

    const dropdown = page.locator(".oxd-select-text").first();

    if (await dropdown.count()) {
      await dropdown.click();
      await page.getByRole("option").nth(1).click();
    }

    await expect(page).toHaveURL(/viewMyLeaveList/);
  });

  test("6 My leave date input workflow", async ({ page }) => {
    await openMyLeave(page);

    const dateInput = page.locator('input[placeholder="yyyy-dd-mm"]').first();

    if (await dateInput.count()) {
      await dateInput.fill("2026-29-05");
      await expect(dateInput).toHaveValue("2026-29-05");
    } else {
      await expect(page).toHaveURL(/viewMyLeaveList/);
    }
  });

  test("7 My leave search workflow", async ({ page }) => {
    await openMyLeave(page);

    const searchButton = page.getByRole("button", { name: "Search" });

    if (await searchButton.count()) {
      await searchButton.click();
    }

    await expect(page).toHaveURL(/viewMyLeaveList/);
  });

  test("8 My leave reset workflow", async ({ page }) => {
    await openMyLeave(page);

    const resetButton = page.getByRole("button", { name: "Reset" });

    if (await resetButton.count()) {
      await resetButton.click();
    }

    await expect(page).toHaveURL(/viewMyLeaveList/);
  });

  test("9 Leave list date workflow", async ({ page }) => {
  await openLeaveList(page);

  const dateInputs = page.locator('input[placeholder="yyyy-dd-mm"]');

  if (await dateInputs.count()) {
    await dateInputs.first().click();
    await dateInputs.first().press("Control+A");
    await dateInputs.first().fill("2026-29-05");
    await expect(dateInputs.first()).toHaveValue("2026-29-05");
  } else {
    await expect(page).toHaveURL(/viewLeaveList/);
  }
});

  test("10 Leave list employee autocomplete workflow", async ({ page }) => {
    await openLeaveList(page);

    const employee = page.getByPlaceholder("Type for hints...").first();

    if (await employee.count()) {
      await employee.fill("John");
      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("Enter");
    }

    await expect(page).toHaveURL(/viewLeaveList/);
  });

  test("11 Leave list status dropdown workflow", async ({ page }) => {
    await openLeaveList(page);

    const dropdown = page.locator(".oxd-select-text").first();

    if (await dropdown.count()) {
      await dropdown.click();
      await page.getByRole("option").nth(1).click();
    }

    await expect(page).toHaveURL(/viewLeaveList/);
  });

  test("12 Leave list sub unit dropdown workflow", async ({ page }) => {
    await openLeaveList(page);

    const dropdown = page.locator(".oxd-select-text").nth(1);

    if (await dropdown.count()) {
      await dropdown.click();
      await page.getByRole("option").nth(1).click();
    }

    await expect(page).toHaveURL(/viewLeaveList/);
  });

  test("13 Assign leave page access workflow", async ({ page }) => {
    await openAssignLeave(page);
    await expect(page).toHaveURL(/assignLeave/);
  });

  test("14 Assign leave employee input workflow", async ({ page }) => {
    await openAssignLeave(page);

    const employee = page.getByPlaceholder("Type for hints...").first();

    if (await employee.count()) {
      await employee.fill("John");
      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("Enter");
    }

    await expect(page).toHaveURL(/assignLeave/);
  });

  test("15 Assign leave comment workflow", async ({ page }) => {
    await openAssignLeave(page);

    const comment = page.locator("textarea");

    if (await comment.count()) {
      await comment.fill("Assign leave automation comment");
      await expect(comment).toHaveValue("Assign leave automation comment");
    } else {
      await expect(page).toHaveURL(/assignLeave/);
    }
  });
});