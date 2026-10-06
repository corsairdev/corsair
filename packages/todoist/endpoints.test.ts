import { logEventFromContext } from 'corsair/core';
import * as Tasks from './endpoints/tasks';

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

const movedTask = {
	id: 'task-1',
	project_id: 'project-2',
	section_id: null,
	parent_id: null,
	content: 'Write report',
};

describe('tasks.move', () => {
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
