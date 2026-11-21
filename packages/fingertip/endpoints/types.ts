import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type FingertipEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type FingertipEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const FingertipEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const FingertipEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
