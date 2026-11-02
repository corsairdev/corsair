import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type ZohoDeskEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type ZohoDeskEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const ZohoDeskEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const ZohoDeskEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
