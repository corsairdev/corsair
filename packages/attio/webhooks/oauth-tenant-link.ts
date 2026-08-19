import type { TokenResponse, WebhookTenantMatch } from 'corsair/core';
import { toExternalId } from 'corsair/core';

/**
 * After OAuth, resolve the external tenant ID from the token response.
 * Called by the Corsair Hub to link a webhook route to this Attio workspace.
 *
 * Attio's token response includes a `workspace_id` which uniquely identifies
 * the connected workspace. If the token response doesn't contain it, we
 * fall back to calling the Attio self endpoint to resolve the workspace ID.
 */
export async function resolveAttioOAuthWebhookTenantLink(
	tokens: TokenResponse,
): Promise<WebhookTenantMatch | null> {
	// 1) Try the token response first (workspace_id or tenant_external_id)
	const directId = toExternalId(
		tokens.workspace_id ?? tokens.tenant_external_id,
	);
	if (directId) {
		return { linkType: 'tenant_external_id', externalId: directId };
	}

	// 2) Fall back to API call if access_token is available
	const accessToken = tokens.access_token;
	if (!accessToken) return null;

	try {
		const response = await fetch('https://api.attio.com/v2/self', {
			headers: { Authorization: `Bearer ${accessToken}` },
		});
		if (!response.ok) return null;
		const payload = (await response.json()) as {
			data?: { workspace?: { id?: string } };
		};
		const fetchedId = toExternalId(payload.data?.workspace?.id);
		return fetchedId
			? { linkType: 'tenant_external_id', externalId: fetchedId }
			: null;
	} catch {
		return null;
	}
}
