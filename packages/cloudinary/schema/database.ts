import type { z } from 'zod';
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
} from '../endpoints/schemas';

export const CloudinaryResource = CloudinaryResourceSchema;
export type CloudinaryResource = z.infer<typeof CloudinaryResource>;

export const CloudinaryFolder = CloudinaryFolderSchema;
export type CloudinaryFolder = z.infer<typeof CloudinaryFolder>;

export const CloudinaryTransformation = CloudinaryTransformationSchema;
export type CloudinaryTransformation = z.infer<typeof CloudinaryTransformation>;

export const CloudinaryUploadPreset = CloudinaryUploadPresetSchema;
export type CloudinaryUploadPreset = z.infer<typeof CloudinaryUploadPreset>;

export const CloudinaryMetadataField = CloudinaryMetadataFieldSchema;
export type CloudinaryMetadataField = z.infer<typeof CloudinaryMetadataField>;

export const CloudinaryMetadataRule = CloudinaryMetadataRuleSchema;
export type CloudinaryMetadataRule = z.infer<typeof CloudinaryMetadataRule>;

export const CloudinaryUploadMapping = CloudinaryUploadMappingSchema;
export type CloudinaryUploadMapping = z.infer<typeof CloudinaryUploadMapping>;

export const CloudinaryTrigger = CloudinaryTriggerSchema;
export type CloudinaryTrigger = z.infer<typeof CloudinaryTrigger>;

export const CloudinaryLiveStream = CloudinaryLiveStreamSchema;
export type CloudinaryLiveStream = z.infer<typeof CloudinaryLiveStream>;

export const CloudinaryUsage = CloudinaryUsageSchema;
export type CloudinaryUsage = z.infer<typeof CloudinaryUsage>;
