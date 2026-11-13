import { logEventFromContext } from 'corsair/core';
import { request } from 'corsair/http';
import { GoogleTasksEndpointInputSchemas } from './endpoints/types';
import type { GoogleTasksContext } from './index';
import { googletasks } from './index';

jest.mock('corsair/core', () => {
	const actual =
		jest.requireActual<typeof import('corsair/core')>('corsair/core');
	return {
		...actual,
		logEventFromContext: jest.fn().mockResolvedValue(null),
	};
});

jest.mock('corsair/http', () => {
	const actual =
		jest.requireActual<typeof import('corsair/http')>('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockedRequest = jest.mocked(request);
const mockedLog = jest.mocked(logEventFromContext);
const plugin = googletasks();
const endpoints = plugin.endpoints;
if (!endpoints) throw new Error('Google Tasks endpoints were not registered');

const ctx: GoogleTasksContext = {
	key: 'oauth-access-token',
	options: { authType: 'oauth_2', scopeMode: 'full' },
	$getAccountId: async () => 'account-id',
	db: {},
	endpoints: {},
	keys: {
		get_dek: async () => 'dek',
		issue_new_dek: async () => 'dek',
		get_access_token: async () => 'oauth-access-token',
		set_access_token: async () => undefined,
		get_refresh_token: async () => 'refresh-token',
		set_refresh_token: async () => undefined,
		get_expires_at: async () => null,
		set_expires_at: async () => undefined,
		get_scope: async () => null,
		set_scope: async () => undefined,
		get_webhook_signature: async () => null,
		set_webhook_signature: async () => undefined,
		get_integration_credentials: async () => ({
			client_id: null,
			client_secret: null,
			redirect_url: null,
		}),
	},
};

function expectRequest(
	url: string,
	method: string,
	body?: object,
	query?: object,
): void {
	const options = mockedRequest.mock.calls.at(-1)?.[1];
	expect(options?.url).toBe(url);
	expect(options?.method).toBe(method);
	expect(options?.body).toEqual(body);
	expect(options?.query).toEqual(query);
}

describe('Google Tasks endpoint routing', () => {
	beforeEach(() => {
		mockedRequest.mockReset().mockResolvedValue({});
		mockedLog.mockClear();
	});

	it('covers all documented task-list operations and request placement', async () => {
		await endpoints.taskLists.list(ctx, { maxResults: 50, pageToken: 'next' });
		expectRequest('/tasks/v1/users/@me/lists', 'GET', undefined, {
			maxResults: 50,
			pageToken: 'next',
		});

		await endpoints.taskLists.get(ctx, { taskListId: '@default' });
		expectRequest('/tasks/v1/users/@me/lists/%40default', 'GET');

		await endpoints.taskLists.insert(ctx, {
			taskList: { title: 'Private list title' },
		});
		expectRequest('/tasks/v1/users/@me/lists', 'POST', {
			title: 'Private list title',
		});

		await endpoints.taskLists.update(ctx, {
			taskListId: 'list-1',
			taskList: { title: 'Updated list' },
		});
		expectRequest('/tasks/v1/users/@me/lists/list-1', 'PUT', {
			title: 'Updated list',
		});

		await endpoints.taskLists.patch(ctx, {
			taskListId: 'list-1',
			taskList: { title: 'Patched list' },
		});
		expectRequest('/tasks/v1/users/@me/lists/list-1', 'PATCH', {
			title: 'Patched list',
		});

		mockedRequest.mockResolvedValue(undefined);
		await endpoints.taskLists.delete(ctx, { taskListId: 'list-1' });
		expectRequest('/tasks/v1/users/@me/lists/list-1', 'DELETE');
	});

	it('covers all documented task operations, filters, body, and move query', async () => {
		await endpoints.tasks.list(ctx, {
			taskListId: 'list-1',
			completedMax: '2026-03-31T23:59:59Z',
			completedMin: '2026-03-01T00:00:00Z',
			dueMax: '2026-03-31T23:59:59Z',
			dueMin: '2026-03-01T00:00:00Z',
			maxResults: 100,
			pageToken: 'next-page',
			showAssigned: true,
			showCompleted: false,
			showDeleted: true,
			showHidden: true,
			updatedMin: '2026-03-01T00:00:00Z',
		});
		expectRequest('/tasks/v1/lists/list-1/tasks', 'GET', undefined, {
			completedMax: '2026-03-31T23:59:59Z',
			completedMin: '2026-03-01T00:00:00Z',
			dueMax: '2026-03-31T23:59:59Z',
			dueMin: '2026-03-01T00:00:00Z',
			maxResults: 100,
			pageToken: 'next-page',
			showAssigned: true,
			showCompleted: false,
			showDeleted: true,
			showHidden: true,
			updatedMin: '2026-03-01T00:00:00Z',
		});

		await endpoints.tasks.get(ctx, {
			taskListId: 'list 1',
			taskId: 'task/2',
		});
		expectRequest('/tasks/v1/lists/list%201/tasks/task%2F2', 'GET');

		await endpoints.tasks.insert(ctx, {
			taskListId: 'list-1',
			task: { title: 'Private task text', notes: 'Private note' },
			parent: 'parent-1',
			previous: 'previous-1',
		});
		expectRequest(
			'/tasks/v1/lists/list-1/tasks',
			'POST',
			{
				title: 'Private task text',
				notes: 'Private note',
			},
			{ parent: 'parent-1', previous: 'previous-1' },
		);

		await endpoints.tasks.update(ctx, {
			taskListId: 'list-1',
			taskId: 'task-1',
			task: { title: 'Replace task' },
		});
		expectRequest('/tasks/v1/lists/list-1/tasks/task-1', 'PUT', {
			title: 'Replace task',
		});

		await endpoints.tasks.patch(ctx, {
			taskListId: 'list-1',
			taskId: 'task-1',
			task: { status: 'completed' },
		});
		expectRequest('/tasks/v1/lists/list-1/tasks/task-1', 'PATCH', {
			status: 'completed',
		});

		mockedRequest.mockResolvedValue(undefined);
		await endpoints.tasks.delete(ctx, {
			taskListId: 'list-1',
			taskId: 'task-1',
		});
		expectRequest('/tasks/v1/lists/list-1/tasks/task-1', 'DELETE');

		mockedRequest.mockResolvedValue({});
		await endpoints.tasks.move(ctx, {
			taskListId: 'list-1',
			taskId: 'task-1',
			destinationTasklist: 'list-2',
			parent: 'parent-2',
			previous: 'previous-2',
		});
		expectRequest(
			'/tasks/v1/lists/list-1/tasks/task-1/move',
			'POST',
			undefined,
			{
				destinationTasklist: 'list-2',
				parent: 'parent-2',
				previous: 'previous-2',
			},
		);

		mockedRequest.mockResolvedValue(undefined);
		await endpoints.tasks.clear(ctx, { taskListId: 'list-1' });
		expectRequest('/tasks/v1/lists/list-1/clear', 'POST');
	});

	it('rejects invalid input before network I/O and logs no task data', async () => {
		await expect(
			endpoints.tasks.list(ctx, { taskListId: 'list-1', maxResults: 101 }),
		).rejects.toThrow();
		expect(
			GoogleTasksEndpointInputSchemas.taskListsList.safeParse({
				callback: 'https://attacker.invalid',
			}).success,
		).toBe(false);
		expect(mockedRequest).not.toHaveBeenCalled();

		mockedRequest.mockResolvedValue({
			id: 'list-1',
			title: 'Private list title',
		});
		await endpoints.taskLists.insert(ctx, {
			taskList: { title: 'Private list title' },
		});
		expect(mockedLog).toHaveBeenLastCalledWith(
			ctx,
			'googletasks.taskLists.insert',
			{},
			'completed',
		);
	});
});
