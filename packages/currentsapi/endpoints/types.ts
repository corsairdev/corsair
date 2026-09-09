import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type CurrentsApiEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type CurrentsApiEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const CurrentsApiEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const CurrentsApiEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
