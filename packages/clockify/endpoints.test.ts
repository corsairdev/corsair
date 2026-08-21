import { makeClockifyRequest } from './client';
import { Projects, Tasks, TimeEntries, Workspaces } from './endpoints';

jest.mock('./client', () => ({
	makeClockifyRequest: jest.fn(),
}));

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
			},
		);
		expect(result).toEqual(mockResponse);
	});

	it('lists time entries', async () => {
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
			projectId: 'p1',
		});
		expect(makeClockifyRequest).toHaveBeenCalledWith(
			'workspaces/w1/time-entries',
			'test-api-key',
			{
				method: 'GET',
				query: { projectId: 'p1' },
			},
		);
		expect(result).toEqual(mockResponse);
	});
});
