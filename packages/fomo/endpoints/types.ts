import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type FomoEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type FomoEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const FomoEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const FomoEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
