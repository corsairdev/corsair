import {
	TwoChatAccountEntity,
	TwoChatContactEntity,
	TwoChatWebhookSubscriptionEntity,
} from './database';

export const TwoChatSchema = {
	version: '1.0.0',
	entities: {
		contacts: TwoChatContactEntity,
		accounts: TwoChatAccountEntity,
		webhookSubscriptions: TwoChatWebhookSubscriptionEntity,
	},
} as const;

export * from './database';
