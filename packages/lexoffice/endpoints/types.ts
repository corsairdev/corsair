import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type LexofficeEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type LexofficeEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const LexofficeEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const LexofficeEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
