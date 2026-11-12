import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type EndorsalEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type EndorsalEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const EndorsalEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const EndorsalEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
