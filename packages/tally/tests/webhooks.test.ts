import * as crypto from 'node:crypto';

import type { RawWebhookRequest, WebhookRequest } from 'corsair/core';

import {
	createTallyMatch,
	TallyFormResponseEventSchema,
	verifyTallyWebhookSignature,
} from '../webhooks/types';

describe('createTallyMatch', () => {
	const baseHeaders = { 'tally-signature': 'sig' };

	it('returns true when tally-signature present and eventType matches', () => {
		const match = createTallyMatch('FORM_RESPONSE');
		const req: RawWebhookRequest = {
			headers: baseHeaders,
			body: JSON.stringify({
				eventType: 'FORM_RESPONSE',
				eventId: 'e1',
			}),
		};
		expect(match(req)).toBe(true);
	});

	it('returns false without tally-signature header', () => {
		const match = createTallyMatch('FORM_RESPONSE');
		const req: RawWebhookRequest = {
			headers: {},
			body: JSON.stringify({ eventType: 'FORM_RESPONSE' }),
		};
		expect(match(req)).toBe(false);
	});

	it('returns false when eventType differs', () => {
		const match = createTallyMatch('FORM_RESPONSE');
		const req: RawWebhookRequest = {
			headers: baseHeaders,
			body: JSON.stringify({ eventType: 'OTHER' }),
		};
		expect(match(req)).toBe(false);
	});

	it('matches when body is already a parsed object', () => {
		const match = createTallyMatch('X');
		const req: RawWebhookRequest = {
			headers: baseHeaders,
			body: { eventType: 'X' } as unknown,
		};
		expect(match(req)).toBe(true);
	});
});

describe('verifyTallyWebhookSignature', () => {
	const secret = 'whsec_test';
	const rawBody = '{"hello":"world"}';
	const sig = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');

	const baseRequest = (): WebhookRequest<unknown> => ({
		rawBody,
		headers: { 'tally-signature': sig },
		payload: {},
	});

	it('returns invalid when secret is missing', () => {
		const r = verifyTallyWebhookSignature(baseRequest(), undefined);
		expect(r.valid).toBe(false);
		expect(r.error).toMatch(/Missing webhook secret/);
	});

	it('returns invalid when rawBody is missing', () => {
		const req = { ...baseRequest(), rawBody: undefined };
		const r = verifyTallyWebhookSignature(req, secret);
		expect(r.valid).toBe(false);
		expect(r.error).toMatch(/raw body/);
	});

	it('returns invalid when tally-signature header is missing', () => {
		const req = { ...baseRequest(), headers: {} };
		const r = verifyTallyWebhookSignature(req, secret);
		expect(r.valid).toBe(false);
		expect(r.error).toMatch(/tally-signature/);
	});

	it('accepts tally-signature as array header', () => {
		const req: WebhookRequest<unknown> = {
			...baseRequest(),
			headers: { 'tally-signature': [sig] },
		};
		const r = verifyTallyWebhookSignature(req, secret);
		expect(r.valid).toBe(true);
	});

	it('returns valid when HMAC matches', () => {
		const r = verifyTallyWebhookSignature(baseRequest(), secret);
		expect(r.valid).toBe(true);
	});

	it('returns invalid when signature does not match', () => {
		const req: WebhookRequest<unknown> = {
			...baseRequest(),
			headers: { 'tally-signature': 'deadbeef' },
		};
		const r = verifyTallyWebhookSignature(req, secret);
		expect(r.valid).toBe(false);
		expect(r.error).toMatch(/Invalid signature/);
	});
});

describe('TallyFormResponseEventSchema', () => {
	it('parses a minimal FORM_RESPONSE payload', () => {
		const parsed = TallyFormResponseEventSchema.parse({
			eventId: 'evt_1',
			eventType: 'FORM_RESPONSE',
			createdAt: '2026-01-01T00:00:00.000Z',
			data: {
				submissionId: 'sub_1',
				formId: 'form_1',
				fields: [{ key: 'q1', label: 'Q', value: 'answer' }],
			},
		});
		expect(parsed.eventType).toBe('FORM_RESPONSE');
		expect(parsed.data.submissionId).toBe('sub_1');
		expect(parsed.data.fields).toHaveLength(1);
	});
});
