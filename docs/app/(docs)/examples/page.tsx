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
      <DocsTitle>Examples</DocsTitle>
      <DocsDescription>
        Real-world examples and patterns for building with Corsair
      </DocsDescription>
      <DocsBody>
        <Callout type="info" title="Complete Demo">
          Check out the <code>demo/nextjs-drizzle</code> folder in the Corsair repository 
          for a complete working example with a music database.
        </Callout>

        <h2>Basic CRUD Operations</h2>

        <h3>Query: Fetch All Records</h3>
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

        <h3>Query: Fetch by ID</h3>
        <CodeBlock
          title="corsair/queries/get-album-by-id.ts"
          data-line-numbers
          viewportProps={{ style: { paddingLeft: 16 } }}
        >
          <Pre>
            <code className="language-ts">{`import { z } from 'corsair'
import { procedure } from '../procedure'
import { eq } from 'drizzle-orm'

export const getAlbumById = procedure
  .input(z.object({ id: z.string() }))
  .query(async ({ input, ctx }) => {
    const [album] = await ctx.db
      .select()
      .from(ctx.db._.fullSchema.albums)
      .where(eq(ctx.db._.fullSchema.albums.id, input.id))
    
    return album
  })`}</code>
          </Pre>
        </CodeBlock>

        <h3>Mutation: Create Record</h3>
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
      release_date: z.string().optional(),
      total_tracks: z.number().optional(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const [album] = await ctx.db
      .insert(ctx.db._.fullSchema.albums)
      .values(input)
      .returning()

    return album
  })`}</code>
          </Pre>
        </CodeBlock>

        <h3>Mutation: Update Record</h3>
        <CodeBlock
          title="corsair/mutations/update-album-type.ts"
          data-line-numbers
          viewportProps={{ style: { paddingLeft: 16 } }}
        >
          <Pre>
            <code className="language-ts">{`import { procedure } from '../procedure'
import { z } from 'corsair'
import { eq } from 'drizzle-orm'

export const updateAlbumType = procedure
  .input(
    z.object({
      id: z.string(),
      album_type: z.string(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const [album] = await ctx.db
      .update(ctx.db._.fullSchema.albums)
      .set({ album_type: input.album_type })
      .where(eq(ctx.db._.fullSchema.albums.id, input.id))
      .returning()

    return album
  })`}</code>
          </Pre>
        </CodeBlock>

        <h2>Relations and Joins</h2>

        <h3>Query with Join</h3>
        <CodeBlock
          title="corsair/queries/get-album-by-id-with-artists.ts"
          data-line-numbers
          viewportProps={{ style: { paddingLeft: 16 } }}
        >
          <Pre>
            <code className="language-ts">{`import { z } from 'corsair'
import { procedure } from '../procedure'
import { eq } from 'drizzle-orm'

export const getAlbumByIdWithArtists = procedure
  .input(z.object({ id: z.string() }))
  .query(async ({ input, ctx }) => {
    const schema = ctx.db._.fullSchema
    
    const album = await ctx.db
      .select()
      .from(schema.albums)
      .where(eq(schema.albums.id, input.id))
      .leftJoin(schema.album_artists, eq(schema.albums.id, schema.album_artists.album_id))
      .leftJoin(schema.artists, eq(schema.album_artists.artist_id, schema.artists.id))
    
    return album
  })`}</code>
          </Pre>
        </CodeBlock>

        <h3>Query Multiple Relations</h3>
        <CodeBlock
          title="corsair/queries/get-albums-by-artist-id.ts"
          data-line-numbers
          viewportProps={{ style: { paddingLeft: 16 } }}
        >
          <Pre>
            <code className="language-ts">{`import { z } from 'corsair'
import { procedure } from '../procedure'
import { eq } from 'drizzle-orm'

export const getAlbumsByArtistId = procedure
  .input(z.object({ artistId: z.string() }))
  .query(async ({ input, ctx }) => {
    const schema = ctx.db._.fullSchema
    
    const albums = await ctx.db
      .select({
        id: schema.albums.id,
        name: schema.albums.name,
        album_type: schema.albums.album_type,
        release_date: schema.albums.release_date,
      })
      .from(schema.albums)
      .innerJoin(schema.album_artists, eq(schema.albums.id, schema.album_artists.album_id))
      .where(eq(schema.album_artists.artist_id, input.artistId))
    
    return albums
  })`}</code>
          </Pre>
        </CodeBlock>

        <h2>Batch Operations</h2>

        <h3>Create Multiple Records</h3>
        <CodeBlock
          title="corsair/mutations/create-albums.ts"
          data-line-numbers
          viewportProps={{ style: { paddingLeft: 16 } }}
        >
          <Pre>
            <code className="language-ts">{`import { procedure } from '../procedure'
import { z } from 'corsair'

export const createAlbums = procedure
  .input(
    z.object({
      albums: z.array(
        z.object({
          id: z.string(),
          name: z.string(),
          album_type: z.string(),
        })
      ),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const albums = await ctx.db
      .insert(ctx.db._.fullSchema.albums)
      .values(input.albums)
      .returning()

    return albums
  })`}</code>
          </Pre>
        </CodeBlock>

        <h3>Link Records (Many-to-Many)</h3>
        <CodeBlock
          title="corsair/mutations/link-album-to-artists.ts"
          data-line-numbers
          viewportProps={{ style: { paddingLeft: 16 } }}
        >
          <Pre>
            <code className="language-ts">{`import { procedure } from '../procedure'
import { z } from 'corsair'

export const linkAlbumToArtists = procedure
  .input(
    z.object({
      albumId: z.string(),
      artistIds: z.array(z.string()),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const links = input.artistIds.map((artistId) => ({
      album_id: input.albumId,
      artist_id: artistId,
    }))

    const result = await ctx.db
      .insert(ctx.db._.fullSchema.album_artists)
      .values(links)
      .returning()

    return result
  })`}</code>
          </Pre>
        </CodeBlock>

        <h2>Client Usage</h2>

        <h3>Server Component</h3>
        <CodeBlock
          title="app/page.tsx"
          data-line-numbers
          viewportProps={{ style: { paddingLeft: 16 } }}
        >
          <Pre>
            <code className="language-tsx">{`import { corsairQuery } from '@/corsair/client'
import { ArtistsAlbumsView } from '@/components/artists-albums-view'

export default async function Home() {
  const artists = await corsairQuery('get all artists', {})
  const albums = await corsairQuery('get all albums', {})

  return (
    <div className="min-h-screen p-8">
      <ArtistsAlbumsView initialArtists={artists} initialAlbums={albums} />
    </div>
  )
}`}</code>
          </Pre>
        </CodeBlock>

        <h3>Client Component with Query</h3>
        <CodeBlock
          title="components/artist-details.tsx"
          data-line-numbers
          viewportProps={{ style: { paddingLeft: 16 } }}
        >
          <Pre>
            <code className="language-tsx">{`'use client'

import { useCorsairQuery } from '@/corsair/client'

export function ArtistDetails({ artistId }: { artistId: string }) {
  const { data: albums, isLoading } = useCorsairQuery(
    'get albums by artist id',
    { artistId },
    { enabled: !!artistId }
  )

  if (isLoading) return <div>Loading...</div>

  return (
    <div>
      {albums?.map((album) => (
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

        <h3>Client Component with Mutation</h3>
        <CodeBlock
          title="components/create-album-form.tsx"
          data-line-numbers
          viewportProps={{ style: { paddingLeft: 16 } }}
        >
          <Pre>
            <code className="language-tsx">{`'use client'

import { useCorsairMutation } from '@/corsair/client'
import { useState } from 'react'

export function CreateAlbumForm() {
  const [name, setName] = useState('')
  const mutation = useCorsairMutation('create album', {
    onSuccess: (data) => {
      console.log('Album created:', data)
      setName('')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutation.mutate({
      id: crypto.randomUUID(),
      name,
      album_type: 'album',
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Album name"
      />
      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Creating...' : 'Create Album'}
      </button>
    </form>
  )
}`}</code>
          </Pre>
        </CodeBlock>

        <h2>Advanced Patterns</h2>

        <h3>Conditional Logic</h3>
        <CodeBlock
          title="corsair/mutations/toggle-track-explicit.ts"
          data-line-numbers
          viewportProps={{ style: { paddingLeft: 16 } }}
        >
          <Pre>
            <code className="language-ts">{`import { procedure } from '../procedure'
import { z } from 'corsair'
import { eq } from 'drizzle-orm'

export const toggleTrackExplicit = procedure
  .input(z.object({ trackId: z.string() }))
  .mutation(async ({ input, ctx }) => {
    const [track] = await ctx.db
      .select()
      .from(ctx.db._.fullSchema.tracks)
      .where(eq(ctx.db._.fullSchema.tracks.id, input.trackId))

    if (!track) {
      throw new Error('Track not found')
    }

    const [updated] = await ctx.db
      .update(ctx.db._.fullSchema.tracks)
      .set({ explicit: !track.explicit })
      .where(eq(ctx.db._.fullSchema.tracks.id, input.trackId))
      .returning()

    return updated
  })`}</code>
          </Pre>
        </CodeBlock>

        <h3>Optimistic Updates</h3>
        <CodeBlock
          title="components/artist-popularity.tsx"
          data-line-numbers
          viewportProps={{ style: { paddingLeft: 16 } }}
        >
          <Pre>
            <code className="language-tsx">{`'use client'

import { useCorsairMutation } from '@/corsair/client'
import { useState, useEffect } from 'react'

export function ArtistPopularity({ artist }: { artist: any }) {
  const [localPopularity, setLocalPopularity] = useState(artist.popularity)

  useEffect(() => {
    setLocalPopularity(artist.popularity)
  }, [artist.popularity])

  const mutation = useCorsairMutation('update artist popularity')

  const handleIncrease = async () => {
    const newPopularity = Math.min(100, localPopularity + 5)
    setLocalPopularity(newPopularity)

    await mutation.mutate({
      artistId: artist.id,
      popularity: newPopularity,
    })
  }

  return (
    <div>
      <span>Popularity: {localPopularity}</span>
      <button onClick={handleIncrease}>+5</button>
    </div>
  )
}`}</code>
          </Pre>
        </CodeBlock>

        <Callout type="info" title="More Examples">
          Explore the complete demo application in the repository for more patterns and 
          real-world usage examples.
        </Callout>
      </DocsBody>
    </DocsPage>
  )
}

