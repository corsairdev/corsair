import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type MetaAdsEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type MetaAdsEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const MetaAdsEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const MetaAdsEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
