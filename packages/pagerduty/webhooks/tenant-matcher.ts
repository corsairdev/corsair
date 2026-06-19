import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { asRecord, firstString, readBodyRecord } from 'corsair/core';

function extractPagerdutySubdomain(url: unknown): string | undefined {
	if (typeof url !== 'string') return undefined;

	const match = url.match(/^https?:\/\/([^.]+)\.pagerduty\.com/i);
	return match?.[1];
}

// PagerDuty V3 webhooks encode the account subdomain in html_url fields.
// See https://support.pagerduty.com/docs/webhooks
export function matchPagerdutyTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const body = readBodyRecord(request);
	if (!body) return null;

	const event = asRecord(body.event);
	if (!event) return null;

	const data = asRecord(event.data);
	const agent = asRecord(event.agent);
	const service = asRecord(data?.service);

	const subdomain = firstString([
		extractPagerdutySubdomain(data?.html_url),
		extractPagerdutySubdomain(service?.html_url),
		extractPagerdutySubdomain(agent?.html_url),
	]);
	if (!subdomain) return null;

	return { linkType: 'subdomain', externalId: subdomain };
}
