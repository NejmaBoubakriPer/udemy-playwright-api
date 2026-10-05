import { test as setup, expect } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, '../playwright/.auth/user.json');

setup('authenticate', async ({ page }) => {
  // Perform authentication steps.
  await page.goto('https://conduit.bondaracademy.com/');
  await page.getByText('Sign in').click()
  await page.getByPlaceholder('Email').fill('teotest51@gmail.com')
  await page.getByPlaceholder('Password').fill('TEST_lol5')
  await page.getByRole('button',{name:'Sign in'}).click()
  //wait until the page reaches a state where all cookies are set.
  await expect(page.getByRole('link', { name: 'New Article' })).toBeVisible();

  // End of authentication steps.

  await page.context().storageState({ path: authFile });
});