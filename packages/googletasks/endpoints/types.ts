import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type GoogleTasksEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type GoogleTasksEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const GoogleTasksEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const GoogleTasksEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
