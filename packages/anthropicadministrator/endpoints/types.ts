import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type AnthropicAdministratorEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type AnthropicAdministratorEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const AnthropicAdministratorEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const AnthropicAdministratorEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
