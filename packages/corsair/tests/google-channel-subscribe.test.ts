import { googleChannelSubscribe } from '../core/webhooks/google-channel-subscribe';

describe('googleChannelSubscribe (shared BYO channel watch)', () => {
	const originalFetch = global.fetch;
	afterEach(() => {
		global.fetch = originalFetch;
	});

	it('POSTs the watch request and returns channel_id link + token secret', async () => {
		const calls: Array<{ url: string; init: any }> = [];
		global.fetch = (async (url: unknown, init: any) => {
			calls.push({ url: String(url), init });
			return { ok: true, json: async () => ({ resourceId: 'res-1' }) };
		}) as unknown as typeof fetch;

		const ctx = { keys: { get_access_token: async () => 'tok-g' } };
		const result = await googleChannelSubscribe(ctx, {
			webhookUrl: 'https://hub.example/webhooks/uuid',
			watchUrl:
				'https://www.googleapis.com/calendar/v3/calendars/primary/events/watch',
		});

		expect(result).toEqual({
			webhookLink: { linkType: 'channel_id', externalId: expect.any(String) },
			webhookSecret: expect.any(String),
		});

		const post = calls[0]!;
		expect(post.init.method).toBe('POST');
		expect(post.init.headers.authorization).toBe('Bearer tok-g');
		const body = JSON.parse(post.init.body);
		expect(body.id).toBe(result!.webhookLink.externalId);
		expect(body.type).toBe('web_hook');
		expect(body.address).toBe('https://hub.example/webhooks/uuid');
		expect(body.token).toBe(result!.webhookSecret);
	});

	it('merges extra body fields into the watch request', async () => {
		let sent: any;
		global.fetch = (async (_url: unknown, init: any) => {
			sent = JSON.parse(init.body);
			return { ok: true, json: async () => ({}) };
		}) as unknown as typeof fetch;

		const ctx = { keys: { get_access_token: async () => 'tok' } };
		await googleChannelSubscribe(ctx, {
			webhookUrl: 'https://x/y',
			watchUrl: 'https://www.googleapis.com/drive/v3/changes/watch?pageToken=7',
			body: { extra: 'field' },
		});
		expect(sent.extra).toBe('field');
	});

	it('returns null when there is no access token', async () => {
		const ctx = { keys: { get_access_token: async () => null } };
		expect(
			await googleChannelSubscribe(ctx, {
				webhookUrl: 'https://x/y',
				watchUrl: 'https://w/z',
			}),
		).toBeNull();
	});

	it('throws on a non-ok watch response', async () => {
		global.fetch = (async () => ({
			ok: false,
			status: 401,
			text: async () => 'invalid credentials',
		})) as unknown as typeof fetch;
		const ctx = { keys: { get_access_token: async () => 'tok' } };
		await expect(
			googleChannelSubscribe(ctx, {
				webhookUrl: 'https://x/y',
				watchUrl: 'https://w/z',
			}),
		).rejects.toThrow(/401/);
	});
});
