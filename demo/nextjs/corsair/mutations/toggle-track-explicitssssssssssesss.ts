import { z } from 'corsair'
import { procedure } from '../trpc/procedures'
import { drizzle } from 'corsair/db/types'

export const toggleTrackExplicitssssssssssesss = procedure
  .input(z.object({ trackId: z.string().min(1) }))
  .mutation(async ({ input, ctx }) => {
    const [track] = await ctx.db
      .select({
        id: ctx.schema.tracks.id,
        explicit: ctx.schema.tracks.explicit,
      })
      .from(ctx.schema.tracks)
      .where(drizzle.eq(ctx.schema.tracks.id, input.trackId))
      .limit(1)

    if (!track) {
      return null
    }

    const newExplicit = !track.explicit

    const [updatedTrack] = await ctx.db
      .update(ctx.schema.tracks)
      .set({ explicit: newExplicit })
      .where(drizzle.eq(ctx.schema.tracks.id, input.trackId))
      .returning()

    if (!updatedTrack) {
      return null
    }

    return updatedTrack
  })
