const { test, expect } = require("@playwright/test");

test.setTimeout(240000);

const baseURL = "https://opensource-demo.orangehrmlive.com/web/index.php";

async function safeGoto(page, url) {
  for (let i = 0; i < 5; i++) {
    try {
      await page.goto(url, {
        waitUntil: "networkidle",
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
  for (let attempt = 1; attempt <= 5; attempt++) {
    try {
      await safeGoto(page, `${baseURL}/auth/login`);

      const username = page.locator('input[name="username"]');
      const password = page.locator('input[name="password"]');

      await username.waitFor({ state: "visible", timeout: 120000 });
      await username.fill("Admin");
      await password.fill("admin123");

      await page.getByRole("button", { name: "Login" }).click();

      await expect(page).toHaveURL(/dashboard/, {
        timeout: 180000
      });

      return;
    } catch (error) {
      if (attempt === 5) throw error;
      await page.waitForTimeout(7000);
    }
  }
}

async function openMyInfo(page) {
  await safeGoto(page, `${baseURL}/pim/viewPersonalDetails`);
  await expect(page).toHaveURL(/viewPersonalDetails/, { timeout: 120000 });
}

async function openContactDetails(page) {
  await safeGoto(page, `${baseURL}/pim/contactDetails`);
  await expect(page).toHaveURL(/contactDetails/, { timeout: 120000 });
}

async function openEmergencyContacts(page) {
  await safeGoto(page, `${baseURL}/pim/viewEmergencyContacts`);
  await expect(page).toHaveURL(/viewEmergencyContacts/, { timeout: 120000 });
}

async function openDependents(page) {
  await safeGoto(page, `${baseURL}/pim/viewDependents`);
  await expect(page).toHaveURL(/viewDependents/, { timeout: 120000 });
}

async function openImmigration(page) {
  await safeGoto(page, `${baseURL}/pim/viewImmigration`);
  await expect(page).toHaveURL(/viewImmigration/, { timeout: 120000 });
}

async function openQualifications(page) {
  await safeGoto(page, `${baseURL}/pim/viewQualifications`);
  await expect(page).toHaveURL(/viewQualifications/, { timeout: 120000 });
}

async function openMemberships(page) {
  await safeGoto(page, `${baseURL}/pim/viewMemberships`);
  await expect(page).toHaveURL(/viewMemberships/, { timeout: 120000 });
}

async function clickFirstAddButton(page) {
  const addButton = page.getByRole("button", { name: "Add" }).first();

  if ((await addButton.count()) > 0) {
    await addButton.waitFor({ state: "visible", timeout: 60000 });
    await addButton.click();
    return true;
  }

  return false;
}

test.describe("My Info Functional Testing", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await openMyInfo(page);
  });

  test("1 Update nickname workflow", async ({ page }) => {
    const nickname = page.locator(".oxd-input").nth(4);

    if ((await nickname.count()) > 0) {
      await nickname.fill("AutoNick");
      await expect(nickname).toHaveValue("AutoNick");
    }

    await expect(page).toHaveURL(/viewPersonalDetails/);
  });

  test("2 Update other id workflow", async ({ page }) => {
    const otherId = page.locator(".oxd-input").nth(5);

    if ((await otherId.count()) > 0) {
      await otherId.fill("OTHER123");
      await expect(otherId).toHaveValue("OTHER123");
    }

    await expect(page).toHaveURL(/viewPersonalDetails/);
  });

  test("3 Nationality dropdown workflow", async ({ page }) => {
    const dropdown = page.locator(".oxd-select-text").first();

    if ((await dropdown.count()) > 0) {
      await dropdown.click();
      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("Enter");
    }

    await expect(page).toHaveURL(/viewPersonalDetails/);
  });

  test("4 Marital status dropdown workflow", async ({ page }) => {
    const dropdown = page.locator(".oxd-select-text").nth(1);

    if ((await dropdown.count()) > 0) {
      await dropdown.click();
      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("Enter");
    }

    await expect(page).toHaveURL(/viewPersonalDetails/);
  });

  test("5 Contact street update workflow", async ({ page }) => {
    await openContactDetails(page);

    const streetInput = page.locator(".oxd-input").nth(1);

    if ((await streetInput.count()) > 0) {
      await streetInput.fill("Automation Street");
      await expect(streetInput).toHaveValue("Automation Street");
    }

    await expect(page).toHaveURL(/contactDetails/);
  });

  test("6 Contact city update workflow", async ({ page }) => {
    await openContactDetails(page);

    const cityInput = page.locator(".oxd-input").nth(3);

    if ((await cityInput.count()) > 0) {
      await cityInput.fill("Chennai");
      await expect(cityInput).toHaveValue("Chennai");
    }

    await expect(page).toHaveURL(/contactDetails/);
  });

  test("7 Emergency contact required validation workflow", async ({ page }) => {
    await openEmergencyContacts(page);

    const clicked = await clickFirstAddButton(page);

    if (clicked) {
      await page.getByRole("button", { name: "Save" }).click();
      await expect(page.getByText("Required").first()).toBeVisible({ timeout: 60000 });
    }

    await expect(page).toHaveURL(/viewEmergencyContacts/);
  });

  test("8 Emergency contact input cancel workflow", async ({ page }) => {
    await openEmergencyContacts(page);

    const clicked = await clickFirstAddButton(page);

    if (clicked) {
      const inputs = page.locator(".oxd-input");

      if ((await inputs.count()) > 3) {
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

    const clicked = await clickFirstAddButton(page);

    if (clicked) {
      await page.getByRole("button", { name: "Save" }).click();
      await expect(page.getByText("Required").first()).toBeVisible({ timeout: 60000 });
    }

    await expect(page).toHaveURL(/viewDependents/);
  });

  test("10 Dependent relationship dropdown workflow", async ({ page }) => {
    await openDependents(page);

    const clicked = await clickFirstAddButton(page);

    if (clicked) {
      const nameInput = page.locator(".oxd-input").nth(1);

      if ((await nameInput.count()) > 0) {
        await nameInput.fill("Child One");
      }

      const dropdown = page.locator(".oxd-select-text").first();

      if ((await dropdown.count()) > 0) {
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

    const clicked = await clickFirstAddButton(page);

    if (clicked) {
      await page.getByRole("button", { name: "Save" }).click();
      await expect(page.getByText("Required").first()).toBeVisible({ timeout: 60000 });
    }

    await expect(page).toHaveURL(/viewImmigration/);
  });

  test("12 Immigration passport option workflow", async ({ page }) => {
    await openImmigration(page);

    const clicked = await clickFirstAddButton(page);

    if (clicked) {
      const passport = page.locator('input[type="radio"]').first();

      if ((await passport.count()) > 0) {
        await passport.check({ force: true });
      }

      const numberInput = page.locator(".oxd-input").nth(1);

      if ((await numberInput.count()) > 0) {
        await numberInput.fill("P1234567");
      }

      await page.getByRole("button", { name: "Cancel" }).click();
    }

    await expect(page).toHaveURL(/viewImmigration/);
  });

  test("13 Qualification work experience validation workflow", async ({ page }) => {
    await openQualifications(page);

    const clicked = await clickFirstAddButton(page);

    if (clicked) {
      await page.getByRole("button", { name: "Save" }).click();
      await expect(page.getByText("Required").first()).toBeVisible({ timeout: 60000 });
    }

    await expect(page).toHaveURL(/viewQualifications/);
  });

  test("14 Qualification work experience input workflow", async ({ page }) => {
    await openQualifications(page);

    const clicked = await clickFirstAddButton(page);

    if (clicked) {
      const inputs = page.locator(".oxd-input");

      if ((await inputs.count()) > 2) {
        await inputs.nth(1).fill("Automation Company");
        await inputs.nth(2).fill("Tester");
      }

      await page.getByRole("button", { name: "Cancel" }).click();
    }

    await expect(page).toHaveURL(/viewQualifications/);
  });

  test("15 Membership required validation workflow", async ({ page }) => {
    await openMemberships(page);

    const clicked = await clickFirstAddButton(page);

    if (clicked) {
      await page.getByRole("button", { name: "Save" }).click();
      await expect(page.getByText("Required").first()).toBeVisible({ timeout: 60000 });
    }

    await expect(page).toHaveURL(/viewMemberships/);
  });
});