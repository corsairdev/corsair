import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type FreeAgentEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type FreeAgentEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const FreeAgentEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const FreeAgentEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
