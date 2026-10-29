import { onedriveSubscribe } from './subscribe';

describe('onedriveSubscribe (BYO)', () => {
	const originalFetch = global.fetch;
	afterEach(() => {
		global.fetch = originalFetch;
	});

	it('subscribes to the drive root with changeType updated', async () => {
		const calls: Array<{ url: string; init: any }> = [];
		global.fetch = (async (url: unknown, init: any) => {
			calls.push({ url: String(url), init });
			if ((init?.method ?? 'GET') === 'GET') {
				return { ok: true, json: async () => ({ value: [] }) };
			}
			return { ok: true, json: async () => ({ id: 'sub-od' }) };
		}) as unknown as typeof fetch;

		const ctx = {
			keys: {
				get_access_token: async () => 'tok',
				set_webhook_signature: async () => {},
			},
		};
		const result = await onedriveSubscribe(ctx, {
			webhookUrl: 'https://hub.example/webhooks/uuid',
		});

		expect(result!.webhookLink).toEqual({
			linkType: 'subscription_id',
			externalId: 'sub-od',
		});
		const body = JSON.parse(
			calls.find((c) => c.init?.method === 'POST')!.init.body,
		);
		expect(body.resource).toBe('me/drive/root');
		expect(body.changeType).toBe('updated');
	});
});
