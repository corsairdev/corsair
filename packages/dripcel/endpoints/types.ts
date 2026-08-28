import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type DripcelEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type DripcelEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const DripcelEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const DripcelEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
