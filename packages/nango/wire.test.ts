import { createCorsair } from 'corsair/core';
import { NangoError, nango, nangoEndpointSchemas } from './index';

const api = createCorsair({ plugins: [nango({ key: 'environment-key' })] })
	.nango.api;
const fullConnection = {
	id: 1,
	connection_id: 'conn 1',
	provider_config_key: 'slack',
	provider: 'slack',
	errors: [],
	metadata: {},
	connection_config: {},
	tags: {},
	created_at: '2026-01-01',
	updated_at: '2026-01-01',
	last_fetched_at: '2026-01-01',
	credentials: { type: 'API_KEY', apiKey: 'external-key' },
};
const listedConnection = {
	id: 1,
	connection_id: 'conn 1',
	provider: 'slack',
	provider_config_key: 'slack',
	created: '2026-01-01',
	metadata: null,
	tags: {},
	errors: [],
};
const session = {
	data: {
		token: 'session-token',
		expires_at: '2026-01-01T00:00:00Z',
		connect_link: 'https://example.com/connect',
	},
};
type WireCase = {
	name: string;
	method: string;
	path: string;
	query?: Record<string, string>;
	body?: unknown;
	response: unknown;
	status?: number;
	token?: string;
	call: () => Promise<unknown>;
};
const metadata = {
	connection_id: ['one', 'two'],
	provider_config_key: 'slack',
	metadata: { cleared: null },
};
const cases: WireCase[] = [
	{
		name: 'connections.import',
		method: 'POST',
		path: '/connections',
		body: {
			provider_config_key: 'slack',
			credentials: { type: 'API_KEY', apiKey: 'external-key' },
		},
		response: fullConnection,
		call: () =>
			api.connections.import({
				provider_config_key: 'slack',
				credentials: { type: 'API_KEY', apiKey: 'external-key' },
			}),
	},
	{
		name: 'connections.list',
		method: 'GET',
		path: '/connections',
		query: { page: '2', limit: '10', 'tags[organization_id]': 'acme' },
		response: { connections: [listedConnection] },
		call: () =>
			api.connections.list({
				page: 2,
				limit: 10,
				tags: { organization_id: 'acme' },
			}),
	},
	{
		name: 'connections.get',
		method: 'GET',
		path: '/connections/conn%201',
		query: {
			provider_config_key: 'slack',
			refresh_token: 'true',
			force_refresh: 'false',
		},
		response: fullConnection,
		call: () =>
			api.connections.get({
				connectionId: 'conn 1',
				provider_config_key: 'slack',
				refresh_token: true,
				force_refresh: false,
			}),
	},
	{
		name: 'connections.patch',
		method: 'PATCH',
		path: '/connections/conn%201',
		query: { provider_config_key: 'slack' },
		body: { webhook_url_override: '' },
		response: { success: true },
		call: () =>
			api.connections.patch({
				connectionId: 'conn 1',
				provider_config_key: 'slack',
				body: { webhook_url_override: '' },
			}),
	},
	{
		name: 'connections.setMetadata',
		method: 'POST',
		path: '/connections/metadata',
		body: metadata,
		response: metadata,
		call: () => api.connections.setMetadata(metadata),
	},
	{
		name: 'connections.updateMetadata',
		method: 'PATCH',
		path: '/connections/metadata',
		body: metadata,
		response: metadata,
		call: () => api.connections.updateMetadata(metadata),
	},
	{
		name: 'connections.delete',
		method: 'DELETE',
		path: '/connections/conn%201',
		query: { provider_config_key: 'slack' },
		response: { success: true },
		call: () =>
			api.connections.delete({
				connectionId: 'conn 1',
				provider_config_key: 'slack',
			}),
	},
	{
		name: 'sessions.create',
		method: 'POST',
		path: '/connect/sessions',
		body: { tags: { end_user_id: 'u1' } },
		response: session,
		call: () => api.sessions.create({ tags: { end_user_id: 'u1' } }),
	},
	{
		name: 'sessions.reconnect',
		method: 'POST',
		path: '/connect/sessions/reconnect',
		body: { connection_id: 'conn 1', integration_id: 'slack' },
		response: session,
		call: () =>
			api.sessions.reconnect({
				connection_id: 'conn 1',
				integration_id: 'slack',
			}),
	},
	{
		name: 'sessions.get',
		method: 'GET',
		path: '/connect/session',
		token: 'session-token',
		response: {
			data: {
				endUser: null,
				allowed_integrations: ['slack'],
				connectUISettings: { showWatermark: true, defaultTheme: 'system' },
			},
		},
		call: () => api.sessions.get({ session_token: 'session-token' }),
	},
	{
		name: 'sessions.delete',
		method: 'DELETE',
		path: '/connect/session',
		token: 'session-token',
		status: 204,
		response: undefined,
		call: () => api.sessions.delete({ session_token: 'session-token' }),
	},
];

describe('Nango public HTTP seam', () => {
	afterEach(() => jest.restoreAllMocks());
	it.each(cases)(
		'$name forwards the documented request and parses the response',
		async (testCase) => {
			const fetchMock = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
				new Response(
					testCase.status === 204 ? null : JSON.stringify(testCase.response),
					{
						status: testCase.status ?? 200,
						headers: { 'Content-Type': 'application/json' },
					},
				),
			);
			expect(await testCase.call()).toEqual(testCase.response);
			expect(fetchMock).toHaveBeenCalledTimes(1);
			const call = fetchMock.mock.calls[0];
			if (!call) throw new Error('Expected an HTTP request');
			const [url, options] = call;
			const parsed = new URL(String(url));
			expect(parsed.origin).toBe('https://api.nango.dev');
			expect(parsed.pathname).toBe(testCase.path);
			expect(Object.fromEntries(parsed.searchParams)).toEqual(
				testCase.query ?? {},
			);
			expect(options?.method).toBe(testCase.method);
			expect(options?.headers).toMatchObject({
				Authorization: `Bearer ${testCase.token ?? 'environment-key'}`,
			});
			expect(
				options?.body === undefined
					? undefined
					: JSON.parse(String(options.body)),
			).toEqual(testCase.body);
		},
	);
	it('rejects unsafe connection identifiers at the public boundary', async () => {
		const fetchMock = jest.spyOn(globalThis, 'fetch');
		for (const connectionId of ['', '.', '..', 'a/b', 'a\\b', "a'b", 'a"b']) {
			await expect(
				api.connections.delete({ connectionId, provider_config_key: 'slack' }),
			).rejects.toThrow();
		}
		expect(fetchMock).not.toHaveBeenCalled();
	});
	it('rejects missing session identity and malformed credentials', () => {
		expect(
			nangoEndpointSchemas['sessions.create'].input.safeParse({}).success,
		).toBe(false);
		expect(
			nangoEndpointSchemas['sessions.create'].input.safeParse({ tags: {} })
				.success,
		).toBe(true);
		expect(
			nangoEndpointSchemas['connections.import'].input.safeParse({
				provider_config_key: 'x',
				credentials: { type: 'API_KEY' },
			}).success,
		).toBe(false);
	});
	it.each([
		{
			type: 'OAUTH2_CC' as const,
			client_id: 'id',
			client_secret: 'secret',
			token: 'token',
			client_certificate: 'certificate',
			client_private_key: 'key',
		},
		{
			type: 'APP' as const,
			app_id: 'app',
			installation_id: 'installation',
			private_key: 'key',
			webhook_secret: 'secret',
		},
		{ type: 'CUSTOM' as const, app_id: 'app', installation_id: 'installation' },
		{ type: 'TBA' as const, token_id: 'id', token_secret: 'secret' },
	])(
		'forwards import credentials for $type without stripping supported fields',
		async (credentials) => {
			const body = {
				provider_config_key: 'integration',
				credentials,
				webhook_url_override: 'https://example.com/webhook',
			};
			const fetchMock = jest
				.spyOn(globalThis, 'fetch')
				.mockResolvedValue(
					new Response(JSON.stringify(fullConnection), { status: 201 }),
				);
			await api.connections.import(body);
			expect(JSON.parse(String(fetchMock.mock.calls[0]?.[1]?.body))).toEqual(
				body,
			);
		},
	);
	it('preserves cleared full connection fields', async () => {
		const cleared = {
			...fullConnection,
			metadata: null,
			last_fetched_at: null,
			webhook_url_override: null,
			end_user: {
				id: 'u1',
				tags: null,
				email: null,
				display_name: null,
				organization: null,
			},
		};
		jest
			.spyOn(globalThis, 'fetch')
			.mockResolvedValue(
				new Response(JSON.stringify(cleared), { status: 200 }),
			);
		expect(
			await api.connections.get({
				connectionId: 'c',
				provider_config_key: 'slack',
			}),
		).toEqual(cleared);
	});
	it('uses a session token without requiring an environment key', async () => {
		const sessionApi = createCorsair({ plugins: [nango()] }).nango.api;
		const response = {
			data: {
				endUser: null,
				connectUISettings: { showWatermark: true, defaultTheme: 'system' },
			},
		};
		const fetchMock = jest
			.spyOn(globalThis, 'fetch')
			.mockResolvedValue(
				new Response(JSON.stringify(response), { status: 200 }),
			);
		expect(
			await sessionApi.sessions.get({ session_token: 'session-only' }),
		).toEqual(response);
		expect(fetchMock.mock.calls[0]?.[1]?.headers).toMatchObject({
			Authorization: 'Bearer session-only',
		});
	});
	it('propagates rate-limit details without replaying a request', async () => {
		const fetchMock = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(
				JSON.stringify({
					error: { code: 'rate_limited', message: 'Slow down' },
				}),
				{
					status: 429,
					headers: { 'retry-after': '3', 'content-type': 'application/json' },
				},
			),
		);
		try {
			await api.connections.list({});
			throw new Error('Expected request to fail');
		} catch (error) {
			expect(error).toBeInstanceOf(NangoError);
			expect(error).toMatchObject({
				status: 429,
				retryAfter: 3000,
				providerCode: 'rate_limited',
				providerMessage: 'Slow down',
			});
		}
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});
	it('rejects invalid provider responses', async () => {
		jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(JSON.stringify({ connections: [{ metadata: null }] }), {
				status: 200,
			}),
		);
		await expect(api.connections.list({})).rejects.toThrow(
			'Nango returned an invalid response',
		);
	});
});
