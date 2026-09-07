import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type SemanticScholarEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type SemanticScholarEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const SemanticScholarEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const SemanticScholarEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
