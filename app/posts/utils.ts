import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';

type Metadata = {
  title: string;
  publishedAt: string;
  summary: string;
  image?: string;
  categories?: string[];
};

function getMDorMDXFiles(dir: fs.PathLike) {
  return fs.readdirSync(dir).filter((file) => ['.md', '.mdx'].includes(path.extname(file)));
}

function trimDatePrefixFromString(str: string): string {
  return str.replace(/^\d{4}-\d{2}-\d{2}-/, '');
}

function getMDXData(dir: fs.PathLike) {
  const files = getMDorMDXFiles(dir);
  return files.map((file) => {
    const { data, content } = matter.read(path.join(dir.toString(), file));
    const filename = path.basename(file, path.extname(file));

    return {
      metadata: data as Metadata,
      slug: trimDatePrefixFromString(filename),
      content,
    };
  });
}

export type Post = {
  metadata: Metadata;
  slug: string;
  content: string;
};

function byPublishedAtDesc(a: Post, b: Post): number {
  if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) {
    return -1;
  }
  return 1;
}

type SorterFunction = (a: Post, b: Post) => number;

/**
 * Defaults to return posts, sorted by publishedAt in descending order.
 */
export function getBlogPosts(sorterFn?: SorterFunction): Post[] {
  return getMDXData(path.join(process.cwd(), 'app', 'posts', '(data)')).sort(
    sorterFn ?? byPublishedAtDesc,
  );
}
