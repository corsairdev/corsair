import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type VestaboardEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type VestaboardEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const VestaboardEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const VestaboardEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
