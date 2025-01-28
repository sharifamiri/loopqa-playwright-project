import { test, expect } from '@playwright/test';
import fs from 'fs';

// Read JSON data correctly
const rawData = fs.readFileSync('./test-data/test-cases.json');
const testCases = JSON.parse(rawData);

const DEMO_APP_URL = 'https://animated-gingersnap-8cf7f2.netlify.app/';
const USERNAME = 'admin';
const PASSWORD = 'password123';

test.describe('Demo App Data-Driven Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(DEMO_APP_URL);
    await page.fill('input[id="username"]', USERNAME);
    await page.fill('input[id="password"]', PASSWORD);
    await page.click('button[type="submit"]');
    await expect(page.locator('//h1[contains(text(), "Projects")]')).toBeVisible();
  });

  for (const testCase of testCases) {
    test(`Verify task "${testCase.task}" in ${testCase.section}`, async ({ page }) => {
      await page.click(`text=${testCase.section}`);
      const columnLocator = page.locator(`//h2[contains(text(), "${testCase.column}")]`);
      await expect(columnLocator).toBeVisible();
      const taskLocator = columnLocator.locator(`xpath=following-sibling::div//h3[contains(text(), "${testCase.task}")]`);
      await expect(taskLocator).toBeVisible();
      for (const tag of testCase.tags) {
        const tagLocator = taskLocator.locator(`xpath=following-sibling::div//span[contains(text(), "${tag}")]`);
        await expect(tagLocator).toBeVisible();
      }
    });
  }
});
