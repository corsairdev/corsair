import { z } from 'zod';

// --- Threads ---

export const ChatkitListThreadsInputSchema = z.object({
	limit: z.number().optional(),
	order: z.enum(['asc', 'desc']).optional(),
	after: z.string().optional(),
	before: z.string().optional(),
	user: z.string().optional(),
});
export type ChatkitListThreadsInput = z.infer<
	typeof ChatkitListThreadsInputSchema
>;

// ChatKit's thread object shape (status detail and any other fields) is not fully
// documented publicly; using catchall/unknown to accept whatever the API returns.
const ChatkitThreadObjectSchema = z
	.object({
		id: z.string(),
		object: z.literal('chatkit.thread'),
		created_at: z.number(),
		status: z.record(z.string(), z.unknown()).optional(),
	})
	.catchall(z.unknown());
export type ChatkitThreadObject = z.infer<typeof ChatkitThreadObjectSchema>;

export const ChatkitListThreadsResponseSchema = z.object({
	object: z.literal('list'),
	data: z.array(ChatkitThreadObjectSchema),
	first_id: z.string().optional(),
	last_id: z.string().optional(),
	has_more: z.boolean(),
});
export type ChatkitListThreadsResponse = z.infer<
	typeof ChatkitListThreadsResponseSchema
>;

export const ChatkitGetThreadInputSchema = z.object({
	threadId: z.string(),
});
export type ChatkitGetThreadInput = z.infer<typeof ChatkitGetThreadInputSchema>;

export const ChatkitGetThreadResponseSchema = ChatkitThreadObjectSchema;
export type ChatkitGetThreadResponse = z.infer<
	typeof ChatkitGetThreadResponseSchema
>;

// --- Thread Items ---

export const ChatkitListThreadItemsInputSchema = z.object({
	threadId: z.string(),
	limit: z.number().optional(),
	order: z.enum(['asc', 'desc']).optional(),
	after: z.string().optional(),
	before: z.string().optional(),
});
export type ChatkitListThreadItemsInput = z.infer<
	typeof ChatkitListThreadItemsInputSchema
>;

export const ChatkitListThreadItemsResponseSchema = z.object({
	object: z.literal('list'),
	// Thread item shape varies by item type and isn't fully documented publicly; kept loose.
	data: z.array(z.record(z.string(), z.unknown())),
	first_id: z.string().optional(),
	last_id: z.string().optional(),
	has_more: z.boolean(),
});
export type ChatkitListThreadItemsResponse = z.infer<
	typeof ChatkitListThreadItemsResponseSchema
>;
