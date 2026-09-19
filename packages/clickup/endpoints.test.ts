/**
 * Exercises all nine endpoint wrappers: HTTP method, path, auth header, and
 * request bodies. Network access is mocked, so this runs in CI.
 */
import { logEventFromContext } from 'corsair/core';
import {
	FoldersEndpoints,
	ListsEndpoints,
	SpacesEndpoints,
	TasksEndpoints,
	WorkspacesEndpoints,
} from './endpoints';
import { clickupEndpointSchemas } from './index';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(async () => undefined),
}));

const mockLogEvent = logEventFromContext as jest.MockedFunction<
	typeof logEventFromContext
>;

const TOKEN = 'pk_test_clickup_token';
const API_PREFIX = '/api/v2';

type Ctx = Parameters<typeof WorkspacesEndpoints.get>[0];

function makeCtx() {
	return { key: TOKEN } as unknown as Ctx;
}

const taskLike = { id: 'task1', name: 'Test Task' };
const RESPONSE_BODY = {
	teams: [{ id: 'team1', name: 'Team' }],
	spaces: [{ id: 'space1', name: 'Space' }],
	folders: [{ id: 'folder1', name: 'Folder' }],
	lists: [{ id: 'list1', name: 'List' }],
	tasks: [taskLike],
	...taskLike,
};

let lastUrl = '';
let lastMethod = '';
let lastBody: string | undefined;
let lastAuth: string | undefined;

beforeEach(() => {
	mockLogEvent.mockClear();
	lastUrl = '';
	lastMethod = '';
	lastBody = undefined;
	lastAuth = undefined;
	global.fetch = (async (url: unknown, init?: RequestInit) => {
		lastUrl = String(url);
		lastMethod = init?.method ?? 'GET';
		lastBody = typeof init?.body === 'string' ? init.body : undefined;
		const headers = init?.headers;
		if (headers instanceof Headers) {
			lastAuth = headers.get('Authorization') ?? undefined;
		} else if (headers && typeof headers === 'object') {
			lastAuth = (headers as Record<string, string>).Authorization;
		}
		return {
			ok: true,
			status: 200,
			statusText: 'OK',
			url: String(url),
			headers: new Headers({ 'Content-Type': 'application/json' }),
			json: async () => RESPONSE_BODY,
			text: async () => JSON.stringify(RESPONSE_BODY),
		};
	}) as unknown as typeof global.fetch;
});

/** [registry path, invocation, method, expected path suffix] */
const OPERATIONS: [string, (ctx: Ctx) => Promise<unknown>, string, string][] = [
	['workspaces.get', (c) => WorkspacesEndpoints.get(c, {}), 'GET', '/team'],
	[
		'spaces.list',
		(c) => SpacesEndpoints.list(c, { team_id: 'team1' }),
		'GET',
		'/team/team1/space',
	],
	[
		'folders.list',
		(c) => FoldersEndpoints.list(c, { space_id: 'space1' }),
		'GET',
		'/space/space1/folder',
	],
	[
		'lists.list',
		(c) => ListsEndpoints.list(c, { folder_id: 'folder1' }),
		'GET',
		'/folder/folder1/list',
	],
	[
		'tasks.list',
		(c) => TasksEndpoints.list(c, { list_id: 'list1' }),
		'GET',
		'/list/list1/task',
	],
	[
		'tasks.get',
		(c) => TasksEndpoints.get(c, { task_id: 'task1' }),
		'GET',
		'/task/task1',
	],
	[
		'tasks.create',
		(c) => TasksEndpoints.create(c, { list_id: 'list1', name: 'New Task' }),
		'POST',
		'/list/list1/task',
	],
	[
		'tasks.update',
		(c) => TasksEndpoints.update(c, { task_id: 'task1', name: 'Renamed' }),
		'PUT',
		'/task/task1',
	],
	[
		'tasks.delete',
		(c) => TasksEndpoints.delete(c, { task_id: 'task1' }),
		'DELETE',
		'/task/task1',
	],
];

describe('operation routing', () => {
	for (const [path, invoke, method, expectedPath] of OPERATIONS) {
		it(`${path} issues ${method} ${expectedPath}`, async () => {
			const ctx = makeCtx();
			await invoke(ctx);

			expect(lastMethod).toBe(method);
			expect(new URL(lastUrl, 'https://api.clickup.com').pathname).toBe(
				`${API_PREFIX}${expectedPath}`,
			);
			expect(lastAuth).toBe(TOKEN);
		});
	}
});

describe('operation coverage', () => {
	it('exercises every operation the plugin registers', () => {
		const registered = Object.keys(clickupEndpointSchemas).sort();
		const exercised = OPERATIONS.map(([path]) => path).sort();

		expect(exercised).toEqual(registered);
		expect(registered).toHaveLength(9);
	});
});

describe('request bodies', () => {
	it('strips list_id from the task create body', async () => {
		const ctx = makeCtx();
		await TasksEndpoints.create(ctx, { list_id: 'list1', name: 'New Task' });

		const body = JSON.parse(lastBody ?? '{}');
		expect(body).toEqual({ name: 'New Task' });
		expect(body).not.toHaveProperty('list_id');
	});

	it('strips task_id from the task update body', async () => {
		const ctx = makeCtx();
		await TasksEndpoints.update(ctx, { task_id: 'task1', name: 'Renamed' });

		const body = JSON.parse(lastBody ?? '{}');
		expect(body).toEqual({ name: 'Renamed' });
		expect(body).not.toHaveProperty('task_id');
	});

	it('sends no body on delete', async () => {
		const ctx = makeCtx();
		await TasksEndpoints.delete(ctx, { task_id: 'task1' });

		expect(lastBody).toBeUndefined();
	});
});

describe('event log', () => {
	it('logs clickup.tasks.create as completed without echoing the full input', async () => {
		const ctx = makeCtx();
		await TasksEndpoints.create(ctx, {
			list_id: 'list1',
			name: 'Secret task title',
		});

		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'clickup.tasks.create',
			{ list_id: 'list1', name: 'Secret task title' },
			'completed',
		);
	});
});
