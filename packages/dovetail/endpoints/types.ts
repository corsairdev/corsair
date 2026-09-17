import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type DovetailEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type DovetailEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const DovetailEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const DovetailEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
