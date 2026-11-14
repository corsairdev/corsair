import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type ThinkificEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type ThinkificEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const ThinkificEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const ThinkificEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
