import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type RetailedEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type RetailedEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const RetailedEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const RetailedEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
