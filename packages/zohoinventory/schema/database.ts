import { z } from 'zod';

/** Official organization fields from GET /organizations. */
export const ZohoInventoryOrganizationEntity = z
	.object({
		id: z.string(),
		organization_id: z.string(),
		name: z.string(),
		contact_name: z.string().optional(),
		email: z.string().optional(),
		is_default_org: z.boolean().optional(),
		language_code: z.string().optional(),
		fiscal_year_start_month: z.number().optional(),
		account_created_date: z.string().optional(),
		time_zone: z.string().optional(),
		is_org_active: z.boolean().optional(),
		currency_id: z.string().optional(),
		currency_code: z.string().optional(),
		currency_symbol: z.string().optional(),
		currency_format: z.string().optional(),
		price_precision: z.number().optional(),
		createdAt: z.coerce.date().nullable().optional(),
	})
	.passthrough();

/** Official item fields from GET /items. */
export const ZohoInventoryItemEntity = z
	.object({
		id: z.string(),
		item_id: z.string(),
		name: z.string(),
		sku: z.string().optional(),
		status: z.string().optional(),
		rate: z.number().optional(),
		purchase_rate: z.number().optional(),
		item_type: z.string().optional(),
		product_type: z.string().optional(),
		stock_on_hand: z.number().optional(),
		available_stock: z.number().optional(),
		createdAt: z.coerce.date().nullable().optional(),
	})
	.passthrough();

/** Official contact fields from GET /contacts. */
export const ZohoInventoryContactEntity = z
	.object({
		id: z.string(),
		contact_id: z.string(),
		contact_name: z.string(),
		company_name: z.string().optional(),
		contact_type: z.string().optional(),
		status: z.string().optional(),
		email: z.string().optional(),
		currency_code: z.string().optional(),
		outstanding_receivable_amount: z.number().optional(),
		outstanding_payable_amount: z.number().optional(),
		createdAt: z.coerce.date().nullable().optional(),
	})
	.passthrough();

/** Official sales order fields from GET /salesorders. */
export const ZohoInventorySalesOrderEntity = z
	.object({
		id: z.string(),
		salesorder_id: z.string(),
		salesorder_number: z.string().optional(),
		customer_id: z.string().optional(),
		customer_name: z.string().optional(),
		status: z.string().optional(),
		date: z.string().optional(),
		total: z.number().optional(),
		createdAt: z.coerce.date().nullable().optional(),
	})
	.passthrough();

/** Official invoice fields from GET /invoices. */
export const ZohoInventoryInvoiceEntity = z
	.object({
		id: z.string(),
		invoice_id: z.string(),
		invoice_number: z.string().optional(),
		customer_id: z.string().optional(),
		customer_name: z.string().optional(),
		status: z.string().optional(),
		date: z.string().optional(),
		total: z.number().optional(),
		balance: z.number().optional(),
		createdAt: z.coerce.date().nullable().optional(),
	})
	.passthrough();

/** Official credit note fields from GET /creditnotes. */
export const ZohoInventoryCreditNoteEntity = z
	.object({
		id: z.string(),
		creditnote_id: z.string(),
		creditnote_number: z.string().optional(),
		customer_id: z.string().optional(),
		status: z.string().optional(),
		total: z.number().optional(),
		balance: z.number().optional(),
		createdAt: z.coerce.date().nullable().optional(),
	})
	.passthrough();

export type ZohoInventoryOrganizationEntity = z.infer<
	typeof ZohoInventoryOrganizationEntity
>;
export type ZohoInventoryItemEntity = z.infer<typeof ZohoInventoryItemEntity>;
export type ZohoInventoryContactEntity = z.infer<
	typeof ZohoInventoryContactEntity
>;
export type ZohoInventorySalesOrderEntity = z.infer<
	typeof ZohoInventorySalesOrderEntity
>;
export type ZohoInventoryInvoiceEntity = z.infer<
	typeof ZohoInventoryInvoiceEntity
>;
export type ZohoInventoryCreditNoteEntity = z.infer<
	typeof ZohoInventoryCreditNoteEntity
>;
