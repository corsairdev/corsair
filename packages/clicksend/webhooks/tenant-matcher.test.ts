import { matchClickSendTenantWebhook } from './tenant-matcher';

describe('matchClickSendTenantWebhook', () => {
	it('resolves Basic auth passwords via api_key link type', () => {
		const basic = Buffer.from('clicksend:my-api-key').toString('base64');
		expect(
			matchClickSendTenantWebhook({
				headers: { authorization: `Basic ${basic}` },
				body: {},
				query: {},
			}),
		).toEqual({ linkType: 'api_key', externalId: 'my-api-key' });
	});

	it('preserves Basic auth passwords that contain colons', () => {
		const basic = Buffer.from('clicksend:alpha:beta').toString('base64');
		expect(
			matchClickSendTenantWebhook({
				headers: { authorization: `Basic ${basic}` },
				body: {},
				query: {},
			}),
		).toEqual({ linkType: 'api_key', externalId: 'alpha:beta' });
	});

	it('resolves webhook tokens via webhook_signature link type', () => {
		expect(
			matchClickSendTenantWebhook({
				headers: { 'x-clicksend-token': 'hook-secret' },
				body: {},
				query: {},
			}),
		).toEqual({ linkType: 'webhook_signature', externalId: 'hook-secret' });
	});
});
