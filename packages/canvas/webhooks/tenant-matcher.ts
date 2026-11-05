import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { asRecord, firstString, readBodyRecord } from 'corsair/core';

/** First numeric Canvas account id in `values` (skips non-numeric entries). */
function numericAccountId(values: unknown[]): string | null {
	for (const value of values) {
		const candidate = firstString([value]);
		if (candidate && /^\d+$/.test(candidate)) return candidate;
	}
	return null;
}

export function matchCanvasTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const body = readBodyRecord(request);
	if (!body) return null;

	const metadata = asRecord(body.metadata);
	const data = asRecord(body.data);

	// OAuth persists numeric account id under canvas_account_id — never a UUID.
	const accountId = numericAccountId([
		body.root_account_id,
		body.account_id,
		metadata?.root_account_id,
		data?.account_id,
		data?.root_account_id,
	]);
	if (accountId) {
		return { linkType: 'canvas_account_id', externalId: accountId };
	}

	// UUID namespace is separate so it cannot collide with numeric OAuth links.
	const accountUuid = firstString([
		metadata?.root_account_uuid,
		body.root_account_uuid,
		data?.root_account_uuid,
	]);
	if (accountUuid) {
		return {
			linkType: 'canvas_root_account_uuid',
			externalId: accountUuid,
		};
	}

	return null;
}
