import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type FireberryEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type FireberryEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const FireberryEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const FireberryEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
