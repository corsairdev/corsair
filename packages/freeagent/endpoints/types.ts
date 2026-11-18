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

const PageQuerySchema = z
	.object({
		page: z.number().int().positive().optional(),
		per_page: z.number().int().min(1).max(100).optional(),
	})
	.strict();

// Current FreeAgent invoice docs name these online methods; the forum documents the Stripe/GoCardless pre-authorisation mutual exclusion.
const PaymentMethodsSchema = z
	.object({
		paypal: z.boolean().optional(),
		gocardless_preauth: z.boolean().optional(),
		gocardless_instant_bank_pay: z.boolean().optional(),
		stripe: z.boolean().optional(),
		tyl: z.boolean().optional(),
	})
	.strict()
	.superRefine((methods, context) => {
		if (methods.stripe === true && methods.gocardless_preauth === true) {
			context.addIssue({
				code: 'custom',
				message:
					'Stripe and GoCardless pre-authorised debit cannot both be enabled',
			});
		}
	});

const TrackingGroupLabelSchema = z
	.object({
		url: z.string().url(),
		name: z.string(),
		status: z.enum(['active', 'hidden']),
	})
	.passthrough();

// Passthrough matches FreeAgent's documented extensible tracking-group response objects.
const TrackingGroupSchema = z
	.object({
		url: z.string().url(),
		name: z.string().max(50),
		status: z.enum(['active', 'hidden']),
		labels: z.array(TrackingGroupLabelSchema),
		created_at: z.string().datetime({ offset: true }),
		updated_at: z.string().datetime({ offset: true }),
	})
	.passthrough();

const RecurringInvoiceItemSchema = z
	.object({
		url: z.string().url().optional(),
		position: z.number().optional(),
		description: z.string().optional(),
		item_type: z.string().optional(),
		price: z.union([z.string(), z.number()]).optional(),
		quantity: z.union([z.string(), z.number()]).optional(),
		sales_tax_rate: z.union([z.string(), z.number()]).optional(),
		sales_tax_status: z.enum(['TAXABLE', 'EXEMPT']).optional(),
		category: z.string().url().optional(),
	})
	.passthrough();

// Passthrough preserves documented invoice attributes that can vary by company setup.
const RecurringInvoiceSchema = z
	.object({
		url: z.string().url(),
		contact: z.string().url(),
		contact_name: z.string().optional(),
		reference: z.string().optional(),
		dated_on: z.string().date(),
		frequency: z.enum([
			'Weekly',
			'Two Weekly',
			'Four Weekly',
			'Monthly',
			'Two Monthly',
			'Quarterly',
			'Biannually',
			'Annually',
			'2-Yearly',
		]),
		next_recurs_on: z.string().date(),
		recurring_end_date: z.union([z.string().date(), z.literal('')]).optional(),
		recurring_status: z.enum(['Draft', 'Active']),
		currency: z.string().optional(),
		exchange_rate: z.string().optional(),
		net_value: z.string().optional(),
		sales_tax_value: z.string().optional(),
		total_value: z.string().optional(),
		omit_header: z.boolean().optional(),
		always_show_bic_and_iban: z.boolean().optional(),
		payment_terms_in_days: z.number().int().optional(),
		invoice_items: z.array(RecurringInvoiceItemSchema).optional(),
		payment_methods: PaymentMethodsSchema.optional(),
	})
	.passthrough();

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

const ContactCreateSchema = ContactFieldsSchema.superRefine(
	(contact, context) => {
		if (contact.organisation_name || (contact.first_name && contact.last_name))
			return;
		context.addIssue({
			code: 'custom',
			message: 'Provide organisation_name or both first_name and last_name',
		});
	},
);

// FreeAgent sends decimals as strings ("50.0") and may add enum values, so
// responses read numbers and enums loosely; inputs above stay strict.
const DecimalSchema = z.union([z.string(), z.number()]);

const ContactSchema = ContactFieldsSchema.extend({
	default_payment_terms_in_days: DecimalSchema.nullable().optional(),
	charge_sales_tax: z.string().nullable().optional(),
	status: z.string().nullable().optional(),
	cis_deduction_rate: z.string().nullable().optional(),
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

const ProjectCreateSchema = ProjectFieldsSchema.extend({
	contact: z.string().url(),
	name: z.string().min(1),
	status: z.enum(['Active', 'Completed', 'Cancelled', 'Hidden']),
	currency: z.string().min(1),
	budget_units: z.enum(['Hours', 'Days', 'Monetary']),
});

const ProjectSchema = ProjectFieldsSchema.extend({
	// A URL, or the documented contact response object when nested: true.
	contact: z.union([z.string().url(), ContactSchema]).optional(),
	name: z.string().optional(),
	status: z.string().optional(),
	currency: z.string().optional(),
	budget_units: z.string().optional(),
	budget: DecimalSchema.nullable().optional(),
	hours_per_day: DecimalSchema.nullable().optional(),
	normal_billing_rate: DecimalSchema.nullable().optional(),
	billing_period: z.string().nullable().optional(),
	starts_on: z.string().nullable().optional(),
	ends_on: z.string().nullable().optional(),
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

// On update, an existing line is matched by its id (the last part of its url);
// `_destroy: 1` with the id removes it. New lines use the create shape.
const InvoiceItemUpdateInputSchema = z.union([
	InvoiceItemInputSchema.extend({
		id: z.union([z.string().min(1), z.number().int()]),
		description: z.string().optional(),
	}).strict(),
	z
		.object({
			id: z.union([z.string().min(1), z.number().int()]),
			_destroy: z.literal(1),
		})
		.strict(),
	InvoiceItemInputSchema,
]);

const InvoiceItemResponseSchema = z
	.object({
		url: z.string().url().optional(),
		position: z.union([z.string(), z.number()]).optional(),
		item_type: z.string().optional(),
		description: z.string().optional(),
		price: z.union([z.string(), z.number()]).optional(),
		quantity: z.union([z.string(), z.number()]).optional(),
		sales_tax_rate: z.union([z.string(), z.number()]).optional(),
		second_sales_tax_rate: z.union([z.string(), z.number()]).optional(),
		sales_tax_status: z.string().optional(),
		second_sales_tax_status: z.string().optional(),
		suffers_cis_deduction: z.boolean().optional(),
		stock_item: z.string().url().optional(),
		category: z.string().url().optional(),
		project: z.string().url().optional(),
	})
	// Invoice item responses include provider-generated fields and can grow over time.
	.passthrough();

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
		payment_methods: PaymentMethodsSchema.optional(),
		invoice_items: z.array(InvoiceItemInputSchema).optional(),
	})
	.strict();

const InvoiceCreateSchema = InvoiceFieldsSchema.extend({
	contact: z.string().url(),
	dated_on: z.string().date(),
	payment_terms_in_days: z.number().int(),
});

const InvoiceSchema = InvoiceFieldsSchema.omit({ invoice_items: true })
	.extend({
		dated_on: z.string().optional(),
		due_on: z.string().nullable().optional(),
		payment_terms_in_days: DecimalSchema.nullable().optional(),
		cis_deduction_rate: DecimalSchema.nullable().optional(),
		discount_percent: DecimalSchema.nullable().optional(),
		ec_status: z.string().nullable().optional(),
		invoice_items: z.array(InvoiceItemResponseSchema).optional(),
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
	})
	.passthrough();

const InvoiceEmailAttachmentSchema = z
	.object({
		content_type: z.string().min(1),
		data: z
			.string()
			.min(1)
			.max(6_990_508)
			.regex(/^[A-Za-z0-9+/]*={0,2}$/),
		file_name: z.string().min(1),
	})
	.strict()
	.superRefine((attachment, context) => {
		const padding = attachment.data.endsWith('==')
			? 2
			: attachment.data.endsWith('=')
				? 1
				: 0;
		const decodedByteLength = (attachment.data.length * 3) / 4 - padding;
		if (attachment.data.length % 4 !== 0) {
			context.addIssue({
				code: 'custom',
				message: 'Attachment data must be valid base64',
			});
		} else if (decodedByteLength > 5 * 1024 * 1024) {
			context.addIssue({
				code: 'custom',
				message: 'Each email attachment must be 5 MB or smaller',
			});
		}
	});

const CreditNoteItemSchema = z
	.object({
		url: z.string().url().optional(),
		position: z.union([z.string(), z.number()]).optional(),
		description: z.string().optional(),
		item_type: z.string().optional(),
		price: z.union([z.string(), z.number()]).optional(),
		quantity: z.union([z.string(), z.number()]).optional(),
		sales_tax_rate: z.union([z.string(), z.number()]).optional(),
		second_sales_tax_rate: z.union([z.string(), z.number()]).optional(),
		suffers_cis_deduction: z.boolean().optional(),
		sales_tax_status: z.string().optional(),
		second_sales_tax_status: z.string().optional(),
		stock_item: z.string().url().optional(),
		category: z.string().url().optional(),
		project: z.string().url().optional(),
	})
	.passthrough();

// Passthrough matches FreeAgent's documented extensible credit-note response objects.
const CreditNoteSchema = z
	.object({
		url: z.string().url().optional(),
		contact: z.string().url().optional(),
		project: z.string().url().optional(),
		property: z.string().url().optional(),
		reference: z.string().optional(),
		dated_on: z.string().date().optional(),
		due_on: z.string().date().optional(),
		payment_terms_in_days: z.number().int().optional(),
		currency: z.string().optional(),
		cis_rate: z.string().nullable().optional(),
		cis_deduction_rate: z.union([z.string(), z.number()]).optional(),
		comments: z.string().optional(),
		discount_percent: z.union([z.string(), z.number()]).optional(),
		client_contact_name: z.string().optional(),
		payment_terms: z.string().optional(),
		po_reference: z.string().optional(),
		bank_account: z.string().url().optional(),
		omit_header: z.boolean().optional(),
		show_project_name: z.boolean().optional(),
		ec_status: z.string().optional(),
		place_of_supply: z.string().optional(),
		net_value: z.union([z.string(), z.number()]).optional(),
		exchange_rate: z.union([z.string(), z.number()]).optional(),
		involves_sales_tax: z.boolean().optional(),
		sales_tax_value: z.union([z.string(), z.number()]).optional(),
		second_sales_tax_value: z.union([z.string(), z.number()]).optional(),
		total_value: z.union([z.string(), z.number()]).optional(),
		refunded_value: z.union([z.string(), z.number()]).optional(),
		due_value: z.union([z.string(), z.number()]).optional(),
		is_interim_uk_vat: z.boolean().optional(),
		refunded_on: z.string().date().optional(),
		written_off_date: z.string().date().optional(),
		status: z
			.enum(['Draft', 'Open', 'Overdue', 'Refunded', 'Written-off'])
			.optional(),
		long_status: z.string().optional(),
		contact_name: z.string().optional(),
		credit_note_items: z.array(CreditNoteItemSchema).optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
	})
	.passthrough();

const PaginationHeadersSchema = z.object({
	link: z.string().nullable(),
	total_count: z.string().regex(/^\d+$/).nullable(),
});
const EmptyResponseSchema = z.union([z.object({}).strict(), z.undefined()]);

const ContactsListResponseSchema = z
	.object({ contacts: z.array(ContactSchema) })
	.passthrough();
const ProjectsListResponseSchema = z
	.object({ projects: z.array(ProjectSchema) })
	.passthrough();
const InvoicesListResponseSchema = z
	.object({ invoices: z.array(InvoiceSchema) })
	.passthrough();

export const FreeAgentEndpointInputSchemas = {
	companyGet: z.object({}).strict(),
	companyBusinessCategories: z.object({}).strict(),
	companyTaxTimeline: z.object({}).strict(),
	emailAddressesList: z.object({ query: PageQuerySchema.optional() }).strict(),
	contactsList: z.object({ query: PaginationSchema.optional() }).strict(),
	contactsGet: z.object({ id: z.string().min(1) }).strict(),
	contactsCreate: z.object({ contact: ContactCreateSchema }).strict(),
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
	projectsCreate: z.object({ project: ProjectCreateSchema }).strict(),
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
	invoicesCreate: z.object({ invoice: InvoiceCreateSchema }).strict(),
	invoicesUpdate: z
		.object({
			id: z.string().min(1),
			invoice: InvoiceFieldsSchema.extend({
				invoice_items: z.array(InvoiceItemUpdateInputSchema).optional(),
			}),
		})
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
					attachments: z.array(InvoiceEmailAttachmentSchema).optional(),
				})
				.strict(),
		})
		.strict(),
	invoicesDuplicate: z.object({ id: z.string().min(1) }).strict(),
	invoicesMarkScheduled: z.object({ id: z.string().min(1) }).strict(),
	invoicesMarkDraft: z.object({ id: z.string().min(1) }).strict(),
	invoicesMarkCancelled: z.object({ id: z.string().min(1) }).strict(),
	invoicesDirectDebit: z.object({ id: z.string().min(1) }).strict(),
	invoicesTimeline: z.object({}).strict(),
	invoicesDefaultAdditionalTextGet: z.object({}).strict(),
	invoicesDefaultAdditionalTextUpdate: z
		.object({ default_additional_text: z.string() })
		.strict(),
	invoicesDefaultAdditionalTextDelete: z.object({}).strict(),
	invoicesPdf: z.object({ id: z.string().min(1) }).strict(),
	invoicesConvertToCreditNote: z.object({ id: z.string().min(1) }).strict(),
	recurringInvoicesList: z
		.object({
			query: PageQuerySchema.extend({
				view: z.enum(['draft', 'active', 'inactive']).optional(),
				contact: z.string().url().optional(),
			})
				.strict()
				.optional(),
		})
		.strict(),
	recurringInvoicesGet: z.object({ id: z.string().min(1) }).strict(),
	trackingGroupsList: z
		.object({
			query: PageQuerySchema.extend({
				include_hidden: z.boolean().optional(),
				order_by: z.enum(['name', 'status', 'labels_count']).optional(),
				reverse: z.boolean().optional(),
			})
				.strict()
				.optional(),
		})
		.strict(),
	trackingGroupsGet: z.object({ id: z.string().min(1) }).strict(),
} as const;

const TaxTimelineItemSchema = z
	.object({
		description: z.string(),
		nature: z.string(),
		dated_on: z.string().date(),
		amount_due: z.union([z.string(), z.number()]).optional(),
		is_personal: z.boolean(),
	})
	.passthrough();

const InvoiceTimelineItemSchema = z
	.object({
		reference: z.string(),
		summary: z.string(),
		description: z.string(),
		dated_on: z.string().date(),
		amount: z.string(),
	})
	.passthrough();

export const FreeAgentEndpointOutputSchemas = {
	companyGet: z
		.object({ company: z.record(z.string(), z.json()) })
		.passthrough(),
	companyBusinessCategories: z
		.object({ business_categories: z.array(z.string()) })
		.passthrough(),
	companyTaxTimeline: z
		.object({ timeline_items: z.array(TaxTimelineItemSchema) })
		.passthrough(),
	contactsList: ContactsListResponseSchema.extend({
		pagination: PaginationHeadersSchema,
	}).passthrough(),
	contactsGet: z.object({ contact: ContactSchema }).passthrough(),
	contactsCreate: z.object({ contact: ContactSchema }).passthrough(),
	contactsUpdate: EmptyResponseSchema,
	contactsDelete: EmptyResponseSchema,
	projectsList: ProjectsListResponseSchema.extend({
		pagination: PaginationHeadersSchema,
	}).passthrough(),
	projectsGet: z.object({ project: ProjectSchema }).passthrough(),
	projectsCreate: z.object({ project: ProjectSchema }).passthrough(),
	projectsUpdate: EmptyResponseSchema,
	projectsDelete: EmptyResponseSchema,
	invoicesList: InvoicesListResponseSchema.extend({
		pagination: PaginationHeadersSchema,
	}).passthrough(),
	invoicesGet: z.object({ invoice: InvoiceSchema }).passthrough(),
	invoicesCreate: z.object({ invoice: InvoiceSchema }).passthrough(),
	invoicesUpdate: EmptyResponseSchema,
	invoicesDelete: EmptyResponseSchema,
	invoicesMarkSent: EmptyResponseSchema,
	invoicesSendEmail: EmptyResponseSchema,
	invoicesDuplicate: z.object({ invoice: InvoiceSchema }).passthrough(),
	invoicesMarkScheduled: EmptyResponseSchema,
	invoicesMarkDraft: EmptyResponseSchema,
	invoicesMarkCancelled: EmptyResponseSchema,
	invoicesDirectDebit: EmptyResponseSchema,
	invoicesTimeline: z
		.object({ invoice_timeline_items: z.array(InvoiceTimelineItemSchema) })
		.passthrough(),
	// `{}` when the company has no default text set.
	invoicesDefaultAdditionalTextGet: z
		.object({ default_additional_text: z.string().optional() })
		.passthrough(),
	invoicesDefaultAdditionalTextUpdate: z
		.object({ default_additional_text: z.string() })
		.passthrough(),
	invoicesDefaultAdditionalTextDelete: EmptyResponseSchema,
	invoicesPdf: z
		.object({ pdf: z.object({ content: z.string().min(1) }) })
		.passthrough(),
	invoicesConvertToCreditNote: z
		.object({ credit_note: CreditNoteSchema })
		.passthrough(),
	emailAddressesList: z
		.object({ email_addresses: z.array(z.string()) })
		.passthrough()
		.extend({ pagination: PaginationHeadersSchema }),
	recurringInvoicesList: z
		.object({ recurring_invoices: z.array(RecurringInvoiceSchema) })
		.passthrough()
		.extend({ pagination: PaginationHeadersSchema }),
	recurringInvoicesGet: z
		.object({ recurring_invoice: RecurringInvoiceSchema })
		.passthrough(),
	trackingGroupsList: z
		.object({ tracking_groups: z.array(TrackingGroupSchema) })
		.passthrough()
		.extend({ pagination: PaginationHeadersSchema }),
	trackingGroupsGet: z
		.object({ tracking_group: TrackingGroupSchema })
		.passthrough(),
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
