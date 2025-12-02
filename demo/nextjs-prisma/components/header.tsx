import Link from 'next/link'
import { BookOpen } from 'lucide-react'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl hover:opacity-80 transition-opacity">
          <BookOpen className="h-6 w-6" />
          <span>Blog</span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            href="/"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Home
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            About
          </Link>
        </nav>
      </div>
    </header>
  )
}

