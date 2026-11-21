import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type MailcoachEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type MailcoachEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const MailcoachEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const MailcoachEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
