import { assertModeAllows } from '../permissions';
import type { EndpointRiskLevel } from '../plugins';
import { badRequest, ManagementApiError } from './errors';

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

const MARKER = /^\$+date$/;

/**
 * The sole key of a marker-shaped object, or null.
 *
 * `{ $date }` and every `$`-prefixed variant of it, since escaping adds one.
 */
function markerKey(value: unknown): string | null {
	if (typeof value !== 'object' || value === null || Array.isArray(value)) {
		return null;
	}
	const keys = Object.keys(value);
	const key = keys[0];
	if (keys.length !== 1 || !key || !MARKER.test(key)) return null;
	return typeof (value as Record<string, unknown>)[key] === 'string'
		? key
		: null;
}

/**
 * Wraps every `Date` as `{ $date }` so it survives JSON.
 *
 * `search`'s date filters are matched on an actual Date, so a plain ISO string
 * is not a near miss — it is dropped, and the query comes back unfiltered.
 *
 * Payload data shaped like a marker gains one `$`, and decoding takes one
 * back, so no depth of `{ $$$…date }` collides with a real Date or with
 * another escaped value.
 */
export function encodeDbArgs(args: unknown): unknown {
	if (args instanceof Date) return { $date: args.toISOString() };
	if (Array.isArray(args)) return args.map(encodeDbArgs);
	const marker = markerKey(args);
	if (marker) {
		return { [`$${marker}`]: (args as Record<string, string>)[marker] };
	}
	if (args && typeof args === 'object') {
		return Object.fromEntries(
			Object.entries(args).map(([k, v]) => [k, encodeDbArgs(v)]),
		);
	}
	return args;
}

export function decodeDbArgs(args: unknown): unknown {
	const marker = markerKey(args);
	if (marker) {
		const value = (args as Record<string, string>)[marker] as string;
		if (marker !== '$date') return { [marker.slice(1)]: value };
		const date = new Date(value);
		// A malformed marker is a malformed request: left alone it reaches
		// `search` as an Invalid Date, which filters nothing and reports nothing.
		if (Number.isNaN(date.getTime())) {
			throw badRequest(
				`Invalid $date value "${value}" — expected an ISO 8601 timestamp`,
			);
		}
		return date;
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
	// Entity clients carry no permission wrapper, so the mode is checked here.
	assertModeAllows(
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
