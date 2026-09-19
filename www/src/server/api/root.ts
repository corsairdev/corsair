import { accountRouter } from './routers/account';
import { adminRouter } from './routers/admin';
import { contactRouter } from './routers/contact';
import { contributorsRouter } from './routers/contributors';
import { healthRouter } from './routers/health';
import { integrationsRouter } from './routers/integrations';
import { createTRPCRouter } from './trpc';

export const appRouter = createTRPCRouter({
	account: accountRouter,
	admin: adminRouter,
	contact: contactRouter,
	contributors: contributorsRouter,
	health: healthRouter,
	integrations: integrationsRouter,
});

export type AppRouter = typeof appRouter;
