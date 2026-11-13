import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type FiberyEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type FiberyEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const FiberyEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const FiberyEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
