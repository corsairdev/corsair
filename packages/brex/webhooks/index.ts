import { userUpdated } from './users';

export const UserWebhooks = {
	userUpdated,
};

export { resolveBrexOAuthWebhookTenantLink } from './oauth-tenant-link';
export { matchBrexTenantWebhook } from './tenant-matcher';
export type { BrexWebhookEvent, BrexWebhookOutputs } from './types';
export {
	BrexWebhookEventSchema,
	createBrexEventMatch,
	hasBrexWebhookHeaders,
	verifyBrexWebhookSignature,
} from './types';
