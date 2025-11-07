import { z } from 'corsair'
import { procedure } from '../trpc/procedures'
import { drizzle } from 'corsair/db/types'

export const toggleTrackExplicitssssssssssessssssseseses = procedure
  .input(z.object({ id: z.string().min(1, 'Track id is required') }))
  .mutation(async ({ input, ctx }) => {
    const [track] = await ctx.db
      .select()
      .from(ctx.schema.tracks)
      .where(drizzle.eq(ctx.schema.tracks.id, input.id))
      .limit(1)

    if (!track) {
      throw new Error('Track not found')
    }

    const toggledExplicit = !track.explicit

    const [updatedTrack] = await ctx.db
      .update(ctx.schema.tracks)
      .set({ explicit: toggledExplicit })
      .where(drizzle.eq(ctx.schema.tracks.id, input.id))
      .returning()

    return updatedTrack
  })
