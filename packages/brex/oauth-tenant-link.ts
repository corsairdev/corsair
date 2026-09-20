import type { TokenResponse, WebhookTenantMatch } from 'corsair/core';
import { asRecord, toExternalId } from 'corsair/core';
import { BREX_API_BASE } from './client';

/** Official: GET /v2/company returns the company id for the access token. */
export async function resolveBrexOAuthTenantLink(
	tokens: TokenResponse,
): Promise<WebhookTenantMatch | null> {
	const fromToken = toExternalId(
		tokens.tenant_external_id ??
			asRecord(tokens.company)?.id ??
			asRecord(tokens)?.company_id,
	);
	if (fromToken) return { linkType: 'company_id', externalId: fromToken };

	const accessToken = tokens.access_token;
	if (!accessToken) return null;

	let payload: Record<string, unknown> | null = null;
	try {
		const response = await fetch(`${BREX_API_BASE}/v2/company`, {
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${accessToken}`,
			},
			signal: AbortSignal.timeout(10_000),
		});
		if (!response.ok) return null;
		payload = asRecord(await response.json());
	} catch {
		return null;
	}
	const companyId = toExternalId(payload?.id);
	return companyId ? { linkType: 'company_id', externalId: companyId } : null;
}
