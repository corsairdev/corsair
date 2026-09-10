import {
	BotbabaBroadcastEntity,
	BotbabaContactEntity,
	BotbabaFlowEntity,
	BotbabaMessageEntity,
	BotbabaTagEntity,
	BotbabaTemplateEntity,
	BotbabaWebhookEntity,
} from './database';

export const BotbabaSchema = {
	version: '1.0.0',
	entities: {
		contacts: BotbabaContactEntity,
		tags: BotbabaTagEntity,
		templates: BotbabaTemplateEntity,
		broadcasts: BotbabaBroadcastEntity,
		flows: BotbabaFlowEntity,
		webhooks: BotbabaWebhookEntity,
		messages: BotbabaMessageEntity,
	},
} as const;

export * from './database';
