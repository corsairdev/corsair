import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type CertifierEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type CertifierEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const CertifierEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const CertifierEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
