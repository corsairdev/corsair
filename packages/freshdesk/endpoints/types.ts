import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type FreshdeskEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type FreshdeskEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const FreshdeskEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const FreshdeskEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
