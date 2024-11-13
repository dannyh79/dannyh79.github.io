import { type Metadata } from 'next';
import { notFound } from 'next/navigation';
import readingTime from 'reading-time';
import { baseUrl, name, postSubPath } from 'app/constants';
import { CustomMDX } from 'app/components/Mdx';
import { badgeVariants } from 'app/components/ui/badge';
import { formatDate } from 'app/components/utils';
import { getBlogPosts } from '../utils';

export async function generateStaticParams() {
  const posts = getBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

type Props = {
  params: { slug: string };
};

export function generateMetadata({ params }: Props): Metadata {
  const post = getBlogPosts().find((post) => post.slug === params.slug);
  if (!post) {
    return {};
  }
  const { title, publishedAt: publishedTime, summary: description, image } = post.metadata;
  const ogImage = image ? image : `${baseUrl}/og?title=${encodeURIComponent(title)}`;

  return {
    title,
    description,
    alternates: {
      canonical: `/${postSubPath}/${params.slug}`,
    },
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime,
      url: `${baseUrl}/${postSubPath}/${post.slug}`,
      images: [
        {
          url: ogImage,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

export default function Blog({ params }: Props) {
  const post = getBlogPosts().find((post) => post.slug === params.slug);

  if (!post) {
    notFound();
  }

  const { text } = readingTime(post.content);
  return (
    <section>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            'headline': post.metadata.title,
            'datePublished': post.metadata.publishedAt,
            'dateModified': post.metadata.publishedAt,
            'description': post.metadata.summary,
            'image': post.metadata.image
              ? `${baseUrl}${post.metadata.image}`
              : `/og?title=${encodeURIComponent(post.metadata.title)}`,
            'url': `${baseUrl}/${postSubPath}/${post.slug}`,
            'author': {
              '@type': 'Person',
              name,
            },
          }),
        }}
      />
      <h1 className="title font-semibold text-2xl tracking-tighter">{post.metadata.title}</h1>
      {post.metadata.categories && (
        <div className="flex items-center mt-2 gap-1">
          {post.metadata.categories.toSorted().map((category, i) => (
            <CategoryBadge key={category + i} label={category} />
          ))}
        </div>
      )}
      <div className="flex justify-between items-center mt-2 mb-8 text-sm">
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {formatDate(post.metadata.publishedAt)}&nbsp;&nbsp;|&nbsp;&nbsp;{text}
        </p>
      </div>
      <article className="prose">
        <CustomMDX source={post.content} />
      </article>
    </section>
  );
}

function CategoryBadge({ label }: { label: string }) {
  return <span className={[badgeVariants(), 'lowercase'].join(' ')}>{label}</span>;
}
