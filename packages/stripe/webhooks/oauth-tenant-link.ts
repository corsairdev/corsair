import type { TokenResponse, WebhookTenantMatch } from 'corsair/core';
import { asRecord, toExternalId } from 'corsair/core';

export function resolveStripeOAuthWebhookTenantLink(
	tokens: TokenResponse,
): WebhookTenantMatch | null {
	const accountId = toExternalId(
		tokens.stripe_user_id ?? asRecord(tokens.stripe_user)?.id,
	);
	return accountId
		? { linkType: 'account_id', externalId: accountId }
		: null;
}
