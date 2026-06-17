import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { asRecord, firstString, readBodyRecord } from 'corsair/core';

// Cloudflare notification policies include account_id; SaaS webhooks nest it under metadata.account.id.
// See https://developers.cloudflare.com/notifications/reference/webhook-payload-schema/
export function matchCloudflareTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const body = readBodyRecord(request);
	if (!body) return null;

	const metadata = asRecord(body.metadata);
	const account = asRecord(metadata?.account);
	const data = asRecord(body.data);

	const accountId = firstString([
		body.account_id,
		account?.id,
		asRecord(data?.account)?.id,
	]);

	if (!accountId) return null;

	return { linkType: 'account_id', externalId: accountId };
}
