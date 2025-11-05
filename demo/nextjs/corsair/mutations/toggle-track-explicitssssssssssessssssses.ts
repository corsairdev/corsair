import { z } from "corsair/core";
import { mutation } from "../instances";
import { drizzle } from "corsair/db/types";

export const toggleTrackExplicitssssssssssessssssses = mutation({
  prompt: "toggle track explicitssssssssssessssssses",
  input_type: z.object({ id: z.string().min(1, "Track ID is required") }),
  pseudocode:
    "- Input: { id: string } (track ID) \n- Step 1: Find the track with the given ID in the tracks table. \n  - If no track found, throw an error. \n- Step 2: Compute new value for 'explicit' (negate current value). \n- Step 3: Update the track's 'explicit' field to the new value in the database, and return the updated row. \n- Output: The updated track row, or null.",
  function_name: "toggle-track-explicit",

  handler: async (input, ctx) => {
    // Find the track by ID
    const [track] = await ctx.db
      .select()
      .from(ctx.schema.tracks)
      .where(drizzle.eq(ctx.schema.tracks.id, input.id))
      .limit(1);

    if (!track) {
      throw new Error("Track not found");
    }

    // Toggle the explicit field
    const newExplicit = !track.explicit;

    // Update the track in the database
    const [updatedTrack] = await ctx.db
      .update(ctx.schema.tracks)
      .set({ explicit: newExplicit })
      .where(drizzle.eq(ctx.schema.tracks.id, input.id))
      .returning();

    return updatedTrack ?? null;
  },
});
