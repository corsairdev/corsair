import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type PipedriveEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type PipedriveEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const PipedriveEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const PipedriveEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
