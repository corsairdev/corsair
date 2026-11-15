import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type QuickBooksEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type QuickBooksEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const QuickBooksEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const QuickBooksEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
