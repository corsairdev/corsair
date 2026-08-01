import { z } from 'zod';

export const PaginationSchema = z.object({
	next_cursor: z.string().nullable().optional(),
	total_count: z.number().int().optional(),
});

export const CloudinaryResourceSchema = z.object({
	asset_id: z.string(),
	public_id: z.string(),
	resource_type: z.enum(['image', 'video', 'raw']).optional(),
	type: z.string().optional(),
	format: z.string().optional(),
	version: z.number().int().optional(),
	url: z.string().optional(),
	secure_url: z.string().optional(),
	width: z.number().optional(),
	height: z.number().optional(),
	bytes: z.number().optional(),
	created_at: z.string().optional(),
	tags: z.array(z.string()).optional(),
	context: z.record(z.string(), z.unknown()).optional(),
	metadata: z.record(z.string(), z.unknown()).optional(),
	asset_folder: z.string().optional(),
	display_name: z.string().optional(),
	status: z.string().optional(),
});

export const CloudinaryFolderSchema = z.object({
	name: z.string(),
	path: z.string().optional(),
	external_id: z.string().optional(),
});

export const CloudinaryTransformationSchema = z.object({
	name: z.string().optional(),
	transformation: z.string().optional(),
	allowed_for_strict: z.boolean().optional(),
	used: z.boolean().optional(),
});

export const CloudinaryUploadPresetSchema = z.object({
	name: z.string(),
	unsigned: z.boolean().optional(),
	settings: z.record(z.string(), z.unknown()).optional(),
});

export const CloudinaryMetadataFieldSchema = z.object({
	external_id: z.string(),
	label: z.string().optional(),
	type: z.string().optional(),
	mandatory: z.boolean().optional(),
	default_value: z.unknown().optional(),
	datasource: z
		.object({
			values: z.array(z.record(z.string(), z.unknown())).optional(),
		})
		.optional(),
});

export const CloudinaryLiveStreamSchema = z.object({
	id: z.string(),
	name: z.string().optional(),
	status: z.string().optional(),
	uri: z.string().optional(),
	stream_key: z.string().optional(),
	created_at: z.string().optional(),
});

export const CloudinaryTriggerSchema = z.object({
	id: z.string(),
	uri: z.string(),
	event_type: z.string(),
	additive: z.boolean().optional(),
	auth_scheme: z.string().optional(),
});

export const CloudinaryUploadMappingSchema = z.object({
	folder: z.string(),
	template: z.string().optional(),
});

export const CloudinaryMetadataRuleSchema = z.object({
	id: z.string(),
	name: z.string().optional(),
	condition: z.record(z.string(), z.unknown()).optional(),
	result: z.record(z.string(), z.unknown()).optional(),
});

export const CloudinaryUsageSchema = z.object({
	plan: z.string().optional(),
	last_updated: z.string().optional(),
	credits: z.record(z.string(), z.unknown()).optional(),
	storage: z.record(z.string(), z.unknown()).optional(),
	bandwidth: z.record(z.string(), z.unknown()).optional(),
	resources: z.number().optional(),
	derived_resources: z.number().optional(),
});

export const CloudinaryErrorResponseSchema = z.object({
	error: z.object({
		message: z.string(),
	}),
});
