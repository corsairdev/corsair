import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from 'fumadocs-ui/page'
import { CodeBlock, Pre } from 'fumadocs-ui/components/codeblock'
import { Callout } from 'fumadocs-ui/components/callout'

export default function Page() {
  return (
    <DocsPage>
      <DocsTitle>Type Safety</DocsTitle>
      <DocsDescription>
        Full end-to-end type safety from database to UI
      </DocsDescription>
      <DocsBody>
        <Callout type="info" title="TypeScript All the Way">
          Corsair provides complete type safety from your database schema to your client
          components, with no manual type definitions required.
        </Callout>

        <h2>How It Works</h2>
        <p>
          Corsair leverages TypeScript's type inference and tRPC to automatically generate
          types for your queries and mutations based on your database schema.
        </p>

        <h2>Input Validation</h2>
        <p>Define input schemas using Zod for runtime validation and type inference:</p>
        <CodeBlock
          title="corsair/queries/get-albums-by-artist-id.ts"
          data-line-numbers
          viewportProps={{ style: { paddingLeft: 16 } }}
        >
          <Pre>
            <code className="language-ts">{`import { z } from 'corsair'
import { procedure } from '../procedure'

export const getAlbumsByArtistId = procedure
  .input(
    z.object({
      artistId: z.string().min(1, 'Artist ID is required'),
      limit: z.number().int().positive().optional(),
      offset: z.number().int().nonnegative().optional(),
    })
  )
  .query(async ({ input, ctx }) => {
    const albums = await ctx.db
      .select()
      .from(ctx.db._.fullSchema.albums)
      .where(eq(ctx.db._.fullSchema.albums.artistId, input.artistId))
      .limit(input.limit || 10)
      .offset(input.offset || 0)
    
    return albums
  })`}</code>
          </Pre>
        </CodeBlock>

        <h2>Output Types</h2>
        <p>Output types are automatically inferred from your procedure's return value:</p>
        <CodeBlock
          title="TypeScript"
          data-line-numbers
          viewportProps={{ style: { paddingLeft: 16 } }}
        >
          <Pre>
            <code className="language-ts">{`import type { QueryOutputs } from '@/corsair/client'

type Albums = QueryOutputs['get albums by artist id']

const albums: Albums = await corsairQuery('get albums by artist id', {
  artistId: '123',
})`}</code>
          </Pre>
        </CodeBlock>

        <h2>Type Extraction</h2>
        <p>Extract types for use in your components:</p>
        <CodeBlock
          title="components/album-list.tsx"
          data-line-numbers
          viewportProps={{ style: { paddingLeft: 16 } }}
        >
          <Pre>
            <code className="language-tsx">{`import type { QueryOutputs } from '@/corsair/client'

type Album = QueryOutputs['get all albums'][number]

interface AlbumListProps {
  albums: Album[]
}

export function AlbumList({ albums }: AlbumListProps) {
  return (
    <div>
      {albums.map((album) => (
        <div key={album.id}>
          <h3>{album.name}</h3>
          <p>{album.album_type}</p>
        </div>
      ))}
    </div>
  )
}`}</code>
          </Pre>
        </CodeBlock>

        <h2>Client Hooks with Types</h2>
        <p>All hooks are fully typed with autocomplete:</p>
        <CodeBlock
          title="components/artist-details.tsx"
          data-line-numbers
          viewportProps={{ style: { paddingLeft: 16 } }}
        >
          <Pre>
            <code className="language-tsx">{`'use client'

import { useCorsairQuery, type QueryOutputs } from '@/corsair/client'

export function ArtistDetails({ artistId }: { artistId: string }) {
  const { data, isLoading, error } = useCorsairQuery(
    'get albums by artist id',
    { artistId },
    { enabled: !!artistId }
  )

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      {data?.map((album) => (
        <div key={album.id}>{album.name}</div>
      ))}
    </div>
  )
}`}</code>
          </Pre>
        </CodeBlock>

        <h2>Mutation Types</h2>
        <p>Mutations are also fully typed:</p>
        <CodeBlock
          title="components/create-album-form.tsx"
          data-line-numbers
          viewportProps={{ style: { paddingLeft: 16 } }}
        >
          <Pre>
            <code className="language-tsx">{`'use client'

import { useCorsairMutation, type MutationInputs } from '@/corsair/client'

export function CreateAlbumForm() {
  const mutation = useCorsairMutation('create album', {
    onSuccess: (data) => {
      console.log('Created album:', data.id)
    },
  })

  const handleSubmit = (data: MutationInputs['create album']) => {
    mutation.mutate(data)
  }

  return <form>{/* Form implementation */}</form>
}`}</code>
          </Pre>
        </CodeBlock>

        <h2>Schema-Driven Types</h2>
        <p>
          Your Drizzle schema is the source of truth. Types are derived directly from your
          database schema:
        </p>
        <CodeBlock
          title="db/schema.ts"
          data-line-numbers
          viewportProps={{ style: { paddingLeft: 16 } }}
        >
          <Pre>
            <code className="language-ts">{`import { pgTable, text, integer } from 'drizzle-orm/pg-core'

export const albums = pgTable('albums', {
  id: text('id').primaryKey(),
  name: text('name'),
  album_type: text('album_type'),
  total_tracks: integer('total_tracks'),
})`}</code>
          </Pre>
        </CodeBlock>

        <p>This schema automatically provides types for:</p>
        <ul>
          <li>Query results</li>
          <li>Insert operations</li>
          <li>Update operations</li>
          <li>Select projections</li>
        </ul>

        <h2>Type Safety Benefits</h2>
        <ul>
          <li><strong>Autocomplete:</strong> Full IDE support with IntelliSense</li>
          <li><strong>Compile-time errors:</strong> Catch mistakes before runtime</li>
          <li><strong>Refactoring:</strong> Safe schema changes with TypeScript errors guiding you</li>
          <li><strong>No manual types:</strong> Types are automatically generated and kept in sync</li>
          <li><strong>Runtime validation:</strong> Zod validates inputs at runtime</li>
        </ul>

        <h2>Error Handling</h2>
        <p>Errors are typed as well:</p>
        <CodeBlock
          title="TypeScript"
          data-line-numbers
          viewportProps={{ style: { paddingLeft: 16 } }}
        >
          <Pre>
            <code className="language-tsx">{`import type { TRPCClientError } from '@trpc/client'
import type { CorsairRouter } from '@/corsair'

const { error } = useCorsairQuery('get all albums', {})

if (error) {
  const trpcError = error as TRPCClientError<CorsairRouter>
  console.log('Error code:', trpcError.data?.code)
  console.log('Error message:', trpcError.message)
}`}</code>
          </Pre>
        </CodeBlock>

        <Callout type="info" title="Zero Manual Work">
          You never need to manually write type definitions. Types are automatically
          generated from your schema and procedures.
        </Callout>

        <h2>Type Checking in CI</h2>
        <p>Run TypeScript checks in your CI pipeline:</p>
        <CodeBlock
          title="package.json"
          data-line-numbers
          viewportProps={{ style: { paddingLeft: 16 } }}
        >
          <Pre>
            <code className="language-json">{`{
  "scripts": {
    "typecheck": "tsc --noEmit",
    "corsair:check": "corsair check",
    "ci": "npm run typecheck && npm run corsair:check"
  }
}`}</code>
          </Pre>
        </CodeBlock>

        <Callout type="warn" title="Schema Changes">
          When you change your database schema, TypeScript will immediately show errors in
          any affected queries. The Corsair CLI will also detect these issues during
          validation.
        </Callout>
      </DocsBody>
    </DocsPage>
  )
}

