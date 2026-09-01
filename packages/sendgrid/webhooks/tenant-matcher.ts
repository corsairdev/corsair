import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { asRecord, firstString, readBodyRecord } from 'corsair/core';

export function matchSendGridTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	let externalId: string | undefined;

	if (typeof request.body === 'string') {
		try {
			const parsed = JSON.parse(request.body);
			if (
				Array.isArray(parsed) &&
				parsed.length > 0 &&
				typeof parsed[0] === 'object' &&
				parsed[0] !== null
			) {
				externalId = firstString([
					(parsed[0] as Record<string, unknown>).tenant_external_id,
				]);
			} else if (typeof parsed === 'object' && parsed !== null) {
				externalId = firstString([
					(parsed as Record<string, unknown>).tenant_external_id,
					asRecord((parsed as Record<string, unknown>).data)
						?.tenant_external_id,
				]);
			}
		} catch {
			// ignore JSON parse failure
		}
	} else if (
		Array.isArray(request.body) &&
		request.body.length > 0 &&
		typeof request.body[0] === 'object' &&
		request.body[0] !== null
	) {
		externalId = firstString([
			(request.body[0] as Record<string, unknown>).tenant_external_id,
		]);
	} else {
		const body = readBodyRecord(request);
		if (body) {
			externalId = firstString([
				body.tenant_external_id,
				asRecord(body.data)?.tenant_external_id,
			]);
		}
	}

	if (!externalId) return null;

	return { linkType: 'tenant_external_id', externalId };
}
