import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type FathomEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type FathomEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const FathomEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const FathomEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
