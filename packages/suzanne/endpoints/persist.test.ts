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

function context(input: {
	isPg?: boolean;
	findByEntityId?: (id: string) => Promise<StoredRow | null>;
	db?: Record<string, unknown>;
}): SuzanneContext {
	// rememberJob only reads the database client. The rest of the plugin context is unused.
	return {
		database: {
			isPg: input.isPg ?? false,
			db: input.db ?? {},
		},
		$getAccountId: async () => 'acct_1',
		db: {
			jobs: {
				findByEntityId: input.findByEntityId ?? (async () => null),
				upsertByEntityId: async () => {
					throw new Error('upsert must not replace a job row');
				},
			},
		},
	} as unknown as SuzanneContext;
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
				db: {
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
				},
			}),
			{ jobId: 'job_1', status: 'queued', outputs: [] },
		);
		expect(clocks[0]).toBe('2026-06-01T00:00:00.000Z');
		expect(written[0]?.status).toBe('queued');
		expect(written.at(-1)).toEqual(done);
		expect(pendingJobSaves()).toBe(0);
	});

	it('does not upsert when another process inserts the first row', async () => {
		const written: Job[] = [];
		let reads = 0;
		let inserts = 0;
		const chain = {
			selectNoFrom(build: (eb: Record<string, unknown>) => unknown) {
				const eb = {
					val(value: unknown) {
						return { as: () => value };
					},
					not(value: unknown) {
						return value;
					},
					exists(value: unknown) {
						return value;
					},
					selectFrom() {
						return eb;
					},
					select() {
						return eb;
					},
					where() {
						return eb;
					},
				};
				build(eb);
				return chain;
			},
			where() {
				return chain;
			},
			insertInto() {
				return chain;
			},
			columns() {
				return chain;
			},
			expression() {
				return chain;
			},
			async executeTakeFirst() {
				inserts += 1;
				return { numInsertedOrUpdatedRows: 0 };
			},
			updateTable() {
				let data: Job = { jobId: 'job_1' };
				const builder = {
					set(values: { data: Job }) {
						data = values.data;
						return builder;
					},
					where() {
						return builder;
					},
					async executeTakeFirst() {
						written.push(data);
						return { numUpdatedRows: 1 };
					},
				};
				return builder;
			},
		};
		await rememberJob(
			context({
				findByEntityId: async () => {
					reads += 1;
					if (reads === 1) return null;
					return row(done, '2026-06-02T00:00:00.000Z');
				},
				db: chain,
			}),
			{ jobId: 'job_1', status: 'queued', outputs: [] },
		);
		expect(inserts).toBe(1);
		expect(written).toEqual([done]);
		expect(pendingJobSaves()).toBe(0);
	});

	it('locks the account and inserts when postgres has no job row', async () => {
		let locked = false;
		let inserted = false;
		const trx = {
			selectFrom(table: string) {
				const query = {
					select() {
						return query;
					},
					where() {
						return query;
					},
					forUpdate() {
						locked = table === 'corsair_accounts';
						return query;
					},
					async executeTakeFirst() {
						return table === 'corsair_accounts' ? { id: 'acct_1' } : undefined;
					},
					selectAll() {
						return query;
					},
				};
				return query;
			},
			insertInto() {
				inserted = true;
				const query = {
					values() {
						return query;
					},
					async execute() {
						return [];
					},
				};
				return query;
			},
			updateTable() {
				throw new Error('update must wait until a row exists');
			},
		};
		await rememberJob(
			context({
				isPg: true,
				db: {
					transaction: () => ({
						execute: (fn: (executor: typeof trx) => Promise<boolean>) =>
							fn(trx),
					}),
				},
			}),
			{ jobId: 'job_1', status: 'queued' },
		);
		expect(locked).toBe(true);
		expect(inserted).toBe(true);
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
					db: {
						selectNoFrom() {
							throw new Error('database down');
						},
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
