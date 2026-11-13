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
	fetchMock = jest.spyOn(globalThis, 'fetch').mockImplementation(() => {
		throw new Error('unmocked fetch');
	});
});

afterEach(() => fetchMock.mockRestore());

describe('Motion public seam behavior', () => {
	it('requests page two of tasks with the documented cursor', async () => {
		respond({ meta: { nextCursor: null, pageSize: 1 }, tasks: [taskResource] });
		await Tasks.list(ctx as never, { cursor: 'cursor_2' });
		const [url] = fetchMock.mock.calls[0] as [string];
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

	it('keeps an explicitly cleared autoScheduled null in the create body', async () => {
		respond(taskResource);
		await Tasks.create(ctx as never, {
			name: 'Draft launch post',
			workspaceId: 'ws_1',
			autoScheduled: null,
		});
		const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(init.method).toBe('POST');
		const body = JSON.parse(String(init.body)) as Record<string, unknown>;
		expect(body.autoScheduled).toBeNull();
		expect(body.name).toBe('Draft launch post');
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

	it('routes provider rate limits through MotionAPIError with retry metadata', async () => {
		respond({ message: 'rate limited' }, 429, {
			'Content-Type': 'application/json',
			'retry-after': '5',
		});
		await expect(Tasks.list(ctx as never, {})).rejects.toMatchObject({
			name: 'MotionAPIError',
			status: 429,
		});
	});
});
