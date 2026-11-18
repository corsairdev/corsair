import { z } from 'zod';
import {
	NetSuiteCustomerEntity,
	NetSuiteCustomerPaymentEntity,
	NetSuiteEmployeeEntity,
	NetSuiteInvoiceEntity,
	NetSuiteItemEntity,
	NetSuiteItemFulfillmentEntity,
	NetSuiteItemReceiptEntity,
	NetSuiteJournalEntryEntity,
	NetSuitePurchaseOrderEntity,
	NetSuiteSalesOrderEntity,
	NetSuiteVendorBillEntity,
	NetSuiteVendorEntity,
	NetSuiteVendorPaymentEntity,
} from './database';

export const NetSuiteCredentials = z.object({
	accountId: z.string(),
	clientId: z.string(),
	clientSecret: z.string(),
	accessToken: z.string(),
	refreshToken: z.string(),
});

export type NetSuiteCredentials = z.infer<typeof NetSuiteCredentials>;

export const NetSuiteSchema = {
	version: '1.0.0',
	entities: {
		customers: NetSuiteCustomerEntity,
		customerPayments: NetSuiteCustomerPaymentEntity,
		employees: NetSuiteEmployeeEntity,
		invoices: NetSuiteInvoiceEntity,
		items: NetSuiteItemEntity,
		itemFulfillments: NetSuiteItemFulfillmentEntity,
		itemReceipts: NetSuiteItemReceiptEntity,
		journalEntries: NetSuiteJournalEntryEntity,
		purchaseOrders: NetSuitePurchaseOrderEntity,
		salesOrders: NetSuiteSalesOrderEntity,
		vendors: NetSuiteVendorEntity,
		vendorBills: NetSuiteVendorBillEntity,
		vendorPayments: NetSuiteVendorPaymentEntity,
	},
} as const;

export * from './database';
