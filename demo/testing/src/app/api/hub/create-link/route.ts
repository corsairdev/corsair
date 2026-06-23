import { createHubRouteHandlers } from 'corsair/hub';

import { corsair } from '@/server/corsair';

const hub = createHubRouteHandlers(corsair, {
	// Production: resolve tenantId from your session instead of the request body.
	// resolveTenantId: async (request) => getSessionTenantId(request),
});

export const POST = hub.createConnectSession;
export const GET = hub.createConnectSession;
