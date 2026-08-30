import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type CampaynEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type CampaynEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const CampaynEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const CampaynEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
