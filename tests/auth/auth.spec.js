import { test, expect } from "@playwright/test";

const loginUrl =
"https://opensource-demo.orangehrmlive.com/web/index.php/auth/login";

test.setTimeout(90000);


// Open login page
async function openLogin(page){

  await page.goto(
    loginUrl,
    {
      waitUntil:"domcontentloaded",
      timeout:60000
    }
  );

  await expect(

    page.locator(
      'input[name="username"]'

    )

  ).toBeVisible();

}


// Login helper
async function login(
  page,
  user,
  pass
){

  await page.locator(
    'input[name="username"]'
  ).fill(
    user
  );

  await page.locator(
    'input[name="password"]'
  ).fill(
    pass
  );

  await page.locator(
    'button[type="submit"]'
  ).click();

}



test.describe(

"Authentication & Session Security",

()=>{


test.beforeEach(

async({page})=>{

await openLogin(page);

}

);




// 1 Valid login
test(

"1 Valid login",

async({page})=>{

await login(

page,

"Admin",

"admin123"

);

await expect(

page

).toHaveURL(

/dashboard/,

{

timeout:60000

}

);

}

);




// 2 Invalid password
test(

"2 Invalid password",

async({page})=>{

await login(

page,

"Admin",

"wrong123"

);

await expect(

page.locator(
".oxd-alert-content-text"
)

).toBeVisible();

}

);




// 3 Empty username
test(

"3 Empty username",

async({page})=>{

await page.fill(

'input[name="password"]',

"admin123"

);

await page.click(

'button[type="submit"]'

);

await expect(

page.locator(

".oxd-input-field-error-message"

).first()

).toBeVisible();

}

);




// 4 Empty password
test(

"4 Empty password",

async({page})=>{

await page.fill(

'input[name="username"]',

"Admin"

);

await page.click(

'button[type="submit"]'

);

await expect(

page.locator(

".oxd-input-field-error-message"

).first()

).toBeVisible();

}

);




// 5 Empty both
test(

"5 Empty both",

async({page})=>{

await page.click(

'button[type="submit"]'

);

await expect(

page.locator(

".oxd-input-field-error-message"

)

).toHaveCount(

2

);

}

);




// 6 SQL injection
test(

"6 SQL injection",

async({page})=>{

await login(

page,

"' OR 1=1 --",

"' OR 1=1 --"

);

await expect(

page.locator(

".oxd-alert-content-text"

)

).toBeVisible();

}

);




// 7 Password masking
test(

"7 Password masking",

async({page})=>{

await expect(

page.locator(

'input[name="password"]'

)

).toHaveAttribute(

"type",

"password"

);

}

);




// 8 Refresh login page
test(

"8 Refresh login page",

async({page})=>{

await page.reload();

await expect(

page.locator(

'input[name="username"]'

)

).toBeVisible();

}

);




// 9 Logout
test(

"9 Logout",

async({page})=>{

await login(

page,

"Admin",

"admin123"

);

await expect(

page

).toHaveURL(

/dashboard/,

{

timeout:60000

}

);

await page.locator(

".oxd-userdropdown-name"

).click();

await page.getByText(

/Logout|Cerrar sesión/

).click();

await expect(

page

).toHaveURL(

/login/

);

}

);




// 10 Unauthorized access
test(

"10 Unauthorized access",

async({page})=>{

await page.goto(

"https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index"

);

await expect(

page

).toHaveURL(

/login/

);

}

);




// 11 Refresh after login
test(

"11 Refresh dashboard",

async({page})=>{

await login(

page,

"Admin",

"admin123"

);

await expect(

page

).toHaveURL(

/dashboard/,

{

timeout:60000

}

);

await page.reload();

await expect(

page

).toHaveURL(

/dashboard/

);

}

);




// 12 Multi tab
test(

"12 Multi tab",

async({browser})=>{

const context=

await browser.newContext();

const p1=

await context.newPage();

const p2=

await context.newPage();

await openLogin(

p1

);

await openLogin(

p2

);

await context.close();

}

);




// 13 Cookie validation
test(

"13 Cookie validation",

async({page})=>{

await login(

page,

"Admin",

"admin123"

);

const cookies=

await page.context().cookies();

expect(

cookies.length

).toBeGreaterThan(

0

);

}

);




// 14 Storage state
test(

"14 Storage state",

async({page})=>{

await login(

page,

"Admin",

"admin123"

);

await page.context().storageState({

path:"auth.json"

});

}

);




// 15 Soft assertions
test(

"15 Soft assertions",

async({page})=>{

await expect.soft(

page.locator(

'input[name="username"]'

)

).toBeVisible();

await expect.soft(

page.locator(

'input[name="password"]'

)

).toBeVisible();

}

);



});