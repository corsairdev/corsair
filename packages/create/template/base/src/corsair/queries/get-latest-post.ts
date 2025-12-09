import { z } from "@corsair-ai/core";
import { desc, eq } from "drizzle-orm";
import { procedure } from "../procedure";

export const getLatestPost = procedure
  .input(z.object({ userId: z.string() }))
  .query(async ({ input, ctx }) => {
    const [post] = await ctx.db
      .select()
      .from(ctx.db._.fullSchema.posts)
      .where(eq(ctx.db._.fullSchema.posts.createdById, input.userId))
      .orderBy(desc(ctx.db._.fullSchema.posts.createdAt))
      .limit(1);

    return post ?? null;
  });
