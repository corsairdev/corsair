import { makeNutshellRequest } from '../client';
import type { NutshellOperationKey } from '../operations';
import { getNutshellOperation } from '../operations';
import type { NutshellEndpointInputs, NutshellEndpointOutputs } from './types';

/**
 * The context the shared binder hands to every endpoint. `key` is the
 * `<email>:<api-key>` value produced by the plugin's key builder.
 */
export type NutshellHandlerContext = { key: string };

export type NutshellEndpointHandler<K extends NutshellOperationKey> = (
	ctx: NutshellHandlerContext,
	input: NutshellEndpointInputs[K],
) => Promise<NutshellEndpointOutputs[K]>;

function resolvePath(
	template: string,
	pathParams: readonly string[],
	input: Record<string, unknown>,
): string {
	let path = template;
	for (const name of pathParams) {
		const value = input[name];
		if (typeof value !== 'string' || value.length === 0) {
			throw new Error(`[nutshell] missing required path parameter: ${name}`);
		}
		path = path.replace(`{${name}}`, encodeURIComponent(value));
	}
	return path;
}

function pickQuery(
	queryParams: readonly string[],
	input: Record<string, unknown>,
): Record<string, unknown> | undefined {
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
export function defineEndpoint<K extends NutshellOperationKey>(
	key: K,
): NutshellEndpointHandler<K> {
	const operation = getNutshellOperation(key);

	return async (ctx, input) => {
		// The public Corsair binder validates the operation's object input schema.
		const record = (input ?? {}) as Record<string, unknown>;
		const result = await makeNutshellRequest<unknown>(
			resolvePath(operation.path, operation.pathParams, record),
			ctx.key,
			{
				method: operation.method,
				query: pickQuery(operation.queryParams, record),
				body: operation.hasBody ? record.body : undefined,
				mediaType: operation.mediaType,
			},
		);

		// `application/schema+json` is not in the shared JSON content-type list,
		// so the transport hands it back as text even though it is JSON.
		if (operation.responseEncoding === 'json-from-text') {
			if (typeof result === 'string') {
				// The plugin's response schema validates the parsed value at the public boundary.
				return JSON.parse(result) as NutshellEndpointOutputs[K];
			}
			return result as NutshellEndpointOutputs[K];
		}

		return result as NutshellEndpointOutputs[K];
	};
}
