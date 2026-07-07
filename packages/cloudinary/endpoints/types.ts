import { z } from 'zod';
import { cloudinaryOperations } from '../operations';
import type { CloudinaryOperation } from './operation-types';
import {
	CloudinaryFolderSchema,
	CloudinaryLiveStreamSchema,
	CloudinaryMetadataFieldSchema,
	CloudinaryResourceSchema,
	CloudinaryTransformationSchema,
	CloudinaryUploadPresetSchema,
	PaginationSchema,
} from "./schemas";

const QuerySchema = z.record(z.string(), z.unknown());

export const CloudinaryEndpointInputBaseSchema = z
	.object({
		query: QuerySchema.optional(),
		body: z.unknown().optional(),
		file: z.union([z.instanceof(Blob), z.instanceof(File)]).optional(),
		resource_type: z.enum(["image", "video", "raw", "auto"]).optional(),
		upload_resource_type: z.enum(["image", "video", "raw", "auto"]).optional(),
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
		(operation.queryParams ?? []).map((param) => [param, z.unknown().optional()]),
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

const CloudinaryLiveStreamListResponseSchema = PaginationSchema.extend({
	live_streams: z.array(CloudinaryLiveStreamSchema).optional(),
}).passthrough();

const OUTPUT_SCHEMA_BY_KEY: Partial<Record<string, z.ZodTypeAny>> = {
	getResourceByAssetId: CloudinaryResourceSchema.passthrough(),
	getResourceByPublicId: CloudinaryResourceSchema.passthrough(),
	listImages: CloudinaryResourceListResponseSchema,
	listVideos: CloudinaryResourceListResponseSchema,
	listRawFiles: CloudinaryResourceListResponseSchema,
	listResourcesByType: CloudinaryResourceListResponseSchema,
	searchAssets: CloudinaryResourceListResponseSchema,
	getRootFolders: CloudinaryFolderListResponseSchema,
	showFolder: CloudinaryFolderListResponseSchema,
	getUploadPreset: CloudinaryUploadPresetSchema.passthrough(),
	listUploadPresets: CloudinaryUploadPresetListResponseSchema,
	getTransformation: CloudinaryTransformationSchema.passthrough(),
	getTransformations: CloudinaryTransformationListResponseSchema,
	listMetadataFields: CloudinaryMetadataFieldListResponseSchema,
	getMetadataFieldById: CloudinaryMetadataFieldSchema.passthrough(),
	getLiveStream: CloudinaryLiveStreamSchema.passthrough(),
	getLiveStreams: CloudinaryLiveStreamListResponseSchema,
};

export const CloudinaryEndpointOutputSchemas = Object.fromEntries(
	cloudinaryOperations.map((operation) => [
		operation.key,
		OUTPUT_SCHEMA_BY_KEY[operation.key] ?? z.unknown(),
	]),
) as Record<string, z.ZodTypeAny>;

export type CloudinaryEndpointOutputs = {
	[K in keyof typeof CloudinaryEndpointOutputSchemas]: z.infer<
		(typeof CloudinaryEndpointOutputSchemas)[K]
	>;
};
