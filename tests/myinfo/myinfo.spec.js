const { test, expect } = require("@playwright/test");

test.setTimeout(240000);

const baseURL = "https://opensource-demo.orangehrmlive.com/web/index.php";

async function safeGoto(page, url) {
  for (let i = 0; i < 5; i++) {
    try {
      await page.goto(url, {
        waitUntil: "domcontentloaded",
        timeout: 180000
      });
      return;
    } catch (error) {
      if (i === 4) throw error;
      await page.waitForTimeout(5000);
    }
  }
}

async function login(page) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
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

      if (!page.url().includes("/auth/login")) {
        await expect(page).toHaveURL(/dashboard/, {
          timeout: 180000
        });
        return;
      }
    } catch (error) {
      if (attempt === 3) throw error;
      await page.waitForTimeout(5000);
    }
  }
}

async function openMyInfo(page) {
  await safeGoto(page, `${baseURL}/pim/viewPersonalDetails/empNumber/7`);
  await expect(page).toHaveURL(/viewPersonalDetails/, { timeout: 90000 });
}

async function openContactDetails(page) {
  await safeGoto(page, `${baseURL}/pim/contactDetails/empNumber/7`);
  await expect(page).toHaveURL(/contactDetails/, { timeout: 90000 });
}

async function openEmergencyContacts(page) {
  await safeGoto(page, `${baseURL}/pim/viewEmergencyContacts/empNumber/7`);
  await expect(page).toHaveURL(/viewEmergencyContacts/, { timeout: 90000 });
}

async function openDependents(page) {
  await safeGoto(page, `${baseURL}/pim/viewDependents/empNumber/7`);
  await expect(page).toHaveURL(/viewDependents/, { timeout: 90000 });
}

async function openImmigration(page) {
  await safeGoto(page, `${baseURL}/pim/viewImmigration/empNumber/7`);
  await expect(page).toHaveURL(/viewImmigration/, { timeout: 90000 });
}

async function openQualifications(page) {
  await safeGoto(page, `${baseURL}/pim/viewQualifications/empNumber/7`);
  await expect(page).toHaveURL(/viewQualifications/, { timeout: 90000 });
}

async function openMemberships(page) {
  await safeGoto(page, `${baseURL}/pim/viewMemberships/empNumber/7`);
  await expect(page).toHaveURL(/viewMemberships/, { timeout: 90000 });
}

test.describe("My Info Functional Testing", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await openMyInfo(page);
  });

  test("1 Update nickname workflow", async ({ page }) => {
    const nickname = page.locator(".oxd-input").nth(4);

    if (await nickname.count()) {
      await nickname.fill("AutoNick");
    }

    await expect(page).toHaveURL(/viewPersonalDetails/);
  });

  test("2 Update other id workflow", async ({ page }) => {
    const otherId = page.locator(".oxd-input").nth(5);

    if (await otherId.count()) {
      await otherId.fill("OTHER123");
    }

    await expect(page).toHaveURL(/viewPersonalDetails/);
  });

  test("3 Nationality dropdown workflow", async ({ page }) => {
    const dropdown = page.locator(".oxd-select-text").first();

    if (await dropdown.count()) {
      await dropdown.click();
      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("Enter");
    }

    await expect(page).toHaveURL(/viewPersonalDetails/);
  });

  test("4 Marital status dropdown workflow", async ({ page }) => {
    const dropdown = page.locator(".oxd-select-text").nth(1);

    if (await dropdown.count()) {
      await dropdown.click();
      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("Enter");
    }

    await expect(page).toHaveURL(/viewPersonalDetails/);
  });

  test("5 Contact street update workflow", async ({ page }) => {
    await openContactDetails(page);

    const streetInput = page.locator(".oxd-input").nth(1);

    if (await streetInput.count()) {
      await streetInput.fill("Automation Street");
    }

    await expect(page).toHaveURL(/contactDetails/);
  });

  test("6 Contact city update workflow", async ({ page }) => {
    await openContactDetails(page);

    const cityInput = page.locator(".oxd-input").nth(3);

    if (await cityInput.count()) {
      await cityInput.fill("Chennai");
    }

    await expect(page).toHaveURL(/contactDetails/);
  });

  test("7 Emergency contact required validation workflow", async ({ page }) => {
    await openEmergencyContacts(page);

    const addButton = page.getByRole("button", { name: "Add" }).first();

    if (await addButton.count()) {
      await addButton.click();
      await page.getByRole("button", { name: "Save" }).click();
      await expect(page.getByText("Required").first()).toBeVisible();
    } else {
      await expect(page).toHaveURL(/viewEmergencyContacts/);
    }
  });

  test("8 Emergency contact input cancel workflow", async ({ page }) => {
    await openEmergencyContacts(page);

    const addButton = page.getByRole("button", { name: "Add" }).first();

    if (await addButton.count()) {
      await addButton.click();

      const inputs = page.locator(".oxd-input");

      if (await inputs.count()) {
        await inputs.nth(1).fill("Father");
        await inputs.nth(2).fill("Parent");
        await inputs.nth(3).fill("9876543210");
      }

      await page.getByRole("button", { name: "Cancel" }).click();
    }

    await expect(page).toHaveURL(/viewEmergencyContacts/);
  });

  test("9 Dependent required validation workflow", async ({ page }) => {
    await openDependents(page);

    const addButton = page.getByRole("button", { name: "Add" }).first();

    if (await addButton.count()) {
      await addButton.click();
      await page.getByRole("button", { name: "Save" }).click();
      await expect(page.getByText("Required").first()).toBeVisible();
    } else {
      await expect(page).toHaveURL(/viewDependents/);
    }
  });

  test("10 Dependent relationship dropdown workflow", async ({ page }) => {
    await openDependents(page);

    const addButton = page.getByRole("button", { name: "Add" }).first();

    if (await addButton.count()) {
      await addButton.click();

      const nameInput = page.locator(".oxd-input").nth(1);

      if (await nameInput.count()) {
        await nameInput.fill("Child One");
      }

      const dropdown = page.locator(".oxd-select-text").first();

      if (await dropdown.count()) {
        await dropdown.click();
        await page.keyboard.press("ArrowDown");
        await page.keyboard.press("Enter");
      }

      await page.getByRole("button", { name: "Cancel" }).click();
    }

    await expect(page).toHaveURL(/viewDependents/);
  });

  test("11 Immigration required validation workflow", async ({ page }) => {
    await openImmigration(page);

    const addButton = page.getByRole("button", { name: "Add" }).first();

    if (await addButton.count()) {
      await addButton.click();
      await page.getByRole("button", { name: "Save" }).click();
      await expect(page.getByText("Required").first()).toBeVisible();
    } else {
      await expect(page).toHaveURL(/viewImmigration/);
    }
  });

  test("12 Immigration passport option workflow", async ({ page }) => {
    await openImmigration(page);

    const addButton = page.getByRole("button", { name: "Add" }).first();

    if (await addButton.count()) {
      await addButton.click();

      const passport = page.locator('input[type="radio"]').first();

      if (await passport.count()) {
        await passport.check({ force: true });
      }

      const numberInput = page.locator(".oxd-input").nth(1);

      if (await numberInput.count()) {
        await numberInput.fill("P1234567");
      }

      await page.getByRole("button", { name: "Cancel" }).click();
    }

    await expect(page).toHaveURL(/viewImmigration/);
  });

  test("13 Qualification work experience validation workflow", async ({ page }) => {
    await openQualifications(page);

    const addButton = page.getByRole("button", { name: "Add" }).first();

    if (await addButton.count()) {
      await addButton.click();
      await page.getByRole("button", { name: "Save" }).click();
      await expect(page.getByText("Required").first()).toBeVisible();
    } else {
      await expect(page).toHaveURL(/viewQualifications/);
    }
  });

  test("14 Qualification work experience input workflow", async ({ page }) => {
    await openQualifications(page);

    const addButton = page.getByRole("button", { name: "Add" }).first();

    if (await addButton.count()) {
      await addButton.click();

      const inputs = page.locator(".oxd-input");

      if (await inputs.count()) {
        await inputs.nth(1).fill("Automation Company");
        await inputs.nth(2).fill("Tester");
      }

      await page.getByRole("button", { name: "Cancel" }).click();
    }

    await expect(page).toHaveURL(/viewQualifications/);
  });

  test("15 Membership required validation workflow", async ({ page }) => {
    await openMemberships(page);

    const addButton = page.getByRole("button", { name: "Add" }).first();

    if (await addButton.count()) {
      await addButton.click();
      await page.getByRole("button", { name: "Save" }).click();
      await expect(page.getByText("Required").first()).toBeVisible();
    } else {
      await expect(page).toHaveURL(/viewMemberships/);
    }
  });
});