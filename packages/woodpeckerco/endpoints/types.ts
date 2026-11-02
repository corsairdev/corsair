import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type WoodpeckerCoEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type WoodpeckerCoEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const WoodpeckerCoEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const WoodpeckerCoEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
