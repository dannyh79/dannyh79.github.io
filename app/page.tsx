import BlogPosts from './components/Posts';
import { siteDescription, title } from './constants';
import { getBlogPosts } from 'app/posts/utils';

export default function Page() {
  const lastThreePosts = getBlogPosts().filter((_, index, posts) => index >= posts.length - 3);
  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">{title}</h1>
      <p className="mb-4">{siteDescription}</p>
      <div className="my-8">
        <h2 className="mb-4 text-xl font-semibold tracking-tighter">Lastest Posts</h2>
        <BlogPosts posts={lastThreePosts} />
      </div>
    </section>
  );
}
