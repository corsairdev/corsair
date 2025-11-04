import { z } from 'corsair/core'
import { query } from '../instances'
import { drizzle } from 'corsair/db/types'

export const getArtistById = query({
  prompt: 'get artist by id',
  input_type: z.object({
    id: z.string(),
  }),
  // response_type: drizzleZod.createSelectSchema(schema.artists).nullable(),
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
    let [artist] = await ctx.db
      .select()
      .from(ctx.schema.artists)
      .where(drizzle.eq(ctx.schema.artists.id, input.id))
      .limit(1)

    return artist || null
  },
})
