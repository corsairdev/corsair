import { get as balanceGet } from './balance';
import {
	create as chargesCreate,
	get as chargesGet,
	list as chargesList,
	update as chargesUpdate,
} from './charges';
import { create as couponsCreate, list as couponsList } from './coupons';
import {
	create as customersCreate,
	deleteCustomer as customersDelete,
	get as customersGet,
	list as customersList,
} from './customers';
import {
	create as paymentIntentsCreate,
	get as paymentIntentsGet,
	list as paymentIntentsList,
	update as paymentIntentsUpdate,
} from './payment-intents';
import { create as pricesCreate, list as pricesList } from './prices';
import { create as sourcesCreate, get as sourcesGet } from './sources';
import { create as tokensCreate } from './tokens';

export const Balance = {
	get: balanceGet,
};

export const Charges = {
	create: chargesCreate,
	get: chargesGet,
	list: chargesList,
	update: chargesUpdate,
};

export const Coupons = {
	create: couponsCreate,
	list: couponsList,
};

export const Customers = {
	create: customersCreate,
	delete: customersDelete,
	get: customersGet,
	list: customersList,
};

export const PaymentIntents = {
	create: paymentIntentsCreate,
	get: paymentIntentsGet,
	list: paymentIntentsList,
	update: paymentIntentsUpdate,
};

export const Prices = {
	create: pricesCreate,
	list: pricesList,
};

export const Sources = {
	create: sourcesCreate,
	get: sourcesGet,
};

export const Tokens = {
	create: tokensCreate,
};

export * from './types';
