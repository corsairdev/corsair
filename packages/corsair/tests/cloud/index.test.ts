import { slack } from '@corsair-dev/slack';
import { corsairCloud, createCorsair } from 'corsair';

describe('createCorsair with a ck_cloud_ key', () => {
	const originalCloudUrl = process.env.CORSAIR_CLOUD_URL;

	afterEach(() => {
		jest.restoreAllMocks();
		if (originalCloudUrl === undefined) {
			// biome-ignore lint/performance/noDelete: assigning undefined leaves the string "undefined"
			delete process.env.CORSAIR_CLOUD_URL;
		} else {
			process.env.CORSAIR_CLOUD_URL = originalCloudUrl;
		}
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

	it('builds a normal (non-cloud) client for a ck_cloud_ key with no resolvable base URL', () => {
		// This is the hosted runtime's own shape: it IS the cloud VM, so it holds
		// a ck_cloud_ key but never sets hub.baseUrl/CORSAIR_CLOUD_URL.
		expect(() =>
			createCorsair({
				plugins: [slack()],
				hub: {
					projectApiKey: 'ck_cloud_x',
					apiUrl: 'https://auth.corsair.dev',
				},
			}),
		).not.toThrow();
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
			// biome-ignore lint/performance/noDelete: assigning undefined leaves the string "undefined"
			delete process.env.CORSAIR_CLOUD_URL;
		}
	});

	it('single-tenant connectionStatus.get() defaults tenantId to "default", matching where calls route', async () => {
		jest
			.spyOn(globalThis, 'fetch')
			.mockResolvedValue(
				new Response(JSON.stringify({ data: {} }), { status: 200 }),
			);

		const corsair = createCorsair({
			plugins: [slack()],
			hub: {
				projectApiKey: 'ck_cloud_x',
				baseUrl: 'https://vm/p/api/corsair',
			},
		});

		await corsair.manage.connectionStatus.get();
		const [url] = (globalThis.fetch as jest.Mock).mock.calls[0];
		expect(url).toContain('tenantId=default');
	});

	it('accepts an https base URL', async () => {
		jest
			.spyOn(globalThis, 'fetch')
			.mockResolvedValue(
				new Response(JSON.stringify({ data: {} }), { status: 200 }),
			);

		const corsair = createCorsair({
			plugins: [slack()],
			hub: {
				projectApiKey: 'ck_cloud_x',
				baseUrl: 'https://x.corsair.cloud/p/api/corsair',
			},
		});

		await expect(
			corsair.slack.api.messages.post({ channel: '#g', text: 'hi' }),
		).resolves.toBeDefined();
	});

	it('rejects a non-loopback http base URL', () => {
		expect(() =>
			createCorsair({
				plugins: [slack()],
				hub: {
					projectApiKey: 'ck_cloud_x',
					baseUrl: 'http://evil.example',
				},
			}),
		).toThrow(/https/);
	});

	it('allows a loopback http base URL (mock-runtime tests)', async () => {
		jest
			.spyOn(globalThis, 'fetch')
			.mockResolvedValue(
				new Response(JSON.stringify({ data: {} }), { status: 200 }),
			);

		const corsair = createCorsair({
			plugins: [slack()],
			hub: {
				projectApiKey: 'ck_cloud_x',
				baseUrl: 'http://127.0.0.1:1234',
			},
		});

		await expect(
			corsair.slack.api.messages.post({ channel: '#g', text: 'hi' }),
		).resolves.toBeDefined();
	});

	it('multi-tenant connectionStatus.get() throws without a tenantId', () => {
		const corsair = createCorsair({
			plugins: [slack()],
			multiTenancy: true,
			hub: {
				projectApiKey: 'ck_cloud_x',
				baseUrl: 'https://vm/p/api/corsair',
			},
		});

		expect(() => corsair.manage.connectionStatus.get()).toThrow(/tenantId/);
	});

	it('multi-tenant connectionStatus.get() works with an explicit tenantId', async () => {
		jest
			.spyOn(globalThis, 'fetch')
			.mockResolvedValue(
				new Response(JSON.stringify({ data: {} }), { status: 200 }),
			);

		const corsair = createCorsair({
			plugins: [slack()],
			multiTenancy: true,
			hub: {
				projectApiKey: 'ck_cloud_x',
				baseUrl: 'https://vm/p/api/corsair',
			},
		});

		await corsair.manage.connectionStatus.get({ tenantId: 'acme' });
		const [url] = (globalThis.fetch as jest.Mock).mock.calls[0];
		expect(url).toContain('tenantId=acme');
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

describe('corsairCloud', () => {
	afterEach(() => jest.restoreAllMocks());

	// Resolve response reused by the tests that route a call through an instance.
	const instanceResolve = (instanceKey: string, url: string) =>
		new Response(JSON.stringify({ instances: [{ instanceKey, url }] }), {
			status: 200,
		});

	it('routes a call over HTTP with no plugin list, multi-tenant by default', async () => {
		jest.spyOn(globalThis, 'fetch').mockImplementation(async (url) => {
			if (String(url) === 'https://vm/p/instances') {
				return instanceResolve('users', 'https://vm/users');
			}
			return new Response(JSON.stringify({ data: { ok: true } }), {
				status: 200,
			});
		});

		const corsair = corsairCloud({
			apiKey: 'ck_cloud_x',
			url: 'https://vm/p/api/corsair',
		});

		const out = await corsair
			.withInstance('users')
			.withTenant('acme')
			.notion.api.pages.searchPage({});

		expect(out).toEqual({ ok: true });
		const [url, init] = (globalThis.fetch as jest.Mock).mock.calls[1];
		expect(url).toBe('https://vm/users/acme/notion/call/pages.searchPage');
		expect((init.headers as Record<string, string>).authorization).toBe(
			'Bearer ck_cloud_x',
		);
	});

	it('accepts any plugin id dynamically (the VM is the authority)', async () => {
		jest.spyOn(globalThis, 'fetch').mockImplementation(async (url) => {
			if (String(url) === 'https://vm/p/instances') {
				return instanceResolve('users', 'https://vm/users');
			}
			return new Response(JSON.stringify({ data: {} }), { status: 200 });
		});
		const corsair = corsairCloud({
			apiKey: 'ck_cloud_x',
			url: 'https://vm/p/api/corsair',
		});
		// A plugin no client-side list would know still resolves to an HTTP call.
		await expect(
			corsair
				.withInstance('users')
				.withTenant('acme')
				.anyplugin.api.some.op({}),
		).resolves.toBeDefined();
	});

	it('resolves the api.corsair.cloud URL from a ck_cloud_<slug>.<secret> key', async () => {
		jest.spyOn(globalThis, 'fetch').mockImplementation(async (url) => {
			if (String(url) === 'https://api.corsair.cloud/envh/instances') {
				return instanceResolve(
					'users',
					'https://api.corsair.cloud/envh/i/users',
				);
			}
			return new Response(JSON.stringify({ data: { ok: true } }), {
				status: 200,
			});
		});
		const corsair = corsairCloud({ apiKey: 'ck_cloud_envh.secret123' });
		await corsair
			.withInstance('users')
			.withTenant('acme')
			.notion.api.pages.searchPage({});
		const [url] = (globalThis.fetch as jest.Mock).mock.calls[1];
		expect(url).toBe(
			'https://api.corsair.cloud/envh/i/users/acme/notion/call/pages.searchPage',
		);
	});

	it('requires apiKey, a resolvable key or explicit url, and rejects non-loopback http', () => {
		expect(() => corsairCloud({ apiKey: '' })).toThrow(/apiKey/);
		// A key with no slug+secret and no url can't resolve a base URL.
		expect(() => corsairCloud({ apiKey: 'ck_cloud_x' })).toThrow(
			/resolve|url/i,
		);
		// An older slug-less key (base64url secret, no '.') can't resolve either —
		// it falls through to the same error rather than a wrong URL.
		expect(() => corsairCloud({ apiKey: 'ck_cloud_abc_def123' })).toThrow(
			/resolve|url/i,
		);
		// An explicit http override is still rejected (bearer token in cleartext).
		expect(() =>
			corsairCloud({ apiKey: 'ck_cloud_x', url: 'http://evil.example' }),
		).toThrow(/https/);
	});

	it('withInstance resolves the instance URL from the project key, then routes the op', async () => {
		const fetchMock = jest
			.spyOn(globalThis, 'fetch')
			.mockImplementation(async (url) => {
				if (String(url) === 'https://vm/p/instances') {
					return new Response(
						JSON.stringify({
							instances: [{ instanceKey: 'users', url: 'https://vm/users' }],
						}),
						{ status: 200 },
					);
				}
				return new Response(JSON.stringify({ data: { ok: true } }), {
					status: 200,
				});
			});

		const corsair = corsairCloud({
			apiKey: 'ck_cloud_x',
			url: 'https://vm/p/api/corsair',
		});

		const out = await corsair
			.withInstance('users')
			.withTenant('acme')
			.notion.api.pages.searchPage({});

		expect(out).toEqual({ ok: true });
		const calls = (fetchMock as unknown as jest.Mock).mock.calls;
		const [resolveUrl, resolveInit] = calls[0];
		expect(resolveUrl).toBe('https://vm/p/instances');
		expect((resolveInit as RequestInit).headers).toMatchObject({
			authorization: 'Bearer ck_cloud_x',
		});
		const [invokeUrl] = calls[1];
		expect(invokeUrl).toBe(
			'https://vm/users/acme/notion/call/pages.searchPage',
		);
	});

	it('withInstance rejects for a name absent from the resolved instance map', async () => {
		jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(
				JSON.stringify({
					instances: [{ instanceKey: 'users', url: 'https://vm/users' }],
				}),
				{ status: 200 },
			),
		);

		const corsair = corsairCloud({
			apiKey: 'ck_cloud_x',
			url: 'https://vm/p/api/corsair',
		});

		await expect(
			corsair
				.withInstance('nope')
				.withTenant('acme')
				.notion.api.pages.searchPage({}),
		).rejects.toThrow(/no such instance/);
	});

	it('caches the instance resolve across multiple withInstance calls', async () => {
		const fetchMock = jest
			.spyOn(globalThis, 'fetch')
			.mockImplementation(async (url) => {
				if (String(url) === 'https://vm/p/instances') {
					return new Response(
						JSON.stringify({
							instances: [
								{ instanceKey: 'users', url: 'https://vm/users' },
								{ instanceKey: 'feed', url: 'https://vm/feed' },
							],
						}),
						{ status: 200 },
					);
				}
				return new Response(JSON.stringify({ data: {} }), { status: 200 });
			});

		const corsair = corsairCloud({
			apiKey: 'ck_cloud_x',
			url: 'https://vm/p/api/corsair',
		});

		await Promise.all([
			corsair
				.withInstance('users')
				.withTenant('a')
				.notion.api.pages.searchPage({}),
			corsair
				.withInstance('feed')
				.withTenant('a')
				.notion.api.pages.searchPage({}),
		]);

		const resolveCalls = fetchMock.mock.calls.filter(
			([url]) => String(url) === 'https://vm/p/instances',
		);
		expect(resolveCalls).toHaveLength(1);
	});

	it('scopes connectionStatus to the instance (routed to the instance URL)', async () => {
		jest.spyOn(globalThis, 'fetch').mockImplementation(async (url) => {
			if (String(url) === 'https://vm/p/instances') {
				return instanceResolve('users', 'https://vm/users');
			}
			return new Response(JSON.stringify({ data: {} }), { status: 200 });
		});
		const corsair = corsairCloud({
			apiKey: 'ck_cloud_x',
			url: 'https://vm/p/api/corsair',
		});
		await corsair
			.withInstance('users')
			.connectionStatus.get({ tenantId: 'acme' });
		const [url] = (globalThis.fetch as jest.Mock).mock.calls[1];
		expect(url).toBe('https://vm/users/connection-status?tenantId=acme');
	});

	it('exposes project-scoped tenants on manage', async () => {
		jest
			.spyOn(globalThis, 'fetch')
			.mockResolvedValue(
				new Response(JSON.stringify([{ id: 'acme' }]), { status: 200 }),
			);
		const corsair = corsairCloud({
			apiKey: 'ck_cloud_x',
			url: 'https://vm/p/api/corsair',
		});
		await corsair.manage.tenants.list();
		const [url] = (globalThis.fetch as jest.Mock).mock.calls[0];
		expect(url).toBe('https://vm/p/api/corsair/tenants');
	});
});
