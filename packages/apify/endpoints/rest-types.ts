import { z } from 'zod';

export const ApifyOperationInputSchema = z
	.object({
		// Apify request bodies differ per endpoint and are passed through as-is.
		body: z.unknown().optional(),
		// Query values are endpoint-specific and not shared across operations.
		query: z.record(z.string(), z.unknown()).optional(),
		// Custom headers are forwarded without a fixed provider-wide shape.
		headers: z.record(z.string(), z.unknown()).optional(),
		contentType: z.string().optional(),
		mediaType: z.string().optional(),
	})
	.loose();

// Apify responses are endpoint-specific and are not normalized here.
export const ApifyOperationOutputSchema = z.unknown();

export type ApifyOperationInput = z.infer<typeof ApifyOperationInputSchema>;
export type ApifyOperationOutput = z.infer<typeof ApifyOperationOutputSchema>;

export type ApifyEndpointInputs = Record<string, ApifyOperationInput>;
export type ApifyEndpointOutputs = Record<string, ApifyOperationOutput>;

export const EndpointInputSchemas = ApifyOperationInputSchema;
export const EndpointOutputSchemas = ApifyOperationOutputSchema;
