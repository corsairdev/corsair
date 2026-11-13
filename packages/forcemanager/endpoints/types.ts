import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type ForceManagerEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type ForceManagerEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const ForceManagerEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const ForceManagerEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
