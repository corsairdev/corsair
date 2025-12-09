import { z } from "@corsair-ai/core";
import { procedure } from "../procedure";

export const createPost = procedure
  .input(
    z.object({
      name: z.string().min(1),
      createdById: z.string(),
    }),
  )
  .mutation(async ({ input, ctx }) => {
    const [post] = await ctx.db
      .insert(ctx.db._.fullSchema.posts)
      .values({
        name: input.name,
        createdById: input.createdById,
      })
      .returning();

    return post;
  });
