import type { WebhookRequest } from 'corsair/core';
import type { TelegramContext } from '../index';
import { message } from './message';
import { verifyTelegramWebhookSignature } from './types';

const SECRET = 'telegram-secret-token';

function makeRequest(
	payload: unknown,
	headers: Record<string, string | string[]> = {},
): WebhookRequest<unknown> {
	return {
		payload,
		rawBody: JSON.stringify(payload),
		headers,
	} as unknown as WebhookRequest<unknown>;
}

function makeCtx(key: string): TelegramContext {
	return {
		key,
		db: {
			messages: {
				upsertByEntityId: jest.fn().mockResolvedValue({ id: 'entity-1' }),
			},
		},
	} as unknown as TelegramContext;
}

const messageUpdate = {
	update_id: 1,
	message: {
		message_id: 42,
		date: 1747872000,
		chat: { id: 1234, type: 'private' },
		from: { id: 9999, is_bot: false, first_name: 'Mallory' },
		text: 'a forged message',
	},
};

describe('verifyTelegramWebhookSignature', () => {
	it('should fail closed when no secret token is configured', () => {
		// The regression: an unset secret returned { valid: true }, so any caller
		// who knew the webhook URL was treated as Telegram.
		const result = verifyTelegramWebhookSignature(
			makeRequest(messageUpdate),
			'',
		);
		expect(result).toEqual({ valid: false, error: 'Missing webhook secret' });
	});

	it('should reject a request with no secret-token header', () => {
		const result = verifyTelegramWebhookSignature(
			makeRequest(messageUpdate),
			SECRET,
		);
		expect(result).toEqual({
			valid: false,
			error: 'Missing x-telegram-bot-api-secret-token header',
		});
	});

	it('should reject a mismatched secret token', () => {
		const result = verifyTelegramWebhookSignature(
			makeRequest(messageUpdate, {
				'x-telegram-bot-api-secret-token': 'wrong',
			}),
			SECRET,
		);
		expect(result).toEqual({ valid: false, error: 'Invalid secret token' });
	});

	it('should accept a matching secret token', () => {
		const result = verifyTelegramWebhookSignature(
			makeRequest(messageUpdate, {
				'x-telegram-bot-api-secret-token': SECRET,
			}),
			SECRET,
		);
		expect(result).toEqual({ valid: true, error: undefined });
	});

	it('should accept the header when provided as an array', () => {
		const result = verifyTelegramWebhookSignature(
			makeRequest(messageUpdate, {
				'x-telegram-bot-api-secret-token': [SECRET],
			}),
			SECRET,
		);
		expect(result.valid).toBe(true);
	});
});

describe('message handler', () => {
	it('rejects with 401 and persists nothing when no secret is configured', async () => {
		// This is the consequence the fix is really about: the handler upserts
		// attacker-controlled message content, so an unverified request must not
		// reach the database.
		const ctx = makeCtx('');
		const result = await message.handler(
			ctx,
			makeRequest(messageUpdate) as never,
		);

		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.statusCode).toBe(401);
		}
		expect(ctx.db.messages?.upsertByEntityId).not.toHaveBeenCalled();
	});

	it('rejects a forged secret token with 401 and persists nothing', async () => {
		const ctx = makeCtx(SECRET);
		const result = await message.handler(
			ctx,
			makeRequest(messageUpdate, {
				'x-telegram-bot-api-secret-token': 'wrong',
			}) as never,
		);

		expect(result.success).toBe(false);
		expect(ctx.db.messages?.upsertByEntityId).not.toHaveBeenCalled();
	});

	it('accepts a correctly signed update and persists the message', async () => {
		const ctx = makeCtx(SECRET);
		const result = await message.handler(
			ctx,
			makeRequest(messageUpdate, {
				'x-telegram-bot-api-secret-token': SECRET,
			}) as never,
		);

		expect(result.success).toBe(true);
		expect(ctx.db.messages?.upsertByEntityId).toHaveBeenCalledWith(
			'42',
			expect.objectContaining({ id: '42', chat_id: '1234' }),
		);
	});
});
