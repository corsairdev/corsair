import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type ApaleoEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type ApaleoEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const ApaleoEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const ApaleoEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
