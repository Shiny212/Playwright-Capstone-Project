# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin/admin.spec.js >> Admin User Management >> 4 Open Add User form
- Location: tests/admin/admin.spec.js:70:3

# Error details

```
Test timeout of 90000ms exceeded while running "beforeEach" hook.
```

```
Error: expect.toHaveURL: Target page, context or browser has been closed
```

# Page snapshot

```yaml
- generic [ref=e4]:
  - generic [ref=e6]:
    - generic [ref=e7]:
      - img "company-branding"
    - generic [ref=e8]:
      - heading "Login" [level=5] [ref=e9]
      - generic [ref=e10]:
        - generic [ref=e12]:
          - paragraph [ref=e13]: "Username : Admin"
          - paragraph [ref=e14]: "Password : admin123"
        - generic [ref=e15]:
          - generic [ref=e17]:
            - generic [ref=e18]:
              - generic [ref=e19]: 
              - generic [ref=e20]: Username
            - textbox "Username" [ref=e22]: Admin
          - generic [ref=e24]:
            - generic [ref=e25]:
              - generic [ref=e26]: 
              - generic [ref=e27]: Password
            - textbox "Password" [ref=e29]: admin123
          - button "Login" [active] [ref=e31] [cursor=pointer]
          - paragraph [ref=e33] [cursor=pointer]: Forgot your password?
      - generic [ref=e34]:
        - generic [ref=e35]:
          - link [ref=e36] [cursor=pointer]:
            - /url: https://www.linkedin.com/company/orangehrm/mycompany/
          - link [ref=e39] [cursor=pointer]:
            - /url: https://www.facebook.com/OrangeHRM/
          - link [ref=e42] [cursor=pointer]:
            - /url: https://twitter.com/orangehrm?lang=en
          - link [ref=e45] [cursor=pointer]:
            - /url: https://www.youtube.com/c/OrangeHRMInc
        - generic [ref=e48]:
          - paragraph [ref=e49]: OrangeHRM OS 5.8
          - paragraph [ref=e50]:
            - text: © 2005 - 2026
            - link "OrangeHRM, Inc" [ref=e51] [cursor=pointer]:
              - /url: http://www.orangehrm.com
            - text: . All rights reserved.
  - generic [ref=e52]:
    - img "orangehrm-logo"
```

# Test source

```ts
  1   | import { test, expect } from "@playwright/test";
  2   | 
  3   | test.setTimeout(90000);
  4   | 
  5   | async function login(page) {
  6   |   await page.goto(
  7   |     "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login",
  8   |     {
  9   |       waitUntil: "domcontentloaded",
  10  |       timeout: 60000
  11  |     }
  12  |   );
  13  | 
  14  |   await page.locator('input[name="username"]').waitFor({
  15  |     state: "visible",
  16  |     timeout: 60000
  17  |   });
  18  | 
  19  |   await page.locator('input[name="username"]').fill("Admin");
  20  |   await page.locator('input[name="password"]').fill("admin123");
  21  |   await page.locator('button[type="submit"]').click();
  22  | 
> 23  |   await expect(page).toHaveURL(/dashboard/, {
      |                      ^ Error: expect.toHaveURL: Target page, context or browser has been closed
  24  |     timeout: 60000
  25  |   });
  26  | }
  27  | 
  28  | async function openAdmin(page) {
  29  |   await page.getByRole("link", { name: /^Admin$/ }).click();
  30  | 
  31  |   await expect(page).toHaveURL(/admin/, {
  32  |     timeout: 60000
  33  |   });
  34  | }
  35  | 
  36  | async function openAddUser(page) {
  37  |   await page.getByRole("button", { name: /Add|Añadir/ }).click();
  38  | 
  39  |   await page.waitForURL(/saveSystemUser/, {
  40  |     timeout: 60000
  41  |   });
  42  | }
  43  | 
  44  | test.describe("Admin User Management", () => {
  45  |   test.beforeEach(async ({ page }) => {
  46  |     await login(page);
  47  |     await openAdmin(page);
  48  |   });
  49  | 
  50  |   test("1 Open Admin module", async ({ page }) => {
  51  |     await expect(page).toHaveURL(/admin/);
  52  |   });
  53  | 
  54  |   test("2 Search existing admin user", async ({ page }) => {
  55  |     await page.locator(".oxd-input").nth(1).fill("Admin");
  56  |     await page.getByRole("button", { name: /Search|Buscar/ }).click();
  57  | 
  58  |     await expect(page.locator(".oxd-table")).toBeVisible({
  59  |       timeout: 30000
  60  |     });
  61  |   });
  62  | 
  63  |   test("3 Reset search filters", async ({ page }) => {
  64  |     await page.locator(".oxd-input").nth(1).fill("Admin");
  65  |     await page.getByRole("button", { name: /Reset|Restablecer/ }).click();
  66  | 
  67  |     await expect(page.locator(".oxd-input").nth(1)).toHaveValue("");
  68  |   });
  69  | 
  70  |   test("4 Open Add User form", async ({ page }) => {
  71  |     await openAddUser(page);
  72  | 
  73  |     await expect(page).toHaveURL(/saveSystemUser/);
  74  |   });
  75  | 
  76  |   test("5 Required validation on empty Add User form", async ({ page }) => {
  77  |     await openAddUser(page);
  78  | 
  79  |     await page.getByRole("button", { name: /Save|Guardar/ }).click();
  80  | 
  81  |     await expect(
  82  |       page.locator(".oxd-input-field-error-message").first()
  83  |     ).toBeVisible({
  84  |       timeout: 30000
  85  |     });
  86  |   });
  87  | 
  88  |   test("6 User role dropdown should open", async ({ page }) => {
  89  |     await openAddUser(page);
  90  | 
  91  |     await page.locator(".oxd-select-text").first().click();
  92  | 
  93  |     await expect(page.locator(".oxd-select-dropdown")).toBeVisible({
  94  |       timeout: 30000
  95  |     });
  96  |   });
  97  | 
  98  |   test("7 Employee name field should be available", async ({ page }) => {
  99  |     await openAddUser(page);
  100 | 
  101 |     await expect(page.locator('input[placeholder]').first()).toBeVisible({
  102 |       timeout: 30000
  103 |     });
  104 |   });
  105 | 
  106 |   test("8 Username field should be available", async ({ page }) => {
  107 |     await openAddUser(page);
  108 | 
  109 |     await expect(page.locator(".oxd-input").nth(1)).toBeVisible({
  110 |       timeout: 30000
  111 |     });
  112 |   });
  113 | 
  114 |   test("9 Password field should be available", async ({ page }) => {
  115 |     await openAddUser(page);
  116 | 
  117 |     await expect(page.locator('input[type="password"]').first()).toBeVisible({
  118 |       timeout: 30000
  119 |     });
  120 |   });
  121 | 
  122 |   test("10 Confirm password field should be available", async ({ page }) => {
  123 |     await openAddUser(page);
```