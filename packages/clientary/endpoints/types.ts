import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// Shared Field Helpers
// ─────────────────────────────────────────────────────────────────────────────

const Id = z.number().int().positive();
const OptionalId = Id.nullable().optional();
const NullableString = z.string().nullable().optional();
const FlexNumber = z.union([z.number(), z.string()]);
const Page = z
	.number()
	.int()
	.min(1)
	.optional()
	.describe('Page number (starts at 1)');
const PageSize = z
	.number()
	.int()
	.min(1)
	.max(100)
	.optional()
	.describe('Results per page (max 100)');
const DeleteSuccess = z.object({
	success: z.literal(true),
	id: z.number().int().positive(),
});
const SendSuccess = z.object({
	sent: z.literal(true),
	id: z.number().int().positive(),
});

// ─────────────────────────────────────────────────────────────────────────────
// CLIENTS — GET/POST /clients, PUT/DELETE /clients/:id
// A client is a company/group container for contacts, projects, invoices.
// Docs: https://www.clientary.com/api/clients
// ─────────────────────────────────────────────────────────────────────────────

export const ClientaryClientSchema = z
	.object({
		id: Id,
		number: z.string().nullable().optional(),
		name: z.string(),
		city: z.string().nullable().optional(),
		address: z.string().nullable().optional(),
		address_2: z.string().nullable().optional(),
		zip: z.string().nullable().optional(),
		country: z.string().nullable().optional(),
		state: z.string().nullable().optional(),
		website: z.string().nullable().optional(),
		description: z.string().nullable().optional(),
		invoice_extra_fields: z.unknown().nullable().optional(),
	})
	.loose();

export const ClientsListInputSchema = z.object({
	page: z
		.number()
		.int()
		.min(1)
		.optional()
		.describe('Page number (starts at 1)'),
	page_size: z
		.number()
		.int()
		.min(1)
		.max(100)
		.optional()
		.describe('Results per page (max 100)'),
	updated_since: z
		.string()
		.optional()
		.describe('Only return clients updated since this date (YYYY-MM-DD)'),
	sort: z.literal('date').optional().describe('Sort by most recently created'),
});

export const ClientsListResponseSchema = z
	.object({
		page_count: z.number(),
		page_size: z.number(),
		total_count: z.number(),
		clients: z.array(ClientaryClientSchema),
	})
	.loose();

export const ClientaryClientInputSchema = z.object({
	name: z.string().min(1).describe('Client name'),
	number: z.string().optional().describe('Client number (unique)'),
	city: z.string().optional(),
	address: z.string().optional(),
	address_2: z.string().optional(),
	zip: z.string().optional(),
	country: z.string().optional(),
	state: z.string().optional(),
	website: z.string().optional(),
	description: z.string().optional(),
	invoice_extra_fields: z.unknown().optional(),
});

export const ClientCreateInputSchema = ClientaryClientInputSchema;
export const ClientUpdateInputSchema = z
	.object({
		id: Id.describe('Client ID'),
	})
	.merge(ClientaryClientInputSchema.partial());

export const ClientGetInputSchema = z.object({
	id: Id.describe('Client ID'),
});
export const ClientDeleteInputSchema = ClientGetInputSchema;

export type ClientaryClient = z.infer<typeof ClientaryClientSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// CONTACTS — GET /contacts, GET/POST /clients/:client_id/contacts,
// PUT/DELETE /contacts/:id
// Contacts are individuals belonging to a Client (or Lead).
// Docs: https://www.clientary.com/api/contacts
// ─────────────────────────────────────────────────────────────────────────────

export const ClientaryContactSchema = z
	.object({
		id: Id,
		client_id: OptionalId,
		name: z.string(),
		email: z.string().nullable().optional(),
		title: z.string().nullable().optional(),
		phone: z.string().nullable().optional(),
		mobile: z.string().nullable().optional(),
		ext: z.string().nullable().optional(),
		avatar: z.string().nullable().optional(),
	})
	.loose();

export const ContactsListInputSchema = z.object({
	page: z
		.number()
		.int()
		.min(1)
		.optional()
		.describe('Page number (starts at 1)'),
	page_size: z
		.number()
		.int()
		.min(1)
		.max(100)
		.optional()
		.describe('Results per page (max 100)'),
});

export const ContactsListResponseSchema = z
	.object({
		page_count: z.number(),
		page_size: z.number(),
		total_count: z.number(),
		contacts: z.array(ClientaryContactSchema),
	})
	.loose();

export const ContactsListForClientInputSchema = z.object({
	client_id: Id.describe('Client ID to scope contacts by'),
	page: Page,
	page_size: PageSize,
});

export const ClientaryContactInputSchema = z.object({
	name: z.string().min(1).describe('Contact name'),
	email: z.string().email().describe('Contact email'),
	title: z.string().optional(),
	phone: z.string().optional(),
	mobile: z.string().optional(),
	ext: z.string().optional(),
});

export const ContactCreateInputSchema = z
	.object({
		client_id: Id.describe('Client the contact belongs to'),
	})
	.merge(ClientaryContactInputSchema);
export const ContactUpdateInputSchema = z
	.object({
		id: Id.describe('Contact ID'),
	})
	.merge(ClientaryContactInputSchema.partial());

export const ContactGetInputSchema = z.object({
	id: Id.describe('Contact ID'),
});
export const ContactDeleteInputSchema = ContactGetInputSchema;

export type ClientaryContact = z.infer<typeof ClientaryContactSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// ESTIMATES — GET /estimates, GET /clients/:client_id/estimates,
// GET /projects/:project_id/estimates, GET/PUT/DELETE /estimates/:id,
// POST /estimates, POST /estimates/:id/messages
// Docs: https://www.clientary.com/api/estimates
// ─────────────────────────────────────────────────────────────────────────────

export const EstimateItemResponseSchema = z
	.object({
		id: Id,
		title: z.string(),
		price: FlexNumber,
		quantity: z.number(),
		taxable: z.boolean().optional(),
	})
	.loose();

export const ClientaryEstimateSchema = z
	.object({
		id: Id,
		number: z.string().nullable().optional(),
		title: z.string().nullable().optional(),
		date: z.string(),
		client_id: OptionalId,
		note: z.string().nullable().optional(),
		status: z.number(),
		currency_code: z.string(),
		subtotal: z.number(),
		total_cost: z.number(),
		tax: z.number(),
		tax2: z.number(),
		tax3: z.number(),
		tax_label: z.string().nullable().optional(),
		tax2_label: z.string().nullable().optional(),
		tax3_label: z.string().nullable().optional(),
		compound_tax: z.boolean(),
		summary: z.string().nullable().optional(),
		estimate_items: z.array(EstimateItemResponseSchema).optional(),
	})
	.loose();

export const EstimatesListInputSchema = z.object({
	page: z
		.number()
		.int()
		.min(1)
		.optional()
		.describe('Page number (starts at 1)'),
});

export const EstimatesListResponseSchema = z
	.object({
		page_count: z.number(),
		page_size: z.number(),
		total_count: z.number(),
		estimates: z.array(ClientaryEstimateSchema),
	})
	.loose();

export const EstimatesListForClientInputSchema = z.object({
	client_id: Id.describe('Client ID to scope estimates by'),
	page: Page,
	page_size: PageSize,
});
export const EstimatesListForProjectInputSchema = z.object({
	project_id: Id.describe('Project ID to scope estimates by'),
	page: Page,
	page_size: PageSize,
});

export const EstimateItemAttributesSchema = z.object({
	id: z.number().int().optional().describe('Item ID (omit to create new)'),
	_destroy: z
		.boolean()
		.optional()
		.describe('Set true alongside an id to delete the item'),
	title: z.string().optional(),
	quantity: z.number().optional(),
	price: z.number().optional(),
	taxable: z.boolean().optional(),
});

export const ClientaryEstimateInputSchema = z.object({
	number: z
		.number()
		.int()
		.optional()
		.describe('Estimate number (autoincrements)'),
	date: z.string().describe('Estimate date (YYYY-MM-DD)'),
	currency_code: z.string().describe('ISO currency code, e.g. USD'),
	title: z.string().optional(),
	note: z.string().optional(),
	client_id: Id.optional(),
	status: z.number().optional(),
	tax: z.number().optional(),
	tax2: z.number().optional(),
	tax3: z.number().optional(),
	tax_label: z.string().optional(),
	tax2_label: z.string().optional(),
	tax3_label: z.string().optional(),
	compound_tax: z.boolean().optional(),
	summary: z.string().optional(),
	estimate_items_attributes: z
		.array(EstimateItemAttributesSchema)
		.optional()
		.describe('Estimate line items'),
});

export const EstimateCreateInputSchema = ClientaryEstimateInputSchema;
export const EstimateUpdateInputSchema = z
	.object({
		id: Id.describe('Estimate ID'),
	})
	.merge(ClientaryEstimateInputSchema.partial());

export const EstimateGetInputSchema = z.object({
	id: Id.describe('Estimate ID'),
});
export const EstimateDeleteInputSchema = EstimateGetInputSchema;

export const EstimateSendInputSchema = z.object({
	id: Id.describe('Estimate ID to send'),
	recipients: z
		.array(z.string().email())
		.min(1)
		.describe('Recipient email addresses'),
	subject: z.string().optional().describe('Email subject line'),
	message: z.string().optional().describe('Email body message'),
	send_copy: z
		.union([z.boolean(), z.number()])
		.optional()
		.describe('Send a copy to the sending user'),
	attach_pdf: z
		.union([z.boolean(), z.number()])
		.optional()
		.describe('Attach a PDF of the estimate'),
});

export type ClientaryEstimate = z.infer<typeof ClientaryEstimateSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// EXPENSES — GET /expenses, GET /clients/:client_id/expenses,
// GET /projects/:project_id/expenses, GET/PUT/DELETE /expenses/:id,
// POST /expenses
// Docs: https://www.clientary.com/api/expenses
// ─────────────────────────────────────────────────────────────────────────────

export const ClientaryExpenseSchema = z
	.object({
		id: Id,
		client_id: OptionalId,
		project_id: OptionalId,
		invoice_id: OptionalId,
		invoice_item_id: OptionalId,
		user_id: OptionalId,
		amount: z.number(),
		description: z.string().nullable().optional(),
		incurred_on: z.string(),
	})
	.loose();

export const ExpensesListInputSchema = z.object({
	from_date: z.string().optional().describe('Start of date range (YYYY-MM-DD)'),
	to_date: z.string().optional().describe('End of date range (YYYY-MM-DD)'),
});

export const ExpensesListResponseSchema = z
	.object({
		total_count: z.number(),
		from_date: z.string(),
		to_date: z.string(),
		expenses: z.array(ClientaryExpenseSchema),
	})
	.loose();

export const ExpensesListForClientInputSchema = z.object({
	client_id: Id.describe('Client ID to scope expenses by'),
	page: Page,
	page_size: PageSize,
});
export const ExpensesListForProjectInputSchema = z.object({
	project_id: Id.describe('Project ID to scope expenses by'),
	page: Page,
	page_size: PageSize,
});

export const ClientaryExpenseInputSchema = z.object({
	amount: z.number().describe('Expense amount'),
	description: z.string().optional(),
	incurred_on: z.string().optional().describe('Date incurred (YYYY-MM-DD)'),
	client_id: Id.optional(),
	project_id: Id.optional(),
});

export const ExpenseCreateInputSchema = ClientaryExpenseInputSchema;
export const ExpenseUpdateInputSchema = z
	.object({
		id: Id.describe('Expense ID'),
	})
	.merge(ClientaryExpenseInputSchema.partial());

export const ExpenseGetInputSchema = z.object({
	id: Id.describe('Expense ID'),
});
export const ExpenseDeleteInputSchema = ExpenseGetInputSchema;

export type ClientaryExpense = z.infer<typeof ClientaryExpenseSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// HOURS — GET /projects/:project_id/hours, GET/PUT/DELETE /hours/:id,
// POST /projects/:project_id/hours
// Docs: https://www.clientary.com/api/hours
// ─────────────────────────────────────────────────────────────────────────────

export const ClientaryHourSchema = z
	.object({
		id: Id,
		project_id: Id,
		user_id: OptionalId,
		title: z.string(),
		description: z.string().nullable().optional(),
		date: z.string(),
		hours: z.number(),
		rate: z.number().nullable().optional(),
		cost: z.number().nullable().optional(),
		'billed?': z.boolean().optional(),
	})
	.loose();

export const HoursListForProjectInputSchema = z.object({
	project_id: Id.describe('Project ID to scope hours by'),
	page: Page,
	page_size: PageSize,
	filter: z
		.union([z.literal('billed'), z.literal('unbilled')])
		.optional()
		.describe('Narrow to billed or unbilled hours'),
});

export const HoursListResponseSchema = z
	.object({
		hours: z.array(ClientaryHourSchema),
	})
	.loose();

export const ClientaryHourInputSchema = z.object({
	hours: z.number().describe('Number of hours logged'),
	title: z.string().min(1).describe('Title of the logged work'),
	description: z.string().optional(),
	date: z.string().optional().describe('Date logged (YYYY-MM-DD)'),
});

export const HourCreateInputSchema = z
	.object({
		project_id: Id.describe('Project to log hours against'),
	})
	.merge(ClientaryHourInputSchema);
export const HourUpdateInputSchema = z
	.object({
		id: Id.describe('Hours entry ID'),
	})
	.merge(ClientaryHourInputSchema.partial());

export const HourGetInputSchema = z.object({
	id: Id.describe('Hours entry ID'),
});
export const HourDeleteInputSchema = HourGetInputSchema;

export type ClientaryHour = z.infer<typeof ClientaryHourSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// INVOICES — GET /invoices, GET /clients/:client_id/invoices,
// GET /projects/:project_id/invoices, GET /recurring/:id/invoices,
// GET/PUT/DELETE /invoices/:id, POST /invoices, POST /invoices/:id/messages
// Docs: https://www.clientary.com/api/invoices
// ─────────────────────────────────────────────────────────────────────────────

export const InvoiceItemResponseSchema = z
	.object({
		id: Id,
		title: z.string(),
		price: FlexNumber,
		quantity: z.number(),
		taxable: z.boolean().optional(),
	})
	.loose();

export const InvoicePaymentResponseSchema = z
	.object({
		id: Id,
		amount: z.number(),
		note: z.string().nullable().optional(),
		received_on: z.string(),
		invoice_id: OptionalId,
		updated_at: z.string().nullable().optional(),
	})
	.loose();

export const ClientaryInvoiceSchema = z
	.object({
		id: Id,
		number: z.string().nullable().optional(),
		title: z.string().nullable().optional(),
		date: z.string(),
		due_date: z.string().nullable().optional(),
		client_id: OptionalId,
		note: z.string().nullable().optional(),
		po: z.string().nullable().optional(),
		status: z.number(),
		currency_code: z.string(),
		subtotal: z.number(),
		total_cost: z.number(),
		balance: z.number(),
		total_payments: z.number(),
		tax: z.number(),
		tax2: z.number(),
		tax3: z.number(),
		tax_label: z.string().nullable().optional(),
		tax2_label: z.string().nullable().optional(),
		tax3_label: z.string().nullable().optional(),
		compound_tax: z.boolean(),
		summary: z.string().nullable().optional(),
		invoice_items: z.array(InvoiceItemResponseSchema).optional(),
		payments: z.array(InvoicePaymentResponseSchema).optional(),
		recurring_schedules: z.array(z.object({ id: Id }).loose()).optional(),
	})
	.loose();

export const InvoicesListInputSchema = z.object({
	page: z
		.number()
		.int()
		.min(1)
		.optional()
		.describe('Page number (starts at 1)'),
	page_size: z
		.number()
		.int()
		.min(1)
		.max(100)
		.optional()
		.describe('Results per page (max 100)'),
	updated_since: z
		.string()
		.optional()
		.describe('Only return invoices updated since this date (YYYY-MM-DD)'),
});

export const InvoicesListResponseSchema = z
	.object({
		page_count: z.number(),
		page_size: z.number(),
		total_count: z.number(),
		invoices: z.array(ClientaryInvoiceSchema),
	})
	.loose();

export const InvoicesListForClientInputSchema = z.object({
	client_id: Id.describe('Client ID to scope invoices by'),
	page: Page,
	page_size: PageSize,
});
export const InvoicesListForProjectInputSchema = z.object({
	project_id: Id.describe('Project ID to scope invoices by'),
	page: Page,
	page_size: PageSize,
});
export const InvoicesListForRecurringInputSchema = z.object({
	recurring_id: Id.describe('Recurring schedule ID to scope invoices by'),
	page: Page,
	page_size: PageSize,
});

export const InvoiceItemAttributesSchema = z.object({
	id: z.number().int().optional().describe('Item ID (omit to create new)'),
	_destroy: z
		.boolean()
		.optional()
		.describe('Set true alongside an id to delete the item'),
	title: z.string().optional(),
	quantity: z.number().optional(),
	price: z.number().optional(),
	taxable: z.boolean().optional(),
});

export const ClientaryInvoiceInputSchema = z.object({
	number: z
		.number()
		.int()
		.optional()
		.describe('Invoice number (autoincrements)'),
	date: z.string().describe('Invoice date (YYYY-MM-DD)'),
	due_date: z.string().describe('Invoice due date (YYYY-MM-DD)'),
	currency_code: z.string().describe('ISO currency code, e.g. USD'),
	title: z.string().optional(),
	note: z.string().optional(),
	po: z.string().optional(),
	client_id: Id.optional(),
	status: z.number().optional(),
	tax: z.number().optional(),
	tax2: z.number().optional(),
	tax3: z.number().optional(),
	tax_label: z.string().optional(),
	tax2_label: z.string().optional(),
	tax3_label: z.string().optional(),
	compound_tax: z.boolean().optional(),
	summary: z.string().optional(),
	invoice_items_attributes: z
		.array(InvoiceItemAttributesSchema)
		.optional()
		.describe('Invoice line items'),
});

export const InvoiceCreateInputSchema = ClientaryInvoiceInputSchema;
export const InvoiceUpdateInputSchema = z
	.object({
		id: Id.describe('Invoice ID'),
	})
	.merge(ClientaryInvoiceInputSchema.partial());

export const InvoiceGetInputSchema = z.object({
	id: Id.describe('Invoice ID'),
});
export const InvoiceDeleteInputSchema = InvoiceGetInputSchema;

export const InvoiceSendInputSchema = EstimateSendInputSchema;

export type ClientaryInvoice = z.infer<typeof ClientaryInvoiceSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// LEADS — GET /leads, GET/PUT/DELETE /leads/:id, POST /leads
// Leads are prospective Clients; JSON shape mirrors Clients.
// Docs: https://www.clientary.com/api/leads
// ─────────────────────────────────────────────────────────────────────────────

export const ClientaryLeadSchema = ClientaryClientSchema;

export const LeadsListInputSchema = z.object({
	page: z
		.number()
		.int()
		.min(1)
		.optional()
		.describe('Page number (starts at 1)'),
	page_size: z
		.number()
		.int()
		.min(1)
		.max(100)
		.optional()
		.describe('Results per page (max 100)'),
	sort: z
		.union([z.literal('name'), z.literal('oldest')])
		.optional()
		.describe('Sort by name or oldest first'),
});

export const LeadsListResponseSchema = z
	.object({
		page_count: z.number(),
		page_size: z.number(),
		total_count: z.number(),
		leads: z.array(ClientaryLeadSchema),
	})
	.loose();

export const ClientaryLeadInputSchema = ClientaryClientInputSchema;

export const LeadCreateInputSchema = ClientaryLeadInputSchema;
export const LeadUpdateInputSchema = z
	.object({
		id: Id.describe('Lead ID'),
	})
	.merge(ClientaryLeadInputSchema.partial());

export const LeadGetInputSchema = z.object({
	id: Id.describe('Lead ID'),
});
export const LeadDeleteInputSchema = LeadGetInputSchema;

export type ClientaryLead = z.infer<typeof ClientaryLeadSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// PAYMENTS — GET /payments, POST /invoices/:invoice_id/payments,
// DELETE /invoices/:invoice_id/payments/:id
// Docs: https://www.clientary.com/api/payments
// ─────────────────────────────────────────────────────────────────────────────

export const ClientaryPaymentSchema = z
	.object({
		id: Id,
		invoice_id: Id,
		amount: z.number(),
		note: z.string().nullable().optional(),
		received_on: z.string(),
		transaction_id: z.string().nullable().optional(),
		transaction_fee_amount: z.number().nullable().optional(),
	})
	.loose();

export const PaymentsListInputSchema = z.object({
	page: z
		.number()
		.int()
		.min(1)
		.optional()
		.describe('Page number (starts at 1)'),
	page_size: z
		.number()
		.int()
		.min(1)
		.max(100)
		.optional()
		.describe('Results per page (max 100)'),
	sort: z
		.literal('created_at')
		.optional()
		.describe('Sort by record creation time'),
});

export const PaymentsListResponseSchema = z
	.object({
		page_size: z.number(),
		page_count: z.number(),
		total_count: z.number(),
		payments: z.array(ClientaryPaymentSchema),
	})
	.loose();

export const ClientaryPaymentInputSchema = z.object({
	amount: z.number().optional().describe('Payment amount'),
	note: z.string().optional().describe('Payment note'),
	payment_profile_id: z
		.number()
		.int()
		.optional()
		.describe('Auto-charge this payment profile for the outstanding balance'),
});

export const PaymentCreateInputSchema = z
	.object({
		invoice_id: Id.describe('Invoice to apply the payment to'),
	})
	.merge(ClientaryPaymentInputSchema);

export const PaymentDeleteInputSchema = z.object({
	invoice_id: Id.describe('Invoice the payment belongs to'),
	id: Id.describe('Payment ID'),
});

export type ClientaryPayment = z.infer<typeof ClientaryPaymentSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// PAYMENT PROFILES — GET/POST /clients/:client_id/payment_profiles,
// DELETE /clients/:client_id/payment_profiles/:id
// Docs: https://www.clientary.com/api/payment_profiles
// ─────────────────────────────────────────────────────────────────────────────

export const ClientaryPaymentProfileSchema = z
	.object({
		id: Id,
		client_id: Id,
		name: z.string(),
		gateway: z.string(),
		gateway_token: z.string().nullable().optional(),
		address: z.string().nullable().optional(),
		city: z.string().nullable().optional(),
		state: z.string().nullable().optional(),
		zip: z.string().nullable().optional(),
		country: z.string().nullable().optional(),
		expiration_date: z.string().nullable().optional(),
		created_at: z.string().nullable().optional(),
		updated_at: z.string().nullable().optional(),
	})
	.loose();

export const PaymentProfilesListForClientInputSchema = z.object({
	client_id: Id.describe('Client ID to scope payment profiles by'),
	page: Page,
	page_size: PageSize,
});

export const PaymentProfilesListResponseSchema = z
	.object({
		page_count: z.number(),
		page_size: z.number(),
		total_count: z.number(),
		payment_profiles: z.array(ClientaryPaymentProfileSchema),
	})
	.loose();

export const PaymentProfileCreateInputSchema = z.object({
	client_id: Id.describe('Client to attach the payment profile to'),
	stripe_customer_id: z.string().describe('Stripe customer ID'),
	stripe_source_id: z.string().describe('Stripe source ID'),
	last_four_digits: z.string().describe('Last four digits of the card'),
	name: z.string().describe('Cardholder name'),
	expiration_date: z.string().describe('Card expiration date (YYYY-MM-DD)'),
	card_type: z.string().optional().describe('Card brand, e.g. Visa'),
	address: z.string().optional(),
	city: z.string().optional(),
	state: z.string().optional(),
	zip: z.string().optional(),
	country: z.string().optional(),
});

export const PaymentProfileDeleteInputSchema = z.object({
	client_id: Id.describe('Client the payment profile belongs to'),
	id: Id.describe('Payment profile ID'),
});

export type ClientaryPaymentProfile = z.infer<
	typeof ClientaryPaymentProfileSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// PROJECTS — GET /projects, GET /clients/:client_id/projects,
// GET/PUT/DELETE /projects/:id, POST /projects
// Docs: https://www.clientary.com/api/projects
// ─────────────────────────────────────────────────────────────────────────────

export const ClientaryProjectSchema = z
	.object({
		id: Id,
		number: z.string().nullable().optional(),
		name: z.string(),
		description: z.string().nullable().optional(),
		status: z.number(),
		budget_type: z.number(),
		project_type: z.number(),
		budget: z.number().nullable().optional(),
		rate: z.number().nullable().optional(),
		cost: z.number().nullable().optional(),
		worked_hours: z.number().nullable().optional(),
		unbilled_hours: z.number().nullable().optional(),
		currency_code: z.string().nullable().optional(),
		start_date: z.string().nullable().optional(),
		end_date: z.string().nullable().optional(),
		client: ClientaryClientSchema.nullable().optional(),
	})
	.loose();

export const ProjectsListInputSchema = z.object({
	page: z
		.number()
		.int()
		.min(1)
		.optional()
		.describe('Page number (starts at 1)'),
	page_size: z
		.number()
		.int()
		.min(1)
		.max(100)
		.optional()
		.describe('Results per page (max 100)'),
	filter: z
		.literal('all')
		.optional()
		.describe('Include closed projects (default: active/billable only)'),
});

export const ProjectsListResponseSchema = z
	.object({
		page_count: z.number(),
		page_size: z.number(),
		total_count: z.number(),
		projects: z.array(ClientaryProjectSchema),
	})
	.loose();

export const ProjectsListForClientInputSchema = z.object({
	client_id: Id.describe('Client ID to scope projects by'),
	page: Page,
	page_size: PageSize,
});

export const ClientaryProjectInputSchema = z.object({
	name: z.string().min(1).describe('Project name'),
	number: z.string().optional().describe('Project number (unique)'),
	rate: z.number().describe('Hourly rate (or total cost for fixed amount)'),
	client_id: Id.optional(),
	description: z.string().optional(),
	status: z.number().optional(),
	budget_type: z
		.union([z.literal(0), z.literal(1)])
		.optional()
		.describe('0 = total budgeted hours, 1 = total budgeted amount'),
	project_type: z
		.union([z.literal(0), z.literal(2)])
		.optional()
		.describe('0 = hourly rate, 2 = fixed amount'),
	budget: z.number().optional(),
	currency_code: z.string().optional(),
	start_date: z.string().optional().describe('Start date (YYYY-MM-DD)'),
	end_date: z.string().optional().describe('End date (YYYY-MM-DD)'),
});

export const ProjectCreateInputSchema = ClientaryProjectInputSchema;
export const ProjectUpdateInputSchema = z
	.object({
		id: Id.describe('Project ID'),
	})
	.merge(ClientaryProjectInputSchema.partial());

export const ProjectGetInputSchema = z.object({
	id: Id.describe('Project ID'),
});
export const ProjectDeleteInputSchema = ProjectGetInputSchema;

export type ClientaryProject = z.infer<typeof ClientaryProjectSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// RECURRING SCHEDULES — GET /recurring, GET/PUT/DELETE /recurring/:id,
// POST /recurring
// Docs: https://www.clientary.com/api/recurring_schedules
// ─────────────────────────────────────────────────────────────────────────────

export const RecurringItemResponseSchema = z
	.object({
		id: Id,
		recurring_schedule_id: OptionalId,
		title: z.string(),
		price: z.string().nullable().optional(),
		quantity: z.number(),
		item_type: z.number(),
		'taxable?': z.boolean().optional(),
		'secondary_tax?': z.boolean().optional(),
		'tertiary_tax?': z.boolean().optional(),
		total_tax: z.number().optional(),
	})
	.loose();

export const ClientaryRecurringScheduleSchema = z
	.object({
		id: Id,
		client_id: Id,
		number: z.string().nullable().optional(),
		title: z.string(),
		note: z.string().nullable().optional(),
		status: z.number(),
		action: z.number(),
		time_interval: z.number(),
		due_period: z.number(),
		next_date: z.string(),
		currency_code: z.string(),
		unlimited: z.boolean(),
		occurrences_remaining: z.number().nullable().optional(),
		payment_profile_id: OptionalId,
		po: z.string().nullable().optional(),
		summary: z.string().nullable().optional(),
		subtotal: z.number(),
		total_cost: z.number(),
		tax: z.number(),
		tax2: z.number(),
		tax3: z.number(),
		tax_label: z.string().nullable().optional(),
		tax2_label: z.string().nullable().optional(),
		tax3_label: z.string().nullable().optional(),
		compound_tax: z.boolean(),
		updated_at: z.string().nullable().optional(),
		client: z.unknown().nullable().optional(),
		recurring_schedule_items: z.array(RecurringItemResponseSchema).optional(),
	})
	.loose();

export const RecurringListInputSchema = z.object({
	page: z
		.number()
		.int()
		.min(1)
		.optional()
		.describe('Page number (starts at 1)'),
});

export const RecurringListResponseSchema = z
	.object({
		page_size: z.number(),
		page_count: z.number(),
		total_count: z.number(),
		recurring: z.array(ClientaryRecurringScheduleSchema),
	})
	.loose();

export const RecurringItemAttributesSchema = z.object({
	id: z.number().int().optional().describe('Item ID (omit to create new)'),
	_destroy: z
		.boolean()
		.optional()
		.describe('Set true alongside an id to delete the item'),
	title: z.string().optional(),
	quantity: z.number().optional(),
	price: z.number().optional(),
});

export const ClientaryRecurringInputSchema = z.object({
	number: z
		.number()
		.int()
		.optional()
		.describe('Schedule number (autoincrements)'),
	next_date: z.string().describe('Next invoice date (YYYY-MM-DD)'),
	due_period: z.number().int().describe('Due in N days'),
	currency_code: z.string().describe('ISO currency code, e.g. USD'),
	time_interval: z
		.number()
		.int()
		.describe('Frequency (1=weekly ... 11=every 4 months)'),
	client_id: Id.describe('Client billed by this schedule'),
	title: z.string().optional(),
	note: z.string().optional(),
	status: z.number().optional(),
	action: z.number().optional().describe('0=send, 1=draft, 2=autobill'),
	unlimited: z.boolean().optional(),
	occurrences_remaining: z.number().optional(),
	payment_profile_id: Id.optional(),
	po: z.string().optional(),
	summary: z.string().optional(),
	tax: z.number().optional(),
	tax2: z.number().optional(),
	tax3: z.number().optional(),
	tax_label: z.string().optional(),
	tax2_label: z.string().optional(),
	tax3_label: z.string().optional(),
	compound_tax: z.boolean().optional(),
	recurring_schedule_items_attributes: z
		.array(RecurringItemAttributesSchema)
		.optional()
		.describe('Recurring schedule line items'),
});

export const RecurringCreateInputSchema = ClientaryRecurringInputSchema;
export const RecurringUpdateInputSchema = z
	.object({
		id: Id.describe('Recurring schedule ID'),
	})
	.merge(ClientaryRecurringInputSchema.partial());

export const RecurringGetInputSchema = z.object({
	id: Id.describe('Recurring schedule ID'),
});
export const RecurringDeleteInputSchema = RecurringGetInputSchema;

export type ClientaryRecurringSchedule = z.infer<
	typeof ClientaryRecurringScheduleSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// STAFF — GET /staff, GET /staff/:id
// Creation, update, and deletion of staff is NOT supported by the API
// (documented by the provider; requires manual creation in the account).
// Docs: https://www.clientary.com/api/staff
// ─────────────────────────────────────────────────────────────────────────────

export const ClientaryStaffSchema = ClientaryContactSchema;

export const StaffListInputSchema = z.object({});

export const StaffListResponseSchema = z
	.object({
		staff: z.array(ClientaryStaffSchema),
	})
	.loose();

export const StaffGetInputSchema = z.object({
	id: Id.describe('Staff user ID'),
});

export type ClientaryStaff = z.infer<typeof ClientaryStaffSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// TASKS — GET /tasks, GET /projects/:project_id/tasks,
// GET/PUT/DELETE /tasks/:id, POST /task
// Docs: https://www.clientary.com/api/tasks
// ─────────────────────────────────────────────────────────────────────────────

export const ClientaryTaskSchema = z
	.object({
		id: Id,
		client_id: OptionalId,
		project_id: OptionalId,
		user_id: OptionalId,
		assignee_id: OptionalId,
		title: z.string(),
		description: z.string().nullable().optional(),
		complete: z.boolean(),
		completed_at: z.string().nullable().optional(),
		due_date: z.string().nullable().optional(),
		created_at: z.string(),
		updated_at: z.string(),
	})
	.loose();

export const TasksListInputSchema = z.object({
	page: Page,
	page_size: PageSize,
});

export const TasksListResponseSchema = z
	.object({
		total_count: z.number(),
		page_count: z.number(),
		page_size: z.number(),
		tasks: z.array(ClientaryTaskSchema),
	})
	.loose();

export const TasksListForProjectInputSchema = z.object({
	project_id: Id.describe('Project ID to scope tasks by'),
	page: Page,
	page_size: PageSize,
});

export const ClientaryTaskInputSchema = z.object({
	title: z.string().min(1).describe('Task title'),
	description: z.string().optional(),
	project_id: Id.optional(),
	assignee_id: Id.optional(),
	due_date: z.string().optional().describe('Due date (YYYY-MM-DD)'),
});

export const TaskCreateInputSchema = ClientaryTaskInputSchema;
export const TaskUpdateInputSchema = z
	.object({
		id: Id.describe('Task ID'),
		title: z.string().min(1).optional(),
		description: z.string().optional(),
		project_id: Id.optional(),
		assignee_id: Id.optional(),
		due_date: z.string().optional(),
		complete: z.boolean().optional().describe('Mark the task complete'),
	})
	.strict();

export const TaskGetInputSchema = z.object({
	id: Id.describe('Task ID'),
});
export const TaskDeleteInputSchema = TaskGetInputSchema;

export type ClientaryTask = z.infer<typeof ClientaryTaskSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Shared Delete / Send Response Schemas
// ─────────────────────────────────────────────────────────────────────────────

export const ClientaryDeleteResponseSchema = DeleteSuccess;
export const ClientarySendResponseSchema = SendSuccess;

// ─────────────────────────────────────────────────────────────────────────────
// Plugin Endpoint Input / Output Maps
// ─────────────────────────────────────────────────────────────────────────────

export type ClientaryEndpointInputs = {
	clientsList: z.infer<typeof ClientsListInputSchema>;
	clientsGet: z.infer<typeof ClientGetInputSchema>;
	clientsCreate: z.infer<typeof ClientCreateInputSchema>;
	clientsUpdate: z.infer<typeof ClientUpdateInputSchema>;
	clientsDelete: z.infer<typeof ClientDeleteInputSchema>;
	contactsList: z.infer<typeof ContactsListInputSchema>;
	contactsListForClient: z.infer<typeof ContactsListForClientInputSchema>;
	contactsGet: z.infer<typeof ContactGetInputSchema>;
	contactsCreate: z.infer<typeof ContactCreateInputSchema>;
	contactsUpdate: z.infer<typeof ContactUpdateInputSchema>;
	contactsDelete: z.infer<typeof ContactDeleteInputSchema>;
	estimatesList: z.infer<typeof EstimatesListInputSchema>;
	estimatesListForClient: z.infer<typeof EstimatesListForClientInputSchema>;
	estimatesListForProject: z.infer<typeof EstimatesListForProjectInputSchema>;
	estimatesGet: z.infer<typeof EstimateGetInputSchema>;
	estimatesCreate: z.infer<typeof EstimateCreateInputSchema>;
	estimatesUpdate: z.infer<typeof EstimateUpdateInputSchema>;
	estimatesDelete: z.infer<typeof EstimateDeleteInputSchema>;
	estimatesSend: z.infer<typeof EstimateSendInputSchema>;
	expensesList: z.infer<typeof ExpensesListInputSchema>;
	expensesListForClient: z.infer<typeof ExpensesListForClientInputSchema>;
	expensesListForProject: z.infer<typeof ExpensesListForProjectInputSchema>;
	expensesGet: z.infer<typeof ExpenseGetInputSchema>;
	expensesCreate: z.infer<typeof ExpenseCreateInputSchema>;
	expensesUpdate: z.infer<typeof ExpenseUpdateInputSchema>;
	expensesDelete: z.infer<typeof ExpenseDeleteInputSchema>;
	hoursListForProject: z.infer<typeof HoursListForProjectInputSchema>;
	hoursGet: z.infer<typeof HourGetInputSchema>;
	hoursCreate: z.infer<typeof HourCreateInputSchema>;
	hoursUpdate: z.infer<typeof HourUpdateInputSchema>;
	hoursDelete: z.infer<typeof HourDeleteInputSchema>;
	invoicesList: z.infer<typeof InvoicesListInputSchema>;
	invoicesListForClient: z.infer<typeof InvoicesListForClientInputSchema>;
	invoicesListForProject: z.infer<typeof InvoicesListForProjectInputSchema>;
	invoicesListForRecurring: z.infer<typeof InvoicesListForRecurringInputSchema>;
	invoicesGet: z.infer<typeof InvoiceGetInputSchema>;
	invoicesCreate: z.infer<typeof InvoiceCreateInputSchema>;
	invoicesUpdate: z.infer<typeof InvoiceUpdateInputSchema>;
	invoicesDelete: z.infer<typeof InvoiceDeleteInputSchema>;
	invoicesSend: z.infer<typeof InvoiceSendInputSchema>;
	leadsList: z.infer<typeof LeadsListInputSchema>;
	leadsGet: z.infer<typeof LeadGetInputSchema>;
	leadsCreate: z.infer<typeof LeadCreateInputSchema>;
	leadsUpdate: z.infer<typeof LeadUpdateInputSchema>;
	leadsDelete: z.infer<typeof LeadDeleteInputSchema>;
	paymentsList: z.infer<typeof PaymentsListInputSchema>;
	paymentsCreate: z.infer<typeof PaymentCreateInputSchema>;
	paymentsDelete: z.infer<typeof PaymentDeleteInputSchema>;
	paymentProfilesListForClient: z.infer<
		typeof PaymentProfilesListForClientInputSchema
	>;
	paymentProfilesCreate: z.infer<typeof PaymentProfileCreateInputSchema>;
	paymentProfilesDelete: z.infer<typeof PaymentProfileDeleteInputSchema>;
	projectsList: z.infer<typeof ProjectsListInputSchema>;
	projectsListForClient: z.infer<typeof ProjectsListForClientInputSchema>;
	projectsGet: z.infer<typeof ProjectGetInputSchema>;
	projectsCreate: z.infer<typeof ProjectCreateInputSchema>;
	projectsUpdate: z.infer<typeof ProjectUpdateInputSchema>;
	projectsDelete: z.infer<typeof ProjectDeleteInputSchema>;
	recurringList: z.infer<typeof RecurringListInputSchema>;
	recurringGet: z.infer<typeof RecurringGetInputSchema>;
	recurringCreate: z.infer<typeof RecurringCreateInputSchema>;
	recurringUpdate: z.infer<typeof RecurringUpdateInputSchema>;
	recurringDelete: z.infer<typeof RecurringDeleteInputSchema>;
	staffList: z.infer<typeof StaffListInputSchema>;
	staffGet: z.infer<typeof StaffGetInputSchema>;
	tasksList: z.infer<typeof TasksListInputSchema>;
	tasksListForProject: z.infer<typeof TasksListForProjectInputSchema>;
	tasksGet: z.infer<typeof TaskGetInputSchema>;
	tasksCreate: z.infer<typeof TaskCreateInputSchema>;
	tasksUpdate: z.infer<typeof TaskUpdateInputSchema>;
	tasksDelete: z.infer<typeof TaskDeleteInputSchema>;
};

export type ClientaryEndpointOutputs = {
	clientsList: z.infer<typeof ClientsListResponseSchema>;
	clientsGet: ClientaryClient;
	clientsCreate: ClientaryClient;
	clientsUpdate: ClientaryClient;
	clientsDelete: z.infer<typeof ClientaryDeleteResponseSchema>;
	contactsList: z.infer<typeof ContactsListResponseSchema>;
	contactsListForClient: z.infer<typeof ContactsListResponseSchema>;
	contactsGet: ClientaryContact;
	contactsCreate: ClientaryContact;
	contactsUpdate: ClientaryContact;
	contactsDelete: z.infer<typeof ClientaryDeleteResponseSchema>;
	estimatesList: z.infer<typeof EstimatesListResponseSchema>;
	estimatesListForClient: z.infer<typeof EstimatesListResponseSchema>;
	estimatesListForProject: z.infer<typeof EstimatesListResponseSchema>;
	estimatesGet: ClientaryEstimate;
	estimatesCreate: ClientaryEstimate;
	estimatesUpdate: ClientaryEstimate;
	estimatesDelete: z.infer<typeof ClientaryDeleteResponseSchema>;
	estimatesSend: z.infer<typeof ClientarySendResponseSchema>;
	expensesList: z.infer<typeof ExpensesListResponseSchema>;
	expensesListForClient: z.infer<typeof ExpensesListResponseSchema>;
	expensesListForProject: z.infer<typeof ExpensesListResponseSchema>;
	expensesGet: ClientaryExpense;
	expensesCreate: ClientaryExpense;
	expensesUpdate: ClientaryExpense;
	expensesDelete: z.infer<typeof ClientaryDeleteResponseSchema>;
	hoursListForProject: z.infer<typeof HoursListResponseSchema>;
	hoursGet: ClientaryHour;
	hoursCreate: ClientaryHour;
	hoursUpdate: ClientaryHour;
	hoursDelete: z.infer<typeof ClientaryDeleteResponseSchema>;
	invoicesList: z.infer<typeof InvoicesListResponseSchema>;
	invoicesListForClient: z.infer<typeof InvoicesListResponseSchema>;
	invoicesListForProject: z.infer<typeof InvoicesListResponseSchema>;
	invoicesListForRecurring: z.infer<typeof InvoicesListResponseSchema>;
	invoicesGet: ClientaryInvoice;
	invoicesCreate: ClientaryInvoice;
	invoicesUpdate: ClientaryInvoice;
	invoicesDelete: z.infer<typeof ClientaryDeleteResponseSchema>;
	invoicesSend: z.infer<typeof ClientarySendResponseSchema>;
	leadsList: z.infer<typeof LeadsListResponseSchema>;
	leadsGet: ClientaryLead;
	leadsCreate: ClientaryLead;
	leadsUpdate: ClientaryLead;
	leadsDelete: z.infer<typeof ClientaryDeleteResponseSchema>;
	paymentsList: z.infer<typeof PaymentsListResponseSchema>;
	paymentsCreate: ClientaryPayment;
	paymentsDelete: z.infer<typeof ClientaryDeleteResponseSchema>;
	paymentProfilesListForClient: z.infer<
		typeof PaymentProfilesListResponseSchema
	>;
	paymentProfilesCreate: ClientaryPaymentProfile;
	paymentProfilesDelete: z.infer<typeof ClientaryDeleteResponseSchema>;
	projectsList: z.infer<typeof ProjectsListResponseSchema>;
	projectsListForClient: z.infer<typeof ProjectsListResponseSchema>;
	projectsGet: ClientaryProject;
	projectsCreate: ClientaryProject;
	projectsUpdate: ClientaryProject;
	projectsDelete: z.infer<typeof ClientaryDeleteResponseSchema>;
	recurringList: z.infer<typeof RecurringListResponseSchema>;
	recurringGet: ClientaryRecurringSchedule;
	recurringCreate: ClientaryRecurringSchedule;
	recurringUpdate: ClientaryRecurringSchedule;
	recurringDelete: z.infer<typeof ClientaryDeleteResponseSchema>;
	staffList: z.infer<typeof StaffListResponseSchema>;
	staffGet: ClientaryStaff;
	tasksList: z.infer<typeof TasksListResponseSchema>;
	tasksListForProject: z.infer<typeof TasksListResponseSchema>;
	tasksGet: ClientaryTask;
	tasksCreate: ClientaryTask;
	tasksUpdate: ClientaryTask;
	tasksDelete: z.infer<typeof ClientaryDeleteResponseSchema>;
};

export const ClientaryEndpointInputSchemas = {
	clientsList: ClientsListInputSchema,
	clientsGet: ClientGetInputSchema,
	clientsCreate: ClientCreateInputSchema,
	clientsUpdate: ClientUpdateInputSchema,
	clientsDelete: ClientDeleteInputSchema,
	contactsList: ContactsListInputSchema,
	contactsListForClient: ContactsListForClientInputSchema,
	contactsGet: ContactGetInputSchema,
	contactsCreate: ContactCreateInputSchema,
	contactsUpdate: ContactUpdateInputSchema,
	contactsDelete: ContactDeleteInputSchema,
	estimatesList: EstimatesListInputSchema,
	estimatesListForClient: EstimatesListForClientInputSchema,
	estimatesListForProject: EstimatesListForProjectInputSchema,
	estimatesGet: EstimateGetInputSchema,
	estimatesCreate: EstimateCreateInputSchema,
	estimatesUpdate: EstimateUpdateInputSchema,
	estimatesDelete: EstimateDeleteInputSchema,
	estimatesSend: EstimateSendInputSchema,
	expensesList: ExpensesListInputSchema,
	expensesListForClient: ExpensesListForClientInputSchema,
	expensesListForProject: ExpensesListForProjectInputSchema,
	expensesGet: ExpenseGetInputSchema,
	expensesCreate: ExpenseCreateInputSchema,
	expensesUpdate: ExpenseUpdateInputSchema,
	expensesDelete: ExpenseDeleteInputSchema,
	hoursListForProject: HoursListForProjectInputSchema,
	hoursGet: HourGetInputSchema,
	hoursCreate: HourCreateInputSchema,
	hoursUpdate: HourUpdateInputSchema,
	hoursDelete: HourDeleteInputSchema,
	invoicesList: InvoicesListInputSchema,
	invoicesListForClient: InvoicesListForClientInputSchema,
	invoicesListForProject: InvoicesListForProjectInputSchema,
	invoicesListForRecurring: InvoicesListForRecurringInputSchema,
	invoicesGet: InvoiceGetInputSchema,
	invoicesCreate: InvoiceCreateInputSchema,
	invoicesUpdate: InvoiceUpdateInputSchema,
	invoicesDelete: InvoiceDeleteInputSchema,
	invoicesSend: InvoiceSendInputSchema,
	leadsList: LeadsListInputSchema,
	leadsGet: LeadGetInputSchema,
	leadsCreate: LeadCreateInputSchema,
	leadsUpdate: LeadUpdateInputSchema,
	leadsDelete: LeadDeleteInputSchema,
	paymentsList: PaymentsListInputSchema,
	paymentsCreate: PaymentCreateInputSchema,
	paymentsDelete: PaymentDeleteInputSchema,
	paymentProfilesListForClient: PaymentProfilesListForClientInputSchema,
	paymentProfilesCreate: PaymentProfileCreateInputSchema,
	paymentProfilesDelete: PaymentProfileDeleteInputSchema,
	projectsList: ProjectsListInputSchema,
	projectsListForClient: ProjectsListForClientInputSchema,
	projectsGet: ProjectGetInputSchema,
	projectsCreate: ProjectCreateInputSchema,
	projectsUpdate: ProjectUpdateInputSchema,
	projectsDelete: ProjectDeleteInputSchema,
	recurringList: RecurringListInputSchema,
	recurringGet: RecurringGetInputSchema,
	recurringCreate: RecurringCreateInputSchema,
	recurringUpdate: RecurringUpdateInputSchema,
	recurringDelete: RecurringDeleteInputSchema,
	staffList: StaffListInputSchema,
	staffGet: StaffGetInputSchema,
	tasksList: TasksListInputSchema,
	tasksListForProject: TasksListForProjectInputSchema,
	tasksGet: TaskGetInputSchema,
	tasksCreate: TaskCreateInputSchema,
	tasksUpdate: TaskUpdateInputSchema,
	tasksDelete: TaskDeleteInputSchema,
} as const;

export const ClientaryEndpointOutputSchemas = {
	clientsList: ClientsListResponseSchema,
	clientsGet: ClientaryClientSchema,
	clientsCreate: ClientaryClientSchema,
	clientsUpdate: ClientaryClientSchema,
	clientsDelete: ClientaryDeleteResponseSchema,
	contactsList: ContactsListResponseSchema,
	contactsListForClient: ContactsListResponseSchema,
	contactsGet: ClientaryContactSchema,
	contactsCreate: ClientaryContactSchema,
	contactsUpdate: ClientaryContactSchema,
	contactsDelete: ClientaryDeleteResponseSchema,
	estimatesList: EstimatesListResponseSchema,
	estimatesListForClient: EstimatesListResponseSchema,
	estimatesListForProject: EstimatesListResponseSchema,
	estimatesGet: ClientaryEstimateSchema,
	estimatesCreate: ClientaryEstimateSchema,
	estimatesUpdate: ClientaryEstimateSchema,
	estimatesDelete: ClientaryDeleteResponseSchema,
	estimatesSend: ClientarySendResponseSchema,
	expensesList: ExpensesListResponseSchema,
	expensesListForClient: ExpensesListResponseSchema,
	expensesListForProject: ExpensesListResponseSchema,
	expensesGet: ClientaryExpenseSchema,
	expensesCreate: ClientaryExpenseSchema,
	expensesUpdate: ClientaryExpenseSchema,
	expensesDelete: ClientaryDeleteResponseSchema,
	hoursListForProject: HoursListResponseSchema,
	hoursGet: ClientaryHourSchema,
	hoursCreate: ClientaryHourSchema,
	hoursUpdate: ClientaryHourSchema,
	hoursDelete: ClientaryDeleteResponseSchema,
	invoicesList: InvoicesListResponseSchema,
	invoicesListForClient: InvoicesListResponseSchema,
	invoicesListForProject: InvoicesListResponseSchema,
	invoicesListForRecurring: InvoicesListResponseSchema,
	invoicesGet: ClientaryInvoiceSchema,
	invoicesCreate: ClientaryInvoiceSchema,
	invoicesUpdate: ClientaryInvoiceSchema,
	invoicesDelete: ClientaryDeleteResponseSchema,
	invoicesSend: ClientarySendResponseSchema,
	leadsList: LeadsListResponseSchema,
	leadsGet: ClientaryLeadSchema,
	leadsCreate: ClientaryLeadSchema,
	leadsUpdate: ClientaryLeadSchema,
	leadsDelete: ClientaryDeleteResponseSchema,
	paymentsList: PaymentsListResponseSchema,
	paymentsCreate: ClientaryPaymentSchema,
	paymentsDelete: ClientaryDeleteResponseSchema,
	paymentProfilesListForClient: PaymentProfilesListResponseSchema,
	paymentProfilesCreate: ClientaryPaymentProfileSchema,
	paymentProfilesDelete: ClientaryDeleteResponseSchema,
	projectsList: ProjectsListResponseSchema,
	projectsListForClient: ProjectsListResponseSchema,
	projectsGet: ClientaryProjectSchema,
	projectsCreate: ClientaryProjectSchema,
	projectsUpdate: ClientaryProjectSchema,
	projectsDelete: ClientaryDeleteResponseSchema,
	recurringList: RecurringListResponseSchema,
	recurringGet: ClientaryRecurringScheduleSchema,
	recurringCreate: ClientaryRecurringScheduleSchema,
	recurringUpdate: ClientaryRecurringScheduleSchema,
	recurringDelete: ClientaryDeleteResponseSchema,
	staffList: StaffListResponseSchema,
	staffGet: ClientaryStaffSchema,
	tasksList: TasksListResponseSchema,
	tasksListForProject: TasksListResponseSchema,
	tasksGet: ClientaryTaskSchema,
	tasksCreate: ClientaryTaskSchema,
	tasksUpdate: ClientaryTaskSchema,
	tasksDelete: ClientaryDeleteResponseSchema,
} as const;
