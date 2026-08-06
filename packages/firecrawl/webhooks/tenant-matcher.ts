import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';

// Firecrawl webhooks are authenticated per account via X-Firecrawl-Signature
// (HMAC-SHA256 of the raw body). Payloads carry job id and optional user-supplied
// metadata but no built-in account/org identifier — see
// https://docs.firecrawl.dev/webhooks/events
export function matchFirecrawlTenantWebhook(
	_request: RawWebhookRequest,
): WebhookTenantMatch | null {
	return null;
}
