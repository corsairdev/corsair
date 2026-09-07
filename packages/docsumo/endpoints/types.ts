import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type DocsumoEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type DocsumoEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const DocsumoEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const DocsumoEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
