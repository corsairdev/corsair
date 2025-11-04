import { createMutation, z } from "corsair/core";
import { type DatabaseContext } from "../types";
import { drizzle } from "corsair/db/types";

const mutation = createMutation<DatabaseContext>();

export const toggleTrackExplicitssssssssssesss = mutation({
  prompt: "toggle track explicitssssssssssesss",
  input_type: z.object({ trackId: z.string().min(1) }),
  pseudocode:
    "- Input: trackId (string)\n- Fetch the track by ID from the tracks table\n- If no track found, return null\n- Otherwise, invert the value of its explicit field\n- Update the track's explicit field in the database\n- Return the full updated track object\n- If, after update, no row is returned, return null",
  function_name: "toggle-track-explicit",

  handler: async (input, ctx) => {
    // Retrieve the track by id
    const [track] = await ctx.db
      .select({
        id: ctx.schema.tracks.id,
        explicit: ctx.schema.tracks.explicit,
      })
      .from(ctx.schema.tracks)
      .where(ctx.drizzle.eq(ctx.schema.tracks.id, input.trackId))
      .limit(1);

    if (!track) {
      // Track not found; return null or throw error
      return null;
    }

    // Toggle the 'explicit' property
    const newExplicit = !track.explicit;

    // Update the track
    const [updatedTrack] = await ctx.db
      .update(ctx.schema.tracks)
      .set({ explicit: newExplicit })
      .where(ctx.drizzle.eq(ctx.schema.tracks.id, input.trackId))
      .returning();

    // Should always return 1 row; if not, something went wrong
    if (!updatedTrack) {
      // This situation should be rare, but handle just in case
      return null;
    }

    // Return updated row (all columns)
    return updatedTrack;
  },
});
