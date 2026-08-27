import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type PineconeEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type PineconeEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const PineconeEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const PineconeEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
