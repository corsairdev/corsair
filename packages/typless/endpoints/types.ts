import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type TyplessEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type TyplessEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const TyplessEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const TyplessEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
