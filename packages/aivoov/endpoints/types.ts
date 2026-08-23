import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type AivoovEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type AivoovEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const AivoovEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const AivoovEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
