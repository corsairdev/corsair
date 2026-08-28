import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type WixEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type WixEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const WixEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const WixEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
