import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type CountdownApiEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type CountdownApiEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const CountdownApiEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const CountdownApiEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
