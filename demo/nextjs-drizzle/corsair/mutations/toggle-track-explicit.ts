import { z } from 'corsair'
import { procedure } from '../procedure'
import { eq } from 'drizzle-orm'

export const toggleTrackExplicit = procedure
  .input(
    z.object({
      trackId: z.string(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const [currentTrack] = await ctx.db
      .select()
      .from(ctx.db._.fullSchema.tracks)
      .where(eq(ctx.db._.fullSchema.tracks.id, input.trackId))
      .limit(1)

    if (!currentTrack) {
      return null
    }

    const [track] = await ctx.db
      .update(ctx.db._.fullSchema.tracks)
      .set({
        explicit: !currentTrack.explicit,
      })
      .where(eq(ctx.db._.fullSchema.tracks.id, input.trackId))
      .returning()

    return track || null
  })
