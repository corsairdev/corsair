import type { TokenResponse, WebhookTenantMatch } from 'corsair/core';
import { toExternalId } from 'corsair/core';

export async function resolveXeroOAuthWebhookTenantLink(
	tokens: TokenResponse,
): Promise<WebhookTenantMatch | null> {
	const externalId = toExternalId(
		tokens.tenant_id ?? tokens.tenant_external_id,
	);
	if (externalId) {
		return { linkType: 'tenant_external_id', externalId };
	}

	const accessToken = tokens.access_token;
	if (!accessToken) return null;

	try {
		const response = await fetch('https://api.xero.com/connections', {
			headers: {
				Authorization: `Bearer ${accessToken}`,
				Accept: 'application/json',
			},
		});
		if (!response.ok) return null;
		const payload = (await response.json()) as Array<{ tenantId?: string }>;
		const firstTenantId = payload?.[0]?.tenantId;
		if (firstTenantId) {
			return {
				linkType: 'tenant_external_id',
				externalId: firstTenantId,
			};
		}
	} catch {
		return null;
	}

	return null;
}
