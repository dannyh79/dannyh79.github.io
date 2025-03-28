import { test, expect } from '@playwright/test';
import { getBlogPosts } from '@app/posts/utils';
import { PAGE_SIZE } from '@app/components/Paginator';

const url = 'http://localhost:3001/posts';

test('has title', async ({ page }) => {
  await page.goto(url);

  await expect(page).toHaveTitle(/Blog | Yes Danny Blogs/);
});

const posts = getBlogPosts();

test('has All Posts section', async ({ page }) => {
  test.skip(posts.length < 1, 'No posts available');

  await page.goto(url);

  await expect(page.getByRole('heading', { name: 'All Posts' })).toBeVisible();

  const firstPagePosts = getBlogPosts().slice(0, Math.min(posts.length, PAGE_SIZE));

  for (const post of firstPagePosts) {
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
