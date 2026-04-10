/**
 * Adapter factory for Corsair database adapters.
 *
 * This module centralizes the input/output transformations that every adapter must perform (Date ↔
 * epoch, JSON parse/stringify, internal-field stripping) so that individual
 * adapter implementations only need to declare their *capabilities* and
 * provide raw CRUD methods.
 *
 * @example
 * ```ts
 * const transforms = createAdapterTransforms({
 *   dates: 'epoch',        // store Date as epoch ms
 *   json: 'native',        // DB handles objects natively
 *   internalFields: ['_id', '_creationTime'],
 * });
 *
 * // In adapter methods:
 * const rawData = transforms.transformInput(data);
 * const row     = transforms.transformOutput<T>(doc);
 * const rows    = transforms.transformOutputMany<T>(docs);
 * ```
 */

// ---------------------------------------------------------------------------
// Capability flags
// ---------------------------------------------------------------------------

/**
 * How the database stores Date values.
 *
 * - `'native'`  – DB supports Date objects directly (e.g. Postgres, Kysely).
 * - `'epoch'`   – DB stores dates as epoch milliseconds (e.g. Convex).
 * - `'iso'`     – DB stores dates as ISO-8601 strings (e.g. SQLite via text).
 */
export type DateStorageMode = 'native' | 'epoch' | 'iso';

/**
 * How the database stores JSON/object fields (config, data, payload).
 *
 * - `'native'`  – DB handles objects natively (e.g. Convex `v.any()`, Postgres JSONB).
 * - `'string'`  – DB stores objects as JSON strings (e.g. SQLite text columns).
 */
export type JsonStorageMode = 'native' | 'string';

/**
 * Capability declaration for a database adapter.
 *
 * Each adapter tells the factory *how* its database stores certain types.
 * The factory then automatically converts between Corsair's canonical types
 * (Date objects, parsed JSON) and the database's native representation.
 */
export type AdapterCapabilities = {
	/** How dates are stored. @default 'native' */
	dates?: DateStorageMode;

	/** How JSON fields (config, data, payload) are stored. @default 'string' */
	json?: JsonStorageMode;

	/**
	 * Internal fields injected by the database engine that should be stripped
	 * from output rows (e.g. Convex's `_id` and `_creationTime`).
	 */
	internalFields?: string[];

	/**
	 * The well-known JSON field names in the Corsair schema.
	 * These fields will be parsed/stringified according to the `json` mode.
	 * @default ['config', 'data', 'payload']
	 */
	jsonFields?: string[];

	/**
	 * The well-known date field names in the Corsair schema.
	 * These fields will be converted according to the `dates` mode.
	 * @default ['created_at', 'updated_at']
	 */
	dateFields?: string[];
};

// ---------------------------------------------------------------------------
// Transform helpers
// ---------------------------------------------------------------------------

const DEFAULT_JSON_FIELDS = ['config', 'data', 'payload'];
const DEFAULT_DATE_FIELDS = ['created_at', 'updated_at'];

function dateToEpoch(d: Date | undefined): number {
	return d ? d.getTime() : Date.now();
}

function dateToIso(d: Date | undefined): string {
	return d ? d.toISOString() : new Date().toISOString();
}

function epochToDate(epoch: number): Date {
	return new Date(epoch);
}

function parseJsonField(value: unknown): unknown {
	if (typeof value === 'string') {
		try {
			return JSON.parse(value);
		} catch {
			return value;
		}
	}
	return value;
}

/**
 * Recursively converts Date objects to the target format.
 */
function sanitizeDates(value: unknown, mode: DateStorageMode): unknown {
	if (value instanceof Date) {
		return mode === 'epoch' ? value.getTime() : value.toISOString();
	}
	if (Array.isArray(value)) {
		return value.map((v) => sanitizeDates(v, mode));
	}
	if (value !== null && typeof value === 'object') {
		const result: Record<string, unknown> = {};
		for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
			result[k] = sanitizeDates(v, mode);
		}
		return result;
	}
	return value;
}

// ---------------------------------------------------------------------------
// AdapterTransforms
// ---------------------------------------------------------------------------

export type AdapterTransforms = {
	/**
	 * Transform a row coming *out* of the database into Corsair's canonical format.
	 * Strips internal fields, converts dates, and parses JSON.
	 */
	transformOutput: <T>(doc: Record<string, unknown> | null) => T | null;

	/**
	 * Transform multiple rows coming out of the database.
	 */
	transformOutputMany: <T>(docs: Record<string, unknown>[]) => T[];

	/**
	 * Transform data going *into* the database.
	 * Converts Date objects and stringifies JSON fields as needed.
	 */
	transformInput: (data: Record<string, unknown>) => Record<string, unknown>;

	/**
	 * Convert a single Date for storage (e.g. for timestamp fields outside
	 * the standard created_at/updated_at).
	 */
	dateForStorage: (d: Date | undefined) => number | string | Date;

	/**
	 * Recursively sanitize a value for storage (converts nested Dates).
	 * Useful for arbitrary data payloads.
	 */
	sanitizeValue: (value: unknown) => unknown;

	/** The resolved capabilities. */
	capabilities: Required<
		Pick<AdapterCapabilities, 'dates' | 'json' | 'internalFields' | 'jsonFields' | 'dateFields'>
	>;
};

/**
 * Creates a set of input/output transform functions based on the adapter's
 * declared capabilities.
 */
export function createAdapterTransforms(
	capabilities: AdapterCapabilities = {},
): AdapterTransforms {
	const dates = capabilities.dates ?? 'native';
	const json = capabilities.json ?? 'string';
	const internalFields = capabilities.internalFields ?? [];
	const jsonFields = capabilities.jsonFields ?? DEFAULT_JSON_FIELDS;
	const dateFields = capabilities.dateFields ?? DEFAULT_DATE_FIELDS;

	const internalFieldSet = new Set(internalFields);
	const jsonFieldSet = new Set(jsonFields);
	const dateFieldSet = new Set(dateFields);

	// -- Output transform (DB → Corsair) ------------------------------------

	function transformOutput<T>(
		doc: Record<string, unknown> | null,
	): T | null {
		if (!doc) return null;

		const result: Record<string, unknown> = {};
		for (const [key, value] of Object.entries(doc)) {
			// Strip internal fields
			if (internalFieldSet.has(key)) continue;

			let transformed = value;

			// Convert date fields
			if (dateFieldSet.has(key) && dates !== 'native') {
				if (dates === 'epoch' && typeof value === 'number') {
					transformed = epochToDate(value);
				} else if (dates === 'iso' && typeof value === 'string') {
					transformed = new Date(value);
				}
			}

			// Parse JSON fields
			if (jsonFieldSet.has(key) && json === 'string') {
				transformed = parseJsonField(transformed);
			}

			result[key] = transformed;
		}

		return result as T;
	}

	function transformOutputMany<T>(
		docs: Record<string, unknown>[],
	): T[] {
		return docs.map((d) => transformOutput<T>(d)!).filter(Boolean);
	}

	// -- Input transform (Corsair → DB) -------------------------------------

	function transformInput(
		data: Record<string, unknown>,
	): Record<string, unknown> {
		if (dates === 'native' && json === 'native') return data;

		const result: Record<string, unknown> = {};
		for (const [key, value] of Object.entries(data)) {
			let transformed = value;

			// Convert date fields
			if (dateFieldSet.has(key) && dates !== 'native' && value instanceof Date) {
				transformed =
					dates === 'epoch' ? value.getTime() : value.toISOString();
			}

			// Stringify JSON fields
			if (
				jsonFieldSet.has(key) &&
				json === 'string' &&
				typeof value === 'object' &&
				value !== null
			) {
				transformed = JSON.stringify(value);
			}

			result[key] = transformed;
		}

		return result;
	}

	// -- Single-value helpers -----------------------------------------------

	function dateForStorage(d: Date | undefined): number | string | Date {
		if (dates === 'epoch') return dateToEpoch(d);
		if (dates === 'iso') return dateToIso(d);
		return d ?? new Date();
	}

	function sanitizeValue(value: unknown): unknown {
		if (dates === 'native') return value;
		return sanitizeDates(value, dates);
	}

	return {
		transformOutput,
		transformOutputMany,
		transformInput,
		dateForStorage,
		sanitizeValue,
		capabilities: { dates, json, internalFields, jsonFields, dateFields },
	};
}
