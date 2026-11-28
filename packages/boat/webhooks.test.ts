import { createHmac } from 'node:crypto';
import type { RawWebhookRequest, WebhookRequest } from 'corsair/core';
import { boat } from './index';
import {
	boatEventName,
	boatWebhooksNested,
	matchBoatWebhook,
	verifyBoatSignature,
} from './webhooks';

// Boat's scheme, written out here from https://docs.boat.dev/webhooks.md:
// HMAC-SHA256(secret, delivery + "." + timestamp + "." + raw body), hex, `v1=`.
const SECRET = 'whsec_boat-test-signing-secret-0123456789';
const DELIVERY = 'evt_2af97cd17a8248bb8fe37653a235bc91';

function signed(
	// `unknown` because each case sends its own payload.
	payload: unknown,
	options: {
		secret?: string;
		timestamp?: number;
		delivery?: string;
		event?: string;
	} = {},
): WebhookRequest<unknown> & RawWebhookRequest {
	const rawBody = JSON.stringify(payload);
	const delivery = options.delivery ?? DELIVERY;
	const timestamp = String(options.timestamp ?? Math.floor(Date.now() / 1000));
	const signature = createHmac('sha256', options.secret ?? SECRET)
		.update(`${delivery}.${timestamp}.${rawBody}`)
		.digest('hex');
	const type =
		options.event ??
		(typeof payload === 'object' && payload !== null && 'type' in payload
			? String((payload as { type: unknown }).type)
			: '');
	return {
		headers: {
			'x-ascii-event': type,
			'x-ascii-delivery': delivery,
			'x-ascii-timestamp': timestamp,
			'x-ascii-signature': `v1=${signature}`,
			'x-ascii-attempt': '1',
			'content-type': 'application/json',
		},
		body: payload,
		rawBody,
		// `unknown` because a test request fills only the fields the handler reads.
	} as unknown as WebhookRequest<unknown> & RawWebhookRequest;
}

// The example payload on Boat's webhooks page.
const READY = {
	id: DELIVERY,
	type: 'sandbox.ready',
	createdAt: '2026-08-11T12:00:00.000Z',
	data: {
		sandbox: { id: 'bx_23456789', name: 'Production worker' },
		previousState: 'cloning',
		state: 'ready',
	},
};
const DEGRADED = {
	id: 'evt_0123456789abcdef0123456789abcdef',
	type: 'sandbox.degraded',
	createdAt: '2026-08-11T12:05:00.000Z',
	data: {
		sandbox: { id: 'bx_23456789', name: 'Production worker' },
		state: 'ready',
		reason: 'tunnel_unreachable',
	},
};

const ctx = { key: SECRET } as never;

describe('boat webhooks', () => {
	it('verifies a Boat signature', () => {
		expect(verifyBoatSignature(signed(READY), SECRET)).toBe(true);
	});

	it('refuses a wrong secret, a stale timestamp, a changed body and a bad header', () => {
		expect(verifyBoatSignature(signed(READY), 'whsec_other')).toBe(false);
		expect(
			verifyBoatSignature(
				signed(READY, { timestamp: Math.floor(Date.now() / 1000) - 600 }),
				SECRET,
			),
		).toBe(false);
		const tampered = signed(READY);
		(tampered as { rawBody: string }).rawBody = JSON.stringify({
			...READY,
			data: { ...READY.data, state: 'error' },
		});
		expect(verifyBoatSignature(tampered, SECRET)).toBe(false);
		const swapped = signed(READY);
		(swapped.headers as Record<string, string>)['x-ascii-delivery'] =
			'evt_ffffffffffffffffffffffffffffffff';
		expect(verifyBoatSignature(swapped, SECRET)).toBe(false);
		const short = signed(READY);
		(short.headers as Record<string, string>)['x-ascii-signature'] = 'v1=abcd';
		expect(verifyBoatSignature(short, SECRET)).toBe(false);
		expect(verifyBoatSignature(signed(READY), '  ')).toBe(false);
	});

	it('matches each event to its webhook only', () => {
		expect(matchBoatWebhook(signed(READY))).toBe(true);
		expect(boatEventName(signed(DEGRADED))).toBe('sandbox.degraded');
		expect(boatWebhooksNested.sandboxes.ready.match(signed(READY))).toBe(true);
		expect(boatWebhooksNested.sandboxes.archived.match(signed(READY))).toBe(
			false,
		);
		const unsigned = {
			...signed(READY),
			headers: { 'x-ascii-event': 'sandbox.ready' },
		};
		expect(matchBoatWebhook(unsigned as never)).toBe(false);
		expect(matchBoatWebhook(signed(READY, { event: 'sandbox.unknown' }))).toBe(
			false,
		);
	});

	it('parses a verified payload and refuses an unsigned or mismatched one', async () => {
		const ok = await boatWebhooksNested.sandboxes.ready.handler(
			ctx,
			signed(READY) as never,
		);
		expect(ok).toEqual({ success: true, data: READY });
		const degraded = await boatWebhooksNested.sandboxes.degraded.handler(
			ctx,
			signed(DEGRADED, { delivery: DEGRADED.id }) as never,
		);
		expect(degraded).toMatchObject({
			success: true,
			data: { data: { reason: 'tunnel_unreachable' } },
		});
		const bad = await boatWebhooksNested.sandboxes.ready.handler(
			ctx,
			signed(READY, { secret: 'whsec_wrong' }) as never,
		);
		expect(bad).toMatchObject({ success: false, statusCode: 401 });
		// Signed, but the body's id is not the delivery that was signed for.
		const other = await boatWebhooksNested.sandboxes.ready.handler(
			ctx,
			signed(READY, { delivery: DEGRADED.id }) as never,
		);
		expect(other).toMatchObject({ success: false, statusCode: 400 });
	});

	it('reads the webhook secret from options, then the account', async () => {
		const builder = boat({ webhookSecret: SECRET }).keyBuilder as unknown as (
			ctx: unknown,
			source: string,
		) => Promise<string>;
		await expect(builder({ keys: {} }, 'webhook')).resolves.toBe(SECRET);
		const stored = boat().keyBuilder as unknown as (
			ctx: unknown,
			source: string,
		) => Promise<string>;
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
