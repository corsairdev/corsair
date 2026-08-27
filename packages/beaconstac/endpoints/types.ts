import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type BeaconstacEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type BeaconstacEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const BeaconstacEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const BeaconstacEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
