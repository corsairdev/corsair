import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type GigasheetEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type GigasheetEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const GigasheetEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const GigasheetEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
