# Corsair

**The Vibe Coding SDK.**

Natural language queries and mutations for your full-stack TypeScript app. Fully type-safe, schema-aware, and built for developers who want to move fast without losing control. Compatible with your favorite coding agents.

**Status:** Early development. Currently supports Next.js + Drizzle + Postgres.

## What is Corsair?

Corsair lets you write database queries and business logic in plain English. It generates real TypeScript API routes using your existing ORM—no magic, no vendor lock-in, no runtime overhead.

```typescript
// Query your database
const albums = useCorsairQuery('get all albums by artist id', {
  artistId: params.artist_id,
})

// Chain business logic with integrations
const addUser = useCorsairMutation('add user and send slack notification', {
  ...form.user_details,
  channel: 'general',
})
```

Your natural language prompt becomes a typed template literal. The input and output types are known at compile time, so your IDE catches errors immediately.

## Why Corsair?

We have great AI coding tools for building UIs. But what about the other two tiers of your app: **business logic and databases**?

Corsair fills that gap. It's designed for the spectrum between "move fast and break things" and "I don't trust AI anywhere near my codebase."

**You stay in control:**

- **Real code, not abstraction** - Corsair generates standard TypeScript API routes. View them, edit them, own them.
- **Zero runtime overhead** - Code generation happens at build time. Your queries run at normal API speeds.
- **Fully type-safe** - Your prompts map to input/output types. TypeScript knows exactly what you're sending and receiving.
- **Schema-aware** - Change your Drizzle schema? Corsair detects affected routes and rewrites them automatically.
- **Incremental adoption** - Use Corsair alongside your existing API routes. No need to rewrite your app.
- **No vendor lock-in** - Your queries are stored as normal TypeScript. Want to eject? Just move the generated routes to your new framework.

## How it works

1. **You write:** `useCorsairQuery("get all albums by artist id", { artistId })`
2. **Corsair generates:** A complete TypeScript API route using your Drizzle ORM
3. **You get:** Type-safe queries with intellisense, no SQL required
4. **Schema changes?** Corsair sees the diff and updates affected routes

The generated code is yours. Read it, modify it, debug it. If Corsair gets something wrong, either edit the code directly or tell Corsair what to change.

**Complex queries work.** Joins across multiple tables, aggregations, relations—Corsair handles production-grade queries, not just CRUD.

## Built for coding agents

Corsair has CLI commands designed for Claude Code, Cursor, and other AI coding tools:

```bash
pnpm corsair query -n "get all albums by artist id" -i "return all albums in descending order (recent ones first)"
```

This means your coding agent can build queries and mutations directly—without making architectural decisions for you or scattering `any` types throughout your codebase.

**The problem with raw coding agents:** They'll happily set types to `any` in random places, giving you a false sense of security. Type errors slip through to runtime.

**The Corsair approach:** Your agent uses a structured SDK that enforces type safety. You get the speed of AI coding with the guarantees of a well-architected system. No architectural compromises, no hidden type holes.

## Plugins

Chain business logic with integrations:

- Slack
- Stripe
- Posthog
- Resend
- More actively being built

_Note: Plugin ecosystem is in early development. Basic implementations are available._

## For teams

- **Non-technical folks** can write queries without SQL knowledge
- **Developers** maintain full type safety and control over generated code
- **AI coding agents** can build backend logic without architectural trade-offs
- **Everyone** works in the same codebase without stepping on each other

No more context-switching between natural language prototypes and production code. Your vibe-coded queries _are_ production code.

## Get started

Install Corsair in your Next.js + Drizzle + Postgres project in under 5 minutes:

```bash
npm install corsair
```

[Documentation](link) | [Examples](link) | [Discord](link)

## What "early development" means

- **Stable:** API routes and business logic work in development and production
- **In progress:** Fine-tuning developer experience across TypeScript versions and refining our code generation agent for 100% accuracy
- **Currently supports:** Next.js, Drizzle, Postgres (more ORMs and frameworks coming)

---

**Built by YC developers who got tired of the gap between AI coding tools and production-grade backends.**
