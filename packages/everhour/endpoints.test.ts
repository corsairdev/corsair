import { logEventFromContext } from 'corsair/core';
import * as client from './client';
import * as clientEndpoints from './endpoints/clients';
import * as platformEndpoints from './endpoints/platforms';
import * as projectEndpoints from './endpoints/projects';
import * as taskEndpoints from './endpoints/tasks';
import * as timeEndpoints from './endpoints/time';
import * as timerEndpoints from './endpoints/timer';
import {
	EverhourEndpointInputSchemas,
	EverhourEndpointOutputSchemas,
} from './endpoints/types';
import * as userEndpoints from './endpoints/user';
import type { EverhourContext } from './index';

jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return {
		...actual,
		makeEverhourRequest: jest.fn(),
	};
});

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return {
		...actual,
		logEventFromContext: jest.fn(),
	};
});

describe('Everhour endpoints routing & event logging', () => {
	const mockMakeEverhourRequest =
		client.makeEverhourRequest as jest.MockedFunction<
			typeof client.makeEverhourRequest
		>;
	const mockLogEventFromContext = logEventFromContext as jest.MockedFunction<
		typeof logEventFromContext
	>;

	const ctx = {
		key: 'ev_test_key',
		endpoints: {},
	} as unknown as EverhourContext;

	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('User endpoints', () => {
		it('getUser issues GET /users/me', async () => {
			mockMakeEverhourRequest.mockResolvedValueOnce({
				id: 'user_1',
				email: 'test@example.com',
			} as any);
			const result = await userEndpoints.getUser(ctx);
			expect(result.id).toBe('user_1');
			expect(mockMakeEverhourRequest).toHaveBeenCalledWith(
				'/users/me',
				'ev_test_key',
			);
		});

		it('listTeamUsers issues GET /team/users', async () => {
			mockMakeEverhourRequest.mockResolvedValueOnce([{ id: 'user_1' }] as any);
			const result = await userEndpoints.listTeamUsers(ctx, {
				query: { search: 'test' },
			});
			expect(result).toHaveLength(1);
			expect(mockMakeEverhourRequest).toHaveBeenCalledWith(
				'/team/users',
				'ev_test_key',
				expect.objectContaining({
					method: 'GET',
					query: { search: 'test' },
				}),
			);
		});
	});

	describe('Timer endpoints', () => {
		it('getCurrentTimer issues GET /timers/current', async () => {
			mockMakeEverhourRequest.mockResolvedValueOnce({
				id: 'timer_1',
				status: 'active',
			} as any);
			const result = await timerEndpoints.getCurrentTimer(ctx);
			expect(result.id).toBe('timer_1');
			expect(mockMakeEverhourRequest).toHaveBeenCalledWith(
				'/timers/current',
				'ev_test_key',
			);
		});

		it('startTimer issues POST /timers', async () => {
			mockMakeEverhourRequest.mockResolvedValueOnce({ id: 'timer_1' } as any);
			const result = await timerEndpoints.startTimer(ctx, {
				task: 'task_1',
				comment: 'Testing',
			});
			expect(result.id).toBe('timer_1');
			expect(mockMakeEverhourRequest).toHaveBeenCalledWith(
				'/timers',
				'ev_test_key',
				expect.objectContaining({
					method: 'POST',
					body: { task: 'task_1', comment: 'Testing' },
				}),
			);
		});

		it('startTimer issues POST /timers when task is provided', async () => {
			mockMakeEverhourRequest.mockResolvedValueOnce({ id: 'timer_1' } as any);
			const result = await timerEndpoints.startTimer(ctx, { task: 'task_1' });
			expect(result.id).toBe('timer_1');
			expect(mockMakeEverhourRequest).toHaveBeenCalledWith(
				'/timers',
				'ev_test_key',
				expect.objectContaining({
					method: 'POST',
					body: { task: 'task_1' },
				}),
			);
		});

		it('stopTimer issues DELETE /timers/current', async () => {
			mockMakeEverhourRequest.mockResolvedValueOnce({
				id: 'timer_1',
				status: 'stopped',
			} as any);
			const result = await timerEndpoints.stopTimer(ctx);
			expect(result.status).toBe('stopped');
			expect(mockMakeEverhourRequest).toHaveBeenCalledWith(
				'/timers/current',
				'ev_test_key',
				expect.objectContaining({
					method: 'DELETE',
				}),
			);
		});
	});

	describe('Time endpoints', () => {
		it('listUserTime issues GET /users/:userId/time', async () => {
			mockMakeEverhourRequest.mockResolvedValueOnce([{ id: 'time_1' }] as any);
			const result = await timeEndpoints.listUserTime(ctx, {
				userId: 'user_1',
			});
			expect(result).toHaveLength(1);
			expect(mockMakeEverhourRequest).toHaveBeenCalledWith(
				'/users/user_1/time',
				'ev_test_key',
				expect.objectContaining({
					method: 'GET',
				}),
			);
		});

		it('listUserTimesheets issues GET /users/:userId/timesheets', async () => {
			mockMakeEverhourRequest.mockResolvedValueOnce([{ id: 'sheet_1' }] as any);
			const result = await timeEndpoints.listUserTimesheets(ctx, {
				userId: 'user_1',
			});
			expect(result).toHaveLength(1);
			expect(mockMakeEverhourRequest).toHaveBeenCalledWith(
				'/users/user_1/timesheets',
				'ev_test_key',
				expect.objectContaining({
					method: 'GET',
				}),
			);
		});

		it('logTime issues POST /time', async () => {
			mockMakeEverhourRequest.mockResolvedValueOnce({ id: 'time_1' } as any);
			const result = await timeEndpoints.logTime(ctx, {
				time: 3600,
				task: 'task_1',
			});
			expect(result.id).toBe('time_1');
			expect(mockMakeEverhourRequest).toHaveBeenCalledWith(
				'/time',
				'ev_test_key',
				expect.objectContaining({
					method: 'POST',
					body: { time: 3600, task: 'task_1' },
				}),
			);
		});

		it('updateTimeEntry issues PUT /time/:timeId', async () => {
			mockMakeEverhourRequest.mockResolvedValueOnce({
				id: 'time_1',
				task_id: 'task_1',
				user_id: 'user_1',
				start_date: new Date('2026-01-01T00:00:00.000Z'),
				duration: 7200,
			} as any);
			const result = await timeEndpoints.updateTimeEntry(ctx, {
				timeId: 'time_1',
				time: 7200,
			});
			expect(result.duration).toBe(7200);
			expect(mockMakeEverhourRequest).toHaveBeenCalledWith(
				'/time/time_1',
				'ev_test_key',
				expect.objectContaining({
					method: 'PUT',
					body: expect.objectContaining({ time: 7200 }),
				}),
			);
		});

		it('deleteTimeEntry issues DELETE /time/:timeId', async () => {
			mockMakeEverhourRequest.mockResolvedValueOnce({} as any);
			const result = await timeEndpoints.deleteTimeEntry(ctx, {
				timeId: 'time_1',
			});
			expect(mockMakeEverhourRequest).toHaveBeenCalledWith(
				'/time/time_1',
				'ev_test_key',
				expect.objectContaining({
					method: 'DELETE',
				}),
			);
		});
	});

	describe('Task endpoints', () => {
		it('searchTasks issues GET /tasks/search', async () => {
			mockMakeEverhourRequest.mockResolvedValueOnce([{ id: 'task_1' }] as any);
			const result = await taskEndpoints.searchTasks(ctx, { query: 'test' });
			expect(result).toHaveLength(1);
			expect(mockMakeEverhourRequest).toHaveBeenCalledWith(
				'/tasks/search',
				'ev_test_key',
				expect.objectContaining({
					method: 'GET',
					query: { query: 'test' },
				}),
			);
		});

		it('getTask issues GET /tasks/:taskId', async () => {
			mockMakeEverhourRequest.mockResolvedValueOnce({
				id: 'task_1',
				name: 'Test Task',
			} as any);
			const result = await taskEndpoints.getTask(ctx, { taskId: 'task_1' });
			expect(result.id).toBe('task_1');
			expect(mockMakeEverhourRequest).toHaveBeenCalledWith(
				'/tasks/task_1',
				'ev_test_key',
			);
		});

		it('listTasksForProject issues GET /projects/:projectId/tasks/search', async () => {
			mockMakeEverhourRequest.mockResolvedValueOnce([{ id: 'task_1' }] as any);
			const result = await taskEndpoints.listTasksForProject(ctx, {
				projectId: 'proj_1',
			});
			expect(result).toHaveLength(1);
			expect(mockMakeEverhourRequest).toHaveBeenCalledWith(
				'/projects/proj_1/tasks/search',
				'ev_test_key',
				expect.objectContaining({
					method: 'GET',
				}),
			);
		});
	});

	describe('Project endpoints', () => {
		it('listProjects issues GET /projects', async () => {
			mockMakeEverhourRequest.mockResolvedValueOnce([{ id: 'proj_1' }] as any);
			const result = await projectEndpoints.listProjects(ctx);
			expect(result).toHaveLength(1);
			expect(mockMakeEverhourRequest).toHaveBeenCalledWith(
				'/projects',
				'ev_test_key',
				expect.objectContaining({
					method: 'GET',
				}),
			);
		});

		it('getProject issues GET /projects/:projectId', async () => {
			mockMakeEverhourRequest.mockResolvedValueOnce({
				id: 'proj_1',
				name: 'Project 1',
			} as any);
			const result = await projectEndpoints.getProject(ctx, {
				projectId: 'proj_1',
			});
			expect(result.id).toBe('proj_1');
			expect(mockMakeEverhourRequest).toHaveBeenCalledWith(
				'/projects/proj_1',
				'ev_test_key',
			);
		});
	});

	describe('Client endpoints', () => {
		it('listClients issues GET /clients', async () => {
			mockMakeEverhourRequest.mockResolvedValueOnce([
				{ id: 'client_1' },
			] as any);
			const result = await clientEndpoints.listClients(ctx);
			expect(result).toHaveLength(1);
			expect(mockMakeEverhourRequest).toHaveBeenCalledWith(
				'/clients',
				'ev_test_key',
				expect.objectContaining({
					method: 'GET',
				}),
			);
		});

		it('getClient issues GET /clients/:clientId', async () => {
			mockMakeEverhourRequest.mockResolvedValueOnce({
				id: 'client_1',
				name: 'Client 1',
			} as any);
			const result = await clientEndpoints.getClient(ctx, {
				clientId: 'client_1',
			});
			expect(result.id).toBe('client_1');
			expect(mockMakeEverhourRequest).toHaveBeenCalledWith(
				'/clients/client_1',
				'ev_test_key',
			);
		});
	});

	describe('Platform endpoints', () => {
		it('listPlatforms issues GET /platforms', async () => {
			mockMakeEverhourRequest.mockResolvedValueOnce([{ id: 'plat_1' }] as any);
			const result = await platformEndpoints.listPlatforms(ctx);
			expect(result).toHaveLength(1);
			expect(mockMakeEverhourRequest).toHaveBeenCalledWith(
				'/platforms',
				'ev_test_key',
			);
		});
	});

	describe('Webhook event persistence', () => {
		it('returns 500 when event persistence fails', async () => {
			const { EverhourWebhooks } = await import('./webhooks');
			mockLogEventFromContext.mockResolvedValueOnce(null as never);

			const result = await EverhourWebhooks['api:time:updated'].handler(ctx, {
				headers: { 'x-hook-secret': 'ev_test_key' },
				payload: {
					type: 'api:time:updated',
					created_at: '2026-01-01T00:00:00.000Z',
					data: {},
				},
				rawBody:
					'{"type":"api:time:updated","created_at":"2026-01-01T00:00:00.000Z","data":{}}',
			} as any);

			expect(result).toEqual(
				expect.objectContaining({ success: false, statusCode: 500 }),
			);
		});
	});

	describe('Endpoint schemas', () => {
		it('rejects invalid input for startTimer when task is missing', () => {
			const result = EverhourEndpointInputSchemas.startTimer.safeParse({});
			expect(result.success).toBe(false);
		});

		it('rejects invalid write input for logTime', () => {
			const result = EverhourEndpointInputSchemas.logTime.safeParse({
				time: '3600',
			});
			expect(result.success).toBe(false);
		});

		it('rejects malformed provider output for timer endpoints', () => {
			const result = EverhourEndpointOutputSchemas.getCurrentTimer.safeParse({
				status: 1,
			});
			expect(result.success).toBe(false);
		});

		it('rejects malformed provider output for listUserTimesheets', () => {
			const result = EverhourEndpointOutputSchemas.listUserTimesheets.safeParse(
				[{ missing: 'id' }],
			);
			expect(result.success).toBe(false);
		});
	});
});
