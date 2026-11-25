import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type LushaEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type LushaEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const LushaEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const LushaEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
