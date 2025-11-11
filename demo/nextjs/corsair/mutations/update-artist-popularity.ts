import { z } from 'corsair'
import { procedure } from '../trpc'

import { eq } from 'drizzle-orm'

export const updateArtistPopularity = procedure
  .input(
    z.object({
      artistId: z.string(),
      popularity: z.number().min(0).max(100),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const [artist] = await ctx.db
      .update(ctx.db._.fullSchema.artists)
      .set({
        popularity: Math.max(0, Math.min(100, input.popularity)),
      })
      .where(eq(ctx.schema.artists.columns.id, input.artistId))
      .returning()

    return artist || null
  })
