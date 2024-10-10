import fs from 'fs';
import path from 'path';

type Metadata = {
  title: string;
  publishedAt: string;
  summary: string;
  image?: string;
};

function parseFrontmatter(fileContent: string) {
  const frontmatterRegex = /---\s*([\s\S]*?)\s*---/;
  const match = frontmatterRegex.exec(fileContent);
  const frontMatterBlock = match![1];
  const content = fileContent.replace(frontmatterRegex, '').trim();
  const frontMatterLines = frontMatterBlock.trim().split('\n');
  const metadata: Partial<Metadata> = {};

  frontMatterLines.forEach((line) => {
    const [key, ...valueArr] = line.split(': ');
    const value = valueArr
      .join(': ')
      .trim()
      .replace(/^['"](.*)['"]$/, '$1');
    metadata[key.trim() as keyof Metadata] = value;
  });

  return { metadata: metadata as Metadata, content };
}

function getMDorMDXFiles(dir: fs.PathLike) {
  return fs.readdirSync(dir).filter((file) => ['.md', '.mdx'].includes(path.extname(file)));
}

function readMDXFile(filePath: fs.PathOrFileDescriptor) {
  const rawContent = fs.readFileSync(filePath, 'utf-8');
  return parseFrontmatter(rawContent);
}

function trimDatePrefixFromString(str: string): string {
  return str.replace(/^\d{4}-\d{2}-\d{2}-/, '');
}

function getMDXData(dir: fs.PathLike) {
  const files = getMDorMDXFiles(dir);
  return files.map((file) => {
    const { metadata, content } = readMDXFile(path.join(dir.toString(), file));
    const filename = path.basename(file, path.extname(file));

    return {
      metadata,
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
