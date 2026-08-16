import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type BotpressEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type BotpressEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const BotpressEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const BotpressEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
