import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type CoassembleEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type CoassembleEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const CoassembleEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const CoassembleEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
