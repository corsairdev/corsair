import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type BrowserToolEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type BrowserToolEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const BrowserToolEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const BrowserToolEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
