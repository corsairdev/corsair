import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type HoneyHiveEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type HoneyHiveEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const HoneyHiveEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const HoneyHiveEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
