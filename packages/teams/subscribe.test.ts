import { teamsSubscribe } from './subscribe';

describe('teamsSubscribe (BYO)', () => {
	const originalFetch = global.fetch;
	afterEach(() => {
		global.fetch = originalFetch;
	});

	it('resolves the user id then subscribes to their chat messages', async () => {
		const calls: Array<{ url: string; init: any }> = [];
		global.fetch = (async (url: unknown, init: any) => {
			const u = String(url);
			calls.push({ url: u, init });
			if ((init?.method ?? 'GET') === 'GET') {
				if (u.endsWith('/me')) {
					return { ok: true, json: async () => ({ id: 'user-1' }) };
				}
				return { ok: true, json: async () => ({ value: [] }) };
			}
			return { ok: true, json: async () => ({ id: 'sub-teams' }) };
		}) as unknown as typeof fetch;

		const ctx = {
			keys: {
				get_access_token: async () => 'tok',
				set_webhook_signature: async () => {},
			},
		};
		const result = await teamsSubscribe(ctx, {
			webhookUrl: 'https://hub.example/webhooks/uuid',
		});

		expect(result!.webhookLink.externalId).toBe('sub-teams');
		const body = JSON.parse(
			calls.find((c) => c.init?.method === 'POST')!.init.body,
		);
		expect(body.resource).toBe('users/user-1/chats/getAllMessages');
		expect(body.changeType).toBe('created');
	});

	it('returns null when the user id cannot be resolved', async () => {
		global.fetch = (async () => ({
			ok: false,
			status: 401,
			text: async () => 'unauthorized',
		})) as unknown as typeof fetch;
		const ctx = {
			keys: {
				get_access_token: async () => 'tok',
				set_webhook_signature: async () => {},
			},
		};
		expect(await teamsSubscribe(ctx, { webhookUrl: 'https://x/y' })).toBeNull();
	});
});
