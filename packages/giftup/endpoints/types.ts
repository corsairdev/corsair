import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type GiftUpEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type GiftUpEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const GiftUpEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const GiftUpEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
