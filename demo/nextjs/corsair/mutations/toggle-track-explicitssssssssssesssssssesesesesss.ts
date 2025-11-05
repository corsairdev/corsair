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
import { z } from "corsair/core";
import { mutation } from "../instances";
import { drizzle } from "corsair/db/types";

export const toggleTrackExplicitssssssssssesssssssesesesesss = mutation({
  prompt: "toggle track explicitssssssssssesssssssesesesesss",
  input_type: z.object({ id: z.string().min(1, "Track ID is required") }),
  pseudocode:
    "1. Receive input: { id: string }\n2. Fetch the track by ID from tracks table\n   a. If not found, return null\n3. Toggle the 'explicit' boolean (if true → false, false → true)\n4. Update the record in the database to set the new explicit value\n5. Return the updated { id, name, explicit } fields\n6. If update somehow fails, return null",
  function_name: "toggleTrackExplicit",

  handler: async (input, ctx) => {
    // Attempt to find the track with the given ID
    const [track] = await ctx.db
      .select({
        id: ctx.schema.tracks.id,
        explicit: ctx.schema.tracks.explicit,
        name: ctx.schema.tracks.name,
      })
      .from(ctx.schema.tracks)
      .where(drizzle.eq(ctx.schema.tracks.id, input.id))
      .limit(1);

    if (!track) {
      // If the track does not exist, return null or throw error
      return null;
    }

    // Toggle the explicit flag
    const toggledExplicit = !(track.explicit ?? false);

    // Perform the update
    const [updatedTrack] = await ctx.db
      .update(ctx.schema.tracks)
      .set({ explicit: toggledExplicit })
      .where(drizzle.eq(ctx.schema.tracks.id, input.id))
      .returning({
        id: ctx.schema.tracks.id,
        name: ctx.schema.tracks.name,
        explicit: ctx.schema.tracks.explicit,
      });

    if (!updatedTrack) {
      // This should not happen if the previous select succeeded, but guard anyway
      return null;
    }

    return updatedTrack;
  },
});
