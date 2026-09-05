import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type MyFirstPluginEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type MyFirstPluginEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const MyFirstPluginEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const MyFirstPluginEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
