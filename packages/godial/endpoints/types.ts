import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type GoDialEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type GoDialEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const GoDialEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const GoDialEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
