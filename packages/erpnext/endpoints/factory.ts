import { makeErpnextRequest } from '../client';
import type { ErpnextOperationKey } from '../operations';
import { getErpnextOperation } from '../operations';
import type { ErpnextEndpointInputs, ErpnextEndpointOutputs } from './registry';

/**
 * The context the shared binder hands to every endpoint. `key` is the
 * `<api_key>:<api_secret>` composite produced by the plugin's key builder,
 * and `options.baseUrl` is the tenant's site origin, passed through the
 * plugin options into the bound context.
 */
export type ErpnextHandlerContext = {
	key: string;
	options: { baseUrl?: string };
};

export type ErpnextEndpointHandler<K extends ErpnextOperationKey> = (
	ctx: ErpnextHandlerContext,
	input: ErpnextEndpointInputs[K],
) => Promise<ErpnextEndpointOutputs[K]>;

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
		if (value !== undefined) query[name] = value;
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
		// Every ERPNext deployment is its own host; the site origin is a
		// required plugin option and missing it is a configuration error.
		const baseUrl = ctx.options?.baseUrl;
		if (!baseUrl) {
			throw new Error(
				'[erpnext] missing baseUrl plugin option: set it to the site origin, for example https://yourcompany.frappe.cloud',
			);
		}
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
		return result as ErpnextEndpointOutputs[K];
	};
}
