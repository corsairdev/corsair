import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { asRecord, firstString, readBodyRecord } from 'corsair/core';

/**
 * Routes an inbound Botbaba webhook to a tenant.
 *
 * No webhook handlers are registered yet — the Composio catalog lists zero
 * triggers for Botbaba — so in practice this is not reached. It is kept
 * correct, routing on `botId` to line up with the plugin's entity model,
 * so enabling webhooks later does not require rework.
 */
export function matchBotbabaTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const body = readBodyRecord(request);
	if (!body) return null;

	const externalId = firstString([
		body.botId,
		body.bot_id,
		asRecord(body.data)?.botId,
	]);

	if (!externalId) return null;

	return { linkType: 'bot_id', externalId };
}
