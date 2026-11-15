import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type ProductboardEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type ProductboardEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const ProductboardEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const ProductboardEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
