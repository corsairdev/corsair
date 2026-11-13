import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type FeltEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type FeltEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const FeltEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const FeltEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
