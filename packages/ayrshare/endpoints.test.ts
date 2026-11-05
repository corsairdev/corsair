/**
 * Exercises all four endpoint wrappers: method and path, cache writes, and
 * the event log. Network access is mocked, so this runs in CI.
 */
import { logEventFromContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { deletePost, history, list, set } from './endpoints/handlers';
import {
	ayrshareErrorCode,
	errorHandlers,
	isNonIdempotent,
} from './error-handlers';
import { ayrshareEndpointMeta } from './index';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(async () => undefined),
}));

const mockLogEvent = logEventFromContext as jest.MockedFunction<
	typeof logEventFromContext
>;

type Store = { upsertByEntityId: jest.Mock; deleteByEntityId: jest.Mock };

function makeStore(): Store {
	return {
		upsertByEntityId: jest.fn(async () => undefined),
		deleteByEntityId: jest.fn(async () => true),
	};
}

type Ctx = Parameters<typeof list>[0];

function makeCtx() {
	const db = {
		autoSchedules: makeStore(),
		posts: makeStore(),
	};
	const ctx = {
		key: 'test-ayrshare-key',
		options: {},
		db,
		database: undefined,
		$getAccountId: async () => 'test-account',
	} as unknown as Ctx;
	return { ctx, db };
}

let lastUrl = '';
let lastMethod = '';
let lastBody: string | undefined;

const SET_BODY = {
	status: 'success',
	message: 'Auto schedule set.',
	title: 'CorsairVerify',
	schedule: ['13:05Z', '20:14Z'],
	daysOfWeek: [1, 3],
	excludeDates: ['2026-12-25'],
};

const LIST_BODY = {
	status: 'success',
	schedules: {
		CorsairVerify: {
			title: 'other-title',
			schedule: ['13:05Z', '20:14Z'],
			excludeDates: ['2026-12-25'],
			daysOfWeek: [1, 3],
		},
	},
};

const HISTORY_BODY = {
	history: [
		{
			id: 'wWIY0OEirdNeYSJYm1Xa',
			status: 'success',
			post: 'Sometimes we need to take a break for lunch.',
			platforms: ['twitter', 'facebook'],
			created: '2022-05-20T17:25:06Z',
			errors: [],
			urls: [],
			type: 'now',
			postIds: [
				{
					platform: 'twitter',
					id: '1288890036000983105',
					status: 'success',
				},
			],
		},
	],
	count: 1,
	refId: '9abf1426d6ce9122ef11c72bd62e59807c5cc083',
};

const DELETE_BODY = { status: 'success' };

beforeEach(() => {
	mockLogEvent.mockClear();
	lastUrl = '';
	lastMethod = '';
	lastBody = undefined;
	global.fetch = (async (url: unknown, init?: RequestInit) => {
		lastUrl = String(url);
		lastMethod = init?.method ?? 'GET';
		lastBody = typeof init?.body === 'string' ? init.body : undefined;
		const path = new URL(String(url)).pathname;
		let payload: unknown = {};
		if (path.endsWith('/auto-schedule/set')) payload = SET_BODY;
		else if (path.endsWith('/auto-schedule/list')) payload = LIST_BODY;
		else if (path.endsWith('/history')) payload = HISTORY_BODY;
		else if (path.endsWith('/post')) payload = DELETE_BODY;
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
});

const OPERATIONS: [string, (ctx: Ctx) => Promise<unknown>, string, string][] = [
	[
		'autoSchedule.set',
		(c) => set(c, { schedule: ['13:05Z', '20:14Z'] }),
		'POST',
		'/api/auto-schedule/set',
	],
	['autoSchedule.list', (c) => list(c, {}), 'GET', '/api/auto-schedule/list'],
	[
		'posts.delete',
		(c) => deletePost(c, { id: 'wWIY0OEirdNeYSJYm1Xa' }),
		'DELETE',
		'/api/post',
	],
	['posts.history', (c) => history(c, { limit: 10 }), 'GET', '/api/history'],
];

describe('routing', () => {
	for (const [path, invoke, method, expectedPath] of OPERATIONS) {
		it(`${path} issues ${method} ${expectedPath}`, async () => {
			const { ctx } = makeCtx();
			await invoke(ctx);

			expect(lastMethod).toBe(method);
			expect(new URL(lastUrl).pathname).toBe(expectedPath);
		});
	}
});

describe('operation coverage', () => {
	it('exercises every operation the plugin registers', () => {
		const registered = Object.keys(ayrshareEndpointMeta).sort();
		const exercised = OPERATIONS.map(([path]) => path).sort();

		expect(exercised).toEqual(registered);
		expect(registered).toHaveLength(4);
	});

	it('marks posts.delete destructive', () => {
		expect(ayrshareEndpointMeta['posts.delete'].riskLevel).toBe('destructive');
	});

	it('treats only posts.delete as non-idempotent', () => {
		expect(isNonIdempotent('posts.delete')).toBe(true);
		expect(isNonIdempotent('autoSchedule.set')).toBe(false);
		expect(isNonIdempotent('posts.history')).toBe(false);
	});
});

describe('cache', () => {
	it('mirrors a set schedule under its title', async () => {
		const { ctx, db } = makeCtx();
		await set(ctx, {
			schedule: ['13:05Z', '20:14Z'],
			title: 'CorsairVerify',
			daysOfWeek: [1, 3],
		});

		expect(db.autoSchedules.upsertByEntityId).toHaveBeenCalledWith(
			'CorsairVerify',
			expect.objectContaining({
				title: 'CorsairVerify',
				schedule: ['13:05Z', '20:14Z'],
			}),
		);
	});

	it('mirrors each listed schedule under its title', async () => {
		const { ctx, db } = makeCtx();
		await list(ctx, {});

		expect(db.autoSchedules.upsertByEntityId).toHaveBeenCalledWith(
			'CorsairVerify',
			expect.objectContaining({ title: 'CorsairVerify' }),
		);
	});

	it('mirrors history posts and evicts on delete', async () => {
		const { ctx, db } = makeCtx();
		await history(ctx, { limit: 10 });
		expect(db.posts.upsertByEntityId).toHaveBeenCalledWith(
			'wWIY0OEirdNeYSJYm1Xa',
			expect.objectContaining({ id: 'wWIY0OEirdNeYSJYm1Xa' }),
		);

		await deletePost(ctx, { id: 'wWIY0OEirdNeYSJYm1Xa' });
		expect(db.posts.deleteByEntityId).toHaveBeenCalledWith(
			'wWIY0OEirdNeYSJYm1Xa',
		);
	});
});

describe('request bodies and query', () => {
	it('omits unset set-schedule fields', async () => {
		const { ctx } = makeCtx();
		await set(ctx, { schedule: ['13:05Z'] });

		expect(JSON.parse(lastBody ?? '{}')).toEqual({ schedule: ['13:05Z'] });
	});

	it('sends the post id on DELETE', async () => {
		const { ctx } = makeCtx();
		await deletePost(ctx, { id: 'abc', markManualDeleted: true });

		expect(JSON.parse(lastBody ?? '{}')).toEqual({
			id: 'abc',
			markManualDeleted: true,
		});
	});

	it('sends official history query names', async () => {
		const { ctx } = makeCtx();
		await history(ctx, {
			limit: 5,
			lastDays: 0,
			platforms: ['facebook', 'instagram'],
			status: 'success',
		});

		const url = new URL(lastUrl);
		expect(url.searchParams.get('limit')).toBe('5');
		expect(url.searchParams.get('lastDays')).toBe('0');
		expect(url.searchParams.get('platforms')).toBe('facebook,instagram');
		expect(url.searchParams.get('status')).toBe('success');
	});
});

describe('ayrshareErrorCode', () => {
	it('reads code 221 nested under history (live empty-history shape)', () => {
		const error = new ApiError(
			{ method: 'GET', url: 'history' },
			{
				url: 'https://api.ayrshare.com/api/history',
				ok: false,
				status: 400,
				statusText: 'Bad Request',
				body: {
					history: { code: 221, action: 'get', status: 'error' },
					count: 0,
				},
			},
			'History not found',
		);
		expect(ayrshareErrorCode(error)).toBe(221);
	});

	it('reads a top-level delete code', () => {
		const error = new ApiError(
			{ method: 'DELETE', url: 'post' },
			{
				url: 'https://api.ayrshare.com/api/post',
				ok: false,
				status: 404,
				statusText: 'Not Found',
				body: { code: 114, action: 'delete', status: 'error' },
			},
			'Delete id not found',
		);
		expect(ayrshareErrorCode(error)).toBe(114);
	});

	it('does not stack a second 429 retry budget on the plugin layer', async () => {
		expect(await errorHandlers.RATE_LIMIT_ERROR.handler()).toEqual({
			maxRetries: 0,
		});
	});
});

describe('event log', () => {
	it('records the schedule title without the times', async () => {
		const { ctx } = makeCtx();
		await set(ctx, {
			schedule: ['13:05Z', '20:14Z'],
			title: 'CorsairVerify',
		});

		const payload = mockLogEvent.mock.calls.at(-1)?.[2] as
			| Record<string, unknown>
			| undefined;
		expect(payload).toEqual({
			title: 'CorsairVerify',
			fields: ['schedule', 'title'],
		});
	});
});
