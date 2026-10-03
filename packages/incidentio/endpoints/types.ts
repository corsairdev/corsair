import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type IncidentioEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type IncidentioEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const IncidentioEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const IncidentioEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
