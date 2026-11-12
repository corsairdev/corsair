import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type EngageEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type EngageEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const EngageEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const EngageEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
