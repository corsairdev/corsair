import { z } from 'zod';

// Conversation item shape varies by type (message, function_call, tool output, etc.); kept loose rather than modeling each variant.
const ConversationItemSchema = z.record(z.string(), z.unknown());

const ConversationMetadataSchema = z.record(z.string(), z.string());

const ConversationObjectSchema = z.object({
	id: z.string(),
	object: z.literal('conversation'),
	created_at: z.number(),
	metadata: ConversationMetadataSchema.nullable().optional(),
});
export type ConversationObject = z.infer<typeof ConversationObjectSchema>;

const ConversationItemListSchema = z.object({
	object: z.literal('list'),
	data: z.array(ConversationItemSchema),
	first_id: z.string().optional(),
	last_id: z.string().optional(),
	has_more: z.boolean(),
});
export type ConversationItemList = z.infer<typeof ConversationItemListSchema>;

// --- Create ---

export const ConversationsCreateInputSchema = z.object({
	items: z.array(ConversationItemSchema).optional(),
	metadata: ConversationMetadataSchema.optional(),
});
export type ConversationsCreateInput = z.infer<
	typeof ConversationsCreateInputSchema
>;

export const ConversationsCreateResponseSchema = ConversationObjectSchema;
export type ConversationsCreateResponse = z.infer<
	typeof ConversationsCreateResponseSchema
>;

// --- Update ---

export const ConversationsUpdateInputSchema = z.object({
	conversationId: z.string(),
	metadata: ConversationMetadataSchema,
});
export type ConversationsUpdateInput = z.infer<
	typeof ConversationsUpdateInputSchema
>;

export const ConversationsUpdateResponseSchema = ConversationObjectSchema;
export type ConversationsUpdateResponse = z.infer<
	typeof ConversationsUpdateResponseSchema
>;

// --- Delete ---

export const ConversationsDeleteInputSchema = z.object({
	conversationId: z.string(),
});
export type ConversationsDeleteInput = z.infer<
	typeof ConversationsDeleteInputSchema
>;

export const ConversationsDeleteResponseSchema = z.object({
	id: z.string(),
	object: z.literal('conversation.deleted'),
	deleted: z.boolean(),
});
export type ConversationsDeleteResponse = z.infer<
	typeof ConversationsDeleteResponseSchema
>;

// --- Create Items ---

export const ConversationsCreateItemsInputSchema = z.object({
	conversationId: z.string(),
	items: z.array(ConversationItemSchema),
	include: z.array(z.string()).optional(),
});
export type ConversationsCreateItemsInput = z.infer<
	typeof ConversationsCreateItemsInputSchema
>;

export const ConversationsCreateItemsResponseSchema =
	ConversationItemListSchema;
export type ConversationsCreateItemsResponse = z.infer<
	typeof ConversationsCreateItemsResponseSchema
>;

// --- List Items ---

export const ConversationsListItemsInputSchema = z.object({
	conversationId: z.string(),
	limit: z.number().optional(),
	order: z.enum(['asc', 'desc']).optional(),
	after: z.string().optional(),
	include: z.array(z.string()).optional(),
});
export type ConversationsListItemsInput = z.infer<
	typeof ConversationsListItemsInputSchema
>;

export const ConversationsListItemsResponseSchema = ConversationItemListSchema;
export type ConversationsListItemsResponse = z.infer<
	typeof ConversationsListItemsResponseSchema
>;

// --- Get Item ---

export const ConversationsGetItemInputSchema = z.object({
	conversationId: z.string(),
	itemId: z.string(),
});
export type ConversationsGetItemInput = z.infer<
	typeof ConversationsGetItemInputSchema
>;

// Item fields beyond id/type vary by item type; using catchall to accept whatever the API returns.
export const ConversationsGetItemResponseSchema = z
	.object({ id: z.string(), type: z.string() })
	.catchall(z.unknown());
export type ConversationsGetItemResponse = z.infer<
	typeof ConversationsGetItemResponseSchema
>;

// --- Delete Item ---

export const ConversationsDeleteItemInputSchema = z.object({
	conversationId: z.string(),
	itemId: z.string(),
});
export type ConversationsDeleteItemInput = z.infer<
	typeof ConversationsDeleteItemInputSchema
>;

export const ConversationsDeleteItemResponseSchema = ConversationObjectSchema;
export type ConversationsDeleteItemResponse = z.infer<
	typeof ConversationsDeleteItemResponseSchema
>;
