/**
     * @presudo 1. Input: { id (string) } - the ID of the track to toggle 'explicit' on
2. Query the database for the track with the given ID, selecting id, name, and explicit fields
3. If the track is not found, throw an error 'Track not found'
4. Compute the new value by negating the current 'explicit'
5. Update the track row with the new explicit value
6. Return the updated track's id, name, and explicit field
7. If update fails for any reason, throw an error
     * @input_type z.object({ id: z.string().min(1, 'Track ID is required') })
     */
import { z } from 'corsair'
import { procedure } from '../trpc/procedures'
import { drizzle } from 'corsair/db/types'

export const toggleTrackExplicitssssssssssesssssssesesesess = procedure
  .input(z.object({ id: z.string().min(1, 'Track ID is required') }))
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
      throw new Error('Track not found')
    }

    const updatedExplicit = !track.explicit

    const [updated] = await ctx.db
      .update(ctx.schema.tracks)
      .set({ explicit: updatedExplicit })
      .where(drizzle.eq(ctx.schema.tracks.id, input.id))
      .returning({
        id: ctx.schema.tracks.id,
        name: ctx.schema.tracks.name,
        explicit: ctx.schema.tracks.explicit,
      })

    if (!updated) {
      throw new Error('Failed to update track explicit value')
    }

    return updated
  })
