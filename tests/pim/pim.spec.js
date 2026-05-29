const { test, expect } = require("@playwright/test");

async function login(page) {
  await page.goto("https://opensource-demo.orangehrmlive.com/web/index.php/auth/login");
  await page.locator('input[name="username"]').fill("Admin");
  await page.locator('input[name="password"]').fill("admin123");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/dashboard/);
}

async function openPIM(page) {
  await page.getByRole("link", { name: "PIM" }).click();
  await expect(page).toHaveURL(/pim/);
}

test.describe("PIM Functional Testing", () => {

  test.beforeEach(async ({ page }) => {
    await login(page);
    await openPIM(page);
  });

  test("1 Search employee by name", async ({ page }) => {
    await page.getByPlaceholder("Type for hints...").first().fill("Linda");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");
    await page.getByRole("button", { name: "Search" }).click();
    await expect(page).toHaveURL(/viewEmployeeList/);
  });

  test("2 Search employee by invalid name", async ({ page }) => {
    await page.getByPlaceholder("Type for hints...").first().fill("WrongEmployee");
    await page.getByRole("button", { name: "Search" }).click();
    await expect(page).toHaveURL(/viewEmployeeList/);
  });

  test("3 Search employee by ID", async ({ page }) => {
    await page.locator(".oxd-input").nth(1).fill("1234");
    await page.getByRole("button", { name: "Search" }).click();
    await expect(page).toHaveURL(/viewEmployeeList/);
  });

  test("4 Reset employee filter", async ({ page }) => {
    await page.locator(".oxd-input").nth(1).fill("1234");
    await page.getByRole("button", { name: "Reset" }).click();
    await expect(page.locator(".oxd-input").nth(1)).toHaveValue("");
  });

  test("5 Search again after reset", async ({ page }) => {
    await page.getByPlaceholder("Type for hints...").first().fill("WrongEmployee");
    await page.getByRole("button", { name: "Reset" }).click();
    await page.getByPlaceholder("Type for hints...").first().fill("Linda");
    await page.getByRole("button", { name: "Search" }).click();
    await expect(page).toHaveURL(/viewEmployeeList/);
  });

  test("6 Add employee empty form validation", async ({ page }) => {
    await page.getByRole("button", { name: "Add" }).click();
    await page.getByRole("button", { name: "Save" }).click();
    await expect(page.getByText("Required").first()).toBeVisible();
  });

  test("7 Add employee cancel workflow", async ({ page }) => {
    await page.getByRole("button", { name: "Add" }).click();
    await page.getByRole("button", { name: "Cancel" }).click();
    await expect(page).toHaveURL(/viewEmployeeList/);
  });

  test("8 Add employee with unique ID", async ({ page }) => {
    const empId = "9" + Date.now().toString().slice(-5);
    await page.getByRole("button", { name: "Add" }).click();
    await page.locator('input[name="firstName"]').fill("Auto");
    await page.locator('input[name="lastName"]').fill("User");
    await page.locator(".oxd-input").nth(4).clear();
    await page.locator(".oxd-input").nth(4).fill(empId);
    await page.getByRole("button", { name: "Save" }).click();
    await expect(page).toHaveURL(/viewPersonalDetails/);
  });

  test("9 Add employee with login details validation", async ({ page }) => {
    await page.getByRole("button", { name: "Add" }).click();
    await page.locator(".oxd-switch-input").click();
    await page.getByRole("button", { name: "Save" }).click();
    await expect(page.getByText("Required").first()).toBeVisible();
  });

  test("10 Search with special characters", async ({ page }) => {
    await page.getByPlaceholder("Type for hints...").first().fill("@@@###");
    await page.getByRole("button", { name: "Search" }).click();
    await expect(page).toHaveURL(/viewEmployeeList/);
  });

  test("11 Search with long employee name", async ({ page }) => {
    await page.getByPlaceholder("Type for hints...").first().fill("Very Long Invalid Employee Name Testing");
    await page.getByRole("button", { name: "Search" }).click();
    await expect(page).toHaveURL(/viewEmployeeList/);
  });

  test("12 Refresh after employee search", async ({ page }) => {
    await page.getByPlaceholder("Type for hints...").first().fill("Linda");
    await page.getByRole("button", { name: "Search" }).click();
    await page.reload();
    await expect(page).toHaveURL(/viewEmployeeList/);
  });

  test("13 Navigate PIM to Admin after search", async ({ page }) => {
    await page.getByPlaceholder("Type for hints...").first().fill("Linda");
    await page.getByRole("button", { name: "Search" }).click();
    await page.getByRole("link", { name: "Admin" }).click();
    await expect(page).toHaveURL(/admin/);
  });

  test("14 Navigate PIM to Leave after search", async ({ page }) => {
    await page.getByPlaceholder("Type for hints...").first().fill("Linda");
    await page.getByRole("button", { name: "Search" }).click();
    await page.getByRole("link", { name: "Leave" }).click();
    await expect(page).toHaveURL(/leave/);
  });

  test("15 Logout after PIM workflow", async ({ page }) => {
    await page.getByPlaceholder("Type for hints...").first().fill("Linda");
    await page.getByRole("button", { name: "Search" }).click();
    await page.locator(".oxd-userdropdown-tab").click();
    await page.getByRole("menuitem", { name: "Logout" }).click();
    await expect(page).toHaveURL(/login/);
  });

});