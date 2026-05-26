# Playwright Codegen Commands

Use these commands to record browser actions and generate locators.

## Local capstone app

```powershell
npm run start
npx playwright codegen http://localhost:3000
```

## External practice website

```powershell
npx playwright codegen https://automationexercise.com
```

Codegen is used for learning locator generation, but final framework uses reusable POM, API helpers, fixtures, reports, CI/CD, and GitHub Pages.
