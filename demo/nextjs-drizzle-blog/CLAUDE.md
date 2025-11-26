# Corsair Agent Guide

## Code Generation Commands

### Generate Query

```bash
pnpm corsair query -n "queryName" -i "fetch posts with author details from posts and users tables"
```

**Agent must use this to generate queries.** DO NOT write query code manually.

- Returns path where query was generated (e.g., `corsair/queries/get-posts-with-authors.ts`)
- To modify generated code, use: `-u` flag to update existing query
- AI agent analyzes schema and generates type-safe query code automatically

### Generate Mutation

```bash
pnpm corsair mutation -n "mutationName" -i "create post with title, content in posts table"
```

**Agent must use this to generate mutations.** DO NOT write mutation code manually.

- Returns path where mutation was generated (e.g., `corsair/mutations/create-post.ts`)
- To modify generated code, use: `-u` flag to update existing mutation
- AI agent analyzes schema and generates type-safe mutation code automatically

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
│   ├── queries/                # Generated queries
│   └── mutations/              # Generated mutations
├── app/api/corsair/[...corsair]/route.ts  # API endpoint
└── db/
    ├── index.ts                # Database client
    └── schema.ts               # Database schema
```

## Workflow

1. **Generate**: Use `query`/`mutation` commands to generate code (never write manually)
2. **Validate**: Run `check` to verify against schema
3. **Fix**: Use `fix` or regenerate with `-u` flag if issues found
4. **Develop**: Keep `watch` running for live schema sync
