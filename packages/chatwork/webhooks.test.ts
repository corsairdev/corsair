import { createHmac } from 'node:crypto';
import type { RawWebhookRequest, WebhookRequest } from 'corsair/core';
import type { ChatworkContext } from './index';
import {
	createChatworkMatch,
	MentionsWebhooks,
	MessagesWebhooks,
	matchChatworkTenantWebhook,
	resolveChatworkOAuthWebhookTenantLink,
	verifyChatworkWebhookSignature,
} from './webhooks';
import type {
	MentionToMeWebhookPayload,
	MessageCreatedWebhookPayload,
	MessageUpdatedWebhookPayload,
} from './webhooks/types';

function testContext(key = 'dGVzdC1zZWNyZXQta2V5'): ChatworkContext {
	return {
		key,
		$getAccountId: () => 'test-account-id',
		options: {},
		logEvent: jest.fn(),
		db: {},
	} as unknown as ChatworkContext;
}

// Helper to compute valid Chatwork signature given raw body and base64 secret
function computeSignature(body: string, secretBase64: string): string {
	const key = Buffer.from(secretBase64, 'base64');
	return createHmac('sha256', key).update(body).digest('base64');
}

describe('Chatwork Webhooks Signature Verification', () => {
	const secretBase64 = Buffer.from('my-super-secret-token').toString('base64');
	const rawBody = JSON.stringify({
		webhook_setting_id: '123',
		webhook_event_type: 'message_created',
		webhook_event_time: 1600000000,
		webhook_event: {
			message_id: 'msg-1',
			room_id: 100,
			account_id: 200,
			body: 'Test',
			send_time: 1600000000,
		},
	});

	it('validates a correct HMAC-SHA256 signature with base64 decoded key', () => {
		const validSig = computeSignature(rawBody, secretBase64);

		const result = verifyChatworkWebhookSignature(
			rawBody,
			validSig,
			secretBase64,
		);

		expect(result.valid).toBe(true);
		expect(result.error).toBeUndefined();
	});

	it('rejects an invalid signature with length mismatch', () => {
		const result = verifyChatworkWebhookSignature(
			rawBody,
			'short-invalid-sig',
			secretBase64,
		);

		expect(result.valid).toBe(false);
		expect(result.error).toBe('Signature length mismatch');
	});

	it('rejects an invalid signature of equal length', () => {
		const validSig = computeSignature(rawBody, secretBase64);
		// Same length but wrong characters
		const tamperedSig = validSig.startsWith('A')
			? `B${validSig.slice(1)}`
			: `A${validSig.slice(1)}`;

		const result = verifyChatworkWebhookSignature(
			rawBody,
			tamperedSig,
			secretBase64,
		);

		expect(result.valid).toBe(false);
		expect(result.error).toBe('Invalid webhook signature');
	});

	it('fails gracefully when signature is missing', () => {
		const result = verifyChatworkWebhookSignature(rawBody, '', secretBase64);

		expect(result.valid).toBe(false);
		expect(result.error).toContain('Missing x-chatworkwebhooksignature');
	});

	it('verifies signature via WebhookRequest object with headers', () => {
		const validSig = computeSignature(rawBody, secretBase64);
		const req: WebhookRequest<unknown> = {
			payload: JSON.parse(rawBody),
			headers: {
				'x-chatworkwebhooksignature': validSig,
			},
			rawBody,
		};

		const result = verifyChatworkWebhookSignature(req, secretBase64);
		expect(result.valid).toBe(true);
	});
});

describe('Chatwork Webhook Matchers', () => {
	it('matches message_created events correctly', () => {
		const matcher = createChatworkMatch('message_created');
		const req: RawWebhookRequest = {
			headers: {},
			body: JSON.stringify({ webhook_event_type: 'message_created' }),
		};

		expect(matcher(req)).toBe(true);
	});

	it('does not match differing event types', () => {
		const matcher = createChatworkMatch('message_created');
		const req: RawWebhookRequest = {
			headers: {},
			body: JSON.stringify({ webhook_event_type: 'message_updated' }),
		};

		expect(matcher(req)).toBe(false);
	});
});

describe('Chatwork Webhook Handlers', () => {
	const secretBase64 = Buffer.from('test-secret').toString('base64');
	const ctx = testContext(secretBase64);

	it('handles message_created webhook successfully', async () => {
		const payload: MessageCreatedWebhookPayload = {
			webhook_setting_id: 'setting-1',
			webhook_event_type: 'message_created',
			webhook_event_time: 1600000000,
			webhook_event: {
				message_id: 'msg-1',
				room_id: 101,
				account_id: 202,
				body: 'New room message',
				send_time: 1600000000,
				update_time: 0,
			},
		};

		const rawBody = JSON.stringify(payload);
		const sig = computeSignature(rawBody, secretBase64);

		const req: WebhookRequest<MessageCreatedWebhookPayload> = {
			payload,
			headers: { 'x-chatworkwebhooksignature': sig },
			rawBody,
		};

		const response = await MessagesWebhooks.created.handler(ctx, req);

		expect(response.success).toBe(true);
		expect(response.data).toEqual(payload);
	});

	it('handles message_updated webhook successfully', async () => {
		const payload: MessageUpdatedWebhookPayload = {
			webhook_setting_id: 'setting-2',
			webhook_event_type: 'message_updated',
			webhook_event_time: 1600000010,
			webhook_event: {
				message_id: 'msg-1',
				room_id: 101,
				account_id: 202,
				body: 'Updated room message',
				send_time: 1600000000,
				update_time: 1600000010,
			},
		};

		const rawBody = JSON.stringify(payload);
		const sig = computeSignature(rawBody, secretBase64);

		const req: WebhookRequest<MessageUpdatedWebhookPayload> = {
			payload,
			headers: { 'x-chatworkwebhooksignature': sig },
			rawBody,
		};

		const response = await MessagesWebhooks.updated.handler(ctx, req);

		expect(response.success).toBe(true);
		expect(response.data).toEqual(payload);
	});

	it('handles mention_to_me webhook successfully', async () => {
		const payload: MentionToMeWebhookPayload = {
			webhook_setting_id: 'setting-3',
			webhook_event_type: 'mention_to_me',
			webhook_event_time: 1600000020,
			webhook_event: {
				mention_id: 'men-1',
				message_id: 'msg-99',
				room_id: 101,
				from_account_id: 303,
				to_account_id: 404,
				body: '[To:404] Hey look at this',
				send_time: 1600000020,
			},
		};

		const rawBody = JSON.stringify(payload);
		const sig = computeSignature(rawBody, secretBase64);

		const req: WebhookRequest<MentionToMeWebhookPayload> = {
			payload,
			headers: { 'x-chatworkwebhooksignature': sig },
			rawBody,
		};

		const response = await MentionsWebhooks.toMe.handler(ctx, req);

		expect(response.success).toBe(true);
		expect(response.data).toEqual(payload);
	});

	it('rejects webhooks with invalid signature returning 401', async () => {
		const payload: MessageCreatedWebhookPayload = {
			webhook_setting_id: 'setting-1',
			webhook_event_type: 'message_created',
			webhook_event_time: 1600000000,
			webhook_event: {
				message_id: 'msg-1',
				room_id: 101,
				account_id: 202,
				body: 'Hacked message',
				send_time: 1600000000,
			},
		};

		const req: WebhookRequest<MessageCreatedWebhookPayload> = {
			payload,
			headers: { 'x-chatworkwebhooksignature': 'bad-sig' },
			rawBody: JSON.stringify(payload),
		};

		const response = await MessagesWebhooks.created.handler(ctx, req);

		expect(response.success).toBe(false);
		expect(response.statusCode).toBe(401);
	});
});

describe('Chatwork Webhook Tenant Matcher', () => {
	it('matches tenant by account_id in webhook_event', () => {
		const req: RawWebhookRequest = {
			headers: {},
			body: {
				webhook_event_type: 'message_created',
				webhook_event: {
					account_id: 12345,
				},
			},
		};

		const match = matchChatworkTenantWebhook(req);
		expect(match).toEqual({ linkType: 'account_id', externalId: '12345' });
	});

	it('matches tenant by to_account_id in mention_to_me event', () => {
		const req: RawWebhookRequest = {
			headers: {},
			body: {
				webhook_event_type: 'mention_to_me',
				webhook_event: {
					to_account_id: 67890,
				},
			},
		};

		const match = matchChatworkTenantWebhook(req);
		expect(match).toEqual({ linkType: 'account_id', externalId: '67890' });
	});

	it('returns null when no account_id is present', () => {
		const req: RawWebhookRequest = {
			headers: {},
			body: { unknown: 'payload' },
		};

		const match = matchChatworkTenantWebhook(req);
		expect(match).toBeNull();
	});
});

describe('Chatwork OAuth Tenant Link Resolver', () => {
	it('resolves externalId directly from tokens.account_id when available', async () => {
		const tokens = {
			access_token: 'fake-token',
			token_type: 'Bearer',
			account_id: 99999,
		};

		const result = await resolveChatworkOAuthWebhookTenantLink(tokens);
		expect(result).toEqual({ linkType: 'account_id', externalId: '99999' });
	});

	it('fetches /me from Chatwork when token response omits account_id', async () => {
		const originalFetch = global.fetch;
		global.fetch = jest.fn().mockResolvedValueOnce({
			ok: true,
			json: async () => ({ account_id: 88888 }),
		} as Response);

		try {
			const tokens = {
				access_token: 'access-token-without-id',
				token_type: 'Bearer',
			};

			const result = await resolveChatworkOAuthWebhookTenantLink(tokens);
			expect(result).toEqual({ linkType: 'account_id', externalId: '88888' });
			expect(global.fetch).toHaveBeenCalledWith(
				'https://api.chatwork.com/v2/me',
				expect.objectContaining({
					headers: { Authorization: 'Bearer access-token-without-id' },
				}),
			);
		} finally {
			global.fetch = originalFetch;
		}
	});
});
