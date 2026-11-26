/**
 * Signature verification, event routing and payload parsing for the four
 * Publora post events, with the envelope and headers Publora documents.
 */
import { createHmac } from 'node:crypto';
import type { RawWebhookRequest, WebhookRequest } from 'corsair/core';
import { publora } from './index';
import { demoted, failed, published, scheduled } from './webhooks/posts';
import {
	createPubloraMatch,
	isPubloraDelivery,
	verifyPubloraWebhookSignature,
} from './webhooks/types';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(async () => undefined),
}));

const SECRET = 'b6f1c3e2d4a5968778695a4b3c2d1e0f';

const PUBLISHED = {
	version: '1',
	event: 'post.published',
	timestamp: '2026-11-25T14:30:00.000Z',
	data: {
		postId: '507f1f77bcf86cd799439012',
		postGroupId: '507f1f77bcf86cd799439011',
		platform: 'linkedin',
		platformId: 'ABC123',
		postedId: 'urn:li:share:7654321',
		permalink: null,
		publishedAt: '2026-11-25T14:30:00.000Z',
	},
};

const FAILED = {
	version: '1',
	event: 'post.failed',
	timestamp: '2026-11-25T14:30:00.000Z',
	data: {
		postId: '507f1f77bcf86cd799439012',
		postGroupId: '507f1f77bcf86cd799439011',
		platform: 'threads',
		error: { code: 'PLATFORM_AUTH_EXPIRED', message: 'Token expired' },
		failedAt: '2026-11-25T14:30:00.000Z',
	},
};

const SCHEDULED = {
	version: '1',
	event: 'post.scheduled',
	timestamp: '2026-11-25T14:30:00.000Z',
	data: {
		postGroupId: '507f1f77bcf86cd799439011',
		scheduledTime: '2026-11-26T09:00:00.000Z',
		platforms: ['linkedin-ABC123', 'twitter-123456789'],
	},
};

const DEMOTED = {
	version: '1',
	event: 'post.demoted',
	timestamp: '2026-11-25T14:30:00.000Z',
	data: {
		postGroupId: '507f1f77bcf86cd799439011',
		reason: 'media_changed',
		changeType: 'attach',
		mediaFileId: '507f1f77bcf86cd799439013',
	},
};

function sign(body: string, secret = SECRET): string {
	return createHmac('sha256', secret).update(body).digest('hex');
}

function delivery(
	payload: unknown,
	headers: Record<string, string> = {},
	raw = JSON.stringify(payload),
): WebhookRequest<unknown> & RawWebhookRequest {
	return {
		payload,
		rawBody: raw,
		body: raw,
		headers: {
			'content-type': 'application/json',
			'x-publora-event': (payload as { event: string }).event,
			'x-publora-signature': sign(raw),
			...headers,
		},
	} as unknown as WebhookRequest<unknown> & RawWebhookRequest;
}

function ctxWith(key: string) {
	return {
		key,
		options: {},
		db: {},
		database: undefined,
	} as unknown as Parameters<typeof published.handler>[0];
}

describe('verifyPubloraWebhookSignature', () => {
	it('accepts the hex HMAC-SHA256 of the raw body', () => {
		expect(verifyPubloraWebhookSignature(delivery(PUBLISHED), SECRET)).toEqual({
			valid: true,
		});
	});

	it('accepts a sha256= prefix', () => {
		const raw = JSON.stringify(PUBLISHED);
		const request = delivery(PUBLISHED, {
			'x-publora-signature': `sha256=${sign(raw)}`,
		});
		expect(verifyPubloraWebhookSignature(request, SECRET)).toEqual({
			valid: true,
		});
	});

	it('rejects a body changed after signing', () => {
		const raw = JSON.stringify(PUBLISHED);
		const request = delivery(
			PUBLISHED,
			{ 'x-publora-signature': sign(raw) },
			raw.replace('ABC123', 'XYZ999'),
		);
		expect(verifyPubloraWebhookSignature(request, SECRET)).toEqual({
			valid: false,
			error: 'Invalid Publora webhook signature',
		});
	});

	it('rejects the wrong secret', () => {
		expect(
			verifyPubloraWebhookSignature(delivery(PUBLISHED), 'other-secret').valid,
		).toBe(false);
	});

	it('rejects a missing secret, raw body or header', () => {
		expect(verifyPubloraWebhookSignature(delivery(PUBLISHED), '').valid).toBe(
			false,
		);
		expect(
			verifyPubloraWebhookSignature(
				{ ...delivery(PUBLISHED), rawBody: undefined },
				SECRET,
			),
		).toEqual({ valid: false, error: 'Missing raw body' });
		const unsigned = delivery(PUBLISHED);
		(unsigned.headers as Record<string, string | undefined>)[
			'x-publora-signature'
		] = undefined;
		expect(verifyPubloraWebhookSignature(unsigned, SECRET)).toEqual({
			valid: false,
			error: 'Missing X-Publora-Signature header',
		});
	});
});

describe('matching', () => {
	it('recognises a signed Publora delivery of a handled event', () => {
		expect(isPubloraDelivery(delivery(PUBLISHED))).toBe(true);
		expect(isPubloraDelivery(delivery(DEMOTED))).toBe(true);
	});

	it('ignores unsigned requests and events it does not handle', () => {
		const unsigned = delivery(PUBLISHED);
		(unsigned.headers as Record<string, string | undefined>)[
			'x-publora-signature'
		] = undefined;
		expect(isPubloraDelivery(unsigned)).toBe(false);
		expect(
			isPubloraDelivery(delivery({ ...PUBLISHED, event: 'token.expiring' })),
		).toBe(false);
	});

	it('routes each event to its own webhook', () => {
		expect(createPubloraMatch('post.failed')(delivery(FAILED))).toBe(true);
		expect(createPubloraMatch('post.failed')(delivery(PUBLISHED))).toBe(false);
	});

	it('the plugin exposes the matcher and four post webhooks', () => {
		const plugin = publora({ key: 'sk_test', webhookSecret: SECRET });
		expect(plugin.pluginWebhookMatcher?.(delivery(SCHEDULED))).toBe(true);
		expect(Object.keys(plugin.webhooks?.posts ?? {}).sort()).toEqual([
			'demoted',
			'failed',
			'published',
			'scheduled',
		]);
	});
});

describe('handlers', () => {
	it.each([
		['published', published, PUBLISHED],
		['failed', failed, FAILED],
		['scheduled', scheduled, SCHEDULED],
		['demoted', demoted, DEMOTED],
	] as const)(
		'%s returns the parsed event for a valid delivery',
		async (_name, webhook, payload) => {
			const result = await webhook.handler(
				ctxWith(SECRET),
				delivery(payload) as never,
			);
			expect(result).toEqual({ success: true, data: payload });
		},
	);

	it('answers 401 when the signature does not verify', async () => {
		const result = await published.handler(
			ctxWith('wrong'),
			delivery(PUBLISHED) as never,
		);
		expect(result).toEqual(
			expect.objectContaining({ success: false, statusCode: 401 }),
		);
	});

	it('answers 400 for a signed body that is not the documented event', async () => {
		const broken = { ...PUBLISHED, data: { platform: 'linkedin' } };
		const result = await published.handler(
			ctxWith(SECRET),
			delivery(broken) as never,
		);
		expect(result).toEqual(
			expect.objectContaining({ success: false, statusCode: 400 }),
		);
	});
});

describe('keyBuilder', () => {
	it('uses the webhookSecret option for webhooks and the key for endpoints', async () => {
		const plugin = publora({ key: 'sk_test', webhookSecret: SECRET });
		const keys = {
			get_api_key: async () => null,
			get_webhook_signature: async () => null,
		};
		const ctx = { keys, authType: 'api_key' } as never;
		await expect(plugin.keyBuilder?.(ctx, 'webhook')).resolves.toBe(SECRET);
		await expect(plugin.keyBuilder?.(ctx, 'endpoint')).resolves.toBe('sk_test');
	});

	it('reads stored keys when no option is set', async () => {
		const plugin = publora();
		const keys = {
			get_api_key: async () => 'sk_stored',
			get_webhook_signature: async () => 'stored-secret',
		};
		const ctx = { keys, authType: 'api_key' } as never;
		await expect(plugin.keyBuilder?.(ctx, 'endpoint')).resolves.toBe(
			'sk_stored',
		);
		await expect(plugin.keyBuilder?.(ctx, 'webhook')).resolves.toBe(
			'stored-secret',
		);
	});

	it('asks for a key when none is stored', async () => {
		const plugin = publora();
		const keys = {
			get_api_key: async () => null,
			get_webhook_signature: async () => null,
		};
		await expect(
			plugin.keyBuilder?.({ keys, authType: 'api_key' } as never, 'endpoint'),
		).rejects.toThrow();
	});
});
