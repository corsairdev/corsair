import { Comments, CustomFieldValues, Tasks } from './endpoints';

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

let fetchMock: jest.SpyInstance;
let consoleErrorSpy: jest.SpyInstance;

const originalConsoleError = console.error.bind(console);

// Fixtures cover different endpoint responses and malformed payloads, so no
// single narrower type is appropriate; output schemas validate each response.
function respond(
	body: unknown,
	status = 200,
	headers?: Record<string, string>,
) {
	fetchMock.mockResolvedValueOnce(
		new Response(body === undefined ? null : JSON.stringify(body), {
			status,
			headers: headers ?? { 'Content-Type': 'application/json' },
		}),
	);
}

beforeEach(() => {
	// The shared transport logs its own empty-body parse warning when a documented
	// 200-without-body delete response is exercised; silence exactly that log so
	// test output stays readable while every other error still surfaces. The error
	// is matched by message, not instanceof: jest runs tests in a vm context, so
	// undici's SyntaxError comes from Node's primary realm and fails instanceof.
	consoleErrorSpy = jest
		.spyOn(console, 'error')
		// Console accepts values of any shape, so the spy must forward opaque arguments
		// rather than claim they match a narrower error or message type.
		.mockImplementation((...args: unknown[]) => {
			const first = args[0];
			if (
				String((first as { message?: unknown } | undefined)?.message) ===
				'Unexpected end of JSON input'
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

describe('Motion public seam behavior', () => {
	it('requests page two of tasks with the documented cursor', async () => {
		respond({ meta: { nextCursor: null, pageSize: 1 }, tasks: [taskResource] });
		await Tasks.list(ctx as never, { cursor: 'cursor_2' });
		const [url] = fetchMock.mock.calls[0] as [string];
		expect(url).toBe('https://api.usemotion.com/v1/tasks?cursor=cursor_2');
	});

	it('feeds the returned cursor into the next tasks list request', async () => {
		respond({
			meta: { nextCursor: 'cursor_2', pageSize: 1 },
			tasks: [taskResource],
		});
		const page = await Tasks.list(ctx as never, {});
		expect(page.meta.nextCursor).toBe('cursor_2');
		// Motion returns null on the final page, so narrow before reusing the cursor.
		const cursor = page.meta.nextCursor;
		if (cursor == null) throw new Error('expected a next cursor');
		respond({ meta: { nextCursor: null, pageSize: 1 }, tasks: [] });
		await Tasks.list(ctx as never, { cursor });
		const [url] = fetchMock.mock.calls[1] as [string];
		expect(url).toBe('https://api.usemotion.com/v1/tasks?cursor=cursor_2');
	});

	it('requests page two of comments with the documented cursor', async () => {
		respond({
			meta: { nextCursor: null, pageSize: 1 },
			comments: [],
		});
		await Comments.list(ctx as never, { taskId: 'task_1', cursor: 'cursor_9' });
		const [url] = fetchMock.mock.calls[0] as [string];
		expect(url).toBe(
			'https://api.usemotion.com/v1/comments?taskId=task_1&cursor=cursor_9',
		);
	});

	it('renders status filters as repeated query keys', async () => {
		respond({ meta: { nextCursor: null, pageSize: 0 }, tasks: [] });
		await Tasks.list(ctx as never, { status: ['HARD', 'SOFT'] });
		const [url] = fetchMock.mock.calls[0] as [string];
		expect(url).toBe(
			'https://api.usemotion.com/v1/tasks?status=HARD&status=SOFT',
		);
	});

	it('rejects list inputs that set both status and includeAllStatuses', async () => {
		await expect(
			Tasks.list(ctx as never, {
				status: ['HARD'],
				includeAllStatuses: true,
			}),
		).rejects.toThrow(/Provide status or includeAllStatuses/);
	});

	it('rejects route identifiers that are not safe path segments', async () => {
		await expect(Tasks.get(ctx as never, { id: '../admin' })).rejects.toThrow(
			/Route identifiers must be safe path segments/,
		);
		await expect(Tasks.get(ctx as never, { id: 'task/1' })).rejects.toThrow(
			/Route identifiers must be safe path segments/,
		);
	});

	it('rejects unsafe route identifiers in the custom-field-value families', async () => {
		await expect(
			CustomFieldValues.deleteFromTask(ctx as never, {
				taskId: 'task_1',
				valueId: '..',
			}),
		).rejects.toThrow(/Route identifiers must be safe path segments/);
		await expect(
			CustomFieldValues.addToProject(ctx as never, {
				projectId: '../x',
				customFieldInstanceId: 'cfi_1',
				value: { type: 'text', value: 'x' },
			}),
		).rejects.toThrow(/Route identifiers must be safe path segments/);
	});

	it('keeps an explicitly cleared autoScheduled null in the create body', async () => {
		respond(taskResource);
		await Tasks.create(ctx as never, {
			name: 'Draft launch post',
			workspaceId: 'ws_1',
			autoScheduled: null,
		});
		const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(init.method).toBe('POST');
		// Inspect the serialized wire object without assuming the unasserted fields
		// have a particular value type.
		const body = JSON.parse(String(init.body)) as Record<string, unknown>;
		expect(body.autoScheduled).toBeNull();
		expect(body.name).toBe('Draft launch post');
	});

	it('nests scheduling options inside autoScheduled, not at the top level', async () => {
		respond(taskResource);
		await Tasks.create(ctx as never, {
			name: 'Draft launch post',
			workspaceId: 'ws_1',
			autoScheduled: {
				startDate: '2026-01-01',
				deadlineType: 'HARD',
				schedule: 'Work Hours',
			},
		});
		const body = JSON.parse(
			String((fetchMock.mock.calls[0] as [string, RequestInit])[1].body),
		) as Record<string, unknown>;
		expect(body.autoScheduled).toEqual({
			startDate: '2026-01-01',
			deadlineType: 'HARD',
			schedule: 'Work Hours',
		});
		expect(body.startDate).toBeUndefined();
		expect(body.deadlineType).toBeUndefined();
		expect(body.schedule).toBeUndefined();
	});

	it('parses documented person custom-field values from objects', async () => {
		respond({
			type: 'person',
			value: { id: 'usr_1', name: 'Ada', email: 'ada@example.com' },
		});
		await expect(
			CustomFieldValues.addToProject(ctx as never, {
				projectId: 'proj_1',
				customFieldInstanceId: 'cfi_1',
				value: { type: 'person', value: 'usr_1' },
			}),
		).resolves.toMatchObject({
			type: 'person',
			value: { id: 'usr_1', name: 'Ada', email: 'ada@example.com' },
		});
	});

	it('keeps the custom field value wrapper while omitting the path project id', async () => {
		respond({ type: 'text', value: 'x' });
		await CustomFieldValues.addToProject(ctx as never, {
			projectId: 'proj_1',
			customFieldInstanceId: 'cfi_1',
			value: { type: 'text', value: 'x' },
		});
		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toBe(
			'https://api.usemotion.com/beta/custom-field-values/project/proj_1',
		);
		// Inspect the serialized wire object without assuming the unasserted fields
		// have a particular value type.
		const body = JSON.parse(String(init.body)) as Record<string, unknown>;
		expect(body.customFieldInstanceId).toBe('cfi_1');
		expect(body.value).toEqual({ type: 'text', value: 'x' });
		expect(body.projectId).toBeUndefined();
	});

	it('returns undefined for documented 200 delete responses without a body schema', async () => {
		respond(undefined, 200);
		await expect(
			Tasks.delete(ctx as never, { id: 123 }),
		).resolves.toBeUndefined();
		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toBe('https://api.usemotion.com/v1/tasks/123');
		expect(init.method).toBe('DELETE');
	});

	it('propagates provider rate limits as the core ApiError unchanged', async () => {
		respond({ message: 'rate limited' }, 429, {
			'Content-Type': 'application/json',
			'retry-after': '5',
		});
		await expect(Tasks.list(ctx as never, {})).rejects.toMatchObject({
			name: 'ApiError',
			status: 429,
		});
	});
});
