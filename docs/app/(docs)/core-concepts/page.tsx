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
      <DocsTitle>Core Concepts</DocsTitle>
      <DocsDescription>Understanding queries, mutations, and client setup</DocsDescription>
      <DocsBody>
        <h2>Procedures</h2>
        <p>Corsair uses tRPC under the hood. Procedures are the building blocks for queries and mutations.</p>
        
        <h3>Queries</h3>
        <p>Queries are for fetching data. They use the <code>.query()</code> method:</p>
        <CodeBlock
          title="corsair/queries/get-all-albums.ts"
          data-line-numbers
          viewportProps={{ style: { paddingLeft: 16 } }}
        >
          <Pre>
            <code className="language-ts">{`import { z } from 'corsair'
import { procedure } from '../procedure'

export const getAllAlbums = procedure
  .input(z.object({}))
  .query(async ({ input, ctx }) => {
    const albums = await ctx.db.select().from(ctx.db._.fullSchema.albums)
    return albums
  })`}</code>
          </Pre>
        </CodeBlock>

        <h3>Mutations</h3>
        <p>Mutations are for creating, updating, or deleting data. They use the <code>.mutation()</code> method:</p>
        <CodeBlock
          title="corsair/mutations/create-album.ts"
          data-line-numbers
          viewportProps={{ style: { paddingLeft: 16 } }}
        >
          <Pre>
            <code className="language-ts">{`import { procedure } from '../procedure'
import { z } from 'corsair'

export const createAlbum = procedure
  .input(
    z.object({
      id: z.string(),
      name: z.string(),
      album_type: z.string(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const [album] = await ctx.db
      .insert(ctx.db._.fullSchema.albums)
      .values({ ...input })
      .returning()

    return album
  })`}</code>
          </Pre>
        </CodeBlock>

        <h2>Client Setup</h2>
        <p>Create a typed client to use in your components:</p>
        <CodeBlock
          title="corsair/client.ts"
          data-line-numbers
          viewportProps={{ style: { paddingLeft: 16 } }}
        >
          <Pre>
            <code className="language-ts">{`import { createCorsairClient, createCorsairHooks } from 'corsair'
import type { CorsairRouter } from '.'

const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  if (process.env.VERCEL_URL) {
    return \`https://\${process.env.VERCEL_URL}\`
  }
  return \`http://localhost:\${process.env.PORT || 3000}\`
}

const { typedClient } = createCorsairClient<CorsairRouter>({
  url: \`\${getBaseUrl()}\${process.env.NEXT_PUBLIC_CORSAIR_API_ROUTE!}\`,
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
export type MutationOutputs = typeof types.MutationOutputs`}</code>
          </Pre>
        </CodeBlock>

        <h2>Provider Setup</h2>
        <p>Wrap your app with <code>CorsairProvider</code> in your root layout:</p>
        <CodeBlock
          title="app/layout.tsx"
          data-line-numbers
          viewportProps={{ style: { paddingLeft: 16 } }}
        >
          <Pre>
            <code className="language-tsx">{`import { CorsairProvider } from "corsair/client"

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
}`}</code>
          </Pre>
        </CodeBlock>

        <h2>Using Queries</h2>
        <h3>Server Components</h3>
        <p>Use <code>corsairQuery</code> for server-side data fetching:</p>
        <CodeBlock
          title="app/page.tsx"
          data-line-numbers
          viewportProps={{ style: { paddingLeft: 16 } }}
        >
          <Pre>
            <code className="language-tsx">{`import { corsairQuery } from '@/corsair/client'

export default async function Home() {
  const artists = await corsairQuery('get all artists', {})
  const albums = await corsairQuery('get all albums', {})

  return <div>{/* Render data */}</div>
}`}</code>
          </Pre>
        </CodeBlock>

        <h3>Client Components</h3>
        <p>Use <code>useCorsairQuery</code> for client-side data fetching:</p>
        <CodeBlock
          title="components/artist-details.tsx"
          data-line-numbers
          viewportProps={{ style: { paddingLeft: 16 } }}
        >
          <Pre>
            <code className="language-tsx">{`'use client'

import { useCorsairQuery } from '@/corsair/client'

export function ArtistDetails({ artistId }: { artistId: string }) {
  const { data, isLoading } = useCorsairQuery(
    'get albums by artist id',
    { artistId },
    { enabled: !!artistId }
  )

  if (isLoading) return <div>Loading...</div>
  
  return <div>{/* Render albums */}</div>
}`}</code>
          </Pre>
        </CodeBlock>

        <h2>Using Mutations</h2>
        <p>Use <code>useCorsairMutation</code> for mutations in client components:</p>
        <CodeBlock
          title="components/create-album-form.tsx"
          data-line-numbers
          viewportProps={{ style: { paddingLeft: 16 } }}
        >
          <Pre>
            <code className="language-tsx">{`'use client'

import { useCorsairMutation } from '@/corsair/client'

export function CreateAlbumForm() {
  const mutation = useCorsairMutation('create album')

  const handleSubmit = async (data: any) => {
    await mutation.mutate(data)
  }

  return <form onSubmit={handleSubmit}>{/* Form fields */}</form>
}`}</code>
          </Pre>
        </CodeBlock>

        <Callout type="info" title="Type Safety">
          All queries and mutations are fully typed. TypeScript will autocomplete available operations 
          and validate input/output types.
        </Callout>
      </DocsBody>
    </DocsPage>
  )
}
