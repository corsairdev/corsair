import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type TextrazorEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type TextrazorEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const TextrazorEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const TextrazorEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
