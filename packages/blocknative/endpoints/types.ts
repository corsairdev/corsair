import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type BlocknativeEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type BlocknativeEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const BlocknativeEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const BlocknativeEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
