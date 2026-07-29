import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type GoogleAddressValidationEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type GoogleAddressValidationEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const GoogleAddressValidationEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const GoogleAddressValidationEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
