import { z } from 'zod';

export const PingGetInputSchema = z.object({}).strict();

export type PingGetInput = z.infer<typeof PingGetInputSchema>;

// The REST guide documents the ping route but not a response schema. The
// official Node.js guide reads `response.message` from that same route.
export const PingGetResponseSchema = z.object({
	message: z.string(),
});

export type PingGetResponse = z.infer<typeof PingGetResponseSchema>;

export type FingertipEndpointInputs = {
	pingGet: PingGetInput;
};

export type FingertipEndpointOutputs = {
	pingGet: PingGetResponse;
};

export const FingertipEndpointInputSchemas = {
	pingGet: PingGetInputSchema,
} as const;

export const FingertipEndpointOutputSchemas = {
	pingGet: PingGetResponseSchema,
} as const;
