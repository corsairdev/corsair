import { z } from 'zod';

const DeletePersonInputSchema = z.object({
	id: z
		.string()
		.min(1)
		.refine((id) => !/[/?#]/.test(id) && !/^\.{1,2}$/.test(id), {
			message:
				'id must be a single URL path segment without delimiters or dot segments',
		}),
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
