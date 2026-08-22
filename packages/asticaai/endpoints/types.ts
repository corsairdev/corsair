import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type AsticaAiEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type AsticaAiEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const AsticaAiEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const AsticaAiEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
