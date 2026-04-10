import { create as customersCreate, get as customersGet } from './customers';
import { create as ordersCreate, get as ordersGet } from './orders';
import { get as paymentsGet, list as paymentsList } from './payments';
import { create as refundsCreate } from './refunds';
import { get as settlementsGet, list as settlementsList } from './settlements';
import { get as subscriptionsGet, list as subscriptionsList } from './subscriptions';

export const Customers = {
	create: customersCreate,
	get: customersGet,
};

export const Orders = {
	create: ordersCreate,
	get: ordersGet,
};

export const Payments = {
	get: paymentsGet,
	list: paymentsList,
};

export const Refunds = {
	create: refundsCreate,
};

export const Settlements = {
	list: settlementsList,
	get: settlementsGet,
};

export const Subscriptions = {
	list: subscriptionsList,
	get: subscriptionsGet,
};

export * from './types';
