import { z } from 'zod';

const baseEntity = z.object({
	id: z.string(),
	data: z.record(z.string(), z.unknown()),
	created_at: z.coerce.date().nullable().optional(),
	updated_at: z.coerce.date().nullable().optional(),
});

export const ZohoInvoiceCustomer = baseEntity;
export const ZohoInvoiceInvoice = baseEntity;
export const ZohoInvoiceItem = baseEntity;
export const ZohoInvoicePayment = baseEntity;
export const ZohoInvoiceEstimate = baseEntity;

export type ZohoInvoiceCustomer = z.infer<typeof ZohoInvoiceCustomer>;
export type ZohoInvoiceInvoice = z.infer<typeof ZohoInvoiceInvoice>;
export type ZohoInvoiceItem = z.infer<typeof ZohoInvoiceItem>;
export type ZohoInvoicePayment = z.infer<typeof ZohoInvoicePayment>;
export type ZohoInvoiceEstimate = z.infer<typeof ZohoInvoiceEstimate>;
