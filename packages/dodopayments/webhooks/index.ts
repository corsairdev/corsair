import { succeeded as paymentSucceeded, failed as paymentFailed } from './payments';
import { succeeded as refundSucceeded } from './refunds';
import { active as subscriptionActive, cancelled as subscriptionCancelled } from './subscriptions';

export const PaymentWebhooks = {
	succeeded: paymentSucceeded,
	failed: paymentFailed,
};

export const SubscriptionWebhooks = {
	active: subscriptionActive,
	cancelled: subscriptionCancelled,
};

export const RefundWebhooks = {
	succeeded: refundSucceeded,
};

export * from './types';
