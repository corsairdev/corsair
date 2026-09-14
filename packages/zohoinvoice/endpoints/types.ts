import { z } from 'zod';

const id = z.union([z.string().min(1), z.number()]);
const organization = z.object({ organizationId: z.string().min(1) });
const page = z.object({
	page: z.number().int().min(1).optional(),
	perPage: z.number().int().min(1).max(200).optional(),
});
const queryFields = z
	.record(z.string(), z.union([z.string(), z.number(), z.boolean()]))
	.optional();

const AddressSchema = z
	.object({
		attention: z.string().optional(),
		address: z.string().optional(),
		street2: z.string().optional(),
		city: z.string().optional(),
		state: z.string().optional(),
		zip: z.union([z.string(), z.number()]).optional(),
		country: z.string().optional(),
		fax: z.union([z.string(), z.number()]).optional(),
		phone: z.string().optional(),
	})
	.loose();

const CustomFieldSchema = z
	.object({
		customfield_id: id.optional(),
		label: z.string().optional(),
		value: z.unknown().optional(),
	})
	.loose();
const ContactPersonSchema = z
	.object({
		first_name: z.string().optional(),
		last_name: z.string().optional(),
		email: z.string().email().optional(),
		phone: z.string().optional(),
		mobile: z.string().optional(),
	})
	.loose();
const LineItemSchema = z
	.object({
		item_id: id.optional(),
		name: z.string().optional(),
		description: z.string().optional(),
		rate: z.number().optional(),
		quantity: z.number().positive().optional(),
		unit: z.string().optional(),
		tax_id: id.optional(),
		discount: z.union([z.string(), z.number()]).optional(),
	})
	.loose();

const ContactSchema = z
	.object({
		contact_id: id,
		contact_name: z.string(),
		company_name: z.string().optional(),
		contact_type: z.string().optional(),
		status: z.string().optional(),
		email: z.string().email().optional(),
		phone: z.string().optional(),
		currency_code: z.string().optional(),
		payment_terms: z.number().optional(),
		billing_address: AddressSchema.optional(),
		shipping_address: AddressSchema.optional(),
		contact_persons: z.array(ContactPersonSchema).optional(),
		custom_fields: z.array(CustomFieldSchema).optional(),
		created_time: z.string().optional(),
		last_modified_time: z.string().optional(),
	})
	.loose();
const InvoiceSchema = z
	.object({
		invoice_id: id,
		invoice_number: z.string().optional(),
		customer_id: id.optional(),
		customer_name: z.string().optional(),
		status: z.string().optional(),
		date: z.string().optional(),
		due_date: z.string().optional(),
		total: z.union([z.string(), z.number()]).optional(),
		balance: z.union([z.string(), z.number()]).optional(),
		line_items: z.array(LineItemSchema).optional(),
		billing_address: AddressSchema.optional(),
		shipping_address: AddressSchema.optional(),
		custom_fields: z.array(CustomFieldSchema).optional(),
	})
	.loose();
const ItemSchema = z
	.object({
		item_id: id,
		name: z.string(),
		status: z.string().optional(),
		description: z.string().optional(),
		rate: z.number().optional(),
		unit: z.string().optional(),
		sku: z.string().optional(),
		product_type: z.enum(['goods', 'service']).optional(),
		tax_id: id.optional(),
		custom_fields: z.array(CustomFieldSchema).optional(),
	})
	.loose();
const PaymentSchema = z
	.object({
		payment_id: id,
		payment_mode: z.string().optional(),
		amount: z.number().optional(),
		date: z.string().optional(),
		status: z.string().optional(),
		customer_id: id.optional(),
		customer_name: z.string().optional(),
		reference_number: z.string().optional(),
		invoices: z.array(z.record(z.string(), z.unknown())).optional(),
	})
	.loose();
const EstimateSchema = z
	.object({
		estimate_id: id,
		estimate_number: z.string().optional(),
		customer_id: id.optional(),
		customer_name: z.string().optional(),
		status: z.string().optional(),
		date: z.string().optional(),
		expiry_date: z.string().optional(),
		total: z.number().optional(),
		line_items: z.array(LineItemSchema).optional(),
	})
	.loose();

const body = z.record(z.string(), z.unknown());
const list = (key: string, schema: z.ZodType) =>
	z.object({ [key]: z.array(schema) }).loose();
const single = (key: string, schema: z.ZodType) =>
	z.object({ [key]: schema }).loose();

export const ZohoInvoiceEndpointInputSchemas = {
	customersList: organization.extend(page.shape).extend({ query: queryFields }),
	customersGet: organization.extend({ contactId: id }),
	customersCreate: organization.extend({
		body: body.refine(
			(value) =>
				typeof value.contact_name === 'string' && value.contact_name.length > 0,
			'contact_name is required',
		),
	}),
	customersUpdate: organization.extend({ contactId: id, body: body }),
	invoicesList: organization.extend(page.shape).extend({ query: queryFields }),
	invoicesGet: organization.extend({ invoiceId: id }),
	invoicesCreate: organization.extend({
		body: body.refine(
			(value) =>
				typeof value.customer_id !== 'undefined' &&
				typeof value.date === 'string' &&
				Array.isArray(value.line_items),
			'customer_id, date, and line_items are required',
		),
	}),
	invoicesUpdate: organization.extend({ invoiceId: id, body }),
	invoicesDelete: organization.extend({ invoiceId: id }),
	itemsList: organization.extend(page.shape).extend({ query: queryFields }),
	itemsGet: organization.extend({ itemId: id }),
	itemsCreate: organization.extend({
		body: body.refine(
			(value) =>
				typeof value.name === 'string' && typeof value.rate === 'number',
			'name and rate are required',
		),
	}),
	itemsUpdate: organization.extend({ itemId: id, body }),
	paymentsList: organization.extend(page.shape).extend({ query: queryFields }),
	paymentsGet: organization.extend({ paymentId: id }),
	estimatesList: organization.extend(page.shape).extend({ query: queryFields }),
	estimatesGet: organization.extend({ estimateId: id }),
	estimatesCreate: organization.extend({
		body: body.refine(
			(value) =>
				typeof value.customer_id !== 'undefined' &&
				Array.isArray(value.line_items),
			'customer_id and line_items are required',
		),
	}),
	estimatesUpdate: organization.extend({ estimateId: id, body }),
} as const;

export const ZohoInvoiceEndpointOutputSchemas = {
	customersList: list('contacts', ContactSchema),
	customersGet: single('contact', ContactSchema),
	customersCreate: single('contact', ContactSchema),
	customersUpdate: single('contact', ContactSchema),
	invoicesList: list('invoices', InvoiceSchema),
	invoicesGet: single('invoice', InvoiceSchema),
	invoicesCreate: single('invoice', InvoiceSchema),
	invoicesUpdate: single('invoice', InvoiceSchema),
	invoicesDelete: z.object({ code: z.number(), message: z.string() }).loose(),
	itemsList: list('items', ItemSchema),
	itemsGet: single('item', ItemSchema),
	itemsCreate: single('item', ItemSchema),
	itemsUpdate: single('item', ItemSchema),
	paymentsList: list('customerpayments', PaymentSchema),
	paymentsGet: single('payment', PaymentSchema),
	estimatesList: list('estimates', EstimateSchema),
	estimatesGet: single('estimate', EstimateSchema),
	estimatesCreate: single('estimate', EstimateSchema),
	estimatesUpdate: single('estimate', EstimateSchema),
} as const;

export type ZohoInvoiceEndpointInputs = {
	[K in keyof typeof ZohoInvoiceEndpointInputSchemas]: z.infer<
		(typeof ZohoInvoiceEndpointInputSchemas)[K]
	>;
};
export type ZohoInvoiceEndpointOutputs = {
	[K in keyof typeof ZohoInvoiceEndpointOutputSchemas]: z.infer<
		(typeof ZohoInvoiceEndpointOutputSchemas)[K]
	>;
};
