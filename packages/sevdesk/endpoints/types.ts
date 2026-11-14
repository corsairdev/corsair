import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type SevdeskEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type SevdeskEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const SevdeskEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const SevdeskEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
