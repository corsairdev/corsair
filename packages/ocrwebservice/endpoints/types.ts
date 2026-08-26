import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type OcrWebServiceEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type OcrWebServiceEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const OcrWebServiceEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const OcrWebServiceEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
