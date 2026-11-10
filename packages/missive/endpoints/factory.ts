import { makeMissiveRequest } from '../client';
import type { MissiveOperationKey } from '../operations';
import { getMissiveOperation } from '../operations';
import type { MissiveEndpointInputs, MissiveEndpointOutputs } from './types';
import { MissiveEndpointOutputSchemas } from './types';

/**
 * The context the shared binder hands to every endpoint. `key` is the
 * Missive personal API token produced by the plugin's key builder.
 */
export type MissiveHandlerContext = { key: string };

export type MissiveEndpointHandler<K extends MissiveOperationKey> = (
	ctx: MissiveHandlerContext,
	input: MissiveEndpointInputs[K],
) => Promise<MissiveEndpointOutputs[K]>;

function encodeSegment(
	name: string,
	// unknown: path values arrive from the schema-parsed input and are only
	// known to be identifiers; the guard below narrows to a non-empty string.
	value: unknown,
): string {
	if (typeof value !== 'string' || value.length === 0) {
		throw new Error(`[missive] missing required path parameter: ${name}`);
	}
	return encodeURIComponent(value);
}

function resolvePath(
	template: string,
	pathParams: readonly string[],
	joinIds: boolean,
	input: Record<string, unknown>,
	// Record<string, unknown>: the schema-parsed input object is read by
	// dynamic path-parameter name, so values are looked up generically.
): string {
	let path = template;
	for (const name of pathParams) {
		const value = input[name];
		if (joinIds) {
			// Batch routes take comma-separated ids in one segment; each id is
			// encoded on its own and the separator stays a literal comma.
			if (!Array.isArray(value) || value.length === 0) {
				throw new Error(`[missive] missing required path parameter: ${name}`);
			}
			path = path.replace(
				`{${name}}`,
				value.map((id) => encodeSegment(name, id)).join(','),
			);
			continue;
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
	// Record<string, unknown>: query values are provider-defined filter, search,
	// and pagination inputs forwarded as-is after input-schema validation.
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
export function defineEndpoint<K extends MissiveOperationKey>(
	key: K,
): MissiveEndpointHandler<K> {
	const operation = getMissiveOperation(key);
	// Every operation must have a corresponding output schema; this is a
	// compile-time guarantee via MissiveEndpointOutputSchemas registry.
	const outputSchema = MissiveEndpointOutputSchemas[key];

	return async (ctx, input) => {
		// The public Corsair binder validates the operation's object input schema.
		const record = (input ?? {}) as Record<string, unknown>; // Record<string, unknown>: the schema-parsed input is read by dynamic parameter names.
		const rawBody = operation.hasBody ? record.body : undefined;
		// The provider wraps write payloads in the resource's plural key.
		const body =
			rawBody !== undefined && operation.bodyWrapper
				? { [operation.bodyWrapper]: rawBody }
				: rawBody;
		// unknown: the raw transport result before the wrapper's output-schema
		// parse; narrowing belongs to the public boundary, not the transport.
		const result = await makeMissiveRequest<unknown>(
			resolvePath(
				operation.path,
				operation.pathParams,
				operation.joinIds === true,
				record,
			),
			ctx.key,
			{
				method: operation.method,
				query: pickQuery(operation.queryParams, record),
				body,
			},
		);
		// Routes documented without a response body (the deletes) ignore
		// whatever came back. A 200 with an empty or `{}` body is still a
		// successful delete, and failing the parse would report an error for a
		// change Missive already applied.
		// `as MissiveEndpointOutputs[K]`: these operations' output is undefined.
		if (!operation.hasResponseBody) {
			return undefined as MissiveEndpointOutputs[K];
		}
		// The shared client returns '' for an empty non-JSON body. Treat it as
		// no body, so a create that answers 201 with nothing parses instead of
		// throwing after the draft was created or sent.
		const payload = result === '' || result === null ? undefined : result;
		// Parse the transport result through the operation's output schema so
		// malformed provider responses are rejected at the boundary instead of
		// being cast through to callers.
		// `as MissiveEndpointOutputs[K]`: parse() already validated the shape;
		// this cast only narrows the TypeScript type for callers.
		return outputSchema.parse(payload) as MissiveEndpointOutputs[K];
	};
}
