import { z } from "corsair";
import { procedure } from "../trpc/procedures";
import { drizzle } from "corsair/db/types";

export const toggleTrackExplicitssssssssssesssssssesesesesssssss = procedure
  .input(z.object({ id: z.string().min(1) }))
  .mutation(async (input, ctx) => {
    // Fetch the track by id
    const [track] = await ctx.db
      .select({
        id: ctx.schema.tracks.id,
        explicit: ctx.schema.tracks.explicit,
      })
      .from(ctx.schema.tracks)
      .where(ctx.drizzle.eq(ctx.schema.tracks.id, input.id))
      .limit(1);

    if (!track) {
      throw new Error("Track not found");
    }

    // Toggle the explicit flag
    const toggledExplicit = !track.explicit;

    // Update the track explicit value
    const [updated] = await ctx.db
      .update(ctx.schema.tracks)
      .set({ explicit: toggledExplicit })
      .where(ctx.drizzle.eq(ctx.schema.tracks.id, input.id))
      .returning({
        id: ctx.schema.tracks.id,
        explicit: ctx.schema.tracks.explicit,
      });

    if (!updated) {
      throw new Error("Failed to update track explicit value");
    }

    // Return the updated object
    return updated;
  });
