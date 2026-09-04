import type { RawWebhookRequest, WebhookRequest } from 'corsair/core';
import crypto from 'crypto';
import {
	createHubSpotEventMatch,
	verifyHubSpotWebhookSignature,
} from './types';

describe('verifyHubSpotWebhookSignature', () => {
	const secret = 'hubspot-test-secret';
	const payload = [
		{
			eventId: '100',
			subscriptionId: 12345,
			portalId: 67890,
			occurredAt: 1670000000,
			subscriptionType: 'contact.creation',
			attemptNumber: 0,
			objectId: 999,
		},
	];
	const rawBody = JSON.stringify(payload);

	const sign = (key: string, body: string = rawBody) =>
		crypto.createHmac('sha256', key).update(body).digest('hex');

	it('returns error when webhook secret is undefined', () => {
		const request: WebhookRequest<unknown> = {
			payload,
			rawBody,
			headers: { 'x-hubspot-signature-v3': sign(secret) },
		};

		const result = verifyHubSpotWebhookSignature(request, undefined);
		expect(result).toEqual({
			valid: false,
			error: 'Missing webhook secret',
		});
	});

	it('returns error when webhook secret is empty string', () => {
		const request: WebhookRequest<unknown> = {
			payload,
			rawBody,
			headers: { 'x-hubspot-signature-v3': sign(secret) },
		};

		const result = verifyHubSpotWebhookSignature(request, '');
		expect(result).toEqual({
			valid: false,
			error: 'Missing webhook secret',
		});
	});

	it('returns error when raw body is missing', () => {
		const request: WebhookRequest<unknown> = {
			payload,
			rawBody: undefined as unknown as string,
			headers: { 'x-hubspot-signature-v3': sign(secret) },
		};

		const result = verifyHubSpotWebhookSignature(request, secret);
		expect(result).toEqual({
			valid: false,
			error: 'Missing raw body for signature verification',
		});
	});

	it('returns error when x-hubspot-signature-v3 header is missing', () => {
		const request: WebhookRequest<unknown> = {
			payload,
			rawBody,
			headers: {},
		};

		const result = verifyHubSpotWebhookSignature(request, secret);
		expect(result).toEqual({
			valid: false,
			error: 'Missing x-hubspot-signature-v3 header',
		});
	});

	it('returns error when signature is invalid', () => {
		const request: WebhookRequest<unknown> = {
			payload,
			rawBody,
			headers: { 'x-hubspot-signature-v3': sign('wrong-secret') },
		};

		const result = verifyHubSpotWebhookSignature(request, secret);
		expect(result).toEqual({
			valid: false,
			error: 'Invalid signature',
		});
	});

	it('returns valid for correctly signed request', () => {
		const request: WebhookRequest<unknown> = {
			payload,
			rawBody,
			headers: { 'x-hubspot-signature-v3': sign(secret) },
		};

		const result = verifyHubSpotWebhookSignature(request, secret);
		expect(result).toEqual({ valid: true });
	});

	it('accepts signature header as an array', () => {
		const request: WebhookRequest<unknown> = {
			payload,
			rawBody,
			headers: { 'x-hubspot-signature-v3': [sign(secret)] },
		};

		const result = verifyHubSpotWebhookSignature(request, secret);
		expect(result).toEqual({ valid: true });
	});
});

describe('createHubSpotEventMatch', () => {
	const matcher = createHubSpotEventMatch('contact.creation');

	it('matches single event object with correct subscriptionType', () => {
		const request: RawWebhookRequest = {
			headers: {},
			body: { subscriptionType: 'contact.creation', objectId: 123 },
		};
		expect(matcher(request)).toBe(true);
	});

	it('matches event array containing matching subscriptionType', () => {
		const request: RawWebhookRequest = {
			headers: {},
			body: [
				{ subscriptionType: 'deal.creation', objectId: 456 },
				{ subscriptionType: 'contact.creation', objectId: 123 },
			],
		};
		expect(matcher(request)).toBe(true);
	});

	it('parses JSON string body and matches correctly', () => {
		const request: RawWebhookRequest = {
			headers: {},
			body: JSON.stringify([
				{ subscriptionType: 'contact.creation', objectId: 123 },
			]),
		};
		expect(matcher(request)).toBe(true);
	});

	it('returns false when subscriptionType does not match', () => {
		const request: RawWebhookRequest = {
			headers: {},
			body: [{ subscriptionType: 'company.creation', objectId: 789 }],
		};
		expect(matcher(request)).toBe(false);
	});

	it('returns false for invalid body payloads', () => {
		const request: RawWebhookRequest = {
			headers: {},
			body: null,
		};
		expect(matcher(request)).toBe(false);
	});
});
