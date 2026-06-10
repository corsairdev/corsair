import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type AgentQLEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type AgentQLEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const AgentQLEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const AgentQLEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
