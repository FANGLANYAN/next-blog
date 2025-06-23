'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  return (
    <header className="flex items-center justify-between px-4 py-5 border-b dark:border-gray-700">
      <h1 className="text-xl font-bold">My Blog</h1>
      {/* ✅ mounted 前先 return null，避免 SSR mismatch */}
      {!mounted ? null : (
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="rounded px-3 py-1 bg-gray-200 dark:bg-gray-700"
        >
          {theme === 'dark' ? '🌞 Light' : '🌙 Dark'}
        </button>
      )}
    </header>
  )
}
