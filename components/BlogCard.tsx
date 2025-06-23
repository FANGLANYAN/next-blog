// components/BlogCard.tsx
export default function BlogCard({
  title,
  description,
  date,
}: {
  title: string
  description: string
  date: string
}) {
  return (
    <div className="border p-4 rounded-md bg-white dark:bg-gray-800 shadow hover:shadow-lg transition">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{date}</p>
      <p className="text-gray-700 dark:text-gray-300">{description}</p>
    </div>
  )
}
