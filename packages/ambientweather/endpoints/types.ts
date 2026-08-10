import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type AmbientWeatherEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type AmbientWeatherEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const AmbientWeatherEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const AmbientWeatherEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
