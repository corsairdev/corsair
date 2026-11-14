import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type HandwryttenEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type HandwryttenEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const HandwryttenEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const HandwryttenEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
