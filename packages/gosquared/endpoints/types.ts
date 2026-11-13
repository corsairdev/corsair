import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type GoSquaredEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type GoSquaredEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const GoSquaredEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const GoSquaredEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
