import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type SupabaseEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type SupabaseEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const SupabaseEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const SupabaseEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
