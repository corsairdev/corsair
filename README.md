# Corsair

**Full-stack TypeScript queries from natural language.**

Write what you want in plain English. Get type-safe queries, real-time updates, and intelligent tooling. Works with any ORM and database.

```typescript
const posts = useCorsairQuery("all published posts with authors");
```

> ⚠️ **Alpha Software** - Corsair is in active development. Expect rapid changes and contributions are welcome!

## What It Does

Corsair transforms natural language into type-safe database queries using TanStack Query and tRPC. Instead of learning query APIs, just describe what you need:

```typescript
// Simple queries
const users = useCorsairQuery("all active users");

// Complex relationships
const trending = useCorsairQuery(
  "published posts from last week with more than 100 likes, " +
  "including author and comment count, sorted by likes"
);

// Mutations
const createPost = useCorsairMutation("create a new post");
createPost({ title: "Hello World", content: "..." });
```

## Key Features

- **Natural Language Queries** - Write what you want, get optimized code
- **Full Type Safety** - TypeScript types generated automatically
- **Real-time Updates** - Built on TanStack Query for caching and sync
- **ORM Agnostic** - Works with Prisma, Drizzle, TypeORM, and more
- **Intelligent CLI** - Watches your code and helps configure queries
- **AI Agent Ready** - Bash commands for programmatic configuration

## Quick Start

```bash
npm install corsair
npx corsair init
```

Define your schema, write natural language queries, and let Corsair handle the rest.

## Architecture

- **TanStack Query** for client-side caching and real-time updates
- **tRPC** for type-safe client-server communication
- **Intelligent CLI** that watches and assists during development
- **Multi-ORM support** for existing database setups

## Status

Corsair is in alpha. The core query generation and type safety features are functional, but expect breaking changes as we refine the API and add new capabilities.

## Contributing

We're moving fast and welcome contributions! Check out the issues or reach out if you'd like to help shape the future of database querying.
