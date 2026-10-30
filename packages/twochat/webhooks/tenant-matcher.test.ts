import { matchTwoChatTenantWebhook } from './tenant-matcher';

describe('matchTwoChatTenantWebhook', () => {
	it('returns null — inbound webhooks are out of spec', () => {
		expect(
			matchTwoChatTenantWebhook({
				headers: {},
				body: {
					to_number: '+525522334455',
					channel_phone_number: '+595981445566',
				},
			}),
		).toBeNull();
	});
});
