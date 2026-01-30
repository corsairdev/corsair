import { eventsRouter } from '@/server/api/routers/events';
import { healthRouter } from '@/server/api/routers/health';
import { createTRPCRouter } from '@/server/api/trpc';

export const appRouter = createTRPCRouter({
	health: healthRouter,
	events: eventsRouter,
});

export type AppRouter = typeof appRouter;
