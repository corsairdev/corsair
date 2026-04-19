import { z } from 'zod';

const ExampleGetInputSchema = z.object({});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.record(z.string(), z.unknown());

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type GitlabEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type GitlabEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const GitlabEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const GitlabEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
