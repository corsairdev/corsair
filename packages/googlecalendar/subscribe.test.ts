import { googlecalendarSubscribe } from './subscribe';

describe('googlecalendarSubscribe (BYO)', () => {
	const originalFetch = global.fetch;
	afterEach(() => {
		global.fetch = originalFetch;
	});

	it('opens a watch channel on the primary calendar', async () => {
		const calls: Array<{ url: string; init: any }> = [];
		global.fetch = (async (url: unknown, init: any) => {
			calls.push({ url: String(url), init });
			return { ok: true, json: async () => ({ resourceId: 'res-1' }) };
		}) as unknown as typeof fetch;

		const ctx = { keys: { get_access_token: async () => 'tok' } };
		const result = await googlecalendarSubscribe(ctx, {
			webhookUrl: 'https://hub.example/webhooks/uuid',
		});

		expect(result!.webhookLink.linkType).toBe('channel_id');
		expect(calls[0]!.url).toBe(
			'https://www.googleapis.com/calendar/v3/calendars/primary/events/watch',
		);
		const body = JSON.parse(calls[0]!.init.body);
		expect(body.address).toBe('https://hub.example/webhooks/uuid');
		expect(body.type).toBe('web_hook');
	});
});
