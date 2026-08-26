import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type BoldsignEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type BoldsignEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const BoldsignEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const BoldsignEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
