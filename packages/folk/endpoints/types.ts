import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type FolkEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type FolkEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const FolkEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const FolkEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
