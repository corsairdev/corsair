import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type ShipEngineEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type ShipEngineEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const ShipEngineEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const ShipEngineEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
