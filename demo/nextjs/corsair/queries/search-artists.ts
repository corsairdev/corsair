import { createQuery, z } from 'corsair/core'
import { type DatabaseContext } from '../types'
import { drizzle } from 'corsair/db/types'

const query = createQuery<DatabaseContext>()

/**
 * @description Searches for artists by name (case-insensitive)
 *
 * @input
 * ```typescript
 * {
 *   query: string
 * }
 * ```
 *
 * @output
 * ```typescript
 * Array<{
 *   id: string
 *   name: string | null
 *   popularity: number | null
 *   followers: number | null
 *   genres: unknown | null
 *   images: unknown | null
 *   external_urls: unknown | null
 *   uri: string | null
 *   href: string | null
 * }>
 * ```
 *
 * @example
 * ```typescript
 * useCorsairQuery('search artists', {
 *   query: 'Beatles'
 * })
 * ```
 */
export const searchArtists = query({
  prompt: 'search artists',
  input_type: z.object({
    query: z.string(),
  }),
  // response_type: z.array(drizzleZod.createSelectSchema(schema.artists)),
  dependencies: {
    tables: ['artists'],
    columns: [
      'artists.id',
      'artists.name',
      'artists.popularity',
      'artists.followers',
      'artists.genres',
      'artists.images',
    ],
  },
  handler: async (input, ctx) => {
    const artists = await ctx.db
      .select()
      .from(ctx.schema.artists)
      .where(drizzle.ilike(ctx.schema.artists.name, `%${input.query}%`))

    return artists
  },
})
