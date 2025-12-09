import fs from "fs-extra";
import path from "path";
import type { ProjectConfig } from "../../cli/create-project.js";

export async function generateDocumentation(
	projectPath: string,
	config: ProjectConfig,
): Promise<void> {
	const templates = getDocumentationTemplates(config);

	await fs.writeFile(path.join(projectPath, "README.md"), templates.readme);

	if (config.ide === "claude") {
		await fs.writeFile(path.join(projectPath, "CLAUDE.md"), templates.claude);
	}

	if (config.ide === "cursor") {
		await fs.writeFile(
			path.join(projectPath, ".cursorrules"),
			templates.cursorrules,
		);
	}

	await fs.writeFile(path.join(projectPath, ".gitignore"), templates.gitignore);
}

function getDocumentationTemplates(config: ProjectConfig) {
	return {
		readme: `# ${config.projectName}

A modern, full-stack Next.js application built with Corsair, ${
			config.orm === "prisma" ? "Prisma" : "Drizzle"
		}, and PostgreSQL.

## 🏴‍☠️ What's Included

- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[Corsair](https://corsair.dev/)** - Type-safe database operations and API generation
- **[${config.orm === "prisma" ? "Prisma" : "Drizzle"}](${
			config.orm === "prisma"
				? "https://prisma.io/"
				: "https://orm.drizzle.team/"
		})** - Database ORM
- **[PostgreSQL](https://postgresql.org/)** - Production-ready database
- **[TailwindCSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[shadcn/ui](https://ui.shadcn.com/)** - Beautifully designed components
- **[TypeScript](https://typescriptlang.org/)** - Type safety throughout

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- PostgreSQL database (local or hosted)

### Installation

1. **Install dependencies:**
   \`\`\`bash
   pnpm install
   \`\`\`

2. **Set up environment variables:**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`

   Update \`.env.local\` with your database connection string:
   \`\`\`
   DATABASE_URL="postgresql://username:password@localhost:5432/mydb"
   \`\`\`

3. **Set up the database:**${
			config.orm === "prisma"
				? `
   \`\`\`bash
   # Generate Prisma client
   pnpm db:generate

   # Push schema to database
   pnpm db:push

   # (Optional) Seed the database
   pnpm db:seed
   \`\`\``
				: `
   \`\`\`bash
   # Push schema to database
   pnpm db:push

   # (Optional) Seed the database
   pnpm db:seed
   \`\`\``
		}

4. **Start the development server:**
   \`\`\`bash
   pnpm dev
   \`\`\`

   Open [http://localhost:3000](http://localhost:3000) to see your application.

## 📚 Using Corsair

Corsair provides type-safe database operations through generated queries and mutations.

### Generating Queries

Generate a new query:
\`\`\`bash
pnpm corsair query -n "get posts with authors" -i "fetch all posts with author details"
\`\`\`

### Generating Mutations

Generate a new mutation:
\`\`\`bash
pnpm corsair mutation -n "create post" -i "create a new post with title and content"
\`\`\`

### Using in Components

\`\`\`tsx
'use client'

import { useCorsairQuery, useCorsairMutation } from '@/corsair/client'

export function PostList() {
  const { data: posts, isLoading } = useCorsairQuery('get posts with authors')
  const createPost = useCorsairMutation('create post')

  if (isLoading) return <div>Loading...</div>

  return (
    <div>
      {posts?.map(post => (
        <div key={post.id}>
          <h2>{post.title}</h2>
          <p>By {post.author.name}</p>
        </div>
      ))}
    </div>
  )
}
\`\`\`

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub/GitLab
2. Import your repository in [Vercel](https://vercel.com)
3. Add your \`DATABASE_URL\` environment variable
4. Deploy!

## 📖 Learn More

- [Corsair Documentation](https://corsair.dev)
- [Next.js Documentation](https://nextjs.org/docs)
- [${config.orm === "prisma" ? "Prisma" : "Drizzle"} Documentation](${
			config.orm === "prisma"
				? "https://prisma.io/docs"
				: "https://orm.drizzle.team/"
		})

---

Built with ❤️ using Corsair and Next.js
`,
		claude: `# Corsair Agent Guide

## Code Generation Commands

### Generate Query/Mutation

\`\`\`bash
pnpm corsair query/mutation -n "query/mutationName" -i "instructions"
\`\`\`

**Agent must use this to generate queries.** DO NOT write query code manually.

- Adds the query/mutation file in the appropriate folder (queries/mutations) and also exports it in the index.ts file.
- Returns path where query/mutation was generated (e.g., \`corsair/queries/get-posts-with-authors.ts\`)
- To modify generated code, use: \`-u\` flag to update existing query/mutation

### Examples

**Query Examples:**

\`\`\`bash
pnpm corsair query -n "get posts with authors" -i "fetch all posts with author details from posts and users tables"
\`\`\`

\`\`\`bash
pnpm corsair query -n "get comments by post id" -i "get all comments for a specific post ID including author information"
\`\`\`

\`\`\`bash
pnpm corsair query -n "get user profile" -i "fetch user profile with their posts count and recent activity"
\`\`\`

**Mutation Examples:**

\`\`\`bash
pnpm corsair mutation -n "create post" -i "create a new post with title, content, and author ID"
\`\`\`

\`\`\`bash
pnpm corsair mutation -n "update comment" -i "update an existing comment's content by comment ID"
\`\`\`

\`\`\`bash
pnpm corsair mutation -n "delete post" -i "delete a post and all its associated comments by post ID"
\`\`\`

**Update Existing Query/Mutation:**

\`\`\`bash
pnpm corsair query -n "get posts with authors" -i "fetch all published posts with author details, sorted by created date" -u
\`\`\`

## Development Commands

### Watch Mode

\`\`\`bash
pnpm corsair watch
\`\`\`

Continuously monitors schema changes and auto-regenerates type definitions.
Use during active development for instant feedback.

### Generate Types

\`\`\`bash
pnpm corsair generate
\`\`\`

One-time generation of all Corsair types and configurations.
Run after schema changes if not using watch mode.

## Validation Commands

### Check

\`\`\`bash
pnpm corsair check
\`\`\`

Validates all queries/mutations against current schema without making changes.
Reports type mismatches and breaking changes.

### Fix

\`\`\`bash
pnpm corsair fix
\`\`\`

Auto-fixes validation issues found by \`check\` command.
Updates queries/mutations to match current schema.

## Key Paths

\`\`\`
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
    └── schema.ts               # Database schema${
			config.orm === "prisma" ? " (Prisma)" : " (Drizzle)"
		}
\`\`\`

## React Component Example

### Using Queries and Mutations in Components

\`\`\`tsx
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
\`\`\`
`,
		cursorrules: `# Corsair Project - Cursor Rules

## Code Generation Commands

### Generate Queries and Mutations

To generate queries and mutations, you MUST use the Corsair CLI commands. DO NOT write query/mutation code manually.

\`\`\`bash
pnpm corsair query -n "query name" -i "detailed instructions"
pnpm corsair mutation -n "mutation name" -i "detailed instructions"
\`\`\`

The CLI will:
- Generate the query/mutation file in the appropriate folder
- Export it in the index.ts file automatically
- Ensure type-safety with your database schema
- Return the path where the file was generated

### Update Existing Queries/Mutations

\`\`\`bash
pnpm corsair query -n "query name" -i "updated instructions" -u
pnpm corsair mutation -n "mutation name" -i "updated instructions" -u
\`\`\`

### Query Examples

\`\`\`bash
pnpm corsair query -n "get posts with authors" -i "fetch all posts with author details from posts and users tables"
pnpm corsair query -n "get user profile" -i "get user by ID with their posts count"
pnpm corsair query -n "get comments by post" -i "fetch all comments for a specific post ID with author info"
\`\`\`

### Mutation Examples

\`\`\`bash
pnpm corsair mutation -n "create post" -i "create a new post with title, content, and author ID"
pnpm corsair mutation -n "update user profile" -i "update user name and email by user ID"
pnpm corsair mutation -n "delete post" -i "delete a post by ID"
\`\`\`

## Development Workflow

### Watch Mode

Start watch mode during development to auto-regenerate types on schema changes:

\`\`\`bash
pnpm corsair watch
\`\`\`

### Database Commands${
			config.orm === "prisma"
				? `

\`\`\`bash
pnpm db:generate      # Generate Prisma client
pnpm db:push          # Push schema to database
pnpm db:migrate       # Create and run migrations
pnpm db:studio        # Open Prisma Studio
pnpm db:seed          # Seed the database
\`\`\``
				: `

\`\`\`bash
pnpm db:push          # Push schema to database
pnpm db:generate      # Generate migrations
pnpm db:studio        # Open Drizzle Studio
pnpm db:seed          # Seed the database
\`\`\``
		}

## Project Structure

\`\`\`
project-root/
├── corsair.config.ts           # Main Corsair configuration
├── corsair/
│   ├── index.ts                # Exports all procedures
│   ├── procedure.ts            # Base procedure configuration
│   ├── client.ts               # Client-side React hooks setup
│   ├── queries/                # Auto-generated queries (don't edit manually)
│   │   └── index.ts            # Managed by Corsair CLI
│   └── mutations/              # Auto-generated mutations (don't edit manually)
│       └── index.ts            # Managed by Corsair CLI
├── app/api/corsair/[...corsair]/route.ts  # API route handler
├── db/
│   ├── index.ts                # Database client
│   └── schema.ts               # Database schema${
			config.orm === "prisma" ? " (Prisma)" : " (Drizzle)"
		}
└── components/                 # React components
\`\`\`

## Important Rules

1. **Always use the Corsair CLI** to generate queries and mutations
2. **Do not manually edit** files in \`corsair/queries/\` or \`corsair/mutations/\`
3. **Use \`useCorsairQuery\` and \`useCorsairMutation\`** hooks in client components
4. **Follow Next.js 15 App Router** conventions (use 'use client' directive when needed)
5. **Keep database schema** in \`db/schema.ts\`${
			config.orm === "prisma" ? "" : " (or `prisma/schema.prisma`)"
		}
6. **Run \`pnpm db:push\`** after schema changes
7. **Use TypeScript** for all files
8. **Run \`pnpm corsair check\`** to validate queries/mutations after schema changes
9. **Run \`pnpm corsair fix\`** to auto-fix validation issues

## Using Corsair in Components

### Basic Usage

\`\`\`tsx
'use client'

import { useCorsairQuery, useCorsairMutation } from '@/corsair/client'

export function MyComponent() {
  const { data, isLoading, error } = useCorsairQuery('query name')
  const mutation = useCorsairMutation('mutation name')

  const handleAction = async () => {
    await mutation.mutateAsync({ /* params */ })
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return <div>{/* Use data */}</div>
}
\`\`\`

### With Parameters

\`\`\`tsx
'use client'

import { useCorsairQuery } from '@/corsair/client'

export function PostDetail({ postId }: { postId: string }) {
  const { data: post } = useCorsairQuery(
    'get post by id',
    { postId },
    { enabled: !!postId }
  )

  return <div>{post?.title}</div>
}
\`\`\`

### With TypeScript Types

\`\`\`tsx
'use client'

import { useCorsairQuery, QueryOutputs } from '@/corsair/client'

type Post = QueryOutputs['get post by id']

export function PostComponent() {
  const { data: post } = useCorsairQuery('get post by id', { postId: '1' })

  return <div>{post?.title}</div>
}
\`\`\`

## Schema Changes Workflow

1. Update your database schema in \`db/schema.ts\`${
			config.orm === "prisma" ? " or `prisma/schema.prisma`" : ""
		}
2. Run \`pnpm db:push\` to apply changes to database
3. Run \`pnpm corsair check\` to validate existing queries/mutations
4. Run \`pnpm corsair fix\` to auto-fix any issues
5. Update component code if type signatures changed

## Tips

- Use descriptive names for queries and mutations
- Provide detailed instructions to the CLI for better code generation
- Review generated code to understand what was created
- Use \`-u\` flag to update existing queries/mutations instead of creating new ones
- Run \`pnpm corsair watch\` during development for instant feedback
- Check the \`CLAUDE.md\` file for more detailed examples
`,
		gitignore: `# Dependencies
/node_modules
/.pnp
.pnp.js

# Testing
/coverage

# Next.js
/.next/
/out/

# Production
/build

# Misc
.DS_Store
*.pem

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local env files
.env*.local

# Vercel
.vercel

# TypeScript
*.tsbuildinfo
next-env.d.ts

# Database
${config.orm === "prisma" ? "prisma/migrations" : "/drizzle/migrations"}
`,
	};
}
