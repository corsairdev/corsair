import { FileInputSchema } from 'corsair/http';
import { z } from 'zod';
import { ImgBBImage, ImgBBImageVariant } from '../schema/database';

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

const URL_PATTERN = /^https?:\/\/.+/i;
const DATA_URI_PATTERN =
	/^data:image\/[a-zA-Z0-9.+_-]+;base64,[A-Za-z0-9+/=]+$/i;
const BASE64_PATTERN = /^[A-Za-z0-9+/=]+$/;

// Core's object forms of a file: {url, filename?, contentType?} and
// {base64, filename?, contentType?}. A bare string keeps ImgBB's own rules
// below, since ImgBB takes a URL or base64 string as it is.
const [, LinkedImageSchema, Base64ImageSchema] = FileInputSchema.options;

export const BinaryImageInputSchema = z.union([
	z
		.string()
		.trim()
		.min(1)
		.refine(
			(val) =>
				URL_PATTERN.test(val) ||
				DATA_URI_PATTERN.test(val) ||
				(BASE64_PATTERN.test(val) && val.length % 4 === 0),
			{
				message:
					'Image string must be a valid http(s) URL, a base64 data URI, or a valid base64-encoded string',
			},
		)
		.describe('Base64-encoded image data, image data URI, or image URL'),
	LinkedImageSchema,
	Base64ImageSchema,
	z.instanceof(Blob).describe('Binary Blob or File instance'),
	z.instanceof(Uint8Array).describe('Binary Uint8Array byte array'),
	z.custom<Buffer>(
		(val) => typeof Buffer !== 'undefined' && Buffer.isBuffer(val),
		{ message: 'Expected Buffer' },
	),
]);
export type BinaryImageInput = z.infer<typeof BinaryImageInputSchema>;

export const UploadImageInputSchema = z.object({
	image: BinaryImageInputSchema.describe(
		'The image, up to 32 MB per the ImgBB API: a public URL or base64 string (ImgBB fetches a link itself), {url, filename?, contentType?}, or {base64, filename?, contentType?}; binary data (Blob, File, Buffer, Uint8Array) from TypeScript. On Corsair, pass a Files id (fil_…).',
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

// Re-export entity schemas aligned with official ImgBB API documentation
export const ImgBBImageVariantSchema = ImgBBImageVariant;
export type ImgBBImageVariantType = ImgBBImageVariant;

export const UploadImageResponseSchema = ImgBBImage;
export type UploadImageResponse = ImgBBImage;

// ImgBB wraps every upload response in this envelope.
export const ImgBBUploadEnvelopeSchema = z.object({
	data: UploadImageResponseSchema,
	success: z.literal(true),
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

export { ImgBBImage, ImgBBImageVariant };
