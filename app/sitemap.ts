import { baseUrl, postSubPath } from './constants'
import { getBlogPosts } from './posts/utils'

export default async function sitemap() {
  const blogs = getBlogPosts().map((post) => ({
    url: `${baseUrl}/${postSubPath}/${post.slug}`,
    lastModified: post.metadata.publishedAt,
  }))

  const routes = ['', `/${postSubPath}`].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }))

  return [...routes, ...blogs]
}
