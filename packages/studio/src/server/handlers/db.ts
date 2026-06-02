import { readJsonBody } from '../router';
import type { HandlerFn } from '../types';

const CORE_TABLES = [
	'corsair_integrations',
	'corsair_accounts',
	'corsair_entities',
	'corsair_events',
	'corsair_permissions',
] as const;

type KyselyDb = {
	selectFrom: (table: string) => {
		selectAll: () => {
			limit: (n: number) => {
				offset: (n: number) => {
					orderBy: (
						col: string,
						dir: 'asc' | 'desc',
					) => {
						execute: () => Promise<Record<string, unknown>[]>;
					};
					execute: () => Promise<Record<string, unknown>[]>;
				};
				execute: () => Promise<Record<string, unknown>[]>;
			};
		};
	};
	introspection: {
		getTables: () => Promise<Array<{ name: string }>>;
	};
};

function getKyselyDb(database: unknown): KyselyDb | null {
	if (!database) return null;
	const obj = database as { db?: KyselyDb } & Partial<KyselyDb>;
	if (obj.db && typeof obj.db === 'object' && 'selectFrom' in obj.db) {
		return obj.db;
	}
	if ('selectFrom' in obj) return obj as KyselyDb;
	return null;
}

export const listDbTables: HandlerFn = async (ctx) => {
	const { internal } = await ctx.getCorsair();
	if (!internal.database) throw new Error('No database configured.');
	const db = getKyselyDb(internal.database);
	if (!db) throw new Error('Could not access kysely db handle.');

	const existing = await db.introspection.getTables();
	const existingNames = new Set(existing.map((t) => t.name));

	return {
		core: CORE_TABLES.filter((t) => existingNames.has(t)),
		missing: CORE_TABLES.filter((t) => !existingNames.has(t)),
		all: existing.map((t) => t.name).sort(),
	};
};

export const listDbRows: HandlerFn = async (ctx) => {
	const body = await readJsonBody(ctx.req);
	const table = String(body.table ?? '');
	const limit = Math.min(Math.max(Number(body.limit ?? 50), 1), 500);
	const offset = Math.max(Number(body.offset ?? 0), 0);
	if (!table) throw new Error('Missing table.');

	const { internal } = await ctx.getCorsair();
	if (!internal.database) throw new Error('No database configured.');
	const db = getKyselyDb(internal.database);
	if (!db) throw new Error('Could not access kysely db handle.');

	let rows: Record<string, unknown>[];
	try {
		const q = db.selectFrom(table).selectAll().limit(limit).offset(offset);
		rows = await q.orderBy('created_at', 'desc').execute();
	} catch {
		rows = await db
			.selectFrom(table)
			.selectAll()
			.limit(limit)
			.offset(offset)
			.execute();
	}

	const safeRows = rows.map(redactSensitive);
	return { rows: safeRows, limit, offset };
};

export const queryEntityData: HandlerFn = async (ctx) => {
	const body = await readJsonBody(ctx.req);
	const tenant = String(body.tenant ?? '').trim();
	const integration = String(body.integration ?? '').trim();
	const entity = String(body.entity ?? '').trim();
	const search = String(body.search ?? '').trim();
	const limit = Math.min(Math.max(Number(body.limit ?? 30), 1), 200);
	const offset = Math.max(Number(body.offset ?? 0), 0);
	const rawSortField = String(body.sortField ?? 'updated_at');
	const rawSortDirection = String(body.sortDirection ?? 'desc');
	const sortField =
		rawSortField === 'created_at' || rawSortField === 'updated_at'
			? rawSortField
			: 'updated_at';
	const sortDirection =
		rawSortDirection === 'asc' || rawSortDirection === 'desc'
			? rawSortDirection
			: 'desc';

	if (!tenant) throw new Error('Missing tenant.');
	if (!integration) throw new Error('Missing integration.');
	if (!entity) throw new Error('Missing entity.');

	const { internal } = await ctx.getCorsair();
	if (!internal.database) throw new Error('No database configured.');
	const db = getKyselyDb(internal.database);
	if (!db) throw new Error('Could not access kysely db handle.');
	const base = (db as any)
		.selectFrom('corsair_entities as e')
		.innerJoin('corsair_accounts as a', 'a.id', 'e.account_id')
		.innerJoin('corsair_integrations as i', 'i.id', 'a.integration_id')
		.where('a.tenant_id', '=', tenant)
		.where('i.name', '=', integration)
		.where('e.entity_type', '=', entity);

	let rowsRaw: Array<{ id: unknown; entity_id: unknown; data: unknown }> = [];
	let hasMore = false;
	let total = 0;

	if (!search) {
		const page = (await base
			.select(['e.id as id', 'e.entity_id as entity_id', 'e.data as data'])
			.orderBy(`e.${sortField}`, sortDirection)
			.limit(limit + 1)
			.offset(offset)
			.execute()) as Array<{
			id: unknown;
			entity_id: unknown;
			data: unknown;
		}>;
		hasMore = page.length > limit;
		rowsRaw = hasMore ? page.slice(0, limit) : page;
		total = hasMore ? offset + limit + 1 : offset + rowsRaw.length;
	} else {
		const matched: Array<{ id: unknown; entity_id: unknown; data: unknown }> =
			[];
		const batchSize = 200;
		let scanOffset = 0;
		let matchedBeforePage = 0;
		while (true) {
			const batch = (await base
				.select(['e.id as id', 'e.entity_id as entity_id', 'e.data as data'])
				.orderBy(`e.${sortField}`, sortDirection)
				.limit(batchSize)
				.offset(scanOffset)
				.execute()) as Array<{
				id: unknown;
				entity_id: unknown;
				data: unknown;
			}>;
			if (batch.length === 0) {
				hasMore = false;
				break;
			}

			for (const row of batch) {
				if (!dataMatchesSearch(row.data, search)) continue;
				if (matchedBeforePage < offset) {
					matchedBeforePage += 1;
					continue;
				}
				matched.push(row);
				if (matched.length > limit) {
					hasMore = true;
					break;
				}
			}

			if (hasMore) break;
			scanOffset += batch.length;
			if (batch.length < batchSize) break;
		}

		rowsRaw = matched.slice(0, limit);
		total = matchedBeforePage + rowsRaw.length + (hasMore ? 1 : 0);
	}

	const rows = rowsRaw
		.map((row) => ({
			id: row.id,
			entity_id: row.entity_id,
			data: row.data,
		}))
		.map(redactSensitive);

	return {
		rows,
		limit,
		offset,
		total,
		hasMore,
	};
};

/** Hide encryption material from UI payloads; users can expose them via Credentials if needed. */
function redactSensitive(
	row: Record<string, unknown>,
): Record<string, unknown> {
	const copy = { ...row };
	if ('dek' in copy && typeof copy.dek === 'string' && copy.dek.length > 0) {
		copy.dek = '***';
	}
	const config = copy.config;
	if (config && typeof config === 'object' && !Array.isArray(config)) {
		const c = config as Record<string, unknown>;
		const masked: Record<string, unknown> = {};
		for (const [k, v] of Object.entries(c)) {
			if (typeof v === 'string' && v.length > 12) {
				masked[k] = `${v.slice(0, 4)}…${v.slice(-3)} (${v.length})`;
			} else if (typeof v === 'string') {
				masked[k] = '***';
			} else {
				masked[k] = v;
			}
		}
		copy.config = masked;
	}
	return copy;
}

function dataMatchesSearch(data: unknown, rawSearch: string): boolean {
	const search = rawSearch.toLowerCase();
	if (!search) return true;
	const values = collectPrimitiveValues(data);
	return values.some((value) => value.toLowerCase().includes(search));
}

function collectPrimitiveValues(value: unknown): string[] {
	if (value === null || value === undefined) return [];
	if (typeof value === 'string') return [value];
	if (typeof value === 'number' || typeof value === 'boolean') {
		return [String(value)];
	}
	if (value instanceof Date) return [value.toISOString()];
	if (Array.isArray(value)) {
		return value.flatMap((item) => collectPrimitiveValues(item));
	}
	if (typeof value === 'object') {
		return Object.values(value as Record<string, unknown>).flatMap((v) =>
			collectPrimitiveValues(v),
		);
	}
	return [];
}

export const listPermissions: HandlerFn = async (ctx) => {
	const { internal } = await ctx.getCorsair();
	if (!internal.database) throw new Error('No database configured.');
	const db = getKyselyDb(internal.database);
	if (!db) throw new Error('Could not access kysely db handle.');

	const limit = Math.min(
		Math.max(Number(ctx.url.searchParams.get('limit') ?? 100), 1),
		500,
	);
	try {
		const rows = await db
			.selectFrom('corsair_permissions')
			.selectAll()
			.limit(limit)
			.offset(0)
			.orderBy('created_at', 'desc')
			.execute();
		return { rows };
	} catch (err) {
		return { rows: [], note: (err as Error).message };
	}
};
