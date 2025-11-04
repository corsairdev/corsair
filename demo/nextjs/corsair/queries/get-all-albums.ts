import { createQuery, z } from 'corsair/core'
import { type DatabaseContext } from '../types'

const query = createQuery<DatabaseContext>()

/**
 * @description Retrieves all albums from the database
 *
 * @input
 * ```typescript
 * {}
 * ```
 *
 * @output
 * ```typescript
 * Array<{
 *   id: string
 *   name: string | null
 *   album_type: string | null
 *   release_date: string | null
 *   release_date_precision: string | null
 *   total_tracks: number | null
 *   images: unknown | null
 *   external_urls: unknown | null
 *   uri: string | null
 *   href: string | null
 * }>
 * ```
 *
 * @example
 * ```typescript
 * useCorsairQuery('get all albums', {})
 * ```
 */
export const getAllAlbums = query({
  prompt: 'get all albums',
  input_type: z.object({}),
  // response_type: z.array(drizzleZod.createSelectSchema(schema.albums)),
  dependencies: {
    tables: ['albums'],
    columns: [
      'albums.id',
      'albums.name',
      'albums.album_type',
      'albums.release_date',
      'albums.total_tracks',
      'albums.images',
    ],
  },
  handler: async (input, ctx) => {
    const albums = await ctx.db.select().from(ctx.schema.albums)
    return albums
  },
})
