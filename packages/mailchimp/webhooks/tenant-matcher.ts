import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { asRecord, firstString } from 'corsair/core';

import { parseMailchimpWebhookBody } from './types';

// Mailchimp webhooks are list-scoped and form-encoded. The body carries
// `data[list_id]` but not the account id, so to reconcile inbound events with
// the account-level `tenant_external_id` (Mailchimp account_id, stored at OAuth
// time) we read an `aid` query param that `webhooks.create` embeds in the
// webhook URL when it registers the webhook with Mailchimp. The list_id
// fallback remains for manually-configured webhooks.
export function matchMailchimpTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const body = parseMailchimpWebhookBody(request.body);
	if (!body) return null;

	const rawAid = request.query?.aid;
	const queryAid = Array.isArray(rawAid) ? rawAid[0] : rawAid;

	const data = asRecord(body.data);
	const externalId = firstString([
		queryAid,
		body.tenant_external_id,
		data?.list_id,
		data?.tenant_external_id,
	]);

	if (!externalId) return null;

	return { linkType: 'tenant_external_id', externalId };
}
