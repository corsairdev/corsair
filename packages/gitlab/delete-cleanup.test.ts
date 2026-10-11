/**
 * Regression tests for GitLab delete endpoints – issue #1875.
 *
 * Verifies that deleteIssue, deleteMr, and deleteProject clean up the local DB
 * after a successful remote DELETE, correctly handling:
 *   - Numeric and path-based project identifiers
 *   - Mismatched global `id` vs project-scoped `iid`
 *   - Missing local records (no-op with warning)
 *   - Ambiguous matches (no-op with warning)
 *   - Remote API failures (no local cleanup attempted)
 *   - Local database cleanup failures (endpoint succeeds, logs warning)
 *   - Project entity IDs differing from stringified numeric ID
 *   - Invalid project identifiers and IIDs
 */
import { deleteIssue } from './endpoints/issues';
import { deleteMr } from './endpoints/merge-requests';
import { deleteProject } from './endpoints/projects';

// ── mock stores ────────────────────────────────────────────────────────────
type Store = {
	upsertByEntityId: jest.Mock;
	deleteByEntityId: jest.Mock;
	findByEntityId: jest.Mock;
	search: jest.Mock;
};

function makeStore(overrides?: Partial<Store>): Store {
	return {
		upsertByEntityId: jest.fn(async () => undefined),
		deleteByEntityId: jest.fn(async () => true),
		findByEntityId: jest.fn(async () => null),
		search: jest.fn(async () => []),
		...overrides,
	};
}

type Ctx = Parameters<typeof deleteIssue>[0];

type Db = {
	issues: Store;
	mergeRequests: Store;
	projects: Store;
	users: Store;
};

function makeCtx(dbOverrides?: Partial<Db>) {
	const db: Db = {
		issues: makeStore(),
		mergeRequests: makeStore(),
		projects: makeStore(),
		users: makeStore(),
		...dbOverrides,
	};
	const ctx = {
		key: 'fake-gitlab-token',
		db,
		database: undefined,
		options: { baseUrl: undefined },
		$getAccountId: async () => 'test-account',
	} as unknown as Ctx;
	return { ctx, db };
}

// ── fetch stub ─────────────────────────────────────────────────────────────
const originalFetch = global.fetch;

let warnSpy: jest.SpyInstance;

beforeEach(() => {
	warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(() => {
	jest.restoreAllMocks();
});

afterAll(() => {
	global.fetch = originalFetch;
});

function mockFetch(body: unknown = '', status = 200) {
	global.fetch = (async (url: string, _init: RequestInit) => ({
		ok: status >= 200 && status < 300,
		status,
		statusText: status < 300 ? 'OK' : 'Error',
		url,
		headers: new Headers({ 'Content-Type': 'application/json' }),
		json: async () => body,
		text: async () => (typeof body === 'string' ? body : JSON.stringify(body)),
	})) as unknown as typeof global.fetch;
}

function mockFetchError(status = 404) {
	global.fetch = (async (url: string) => ({
		ok: false,
		status,
		statusText: 'Not Found',
		url,
		headers: new Headers({ 'Content-Type': 'application/json' }),
		json: async () => ({ message: 'not found' }),
		text: async () => '{"message":"not found"}',
	})) as unknown as typeof global.fetch;
}

// ── helpers ────────────────────────────────────────────────────────────────

/** Simulates a stored entity row as returned by search / findByEntityId. */
function fakeEntity(
	globalId: number,
	iid: number,
	projectId: number,
	entityId?: string,
) {
	return {
		entity_id: entityId ?? String(globalId),
		data: { id: globalId, iid, project_id: projectId, title: 'Test' },
	};
}

// ═══════════════════════════════════════════════════════════════════════════
// deleteIssue
// ═══════════════════════════════════════════════════════════════════════════
describe('deleteIssue – local DB cleanup (issue #1875)', () => {
	it('deletes the local issue by global id after a successful remote DELETE (numeric project_id)', async () => {
		const { ctx, db } = makeCtx();
		mockFetch();

		// issue has global id 205640274, iid 42 in project 100
		db.issues.search.mockResolvedValueOnce([fakeEntity(205640274, 42, 100)]);

		await deleteIssue(ctx, { project_id: 100, issue_iid: 42 });

		expect(db.issues.search).toHaveBeenCalledWith({ data: { iid: 42 } });
		expect(db.issues.deleteByEntityId).toHaveBeenCalledWith('205640274');
	});

	it('resolves a path-based project_id before searching', async () => {
		const { ctx, db } = makeCtx();
		mockFetch();

		// projects.search resolves path to numeric id
		db.projects.search.mockResolvedValueOnce([
			{ entity_id: '100', data: { id: 100, path_with_namespace: 'org/repo' } },
		]);
		db.issues.search.mockResolvedValueOnce([fakeEntity(9999, 7, 100)]);

		await deleteIssue(ctx, {
			project_id: 'org/repo' as unknown as number,
			issue_iid: 7,
		});

		expect(db.projects.search).toHaveBeenCalledWith({
			data: { path_with_namespace: 'org/repo' },
		});
		expect(db.issues.deleteByEntityId).toHaveBeenCalledWith('9999');
	});

	it('skips local cleanup and warns when the project path cannot be resolved', async () => {
		const { ctx, db } = makeCtx();
		mockFetch();

		db.projects.search.mockResolvedValueOnce([]); // no match

		await deleteIssue(ctx, {
			project_id: 'unknown/project' as unknown as number,
			issue_iid: 1,
		});

		expect(db.issues.deleteByEntityId).not.toHaveBeenCalled();
		expect(warnSpy).toHaveBeenCalledWith(
			expect.stringContaining('could not resolve project_id'),
		);
	});

	it('skips local cleanup and warns when project path matches multiple projects (ambiguous)', async () => {
		const { ctx, db } = makeCtx();
		mockFetch();

		db.projects.search.mockResolvedValueOnce([
			{ entity_id: '1', data: { id: 1, path_with_namespace: 'dup/repo' } },
			{ entity_id: '2', data: { id: 2, path_with_namespace: 'dup/repo' } },
		]);

		await deleteIssue(ctx, {
			project_id: 'dup/repo' as unknown as number,
			issue_iid: 1,
		});

		expect(db.issues.deleteByEntityId).not.toHaveBeenCalled();
		expect(warnSpy).toHaveBeenCalledWith(
			expect.stringContaining('could not resolve project_id'),
		);
	});

	it('skips local cleanup when no local record matches the iid', async () => {
		const { ctx, db } = makeCtx();
		mockFetch();

		db.issues.search.mockResolvedValueOnce([]); // nothing in DB

		await deleteIssue(ctx, { project_id: 100, issue_iid: 999 });

		expect(db.issues.deleteByEntityId).not.toHaveBeenCalled();
		expect(warnSpy).toHaveBeenCalledWith(
			expect.stringContaining('no local issue found'),
		);
	});

	it('skips local cleanup when multiple records match (ambiguous)', async () => {
		const { ctx, db } = makeCtx();
		mockFetch();

		db.issues.search.mockResolvedValueOnce([
			fakeEntity(111, 42, 100),
			fakeEntity(222, 42, 100),
		]);

		await deleteIssue(ctx, { project_id: 100, issue_iid: 42 });

		expect(db.issues.deleteByEntityId).not.toHaveBeenCalled();
		expect(warnSpy).toHaveBeenCalledWith(
			expect.stringContaining('2 local issues match'),
		);
	});

	it('does NOT touch the local DB when the remote DELETE fails', async () => {
		const { ctx, db } = makeCtx();
		mockFetchError(404);

		await expect(
			deleteIssue(ctx, { project_id: 100, issue_iid: 42 }),
		).rejects.toThrow();

		expect(db.issues.search).not.toHaveBeenCalled();
		expect(db.issues.deleteByEntityId).not.toHaveBeenCalled();
	});

	it('does NOT throw when local DB deletion fails, but logs a warning', async () => {
		const { ctx, db } = makeCtx();
		mockFetch();

		db.issues.search.mockResolvedValueOnce([fakeEntity(12345, 1, 100)]);
		db.issues.deleteByEntityId.mockRejectedValueOnce(new Error('Disk failure'));

		const result = await deleteIssue(ctx, { project_id: 100, issue_iid: 1 });

		expect(result).toBeDefined();
		expect(warnSpy).toHaveBeenCalledWith(
			'Failed to delete issue from database:',
			expect.any(Error),
		);
	});

	it('skips local cleanup and warns on invalid numeric project_id', async () => {
		const { ctx, db } = makeCtx();
		mockFetch();

		await deleteIssue(ctx, { project_id: -5, issue_iid: 1 });

		expect(db.issues.deleteByEntityId).not.toHaveBeenCalled();
		expect(warnSpy).toHaveBeenCalledWith(
			expect.stringContaining('could not resolve project_id "-5"'),
		);
	});

	it('skips local cleanup and warns on invalid issue_iid', async () => {
		const { ctx, db } = makeCtx();
		mockFetch();

		await deleteIssue(ctx, { project_id: 100, issue_iid: -1 });

		expect(db.issues.deleteByEntityId).not.toHaveBeenCalled();
		expect(warnSpy).toHaveBeenCalledWith(
			expect.stringContaining('invalid issue_iid "-1"'),
		);
	});

	it('filters search results to the correct project when multiple projects have the same iid', async () => {
		const { ctx, db } = makeCtx();
		mockFetch();

		// Same iid in two different projects
		db.issues.search.mockResolvedValueOnce([
			fakeEntity(111, 5, 100),
			fakeEntity(222, 5, 200),
		]);

		await deleteIssue(ctx, { project_id: 200, issue_iid: 5 });

		expect(db.issues.deleteByEntityId).toHaveBeenCalledWith('222');
		expect(db.issues.deleteByEntityId).toHaveBeenCalledTimes(1);
	});
});

// ═══════════════════════════════════════════════════════════════════════════
// deleteMr
// ═══════════════════════════════════════════════════════════════════════════
describe('deleteMr – local DB cleanup (issue #1875)', () => {
	it('deletes the local MR by global id after a successful remote DELETE', async () => {
		const { ctx, db } = makeCtx();
		mockFetch();

		db.mergeRequests.search.mockResolvedValueOnce([fakeEntity(300, 10, 100)]);

		await deleteMr(ctx, { project_id: 100, merge_request_iid: 10 });

		expect(db.mergeRequests.search).toHaveBeenCalledWith({
			data: { iid: 10 },
		});
		expect(db.mergeRequests.deleteByEntityId).toHaveBeenCalledWith('300');
	});

	it('resolves a path-based project_id for MRs', async () => {
		const { ctx, db } = makeCtx();
		mockFetch();

		db.projects.search.mockResolvedValueOnce([
			{ entity_id: '100', data: { id: 100, path_with_namespace: 'team/app' } },
		]);
		db.mergeRequests.search.mockResolvedValueOnce([fakeEntity(500, 3, 100)]);

		await deleteMr(ctx, {
			project_id: 'team/app' as unknown as number,
			merge_request_iid: 3,
		});

		expect(db.mergeRequests.deleteByEntityId).toHaveBeenCalledWith('500');
	});

	it('skips local cleanup when no MR matches', async () => {
		const { ctx, db } = makeCtx();
		mockFetch();

		db.mergeRequests.search.mockResolvedValueOnce([]);

		await deleteMr(ctx, { project_id: 100, merge_request_iid: 99 });

		expect(db.mergeRequests.deleteByEntityId).not.toHaveBeenCalled();
		expect(warnSpy).toHaveBeenCalledWith(
			expect.stringContaining('no local MR found'),
		);
	});

	it('skips local cleanup when multiple MRs match in the same project (ambiguous)', async () => {
		const { ctx, db } = makeCtx();
		mockFetch();

		db.mergeRequests.search.mockResolvedValueOnce([
			fakeEntity(501, 10, 100),
			fakeEntity(502, 10, 100),
		]);

		await deleteMr(ctx, { project_id: 100, merge_request_iid: 10 });

		expect(db.mergeRequests.deleteByEntityId).not.toHaveBeenCalled();
		expect(warnSpy).toHaveBeenCalledWith(
			expect.stringContaining('2 local MRs match'),
		);
	});

	it('filters search results to the correct project when multiple projects have the same MR iid', async () => {
		const { ctx, db } = makeCtx();
		mockFetch();

		db.mergeRequests.search.mockResolvedValueOnce([
			fakeEntity(301, 7, 100),
			fakeEntity(302, 7, 200),
		]);

		await deleteMr(ctx, { project_id: 200, merge_request_iid: 7 });

		expect(db.mergeRequests.deleteByEntityId).toHaveBeenCalledWith('302');
		expect(db.mergeRequests.deleteByEntityId).toHaveBeenCalledTimes(1);
	});

	it('does NOT touch the local DB when the remote DELETE fails', async () => {
		const { ctx, db } = makeCtx();
		mockFetchError(403);

		await expect(
			deleteMr(ctx, { project_id: 100, merge_request_iid: 10 }),
		).rejects.toThrow();

		expect(db.mergeRequests.search).not.toHaveBeenCalled();
		expect(db.mergeRequests.deleteByEntityId).not.toHaveBeenCalled();
	});

	it('does NOT throw when local DB deletion fails, but logs a warning', async () => {
		const { ctx, db } = makeCtx();
		mockFetch();

		db.mergeRequests.search.mockResolvedValueOnce([fakeEntity(300, 10, 100)]);
		db.mergeRequests.deleteByEntityId.mockRejectedValueOnce(
			new Error('DB err'),
		);

		const result = await deleteMr(ctx, {
			project_id: 100,
			merge_request_iid: 10,
		});

		expect(result).toBeDefined();
		expect(warnSpy).toHaveBeenCalledWith(
			'Failed to delete merge request from database:',
			expect.any(Error),
		);
	});

	it('skips local cleanup and warns on invalid merge_request_iid', async () => {
		const { ctx, db } = makeCtx();
		mockFetch();

		await deleteMr(ctx, { project_id: 100, merge_request_iid: 0 });

		expect(db.mergeRequests.deleteByEntityId).not.toHaveBeenCalled();
		expect(warnSpy).toHaveBeenCalledWith(
			expect.stringContaining('invalid merge_request_iid "0"'),
		);
	});
});

// ═══════════════════════════════════════════════════════════════════════════
// deleteProject
// ═══════════════════════════════════════════════════════════════════════════
describe('deleteProject – local DB cleanup (issue #1875)', () => {
	it('deletes the local project by numeric id after a successful remote DELETE (search match)', async () => {
		const { ctx, db } = makeCtx();
		mockFetch();

		db.projects.search.mockResolvedValueOnce([
			{ entity_id: '42', data: { id: 42, name: 'Proj' } },
		]);

		await deleteProject(ctx, { project_id: 42 });

		expect(db.projects.deleteByEntityId).toHaveBeenCalledWith('42');
	});

	it('deletes by the actual entity_id when it differs from the numeric project id', async () => {
		const { ctx, db } = makeCtx();
		mockFetch();

		// Stored with custom UUID entity_id
		db.projects.search.mockResolvedValueOnce([
			{
				entity_id: 'custom-proj-uuid-1234',
				data: { id: 42, name: 'Proj' },
			},
		]);

		await deleteProject(ctx, { project_id: 42 });

		expect(db.projects.deleteByEntityId).toHaveBeenCalledWith(
			'custom-proj-uuid-1234',
		);
	});

	it('falls back to findByEntityId when search returns no match for numeric id', async () => {
		const { ctx, db } = makeCtx();
		mockFetch();

		db.projects.search.mockResolvedValueOnce([]);
		db.projects.findByEntityId.mockResolvedValueOnce({
			entity_id: '42',
			data: { id: 42, name: 'Proj' },
		});

		await deleteProject(ctx, { project_id: 42 });

		expect(db.projects.findByEntityId).toHaveBeenCalledWith('42');
		expect(db.projects.deleteByEntityId).toHaveBeenCalledWith('42');
	});

	it('resolves a path-based project_id and deletes the project by its entity_id', async () => {
		const { ctx, db } = makeCtx();
		mockFetch();

		db.projects.search.mockResolvedValueOnce([
			{
				entity_id: 'proj-entity-77',
				data: { id: 42, path_with_namespace: 'org/my-project' },
			},
		]);

		await deleteProject(ctx, {
			project_id: 'org/my-project' as unknown as number,
		});

		expect(db.projects.deleteByEntityId).toHaveBeenCalledWith('proj-entity-77');
	});

	it('warns and skips local cleanup when path-based project_id cannot be found', async () => {
		const { ctx, db } = makeCtx();
		mockFetch();

		db.projects.search.mockResolvedValueOnce([]);

		await deleteProject(ctx, {
			project_id: 'nonexistent/project' as unknown as number,
		});

		expect(db.projects.deleteByEntityId).not.toHaveBeenCalled();
		expect(warnSpy).toHaveBeenCalledWith(
			expect.stringContaining('no local project found'),
		);
	});

	it('warns and skips local cleanup when path-based project matches multiple local projects (ambiguous)', async () => {
		const { ctx, db } = makeCtx();
		mockFetch();

		db.projects.search.mockResolvedValueOnce([
			{ entity_id: '1', data: { id: 1, path_with_namespace: 'dup/repo' } },
			{ entity_id: '2', data: { id: 2, path_with_namespace: 'dup/repo' } },
		]);

		await deleteProject(ctx, {
			project_id: 'dup/repo' as unknown as number,
		});

		expect(db.projects.deleteByEntityId).not.toHaveBeenCalled();
		expect(warnSpy).toHaveBeenCalledWith(
			expect.stringContaining('2 local projects match'),
		);
	});

	it('warns and skips local cleanup when numeric project ID is not found anywhere', async () => {
		const { ctx, db } = makeCtx();
		mockFetch();

		db.projects.search.mockResolvedValueOnce([]);
		db.projects.findByEntityId.mockResolvedValueOnce(null);

		await deleteProject(ctx, { project_id: 99999 });

		expect(db.projects.deleteByEntityId).not.toHaveBeenCalled();
		expect(warnSpy).toHaveBeenCalledWith(
			expect.stringContaining('no local project found'),
		);
	});

	it('warns and skips local cleanup on invalid project identifier (e.g. non-positive, empty)', async () => {
		const { ctx, db } = makeCtx();
		mockFetch();

		await deleteProject(ctx, { project_id: -1 });

		expect(db.projects.deleteByEntityId).not.toHaveBeenCalled();
		expect(warnSpy).toHaveBeenCalledWith(
			expect.stringContaining('invalid project identifier "-1"'),
		);
	});

	it('does NOT touch the local DB when the remote DELETE fails', async () => {
		const { ctx, db } = makeCtx();
		mockFetchError(500);

		await expect(deleteProject(ctx, { project_id: 42 })).rejects.toThrow();

		expect(db.projects.deleteByEntityId).not.toHaveBeenCalled();
	});

	it('does NOT throw when local DB cleanup fails, but logs a warning', async () => {
		const { ctx, db } = makeCtx();
		mockFetch();

		db.projects.search.mockResolvedValueOnce([
			{ entity_id: '42', data: { id: 42, name: 'Proj' } },
		]);
		db.projects.deleteByEntityId.mockRejectedValueOnce(
			new Error('Database unavailable'),
		);

		const result = await deleteProject(ctx, { project_id: 42 });

		expect(result).toBeDefined();
		expect(warnSpy).toHaveBeenCalledWith(
			'Failed to delete project from database:',
			expect.any(Error),
		);
	});
});
