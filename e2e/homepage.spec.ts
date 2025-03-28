import { test, expect } from '@playwright/test';
import { getBlogPosts } from '@app/posts/utils';

const url = 'http://localhost:3001/';

test('has title', async ({ page }) => {
  await page.goto(url);

  await expect(page).toHaveTitle(/Yes Danny Blogs/);
});

const posts = getBlogPosts();

test('has Latest Posts section', async ({ page }) => {
  test.skip(posts.length < 1, 'No posts available');

  await page.goto(url);

  await expect(page.getByRole('heading', { name: 'Latest Posts' })).toBeVisible();

  const latestPosts = posts.slice(0, Math.min(posts.length, 3));
  for (const post of latestPosts) {
    await expect(page.getByRole('heading', { name: post.metadata.title })).toBeVisible();
  }
});

test('has links to posts', async ({ page }) => {
  test.skip(posts.length < 1, 'No posts available');

  await page.goto(url);

  const post = posts[0];
  const link = page.getByRole('link', { name: post.metadata.title });
  await expect(link).toBeVisible();

  await link.click();
  await page.waitForLoadState('networkidle');

  await expect(page.getByRole('article')).toBeVisible();
});
