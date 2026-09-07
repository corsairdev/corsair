import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type ExistEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type ExistEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const ExistEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const ExistEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
