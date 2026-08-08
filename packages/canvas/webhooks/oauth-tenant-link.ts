import type { TokenResponse, WebhookTenantMatch } from 'corsair/core';
import { toExternalId } from 'corsair/core';
import { makeCanvasRequest, normalizeCanvasBaseUrl } from '../client';

function firstString(...values: unknown[]): string | null {
	for (const value of values) {
		if (typeof value === 'string' && value.trim()) return value.trim();
		if (typeof value === 'number' && Number.isFinite(value)) {
			return String(value);
		}
	}
	return null;
}

function baseUrlFromTokens(tokens: TokenResponse): string | null {
	return firstString(
		tokens.base_url,
		tokens.canvas_url,
		tokens.instance_url,
		tokens.canvas_domain
			? `https://${String(tokens.canvas_domain).replace(/^https?:\/\//, '')}`
			: null,
	);
}

/**
 * Resolve Canvas account id for webhook tenant routing.
 * Prefer token fields; otherwise call GET /api/v1/accounts when base URL is known.
 */
export async function resolveCanvasOAuthWebhookTenantLink(
	tokens: TokenResponse,
): Promise<WebhookTenantMatch | null> {
	const fromToken = toExternalId(
		firstString(
			tokens.canvas_account_id,
			tokens.account_id,
			tokens.root_account_id,
		),
	);
	if (fromToken) {
		return { linkType: 'canvas_account_id', externalId: fromToken };
	}

	const accessToken = firstString(tokens.access_token);
	const baseUrlRaw = baseUrlFromTokens(tokens);
	if (!accessToken || !baseUrlRaw) return null;

	try {
		const baseUrl = normalizeCanvasBaseUrl(baseUrlRaw);
		const accounts = await makeCanvasRequest<Array<{ id?: string | number }>>(
			'/api/v1/accounts',
			accessToken,
			{
				method: 'GET',
				baseUrl,
			},
		);

		const accountId = Array.isArray(accounts)
			? firstString(accounts[0]?.id)
			: null;
		const externalId = toExternalId(accountId);
		if (!externalId) return null;
		return { linkType: 'canvas_account_id', externalId };
	} catch {
		return null;
	}
}
