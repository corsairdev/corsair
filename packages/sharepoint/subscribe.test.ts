import { sharepointSubscribe } from './subscribe';

describe('sharepointSubscribe (BYO)', () => {
	const originalFetch = global.fetch;
	afterEach(() => {
		global.fetch = originalFetch;
	});

	it('resolves the root site then subscribes to its drive root', async () => {
		const calls: Array<{ url: string; init: any }> = [];
		global.fetch = (async (url: unknown, init: any) => {
			const u = String(url);
			calls.push({ url: u, init });
			if ((init?.method ?? 'GET') === 'GET') {
				if (u.endsWith('/sites/root')) {
					return {
						ok: true,
						json: async () => ({ id: 'contoso.sharepoint.com,g1,g2' }),
					};
				}
				return { ok: true, json: async () => ({ value: [] }) };
			}
			return { ok: true, json: async () => ({ id: 'sub-sp' }) };
		}) as unknown as typeof fetch;

		const ctx = {
			keys: {
				get_access_token: async () => 'tok',
				set_webhook_signature: async () => {},
			},
		};
		const result = await sharepointSubscribe(ctx, {
			webhookUrl: 'https://hub.example/webhooks/uuid',
		});

		expect(result!.webhookLink.externalId).toBe('sub-sp');
		const body = JSON.parse(
			calls.find((c) => c.init?.method === 'POST')!.init.body,
		);
		expect(body.resource).toBe('sites/contoso.sharepoint.com,g1,g2/drive/root');
		expect(body.changeType).toBe('updated');
	});

	it('returns null when the root site cannot be resolved', async () => {
		global.fetch = (async () => ({
			ok: false,
			status: 404,
			text: async () => 'no site',
		})) as unknown as typeof fetch;
		const ctx = {
			keys: {
				get_access_token: async () => 'tok',
				set_webhook_signature: async () => {},
			},
		};
		expect(
			await sharepointSubscribe(ctx, { webhookUrl: 'https://x/y' }),
		).toBeNull();
	});
});
