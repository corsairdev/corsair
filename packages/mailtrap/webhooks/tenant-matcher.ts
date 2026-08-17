import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { asRecord, firstString, readBodyRecord } from 'corsair/core';

/**
 * Routes an inbound Mailtrap webhook to a tenant.
 *
 * No webhook handlers are registered — the OSS catalog lists zero triggers
 * for Mailtrap, and this plugin's operations are all direct REST calls — so
 * in practice this is not reached. It is kept correct, routing on
 * `account_id` to line up with `mailtrapAuthConfig.api_key.account`, so
 * enabling webhooks later does not require rework.
 */
export function matchMailtrapTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const body = readBodyRecord(request);
	if (!body) return null;

	const externalId = firstString([
		body.account_id,
		asRecord(body.data)?.account_id,
	]);

	if (!externalId) return null;

	return { linkType: 'account_id', externalId };
}
