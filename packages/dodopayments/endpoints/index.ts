import { create as customersCreate, get as customersGet } from './customers';
import {
	create as paymentsCreate,
	get as paymentsGet,
	list as paymentsList,
} from './payments';
import { create as refundsCreate } from './refunds';
import {
	cancel as subscriptionsCancel,
	create as subscriptionsCreate,
	get as subscriptionsGet,
} from './subscriptions';

export const Customers = {
	create: customersCreate,
	get: customersGet,
};

export const Payments = {
	create: paymentsCreate,
	get: paymentsGet,
	list: paymentsList,
};

export const Refunds = {
	create: refundsCreate,
};

export const Subscriptions = {
	create: subscriptionsCreate,
	get: subscriptionsGet,
	cancel: subscriptionsCancel,
};

export * from './types';
