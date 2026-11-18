import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type LapostaEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type LapostaEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const LapostaEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const LapostaEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
