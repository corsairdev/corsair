import type { TokenResponse, WebhookTenantMatch } from 'corsair/core';
import { toExternalId } from 'corsair/core';

export async function resolveAttioOAuthWebhookTenantLink(
	tokens: TokenResponse,
): Promise<WebhookTenantMatch | null> {
	const directId = toExternalId(
		tokens.workspace_id ?? tokens.tenant_external_id,
	);
	if (directId) {
		return { linkType: 'tenant_external_id', externalId: directId };
	}

	const accessToken = tokens.access_token;
	if (!accessToken) return null;

	try {
		const response = await fetch('https://api.attio.com/v2/self', {
			headers: { Authorization: `Bearer ${accessToken}` },
			signal: AbortSignal.timeout(10_000),
		});
		if (!response.ok) return null;
		const payload = (await response.json()) as {
			workspace_id?: string;
		};
		const fetchedId = toExternalId(payload.workspace_id);
		return fetchedId
			? { linkType: 'tenant_external_id', externalId: fetchedId }
			: null;
	} catch {
		return null;
	}
}
