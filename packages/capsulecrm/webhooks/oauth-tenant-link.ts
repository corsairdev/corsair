import type { TokenResponse, WebhookTenantMatch } from 'corsair/core';
import { asRecord, toExternalId } from 'corsair/core';
import { CAPSULE_CRM_API_BASE } from '../client';

export async function resolveCapsuleCrmOAuthWebhookTenantLink(
	tokens: TokenResponse,
): Promise<WebhookTenantMatch | null> {
	const fromToken = toExternalId(tokens.subdomain);
	if (fromToken) {
		return { linkType: 'subdomain', externalId: fromToken };
	}

	const accessToken = tokens.access_token;
	if (!accessToken) return null;

	const response = await fetch(`${CAPSULE_CRM_API_BASE}/site`, {
		headers: { Authorization: `Bearer ${accessToken}` },
	});
	if (!response.ok) return null;

	const payload = asRecord(await response.json());
	const site = asRecord(payload?.site) ?? payload;
	const subdomain = toExternalId(site?.subdomain);
	return subdomain ? { linkType: 'subdomain', externalId: subdomain } : null;
}
