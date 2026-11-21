import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type MetabaseEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type MetabaseEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const MetabaseEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const MetabaseEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
