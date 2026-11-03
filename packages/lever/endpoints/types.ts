import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type LeverEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type LeverEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const LeverEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const LeverEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
