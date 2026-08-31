import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// ACCOUNT — POST /user_status
// Docs: https://kraken.io/docs/user-status
// ─────────────────────────────────────────────────────────────────────────────

const CheckStatusInputSchema = z.object({}).optional();

export type CheckStatusInput = z.infer<typeof CheckStatusInputSchema>;

const CheckStatusResponseSchema = z
	.object({
		success: z.boolean(),
		active: z.boolean().optional(),
		plan_name: z.string().optional(),
		/** All quota fields are reported in bytes. */
		quota_total: z.number().optional(),
		quota_used: z.number().optional(),
		quota_remaining: z.number().optional(),
	})
	.loose();

export type CheckStatusResponse = z.infer<typeof CheckStatusResponseSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// IMAGE — POST /url
// Docs: https://kraken.io/docs/upload-url, https://kraken.io/docs/wait-callback
// ─────────────────────────────────────────────────────────────────────────────

const OptimizeImageUrlInputSchema = z.object({
	/** Publicly reachable URL of the image to optimize. */
	url: z.url(),
	/** Hold the connection open and return the full result inline. */
	wait: z.boolean().optional().default(true),
	/** Use lossy compression for a smaller file at the cost of some quality. */
	lossy: z.boolean().optional(),
	/** Override the output file name reported in the response. */
	filename: z.string().optional(),
	/**
	 * When set instead of (or alongside) `wait`, Kraken POSTs the result to
	 * this URL once optimization finishes rather than blocking the request.
	 */
	callback_url: z.url().optional(),
});

export type OptimizeImageUrlInput = z.infer<typeof OptimizeImageUrlInputSchema>;

const OptimizeImageUrlResponseSchema = z
	.object({
		success: z.boolean(),
		/** Present when `callback_url` is used instead of `wait`. */
		id: z.string().optional(),
		file_name: z.string().optional(),
		original_size: z.number().optional(),
		kraked_size: z.number().optional(),
		saved_bytes: z.number().optional(),
		kraked_url: z.string().optional(),
	})
	.loose();

export type OptimizeImageUrlResponse = z.infer<
	typeof OptimizeImageUrlResponseSchema
>;

// Metadata categories Kraken.io can retain instead of stripping during
// optimization. https://kraken.io/docs/preserving-metadata
export const KrakenMetadataFields = [
	'profile',
	'date',
	'copyright',
	'geotag',
	'orientation',
] as const;

const PreserveMetadataInputSchema = z.object({
	url: z.url(),
	/** Metadata categories to retain; must include at least one. */
	preserve_meta: z.array(z.enum(KrakenMetadataFields)).min(1),
	wait: z.boolean().optional().default(true),
	lossy: z.boolean().optional(),
	filename: z.string().optional(),
});

export type PreserveMetadataInput = z.infer<typeof PreserveMetadataInputSchema>;

const PreserveMetadataResponseSchema = OptimizeImageUrlResponseSchema;

export type PreserveMetadataResponse = z.infer<
	typeof PreserveMetadataResponseSchema
>;

const SandboxUploadInputSchema = z.object({
	url: z.url(),
	wait: z.boolean().optional().default(true),
	filename: z.string().optional(),
});

export type SandboxUploadInput = z.infer<typeof SandboxUploadInputSchema>;

// Sandbox mode returns the same shape as a real optimization, but with
// randomized size/URL values that don't reflect real compression.
const SandboxUploadResponseSchema = OptimizeImageUrlResponseSchema;

export type SandboxUploadResponse = z.infer<typeof SandboxUploadResponseSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Schema Maps
// ─────────────────────────────────────────────────────────────────────────────

export const KrakenEndpointInputSchemas = {
	accountCheckStatus: CheckStatusInputSchema,
	imageOptimizeUrl: OptimizeImageUrlInputSchema,
	imagePreserveMetadata: PreserveMetadataInputSchema,
	imageSandboxUpload: SandboxUploadInputSchema,
} as const;

export type KrakenEndpointInputs = {
	[K in keyof typeof KrakenEndpointInputSchemas]: z.infer<
		(typeof KrakenEndpointInputSchemas)[K]
	>;
};

export const KrakenEndpointOutputSchemas = {
	accountCheckStatus: CheckStatusResponseSchema,
	imageOptimizeUrl: OptimizeImageUrlResponseSchema,
	imagePreserveMetadata: PreserveMetadataResponseSchema,
	imageSandboxUpload: SandboxUploadResponseSchema,
} as const;

export type KrakenEndpointOutputs = {
	[K in keyof typeof KrakenEndpointOutputSchemas]: z.infer<
		(typeof KrakenEndpointOutputSchemas)[K]
	>;
};
