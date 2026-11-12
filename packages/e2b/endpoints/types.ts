import { z } from 'zod';

// Check API Health
const GetHealthInputSchema = z.object({}).optional();
export type GetHealthInput = z.infer<typeof GetHealthInputSchema>;

const GetHealthResponseSchema = z.object({
	status: z.string(),
}).passthrough();
export type GetHealthResponse = z.infer<typeof GetHealthResponseSchema>;

export const E2bEndpointInputSchemas = {
	getHealth: GetHealthInputSchema,
} as const;

export type E2bEndpointInputs = {
	[K in keyof typeof E2bEndpointInputSchemas]: z.infer<(typeof E2bEndpointInputSchemas)[K]>;
};

export const E2bEndpointOutputSchemas = {
	getHealth: GetHealthResponseSchema,
} as const;

export type E2bEndpointOutputs = {
	[K in keyof typeof E2bEndpointOutputSchemas]: z.infer<(typeof E2bEndpointOutputSchemas)[K]>;
};

export type { GetHealthInput, GetHealthResponse };