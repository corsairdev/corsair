import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { firstString, readBodyRecord } from 'corsair/core';
import { DiscordInteractionType } from './types';

// Discord interactions include guild_id when routed from a server context.
// DMs and other global contexts omit guild_id — application_id is the bot's own
// id and is identical across tenants, so it must not be used for tenant routing.
// PING (type 1) is an endpoint verification handshake with no tenant context.
// See https://discord.com/developers/docs/interactions/receiving-and-responding
export function matchDiscordTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const body = readBodyRecord(request);
	if (!body) return null;

	if (body.type === DiscordInteractionType.PING) return null;

	const guildId = firstString([body.guild_id]);
	if (!guildId) return null;

	return { linkType: 'guild_id', externalId: guildId };
}
