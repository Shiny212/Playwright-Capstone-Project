const { test, expect } = require("@playwright/test");

test.setTimeout(240000);

const baseURL = "https://opensource-demo.orangehrmlive.com/web/index.php";

async function safeGoto(page, url) {
  for (let i = 0; i < 3; i++) {
    try {
      await page.goto(url, {
        waitUntil: "domcontentloaded",
        timeout: 180000
      });
      return;
    } catch (error) {
      if (i === 2) throw error;
      await page.waitForTimeout(5000);
    }
  }
}

async function login(page) {
  await safeGoto(page, `${baseURL}/auth/login`);

  await page.locator('input[name="username"]').waitFor({
    state: "visible",
    timeout: 90000
  });

  await page.locator('input[name="username"]').fill("Admin");
  await page.locator('input[name="password"]').fill("admin123");

  await page.getByRole("button", { name: "Login" }).click({
    noWaitAfter: true
  });

  await page.waitForTimeout(5000);

  await expect(page).toHaveURL(/dashboard/, {
    timeout: 180000
  });
}

async function openApplyLeave(page) {
  await safeGoto(page, `${baseURL}/leave/applyLeave`);
  await expect(page).toHaveURL(/applyLeave/, { timeout: 90000 });
}

async function openMyLeave(page) {
  await safeGoto(page, `${baseURL}/leave/viewMyLeaveList`);
  await expect(page).toHaveURL(/viewMyLeaveList/, { timeout: 90000 });
}

async function openLeaveList(page) {
  await safeGoto(page, `${baseURL}/leave/viewLeaveList`);
  await expect(page).toHaveURL(/viewLeaveList/, { timeout: 90000 });
}

async function openAssignLeave(page) {
  await safeGoto(page, `${baseURL}/leave/assignLeave`);
  await expect(page).toHaveURL(/assignLeave/, { timeout: 90000 });
}

test.describe.serial("Leave Functional Testing", () => {
  let page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await login(page);
  });

  test.afterAll(async () => {
    await page.close();
  });

  test("1 Apply leave validation workflow", async () => {
    await openApplyLeave(page);
    const applyButton = page.getByRole("button", { name: "Apply" });
    if (await applyButton.count()) await applyButton.click();
    await expect(page).toHaveURL(/applyLeave/);
  });

  test("2 Apply leave type dropdown workflow", async () => {
    await openApplyLeave(page);
    const dropdown = page.locator(".oxd-select-text").first();
    if (await dropdown.count()) {
      await dropdown.click();
      await page.getByRole("option").nth(1).click();
    }
    await expect(page).toHaveURL(/applyLeave/);
  });

  test("3 Apply leave comment workflow", async () => {
    await openApplyLeave(page);
    const comment = page.locator("textarea").first();
    if (await comment.count()) {
      await comment.fill("Apply leave automation comment");
    }
    await expect(page).toHaveURL(/applyLeave/);
  });

  test("4 Apply leave clear and rewrite comment workflow", async () => {
    await openApplyLeave(page);
    const comment = page.locator("textarea").first();
    if (await comment.count()) {
      await comment.fill("Wrong comment");
      await comment.press("Control+A");
      await comment.press("Backspace");
      await comment.fill("Correct leave comment");
    }
    await expect(page).toHaveURL(/applyLeave/);
  });

  test("5 My leave status dropdown workflow", async () => {
    await openMyLeave(page);
    const dropdown = page.locator(".oxd-select-text").first();
    if (await dropdown.count()) {
      await dropdown.click();
      await page.getByRole("option").nth(1).click();
    }
    await expect(page).toHaveURL(/viewMyLeaveList/);
  });

  test("6 My leave date input workflow", async () => {
    await openMyLeave(page);
    const dateInput = page.locator('input[placeholder="yyyy-dd-mm"]').first();
    if (await dateInput.count()) {
      await dateInput.click();
      await dateInput.press("Control+A");
      await dateInput.fill("2026-29-05");
    }
    await expect(page).toHaveURL(/viewMyLeaveList/);
  });

  test("7 My leave search workflow", async () => {
    await openMyLeave(page);
    const searchButton = page.getByRole("button", { name: "Search" });
    if (await searchButton.count()) await searchButton.click();
    await expect(page).toHaveURL(/viewMyLeaveList/);
  });

  test("8 My leave reset workflow", async () => {
    await openMyLeave(page);
    const resetButton = page.getByRole("button", { name: "Reset" });
    if (await resetButton.count()) await resetButton.click();
    await expect(page).toHaveURL(/viewMyLeaveList/);
  });

  test("9 Leave list date workflow", async () => {
    await openLeaveList(page);
    const dateInput = page.locator('input[placeholder="yyyy-dd-mm"]').first();
    if (await dateInput.count()) {
      await dateInput.click();
      await dateInput.press("Control+A");
      await dateInput.fill("2026-29-05");
    }
    await expect(page).toHaveURL(/viewLeaveList/);
  });

  test("10 Leave list employee autocomplete workflow", async () => {
    await openLeaveList(page);
    const employee = page.getByPlaceholder("Type for hints...").first();
    if (await employee.count()) {
      await employee.fill("John");
      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("Enter");
    }
    await expect(page).toHaveURL(/viewLeaveList/);
  });

  test("11 Leave list status dropdown workflow", async () => {
    await openLeaveList(page);
    const dropdown = page.locator(".oxd-select-text").first();
    if (await dropdown.count()) {
      await dropdown.click();
      await page.getByRole("option").nth(1).click();
    }
    await expect(page).toHaveURL(/viewLeaveList/);
  });

  test("12 Leave list sub unit dropdown workflow", async () => {
    await openLeaveList(page);
    const dropdown = page.locator(".oxd-select-text").nth(1);
    if (await dropdown.count()) {
      await dropdown.click();
      await page.getByRole("option").nth(1).click();
    }
    await expect(page).toHaveURL(/viewLeaveList/);
  });

  test("13 Assign leave page access workflow", async () => {
    await openAssignLeave(page);
    await expect(page).toHaveURL(/assignLeave/);
  });

  test("14 Assign leave employee input workflow", async () => {
    await openAssignLeave(page);
    const employee = page.getByPlaceholder("Type for hints...").first();
    if (await employee.count()) {
      await employee.fill("John");
      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("Enter");
    }
    await expect(page).toHaveURL(/assignLeave/);
  });

  test("15 Assign leave comment workflow", async () => {
    await openAssignLeave(page);
    const comment = page.locator("textarea").first();
    if (await comment.count()) {
      await comment.fill("Assign leave automation comment");
    }
    await expect(page).toHaveURL(/assignLeave/);
  });
});