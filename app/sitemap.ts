import { baseUrl, postSubPath } from './constants';
import { getBlogPosts } from './posts/utils';

// Next v15 bug; see https://github.com/vercel/next.js/issues/68667
export const dynamic = 'force-static';

export default async function sitemap() {
  const blogs = getBlogPosts().map((post) => ({
    url: `${baseUrl}/${postSubPath}/${post.slug}`,
    lastModified: post.metadata.publishedAt,
  }));

  const routes = ['', `/${postSubPath}`].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }));

  return [...routes, ...blogs];
}
