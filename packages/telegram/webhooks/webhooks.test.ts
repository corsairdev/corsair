import type { WebhookRequest } from 'corsair/core';
import type { TelegramContext } from '../index';
import { message } from './message';
import type { TelegramUpdate } from './types';
import { verifyTelegramWebhookSignature } from './types';

const WEBHOOK_SECRET = 'telegram-webhook-secret';

function makeUpdate(): TelegramUpdate {
	return {
		update_id: 100,
		message: {
			message_id: 42,
			date: 1700000000,
			text: 'hello',
			from: { id: 7, is_bot: false, first_name: 'Ada' },
			chat: { id: 99, type: 'private' },
		},
	} as TelegramUpdate;
}

function makeWebhookRequest(
	payload: TelegramUpdate,
	options?: { secretToken?: string | string[] | null },
): WebhookRequest<TelegramUpdate> {
	const headers: Record<string, string | string[]> = {};
	const token =
		options && 'secretToken' in options ? options.secretToken : WEBHOOK_SECRET;

	if (token !== null && token !== undefined) {
		headers['x-telegram-bot-api-secret-token'] = token;
	}

	return {
		payload,
		rawBody: JSON.stringify(payload),
		headers,
	} as WebhookRequest<TelegramUpdate>;
}

function makeCtx(key: string = WEBHOOK_SECRET): TelegramContext {
	return {
		key,
		db: {
			messages: {
				upsertByEntityId: jest.fn().mockResolvedValue({ id: 'entity-1' }),
			},
		},
		$getAccountId: jest.fn().mockResolvedValue('account-1'),
	} as unknown as TelegramContext;
}

describe('verifyTelegramWebhookSignature', () => {
	it('fails closed when no secret token is configured', () => {
		const result = verifyTelegramWebhookSignature(
			makeWebhookRequest(makeUpdate()),
			'',
		);

		expect(result.valid).toBe(false);
		expect(result.error).toBe('Missing webhook secret');
	});

	it('rejects a request with no secret-token header', () => {
		const result = verifyTelegramWebhookSignature(
			makeWebhookRequest(makeUpdate(), { secretToken: null }),
			WEBHOOK_SECRET,
		);

		expect(result.valid).toBe(false);
		expect(result.error).toMatch(/missing x-telegram-bot-api-secret-token/i);
	});

	it('rejects a mismatched secret token', () => {
		const result = verifyTelegramWebhookSignature(
			makeWebhookRequest(makeUpdate(), { secretToken: 'not-the-secret' }),
			WEBHOOK_SECRET,
		);

		expect(result.valid).toBe(false);
		expect(result.error).toBe('Invalid secret token');
	});

	it('accepts a matching secret token', () => {
		const result = verifyTelegramWebhookSignature(
			makeWebhookRequest(makeUpdate()),
			WEBHOOK_SECRET,
		);

		expect(result.valid).toBe(true);
		expect(result.error).toBeUndefined();
	});

	it('accepts the header when provided as an array', () => {
		const result = verifyTelegramWebhookSignature(
			makeWebhookRequest(makeUpdate(), { secretToken: [WEBHOOK_SECRET] }),
			WEBHOOK_SECRET,
		);

		expect(result.valid).toBe(true);
	});
});

describe('message webhook handler', () => {
	it('rejects with 401 and persists nothing when no secret is configured', async () => {
		const ctx = makeCtx('');

		const result = await message.handler(
			ctx,
			makeWebhookRequest(makeUpdate()) as never,
		);

		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.statusCode).toBe(401);
			expect(result.error).toBe('Missing webhook secret');
		}
		expect(ctx.db.messages?.upsertByEntityId).not.toHaveBeenCalled();
	});

	it('rejects a forged secret token with 401 and persists nothing', async () => {
		const ctx = makeCtx();

		const result = await message.handler(
			ctx,
			makeWebhookRequest(makeUpdate(), { secretToken: 'forged' }) as never,
		);

		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.statusCode).toBe(401);
		}
		expect(ctx.db.messages?.upsertByEntityId).not.toHaveBeenCalled();
	});

	it('accepts a correctly signed update and persists the message', async () => {
		const ctx = makeCtx();

		const result = await message.handler(
			ctx,
			makeWebhookRequest(makeUpdate()) as never,
		);

		expect(result.success).toBe(true);
		expect(ctx.db.messages?.upsertByEntityId).toHaveBeenCalledWith(
			'42',
			expect.objectContaining({
				id: '42',
				chat_id: '99',
				authorId: '7',
			}),
		);
	});
});
