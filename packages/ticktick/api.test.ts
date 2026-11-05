import { AuthMissingError, logEventFromContext } from 'corsair/core';
import {
	getValidAccessToken,
	makeAuthenticatedTickTickRequest,
	TickTickAPIError,
} from './client';
import { OAuth, Projects, Tasks } from './endpoints';
import { ticktick } from './index';

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn().mockResolvedValue(undefined),
	AuthMissingError: class AuthMissingError extends Error {
		constructor(
			public plugin: string,
			public type: string,
		) {
			super(`Missing auth: ${plugin} ${type}`);
		}
	},
}));

jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return {
		...actual,
		makeAuthenticatedTickTickRequest: jest.fn(),
		getValidAccessToken: jest.fn(),
	};
});

const mockRequest = jest.mocked(makeAuthenticatedTickTickRequest);
const mockLog = jest.mocked(logEventFromContext);
const mockGetValidAccessToken = jest.mocked(getValidAccessToken);

type AnyEndpoint = (ctx: unknown, input?: unknown) => Promise<unknown>;

// Endpoints under test only read key/options/keys off the context; the fixture
// cannot satisfy the full CorsairPluginContext, so a single narrow assertion at
// this boundary keeps every call site type-checked.
type EndpointCtx = Parameters<typeof Projects.get>[0];

function buildFixture(
	credentials: Record<string, unknown> = {},
	keyOverrides: Record<string, unknown> = {},
) {
	return {
		key: 'test-token',
		options: { authType: 'oauth_2' as const },
		authType: 'oauth_2',
		keys: {
			get_access_token: jest.fn().mockResolvedValue('access-token'),
			get_expires_at: jest.fn().mockResolvedValue('1700000000'),
			get_refresh_token: jest.fn().mockResolvedValue('refresh-token'),
			set_access_token: jest.fn(),
			set_expires_at: jest.fn(),
			set_refresh_token: jest.fn(),
			get_integration_credentials: jest.fn().mockResolvedValue({
				client_id: 'client-id',
				client_secret: 'client-secret',
				redirect_url: 'https://redirect.com',
				...credentials,
			}),
			...keyOverrides,
		},
		_refreshAuth: undefined as (() => Promise<string>) | undefined,
	};
}

function createContext(credentials?: Record<string, unknown>): EndpointCtx {
	return buildFixture(credentials) as unknown as EndpointCtx;
}

// keyBuilder takes a narrower context than the endpoints; the fixture satisfies
// it the same way, so a single alias keeps the casts at each call site minimal
type KeyBuilderCtx = Parameters<
	NonNullable<ReturnType<typeof ticktick>['keyBuilder']>
>[0];

describe('TickTick endpoint routing', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	const cases: Array<{
		name: string;
		fn: AnyEndpoint;
		input: Record<string, unknown>;
		path: string;
		method: string;
		response: unknown;
		expectedBody?: unknown;
	}> = [
		{
			name: 'projects.create',
			fn: Projects.create as AnyEndpoint,
			input: { name: 'My Project', color: 'red' },
			path: 'project',
			method: 'POST',
			response: { id: 'proj-1', name: 'My Project' },
			expectedBody: { name: 'My Project', color: 'red' },
		},
		{
			name: 'projects.delete',
			fn: Projects.deleteProject as AnyEndpoint,
			input: { projectId: 'proj-1' },
			path: 'project/proj-1',
			method: 'DELETE',
			response: {},
		},
		{
			name: 'projects.get',
			fn: Projects.get as AnyEndpoint,
			input: { projectId: 'proj-1' },
			path: 'project/proj-1',
			method: 'GET',
			response: { id: 'proj-1', name: 'My Project' },
		},
		{
			name: 'projects.getMany',
			fn: Projects.getMany as AnyEndpoint,
			input: {},
			path: 'project',
			method: 'GET',
			response: [{ id: 'proj-1', name: 'My Project' }],
		},
		{
			name: 'projects.getData',
			fn: Projects.getData as AnyEndpoint,
			input: { projectId: 'proj-1' },
			path: 'project/proj-1/data',
			method: 'GET',
			response: {
				project: { id: 'proj-1', name: 'My Project' },
				tasks: [{ id: 'task-1', title: 'My Task' }],
			},
		},
		{
			name: 'projects.update',
			fn: Projects.update as AnyEndpoint,
			input: { projectId: 'proj-1', name: 'Updated Project' },
			path: 'project/proj-1',
			method: 'POST',
			response: { id: 'proj-1', name: 'Updated Project' },
			expectedBody: { name: 'Updated Project' },
		},
		{
			name: 'tasks.create',
			fn: Tasks.create as AnyEndpoint,
			input: { title: 'My Task', projectId: 'proj-1', priority: 3 },
			path: 'task',
			method: 'POST',
			response: { id: 'task-1', title: 'My Task' },
			expectedBody: { title: 'My Task', projectId: 'proj-1', priority: 3 },
		},
		{
			name: 'tasks.complete',
			fn: Tasks.complete as AnyEndpoint,
			input: { projectId: 'proj-1', taskId: 'task-1' },
			path: 'project/proj-1/task/task-1/complete',
			method: 'POST',
			response: {},
		},
		{
			name: 'tasks.delete',
			fn: Tasks.deleteTask as AnyEndpoint,
			input: { projectId: 'proj-1', taskId: 'task-1' },
			path: 'project/proj-1/task/task-1',
			method: 'DELETE',
			response: {},
		},
		{
			name: 'tasks.get',
			fn: Tasks.get as AnyEndpoint,
			input: { projectId: 'proj-1', taskId: 'task-1' },
			path: 'project/proj-1/task/task-1',
			method: 'GET',
			response: { id: 'task-1', title: 'My Task' },
		},
		{
			name: 'tasks.update',
			fn: Tasks.update as AnyEndpoint,
			input: { taskId: 'task-1', projectId: 'proj-1', title: 'Updated Task' },
			path: 'task/task-1',
			method: 'POST',
			response: { id: 'task-1', title: 'Updated Task' },
			expectedBody: {
				id: 'task-1',
				projectId: 'proj-1',
				title: 'Updated Task',
			},
		},
	];

	it.each(cases)(
		'$name calls the expected path and validates output',
		async ({ fn, input, path, method, response, expectedBody }) => {
			mockRequest.mockResolvedValueOnce(response);
			const ctx = createContext();

			const result = await fn(ctx, input);

			const expectedOptions: Record<string, unknown> = { method };
			if (expectedBody !== undefined) {
				expectedOptions.body = expectedBody;
			}

			expect(mockRequest).toHaveBeenCalledWith(
				path,
				ctx,
				expect.objectContaining(expectedOptions),
			);
			if (method === 'DELETE' || path.includes('/complete')) {
				expect(result).toEqual({ success: true });
			} else {
				expect(result).toEqual(response);
			}
			expect(mockLog).toHaveBeenCalled();
		},
	);

	it('oauth.generateAuthUrl builds the authorization step 1 URL with a per-call state', async () => {
		const ctx = createContext();
		const result = await OAuth.generateAuthUrl(ctx, {});

		expect(result.url).toContain('https://ticktick.com/oauth/authorize');
		expect(result.url).toContain('client_id=client-id');
		expect(result.url).toContain('scope=tasks%3Aread+tasks%3Awrite');
		expect(result.url).toContain('redirect_uri=https%3A%2F%2Fredirect.com');

		const stateParam = new URL(result.url).searchParams.get('state');
		expect(stateParam).toBe(result.state);
		// A constant state would defeat CSRF protection on the redirect
		expect(stateParam).not.toBe('state');
	});

	it('oauth.generateAuthUrl throws when redirect_url is not configured', async () => {
		const ctx = createContext({ redirect_url: undefined });

		await expect(OAuth.generateAuthUrl(ctx, {})).rejects.toThrow(
			'redirect_url is not configured',
		);
	});

	it('oauth.generateAuthUrl throws when client_id is not configured', async () => {
		const ctx = createContext({ client_id: undefined });

		await expect(OAuth.generateAuthUrl(ctx, {})).rejects.toThrow(
			'client_id is not configured',
		);
	});

	it('tasks.listAll aggregates tasks across projects sequentially', async () => {
		const ctx = createContext();

		mockRequest.mockResolvedValueOnce([
			{ id: 'proj-1', name: 'Project 1' },
			{ id: 'proj-2', name: 'Project 2' },
		]);
		mockRequest.mockResolvedValueOnce({
			tasks: [{ id: 'task-1', title: 'Task 1' }],
		});
		mockRequest.mockResolvedValueOnce({
			tasks: [{ id: 'task-2', title: 'Task 2' }],
		});

		const result = await Tasks.listAll(ctx, {});

		expect(mockRequest).toHaveBeenNthCalledWith(1, 'project', ctx, {
			method: 'GET',
		});
		expect(mockRequest).toHaveBeenNthCalledWith(2, 'project/proj-1/data', ctx, {
			method: 'GET',
		});
		expect(mockRequest).toHaveBeenNthCalledWith(3, 'project/proj-2/data', ctx, {
			method: 'GET',
		});
		expect(result).toEqual([
			{ id: 'task-1', title: 'Task 1' },
			{ id: 'task-2', title: 'Task 2' },
		]);
	});

	it('tasks.listAll propagates a failed project fetch instead of returning partial results', async () => {
		const ctx = createContext();

		mockRequest.mockResolvedValueOnce([
			{ id: 'proj-1', name: 'Project 1' },
			{ id: 'proj-2', name: 'Project 2' },
		]);
		mockRequest.mockResolvedValueOnce({
			tasks: [{ id: 'task-1', title: 'Task 1' }],
		});
		mockRequest.mockRejectedValueOnce(new Error('[403] forbidden'));

		await expect(Tasks.listAll(ctx, {})).rejects.toThrow('forbidden');
	});

	it('tasks.listAll returns an empty array when there are no projects', async () => {
		const ctx = createContext();

		mockRequest.mockResolvedValueOnce([]);

		await expect(Tasks.listAll(ctx, {})).resolves.toEqual([]);
		expect(mockRequest).toHaveBeenCalledTimes(1);
	});

	it('tasks.listAll skips project payloads without a tasks array', async () => {
		const ctx = createContext();

		mockRequest.mockResolvedValueOnce([{ id: 'proj-1', name: 'Project 1' }]);
		mockRequest.mockResolvedValueOnce({});

		await expect(Tasks.listAll(ctx, {})).resolves.toEqual([]);
	});

	it('projects.getData fetches everything in a single undocumented-pagination-free request', async () => {
		const ctx = createContext();
		const columns = [{ id: 'col-1', name: 'To Do', sortOrder: 0 }];
		mockRequest.mockResolvedValueOnce({
			project: { id: 'proj-1', name: 'My Project' },
			tasks: Array.from({ length: 105 }, (_, i) => ({
				id: `task-${i + 1}`,
				title: `Task ${i + 1}`,
			})),
			columns,
		});

		const result = await Projects.getData(ctx, { projectId: 'proj-1' });

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(mockRequest).toHaveBeenCalledWith('project/proj-1/data', ctx, {
			method: 'GET',
		});
		expect(result.project).toEqual({ id: 'proj-1', name: 'My Project' });
		expect(result.tasks).toHaveLength(105);
		expect(result.columns).toEqual(columns);
	});

	it('projects.getData returns an empty task list when the project has no undone tasks', async () => {
		const ctx = createContext();

		mockRequest.mockResolvedValueOnce({
			project: { id: 'proj-1', name: 'Empty Project' },
			tasks: [],
		});

		const result = await Projects.getData(ctx, { projectId: 'proj-1' });

		expect(result.tasks).toEqual([]);
		expect(result.columns).toBeUndefined();
	});

	it('projects.getData throws when the project could not be retrieved', async () => {
		const ctx = createContext();

		mockRequest.mockResolvedValueOnce({ tasks: [] });

		await expect(
			Projects.getData(ctx, { projectId: 'missing-project' }),
		).rejects.toThrow('could not be retrieved');
	});

	it('keyBuilder retrieves and persists a refreshed access token', async () => {
		const pluginInstance = ticktick();
		const ctx = createContext();
		mockGetValidAccessToken.mockResolvedValueOnce({
			accessToken: 'fresh-token',
			expiresAt: 1800000000,
			refreshed: true,
		});

		const result = await pluginInstance.keyBuilder?.(
			ctx as unknown as KeyBuilderCtx,
			'endpoint',
		);

		expect(result).toBe('fresh-token');
		expect(ctx.keys.set_access_token).toHaveBeenCalledWith('fresh-token');
		expect(ctx.keys.set_expires_at).toHaveBeenCalledWith('1800000000');
		expect(ctx.keys.set_refresh_token).not.toHaveBeenCalled();
	});

	it('keyBuilder persists a rotated refresh token when the provider returns one', async () => {
		const pluginInstance = ticktick();
		const ctx = createContext();
		mockGetValidAccessToken.mockResolvedValueOnce({
			accessToken: 'fresh-token',
			expiresAt: 1800000000,
			refreshed: true,
			newRefreshToken: 'rotated-token',
		});

		await pluginInstance.keyBuilder?.(
			ctx as unknown as KeyBuilderCtx,
			'endpoint',
		);

		expect(ctx.keys.set_refresh_token).toHaveBeenCalledWith('rotated-token');
	});

	it('keyBuilder reuses a cached token without writing anything', async () => {
		const pluginInstance = ticktick();
		const ctx = createContext();
		mockGetValidAccessToken.mockResolvedValueOnce({
			accessToken: 'cached-token',
			expiresAt: 1800000000,
			refreshed: false,
		});

		const result = await pluginInstance.keyBuilder?.(
			ctx as unknown as KeyBuilderCtx,
			'endpoint',
		);

		expect(result).toBe('cached-token');
		expect(ctx.keys.set_access_token).not.toHaveBeenCalled();
		expect(ctx.keys.set_expires_at).not.toHaveBeenCalled();
	});

	it('keyBuilder attaches _refreshAuth that forces a refresh and persists rotation', async () => {
		const pluginInstance = ticktick();
		const fixture = buildFixture();
		const ctx = fixture as unknown as KeyBuilderCtx;

		mockGetValidAccessToken
			.mockResolvedValueOnce({
				accessToken: 'cached-token',
				expiresAt: 1800000000,
				refreshed: false,
			})
			.mockResolvedValueOnce({
				accessToken: 'forced-token',
				expiresAt: 1900000000,
				refreshed: true,
				newRefreshToken: 'rotated-token',
			});

		await pluginInstance.keyBuilder?.(ctx, 'endpoint');
		expect(fixture._refreshAuth).toBeDefined();

		const token = await fixture._refreshAuth?.();

		expect(token).toBe('forced-token');
		expect(ctx.keys.set_access_token).toHaveBeenCalledWith('forced-token');
		expect(ctx.keys.set_refresh_token).toHaveBeenCalledWith('rotated-token');
		const forceCall = mockGetValidAccessToken.mock.calls[1]?.[0];
		expect(forceCall?.forceRefresh).toBe(true);
	});

	it('keyBuilder serves a cached access token when TickTick issued no refresh token', async () => {
		const pluginInstance = ticktick();
		const fixture = buildFixture(
			{},
			{
				get_refresh_token: jest.fn().mockResolvedValue(null),
				get_expires_at: jest
					.fn()
					.mockResolvedValue(String(Math.floor(Date.now() / 1000) + 3600)),
			},
		);

		const result = await pluginInstance.keyBuilder?.(
			fixture as unknown as KeyBuilderCtx,
			'endpoint',
		);

		expect(result).toBe('access-token');
		expect(mockGetValidAccessToken).not.toHaveBeenCalled();
		expect(fixture.keys.set_access_token).not.toHaveBeenCalled();
		expect(fixture.keys.set_expires_at).not.toHaveBeenCalled();
	});

	it('keyBuilder does not require client credentials when no refresh token exists', async () => {
		const pluginInstance = ticktick();
		const fixture = buildFixture(
			{ client_id: undefined, client_secret: undefined },
			{
				get_refresh_token: jest.fn().mockResolvedValue(null),
				get_expires_at: jest
					.fn()
					.mockResolvedValue(String(Math.floor(Date.now() / 1000) + 3600)),
			},
		);

		await expect(
			pluginInstance.keyBuilder?.(
				fixture as unknown as KeyBuilderCtx,
				'endpoint',
			),
		).resolves.toBe('access-token');
	});

	it.each([
		{
			name: 'no stored token',
			accessToken: null,
			expiresAt: String(Math.floor(Date.now() / 1000) + 3600),
		},
		{ name: 'an expired token', accessToken: 'stale-token', expiresAt: '1000' },
		{
			name: 'a non-numeric expiry',
			accessToken: 'access-token',
			expiresAt: 'invalid-expiry',
		},
		{ name: 'a missing expiry', accessToken: 'access-token', expiresAt: null },
	])(
		'keyBuilder throws AuthMissingError with no refresh token and $name',
		async ({ accessToken, expiresAt }) => {
			const pluginInstance = ticktick();
			const fixture = buildFixture(
				{},
				{
					get_refresh_token: jest.fn().mockResolvedValue(null),
					get_access_token: jest.fn().mockResolvedValue(accessToken),
					get_expires_at: jest.fn().mockResolvedValue(expiresAt),
				},
			);

			await expect(
				pluginInstance.keyBuilder?.(
					fixture as unknown as KeyBuilderCtx,
					'endpoint',
				),
			).rejects.toThrow(AuthMissingError);
		},
	);

	it('keyBuilder throws when client credentials are missing', async () => {
		const pluginInstance = ticktick();
		const fixture = buildFixture({ client_id: undefined });

		await expect(
			pluginInstance.keyBuilder?.(
				fixture as unknown as KeyBuilderCtx,
				'endpoint',
			),
		).rejects.toThrow('[auth-missing:ticktick:client_credentials]');
	});

	it('keyBuilder wraps refresh failures with a recognizable prefix', async () => {
		const pluginInstance = ticktick();
		const fixture = buildFixture();
		mockGetValidAccessToken.mockRejectedValueOnce(new Error('token expired'));

		await expect(
			pluginInstance.keyBuilder?.(
				fixture as unknown as KeyBuilderCtx,
				'endpoint',
			),
		).rejects.toThrow(/Failed to obtain valid access token: token expired$/);
	});

	it('keyBuilder rethrows TickTickAPIError so 429 metadata is kept', async () => {
		const pluginInstance = ticktick();
		const fixture = buildFixture();
		mockGetValidAccessToken.mockRejectedValueOnce(
			new TickTickAPIError('[429] Too Many Requests', '429', 2500),
		);

		await expect(
			pluginInstance.keyBuilder?.(
				fixture as unknown as KeyBuilderCtx,
				'endpoint',
			),
		).rejects.toMatchObject({
			name: 'TickTickAPIError',
			code: '429',
			retryAfter: 2500,
		});
	});

	it('keyBuilder reports persist failures distinctly', async () => {
		const pluginInstance = ticktick();
		const fixture = buildFixture();
		fixture.keys.set_access_token.mockRejectedValueOnce(new Error('db down'));
		mockGetValidAccessToken.mockResolvedValueOnce({
			accessToken: 'fresh-token',
			expiresAt: 1800000000,
			refreshed: true,
		});

		await expect(
			pluginInstance.keyBuilder?.(
				fixture as unknown as KeyBuilderCtx,
				'endpoint',
			),
		).rejects.toThrow('failed to persist new credentials');
	});
});
