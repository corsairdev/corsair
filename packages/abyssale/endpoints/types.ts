import { z } from 'zod';
import { AbyssaleBanner } from '../schema/database';

// Create Project
const CreateProjectInputSchema = z.object({
	name: z.string().min(2).max(100),
});
export type CreateProjectInput = z.infer<typeof CreateProjectInputSchema>;

const CreateProjectResponseSchema = z
	.object({
		id: z.string().uuid(),
		name: z.string(),
		created_at_ts: z.number(),
		// Undocumented but returned by the API.
		version: z.string().optional(),
	})
	.loose();
export type CreateProjectResponse = z.infer<typeof CreateProjectResponseSchema>;

// Get Designs
const GetDesignsInputSchema = z.object({
	project_id: z.string().uuid().optional(),
	type: z
		.enum(['static', 'animated', 'printer', 'printer_multipage'])
		.optional(),
});
export type GetDesignsInput = z.infer<typeof GetDesignsInputSchema>;

/**
 * A design object from `GET /designs`.
 *
 * Fields follow the Abyssale REST reference. `template_id`, `category_id` and
 * `category_name` are documented as deprecated aliases but are still returned,
 * so they are modelled rather than silently dropped.
 */
const DesignSchema = z
	.object({
		id: z.string().uuid(),
		template_id: z.string().uuid().optional(),
		name: z.string(),
		type: z.string(),
		project_id: z.string().uuid().optional(),
		project_name: z.string().optional(),
		category_id: z.string().uuid().optional(),
		category_name: z.string().optional(),
		version: z.string().optional(),
		created_at: z.number().optional(),
		updated_at: z.number().optional(),
		preview_url: z.string().optional(),
	})
	.loose();
const GetDesignsResponseSchema = z.array(DesignSchema);
export type GetDesignsResponse = z.infer<typeof GetDesignsResponseSchema>;

// Get Fonts
const GetFontsInputSchema = z.object({
	type: z.enum(['google', 'custom']).optional(),
});
export type GetFontsInput = z.infer<typeof GetFontsInputSchema>;

/**
 * A font object from `GET /fonts`. The reference types `available_weights` as
 * integers, but the API also returns italic variants as strings
 * (e.g. `[400, '400-italic']`), so both are accepted.
 */
const FontSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		type: z.enum(['google', 'custom']),
		available_weights: z.array(z.union([z.number(), z.string()])),
	})
	.loose();
const GetFontsResponseSchema = z.array(FontSchema);
export type GetFontsResponse = z.infer<typeof GetFontsResponseSchema>;

// Test Auth
const TestAuthInputSchema = z.object({});
export type TestAuthInput = z.infer<typeof TestAuthInputSchema>;

/** `POST /auth` confirms the key is valid and returns the workspace. */
const TestAuthResponseSchema = z
	.object({
		company: z.string(),
		version: z.string().optional(),
	})
	.loose();
export type TestAuthResponse = z.infer<typeof TestAuthResponseSchema>;

// Generation
/**
 * Element overrides keyed by layer name. Every value must be an object on the
 * synchronous endpoint (a bare string answers `400 invalid_payload`); the
 * overridable properties per layer type are provider-side, so the shape stays
 * open here and is never narrowed away.
 */
const ElementsSchema = z.record(z.string(), z.object({}).loose());

/** Generate Single Image — synchronous, static designs only. */
const GenerateImageInputSchema = z.object({
	designId: z.string().uuid(),
	elements: ElementsSchema.optional(),
	template_format_name: z.string().min(1).optional(),
	image_file_type: z
		.enum(['png', 'jpeg', 'webp', 'avif', 'pdf', 'auto'])
		.optional(),
	file_compression_level: z.number().int().min(1).max(100).optional(),
	original_visual_id: z.string().uuid().optional(),
});
export type GenerateImageInput = z.infer<typeof GenerateImageInputSchema>;

const GenerateImageResponseSchema = AbyssaleBanner;
export type GenerateImageResponse = z.infer<typeof GenerateImageResponseSchema>;

/** Asynchronous multi-format generation (images, videos, GIFs, HTML5, PDFs). */
const GenerateBatchInputSchema = z.object({
	designId: z.string().uuid(),
	elements: ElementsSchema.optional(),
	template_format_names: z.array(z.string().min(1)).optional(),
	callback_url: z.string().url().optional(),
	image_file_type: z
		.enum(['png', 'jpeg', 'webp', 'avif', 'gif', 'pdf', 'html5', 'mp4', 'auto'])
		.optional(),
	file_compression_level: z.number().int().min(1).max(100).optional(),
	html5: z
		.object({
			page_title: z.string().optional(),
			click_tag: z.string().optional(),
			ad_network: z.string().optional(),
			include_backup_image: z.boolean().optional(),
			repeat: z.boolean().optional(),
		})
		.loose()
		.optional(),
	gif: z
		.object({
			max_fps: z.number().int().min(2).max(9).optional(),
			repeat: z.boolean().optional(),
		})
		.loose()
		.optional(),
	video: z
		.object({
			fps: z.number().int().min(2).max(30).optional(),
		})
		.loose()
		.optional(),
	print: z
		.object({
			color_profile: z.string().uuid().optional(),
			display_crop_marks: z.boolean().optional(),
		})
		.loose()
		.optional(),
	original_visual_id: z.string().uuid().optional(),
	pages: z.record(z.string(), z.object({}).loose()).optional(),
});
export type GenerateBatchInput = z.infer<typeof GenerateBatchInputSchema>;

const GenerateBatchResponseSchema = z
	.object({
		generation_request_id: z.string().uuid(),
	})
	.loose();
export type GenerateBatchResponse = z.infer<typeof GenerateBatchResponseSchema>;

/** Poll an asynchronous generation request; branch on `is_finalized`. */
const GetGenerationRequestInputSchema = z.object({
	generationRequestId: z.string().uuid(),
});
export type GetGenerationRequestInput = z.infer<
	typeof GetGenerationRequestInputSchema
>;

const GetGenerationRequestResponseSchema = z
	.object({
		is_finalized: z.boolean(),
		id: z.string().uuid(),
		banners: z.array(AbyssaleBanner),
		errors: z
			.array(
				z
					.object({
						template_format_name: z.string(),
						reason: z.string(),
					})
					.loose(),
			)
			.optional()
			.default([]),
	})
	.loose();
export type GetGenerationRequestResponse = z.infer<
	typeof GetGenerationRequestResponseSchema
>;

export type AbyssaleEndpointInputs = {
	createProject: CreateProjectInput;
	getDesigns: GetDesignsInput;
	getFonts: GetFontsInput;
	testAuth: TestAuthInput;
	generateImage: GenerateImageInput;
	generateBatch: GenerateBatchInput;
	getGenerationRequest: GetGenerationRequestInput;
};

export type AbyssaleEndpointOutputs = {
	createProject: CreateProjectResponse;
	getDesigns: GetDesignsResponse;
	getFonts: GetFontsResponse;
	testAuth: TestAuthResponse;
	generateImage: GenerateImageResponse;
	generateBatch: GenerateBatchResponse;
	getGenerationRequest: GetGenerationRequestResponse;
};

export const AbyssaleEndpointInputSchemas = {
	createProject: CreateProjectInputSchema,
	getDesigns: GetDesignsInputSchema,
	getFonts: GetFontsInputSchema,
	testAuth: TestAuthInputSchema,
	generateImage: GenerateImageInputSchema,
	generateBatch: GenerateBatchInputSchema,
	getGenerationRequest: GetGenerationRequestInputSchema,
} as const;

export const AbyssaleEndpointOutputSchemas = {
	createProject: CreateProjectResponseSchema,
	getDesigns: GetDesignsResponseSchema,
	getFonts: GetFontsResponseSchema,
	testAuth: TestAuthResponseSchema,
	generateImage: GenerateImageResponseSchema,
	generateBatch: GenerateBatchResponseSchema,
	getGenerationRequest: GetGenerationRequestResponseSchema,
} as const;
