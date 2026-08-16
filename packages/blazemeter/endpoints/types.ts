import { z } from 'zod';
import type {
	BlazemeterOperationDefinition,
	BlazemeterOperationKey,
} from '../operations';
import { BLAZEMETER_OPERATIONS } from '../operations';

const ParamSchemaByType = {
	string: z.string(),
	integer: z.number().int(),
	number: z.number(),
	boolean: z.boolean(),
	object: z.record(z.string(), z.unknown()),
	array: z.array(z.unknown()),
	unknown: z.unknown(),
} as const;

function schemaForParam(token: string): [string, z.ZodType] {
	const [rawName, rawType] = token.split(':');
	if (!rawName || !rawType)
		throw new Error(`Invalid BlazeMeter parameter token: ${token}`);
	const optional = rawName.endsWith('?');
	const name = optional ? rawName.slice(0, -1) : rawName;
	const schema = ParamSchemaByType[rawType as keyof typeof ParamSchemaByType];
	if (!schema) throw new Error(`Unknown BlazeMeter parameter type: ${rawType}`);
	return [name, optional ? schema.optional() : schema];
}

export function inputSchemaFor(definition: BlazemeterOperationDefinition) {
	const shape = Object.fromEntries(definition.params.map(schemaForParam));
	return z
		.object({
			...shape,
			body: z.record(z.string(), z.unknown()).optional(),
			query: z.record(z.string(), z.unknown()).optional(),
		})
		.strict();
}

export const BlazemeterEndpointInputSchemas = Object.fromEntries(
	BLAZEMETER_OPERATIONS.map((definition) => [
		definition.key,
		inputSchemaFor(definition),
	]),
) as unknown as Record<BlazemeterOperationKey, z.ZodType>;

/**
 * Every `a.blazemeter.com/api/v4` route wraps its payload in this envelope, so
 * the response contract for the `core` API is known even where the shape of
 * `result` is not. The other three BlazeMeter APIs (asset, tdm, mock) do not
 * share a documented envelope and stay `unknown` until their responses are
 * captured against the live API.
 *
 * Output schemas are consumed by `corsair/core/inspect` for docs, form schemas,
 * and MCP tool descriptions — they are not parsed at runtime.
 */
export const BlazemeterCoreResponseSchema = z.object({
	api_version: z.number().optional(),
	error: z.unknown().nullish(),
	result: z.unknown(),
	request_id: z.string().optional(),
});

export const BlazemeterEndpointOutputSchemas = Object.fromEntries(
	BLAZEMETER_OPERATIONS.map((definition) => [
		definition.key,
		definition.api === 'core' ? BlazemeterCoreResponseSchema : z.unknown(),
	]),
) as unknown as Record<BlazemeterOperationKey, z.ZodType>;
