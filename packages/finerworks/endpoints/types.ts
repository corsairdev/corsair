import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type FinerWorksEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type FinerWorksEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const FinerWorksEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const FinerWorksEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
