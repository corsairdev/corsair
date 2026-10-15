import { logEventFromContext } from 'corsair/core';
import { Tasks } from './endpoints';
import { TodoistEndpointOutputSchemas } from './endpoints/types';
import type { TodoistContext } from './index';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(async () => undefined),
}));

const mockLogEvent = logEventFromContext as jest.MockedFunction<
	typeof logEventFromContext
>;

const movedTask = {
	id: 'task-1',
	project_id: 'project-2',
	section_id: null,
	parent_id: null,
	content: 'Moved task',
	description: '',
	is_completed: false,
	labels: [],
	order: 1,
	priority: 1,
	due: null,
	url: 'https://todoist.com/showTask?id=task-1',
	comment_count: 0,
	created_at: '2026-01-01T00:00:00Z',
	creator_id: 'user-1',
};

function makeCtx() {
	const tasks = {
		upsertByEntityId: jest.fn(async () => undefined),
		deleteByEntityId: jest.fn(async () => true),
	};
	const ctx = {
		key: 'test-todoist-token',
		options: {},
		db: { tasks },
		database: undefined,
		$getAccountId: async () => 'test-account',
	};
	// Safe: `move` only reads `ctx.key` and `ctx.db.tasks`. Building a
	// full `TodoistContext` (key manager, schema, hooks) is not practical
	// in this unit test.
	return { ctx: ctx as unknown as TodoistContext, tasks };
}

let lastUrl = '';
let lastMethod = '';
let lastBody: string | undefined;

beforeEach(() => {
	mockLogEvent.mockClear();
	lastUrl = '';
	lastMethod = '';
	lastBody = undefined;
	const stub = async (url: unknown, init?: RequestInit) => {
		lastUrl = String(url);
		lastMethod = init?.method ?? 'GET';
		lastBody = typeof init?.body === 'string' ? init.body : undefined;
		return {
			ok: true,
			status: 200,
			statusText: 'OK',
			url: String(url),
			headers: new Headers({ 'Content-Type': 'application/json' }),
			json: async () => movedTask,
			text: async () => JSON.stringify(movedTask),
		};
	};
	// Safe: corsair/http types `fetch` as the DOM Fetch API. This stub
	// only records url/method/body and returns JSON; a complete Response
	// is not practical here.
	global.fetch = stub as unknown as typeof global.fetch;
});

describe('tasks.move', () => {
	it('posts only destination fields to the move route', async () => {
		const { ctx, tasks } = makeCtx();

		const result = await Tasks.move(ctx, {
			id: 'task-1',
			project_id: 'project-2',
			order: 9,
		});

		expect(lastMethod).toBe('POST');
		expect(lastUrl).toBe('https://api.todoist.com/api/v1/tasks/task-1/move');
		expect(JSON.parse(lastBody ?? '{}')).toEqual({
			project_id: 'project-2',
		});
		expect(result).toEqual(movedTask);
		expect(tasks.upsertByEntityId).toHaveBeenCalledWith('task-1', movedTask);
	});

	it('posts section_id when that is the only destination', async () => {
		const { ctx } = makeCtx();

		await Tasks.move(ctx, {
			id: 'task-1',
			section_id: 'section-3',
		});

		expect(JSON.parse(lastBody ?? '{}')).toEqual({
			section_id: 'section-3',
		});
	});

	it('posts parent_id when that is the only destination', async () => {
		const { ctx } = makeCtx();

		await Tasks.move(ctx, {
			id: 'task-1',
			parent_id: 'task-9',
		});

		expect(JSON.parse(lastBody ?? '{}')).toEqual({
			parent_id: 'task-9',
		});
	});

	it('parses the move response with the tasksMove output schema', () => {
		const parsed = TodoistEndpointOutputSchemas.tasksMove.safeParse(movedTask);
		expect(parsed.success).toBe(true);
		if (parsed.success) {
			expect(parsed.data).toEqual(movedTask);
		}
	});
});
