import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type CollegeFootballDataEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type CollegeFootballDataEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const CollegeFootballDataEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const CollegeFootballDataEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
