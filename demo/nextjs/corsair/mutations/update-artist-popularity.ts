import { z } from 'corsair/core'
import { mutation } from '../instances'
import { drizzle } from 'corsair/db/types'

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
