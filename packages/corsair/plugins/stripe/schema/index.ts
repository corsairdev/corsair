import {
	StripeBalance,
	StripeCharge,
	StripeCoupon,
	StripeCustomer,
	StripePaymentIntent,
	StripePrice,
	StripeSource,
} from './database';

export const StripeSchema = {
	version: '1.0.0',
	entities: {
		balance: StripeBalance,
		charges: StripeCharge,
		coupons: StripeCoupon,
		customers: StripeCustomer,
		paymentIntents: StripePaymentIntent,
		prices: StripePrice,
		sources: StripeSource,
	},
} as const;
