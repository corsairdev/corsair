import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type MailerLiteEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type MailerLiteEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const MailerLiteEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const MailerLiteEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
