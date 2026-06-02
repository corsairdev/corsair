import { paid } from './orders';
import { captured, failed } from './payments';
import { processed } from './refunds';

export const PaymentWebhooks = {
	captured,
	failed,
};

export const OrderWebhooks = {
	paid,
};

export const RefundWebhooks = {
	processed,
};

export * from './types';
