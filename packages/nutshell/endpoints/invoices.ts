import { defineEndpoint } from './factory';

export const invoicesList = defineEndpoint('invoices.list');
export const invoicesGet = defineEndpoint('invoices.get');
export const invoicesStatus = defineEndpoint('invoices.status');

export const endpoints = {
	invoices: {
		list: invoicesList,
		get: invoicesGet,
		status: invoicesStatus,
	},
} as const;
