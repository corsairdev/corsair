import { createCorsair } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { nango, nangoEndpointSchemas } from './index';

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
	created_at: '2026-01-01T00:00:00.000Z',
	updated_at: '2026-01-01T00:00:00.000Z',
	last_fetched_at: '2026-01-01T00:00:00.000Z',
	credentials: { type: 'API_KEY', apiKey: 'external-key' },
};
const { credentials: _credentials, ...connectionWithoutCredentials } =
	fullConnection;
const listedConnection = {
	id: 1,
	connection_id: 'conn 1',
	provider: 'slack',
	provider_config_key: 'slack',
	created: '2026-01-01T00:00:00.000Z',
	metadata: null,
	tags: { end_user_id: 'u1' },
	errors: [],
};
const session = {
	data: {
		token: 'session-token',
		expires_at: '2026-01-01T00:00:00Z',
		connect_link: 'https://connect.nango.dev?session_token=session-token',
	},
};
const integration = {
	unique_key: 'echo',
	display_name: 'Private API (Generic)',
	provider: 'private-api-generic',
	logo: 'https://app.nango.dev/images/template-logos/private-api-generic.svg',
	created_at: '2026-01-01T00:00:00.000Z',
	updated_at: '2026-01-01T00:00:00.000Z',
	forward_webhooks: true,
	missing_fields: [],
};
const fn = {
	name: 'fetch-issues',
	type: 'sync',
	returns: ['Issue'],
	json_schema: null,
	runs: 'every hour',
	auto_start: true,
	track_deletes: false,
	id: 3,
	enabled: true,
	last_deployed: '2026-01-01T00:00:00.000Z',
	source: 'catalog',
};
const provider = {
	name: 'github',
	display_name: 'GitHub',
	auth_mode: 'OAUTH2',
	categories: ['dev-tools'],
	proxy: { base_url: 'https://api.github.com' },
};
const echo = { method: 'GET', url: 'https://postman-echo.com/get' };

// A case per operation: the request that must reach the wire and the response
// it gets. Bodies and responses differ per operation.
type WireCase = {
	name: string;
	method: string;
	path: string;
	query?: Record<string, string | string[]>;
	headers?: Record<string, string>;
	// unknown: each operation sends its own body shape.
	body?: unknown;
	// unknown: each operation receives its own response shape.
	response: unknown;
	// unknown: what the operation returns when it differs from the response.
	expected?: unknown;
	status?: number;
	// unknown: each callback returns its operation's own result type.
	call: () => Promise<unknown>;
};

const cases: WireCase[] = [
	{
		name: 'connections.import',
		method: 'POST',
		path: '/connections',
		body: {
			provider_config_key: 'slack',
			connection_id: 'conn 1',
			credentials: { type: 'API_KEY', apiKey: 'external-key' },
			tags: { end_user_id: 'u1' },
		},
		response: fullConnection,
		expected: connectionWithoutCredentials,
		call: () =>
			api.connections.import({
				provider_config_key: 'slack',
				connection_id: 'conn 1',
				credentials: { type: 'API_KEY', apiKey: 'external-key' },
				tags: { end_user_id: 'u1' },
			}),
	},
	{
		name: 'connections.list',
		method: 'GET',
		path: '/connections',
		query: { page: '2', limit: '10', 'tags[end_user_id]': 'u1' },
		response: { connections: [listedConnection] },
		call: () =>
			api.connections.list({
				page: 2,
				limit: 10,
				tags: { end_user_id: 'u1' },
			}),
	},
	{
		name: 'connections.get (credentials dropped by default)',
		method: 'GET',
		path: '/connections/conn%201',
		query: { provider_config_key: 'slack', force_refresh: 'true' },
		response: fullConnection,
		expected: connectionWithoutCredentials,
		call: () =>
			api.connections.get({
				connectionId: 'conn 1',
				provider_config_key: 'slack',
				force_refresh: true,
			}),
	},
	{
		name: 'connections.get (include_credentials)',
		method: 'GET',
		path: '/connections/conn%201',
		query: { provider_config_key: 'slack' },
		response: fullConnection,
		call: () =>
			api.connections.get({
				connectionId: 'conn 1',
				provider_config_key: 'slack',
				include_credentials: true,
			}),
	},
	{
		name: 'connections.patch',
		method: 'PATCH',
		path: '/connections/conn%201',
		query: { provider_config_key: 'slack' },
		body: { tags: { plan: 'pro' } },
		response: { success: true },
		call: () =>
			api.connections.patch({
				connectionId: 'conn 1',
				provider_config_key: 'slack',
				body: { tags: { plan: 'pro' } },
			}),
	},
	{
		name: 'connections.setMetadata',
		method: 'POST',
		path: '/connections/metadata',
		body: {
			connection_id: ['one', 'two'],
			provider_config_key: 'slack',
			metadata: { label: 'a' },
		},
		response: {
			connection_id: ['one', 'two'],
			provider_config_key: 'slack',
			metadata: { label: 'a' },
		},
		status: 201,
		call: () =>
			api.connections.setMetadata({
				connection_id: ['one', 'two'],
				provider_config_key: 'slack',
				metadata: { label: 'a' },
			}),
	},
	{
		name: 'connections.updateMetadata',
		method: 'PATCH',
		path: '/connections/metadata',
		body: {
			connection_id: 'one',
			provider_config_key: 'slack',
			metadata: { cleared: null },
		},
		response: {
			connection_id: 'one',
			provider_config_key: 'slack',
			metadata: { cleared: null },
		},
		call: () =>
			api.connections.updateMetadata({
				connection_id: 'one',
				provider_config_key: 'slack',
				metadata: { cleared: null },
			}),
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
		body: { tags: { end_user_id: 'u1' }, allowed_integrations: ['slack'] },
		response: session,
		status: 201,
		call: () =>
			api.sessions.create({
				tags: { end_user_id: 'u1' },
				allowed_integrations: ['slack'],
			}),
	},
	{
		name: 'sessions.reconnect',
		method: 'POST',
		path: '/connect/sessions/reconnect',
		body: { connection_id: 'conn 1', integration_id: 'slack' },
		response: session,
		status: 201,
		call: () =>
			api.sessions.reconnect({
				connection_id: 'conn 1',
				integration_id: 'slack',
			}),
	},
	{
		name: 'integrations.list',
		method: 'GET',
		path: '/integrations',
		response: { data: [integration] },
		call: () => api.integrations.list({}),
	},
	{
		name: 'integrations.get',
		method: 'GET',
		path: '/integrations/echo',
		query: { include: ['webhook', 'credentials'] },
		response: {
			data: {
				...integration,
				webhook_url: null,
				credentials: {
					type: 'INTEGRATION_CONFIG',
					auth_mode: 'API_KEY',
					integration_config: { baseUrl: 'https://postman-echo.com' },
				},
			},
		},
		call: () =>
			api.integrations.get({
				uniqueKey: 'echo',
				include: ['webhook', 'credentials'],
			}),
	},
	{
		name: 'integrations.create',
		method: 'POST',
		path: '/integrations',
		body: {
			unique_key: 'echo',
			provider: 'private-api-generic',
			integration_config: {
				baseUrl: 'https://postman-echo.com',
				keyName: 'X-Test-Key',
			},
		},
		response: { data: integration },
		call: () =>
			api.integrations.create({
				unique_key: 'echo',
				provider: 'private-api-generic',
				integration_config: {
					baseUrl: 'https://postman-echo.com',
					keyName: 'X-Test-Key',
				},
			}),
	},
	{
		name: 'integrations.update',
		method: 'PATCH',
		path: '/integrations/echo',
		body: { display_name: 'Echo' },
		response: { data: { ...integration, display_name: 'Echo' } },
		call: () =>
			api.integrations.update({ uniqueKey: 'echo', display_name: 'Echo' }),
	},
	{
		name: 'integrations.delete',
		method: 'DELETE',
		path: '/integrations/echo',
		response: { success: true },
		call: () => api.integrations.delete({ uniqueKey: 'echo' }),
	},
	{
		name: 'functions.list',
		method: 'GET',
		path: '/integrations/github/functions',
		query: { type: 'sync', page: '0', limit: '50' },
		response: { data: [fn], pagination: { total: 1, page: 0, limit: 50 } },
		call: () =>
			api.functions.list({
				uniqueKey: 'github',
				type: 'sync',
				page: 0,
				limit: 50,
			}),
	},
	{
		name: 'functions.get',
		method: 'GET',
		path: '/integrations/github/functions/fetch-issues',
		query: { type: 'sync' },
		response: { data: fn },
		call: () =>
			api.functions.get({
				uniqueKey: 'github',
				name: 'fetch-issues',
				type: 'sync',
			}),
	},
	{
		name: 'functions.getCode',
		method: 'GET',
		path: '/integrations/github/functions/fetch-issues/code',
		response: { type: 'sync', code: 'export default {}' },
		call: () =>
			api.functions.getCode({ uniqueKey: 'github', name: 'fetch-issues' }),
	},
	{
		name: 'functions.delete',
		method: 'DELETE',
		path: '/integrations/github/functions/fetch-issues',
		query: { type: 'sync' },
		response: { data: { success: true } },
		call: () =>
			api.functions.delete({
				uniqueKey: 'github',
				name: 'fetch-issues',
				type: 'sync',
			}),
	},
	{
		name: 'scripts.getConfig',
		method: 'GET',
		path: '/scripts/config',
		query: { format: 'nango' },
		response: [{ providerConfigKey: 'github', syncs: [], actions: [] }],
		call: () => api.scripts.getConfig({ format: 'nango' }),
	},
	{
		name: 'providers.list',
		method: 'GET',
		path: '/providers',
		query: { search: 'github' },
		response: { data: [provider] },
		call: () => api.providers.list({ search: 'github' }),
	},
	{
		name: 'providers.get',
		method: 'GET',
		path: '/providers/github',
		response: { data: provider },
		call: () => api.providers.get({ provider: 'github' }),
	},
	{
		name: 'syncs.trigger',
		method: 'POST',
		path: '/sync/trigger',
		body: {
			provider_config_key: 'github',
			connection_id: 'conn 1',
			syncs: [{ name: 'issues', variant: 'base' }],
			opts: { reset: true },
		},
		response: { success: true },
		call: () =>
			api.syncs.trigger({
				provider_config_key: 'github',
				connection_id: 'conn 1',
				syncs: [{ name: 'issues', variant: 'base' }],
				opts: { reset: true },
			}),
	},
	{
		name: 'syncs.start',
		method: 'POST',
		path: '/sync/start',
		body: { provider_config_key: 'github', syncs: ['issues'] },
		response: { success: true },
		call: () =>
			api.syncs.start({ provider_config_key: 'github', syncs: ['issues'] }),
	},
	{
		name: 'syncs.pause',
		method: 'POST',
		path: '/sync/pause',
		body: { provider_config_key: 'github', syncs: ['issues'] },
		response: { success: true },
		call: () =>
			api.syncs.pause({ provider_config_key: 'github', syncs: ['issues'] }),
	},
	{
		name: 'syncs.status',
		method: 'GET',
		path: '/sync/status',
		query: {
			provider_config_key: 'github',
			syncs: '*',
			connection_id: 'conn 1',
		},
		response: {
			syncs: [
				{
					id: 's1',
					connection_id: 'conn 1',
					name: 'issues',
					status: 'SUCCESS',
					finishedAt: '2026-01-01T00:00:00.000Z',
					nextScheduledSyncAt: null,
					frequency: 'every hour',
					latestResult: { Issue: { added: 1, updated: 0, deleted: 0 } },
					recordCount: { Issue: 1 },
					checkpoint: null,
				},
			],
		},
		call: () =>
			api.syncs.status({
				provider_config_key: 'github',
				syncs: '*',
				connection_id: 'conn 1',
			}),
	},
	{
		name: 'syncs.updateFrequency',
		method: 'PUT',
		path: '/sync/update-connection-frequency',
		body: {
			provider_config_key: 'github',
			connection_id: 'conn 1',
			sync_name: 'issues',
			frequency: null,
		},
		response: { frequency: 'every hour' },
		call: () =>
			api.syncs.updateFrequency({
				provider_config_key: 'github',
				connection_id: 'conn 1',
				sync_name: 'issues',
				frequency: null,
			}),
	},
	{
		name: 'records.list',
		method: 'GET',
		path: '/records',
		query: {
			model: 'Issue',
			limit: '2',
			ids: ['a', 'b'],
			cursor: 'c1',
		},
		headers: { 'Connection-Id': 'conn 1', 'Provider-Config-Key': 'github' },
		response: {
			records: [
				{
					id: 'a',
					title: 'Bug',
					_nango_metadata: {
						deleted_at: null,
						last_action: 'ADDED',
						first_seen_at: '2026-01-01T00:00:00.000Z',
						last_modified_at: '2026-01-01T00:00:00.000Z',
						cursor: 'c2',
						pruned_at: null,
					},
				},
			],
			next_cursor: null,
		},
		call: () =>
			api.records.list({
				connection_id: 'conn 1',
				provider_config_key: 'github',
				model: 'Issue',
				limit: 2,
				ids: ['a', 'b'],
				cursor: 'c1',
			}),
	},
	{
		name: 'tools.call',
		method: 'POST',
		path: '/connections/conn%201/tools/create-issue/calls',
		headers: { 'Provider-Config-Key': 'github' },
		body: { input: { title: 'Bug' } },
		response: { id: 7 },
		call: () =>
			api.tools.call({
				connectionId: 'conn 1',
				name: 'create-issue',
				provider_config_key: 'github',
				input: { title: 'Bug' },
			}),
	},
	{
		name: 'actions.trigger',
		method: 'POST',
		path: '/action/trigger',
		headers: { 'Connection-Id': 'conn 1', 'Provider-Config-Key': 'github' },
		body: { action_name: 'create-issue', input: { title: 'Bug' } },
		response: { id: 7 },
		call: () =>
			api.actions.trigger({
				connection_id: 'conn 1',
				provider_config_key: 'github',
				action_name: 'create-issue',
				input: { title: 'Bug' },
			}),
	},
	{
		name: 'environment.getVariables',
		method: 'GET',
		path: '/environment-variables',
		response: [{ name: 'REGION', value: 'eu' }],
		call: () => api.environment.getVariables({}),
	},
	{
		name: 'proxy.get',
		method: 'GET',
		path: '/proxy/get',
		query: { q: 'a b' },
		headers: {
			'Connection-Id': 'conn 1',
			'Provider-Config-Key': 'echo',
			'Nango-Proxy-X-Trace': 't1',
			Retries: '2',
		},
		response: echo,
		call: () =>
			api.proxy.get({
				connection_id: 'conn 1',
				provider_config_key: 'echo',
				path: '/get',
				query: { q: 'a b' },
				headers: { 'X-Trace': 't1' },
				retries: 2,
			}),
	},
	...(['post', 'put', 'patch', 'delete'] as const).map(
		(verb): WireCase => ({
			name: `proxy.${verb}`,
			method: verb.toUpperCase(),
			path: `/proxy/v1/items/a%20b`,
			headers: { 'Connection-Id': 'conn 1', 'Provider-Config-Key': 'echo' },
			body: { name: 'corsair-plugin-test' },
			response: { ok: true },
			call: () =>
				api.proxy[verb]({
					connection_id: 'conn 1',
					provider_config_key: 'echo',
					path: 'v1/items/a b',
					body: { name: 'corsair-plugin-test' },
				}),
		}),
	),
];

function mockFetch(
	// unknown: any JSON body, or a string for a non-JSON reply.
	body: unknown,
	status = 200,
	headers: Record<string, string> = { 'Content-Type': 'application/json' },
) {
	return jest
		.spyOn(globalThis, 'fetch')
		.mockImplementation(
			async () =>
				new Response(
					status === 204
						? null
						: typeof body === 'string'
							? body
							: JSON.stringify(body),
					{ status, headers },
				),
		);
}

describe('nango wire format', () => {
	afterEach(() => jest.restoreAllMocks());

	it('covers every operation', () => {
		const covered = new Set(cases.map((c) => c.name.split(' ')[0]));
		expect([...covered].sort()).toEqual(
			Object.keys(nangoEndpointSchemas).sort(),
		);
	});

	it.each(cases)(
		'$name sends the documented request and parses the response',
		async (testCase) => {
			const fetchMock = mockFetch(testCase.response, testCase.status ?? 200);
			expect(await testCase.call()).toEqual(
				testCase.expected ?? testCase.response,
			);
			expect(fetchMock).toHaveBeenCalledTimes(1);
			const [url, options] = fetchMock.mock.calls[0] ?? [];
			const parsed = new URL(String(url));
			expect(parsed.origin).toBe('https://api.nango.dev');
			expect(parsed.pathname).toBe(testCase.path);
			const query: Record<string, string | string[]> = {};
			for (const key of new Set(parsed.searchParams.keys())) {
				const values = parsed.searchParams.getAll(key);
				query[key] = values.length > 1 ? values : (values[0] ?? '');
			}
			expect(query).toEqual(testCase.query ?? {});
			expect(options?.method).toBe(testCase.method);
			const headers = new Headers(options?.headers);
			expect(headers.get('Authorization')).toBe('Bearer environment-key');
			for (const [name, value] of Object.entries(testCase.headers ?? {}))
				expect(headers.get(name)).toBe(value);
			expect(
				options?.body === undefined || options.body === null
					? undefined
					: JSON.parse(String(options.body)),
			).toEqual(testCase.body);
		},
	);
});

describe('nango inputs', () => {
	afterEach(() => jest.restoreAllMocks());

	it('refuses proxy paths that climb out of /proxy/', async () => {
		const fetchMock = jest.spyOn(globalThis, 'fetch');
		for (const path of [
			'../connections',
			'a/../../environment-variables',
			'.',
		]) {
			await expect(
				api.proxy.get({
					connection_id: 'c',
					provider_config_key: 'echo',
					path,
				}),
			).rejects.toThrow();
		}
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('encodes path identifiers and refuses dot segments', async () => {
		const fetchMock = mockFetch({ success: true });
		await api.connections.delete({
			connectionId: 'a/b?c',
			provider_config_key: 'slack',
		});
		expect(new URL(String(fetchMock.mock.calls[0]?.[0])).pathname).toBe(
			'/connections/a%2Fb%3Fc',
		);
		fetchMock.mockClear();
		for (const connectionId of ['', '.', '..']) {
			await expect(
				api.connections.delete({ connectionId, provider_config_key: 'slack' }),
			).rejects.toThrow();
		}
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('requires tags or end_user for a session and valid import credentials', () => {
		const create = nangoEndpointSchemas['sessions.create'].input;
		expect(create.safeParse({}).success).toBe(false);
		expect(create.safeParse({ tags: { end_user_id: 'u' } }).success).toBe(true);
		expect(
			nangoEndpointSchemas['connections.import'].input.safeParse({
				provider_config_key: 'x',
				credentials: { type: 'API_KEY' },
			}).success,
		).toBe(false);
		expect(
			nangoEndpointSchemas['proxy.get'].input.safeParse({
				connection_id: 'c',
				provider_config_key: 'p',
				path: '/x',
				headers: { 'Bad Header': 'x' },
			}).success,
		).toBe(false);
	});

	it('takes the key only from the stored credentials, never from input', () => {
		const secretNames = ['api_key', 'apiKey', 'secret_key', 'session_token'];
		for (const schema of Object.values(nangoEndpointSchemas)) {
			const shape = (schema.input as { shape?: Record<string, unknown> }).shape;
			for (const name of secretNames)
				expect(Object.keys(shape ?? {})).not.toContain(name);
		}
	});
});

describe('nango responses and errors', () => {
	afterEach(() => jest.restoreAllMocks());

	it('passes a non-JSON proxy reply through as text', async () => {
		mockFetch('plain body', 200, { 'Content-Type': 'text/plain' });
		expect(
			await api.proxy.get({
				connection_id: 'c',
				provider_config_key: 'echo',
				path: '/robots.txt',
			}),
		).toBe('plain body');
	});

	it('keeps reads working when Nango adds fields or sends nulls', async () => {
		mockFetch({
			connections: [
				{ ...listedConnection, end_user: null, new_field: 1, tags: null },
			],
		});
		const result = await api.connections.list({});
		expect(result.connections[0]?.tags).toBeNull();
	});

	it('throws on a response that is not the documented shape', async () => {
		mockFetch({ connections: [{ metadata: null }] });
		await expect(api.connections.list({})).rejects.toThrow();
	});

	it('raises a core ApiError without the request body or the key', async () => {
		mockFetch(
			{
				error: {
					code: 'invalid_body',
					message: 'Bad key environment-key in request',
				},
			},
			400,
		);
		const error = await api.connections
			.import({
				provider_config_key: 'slack',
				credentials: { type: 'API_KEY', apiKey: 'third-party-secret' },
			})
			.catch((e: unknown) => e);
		expect(error).toBeInstanceOf(ApiError);
		const apiError = error as ApiError;
		expect(apiError.status).toBe(400);
		expect(apiError.message).toBe(
			'Nango 400 invalid_body: Bad key [REDACTED] in request',
		);
		const serialized = JSON.stringify({
			message: apiError.message,
			body: apiError.body,
			request: apiError.request,
		});
		expect(serialized).not.toContain('third-party-secret');
		expect(serialized).not.toContain('environment-key');
	});

	it('lets core retry a 429 and honour Retry-After', async () => {
		const fetchMock = jest
			.spyOn(globalThis, 'fetch')
			.mockResolvedValueOnce(
				new Response(JSON.stringify({ error: { code: 'too_many_request' } }), {
					status: 429,
					headers: {
						'Content-Type': 'application/json',
						'Retry-After': '1',
					},
				}),
			)
			.mockResolvedValueOnce(
				new Response(JSON.stringify({ data: [] }), {
					status: 200,
					headers: { 'Content-Type': 'application/json' },
				}),
			);
		expect(await api.integrations.list({})).toEqual({ data: [] });
		expect(fetchMock).toHaveBeenCalledTimes(2);
	});

	it('asks for a connect link when no key is stored', async () => {
		const keyless = createCorsair({ plugins: [nango()] }).nango.api;
		const fetchMock = jest.spyOn(globalThis, 'fetch');
		await expect(keyless.integrations.list({})).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});
