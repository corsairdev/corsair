import {
	buildFormsListWorkspaceQuerySegment,
	safeDbDelete,
	safeDbUpsert,
	toFormRecord,
	toSubmissionRecord,
	toWorkspaceRecord,
} from '../utils';

describe('buildFormsListWorkspaceQuerySegment', () => {
	it('serializes a single id', () => {
		expect(buildFormsListWorkspaceQuerySegment(['ws1'])).toBe(
			'workspaceIds=ws1',
		);
	});

	it('serializes multiple ids with repeated keys (OpenAPI explode)', () => {
		expect(buildFormsListWorkspaceQuerySegment(['a', 'b'])).toBe(
			'workspaceIds=a&workspaceIds=b',
		);
	});

	it('percent-encodes special characters', () => {
		expect(buildFormsListWorkspaceQuerySegment(['x y', 'z&'])).toBe(
			'workspaceIds=x%20y&workspaceIds=z%26',
		);
	});
});

describe('toFormRecord', () => {
	it('maps API fields to persisted shape', () => {
		const r = toFormRecord({
			id: 'f1',
			name: 'N',
			status: 'PUBLISHED',
			workspaceId: 'w1',
			createdAt: '2026-01-01T00:00:00.000Z',
			updatedAt: '2026-01-02T00:00:00.000Z',
		});
		expect(r.id).toBe('f1');
		expect(r.name).toBe('N');
		expect(r.status).toBe('PUBLISHED');
		expect(r.workspaceId).toBe('w1');
		expect(r.createdAt).toEqual(new Date('2026-01-01T00:00:00.000Z'));
		expect(r.updatedAt).toEqual(new Date('2026-01-02T00:00:00.000Z'));
	});

	it('omits dates when missing', () => {
		const r = toFormRecord({ id: 'f1' });
		expect(r.createdAt).toBeUndefined();
		expect(r.updatedAt).toBeUndefined();
	});
});

describe('toWorkspaceRecord', () => {
	it('maps workspace fields', () => {
		const r = toWorkspaceRecord({
			id: 'w1',
			name: 'WS',
			createdAt: '2026-01-01T00:00:00.000Z',
		});
		expect(r.id).toBe('w1');
		expect(r.name).toBe('WS');
		expect(r.createdAt).toEqual(new Date('2026-01-01T00:00:00.000Z'));
	});
});

describe('toSubmissionRecord', () => {
	it('maps submission fields and casts fields', () => {
		const r = toSubmissionRecord({
			id: 's1',
			formId: 'f1',
			respondentId: null,
			isCompleted: true,
			createdAt: '2026-01-01T00:00:00.000Z',
			fields: [{ key: 'q1', value: 'v' }],
		});
		expect(r.id).toBe('s1');
		expect(r.formId).toBe('f1');
		expect(r.respondentId).toBeNull();
		expect(r.isCompleted).toBe(true);
		expect(r.fields).toEqual([{ key: 'q1', value: 'v' }]);
	});
});

describe('safeDbUpsert / safeDbDelete', () => {
	it('no-ops when db is undefined', async () => {
		await expect(
			safeDbUpsert(undefined, 'id', { x: 1 } as never, 'label'),
		).resolves.toBeUndefined();
		await expect(safeDbDelete(undefined, 'id', 'label')).resolves.toBeUndefined();
	});

	it('swallows upsert errors', async () => {
		const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
		const db = {
			upsertByEntityId: jest.fn().mockRejectedValue(new Error('fail')),
		};
		await safeDbUpsert(db, 'e1', {} as never, 'entity');
		expect(db.upsertByEntityId).toHaveBeenCalled();
		expect(warn).toHaveBeenCalled();
		warn.mockRestore();
	});

	it('swallows delete errors', async () => {
		const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
		const db = {
			deleteByEntityId: jest.fn().mockRejectedValue(new Error('fail')),
		};
		await safeDbDelete(db, 'e1', 'entity');
		expect(db.deleteByEntityId).toHaveBeenCalled();
		expect(warn).toHaveBeenCalled();
		warn.mockRestore();
	});
});
