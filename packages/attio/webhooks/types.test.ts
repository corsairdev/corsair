import { createHmac } from 'node:crypto';
import type { RawWebhookRequest, WebhookRequest } from 'corsair/core';
import {
	createAttioMatch,
	hasAttioSignatureHeader,
	recordEventsFromPayload,
	verifyAttioWebhookSignature,
} from './types';

const SECRET = 'attio-webhook-secret';

function signBody(body: string, secret = SECRET): string {
	return createHmac('sha256', secret).update(body).digest('hex');
}

function request(
	payload: Record<string, unknown>,
	options?: {
		headers?: Record<string, string | string[] | undefined>;
		rawBody?: string | undefined;
		omitRawBody?: boolean;
	},
): WebhookRequest<Record<string, unknown>> {
	const rawBody = options?.omitRawBody
		? undefined
		: (options?.rawBody ?? JSON.stringify(payload));
	return {
		payload,
		rawBody,
		headers: options?.headers ?? {},
	};
}

const recordCreated = {
	event_type: 'record.created',
	id: {
		workspace_id: 'ws-1',
		object_id: 'obj-1',
		record_id: 'rec-1',
	},
};

describe('verifyAttioWebhookSignature', () => {
	it('rejects an empty secret', () => {
		const body = JSON.stringify(recordCreated);
		expect(
			verifyAttioWebhookSignature(
				request(recordCreated, {
					rawBody: body,
					headers: { 'attio-signature': signBody(body) },
				}),
				'',
			),
		).toEqual({
			valid: false,
			error: 'Missing webhook signing secret configuration',
		});
	});

	it('rejects when rawBody is missing', () => {
		expect(
			verifyAttioWebhookSignature(
				request(recordCreated, {
					omitRawBody: true,
					headers: { 'attio-signature': 'abc' },
				}),
				SECRET,
			),
		).toEqual({
			valid: false,
			error: 'Missing raw body for signature verification',
		});
	});

	it('rejects when the signature header is missing', () => {
		const body = JSON.stringify(recordCreated);
		expect(
			verifyAttioWebhookSignature(
				request(recordCreated, { rawBody: body }),
				SECRET,
			),
		).toEqual({
			valid: false,
			error: 'Missing attio-signature header',
		});
	});

	it('accepts HMAC-SHA256 of the raw body in attio-signature', () => {
		const body = JSON.stringify(recordCreated);
		expect(
			verifyAttioWebhookSignature(
				request(recordCreated, {
					rawBody: body,
					headers: { 'attio-signature': signBody(body) },
				}),
				SECRET,
			),
		).toEqual({ valid: true });
	});

	it('accepts HMAC-SHA256 of the raw body in x-attio-signature', () => {
		const body = JSON.stringify(recordCreated);
		expect(
			verifyAttioWebhookSignature(
				request(recordCreated, {
					rawBody: body,
					headers: { 'x-attio-signature': signBody(body) },
				}),
				SECRET,
			),
		).toEqual({ valid: true });
	});

	it('reads the first value when the signature header is an array', () => {
		const body = JSON.stringify(recordCreated);
		expect(
			verifyAttioWebhookSignature(
				request(recordCreated, {
					rawBody: body,
					headers: { 'attio-signature': [signBody(body), 'other'] },
				}),
				SECRET,
			),
		).toEqual({ valid: true });
	});

	it('rejects a Stripe-style t=,v1= signature header', () => {
		const body = JSON.stringify(recordCreated);
		const timestamp = String(Math.floor(Date.now() / 1000));
		const stripeSig = createHmac('sha256', SECRET)
			.update(`${timestamp}.${body}`)
			.digest('hex');
		expect(
			verifyAttioWebhookSignature(
				request(recordCreated, {
					rawBody: body,
					headers: {
						'attio-signature': `t=${timestamp},v1=${stripeSig}`,
					},
				}),
				SECRET,
			),
		).toEqual({ valid: false, error: 'Signature mismatch' });
	});

	it('rejects a mismatched signature', () => {
		const body = JSON.stringify(recordCreated);
		expect(
			verifyAttioWebhookSignature(
				request(recordCreated, {
					rawBody: body,
					headers: { 'attio-signature': signBody(body, 'other-secret') },
				}),
				SECRET,
			),
		).toEqual({ valid: false, error: 'Signature mismatch' });
	});
});

describe('createAttioMatch', () => {
	const matchCreated = createAttioMatch('record.created');

	it('matches a top-level event_type', () => {
		const requestBody: RawWebhookRequest = {
			headers: {},
			body: recordCreated,
		};
		expect(matchCreated(requestBody)).toBe(true);
	});

	it('matches event_type inside an events array', () => {
		const requestBody: RawWebhookRequest = {
			headers: {},
			body: { webhook_id: 'wh-1', events: [recordCreated] },
		};
		expect(matchCreated(requestBody)).toBe(true);
	});

	it('does not match a different event type', () => {
		expect(
			matchCreated({
				headers: {},
				body: { event_type: 'record.updated', id: recordCreated.id },
			}),
		).toBe(false);
	});
});

describe('recordEventsFromPayload', () => {
	it('returns the top-level event when it matches', () => {
		expect(recordEventsFromPayload(recordCreated, 'record.created')).toEqual([
			recordCreated,
		]);
	});

	it('unpacks matching events from an Attio envelope', () => {
		expect(
			recordEventsFromPayload(
				{
					webhook_id: 'wh-1',
					events: [
						recordCreated,
						{ event_type: 'record.updated', id: recordCreated.id },
					],
				},
				'record.created',
			),
		).toEqual([recordCreated]);
	});
});

describe('hasAttioSignatureHeader', () => {
	it('detects Attio and X-Attio signature headers', () => {
		expect(hasAttioSignatureHeader({ 'attio-signature': 'abc' })).toBe(true);
		expect(hasAttioSignatureHeader({ 'X-Attio-Signature': 'abc' })).toBe(true);
		expect(hasAttioSignatureHeader({ 'x-attio-signature': 'abc' })).toBe(true);
		expect(hasAttioSignatureHeader({})).toBe(false);
	});
});
