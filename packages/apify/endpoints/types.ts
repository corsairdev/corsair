import { z } from 'zod';

export const ApifyOperationInputSchema = z
	.object({
		// Apify operation bodies vary per endpoint and can include arbitrary JSON payloads.
		body: z.unknown().optional(),
		// Query values are endpoint-specific primitives preserved by the generic operation router.
		query: z.record(z.string(), z.unknown()).optional(),
		// Custom headers are passed through to Apify without a stable provider-wide shape.
		headers: z.record(z.string(), z.unknown()).optional(),
		contentType: z.string().optional(),
		mediaType: z.string().optional(),
	})
	.loose();

// Apify returns endpoint-specific payloads that this generated passthrough layer does not normalize.
export const ApifyOperationOutputSchema = z.unknown();

export type ApifyOperationInput = z.infer<typeof ApifyOperationInputSchema>;
export type ApifyOperationOutput = z.infer<typeof ApifyOperationOutputSchema>;

export type ApifyEndpointInputs = Record<string, ApifyOperationInput>;
export type ApifyEndpointOutputs = Record<string, ApifyOperationOutput>;
