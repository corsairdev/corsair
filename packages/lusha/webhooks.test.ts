import type { WebhookRequest } from 'corsair/core';
import crypto from 'crypto';
import { lusha } from './index';
import { makeCtx } from './test-helpers';
import {
	matchLushaWebhook,
	optOutReceived,
	signalReceived,
	verifyLushaSignature,
} from './webhooks';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const SECRET = 'whsec_test_secret';
const TIMESTAMP = '1768407395841';

// The payloads documented under Create Subscription and Opt-out.
const signal = {
	id: 'f3b87e05-0402-4f3e-8e26-6a38fd0ad62c',
	type: 'promotion',
	entityType: 'contact',
	entityId: '4158887495',
	subscriptionId: '507f1f77bcf86cd799439011',
	data: {
		personId: 4158887495,
		currentCompanyName: 'OMG Hospitality Group LLC',
		currentTitle: 'Bartender',
		signalDate: '2025-07-01',
	},
	timestamp: '2026-01-14T16:16:35.841Z',
	billing: { creditsCharged: 1 },
};

const optOut = {
	contactId: '987654321',
	fullName: 'Jane Doe',
	companyName: 'Acme Corp',
	contactOptOutDate: '2026-04-22 14:32:11.412',
	datapoints: [
		{ datapointId: '+14155550199', datapointType: 'phone' },
		{ datapointId: 'jane.doe@acme.com', datapointType: 'email' },
	],
	partnerClientId: 'acme-crm-tenant-42',
};

/** Signs the way Lusha's docs show: hex HMAC-SHA256 of `${timestamp}.${body}`. */
function sign(body: string, secret = SECRET, timestamp = TIMESTAMP): string {
	return crypto
		.createHmac('sha256', secret)
		.update(`${timestamp}.${body}`)
		.digest('hex');
}

// unknown: payloads are the JSON objects above.
function delivery(
	payload: unknown,
	headers: Record<string, string> = {},
	rawBody = JSON.stringify(payload),
): WebhookRequest<never> {
	return {
		payload: payload as never,
		rawBody,
		headers: {
			'x-lusha-signature': sign(rawBody),
			'x-lusha-timestamp': TIMESTAMP,
			...headers,
		},
	};
}

function ctxWith(key: string) {
	return { ...makeCtx(), key };
}

describe('Lusha webhook signature', () => {
	it('accepts the documented signature', () => {
		expect(verifyLushaSignature(delivery(signal), SECRET)).toEqual({
			valid: true,
		});
	});

	it('accepts a raw body with whitespace when the payload re-serialises to the signed text', () => {
		const pretty = JSON.stringify(signal, null, 2);
		const request = delivery(
			signal,
			{
				'x-lusha-signature': sign(JSON.stringify(signal)),
			},
			pretty,
		);
		expect(verifyLushaSignature(request, SECRET).valid).toBe(true);
	});

	it('rejects a wrong secret, a changed body and a changed timestamp', () => {
		expect(verifyLushaSignature(delivery(signal), 'other').valid).toBe(false);
		const tampered = delivery(signal);
		tampered.rawBody = JSON.stringify({ ...signal, type: 'companyChange' });
		tampered.payload = JSON.parse(tampered.rawBody) as never;
		expect(verifyLushaSignature(tampered, SECRET).valid).toBe(false);
		expect(
			verifyLushaSignature(
				delivery(signal, { 'x-lusha-timestamp': '1768407395842' }),
				SECRET,
			).valid,
		).toBe(false);
	});

	it('rejects a delivery with no secret configured or no headers', () => {
		expect(verifyLushaSignature(delivery(signal), '').valid).toBe(false);
		const unsigned = delivery(signal);
		unsigned.headers = {};
		expect(verifyLushaSignature(unsigned, SECRET).valid).toBe(false);
	});

	it('trusts a delivery the Hub already verified', () => {
		const request = { ...delivery(signal), headers: {}, hubVerified: true };
		expect(verifyLushaSignature(request, undefined).valid).toBe(true);
	});
});

describe('Lusha webhook matching', () => {
	it('claims only signed Lusha payloads', () => {
		const signed = { 'x-lusha-signature': 'abc' };
		expect(matchLushaWebhook({ headers: signed, body: signal })).toBe(true);
		expect(matchLushaWebhook({ headers: signed, body: optOut })).toBe(true);
		expect(matchLushaWebhook({ headers: {}, body: signal })).toBe(false);
		expect(
			matchLushaWebhook({ headers: signed, body: { event: 'other' } }),
		).toBe(false);
	});

	it('routes signals and opt-outs to their own handlers', () => {
		const headers = { 'X-Lusha-Signature': 'abc' };
		expect(
			signalReceived.match({ headers, body: JSON.stringify(signal) }),
		).toBe(true);
		expect(signalReceived.match({ headers, body: optOut })).toBe(false);
		expect(optOutReceived.match({ headers, body: optOut })).toBe(true);
		expect(optOutReceived.match({ headers, body: signal })).toBe(false);
	});
});

describe('Lusha webhook handlers', () => {
	it('acknowledges a signal the way Lusha requires', async () => {
		const result = await signalReceived.handler(
			ctxWith(SECRET) as never,
			delivery(signal),
		);
		expect(result.success).toBe(true);
		expect(result.statusCode).toBe(201);
		expect(result.returnToSender).toMatchObject({
			received: true,
			webhookId: signal.id,
		});
		expect(result.data).toMatchObject({ type: 'promotion' });
	});

	it('refuses an unsigned or forged signal with 401', async () => {
		const forged = delivery(signal, { 'x-lusha-signature': '0'.repeat(64) });
		const result = await signalReceived.handler(
			ctxWith(SECRET) as never,
			forged,
		);
		expect(result).toMatchObject({ success: false, statusCode: 401 });
	});

	it('passes an opt-out through with its data points', async () => {
		const result = await optOutReceived.handler(
			ctxWith(SECRET) as never,
			delivery(optOut),
		);
		expect(result.success).toBe(true);
		expect(result.data?.datapoints).toHaveLength(2);
		expect(result.returnToSender).toMatchObject({ received: true });
	});

	it('takes the secret from options, else the stored webhook_signature', async () => {
		type KeyBuilder = (ctx: unknown, source: string) => Promise<string>;
		const fromOptions = lusha({ webhookSecret: 'opt-secret' })
			.keyBuilder as unknown as KeyBuilder;
		const stored = lusha().keyBuilder as unknown as KeyBuilder;
		const keys = { get_webhook_signature: async () => 'stored-secret' };
		await expect(fromOptions({ keys }, 'webhook')).resolves.toBe('opt-secret');
		await expect(stored({ keys }, 'webhook')).resolves.toBe('stored-secret');
		await expect(
			stored({ keys: { get_webhook_signature: async () => null } }, 'webhook'),
		).resolves.toBe('');
	});
});
