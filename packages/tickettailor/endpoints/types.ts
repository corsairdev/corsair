import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type TicketTailorEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type TicketTailorEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const TicketTailorEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const TicketTailorEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
