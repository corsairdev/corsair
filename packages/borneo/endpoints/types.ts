import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type BorneoEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type BorneoEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const BorneoEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const BorneoEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
