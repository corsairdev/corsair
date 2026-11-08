jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn().mockResolvedValue('evt') };
});

import { createHmac } from 'node:crypto';
import type { WebhookRequest } from 'corsair/core';
import { fluxguard } from './index';
import { changeEvent } from './test-fixtures';
import { matchFluxguardTenantWebhook } from './webhooks/tenant-matcher';
import type { FluxguardChangeEvent } from './webhooks/types';
import {
	FLUXGUARD_SIGNATURE_HEADER,
	matchFluxguardWebhook,
	parseSignatureHeader,
	verifyFluxguardSignature,
} from './webhooks/types';

const SECRET = 'whsec-fluxguard-test';

function sign(body: string, timestamp = Math.floor(Date.now() / 1000)) {
	const signature = createHmac('sha256', SECRET)
		.update(`${timestamp}.${body}`)
		.digest('hex');
	return `${FLUXGUARD_SIGNATURE_HEADER} t=${timestamp},v1=${signature}`;
}

function request(
	body: unknown,
	timestamp?: number,
): WebhookRequest<FluxguardChangeEvent> {
	const raw = JSON.stringify(body);
	const header = sign(raw, timestamp);
	const [name, value] = header.split(/ (.*)/s) as [string, string];
	return {
		// Safe: the handler parses the payload with the event schema, and every
		// caller passes either the real sample delivery or a deliberate non-match.
		payload: body as FluxguardChangeEvent,
		rawBody: raw,
		headers: { [name]: value },
	};
}

describe('Fluxguard webhook verification', () => {
	it('accepts a correctly signed delivery', () => {
		const result = verifyFluxguardSignature(request(changeEvent), SECRET);
		expect(result).toEqual({ valid: true });
	});

	it('rejects a tampered body', () => {
		const req = request(changeEvent);
		req.rawBody = JSON.stringify({ ...changeEvent, url: 'https://evil.test' });
		const result = verifyFluxguardSignature(req, SECRET);
		expect(result.valid).toBe(false);
		expect(result.error).toBe('Invalid webhook signature');
	});

	it('rejects the right signature for the wrong secret', () => {
		const result = verifyFluxguardSignature(
			request(changeEvent),
			'other-secret',
		);
		expect(result.valid).toBe(false);
		expect(result.error).toBe('Invalid webhook signature');
	});

	it('rejects a delivery with no secret configured', () => {
		const result = verifyFluxguardSignature(request(changeEvent), undefined);
		expect(result.valid).toBe(false);
		expect(result.error).toMatch(/No Fluxguard webhook secret/);
	});

	it('rejects a missing signature header', () => {
		const result = verifyFluxguardSignature(
			{
				payload: changeEvent,
				rawBody: JSON.stringify(changeEvent),
				headers: {},
			},
			SECRET,
		);
		expect(result.valid).toBe(false);
		expect(result.error).toMatch(/Missing or malformed/);
	});

	it('rejects a signature older than the replay window', () => {
		const stale = Math.floor(Date.now() / 1000) - 60 * 60;
		const result = verifyFluxguardSignature(
			request(changeEvent, stale),
			SECRET,
		);
		expect(result.valid).toBe(false);
		expect(result.error).toMatch(/replay window/);
	});

	it('rejects a non-numeric timestamp', () => {
		const result = verifyFluxguardSignature(
			{
				payload: changeEvent,
				rawBody: JSON.stringify(changeEvent),
				headers: { [FLUXGUARD_SIGNATURE_HEADER]: 't=abc,v1=deadbeef' },
			},
			SECRET,
		);
		expect(result.valid).toBe(false);
		expect(result.error).toMatch(/non-numeric timestamp/);
	});

	it('refuses to verify when only a parsed body is available', () => {
		const req = request(changeEvent);
		req.rawBody = undefined;
		const result = verifyFluxguardSignature(req, SECRET);
		expect(result.valid).toBe(false);
		expect(result.error).toMatch(/raw webhook body is required/);
	});

	it('trusts a delivery the Hub already verified', () => {
		const result = verifyFluxguardSignature(
			{ payload: changeEvent, headers: {}, hubVerified: true },
			undefined,
		);
		expect(result).toEqual({ valid: true });
	});

	it('parses the timestamp and signature out of the header', () => {
		expect(parseSignatureHeader('t=1234567890,v1=0a1b2c')).toEqual({
			timestamp: '1234567890',
			signature: '0a1b2c',
		});
		expect(parseSignatureHeader(undefined)).toEqual({});
	});
});

describe('Fluxguard webhook matching', () => {
	it('matches a delivery with the signature header', () => {
		const req = request(changeEvent);
		expect(
			matchFluxguardWebhook({ headers: req.headers, body: req.rawBody }),
		).toBe(true);
	});

	it('matches a delivery by its shape when the header is missing', () => {
		expect(
			matchFluxguardWebhook({ headers: {}, body: JSON.stringify(changeEvent) }),
		).toBe(true);
	});

	it('does not match an unrelated body', () => {
		expect(
			matchFluxguardWebhook({
				headers: {},
				body: JSON.stringify({ hello: 'world' }),
			}),
		).toBe(false);
	});

	it('routes a delivery to the tenant in orgId', () => {
		expect(
			matchFluxguardTenantWebhook({
				headers: {},
				body: JSON.stringify(changeEvent),
			}),
		).toEqual({
			linkType: 'tenant_external_id',
			externalId: changeEvent.orgId,
		});
	});

	it('returns null when the body has no orgId', () => {
		expect(matchFluxguardTenantWebhook({ headers: {}, body: '{}' })).toBeNull();
	});
});

describe('Fluxguard change webhook handler', () => {
	const plugin = fluxguard({ key: 'fg-secret', webhookSecret: SECRET });

	it('returns the change event when the signature verifies', async () => {
		const result = await plugin.webhooks!.change.detected.handler(
			{ key: SECRET } as never,
			request(changeEvent),
		);

		expect(result.success).toBe(true);
		expect(result.data?.orgId).toBe(changeEvent.orgId);
	});

	it('answers 401 when the signature does not verify', async () => {
		const result = await plugin.webhooks!.change.detected.handler(
			{ key: 'wrong-secret' } as never,
			request(changeEvent),
		);

		expect(result.success).toBe(false);
		expect(result.statusCode).toBe(401);
	});

	it('answers 400 when the payload does not parse', async () => {
		const body = { url: 42, capturedAt: 'not-a-date' };
		const result = await plugin.webhooks!.change.detected.handler(
			{ key: SECRET } as never,
			request(body),
		);

		expect(result.success).toBe(false);
		expect(result.statusCode).toBe(400);
	});
});
