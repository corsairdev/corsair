import { z } from 'zod';

const PaginationSchema = z.object({
	page: z.number().int().positive().optional(),
	per_page: z.number().int().min(1).max(100).optional(),
	view: z.string().optional(),
	sort: z.string().optional(),
	updated_since: z.string().datetime({ offset: true }).optional(),
	from_date: z.string().date().optional(),
	to_date: z.string().date().optional(),
});

const ContactFieldsSchema = z
	.object({
		first_name: z.string().optional(),
		last_name: z.string().optional(),
		organisation_name: z.string().optional(),
		email: z.string().optional(),
		billing_email: z.string().optional(),
		phone_number: z.string().optional(),
		mobile: z.string().optional(),
		address1: z.string().optional(),
		address2: z.string().optional(),
		address3: z.string().optional(),
		town: z.string().optional(),
		region: z.string().optional(),
		postcode: z.string().optional(),
		country: z.string().optional(),
		contact_name_on_invoices: z.boolean().optional(),
		default_payment_terms_in_days: z.number().int().optional(),
		locale: z.string().optional(),
		uses_contact_invoice_sequence: z.boolean().optional(),
		charge_sales_tax: z.enum(['Auto', 'Always', 'Never']).optional(),
		sales_tax_registration_number: z.string().optional(),
		status: z.enum(['Active', 'Hidden']).optional(),
		is_cis_subcontractor: z.boolean().optional(),
		cis_deduction_rate: z
			.enum(['cis_gross', 'cis_standard', 'cis_higher'])
			.optional(),
		unique_tax_reference: z.string().optional(),
		subcontractor_verification_number: z.string().optional(),
	})
	.strict();

const ContactSchema = ContactFieldsSchema.extend({
	url: z.string().url().optional(),
	active_projects_count: z.number().optional(),
	direct_debit_mandate_state: z.string().optional(),
	created_at: z.string().optional(),
	updated_at: z.string().optional(),
}).passthrough();

const ProjectFieldsSchema = z
	.object({
		contact: z.string().url().optional(),
		name: z.string().optional(),
		status: z.enum(['Active', 'Completed', 'Cancelled', 'Hidden']).optional(),
		contract_po_reference: z.string().optional(),
		uses_project_invoice_sequence: z.boolean().optional(),
		currency: z.string().optional(),
		budget: z.number().optional(),
		budget_units: z.enum(['Hours', 'Days', 'Monetary']).optional(),
		hours_per_day: z.number().optional(),
		normal_billing_rate: z.number().optional(),
		billing_period: z.enum(['hour', 'day']).optional(),
		is_ir35: z.boolean().optional(),
		starts_on: z.string().date().optional(),
		ends_on: z.string().date().optional(),
		include_unbilled_time_in_profitability: z.boolean().optional(),
	})
	.strict();

const ProjectSchema = ProjectFieldsSchema.extend({
	url: z.string().url().optional(),
	contact_name: z.string().optional(),
	is_deletable: z.boolean().optional(),
	created_at: z.string().optional(),
	updated_at: z.string().optional(),
}).passthrough();

const InvoiceItemInputSchema = z
	.object({
		position: z.number().optional(),
		item_type: z
			.enum([
				'Hours',
				'Days',
				'Weeks',
				'Months',
				'Years',
				'Products',
				'Services',
				'Training',
				'Expenses',
				'Comment',
				'Bills',
				'Discount',
				'Credit',
				'VAT',
				'Stock',
			])
			.optional(),
		quantity: z.number().optional(),
		description: z.string(),
		price: z.number().optional(),
		sales_tax_rate: z.number().optional(),
		second_sales_tax_rate: z.number().optional(),
		sales_tax_status: z.enum(['TAXABLE', 'EXEMPT']).optional(),
		second_sales_tax_status: z.string().optional(),
		stock_item: z.string().url().optional(),
		category: z.string().url().optional(),
		project: z.string().url().optional(),
	})
	.strict();

const InvoiceFieldsSchema = z
	.object({
		contact: z.string().url().optional(),
		project: z.string().url().optional(),
		property: z.string().url().optional(),
		include_timeslips: z.string().nullable().optional(),
		include_expenses: z.string().nullable().optional(),
		include_estimates: z.string().nullable().optional(),
		reference: z.string().optional(),
		dated_on: z.string().date().optional(),
		due_on: z.string().date().optional(),
		payment_terms_in_days: z.number().int().optional(),
		currency: z.string().optional(),
		cis_rate: z.string().nullable().optional(),
		cis_deduction_rate: z.number().optional(),
		comments: z.string().optional(),
		send_new_invoice_emails: z.boolean().optional(),
		send_reminder_emails: z.boolean().optional(),
		send_thank_you_emails: z.boolean().optional(),
		discount_percent: z.number().optional(),
		client_contact_name: z.string().optional(),
		payment_terms: z.string().optional(),
		po_reference: z.string().optional(),
		bank_account: z.string().url().optional(),
		omit_header: z.boolean().optional(),
		show_project_name: z.boolean().optional(),
		always_show_bic_and_iban: z.boolean().optional(),
		ec_status: z
			.enum([
				'UK/Non-EC',
				'EC Goods',
				'EC Services',
				'Reverse Charge',
				'EC VAT MOSS',
			])
			.optional(),
		place_of_supply: z.string().optional(),
		invoice_items: z.array(InvoiceItemInputSchema).optional(),
	})
	.strict();

const InvoiceSchema = InvoiceFieldsSchema.extend({
	url: z.string().url().optional(),
	status: z.string().optional(),
	long_status: z.string().optional(),
	net_value: z.string().optional(),
	total_value: z.string().optional(),
	paid_value: z.string().optional(),
	due_value: z.string().optional(),
	paid_on: z.string().optional(),
	created_at: z.string().optional(),
	updated_at: z.string().optional(),
}).passthrough();

export const FreeAgentEndpointInputSchemas = {
	companyGet: z.object({}).strict(),
	contactsList: z.object({ query: PaginationSchema.optional() }).strict(),
	contactsGet: z.object({ id: z.string().min(1) }).strict(),
	contactsCreate: z.object({ contact: ContactFieldsSchema }).strict(),
	contactsUpdate: z
		.object({ id: z.string().min(1), contact: ContactFieldsSchema })
		.strict(),
	contactsDelete: z.object({ id: z.string().min(1) }).strict(),
	projectsList: z
		.object({
			query: PaginationSchema.extend({
				contact: z.string().url().optional(),
				nested: z.boolean().optional(),
			}).optional(),
		})
		.strict(),
	projectsGet: z.object({ id: z.string().min(1) }).strict(),
	projectsCreate: z.object({ project: ProjectFieldsSchema }).strict(),
	projectsUpdate: z
		.object({ id: z.string().min(1), project: ProjectFieldsSchema })
		.strict(),
	projectsDelete: z.object({ id: z.string().min(1) }).strict(),
	invoicesList: z
		.object({
			query: PaginationSchema.extend({
				contact: z.string().url().optional(),
				project: z.string().url().optional(),
				nested_invoice_items: z.boolean().optional(),
			}).optional(),
		})
		.strict(),
	invoicesGet: z.object({ id: z.string().min(1) }).strict(),
	invoicesCreate: z.object({ invoice: InvoiceFieldsSchema }).strict(),
	invoicesUpdate: z
		.object({ id: z.string().min(1), invoice: InvoiceFieldsSchema })
		.strict(),
	invoicesDelete: z.object({ id: z.string().min(1) }).strict(),
	invoicesMarkSent: z.object({ id: z.string().min(1) }).strict(),
	invoicesSendEmail: z
		.object({
			id: z.string().min(1),
			email: z
				.object({
					to: z.string().optional(),
					from: z.string().optional(),
					subject: z.string().optional(),
					body: z.string().optional(),
					email_to_sender: z.boolean().optional(),
					attach_expense_receipts: z.boolean().optional(),
					use_template: z.boolean().optional(),
				})
				.strict(),
		})
		.strict(),
} as const;

export const FreeAgentEndpointOutputSchemas = {
	companyGet: z
		.object({ company: z.record(z.string(), z.json()) })
		.passthrough(),
	contactsList: z.object({ contacts: z.array(ContactSchema) }).passthrough(),
	contactsGet: z.object({ contact: ContactSchema }).passthrough(),
	contactsCreate: z.object({ contact: ContactSchema }).passthrough(),
	contactsUpdate: z.object({}).passthrough(),
	contactsDelete: z.object({}).passthrough(),
	projectsList: z.object({ projects: z.array(ProjectSchema) }).passthrough(),
	projectsGet: z.object({ project: ProjectSchema }).passthrough(),
	projectsCreate: z.object({ project: ProjectSchema }).passthrough(),
	projectsUpdate: z.object({}).passthrough(),
	projectsDelete: z.object({}).passthrough(),
	invoicesList: z.object({ invoices: z.array(InvoiceSchema) }).passthrough(),
	invoicesGet: z.object({ invoice: InvoiceSchema }).passthrough(),
	invoicesCreate: z.object({ invoice: InvoiceSchema }).passthrough(),
	invoicesUpdate: z.object({}).passthrough(),
	invoicesDelete: z.object({}).passthrough(),
	invoicesMarkSent: z.object({}).passthrough(),
	invoicesSendEmail: z.object({}).passthrough(),
} as const;

export type FreeAgentEndpointInputs = {
	[K in keyof typeof FreeAgentEndpointInputSchemas]: z.infer<
		(typeof FreeAgentEndpointInputSchemas)[K]
	>;
};
export type FreeAgentEndpointOutputs = {
	[K in keyof typeof FreeAgentEndpointOutputSchemas]: z.infer<
		(typeof FreeAgentEndpointOutputSchemas)[K]
	>;
};
