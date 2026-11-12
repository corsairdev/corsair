import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type EncodianEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type EncodianEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const EncodianEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const EncodianEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
