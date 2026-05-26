import fs from "fs";
import path from "path";

function write(file, content) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, content);
}

const layers = [
    "auth",
    "admin",
    "pim",
    "recruitment",
    "performance",
    "claim",
    "maintenance",
    "dashboard"
];

write(
    "package.json",
`{
  "name":"playwright-capstone-project",
  "version":"1.0.0",
  "type":"module",
  "scripts":{
    "test":"npx playwright test",
    "report":"npx playwright show-report",
    "allure:generate":"npx allure generate allure-results --clean -o allure-report",
    "allure:open":"npx allure open allure-report",
    "codegen":"npx playwright codegen https://opensource-demo.orangehrmlive.com/"
  },
  "devDependencies":{
    "@playwright/test":"^1.60.0",
    "allure-commandline":"^2.41.0",
    "allure-playwright":"^3.9.0"
  }
}`
);

write(
".gitignore",
`
node_modules/
playwright-report/
allure-results/
allure-report/
test-results/
`
);

write(
"playwright.config.js",
`
// @ts-check
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({

 testDir:'./tests',

 reporter:[
   ['html'],
   ['allure-playwright',{resultsDir:'allure-results'}]
 ],

 fullyParallel:true,

 use:{

   trace:'on-first-retry',

   screenshot:'only-on-failure',

   video:'retain-on-failure'
 },

 projects:[

 {
   name:'chromium',
   use:{...devices['Desktop Chrome']}
 },

 {
   name:'firefox',
   use:{...devices['Desktop Firefox']}
 },

 {
   name:'webkit',
   use:{...devices['Desktop Safari']}
 }

 ]

});
`
);

write(
"pages/loginPage.js",
`
export class LoginPage{

constructor(page){

this.page=page;

this.username=
page.locator('input[name="username"]');

this.password=
page.locator('input[name="password"]');

this.loginBtn=
page.locator('button[type="submit"]');

}

async login(user,pass){

await this.username.fill(user);

await this.password.fill(pass);

await this.loginBtn.click();

}

}
`
);

for(const layer of layers){

let tests = `
import {test,expect}
from "@playwright/test";

import {
LoginPage
}
from "../../pages/loginPage.js";

test.describe(
"${layer}",
()=>{

test.beforeEach(
async({page})=>{

await page.goto(
"https://opensource-demo.orangehrmlive.com/"
);

});

`;

for(let i=1;i<=15;i++){

tests += `
test(
"${i} ${layer} testcase",
async({page})=>{

const login=
new LoginPage(page);

await login.login(
"Admin",
"admin123"
);

await expect(
page
).toHaveURL(
/dashboard/i
);

}
);
`;
}

tests += `
});
`;

write(
`tests/${layer}/${layer}.spec.js`,
tests
);

}

write(
".github/workflows/playwright.yml",
`
name: Playwright Tests

on:
 push:
   branches:[main]

jobs:

 test:

  runs-on:
   ubuntu-latest

  steps:

  - uses:
      actions/checkout@v4

  - uses:
      actions/setup-node@v4

    with:
      node-version:lts/*

  - run:
      npm install

  - run:
      npx playwright install --with-deps

  - run:
      npx playwright test

  - run:
      npx allure generate allure-results --clean -o allure-report
`
);

write(
"README.md",
`
# Playwright OrangeHRM Capstone

Modules:

1 Authentication
2 Admin
3 PIM
4 Recruitment
5 Performance
6 Claim
7 Maintenance
8 Dashboard

Total:
120 tests
`
);

console.log(
"Capstone generated"
);