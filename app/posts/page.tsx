import { type Metadata } from 'next';
import { notFound } from 'next/navigation';
import BlogPosts from 'app/components/Posts';
import { postSubPath } from 'app/constants';
import { getBlogPosts } from 'app/posts/utils';
import Paginator, { PAGE_SIZE, START_PAGE } from 'app/components/Paginator';

export const metadata: Metadata = {
  title: 'Blog',
  description: `Danny's blog.`,
  alternates: {
    canonical: `/${postSubPath}`,
  },
};

type Props = {
  searchParams: {
    page?: string;
  };
};

export default function Page(props: Props) {
  const {
    searchParams: { page: pageQuery },
  } = props;

  const posts = getBlogPosts();
  const pageCount = Math.ceil(posts.length / PAGE_SIZE);
  if (!!pageQuery && !isValidPageQuery(pageQuery, pageCount)) {
    notFound();
  }

  const currentPage = isNaN(Number(pageQuery)) ? START_PAGE : Number(pageQuery);
  const postsByPage = posts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  return (
    <section>
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter">All Posts</h1>
      <BlogPosts posts={postsByPage} />
      <Paginator count={pageCount} page={currentPage} />
    </section>
  );
}

function isValidPageQuery(value: string, pageCount: number): boolean {
  const valueNumber = Number(value);
  return !isNaN(valueNumber) && valueNumber >= START_PAGE && valueNumber <= pageCount;
}
