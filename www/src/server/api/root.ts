import { accountRouter } from './routers/account';
import { healthRouter } from './routers/health';
import { integrationsRouter } from './routers/integrations';
import { createTRPCRouter } from './trpc';

export const appRouter = createTRPCRouter({
	account: accountRouter,
	health: healthRouter,
	integrations: integrationsRouter,
});

export type AppRouter = typeof appRouter;
