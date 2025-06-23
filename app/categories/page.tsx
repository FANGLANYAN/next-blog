// app/page.tsx
import BlogCard from '@/components/BlogCard'

export default function Home() {
  const posts = [
    {
      title: 'Welcome to My Blog',
      description: 'This is a blog built with Next.js 14 and Tailwind CSS.',
      date: 'June 23, 2025',
    },
    {
      title: 'Dark Mode in Next.js',
      description: 'Learn how to implement theme switching with next-themes.',
      date: 'June 22, 2025',
    },
  ]

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post, i) => (
        <BlogCard key={i} {...post} />
      ))}
    </div>
  )
}
