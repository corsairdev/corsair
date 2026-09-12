import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type ExtractaaiEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type ExtractaaiEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const ExtractaaiEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const ExtractaaiEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
