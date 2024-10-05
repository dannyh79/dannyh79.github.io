import React from 'react';
import Image, { type ImageProps } from 'next/image';
import { MDXRemote, type MDXRemoteProps } from 'next-mdx-remote/rsc';
import rehypePrettyCode from 'rehype-pretty-code';
import remarkGfm from 'remark-gfm';
import Link from './Link';

type TableProps = {
  data: {
    headers: React.ReactNode[];
    rows: React.ReactNode[][];
  };
};

function Table({ data }: TableProps) {
  const headers = data.headers.map((header, index) => <th key={index}>{header}</th>);
  const rows = data.rows.map((row, index) => (
    <tr key={index}>
      {row.map((cell, cellIndex) => (
        <td key={cellIndex}>{cell}</td>
      ))}
    </tr>
  ));

  return (
    <table>
      <thead>
        <tr>{headers}</tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

type CustomLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement>;

function CustomLink(props: CustomLinkProps) {
  const href = props.href;

  if (href?.startsWith('/')) {
    return <Link {...props} href={href.toString()} />;
  }

  if (href?.startsWith('#')) {
    return <a {...props} />;
  }

  return <a target="_blank" rel="noopener noreferrer" {...props} />;
}

function RoundedImage(props: ImageProps) {
  return <Image className="rounded-lg" {...props} alt={props.alt || 'Illustration.'} />;
}

function slugify(str: string) {
  return str
    .toString()
    .toLowerCase()
    .trim() // Remove whitespace from both ends of a string
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w\-]+/g, '') // Remove all non-word characters except for -
    .replace(/\-\-+/g, '-'); // Replace multiple - with single -
}

function createHeading(level: number) {
  const Heading = ({ children }: React.PropsWithChildren) => {
    const slug = slugify(children?.toString() ?? '');
    return React.createElement(
      `h${level}`,
      { id: slug },
      [
        React.createElement('a', {
          href: `#${slug}`,
          key: `link-${slug}`,
          className: 'anchor',
        }),
      ],
      children,
    );
  };

  Heading.displayName = `Heading${level}`;

  return Heading;
}

type FigcaptionProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;

function Figcaption(props: FigcaptionProps) {
  const { className, ...restProps } = props;
  const classes = 'text-sm text-center' + (!!className ? ` ${className}` : '');
  return <span className={classes} {...restProps} />;
}

type BlockquoteProps = React.DetailedHTMLProps<
  React.BlockquoteHTMLAttributes<HTMLQuoteElement>,
  HTMLQuoteElement
>;

function Blockquote(props: BlockquoteProps) {
  const { className, ...restProps } = props;
  const classes = 'font-semibold italic border-s-2 pl-4' + (!!className ? ` ${className}` : '');
  return <blockquote className={classes} {...restProps} />;
}

const components = {
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  Image: RoundedImage,
  a: CustomLink,
  Table,
  Figcaption,
  blockquote: Blockquote,
};

export function CustomMDX(props: MDXRemoteProps) {
  const options: MDXRemoteProps['options'] = {
    mdxOptions: {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [[rehypePrettyCode, { theme: 'one-dark-pro' }]],
    },
  };
  return (
    <MDXRemote
      options={options}
      {...props}
      components={{ ...components, ...(props.components ? props.components : {}) }}
    />
  );
}
