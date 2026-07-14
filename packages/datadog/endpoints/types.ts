import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type DatadogEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type DatadogEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const DatadogEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const DatadogEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
