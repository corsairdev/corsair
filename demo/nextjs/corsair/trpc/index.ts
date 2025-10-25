import { router, action } from "corsair/trpc/server";
import { z } from "corsair/core";

export const corsairRouter = router({
  "hello there": action
    .input(z.object({ name: z.string() }))
    .query(async ({ input }) => {
      return "Hello, world!";
    }),
  "test mutation": action.mutation(async () => {
    return "Test";
  }),
});

export type CorsairRouter = typeof corsairRouter;
