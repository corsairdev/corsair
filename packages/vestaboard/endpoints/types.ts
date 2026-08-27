import { z } from 'zod';
import {
	VestaboardCharactersSchema,
	VestaboardMessageEntity,
	VestaboardSubscriptionEntity,
	VestaboardViewerEntity,
} from '../schema/database';

// Message Get
export const MessageGetInputSchema = z.object({}).optional();
export type MessageGetInput = z.infer<typeof MessageGetInputSchema>;

export const MessageGetResponseSchema = z
	.object({
		currentMessage: VestaboardMessageEntity.optional(),
		layout: z.string().optional(),
	})
	.loose();
export type MessageGetResponse = z.infer<typeof MessageGetResponseSchema>;

// Message Post
export const MessagePostInputSchema = z.object({
	text: z.string().optional(),
	characters: VestaboardCharactersSchema.optional(),
});
export type MessagePostInput = z.infer<typeof MessagePostInputSchema>;

export const MessagePostResponseSchema = z
	.object({
		status: z.string().optional(),
		id: z.string().optional(),
		text: z.string().optional(),
		created: z.number().optional(),
	})
	.loose();
export type MessagePostResponse = z.infer<typeof MessagePostResponseSchema>;

// Message Clear
export const MessageClearInputSchema = z.object({}).optional();
export type MessageClearInput = z.infer<typeof MessageClearInputSchema>;

export const MessageClearResponseSchema = z
	.object({
		status: z.string().optional(),
		cleared: z.boolean().optional(),
	})
	.loose();
export type MessageClearResponse = z.infer<typeof MessageClearResponseSchema>;

// Subscriptions List
export const SubscriptionsListInputSchema = z.object({}).optional();
export type SubscriptionsListInput = z.infer<typeof SubscriptionsListInputSchema>;

export const SubscriptionsListResponseSchema = z
	.object({
		subscriptions: z.array(VestaboardSubscriptionEntity),
	})
	.loose();
export type SubscriptionsListResponse = z.infer<typeof SubscriptionsListResponseSchema>;

// Subscriptions Get Message
export const SubscriptionsGetInputSchema = z.object({
	subscriptionId: z.string(),
});
export type SubscriptionsGetInput = z.infer<typeof SubscriptionsGetInputSchema>;

export const SubscriptionsGetResponseSchema = z
	.object({
		currentMessage: VestaboardMessageEntity.optional(),
		message: VestaboardMessageEntity.optional(),
	})
	.loose();
export type SubscriptionsGetResponse = z.infer<typeof SubscriptionsGetResponseSchema>;

// Subscriptions Post Message
export const SubscriptionsPostMessageInputSchema = z.object({
	subscriptionId: z.string(),
	text: z.string().optional(),
	characters: VestaboardCharactersSchema.optional(),
});
export type SubscriptionsPostMessageInput = z.infer<typeof SubscriptionsPostMessageInputSchema>;

export const SubscriptionsPostMessageResponseSchema = z
	.object({
		status: z.string().optional(),
		id: z.string().optional(),
		created: z.number().optional(),
	})
	.loose();
export type SubscriptionsPostMessageResponse = z.infer<typeof SubscriptionsPostMessageResponseSchema>;

// Viewer Get
export const ViewerGetInputSchema = z.object({}).optional();
export type ViewerGetInput = z.infer<typeof ViewerGetInputSchema>;

export const ViewerGetResponseSchema = VestaboardViewerEntity;
export type ViewerGetResponse = z.infer<typeof ViewerGetResponseSchema>;

// Schema Maps
export const VestaboardEndpointInputSchemas = {
	messageGet: MessageGetInputSchema,
	messagePost: MessagePostInputSchema,
	messageClear: MessageClearInputSchema,
	subscriptionsList: SubscriptionsListInputSchema,
	subscriptionsGet: SubscriptionsGetInputSchema,
	subscriptionsPostMessage: SubscriptionsPostMessageInputSchema,
	viewerGet: ViewerGetInputSchema,
} as const;

export const VestaboardEndpointOutputSchemas = {
	messageGet: MessageGetResponseSchema,
	messagePost: MessagePostResponseSchema,
	messageClear: MessageClearResponseSchema,
	subscriptionsList: SubscriptionsListResponseSchema,
	subscriptionsGet: SubscriptionsGetResponseSchema,
	subscriptionsPostMessage: SubscriptionsPostMessageResponseSchema,
	viewerGet: ViewerGetResponseSchema,
} as const;

export type VestaboardEndpointInputs = {
	messageGet: MessageGetInput;
	messagePost: MessagePostInput;
	messageClear: MessageClearInput;
	subscriptionsList: SubscriptionsListInput;
	subscriptionsGet: SubscriptionsGetInput;
	subscriptionsPostMessage: SubscriptionsPostMessageInput;
	viewerGet: ViewerGetInput;
};

export type VestaboardEndpointOutputs = {
	messageGet: MessageGetResponse;
	messagePost: MessagePostResponse;
	messageClear: MessageClearResponse;
	subscriptionsList: SubscriptionsListResponse;
	subscriptionsGet: SubscriptionsGetResponse;
	subscriptionsPostMessage: SubscriptionsPostMessageResponse;
	viewerGet: ViewerGetResponse;
};
