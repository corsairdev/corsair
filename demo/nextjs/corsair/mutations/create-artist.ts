import { z } from 'corsair/core'
import { mutation } from '../instances'

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
