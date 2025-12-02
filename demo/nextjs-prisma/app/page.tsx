// Server Component - fetches data on the server

import { Header } from '@/components/header'
import { PostList } from '@/components/post-list'

export default async function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Welcome to Our Blog
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover insightful articles, tutorials, and stories from our community
            </p>
          </div>
          <PostList />
        </div>
      </main>
      <footer className="border-t border-border mt-24">
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Blog. Built with Next.js and Corsair.
          </p>
        </div>
      </footer>
    </div>
  )
}
