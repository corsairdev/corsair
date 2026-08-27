import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type CloudcartEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type CloudcartEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const CloudcartEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const CloudcartEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
