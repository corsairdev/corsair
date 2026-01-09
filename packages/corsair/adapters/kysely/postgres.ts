import type { Kysely } from 'kysely';

import type {
	CorsairDbAdapter,
	CorsairSortBy,
	CorsairTableName,
	CorsairWhere,
	CorsairWhereOperator,
} from '../types';

export type KyselyPostgresAdapterConfig = {
	adapterId?: string | undefined;
};

export type KyselyAdapterConfig = KyselyPostgresAdapterConfig & {
	/**
	 * Kept for Better-Auth-like ergonomics. Corsair currently supports Postgres only.
	 */
	provider: 'pg';
};

function normalizeOperator(
	op: CorsairWhereOperator | undefined,
): CorsairWhereOperator {
	return op ?? '=';
}

function toArray(value: unknown): unknown[] {
	return Array.isArray(value) ? value : [value];
}

function applyWhere<T extends { where: (...args: any[]) => any }>(
	q: T,
	where: CorsairWhere[] | undefined,
) {
	if (!where?.length) return q;
	let next: any = q;
	for (const w of where) {
		const operator = normalizeOperator(w.operator);
		if (operator === 'in') {
			next = next.where(w.field as any, 'in', toArray(w.value) as any);
		} else if (operator === 'like') {
			next = next.where(w.field as any, 'like', w.value as any);
		} else {
			next = next.where(w.field as any, '=', w.value as any);
		}
	}
	return next;
}

function applySort<T extends { orderBy: (...args: any[]) => any }>(
	q: T,
	sortBy: CorsairSortBy | undefined,
) {
	if (!sortBy) return q;
	return q.orderBy(sortBy.field as any, sortBy.direction as any);
}

function selectArgs(select?: string[] | undefined) {
	return select?.length ? (select as any) : undefined;
}

export function kyselyPostgresAdapter(
	db: Kysely<any>,
	config: KyselyPostgresAdapterConfig = {},
): CorsairDbAdapter {
	const adapterId = config.adapterId ?? 'kysely-postgres';

	const findOneImpl = async <T>(args: {
		table: CorsairTableName;
		where: CorsairWhere[];
		select?: string[] | undefined;
	}): Promise<T | null> => {
		let q = db.selectFrom(args.table as any);
		const cols = selectArgs(args.select);
		q = cols ? (q.select(cols) as any) : (q.selectAll() as any);
		q = applyWhere(q as any, args.where);
		return (await q.executeTakeFirst()) as T | null;
	};

	return {
		id: adapterId,

		async findOne<T>(args: {
			table: CorsairTableName;
			where: CorsairWhere[];
			select?: string[] | undefined;
		}) {
			return findOneImpl<T>(args);
		},

		async findMany<T>(args: {
			table: CorsairTableName;
			where?: CorsairWhere[] | undefined;
			limit?: number | undefined;
			offset?: number | undefined;
			sortBy?: CorsairSortBy | undefined;
			select?: string[] | undefined;
		}) {
			let q = db.selectFrom(args.table as any);
			const cols = selectArgs(args.select);
			q = cols ? (q.select(cols) as any) : (q.selectAll() as any);
			q = applyWhere(q as any, args.where);
			q = applySort(q as any, args.sortBy);
			if (typeof args.limit === 'number') q = q.limit(args.limit as any) as any;
			if (typeof args.offset === 'number')
				q = q.offset(args.offset as any) as any;
			return (await q.execute()) as T[];
		},

		async insert<T extends Record<string, any>, R = T>(args: {
			table: CorsairTableName;
			data: T;
			select?: string[] | undefined;
		}) {
			try {
				// Postgres supports RETURNING.
				const cols = selectArgs(args.select);
				let q = db
					.insertInto(args.table as any)
					.values(args.data as any) as any;
				q = cols ? q.returning(cols) : q.returningAll();
				const row = await q.executeTakeFirst();
				return (row ?? args.data) as unknown as R;
			} catch {
				await (
					db.insertInto(args.table as any).values(args.data as any) as any
				).execute();
				return args.data as unknown as R;
			}
		},

		async update<T>(args: {
			table: CorsairTableName;
			where: CorsairWhere[];
			data: Record<string, any>;
			select?: string[] | undefined;
		}) {
			try {
				const cols = selectArgs(args.select);
				let q = db.updateTable(args.table as any).set(args.data as any) as any;
				q = applyWhere(q, args.where);
				q = cols ? q.returning(cols) : q.returningAll();
				const row = await q.executeTakeFirst();
				return (row ?? null) as T | null;
			} catch {
				await applyWhere(
					db.updateTable(args.table as any).set(args.data as any) as any,
					args.where,
				).execute();
				// Best-effort: fetch one updated row.
				return await findOneImpl<T>({
					table: args.table,
					where: args.where,
					select: args.select,
				});
			}
		},

		async deleteMany(args) {
			const res = await applyWhere(
				db.deleteFrom(args.table as any) as any,
				args.where,
			).executeTakeFirst();
			return Number((res as any)?.numDeletedRows ?? 0);
		},

		async count(args) {
			let q = db
				.selectFrom(args.table as any)
				.select((eb: any) => eb.fn.countAll().as('count')) as any;
			q = applyWhere(q, args.where);
			const row = await q.executeTakeFirst();
			const countVal = (row as any)?.count;
			if (typeof countVal === 'number') return countVal;
			if (typeof countVal === 'bigint') return Number(countVal);
			return Number.parseInt(String(countVal ?? 0), 10);
		},

		async transaction<R>(fn: (trx: any) => Promise<R>) {
			// Kysely supports transactions via `db.transaction().execute(...)`.
			// If a user passes a Kysely instance without transaction support, fall back to non-transactional execution.
			const txFactory = (db as any)?.transaction?.bind(db);
			if (!txFactory) return fn(this as any);
			return txFactory().execute(async (trx: Kysely<any>) => {
				const trxAdapter = kyselyPostgresAdapter(trx, {
					adapterId: adapterId + ':trx',
				});
				return fn(trxAdapter);
			});
		},
	};
}

/**
 * Better-Auth-style helper: `kyselyAdapter(db, { provider: "pg" })`.
 *
 * Corsair currently supports Postgres only.
 */
export function kyselyAdapter(
	db: Kysely<any>,
	config: KyselyAdapterConfig,
): CorsairDbAdapter {
	if (config.provider !== 'pg') {
		throw new Error(
			`Corsair Kysely adapter only supports provider "pg" (got "${String(
				config.provider,
			)}").`,
		);
	}
	// Strip provider before passing through.
	const { provider: _provider, ...rest } = config;
	return kyselyPostgresAdapter(db, rest);
}
