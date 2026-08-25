import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type AscoraEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type AscoraEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const AscoraEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const AscoraEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
