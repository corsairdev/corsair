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
import { z } from 'corsair/core'
import { mutation } from '../instances'
import { drizzle } from 'corsair/db/types'

export const toggleTrackExplicitssssssssssesssssssesesesess = mutation({
  prompt: 'toggle track explicitssssssssssesssssssesesesess',
  input_type: z.object({ id: z.string().min(1, 'Track ID is required') }),
  pseudocode:
    "1. Input: { id (string) } - the ID of the track to toggle 'explicit' on\n2. Query the database for the track with the given ID, selecting id, name, and explicit fields\n3. If the track is not found, throw an error 'Track not found'\n4. Compute the new value by negating the current 'explicit'\n5. Update the track row with the new explicit value\n6. Return the updated track's id, name, and explicit field\n7. If update fails for any reason, throw an error",
  function_name: 'toggle-track-explicit',

  handler: async (input, ctx) => {
    // Fetch the track by ID
    const [track] = await ctx.db
      .select({
        id: ctx.schema.tracks.id,
        explicit: ctx.schema.tracks.explicit,
        name: ctx.schema.tracks.name,
      })
      .from(ctx.schema.tracks)
      .where(ctx.drizzle.eq(ctx.schema.tracks.id, input.id))
      .limit(1)

    // If the track was not found, throw an error
    if (!track) {
      throw new Error('Track not found')
    }

    // Toggle the explicit field
    const updatedExplicit = !track.explicit

    // Update the track's explicit value
    const [updated] = await ctx.db
      .update(ctx.schema.tracks)
      .set({ explicit: updatedExplicit })
      .where(ctx.drizzle.eq(ctx.schema.tracks.id, input.id))
      .returning({
        id: ctx.schema.tracks.id,
        name: ctx.schema.tracks.name,
        explicit: ctx.schema.tracks.explicit,
      })

    // Safety: Should always have an updated row, unless something went wrong unexpectedly
    if (!updated) {
      throw new Error('Failed to update track explicit value')
    }

    return updated
  },
})
