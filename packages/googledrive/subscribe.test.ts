import { googledriveSubscribe } from './subscribe';

describe('googledriveSubscribe (BYO)', () => {
	const originalFetch = global.fetch;
	afterEach(() => {
		global.fetch = originalFetch;
	});

	it('fetches the start page token then watches changes', async () => {
		const calls: Array<{ url: string; init: any }> = [];
		global.fetch = (async (url: unknown, init: any) => {
			calls.push({ url: String(url), init });
			if ((init?.method ?? 'GET') === 'GET') {
				return { ok: true, json: async () => ({ startPageToken: '77' }) };
			}
			return { ok: true, json: async () => ({ resourceId: 'res-1' }) };
		}) as unknown as typeof fetch;

		const ctx = { keys: { get_access_token: async () => 'tok' } };
		const result = await googledriveSubscribe(ctx, {
			webhookUrl: 'https://hub.example/webhooks/uuid',
		});

		expect(result!.webhookLink.linkType).toBe('channel_id');
		expect(calls[0]!.url).toBe(
			'https://www.googleapis.com/drive/v3/changes/startPageToken',
		);
		const post = calls.find((c) => c.init?.method === 'POST')!;
		expect(post.url).toBe(
			'https://www.googleapis.com/drive/v3/changes/watch?pageToken=77',
		);
	});

	it('returns null when the start page token cannot be fetched', async () => {
		global.fetch = (async () => ({
			ok: false,
			status: 403,
			text: async () => 'nope',
		})) as unknown as typeof fetch;
		const ctx = { keys: { get_access_token: async () => 'tok' } };
		expect(
			await googledriveSubscribe(ctx, { webhookUrl: 'https://x/y' }),
		).toBeNull();
	});
});
