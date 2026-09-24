import { teamsSubscribe } from './subscribe';

type FetchCall = { url: string; init?: RequestInit };

const parsePostBody = (calls: FetchCall[]) => {
	const postCall = calls.find((call) => call.init?.method === 'POST');
	expect(postCall).toBeDefined();
	const body = postCall?.init?.body;
	expect(typeof body).toBe('string');
	return JSON.parse(body as string) as {
		resource?: string;
		changeType?: string;
		clientState?: string;
	};
};

describe('teamsSubscribe (BYO)', () => {
	const originalFetch = global.fetch;
	afterEach(() => {
		global.fetch = originalFetch;
	});

	it('resolves the user id then subscribes to their chat messages', async () => {
		const calls: FetchCall[] = [];
		global.fetch = (async (url: string | URL | Request, init?: RequestInit) => {
			const u = String(url);
			calls.push({ url: u, init });
			if ((init?.method ?? 'GET') === 'GET') {
				if (u.endsWith('/me')) {
					return {
						ok: true,
						json: async () => ({ id: 'user-1' }),
					} as Response;
				}
				return { ok: true, json: async () => ({ value: [] }) } as Response;
			}
			return { ok: true, json: async () => ({ id: 'sub-teams' }) } as Response;
		}) as typeof fetch;

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
		const body = parsePostBody(calls);
		expect(body.resource).toBe('users/user-1/chats/getAllMessages');
		expect(body.changeType).toBe('created');
	});

	it('subscribes to channel messages when per-account channel ids are set', async () => {
		const calls: FetchCall[] = [];
		global.fetch = (async (url: string | URL | Request, init?: RequestInit) => {
			calls.push({ url: String(url), init });
			if ((init?.method ?? 'GET') === 'GET') {
				return { ok: true, json: async () => ({ value: [] }) } as Response;
			}
			return {
				ok: true,
				json: async () => ({ id: 'sub-channel' }),
			} as Response;
		}) as typeof fetch;

		const ctx = {
			keys: {
				get_access_token: async () => 'tok',
				get_channel_team_id: async () => 'team-1',
				get_channel_id: async () => 'channel-1',
				set_webhook_signature: async () => {},
			},
		};
		const result = await teamsSubscribe(ctx, {
			webhookUrl: 'https://hub.example/webhooks/uuid',
			clientState: 'hub-shared-state',
		});

		expect(result!.webhookLink.externalId).toBe('sub-channel');
		const body = parsePostBody(calls);
		expect(body.resource).toBe('teams/team-1/channels/channel-1/messages');
		expect(body.clientState).toBe('hub-shared-state');
		expect(calls.some((c) => c.url.endsWith('/me'))).toBe(false);
	});

	it('returns null when only one channel identifier is configured', async () => {
		const calls: FetchCall[] = [];
		global.fetch = (async (url: string | URL | Request, init?: RequestInit) => {
			calls.push({ url: String(url), init });
			if ((init?.method ?? 'GET') === 'GET') {
				if (String(url).endsWith('/me')) {
					return {
						ok: true,
						json: async () => ({ id: 'user-1' }),
					} as Response;
				}
				return { ok: true, json: async () => ({ value: [] }) } as Response;
			}
			return { ok: true, json: async () => ({ id: 'sub-teams' }) } as Response;
		}) as typeof fetch;

		const ctx = {
			keys: {
				get_access_token: async () => 'tok',
				get_channel_team_id: async () => 'team-1',
				get_channel_id: async () => null,
				set_webhook_signature: async () => {},
			},
		};
		expect(
			await teamsSubscribe(ctx, {
				webhookUrl: 'https://hub.example/webhooks/uuid',
			}),
		).toBeNull();
		expect(calls.some((c) => c.init?.method === 'POST')).toBe(false);
	});

	it('returns null when the user id cannot be resolved', async () => {
		global.fetch = (async () =>
			new Response('unauthorized', { status: 401 })) as typeof fetch;
		const ctx = {
			keys: {
				get_access_token: async () => 'tok',
				set_webhook_signature: async () => {},
			},
		};
		expect(await teamsSubscribe(ctx, { webhookUrl: 'https://x/y' })).toBeNull();
	});
});
