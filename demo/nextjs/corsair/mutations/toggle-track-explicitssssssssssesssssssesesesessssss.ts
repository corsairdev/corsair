/**
     * @presudo - Input: { id: string }
- Retrieve the track by id from the tracks table
- If track is not found, throw an error
- Toggle the 'explicit' column (true -> false, false -> true)
- Update the track row in the database with the new value
- Return the updated track row (or throw error if update fails)
     * @input_type z.object({ id: z.string().min(1, 'Track id is required') })
     */
import { z } from "corsair/core";
import { mutation } from "../instances";
import { drizzle } from "corsair/db/types";

export const toggleTrackExplicitssssssssssesssssssesesesessssss = mutation({
  prompt: "toggle track explicitssssssssssesssssssesesesessssss",
  input_type: z.object({ id: z.string().min(1, "Track id is required") }),
  pseudocode:
    "- Input: { id: string }\n- Retrieve the track by id from the tracks table\n- If track is not found, throw an error\n- Toggle the 'explicit' column (true -> false, false -> true)\n- Update the track row in the database with the new value\n- Return the updated track row (or throw error if update fails)",
  function_name: "toggleTrackExplicit",

  handler: async (input, ctx) => {
    // Step 1: Retrieve the track by id
    const [track] = await ctx.db
      .select()
      .from(ctx.schema.tracks)
      .where(ctx.drizzle.eq(ctx.schema.tracks.id, input.id))
      .limit(1);

    if (!track) {
      throw new Error(`Track with id ${input.id} not found`);
    }

    // Step 2: Toggle the 'explicit' boolean
    const toggledExplicit = !track.explicit;

    // Step 3: Update the track
    const [updatedTrack] = await ctx.db
      .update(ctx.schema.tracks)
      .set({ explicit: toggledExplicit })
      .where(ctx.drizzle.eq(ctx.schema.tracks.id, input.id))
      .returning();

    if (!updatedTrack) {
      throw new Error("Failed to update track explicit flag");
    }

    return updatedTrack;
  },
});
