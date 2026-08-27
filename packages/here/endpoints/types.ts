import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	q: z.string().min(1),
	limit: z.number().int().positive().max(100).optional(),
	at: z.string().optional(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	items: z.array(z.record(z.string(), z.unknown())),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type HereEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type HereEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const HereEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
};

export const HereEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
};
