import { test as setup, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const authFile = path.join(__dirname, '../playwright/.auth/user.json');

setup('authenticate', async ({ page,request }) => {
  if (fs.existsSync(authFile)){
const loginResponse = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
  data: {
    user: {
      email: 'teotest51@gmail.com',
      password: 'TEST_lol5'
    }
  }
})
expect(loginResponse.status()).toEqual(200);
const respJSON = await loginResponse.json()
const Token = respJSON.user.token
const storageStateFile = JSON.parse(fs.readFileSync(authFile, 'utf-8'))
storageStateFile.origins[0].localStorage[0].value = Token
fs.writeFileSync(authFile,JSON.stringify(storageStateFile,null,2))
  }
  else
  {
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
  }

});