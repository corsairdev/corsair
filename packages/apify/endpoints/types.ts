import { z } from 'zod';

export const ApifyOperationInputSchema = z
	.object({
		body: z.unknown().optional(),
		query: z.record(z.string(), z.unknown()).optional(),
		headers: z.record(z.string(), z.unknown()).optional(),
		contentType: z.string().optional(),
		mediaType: z.string().optional(),
	})
	.loose();

export const ApifyOperationOutputSchema = z.unknown();

export type ApifyOperationInput = z.infer<typeof ApifyOperationInputSchema>;
export type ApifyOperationOutput = z.infer<typeof ApifyOperationOutputSchema>;

export type ApifyEndpointInputs = Record<string, ApifyOperationInput>;
export type ApifyEndpointOutputs = Record<string, ApifyOperationOutput>;
