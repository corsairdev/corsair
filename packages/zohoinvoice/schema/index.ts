import {
	ZohoInvoiceCustomer,
	ZohoInvoiceEstimate,
	ZohoInvoiceInvoice,
	ZohoInvoiceItem,
	ZohoInvoicePayment,
} from './database';

export const ZohoInvoiceSchema = {
	version: '1.0.0',
	entities: {
		customers: ZohoInvoiceCustomer,
		invoices: ZohoInvoiceInvoice,
		items: ZohoInvoiceItem,
		payments: ZohoInvoicePayment,
		estimates: ZohoInvoiceEstimate,
	},
} as const;

export * from './database';
