import { matchContentfulTenantWebhook } from './webhooks/tenant-matcher';
import {
	createContentfulMatch,
	verifyContentfulWebhookSignature,
} from './webhooks/types';

describe('Contentful Webhooks', () => {
	describe('Webhook matching', () => {
		it('matches the correct topic for entries', () => {
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

		it('matches the correct topic for assets', () => {
			const matcher = createContentfulMatch('ContentManagement.Asset.publish');
			expect(
				matcher({
					headers: { 'x-contentful-topic': 'ContentManagement.Asset.publish' },
					body: {},
				}),
			).toBe(true);
			expect(
				matcher({
					headers: {
						'x-contentful-topic': 'ContentManagement.Asset.unpublish',
					},
					body: {},
				}),
			).toBe(false);
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
			const crypto = require('crypto');
			const secret = 'my-secret';
			const rawBody = '{"sys":{"id":"123"}}';

			const method = 'POST';
			const path = '/api/webhooks/contentful';
			const timestamp = '1710000000';
			const signedHeadersStr = 'x-contentful-timestamp,x-custom-header';

			const stringifiedHeaders = `x-contentful-timestamp:${timestamp};x-custom-header:my-custom-value`;
			const stringifiedRequest = [
				method,
				path,
				stringifiedHeaders,
				rawBody,
			].join('\n');

			const hmac = crypto.createHmac('sha256', secret);
			hmac.update(stringifiedRequest);
			const expectedSignature = hmac.digest('hex');

			const result = verifyContentfulWebhookSignature(
				{
					headers: {
						'x-contentful-signature': expectedSignature,
						'x-contentful-timestamp': timestamp,
						'x-contentful-signed-headers': signedHeadersStr,
						'x-custom-header': 'my-custom-value',
						'x-forwarded-method': method,
						'x-envoy-original-path': path,
					},
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
					headers: {
						'x-contentful-signature': 'invalid-signature',
						'x-contentful-timestamp': '1710000000',
						'x-contentful-signed-headers': 'x-contentful-timestamp',
						'x-forwarded-method': 'POST',
						'x-envoy-original-path': '/path',
					},
					payload: {},
					rawBody: '{}',
				} as any,
				'secret',
			);

			expect(result.valid).toBe(false);
			expect(result.error).toBe('Invalid webhook signature');
		});

		it('rejects missing proxy method/path headers', () => {
			const result = verifyContentfulWebhookSignature(
				{
					headers: {
						'x-contentful-signature': 'dummy',
						'x-contentful-timestamp': '1710000000',
						'x-contentful-signed-headers': 'x-contentful-timestamp',
					},
					payload: {},
					rawBody: '{}',
				} as any,
				'secret',
			);

			expect(result.valid).toBe(false);
			expect(result.error).toMatch(
				/Direct Contentful webhooks require HTTP method and path/,
			);
		});

		it('accepts hub-delivered webhooks without secret', () => {
			const result = verifyContentfulWebhookSignature(
				{
					hubVerified: true,
					headers: {},
					payload: {},
					rawBody: '{}',
				} as any,
				'',
			);
			expect(result.valid).toBe(true);
		});

		it('accepts hub-delivered webhooks with invalid signature', () => {
			const result = verifyContentfulWebhookSignature(
				{
					hubVerified: true,
					headers: {
						'x-contentful-signature': 'invalid',
					},
					payload: {},
					rawBody: '{}',
				} as any,
				'secret',
			);
			expect(result.valid).toBe(true);
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
