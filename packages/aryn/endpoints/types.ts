import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type ArynEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type ArynEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const ArynEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const ArynEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
