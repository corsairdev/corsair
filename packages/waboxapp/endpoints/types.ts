import { z } from 'zod';

const SendBaseInputSchema = z.object({
	uid: z.string().optional(),
	to: z.string(),
	custom_uid: z.string().optional(),
});

const MessagesSendChatInputSchema = SendBaseInputSchema.extend({
	text: z.string(),
});
export type MessagesSendChatInput = z.infer<typeof MessagesSendChatInputSchema>;

const SendSuccessSchema = z.object({
	success: z.boolean(),
	custom_uid: z.union([z.string(), z.number()]).optional(),
	error: z.string().optional(),
});

export type MessagesSendChatResponse = z.infer<typeof SendSuccessSchema>;

const MessagesSendImageInputSchema = SendBaseInputSchema.extend({
	url: z.string(),
	caption: z.string().optional(),
	description: z.string().optional(),
});
export type MessagesSendImageInput = z.infer<
	typeof MessagesSendImageInputSchema
>;
export type MessagesSendImageResponse = z.infer<typeof SendSuccessSchema>;

const MessagesSendLinkInputSchema = SendBaseInputSchema.extend({
	url: z.string(),
	caption: z.string().optional(),
	description: z.string().optional(),
	url_thumb: z.string().optional(),
});
export type MessagesSendLinkInput = z.infer<typeof MessagesSendLinkInputSchema>;
export type MessagesSendLinkResponse = z.infer<typeof SendSuccessSchema>;

const MessagesSendMediaInputSchema = SendBaseInputSchema.extend({
	url: z.string(),
	caption: z.string().optional(),
	description: z.string().optional(),
	url_thumb: z.string().optional(),
});
export type MessagesSendMediaInput = z.infer<
	typeof MessagesSendMediaInputSchema
>;
export type MessagesSendMediaResponse = z.infer<typeof SendSuccessSchema>;

const AccountsGetStatusInputSchema = z.object({
	uid: z.string().optional(),
});
export type AccountsGetStatusInput = z.infer<
	typeof AccountsGetStatusInputSchema
>;

const AccountsGetStatusResponseSchema = z.object({
	success: z.boolean(),
	uid: z.string().optional(),
	hook_url: z.string().optional(),
	alias: z.string().optional(),
	platform: z.string().optional(),
	battery: z.string().optional(),
	plugged: z.string().optional(),
	locale: z.string().optional(),
	error: z.string().optional(),
});
export type AccountsGetStatusResponse = z.infer<
	typeof AccountsGetStatusResponseSchema
>;

export type WaboxappEndpointInputs = {
	messagesSendChat: MessagesSendChatInput;
	messagesSendImage: MessagesSendImageInput;
	messagesSendLink: MessagesSendLinkInput;
	messagesSendMedia: MessagesSendMediaInput;
	accountsGetStatus: AccountsGetStatusInput;
};

export type WaboxappEndpointOutputs = {
	messagesSendChat: MessagesSendChatResponse;
	messagesSendImage: MessagesSendImageResponse;
	messagesSendLink: MessagesSendLinkResponse;
	messagesSendMedia: MessagesSendMediaResponse;
	accountsGetStatus: AccountsGetStatusResponse;
};

export const WaboxappEndpointInputSchemas = {
	messagesSendChat: MessagesSendChatInputSchema,
	messagesSendImage: MessagesSendImageInputSchema,
	messagesSendLink: MessagesSendLinkInputSchema,
	messagesSendMedia: MessagesSendMediaInputSchema,
	accountsGetStatus: AccountsGetStatusInputSchema,
} as const;

export const WaboxappEndpointOutputSchemas = {
	messagesSendChat: SendSuccessSchema,
	messagesSendImage: SendSuccessSchema,
	messagesSendLink: SendSuccessSchema,
	messagesSendMedia: SendSuccessSchema,
	accountsGetStatus: AccountsGetStatusResponseSchema,
} as const;
