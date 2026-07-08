import { accountRouter } from './routers/account';
import { adminRouter } from './routers/admin';
import { contributorsRouter } from './routers/contributors';
import { healthRouter } from './routers/health';
import { integrationsRouter } from './routers/integrations';
import { createTRPCRouter } from './trpc';

export const appRouter = createTRPCRouter({
	account: accountRouter,
	admin: adminRouter,
	contributors: contributorsRouter,
	health: healthRouter,
	integrations: integrationsRouter,
});

export type AppRouter = typeof appRouter;
