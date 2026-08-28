import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type BooqableEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type BooqableEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const BooqableEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const BooqableEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
