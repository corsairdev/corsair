import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type WaboxappEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type WaboxappEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const WaboxappEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const WaboxappEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
