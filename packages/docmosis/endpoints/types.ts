import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type DocmosisEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type DocmosisEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const DocmosisEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const DocmosisEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
