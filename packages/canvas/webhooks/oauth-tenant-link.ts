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

/** First numeric id among token/account fields (skips non-numeric values). */
function firstNumericId(...values: unknown[]): string | null {
	for (const value of values) {
		const candidate = firstString(value);
		if (candidate && /^\d+$/.test(candidate)) return candidate;
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

type CanvasAccount = {
	id?: string | number;
	parent_account_id?: string | number | null;
	root_account_id?: string | number | null;
};

function accountIdFromRow(row: CanvasAccount): string | null {
	// Child accounts must not become the webhook tenant — Live Events use root id.
	if (row.parent_account_id !== null && row.parent_account_id !== undefined) {
		return toExternalId(firstNumericId(row.root_account_id)) ?? null;
	}
	return toExternalId(firstNumericId(row.id)) ?? null;
}

/**
 * Pick a stable account id from GET /api/v1/accounts.
 * Prefer an unambiguous root; never use a singleton child as canvas_account_id.
 */
export function accountIdFromAccountsList(accounts: unknown): string | null {
	if (!Array.isArray(accounts) || accounts.length === 0) return null;

	const rows = accounts.filter(
		(row): row is CanvasAccount => !!row && typeof row === 'object',
	);
	if (rows.length === 0) return null;

	if (rows.length === 1) {
		return accountIdFromRow(rows[0]!);
	}

	const roots = rows.filter(
		(row) =>
			row.parent_account_id === null || row.parent_account_id === undefined,
	);
	if (roots.length === 1) {
		return accountIdFromRow(roots[0]!);
	}

	// Ambiguous multi-account page — require an explicit id on the OAuth token.
	return null;
}

/**
 * Resolve Canvas account id for webhook tenant routing.
 * Prefer token fields; otherwise call GET /api/v1/accounts when base URL is known.
 */
export async function resolveCanvasOAuthWebhookTenantLink(
	tokens: TokenResponse,
): Promise<WebhookTenantMatch | null> {
	const fromToken = firstNumericId(
		tokens.canvas_account_id,
		tokens.account_id,
		tokens.root_account_id,
	);
	if (fromToken) {
		return { linkType: 'canvas_account_id', externalId: fromToken };
	}

	const fromUuid = firstString(
		tokens.root_account_uuid,
		tokens.canvas_account_uuid,
	);
	if (fromUuid) {
		return { linkType: 'canvas_root_account_uuid', externalId: fromUuid };
	}

	const accessToken = firstString(tokens.access_token);
	const baseUrlRaw = baseUrlFromTokens(tokens);
	if (!accessToken || !baseUrlRaw) return null;

	try {
		const baseUrl = normalizeCanvasBaseUrl(baseUrlRaw);
		const accounts = await makeCanvasRequest<CanvasAccount[]>(
			'/api/v1/accounts',
			accessToken,
			{
				method: 'GET',
				baseUrl,
			},
		);

		const externalId = accountIdFromAccountsList(accounts);
		if (!externalId) return null;
		return { linkType: 'canvas_account_id', externalId };
	} catch {
		return null;
	}
}
