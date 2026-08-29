import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type DynapicturesEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type DynapicturesEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const DynapicturesEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const DynapicturesEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
