import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type ContextSevenMcpEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type ContextSevenMcpEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const ContextSevenMcpEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const ContextSevenMcpEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
