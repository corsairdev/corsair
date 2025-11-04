import { createMutation, z } from 'corsair/core'
import { type DatabaseContext } from '../types'
import { drizzle } from 'corsair/db/types'

const mutation = createMutation<DatabaseContext>()

/**
 * @description Updates the album type (e.g., album, single, compilation)
 *
 * @input
 * ```typescript
 * {
 *   albumId: string
 *   albumType: string
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
 * useCorsairMutation('update album type', {
 *   albumId: '123',
 *   albumType: 'compilation'
 * })
 * ```
 */
export const updateAlbumType = mutation({
  prompt: 'update album type',
  input_type: z.object({
    albumId: z.string(),
    albumType: z.string(),
  }),
  // response_type: drizzleZod.createSelectSchema(schema.albums).nullable(),
  dependencies: {
    tables: ['albums'],
    columns: ['albums.id', 'albums.album_type'],
  },
  handler: async (input, ctx) => {
    const [album] = await ctx.db
      .update(ctx.schema.albums)
      .set({
        album_type: input.albumType,
      })
      .where(drizzle.eq(ctx.schema.albums.id, input.albumId))
      .returning()

    return album || null
  },
})
