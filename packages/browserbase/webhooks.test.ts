import { createHmac } from 'node:crypto';
import type { RawWebhookRequest, WebhookRequest } from 'corsair/core';
import { browserbase } from './index';
import {
	browserbaseWebhooksNested,
	matchBrowserbaseWebhook,
	verifyBrowserbaseSignature,
} from './webhooks';

// Standard Webhooks, written out here from standardwebhooks.com (spec.md).
const KEY = Buffer.from('bb-test-signing-key-0123456789').toString('base64');
const SECRET = `whsec_${KEY}`;

function signed(
	// `unknown` because each case sends its own payload.
	payload: unknown,
	options: { secret?: string; timestamp?: number } = {},
): WebhookRequest<unknown> & RawWebhookRequest {
	const rawBody = JSON.stringify(payload);
	const id = 'msg_2bbx';
	const timestamp = String(options.timestamp ?? Math.floor(Date.now() / 1000));
	const raw = options.secret ?? SECRET;
	const key = Buffer.from(
		raw.startsWith('whsec_') ? raw.slice(6) : raw,
		'base64',
	);
	const signature = createHmac('sha256', key)
		.update(`${id}.${timestamp}.${rawBody}`)
		.digest('base64');
	return {
		headers: {
			'webhook-id': id,
			'webhook-timestamp': timestamp,
			'webhook-signature': `v1,${signature}`,
		},
		body: payload,
		rawBody,
		// `unknown` because a test request fills only the fields the handler reads.
	} as unknown as WebhookRequest<unknown> & RawWebhookRequest;
}

// The envelope on Browserbase's webhooks overview page.
const COMPLETED = {
	id: '85e6ff2d-91de-468a-867c-e0d9e4587063',
	type: 'functions.invocations.completed',
	resourceId: 'a3f1c2d4-7b90-4e51-9c8a-2f6d1e0b4c73',
	data: { status: 'COMPLETED' },
};
const ctx = { key: SECRET } as never;

describe('browserbase webhooks', () => {
	it('verifies a Standard Webhooks signature, with or without whsec_', () => {
		expect(verifyBrowserbaseSignature(signed(COMPLETED), SECRET)).toBe(true);
		expect(verifyBrowserbaseSignature(signed(COMPLETED), KEY)).toBe(true);
	});

	it('refuses a wrong secret, a stale timestamp and a changed body', () => {
		const other = `whsec_${Buffer.from('other').toString('base64')}`;
		expect(verifyBrowserbaseSignature(signed(COMPLETED), other)).toBe(false);
		expect(
			verifyBrowserbaseSignature(
				signed(COMPLETED, {
					timestamp: Math.floor(Date.now() / 1000) - 600,
				}),
				SECRET,
			),
		).toBe(false);
		const tampered = signed(COMPLETED);
		tampered.rawBody = JSON.stringify({ ...COMPLETED, resourceId: 'x' });
		expect(verifyBrowserbaseSignature(tampered, SECRET)).toBe(false);
	});

	it('matches each event type to its webhook', () => {
		expect(matchBrowserbaseWebhook(signed(COMPLETED))).toBe(true);
		expect(
			browserbaseWebhooksNested.invocations.completed.match(signed(COMPLETED)),
		).toBe(true);
		expect(
			browserbaseWebhooksNested.invocations.failed.match(signed(COMPLETED)),
		).toBe(false);
		expect(
			browserbaseWebhooksNested.builds.failed.match(
				signed({ ...COMPLETED, type: 'functions.builds.failed' }),
			),
		).toBe(true);
		expect(matchBrowserbaseWebhook(signed({ ...COMPLETED, type: 'x.y' }))).toBe(
			false,
		);
		expect(matchBrowserbaseWebhook({ ...signed(COMPLETED), headers: {} })).toBe(
			false,
		);
	});

	it('parses a verified event and refuses a forged one', async () => {
		await expect(
			browserbaseWebhooksNested.invocations.completed.handler(
				ctx,
				signed(COMPLETED) as never,
			),
		).resolves.toEqual({ success: true, data: COMPLETED });
		await expect(
			browserbaseWebhooksNested.invocations.completed.handler(
				ctx,
				signed(COMPLETED, {
					secret: `whsec_${Buffer.from('forged').toString('base64')}`,
				}) as never,
			),
		).resolves.toMatchObject({ success: false, statusCode: 401 });
	});

	it('reads the webhook secret from options, then the account', async () => {
		type Builder = (ctx: unknown, source: string) => Promise<string>;
		const fromOptions = browserbase({ webhookSecret: SECRET })
			.keyBuilder as unknown as Builder;
		await expect(fromOptions({ keys: {} }, 'webhook')).resolves.toBe(SECRET);
		const stored = browserbase().keyBuilder as unknown as Builder;
		await expect(
			stored(
				{ keys: { get_webhook_signature: () => Promise.resolve(SECRET) } },
				'webhook',
			),
		).resolves.toBe(SECRET);
		await expect(
			stored(
				{ keys: { get_webhook_signature: () => Promise.resolve(null) } },
				'webhook',
			),
		).rejects.toThrow();
	});
});
