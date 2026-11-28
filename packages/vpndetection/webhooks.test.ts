import { createHmac } from 'node:crypto';
import type { RawWebhookRequest, WebhookRequest } from 'corsair/core';
import type { VpndetectionContext } from './context';
import {
	isVpndetectionDelivery,
	verifyVpndetectionWebhook,
	vpndetectionWebhooksNested,
} from './webhooks';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return {
		...actual,
		logEventFromContext: jest.fn().mockResolvedValue(undefined),
	};
});

// A Standard Webhooks secret: whsec_ + base64 of the signing key.
const KEY_BYTES = Buffer.from('vpndetection-test-signing-key-32b');
const SECRET = `whsec_${KEY_BYTES.toString('base64')}`;
const NOW = 1_764_316_800;

// The documented database.updated example.
const UPDATED = {
	type: 'database.updated',
	timestamp: '2026-10-21T06:12:03.000Z',
	data: {
		dataset: 'vpn_ip_v1',
		name: 'VPN IP',
		build: '20261021.l0ux5c',
		published_at: '2026-10-21T06:09:51.839Z',
		files: [
			{
				format: 'mmdb',
				size: 1203039,
				sha256:
					'6e2ec045663adaccbbafbafdea348108b1079e46e320cca399be2b6d1f8327e8',
				url: 'https://api.vpndetection.io/api/v1/database/download?id=vpn_ip_v1&format=mmdb&build=20261021.l0ux5c',
			},
		],
	},
};

// `never` payload: one fixture serves every handler's payload type.
type Delivery = WebhookRequest<never> & RawWebhookRequest;

function sign(id: string, timestamp: number, body: string): string {
	return createHmac('sha256', KEY_BYTES)
		.update(`${id}.${timestamp}.${body}`)
		.digest('base64');
}

function delivery(
	payload: object,
	options: { signature?: string; timestamp?: number } = {},
): Delivery {
	const rawBody = JSON.stringify(payload);
	const timestamp = options.timestamp ?? Math.floor(Date.now() / 1000);
	return {
		headers: {
			'webhook-id': 'msg_1',
			'webhook-timestamp': String(timestamp),
			'webhook-signature':
				options.signature ?? `v1,${sign('msg_1', timestamp, rawBody)}`,
			'content-type': 'application/json',
		},
		body: rawBody,
		rawBody,
		payload,
	} as unknown as Delivery;
}

function context(key: string): VpndetectionContext {
	return { key } as unknown as VpndetectionContext;
}

describe('verifyVpndetectionWebhook', () => {
	it('accepts a correct v1 signature', () => {
		const request = delivery(UPDATED, { timestamp: NOW });
		expect(verifyVpndetectionWebhook(request, SECRET, NOW)).toEqual({
			valid: true,
		});
	});

	it('accepts either signature during a rotation', () => {
		const rawBody = JSON.stringify(UPDATED);
		const good = sign('msg_1', NOW, rawBody);
		const request = delivery(UPDATED, {
			timestamp: NOW,
			signature: `v1,b2xkLXNpZw== v1,${good}`,
		});
		expect(verifyVpndetectionWebhook(request, SECRET, NOW).valid).toBe(true);
	});

	it('refuses a wrong secret, a stale timestamp and missing headers', () => {
		const request = delivery(UPDATED, { timestamp: NOW });
		const other = `whsec_${Buffer.from('another-key').toString('base64')}`;
		expect(verifyVpndetectionWebhook(request, other, NOW).valid).toBe(false);
		expect(verifyVpndetectionWebhook(request, SECRET, NOW + 301).valid).toBe(
			false,
		);
		expect(verifyVpndetectionWebhook(request, undefined, NOW).valid).toBe(
			false,
		);
		const bare = { ...request, headers: {} } as Delivery;
		expect(verifyVpndetectionWebhook(bare, SECRET, NOW).valid).toBe(false);
	});

	it('refuses a body changed after signing', () => {
		const request = delivery(UPDATED, { timestamp: NOW });
		const tampered = {
			...request,
			rawBody: (request.rawBody as string).replace('vpn_ip_v1', 'tor_ip_v1'),
		} as Delivery;
		expect(verifyVpndetectionWebhook(tampered, SECRET, NOW).valid).toBe(false);
	});
});

describe('webhooks', () => {
	it('matches a delivery by its type', () => {
		const request = delivery(UPDATED);
		expect(isVpndetectionDelivery(request)).toBe(true);
		expect(vpndetectionWebhooksNested.database.updated.match(request)).toBe(
			true,
		);
		expect(vpndetectionWebhooksNested.database.test.match(request)).toBe(false);
		expect(
			isVpndetectionDelivery({ ...request, headers: {} } as Delivery),
		).toBe(false);
		expect(isVpndetectionDelivery(delivery({ type: 'invoice.paid' }))).toBe(
			false,
		);
	});

	it('returns the parsed event for a signed delivery', async () => {
		const result = await vpndetectionWebhooksNested.database.updated.handler(
			context(SECRET),
			delivery(UPDATED),
		);
		expect(result.success).toBe(true);
		expect(result.data?.data.build).toBe('20261021.l0ux5c');
	});

	it('answers 401 for a bad signature', async () => {
		const result = await vpndetectionWebhooksNested.database.updated.handler(
			context(SECRET),
			delivery(UPDATED, { signature: 'v1,AAAA' }),
		);
		expect(result).toMatchObject({ success: false, statusCode: 401 });
	});

	it('handles delivered, delivery_failed and test events', async () => {
		const events = [
			[
				vpndetectionWebhooksNested.database.delivered,
				{
					type: 'database.delivered',
					timestamp: '2026-10-21T06:20:00.000Z',
					data: {
						destination: { id: 'd1', name: 'S3', kind: 's3' },
						build: '20261021.l0ux5c',
						files: [{ dataset: 'vpn_ip_v1', format: 'mmdb', path: 'a/b' }],
					},
				},
			],
			[
				vpndetectionWebhooksNested.database.deliveryFailed,
				{
					type: 'database.delivery_failed',
					timestamp: '2026-10-22T06:20:00.000Z',
					data: {
						destination: { id: 'd1', name: 'S3', kind: 's3' },
						failing_since: '2026-10-21T06:20:00.000Z',
						error_code: 'ACCESS_DENIED',
						error: 'AccessDenied',
					},
				},
			],
			[
				vpndetectionWebhooksNested.database.test,
				{ type: 'database.test', timestamp: '2026-10-22T06:20:00.000Z' },
			],
		] as const;
		for (const [webhook, payload] of events) {
			const request = delivery(payload);
			expect(webhook.match(request)).toBe(true);
			const result = await webhook.handler(context(SECRET), request);
			expect(result.success).toBe(true);
		}
	});
});
