import { z } from "@corsair-ai/core";
import { eq } from "drizzle-orm";
import { procedure } from "../procedure";

export const getPostById = procedure
  .input(z.object({ id: z.number() }))
  .query(async ({ input, ctx }) => {
    const [post] = await ctx.db
      .select()
      .from(ctx.db._.fullSchema.posts)
      .where(eq(ctx.db._.fullSchema.posts.id, input.id));
    return post ?? null;
  });
