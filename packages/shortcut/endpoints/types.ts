import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type ShortcutEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type ShortcutEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const ShortcutEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const ShortcutEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
