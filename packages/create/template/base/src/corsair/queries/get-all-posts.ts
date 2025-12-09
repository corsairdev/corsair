import { z } from "@corsair-ai/core";
import { procedure } from "../procedure";

export const getAllPosts = procedure
  .input(z.object({}))
  .query(async ({ input, ctx }) => {
    const posts = await ctx.db.select().from(ctx.db._.fullSchema.posts);
    return posts;
  });
