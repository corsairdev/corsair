import { create as customersCreate, get as customersGet, list as customersList, update as customersUpdate } from './customers';
import { create as ordersCreate, get as ordersGet, list as ordersList } from './orders';
import { get as paymentsGet, list as paymentsList, capture as paymentsCapture } from './payments';
import { create as refundsCreate, get as refundsGet, list as refundsList } from './refunds';
import { get as settlementsGet, list as settlementsList } from './settlements';
import { get as subscriptionsGet, list as subscriptionsList, create as subscriptionsCreate, update as subscriptionsUpdate, cancel as subscriptionsCancel, pause as subscriptionsPause, resume as subscriptionsResume } from './subscriptions';

export const Customers = {
	create: customersCreate,
	get: customersGet,
	list: customersList,
	update: customersUpdate,
};

export const Orders = {
	create: ordersCreate,
	get: ordersGet,
	list: ordersList,
};

export const Payments = {
	get: paymentsGet,
	list: paymentsList,
	capture: paymentsCapture,
};

export const Refunds = {
	create: refundsCreate,
	get: refundsGet,
	list: refundsList,
};

export const Settlements = {
	list: settlementsList,
	get: settlementsGet,
};

export const Subscriptions = {
	list: subscriptionsList,
	get: subscriptionsGet,
	create: subscriptionsCreate,
	update: subscriptionsUpdate,
	cancel: subscriptionsCancel,
	pause: subscriptionsPause,
	resume: subscriptionsResume,
};

export * from './types';
