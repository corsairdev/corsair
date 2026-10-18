import type { SuzanneContext } from '../index';
import type { Job } from '../schema/database';
import { pendingJobSaves, rememberJob } from './persist';

const done: Job = {
	jobId: 'job_1',
	status: 'done',
	outputs: [{ format: 'glb', downloadUrl: 'https://example/mesh' }],
	updatedAt: '2026-06-02T00:00:00.000Z',
};

type StoredRow = {
	id: string;
	account_id: string;
	entity_type: string;
	entity_id: string;
	data: Job;
	// SQLite returns this column as an ISO string. Postgres returns a Date.
	updated_at: Date | string;
};

function context(input: {
	findByEntityId: (id: string) => Promise<StoredRow | null>;
	upsertByEntityId?: (id: string, data: Job) => Promise<Job>;
	updateTable?: () => {
		set: (values: { data: Job }) => unknown;
		where: (column: string, op: string, value: unknown) => unknown;
		executeTakeFirst: () => Promise<{ numUpdatedRows: number }>;
	};
}): SuzanneContext {
	// rememberJob only reads the database client. The rest of the plugin context is unused.
	return {
		database: { db: { updateTable: input.updateTable } },
		$getAccountId: async () => 'acct_1',
		db: {
			jobs: {
				findByEntityId: input.findByEntityId,
				upsertByEntityId: input.upsertByEntityId ?? (async () => done),
			},
		},
	} as unknown as SuzanneContext;
}

function row(data: Job, updatedAt: Date | string): StoredRow {
	return {
		id: 'row_1',
		account_id: 'acct_1',
		entity_type: 'jobs',
		entity_id: 'job_1',
		data,
		updated_at: updatedAt,
	};
}

describe('suzanne job saves', () => {
	it('updates a sqlite string timestamp only when that timestamp is unchanged', async () => {
		const clocks: unknown[] = [];
		const written: Job[] = [];
		let reads = 0;
		const running = row(
			{ jobId: 'job_1', status: 'running' },
			'2026-06-01T00:00:00.000Z',
		);
		await rememberJob(
			context({
				findByEntityId: async () => {
					reads += 1;
					if (reads === 1) return running;
					return row(done, '2026-06-02T00:00:00.000Z');
				},
				updateTable: () => {
					let data: Job = { jobId: 'job_1' };
					const builder = {
						set(values: { data: Job }) {
							data = values.data;
							return builder;
						},
						where(column: string, _op: string, value: unknown) {
							if (column === 'updated_at') clocks.push(value);
							return builder;
						},
						async executeTakeFirst() {
							written.push(data);
							return { numUpdatedRows: written.length === 1 ? 0 : 1 };
						},
					};
					return builder;
				},
			}),
			{ jobId: 'job_1', status: 'queued', outputs: [] },
		);
		expect(clocks[0]).toBe('2026-06-01T00:00:00.000Z');
		expect(written[0]?.status).toBe('queued');
		expect(written.at(-1)).toEqual(done);
		expect(pendingJobSaves()).toBe(0);
	});

	it('warns when the database write fails and still resolves', async () => {
		const warn = jest
			.spyOn(console, 'warn')
			.mockImplementation(() => undefined);
		await expect(
			rememberJob(
				context({
					findByEntityId: async () => null,
					upsertByEntityId: async () => {
						throw new Error('database down');
					},
				}),
				{ jobId: 'job_1', status: 'queued' },
			),
		).resolves.toBeUndefined();
		expect(warn).toHaveBeenCalledWith(
			'suzanne job save failed',
			'job_1',
			expect.any(Error),
		);
		expect(pendingJobSaves()).toBe(0);
		warn.mockRestore();
	});
});
