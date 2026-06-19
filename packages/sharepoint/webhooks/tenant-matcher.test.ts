import type { RawWebhookRequest } from 'corsair/core';
import {
	extractMicrosoftGraphValidationToken,
	isMicrosoftGraphValidationHandshake,
} from 'corsair/core';
import { matchSharepointTenantWebhook } from './tenant-matcher';

describe('matchSharepointTenantWebhook', () => {
	it('returns null for validationToken query param handshakes', () => {
		const request: RawWebhookRequest = {
			headers: { 'content-type': 'text/plain' },
			body: {},
			query: { validationToken: 'abc123' },
		};

		expect(isMicrosoftGraphValidationHandshake(request)).toBe(true);
		expect(matchSharepointTenantWebhook(request)).toBeNull();
	});

	it('returns null for validationToken in forwarded URI headers', () => {
		const request: RawWebhookRequest = {
			headers: {
				'x-forwarded-uri': '/webhooks/sharepoint?validationToken=abc123',
			},
			body: {},
		};

		expect(extractMicrosoftGraphValidationToken(request)).toBe('abc123');
		expect(matchSharepointTenantWebhook(request)).toBeNull();
	});

	it('extracts subscription_id from notification payloads', () => {
		const request: RawWebhookRequest = {
			headers: { 'content-type': 'application/json' },
			body: {
				value: [
					{
						subscriptionId: 'sub-123',
						clientState: 'state-456',
					},
				],
			},
		};

		expect(matchSharepointTenantWebhook(request)).toEqual({
			linkType: 'subscription_id',
			externalId: 'sub-123',
		});
	});
});
