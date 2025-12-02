# Corsair Agent Guide

## Code Generation Commands

### Generate Query/Mutation

```bash
pnpm corsair query/mutation -n "query/mutationName" -i "instructions"
```

**Agent must use this to generate queries.** DO NOT write query code manually.

- Adds the query/mutation file in the appropriate folder (queries/mutations) and also exports it in the index.ts file.
- Returns path where query/mutation was generated (e.g., `corsair/queries/get-posts-with-authors.ts`)
- To modify generated code, use: `-u` flag to update existing query/mutation

### Examples

**Query Examples:**

```bash
pnpm corsair query -n "get posts with authors" -i "fetch all posts with author details from posts and users tables"
```

```bash
pnpm corsair query -n "get comments by post id" -i "get all comments for a specific post ID including author information"
```

```bash
pnpm corsair query -n "get user profile" -i "fetch user profile with their posts count and recent activity"
```

**Mutation Examples:**

```bash
pnpm corsair mutation -n "create post" -i "create a new post with title, content, and author ID"
```

```bash
pnpm corsair mutation -n "update comment" -i "update an existing comment's content by comment ID"
```

```bash
pnpm corsair mutation -n "delete post" -i "delete a post and all its associated comments by post ID"
```

**Update Existing Query/Mutation:**

```bash
pnpm corsair query -n "get posts with authors" -i "fetch all published posts with author details, sorted by created date" -u
```

## Development Commands

### Watch Mode

```bash
pnpm corsair watch
```

Continuously monitors schema changes and auto-regenerates type definitions.
Use during active development for instant feedback.

### Generate Types

```bash
pnpm corsair generate
```

One-time generation of all Corsair types and configurations.
Run after schema changes if not using watch mode.

## Validation Commands

### Check

```bash
pnpm corsair check
```

Validates all queries/mutations against current schema without making changes.
Reports type mismatches and breaking changes.

### Fix

```bash
pnpm corsair fix
```

Auto-fixes validation issues found by `check` command.
Updates queries/mutations to match current schema.

## Key Paths

```
project-root/
├── corsair.config.ts           # Main config
├── corsair/
│   ├── index.ts                # Exports all procedures
│   ├── procedure.ts            # Base procedure config
│   ├── client.ts               # Client-side setup
│   ├── queries/
│   │   └── index.ts            # (managed by Corsair - don't change)
│   └── mutations/
│       └── index.ts            # (managed by Corsair - don't change)
├── app/api/corsair/[...corsair]/route.ts  # API endpoint
└── db/
    ├── index.ts                # Database client
    └── schema.ts               # Database schema
```

## React Component Example

### Using Queries and Mutations in Components

```tsx
'use client'

import { useState, useEffect } from 'react'
import {
  useCorsairQuery,
  useCorsairMutation,
  QueryOutputs,
} from '@/corsair/client'

interface PostDetailsProps {
  post: QueryOutputs['get post by id'] | undefined
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PostDetails({ post, open, onOpenChange }: PostDetailsProps) {
  const { data: comments, isLoading } = useCorsairQuery(
    'get comments by post id',
    { postId: post?.id || '' },
    { enabled: !!post?.id }
  )

  const updatePost = useCorsairMutation('update post')
  const deleteComment = useCorsairMutation('delete comment')

  const [localPost, setLocalPost] = useState(post)

  useEffect(() => {
    setLocalPost(post)
  }, [post])

  const handleUpdateTitle = async (newTitle: string) => {
    if (!localPost) return

    setLocalPost({ ...localPost, title: newTitle })

    await updatePost.mutateAsync({
      postId: localPost.id,
      title: newTitle,
    })
  }

  const handleDeleteComment = async (commentId: string) => {
    await deleteComment.mutateAsync({ commentId })
  }

  if (!localPost) return null

  return (
    <div>
      <h1>{localPost.title}</h1>
      <p>{localPost.content}</p>

      <div>
        <h2>Comments ({comments?.length || 0})</h2>
        {isLoading ? (
          <p>Loading comments...</p>
        ) : (
          comments?.map(comment => (
            <div key={comment.id}>
              <p>{comment.content}</p>
              <button
                onClick={() => handleDeleteComment(comment.id)}
                disabled={deleteComment.isPending}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
```
