import type { RawWebhookRequest, WebhookRequest } from 'corsair/core';
import crypto from 'crypto';
import type { ConfluenceWebhookPayload } from './webhooks/types';
import {
	createConfluenceMatch,
	verifyConfluenceWebhookSignature,
} from './webhooks/types';

describe('createConfluenceMatch', () => {
	it('returns true when eventType matches', () => {
		const match = createConfluenceMatch('page_updated');
		const req: RawWebhookRequest = {
			headers: {},
			body: JSON.stringify({
				type: 'page_updated',
				created_at: 'now',
				data: {},
			}),
		};
		expect(match(req)).toBe(true);
	});

	it('returns false when eventType differs', () => {
		const match = createConfluenceMatch('page_updated');
		const req: RawWebhookRequest = {
			headers: {},
			body: JSON.stringify({
				type: 'page_created',
				created_at: 'now',
				data: {},
			}),
		};
		expect(match(req)).toBe(false);
	});

	it('matches when body is a pre-parsed object', () => {
		const match = createConfluenceMatch('page_updated');
		const req: RawWebhookRequest = {
			headers: {},
			body: { type: 'page_updated', created_at: 'now', data: {} } as unknown,
		};
		expect(match(req)).toBe(true);
	});

	it('returns false for null body', () => {
		const match = createConfluenceMatch('page_updated');
		const req: RawWebhookRequest = { headers: {}, body: null };
		expect(match(req)).toBe(false);
	});
});

describe('verifyConfluenceWebhookSignature', () => {
	const secret = 'whsec_confluence_test';
	const rawBody = '{"hello":"world"}';
	const hash = crypto
		.createHmac('sha256', secret)
		.update(rawBody)
		.digest('hex');
	const expectedSig = `sha256=${hash}`;

	const baseRequest = (): WebhookRequest<ConfluenceWebhookPayload> => ({
		rawBody,
		headers: { 'x-hub-signature': expectedSig },
		payload: { type: 'test', created_at: 'now', data: {} },
	});

	it('returns valid when signature matches', () => {
		const r = verifyConfluenceWebhookSignature(baseRequest(), secret);
		expect(r.valid).toBe(true);
		expect(r.error).toBeUndefined();
	});

	it('returns invalid when signature does not match', () => {
		const req = {
			...baseRequest(),
			headers: {
				'x-hub-signature': `sha256=${'0'.repeat(64)}`,
			},
		};
		const r = verifyConfluenceWebhookSignature(req, secret);
		expect(r.valid).toBe(false);
		expect(r.error).toMatch(/Invalid signature/);
	});

	it('returns invalid when x-hub-signature header is missing', () => {
		const req = { ...baseRequest(), headers: {} };
		const r = verifyConfluenceWebhookSignature(req, secret);
		expect(r.valid).toBe(false);
		expect(r.error).toMatch(/x-hub-signature/);
	});

	it('accepts x-hub-signature as array header', () => {
		const req: WebhookRequest<ConfluenceWebhookPayload> = {
			...baseRequest(),
			headers: { 'x-hub-signature': [expectedSig] },
		};
		const r = verifyConfluenceWebhookSignature(req, secret);
		expect(r.valid).toBe(true);
	});

	it('returns invalid on signature length mismatch', () => {
		const req = {
			...baseRequest(),
			headers: { 'x-hub-signature': 'sha256=tooshort' },
		};
		const r = verifyConfluenceWebhookSignature(req, secret);
		expect(r.valid).toBe(false);
		expect(r.error).toMatch(/Invalid signature/);
	});

	it('returns invalid when secret is not configured', () => {
		const req = { ...baseRequest(), headers: {} };
		const r = verifyConfluenceWebhookSignature(req, '');
		expect(r.valid).toBe(false);
		expect(r.error).toMatch(/Missing webhook secret/);
	});

	it('returns invalid when rawBody is missing', () => {
		const payload = { type: 'test', created_at: 'now', data: { id: '1' } };
		const payloadStr = JSON.stringify(payload);
		const payloadHash = crypto
			.createHmac('sha256', secret)
			.update(payloadStr)
			.digest('hex');
		const req: WebhookRequest<ConfluenceWebhookPayload> = {
			rawBody: undefined,
			headers: { 'x-hub-signature': `sha256=${payloadHash}` },
			payload,
		};
		const r = verifyConfluenceWebhookSignature(req, secret);
		expect(r.valid).toBe(false);
		expect(r.error).toMatch(/raw body/);
	});
});
