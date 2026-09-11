import {
	XeroAccount,
	XeroBankTransaction,
	XeroContact,
	XeroCreditNote,
	XeroInvoice,
	XeroItem,
	XeroPayment,
	XeroPurchaseOrder,
	XeroQuote,
} from './database';

export const XeroSchema = {
	version: '1.0.0',
	entities: {
		contacts: XeroContact,
		invoices: XeroInvoice,
		bankTransactions: XeroBankTransaction,
		accounts: XeroAccount,
		items: XeroItem,
		payments: XeroPayment,
		purchaseOrders: XeroPurchaseOrder,
		creditNotes: XeroCreditNote,
		quotes: XeroQuote,
	},
} as const;

export * from './database';
