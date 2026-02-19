import { z } from 'zod';

const ExampleGetResponseSchema = z.object({
	id: z.string(),
	// TODO: Add your response fields here
});

export type ExampleGetResponse = z.infer<typeof ExampleGetResponseSchema>;

export type DiscordEndpointOutputs = {
	exampleGet: ExampleGetResponse;
};
