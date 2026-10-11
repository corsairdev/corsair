import { assertReadonlyAllowed } from '../permissions';
import type { EndpointRiskLevel } from '../plugins';
import { ManagementApiError } from './errors';

/**
 * The entity-client methods reachable over HTTP, each with the risk level the
 * readonly guard judges it by.
 *
 * An allowlist rather than a property lookup: `db[entity][method]` with an
 * attacker-supplied method would otherwise reach `constructor` and every other
 * inherited property.
 */
export const DB_METHOD_RISK: Record<string, EndpointRiskLevel> = {
	findByEntityId: 'read',
	existsByEntityId: 'read',
	findIdByEntityId: 'read',
	findById: 'read',
	findManyByEntityIds: 'read',
	list: 'read',
	search: 'read',
	count: 'read',
	upsertByEntityId: 'write',
	deleteById: 'destructive',
	deleteByEntityId: 'destructive',
};

type DateMarker = { $date: string };
type EscapedMarker = { $$date: string };

function soleKey(value: unknown, key: string): boolean {
	return (
		typeof value === 'object' &&
		value !== null &&
		!Array.isArray(value) &&
		Object.keys(value).length === 1 &&
		typeof (value as Record<string, unknown>)[key] === 'string'
	);
}

/**
 * Wraps every `Date` as `{ $date }` so it survives JSON.
 *
 * `search`'s date filters are matched on an actual Date, so a plain ISO string
 * is not a near miss — it is dropped, and the query comes back unfiltered. A
 * payload that already looks like a marker is escaped to `{ $$date }`, so
 * stored data shaped like one is never read back as a Date.
 */
export function encodeDbArgs(args: unknown): unknown {
	if (args instanceof Date) return { $date: args.toISOString() };
	if (Array.isArray(args)) return args.map(encodeDbArgs);
	if (soleKey(args, '$date')) {
		return { $$date: (args as DateMarker).$date };
	}
	if (soleKey(args, '$$date')) {
		return { $$$date: (args as EscapedMarker).$$date };
	}
	if (args && typeof args === 'object') {
		return Object.fromEntries(
			Object.entries(args).map(([k, v]) => [k, encodeDbArgs(v)]),
		);
	}
	return args;
}

export function decodeDbArgs(args: unknown): unknown {
	if (soleKey(args, '$date')) return new Date((args as DateMarker).$date);
	if (soleKey(args, '$$date')) {
		return { $date: (args as EscapedMarker).$$date };
	}
	if (soleKey(args, '$$$date')) {
		return { $$date: (args as Record<string, string>).$$$date! };
	}
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
	const risk = Object.hasOwn(DB_METHOD_RISK, route.method)
		? DB_METHOD_RISK[route.method]
		: undefined;
	if (!risk) {
		throw new ManagementApiError(
			404,
			'unknown_db_method',
			`Unknown db method "${route.method}" — expected one of ${Object.keys(DB_METHOD_RISK).join(', ')}`,
		);
	}
	// The same guard the endpoint binding layer applies, so a runReadonly()
	// scope binds the entity store too. Entity clients carry no permission
	// wrapper of their own.
	assertReadonlyAllowed(
		`${route.plugin}.db.${route.entityType}.${route.method}`,
		risk,
	);
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
