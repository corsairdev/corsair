import type { RawWebhookRequest, WebhookRequest } from 'corsair/core';
import { matchZoominfoTenantWebhook } from './tenant-matcher';
import type { ZoominfoWebhookPayload } from './types';
import {
	createZoominfoMatch,
	verifyZoominfoWebhookSignature,
	ZOOMINFO_TOKEN_HEADER,
} from './types';

const TOKEN = 'i7MOAD4/44zzgsru6toJyiFRJhFqaiYUPwztmd1rWVOsIGbI8eY7FFtw5UQ=';

function requestWith(
	headers: Record<string, unknown>,
): WebhookRequest<ZoominfoWebhookPayload> {
	return {
		headers,
		payload: {
			webhookDetails: { id: '1', objectType: 'Contact', eventType: 'Update' },
			data: [],
		},
	} as unknown as WebhookRequest<ZoominfoWebhookPayload>;
}

describe('verification token', () => {
	it('accepts the token ZoomInfo generated for the webhook', () => {
		expect(
			verifyZoominfoWebhookSignature(
				requestWith({ [ZOOMINFO_TOKEN_HEADER]: TOKEN }),
				TOKEN,
			),
		).toEqual({ valid: true });
	});

	it('reads the header case-insensitively', () => {
		expect(
			verifyZoominfoWebhookSignature(
				requestWith({ 'X-ZoomInfo-Token': TOKEN }),
				TOKEN,
			).valid,
		).toBe(true);
	});

	it('rejects a token that does not match', () => {
		expect(
			verifyZoominfoWebhookSignature(
				requestWith({ [ZOOMINFO_TOKEN_HEADER]: `${TOKEN}x` }),
				TOKEN,
			).valid,
		).toBe(false);
	});

	it('rejects a delivery with no token header', () => {
		const result = verifyZoominfoWebhookSignature(requestWith({}), TOKEN);
		expect(result.valid).toBe(false);
		expect(result.error).toContain(ZOOMINFO_TOKEN_HEADER);
	});

	// The generator left this returning { valid: true } unconditionally, which
	// accepted any unsigned payload. It must fail closed instead.
	it('rejects everything when no token is configured', () => {
		expect(
			verifyZoominfoWebhookSignature(
				requestWith({ [ZOOMINFO_TOKEN_HEADER]: TOKEN }),
				'',
			).valid,
		).toBe(false);
	});
});

describe('event routing', () => {
	const raw = (objectType: string): RawWebhookRequest =>
		({
			body: JSON.stringify({
				webhookDetails: { id: '967763288', objectType, eventType: 'Update' },
				data: [],
			}),
		}) as unknown as RawWebhookRequest;

	it('routes a Contact delivery to the contact webhook', () => {
		expect(createZoominfoMatch('contact')(raw('Contact'))).toBe(true);
		expect(createZoominfoMatch('company')(raw('Contact'))).toBe(false);
	});

	// The docs spell the company objectType lowercase in their own examples.
	it('matches company regardless of the casing ZoomInfo sends', () => {
		expect(createZoominfoMatch('company')(raw('company'))).toBe(true);
		expect(createZoominfoMatch('company')(raw('Company'))).toBe(true);
	});

	it('ignores a body that is not a ZoomInfo delivery', () => {
		expect(
			createZoominfoMatch('contact')({
				body: 'not json',
			} as unknown as RawWebhookRequest),
		).toBe(false);
	});
});

describe('tenant matching', () => {
	it('links on the webhook id ZoomInfo repeats in every payload', () => {
		expect(
			matchZoominfoTenantWebhook({
				body: {
					webhookDetails: { id: '967763288', objectType: 'Contact' },
					data: [],
				},
			} as unknown as RawWebhookRequest),
		).toEqual({ linkType: 'tenant_external_id', externalId: '967763288' });
	});

	it('returns null when there is no webhook id to route on', () => {
		expect(
			matchZoominfoTenantWebhook({
				body: { data: [] },
			} as unknown as RawWebhookRequest),
		).toBeNull();
	});
});
