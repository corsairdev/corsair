import { router } from "./trpc";
import { postsRouter } from "./routers/posts";
import { usersRouter } from "./routers/users";

export const appRouter = router({
  posts: postsRouter,
  users: usersRouter,
});

export type AppRouter = typeof appRouter;
