'use client';

import React from 'react';
import { postSubPath } from 'app/constants';
import { type Post } from 'app/posts/utils';
import Link from './Link';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './Pagination';
import { formatDate } from './utils';

type Props = {
  posts: Post[];

  /** @defaultValue true */
  isPaginated?: boolean;
};

export default function BlogPosts(props: Props) {
  const { isPaginated = true, posts } = props;
  return (
    <ol>
      {posts.map((post) => (
        <li key={post.slug}>
          <Link className="flex flex-col space-y-1 mb-4" href={`/${postSubPath}/${post.slug}`}>
            <div className="w-full flex flex-col space-x-0 md:space-x-2">
              <h3 className="text-xl text-neutral-900 dark:text-neutral-100 tracking-tight">
                {post.metadata.title}
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 w-[100px] tabular-nums whitespace-nowrap">
                {formatDate(post.metadata.publishedAt, false)}
              </p>
            </div>
          </Link>
        </li>
      ))}
      {isPaginated && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </ol>
  );
}
