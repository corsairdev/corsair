import { readJsonBody } from '../router';
import type { HandlerFn } from '../types';

type KyselyDb = {
	/**
	 * Using `any` because Kysely's query builder returns deeply nested generic types
	 * that would require re-exporting internal Kysely generics. The query builder contract
	 * is properly enforced by Kysely's runtime implementation and type checking at the
	 * ORM client level (db/orm.ts).
	 */
	selectFrom: (table: string) => any;
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

export const listExecutions: HandlerFn = async (ctx) => {
	const body = await readJsonBody(ctx.req);
	const tenant = String(body.tenant ?? '').trim();
	const plugin = String(body.plugin ?? '').trim();
	const status = String(body.status ?? '').trim();
	const search = String(body.search ?? '').trim();
	const limit = Math.min(Math.max(Number(body.limit ?? 50), 1), 500);
	const offset = Math.max(Number(body.offset ?? 0), 0);

	const { internal } = await ctx.getCorsair();
	if (!internal.database) throw new Error('No database configured.');
	const db = getKyselyDb(internal.database);
	if (!db) throw new Error('Could not access kysely db handle.');

	// Check if table exists
	const tables = await db.introspection.getTables();
	const tableExists = tables.some((t) => t.name === 'corsair_executions');
	if (!tableExists) {
		return {
			rows: [],
			total: 0,
			limit,
			offset,
			hasMore: false,
			note: 'The corsair_executions table does not exist yet. Please run the migration to create it.',
		};
	}

	// Build query with filters
	let query = db.selectFrom('corsair_executions').selectAll();

	if (tenant) {
		query = query.where('tenant_id', '=', tenant);
	}
	if (plugin) {
		query = query.where('plugin', '=', plugin);
	}
	if (
		status &&
		(status === 'pending' || status === 'completed' || status === 'failed')
	) {
		query = query.where('status', '=', status);
	}

	// Apply search filter - search in both endpoint and error fields
	if (search) {
		const searchPattern = `%${search}%`;
		// Using `any` because Kysely's where condition chaining returns complex generic types.
		// The contract is enforced at the query execution layer, not the type system.
		query = (query.where('endpoint', 'like', searchPattern) as any).orWhere(
			'error',
			'like',
			searchPattern,
		);
	}

	// Order by created_at desc (most recent first) and apply pagination
	query = query
		.orderBy('created_at', 'desc')
		.limit(limit + 1)
		.offset(offset);

	const rows = await query.execute();
	const hasMore = rows.length > limit;
	const resultRows = hasMore ? rows.slice(0, limit) : rows;

	// Count total matching rows using COUNT(*)
	let countQuery = db.selectFrom('corsair_executions').select([
		(eb: any) =>
			// Using `any` because Kysely's ExpressionBuilder returns complex generic types.
			// Proper typing is enforced at the ORM client level.
			(eb.fn.count('id') as any).as('count'),
	]);
	if (tenant) {
		countQuery = countQuery.where('tenant_id', '=', tenant);
	}
	if (plugin) {
		countQuery = countQuery.where('plugin', '=', plugin);
	}
	if (
		status &&
		(status === 'pending' || status === 'completed' || status === 'failed')
	) {
		countQuery = countQuery.where('status', '=', status);
	}
	if (search) {
		const searchPattern = `%${search}%`;
		countQuery = (
			countQuery.where('endpoint', 'like', searchPattern) as any
		).orWhere('error', 'like', searchPattern);
	}
	const countResult = await countQuery.executeTakeFirst();
	const total =
		typeof countResult?.count === 'number'
			? countResult.count
			: parseInt(String(countResult?.count ?? 0), 10);

	// Obfuscate sensitive data in input/output
	const safeRows = resultRows.map(obfuscateSensitiveData);

	return {
		rows: safeRows,
		total,
		limit,
		offset,
		hasMore,
	};
};

export const getExecutionStats: HandlerFn = async (ctx) => {
	const { internal } = await ctx.getCorsair();
	if (!internal.database) throw new Error('No database configured.');
	const db = getKyselyDb(internal.database);
	if (!db) throw new Error('Could not access kysely db handle.');

	// Check if table exists
	const tables = await db.introspection.getTables();
	const tableExists = tables.some((t) => t.name === 'corsair_executions');
	if (!tableExists) {
		return {
			totalExecutions: 0,
			byStatus: { pending: 0, completed: 0, failed: 0 },
			byPlugin: {},
			recentExecutions: [],
		};
	}

	// Get total count using COUNT(*)
	const totalCountResult = await db
		.selectFrom('corsair_executions')
		.select([
			(eb: any) =>
				// Using `any` because Kysely's ExpressionBuilder returns complex generic types
				// that would require re-exporting internal Kysely generics to fully type.
				// Proper typing is enforced at the ORM client level.
				(eb.fn.count('id') as any).as('count'),
		])
		.executeTakeFirst();
	const totalExecutions =
		typeof totalCountResult?.count === 'number'
			? totalCountResult.count
			: parseInt(String(totalCountResult?.count ?? 0), 10);

	// Get counts grouped by status
	const byStatusResults = await db
		.selectFrom('corsair_executions')
		.select(['status', (eb: any) => (eb.fn.count('id') as any).as('count')])
		.groupBy('status')
		.execute();

	const byStatus = {
		pending: 0,
		completed: 0,
		failed: 0,
	};

	for (const row of byStatusResults) {
		const status = row.status as 'pending' | 'completed' | 'failed';
		if (status in byStatus) {
			const count = typeof row.count === 'number' ? row.count : 0;
			byStatus[status] = parseInt(String(count), 10);
		}
	}

	// Get counts grouped by plugin
	const byPluginResults = await db
		.selectFrom('corsair_executions')
		.select(['plugin', (eb: any) => (eb.fn.count('id') as any).as('count')])
		.groupBy('plugin')
		.execute();

	const byPlugin: Record<string, number> = {};
	for (const row of byPluginResults) {
		const plugin = String(row.plugin || 'unknown');
		const count = typeof row.count === 'number' ? row.count : 0;
		byPlugin[plugin] = parseInt(String(count), 10);
	}

	// Get recent executions (last 10)
	const recentRows = await db
		.selectFrom('corsair_executions')
		.selectAll()
		.orderBy('created_at', 'desc')
		.limit(10)
		.execute();

	const recentExecutions = recentRows.map(obfuscateSensitiveData);

	return {
		totalExecutions,
		byStatus,
		byPlugin,
		recentExecutions,
	};
};

/**
 * Obfuscate sensitive data in execution records.
 * Truncates long values and masks potential secrets.
 */
function obfuscateSensitiveData(
	row: Record<string, unknown>,
): Record<string, unknown> {
	const copy = { ...row };

	// Obfuscate input
	if (
		copy.input &&
		typeof copy.input === 'object' &&
		!Array.isArray(copy.input)
	) {
		const input = copy.input as Record<string, unknown>;
		const masked: Record<string, unknown> = {};
		for (const [k, v] of Object.entries(input)) {
			if (shouldObfuscateField(k)) {
				masked[k] = obfuscateValue(v);
			} else {
				masked[k] = v;
			}
		}
		copy.input = masked;
	}

	// Obfuscate output
	if (
		copy.output &&
		typeof copy.output === 'object' &&
		!Array.isArray(copy.output)
	) {
		const output = copy.output as Record<string, unknown>;
		const masked: Record<string, unknown> = {};
		for (const [k, v] of Object.entries(output)) {
			if (shouldObfuscateField(k)) {
				masked[k] = obfuscateValue(v);
			} else {
				masked[k] = v;
			}
		}
		copy.output = masked;
	}

	return copy;
}

/**
 * Check if a field name suggests it contains sensitive data.
 */
function shouldObfuscateField(fieldName: string): boolean {
	const sensitivePatterns = [
		'key',
		'token',
		'secret',
		'password',
		'credential',
		'auth',
		'api_key',
		'access_token',
		'refresh_token',
	];
	const lowerName = fieldName.toLowerCase();
	return sensitivePatterns.some((pattern) => lowerName.includes(pattern));
}

/**
 * Obfuscate a value (truncate and mask).
 */
function obfuscateValue(value: unknown): string {
	if (value === null || value === undefined) return '***';
	if (typeof value === 'string') {
		if (value.length === 0) return '***';
		if (value.length <= 8) return '***';
		return `${value.slice(0, 4)}…${value.slice(-3)} (${value.length} chars)`;
	}
	if (typeof value === 'number') return String(value);
	if (typeof value === 'boolean') return String(value);
	return '***';
}
