import BlogPosts from 'app/components/Posts'

export const metadata = {
  title: 'Blog',
  description: `Danny's blog.`,
}

export default function Page() {
  return (
    <section>
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter">My Blog Posts</h1>
      <BlogPosts />
    </section>
  )
}
