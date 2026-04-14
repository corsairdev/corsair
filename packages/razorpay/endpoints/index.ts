import {
	create as customersCreate,
	get as customersGet,
	list as customersList,
	update as customersUpdate,
} from './customers';
import {
	create as ordersCreate,
	get as ordersGet,
	list as ordersList,
} from './orders';
import {
	capture as paymentsCapture,
	get as paymentsGet,
	list as paymentsList,
} from './payments';
import {
	create as refundsCreate,
	get as refundsGet,
	list as refundsList,
} from './refunds';
import { get as settlementsGet, list as settlementsList } from './settlements';
import {
	cancel as subscriptionsCancel,
	create as subscriptionsCreate,
	get as subscriptionsGet,
	list as subscriptionsList,
	pause as subscriptionsPause,
	resume as subscriptionsResume,
	update as subscriptionsUpdate,
} from './subscriptions';

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
