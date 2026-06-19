import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';

// Fireflies webhooks are scoped to the meeting owner and authenticated via
// X-Hub-Signature / x-fireflies-signature. Payloads include meetingId (V1) or
// meeting_id (V2) but no organization or account identifier — see
// https://docs.fireflies.ai/graphql-api/webhooks
export function matchFirefliesTenantWebhook(
	_request: RawWebhookRequest,
): WebhookTenantMatch | null {
	return null;
}
