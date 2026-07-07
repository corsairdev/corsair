import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type CloudinaryEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type CloudinaryEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const CloudinaryEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const CloudinaryEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
