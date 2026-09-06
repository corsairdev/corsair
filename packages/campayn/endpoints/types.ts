import { z } from 'zod';

const ListSchema = z.object({
	id: z.union([z.string(), z.number()]),
	name: z.string().optional(),
});

const ListsResponseSchema = z.object({
	lists: z.array(ListSchema).optional(),
});

export type ListsResponse = z.infer<typeof ListsResponseSchema>;

export type CampaynEndpointInputs = {
	listsGet: Record<string, never>;
};

export type CampaynEndpointOutputs = {
	listsGet: ListsResponse;
};

export const CampaynEndpointInputSchemas = {
	listsGet: z.object({}),
} as const;

export const CampaynEndpointOutputSchemas = {
	listsGet: ListsResponseSchema,
} as const;
