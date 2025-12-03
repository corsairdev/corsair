'use client'

import { useCorsairQuery } from '@/corsair/client'
import { PostCard } from './post-card'
import { CreatePostDialog } from './create-post-dialog'
import { Loader2 } from 'lucide-react'

export function PostList() {
  const {
    data: posts,
    isLoading,
    error,
    refetch,
  } = useCorsairQuery('get all posts', undefined)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-destructive font-semibold">Error loading posts</p>
          <p className="text-sm text-muted-foreground mt-2">{error.message}</p>
        </div>
      </div>
    )
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="space-y-8">
        <div className="flex justify-end">
          <CreatePostDialog onPostCreated={refetch} />
        </div>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-muted-foreground text-lg">No posts found</p>
            <p className="text-sm text-muted-foreground mt-2">
              Be the first to create a post!
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-end">
        <CreatePostDialog onPostCreated={refetch} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  )
}
