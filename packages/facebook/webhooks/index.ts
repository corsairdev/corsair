import { challenge } from './challenge';
import { delivery } from './delivery';
import { message } from './message';

export const ChallengeWebhooks = {
	challenge,
};

export const MessageWebhooks = {
	message,
};

export const DeliveryWebhooks = {
	delivery,
};

export * from './types';
