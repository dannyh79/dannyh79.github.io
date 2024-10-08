import React from 'react';
import { postSubPath } from 'app/constants';
import { type Post } from 'app/posts/utils';
import Link from './Link';
import { formatDate } from './utils';

type Props = {
  posts: Post[];
};

export default function BlogPosts({ posts }: Props) {
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
    </ol>
  );
}
