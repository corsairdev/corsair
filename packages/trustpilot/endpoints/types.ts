import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type TrustpilotEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type TrustpilotEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const TrustpilotEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const TrustpilotEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
