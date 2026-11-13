import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type ElorusEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type ElorusEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const ElorusEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const ElorusEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
