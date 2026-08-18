import { z } from 'zod';
import type {
	BlazemeterOperationDefinition,
	BlazemeterOperationKey,
} from '../operations';
import { BLAZEMETER_OPERATIONS } from '../operations';
import {
	BlazemeterAccountEntity,
	BlazemeterAssetEntity,
	BlazemeterPackageEntity,
	BlazemeterProjectEntity,
	BlazemeterTestEntity,
	BlazemeterUserEntity,
	BlazemeterWorkspaceEntity,
	BlazemeterWorkspaceUserEntity,
} from '../schema/database';

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
 * Every `a.blazemeter.com/api/v4` route wraps its payload in this envelope.
 * Pagination fields are documented on
 * https://help.blazemeter.com/apidocs/performance/basics.htm
 *
 * Asset Repository uses `{ timestamp, request_id, result }`
 * (https://help.blazemeter.com/apidocs/test-data/create.htm). TDM and Mock
 * Services do not share that envelope.
 *
 * Output schemas are consumed by `corsair/core/inspect` for docs, form schemas,
 * and MCP tool descriptions — they are not parsed at runtime.
 */
export const BlazemeterCoreResponseSchema = z.object({
	limit: z.number().optional(),
	skip: z.number().optional(),
	total: z.number().optional(),
	hidden: z.number().optional(),
	api_version: z.number().optional(),
	error: z.unknown().nullish(),
	result: z.unknown(),
	request_id: z.string().optional(),
});

export const BlazemeterAssetResponseSchema = z
	.object({
		timestamp: z.string().optional(),
		request_id: z.string().optional(),
		result: z.unknown(),
	})
	.loose();

function coreEnvelope(result: z.ZodType) {
	return BlazemeterCoreResponseSchema.extend({ result });
}

function assetEnvelope(result: z.ZodType) {
	return BlazemeterAssetResponseSchema.extend({ result });
}

const listOrOne = <T extends z.ZodType>(schema: T) =>
	z.union([schema, z.array(schema)]);

const OUTPUT_RESULT_SCHEMAS: Partial<
	Record<BlazemeterOperationKey, z.ZodType>
> = {
	'accounts.list': coreEnvelope(z.array(BlazemeterAccountEntity)),
	'workspaces.get': coreEnvelope(BlazemeterWorkspaceEntity),
	'workspaces.list': coreEnvelope(z.array(BlazemeterWorkspaceEntity)),
	'projects.create': coreEnvelope(BlazemeterProjectEntity),
	'projects.get': coreEnvelope(BlazemeterProjectEntity),
	'projects.list': coreEnvelope(z.array(BlazemeterProjectEntity)),
	'projects.update': coreEnvelope(BlazemeterProjectEntity),
	'user.projects': coreEnvelope(z.array(BlazemeterProjectEntity)),
	'tests.create': coreEnvelope(BlazemeterTestEntity),
	'tests.get': coreEnvelope(listOrOne(BlazemeterTestEntity)),
	'tests.list': coreEnvelope(z.array(BlazemeterTestEntity)),
	'tests.update': coreEnvelope(BlazemeterTestEntity),
	'tests.duplicate': coreEnvelope(BlazemeterTestEntity),
	'user.get': coreEnvelope(BlazemeterUserEntity),
	'workspaces.users': coreEnvelope(z.array(BlazemeterWorkspaceUserEntity)),
	'assets.create': assetEnvelope(BlazemeterAssetEntity),
	'assets.get': assetEnvelope(BlazemeterAssetEntity),
	'assets.list': assetEnvelope(z.array(BlazemeterAssetEntity)),
	'assets.update': assetEnvelope(BlazemeterAssetEntity),
	'packages.create': assetEnvelope(BlazemeterPackageEntity),
	'packages.get': assetEnvelope(BlazemeterPackageEntity),
	'packages.list': assetEnvelope(z.array(BlazemeterPackageEntity)),
	'packages.update': assetEnvelope(BlazemeterPackageEntity),
};

function outputSchemaFor(definition: BlazemeterOperationDefinition): z.ZodType {
	const specific =
		OUTPUT_RESULT_SCHEMAS[definition.key as BlazemeterOperationKey];
	if (specific) return specific;
	if (definition.api === 'core') return BlazemeterCoreResponseSchema;
	if (definition.api === 'asset') return BlazemeterAssetResponseSchema;
	return z.unknown();
}

export const BlazemeterEndpointOutputSchemas = Object.fromEntries(
	BLAZEMETER_OPERATIONS.map((definition) => [
		definition.key,
		outputSchemaFor(definition),
	]),
) as unknown as Record<BlazemeterOperationKey, z.ZodType>;
