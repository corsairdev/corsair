import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type BlackbaudEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type BlackbaudEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const BlackbaudEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const BlackbaudEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
