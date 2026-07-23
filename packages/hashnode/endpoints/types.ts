import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type HashnodeEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type HashnodeEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const HashnodeEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const HashnodeEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
