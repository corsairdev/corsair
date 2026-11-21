import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type ZohoBooksEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type ZohoBooksEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const ZohoBooksEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const ZohoBooksEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
