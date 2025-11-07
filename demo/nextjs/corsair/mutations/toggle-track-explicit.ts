import { z } from 'corsair'
import { procedure } from '../trpc/procedures'
import { drizzle } from 'corsair/db/types'

export const toggleTrackExplicit = procedure
  .input(
    z.object({
      trackId: z.string(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const [currentTrack] = await ctx.db
      .select()
      .from(ctx.schema.tracks)
      .where(drizzle.eq(ctx.schema.tracks.id, input.trackId))
      .limit(1)

    if (!currentTrack) {
      return null
    }

    const [track] = await ctx.db
      .update(ctx.schema.tracks)
      .set({
        explicit: !currentTrack.explicit,
      })
      .where(drizzle.eq(ctx.schema.tracks.id, input.trackId))
      .returning()

    return track || null
  })
