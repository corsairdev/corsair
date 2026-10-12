import { deleteIssue } from './endpoints/issues';
import { deleteMr } from './endpoints/merge-requests';
import { deleteProject } from './endpoints/projects';

type Row = { entity_id: string; data: Record<string, string | number> };

function makeStore(rows: Row[] = []) {
	return {
		rows,
		search: jest.fn(
			async ({ data }: { data: Record<string, string | number> }) =>
				rows.filter((row) =>
					Object.entries(data).every(([key, value]) => row.data[key] === value),
				),
		),
		deleteByEntityId: jest.fn(async (entityId: string) => {
			const index = rows.findIndex((row) => row.entity_id === entityId);
			if (index !== -1) rows.splice(index, 1);
			return index !== -1;
		}),
		upsertByEntityId: jest.fn(),
	};
}

const issue = (id: number, iid: number, project_id: number): Row => ({
	entity_id: String(id),
	data: { id, iid, project_id, title: 'Issue' },
});

const project = (id: number, path_with_namespace: string): Row => ({
	entity_id: String(id),
	data: { id, name: path_with_namespace, path_with_namespace },
});

function makeCtx(db: {
	issues?: Row[];
	mergeRequests?: Row[];
	projects?: Row[];
}) {
	const stores = {
		issues: makeStore(db.issues),
		mergeRequests: makeStore(db.mergeRequests),
		projects: makeStore(db.projects),
	};
	const ctx = {
		key: 'token',
		db: stores,
		options: {},
		$getAccountId: async () => 'account',
		// The real endpoint context carries the full plugin runtime; these
		// handlers only read key, db, options and the logging hooks, so this
		// partial context is cast with `never`, which every handler accepts.
	} as never;
	return { ctx, stores };
}

let fetchSpy: jest.SpyInstance;

beforeEach(() => {
	jest.spyOn(console, 'warn').mockImplementation(() => {});
	fetchSpy = jest
		.spyOn(global, 'fetch')
		.mockImplementation(async () => new Response(null, { status: 204 }));
});

afterEach(() => jest.restoreAllMocks());

describe('deleteIssue', () => {
	it('removes the row matching iid and numeric project_id', async () => {
		const { ctx, stores } = makeCtx({
			issues: [issue(205640274, 42, 100), issue(1, 42, 200)],
		});

		await deleteIssue(ctx, { project_id: 100, issue_iid: 42 });

		expect(stores.issues.rows).toEqual([issue(1, 42, 200)]);
	});

	it('resolves a project path through the local projects table', async () => {
		const { ctx, stores } = makeCtx({
			projects: [project(100, 'org/repo')],
			issues: [issue(9999, 7, 100), issue(1, 7, 200)],
		});

		await deleteIssue(ctx, { project_id: 'org/repo', issue_iid: 7 });

		expect(stores.issues.rows).toEqual([issue(1, 7, 200)]);
	});

	it('accepts a numeric string project_id', async () => {
		const { ctx, stores } = makeCtx({ issues: [issue(5, 3, 100)] });

		await deleteIssue(ctx, { project_id: '100', issue_iid: 3 });

		expect(stores.issues.rows).toEqual([]);
	});

	it('deletes nothing when the project path is not mirrored locally', async () => {
		const { ctx, stores } = makeCtx({ issues: [issue(5, 3, 100)] });

		await deleteIssue(ctx, { project_id: 'missing/repo', issue_iid: 3 });

		expect(stores.issues.deleteByEntityId).not.toHaveBeenCalled();
	});

	it('deletes nothing when more than one row matches', async () => {
		const { ctx, stores } = makeCtx({
			issues: [issue(5, 3, 100), issue(6, 3, 100)],
		});

		await deleteIssue(ctx, { project_id: 100, issue_iid: 3 });

		expect(stores.issues.deleteByEntityId).not.toHaveBeenCalled();
	});

	it.each([
		[{ project_id: -5, issue_iid: 3 }],
		[{ project_id: '0', issue_iid: 3 }],
		[{ project_id: 100, issue_iid: 0 }],
		[{ project_id: 100, issue_iid: 1.5 }],
	])('deletes nothing for invalid ids %j', async (input) => {
		const { ctx, stores } = makeCtx({ issues: [issue(5, 3, 100)] });

		await deleteIssue(ctx, input);

		expect(stores.issues.search).not.toHaveBeenCalled();
		expect(stores.issues.deleteByEntityId).not.toHaveBeenCalled();
	});

	it('leaves the local DB alone when the remote DELETE fails', async () => {
		fetchSpy.mockImplementation(
			async () => new Response('{"message":"404 Not found"}', { status: 404 }),
		);
		const { ctx, stores } = makeCtx({ issues: [issue(5, 3, 100)] });

		await expect(
			deleteIssue(ctx, { project_id: 100, issue_iid: 3 }),
		).rejects.toThrow();

		expect(stores.issues.rows).toHaveLength(1);
	});

	it('still resolves when the local delete throws', async () => {
		const { ctx, stores } = makeCtx({ issues: [issue(5, 3, 100)] });
		stores.issues.deleteByEntityId.mockRejectedValueOnce(new Error('db down'));

		await deleteIssue(ctx, { project_id: 100, issue_iid: 3 });

		expect(console.warn).toHaveBeenCalledWith(
			'Failed to delete issue from database:',
			expect.any(Error),
		);
	});
});

describe('deleteMr', () => {
	it('removes the row matching iid and project path', async () => {
		const { ctx, stores } = makeCtx({
			projects: [project(100, 'team/app')],
			mergeRequests: [issue(500, 3, 100), issue(501, 3, 200)],
		});

		await deleteMr(ctx, { project_id: 'team/app', merge_request_iid: 3 });

		expect(stores.mergeRequests.rows).toEqual([issue(501, 3, 200)]);
	});
});

describe('deleteMr', () => {
	it('deletes nothing when more than one row matches', async () => {
		const { ctx, stores } = makeCtx({
			mergeRequests: [issue(500, 3, 100), issue(501, 3, 100)],
		});

		await deleteMr(ctx, { project_id: 100, merge_request_iid: 3 });

		expect(stores.mergeRequests.deleteByEntityId).not.toHaveBeenCalled();
	});
});

describe('deleteProject', () => {
	it('removes the project by numeric id', async () => {
		const { ctx, stores } = makeCtx({
			projects: [project(42, 'org/a'), project(43, 'org/b')],
		});

		await deleteProject(ctx, { project_id: 42 });

		expect(stores.projects.rows).toEqual([project(43, 'org/b')]);
	});

	it('removes the project by path', async () => {
		const { ctx, stores } = makeCtx({
			projects: [project(42, 'org/a'), project(43, 'org/b')],
		});

		await deleteProject(ctx, { project_id: 'org/b' });

		expect(stores.projects.rows).toEqual([project(42, 'org/a')]);
	});

	it('deletes by the stored entity_id', async () => {
		const { ctx, stores } = makeCtx({
			projects: [{ ...project(42, 'org/a'), entity_id: 'project-42' }],
		});

		await deleteProject(ctx, { project_id: 42 });

		expect(stores.projects.deleteByEntityId).toHaveBeenCalledWith('project-42');
		expect(stores.projects.rows).toEqual([]);
	});

	it('deletes nothing for an invalid project id', async () => {
		const { ctx, stores } = makeCtx({ projects: [project(42, 'org/a')] });

		await deleteProject(ctx, { project_id: -42 });

		expect(stores.projects.deleteByEntityId).not.toHaveBeenCalled();
	});

	it('deletes nothing when a path matches more than one row', async () => {
		const { ctx, stores } = makeCtx({
			projects: [project(42, 'org/a'), project(43, 'org/a')],
		});

		await deleteProject(ctx, { project_id: 'org/a' });

		expect(stores.projects.deleteByEntityId).not.toHaveBeenCalled();
	});
});
