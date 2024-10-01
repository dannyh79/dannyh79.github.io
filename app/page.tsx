import BlogPosts from './components/Posts'
import { siteDescription, title } from './constants'

export default function Page() {
  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
        {title}
      </h1>
      <p className="mb-4">
        {siteDescription}
      </p>
      <div className="my-8">
        <BlogPosts />
      </div>
    </section>
  )
}
