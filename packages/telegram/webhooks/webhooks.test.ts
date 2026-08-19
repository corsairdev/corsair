import type { WebhookRequest } from 'corsair/core';
import type { TelegramContext } from '../index';
import { message } from './message';
import type { MessageEvent } from './types';
import { verifyTelegramWebhookSignature } from './types';

const SECRET = 'telegram-secret-token';

type MessageContextFixture = Pick<TelegramContext, 'key' | '$getAccountId'> & {
	db: {
		messages: Pick<TelegramContext['db']['messages'], 'upsertByEntityId'>;
	};
};

function makeRequest<TPayload>(
	payload: TPayload,
	headers: Record<string, string | string[]> = {},
): WebhookRequest<TPayload> {
	return {
		payload,
		rawBody: JSON.stringify(payload),
		headers,
	};
}

function makeCtx(key: string): TelegramContext {
	const fixture = {
		key,
		db: {
			messages: {
				upsertByEntityId: jest.fn().mockResolvedValue({ id: 'entity-1' }),
			},
		},
		$getAccountId: jest.fn().mockResolvedValue('account-1'),
	} satisfies MessageContextFixture;

	return fixture as unknown as TelegramContext;
}

const messageUpdate: MessageEvent = {
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

	it('should reject a secret token with a different length', () => {
		// A length mismatch must be rejected without comparing contents,
		// and must not throw.
		const result = verifyTelegramWebhookSignature(
			makeRequest(messageUpdate, {
				'x-telegram-bot-api-secret-token': 'telegram-secret-token-extra',
			}),
			SECRET,
		);
		expect(result).toEqual({ valid: false, error: 'Invalid secret token' });
	});

	it('should reject a secret token with a different byte length (Unicode)', () => {
		// A non-ASCII token can share the JS string length with the secret but
		// differ in UTF-8 byte length. After encoding to buffers, the byte-length
		// guard must reject it without timingSafeEqual throwing.
		const unicodeToken = 'telegram-secret-token-🚀'; // longer byte length than SECRET
		const result = verifyTelegramWebhookSignature(
			makeRequest(messageUpdate, {
				'x-telegram-bot-api-secret-token': unicodeToken,
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
	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('rejects with 401 and persists nothing when no secret is configured', async () => {
		// This is the consequence the fix is really about: the handler upserts
		// attacker-controlled message content, so an unverified request must not
		// reach the database.
		const ctx = makeCtx('');
		const result = await message.handler(ctx, makeRequest(messageUpdate));

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
			}),
		);

		expect(result.success).toBe(false);
		expect(ctx.db.messages?.upsertByEntityId).not.toHaveBeenCalled();
	});

	it('accepts a correctly signed update and persists the message', async () => {
		const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
		const ctx = makeCtx(SECRET);
		const result = await message.handler(
			ctx,
			makeRequest(messageUpdate, {
				'x-telegram-bot-api-secret-token': SECRET,
			}),
		);

		expect(result.success).toBe(true);
		expect(warnSpy).not.toHaveBeenCalled();
		expect(ctx.db.messages?.upsertByEntityId).toHaveBeenCalledWith(
			'42',
			expect.objectContaining({ id: '42', chat_id: '1234' }),
		);
	});
});
