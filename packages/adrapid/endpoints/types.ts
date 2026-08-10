import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type AdrapidEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type AdrapidEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const AdrapidEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const AdrapidEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
