import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type BenchmarkEmailEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type BenchmarkEmailEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const BenchmarkEmailEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const BenchmarkEmailEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
