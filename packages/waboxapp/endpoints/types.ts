import { z } from 'zod';
import { WaboxappAccount, WaboxappMessage } from '../schema/database';

const SendBaseInputSchema = z.object({
	uid: z.string().optional(),
	to: z.string(),
	custom_uid: z.string().optional(),
});

export const MessagesSendChatInputSchema = SendBaseInputSchema.extend({
	text: z.string(),
});
export type MessagesSendChatInput = z.infer<typeof MessagesSendChatInputSchema>;
export type MessagesSendChatResponse = WaboxappMessage;

export const MessagesSendImageInputSchema = SendBaseInputSchema.extend({
	url: z.string(),
	caption: z.string().optional(),
	description: z.string().optional(),
});
export type MessagesSendImageInput = z.infer<
	typeof MessagesSendImageInputSchema
>;
export type MessagesSendImageResponse = WaboxappMessage;

export const MessagesSendLinkInputSchema = SendBaseInputSchema.extend({
	url: z.string(),
	caption: z.string().optional(),
	description: z.string().optional(),
	url_thumb: z.string().optional(),
});
export type MessagesSendLinkInput = z.infer<typeof MessagesSendLinkInputSchema>;
export type MessagesSendLinkResponse = WaboxappMessage;

export const MessagesSendMediaInputSchema = SendBaseInputSchema.extend({
	url: z.string(),
	caption: z.string().optional(),
	description: z.string().optional(),
	url_thumb: z.string().optional(),
});
export type MessagesSendMediaInput = z.infer<
	typeof MessagesSendMediaInputSchema
>;
export type MessagesSendMediaResponse = WaboxappMessage;

export const AccountsGetStatusInputSchema = z.object({
	uid: z.string().optional(),
});
export type AccountsGetStatusInput = z.infer<
	typeof AccountsGetStatusInputSchema
>;
export type AccountsGetStatusResponse = WaboxappAccount;

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
	messagesSendChat: WaboxappMessage,
	messagesSendImage: WaboxappMessage,
	messagesSendLink: WaboxappMessage,
	messagesSendMedia: WaboxappMessage,
	accountsGetStatus: WaboxappAccount,
} as const;
