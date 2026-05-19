import {
	XquikEvent,
	XquikTweet,
	XquikUser,
	XquikWebhookDelivery,
	XquikWebhookEndpoint,
} from './database';

export const XquikSchema = {
	entities: {
		deliveries: XquikWebhookDelivery,
		events: XquikEvent,
		tweets: XquikTweet,
		users: XquikUser,
		webhooks: XquikWebhookEndpoint,
	},
	version: '1.0.0',
} as const;
