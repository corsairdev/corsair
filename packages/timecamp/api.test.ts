/**
 * Endpoint behaviour.
 *
 * The transport is mocked so these run in CI with no TimeCamp account. The
 * substance here is the normalisation: TimeCamp returns ids as strings or
 * numbers, booleans as "0"/"1", and users as either a map or an array, and
 * none of that may reach a caller.
 */
const requestMock = jest.fn();

jest.mock('corsair/http', () => ({
	...jest.requireActual('corsair/http'),
	request: (...args: unknown[]) => requestMock(...args),
}));

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: async () => undefined,
}));

import { Projects } from './endpoints';

function makeCtx() {
	return { key: 'tc-test-token', db: {}, options: {} } as never;
}

/** TimeCamp's native shape: an object keyed by task id, loose types. */
const RAW_TASKS = {
	'101': {
		task_id: '101',
		parent_id: null,
		name: 'Website Redesign',
		archived: '0',
		color: '#ff0000',
		billable: '1',
		budgeted: '5000',
		budget_unit: 'USD',
		root_group_id: '7',
		users: { '11': { user_id: '11' }, '12': { user_id: '12' } },
	},
	'102': {
		task_id: 102,
		parent_id: '0',
		name: 'Archived Project',
		archived: 1,
		users: [],
	},
	'103': {
		task_id: '103',
		parent_id: '101',
		name: 'Child task, not a project',
		archived: '0',
	},
};

beforeEach(() => {
	requestMock.mockReset();
	requestMock.mockResolvedValue(RAW_TASKS);
});

describe('projects.getList', () => {
	it('calls the TimeCamp tasks endpoint', async () => {
		await Projects.getList(makeCtx(), {});
		expect(requestMock.mock.calls[0][1]).toMatchObject({
			url: 'tasks',
			method: 'GET',
		});
	});

	it('requests status=all so archived projects can be filtered locally', async () => {
		await Projects.getList(makeCtx(), {});
		expect(requestMock.mock.calls[0][1]).toMatchObject({
			query: { status: 'all' },
		});
	});

	it('rejects a non-boolean include_archived before calling TimeCamp', async () => {
		await expect(
			Projects.getList(makeCtx(), { include_archived: 'false' } as never),
		).rejects.toThrow();
		expect(requestMock).not.toHaveBeenCalled();
	});

	it('returns only root-level tasks, excluding children', async () => {
		const result = await Projects.getList(makeCtx(), {});
		expect(result.projects.map((p) => p.task_id)).not.toContain('103');
	});

	it('treats both null and "0" parent_id as root level', async () => {
		const result = await Projects.getList(makeCtx(), {
			include_archived: true,
		});
		expect(result.projects.map((p) => p.task_id).sort()).toEqual([
			'101',
			'102',
		]);
	});

	it('excludes archived projects by default', async () => {
		const result = await Projects.getList(makeCtx(), {});
		expect(result.projects.map((p) => p.task_id)).toEqual(['101']);
		expect(result.count).toBe(1);
	});

	it('includes archived projects when asked', async () => {
		const result = await Projects.getList(makeCtx(), {
			include_archived: true,
		});
		expect(result.count).toBe(2);
	});

	it('normalises a numeric task_id to a string', async () => {
		const result = await Projects.getList(makeCtx(), {
			include_archived: true,
		});
		const archived = result.projects.find((p) => p.task_id === '102');
		expect(archived?.task_id).toBe('102');
	});

	it('normalises "0"/"1" flags to booleans', async () => {
		const result = await Projects.getList(makeCtx(), {});
		const project = result.projects[0];
		expect(project?.archived).toBe(false);
		expect(project?.billable).toBe(true);
	});

	it('normalises a numeric-string budget to a number', async () => {
		const result = await Projects.getList(makeCtx(), {});
		expect(result.projects[0]?.budgeted).toBe(5000);
	});

	it('collapses the users map to a list of ids', async () => {
		const result = await Projects.getList(makeCtx(), {});
		expect(result.projects[0]?.assigned_users).toEqual(['11', '12']);
	});

	it('accepts an array payload as well as a keyed object', async () => {
		requestMock.mockResolvedValue(Object.values(RAW_TASKS));
		const result = await Projects.getList(makeCtx(), {});
		expect(result.projects[0]?.task_id).toBe('101');
	});

	it('returns an empty list for an empty payload', async () => {
		requestMock.mockResolvedValue({});
		const result = await Projects.getList(makeCtx(), {});
		expect(result.projects).toEqual([]);
		expect(result.count).toBe(0);
	});

	it('skips records with no usable task id rather than emitting junk', async () => {
		requestMock.mockResolvedValue({ bad: { parent_id: null, name: 'No id' } });
		const result = await Projects.getList(makeCtx(), {});
		expect(result.projects).toHaveLength(0);
	});

	it('defaults a missing name to an empty string', async () => {
		requestMock.mockResolvedValue({
			'9': { task_id: '9', parent_id: null, archived: '0' },
		});
		const result = await Projects.getList(makeCtx(), {});
		expect(result.projects[0]?.name).toBe('');
	});
});

describe('cache reconciliation', () => {
	/**
	 * Captures upserts and evictions so the cached set can be compared to the
	 * returned set. `cachedRows` seeds the store with projects written by an
	 * earlier refresh, mirroring a real tenant.
	 */
	function makeCachingCtx(cachedRows: string[] = []) {
		const upserts: { id: string; archived?: boolean }[] = [];
		const deletes: string[] = [];
		const rows = new Map(cachedRows.map((id) => [id, {}]));
		const ctx = {
			key: 'tc-test-token',
			options: {},
			db: {
				projects: {
					upsertByEntityId: async (
						id: string,
						value: { archived?: boolean },
					) => {
						upserts.push({ id, archived: value.archived });
						rows.set(id, {});
						return { id };
					},
					deleteByEntityId: async (id: string) => {
						deletes.push(id);
						return rows.delete(id);
					},
					list: async () =>
						[...rows.keys()].map((entity_id) => ({ entity_id })),
				},
			},
		} as never;
		return { ctx, upserts, deletes };
	}

	it('caches archived projects even though they are filtered from the response', async () => {
		// Regression: filtering before the cache write left a project that had
		// since been archived stored as active forever.
		const { ctx, upserts } = makeCachingCtx();

		const result = await Projects.getList(ctx, {});

		expect(result.projects.map((p) => p.task_id)).toEqual(['101']);
		expect(upserts.map((u) => u.id).sort()).toEqual(['101', '102']);
	});

	it('writes the archived flag through so a stale active record is corrected', async () => {
		const { ctx, upserts } = makeCachingCtx();

		await Projects.getList(ctx, {});

		expect(upserts.find((u) => u.id === '102')?.archived).toBe(true);
		expect(upserts.find((u) => u.id === '101')?.archived).toBe(false);
	});

	it('never caches non-root tasks', async () => {
		const { ctx, upserts } = makeCachingCtx();

		await Projects.getList(ctx, {});

		expect(upserts.map((u) => u.id)).not.toContain('103');
	});

	// ─────────────────────────────────────────────────────────────────────────
	// Regressions from review round 4: the refresh is a full-account snapshot,
	// so cached projects that left the root task set must be evicted.
	// ─────────────────────────────────────────────────────────────────────────

	it('evicts a cached project that no longer appears as a root task', async () => {
		// 104 is cached but absent from the /tasks response - deleted upstream.
		const { ctx, deletes } = makeCachingCtx(['101', '104']);

		await Projects.getList(ctx, {});

		expect(deletes).toEqual(['104']);
	});

	it('keeps cached projects that are still root tasks', async () => {
		const { ctx, deletes } = makeCachingCtx(['101']);

		await Projects.getList(ctx, {});

		expect(deletes).toEqual([]);
	});

	it('evicts a project that was reparented under another task', async () => {
		// 103 still appears in the task tree, but now as a child of 101, so it
		// has stopped being a project and must leave the mirror.
		const { ctx, deletes } = makeCachingCtx(['103']);

		await Projects.getList(ctx, {});

		expect(deletes).toEqual(['103']);
	});

	it('drops every cached project when the account has none', async () => {
		requestMock.mockResolvedValue({});
		const { ctx, deletes } = makeCachingCtx(['101', '102']);

		await Projects.getList(ctx, {});

		expect(deletes).toEqual(['101', '102']);
	});

	it('skips eviction when the store cannot enumerate cached rows', async () => {
		const deleteByEntityId = jest.fn();
		const ctx = {
			key: 'tc-test-token',
			options: {},
			db: {
				projects: {
					upsertByEntityId: async () => ({ id: 'x' }),
					deleteByEntityId,
				},
			},
		} as never;

		const result = await Projects.getList(ctx, {});

		expect(result.projects.length).toBe(1);
		expect(deleteByEntityId).not.toHaveBeenCalled();
	});

	it('a failed eviction does not fail the read', async () => {
		const warn = jest
			.spyOn(console, 'warn')
			.mockImplementation(() => undefined);
		const ctx = {
			key: 'tc-test-token',
			options: {},
			db: {
				projects: {
					upsertByEntityId: async () => ({ id: 'x' }),
					deleteByEntityId: jest.fn().mockRejectedValue(new Error('locked')),
					list: jest.fn(async () => [{ entity_id: '404' }]),
				},
			},
		} as never;

		try {
			await expect(Projects.getList(ctx, {})).resolves.toMatchObject({
				count: 1,
			});
			expect(warn).toHaveBeenCalled();
		} finally {
			warn.mockRestore();
		}
	});
});

// ─────────────────────────────────────────────────────────────────────────────
// Regressions from review round 2.
// ─────────────────────────────────────────────────────────────────────────────

describe('timestamp field mapping', () => {
	it('reads the modification timestamp from modify_time', async () => {
		// TimeCamp v1 reports it as `modify_time`; reading only `edit_date`
		// left the field null for every record that carries the other spelling.
		requestMock.mockResolvedValue({
			'1': {
				task_id: '1',
				parent_id: null,
				name: 'P',
				archived: '0',
				modify_time: '2026-01-02 03:04:05',
			},
		});
		const result = await Projects.getList(makeCtx(), {});
		expect(result.projects[0]?.edit_date).toBe('2026-01-02 03:04:05');
	});

	it('still reads edit_date when that spelling is used', async () => {
		requestMock.mockResolvedValue({
			'1': {
				task_id: '1',
				parent_id: null,
				name: 'P',
				archived: '0',
				edit_date: '2026-02-03 04:05:06',
			},
		});
		const result = await Projects.getList(makeCtx(), {});
		expect(result.projects[0]?.edit_date).toBe('2026-02-03 04:05:06');
	});

	it('prefers edit_date when a record carries both', async () => {
		requestMock.mockResolvedValue({
			'1': {
				task_id: '1',
				parent_id: null,
				name: 'P',
				archived: '0',
				edit_date: '2026-02-03 04:05:06',
				modify_time: '2026-01-02 03:04:05',
			},
		});
		const result = await Projects.getList(makeCtx(), {});
		expect(result.projects[0]?.edit_date).toBe('2026-02-03 04:05:06');
	});

	it('leaves the field null when neither spelling is present', async () => {
		requestMock.mockResolvedValue({
			'1': { task_id: '1', parent_id: null, name: 'P', archived: '0' },
		});
		const result = await Projects.getList(makeCtx(), {});
		expect(result.projects[0]?.edit_date).toBeNull();
	});
});
