import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type BoxheroEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type BoxheroEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const BoxheroEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const BoxheroEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
