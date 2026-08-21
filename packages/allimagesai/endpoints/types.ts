import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type AllImagesAiEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type AllImagesAiEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const AllImagesAiEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const AllImagesAiEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
