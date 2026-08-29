import { z } from 'zod';

export const TwoChatContactEntity = z.object({
	uuid: z.string(),
	first_name: z.string(),
	last_name: z.string().optional(),
	profile_pic_url: z.string().optional(),
	created_at: z.coerce.date().optional(),
});

export const TwoChatAccountEntity = z.object({
	uuid: z.string(),
	name: z.string().optional(),
	on_trial: z.boolean().optional(),
	blocked: z.boolean().optional(),
	requests_per_minute: z.number().optional(),
});

export const TwoChatWebhookSubscriptionEntity = z.object({
	uuid: z.string(),
	event_name: z.string(),
	channel_uuid: z.string().optional(),
	hook_url: z.string(),
	created_at: z.coerce.date().optional(),
});

export type TwoChatContactEntity = z.infer<typeof TwoChatContactEntity>;
export type TwoChatAccountEntity = z.infer<typeof TwoChatAccountEntity>;
export type TwoChatWebhookSubscriptionEntity = z.infer<
	typeof TwoChatWebhookSubscriptionEntity
>;
