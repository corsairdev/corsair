/**
 * Base schema utilities for plugin schema resolution
 */

import type {
	BaseDefaultSchema,
	BaseSchemaOverride,
	ResolvedSchema,
} from './types';

/**
 * Generic schema resolution function
 * Resolves schema overrides to create a final schema configuration
 *
 * @param defaultSchema - The default schema for the plugin
 * @param override - Optional schema override configuration
 * @returns Resolved schema with overrides applied
 */
export function resolveSchema<
	TDefaultSchema extends BaseDefaultSchema,
	TOverride extends BaseSchemaOverride<TDefaultSchema>,
>(
	defaultSchema: TDefaultSchema,
	override: TOverride | undefined,
): ResolvedSchema<TDefaultSchema, TOverride> {
	if (!override) {
		return defaultSchema as ResolvedSchema<TDefaultSchema, TOverride>;
	}

	const resolved: Record<
		string,
		Record<string, string | boolean | number>
	> = {};

	// Process overrides
	for (const [tableName, tableOverride] of Object.entries(override)) {
		if (tableOverride === false) {
			// Skip this table
			continue;
		} else if (tableOverride === true) {
			// Use default schema for this table
			resolved[tableName] = defaultSchema[
				tableName as keyof typeof defaultSchema
			] as Record<string, string | boolean | number>;
		} else if (typeof tableOverride === 'function') {
			// Customize schema using function
			resolved[tableName] = tableOverride(defaultSchema);
		}
	}

	// Add any tables from default schema that weren't in override
	for (const [tableName, defaultTableSchema] of Object.entries(defaultSchema)) {
		if (!(tableName in resolved)) {
			resolved[tableName] = defaultTableSchema as Record<
				string,
				string | boolean | number
			>;
		}
	}

	return resolved as ResolvedSchema<TDefaultSchema, TOverride>;
}

/**
 * Creates a database context based on resolved schema
 * This provides typed access to database tables
 *
 * @param resolvedSchema - The resolved schema
 * @param db - The database instance
 * @returns Database context with typed table access
 */
export function createDatabaseContext<
	T extends Record<string, Record<string, string | boolean | number>>,
>(
	resolvedSchema: T,
	db: unknown,
): {
	[K in keyof T]: T[K] extends never
		? never
		: {
				insert: (data: Record<string, unknown>) => Promise<unknown>;
				select: () => Promise<Array<Record<string, unknown>>>;
				update: (data: Record<string, unknown>) => Promise<unknown>;
				delete: () => Promise<unknown>;
			};
} {
	const context: Record<
		string,
		{
			insert: (data: Record<string, unknown>) => Promise<unknown>;
			select: () => Promise<Array<Record<string, unknown>>>;
			update: (data: Record<string, unknown>) => Promise<unknown>;
			delete: () => Promise<unknown>;
		}
	> = {};

	for (const tableName of Object.keys(resolvedSchema)) {
		const table = (db as { _?: { schema?: Record<string, unknown> } })._
			?.schema?.[tableName] as
			| {
					insert: (data: Record<string, unknown>) => Promise<unknown>;
					select: () => Promise<Array<Record<string, unknown>>>;
					update: (data: Record<string, unknown>) => Promise<unknown>;
					delete: () => Promise<unknown>;
			  }
			| undefined;

		if (table) {
			context[tableName] = table;
		} else {
			// Provide no-op implementations if table doesn't exist
			context[tableName] = {
				async insert() {
					return Promise.resolve(undefined);
				},
				async select() {
					return Promise.resolve([]);
				},
				async update() {
					return Promise.resolve(undefined);
				},
				async delete() {
					return Promise.resolve(undefined);
				},
			};
		}
	}

	return context as {
		[K in keyof T]: T[K] extends never
			? never
			: {
					insert: (data: Record<string, unknown>) => Promise<unknown>;
					select: () => Promise<Array<Record<string, unknown>>>;
					update: (data: Record<string, unknown>) => Promise<unknown>;
					delete: () => Promise<unknown>;
				};
	};
}

