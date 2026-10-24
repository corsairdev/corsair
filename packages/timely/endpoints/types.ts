import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type TimelyEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type TimelyEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const TimelyEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const TimelyEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
