import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type GrafbaseEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type GrafbaseEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const GrafbaseEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const GrafbaseEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
