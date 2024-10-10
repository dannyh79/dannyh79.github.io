'use client';

import { redirect, useSearchParams } from 'next/navigation';
import BlogPosts from 'app/components/Posts';
import { type Post } from 'app/posts/utils';
import Paginator, { PAGE_SIZE, START_PAGE } from 'app/components/Paginator';

type Props = {
  posts: Post[];
};

export default function CsrPage({ posts }: Props) {
  const pageQuery = useSearchParams().get('page');
  const pageCount = Math.ceil(posts.length / PAGE_SIZE);
  if (!!pageQuery && !isValidPageQuery(pageQuery, pageCount)) {
    redirect('/posts');
  }

  const currentPage = !pageQuery ? START_PAGE : Number(pageQuery);
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
