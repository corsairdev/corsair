/**
     * @presudo 1. Receive input: { id: string }
2. Fetch the track by ID from tracks table
   a. If not found, return null
3. Toggle the 'explicit' boolean (if true → false, false → true)
4. Update the record in the database to set the new explicit value
5. Return the updated { id, name, explicit } fields
6. If update somehow fails, return null
     * @input_type z.object({ id: z.string().min(1, 'Track ID is required') })
     */
import { z } from 'corsair'
import { procedure } from '../trpc/procedures'
import { drizzle } from 'corsair/db/types'

export const toggleTrackExplicitssssssssssesssssssesesesesss = procedure
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
      return null
    }

    const toggledExplicit = !(track.explicit ?? false)

    const [updatedTrack] = await ctx.db
      .update(ctx.schema.tracks)
      .set({ explicit: toggledExplicit })
      .where(drizzle.eq(ctx.schema.tracks.id, input.id))
      .returning({
        id: ctx.schema.tracks.id,
        name: ctx.schema.tracks.name,
        explicit: ctx.schema.tracks.explicit,
      })

    if (!updatedTrack) {
      return null
    }

    return updatedTrack
  })
