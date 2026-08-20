import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type AeroleadsEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type AeroleadsEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const AeroleadsEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const AeroleadsEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
