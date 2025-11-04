import { createMutation } from 'corsair/core'
import { schema, type DatabaseContext } from '../types'
import { drizzle } from 'corsair/db/types'

const mutation = createMutation<DatabaseContext>()

/**
 * @description Creates multiple albums and links them to artists
 *
 * @input
 * ```typescript
 * {
 *   albums: Array<{
 *     id: string
 *     name: string
 *     album_type: string
 *     release_date: string
 *     total_tracks: number
 *     artist_ids: string[]
 *   }>
 * }
 * ```
 *
 * @output
 * ```typescript
 * Array<{
 *   id: string
 *   name: string | null
 *   album_type: string | null
 *   release_date: string | null
 *   total_tracks: number | null
 *   images: unknown | null
 * }>
 * ```
 *
 * @example
 * ```typescript
 * useCorsairMutation('create albums', {
 *   albums: [{
 *     id: 'album1',
 *     name: 'Album 1',
 *     album_type: 'album',
 *     release_date: '2023-01-01',
 *     total_tracks: 10,
 *     artist_ids: ['artist1', 'artist2']
 *   }]
 * })
 * ```
 */
export const createAlbums = mutation({
  prompt: 'create albums',
  input_type: schema.albums._.inferInsert,
  handler: async (input, ctx) => {
    // Validate that all referenced artist_ids exist
    const allArtistIds = [...new Set(input.albums.flatMap(a => a.artist_ids))]
    if (allArtistIds.length > 0) {
      const existingArtists = await ctx.db
        .select({ id: ctx.schema.artists.id })
        .from(ctx.schema.artists)
        .where(drizzle.inArray(ctx.schema.artists.id, allArtistIds))
      const foundArtistIds = new Set(existingArtists.map(a => a.id))
      const missingIds = allArtistIds.filter(id => !foundArtistIds.has(id))
      if (missingIds.length > 0) {
        throw new Error(
          `Some artist_ids do not exist: ${missingIds.join(', ')}`
        )
      }
    }

    // Insert albums and create album_artists relationships
    const createdAlbums = []
    for (const album of input.albums) {
      // Insert album
      const [insertedAlbum] = await ctx.db
        .insert(ctx.schema.albums)
        .values({
          id: album.id,
          name: album.name,
          album_type: album.album_type,
          release_date: album.release_date,
          release_date_precision: album.release_date_precision,
          total_tracks: album.total_tracks,
          images: album.images,
          external_urls: album.external_urls,
          uri: album.uri,
          href: album.href,
        })
        .onConflictDoNothing()
        .returning()
      if (!insertedAlbum) {
        // Album with this id already exists: safe to continue or throw?
        throw new Error(`Album with id '${album.id}' already exists.`)
      }

      // Insert into album_artists
      for (const artist_id of album.artist_ids) {
        await ctx.db
          .insert(ctx.schema.album_artists)
          .values({
            album_id: album.id,
            artist_id: artist_id,
          })
          .onConflictDoNothing()
      }
      createdAlbums.push(insertedAlbum)
    }
    return createdAlbums
  },
})
