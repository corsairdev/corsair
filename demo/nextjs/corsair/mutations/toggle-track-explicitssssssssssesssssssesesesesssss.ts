/**
     * @presudo - Input: { id (string) }
- Fetch the track with the given ID
- If not found, return null
- Compute new explicit value by negating the existing one
- Update track's 'explicit' field in database
- Return the updated record (or null on failure)

     * @input_type z.object({ id: z.string(), })
     */
import { z } from "corsair/core";
import { mutation } from "../instances";
import { drizzle } from "corsair/db/types";

export const toggleTrackExplicitssssssssssesssssssesesesesssss = mutation({
  prompt: "toggle track explicitssssssssssesssssssesesesesssss",
  input_type: z.object({ id: z.string() }),
  pseudocode:
    "- Input: { id (string) }\n- Fetch the track with the given ID\n- If not found, return null\n- Compute new explicit value by negating the existing one\n- Update track's 'explicit' field in database\n- Return the updated record (or null on failure)\n",
  function_name: "toggle-track-explicit",

  handler: async (input, ctx) => {
    // 1. Find the track by ID
    const [track] = await ctx.db
      .select({
        id: ctx.schema.tracks.id,
        explicit: ctx.schema.tracks.explicit,
        name: ctx.schema.tracks.name,
      })
      .from(ctx.schema.tracks)
      .where(drizzle.eq(ctx.schema.tracks.id, input.id))
      .limit(1);

    // 2. If track does not exist, return null
    if (!track) {
      return null;
    }

    // 3. Toggle the 'explicit' field
    const newExplicit = !track.explicit;

    // 4. Update the track and return the updated record
    const [updated] = await ctx.db
      .update(ctx.schema.tracks)
      .set({ explicit: newExplicit })
      .where(drizzle.eq(ctx.schema.tracks.id, input.id))
      .returning();

    // 5. Return the updated track or null if not found
    return updated || null;
  },
});
