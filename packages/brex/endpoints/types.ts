import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type BrexEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type BrexEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const BrexEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const BrexEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
