import type { TokenResponse, WebhookTenantMatch } from 'corsair/core';
import { asRecord, toExternalId } from 'corsair/core';
import { COINBASE_API_BASE, COINBASE_API_VERSION } from '../client';

export async function resolveCoinbaseOAuthWebhookTenantLink(
	tokens: TokenResponse,
): Promise<WebhookTenantMatch | null> {
	const fromTokens = toExternalId(tokens.user_id ?? asRecord(tokens.user)?.id);
	if (fromTokens) {
		return { linkType: 'user_id', externalId: fromTokens };
	}

	const accessToken = tokens.access_token;
	if (!accessToken) return null;

	try {
		const response = await fetch(`${COINBASE_API_BASE}/v2/user`, {
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${accessToken}`,
				'CB-VERSION': COINBASE_API_VERSION,
			},
			signal: AbortSignal.timeout(20_000),
		});
		if (!response.ok) return null;
		const payload = (await response.json()) as {
			data?: { id?: string };
		};
		const fetchedId = toExternalId(payload.data?.id);
		return fetchedId ? { linkType: 'user_id', externalId: fetchedId } : null;
	} catch {
		return null;
	}
}
