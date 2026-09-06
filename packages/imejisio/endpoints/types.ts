import { z } from 'zod';

/**
 * Zod schema for listDesigns endpoint input parameters.
 */
export const ListDesignsInputSchema = z.object({
	page: z
		.number()
		.int()
		.min(1)
		.optional()
		.describe('Page number for pagination (starts at 1)'),
	limit: z
		.number()
		.int()
		.min(1)
		.max(100)
		.optional()
		.describe('Number of design records per page (maximum 100)'),
});

/**
 * Input parameters for listing design templates.
 */
export type ListDesignsInput = z.infer<typeof ListDesignsInputSchema>;

/**
 * Schema representing a summary of an Imejis design template.
 */
export const DesignSummarySchema = z
	.object({
		_id: z.string().describe('Unique identifier of the design template'),
		name: z.string().describe('Display name of the design template'),
		updatedAt: z.string().describe('ISO timestamp of the last modification'),
	})
	.loose();

/**
 * Type representing a design template summary.
 */
export type DesignSummary = z.infer<typeof DesignSummarySchema>;

/**
 * Schema representing a paginated list of designs returned by Imejis.
 */
export const PaginatedDesignsSchema = z
	.object({
		docs: z
			.array(DesignSummarySchema)
			.describe('Array of design template summaries'),
		page: z.number().int().describe('Current page number'),
		totalPages: z.number().int().describe('Total available pages'),
		hasNextPage: z.boolean().describe('Whether a next page exists'),
	})
	.loose();

/**
 * Type representing paginated designs response.
 */
export type PaginatedDesigns = z.infer<typeof PaginatedDesignsSchema>;

/**
 * Schema for rendering an Imejis design template.
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
		.describe(
			'Output format. Defaults to jpeg per Imejis OpenAPI specification',
		),
	quality: z
		.number()
		.int()
		.min(1)
		.max(100)
		.optional()
		.describe('JPEG quality from 1 to 100 (only applies to jpeg format)'),
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
 * Schema for stream delivery mode response (normalized base64 representation).
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
 * Schema for hosted delivery mode response returning a public URL.
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
 * Schema for signed delivery mode response returning an expiring signed URL.
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
	listDesigns: ListDesignsInput;
	renderDesign: RenderDesignInput;
};

/**
 * Map of endpoint operation names to their respective output types.
 */
export type ImejisioEndpointOutputs = {
	listDesigns: PaginatedDesigns;
	renderDesign: RenderDesignResponse;
};

/**
 * Map of endpoint input Zod schemas.
 */
export const ImejisioEndpointInputSchemas = {
	listDesigns: ListDesignsInputSchema,
	renderDesign: RenderDesignInputSchema,
} as const;

/**
 * Map of endpoint output Zod schemas.
 */
export const ImejisioEndpointOutputSchemas = {
	listDesigns: PaginatedDesignsSchema,
	renderDesign: RenderDesignResponseSchema,
} as const;
