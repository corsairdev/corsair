import { slack } from '@corsair-dev/slack';
import { createCorsair } from 'corsair';

describe('createCorsair with a ck_cloud_ key', () => {
	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('returns a cloud tenant wrapper that issues HTTP calls', async () => {
		jest
			.spyOn(globalThis, 'fetch')
			.mockResolvedValue(
				new Response(JSON.stringify({ data: { ts: '1' } }), { status: 200 }),
			);

		const corsair = createCorsair({
			plugins: [slack()],
			multiTenancy: true,
			hub: {
				projectApiKey: 'ck_cloud_x',
				baseUrl: 'https://vm/p/api/corsair',
			},
		});

		const out = await corsair
			.withTenant('acme')
			.slack.api.messages.post({ channel: '#g', text: 'hi' });

		expect(out).toEqual({ ts: '1' });
		const [url, init] = (globalThis.fetch as jest.Mock).mock.calls[0];
		expect(url).toBe('https://vm/p/api/corsair/acme/slack/call/messages.post');
		expect((init.headers as Record<string, string>).authorization).toBe(
			'Bearer ck_cloud_x',
		);
	});

	it('returns a cloud single-tenant client when multiTenancy is not set', async () => {
		jest
			.spyOn(globalThis, 'fetch')
			.mockResolvedValue(
				new Response(JSON.stringify({ data: { ts: '1' } }), { status: 200 }),
			);

		const corsair = createCorsair({
			plugins: [slack()],
			hub: {
				projectApiKey: 'ck_cloud_x',
				baseUrl: 'https://vm/p/api/corsair',
			},
		});

		const out = await corsair.slack.api.messages.post({
			channel: '#g',
			text: 'hi',
		});
		expect(out).toEqual({ ts: '1' });
	});

	it('throws a clear error when no base URL resolves', () => {
		expect(() =>
			createCorsair({
				plugins: [slack()],
				hub: { projectApiKey: 'ck_cloud_x' },
			}),
		).toThrow(/baseUrl|CORSAIR_CLOUD_URL/);
	});

	it('resolves base URL from CORSAIR_CLOUD_URL when hub.baseUrl is absent', async () => {
		process.env.CORSAIR_CLOUD_URL = 'https://env-vm/p/api/corsair';
		jest
			.spyOn(globalThis, 'fetch')
			.mockResolvedValue(
				new Response(JSON.stringify({ data: {} }), { status: 200 }),
			);
		try {
			const corsair = createCorsair({
				plugins: [slack()],
				hub: { projectApiKey: 'ck_cloud_x' },
			});
			await corsair.slack.api.messages.post({ channel: '#g' });
			const [url] = (globalThis.fetch as jest.Mock).mock.calls[0];
			expect(url).toBe(
				'https://env-vm/p/api/corsair/default/slack/call/messages.post',
			);
		} finally {
			process.env.CORSAIR_CLOUD_URL = undefined;
		}
	});

	it('throws a deferred error for keys and permissions in cloud mode', () => {
		const corsair = createCorsair({
			plugins: [slack()],
			hub: {
				projectApiKey: 'ck_cloud_x',
				baseUrl: 'https://vm/p/api/corsair',
			},
		});

		expect(() => corsair.keys).toThrow(/cloud mode/);
		expect(() => corsair.permissions).toThrow(/cloud mode/);
	});
});
