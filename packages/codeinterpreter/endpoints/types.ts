import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type CodeInterpreterEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type CodeInterpreterEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const CodeInterpreterEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const CodeInterpreterEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
