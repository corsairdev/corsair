import { z } from "corsair/core";
import { mutation } from "../instances";
import { drizzle } from "corsair/db/types";

export const toggleTrackExplicitssssssssssessssssseseses = mutation({
  prompt: "toggle track explicitssssssssssessssssseseses",
  input_type: z.object({ id: z.string().min(1, "Track id is required") }),
  pseudocode:
    "1. Receive input: object with field 'id' (track id string).\n2. Query the 'tracks' table for a track with the given id. Limit 1 for performance.\n3. If no track is found, throw an error ('Track not found').\n4. Get the current value of the 'explicit' field from the track.\n5. Toggle its value (i.e., if true, make false, and vice versa).\n6. Update the 'tracks' record for that id, setting 'explicit' to the new value. Use Drizzle's update + where + returning (returns updated track).\n7. Return the updated track object.",
  function_name: "toggleTrackExplicit",

  handler: async (input, ctx) => {
    // Find the track by id
    const [track] = await ctx.db
      .select()
      .from(ctx.schema.tracks)
      .where(ctx.drizzle.eq(ctx.schema.tracks.id, input.id))
      .limit(1);

    // If the track does not exist, throw an error or return null
    if (!track) {
      throw new Error("Track not found");
    }

    // Toggle the "explicit" field
    const toggledExplicit = !track.explicit;

    // Update the track's "explicit" field
    const [updatedTrack] = await ctx.db
      .update(ctx.schema.tracks)
      .set({ explicit: toggledExplicit })
      .where(ctx.drizzle.eq(ctx.schema.tracks.id, input.id))
      .returning();

    // Return the updated track record
    return updatedTrack;
  },
});
