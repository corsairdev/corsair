import { logEventFromContext } from 'corsair/core';
import * as Tasks from './endpoints/tasks';
import { TodoistEndpointOutputSchemas } from './endpoints/types';

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
	it('accepts the documented move response as its output', () => {
		const parsed = TodoistEndpointOutputSchemas.tasksMove.safeParse(movedTask);

		expect(parsed.success).toBe(true);
		expect(parsed.data).toMatchObject({
			id: 'task-1',
			project_id: 'project-2',
			section_id: null,
			parent_id: null,
		});
	});

	it('posts to the move route with only the move fields', async () => {
		mockFetch(movedTask);
		const { ctx } = makeCtx();

		await Tasks.move(ctx, { id: 'task-1', project_id: 'project-2' });

		expect(captured?.method).toBe('POST');
		expect(captured?.url).toBe(
			'https://api.todoist.com/api/v1/tasks/task-1/move',
		);
		expect(JSON.parse(captured?.body ?? '{}')).toEqual({
			project_id: 'project-2',
		});
	});

	it('sends section_id and parent_id without the task id or order', async () => {
		mockFetch(movedTask);
		const { ctx } = makeCtx();

		await Tasks.move(ctx, {
			id: 'task-1',
			section_id: 'section-3',
			parent_id: 'task-9',
			order: 4,
		});

		expect(JSON.parse(captured?.body ?? '{}')).toEqual({
			section_id: 'section-3',
			parent_id: 'task-9',
		});
	});

	it('stores the moved task returned by Todoist', async () => {
		mockFetch(movedTask);
		const { ctx, db } = makeCtx();

		const result = await Tasks.move(ctx, {
			id: 'task-1',
			project_id: 'project-2',
		});

		expect(result).toEqual(movedTask);
		expect(db.tasks.upsertByEntityId).toHaveBeenCalledWith('task-1', movedTask);
	});
});
