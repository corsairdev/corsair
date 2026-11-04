import { ComposioAPIError } from './client';
import { Connections, MetaTools, Sessions, Toolkits, Tools } from './endpoints';
import type { JsonObject } from './endpoints/types';
import { errorHandlers } from './error-handlers';
import type { ComposioContext } from './index';
import { composio } from './index';

jest.mock('corsair/core', () => ({
	...jest.requireActual<typeof import('corsair/core')>('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(undefined),
}));

const BASE = 'https://backend.composio.dev/api/v3.1';

const upsert = jest.fn().mockResolvedValue(undefined);
const remove = jest.fn().mockResolvedValue(true);
const entityClient = {
	findByEntityId: jest.fn(),
	existsByEntityId: jest.fn(),
	findIdByEntityId: jest.fn(),
	findById: jest.fn(),
	findManyByEntityIds: jest.fn(),
	list: jest.fn(),
	search: jest.fn(),
	upsertByEntityId: upsert,
	deleteById: jest.fn(),
	deleteByEntityId: remove,
	count: jest.fn(),
};

// Safe: the object supplies every member of the context, with stubs for the ones endpoints never read.
// A narrower type is not practical because ComposioContext is derived from the plugin's schema and endpoint types.
const ctx = {
	key: 'ak_test',
	endpoints: {},
	options: {},
	keys: {
		get_dek: async () => 'dek',
		issue_new_dek: async () => 'dek',
		get_api_key: async () => 'ak_test',
		set_api_key: async () => {},
		get_webhook_signature: async () => null,
		set_webhook_signature: async () => {},
	},
	$getAccountId: async () => 'acct_1',
	db: {
		tools: entityClient,
		toolkits: entityClient,
		connectedAccounts: entityClient,
		sessions: entityClient,
	},
} as ComposioContext;

const fetchMock = jest.spyOn(globalThis, 'fetch');

function respond(
	status: number,
	body: JsonObject,
	headers: Record<string, string> = {},
) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json', ...headers },
		}),
	);
}

function sentRequest() {
	expect(fetchMock).toHaveBeenCalledTimes(1);
	const [url, init] = fetchMock.mock.calls[0] ?? [];
	const body = init?.body;
	return {
		url: String(url),
		method: init?.method,
		apiKey: new Headers(init?.headers).get('x-api-key'),
		body: typeof body === 'string' ? JSON.parse(body) : body,
	};
}

beforeEach(() => {
	fetchMock.mockReset();
	upsert.mockClear();
	remove.mockClear();
});

afterAll(() => {
	fetchMock.mockRestore();
});

const directResult = {
	data: { ok: true },
	error: null,
	successful: true,
	log_id: 'log_direct',
};

const sessionResult = {
	result_type: 'completed',
	data: { ok: true },
	error: null,
	log_id: 'log_session',
};

describe('meta tools run through POST /tools/execute/{slug}', () => {
	const cases = [
		{
			slug: 'COMPOSIO_CHECK_ACTIVE_CONNECTION',
			call: () =>
				MetaTools.checkActiveConnection(ctx, {
					arguments: { toolkit: 'github' },
					user_id: 'user_1',
				}),
			body: { arguments: { toolkit: 'github' }, user_id: 'user_1' },
		},
		{
			slug: 'COMPOSIO_CHECK_ACTIVE_CONNECTIONS',
			call: () =>
				MetaTools.checkActiveConnections(ctx, {
					arguments: { requests: [{ toolkit: 'slack' }] },
				}),
			body: { arguments: { requests: [{ toolkit: 'slack' }] } },
		},
		{
			slug: 'COMPOSIO_CREATE_PLAN',
			call: () =>
				MetaTools.createPlan(ctx, {
					arguments: {
						difficulty: 'medium',
						known_fields: 'channel_name:general',
						primary_tool_slugs: ['SLACK_SEND_MESSAGE'],
						reasoning: 'Slack posts the message',
						use_case: 'Post a daily summary to #general',
					},
				}),
			body: {
				arguments: {
					difficulty: 'medium',
					known_fields: 'channel_name:general',
					primary_tool_slugs: ['SLACK_SEND_MESSAGE'],
					reasoning: 'Slack posts the message',
					use_case: 'Post a daily summary to #general',
				},
			},
		},
		{
			slug: 'COMPOSIO_ENABLE_TRIGGER',
			call: () =>
				MetaTools.enableTrigger(ctx, {
					arguments: {
						connected_account_id: 'ca_1',
						toolkit_slug: 'github',
						trigger_name: 'GITHUB_COMMIT_EVENT',
						config_params: { owner: 'corsairdev', repo: 'corsair' },
					},
				}),
			body: {
				arguments: {
					connected_account_id: 'ca_1',
					toolkit_slug: 'github',
					trigger_name: 'GITHUB_COMMIT_EVENT',
					config_params: { owner: 'corsairdev', repo: 'corsair' },
				},
			},
		},
		{
			slug: 'COMPOSIO_EXECUTE_TOOL',
			call: () =>
				MetaTools.executeTool(ctx, {
					arguments: {
						tool_slug: 'GITHUB_GET_A_REPOSITORY',
						arguments: { owner: 'corsairdev', repo: 'corsair' },
					},
					version: '20260917_00',
				}),
			body: {
				arguments: {
					tool_slug: 'GITHUB_GET_A_REPOSITORY',
					arguments: { owner: 'corsairdev', repo: 'corsair' },
				},
				version: '20260917_00',
			},
		},
		{
			slug: 'COMPOSIO_GET_DEPENDENCY_GRAPH',
			call: () =>
				MetaTools.getDependencyGraph(ctx, {
					arguments: { tool_name: 'GMAIL_REPLY_TO_THREAD' },
				}),
			body: { arguments: { tool_name: 'GMAIL_REPLY_TO_THREAD' } },
		},
		{
			slug: 'COMPOSIO_GET_REQUIRED_PARAMETERS',
			call: () =>
				MetaTools.getRequiredParameters(ctx, {
					arguments: { toolkit: 'exa' },
				}),
			body: { arguments: { toolkit: 'exa' } },
		},
		{
			slug: 'COMPOSIO_GET_RESPONSE_SCHEMA',
			call: () =>
				MetaTools.getResponseSchema(ctx, {
					arguments: { tool: 'GITHUB_LIST_PULL_REQUESTS' },
				}),
			body: { arguments: { tool: 'GITHUB_LIST_PULL_REQUESTS' } },
		},
		{
			slug: 'COMPOSIO_INITIATE_CONNECTION',
			call: () =>
				MetaTools.initiateConnection(ctx, {
					arguments: {
						toolkit: 'exa',
						parameters: { generic_api_key: 'exa_key' },
					},
				}),
			body: {
				arguments: {
					toolkit: 'exa',
					parameters: { generic_api_key: 'exa_key' },
				},
			},
		},
		{
			slug: 'COMPOSIO_LIST_TOOLKITS',
			call: () =>
				MetaTools.listToolkits(ctx, {
					arguments: { category: 'productivity', size: 5 },
				}),
			body: { arguments: { category: 'productivity', size: 5 } },
		},
		{
			slug: 'COMPOSIO_LIST_TRIGGERS',
			call: () =>
				MetaTools.listTriggers(ctx, {
					arguments: { toolkit_names: ['github'] },
				}),
			body: { arguments: { toolkit_names: ['github'] } },
		},
		{
			slug: 'COMPOSIO_WAIT_FOR_CONNECTION',
			call: () =>
				MetaTools.waitForConnection(ctx, {
					arguments: { toolkits: ['gmail'], mode: 'all', timeout_seconds: 60 },
				}),
			body: {
				arguments: { toolkits: ['gmail'], mode: 'all', timeout_seconds: 60 },
			},
		},
	];

	it.each(cases)('$slug', async ({ slug, call, body }) => {
		respond(200, directResult);

		await expect(call()).resolves.toEqual(directResult);

		expect(sentRequest()).toEqual({
			url: `${BASE}/tools/execute/${slug}`,
			method: 'POST',
			apiKey: 'ak_test',
			body,
		});
	});
});

describe('session meta tools run through POST /tool_router/session/{id}/execute_meta', () => {
	const cases = [
		{
			slug: 'COMPOSIO_GET_TOOL_SCHEMAS',
			call: () =>
				MetaTools.getToolSchemas(ctx, {
					session_id: 'trs_1',
					arguments: { tool_slugs: ['GMAIL_SEND_EMAIL'] },
				}),
			args: { tool_slugs: ['GMAIL_SEND_EMAIL'] },
		},
		{
			slug: 'COMPOSIO_MANAGE_CONNECTIONS',
			call: () =>
				MetaTools.manageConnections(ctx, {
					session_id: 'trs_1',
					arguments: { toolkits: ['github'], reinitiate_all: false },
				}),
			args: { toolkits: ['github'], reinitiate_all: false },
		},
		{
			slug: 'COMPOSIO_MULTI_EXECUTE_TOOL',
			call: () =>
				MetaTools.multiExecuteTool(ctx, {
					session_id: 'trs_1',
					arguments: {
						tools: [
							{ tool_slug: 'SLACK_LIST_CHANNELS', arguments: { limit: 10 } },
						],
						sync_response_to_workbench: false,
					},
				}),
			args: {
				tools: [{ tool_slug: 'SLACK_LIST_CHANNELS', arguments: { limit: 10 } }],
				sync_response_to_workbench: false,
			},
		},
		{
			slug: 'COMPOSIO_REMOTE_BASH_TOOL',
			call: () =>
				MetaTools.remoteBashTool(ctx, {
					session_id: 'trs_1',
					arguments: { command: 'ls /mnt' },
				}),
			args: { command: 'ls /mnt' },
		},
		{
			slug: 'COMPOSIO_REMOTE_WORKBENCH',
			call: () =>
				MetaTools.remoteWorkbench(ctx, {
					session_id: 'trs_1',
					arguments: { code_to_execute: 'print(1 + 1)' },
				}),
			args: { code_to_execute: 'print(1 + 1)' },
		},
		{
			slug: 'COMPOSIO_SEARCH_TOOLS',
			call: () =>
				MetaTools.searchTools(ctx, {
					session_id: 'trs_1',
					arguments: {
						queries: [{ use_case: 'send an email' }],
						session: { generate_id: true },
					},
				}),
			args: {
				queries: [{ use_case: 'send an email' }],
				session: { generate_id: true },
			},
		},
		{
			slug: 'COMPOSIO_WAIT_FOR_CONNECTIONS',
			call: () =>
				MetaTools.waitForConnections(ctx, {
					session_id: 'trs_1',
					arguments: { toolkits: ['gmail'], mode: 'any' },
				}),
			args: { toolkits: ['gmail'], mode: 'any' },
		},
	];

	it.each(cases)('$slug', async ({ slug, call, args }) => {
		respond(200, sessionResult);

		await expect(call()).resolves.toEqual(sessionResult);

		expect(sentRequest()).toEqual({
			url: `${BASE}/tool_router/session/trs_1/execute_meta`,
			method: 'POST',
			apiKey: 'ak_test',
			body: { slug, arguments: args },
		});
	});

	it('returns input_required results with their questions', async () => {
		const pending = {
			result_type: 'input_required',
			input_requests: {
				elicit_1: { type: 'elicitation', mode: 'form', message: 'Approve?' },
			},
			request_state: 'state_1',
		};
		respond(200, pending);

		const result = await MetaTools.remoteBashTool(ctx, {
			session_id: 'trs_1',
			arguments: { command: 'rm -rf /mnt/tmp' },
		});

		expect(result).toEqual(pending);
	});
});

describe('REST endpoints', () => {
	const page = {
		next_cursor: null,
		total_pages: 1,
		current_page: 1,
		total_items: 1,
	};
	const tool = {
		slug: 'GMAIL_SEND_EMAIL',
		name: 'Send email',
		description: 'Send an email',
		toolkit: { slug: 'gmail', name: 'Gmail', logo: 'https://logo' },
		input_parameters: { type: 'object' },
		output_parameters: { type: 'object' },
		no_auth: false,
		version: '20260917_00',
		available_versions: ['20260917_00'],
		tags: ['important'],
		is_deprecated: false,
	};
	const connection = {
		id: 'ca_1',
		status: 'ACTIVE',
		user_id: 'user_1',
		alias: null,
		created_at: '2026-10-01T00:00:00Z',
		updated_at: '2026-10-01T00:00:00Z',
		is_disabled: false,
		toolkit: { slug: 'github' },
		auth_config: { id: 'ac_1' },
	};

	it('sessions.create posts /tool_router/session', async () => {
		const session = {
			session_id: 'trs_1',
			mcp: {
				type: 'http',
				url: 'https://app.composio.dev/tool_router/v3/trs_1/mcp',
			},
			tool_router_tools: ['COMPOSIO_SEARCH_TOOLS'],
		};
		respond(201, session);

		const result = await Sessions.create(ctx, {
			user_id: 'user_1',
			toolkits: { enable: ['gmail'] },
		});

		expect(result).toEqual(session);
		expect(sentRequest()).toEqual({
			url: `${BASE}/tool_router/session`,
			method: 'POST',
			apiKey: 'ak_test',
			body: { user_id: 'user_1', toolkits: { enable: ['gmail'] } },
		});
	});

	it('tools.list gets /tools with filters', async () => {
		respond(200, { items: [tool], ...page });

		const result = await Tools.list(ctx, {
			toolkit_slug: 'gmail',
			limit: 5,
		});

		expect(result).toEqual({ items: [tool], ...page });
		expect(sentRequest()).toEqual({
			url: `${BASE}/tools?toolkit_slug=gmail&limit=5`,
			method: 'GET',
			apiKey: 'ak_test',
			body: undefined,
		});
	});

	it('tools.get gets /tools/{slug}', async () => {
		respond(200, tool);

		const result = await Tools.get(ctx, {
			tool_slug: 'GMAIL_SEND_EMAIL',
		});

		expect(result).toEqual(tool);
		expect(sentRequest()).toEqual({
			url: `${BASE}/tools/GMAIL_SEND_EMAIL`,
			method: 'GET',
			apiKey: 'ak_test',
			body: undefined,
		});
	});

	it('tools.execute posts /tools/execute/{slug} without the slug in the body', async () => {
		respond(200, directResult);

		const result = await Tools.execute(ctx, {
			tool_slug: 'GMAIL_SEND_EMAIL',
			arguments: { to: 'a@example.com' },
			user_id: 'user_1',
		});

		expect(result).toEqual(directResult);
		expect(sentRequest()).toEqual({
			url: `${BASE}/tools/execute/GMAIL_SEND_EMAIL`,
			method: 'POST',
			apiKey: 'ak_test',
			body: { arguments: { to: 'a@example.com' }, user_id: 'user_1' },
		});
	});

	it('toolkits.list gets /toolkits', async () => {
		const toolkit = { slug: 'gmail', name: 'Gmail', type: 'native', meta: {} };
		respond(200, { items: [toolkit], ...page });

		const result = await Toolkits.list(ctx, { search: 'mail' });

		expect(result).toEqual({ items: [toolkit], ...page });
		expect(sentRequest()).toEqual({
			url: `${BASE}/toolkits?search=mail`,
			method: 'GET',
			apiKey: 'ak_test',
			body: undefined,
		});
	});

	it('connections.list repeats array filters as query keys', async () => {
		respond(200, { items: [connection], ...page });

		const result = await Connections.list(ctx, {
			toolkit_slugs: ['github', 'slack'],
			statuses: ['ACTIVE'],
		});

		expect(result).toEqual({ items: [connection], ...page });
		expect(sentRequest()).toEqual({
			url: `${BASE}/connected_accounts?toolkit_slugs=github&toolkit_slugs=slack&statuses=ACTIVE`,
			method: 'GET',
			apiKey: 'ak_test',
			body: undefined,
		});
	});

	it('connections.create posts /connected_accounts/link', async () => {
		const link = {
			link_token: 'lt_1',
			redirect_url: 'https://connect.composio.dev/link/lt_1',
			expires_at: '2026-10-13T00:00:00Z',
			connected_account_id: 'ca_2',
		};
		respond(201, link);

		const result = await Connections.create(ctx, {
			auth_config_id: 'ac_1',
			user_id: 'user_1',
		});

		expect(result).toEqual(link);
		expect(sentRequest()).toEqual({
			url: `${BASE}/connected_accounts/link`,
			method: 'POST',
			apiKey: 'ak_test',
			body: { auth_config_id: 'ac_1', user_id: 'user_1' },
		});
	});

	it('connections.delete deletes /connected_accounts/{id}', async () => {
		respond(200, { success: true });

		const result = await Connections.remove(ctx, {
			connected_account_id: 'ca_1',
			revoke_on_delete: true,
		});

		expect(result).toEqual({ success: true });
		expect(sentRequest()).toEqual({
			url: `${BASE}/connected_accounts/ca_1?revoke_on_delete=true`,
			method: 'DELETE',
			apiKey: 'ak_test',
			body: undefined,
		});
	});
});

describe('entity persistence', () => {
	const page = {
		next_cursor: null,
		total_pages: 1,
		current_page: 1,
		total_items: 1,
	};
	const tool = {
		slug: 'GMAIL_SEND_EMAIL',
		name: 'Send email',
		description: 'Send an email',
		toolkit: { slug: 'gmail', name: 'Gmail' },
		input_parameters: { type: 'object' },
		output_parameters: { type: 'object' },
		no_auth: false,
		version: '20260917_00',
		available_versions: ['20260917_00'],
		tags: [],
		is_deprecated: false,
	};

	it('tools.list and tools.get save each tool under its slug', async () => {
		respond(200, { items: [tool], ...page });
		await Tools.list(ctx, {});
		expect(upsert).toHaveBeenCalledWith('GMAIL_SEND_EMAIL', {
			...tool,
			id: 'GMAIL_SEND_EMAIL',
		});

		upsert.mockClear();
		fetchMock.mockReset();
		respond(200, tool);
		await Tools.get(ctx, { tool_slug: 'GMAIL_SEND_EMAIL' });
		expect(upsert).toHaveBeenCalledWith('GMAIL_SEND_EMAIL', {
			...tool,
			id: 'GMAIL_SEND_EMAIL',
		});
	});

	it('toolkits.list saves each toolkit under its slug', async () => {
		const toolkit = {
			slug: 'gmail',
			name: 'Gmail',
			type: 'native',
			auth_schemes: ['OAUTH2'],
			meta: { tools_count: 40, categories: [{ id: 'email', name: 'Email' }] },
		};
		respond(200, { items: [toolkit], ...page });
		await Toolkits.list(ctx, {});
		expect(upsert).toHaveBeenCalledWith('gmail', { ...toolkit, id: 'gmail' });
	});

	it('connections.list saves accounts without credential state', async () => {
		const account = {
			id: 'ca_1',
			status: 'ACTIVE',
			user_id: 'user_1',
			alias: null,
			created_at: '2026-10-01T00:00:00Z',
			updated_at: '2026-10-01T00:00:00Z',
			is_disabled: false,
			toolkit: { slug: 'github' },
			auth_config: { id: 'ac_1', auth_scheme: 'OAUTH2' },
			state: { authScheme: 'OAUTH2', val: { access_token: 'secret' } },
			data: { access_token: 'secret' },
		};
		respond(200, { items: [account], ...page });
		await Connections.list(ctx, {});
		const [id, saved] = upsert.mock.calls[0] ?? [];
		expect(id).toBe('ca_1');
		expect(saved).toEqual({
			id: 'ca_1',
			status: 'ACTIVE',
			user_id: 'user_1',
			alias: null,
			created_at: '2026-10-01T00:00:00Z',
			updated_at: '2026-10-01T00:00:00Z',
			is_disabled: false,
			toolkit: { slug: 'github' },
			auth_config: { id: 'ac_1', auth_scheme: 'OAUTH2' },
		});
	});

	it('connections.delete drops the saved account', async () => {
		respond(200, { success: true });
		await Connections.remove(ctx, { connected_account_id: 'ca_1' });
		expect(remove).toHaveBeenCalledWith('ca_1');
	});

	it('sessions.create saves the session with its user', async () => {
		respond(201, {
			session_id: 'trs_1',
			mcp: { type: 'http', url: 'https://app.composio.dev/mcp/trs_1' },
			tool_router_tools: ['COMPOSIO_SEARCH_TOOLS'],
			config_version: 1,
		});
		await Sessions.create(ctx, { user_id: 'user_1' });
		expect(upsert).toHaveBeenCalledWith('trs_1', {
			id: 'trs_1',
			session_id: 'trs_1',
			user_id: 'user_1',
			mcp: { type: 'http', url: 'https://app.composio.dev/mcp/trs_1' },
			tool_router_tools: ['COMPOSIO_SEARCH_TOOLS'],
			config_version: 1,
		});
	});

	it('a failing save does not fail the API call', async () => {
		const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
		upsert.mockRejectedValueOnce(new Error('db down'));
		respond(200, tool);
		await expect(
			Tools.get(ctx, { tool_slug: 'GMAIL_SEND_EMAIL' }),
		).resolves.toEqual(tool);
		warn.mockRestore();
	});
});

describe('input validation', () => {
	it('rejects invalid input before any request is sent', async () => {
		await expect(Sessions.create(ctx, { user_id: '' })).rejects.toThrow();
		await expect(
			Tools.get(ctx, { tool_slug: '../connected_accounts' }),
		).rejects.toThrow();
		await expect(
			Connections.remove(ctx, { connected_account_id: 'ca_1/../x' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('errors', () => {
	it('a 401 becomes a ComposioAPIError that AUTH_ERROR does not retry', async () => {
		respond(401, { error: { message: 'Invalid API key' } });

		const error = await Tools.get(ctx, { tool_slug: 'GMAIL_SEND_EMAIL' }).catch(
			(caught: Error) => caught,
		);

		expect(error).toBeInstanceOf(ComposioAPIError);
		if (!(error instanceof ComposioAPIError)) return;
		expect(error.status).toBe(401);
		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);
		await expect(errorHandlers.AUTH_ERROR.handler()).resolves.toEqual({
			maxRetries: 0,
		});
	});

	it('a 429 carries Retry-After to RATE_LIMIT_ERROR without a transport retry', async () => {
		respond(
			429,
			{ error: { message: 'Too many requests' } },
			{ 'Retry-After': '7' },
		);

		const error = await MetaTools.listToolkits(ctx, { arguments: {} }).catch(
			(caught: Error) => caught,
		);

		expect(fetchMock).toHaveBeenCalledTimes(1);
		expect(error).toBeInstanceOf(ComposioAPIError);
		if (!(error instanceof ComposioAPIError)) return;
		expect(error.status).toBe(429);
		expect(error.retryAfter).toBe(7000);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual({
			maxRetries: 5,
			headersRetryAfterMs: 7000,
		});
	});

	it('rejects a response that does not match the documented shape', async () => {
		respond(200, { items: 'not-a-list' });

		await expect(Toolkits.list(ctx, {})).rejects.toThrow();
	});
});

describe('plugin', () => {
	it('registers one entity per Composio resource', () => {
		expect(Object.keys(composio().schema?.entities ?? {}).sort()).toEqual([
			'connectedAccounts',
			'sessions',
			'toolkits',
			'tools',
		]);
	});

	it('defines no webhooks and one schema per endpoint', () => {
		const plugin = composio({ key: 'ak_test' });
		expect(plugin.webhooks).toEqual({});
		expect(Object.keys(plugin.endpointSchemas ?? {}).sort()).toEqual([
			'connections.create',
			'connections.delete',
			'connections.list',
			'meta.checkActiveConnection',
			'meta.checkActiveConnections',
			'meta.createPlan',
			'meta.enableTrigger',
			'meta.executeTool',
			'meta.getDependencyGraph',
			'meta.getRequiredParameters',
			'meta.getResponseSchema',
			'meta.getToolSchemas',
			'meta.initiateConnection',
			'meta.listToolkits',
			'meta.listTriggers',
			'meta.manageConnections',
			'meta.multiExecuteTool',
			'meta.remoteBashTool',
			'meta.remoteWorkbench',
			'meta.searchTools',
			'meta.waitForConnection',
			'meta.waitForConnections',
			'sessions.create',
			'toolkits.list',
			'tools.execute',
			'tools.get',
			'tools.list',
		]);
	});
});
