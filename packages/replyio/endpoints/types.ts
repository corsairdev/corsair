import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type ReplyioEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type ReplyioEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const ReplyioEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const ReplyioEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
