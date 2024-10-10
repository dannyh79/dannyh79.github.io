import { type Metadata } from 'next';
import BlogPosts from 'app/components/Posts';
import { postSubPath } from 'app/constants';
import { getBlogPosts } from 'app/posts/utils';
import {
  PAGE_SIZE,
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from 'app/components/Pagination';

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

const startPage = 1 as const;

export default function Page(props: Props) {
  const {
    searchParams: { page: pageQuery },
  } = props;
  const posts = getBlogPosts();
  const currentPage = isNaN(Number(pageQuery)) ? startPage : Number(pageQuery);
  const pageItems = posts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  return (
    <section>
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter">All Posts</h1>
      <BlogPosts posts={pageItems} />
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href={{ query: { page: currentPage - 1 } }} />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href={{ query: { page: currentPage + 1 } }} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </section>
  );
}
