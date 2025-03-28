import { type Metadata } from 'next';
import { getBlogPosts } from 'app/posts/utils';
import BlogPosts from './components/Posts';
import { siteDescription, title } from './constants';

export const metadata: Metadata = {
  alternates: {
    canonical: '/',
  },
};

export default function Page() {
  const firstThreePosts = getBlogPosts().slice(0, 3);
  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">{title}</h1>
      <p className="mb-4">{siteDescription}</p>
      <div className="my-8">
        <h2 className="mb-4 text-xl font-semibold tracking-tighter">Latest Posts</h2>
        <BlogPosts posts={firstThreePosts} />
      </div>
    </section>
  );
}
