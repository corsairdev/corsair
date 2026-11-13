import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type FormdeskEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type FormdeskEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const FormdeskEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const FormdeskEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
