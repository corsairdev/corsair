import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type ChatfaiEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type ChatfaiEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const ChatfaiEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const ChatfaiEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
