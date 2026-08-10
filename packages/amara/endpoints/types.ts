import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type AmaraEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type AmaraEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const AmaraEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const AmaraEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
