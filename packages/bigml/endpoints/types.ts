import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type BigmlEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type BigmlEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const BigmlEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const BigmlEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
