import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';

import type { AppRouter } from '@/server/api/root';

export const trpcBrowser = createTRPCProxyClient<AppRouter>({
	links: [
		httpBatchLink({
			url: '/api/trpc',
		}),
	],
});
