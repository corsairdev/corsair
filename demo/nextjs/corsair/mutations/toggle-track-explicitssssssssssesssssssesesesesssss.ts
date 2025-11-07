/**
     * @presudo - Input: { id (string) }
- Fetch the track with the given ID
- If not found, return null
- Compute new explicit value by negating the existing one
- Update track's 'explicit' field in database
- Return the updated record (or null on failure)

     * @input_type z.object({ id: z.string(), })
     */
import { z } from 'corsair'
import { procedure } from '../trpc/procedures'
import { drizzle } from 'corsair/db/types'

export const toggleTrackExplicitssssssssssesssssssesesesesssss = procedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ input, ctx }) => {
    const [track] = await ctx.db
      .select({
        id: ctx.schema.tracks.id,
        explicit: ctx.schema.tracks.explicit,
        name: ctx.schema.tracks.name,
      })
      .from(ctx.schema.tracks)
      .where(drizzle.eq(ctx.schema.tracks.id, input.id))
      .limit(1)

    if (!track) {
      return null
    }

    const newExplicit = !track.explicit

    const [updated] = await ctx.db
      .update(ctx.schema.tracks)
      .set({ explicit: newExplicit })
      .where(drizzle.eq(ctx.schema.tracks.id, input.id))
      .returning()

    return updated || null
  })
