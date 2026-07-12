import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type ConfluenceEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type ConfluenceEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const ConfluenceEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const ConfluenceEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
