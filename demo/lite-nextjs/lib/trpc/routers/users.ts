import { router, publicProcedure, protectedProcedure } from "../trpc";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const usersRouter = router({
  me: protectedProcedure.query(async ({ ctx }) => {
    return ctx.user;
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.users.findFirst({
        where: eq(users.id, input.id),
        with: {
          posts: {
            with: {
              comments: true,
              likes: true,
            },
          },
        },
      });
    }),
});
