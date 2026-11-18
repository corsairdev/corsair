import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type LangbaseEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type LangbaseEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const LangbaseEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const LangbaseEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
