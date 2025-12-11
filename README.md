# Corsair: The TypeScript Vibe Coding SDK

Corsair is a TypeScript SDK that gives AI coding agents a validated interface to your backend. Agents describe what they want in natural language and Corsair generates fully-typed API routes connected to your database and third-party services. It works with any stack, enforcing types from database to frontend. When your schema changes, Corsair auto-fixes all affected routes in seconds. And since it's just TypeScript, you can edit the generated code anytime. Corsair handles the backend plumbing so you can focus on building your product instead of debugging AI-generated queries.

Existing solutions make you choose between speed and control. Vibe coding platforms can't securely connect to real data. Automation tools lack frontend support and require manual workflow assembly. Letting AI write backend code directly works once, then becomes unmaintainable when requirements change. You're left digging through generated code trying to fix what broke. Corsair gives AI the right level of abstraction: agents describe intent, Corsair ensures type-safe, maintainable implementation.

**It's about speed + control, not speed versus control.**

Your agent writes the bash command:

```bash
pnpm corsair query
  -n "published posts with engagement"
  -i "this should return published posts with author details and comment count. it should accept an author id"
```

Corsair writes a client-ready query:

```typescript
const posts = useCorsairQuery('published posts with engagement', {
  author_id: params.author_id,
})
```

Corsair even integrates with third-party APIs.

```bash
pnpm corsair mutation
  -n "publish post"
  -i "publish this post and then send a slack notification that a new post has been created"
```

```typescript
const post = useCorsairMutation('publish post', {
  post,
  channel: "#new-posts",
})
```

*Integrate with Slack, Resend, Stripe, Posthog, Spotify, and more!*

With Corsair, you get:

- ✅ Integrate with your favorite agent - Claude Code, Corsair, Antigravity, whatever's coming out next week. All agents work with Corsair.
- ✅ Overwrite as needed - All generated code is normal TypeScript and lives in your codebase. It is completely editable.
- ✅ Full type safety - TypeScript knows all types from your back-end to your front-end.
- ✅ Validated API routes - Can't hallucinate invalid database operations or third-party integrations
- ✅ Readable code - Developers instantly understand intent during code review
- ✅ Auto-fixing - When your schema changes, Corsair adapts and rewrites your API routes in seconds.

Works with any stack *(Next, Vite, Hono, Svelte, etc)* and any ORM *(Drizzle, Prisma, Kysely, Supabase, etc)*

## Iterate Faster

**You'll change your database schema as you build your project. Corsair will adapt.**

You decide to change your users table from `users.full_name` to `users.first_name` and `users.last_name`. 

Dozens of API routes are broken because `users.full_name` doesn't exist. 

```bash
pnpm corsair fix
```

Corsair will immediately detect all broken API routes and rewrite them to adapt to your new schema. 

## Why Use This With Your Agent?

**Agents work faster** - No fumbling with ORM syntax or debugging type mismatches

**Agents make fewer mistakes** - CLI validates everything before generating code, preventing hallucinated queries

**Agents write readable code** - Natural language intent stays inline, so humans instantly understand what the agent built

**Agents build predictable file structure** - Code is easily traceable back to where it was written and can be edited. 

**Bash-native** - Agents can do everything from terminal without navigating files

## What It Looks Like In Code

The natural language prompt becomes your query identifier:

```typescript
// Queries
const { data: posts } = useCorsairQuery('published posts with engagement')
//    ^? { id: number; title: string; author: { name: string }; commentCount: number }[]

// Mutations
const createPost = useCorsairMutation('create post and send slack notification')
await createPost.mutateAsync({
  title: 'Hello World',
  authorId: 123,
  //  ^ fully typed mutation arguments
  channel: "#new-posts" // "#new-posts" | "#general" | "#sign-ups"
  //  ^ even your plug-ins are strongly typed and defined by you 
})
```

The intent is preserved right in the code. When you read `"published posts with engagement"` you know exactly what it does.

Compare to traditional ORM code where intent is buried in implementation:

```typescript
// ❌ What does this do?
const { data } = useQuery(['posts'], async () => {
  return db
    .select()
    .from(posts)
    .where(eq(posts.published, true))
    .leftJoin(authors, eq(posts.authorId, authors.id))
    .groupBy(posts.id)
})

// ✅ Intent is obvious
const { data } = useCorsairQuery('published posts with engagement')
```

## Get Started With a New Project

*Or add to an existing one*

```bash
npx @corsair-ai/create@latest
```
