import { z } from 'zod';

/**
 * Zod schema for the renderDesign endpoint input.
 *
 * Mirrors the query parameters of `renderDesignPost` / `renderDesignGet` in the
 * official OpenAPI spec (https://api.imejis.io/openapi.json), plus the JSON
 * request body of dynamic-field overrides.
 */
export const RenderDesignInputSchema = z.object({
	designId: z
		.string()
		.min(1)
		.describe('The design render code from the design render URL'),
	format: z
		.enum(['png', 'jpeg', 'webp', 'pdf'])
		.optional()
		.default('jpeg')
		.describe('Output format. Defaults to jpeg per the Imejis OpenAPI spec'),
	quality: z
		.number()
		.int()
		.min(1)
		.max(100)
		.optional()
		.describe('JPEG quality from 1 to 100 (only affects jpeg output)'),
	delivery: z
		.enum(['stream', 'hosted', 'signed'])
		.optional()
		.default('stream')
		.describe(
			'Delivery mode: stream (raw bytes normalized to base64), hosted (public URL), or signed (expiring URL)',
		),
	expiresIn: z
		.number()
		.int()
		.min(1)
		.max(10080)
		.optional()
		.describe(
			'Signed delivery only: link lifetime in minutes (default 60, maximum 7 days = 10080)',
		),
	overrides: z
		.record(z.string(), z.unknown())
		.optional()
		.describe('Key-value overrides for dynamic design template fields'),
});

/**
 * Input parameters for rendering a design template.
 */
export type RenderDesignInput = z.input<typeof RenderDesignInputSchema>;

/**
 * Schema for stream delivery mode, normalized from the raw image bytes the
 * render service returns for `delivery=stream`.
 */
export const RenderStreamResponseSchema = z.object({
	delivery: z
		.literal('stream')
		.describe('Stream delivery mode returning base64 encoded bytes'),
	format: z
		.enum(['png', 'jpeg', 'webp', 'pdf'])
		.describe('The rendered file format'),
	contentType: z.string().describe('MIME content type of the rendered file'),
	base64: z.string().describe('Base64-encoded binary content'),
});

/**
 * Response shape for stream delivery mode.
 */
export type RenderStreamResponse = z.infer<typeof RenderStreamResponseSchema>;

/**
 * Schema for hosted delivery mode, returning a public URL to the stored render.
 */
export const RenderHostedResponseSchema = z
	.object({
		success: z.boolean().optional().describe('Success indicator from Imejis'),
		delivery: z
			.literal('hosted')
			.describe('Hosted delivery mode returning a public URL'),
		url: z
			.string()
			.url()
			.describe('Publicly accessible URL of the rendered image'),
		format: z
			.enum(['png', 'jpeg', 'webp', 'pdf'])
			.optional()
			.describe('Rendered file format'),
		file: z
			.record(z.string(), z.unknown())
			.optional()
			.describe('File metadata from Imejis'),
	})
	.loose();

/**
 * Response shape for hosted delivery mode.
 */
export type RenderHostedResponse = z.infer<typeof RenderHostedResponseSchema>;

/**
 * Schema for signed delivery mode, returning an expiring signed URL.
 */
export const RenderSignedResponseSchema = z
	.object({
		success: z.boolean().optional().describe('Success indicator from Imejis'),
		delivery: z
			.literal('signed')
			.describe('Signed delivery mode returning an expiring signed URL'),
		url: z
			.string()
			.url()
			.describe('Temporary signed URL of the rendered image'),
		expiresAt: z
			.string()
			.optional()
			.describe('ISO timestamp indicating when the signed URL expires'),
		format: z
			.enum(['png', 'jpeg', 'webp', 'pdf'])
			.optional()
			.describe('Rendered file format'),
		file: z
			.record(z.string(), z.unknown())
			.optional()
			.describe('File metadata from Imejis'),
	})
	.loose();

/**
 * Response shape for signed delivery mode.
 */
export type RenderSignedResponse = z.infer<typeof RenderSignedResponseSchema>;

/**
 * Discriminated union of all supported Imejis render responses keyed by delivery mode.
 */
export const RenderDesignResponseSchema = z.discriminatedUnion('delivery', [
	RenderStreamResponseSchema,
	RenderHostedResponseSchema,
	RenderSignedResponseSchema,
]);

/**
 * Unified response type for design rendering.
 */
export type RenderDesignResponse = z.infer<typeof RenderDesignResponseSchema>;

/**
 * Map of endpoint operation names to their respective input types.
 */
export type ImejisioEndpointInputs = {
	renderDesign: RenderDesignInput;
};

/**
 * Map of endpoint operation names to their respective output types.
 */
export type ImejisioEndpointOutputs = {
	renderDesign: RenderDesignResponse;
};

/**
 * Map of endpoint input Zod schemas.
 */
export const ImejisioEndpointInputSchemas = {
	renderDesign: RenderDesignInputSchema,
} as const;

/**
 * Map of endpoint output Zod schemas.
 */
export const ImejisioEndpointOutputSchemas = {
	renderDesign: RenderDesignResponseSchema,
} as const;
