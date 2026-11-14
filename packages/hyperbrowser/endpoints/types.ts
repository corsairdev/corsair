import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type HyperbrowserEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type HyperbrowserEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const HyperbrowserEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const HyperbrowserEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
