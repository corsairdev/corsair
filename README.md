# Corsair

**The Vibe Coding SDK.**

_Type-safe natural language queries and mutations for your database and third-party APIs._

```typescript
const onboardUser = useCorsairMutation(
  'create user account, send welcome email via Resend, and notify #team Slack channel'
)

await onboardUser.mutateAsync({
  email: 'john.doe@corsair.dev',
  name: 'John Doe',
  plan: 'pro',
})
// Fully typed. Zero `any` types. Complete intellisense.
```

## Why Corsair?

**The problem:** LLMs are great at generating code, but the output is usually untyped, unreliable, and becomes technical debt. You either spend time reviewing and fixing AI-generated code, or you write everything by hand.

**The solution:** Corsair gives you the speed of AI code generation with production-grade type safety. Write natural language, get fully-typed implementations at **compile time** (not runtime), with complete control to view and edit the generated code.

## Perfect for Coding Agents

Corsair reduces token usage and increases reliability when working with AI coding assistants:

**Without Corsair:**

```typescript
// Agent generates 50+ lines of Prisma code and business logic inline
const posts = await prisma.post.findMany({
  where: { published: true },
  include: { author: true, comments: { include: { author: true } } },
  // ... bloats context, might type as 'any', no guarantee it's correct
})
```

**With Corsair:**

```bash
pnpm corsair query -n "published posts with comments" -i "fetch all published posts with authors and approved comments"
```

The agent delegates to Corsair instead of generating code. You get type safety, minimal token usage, and zero technical debt.

## Features

- **Type-safe natural language** — Write queries and mutations in plain English, get full TypeScript types
- **Agent-first CLI** — Let coding agents create queries via CLI without bloating their context
- **Automatic schema updates** — When your DB schema changes, Corsair regenerates affected code in seconds
- **Vetted plugin integrations** — Use Slack, Resend, Stripe, PostHog without writing integration code
- **Edit anything** — Click any query to see and modify the generated code. No magic, just TypeScript
- **Full intellisense** — Autocomplete for every field, parameter, and plugin configuration
- **Intent preservation** — Your natural language stays inline, so you always know what the code was meant to do

## Common Questions

**"Is this just black-box AI code generation?"**  
No. The generated code is committed to your repo. You can view it, edit it, and review it in PRs like any other code.

**"What if the LLM generates bad code?"**  
Corsair regenerates queries using your schema as ground truth. If TypeScript compiles, the query works. Plus, you can edit any generated code you don't like.

**"What happens when third-party APIs change?"**  
Corsair maintains plugins for services like Slack and Stripe. When they update their APIs, Corsair updates the plugin—your code stays safe.

**"Can I use this with my existing codebase?"**  
Yes. Corsair works with Prisma or Drizzle on PostgreSQL (more ORM and DB support coming soon). Use it for new features while keeping existing code unchanged. Incremental adoption.

---

**The Vibe Coding SDK** — Built for developers who want the speed of AI coding with the reliability of hand-written TypeScript.

[Documentation](https://docs.corsair.dev) • [Discord](https://discord.gg/corsair) • [Twitter](https://twitter.com/corsairdev)
