import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type AppdragEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type AppdragEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const AppdragEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const AppdragEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
