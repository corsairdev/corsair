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
import {
	BlazemeterAssetDataResult,
	BlazemeterCardIssuerResult,
	BlazemeterConvertedTransactionResult,
	BlazemeterDataModelResult,
	BlazemeterDataModelValidationResult,
	BlazemeterDependencyResult,
	BlazemeterExportResult,
	BlazemeterGeneratedRow,
	BlazemeterGeneratorFunctionResult,
	BlazemeterHealthResult,
	BlazemeterInviteResult,
	BlazemeterMasterResult,
	BlazemeterMasterSummaryResult,
	BlazemeterMultiTestResult,
	BlazemeterPrivateLocationAgentResult,
	BlazemeterPrivateLocationResult,
	BlazemeterPublishResult,
	BlazemeterRegionResult,
	BlazemeterScheduleResult,
	BlazemeterSearchHitResult,
	BlazemeterSearchMetadataResult,
	BlazemeterSeedListResult,
	BlazemeterServiceMockTemplateResult,
	BlazemeterSessionResult,
	BlazemeterSharedFolderResult,
	BlazemeterTagResult,
	BlazemeterTestFileResult,
	BlazemeterTestValidateResult,
	BlazemeterTransactionResult,
	BlazemeterValidationResult,
	BlazemeterVersionResult,
} from '../schema/responses';

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
 * TDM uses the same envelope
 * (https://help.blazemeter.com/apidocs/test-data/introduction_basics.htm).
 * Asset Repository uses `{ timestamp, request_id, result }`
 * (https://help.blazemeter.com/apidocs/test-data/create.htm).
 * Mock Services uses camelCase `{ apiVersion, requestId, result }`
 * (https://help.blazemeter.com/apidocs/service-virtualization/template_update_properties.htm).
 *
 * Output schemas are consumed by `corsair/core/inspect` for docs, form schemas,
 * and MCP tool descriptions — they are not parsed at runtime.
 */
export const BlazemeterCoreResponseSchema = z
	.object({
		limit: z.number().optional(),
		skip: z.number().optional(),
		total: z.number().optional(),
		hidden: z.number().optional(),
		api_version: z.number().optional(),
		error: z.unknown().nullish(),
		result: z.unknown(),
		request_id: z.string().optional(),
	})
	.loose();

export const BlazemeterAssetResponseSchema = z
	.object({
		timestamp: z.string().optional(),
		request_id: z.string().optional(),
		result: z.unknown(),
	})
	.loose();

export const BlazemeterMockResponseSchema = z
	.object({
		apiVersion: z.number().optional(),
		error: z.unknown().nullish(),
		limit: z.number().optional(),
		link: z.string().optional(),
		requestId: z.string().optional(),
		result: z.unknown(),
		skip: z.number().optional(),
		total: z.number().optional(),
	})
	.loose();

function coreEnvelope(result: z.ZodType) {
	return BlazemeterCoreResponseSchema.extend({ result });
}

function assetEnvelope(result: z.ZodType) {
	return BlazemeterAssetResponseSchema.extend({ result });
}

function mockEnvelope(result: z.ZodType) {
	return BlazemeterMockResponseSchema.extend({ result });
}

const listOrOne = <T extends z.ZodType>(schema: T) =>
	z.union([schema, z.array(schema)]);

const Flag = z.boolean();

export const BlazemeterEndpointOutputSchemas: Record<
	BlazemeterOperationKey,
	z.ZodType
> = {
	'transactions.convert': mockEnvelope(
		z.array(BlazemeterConvertedTransactionResult),
	),
	'schedules.create': coreEnvelope(BlazemeterScheduleResult),
	'assetDependencies.create': assetEnvelope(BlazemeterDependencyResult),
	'multiTests.create': coreEnvelope(BlazemeterMultiTestResult),
	'privateLocations.create': coreEnvelope(BlazemeterPrivateLocationResult),
	'privateLocations.createAgent': coreEnvelope(
		BlazemeterPrivateLocationAgentResult,
	),
	'projects.create': coreEnvelope(BlazemeterProjectEntity),
	'search.execute': coreEnvelope(z.array(BlazemeterSearchHitResult)),
	'tags.create': coreEnvelope(BlazemeterTagResult),
	'tests.create': coreEnvelope(BlazemeterTestEntity),
	'assets.create': assetEnvelope(BlazemeterAssetEntity),
	'packages.create': assetEnvelope(BlazemeterPackageEntity),
	'transactions.create': mockEnvelope(listOrOne(BlazemeterTransactionResult)),
	'schedules.remove': coreEnvelope(Flag),
	'privateLocations.removeWorkspace': coreEnvelope(Flag),
	'projects.remove': coreEnvelope(Flag),
	'tests.removeFile': coreEnvelope(Flag),
	'tests.remove': coreEnvelope(Flag),
	'assets.remove': assetEnvelope(Flag),
	'assetDependencies.remove': assetEnvelope(Flag),
	'assetDependencies.removeMatching': assetEnvelope(Flag),
	'workspaces.removeLogs': coreEnvelope(Flag),
	'workspaces.removeManagers': coreEnvelope(Flag),
	'packages.remove': assetEnvelope(Flag),
	'tests.duplicate': coreEnvelope(BlazemeterTestEntity),
	'packages.export': assetEnvelope(BlazemeterExportResult),
	'packages.exportMany': assetEnvelope(BlazemeterExportResult),
	'testData.generateFromModel': coreEnvelope(z.array(BlazemeterGeneratedRow)),
	'testData.generate': coreEnvelope(z.array(BlazemeterGeneratedRow)),
	'schedules.get': coreEnvelope(BlazemeterScheduleResult),
	'schedules.list': coreEnvelope(z.array(BlazemeterScheduleResult)),
	'accounts.list': coreEnvelope(z.array(BlazemeterAccountEntity)),
	'assetDependencies.forAsset': assetEnvelope(
		z.array(BlazemeterDependencyResult),
	),
	'generator.functions': coreEnvelope(
		z.array(BlazemeterGeneratorFunctionResult),
	),
	'generator.seedLists': coreEnvelope(z.array(BlazemeterSeedListResult)),
	'info.health': assetEnvelope(BlazemeterHealthResult),
	'info.version': assetEnvelope(BlazemeterVersionResult),
	'masters.summary': coreEnvelope(BlazemeterMasterSummaryResult),
	'multiTests.get': coreEnvelope(BlazemeterMultiTestResult),
	'multiTests.list': coreEnvelope(z.array(BlazemeterMultiTestResult)),
	'privateLocations.list': coreEnvelope(
		z.array(BlazemeterPrivateLocationResult),
	),
	'projects.get': coreEnvelope(BlazemeterProjectEntity),
	'projects.list': coreEnvelope(z.array(BlazemeterProjectEntity)),
	'regions.list': coreEnvelope(z.array(BlazemeterRegionResult)),
	'search.metadata': coreEnvelope(BlazemeterSearchMetadataResult),
	'sharedFolders.list': coreEnvelope(z.array(BlazemeterSharedFolderResult)),
	'tags.list': mockEnvelope(z.array(BlazemeterTagResult)),
	'tests.get': coreEnvelope(listOrOne(BlazemeterTestEntity)),
	'tests.validations': coreEnvelope(z.array(BlazemeterValidationResult)),
	'tests.list': coreEnvelope(z.array(BlazemeterTestEntity)),
	'tests.files': coreEnvelope(z.array(BlazemeterTestFileResult)),
	'user.get': coreEnvelope(BlazemeterUserEntity),
	'user.activeSessions': coreEnvelope(z.array(BlazemeterSessionResult)),
	'user.invites': coreEnvelope(z.array(BlazemeterInviteResult)),
	'user.projects': coreEnvelope(z.array(BlazemeterProjectEntity)),
	'serviceMockTemplates.get': mockEnvelope(BlazemeterServiceMockTemplateResult),
	'assets.get': assetEnvelope(BlazemeterAssetEntity),
	'assets.data': assetEnvelope(BlazemeterAssetDataResult),
	'assetDependencies.get': assetEnvelope(BlazemeterDependencyResult),
	'assets.list': assetEnvelope(z.array(BlazemeterAssetEntity)),
	'assetDependencies.list': assetEnvelope(z.array(BlazemeterDependencyResult)),
	'testData.getModel': coreEnvelope(BlazemeterDataModelResult),
	'workspaces.get': coreEnvelope(BlazemeterWorkspaceEntity),
	'packages.get': assetEnvelope(BlazemeterPackageEntity),
	'packages.dependencies': assetEnvelope(z.array(BlazemeterDependencyResult)),
	'packages.list': assetEnvelope(z.array(BlazemeterPackageEntity)),
	'serviceMockTemplates.list': mockEnvelope(
		z.array(BlazemeterServiceMockTemplateResult),
	),
	'transactions.list': mockEnvelope(z.array(BlazemeterTransactionResult)),
	'workspaces.users': coreEnvelope(z.array(BlazemeterWorkspaceUserEntity)),
	'workspaces.list': coreEnvelope(z.array(BlazemeterWorkspaceEntity)),
	'packages.import': assetEnvelope(BlazemeterPackageEntity),
	'generator.cardIssuers': coreEnvelope(z.array(BlazemeterCardIssuerResult)),
	'testData.publish': coreEnvelope(BlazemeterPublishResult),
	'user.register': coreEnvelope(BlazemeterUserEntity),
	'tests.start': coreEnvelope(BlazemeterMasterResult),
	'masters.stop': coreEnvelope(Flag),
	'tests.stop': coreEnvelope(Flag),
	'user.terminateSessions': coreEnvelope(Flag),
	'workspaces.terminateMasters': coreEnvelope(z.array(z.number())),
	'schedules.update': coreEnvelope(BlazemeterScheduleResult),
	'projects.update': coreEnvelope(BlazemeterProjectEntity),
	'tests.update': coreEnvelope(BlazemeterTestEntity),
	'assets.update': assetEnvelope(BlazemeterAssetEntity),
	'packages.update': assetEnvelope(BlazemeterPackageEntity),
	'packages.updateDependencies': assetEnvelope(
		z.array(BlazemeterDependencyResult),
	),
	'serviceMockTemplates.update': mockEnvelope(
		BlazemeterServiceMockTemplateResult,
	),
	'workspaces.updateUser': coreEnvelope(BlazemeterWorkspaceUserEntity),
	'assetDependencies.updateForAsset': assetEnvelope(
		z.array(BlazemeterDependencyResult),
	),
	'tests.uploadFile': coreEnvelope(listOrOne(BlazemeterTestFileResult)),
	'assets.uploadData': assetEnvelope(BlazemeterAssetEntity),
	'tests.validate': coreEnvelope(BlazemeterTestValidateResult),
	'testData.validateModel': coreEnvelope(BlazemeterDataModelValidationResult),
};
