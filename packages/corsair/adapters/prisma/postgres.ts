import type {
	CorsairDbAdapter,
	CorsairSortBy,
	CorsairTableName,
	CorsairWhere,
	CorsairWhereOperator,
} from '../types';

export type PrismaPostgresAdapterConfig = {
	adapterId?: string | undefined;
	/**
	 * Prisma delegate keys on the Prisma client (e.g. `prisma.corsairResource`).
	 *
	 * Since Prisma model names are user-defined, these are configurable.
	 */
	models?:
		| {
				corsair_resources?: string | undefined;
				corsair_credentials?: string | undefined;
		  }
		| undefined;
};

function normalizeOperator(
	op: CorsairWhereOperator | undefined,
): CorsairWhereOperator {
	return op ?? '=';
}

function toArray(value: unknown): unknown[] {
	return Array.isArray(value) ? value : [value];
}

function buildSelect(select?: string[] | undefined) {
	if (!select?.length) return undefined;
	const s: Record<string, true> = {};
	for (const f of select) s[f] = true;
	return s;
}

function parseLikePattern(pattern: string): {
	kind: 'contains' | 'startsWith' | 'endsWith' | 'equals';
	value: string;
} {
	// Handle common SQL LIKE patterns used by Corsair ORM.
	if (pattern.startsWith('%') && pattern.endsWith('%') && pattern.length >= 2) {
		return { kind: 'contains', value: pattern.slice(1, -1) };
	}
	if (pattern.endsWith('%') && pattern.length >= 1) {
		return { kind: 'startsWith', value: pattern.slice(0, -1) };
	}
	if (pattern.startsWith('%') && pattern.length >= 1) {
		return { kind: 'endsWith', value: pattern.slice(1) };
	}
	return { kind: 'equals', value: pattern };
}

function buildWhere(where: CorsairWhere[] | undefined) {
	if (!where?.length) return undefined;
	const out: Record<string, any> = {};

	for (const w of where) {
		const operator = normalizeOperator(w.operator);
		const field = w.field;

		if (operator === 'in') {
			out[field] = { in: toArray(w.value) };
			continue;
		}

		if (operator === 'like') {
			const parsed = parseLikePattern(String(w.value ?? ''));
			if (parsed.kind === 'contains') {
				out[field] = { contains: parsed.value, mode: 'insensitive' };
			} else if (parsed.kind === 'startsWith') {
				out[field] = { startsWith: parsed.value, mode: 'insensitive' };
			} else if (parsed.kind === 'endsWith') {
				out[field] = { endsWith: parsed.value, mode: 'insensitive' };
			} else {
				out[field] = parsed.value;
			}
			continue;
		}

		out[field] = w.value;
	}

	return out;
}

function buildOrderBy(sortBy: CorsairSortBy | undefined) {
	if (!sortBy) return undefined;
	return { [sortBy.field]: sortBy.direction };
}

function getDelegate(
	prisma: any,
	table: CorsairTableName,
	config: PrismaPostgresAdapterConfig,
) {
	const models = config.models ?? {};
	const key =
		table === 'corsair_resources'
			? (models.corsair_resources ?? 'corsair_resources')
			: table === 'corsair_credentials'
				? (models.corsair_credentials ?? 'corsair_credentials')
				: undefined;
	if (!key) {
		throw new Error(
			`Prisma adapter only supports "corsair_resources" and "corsair_credentials" (got "${String(
				table,
			)}").`,
		);
	}
	const delegate = (prisma as any)[key];
	if (!delegate) {
		throw new Error(
			`Prisma adapter: prisma["${key}"] was not found. Pass config.models to map Corsair table names to your Prisma delegate keys.`,
		);
	}
	return delegate;
}

export function prismaPostgresAdapter(
	prisma: any,
	config: PrismaPostgresAdapterConfig = {},
): CorsairDbAdapter {
	const adapterId = config.adapterId ?? 'prisma-postgres';

	return {
		id: adapterId,

		async findOne<T>(args: {
			table: CorsairTableName;
			where: CorsairWhere[];
			select?: string[] | undefined;
		}) {
			const delegate = getDelegate(prisma, args.table, config);
			const res = await delegate.findFirst({
				where: buildWhere(args.where),
				select: buildSelect(args.select),
			});
			return (res ?? null) as T | null;
		},

		async findMany<T>(args: {
			table: CorsairTableName;
			where?: CorsairWhere[] | undefined;
			limit?: number | undefined;
			offset?: number | undefined;
			sortBy?: CorsairSortBy | undefined;
			select?: string[] | undefined;
		}) {
			const delegate = getDelegate(prisma, args.table, config);
			const res = await delegate.findMany({
				where: buildWhere(args.where),
				take: typeof args.limit === 'number' ? args.limit : undefined,
				skip: typeof args.offset === 'number' ? args.offset : undefined,
				orderBy: buildOrderBy(args.sortBy),
				select: buildSelect(args.select),
			});
			return res as T[];
		},

		async insert<T extends Record<string, any>, R = T>(args: {
			table: CorsairTableName;
			data: T;
			select?: string[] | undefined;
		}) {
			const delegate = getDelegate(prisma, args.table, config);
			const res = await delegate.create({
				data: args.data,
				select: buildSelect(args.select),
			});
			return res as R;
		},

		async update<T>(args: {
			table: CorsairTableName;
			where: CorsairWhere[];
			data: Record<string, any>;
			select?: string[] | undefined;
		}) {
			const delegate = getDelegate(prisma, args.table, config);
			const whereObj = buildWhere(args.where);
			const selectObj = buildSelect(args.select);

			// Fast path: single-id update can use `update()` which returns the row.
			const isSingleId =
				args.where.length === 1 &&
				args.where[0]?.field === 'id' &&
				normalizeOperator(args.where[0]?.operator) === '=';
			if (isSingleId) {
				const res = await delegate.update({
					where: { id: args.where[0]!.value },
					data: args.data,
					select: selectObj,
				});
				return (res ?? null) as T | null;
			}

			await delegate.updateMany({
				where: whereObj,
				data: args.data,
			});

			// Best-effort: fetch one updated row.
			const res = await delegate.findFirst({
				where: whereObj,
				select: selectObj,
			});
			return (res ?? null) as T | null;
		},

		async deleteMany(args: { table: CorsairTableName; where: CorsairWhere[] }) {
			const delegate = getDelegate(prisma, args.table, config);
			const res = await delegate.deleteMany({
				where: buildWhere(args.where),
			});
			return Number(res?.count ?? 0);
		},

		async count(args: {
			table: CorsairTableName;
			where?: CorsairWhere[] | undefined;
		}) {
			const delegate = getDelegate(prisma, args.table, config);
			const res = await delegate.count({
				where: buildWhere(args.where),
			});
			return Number(res ?? 0);
		},

		async transaction<R>(fn: (trx: any) => Promise<R>) {
			const txFn = (prisma as any)?.$transaction?.bind(prisma);
			if (!txFn) return fn(this as any);

			// Interactive transaction if supported; otherwise falls back to batching.
			return txFn(async (tx: any) => {
				const trxAdapter = prismaPostgresAdapter(tx, {
					...config,
					adapterId: adapterId + ':trx',
				});
				return fn(trxAdapter);
			});
		},
	};
}
