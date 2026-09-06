import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type ZohoBiginEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type ZohoBiginEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const ZohoBiginEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const ZohoBiginEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
