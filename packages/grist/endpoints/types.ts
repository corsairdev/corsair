import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type GristEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type GristEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const GristEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const GristEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
