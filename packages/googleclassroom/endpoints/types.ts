import { z } from 'zod';

const ExampleGetInputSchema = z.object({
	id: z.string(),
});

export type ExampleGetInput = z.infer<typeof ExampleGetInputSchema>;

const ExampleGetResponseSchema = z.object({
	id: z.string(),
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type GoogleClassroomEndpointInputs = {
	exampleGet: ExampleGetInput;
};

export type GoogleClassroomEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};

export const GoogleClassroomEndpointInputSchemas = {
	exampleGet: ExampleGetInputSchema,
} as const;

export const GoogleClassroomEndpointOutputSchemas = {
	exampleGet: ExampleGetResponseSchema,
} as const;
