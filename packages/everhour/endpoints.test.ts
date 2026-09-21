import { logEventFromContext } from 'corsair/core';
import * as client from './client';
import * as clientEndpoints from './endpoints/clients';
import * as expenseEndpoints from './endpoints/expenses';
import * as hookEndpoints from './endpoints/hooks';
import * as invoiceEndpoints from './endpoints/invoices';
import * as platformEndpoints from './endpoints/platforms';
import * as projectEndpoints from './endpoints/projects';
import * as sectionEndpoints from './endpoints/sections';
import * as tagEndpoints from './endpoints/tags';
import * as taskEndpoints from './endpoints/tasks';
import * as timeEndpoints from './endpoints/time';
import * as timecardEndpoints from './endpoints/timecards';
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

	// Test-only mock with just the fields endpoints read; narrowed to context type.
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
			const result = await userEndpoints.getUser(ctx, {});
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

		it('listTeams reads workspace from GET /users/me', async () => {
			mockMakeEverhourRequest.mockResolvedValueOnce({
				id: 1,
				name: 'Ada',
				team: { id: 9, name: 'Acme' },
			} as any);
			const result = await userEndpoints.listTeams(ctx, {});
			expect(result).toEqual([{ id: 9, name: 'Acme' }]);
			expect(mockMakeEverhourRequest).toHaveBeenCalledWith(
				'/users/me',
				'ev_test_key',
			);
		});
	});

	describe('Timer endpoints', () => {
		it('getCurrentTimer issues GET /timers/current', async () => {
			mockMakeEverhourRequest.mockResolvedValueOnce({
				id: 'timer_1',
				status: 'active',
			} as any);
			const result = await timerEndpoints.getCurrentTimer(ctx, {});
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
			const result = await timerEndpoints.stopTimer(ctx, {});
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

		it('listTasksForProject issues GET /projects/:projectId/tasks', async () => {
			mockMakeEverhourRequest.mockResolvedValueOnce([{ id: 'task_1' }] as any);
			const result = await taskEndpoints.listTasksForProject(ctx, {
				projectId: 'proj_1',
			});
			expect(result).toHaveLength(1);
			expect(mockMakeEverhourRequest).toHaveBeenCalledWith(
				'/projects/proj_1/tasks',
				'ev_test_key',
				expect.objectContaining({
					method: 'GET',
				}),
			);
		});

		it('createTask issues POST /projects/:projectId/tasks', async () => {
			mockMakeEverhourRequest.mockResolvedValueOnce({
				id: 'ev:1',
				name: 'Write tests',
			} as any);
			const result = await taskEndpoints.createTask(ctx, {
				projectId: 'ev:proj',
				name: 'Write tests',
			});
			expect(result.name).toBe('Write tests');
			expect(mockMakeEverhourRequest).toHaveBeenCalledWith(
				'/projects/ev:proj/tasks',
				'ev_test_key',
				expect.objectContaining({
					method: 'POST',
					body: { name: 'Write tests' },
				}),
			);
		});
	});

	describe('Project endpoints', () => {
		it('listProjects issues GET /projects', async () => {
			mockMakeEverhourRequest.mockResolvedValueOnce([{ id: 'proj_1' }] as any);
			const result = await projectEndpoints.listProjects(ctx, {});
			expect(result).toHaveLength(1);
			expect(mockMakeEverhourRequest).toHaveBeenCalledWith(
				'/projects',
				'ev_test_key',
				expect.objectContaining({
					method: 'GET',
				}),
			);
		});

		it('listProjects forwards page and limit', async () => {
			mockMakeEverhourRequest.mockResolvedValueOnce([{ id: 'proj_1' }] as any);
			await projectEndpoints.listProjects(ctx, { page: 2, limit: 50 });
			expect(mockMakeEverhourRequest).toHaveBeenCalledWith(
				'/projects',
				'ev_test_key',
				expect.objectContaining({
					method: 'GET',
					query: expect.objectContaining({ page: 2, limit: 50 }),
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
			const result = await clientEndpoints.listClients(ctx, {});
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
			const result = await platformEndpoints.listPlatforms(ctx, {});
			expect(result).toHaveLength(1);
			expect(mockMakeEverhourRequest).toHaveBeenCalledWith(
				'/platforms',
				'ev_test_key',
			);
		});
	});

	describe('Project writes', () => {
		it('createProject issues POST /projects', async () => {
			mockMakeEverhourRequest.mockResolvedValueOnce({
				id: 'ev:1',
				name: 'New',
			} as any);
			const result = await projectEndpoints.createProject(ctx, {
				name: 'New',
				type: 'list',
			});
			expect(result.name).toBe('New');
			expect(mockMakeEverhourRequest).toHaveBeenCalledWith(
				'/projects',
				'ev_test_key',
				expect.objectContaining({
					method: 'POST',
					body: expect.objectContaining({ name: 'New', type: 'list' }),
				}),
			);
		});

		it('updateProject issues PUT /projects/:projectId', async () => {
			mockMakeEverhourRequest.mockResolvedValueOnce({
				id: 'ev:1',
				name: 'Renamed',
			} as any);
			await projectEndpoints.updateProject(ctx, {
				projectId: 'ev:1',
				name: 'Renamed',
			});
			expect(mockMakeEverhourRequest).toHaveBeenCalledWith(
				'/projects/ev:1',
				'ev_test_key',
				expect.objectContaining({
					method: 'PUT',
					body: { name: 'Renamed' },
				}),
			);
		});

		it('deleteProject issues DELETE /projects/:projectId', async () => {
			mockMakeEverhourRequest.mockResolvedValueOnce(undefined as any);
			await projectEndpoints.deleteProject(ctx, { projectId: 'ev:1' });
			expect(mockMakeEverhourRequest).toHaveBeenCalledWith(
				'/projects/ev:1',
				'ev_test_key',
				expect.objectContaining({ method: 'DELETE' }),
			);
		});
	});

	describe('Client writes', () => {
		it('createClient issues POST /clients', async () => {
			mockMakeEverhourRequest.mockResolvedValueOnce({
				id: 1,
				name: 'Acme',
			} as any);
			const result = await clientEndpoints.createClient(ctx, { name: 'Acme' });
			expect(result.name).toBe('Acme');
			expect(mockMakeEverhourRequest).toHaveBeenCalledWith(
				'/clients',
				'ev_test_key',
				expect.objectContaining({
					method: 'POST',
					body: expect.objectContaining({ name: 'Acme' }),
				}),
			);
		});

		it('updateClient issues PUT /clients/:clientId', async () => {
			mockMakeEverhourRequest.mockResolvedValueOnce({
				id: 1,
				name: 'Acme',
				status: 'archived',
			} as any);
			await clientEndpoints.updateClient(ctx, {
				clientId: '1',
				status: 'archived',
			});
			expect(mockMakeEverhourRequest).toHaveBeenCalledWith(
				'/clients/1',
				'ev_test_key',
				expect.objectContaining({
					method: 'PUT',
					body: { status: 'archived' },
				}),
			);
		});

		it('deleteClient issues DELETE /clients/:clientId', async () => {
			mockMakeEverhourRequest.mockResolvedValueOnce(undefined as any);
			await clientEndpoints.deleteClient(ctx, { clientId: '1' });
			expect(mockMakeEverhourRequest).toHaveBeenCalledWith(
				'/clients/1',
				'ev_test_key',
				expect.objectContaining({ method: 'DELETE' }),
			);
		});
	});

	describe('Section endpoints', () => {
		it('listSections issues GET /projects/:projectId/sections', async () => {
			mockMakeEverhourRequest.mockResolvedValueOnce([
				{ id: 1, name: 'Todo', project: 'ev:1', position: 1 },
			] as any);
			const result = await sectionEndpoints.listSections(ctx, {
				projectId: 'ev:1',
			});
			expect(result).toHaveLength(1);
			expect(mockMakeEverhourRequest).toHaveBeenCalledWith(
				'/projects/ev:1/sections',
				'ev_test_key',
			);
		});

		it('getSection issues GET /sections/:sectionId', async () => {
			mockMakeEverhourRequest.mockResolvedValueOnce({
				id: 1,
				name: 'Todo',
				project: 'ev:1',
				position: 1,
			} as any);
			const result = await sectionEndpoints.getSection(ctx, { sectionId: '1' });
			expect(result.id).toBe(1);
			expect(mockMakeEverhourRequest).toHaveBeenCalledWith(
				'/sections/1',
				'ev_test_key',
			);
		});

		it('createSection issues POST /projects/:projectId/sections', async () => {
			mockMakeEverhourRequest.mockResolvedValueOnce({
				id: 2,
				name: 'Done',
				project: 'ev:1',
				position: 2,
			} as any);
			await sectionEndpoints.createSection(ctx, {
				projectId: 'ev:1',
				name: 'Done',
			});
			expect(mockMakeEverhourRequest).toHaveBeenCalledWith(
				'/projects/ev:1/sections',
				'ev_test_key',
				expect.objectContaining({
					method: 'POST',
					body: { name: 'Done' },
				}),
			);
		});

		it('deleteSection issues DELETE /sections/:sectionId', async () => {
			mockMakeEverhourRequest.mockResolvedValueOnce(undefined as any);
			await sectionEndpoints.deleteSection(ctx, { sectionId: '2' });
			expect(mockMakeEverhourRequest).toHaveBeenCalledWith(
				'/sections/2',
				'ev_test_key',
				expect.objectContaining({ method: 'DELETE' }),
			);
		});
	});

	describe('Timecard endpoints', () => {
		it('clockIn issues POST /users/:userId/timecards/clock-in', async () => {
			mockMakeEverhourRequest.mockResolvedValueOnce({
				user: 89,
				workTime: 0,
			} as any);
			const result = await timecardEndpoints.clockIn(ctx, { userId: '89' });
			expect(result.user).toBe(89);
			expect(mockMakeEverhourRequest).toHaveBeenCalledWith(
				'/users/89/timecards/clock-in',
				'ev_test_key',
				expect.objectContaining({ method: 'POST' }),
			);
		});

		it('clockOut issues POST /users/:userId/timecards/clock-out', async () => {
			mockMakeEverhourRequest.mockResolvedValueOnce({
				user: 89,
				workTime: 3600,
			} as any);
			await timecardEndpoints.clockOut(ctx, { userId: '89' });
			expect(mockMakeEverhourRequest).toHaveBeenCalledWith(
				'/users/89/timecards/clock-out',
				'ev_test_key',
				expect.objectContaining({ method: 'POST' }),
			);
		});

		it('getTimecard issues GET /users/:userId/timecards/:date', async () => {
			mockMakeEverhourRequest.mockResolvedValueOnce({
				user: 89,
				workTime: 28800,
				date: '2020-10-21',
			} as any);
			const result = await timecardEndpoints.getTimecard(ctx, {
				userId: '89',
				date: '2020-10-21',
			});
			expect(result.date).toBe('2020-10-21');
			expect(mockMakeEverhourRequest).toHaveBeenCalledWith(
				'/users/89/timecards/2020-10-21',
				'ev_test_key',
			);
		});

		it('listTimecards issues GET /timecards with date filters', async () => {
			mockMakeEverhourRequest.mockResolvedValueOnce([] as any);
			await timecardEndpoints.listTimecards(ctx, {
				from: '2020-10-01',
				to: '2020-11-01',
			});
			expect(mockMakeEverhourRequest).toHaveBeenCalledWith(
				'/timecards',
				'ev_test_key',
				expect.objectContaining({
					method: 'GET',
					query: { from: '2020-10-01', to: '2020-11-01' },
				}),
			);
		});

		it('listUserTimecards issues GET /users/:userId/timecards', async () => {
			mockMakeEverhourRequest.mockResolvedValueOnce([] as any);
			await timecardEndpoints.listUserTimecards(ctx, { userId: '89' });
			expect(mockMakeEverhourRequest).toHaveBeenCalledWith(
				'/users/89/timecards',
				'ev_test_key',
				expect.objectContaining({ method: 'GET' }),
			);
		});

		it('updateTimecard issues PUT /users/:userId/timecards/:date', async () => {
			mockMakeEverhourRequest.mockResolvedValueOnce({
				user: 89,
				workTime: 28800,
			} as any);
			await timecardEndpoints.updateTimecard(ctx, {
				userId: '89',
				date: '2020-10-21',
				clockIn: '09:00',
				clockOut: '18:00',
			});
			expect(mockMakeEverhourRequest).toHaveBeenCalledWith(
				'/users/89/timecards/2020-10-21',
				'ev_test_key',
				expect.objectContaining({
					method: 'PUT',
					body: { clockIn: '09:00', clockOut: '18:00' },
				}),
			);
		});

		it('deleteTimecard issues DELETE /users/:userId/timecards/:date', async () => {
			mockMakeEverhourRequest.mockResolvedValueOnce(undefined as any);
			await timecardEndpoints.deleteTimecard(ctx, {
				userId: '89',
				date: '2020-10-21',
			});
			expect(mockMakeEverhourRequest).toHaveBeenCalledWith(
				'/users/89/timecards/2020-10-21',
				'ev_test_key',
				expect.objectContaining({ method: 'DELETE' }),
			);
		});
	});

	describe('Timesheet approval endpoints', () => {
		it('requestTimesheetApproval issues POST /timesheets/:id/approval', async () => {
			mockMakeEverhourRequest.mockResolvedValueOnce({
				id: 148562535,
				status: 'pending',
			} as any);
			const result = await timeEndpoints.requestTimesheetApproval(ctx, {
				timesheetId: '148562535',
				comment: 'please review',
			});
			expect(result.status).toBe('pending');
			expect(mockMakeEverhourRequest).toHaveBeenCalledWith(
				'/timesheets/148562535/approval',
				'ev_test_key',
				expect.objectContaining({
					method: 'POST',
					body: { comment: 'please review' },
				}),
			);
		});

		it('discardTimesheetApproval issues PUT /timesheets/:id/discard-approval', async () => {
			mockMakeEverhourRequest.mockResolvedValueOnce({
				id: 148562535,
				status: 'discarded',
			} as any);
			await timeEndpoints.discardTimesheetApproval(ctx, {
				timesheetId: '148562535',
			});
			expect(mockMakeEverhourRequest).toHaveBeenCalledWith(
				'/timesheets/148562535/discard-approval',
				'ev_test_key',
				expect.objectContaining({ method: 'PUT' }),
			);
		});
	});

	describe('Expense and invoice endpoints', () => {
		it('listExpenses issues GET /expenses', async () => {
			mockMakeEverhourRequest.mockResolvedValueOnce([{ id: 1 }] as any);
			const result = await expenseEndpoints.listExpenses(ctx, {});
			expect(result).toHaveLength(1);
			expect(mockMakeEverhourRequest).toHaveBeenCalledWith(
				'/expenses',
				'ev_test_key',
				expect.objectContaining({ method: 'GET' }),
			);
		});

		it('listExpenseCategories issues GET /expenses/categories', async () => {
			mockMakeEverhourRequest.mockResolvedValueOnce([
				{ id: 1, name: 'Mileage' },
			] as any);
			const result = await expenseEndpoints.listExpenseCategories(ctx, {});
			expect(result[0]?.name).toBe('Mileage');
			expect(mockMakeEverhourRequest).toHaveBeenCalledWith(
				'/expenses/categories',
				'ev_test_key',
			);
		});

		it('listInvoices issues GET /invoices', async () => {
			mockMakeEverhourRequest.mockResolvedValueOnce([{ id: 1 }] as any);
			const result = await invoiceEndpoints.listInvoices(ctx, {});
			expect(result).toHaveLength(1);
			expect(mockMakeEverhourRequest).toHaveBeenCalledWith(
				'/invoices',
				'ev_test_key',
				expect.objectContaining({ method: 'GET' }),
			);
		});
	});

	describe('Webhook CRUD endpoints', () => {
		it('listWebhooks issues GET /hooks', async () => {
			mockMakeEverhourRequest.mockResolvedValueOnce([{ id: 1 }] as any);
			const result = await hookEndpoints.listWebhooks(ctx, {});
			expect(result).toHaveLength(1);
			expect(mockMakeEverhourRequest).toHaveBeenCalledWith(
				'/hooks',
				'ev_test_key',
			);
		});

		it('getWebhook issues GET /hooks/:hookId', async () => {
			mockMakeEverhourRequest.mockResolvedValueOnce({
				id: 1,
				targetUrl: 'https://example.com',
				events: ['api:time:updated'],
			} as any);
			const result = await hookEndpoints.getWebhook(ctx, { hookId: '1' });
			expect(result.id).toBe(1);
			expect(mockMakeEverhourRequest).toHaveBeenCalledWith(
				'/hooks/1',
				'ev_test_key',
			);
		});

		it('createWebhook issues POST /hooks', async () => {
			mockMakeEverhourRequest.mockResolvedValueOnce({
				id: 1,
				targetUrl: 'https://example.com',
				events: ['api:time:updated'],
			} as any);
			await hookEndpoints.createWebhook(ctx, {
				targetUrl: 'https://example.com',
				events: ['api:time:updated'],
			});
			expect(mockMakeEverhourRequest).toHaveBeenCalledWith(
				'/hooks',
				'ev_test_key',
				expect.objectContaining({
					method: 'POST',
					body: expect.objectContaining({
						targetUrl: 'https://example.com',
						events: ['api:time:updated'],
					}),
				}),
			);
		});

		it('updateWebhook issues PUT /hooks/:hookId', async () => {
			mockMakeEverhourRequest.mockResolvedValueOnce({
				id: 1,
				events: ['api:timer:started'],
			} as any);
			await hookEndpoints.updateWebhook(ctx, {
				hookId: '1',
				events: ['api:timer:started'],
			});
			expect(mockMakeEverhourRequest).toHaveBeenCalledWith(
				'/hooks/1',
				'ev_test_key',
				expect.objectContaining({
					method: 'PUT',
					body: { events: ['api:timer:started'] },
				}),
			);
		});

		it('deleteWebhook issues DELETE /hooks/:hookId', async () => {
			mockMakeEverhourRequest.mockResolvedValueOnce(undefined as any);
			await hookEndpoints.deleteWebhook(ctx, { hookId: '1' });
			expect(mockMakeEverhourRequest).toHaveBeenCalledWith(
				'/hooks/1',
				'ev_test_key',
				expect.objectContaining({ method: 'DELETE' }),
			);
		});
	});

	describe('Tag endpoints', () => {
		it('listTags issues GET /tags', async () => {
			mockMakeEverhourRequest.mockResolvedValueOnce([
				{ id: 1, name: 'high', color: '#ee7070' },
			] as any);
			const result = await tagEndpoints.listTags(ctx, {});
			expect(result[0]?.name).toBe('high');
			expect(mockMakeEverhourRequest).toHaveBeenCalledWith(
				'/tags',
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

		it('rejects invalid write input for createClient', () => {
			const result = EverhourEndpointInputSchemas.createClient.safeParse({});
			expect(result.success).toBe(false);
		});

		it('rejects invalid write input for createWebhook', () => {
			const result = EverhourEndpointInputSchemas.createWebhook.safeParse({
				targetUrl: 'https://example.com',
			});
			expect(result.success).toBe(false);
		});

		it('rejects malformed provider output for getTimecard', () => {
			const result = EverhourEndpointOutputSchemas.getTimecard.safeParse({
				user: 89,
			});
			expect(result.success).toBe(false);
		});
	});
});
