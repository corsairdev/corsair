import { z } from 'zod';

// Schemas are registered by defineMailerLiteOperation as each endpoint module
// initializes; z.ZodType uses its default unknown boundary for this heterogeneous
// registry because individual operation inputs and outputs have distinct shapes.
export const MailerLiteEndpointInputSchemas: Record<string, z.ZodType> = {};
export const MailerLiteEndpointOutputSchemas: Record<string, z.ZodType> = {};

export function registerMailerLiteEndpointSchemas<
	InputSchema extends z.ZodType,
	OutputSchema extends z.ZodType,
>(operation: string, input: InputSchema, output: OutputSchema): void {
	MailerLiteEndpointInputSchemas[operation] = input;
	MailerLiteEndpointOutputSchemas[operation] = output;
}

export const MailerLiteIdSchema = z.union([
	z.string().min(1),
	z.number().int().positive(),
]);

// MailerLite's resource objects have documented resource-specific fields, but
// several fields are plan-, status- or include-dependent. Require the stable
// documented identifier and preserve the provider's additional response data.
export const MailerLiteEntitySchema = z
	.object({ id: MailerLiteIdSchema })
	.passthrough();

const PaginationLinksSchema = z
	.object({
		first: z.string().nullable().optional(),
		last: z.string().nullable().optional(),
		prev: z.string().nullable().optional(),
		next: z.string().nullable().optional(),
	})
	.passthrough();

const PaginationMetaSchema = z
	.object({
		current_page: z.number().optional(),
		last_page: z.number().optional(),
		per_page: z.number().optional(),
		total: z.number().optional(),
		next_cursor: z.string().nullable().optional(),
		prev_cursor: z.string().nullable().optional(),
	})
	.passthrough();

export const MailerLiteEntityResponseSchema = z
	.object({ data: MailerLiteEntitySchema })
	.passthrough();

export const MailerLiteListResponseSchema = z
	.object({
		data: z.array(MailerLiteEntitySchema),
		links: PaginationLinksSchema.optional(),
		meta: PaginationMetaSchema.optional(),
	})
	.passthrough();

export const MailerLiteCountResponseSchema = z
	.object({ total: z.number() })
	.strict();
export const MailerLiteNoContentSchema = z.undefined();

export const MailerLiteImportProgressResponseSchema = z
	.object({
		data: z
			.object({
				id: MailerLiteIdSchema,
				total: z.number(),
				processed: z.number(),
				imported: z.number(),
				updated: z.number(),
				errored: z.number(),
				percent: z.number(),
				done: z.boolean(),
			})
			.passthrough(),
	})
	.passthrough();

export const MailerLiteImportAcceptedSchema = z
	.object({ import_progress_url: z.string().url() })
	.strict();

export const MailerLiteFieldsSchema = z.record(
	z.string(),
	z.union([z.string(), z.number(), z.boolean(), z.null()]),
);

export const MailerLitePaginationQuerySchema = z
	.object({
		limit: z.number().int().min(0).optional(),
		page: z.number().int().min(1).optional(),
		cursor: z.string().optional(),
		sort: z.string().optional(),
		include: z.string().optional(),
	})
	.strict();

export type MailerLiteResource = z.infer<typeof MailerLiteEntitySchema>;
export type MailerLiteResourceResponse = z.infer<
	typeof MailerLiteEntityResponseSchema
>;
export type MailerLiteListResponse = z.infer<
	typeof MailerLiteListResponseSchema
>;
