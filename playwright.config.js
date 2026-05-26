
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
