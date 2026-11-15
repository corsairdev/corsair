import * as Events from './events';

export const PaymentWebhooks = {
	donation: Events.donation,
	subscription: Events.subscription,
	shopOrder: Events.shopOrder,
	commission: Events.commission,
};
