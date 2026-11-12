import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type EventeeEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type EventeeEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const EventeeEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const EventeeEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
