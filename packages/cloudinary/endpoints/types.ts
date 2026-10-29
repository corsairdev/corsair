import { z } from 'zod';
import { cloudinaryOperations } from '../operations';
import type { CloudinaryOperation } from './operation-types';
import {
	CloudinaryFolderSchema,
	CloudinaryLiveStreamSchema,
	CloudinaryMetadataFieldSchema,
	CloudinaryMetadataRuleSchema,
	CloudinaryResourceSchema,
	CloudinaryTransformationSchema,
	CloudinaryTriggerSchema,
	CloudinaryUploadMappingSchema,
	CloudinaryUploadPresetSchema,
	CloudinaryUsageSchema,
	PaginationSchema,
} from './schemas';

const QuerySchema = z.record(z.string(), z.unknown());

export const CloudinaryEndpointInputBaseSchema = z
	.object({
		query: QuerySchema.optional(),
		body: z.unknown().optional(),
		file: z.instanceof(Blob).optional(),
		resource_type: z.enum(['image', 'video', 'raw', 'auto']).optional(),
		upload_resource_type: z.enum(['image', 'video', 'raw', 'auto']).optional(),
	})
	.catchall(z.unknown());

export type CloudinaryEndpointInput = z.infer<
	typeof CloudinaryEndpointInputBaseSchema
>;

function inputSchemaForOperation(operation: CloudinaryOperation) {
	const pathParams = Object.fromEntries(
		(operation.pathParams ?? []).map((param) => [param, z.string().min(1)]),
	);
	const queryParams = Object.fromEntries(
		(operation.queryParams ?? []).map((param) => [
			param,
			z.unknown().optional(),
		]),
	);
	return CloudinaryEndpointInputBaseSchema.extend({
		...pathParams,
		...queryParams,
	});
}

export const CloudinaryEndpointInputSchemas = Object.fromEntries(
	cloudinaryOperations.map((operation) => [
		operation.key,
		inputSchemaForOperation(operation),
	]),
) as Record<string, z.ZodTypeAny>;

export type CloudinaryEndpointInputs = {
	[K in keyof typeof CloudinaryEndpointInputSchemas]: z.infer<
		(typeof CloudinaryEndpointInputSchemas)[K]
	>;
};

const CloudinaryGenericResponseSchema = z.record(z.string(), z.unknown());

const CloudinaryResourceListResponseSchema = PaginationSchema.extend({
	resources: z.array(CloudinaryResourceSchema).optional(),
}).passthrough();

const CloudinaryFolderListResponseSchema = PaginationSchema.extend({
	folders: z.array(CloudinaryFolderSchema).optional(),
}).passthrough();

const CloudinaryUploadPresetListResponseSchema = PaginationSchema.extend({
	presets: z.array(CloudinaryUploadPresetSchema).optional(),
}).passthrough();

const CloudinaryTransformationListResponseSchema = PaginationSchema.extend({
	transformations: z.array(CloudinaryTransformationSchema).optional(),
}).passthrough();

const CloudinaryMetadataFieldListResponseSchema = z
	.object({
		metadata_fields: z.array(CloudinaryMetadataFieldSchema).optional(),
	})
	.passthrough();

const CloudinaryMetadataRuleListResponseSchema = z
	.object({
		rules: z.array(CloudinaryMetadataRuleSchema).optional(),
	})
	.passthrough();

const CloudinaryLiveStreamListResponseSchema = PaginationSchema.extend({
	live_streams: z.array(CloudinaryLiveStreamSchema).optional(),
}).passthrough();

const CloudinaryTriggerListResponseSchema = PaginationSchema.extend({
	triggers: z.array(CloudinaryTriggerSchema).optional(),
}).passthrough();

const CloudinaryUploadMappingListResponseSchema = PaginationSchema.extend({
	mappings: z.array(CloudinaryUploadMappingSchema).optional(),
}).passthrough();

const CloudinaryTagListResponseSchema = z
	.object({
		tags: z
			.array(z.union([z.string(), z.object({ tag: z.string() }).passthrough()]))
			.optional(),
	})
	.passthrough();

const CloudinaryResultResponseSchema = z
	.object({
		result: z.string().optional(),
	})
	.passthrough();

const RESOURCE_LIST_KEYS = new Set([
	'listImages',
	'listVideos',
	'listRawFiles',
	'listResourcesByType',
	'searchAssets',
	'searchVisualAssets',
	'getResourcesByContext',
	'getResourcesInModeration',
	'listResourcesByAssetIds',
	'listResourcesByExternalIds',
	'listResourcesByTag',
	'getResourcesByAssetFolder',
]);

const RESOURCE_WRITE_KEYS = new Set([
	'uploadAsset',
	'uploadFileAutoDetect',
	'uploadChunk',
	'updateResourceByAssetId',
	'updateResourceByPublicId',
	'renameResource',
	'explicitResource',
	'restoreResources',
	'restoreResourcesByAssetIds',
	'manageContext',
	'updateAssetMetadata',
	'publishResources',
	'createImageFromText',
	'createMultiResource',
	'createSlideshow',
	'explodeResource',
]);

const FOLDER_KEYS = new Set([
	'getRootFolders',
	'showFolder',
	'searchFolders',
	'searchFoldersV2',
	'createFolder',
	'updateFolder',
]);

function outputSchemaForOperation(
	operation: CloudinaryOperation,
): z.ZodTypeAny {
	const { key } = operation;

	if (key === 'listResourceTypes') {
		return z.object({ resource_types: z.array(z.string()) });
	}

	if (key === 'pingCloudinaryServers') {
		return z.object({ status: z.string() }).passthrough();
	}

	if (key === 'getUsage') {
		return CloudinaryUsageSchema.passthrough();
	}

	if (
		key === 'getConfig' ||
		key === 'getVideoViews' ||
		key === 'getAnalysisTaskStatus'
	) {
		return CloudinaryGenericResponseSchema;
	}

	if (key === 'getTags') {
		return CloudinaryTagListResponseSchema;
	}

	if (key.startsWith('destroy') || key.startsWith('delete')) {
		return CloudinaryResultResponseSchema;
	}

	if (RESOURCE_LIST_KEYS.has(key)) {
		return CloudinaryResourceListResponseSchema;
	}

	if (key.startsWith('getResource')) {
		return CloudinaryResourceSchema.passthrough();
	}

	if (FOLDER_KEYS.has(key)) {
		return key === 'createFolder' || key === 'updateFolder'
			? CloudinaryFolderSchema.passthrough()
			: CloudinaryFolderListResponseSchema;
	}

	if (key.includes('UploadPreset')) {
		return key.startsWith('list')
			? CloudinaryUploadPresetListResponseSchema
			: CloudinaryUploadPresetSchema.passthrough();
	}

	if (key.includes('Transformation')) {
		return key === 'getTransformations'
			? CloudinaryTransformationListResponseSchema
			: CloudinaryTransformationSchema.passthrough();
	}

	if (key.includes('MetadataField') || key.includes('Datasource')) {
		if (key === 'listMetadataFields') {
			return CloudinaryMetadataFieldListResponseSchema;
		}
		if (key.startsWith('list') || key.startsWith('search')) {
			return CloudinaryGenericResponseSchema;
		}
		return CloudinaryMetadataFieldSchema.passthrough();
	}

	if (key.includes('MetadataRule')) {
		return key === 'listMetadataRules'
			? CloudinaryMetadataRuleListResponseSchema
			: CloudinaryMetadataRuleSchema.passthrough();
	}

	if (key.includes('UploadMapping')) {
		return key === 'getUploadMappings'
			? CloudinaryUploadMappingListResponseSchema
			: CloudinaryUploadMappingSchema.passthrough();
	}

	if (key.includes('Trigger')) {
		return key === 'getTriggers'
			? CloudinaryTriggerListResponseSchema
			: CloudinaryTriggerSchema.passthrough();
	}

	if (key.includes('LiveStream')) {
		if (key === 'getLiveStreams' || key === 'getLiveStreamOutputs') {
			return z.union([
				CloudinaryLiveStreamListResponseSchema,
				z.array(CloudinaryLiveStreamSchema),
			]);
		}
		return CloudinaryLiveStreamSchema.passthrough();
	}

	if (key.includes('StreamingProfile')) {
		return CloudinaryGenericResponseSchema;
	}

	if (RESOURCE_WRITE_KEYS.has(key)) {
		return CloudinaryResourceSchema.passthrough();
	}

	if (key.startsWith('generate')) {
		return CloudinaryGenericResponseSchema;
	}

	return CloudinaryGenericResponseSchema;
}

export const CloudinaryEndpointOutputSchemas = Object.fromEntries(
	cloudinaryOperations.map((operation) => [
		operation.key,
		outputSchemaForOperation(operation),
	]),
) as Record<string, z.ZodTypeAny>;

export type CloudinaryEndpointOutputs = {
	[K in keyof typeof CloudinaryEndpointOutputSchemas]: z.infer<
		(typeof CloudinaryEndpointOutputSchemas)[K]
	>;
};
