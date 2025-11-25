# Corsair AI Assistant Guide

## Overview

Corsair generates type-safe TypeScript API routes from natural language. You maintain full type safety with zero runtime overhead.

**Key Points:**

- Type-safe end-to-end
- Schema-aware with auto-detection
- Natural language to TypeScript
- Standard code you own

**Stack:** Next.js + Drizzle + Postgres

## Project Structure

```
project-root/
├── corsair.config.ts
├── corsair/
│   ├── index.ts
│   ├── procedure.ts
│   ├── client.ts
│   ├── queries/
│   │   ├── index.ts
│   │   └── [query-files].ts
│   └── mutations/
│       ├── index.ts
│       └── [mutation-files].ts
├── app/api/corsair/[...corsair]/route.ts
└── db/
    ├── index.ts
    └── schema.ts
```

## Configuration

### corsair.config.ts

```typescript
import { config as dotenvConfig } from 'dotenv'
import { type CorsairConfig } from 'corsair'
import { db } from './db'

dotenvConfig({ path: '.env.local' })

export const config = {
  dbType: 'postgres',
  orm: 'drizzle',
  framework: 'nextjs',
  pathToCorsairFolder: './corsair',
  apiEndpoint: process.env.NEXT_PUBLIC_CORSAIR_API_ROUTE!,
  db: db,
  schema: db._.schema,
  connection: process.env.DATABASE_URL!,
} satisfies CorsairConfig<typeof db>

export type Config = typeof config
```

### Environment Variables

```bash
DATABASE_URL=postgresql://user:password@localhost:5432/mydb
NEXT_PUBLIC_CORSAIR_API_ROUTE=/api/corsair
```

## Procedure Setup

### corsair/procedure.ts

```typescript
import { createCorsairTRPC } from 'corsair'
import { config } from '../corsair.config'

export type DatabaseContext = {
  db: typeof config.db
  schema: Exclude<typeof config.schema, undefined>
  userId?: string
}

const t = createCorsairTRPC<DatabaseContext>()
export const { router, procedure } = t
```

## Example Query Structure

```typescript
import { z } from 'corsair'
import { procedure } from '../procedure'
import { eq } from 'drizzle-orm'

export const getAlbumsByArtistId = procedure
  .input(z.object({ artistId: z.string() }))
  .query(async ({ input, ctx }) => {
    const albums = await ctx.db
      .select()
      .from(ctx.db._.fullSchema.albums)
      .innerJoin(
        ctx.db._.fullSchema.album_artists,
        eq(
          ctx.db._.fullSchema.albums.id,
          ctx.schema.album_artists.columns.album_id
        )
      )
      .where(eq(ctx.db._.fullSchema.album_artists.artist_id, input.artistId))
    return albums
  })
```

## Example Mutation Structure

```typescript
import { procedure } from '../procedure'
import { z } from 'corsair'
import { eq } from 'drizzle-orm'

export const updateArtistPopularity = procedure
  .input(
    z.object({
      artistId: z.string(),
      popularity: z.number(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const [artist] = await ctx.db
      .update(ctx.db._.fullSchema.artists)
      .set({ popularity: input.popularity })
      .where(eq(ctx.db._.fullSchema.artists.id, input.artistId))
      .returning()
    return artist
  })
```

## Router Setup

### corsair/index.ts

```typescript
import { dualKeyOperationsMap } from 'corsair'
import { router } from './procedure'
import * as queries from './queries'
import * as mutations from './mutations'

export const corsairRouter = router({
  ...dualKeyOperationsMap(queries),
  ...dualKeyOperationsMap(mutations),
})

export type CorsairRouter = typeof corsairRouter
```

### corsair/queries/index.ts & mutations/index.ts

Export all your queries/mutations:

```typescript
export * from './get-all-albums'
export * from './get-albums-by-artist-id'
```

## API Route Setup

### app/api/corsair/[...corsair]/route.ts

```typescript
import { fetchRequestHandler } from 'corsair'
import { corsairRouter } from '@/corsair/index'
import { db } from '@/db'

const handler = async (req: Request) => {
  return fetchRequestHandler({
    endpoint: '/api/corsair',
    req,
    router: corsairRouter,
    createContext: () => ({
      userId: '123',
      db,
      schema: db._.schema!,
    }),
  })
}

export const GET = handler
export const POST = handler
```

## Client Setup

### corsair/client.ts

```typescript
import { createCorsairClient, createCorsairHooks } from 'corsair'
import type { CorsairRouter } from '.'

const getBaseUrl = () => {
  if (typeof window !== 'undefined') return window.location.origin
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return `http://localhost:${process.env.PORT || 3000}`
}

const { typedClient } = createCorsairClient<CorsairRouter>({
  url: `${getBaseUrl()}${process.env.NEXT_PUBLIC_CORSAIR_API_ROUTE!}`,
})

const {
  useCorsairQuery,
  useCorsairMutation,
  corsairQuery,
  corsairMutation,
  types,
} = createCorsairHooks<CorsairRouter>(typedClient)

export { useCorsairQuery, useCorsairMutation, corsairQuery, corsairMutation }
export type QueryInputs = typeof types.QueryInputs
export type QueryOutputs = typeof types.QueryOutputs
export type MutationInputs = typeof types.MutationInputs
export type MutationOutputs = typeof types.MutationOutputs
```

## Client Usage

### Server Component

```typescript
import { corsairQuery } from '@/corsair/client'

export default async function Page() {
  const artists = await corsairQuery('get all artists', {})
  return (
    <div>
      {artists.map(a => (
        <div key={a.id}>{a.name}</div>
      ))}
    </div>
  )
}
```

### Client Component

```typescript
'use client'
import { useCorsairQuery, useCorsairMutation } from '@/corsair/client'

export function Component({ artistId }: { artistId: string }) {
  const { data, isLoading } = useCorsairQuery('get albums by artist id', {
    artistId,
  })
  const createAlbum = useCorsairMutation('create album')

  if (isLoading) return <div>Loading...</div>
  return (
    <div>
      {data?.map(a => (
        <div key={a.id}>{a.name}</div>
      ))}
    </div>
  )
}
```

### Provider Setup

```typescript
import { CorsairProvider } from 'corsair/client'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <CorsairProvider>{children}</CorsairProvider>
      </body>
    </html>
  )
}
```

## CLI Commands

**Start Development Mode:**

```bash
pnpm corsair watch
```

**Generate Types:**

```bash
pnpm corsair generate
```

**Validate:**

```bash
pnpm corsair check
```

**Auto-fix Issues:**

```bash
pnpm corsair fix
```

## 🚨 IMPORTANT: Code Generation

**ALWAYS use CLI commands to generate queries/mutations. DO NOT write them manually.**

### Generate Query

```bash
pnpm corsair query -n "get albums by artist id" -i "return all albums for a given artist id with join to album_artists table"
```

### Generate Mutation

```bash
pnpm corsair mutation -n "update artist popularity" -i "update the popularity field of an artist by id"
```

**After generation:**

1. Review the generated file
2. Add exports to `corsair/queries/index.ts` or `corsair/mutations/index.ts`
3. Run `pnpm corsair check` to validate

## Drizzle Quick Reference

### Common Operations

**Select:**

```typescript
await ctx.db.select().from(ctx.db._.fullSchema.albums)
await ctx.db
  .select()
  .from(ctx.db._.fullSchema.albums)
  .where(eq(ctx.db._.fullSchema.albums.id, input.id))
```

**Insert:**

```typescript
const [item] = await ctx.db
  .insert(ctx.db._.fullSchema.albums)
  .values(input)
  .returning()
```

**Update:**

```typescript
const [item] = await ctx.db
  .update(ctx.db._.fullSchema.albums)
  .set({ name: input.name })
  .where(eq(ctx.db._.fullSchema.albums.id, input.id))
  .returning()
```

**Delete:**

```typescript
await ctx.db
  .delete(ctx.db._.fullSchema.albums)
  .where(eq(ctx.db._.fullSchema.albums.id, input.id))
```

**Joins:**

```typescript
await ctx.db
  .select()
  .from(ctx.db._.fullSchema.albums)
  .innerJoin(
    ctx.db._.fullSchema.album_artists,
    eq(ctx.db._.fullSchema.albums.id, ctx.schema.album_artists.columns.album_id)
  )
```

## Type Safety

```typescript
import type {
  QueryInputs,
  QueryOutputs,
  MutationInputs,
  MutationOutputs,
} from '@/corsair/client'

type GetAlbumsInput = QueryInputs['get albums by artist id']
type AlbumsData = QueryOutputs['get albums by artist id']
```

## Best Practices

1. **Always use `ctx.db._.fullSchema` for table references**
2. **Always use `ctx.schema` for column references**
3. **Run `pnpm corsair check` after schema changes**
4. **Export all operations in index.ts files**
5. **Use CLI to generate queries/mutations, not manual writing**

## AI Assistant Instructions

### When User Requests a Query/Mutation:

1. **Use CLI command to generate it:**
   ```bash
   pnpm corsair query -n "query name" -i "detailed description of what it should do"
   ```
2. **Add export to index.ts:**

   ```typescript
   export * from './query-name'
   ```

3. **Validate:**

   ```bash
   pnpm corsair check
   ```

4. **Review generated code with user**

### Example Workflow:

User: "I need a query to get all tracks for an album"

You should:

```bash
pnpm corsair query -n "get tracks by album id" -i "return all tracks for a given album id from the tracks table"
```

Then add to `corsair/queries/index.ts`:

```typescript
export * from './get-tracks-by-album-id'
```

Then validate:

```bash
pnpm corsair check
```

## Troubleshooting

**Type errors?** Check you're using `ctx.db._.fullSchema` and `ctx.schema` correctly

**Missing operations?** Verify exports in index.ts files and run `pnpm corsair generate`

**Schema changes?** Run `pnpm corsair check` to see affected operations

---

**Remember: Always use CLI commands for code generation. Never write queries/mutations manually.**
