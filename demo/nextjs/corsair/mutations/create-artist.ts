import { createMutation, z } from 'corsair/core'
import { type DatabaseContext } from '../types'

const mutation = createMutation<DatabaseContext>()

/**
 * @description Creates a new artist in the database
 *
 * @input
 * ```typescript
 * {
 *   id: string
 *   name: string
 *   popularity?: number
 *   followers?: number
 *   genres?: string[]
 *   images?: any
 *   external_urls?: any
 *   uri?: string
 *   href?: string
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
 * }
 * ```
 *
 * @example
 * ```typescript
 * useCorsairMutation('create artist', {
 *   id: 'artist123',
 *   name: 'John Doe',
 *   popularity: 75,
 *   followers: 1000000,
 *   genres: ['rock', 'pop']
 * })
 * ```
 */
export const createArtist = mutation({
  prompt: 'create artist',
  input_type: z.object({
    id: z.string(),
    name: z.string(),
    popularity: z.number().min(0).max(100).optional(),
    followers: z.number().optional(),
    genres: z.array(z.string()).optional(),
    images: z.any().optional(),
    external_urls: z.any().optional(),
    uri: z.string().optional(),
    href: z.string().optional(),
  }),
  // response_type: drizzleZod.createSelectSchema(schema.artists),
  dependencies: {
    tables: ['artists'],
    columns: [
      'artists.id',
      'artists.name',
      'artists.popularity',
      'artists.followers',
      'artists.genres',
    ],
  },
  handler: async (input, ctx) => {
    const [artist] = await ctx.db
      .insert(ctx.schema.artists)
      .values({
        id: input.id,
        name: input.name,
        popularity: input.popularity || 0,
        followers: input.followers || 0,
        genres: input.genres,
        images: input.images,
        external_urls: input.external_urls,
        uri: input.uri || '',
        href: input.href || '',
      })
      .returning()

    return artist
  },
})
