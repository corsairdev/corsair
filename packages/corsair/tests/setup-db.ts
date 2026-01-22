// @ts-ignore - better-sqlite3 types may not be available
import Database from 'better-sqlite3';
import type { CorsairDbAdapter } from '../adapters/types';

export function createTestDatabase(): {
	db: any;
	adapter: CorsairDbAdapter;
	cleanup: () => void;
} {
	const sqlite = new Database(':memory:');

	sqlite.exec(`
		CREATE TABLE IF NOT EXISTS corsair_resources (
			id TEXT PRIMARY KEY,
			created_at INTEGER NOT NULL,
			updated_at INTEGER NOT NULL,
			tenant_id TEXT NOT NULL,
			resource_id TEXT NOT NULL,
			resource TEXT NOT NULL,
			service TEXT NOT NULL,
			version TEXT NOT NULL,
			data TEXT NOT NULL
		);
	`);

	const adapter: CorsairDbAdapter = {
		id: 'test-sqlite-adapter',
		findOne: async <T>(args: {
			table: string;
			where: Array<{ field: string; value: unknown; operator?: string }>;
			select?: string[];
		}): Promise<T | null> => {
			const table = args.table;
			let query = `SELECT * FROM ${table} WHERE `;
			const conditions: string[] = [];
			const values: unknown[] = [];

			args.where.forEach((condition, index) => {
				const operator = condition.operator || '=';
				conditions.push(`${condition.field} ${operator} ?`);
				values.push(condition.value);
			});

			query += conditions.join(' AND ');
			query += ' LIMIT 1';

			const result = sqlite.prepare(query).get(...values) as T | undefined;
			return result || null;
		},
		findMany: async <T>(args: {
			table: string;
			where?: Array<{ field: string; value: unknown; operator?: string }>;
			limit?: number;
			offset?: number;
			sortBy?: { field: string; direction: 'asc' | 'desc' };
			select?: string[];
		}): Promise<T[]> => {
			const table = args.table;
			let query = `SELECT * FROM ${table}`;
			const values: unknown[] = [];

			if (args.where && args.where.length > 0) {
				query += ' WHERE ';
				const conditions: string[] = [];
				args.where.forEach((condition) => {
					const operator = condition.operator || '=';
					conditions.push(`${condition.field} ${operator} ?`);
					values.push(condition.value);
				});
				query += conditions.join(' AND ');
			}

			if (args.sortBy) {
				query += ` ORDER BY ${args.sortBy.field} ${args.sortBy.direction.toUpperCase()}`;
			}

			if (args.offset) {
				query += ` OFFSET ${args.offset}`;
			}

			if (args.limit) {
				query += ` LIMIT ${args.limit}`;
			}

			const stmt = sqlite.prepare(query);
			const results = stmt.all(...values) as T[];
			return results;
		},
		insert: async <T extends Record<string, any>, R = T>(args: {
			table: string;
			data: T;
			select?: string[];
		}): Promise<R> => {
			const table = args.table;
			const keys = Object.keys(args.data);
			const placeholders = keys.map(() => '?').join(', ');
			const values = keys.map((key) => {
				const value = args.data[key];
				return typeof value === 'object' && value !== null
					? JSON.stringify(value)
					: value;
			});

			const query = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`;
			sqlite.prepare(query).run(...values);

			const inserted = { ...args.data };
			return inserted as unknown as R;
		},
		update: async <T>(args: {
			table: string;
			where: Array<{ field: string; value: unknown; operator?: string }>;
			data: Record<string, any>;
			select?: string[];
		}): Promise<T | null> => {
			const table = args.table;
			const setClause: string[] = [];
			const values: unknown[] = [];

			Object.entries(args.data).forEach(([key, value]) => {
				setClause.push(`${key} = ?`);
				values.push(
					typeof value === 'object' && value !== null
						? JSON.stringify(value)
						: value,
				);
			});

			const whereClause: string[] = [];
			args.where.forEach((condition) => {
				const operator = condition.operator || '=';
				whereClause.push(`${condition.field} ${operator} ?`);
				values.push(condition.value);
			});

			const query = `UPDATE ${table} SET ${setClause.join(', ')} WHERE ${whereClause.join(' AND ')}`;
			sqlite.prepare(query).run(...values);

			const findQuery = `SELECT * FROM ${table} WHERE ${whereClause.join(' AND ')} LIMIT 1`;
			const whereValues = args.where.map((w) => w.value);
			const result = sqlite
				.prepare(findQuery)
				.get(...whereValues) as T | undefined;
			return result || null;
		},
		deleteMany: async (args: {
			table: string;
			where: Array<{ field: string; value: unknown; operator?: string }>;
		}): Promise<number> => {
			const table = args.table;
			const whereClause: string[] = [];
			const values: unknown[] = [];

			args.where.forEach((condition) => {
				const operator = condition.operator || '=';
				whereClause.push(`${condition.field} ${operator} ?`);
				values.push(condition.value);
			});

			const query = `DELETE FROM ${table} WHERE ${whereClause.join(' AND ')}`;
			const result = sqlite.prepare(query).run(...values);
			return result.changes || 0;
		},
		count: async (args: {
			table: string;
			where?: Array<{ field: string; value: unknown; operator?: string }>;
		}): Promise<number> => {
			const table = args.table;
			let query = `SELECT COUNT(*) as count FROM ${table}`;
			const values: unknown[] = [];

			if (args.where && args.where.length > 0) {
				query += ' WHERE ';
				const conditions: string[] = [];
				args.where.forEach((condition) => {
					const operator = condition.operator || '=';
					conditions.push(`${condition.field} ${operator} ?`);
					values.push(condition.value);
				});
				query += conditions.join(' AND ');
			}

			const result = sqlite.prepare(query).get(...values) as { count: number };
			return result.count;
		},
		transaction: async <R>(
			fn: (trx: any) => Promise<R>,
		): Promise<R> => {
			return sqlite.transaction(fn)();
		},
	};

	return {
		db: sqlite,
		adapter,
		cleanup: () => {
			sqlite.close();
		},
	};
}
