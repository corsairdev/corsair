import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type LemlistEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type LemlistEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const LemlistEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const LemlistEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
