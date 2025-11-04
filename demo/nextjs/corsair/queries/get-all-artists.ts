import { z } from 'corsair/core'
import { query } from '../instances'

export const getAllArtists = query({
  prompt: 'get all artists',
  input_type: z.object({}),
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
    const artists = await ctx.db.select().from(ctx.schema.artists)
    return artists
  },
})
