# Corsair - Full-Stack Apps from TypeScript Schemas

## What Is Corsair?

Corsair is a full-stack application runtime that generates production-ready apps from schema definitions and natural language queries. Define your data models in TypeScript, write queries in plain English, and deploy globally with one command.

**Not an ORM. Not a framework. A complete application runtime.**

## Core Concept

Traditional stack requires:
- ORM (Prisma/Drizzle) for data access
- API layer (tRPC/REST) for backend
- State management (React Query) for frontend  
- Real-time infrastructure (WebSockets)
- Workflow orchestration (Temporal)
- Deployment pipeline

Corsair replaces all of this. Define your schema, describe what you want, everything else is automatic.

## Quick Example

### Schema Definition

```typescript
// schema.ts
import { model, field } from '@corsair/schema';

export const Post = model('Post', {
  title: field.string(),
  content: field.markdown(),
  status: field.enum(['draft', 'published']),
  author: field.relation('User'),
  publishedAt: field.datetime({ nullable: true }),
  
  access: {
    read: 'anyone if published, otherwise just the author',
    create: 'any logged in user',
    update: 'the author',
    delete: 'the author'
  }
});

export const User = model('User', {
  name: field.string(),
  email: field.string({ unique: true }),
  posts: field.hasMany('Post', 'author')
});
```

### Queries (Natural Language)

```typescript
// Anywhere in your app
const posts = useCorsair('all published posts with their authors');

const myDrafts = useCorsair('my draft posts sorted by latest');

const trending = useCorsair('posts from last week with more than 100 likes');
```

### Mutations (Natural Language)

```typescript
const createPost = useCorsair.mutation('create a new post');
const publishPost = useCorsair.mutation('publish this post');
const deletePost = useCorsair.mutation('delete this post');

// Use them
<button onClick={() => publishPost({ postId })}>
  Publish
</button>
```

### What Gets Generated (Automatically)

From the schema and natural language:
- ✅ Database schema and migrations (Postgres)
- ✅ Type-safe queries and mutations
- ✅ REST and GraphQL APIs
- ✅ Real-time subscriptions
- ✅ Permission enforcement (database, API, client)
- ✅ Optimistic updates
- ✅ Offline support
- ✅ Edge distribution

## How It Works

### Development Mode

```bash
corsair dev
```

**File watcher runs continuously:**

1. **Detects schema changes** in `schema.ts`
   - AI classifies change (addition, modification, breaking change)
   - Generates migration strategy
   - Applies to local database
   - Updates TypeScript types

2. **Detects natural language queries** in `.tsx/.ts` files
   - Finds `useCorsair('...')` calls with string literals
   - Generates optimal query using LLM (only once)
   - Caches generated code in `.corsair/queries/`
   - Updates type definitions
   - Hot reloads in browser

3. **Provides instant feedback**
   - Type errors appear in IDE immediately
   - Migration preview shown in terminal
   - Query generation status displayed

**Example watch output:**
```
✓ Schema loaded
⟳ Watching for changes...

[12:34:56] schema.ts changed
  ✓ Detected: Added Post.excerpt field
  ✓ Migration generated (non-breaking)
  ✓ Applied to database (0.2s)
  ✓ Types updated

[12:35:10] app/posts/page.tsx changed  
  ✓ Found new query: "trending posts from this week"
  ⟳ Generating query... (2.1s)
  ✓ Query cached: hash_abc123.ts
  ✓ Types updated
```

### Production

Generated queries are pre-compiled, cached functions. Zero LLM latency at runtime.

```bash
corsair deploy
```

Deploys:
- Database migrations (zero-downtime)
- Compiled queries and mutations
- Frontend and APIs
- Workflow orchestration
- All to global edge network

**Single command. One deployment. Runs everywhere.**

## Handling Schema Changes

### Non-Breaking Changes (Automatic)

```typescript
// Add optional field
excerpt: field.string({ nullable: true })
```

Result: Applied immediately, no developer action needed.

### Breaking Changes (AI-Assisted)

```typescript
// Before
name: field.string()

// After (split field)
firstName: field.string()
lastName: field.string()
```

**System response:**
```
⚠ Breaking change detected: User.name split

Impact:
  • 12 queries reference 'name'
  • 3 mutations set 'name'
  • 1,247 users need data migration

AI suggests:
  • Split names on first space
  • Update queries to use 'lastName' for sorting
  • Maintain compatibility layer for 30 days

[Preview] [Customize] [Apply] [Cancel]
```

**Migration phases:**
1. Add new columns (firstName, lastName)
2. Backfill data in background
3. Deploy new code (both old and new fields work)
4. Remove old column after verification

Developer has full control at every step.

## Key Features

### 1. Natural Language Interface
- Write queries in English, not query syntax
- Permissions in plain language
- AI generates optimal code

### 2. Zero-Config Real-Time
- Queries auto-update when data changes
- Optimistic updates built-in
- Offline support automatic
- Conflict resolution via CRDTs

### 3. Smart Migrations
- AI infers intent from schema changes
- Zero-downtime deployments
- Automatic backfill strategies
- Rollback safety

### 4. End-to-End Type Safety
- Schema → TypeScript types (instant)
- Queries are fully typed
- Mutations validated at compile time
- Runtime type checking included

### 5. Edge-Native
- Queries execute at nearest edge node
- Sub-50ms latency globally
- Automatic caching and optimization
- Distributed state management

### 6. Workflow Orchestration
```typescript
workflow({
  trigger: 'when a post is published',
  do: [
    'send email to followers',
    'post to social media',
    'update search index'
  ]
});
```

## Developer Experience

### What The Developer Writes
- Schema definitions (TypeScript)
- Natural language queries
- UI components (React/etc)

### What Gets Generated
- Database schema and migrations
- Query and mutation code
- TypeScript types
- API endpoints
- Real-time subscriptions
- Permission enforcement
- Deployment configuration

### What You Never Touch
- SQL migrations
- API boilerplate
- State management
- WebSocket servers
- Caching strategies
- Deployment pipelines

## Positioning

**Not competing with:** Prisma, Drizzle (different category)

**Replacing:** Entire backend stack (Prisma + tRPC + React Query + Supabase + Temporal)

**Similar to:** Supabase (auto-generated APIs) but higher abstraction

**Differentiation:**
- No SQL migrations (automatic)
- No API code (generated from schema)
- No permission policies (defined in schema)
- Natural language queries (not query builders)
- Full workflows (not just CRUD)

## Target Users

**Initial:** Supabase users frustrated with:
- Manual RLS policies
- SQL migration files
- Separate codegen steps
- Limited real-time capabilities
- No workflow orchestration

**Eventually:** Anyone building full-stack apps who wants to focus on product, not infrastructure.

---

**Philosophy:** Developers should think in their domain model, not database implementation. Define what you want, the runtime handles how.