import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { firstString, readBodyRecord } from 'corsair/core';
import { DiscordInteractionType } from './types';

// Discord interactions include application_id on every payload; guild_id when in a server.
// PING (type 1) is an endpoint verification handshake with no tenant context.
// See https://discord.com/developers/docs/interactions/receiving-and-responding
export function matchDiscordTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const body = readBodyRecord(request);
	if (!body) return null;

	if (body.type === DiscordInteractionType.PING) return null;

	const guildId = firstString([body.guild_id]);
	if (guildId) {
		return { linkType: 'guild_id', externalId: guildId };
	}

	const applicationId = firstString([body.application_id]);
	if (!applicationId) return null;

	return { linkType: 'application_id', externalId: applicationId };
}
