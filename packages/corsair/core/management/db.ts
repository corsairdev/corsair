import { ManagementApiError } from './errors';

/**
 * The entity-client methods reachable over HTTP.
 *
 * An allowlist rather than a property lookup: `db[entity][method]` with an
 * attacker-supplied method would otherwise reach `constructor` and every other
 * inherited property.
 */
export const DB_METHODS = new Set([
	'findByEntityId',
	'existsByEntityId',
	'findIdByEntityId',
	'findById',
	'findManyByEntityIds',
	'list',
	'search',
	'upsertByEntityId',
	'deleteById',
	'deleteByEntityId',
	'count',
]);

type DateMarker = { $date: string };

function isDateMarker(value: unknown): value is DateMarker {
	return (
		typeof value === 'object' &&
		value !== null &&
		typeof (value as DateMarker).$date === 'string' &&
		Object.keys(value).length === 1
	);
}

/**
 * Wraps every `Date` as `{ $date }` so it survives JSON.
 *
 * `search`'s date filters are gated on `instanceof Date`, so a plain ISO
 * string is not a near miss — it is dropped, and the query comes back
 * unfiltered. The marker is explicit so no string is revived by accident.
 */
export function encodeDbArgs(args: unknown): unknown {
	if (args instanceof Date) return { $date: args.toISOString() };
	if (Array.isArray(args)) return args.map(encodeDbArgs);
	if (args && typeof args === 'object') {
		return Object.fromEntries(
			Object.entries(args).map(([k, v]) => [k, encodeDbArgs(v)]),
		);
	}
	return args;
}

export function decodeDbArgs(args: unknown): unknown {
	if (isDateMarker(args)) return new Date(args.$date);
	if (Array.isArray(args)) return args.map(decodeDbArgs);
	if (args && typeof args === 'object') {
		return Object.fromEntries(
			Object.entries(args).map(([k, v]) => [k, decodeDbArgs(v)]),
		);
	}
	return args;
}

type EntityClients = Record<string, Record<string, unknown>>;

/** Resolves `<plugin>.db.<entityType>.<method>` on a tenant-scoped client. */
export async function callPluginDb(
	client: unknown,
	route: { plugin: string; entityType: string; method: string },
	args: unknown[],
): Promise<unknown> {
	if (!DB_METHODS.has(route.method)) {
		throw new ManagementApiError(
			404,
			'unknown_db_method',
			`Unknown db method "${route.method}" — expected one of ${[...DB_METHODS].join(', ')}`,
		);
	}
	const plugin = (client as Record<string, unknown> | undefined)?.[
		route.plugin
	];
	const db = (plugin as { db?: EntityClients } | undefined)?.db;
	if (!db) {
		throw new ManagementApiError(
			404,
			'unknown_plugin',
			`Plugin "${route.plugin}" has no entity store`,
		);
	}
	const entity = Object.hasOwn(db, route.entityType)
		? db[route.entityType]
		: undefined;
	const fn = entity?.[route.method];
	if (typeof fn !== 'function') {
		throw new ManagementApiError(
			404,
			'unknown_entity_type',
			`Plugin "${route.plugin}" has no entity type "${route.entityType}"`,
		);
	}
	return (fn as (...a: unknown[]) => unknown).apply(entity, args);
}
