import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type LodgifyEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type LodgifyEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const LodgifyEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const LodgifyEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
