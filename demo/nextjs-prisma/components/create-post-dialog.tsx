'use client'

import { useState } from 'react'
import { useCorsairQuery, useCorsairMutation } from '@/corsair/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Loader2, User } from 'lucide-react'

interface CreatePostDialogProps {
  onPostCreated?: () => void
}

export function CreatePostDialog({ onPostCreated }: CreatePostDialogProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [coverImageUrl, setCoverImageUrl] = useState('')
  const [selectedUserId, setSelectedUserId] = useState<string>('')

  const { data: users, isLoading: usersLoading } = useCorsairQuery('get all users', undefined)
  const createPost = useCorsairMutation('create post')

  const resetForm = () => {
    setTitle('')
    setContent('')
    setExcerpt('')
    setCoverImageUrl('')
    setSelectedUserId('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim() || !selectedUserId) return

    try {
      await createPost.mutateAsync({
        title: title.trim(),
        content: content.trim(),
        excerpt: excerpt.trim() || undefined,
        coverImageUrl: coverImageUrl.trim() || undefined,
        authorId: selectedUserId,
      })
      resetForm()
      setOpen(false)
      onPostCreated?.()
    } catch (error) {
      console.error('Failed to create post:', error)
    }
  }

  const isFormValid = title.trim() && content.trim() && selectedUserId

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="gap-2">
          <Plus className="h-5 w-5" />
          New Post
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Create New Post</DialogTitle>
          <DialogDescription>
            Write a new blog post to share with your readers.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="author" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Author
            </Label>
            <Select value={selectedUserId} onValueChange={setSelectedUserId}>
              <SelectTrigger id="author" disabled={usersLoading || createPost.isPending}>
                <SelectValue placeholder={usersLoading ? "Loading users..." : "Select an author"} />
              </SelectTrigger>
              <SelectContent>
                {users?.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name || user.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              In a real app, this would use your logged-in user
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="Enter a compelling title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={createPost.isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              placeholder="A brief summary of your post (optional)..."
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
              disabled={createPost.isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              placeholder="Write your post content here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              disabled={createPost.isPending}
              className="min-h-[200px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="coverImage">Cover Image URL</Label>
            <Input
              id="coverImage"
              placeholder="https://example.com/image.jpg (optional)"
              value={coverImageUrl}
              onChange={(e) => setCoverImageUrl(e.target.value)}
              disabled={createPost.isPending}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={createPost.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createPost.isPending || !isFormValid}
            >
              {createPost.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Publishing...
                </>
              ) : (
                'Publish Post'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

