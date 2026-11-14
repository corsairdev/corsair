import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type SimlaComEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type SimlaComEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const SimlaComEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const SimlaComEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
