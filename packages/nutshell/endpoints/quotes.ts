import { defineEndpoint } from './factory';

export const quotesList = defineEndpoint('quotes.list');
export const quotesGet = defineEndpoint('quotes.get');
export const quotesCreateInvoice = defineEndpoint('quotes.createInvoice');
export const quotesStatus = defineEndpoint('quotes.status');

export const endpoints = {
	quotes: {
		list: quotesList,
		get: quotesGet,
		createInvoice: quotesCreateInvoice,
		status: quotesStatus,
	},
} as const;
