import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type ClassmarkerEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type ClassmarkerEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const ClassmarkerEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const ClassmarkerEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
