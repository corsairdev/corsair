import type { RawWebhookRequest, WebhookRequest } from 'corsair/core';
import * as crypto from 'crypto';
import { brandfetch } from '../index';
import { matchBrandfetchTenantWebhook } from './tenant-matcher';
import type { BrandfetchWebhookPayload } from './types';
import { verifyBrandfetchWebhookSignature } from './types';

const SECRET = 'test-webhook-secret';
const RAW_BODY = JSON.stringify({
	type: 'brand.updated',
	timestamp: '2024-01-01T00:00:00.000000Z',
	urn: 'urn:brandfetch:organization:org_123:webhook:wh_123:event:evt_123',
	data: {
		object: { id: 'brand_123', domain: 'brandfetch.com' },
		delta: {},
	},
});

function sign({
	webhookId = 'msg_123',
	timestamp = String(Date.now()),
	rawBody = RAW_BODY,
	secret = SECRET,
}: {
	webhookId?: string;
	timestamp?: string;
	rawBody?: string;
	secret?: string;
} = {}) {
	return crypto
		.createHmac('sha256', secret)
		.update(`${webhookId}.${timestamp}.${rawBody}`)
		.digest('hex');
}

function requestWith(
	headers: Record<string, string | string[] | undefined>,
	rawBody = RAW_BODY,
): WebhookRequest<BrandfetchWebhookPayload> {
	return {
		headers,
		rawBody,
		payload: JSON.parse(rawBody),
	} as WebhookRequest<BrandfetchWebhookPayload>;
}

function validHeaders(timestamp = String(Date.now())) {
	return {
		'webhook-id': 'msg_123',
		'webhook-timestamp': timestamp,
		'webhook-signature-algorithm': 'sha256',
		'webhook-signature': `v1,${sign({ timestamp })}`,
	};
}

describe('Brandfetch webhook signature verification', () => {
	it('accepts a valid Brandfetch webhook signature', () => {
		expect(
			verifyBrandfetchWebhookSignature(requestWith(validHeaders()), SECRET),
		).toEqual({ valid: true });
	});

	it('reads headers case-insensitively', () => {
		const timestamp = String(Date.now());
		expect(
			verifyBrandfetchWebhookSignature(
				requestWith({
					'Webhook-Id': 'msg_123',
					'Webhook-Timestamp': timestamp,
					'Webhook-Signature-Algorithm': 'sha256',
					'Webhook-Signature': `v1,${sign({ timestamp })}`,
				}),
				SECRET,
			).valid,
		).toBe(true);
	});

	it('rejects an invalid signature', () => {
		expect(
			verifyBrandfetchWebhookSignature(
				requestWith({
					...validHeaders(),
					'webhook-signature': `v1,${'0'.repeat(64)}`,
				}),
				SECRET,
			).valid,
		).toBe(false);
	});

	it('rejects a missing signature', () => {
		const { 'webhook-signature': _signature, ...headers } = validHeaders();

		const result = verifyBrandfetchWebhookSignature(
			requestWith(headers),
			SECRET,
		);

		expect(result.valid).toBe(false);
		expect(result.error).toContain('webhook-signature');
	});

	it('rejects a stale timestamp', () => {
		const timestamp = String(Date.now() - 6 * 60 * 1000);

		expect(
			verifyBrandfetchWebhookSignature(
				requestWith(validHeaders(timestamp)),
				SECRET,
			).valid,
		).toBe(false);
	});

	it('rejects an unsupported algorithm', () => {
		expect(
			verifyBrandfetchWebhookSignature(
				requestWith({
					...validHeaders(),
					'webhook-signature-algorithm': 'sha1',
				}),
				SECRET,
			).valid,
		).toBe(false);
	});

	it('rejects malformed signature headers', () => {
		expect(
			verifyBrandfetchWebhookSignature(
				requestWith({
					...validHeaders(),
					'webhook-signature': 'not-a-signature',
				}),
				SECRET,
			).valid,
		).toBe(false);
	});

	it('matches the plugin only when all Brandfetch Standard Webhooks headers exist', () => {
		const plugin = brandfetch();
		expect(
			plugin.pluginWebhookMatcher?.({ headers: validHeaders(), body: {} }),
		).toBe(true);
		expect(
			plugin.pluginWebhookMatcher?.({
				headers: { 'webhook-signature': 'v1,abc' },
				body: {},
			}),
		).toBe(false);
	});
});

describe('Brandfetch webhook tenant matching', () => {
	it('prefers an explicit tenant_external_id', () => {
		expect(
			matchBrandfetchTenantWebhook({
				headers: {},
				body: {
					tenant_external_id: 'tenant_123',
					urn: 'urn:brandfetch:organization:org_123:webhook:wh_123:event:evt_123',
					data: { object: { id: 'brand_123' } },
				},
			} as RawWebhookRequest),
		).toEqual({ linkType: 'tenant_external_id', externalId: 'tenant_123' });
	});

	it('uses the organization id from the webhook event URN', () => {
		expect(
			matchBrandfetchTenantWebhook({
				headers: {},
				body: JSON.parse(RAW_BODY),
			} as RawWebhookRequest),
		).toEqual({ linkType: 'tenant_external_id', externalId: 'org_123' });
	});

	it('does not use data.object.id as tenant_external_id', () => {
		expect(
			matchBrandfetchTenantWebhook({
				headers: {},
				body: {
					type: 'brand.updated',
					data: { object: { id: 'brand_123' } },
				},
			} as RawWebhookRequest),
		).toBeNull();
	});
});
