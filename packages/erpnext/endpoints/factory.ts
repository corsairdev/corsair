import { makeErpnextRequest } from '../client';
import type { ErpnextOperationKey } from '../operations';
import { getErpnextOperation } from '../operations';
import type { ErpnextEndpointInputs, ErpnextEndpointOutputs } from './registry';

/**
 * The stored `documents` entity client the runtime binds when the
 * integration runs with a database. Handlers use it to mirror fetched
 * documents into local search.
 */
export type ErpnextDbDocumentsClient = {
	upsertByEntityId: (entityId: string, data: unknown) => Promise<unknown>;
	deleteByEntityId: (entityId: string) => Promise<unknown>;
};

/**
 * The context the shared binder hands to every endpoint. `key` is the
 * `<api_key>:<api_secret>` composite produced by the plugin's key builder,
 * and `options.baseUrl` is the plugin-instance site origin fallback.
 * `keys` (present with multi-tenancy) and `db` (present with a database)
 * come from the bound runtime context.
 */
export type ErpnextHandlerContext = {
	key: string;
	options: { baseUrl?: string };
	keys?: { get_base_url?: () => Promise<string | null> };
	db?: { documents?: ErpnextDbDocumentsClient };
};

export type ErpnextEndpointHandler<K extends ErpnextOperationKey> = (
	ctx: ErpnextHandlerContext,
	input: ErpnextEndpointInputs[K],
) => Promise<ErpnextEndpointOutputs[K]>;

/**
 * Resolves the site origin for the *calling tenant*. The tenant-stored
 * `base_url` account field wins over the plugin option: stored credentials
 * and their host come from the same tenant account, so with multi-tenancy
 * tenant B's token can never reach tenant A's site. Without an account key
 * manager (API-only usage), the plugin option applies.
 */
export async function resolveErpnextBaseUrl(
	ctx: ErpnextHandlerContext,
): Promise<string> {
	try {
		const stored = await ctx.keys?.get_base_url?.();
		if (stored) return stored;
	} catch {
		// No account key manager bound (no database): fall through to the
		// plugin option below.
	}
	const option = ctx.options?.baseUrl;
	if (!option) {
		throw new Error(
			'[erpnext] missing baseUrl: set the plugin option or the tenant base_url, for example https://yourcompany.frappe.cloud',
		);
	}
	return option;
}

function encodeSegment(name: string, value: string): string {
	if (value.length === 0 || value === '.' || value === '..') {
		throw new Error(`[erpnext] missing required path parameter: ${name}`);
	}
	return encodeURIComponent(value);
}

function resolvePath(
	template: string,
	pathParams: readonly string[],
	// Record<string, unknown>: the schema-parsed input object is read by
	// dynamic path-parameter name, so values are looked up generically.
	input: Record<string, unknown>,
): string {
	let path = template;
	for (const name of pathParams) {
		const value = input[name];
		// unknown: path values arrive from the schema-parsed input and are
		// only known to be identifiers; the guard narrows to a non-empty
		// string before encoding.
		if (typeof value !== 'string') {
			throw new Error(`[erpnext] missing required path parameter: ${name}`);
		}
		path = path.replace(`{${name}}`, encodeSegment(name, value));
	}
	return path;
}

function pickQuery(
	queryParams: readonly string[],
	// Record<string, unknown>: the schema-parsed input object is read by
	// dynamic query-parameter name, so values are looked up generically.
	input: Record<string, unknown>,
	// Record<string, unknown>: query values are provider-defined filter, field
	// list, and pagination inputs forwarded as-is after input-schema validation.
): Record<string, unknown> | undefined {
	// Record<string, unknown>: accumulated provider-defined query values.
	const query: Record<string, unknown> = {};
	for (const name of queryParams) {
		const value = input[name];
		// Frappe reads query booleans as strings: with Python truthiness
		// (load.py getdoctype `if with_parent`) a "false" string is truthy,
		// and with cint() (printview.py no_letterhead) both "true" and
		// "false" convert to 0. A true is therefore sent as the cint-
		// compatible "1"; a false is omitted so the provider default (false
		// on every catalog boolean) applies. All other validated values go
		// on the wire verbatim.
		if (value === undefined || value === false) {
			continue;
		}
		query[name] = value === true ? '1' : value;
	}
	return Object.keys(query).length > 0 ? query : undefined;
}

/**
 * Builds a typed endpoint from the single operation catalog. Path, query and
 * body handling live here so every family file stays a one-line declaration,
 * and the catalog is the only place a route can be added or changed.
 */
export function defineEndpoint<K extends ErpnextOperationKey>(
	key: K,
): ErpnextEndpointHandler<K> {
	const operation = getErpnextOperation(key);

	return async (ctx, input) => {
		// The public Corsair binder validates the operation's object input schema.
		const record = (input ?? {}) as Record<string, unknown>; // Record<string, unknown>: the schema-parsed input is read by dynamic parameter names.
		// Every ERPNext deployment is its own host; the site origin resolves
		// per calling tenant and missing it is a configuration error.
		const baseUrl = await resolveErpnextBaseUrl(ctx);
		// unknown: the raw transport result before the wrapper's output-schema
		// parse; narrowing belongs to the public boundary, not the transport.
		const result = await makeErpnextRequest<unknown>(
			resolvePath(operation.path, operation.pathParams, record),
			baseUrl,
			ctx.key,
			{
				method: operation.method,
				query: pickQuery(operation.queryParams, record),
				body: operation.hasBody ? record.body : undefined,
			},
		);
		// Safe: the schema-bound wrapper in index.ts re-parses this value
		// with the operation's output schema before it reaches callers, so
		// the cast only carries the value to that boundary.
		return result as ErpnextEndpointOutputs[K];
	};
}
