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

function sqliteDb<T extends object>(executor: T) {
	return {
		connection() {
			return {
				execute: (fn: (db: T) => Promise<boolean>) => fn(executor),
			};
		},
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
		const statements: string[] = [];
		let reads = 0;
		const running = row(
			{ jobId: 'job_1', status: 'running' },
			'2026-06-01T00:00:00.000Z',
		);
		const reserved = {
			executeQuery(query: { sql: string }) {
				statements.push(query.sql);
				return Promise.resolve({ rows: [] });
			},
			selectFrom() {
				const query = {
					selectAll() {
						return query;
					},
					where() {
						return query;
					},
					async executeTakeFirst() {
						reads += 1;
						if (reads === 1) {
							return { ...running, data: JSON.stringify(running.data) };
						}
						return row(done, '2026-06-02T00:00:00.000Z');
					},
				};
				return query;
			},
			updateTable() {
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
		};
		await rememberJob(
			context({
				findByEntityId: async () => {
					throw new Error('sqlite reads must use the reserved connection');
				},
				db: sqliteDb(reserved),
			}),
			{ jobId: 'job_1', status: 'queued', outputs: [] },
		);
		expect(statements).toEqual([
			'begin immediate',
			'commit',
			'begin immediate',
			'commit',
		]);
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
			executeQuery() {
				return Promise.resolve({ rows: [] });
			},
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
			selectFrom() {
				const query = {
					selectAll() {
						return query;
					},
					where() {
						return query;
					},
					async executeTakeFirst() {
						reads += 1;
						if (reads === 1) return undefined;
						return row(done, '2026-06-02T00:00:00.000Z');
					},
				};
				return query;
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
					throw new Error('sqlite reads must use the reserved connection');
				},
				db: sqliteDb(chain),
			}),
			{ jobId: 'job_1', status: 'queued', outputs: [] },
		);
		expect(inserts).toBe(1);
		expect(written).toEqual([done]);
		expect(pendingJobSaves()).toBe(0);
	});

	it('does not open a second sqlite transaction while one job is saving', async () => {
		let open = false;
		let nested = false;
		let tail = Promise.resolve();
		const saved: string[] = [];
		function reserved() {
			return {
				async executeQuery(query: { sql: string }) {
					if (query.sql === 'begin immediate') {
						if (open) nested = true;
						open = true;
					}
					if (query.sql === 'commit' || query.sql === 'rollback') open = false;
					return { rows: [] };
				},
				selectFrom() {
					const query = {
						selectAll() {
							return query;
						},
						where() {
							return query;
						},
						async executeTakeFirst() {
							return row(
								{ jobId: 'job_1', status: 'running' },
								'2026-06-01T00:00:00.000Z',
							);
						},
					};
					return query;
				},
				updateTable() {
					let jobId = '';
					const builder = {
						set(values: { data: Job }) {
							jobId = values.data.jobId;
							return builder;
						},
						where() {
							return builder;
						},
						async executeTakeFirst() {
							saved.push(jobId);
							return { numUpdatedRows: 1 };
						},
					};
					return builder;
				},
			};
		}
		const db = {
			connection() {
				return {
					execute(
						fn: (executor: ReturnType<typeof reserved>) => Promise<boolean>,
					) {
						const run = tail.then(() => fn(reserved()));
						tail = run.then(
							() => undefined,
							() => undefined,
						);
						return run;
					},
				};
			},
		};
		const warn = jest
			.spyOn(console, 'warn')
			.mockImplementation(() => undefined);
		await Promise.all([
			rememberJob(context({ db }), {
				jobId: 'job_1',
				status: 'done',
				outputs: done.outputs,
			}),
			rememberJob(context({ db }), { jobId: 'job_2', status: 'running' }),
		]);
		expect(nested).toBe(false);
		expect(saved).toEqual(['job_1', 'job_2']);
		expect(warn).not.toHaveBeenCalled();
		warn.mockRestore();
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
		const statements: string[] = [];
		const warn = jest
			.spyOn(console, 'warn')
			.mockImplementation(() => undefined);
		const reserved = {
			executeQuery(query: { sql: string }) {
				statements.push(query.sql);
				return Promise.resolve({ rows: [] });
			},
			selectFrom() {
				throw new Error('database down');
			},
		};
		await expect(
			rememberJob(
				context({
					db: sqliteDb(reserved),
				}),
				{ jobId: 'job_1', status: 'queued' },
			),
		).resolves.toBeUndefined();
		expect(statements).toEqual(['begin immediate', 'rollback']);
		expect(warn).toHaveBeenCalledWith(
			'suzanne job save failed',
			'job_1',
			expect.any(Error),
		);
		expect(pendingJobSaves()).toBe(0);
		warn.mockRestore();
	});
});
