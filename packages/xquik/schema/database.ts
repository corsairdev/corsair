import {
	DeliverySchema,
	EventPayloadSchema,
	SearchTweetSchema,
	TweetDetailSchema,
	UserProfileSchema,
	WebhookSchema,
} from '../endpoints/types';

export const XquikTweet = SearchTweetSchema.or(TweetDetailSchema);
export const XquikUser = UserProfileSchema;
export const XquikWebhookEndpoint = WebhookSchema;
export const XquikWebhookDelivery = DeliverySchema;
export const XquikEvent = EventPayloadSchema;
