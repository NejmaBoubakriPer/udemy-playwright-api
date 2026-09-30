import { test, expect } from '@playwright/test';
import tags from '../test-data/tags.json'

test.beforeEach('Go to base URL', async ({ page }) => {
  await page.route(
    '*/**/api/tags', async route => {
    await route.fulfill({
      json: tags,
    });
});

await page.route(
    '*/**/api/articles*', async route => {
    const resp = await route.fetch();
    const respJSON = await resp.json();
    respJSON.articles[0].title = "This is the MOCK Title from Nejma"
    respJSON.articles[0].description = "This is the MOCK Description from Nejma"
    await route.fulfill({
      json: respJSON,
    });

});

  await page.goto('https://conduit.bondaracademy.com/');
});

test('has title', async ({ page }) => {
  // Expect a title "to contain" a substring.
  await expect(page.locator('.navbar-brand')).toHaveText(/conduit/);
  await expect(page.locator('.sidebar .tag-pill')).toContainText(['Automation', 'Playwright']);
  await expect(page.locator('.preview-link h1').first()).toContainText('This is the MOCK Title from Nejma');
  await expect(page.locator('.preview-link p').first()).toContainText('This is the MOCK Description from Nejma');

})
