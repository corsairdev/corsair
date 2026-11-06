import { z } from 'zod';

// NetSuite REST APIs represent HATEOAS navigation links as objects containing rel and href strings.
const netSuiteLinkSchema = z
	.object({
		rel: z.string().optional(),
		href: z.string().optional(),
	})
	.passthrough();

// NetSuite record references may be returned as reference objects ({ id, refName }), numeric IDs, or string names.
// The object branch is .passthrough() so custom subrecord fields and custom segment attributes survive.
const netSuiteReferenceObjectSchema = z
	.object({
		id: z.union([z.string(), z.number()]).optional(),
		refName: z.string().optional(),
	})
	.passthrough();

const netSuiteReferenceSchema = z.union([
	netSuiteReferenceObjectSchema,
	z.string(),
	z.number(),
]);

// NetSuite returns enum fields (status, itemType) as strings or reference objects depending on simpleEnumFormat.
const netSuiteStatusSchema = z.union([
	z.string(),
	netSuiteReferenceObjectSchema,
]);

// NetSuite line items and sublists contain heterogeneous properties (strings, numbers, nested reference objects).
// Unknown values are necessary because sublist row columns vary by record type and NetSuite custom configuration.
const netSuiteSublistSchema = z.union([
	z.array(z.record(z.string(), z.unknown())),
	z.record(z.string(), z.unknown()),
]);

const baseRecord = {
	id: z.union([z.string(), z.number()]).optional(),
	externalId: z.string().optional(),
	links: z.array(netSuiteLinkSchema).optional(),
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
		customer: netSuiteReferenceSchema.optional(),
		payment: z.number().optional(),
		total: z.number().optional(),
		tranDate: z.string().optional(),
		currency: netSuiteReferenceSchema.optional(),
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
		supervisor: netSuiteReferenceSchema.optional(),
	})
	.passthrough();

export const NetSuiteInvoiceEntity = z
	.object({
		...baseRecord,
		tranId: z.string().optional(),
		entity: netSuiteReferenceSchema.optional(),
		tranDate: z.string().optional(),
		status: netSuiteStatusSchema.optional(),
		total: z.number().optional(),
		balance: z.number().optional(),
		currency: netSuiteReferenceSchema.optional(),
	})
	.passthrough();

export const NetSuiteItemEntity = z
	.object({
		...baseRecord,
		itemId: z.string().optional(),
		displayName: z.string().optional(),
		// An enum field: { id, refName } unless the read used simpleEnumFormat.
		itemType: netSuiteStatusSchema.optional(),
		isInactive: z.boolean().optional(),
		basePrice: z.number().optional(),
		incomeAccount: netSuiteReferenceSchema.optional(),
	})
	.passthrough();

export const NetSuiteItemFulfillmentEntity = z
	.object({
		...baseRecord,
		tranId: z.string().optional(),
		entity: netSuiteReferenceSchema.optional(),
		tranDate: z.string().optional(),
		status: netSuiteStatusSchema.optional(),
	})
	.passthrough();

export const NetSuiteItemReceiptEntity = z
	.object({
		...baseRecord,
		tranId: z.string().optional(),
		entity: netSuiteReferenceSchema.optional(),
		tranDate: z.string().optional(),
		status: netSuiteStatusSchema.optional(),
	})
	.passthrough();

export const NetSuiteJournalEntryEntity = z
	.object({
		...baseRecord,
		tranId: z.string().optional(),
		tranDate: z.string().optional(),
		memo: z.string().optional(),
		approved: z.boolean().optional(),
		line: netSuiteSublistSchema.optional(),
	})
	.passthrough();

export const NetSuitePurchaseOrderEntity = z
	.object({
		...baseRecord,
		tranId: z.string().optional(),
		entity: netSuiteReferenceSchema.optional(),
		tranDate: z.string().optional(),
		status: netSuiteStatusSchema.optional(),
		total: z.number().optional(),
		item: netSuiteSublistSchema.optional(),
	})
	.passthrough();

export const NetSuiteSalesOrderEntity = z
	.object({
		...baseRecord,
		tranId: z.string().optional(),
		entity: netSuiteReferenceSchema.optional(),
		tranDate: z.string().optional(),
		status: netSuiteStatusSchema.optional(),
		total: z.number().optional(),
		item: netSuiteSublistSchema.optional(),
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
		entity: netSuiteReferenceSchema.optional(),
		tranDate: z.string().optional(),
		status: netSuiteStatusSchema.optional(),
		total: z.number().optional(),
		balance: z.number().optional(),
	})
	.passthrough();

export const NetSuiteVendorPaymentEntity = z
	.object({
		...baseRecord,
		tranId: z.string().optional(),
		entity: netSuiteReferenceSchema.optional(),
		tranDate: z.string().optional(),
		status: netSuiteStatusSchema.optional(),
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
