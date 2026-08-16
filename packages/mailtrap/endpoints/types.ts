import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type MailtrapEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type MailtrapEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const MailtrapEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const MailtrapEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
