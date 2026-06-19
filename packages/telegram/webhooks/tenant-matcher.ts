import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { asRecord, firstString, readBodyRecord } from 'corsair/core';

function extractBotUserIdFromChatMember(
	member: Record<string, unknown> | null,
): string | undefined {
	if (!member) return undefined;

	const user = asRecord(member.user);
	if (user?.is_bot !== true) return undefined;

	return firstString([user.id]);
}

// Telegram Update objects do not identify the receiving bot on most updates.
// my_chat_member / chat_member include the bot user when membership changes.
// See https://core.telegram.org/bots/api#update
export function matchTelegramTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const body = readBodyRecord(request);
	if (!body) return null;

	for (const updateKey of ['my_chat_member', 'chat_member'] as const) {
		const membershipUpdate = asRecord(body[updateKey]);
		if (!membershipUpdate) continue;

		const botId = firstString([
			extractBotUserIdFromChatMember(
				asRecord(membershipUpdate.new_chat_member),
			),
			extractBotUserIdFromChatMember(
				asRecord(membershipUpdate.old_chat_member),
			),
		]);
		if (botId) {
			return { linkType: 'bot_id', externalId: botId };
		}
	}

	return null;
}
