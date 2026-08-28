import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type HtmlToImageEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type HtmlToImageEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const HtmlToImageEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const HtmlToImageEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
