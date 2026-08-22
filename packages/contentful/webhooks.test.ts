import { matchContentfulTenantWebhook } from './webhooks/tenant-matcher';
import {
	createContentfulMatch,
	verifyContentfulWebhookSignature,
} from './webhooks/types';

describe('Contentful Webhooks', () => {
	describe('Webhook matching', () => {
		it('matches the correct topic', () => {
			const matcher = createContentfulMatch('ContentManagement.Entry.publish');
			expect(
				matcher({
					headers: { 'x-contentful-topic': 'ContentManagement.Entry.publish' },
					body: {},
				}),
			).toBe(true);
			expect(
				matcher({
					headers: {
						'x-contentful-topic': 'ContentManagement.Entry.unpublish',
					},
					body: {},
				}),
			).toBe(false);
			expect(matcher({ headers: {}, body: {} })).toBe(false);
		});
	});

	describe('Signature verification', () => {
		it('rejects missing secrets', () => {
			const result = verifyContentfulWebhookSignature(
				{ headers: {}, payload: {}, rawBody: '{}' } as any,
				'',
			);
			expect(result.valid).toBe(false);
			expect(result.error).toBe('Missing webhook secret');
		});

		it('rejects missing signatures', () => {
			const result = verifyContentfulWebhookSignature(
				{ headers: {}, payload: {}, rawBody: '{}' } as any,
				'secret',
			);
			expect(result.valid).toBe(false);
			expect(result.error).toBe('Missing x-contentful-signature header');
		});

		it('rejects missing rawBody', () => {
			const result = verifyContentfulWebhookSignature(
				{ headers: { 'x-contentful-signature': 'abc' }, payload: {} } as any,
				'secret',
			);
			expect(result.valid).toBe(false);
			expect(result.error).toBe('Missing raw body for signature verification');
		});

		it('accepts valid signatures', () => {
			// To generate valid signature for testing:
			const crypto = require('crypto');
			const secret = 'my-secret';
			const rawBody = '{"sys":{"id":"123"}}';
			const hmac = crypto.createHmac('sha256', secret);
			hmac.update(rawBody);
			const expectedSignature = hmac.digest('base64');

			const result = verifyContentfulWebhookSignature(
				{
					headers: { 'x-contentful-signature': expectedSignature },
					payload: JSON.parse(rawBody),
					rawBody,
				} as any,
				secret,
			);

			expect(result.valid).toBe(true);
		});

		it('rejects invalid signatures', () => {
			const result = verifyContentfulWebhookSignature(
				{
					headers: { 'x-contentful-signature': 'invalid-signature' },
					payload: {},
					rawBody: '{}',
				} as any,
				'secret',
			);

			expect(result.valid).toBe(false);
			expect(result.error).toBe('Invalid webhook signature');
		});
	});

	describe('Tenant matcher', () => {
		it('returns null on missing body', () => {
			expect(
				matchContentfulTenantWebhook({ headers: {}, body: null }),
			).toBeNull();
		});

		it('returns null on malformed body', () => {
			expect(
				matchContentfulTenantWebhook({ headers: {}, body: { foo: 'bar' } }),
			).toBeNull();
			expect(
				matchContentfulTenantWebhook({ headers: {}, body: { sys: {} } }),
			).toBeNull();
			expect(
				matchContentfulTenantWebhook({
					headers: {},
					body: { sys: { space: {} } },
				}),
			).toBeNull();
		});

		it('extracts space ID', () => {
			const payload = {
				sys: {
					space: {
						sys: {
							id: 'space-123',
						},
					},
				},
			};
			expect(
				matchContentfulTenantWebhook({ headers: {}, body: payload }),
			).toEqual({ linkType: 'account_id', externalId: 'space-123' });
		});
	});
});
