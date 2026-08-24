import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type BrowseraiEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type BrowseraiEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const BrowseraiEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const BrowseraiEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
