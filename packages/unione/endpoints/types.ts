import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type UnioneEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type UnioneEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const UnioneEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const UnioneEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
