import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type AnonyflowEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type AnonyflowEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const AnonyflowEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const AnonyflowEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
