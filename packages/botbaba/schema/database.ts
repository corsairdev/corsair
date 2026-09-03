import { z } from 'zod';

/**
 * Contact fields from Composio BOTBABA_UPDATE_CONTACT / BOTBABA_GET_CONTACT.
 * Official catalog: https://docs.composio.dev/toolkits/botbaba
 */
export const BotbabaContactEntity = z
	.object({
		contact_id: z.string(),
		email: z.string().nullable().optional(),
		phone: z.string().nullable().optional(),
		first_name: z.string().nullable().optional(),
		last_name: z.string().nullable().optional(),
		tags: z.array(z.string()).nullable().optional(),
		custom_fields: z.record(z.string(), z.unknown()).nullable().optional(),
	})
	.loose();
export type BotbabaContactEntity = z.infer<typeof BotbabaContactEntity>;

/**
 * Tag fields from Composio BOTBABA_UPDATE_TAG / BOTBABA_LIST_TAGS.
 * Official catalog: https://docs.composio.dev/toolkits/botbaba
 */
export const BotbabaTagEntity = z
	.object({
		tag_id: z.string(),
		name: z.string(),
	})
	.loose();
export type BotbabaTagEntity = z.infer<typeof BotbabaTagEntity>;

/**
 * Template fields from Composio BOTBABA_GET_TEMPLATE / BOTBABA_UPDATE_TEMPLATE.
 * Official catalog: https://docs.composio.dev/toolkits/botbaba
 */
export const BotbabaTemplateEntity = z
	.object({
		template_id: z.string(),
		name: z.string().nullable().optional(),
		type: z.string().nullable().optional(),
		content: z.string().nullable().optional(),
		parameters: z.array(z.unknown()).nullable().optional(),
	})
	.loose();
export type BotbabaTemplateEntity = z.infer<typeof BotbabaTemplateEntity>;

/**
 * Broadcast / flow / webhook ids from Composio BOTBABA_GET_* tools.
 * Official catalog: https://docs.composio.dev/toolkits/botbaba
 */
export const BotbabaBroadcastEntity = z
	.object({
		broadcast_id: z.string(),
	})
	.loose();
export type BotbabaBroadcastEntity = z.infer<typeof BotbabaBroadcastEntity>;

export const BotbabaFlowEntity = z
	.object({
		flow_id: z.string(),
	})
	.loose();
export type BotbabaFlowEntity = z.infer<typeof BotbabaFlowEntity>;

export const BotbabaWebhookEntity = z
	.object({
		webhook_id: z.string(),
		url: z.string().nullable().optional(),
		active: z.boolean().nullable().optional(),
		events: z.array(z.string()).nullable().optional(),
	})
	.loose();
export type BotbabaWebhookEntity = z.infer<typeof BotbabaWebhookEntity>;

/**
 * Message id from Composio BOTBABA_GET_MESSAGE.
 * Official catalog: https://docs.composio.dev/toolkits/botbaba
 */
export const BotbabaMessageEntity = z
	.object({
		message_id: z.string(),
	})
	.loose();
export type BotbabaMessageEntity = z.infer<typeof BotbabaMessageEntity>;
