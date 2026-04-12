import { channelsRouter } from './routers/channels';
import { healthRouter } from './routers/health';
import { createTRPCRouter } from './trpc';

export const appRouter: ReturnType<typeof createTRPCRouter> = createTRPCRouter({
	health: healthRouter,
	channels: channelsRouter,
});

export type AppRouter = typeof appRouter;
