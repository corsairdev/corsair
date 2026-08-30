import { z } from 'zod';

const DeletePersonInputSchema = z.object({
	id: z.string(),
});

export type DeletePersonInput = z.infer<typeof DeletePersonInputSchema>;

const DeletePersonResponseSchema = z.object({
	success: z.boolean(),
	data: z.object({
		id: z.string(),
	}),
});

export type DeletePersonResponse = z.infer<typeof DeletePersonResponseSchema>;

export type TimelinkEndpointInputs = {
	deletePerson: DeletePersonInput;
};

export type TimelinkEndpointOutputs = {
	deletePerson: DeletePersonResponse;
};

export const TimelinkEndpointInputSchemas = {
	deletePerson: DeletePersonInputSchema,
} as const;

export const TimelinkEndpointOutputSchemas = {
	deletePerson: DeletePersonResponseSchema,
} as const;
