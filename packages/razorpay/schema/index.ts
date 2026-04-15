import {
	RazorpayCustomer,
	RazorpayOrder,
	RazorpayPayment,
	RazorpayRefund,
	RazorpaySettlement,
	RazorpaySubscription,
} from './database';

export const RazorpaySchema = {
	version: '1.0.0',
	entities: {
		orders: RazorpayOrder,
		payments: RazorpayPayment,
		refunds: RazorpayRefund,
		customers: RazorpayCustomer,
		settlements: RazorpaySettlement,
		subscriptions: RazorpaySubscription,
	},
} as const;
