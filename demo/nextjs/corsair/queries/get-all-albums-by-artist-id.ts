import { createQuery, z } from 'corsair/core'
import { type DatabaseContext } from '../types'
import { drizzle } from 'corsair/db/types'

const query = createQuery<DatabaseContext>()

/**
 * @description Retrieves all albums by artist ID with join data
 *
 * @input
 * ```typescript
 * {
 *   artistId: string
 * }
 * ```
 *
 * @output
 * ```typescript
 * Array<{
 *   albums: {
 *     id: string
 *     name: string | null
 *     album_type: string | null
 *     release_date: string | null
 *     total_tracks: number | null
 *     images: unknown | null
 *   }
 *   album_artists: {
 *     album_id: string
 *     artist_id: string
 *   }
 * }>
 * ```
 *
 * @example
 * ```typescript
 * useCorsairQuery('get all albums by artist id', {
 *   artistId: 'artist123'
 * })
 * ```
 */
export const getAllAlbumsByArtistId = query({
  prompt: 'get all albums by artist id',
  input_type: z.object({
    artistId: z.string(),
  }),
  dependencies: {
    tables: ['albums', 'album_artists', 'artists'],
    columns: [
      'albums.id',
      'albums.name',
      'albums.album_type',
      'albums.release_date',
      'albums.total_tracks',
      'albums.images',
      'album_artists.artist_id',
      'album_artists.album_id',
      'artists.id',
      'artists.name',
      'artists.popularity',
      'artists.followers',
      'artists.genres',
      'artists.images',
    ],
  },
  handler: async (input, ctx) => {
    const albumsByArtistId = await ctx.db
      .select()
      .from(ctx.schema.albums)
      .innerJoin(
        ctx.schema.album_artists,
        drizzle.eq(ctx.schema.albums.id, ctx.schema.album_artists.album_id)
      )
      .where(drizzle.eq(ctx.schema.album_artists.artist_id, input.artistId))

    return albumsByArtistId
  },
})
