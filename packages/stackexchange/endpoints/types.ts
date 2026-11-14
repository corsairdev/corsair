import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type StackExchangeEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type StackExchangeEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const StackExchangeEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const StackExchangeEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
