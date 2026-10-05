import { test, expect } from '@playwright/test';
import tags from '../test-data/tags.json'
import authData from '../playwright/.auth/user.json'
const API_TOKEN = authData.origins[0].localStorage[0].value;

// test.beforeEach('Go to base URL', async ({ page }) => {
//   await page.route(
//     '*/**/api/tags', async route => {
//     await route.fulfill({
//       json: tags,
//     });
// });

// await page.route(
//     '*/**/api/articles*', async route => {
//     const resp = await route.fetch();
//     const respJSON = await resp.json();
//     respJSON.articles[0].title = "This is the MOCK Title from Nejma"
//     respJSON.articles[0].description = "This is the MOCK Description from Nejma"
//     await route.fulfill({
//       json: respJSON,
//     });

// });

//   await page.goto('https://conduit.bondaracademy.com/');
// });

test('has title', async ({ page }) => {
  //This is the beforeEach code block that is commented out. 
  // It mocks the API responses for tags and articles, 
  // and then navigates to the base URL of the application.
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

  // Expect a title "to contain" a substring.
  await expect(page.locator('.navbar-brand')).toHaveText(/conduit/);
  await expect(page.locator('.sidebar .tag-pill')).toContainText(['Automation', 'Playwright']);
  await expect(page.locator('.preview-link h1').first()).toContainText('This is the MOCK Title from Nejma');
  await expect(page.locator('.preview-link p').first()).toContainText('This is the MOCK Description from Nejma');

})

test('Delete Article', async ({ page,request }) => {

const loginArticleRsp = await request.post('https://conduit-api.bondaracademy.com/api/articles', {
  data: {
    "article": {
      "title":"test title",
      "description":"test description",
      "body":"hallo , this is the article",
      "tagList":[]
    }
  },
  headers: {
    'Authorization': `Token ${API_TOKEN}`
  }

})
expect(loginArticleRsp.status()).toEqual(201);


//App already logged in 
  await page.goto('https://conduit.bondaracademy.com/');
  
// Check the new article on WEB
  await expect(page.locator('.preview-link h1').first()).toContainText('test title');
  await expect(page.locator('.preview-link p').first()).toContainText('test description');

  await page.getByText('test title').click()
  await page.getByRole('button', {name: ' Delete Article '}).first().click()
  await page.waitForResponse('https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0')
  await expect(page.locator('.preview-link h1').first()).not.toContainText('test title');
});


test('Create Article', async ({ page,request }) => {

//App already logged in 
  await page.goto('https://conduit.bondaracademy.com/');
 
  //Create  New Article 
  await page.getByText('New Article').click()
  await page.getByPlaceholder('Article Title').fill('Article Title')
  await page.getByPlaceholder("What's this article about?").fill("What's this article about?")
  await page.getByPlaceholder('Write your article (in markdown)').fill('Write your article (in markdown)')
  await page.getByRole('button',{name:'Publish Article'}).click()
  const createArticleRsp = await page.waitForResponse('https://conduit-api.bondaracademy.com/api/articles/')
  const createArticleRspJSON = await createArticleRsp.json()
  const articleID = createArticleRspJSON.article.slug

// Check the new article on WEB
  await expect(page.locator('.article-page h1').first()).toContainText('Article Title');
  await page.getByText('Home').click()
  await expect(page.locator('.preview-link h1').first()).toContainText('Article Title');

  //Delete the test article using the API 

  const deleteArticleRsp = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${articleID}`, {

  headers: {
    'Authorization': `Token ${API_TOKEN}`
  }

})
expect(deleteArticleRsp.status()).toEqual(204);

  
});