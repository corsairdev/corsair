import {
	Comments,
	CustomFields,
	CustomFieldValues,
	Projects,
	RecurringTasks,
	Schedules,
	Statuses,
	Tasks,
	Users,
	Workspaces,
} from './endpoints';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const ctx = { key: 'motion-test-key' };

const taskResource = {
	id: 'task_1',
	name: 'Draft launch post',
	description: '<p>Draft launch post</p>',
	deadlineType: 'SOFT',
	completed: false,
	creator: { id: 'usr_1', name: 'Ada', email: 'ada@example.com' },
};
const commentResource = {
	id: 'comment_1',
	taskId: 'task_1',
	content: '<p>Hi</p>',
	createdAt: '2026-01-01T00:00:00.000Z',
	creator: { id: 'usr_1', name: 'Ada', email: 'ada@example.com' },
};
const projectResource = {
	id: 'proj_1',
	name: 'Launch',
	description: '<p>Launch</p>',
	workspaceId: 'ws_1',
	status: { name: 'In Progress' },
};
const recurringTaskResource = {
	id: 'rt_1',
	name: 'Weekly sync',
	creator: { id: 'usr_1' },
	assignee: { id: 'usr_1' },
};
// Fixture items span every list family, so each stays a provider-defined
// record that the endpoint's own output schema validates.
const page = (items: Record<string, unknown>, key: string) => ({
	meta: { nextCursor: null, pageSize: 1 },
	[key]: [items],
});

let fetchMock: jest.SpyInstance;
let consoleErrorSpy: jest.SpyInstance;

const originalConsoleError = console.error.bind(console);

// Test responses stay arbitrary JSON so the public output schemas, not the
// test author, define what the seam accepts.
function respond(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(body === undefined ? null : JSON.stringify(body), {
			status,
			headers:
				body === undefined ? undefined : { 'Content-Type': 'application/json' },
		}),
	);
}

beforeEach(() => {
	// The shared transport logs its own empty-body parse warning when a documented
	// 200-without-body delete response is exercised; silence exactly that log so
	// test output stays readable while every other error still surfaces.
	consoleErrorSpy = jest
		.spyOn(console, 'error')
		// Console arguments are forwarded opaquely; only the transport's own
		// empty-body SyntaxError is filtered.
		.mockImplementation((...args: unknown[]) => {
			const first = args[0];
			if (
				first instanceof SyntaxError &&
				first.message === 'Unexpected end of JSON input'
			) {
				return;
			}
			originalConsoleError(...(args as Parameters<typeof console.error>));
		});
	fetchMock = jest.spyOn(globalThis, 'fetch').mockImplementation(() => {
		throw new Error('unmocked fetch');
	});
});

afterEach(() => {
	fetchMock.mockRestore();
	consoleErrorSpy.mockRestore();
});

describe('Motion operation seams', () => {
	const operations: Array<{
		name: string;
		call: () => Promise<unknown>;
		result: unknown;
		method: string;
		path: string;
	}> = [
		{
			name: 'tasks.list',
			call: () => Tasks.list(ctx as never, {}),
			result: page(taskResource, 'tasks'),
			method: 'GET',
			path: '/v1/tasks',
		},
		{
			name: 'tasks.create',
			call: () =>
				Tasks.create(ctx as never, {
					name: 'Draft launch post',
					workspaceId: 'ws_1',
				}),
			result: taskResource,
			method: 'POST',
			path: '/v1/tasks',
		},
		{
			name: 'tasks.get',
			call: () => Tasks.get(ctx as never, { id: 'task_1' }),
			result: taskResource,
			method: 'GET',
			path: '/v1/tasks/task_1',
		},
		{
			name: 'tasks.update',
			call: () =>
				Tasks.update(ctx as never, {
					id: 'task_1',
					name: 'Renamed',
					workspaceId: 'ws_1',
				}),
			result: taskResource,
			method: 'PATCH',
			path: '/v1/tasks/task_1',
		},
		{
			name: 'tasks.delete',
			call: () => Tasks.delete(ctx as never, { id: 'task_1' }),
			result: undefined,
			method: 'DELETE',
			path: '/v1/tasks/task_1',
		},
		{
			name: 'tasks.move',
			call: () =>
				Tasks.move(ctx as never, { id: 'task_1', workspaceId: 'ws_2' }),
			result: taskResource,
			method: 'PATCH',
			path: '/v1/tasks/task_1/move',
		},
		{
			name: 'tasks.unassign',
			call: () => Tasks.unassign(ctx as never, { id: 'task_1' }),
			result: undefined,
			method: 'DELETE',
			path: '/v1/tasks/task_1/assignee',
		},
		{
			name: 'projects.list',
			call: () => Projects.list(ctx as never, {}),
			result: page(projectResource, 'projects'),
			method: 'GET',
			path: '/v1/projects',
		},
		{
			name: 'projects.create',
			call: () =>
				Projects.create(ctx as never, { name: 'Launch', workspaceId: 'ws_1' }),
			result: projectResource,
			method: 'POST',
			path: '/v1/projects',
		},
		{
			name: 'projects.get',
			call: () => Projects.get(ctx as never, { id: 'proj_1' }),
			result: projectResource,
			method: 'GET',
			path: '/v1/projects/proj_1',
		},
		{
			name: 'workspaces.list',
			call: () => Workspaces.list(ctx as never, {}),
			result: page(
				{ id: 'ws_1', name: 'Team', teamId: 'team_1', type: 'team' },
				'workspaces',
			),
			method: 'GET',
			path: '/v1/workspaces',
		},
		{
			name: 'users.list',
			call: () => Users.list(ctx as never, {}),
			result: page({ id: 'usr_1', email: 'ada@example.com' }, 'users'),
			method: 'GET',
			path: '/v1/users',
		},
		{
			name: 'users.me',
			call: () => Users.me(ctx as never, {}),
			result: { id: 'usr_1', email: 'ada@example.com' },
			method: 'GET',
			path: '/v1/users/me',
		},
		{
			name: 'comments.list',
			call: () => Comments.list(ctx as never, { taskId: 'task_1' }),
			result: page(commentResource, 'comments'),
			method: 'GET',
			path: '/v1/comments?taskId=task_1',
		},
		{
			name: 'comments.create',
			call: () =>
				Comments.create(ctx as never, { taskId: 'task_1', content: 'Hi' }),
			result: commentResource,
			method: 'POST',
			path: '/v1/comments',
		},
		{
			name: 'recurringTasks.list',
			call: () => RecurringTasks.list(ctx as never, { workspaceId: 'ws_1' }),
			result: page(recurringTaskResource, 'tasks'),
			method: 'GET',
			path: '/v1/recurring-tasks?workspaceId=ws_1',
		},
		{
			name: 'recurringTasks.create',
			call: () =>
				RecurringTasks.create(ctx as never, {
					name: 'Weekly sync',
					workspaceId: 'ws_1',
					frequency: {},
					assigneeId: 'usr_1',
				}),
			result: recurringTaskResource,
			method: 'POST',
			path: '/v1/recurring-tasks',
		},
		{
			name: 'recurringTasks.delete',
			call: () => RecurringTasks.delete(ctx as never, { id: 'rt_1' }),
			result: undefined,
			method: 'DELETE',
			path: '/v1/recurring-tasks/rt_1',
		},
		{
			name: 'customFields.list',
			call: () => CustomFields.list(ctx as never, { workspaceId: 'ws_1' }),
			result: [{ id: 'cf_1', field: 'text' }],
			method: 'GET',
			path: '/beta/workspaces/ws_1/custom-fields',
		},
		{
			name: 'customFields.create',
			call: () =>
				CustomFields.create(ctx as never, {
					workspaceId: 'ws_1',
					type: 'text',
					name: 'Field',
				}),
			result: { id: 'cf_1', type: 'text' },
			method: 'POST',
			path: '/beta/workspaces/ws_1/custom-fields',
		},
		{
			name: 'customFields.delete',
			call: () =>
				CustomFields.delete(ctx as never, { workspaceId: 'ws_1', id: 'cf_1' }),
			result: undefined,
			method: 'DELETE',
			path: '/beta/workspaces/ws_1/custom-fields/cf_1',
		},
		{
			name: 'customFieldValues.addToProject',
			call: () =>
				CustomFieldValues.addToProject(ctx as never, {
					projectId: 'proj_1',
					customFieldInstanceId: 'cfi_1',
					value: { type: 'text', value: 'x' },
				}),
			result: { type: 'text', value: 'x' },
			method: 'POST',
			path: '/beta/custom-field-values/project/proj_1',
		},
		{
			name: 'customFieldValues.addToTask',
			call: () =>
				CustomFieldValues.addToTask(ctx as never, {
					taskId: 'task_1',
					customFieldInstanceId: 'cfi_1',
					value: { type: 'text', value: 'x' },
				}),
			result: { type: 'text', value: 'x' },
			method: 'POST',
			path: '/beta/custom-field-values/task/task_1',
		},
		{
			name: 'customFieldValues.deleteFromProject',
			call: () =>
				CustomFieldValues.deleteFromProject(ctx as never, {
					projectId: 'proj_1',
					valueId: 'value_1',
				}),
			result: undefined,
			method: 'DELETE',
			path: '/beta/custom-field-values/project/proj_1/custom-fields/value_1',
		},
		{
			name: 'customFieldValues.deleteFromTask',
			call: () =>
				CustomFieldValues.deleteFromTask(ctx as never, {
					taskId: 'task_1',
					valueId: 'value_1',
				}),
			result: undefined,
			method: 'DELETE',
			path: '/beta/custom-field-values/task/task_1/custom-fields/value_1',
		},
		{
			name: 'schedules.list',
			call: () => Schedules.list(ctx as never, {}),
			result: [
				{
					name: 'Work Hours',
					isDefaultTimezone: true,
					timezone: 'UTC',
					schedule: { monday: [{ start: '09:00', end: '17:00' }] },
				},
			],
			method: 'GET',
			path: '/v1/schedules',
		},
		{
			name: 'statuses.list',
			call: () => Statuses.list(ctx as never, { workspaceId: 'ws_1' }),
			result: [{ name: 'TODO', isDefaultStatus: true }],
			method: 'GET',
			path: '/v1/statuses?workspaceId=ws_1',
		},
	];

	it.each(operations)(
		'$name sends its documented method and path',
		async ({ call, result, method, path }) => {
			respond(result, result === undefined ? 200 : 200);
			await expect(call()).resolves.toEqual(
				result === undefined ? undefined : expect.anything(),
			);
			const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
			expect(url).toBe(`https://api.usemotion.com${path}`);
			expect(init.method).toBe(method);
			expect(new Headers(init.headers).get('x-api-key')).toBe(
				'motion-test-key',
			);
		},
	);
});
