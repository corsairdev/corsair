# Flux

**Full-stack apps from TypeScript schemas.**

Define your data model in TypeScript. Query it in plain English. Deploy with one command. Everything else—APIs, real-time sync, permissions, migrations—happens automatically.

---

## What This Is

A runtime that turns your schema into a complete application backend. It's not an ORM (though it includes one). It's not just BaaS (though it gives you that). It's the entire backend stack—data access, APIs, real-time, workflows, permissions—generated from a single schema definition.

You write TypeScript and English. We handle the rest.

---

## Quick Example

**Define your schema:**

```typescript
// schema.ts
import { model, field } from "@flux/schema";

export const Post = model("Post", {
  title: field.string(),
  content: field.markdown(),
  author: field.relation("User"),
  publishedAt: field.datetime({ nullable: true }),

  access: {
    read: "anyone if published, otherwise just the author",
    create: "any logged in user",
    update: "the author",
    delete: "the author",
  },
});

export const User = model("User", {
  name: field.string(),
  email: field.string({ unique: true }),
  posts: field.hasMany("Post", "author"),
});
```

**Query in your components:**

```typescript
// app/posts/page.tsx
export default function PostsPage() {
  const posts = useFlux("all published posts with their authors");

  return (
    <div>
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

**Deploy:**

```bash
flux deploy
```

You now have a production app with type-safe queries, real-time updates, enforced permissions, and global edge deployment.

---

## How It Works

### 1. Schema Definition

Your schema is TypeScript. You define models, fields, relationships, and permissions. That's it.

```typescript
const Post = model("Post", {
  title: field.string(),
  status: field.enum(["draft", "published"]),
  author: field.relation("User"),

  access: {
    read: "public if published, else author",
    update: "author",
  },
});
```

From this, we generate:

- Database schema and migrations
- TypeScript types for your entire app
- REST and GraphQL APIs
- Real-time subscriptions
- Permission enforcement (database-level RLS + runtime checks)

### 2. Natural Language Queries

Instead of learning a query API, write what you want:

```typescript
// Simple
const posts = useFlux("all posts sorted by newest");

// Complex
const trending = useFlux(
  "published posts from last week with more than 100 likes, " +
    "including author and comment count, sorted by likes"
);

// Relational
const myTeam = useFlux("users in my team with their recent posts");
```

**What happens:**

1. Dev server watches for `useFlux` calls with strings
2. LLM generates optimal query code (once, cached forever)
3. TypeScript types generated automatically
4. Runtime imports cached query (no LLM in production)

**You get:**

- Zero API to learn
- Full type safety
- Automatic real-time updates
- Optimistic UI updates
- Offline support

### 3. Mutations

Same pattern for writes:

```typescript
// Simple create
const createPost = useFlux.mutation('create a new post');

createPost({ title: 'Hello', content: 'World' });
// AI infers: set author to current user, status to draft, createdAt to now

// Complex logic
const toggleLike = useFlux.mutation(
  'like this post if I haven't already, unlike it if I have'
);

toggleLike({ postId });
// AI generates: check existing like, toggle state, update counter
```

Generated mutations include:

- Input validation
- Permission checks
- Optimistic updates
- Side effects (emails, notifications, etc.)
- Retry logic

### 4. Workflows

Multi-step business logic:

```typescript
const OrderWorkflow = workflow({
  trigger: "when an order is paid",

  do: [
    "charge the payment method",
    "send confirmation email to customer",
    "notify the warehouse",
    "update inventory",
  ],

  onFailure: "refund the charge and notify admin",
});
```

The runtime handles execution, retries, monitoring, and compensation.

---

## The Watch System

The dev server monitors your files and regenerates queries/mutations when needed:

```typescript
// You save schema.ts with a change
watch("schema.ts", async () => {
  const diff = computeSchemaDiff(oldSchema, newSchema);

  if (diff.breaking) {
    // Analyze impact
    const affected = findAffectedQueries(diff);

    // Show preview
    showMigrationPreview({
      changes: diff,
      affected,
      dataImpact: await analyzeData(diff),
    });

    // Wait for approval
    await confirmMigration();
  }

  // Apply migration
  await applySchemaChange(diff);

  // Regenerate affected queries
  await regenerateQueries(affected);

  // Update types
  await updateTypeDefinitions();
});

// You write a new query
watch("**/*.{ts,tsx}", async (file) => {
  const queries = parseNaturalLanguageQueries(file);

  for (const query of queries) {
    const hash = hashQuery(query.text);

    if (!exists(`.flux/queries/${hash}.ts`)) {
      // Generate once, cache forever
      const code = await generateQuery(query.text);
      write(`.flux/queries/${hash}.ts`, code);
    }
  }
});
```

**Result:** Changes propagate instantly. Types update immediately. Queries regenerate when schema changes. Zero manual steps.

---

## Schema Migrations

When you change your schema, we detect the intent and handle it:

**Non-breaking (automatic):**

```typescript
// Add optional field
excerpt: field.string({ nullable: true });
// → ALTER TABLE posts ADD COLUMN excerpt TEXT;
```

**Breaking (assisted):**

```typescript
// Split field
// Before: name: field.string()
// After:  firstName: field.string()
//         lastName: field.string()

// We detect field split, show preview:
// "This will affect 12 queries and 1,247 records"
// Generate transformation: split on first space
// Preview results on sample data
// You approve or customize
// Migration runs with zero downtime
```

**Key principles:**

- Migrations are generated automatically from schema changes
- AI infers transformation logic (you can customize)
- Preview before applying
- Gradual rollout in production
- Backward compatibility maintained during transition
- Rollback available for 24 hours
- Developer has final say on everything

---

## Development vs Production

### Local Development

```bash
flux dev
```

- SQLite database (fast, local)
- File watching (instant updates)
- LLM generates queries as you type
- Hot reload for everything
- Time-travel debugging

### Production Deployment

```bash
flux deploy
```

**What happens:**

1. All queries/mutations are pre-generated (no LLM at runtime)
2. Database deployed (distributed Postgres)
3. Code deployed to global edge network
4. Migrations applied with zero downtime
5. Types and queries cached at edge

**Production characteristics:**

- Sub-50ms P95 latency globally (edge execution)
- Real-time sync via WebSockets + CRDTs
- Offline-first (client caches locally)
- Auto-scaling (no config needed)
- One command rollback

---

## Why Not Prisma/Drizzle/Supabase?

**Prisma/Drizzle** are great ORMs. But you still need to:

- Write API endpoints
- Handle real-time subscriptions manually
- Manage frontend state separately
- Deploy backend and frontend separately
- Write your own permission logic
- Handle migrations yourself

**Supabase** is great BaaS. But you still need to:

- Write SQL for schema changes
- Write RLS policies (verbose, error-prone)
- Run codegen to sync types
- Handle complex workflows separately
- Write table-level subscriptions (not query-level)

**Flux** gives you:

- Natural language queries (no API to learn)
- Automatic migrations (no SQL)
- Permissions in schema (enforced everywhere)
- Real-time by default (query-level subscriptions)
- Workflows included (no external services)
- One deployment (frontend + backend together)
- Type safety without codegen (always in sync)

**Trade-offs:**

- More opinionated (less control over database internals)
- Newer (Prisma/Supabase are battle-tested)
- PostgreSQL only initially (they support many databases)

**When to use Flux:**

- You want to ship fast
- You're okay with higher abstraction
- You prefer intent over implementation
- You want one stack, not many

**When to use alternatives:**

- You need low-level database control
- You have complex legacy database schemas
- You prefer explicit over automatic
