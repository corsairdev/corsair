# Corsair

**Power your coding agents with the Vibe Coding SDK.**

Equip your coding agents to build faster with natural language queries and mutations.

```bash
pnpm corsair query
  -n "published posts with engagement"
  -i "this should return published posts with author details and comment count"
```

## What Corsair Does

Corsair turns natural language commands into fully-typed, production-ready queries and mutations. Your agents write what they want in plain English, and Corsair generates TypeScript API endpoints automatically.

Corsair handles ORM complexity, third-party API integrations, and validates everything against your schema and codebase.

When your agent writes the bash command, it can immediately use this on the client:

```typescript
const posts = useCorsairQuery('published posts with engagement by author id', {
  author_id: params.author_id,
})
```

With Corsair, you get:

- ✅ Full type safety - TypeScript knows exactly what shape the data is
- ✅ Validated API routes - Can't hallucinate invalid database operations or third-party integrations
- ✅ Readable code - Developers instantly understand intent during code review
- ✅ Auto-fixing - When your schema changes, Corsair rewrites queries to match

Works with any stack (Next, Vite, Hono, Svelte, etc) and any ORM (Drizzle, Prisma, Kysely, Supabase, etc)

## CLI Commands

**Create queries:**

```bash
pnpm corsair query
  -n "get all posts by author"
  -i "return posts in descending order (newest first)"
```

**Create mutations:**

```bash
pnpm corsair mutation
  -n "create post and email author"
  -i "create the post then email the author confirming it was created"
```

**Update existing:**

```bash
pnpm corsair -u
  -n "create post and email author"
  -i "also auto-like the post by the author"
```

**List everything:**

```bash
pnpm corsair list                  # all queries and mutations
pnpm corsair list -q               # queries only
pnpm corsair list -m               # mutations only
pnpm corsair list -f "author id"   # filter by string
```

**Validate & fix:**

```bash
pnpm corsair check  # validate all queries / mutations still work (like after DB schema updates)
pnpm corsair fix    # auto-fix all queries / mutations
```

## Why Use This With Your Agent?

**Agents work faster** - No fumbling with ORM syntax or debugging type mismatches

**Agents make fewer mistakes** - CLI validates everything before generating code, preventing hallucinated queries

**Agents write readable code** - Natural language intent stays inline, so humans instantly understand what the agent built

**Agents use less tokens** - Agents start with fresh context on each Corsair command, using less tokens on full agent runs

**Bash-native** - Agents can do everything from terminal without navigating files

## What It Looks Like In Code

The natural language prompt becomes your query identifier:

```typescript
// Queries
const { data: posts } = useCorsairQuery('published posts with engagement')
//    ^? { id: number; title: string; author: { name: string }; commentCount: number }[]

// Mutations
const createPost = useCorsairMutation('create post and email author')
await createPost.mutateAsync({
  title: 'Hello World',
  authorId: 123,
  //  ^ fully typed mutation arguments
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

## Get Started

```bash
npm install @corsair-ai/core
npx corsair init
```
