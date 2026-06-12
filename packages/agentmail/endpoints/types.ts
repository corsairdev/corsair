import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type AgentMailEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type AgentMailEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const AgentMailEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const AgentMailEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
