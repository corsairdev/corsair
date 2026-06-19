import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { asRecord, firstString, readBodyRecord } from 'corsair/core';

// Vercel integration webhooks expose team id at payload.team.id (possibly null for personal accounts).
// Legacy payloads may still include top-level teamId.
// See https://vercel.com/docs/observability/webhooks-overview/webhooks-api
export function matchVercelTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const body = readBodyRecord(request);
	if (!body) return null;

	const payload = asRecord(body.payload);
	const teamId = firstString([asRecord(payload?.team)?.id, body.teamId]);
	if (!teamId) return null;

	return { linkType: 'team_id', externalId: teamId };
}
