import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type ListenNotesEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type ListenNotesEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const ListenNotesEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const ListenNotesEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
