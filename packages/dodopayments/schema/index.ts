import {
	DodoCustomer,
	DodoPayment,
	DodoRefund,
	DodoSubscription,
} from './database';

export const DodoPaymentsSchema = {
	version: '1.0.0',
	entities: {
		payments: DodoPayment,
		refunds: DodoRefund,
		customers: DodoCustomer,
		subscriptions: DodoSubscription,
	},
} as const;
