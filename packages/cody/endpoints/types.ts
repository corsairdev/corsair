import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type CodyEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type CodyEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const CodyEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const CodyEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
