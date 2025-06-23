// app/layout.tsx
import '../style/variables.css'
import '../style/globals.css'
import { ThemeProvider } from 'next-themes'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'My Blog',
  description: 'A modern blog built with Next.js and Tailwind CSS',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning> 
      <body>
        <ThemeProvider  attribute="class" defaultTheme="system" enableSystem >
          <div className="min-h-screen bg-bg-2 text-text-2 transition-colors">
            <Navbar />
            <main>{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
