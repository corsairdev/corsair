import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type VoEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type VoEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const VoEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const VoEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
