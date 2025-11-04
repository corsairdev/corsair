import { z } from "corsair/core";
import { mutation } from "../instances";
import { drizzle } from "corsair/db/types";

export const toggleTrackExplicitssssssssssesssssss = mutation({
  prompt: "toggle track explicitssssssssssesssssss",
  input_type: z.object({ id: z.string().min(1, "Track ID is required") }),
  pseudocode:
    "- Input: object with `id` (the track's ID)\n- Fetch the track with this ID from the `tracks` table, selecting the `explicit` column\n- If no track is found, return null\n- Toggle the `explicit` value\n- Update the row in `tracks` to set `explicit` to the toggled value, returning the updated row\n- If the update fails, throw an error\n- Return the updated track row",
  function_name: "toggleTrackExplicit",

  handler: async (input, ctx) => {
    // 1. Fetch the current explicit value for the track by id
    const [track] = await ctx.db
      .select({
        id: ctx.schema.tracks.id,
        explicit: ctx.schema.tracks.explicit,
      })
      .from(ctx.schema.tracks)
      .where(drizzle.eq(ctx.schema.tracks.id, input.id))
      .limit(1);

    if (!track) {
      // Track not found
      return null;
    }

    // 2. Toggle the explicit value
    const newExplicit = !track.explicit;

    // 3. Update the record and return the updated row
    const [updatedTrack] = await ctx.db
      .update(ctx.schema.tracks)
      .set({ explicit: newExplicit })
      .where(drizzle.eq(ctx.schema.tracks.id, input.id))
      .returning();

    if (!updatedTrack) {
      // Should not happen, but handle gracefully
      throw new Error("Failed to update track explicitness");
    }

    // 4. Return the updated track
    return updatedTrack;
  },
});
