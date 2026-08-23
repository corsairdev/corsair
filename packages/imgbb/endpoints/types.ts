import { z } from 'zod';

// ── auth.getApiKey ──────────────────────────────────────────────────────────

export const GetApiKeyInputSchema = z.object({});
export type GetApiKeyInput = z.infer<typeof GetApiKeyInputSchema>;

export const GetApiKeyResponseSchema = z.object({
	configured: z
		.boolean()
		.describe('Whether an ImgBB API key is configured for this account'),
	keyPreview: z
		.string()
		.describe(
			'Last 4 characters of the configured key, for identification only',
		),
});
export type GetApiKeyResponse = z.infer<typeof GetApiKeyResponseSchema>;

// ── images.upload ───────────────────────────────────────────────────────────

export const UploadImageInputSchema = z.object({
	image: z
		.string()
		.min(1)
		.describe(
			'Base64-encoded image data or an image URL (binary uploads up to 32 MB per the ImgBB API)',
		),
	name: z.string().optional().describe('Optional display name for the file'),
	expiration: z
		.number()
		.int()
		.min(60)
		.max(15552000)
		.optional()
		.describe(
			'Optional auto-delete window in seconds (60-15552000). Omit to keep the image indefinitely.',
		),
});
export type UploadImageInput = z.infer<typeof UploadImageInputSchema>;

// Mirrors the ImgBB API response field names (snake_case) rather than
// remapping to camelCase, so the shape stays predictable against the ImgBB docs.
const ImgBBImageVariantSchema = z
	.object({
		filename: z.string().optional(),
		name: z.string().optional(),
		mime: z.string().optional(),
		extension: z.string().optional(),
		url: z.string(),
	})
	.loose();

export const UploadImageResponseSchema = z
	.object({
		id: z.string(),
		title: z.string().optional(),
		url_viewer: z.string().optional(),
		url: z.string(),
		display_url: z.string().optional(),
		width: z.coerce.number().optional(),
		height: z.coerce.number().optional(),
		size: z.coerce.number().optional(),
		time: z.coerce.number().optional(),
		expiration: z.coerce.number().optional(),
		image: ImgBBImageVariantSchema.optional(),
		thumb: ImgBBImageVariantSchema.optional(),
		medium: ImgBBImageVariantSchema.optional(),
		delete_url: z.string().optional(),
	})
	.loose();
export type UploadImageResponse = z.infer<typeof UploadImageResponseSchema>;

// ImgBB wraps every upload response in this envelope.
export const ImgBBUploadEnvelopeSchema = z.object({
	data: UploadImageResponseSchema,
	success: z.boolean(),
	status: z.number(),
});
export type ImgBBUploadEnvelope = z.infer<typeof ImgBBUploadEnvelopeSchema>;

// ── Aggregate maps consumed by index.ts ─────────────────────────────────────

export type ImgBBEndpointInputs = {
	getApiKey: GetApiKeyInput;
	upload: UploadImageInput;
};

export type ImgBBEndpointOutputs = {
	getApiKey: GetApiKeyResponse;
	upload: UploadImageResponse;
};

export const ImgBBEndpointInputSchemas = {
	getApiKey: GetApiKeyInputSchema,
	upload: UploadImageInputSchema,
} as const;

export const ImgBBEndpointOutputSchemas = {
	getApiKey: GetApiKeyResponseSchema,
	upload: UploadImageResponseSchema,
} as const;
