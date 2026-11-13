import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type GleapEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type GleapEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const GleapEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const GleapEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
