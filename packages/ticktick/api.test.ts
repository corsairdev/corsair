import { logEventFromContext } from 'corsair/core';
import {
	getValidAccessToken,
	makeAuthenticatedTickTickRequest,
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

jest.mock('./client', () => ({
	makeAuthenticatedTickTickRequest: jest.fn(),
	getValidAccessToken: jest.fn(),
}));

const mockRequest = jest.mocked(makeAuthenticatedTickTickRequest);
const mockLog = jest.mocked(logEventFromContext);
const mockGetValidAccessToken = jest.mocked(getValidAccessToken);

type AnyEndpoint = (ctx: unknown, input?: unknown) => Promise<unknown>;

function createContext() {
	return {
		key: 'test-token',
		options: { authType: 'oauth_2' as const },
		keys: {
			get_access_token: jest.fn().mockResolvedValue('access-token'),
			get_expires_at: jest.fn().mockResolvedValue('1700000000'),
			get_refresh_token: jest.fn().mockResolvedValue('refresh-token'),
			set_access_token: jest.fn(),
			set_expires_at: jest.fn(),
			get_integration_credentials: jest.fn().mockResolvedValue({
				client_id: 'client-id',
				client_secret: 'client-secret',
				redirect_url: 'https://redirect.com',
			}),
		},
		authType: 'oauth_2',
	};
}

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
			input: { title: 'My Task', priority: 3 },
			path: 'task',
			method: 'POST',
			response: { id: 'task-1', title: 'My Task' },
			expectedBody: { title: 'My Task', priority: 3 },
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
			expectedBody: { projectId: 'proj-1', title: 'Updated Task' },
		},
	];

	it.each(cases)(
		'$name calls the expected path and validates output',
		async ({ fn, input, path, method, response, expectedBody }) => {
			mockRequest.mockResolvedValueOnce(response);
			const ctx = createContext();

			const result = await fn(ctx, input);

			const expectedOptions: Record<string, any> = { method };
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

	it('oauth.generateAuthUrl creates correct authorization step 1 URL', async () => {
		const ctx = createContext();
		const result = await OAuth.generateAuthUrl(ctx as any, {});

		expect(result.url).toContain('https://ticktick.com/oauth/authorize');
		expect(result.url).toContain('client_id=client-id');
		expect(result.url).toContain('scope=tasks%3Aread+tasks%3Awrite');
		expect(result.url).toContain('redirect_uri=https%3A%2F%2Fredirect.com');
	});

	it('tasks.listAll aggregates tasks across projects', async () => {
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

		const result = await Tasks.listAll(ctx as any, {});

		expect(result).toEqual([
			{ id: 'task-1', title: 'Task 1' },
			{ id: 'task-2', title: 'Task 2' },
		]);
	});

	it('keyBuilder retrieves and refreshes access token', async () => {
		const pluginInstance = ticktick();
		const ctx = createContext();
		mockGetValidAccessToken.mockResolvedValueOnce({
			accessToken: 'fresh-token',
			expiresAt: 1800000000,
			refreshed: true,
		});

		const result = await pluginInstance.keyBuilder?.(ctx as any, 'endpoint');

		expect(result).toBe('fresh-token');
		expect(ctx.keys.set_access_token).toHaveBeenCalledWith('fresh-token');
		expect(ctx.keys.set_expires_at).toHaveBeenCalledWith('1800000000');
	});

	it('projects.getData paginates and deduplicates tasks by id', async () => {
		const ctx = createContext();

		const page1Tasks = Array.from({ length: 100 }, (_, i) => ({
			id: `task-${i + 1}`,
			title: `Task ${i + 1}`,
		}));
		mockRequest.mockResolvedValueOnce({
			project: { id: 'proj-1', name: 'My Project' },
			tasks: page1Tasks,
		});

		mockRequest.mockResolvedValueOnce({
			project: { id: 'proj-1', name: 'My Project' },
			tasks: [
				{ id: 'task-100', title: 'Task 100' },
				{ id: 'task-101', title: 'Task 101' },
			],
		});

		const result = await Projects.getData(ctx as any, { projectId: 'proj-1' });

		expect(mockRequest).toHaveBeenCalledTimes(2);
		expect(mockRequest).toHaveBeenNthCalledWith(
			1,
			'project/proj-1/data',
			ctx,
			expect.objectContaining({
				query: { page: 1, limit: 100 },
			}),
		);
		expect(mockRequest).toHaveBeenNthCalledWith(
			2,
			'project/proj-1/data',
			ctx,
			expect.objectContaining({
				query: { page: 2, limit: 100 },
			}),
		);

		expect(result.tasks.length).toBe(101);
		expect(result.tasks[100]).toEqual({ id: 'task-101', title: 'Task 101' });
	});
});
