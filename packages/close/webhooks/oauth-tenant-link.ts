import type {
	CorsairOAuthWebhookTenantLinkResolver,
	TokenResponse,
} from 'corsair/core';
import { toExternalId } from 'corsair/core';

export const resolveCloseOAuthWebhookTenantLink: CorsairOAuthWebhookTenantLinkResolver =
	async (tokens: TokenResponse) => {
		const orgId = toExternalId(tokens.organization_id);
		return orgId ? { linkType: 'organization_id', externalId: orgId } : null;
	};
