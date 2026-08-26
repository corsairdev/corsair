import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { makeClockifyRequest } from './client';
import { Projects, Tasks, TimeEntries, Workspaces } from './endpoints';
import { clockify } from './index';

function rateLimitError(retryAfter = 0): ApiError {
	return new ApiError(
		{ method: 'POST', url: '/time-entries' },
		{
			url: '/time-entries',
			ok: false,
			status: 429,
			statusText: 'Too Many Requests',
			body: {},
		},
		'request failed with status 429',
		{ retryAfter },
	);
}

jest.mock('./client', () => {
	const actual = jest.requireActual('./client') as typeof import('./client');
	return {
		...actual,
		makeClockifyRequest: jest.fn(),
	};
});

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(async () => undefined),
}));

const mockContext = {
	key: 'test-api-key',
	provider: 'clockify',
	authType: 'api_key',
} as any;

describe('Clockify endpoints', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('lists workspaces', async () => {
		const mockResponse = [{ id: 'w1', name: 'Workspace 1' }];
		(makeClockifyRequest as jest.Mock).mockResolvedValue(mockResponse);

		const result = await Workspaces.list(mockContext, {});
		expect(makeClockifyRequest).toHaveBeenCalledWith(
			'workspaces',
			'test-api-key',
			{ method: 'GET' },
		);
		expect(result).toEqual(mockResponse);
		expect(logEventFromContext).toHaveBeenCalled();
	});

	it('does not log completion when workspace output fails validation', async () => {
		(makeClockifyRequest as jest.Mock).mockResolvedValue([{ id: 1 }]);
		await expect(Workspaces.list(mockContext, {})).rejects.toThrow();
		expect(logEventFromContext).not.toHaveBeenCalled();
	});

	it('lists projects', async () => {
		const mockResponse = [{ id: 'p1', name: 'Project 1', workspaceId: 'w1' }];
		(makeClockifyRequest as jest.Mock).mockResolvedValue(mockResponse);

		const result = await Projects.list(mockContext, { workspaceId: 'w1' });
		expect(makeClockifyRequest).toHaveBeenCalledWith(
			'workspaces/w1/projects',
			'test-api-key',
			{ method: 'GET' },
		);
		expect(result).toEqual(mockResponse);
	});

	it('forwards Clockify page and page-size on projects.list', async () => {
		(makeClockifyRequest as jest.Mock).mockResolvedValue([]);
		await Projects.list(mockContext, {
			workspaceId: 'w1',
			page: 2,
			pageSize: 100,
		});
		expect(makeClockifyRequest).toHaveBeenCalledWith(
			'workspaces/w1/projects',
			'test-api-key',
			{
				method: 'GET',
				query: { page: 2, 'page-size': 100 },
			},
		);
	});

	it('rejects invalid list input before calling Clockify', async () => {
		await expect(
			Projects.list(mockContext, {
				workspaceId: 'w1',
				page: 0,
			}),
		).rejects.toThrow();
		await expect(
			Projects.list(mockContext, {
				workspaceId: 'w1',
				pageSize: 5001,
			}),
		).rejects.toThrow();
		expect(makeClockifyRequest).not.toHaveBeenCalled();
	});

	it('rejects empty identifiers and malformed timestamps', async () => {
		await expect(
			Projects.list(mockContext, { workspaceId: '   ' }),
		).rejects.toThrow();
		await expect(
			TimeEntries.list(mockContext, {
				workspaceId: 'w1',
				userId: '',
			}),
		).rejects.toThrow();
		await expect(
			TimeEntries.create(mockContext, {
				workspaceId: 'w1',
				description: 'Testing entry',
				start: 'not-a-timestamp',
			}),
		).rejects.toThrow();
		expect(makeClockifyRequest).not.toHaveBeenCalled();
	});

	it('lists tasks', async () => {
		const mockResponse = [{ id: 't1', name: 'Task 1', projectId: 'p1' }];
		(makeClockifyRequest as jest.Mock).mockResolvedValue(mockResponse);

		const result = await Tasks.list(mockContext, {
			workspaceId: 'w1',
			projectId: 'p1',
		});
		expect(makeClockifyRequest).toHaveBeenCalledWith(
			'workspaces/w1/projects/p1/tasks',
			'test-api-key',
			{ method: 'GET' },
		);
		expect(result).toEqual(mockResponse);
	});

	it('forwards Clockify page and page-size on tasks.list', async () => {
		(makeClockifyRequest as jest.Mock).mockResolvedValue([]);
		await Tasks.list(mockContext, {
			workspaceId: 'w1',
			projectId: 'p1',
			page: 3,
			pageSize: 25,
		});
		expect(makeClockifyRequest).toHaveBeenCalledWith(
			'workspaces/w1/projects/p1/tasks',
			'test-api-key',
			{
				method: 'GET',
				query: { page: 3, 'page-size': 25 },
			},
		);
	});

	it('creates time entry', async () => {
		const mockResponse = {
			id: 'te1',
			description: 'Testing entry',
			workspaceId: 'w1',
			projectId: 'p1',
			taskId: 't1',
			timeInterval: {
				start: '2026-08-21T10:00:00Z',
				end: '2026-08-21T11:00:00Z',
			},
		};
		(makeClockifyRequest as jest.Mock).mockResolvedValue(mockResponse);

		const result = await TimeEntries.create(mockContext, {
			workspaceId: 'w1',
			description: 'Testing entry',
			start: '2026-08-21T10:00:00Z',
			end: '2026-08-21T11:00:00Z',
			projectId: 'p1',
			taskId: 't1',
		});
		expect(makeClockifyRequest).toHaveBeenCalledWith(
			'workspaces/w1/time-entries',
			'test-api-key',
			{
				method: 'POST',
				body: {
					description: 'Testing entry',
					start: '2026-08-21T10:00:00Z',
					end: '2026-08-21T11:00:00Z',
					projectId: 'p1',
					taskId: 't1',
				},
				retries: false,
			},
		);
		expect(result).toEqual(mockResponse);
	});

	it('does not retry a 429 on timeEntries.create', async () => {
		(makeClockifyRequest as jest.Mock).mockRejectedValue(rateLimitError());

		await expect(
			TimeEntries.create(mockContext, {
				workspaceId: 'w1',
				description: 'Testing entry',
				start: '2026-08-21T10:00:00Z',
			}),
		).rejects.toMatchObject({ status: 429 });
		expect(makeClockifyRequest).toHaveBeenCalledTimes(1);
		expect(logEventFromContext).not.toHaveBeenCalled();
	});

	it('does not retry a non-429 create failure', async () => {
		const error = new ApiError(
			{ method: 'POST', url: '/time-entries' },
			{
				url: '/time-entries',
				ok: false,
				status: 400,
				statusText: 'Bad Request',
				body: {},
			},
			'request failed with status 400',
		);
		(makeClockifyRequest as jest.Mock).mockRejectedValue(error);

		await expect(
			TimeEntries.create(mockContext, {
				workspaceId: 'w1',
				description: 'Testing entry',
				start: '2026-08-21T10:00:00Z',
			}),
		).rejects.toMatchObject({ status: 400 });
		expect(makeClockifyRequest).toHaveBeenCalledTimes(1);
		expect(logEventFromContext).not.toHaveBeenCalled();
	});

	it('accepts a Clockify time entry with a null timeInterval', async () => {
		const mockResponse = {
			id: 'te1',
			description: 'Testing entry',
			workspaceId: 'w1',
			timeInterval: null,
		};
		(makeClockifyRequest as jest.Mock).mockResolvedValue(mockResponse);

		await expect(
			TimeEntries.create(mockContext, {
				workspaceId: 'w1',
				description: 'Testing entry',
				start: '2026-08-21T10:00:00Z',
			}),
		).resolves.toEqual(mockResponse);
	});

	it('lists time entries for a user on the Clockify user path', async () => {
		const mockResponse = [
			{
				id: 'te1',
				description: 'Testing entry',
				workspaceId: 'w1',
				projectId: 'p1',
				taskId: 't1',
				timeInterval: {
					start: '2026-08-21T10:00:00Z',
					end: '2026-08-21T11:00:00Z',
				},
			},
		];
		(makeClockifyRequest as jest.Mock).mockResolvedValue(mockResponse);

		const result = await TimeEntries.list(mockContext, {
			workspaceId: 'w1',
			userId: 'u1',
			project: 'p1',
		});
		expect(makeClockifyRequest).toHaveBeenCalledWith(
			'workspaces/w1/user/u1/time-entries',
			'test-api-key',
			{
				method: 'GET',
				query: { project: 'p1' },
			},
		);
		expect(result).toEqual(mockResponse);
	});

	it('forwards Clockify page and page-size on timeEntries.list', async () => {
		(makeClockifyRequest as jest.Mock).mockResolvedValue([]);
		await TimeEntries.list(mockContext, {
			workspaceId: 'w1',
			userId: 'u1',
			page: 1,
			pageSize: 50,
		});
		expect(makeClockifyRequest).toHaveBeenCalledWith(
			'workspaces/w1/user/u1/time-entries',
			'test-api-key',
			{
				method: 'GET',
				query: { page: 1, 'page-size': 50 },
			},
		);
	});
});

describe('clockify keyBuilder', () => {
	type KeyBuilder = (
		ctx: unknown,
		source: 'endpoint' | 'webhook',
	) => Promise<string>;
	const keyBuilderOf = (plugin: { keyBuilder?: unknown }) =>
		plugin.keyBuilder as KeyBuilder;
	const keyContext = (key?: string) =>
		({
			authType: 'api_key',
			keys: { get_api_key: async () => key },
		}) as any;

	it('returns the configured key', async () => {
		const plugin = clockify({ key: 'inline-key' });
		await expect(keyBuilderOf(plugin)(keyContext(), 'endpoint')).resolves.toBe(
			'inline-key',
		);
	});

	it('returns the stored api key', async () => {
		const plugin = clockify();
		await expect(
			keyBuilderOf(plugin)(keyContext('stored-key'), 'endpoint'),
		).resolves.toBe('stored-key');
	});

	it('throws AuthMissingError when no key is available', async () => {
		const plugin = clockify();
		await expect(
			keyBuilderOf(plugin)(keyContext(), 'endpoint'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});
