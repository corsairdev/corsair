import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { firstString, readBodyRecord } from 'corsair/core';

// Vercel webhook payloads include teamId for team-scoped events.
// See https://vercel.com/docs/observability/webhooks-overview/webhooks-api
export function matchVercelTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const body = readBodyRecord(request);
	if (!body) return null;

	const teamId = firstString([body.teamId]);
	if (!teamId) return null;

	return { linkType: 'team_id', externalId: teamId };
}
