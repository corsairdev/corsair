import { createQuery, z } from 'corsair/core'
import { type DatabaseContext } from '../types'
import { drizzle } from 'corsair/db/types'

const query = createQuery<DatabaseContext>()

/**
 * @description Retrieves a single album by ID
 *
 * @input
 * ```typescript
 * {
 *   id: string
 * }
 * ```
 *
 * @output
 * ```typescript
 * {
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
 * } | null
 * ```
 *
 * @example
 * ```typescript
 * useCorsairQuery('get album by id', {
 *   id: 'album123'
 * })
 * ```
 */
export const getAlbumById = query({
  prompt: 'get album by id',
  input_type: z.object({
    id: z.string(),
  }),
  // response_type: drizzleZod.createSelectSchema(schema.albums).nullable(),
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
    const [album] = await ctx.db
      .select()
      .from(ctx.schema.albums)
      .where(drizzle.eq(ctx.schema.albums.id, input.id))
      .limit(1)

    return album || null
  },
})
