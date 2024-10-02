import Comments from 'app/components/Comments';

type Props = { children: React.ReactNode };

export default function PostLayout({ children }: Props) {
  return (
    <div>
      {children}
      <hr className="my-12 h-0.5 border-t-0 bg-neutral-100 dark:bg-white/20" />
      <Comments />
    </div>
  );
}
