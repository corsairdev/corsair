import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type TursoEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type TursoEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const TursoEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const TursoEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
