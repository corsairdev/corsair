import type { TokenResponse, WebhookTenantMatch } from 'corsair/core';
import { toExternalId } from 'corsair/core';

export async function resolveFilloutFormsOAuthWebhookTenantLink(
	tokens: TokenResponse,
): Promise<WebhookTenantMatch | null> {
	const externalId = toExternalId(tokens.form_id);
	if (externalId) {
		return { linkType: 'form_id', externalId };
	}

	const accessToken = tokens.access_token;
	if (!accessToken) return null;

	try {
		const response = await fetch('https://api.fillout.com/v1/api/forms', {
			headers: { Authorization: `Bearer ${accessToken}` },
		});
		if (!response.ok) return null;
		const payload = (await response.json()) as Array<{ formId?: string }>;
		const firstForm = payload[0];
		const fetchedId = toExternalId(firstForm?.formId);
		return fetchedId ? { linkType: 'form_id', externalId: fetchedId } : null;
	} catch {
		return null;
	}
}
