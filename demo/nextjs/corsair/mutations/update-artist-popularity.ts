import { z } from 'corsair'
import { procedure } from '../trpc/procedures'
import { drizzle } from 'corsair/db/types'

export const updateArtistPopularity = procedure
  .input(
    z.object({
      artistId: z.string(),
      popularity: z.number().min(0).max(100),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const [artist] = await ctx.db
      .update(ctx.schema.artists)
      .set({
        popularity: Math.max(0, Math.min(100, input.popularity)),
      })
      .where(drizzle.eq(ctx.schema.artists.id, input.artistId))
      .returning()

    return artist || null
  })
