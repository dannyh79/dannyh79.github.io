import NextLink from 'next/link';

export type Props = Parameters<typeof NextLink>[0];

export default function Link(props: Props) {
  const className = ['hover:underline', props.className].join(' ');
  return <NextLink {...props} className={className} />;
}
