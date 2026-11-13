import {
	GoogleTasksEndpointInputSchemas,
	GoogleTasksEndpointOutputSchemas,
} from './endpoints/types';
import { googleTasksEndpointSchemas, googletasks } from './index';

const operationNames = [
	'taskLists.list',
	'taskLists.get',
	'taskLists.insert',
	'taskLists.update',
	'taskLists.patch',
	'taskLists.delete',
	'tasks.list',
	'tasks.get',
	'tasks.insert',
	'tasks.update',
	'tasks.patch',
	'tasks.delete',
	'tasks.move',
	'tasks.clear',
] as const;

describe('Google Tasks endpoint schemas', () => {
	it('keeps endpoint handlers, input/output schemas, and metadata aligned', () => {
		const plugin = googletasks();
		if (!plugin.endpoints)
			throw new Error('Google Tasks endpoints were not registered');
		expect(Object.keys(googleTasksEndpointSchemas).sort()).toEqual(
			[...operationNames].sort(),
		);
		expect(Object.keys(plugin.endpointMeta ?? {}).sort()).toEqual(
			[...operationNames].sort(),
		);
		expect(Object.keys(plugin.endpoints.taskLists).sort()).toEqual([
			'delete',
			'get',
			'insert',
			'list',
			'patch',
			'update',
		]);
		expect(Object.keys(plugin.endpoints.tasks).sort()).toEqual([
			'clear',
			'delete',
			'get',
			'insert',
			'list',
			'move',
			'patch',
			'update',
		]);
	});

	it('rejects undocumented request fields and invalid page bounds', () => {
		expect(
			GoogleTasksEndpointInputSchemas.taskListsList.safeParse({
				maxResults: 1001,
			}).success,
		).toBe(false);
		expect(
			GoogleTasksEndpointInputSchemas.tasksList.safeParse({
				taskListId: 'list-1',
				maxResults: 101,
			}).success,
		).toBe(false);
		expect(
			GoogleTasksEndpointInputSchemas.tasksList.safeParse({
				taskListId: 'list-1',
				updatedMin: '2026-03-01',
			}).success,
		).toBe(false);
		expect(
			GoogleTasksEndpointInputSchemas.tasksMove.safeParse({
				taskListId: 'list-1',
				taskId: 'task-1',
				callback: 'https://attacker.invalid',
			}).success,
		).toBe(false);
		expect(
			GoogleTasksEndpointInputSchemas.tasksPatch.safeParse({
				taskListId: 'list-1',
				taskId: 'task-1',
				task: { callback: 'https://attacker.invalid' },
			}).success,
		).toBe(false);
	});

	it('validates provider pagination, task fields, and empty 204 outputs', () => {
		expect(
			GoogleTasksEndpointInputSchemas.tasksInsert.safeParse({
				taskListId: 'list-1',
				task: { title: 'Scheduled', due: '2026-03-31T23:59:59Z' },
			}).success,
		).toBe(true);
		expect(
			GoogleTasksEndpointOutputSchemas.taskListsList.parse({
				items: [{ id: 'list-1', title: 'Tasks' }],
				nextPageToken: 'opaque-next-token',
			}),
		).toMatchObject({ nextPageToken: 'opaque-next-token' });
		expect(
			GoogleTasksEndpointOutputSchemas.tasksList.parse({
				items: [{ id: 'task-1', status: 'needsAction' }],
			}),
		).toMatchObject({ items: [{ status: 'needsAction' }] });
		expect(
			GoogleTasksEndpointOutputSchemas.tasksGet.safeParse({
				id: 'task-1',
				status: 'unknown',
			}).success,
		).toBe(false);
		expect(GoogleTasksEndpointOutputSchemas.tasksDelete.parse(undefined)).toBe(
			undefined,
		);
		expect(GoogleTasksEndpointOutputSchemas.tasksClear.parse(undefined)).toBe(
			undefined,
		);
	});

	it('requests only the configured least-privilege Google Tasks scope', () => {
		expect(googletasks().oauthConfig?.scopes).toEqual([
			'https://www.googleapis.com/auth/tasks',
		]);
		expect(googletasks({ scopeMode: 'readonly' }).oauthConfig?.scopes).toEqual([
			'https://www.googleapis.com/auth/tasks.readonly',
		]);
	});
});
