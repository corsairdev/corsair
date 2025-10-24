import { router, publicProcedure, protectedProcedure } from "../trpc";
import { posts, comments, likes } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { z } from "zod";

export const postsRouter = router({
  list: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.posts.findMany({
      with: {
        author: true,
        comments: {
          with: {
            author: true,
          },
        },
        likes: true,
      },
      orderBy: [desc(posts.createdAt)],
    });
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.posts.findFirst({
        where: eq(posts.id, input.id),
        with: {
          author: true,
          comments: {
            with: {
              author: true,
            },
            orderBy: [desc(comments.createdAt)],
          },
          likes: true,
        },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1).max(255),
        content: z.string().min(1),
        published: z.boolean().default(false),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [post] = await ctx.db
        .insert(posts)
        .values({
          title: input.title,
          content: input.content,
          published: input.published,
          authorId: ctx.user.id,
        })
        .returning();

      return post;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        title: z.string().min(1).max(255).optional(),
        content: z.string().min(1).optional(),
        published: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      const [post] = await ctx.db
        .update(posts)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(posts.id, id))
        .returning();

      return post;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(posts).where(eq(posts.id, input.id));
      return { success: true };
    }),

  addComment: protectedProcedure
    .input(
      z.object({
        postId: z.string().uuid(),
        content: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const [comment] = await ctx.db
        .insert(comments)
        .values({
          postId: input.postId,
          content: input.content,
          authorId: ctx.user.id,
        })
        .returning();

      return comment;
    }),

  toggleLike: protectedProcedure
    .input(z.object({ postId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.query.likes.findFirst({
        where: (likes, { and, eq }) =>
          and(eq(likes.postId, input.postId), eq(likes.userId, ctx.user.id)),
      });

      if (existing) {
        await ctx.db.delete(likes).where(eq(likes.id, existing.id));
        return { liked: false };
      } else {
        await ctx.db.insert(likes).values({
          postId: input.postId,
          userId: ctx.user.id,
        });
        return { liked: true };
      }
    }),
});
