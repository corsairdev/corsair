import { logEventFromContext } from 'corsair/core';
import { ZodError } from 'zod';
import * as Tasks from './endpoints/tasks';
import {
	TodoistEndpointInputSchemas,
	TodoistEndpointOutputSchemas,
} from './endpoints/types';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(async () => undefined),
}));

void logEventFromContext;

function makeCtx() {
	const db = {
		tasks: {
			upsertByEntityId: jest.fn(async () => undefined),
		},
	};
	return {
		// unknown: test stub is not the full plugin context
		ctx: { key: 'test-token', db } as unknown as Parameters<
			typeof Tasks.move
		>[0],
		db,
	};
}

const originalFetch = global.fetch;
let captured: { url: string; method: string; body?: string } | undefined;

function mockFetch(payload: object) {
	captured = undefined;
	// unknown: jest stub is not a full Response
	global.fetch = (async (url: string | URL, init?: RequestInit) => {
		captured = {
			url: String(url),
			method: init?.method ?? 'GET',
			body: typeof init?.body === 'string' ? init.body : undefined,
		};
		return {
			ok: true,
			status: 200,
			statusText: 'OK',
			url: String(url),
			headers: new Headers({ 'Content-Type': 'application/json' }),
			json: async () => payload,
			text: async () => JSON.stringify(payload),
		};
	}) as unknown as typeof global.fetch;
}

// Shape of the documented 200 response for POST /api/v1/tasks/{task_id}/move
// (ItemSyncView in https://developer.todoist.com/api/v1), with the moved
// task's ids swapped in.
const movedTask = {
	user_id: '1234567',
	id: 'task-1',
	project_id: 'project-2',
	section_id: null,
	parent_id: null,
	added_by_uid: '1234567',
	assigned_by_uid: null,
	responsible_uid: null,
	labels: ['priority'],
	deadline: null,
	duration: null,
	is_collapsed: false,
	checked: false,
	is_deleted: false,
	added_at: '2025-01-15T10:30:00Z',
	completed_at: null,
	completed_by_uid: null,
	updated_at: '2025-01-17T10:30:00Z',
	due: {
		date: '2025-02-12',
		is_recurring: false,
		lang: 'en',
		string: 'tomorrow',
	},
	priority: 1,
	child_order: 1,
	order_key: 'a1V',
	content: 'Buy milk',
	description: 'Pick up organic milk',
	note_count: 0,
	day_order: 1,
	completed_count: 3,
	postponed_count: 1,
};

describe('tasks.move', () => {
	afterEach(() => {
		global.fetch = originalFetch;
		captured = undefined;
	});

	it('posts project_id to the move route and stores the returned task', async () => {
		mockFetch(movedTask);
		const { ctx, db } = makeCtx();

		const result = await Tasks.move(ctx, {
			id: 'task-1',
			project_id: 'project-2',
		});

		expect(captured?.method).toBe('POST');
		expect(captured?.url).toBe(
			'https://api.todoist.com/api/v1/tasks/task-1/move',
		);
		expect(JSON.parse(captured?.body ?? '{}')).toEqual({
			project_id: 'project-2',
		});
		expect(result).toEqual(movedTask);
		expect(
			TodoistEndpointOutputSchemas.tasksMove.safeParse(result).success,
		).toBe(true);
		expect(db.tasks.upsertByEntityId).toHaveBeenCalledWith('task-1', movedTask);
	});

	it('posts section_id alone', async () => {
		mockFetch(movedTask);
		const { ctx } = makeCtx();

		await Tasks.move(ctx, { id: 'task-1', section_id: 'section-3' });

		expect(JSON.parse(captured?.body ?? '{}')).toEqual({
			section_id: 'section-3',
		});
	});

	it('posts parent_id alone', async () => {
		mockFetch(movedTask);
		const { ctx } = makeCtx();

		await Tasks.move(ctx, { id: 'task-1', parent_id: 'task-9' });

		expect(JSON.parse(captured?.body ?? '{}')).toEqual({
			parent_id: 'task-9',
		});
	});

	it('does not call Todoist without exactly one destination', async () => {
		mockFetch(movedTask);
		const { ctx } = makeCtx();
		// The move input union forbids these shapes. The cast reaches the runtime parse.
		const move = Tasks.move as (
			ctx: Parameters<typeof Tasks.move>[0],
			input: unknown,
		) => ReturnType<typeof Tasks.move>;

		await expect(move(ctx, { id: 'task-1' })).rejects.toThrow(ZodError);
		await expect(
			move(ctx, {
				id: 'task-1',
				project_id: 'project-2',
				section_id: 'section-3',
			}),
		).rejects.toThrow(ZodError);
		await expect(
			move(ctx, { id: 'task-1', project_id: 'project-2', order: 4 }),
		).rejects.toThrow(ZodError);
		expect(captured).toBeUndefined();
	});

	it('rejects those inputs on the published schema', () => {
		expect(
			TodoistEndpointInputSchemas.tasksMove.safeParse({ id: 'task-1' }).success,
		).toBe(false);
		expect(
			TodoistEndpointInputSchemas.tasksMove.safeParse({
				id: 'task-1',
				project_id: 'project-2',
				parent_id: 'task-9',
			}).success,
		).toBe(false);
		expect(
			TodoistEndpointInputSchemas.tasksMove.safeParse({
				id: 'task-1',
				section_id: 'section-3',
				order: 4,
			}).success,
		).toBe(false);
	});
});
