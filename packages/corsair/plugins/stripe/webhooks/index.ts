import {
	succeeded as chargeSucceeded,
	failed as chargeFailed,
	refunded as chargeRefunded,
} from './charge';
import {
	created as customerCreated,
	deleted as customerDeleted,
	updated as customerUpdated,
} from './customer';
import {
	succeeded as paymentIntentSucceeded,
	failed as paymentIntentFailed,
} from './payment-intent';
import {
	created as couponCreated,
	deleted as couponDeleted,
} from './coupon';
import { ping } from './ping';

export const ChargeWebhooks = {
	succeeded: chargeSucceeded,
	failed: chargeFailed,
	refunded: chargeRefunded,
};

export const CustomerWebhooks = {
	created: customerCreated,
	deleted: customerDeleted,
	updated: customerUpdated,
};

export const PaymentIntentWebhooks = {
	succeeded: paymentIntentSucceeded,
	failed: paymentIntentFailed,
};

export const CouponWebhooks = {
	created: couponCreated,
	deleted: couponDeleted,
};

export const PingWebhooks = {
	ping,
};

export * from './types';
