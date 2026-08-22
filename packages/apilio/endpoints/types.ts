import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type ApilioEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type ApilioEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const ApilioEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const ApilioEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
