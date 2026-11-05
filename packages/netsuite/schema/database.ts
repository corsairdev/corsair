import { z } from 'zod';

const baseRecord = {
	id: z.union([z.string(), z.number()]).optional(),
	externalId: z.string().optional(),
	links: z.array(z.unknown()).optional(),
};

export const NetSuiteCustomerEntity = z
	.object({
		...baseRecord,
		entityId: z.string().optional(),
		companyName: z.string().optional(),
		email: z.string().optional(),
		phone: z.string().optional(),
		isInactive: z.boolean().optional(),
		dateCreated: z.string().optional(),
		lastModifiedDate: z.string().optional(),
	})
	.passthrough();

export const NetSuiteCustomerPaymentEntity = z
	.object({
		...baseRecord,
		tranId: z.string().optional(),
		customer: z.unknown().optional(),
		payment: z.number().optional(),
		total: z.number().optional(),
		trandate: z.string().optional(),
		currency: z.unknown().optional(),
	})
	.passthrough();

export const NetSuiteEmployeeEntity = z
	.object({
		...baseRecord,
		entityId: z.string().optional(),
		firstName: z.string().optional(),
		lastName: z.string().optional(),
		email: z.string().optional(),
		isInactive: z.boolean().optional(),
		supervisor: z.unknown().optional(),
	})
	.passthrough();

export const NetSuiteInvoiceEntity = z
	.object({
		...baseRecord,
		tranId: z.string().optional(),
		entity: z.unknown().optional(),
		tranDate: z.string().optional(),
		status: z.string().optional(),
		total: z.number().optional(),
		balance: z.number().optional(),
		currency: z.unknown().optional(),
	})
	.passthrough();

export const NetSuiteItemEntity = z
	.object({
		...baseRecord,
		itemId: z.string().optional(),
		displayName: z.string().optional(),
		itemType: z.string().optional(),
		isInactive: z.boolean().optional(),
		basePrice: z.number().optional(),
		incomeAccount: z.unknown().optional(),
	})
	.passthrough();

export const NetSuiteItemFulfillmentEntity = z
	.object({
		...baseRecord,
		tranId: z.string().optional(),
		entity: z.unknown().optional(),
		tranDate: z.string().optional(),
		status: z.string().optional(),
	})
	.passthrough();

export const NetSuiteItemReceiptEntity = z
	.object({
		...baseRecord,
		tranId: z.string().optional(),
		entity: z.unknown().optional(),
		tranDate: z.string().optional(),
		status: z.string().optional(),
	})
	.passthrough();

export const NetSuiteJournalEntryEntity = z
	.object({
		...baseRecord,
		tranId: z.string().optional(),
		tranDate: z.string().optional(),
		memo: z.string().optional(),
		approved: z.boolean().optional(),
		line: z.unknown().optional(),
	})
	.passthrough();

export const NetSuitePurchaseOrderEntity = z
	.object({
		...baseRecord,
		tranId: z.string().optional(),
		entity: z.unknown().optional(),
		tranDate: z.string().optional(),
		status: z.string().optional(),
		total: z.number().optional(),
		item: z.unknown().optional(),
	})
	.passthrough();

export const NetSuiteSalesOrderEntity = z
	.object({
		...baseRecord,
		tranId: z.string().optional(),
		entity: z.unknown().optional(),
		tranDate: z.string().optional(),
		status: z.string().optional(),
		total: z.number().optional(),
		item: z.unknown().optional(),
	})
	.passthrough();

export const NetSuiteVendorEntity = z
	.object({
		...baseRecord,
		entityId: z.string().optional(),
		companyName: z.string().optional(),
		email: z.string().optional(),
		phone: z.string().optional(),
		isInactive: z.boolean().optional(),
	})
	.passthrough();

export const NetSuiteVendorBillEntity = z
	.object({
		...baseRecord,
		tranId: z.string().optional(),
		entity: z.unknown().optional(),
		tranDate: z.string().optional(),
		status: z.string().optional(),
		total: z.number().optional(),
		balance: z.number().optional(),
	})
	.passthrough();

export const NetSuiteVendorPaymentEntity = z
	.object({
		...baseRecord,
		tranId: z.string().optional(),
		entity: z.unknown().optional(),
		tranDate: z.string().optional(),
		status: z.string().optional(),
		total: z.number().optional(),
	})
	.passthrough();

export type NetSuiteCustomerEntity = z.infer<typeof NetSuiteCustomerEntity>;
export type NetSuiteCustomerPaymentEntity = z.infer<
	typeof NetSuiteCustomerPaymentEntity
>;
export type NetSuiteEmployeeEntity = z.infer<typeof NetSuiteEmployeeEntity>;
export type NetSuiteInvoiceEntity = z.infer<typeof NetSuiteInvoiceEntity>;
export type NetSuiteItemEntity = z.infer<typeof NetSuiteItemEntity>;
export type NetSuiteItemFulfillmentEntity = z.infer<
	typeof NetSuiteItemFulfillmentEntity
>;
export type NetSuiteItemReceiptEntity = z.infer<
	typeof NetSuiteItemReceiptEntity
>;
export type NetSuiteJournalEntryEntity = z.infer<
	typeof NetSuiteJournalEntryEntity
>;
export type NetSuitePurchaseOrderEntity = z.infer<
	typeof NetSuitePurchaseOrderEntity
>;
export type NetSuiteSalesOrderEntity = z.infer<typeof NetSuiteSalesOrderEntity>;
export type NetSuiteVendorEntity = z.infer<typeof NetSuiteVendorEntity>;
export type NetSuiteVendorBillEntity = z.infer<typeof NetSuiteVendorBillEntity>;
export type NetSuiteVendorPaymentEntity = z.infer<
	typeof NetSuiteVendorPaymentEntity
>;
