import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type AblyEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type AblyEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const AblyEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const AblyEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
