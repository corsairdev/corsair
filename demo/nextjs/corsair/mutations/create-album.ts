import { createMutation } from 'corsair/core'
import { schema, type DatabaseContext } from '../types'

const mutation = createMutation<DatabaseContext>()

/**
 * @description Creates a new album in the database
 *
 * @input
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
 * }
 * ```
 *
 * @example
 * ```typescript
 * useCorsairMutation('create album', {
 *   id: 'album123',
 *   name: 'My Album',
 *   album_type: 'album',
 *   release_date: '2023-01-01',
 *   total_tracks: 12
 * })
 * ```
 */
export const createAlbum = mutation({
  prompt: 'create album',
  input_type: schema.albums._.inferInsert,
  // response_type: drizzleZod.createSelectSchema(schema.albums),
  dependencies: {
    tables: ['albums'],
    columns: [
      'albums.id',
      'albums.name',
      'albums.album_type',
      'albums.release_date',
      'albums.total_tracks',
    ],
  },
  handler: async (input, ctx) => {
    const [album] = await ctx.db
      .insert(ctx.schema.albums)
      .values({ ...input })
      .returning()

    return album
  },
})
