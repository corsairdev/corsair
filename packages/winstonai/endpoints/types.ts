import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type WinstonAiEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type WinstonAiEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const WinstonAiEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const WinstonAiEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
