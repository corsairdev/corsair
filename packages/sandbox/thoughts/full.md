# Corsair: Full-Stack Applications from TypeScript Schemas

> **"Write what you want. We handle everything else."**

Corsair is a full-stack application runtime that transforms TypeScript schema definitions into production-ready applications. Define your data models and business rules in TypeScript, query and mutate data using natural language, and deploy globally with a single command.

**Traditional Stack:**

```
Backend (Prisma/Drizzle) → API Layer (tRPC/REST) → Frontend State (React Query)
→ Real-time (WebSockets) → Workflows (Temporal) → Deployment (Multiple Services)
```

**Corsair:**

```
TypeScript Schema → Production App (Everything Included)
```

---

## Table of Contents

1. [Core Concepts](#core-concepts)
2. [Schema Definition](#schema-definition)
3. [Queries (Natural Language)](#queries-natural-language)
4. [Mutations (Natural Language)](#mutations-natural-language)
5. [Permissions & Access Control](#permissions--access-control)
6. [Workflows](#workflows)
7. [The Watch System](#the-watch-system)
8. [Development Experience](#development-experience)
9. [Development to Production](#development-to-production)
10. [Schema Migrations](#schema-migrations)
11. [Type Safety](#type-safety)
12. [Why Corsair vs. Alternatives](#why-corsair-vs-alternatives)

---

## Core Concepts

### What Corsair Is

Corsair is an **application runtime**, not just an ORM or framework. It includes:

- **Data Access Layer** (ORM-like interface for type-safe queries)
- **Real-Time Sync** (automatic subscriptions, optimistic updates, offline support)
- **API Generation** (REST + GraphQL endpoints from schema)
- **Permission System** (declarative access control enforced everywhere)
- **Workflow Engine** (background jobs, retries, orchestration)
- **Edge Distribution** (queries execute at optimal location: client, edge, or origin)
- **Migration System** (AI-assisted schema evolution with zero downtime)

### Key Differentiators

1. **Natural Language Interface** - Query and mutate data by describing what you want in English
2. **AI-Assisted Development** - Generate queries, mutations, and migrations from intent
3. **Zero Manual Migrations** - Schema changes generate and apply migrations automatically
4. **Real-Time by Default** - All queries are reactive subscriptions
5. **Edge-Native** - Code executes wherever makes sense: browser, edge, or origin
6. **Full Type Safety** - End-to-end TypeScript from schema to UI

---

## Schema Definition

Schemas are defined in TypeScript. They represent your **business domain**, not database implementation.

### Basic Model

```typescript
// schema.ts
import { model, field } from "@corsair/schema";

export const User = model("User", {
  name: field.string(),
  email: field.string({ unique: true }),
  bio: field.string({ nullable: true }),
  avatar: field.image({ nullable: true }),

  // Dates auto-added by default (id, createdAt, updatedAt)
  // But can explicitly define if you want custom behavior
  createdAt: field.datetime({ default: "now" }),

  // Relations - only need to declare many-to-many from one side
  // (one-to-many relations are inferred from the inverse side)
  following: field.relationMany("User", { as: "follower" }),

  // Access control
  access: {
    read: "anyone",
    update: "themselves",
    delete: "themselves",
  },
});

export const Post = model("Post", {
  title: field.string(),
  content: field.markdown(),
  excerpt: field.string({ nullable: true }),
  status: field.enum(["draft", "published", "archived"], { default: "draft" }),
  publishedAt: field.datetime({ nullable: true }),

  // Relations - declare from the "belongs to" side
  author: field.relation("User"),
  // Post.comments inferred from Comment.post (inverse relation)

  // Many-to-many
  likes: field.relationMany("User"),

  // Computed fields - use natural language description
  likeCount: field.computed(() => "count of users who liked this post"),
  isPublished: field.computed(() => "true if status is published"),

  // Constraints
  constraints: {
    "published posts must have publishedAt":
      "if status is published then publishedAt is not null",
  },

  // Access control
  access: {
    read: "anyone if published, otherwise author",
    create: "logged in users",
    update: "author",
    delete: "author",
  },
});

export const Comment = model("Comment", {
  content: field.string(),
  createdAt: field.datetime({ default: "now" }),

  // Relations - declare from the "belongs to" side
  post: field.relation("Post"),
  author: field.relation("User"),

  // Access control
  access: {
    read: "anyone",
    create: "logged in users",
    update: "author within 5 minutes of creation",
    delete: "author or post author",
  },
});
```

### Field Types

```typescript
// Primitive types
field.string()
field.integer()
field.float()
field.boolean()
field.datetime()
field.date()
field.json()

// Rich types
field.markdown()
field.richText()
field.email()
field.url()
field.image()
field.file()

// Special types
field.enum(['value1', 'value2'])
field.uuid()
field.slug()

// Modifiers
field.string({
  nullable: true,
  unique: true,
  default: 'value',
  min: 1,
  max: 255,
})

// Relations
field.relation('Model', 'foreignKey')
field.relationMany('Model', 'inverseSide')

// Computed (derived fields)
field.computed(() => /* calculation */)
```

---

## Queries (Natural Language)

Queries are written in natural language. Corsair generates optimal database queries, caches them, and provides full type safety.

### Basic Queries

```typescript
import { useCorsair } from "@corsair/react";

function PostList() {
  // Natural language query
  const posts = useCorsair("all published posts");

  return (
    <div>
      {posts.map((post) => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
        </article>
      ))}
    </div>
  );
}
```

**What happens:**

1. Corsair parses `'all published posts'`
2. Generates optimized query: `corsair.posts.where({ status: 'published' })`
3. Caches generated query at `.corsair/queries/hash_abc123.ts`
4. Query executes at optimal location (edge cache, local cache, or database)
5. Results are fully typed: `Array<Post>`
6. UI updates automatically when data changes (real-time subscription)

### Queries with Relations

```typescript
function PostDetail({ postId }) {
  const post = useCorsair("post with this id, including author and comments");

  return (
    <article>
      <h1>{post.title}</h1>
      <p>By {post.author.name}</p>
      <div>{post.content}</div>

      <section>
        <h3>Comments</h3>
        {post.comments.map((comment) => (
          <div key={comment.id}>
            <strong>{comment.author.name}</strong>: {comment.content}
          </div>
        ))}
      </section>
    </article>
  );
}
```

**Generated query:**

```typescript
// .corsair/queries/hash_def456.ts
export default (corsair) =>
  corsair.posts
    .where({ id: postId })
    .include("author")
    .include({
      comments: {
        include: "author",
      },
    })
    .first();
```

### Complex Queries

```typescript
function TrendingPosts() {
  const posts = useCorsair(
    "published posts from last week with more than 100 likes, sorted by like count, limit 10"
  );

  return (
    <div>
      <h2>Trending This Week</h2>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
```

**Generated query:**

```typescript
// .corsair/queries/hash_ghi789.ts
export default (corsair) => {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  return corsair.posts
    .where({
      status: "published",
      createdAt: { gte: oneWeekAgo },
      likeCount: { gt: 100 },
    })
    .orderBy("likeCount", "desc")
    .take(10);
};
```

### User-Specific Queries

```typescript
function MyDrafts() {
  // Corsair automatically injects currentUser context
  const drafts = useCorsair("my draft posts");

  return (
    <div>
      <h2>My Drafts</h2>
      {drafts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
```

**Generated query:**

```typescript
// .corsair/queries/hash_jkl012.ts
export default (corsair) =>
  corsair.posts
    .where({
      authorId: corsair.currentUser.id,
      status: "draft",
    })
    .orderBy("createdAt", "desc");
```

### Fallback to Query Builder

If natural language is ambiguous or you need fine control, use the query builder:

```typescript
function AdvancedSearch({ filters }) {
  const posts = useCorsair((corsair) =>
    corsair.posts
      .where({
        status: "published",
        ...(filters.tag && { tags: { contains: filters.tag } }),
        ...(filters.author && { authorId: filters.author }),
      })
      .include("author")
      .orderBy(filters.sortBy, filters.sortOrder)
      .skip(filters.page * 20)
      .take(20)
  );

  return <SearchResults posts={posts} />;
}
```

---

## Mutations (Natural Language)

Mutations are also written in natural language. Corsair generates the mutation code, including validation, optimistic updates, and side effects.

### Basic Create

```typescript
function CreatePostForm() {
  const createPost = useCorsair.mutation("create a new post");

  const handleSubmit = (e) => {
    e.preventDefault();

    createPost({
      title: e.target.title.value,
      content: e.target.content.value,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="title" placeholder="Title" />
      <textarea name="content" placeholder="Content" />
      <button type="submit">Create Post</button>
    </form>
  );
}
```

**Generated mutation:**

```typescript
// .corsair/mutations/create-post-abc123.ts
export default {
  execute: async (corsair, data: { title: string; content: string }) => {
    return corsair.posts.create({
      title: data.title,
      content: data.content,
      authorId: corsair.currentUser.id, // Inferred from context
      status: "draft", // Sensible default
      createdAt: new Date(),
    });
  },

  // Optimistic update (shows immediately in UI)
  optimistic: (corsair, data) => ({
    id: `temp_${Date.now()}`,
    title: data.title,
    content: data.content,
    author: corsair.currentUser,
    status: "draft",
    createdAt: new Date(),
    likeCount: 0,
  }),

  // Input validation
  input: z.object({
    title: z.string().min(1).max(200),
    content: z.string().min(1),
  }),
};
```

### Update Mutations

```typescript
function PublishButton({ postId }) {
  const publishPost = useCorsair.mutation("publish this post");

  return <button onClick={() => publishPost({ postId })}>Publish</button>;
}
```

**Generated mutation:**

```typescript
// .corsair/mutations/publish-post-def456.ts
export default {
  execute: async (corsair, data: { postId: string }) => {
    return corsair.posts.update({
      where: { id: data.postId },
      data: {
        status: "published",
        publishedAt: new Date(),
      },
    });
  },

  validate: async (corsair, data) => {
    const post = await corsair.posts.get(data.postId);

    // Check permissions (from schema)
    if (post.authorId !== corsair.currentUser.id) {
      throw new Error("Only the author can publish posts");
    }

    // Check business rules
    if (!post.title || !post.content) {
      throw new Error("Post must have title and content");
    }
  },

  optimistic: (corsair, data) => ({
    id: data.postId,
    status: "published",
    publishedAt: new Date(),
  }),
};
```

### Complex Mutations with Side Effects

```typescript
function LikeButton({ postId }) {
  const toggleLike = useCorsair.mutation(
    'like this post if I haven't already, unlike it if I have'
  );

  return (
    <button onClick={() => toggleLike({ postId })}>
      ❤️ Like
    </button>
  );
}
```

**Generated mutation:**

```typescript
// .corsair/mutations/toggle-like-ghi789.ts
export default {
  execute: async (corsair, data: { postId: string }) => {
    const userId = corsair.currentUser.id;

    // Check if already liked
    const existingLike = await corsair.likes.findFirst({
      where: { postId: data.postId, userId },
    });

    if (existingLike) {
      // Unlike
      await corsair.likes.delete({ id: existingLike.id });
      await corsair.posts.update({
        where: { id: data.postId },
        data: { likeCount: { decrement: 1 } },
      });
      return { liked: false };
    } else {
      // Like
      await corsair.likes.create({ postId: data.postId, userId });
      await corsair.posts.update({
        where: { id: data.postId },
        data: { likeCount: { increment: 1 } },
      });
      return { liked: true };
    }
  },

  optimistic: (corsair, data, currentState) => {
    const post = currentState.posts.find((p) => p.id === data.postId);
    const isLiked = post?.likedByCurrentUser;

    return {
      postId: data.postId,
      likeCount: isLiked ? { decrement: 1 } : { increment: 1 },
      likedByCurrentUser: !isLiked,
    };
  },
};
```

### Mutations with Notifications

```typescript
function DeletePostButton({ postId }) {
  const deletePost = useCorsair.mutation(
    "delete this post and notify anyone who commented on it"
  );

  return <button onClick={() => deletePost({ postId })}>Delete Post</button>;
}
```

**Generated mutation:**

```typescript
// .corsair/mutations/delete-post-jkl012.ts
export default {
  execute: async (corsair, data: { postId: string }) => {
    // Fetch post with comments
    const post = await corsair.posts.get(data.postId, {
      include: { comments: { include: "author" } },
    });

    // Get unique commenters (excluding post author)
    const commenters = Array.from(
      new Set(
        post.comments
          .map((c) => c.author)
          .filter((author) => author.id !== post.authorId)
      )
    );

    // Delete post (cascades to comments)
    await corsair.posts.delete({ id: data.postId });

    // Send notifications
    await Promise.all(
      commenters.map((commenter) =>
        corsair.notifications.create({
          userId: commenter.id,
          type: "post_deleted",
          message: `A post you commented on was deleted`,
          data: { postTitle: post.title },
        })
      )
    );

    return { success: true };
  },

  validate: async (corsair, data) => {
    const post = await corsair.posts.get(data.postId);

    if (post.authorId !== corsair.currentUser.id) {
      throw new Error("Only the author can delete posts");
    }
  },

  optimistic: (corsair, data) => ({
    _remove: {
      posts: [data.postId],
      comments: { where: { postId: data.postId } },
    },
  }),
};
```

---

## Permissions & Access Control

Permissions are defined in natural language within your schema. They're enforced at every level: database, API, and client.

### Basic Permissions

```typescript
export const Post = model("Post", {
  title: field.string(),
  content: field.markdown(),
  status: field.enum(["draft", "published", "archived"]),
  author: field.relation("User"),

  access: {
    // Anyone can read published posts
    read: "anyone if published, otherwise just the author",

    // Authenticated users can create
    create: "any logged in user",

    // Only author can update
    update: "the author",

    // Only author can delete
    delete: "the author",
  },
});
```

**Generated permission functions:**

```typescript
// .corsair/permissions/post.ts
export default {
  read: (post, user) => {
    if (post.status === "published") return true;
    if (!user) return false;
    return post.authorId === user.id;
  },

  create: (data, user) => {
    return user !== null; // Must be logged in
  },

  update: (post, user) => {
    if (!user) return false;
    return post.authorId === user.id;
  },

  delete: (post, user) => {
    if (!user) return false;
    return post.authorId === user.id;
  },
};
```

### Complex Permissions

```typescript
export const Post = model('Post', {
  title: field.string(),
  content: field.markdown(),
  author: field.belongsTo('User'),
  team: field.relation('Team'),

  access: {
    read: 'anyone if published, otherwise author or author's teammates',
    update: 'author or team admins',
    delete: 'author or team owners',
  }
});
```

**Generated permission functions:**

```typescript
export default {
  read: (post, user) => {
    if (post.status === "published") return true;
    if (!user) return false;
    if (post.authorId === user.id) return true;
    return post.author.team?.members.some((m) => m.id === user.id);
  },

  update: (post, user) => {
    if (!user) return false;
    if (post.authorId === user.id) return true;
    return post.team?.admins.some((a) => a.id === user.id);
  },

  delete: (post, user) => {
    if (!user) return false;
    if (post.authorId === user.id) return true;
    return post.team?.ownerId === user.id;
  },
};
```

### Field-Level Permissions

```typescript
export const User = model("User", {
  name: field.string(),
  email: field.string(),

  // Private fields
  passwordHash: field.string({
    access: { read: "never", write: "never" },
  }),

  stripeCustomerId: field.string({
    access: { read: "themselves or admins", write: "admins only" },
  }),
});
```

### Permission Testing in Studio

Corsair Studio includes a permission tester:

```
┌─────────────────────────────────────────────┐
│ Permission Tester                           │
├─────────────────────────────────────────────┤
│ Test as: john@example.com                   │
│                                             │
│ Post #123:                                  │
│   Title: "Hello World"                      │
│   Status: draft                             │
│   Author: jane@example.com                  │
│   Team: Engineering                         │
│                                             │
│ Permissions for john@example.com:           │
│   ✗ Can read?   No (not published, not      │
│                     author, not teammate)   │
│   ✗ Can update? No (not author/admin)       │
│   ✗ Can delete? No (not author/owner)       │
│                                             │
│ [Add to Engineering team]                   │
│                                             │
│ After adding to team:                       │
│   ✓ Can read?   Yes (teammate)              │
│   ✗ Can update? No (not admin)              │
│   ✗ Can delete? No (not owner)              │
└─────────────────────────────────────────────┘
```

---

## Workflows

Workflows define multi-step business processes. They handle retries, failures, and orchestration automatically.

### Basic Workflow

```typescript
import { workflow } from '@corsair/schema';

export const PublishWorkflow = workflow({
  // Trigger: when a post is published
  trigger: 'when a post is published',

  // Steps to execute
  do: [
    'send email to author's followers',
    'post to Twitter if author has connected account',
    'add to search index'
  ]
});
```

**Generated workflow:**

```typescript
// .corsair/workflows/publish-post.ts
export default workflow({
  name: "PublishWorkflow",

  trigger: {
    model: "Post",
    event: "update",
    condition: (prev, current) =>
      prev.status !== "published" && current.status === "published",
  },

  steps: [
    {
      name: "notify-followers",
      run: async (post) => {
        const followers = await corsair.users.where({
          following: { contains: post.authorId },
        });

        await Promise.all(
          followers.map((follower) =>
            sendEmail({
              to: follower.email,
              template: "new-post",
              data: { post, author: post.author },
            })
          )
        );
      },
      retry: { attempts: 3, backoff: "exponential" },
    },

    {
      name: "post-to-twitter",
      run: async (post) => {
        const author = await corsair.users.get(post.authorId);

        if (author.twitterConnected) {
          await twitter.post({
            userId: author.twitterId,
            text: `New post: ${post.title}`,
            url: `https://app.com/posts/${post.id}`,
          });
        }
      },
      retry: { attempts: 3, backoff: "exponential" },
    },

    {
      name: "index-for-search",
      run: async (post) => {
        await searchIndex.add({
          id: post.id,
          title: post.title,
          content: post.content,
        });
      },
      retry: { attempts: 5, backoff: "exponential" },
    },
  ],

  onFailure: async (post, error, failedStep) => {
    await notifyAdmin({
      message: `Workflow failed for post ${post.id}`,
      step: failedStep.name,
      error: error.message,
    });
  },
});
```

### Scheduled Workflows

```typescript
export const CleanupOldDrafts = workflow({
  schedule: "every day at 2am",

  run: "delete draft posts older than 30 days",
});
```

**Generated workflow:**

```typescript
export default workflow({
  name: "CleanupOldDrafts",
  schedule: "0 2 * * *", // Cron: 2am daily

  run: async () => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const oldDrafts = await corsair.posts.findMany({
      where: {
        status: "draft",
        createdAt: { lt: thirtyDaysAgo },
      },
    });

    await corsair.posts.deleteMany({
      where: { id: { in: oldDrafts.map((p) => p.id) } },
    });

    console.log(`Deleted ${oldDrafts.length} old drafts`);
  },
});
```

### Workflow Monitoring

The Corsair dashboard shows all active workflows:

```
┌─────────────────────────────────────────────┐
│ Active Workflows                            │
├─────────────────────────────────────────────┤
│                                             │
│ PublishWorkflow #12345 (running)            │
│   ✓ notify-followers    completed (2.3s)    │
│   ✓ post-to-twitter     completed (1.1s)    │
│   → index-for-search    running... (0.5s)   │
│                                             │
│ PublishWorkflow #12344 (failed)             │
│   ✓ notify-followers    completed (2.1s)    │
│   ✗ post-to-twitter     failed (timeout)    │
│     Retry 1/3 in 30s...                     │
│                                             │
│ CleanupOldDrafts (scheduled)                │
│   Next run: Tomorrow at 2:00 AM             │
│   Last run: Deleted 43 posts                │
└─────────────────────────────────────────────┘
```

---

## The Watch System

Corsair runs a watch server during development that monitors file changes and automatically generates queries, mutations, and migrations.

### How It Works

**1. File Watching**

```typescript
// corsair-dev-server.ts (runs in background)
import { watch } from "chokidar";

// Watch all relevant files
watch(["src/**/*.{ts,tsx}", "schema.ts"], async (event, path) => {
  if (path === "schema.ts") {
    await handleSchemaChange();
  } else {
    await handleCodeChange(path);
  }
});
```

**2. Schema Changes**

```typescript
async function handleSchemaChange() {
  // Parse new schema
  const newSchema = await parseSchema("./schema.ts");
  const oldSchema = loadCachedSchema();

  // Compute diff
  const diff = computeSchemaDiff(oldSchema, newSchema);

  if (diff.hasChanges) {
    // Classify change (breaking vs non-breaking)
    const classification = await classifyChange(diff);

    // Generate migration strategy
    const migration = await generateMigrationStrategy(diff, classification);

    // Show preview to developer
    showMigrationPreview(migration);

    // If approved, apply migration
    if (migration.autoApply || (await promptDeveloper(migration))) {
      await applyMigration(migration);

      // Invalidate affected queries
      await invalidateQueries(diff);

      // Regenerate types
      await generateTypes(newSchema);

      notifyIDE("Schema updated successfully");
    }
  }
}
```

**3. Query/Mutation Detection**

```typescript
async function handleCodeChange(filePath: string) {
  const code = await fs.readFile(filePath, "utf-8");

  // Parse file for useCorsair calls
  const queries = findNaturalLanguageQueries(code);
  const mutations = findNaturalLanguageMutations(code);

  for (const query of queries) {
    await processQuery(query, filePath);
  }

  for (const mutation of mutations) {
    await processMutation(mutation, filePath);
  }
}
```

**4. Query Generation**

```typescript
async function processQuery(query: string, filePath: string) {
  const hash = hashQuery(query);
  const cachePath = `.corsair/queries/${hash}.ts`;

  // Check if already generated
  if (await exists(cachePath)) {
    return; // Already cached
  }

  console.log(`🔄 Generating query: "${query}"`);

  // Call LLM to generate query
  const generated = await generateQuery({
    naturalLanguage: query,
    schema: loadSchema(),
    context: { file: filePath },
  });

  // Validate generated query
  const valid = await validateQuery(generated);

  if (!valid) {
    console.warn(`⚠️  Generated query may be incorrect. Review:
      ${cachePath}`);
  }

  // Write to cache
  await fs.writeFile(cachePath, generated.code);

  // Update type definitions
  await updateTypeDefinitions(query, generated.types);

  console.log(`✓ Query cached: ${hash}.ts`);
}
```

**5. Real-Time Feedback**

The watch system provides immediate feedback in the IDE:

```
Terminal Output:

⟳ Watching for changes...

[14:23:45] File changed: src/components/PostList.tsx
[14:23:45] 🔄 Generating query: "all published posts"
[14:23:47] ✓ Query cached: abc123.ts
[14:23:47] ✓ Types updated

[14:24:12] File changed: schema.ts
[14:24:12] 🔄 Detecting schema changes...
[14:24:13] ✓ Detected: Field added (Post.excerpt)
[14:24:14] ✓ Migration applied
[14:24:14] ✓ Types regenerated
[14:24:14] ⟳ Regenerating 3 affected queries...
[14:24:16] ✓ All queries updated
```

### Development Workflow

**Starting development:**

```bash
$ corsair dev

✓ Started Corsair development server
✓ Watching for changes
✓ TypeScript types ready
✓ Database connected (local)

Dev server: http://localhost:3000
Studio: http://localhost:3001
```

**Developer edits code:**

```typescript
// src/app/posts/page.tsx
function PostsPage() {
  // Developer types this natural language query
  const posts = useCorsair("all published posts with authors");

  return (
    <div>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
```

**Watch system responds (within 2 seconds):**

1. Detects new `useCorsair` call
2. Calls LLM to generate query
3. Caches generated query
4. Updates TypeScript types
5. Developer gets full autocomplete instantly

**Developer saves file:**

```
[14:30:22] ✓ Query generated
[14:30:22] ✓ Types: posts is Array<Post & { author: User }>
```

**TypeScript immediately knows:**

```typescript
posts[0].title; // ✓ string
posts[0].author.name; // ✓ string
posts[0].invalid; // ✗ TypeScript error
```

---

## Development Experience

### Getting Started

**1. Create new project:**

```bash
$ npx create-corsair-app my-blog

✓ Created project at ./my-blog
✓ Installed dependencies
✓ Initialized database

Next steps:
  cd my-blog
  corsair dev
```

**2. Project structure:**

```
my-blog/
├── schema.ts              # Your data models
├── src/
│   ├── app/              # Your application code
│   └── components/       # React components
├── .corsair/                # Generated code (gitignored)
│   ├── queries/         # Cached query functions
│   ├── mutations/       # Cached mutation functions
│   ├── workflows/       # Workflow definitions
│   ├── migrations/      # Migration history
│   └── types.d.ts       # Generated TypeScript types
└── corsair.config.ts        # Configuration
```

**3. Define your schema:**

```typescript
// schema.ts
export const Post = model("Post", {
  title: field.string(),
  content: field.markdown(),
  author: field.relation("User"),

  access: {
    read: "anyone if published",
    create: "authenticated users",
    update: "author",
    delete: "author",
  },
});

export const User = model("User", {
  name: field.string(),
  email: field.string({ unique: true }),
  posts: field.hasMany("Post", "author"),
});
```

**4. Start building:**

```typescript
// src/app/page.tsx
export default function HomePage() {
  const posts = useCorsair("all published posts");

  return (
    <div>
      <h1>My Blog</h1>
      {posts.map((post) => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>By {post.author.name}</p>
        </article>
      ))}
    </div>
  );
}
```

**5. Run development server:**

```bash
$ corsair dev

✓ Development server running
  Local: http://localhost:3000
  Studio: http://localhost:3001

⟳ Watching for changes...
```

### Corsair Studio

Corsair Studio is a visual interface for managing your application during development.

**Features:**

- **Schema Visualizer** - See your data model as an entity-relationship diagram
- **Data Browser** - View and edit data in tables
- **Query Inspector** - See all active queries and their performance
- **Permission Tester** - Test permissions for different users
- **Workflow Monitor** - View active and completed workflows
- **Migration History** - Review all schema changes

**Studio Interface:**

```
┌─────────────────────────────────────────────┐
│ Corsair Studio                    localhost    │
├──────────┬──────────────────────────────────┤
│ Schema   │  ┌──────────┐                    │
│ Data     │  │   Post   │──────┐             │
│ Queries  │  ├──────────┤      │             │
│ Workflows│  │ title    │      │ author      │
│ Settings │  │ content  │      │             │
│          │  │ author   │◄─────┘             │
│          │  └──────────┘                    │
│          │        │                         │
│          │        │ posts                   │
│          │        ▼                         │
│          │  ┌──────────┐                    │
│          │  │   User   │                    │
│          │  ├──────────┤                    │
│          │  │ name     │                    │
│          │  │ email    │                    │
│          │  │ posts    │                    │
│          │  └──────────┘                    │
│          │                                  │
│          │  [Add Model] [AI: "Add comments  │
│          │   to posts with reactions"]      │
└──────────┴──────────────────────────────────┘
```

### IDE Integration

Corsair provides IDE extensions for VS Code and other editors:

**Features:**

- Syntax highlighting for schema definitions
- Autocomplete for natural language queries
- Hover tooltips showing generated queries
- Jump to query definition
- Real-time error checking
- Query performance insights

**Example - Hover Tooltip:**

```typescript
const posts = useCorsair("all published posts");
//            ↑ Hover shows:
//
// Generated Query:
//   corsair.posts
//     .where({ status: 'published' })
//     .orderBy('createdAt', 'desc')
//
// Performance: 15ms avg (cached)
// Type: Array<Post>
//
// [View in Studio] [Edit Query] [View SQL]
```

### Hot Reload

Changes to queries, mutations, or schema trigger instant hot reload:

```typescript
// Developer changes query
const posts = useCorsair("all published posts");

// Changes to:
const posts = useCorsair("all published posts from this week");

// Within 2 seconds:
// ✓ New query generated
// ✓ Types updated
// ✓ UI refreshes with new data
// No page reload needed
```

---

## Development to Production

### Build Process

```bash
$ corsair build

Building for production...

✓ Validating schema
✓ Running tests (42 passed)
✓ Generating queries (18 queries)
✓ Generating mutations (7 mutations)
✓ Generating workflows (3 workflows)
✓ Optimizing for edge execution
✓ Creating database migrations
✓ Building frontend assets

Build complete: .corsair/build/
```

**What happens during build:**

1. **Schema validation** - Ensures schema is valid and consistent
2. **Query compilation** - All natural language queries → optimized functions
3. **Type generation** - Full TypeScript types for entire API
4. **Asset optimization** - Minification, tree-shaking, code splitting
5. **Migration planning** - Determines what migrations needed for production
6. **WASM compilation** - Compiles queries/mutations to WebAssembly for edge

### Deployment

**Single command deployment:**

```bash
$ corsair deploy

Deploying to production...

Phase 1: Database Migration
  ✓ Analyzing changes
  ✓ Creating migration plan
  ✓ Applying migrations (zero-downtime)
  Duration: 2.3s

Phase 2: Edge Distribution
  ✓ Uploading assets to CDN
  ✓ Deploying to 200+ edge locations
  ✓ Warming caches
  Duration: 8.7s

Phase 3: DNS Update
  ✓ Updating DNS records
  ✓ Waiting for propagation
  Duration: 15s

Deployment complete!

  Production URL: https://my-blog.corsair.app
  Dashboard: https://console.corsair.app/my-blog

  Metrics:
    - 200+ edge locations
    - <50ms P95 latency globally
    - Rollback available for 24 hours

$ corsair rollback  # If needed
```

### Deployment Strategies

**Gradual Rollout (Default):**

```bash
$ corsair deploy --strategy gradual

Phase 1: Deploy to 5% of traffic
  ✓ Monitoring for errors...
  ✓ No issues detected

Phase 2: Deploy to 25% of traffic
  ✓ Monitoring...
  ✓ Performance within SLA

Phase 3: Deploy to 100% of traffic
  ✓ Rollout complete
```

**Blue-Green Deployment:**

```bash
$ corsair deploy --strategy blue-green

✓ Created new environment (green)
✓ Running health checks
✓ Switching traffic to green
✓ Old environment (blue) on standby
✓ Will auto-delete in 24h

$ corsair rollback  # Switches back to blue instantly
```

### Environment Management

**Multiple environments:**

```bash
# Development (local)
$ corsair dev

# Staging
$ corsair deploy --env staging

# Production
$ corsair deploy --env production
```

**Environment configuration:**

```typescript
// corsair.config.ts
export default {
  environments: {
    development: {
      database: "sqlite:./dev.db",
      edge: false, // Run locally
    },

    staging: {
      database: process.env.STAGING_DATABASE_URL,
      edge: true,
      domain: "staging.myapp.corsair.app",
    },

    production: {
      database: process.env.DATABASE_URL,
      edge: true,
      domain: "myapp.com",
      regions: ["us-east", "us-west", "eu-west", "ap-southeast"],
    },
  },
};
```

### Monitoring Production

**Real-time dashboard:**

```
┌─────────────────────────────────────────────┐
│ Production Dashboard - my-blog              │
├─────────────────────────────────────────────┤
│                                             │
│ Traffic:      12,450 req/s                  │
│ Latency:      P95: 45ms | P99: 78ms        │
│ Error Rate:   0.02%                         │
│ Cache Hit:    94%                           │
│                                             │
│ Top Queries:                                │
│  1. "all published posts" - 8.2K/s (12ms)  │
│  2. "post with this id" - 2.1K/s (8ms)     │
│  3. "my draft posts" - 450/s (15ms)        │
│                                             │
│ Active Workflows:                           │
│  PublishWorkflow: 234 running              │
│  CleanupOldDrafts: Scheduled for 2:00 AM   │
│                                             │
│ Health: ✓ All systems operational          │
└─────────────────────────────────────────────┘
```

### Rollback

**Instant rollback:**

```bash
$ corsair rollback

Available versions:
  1. v1.2.4 (deployed 2 hours ago) ← Current
  2. v1.2.3 (deployed yesterday)
  3. v1.2.2 (deployed 3 days ago)

Select version to rollback to: 2

Rolling back to v1.2.3...
  ✓ Switching edge deployment
  ✓ Database compatible (no migration needed)
  ✓ Traffic shifted: 100% → v1.2.3

Rollback complete (took 8 seconds)
```

**Smart rollback** (detects issues automatically):

```bash
# If deployment causes errors, Corsair can auto-rollback

Deployment v1.2.5 in progress...
  ⚠ Error rate increased to 5%
  ⚠ P95 latency increased to 250ms

  Automatic rollback triggered
  ✓ Rolled back to v1.2.4
  ✓ Error rate back to normal

  Deployment cancelled. Review logs for details.
```

---

## Schema Migrations

Schema changes are detected automatically and migrations are generated with AI assistance.

### Non-Breaking Changes

**Adding a field:**

```typescript
// Developer adds a field
export const Post = model("Post", {
  title: field.string(),
  content: field.markdown(),
  excerpt: field.string({ nullable: true }), // ← NEW
  author: field.relation("User"),
});
```

**Automatic migration:**

```
✓ Schema change detected: Post.excerpt added

Migration:
  ALTER TABLE posts ADD COLUMN excerpt TEXT;

This is a non-breaking change. Applied automatically.

Regenerating queries that reference Post...
  ✓ 3 queries updated
  ✓ Types regenerated

Migration complete.
```

### Breaking Changes

**Removing a field:**

```typescript
// Developer removes a field
export const Post = model("Post", {
  title: field.string(),
  // slug: field.string({ unique: true }), ← REMOVED
  content: field.markdown(),
});
```

**Migration prompt:**

```
⚠ BREAKING CHANGE: Post.slug removed

Scanning codebase for references...

Found 3 references:
  1. app/posts/[slug]/page.tsx:12
     const post = useCorsair('post with this slug');

  2. .corsair/queries/post-by-slug-xyz789.ts
     corsair.posts.where({ slug })

  3. lib/generate-slug.ts
     Used in mutation to generate slugs

This will break existing code.

Options:
  1. Keep field temporarily (deprecated)
  2. AI will fix code automatically
  3. Show me what needs fixing
  4. Cancel this change

Choose: 2

AI analyzing...

Suggested fixes:
  - Replace slug with id in URLs
  - Create redirects for old slug URLs
  - Update queries to use id instead

Apply automatic fixes? [Yes] [Customize] [Cancel]
```

### Type Changes

**Changing field type:**

```typescript
// Developer changes type
export const Post = model("Post", {
  viewCount: field.integer(), // Was: field.string()
});
```

**Migration analysis:**

```
⚠ BREAKING CHANGE: Post.viewCount type changed
  string → integer

Analyzing existing data...
  Checking 1,247 posts...

Sample conversions:
  ✓ "0" → 0
  ✓ "142" → 142
  ✓ "1503" → 1503
  ✗ "1,234" → NaN (1 record - has comma)
  ✗ "lots" → NaN (2 records - invalid)

Found 3 records that cannot convert.

Suggested fix:
  - Parse numbers, strip commas
  - Set invalid values to 0
  - Log warnings for manual review

Apply fix? [Yes] [Customize] [Cancel]
```

### Complex Migrations

**Splitting a field:**

```typescript
// Developer splits name field
export const User = model("User", {
  // name: field.string(), ← REMOVED
  firstName: field.string(), // ← NEW
  lastName: field.string(), // ← NEW
  email: field.string(),
});
```

**AI-assisted migration:**

```
⚠ Detected: Field split
  User.name → firstName + lastName

AI confidence: 95%

Analyzing impact...
  - 12 queries reference User.name
  - 3 mutations create/update name
  - 1,247 user records need migration

Suggested migration strategy:

1. Data transformation:
   Split names on first space
   Handle edge cases (single names, multi-word last names)

2. Query updates:
   "sorted by name" → "sorted by lastName"

3. Mutation updates:
   Split name input into two fields in UI

Preview transformation on sample data:
  "John Doe" → firstName: "John", lastName: "Doe"
  "Mary Jane Watson" → firstName: "Mary", lastName: "Jane Watson"
  "Prince" → firstName: "Prince", lastName: "Prince"

[Apply] [Customize] [Test on all data] [Cancel]
```

**Customization interface:**

```typescript
// Developer can customize transformation
function splitName(name: string) {
  // Default AI-generated logic
  const parts = name.split(" ");
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" ") || parts[0],
  };
}

// Developer adds custom logic
function splitName(name: string) {
  // Handle "Last, First" format
  if (name.includes(",")) {
    const [last, first] = name.split(",");
    return {
      firstName: first.trim(),
      lastName: last.trim(),
    };
  }

  // Handle standard format
  const parts = name.split(" ");
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" ") || parts[0],
  };
}

// Test on sample data
[Test][Apply][Cancel];
```

### Migration Process

**Phase 1: Add new columns (immediate)**

```sql
-- Non-blocking, takes 50-200ms
ALTER TABLE users ADD COLUMN first_name TEXT;
ALTER TABLE users ADD COLUMN last_name TEXT;

CREATE INDEX CONCURRENTLY idx_users_first_name ON users(first_name);
CREATE INDEX CONCURRENTLY idx_users_last_name ON users(last_name);
```

**Phase 2: Backfill data (background)**

```typescript
// Background job, doesn't block development
async function backfillUsers() {
  const batchSize = 1000;

  while (true) {
    const users = await db.query(`
      SELECT id, name
      FROM users
      WHERE first_name IS NULL
      LIMIT ${batchSize}
    `);

    if (users.length === 0) break;

    for (const user of users) {
      const { firstName, lastName } = splitName(user.name);
      await db.query(`
        UPDATE users
        SET first_name = $1, last_name = $2
        WHERE id = $3
      `, [firstName, lastName, user.id]);
    }

    await sleep(100); // Rate limit
  }
}

// Progress shown in terminal:
⟳ Backfilling users... 42% (524/1247)
```

**Phase 3: Compatibility layer (during migration)**

```typescript
// Old code still works via virtualization
const user = await corsair.users.get(userId);
console.log(user.name); // Synthesized from firstName + lastName

// New code uses native fields
console.log(user.firstName, user.lastName);
```

**Phase 4: Finalization (after verification)**

```sql
-- After backfill complete and code deployed
ALTER TABLE users ALTER COLUMN first_name SET NOT NULL;
ALTER TABLE users ALTER COLUMN last_name SET NOT NULL;

-- Drop old column (only after all clients updated)
ALTER TABLE users DROP COLUMN name;
```

### Migration Safety

**Rollback capability:**

```bash
$ corsair migrate rollback

Available migrations:
  1. split-user-name (applied 2 hours ago) ← Current
  2. add-post-excerpt (applied yesterday)

Rollback to: 2

Rolling back split-user-name...
  ✓ Reverting schema changes
  ✓ Restoring old queries
  ✓ Database rollback (re-adding name column)

Rollback complete.
```

**Preview before apply:**

```bash
$ corsair migrate preview

Migration: split-user-name

Changes:
  Schema:
    - User.name removed
    + User.firstName added
    + User.lastName added

  Database:
    ALTER TABLE users ADD COLUMN first_name TEXT;
    ALTER TABLE users ADD COLUMN last_name TEXT;
    -- (backfill logic)
    ALTER TABLE users DROP COLUMN name;

  Code Updates:
    12 files will be updated:
      app/users/page.tsx (automatic)
      app/profile/edit.tsx (manual review needed)
      ...

  Data:
    1,247 users will be migrated
    Estimated time: 15 seconds

[Apply] [Customize] [Test] [Cancel]
```

---

## Type Safety

Corsair provides end-to-end type safety from schema to UI with zero manual type definitions.

### Automatic Type Generation

**From schema:**

```typescript
// schema.ts
export const Post = model("Post", {
  title: field.string(),
  content: field.markdown(),
  status: field.enum(["draft", "published"]),
  author: field.relation("User"),
  likeCount: field.integer({ default: 0 }),
});
```

**Generated types:**

```typescript
// .corsair/types.d.ts (auto-generated)
type Post = {
  id: string;
  title: string;
  content: string;
  status: "draft" | "published";
  authorId: string;
  author: User;
  likeCount: number;
  createdAt: Date;
  updatedAt: Date;
};

type User = {
  id: string;
  name: string;
  email: string;
  posts: Post[];
  createdAt: Date;
  updatedAt: Date;
};
```

### Query Type Inference

**Natural language queries are fully typed:**

```typescript
const posts = useCorsair("all published posts with authors");

// TypeScript knows the exact shape:
type posts = Array<{
  id: string;
  title: string;
  content: string;
  status: "published"; // ← Narrowed! Only published posts
  author: {
    id: string;
    name: string;
    email: string;
  };
  likeCount: number;
}>;

// Autocomplete works perfectly:
posts[0].author.name; // ✓ string
posts[0].author.bio; // ✗ Error: 'bio' not included in query
posts[0].status; // ✓ type: 'published' (not 'draft' | 'published')
```

### Mutation Type Safety

**Mutations are fully typed:**

```typescript
const createPost = useCorsair.mutation("create a new post");

// TypeScript knows required fields:
createPost({
  title: "Hello",
  content: "World",
}); // ✓ Valid

createPost({
  title: "Hello",
  // Missing content
}); // ✗ TypeScript error: Property 'content' is required

createPost({
  title: "Hello",
  content: "World",
  invalidField: true,
}); // ✗ TypeScript error: 'invalidField' does not exist
```

### Compile-Time Safety

**Catches errors during development:**

```typescript
// Typo in field name
const posts = useCorsair("all published posts");
posts[0].titel; // ✗ TypeScript error: Did you mean 'title'?

// Wrong type
const count: string = posts[0].likeCount; // ✗ Error: number not assignable to string

// Non-existent relation
const posts = useCorsair("posts with comments");
posts[0].comments.length; // ✗ Error: Did you include 'comments' in query?
```

### Runtime Validation

**Types are enforced at runtime too:**

```typescript
// If API returns unexpected data:
const post = await corsair.posts.get(postId);

// Runtime validates:
// - post.title is string (throws if not)
// - post.status is 'draft' | 'published' (throws if invalid)
// - post.author is User (throws if malformed)

// Helpful error messages:
// "Expected Post.title to be string, got null"
// "Expected Post.status to be 'draft' | 'published', got 'archived'"
```

---

## Why Corsair vs. Alternatives

### vs. Prisma

**Prisma:**

- ✓ Type-safe database access
- ✓ Schema definition in code
- ✓ Migration generation
- ✗ Server-side only
- ✗ No real-time
- ✗ No API generation
- ✗ Manual state management on frontend
- ✗ Separate deployment for frontend/backend

**Corsair:**

- ✓ Everything Prisma has
- ✓ **Client-side queries** (run in browser)
- ✓ **Real-time by default** (automatic subscriptions)
- ✓ **Auto-generated APIs** (REST + GraphQL)
- ✓ **Natural language interface** (no query syntax to learn)
- ✓ **Zero migrations** (AI handles schema changes)
- ✓ **One deployment** (full-stack)

**Example comparison:**

```typescript
// Prisma (backend only)
const posts = await prisma.post.findMany({
  where: { status: "published" },
  include: { author: true },
});

// Then: Write API endpoint, frontend fetch logic, state management

// Corsair (full-stack)
const posts = useCorsair("all published posts with authors");
// Done. Real-time, type-safe, optimistic updates included.
```

### vs. Drizzle

**Drizzle:**

- ✓ Type-safe SQL query builder
- ✓ Lightweight
- ✓ SQL-first
- ✗ Lower-level than Prisma
- ✗ No schema evolution tools
- ✗ No real-time
- ✗ No API generation

**Corsair:**

- ✓ **Higher abstraction** (natural language vs SQL)
- ✓ **AI-powered migrations** (vs manual SQL)
- ✓ **Full-stack** (vs backend-only)
- ✓ **Real-time** (vs static queries)
- ✓ **Complete runtime** (vs just ORM)

### vs. Supabase

**Supabase:**

- ✓ Auto-generated APIs from Postgres
- ✓ Real-time subscriptions
- ✓ Auth and storage
- ✓ Great documentation
- ✗ Still write SQL migrations
- ✗ RLS policies are tedious
- ✗ No type safety without codegen
- ✗ Real-time is table-level, not query-level
- ✗ No workflows/background jobs

**Corsair:**

- ✓ Everything Supabase has
- ✓ **Zero SQL** (define schema in TypeScript)
- ✓ **Permissions in natural language** (no RLS)
- ✓ **Always type-safe** (no codegen step)
- ✓ **Query-level real-time** (only relevant updates)
- ✓ **Built-in workflows** (no external services)
- ✓ **Edge execution** (faster globally)

**Example comparison:**

```typescript
// Supabase
// 1. Write SQL migration
CREATE TABLE posts (...);
CREATE POLICY "posts_read" ON posts ...;

// 2. Generate types
supabase gen types typescript

// 3. Subscribe to changes manually
const channel = supabase
  .channel('posts')
  .on('postgres_changes', ...)
  .subscribe();

// 4. Handle state management yourself

// Corsair
// 1. Define schema
const Post = model('Post', {
  title: field.string(),
  access: { read: 'anyone if published' }
});

// 2. Query
const posts = useCorsair('all published posts');
// Done. Real-time, typed, secure.
```

### The Corsair Advantage

**Traditional Stack Complexity:**

```
Define Schema (SQL)
  ↓
Write Migrations (SQL)
  ↓
Generate Types (Codegen)
  ↓
Write Backend API (Express/tRPC)
  ↓
Write Frontend Queries (React Query)
  ↓
Add Real-time (WebSockets)
  ↓
Set up Permissions (RLS/Middleware)
  ↓
Add Workflows (Temporal/Inngest)
  ↓
Deploy Backend (Railway/Render)
  ↓
Deploy Frontend (Vercel)

= 10 steps, 5+ tools, hours/days of work
```

**Corsair:**

```
Define Schema (TypeScript)
  ↓
corsair deploy

= 2 steps, 1 tool, minutes of work
```

---

## Summary

Corsair is a full-stack application runtime that eliminates backend complexity:

**Core Features:**

- Natural language queries and mutations
- AI-assisted schema migrations
- Real-time by default
- Edge-native execution
- Zero-config deployment
- End-to-end type safety

**Development Philosophy:**

- Define your business domain (schema)
- Describe what you want (queries/mutations)
- Deploy everywhere (one command)
- Let the runtime handle infrastructure

**Target Users:**

- Solo developers building MVPs
- Startups needing to ship fast
- Teams tired of managing infrastructure
- Anyone who wants Supabase + Prisma + tRPC + React Query unified

**The Promise:**
Build full-stack applications as easily as you build frontend components.

**Vibe Coding:**
We're not solving "how to build apps fast" (Claude, Cursor, Replit, Lovable do this).
We're solving "how to keep apps maintainable as they evolve."
The value proposition:

✅ Coherence: System stays unified as you add features
✅ Consistency: Patterns stay consistent across generations
✅ Testability: Always know what works
✅ Evolvability: Changes propagate correctly
✅ Confidence: Deploy without fear

Target customer: Developers who tried Claude + Supabase / Prisma / Drizzle and learned that generated code ≠ maintainable system.

We're solving the NEXT problem - generation + MAINTENANCE.

---

**Get Started:**

```bash
npx create-corsair-app my-app
cd my-app
corsair dev
```

Welcome to the future of web development.
