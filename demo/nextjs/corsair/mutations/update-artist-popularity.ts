import { createMutation, z } from 'corsair/core'
import { type DatabaseContext } from '../types'
import { drizzle } from 'corsair/db/types'

const mutation = createMutation<DatabaseContext>()

/**
 * @description Updates the popularity score of an artist (0-100)
 *
 * @input
 * ```typescript
 * {
 *   artistId: string
 *   popularity: number
 * }
 * ```
 *
 * @output
 * ```typescript
 * {
 *   id: string
 *   name: string | null
 *   popularity: number | null
 *   followers: number | null
 *   genres: unknown | null
 *   images: unknown | null
 *   external_urls: unknown | null
 *   uri: string | null
 *   href: string | null
 * } | null
 * ```
 *
 * @example
 * ```typescript
 * useCorsairMutation('update artist popularity', {
 *   artistId: '123',
 *   popularity: 85
 * })
 * ```
 */
export const updateArtistPopularity = mutation({
  prompt: 'update artist popularity',
  input_type: z.object({
    artistId: z.string(),
    popularity: z.number().min(0).max(100),
  }),
  // response_type: drizzleZod.createSelectSchema(schema.artists).nullable(),
  dependencies: {
    tables: ['artists'],
    columns: ['artists.id', 'artists.popularity'],
  },
  handler: async (input, ctx) => {
    const [artist] = await ctx.db
      .update(ctx.schema.artists)
      .set({
        popularity: Math.max(0, Math.min(100, input.popularity)),
      })
      .where(drizzle.eq(ctx.schema.artists.id, input.artistId))
      .returning()

    return artist || null
  },
})
