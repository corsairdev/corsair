import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type ConvoloAiEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type ConvoloAiEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const ConvoloAiEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const ConvoloAiEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
