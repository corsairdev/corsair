import { create as ordersCreate, get as ordersGet } from './orders';
import { get as paymentsGet, list as paymentsList } from './payments';
import { create as refundsCreate } from './refunds';

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

export * from './types';
