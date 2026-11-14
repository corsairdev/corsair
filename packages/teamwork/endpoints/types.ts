import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type TeamworkEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type TeamworkEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const TeamworkEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const TeamworkEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
