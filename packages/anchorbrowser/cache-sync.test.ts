import { syncAnchorBrowserOperationCache } from './endpoints/cache-sync';
import type { AnchorBrowserContext } from './index';

/**
 * Payloads below are the shapes the live Anchor Browser API actually returns
 * (captured from api.anchorbrowser.io and the published OpenAPI schemas).
 * Nearly everything is wrapped in a `data` envelope; the legacy task API is
 * not. Both must reach the cache.
 */
const LIVE_PAYLOADS = {
	sessionList: {
		data: {
			sessions: [{ session_id: 'sess-1', status: 'running' }],
			total: 1,
			page: 1,
			total_pages: 1,
		},
	},
	sessionGet: {
		data: { session_id: 'sess-2', status: 'running', team_id: 'team-1' },
	},
	sessionCreate: {
		data: {
			id: 'sess-3',
			cdp_url: 'wss://example/cdp',
			live_view_url: 'https://example/live',
		},
	},
	profileList: {
		data: { count: 1, items: [{ name: 'profile-1', status: 'ready' }] },
	},
	taskList: {
		tasks: [{ id: 'task-1', name: 'Count Active Contracts' }],
		total: 1,
	},
} as const;

type CacheGroup = 'sessions' | 'tasks' | 'profiles';
type Recorder = { upserts: Array<[string, unknown]>; deletes: string[] };

function createCtx() {
	const rec: Record<CacheGroup, Recorder> = {
		sessions: { upserts: [], deletes: [] },
		tasks: { upserts: [], deletes: [] },
		profiles: { upserts: [], deletes: [] },
	};
	const entity = (r: Recorder) => ({
		upsertByEntityId: async (id: string, data: Record<string, unknown>) => {
			r.upserts.push([id, data]);
		},
		deleteByEntityId: async (id: string) => {
			r.deletes.push(id);
			return true;
		},
		list: async () => r.upserts.map(([id]) => ({ entity_id: id })),
	});

	const ctx = {
		db: {
			sessions: entity(rec.sessions),
			tasks: entity(rec.tasks),
			profiles: entity(rec.profiles),
		},
	} as unknown as AnchorBrowserContext;

	return { ctx, rec };
}

describe('AnchorBrowser cache sync', () => {
	it.each([
		['session list', 'sessions', 'GET', LIVE_PAYLOADS.sessionList, ['sess-1']],
		['session get', 'sessions', 'GET', LIVE_PAYLOADS.sessionGet, ['sess-2']],
		[
			'session create',
			'sessions',
			'POST',
			LIVE_PAYLOADS.sessionCreate,
			['sess-3'],
		],
		[
			'profile list',
			'profiles',
			'GET',
			LIVE_PAYLOADS.profileList,
			['profile-1'],
		],
		['task list', 'tasks', 'GET', LIVE_PAYLOADS.taskList, ['task-1']],
	] as const)(
		'caches %s from its live response envelope',
		async (_label, group, method, response, expectedIds) => {
			const { ctx, rec } = createCtx();

			await syncAnchorBrowserOperationCache(
				ctx,
				{ group, method },
				{},
				response,
			);

			expect(rec[group].upserts.map(([id]) => id)).toEqual(expectedIds);
		},
	);

	it('stores the unwrapped entity rather than the data envelope', async () => {
		const { ctx, rec } = createCtx();

		await syncAnchorBrowserOperationCache(
			ctx,
			{ group: 'sessions', method: 'GET' },
			{},
			LIVE_PAYLOADS.sessionGet,
		);

		const stored = rec.sessions.upserts[0]?.[1];
		expect(stored).toEqual({
			session_id: 'sess-2',
			status: 'running',
			team_id: 'team-1',
		});
		expect(stored).not.toHaveProperty('data');
	});

	it('removes the entity on DELETE using the camelCase path parameter', async () => {
		const { ctx, rec } = createCtx();

		await syncAnchorBrowserOperationCache(
			ctx,
			{ group: 'sessions', method: 'DELETE' },
			{ sessionId: 'sess-9' },
			{ data: { success: true } },
		);

		expect(rec.sessions.deletes).toEqual(['sess-9']);
	});

	it('clears the whole collection on a bulk delete such as endAllSessions', async () => {
		const { ctx, rec } = createCtx();
		// Seed the cache, then run DELETE /sessions/all (no path params).
		await syncAnchorBrowserOperationCache(
			ctx,
			{ group: 'sessions', method: 'GET' },
			{},
			LIVE_PAYLOADS.sessionList,
		);
		expect(rec.sessions.upserts).toHaveLength(1);

		await syncAnchorBrowserOperationCache(
			ctx,
			{ group: 'sessions', method: 'DELETE', pathParams: [] },
			{},
			{ data: { success: true } },
		);

		expect(rec.sessions.deletes).toEqual(['sess-1']);
	});

	it('does not clear the collection when a single delete has an identifier', async () => {
		const { ctx, rec } = createCtx();
		await syncAnchorBrowserOperationCache(
			ctx,
			{ group: 'sessions', method: 'GET' },
			{},
			LIVE_PAYLOADS.sessionList,
		);

		await syncAnchorBrowserOperationCache(
			ctx,
			{ group: 'sessions', method: 'DELETE', pathParams: ['sessionId'] },
			{ sessionId: 'sess-other' },
			{ data: { success: true } },
		);

		expect(rec.sessions.deletes).toEqual(['sess-other']);
	});

	it('ignores groups that are not cached', async () => {
		const { ctx, rec } = createCtx();

		await syncAnchorBrowserOperationCache(
			ctx,
			{ group: 'osLevel', method: 'POST' },
			{},
			{ data: { id: 'nope' } },
		);

		expect(rec.sessions.upserts).toHaveLength(0);
		expect(rec.tasks.upserts).toHaveLength(0);
		expect(rec.profiles.upserts).toHaveLength(0);
	});

	it('does not throw when the plugin has no database bound', async () => {
		const ctx = { db: undefined } as unknown as AnchorBrowserContext;

		await expect(
			syncAnchorBrowserOperationCache(
				ctx,
				{ group: 'sessions', method: 'GET' },
				{},
				LIVE_PAYLOADS.sessionGet,
			),
		).resolves.toBeUndefined();
	});
});
