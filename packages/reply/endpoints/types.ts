 import { z } from 'zod';

const CreatePersonalListInputSchema = z.object({
    name: z.string().min(1),
    isShared: z.boolean().optional(),
});

const CreatePersonalListResponseSchema = z.object({
    id: z.number(),
    name: z.string(),
    isShared: z.boolean().optional(),
});

export type CreatePersonalListInput = z.infer<
    typeof CreatePersonalListInputSchema
>;

export type CreatePersonalListResponse = z.infer<
    typeof CreatePersonalListResponseSchema
>;

export type ReplyEndpointInputs = {
    createPersonalList: CreatePersonalListInput;
};

export type ReplyEndpointOutputs = {
    createPersonalList: CreatePersonalListResponse;
};

export const ReplyEndpointInputSchemas = {
    createPersonalList: CreatePersonalListInputSchema,
} as const;

export const ReplyEndpointOutputSchemas = {
    createPersonalList: CreatePersonalListResponseSchema,
} as const;