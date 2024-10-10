import { Suspense } from 'react';
import { type Metadata } from 'next';
import { postSubPath } from 'app/constants';
import { getBlogPosts } from 'app/posts/utils';
import CsrPage from './PostsPage';

export const metadata: Metadata = {
  title: 'Blog',
  description: `Danny's blog.`,
  alternates: {
    canonical: `/${postSubPath}`,
  },
};

export default function Page() {
  const posts = getBlogPosts();
  return (
    <Suspense>
      <CsrPage posts={posts} />
    </Suspense>
  );
}
