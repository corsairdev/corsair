import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type SerpapiEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type SerpapiEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const SerpapiEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const SerpapiEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
