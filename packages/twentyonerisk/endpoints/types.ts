import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type TwentyOneRiskEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type TwentyOneRiskEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const TwentyOneRiskEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const TwentyOneRiskEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
