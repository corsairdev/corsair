import { z } from 'zod';

// FreshBooks publishes no OpenAPI spec (freshbooks.com/api), so every schema
// here comes from the doc examples. Outputs are `.loose()` and their nullable
// fields nullish, because `null` is everywhere in real responses. Field
// reference: https://www.freshbooks.com/api/{clients,invoices,estimates,
// expenses,tasks,time_entries,project,identity_model}

// ── Path and paging primitives ────────────────────────────────────────────

const AccountIdSchema = z
	.string()
	.min(1)
	.describe(
		'The accounting system id, such as LJArJ4, from the `accountId` field of users.me.',
	);

// A non-numeric businessId hits a generic 404 before auth, per live probe.
const BusinessIdSchema = z
	.number()
	.int()
	.positive()
	.describe(
		'The numeric business id, from the `businessId` field of users.me.',
	);

// The API silently caps list results at 100 per page regardless of per_page
// (freshbooks.com/api/limits).
const AccountingPageSchema = z
	.number()
	.int()
	.positive()
	.optional()
	.describe('1-based page. Requesting page 0 returns page 1.');

const ProjectsPageSchema = z
	.number()
	.int()
	.nonnegative()
	.optional()
	.describe('0-based page: the docs list example shows meta.page 0.');

const TimeEntriesPageSchema = z
	.number()
	.int()
	.nonnegative()
	.optional()
	.describe('Page number as reported by meta.page of the previous call.');

const PerPageSchema = z
	.number()
	.int()
	.positive()
	.max(100)
	.optional()
	.describe('Defaults to 15. Values above 100 are capped silently by the API.');

const MoneySchema = z
	.object({
		amount: z.string().nullish(),
		code: z.string().nullish(),
	})
	.loose();

/** Page and per_page counts. The timetracking meta adds total_logged totals. */
const MetaSchema = z
	.object({
		page: z.number().nullish(),
		pages: z.number().nullish(),
		per_page: z.number().nullish(),
		total: z.number().nullish(),
	})
	.loose();

/** Accounting list results carry the counts beside the resource array. */
const AccountingListFields = {
	page: z.number(),
	pages: z.number(),
	per_page: z.number(),
	total: z.number(),
};

// ── Shared resource schemas ───────────────────────────────────────────────

// unknown: contact objects have no documented field list; passed through.
const ContactsSchema = z.array(z.record(z.string(), z.unknown()));

const ClientSchema = z
	.object({
		id: z.number(),
		accounting_systemid: z.string().nullish(),
		email: z.string().nullish(),
		fname: z.string().nullish(),
		lname: z.string().nullish(),
		organization: z.string().nullish(),
		currency_code: z.string().nullish(),
		bus_phone: z.string().nullish(),
		home_phone: z.string().nullish(),
		mob_phone: z.string().nullish(),
		fax: z.string().nullish(),
		note: z.string().nullish(),
		language: z.string().nullish(),
		vat_name: z.string().nullish(),
		vat_number: z.string().nullish(),
		company_industry: z.string().nullish(),
		p_city: z.string().nullish(),
		p_code: z.string().nullish(),
		p_country: z.string().nullish(),
		p_province: z.string().nullish(),
		p_street: z.string().nullish(),
		p_street2: z.string().nullish(),
		last_activity: z.string().nullish(),
		last_login: z.string().nullish(),
		level: z.number().nullish(),
		num_logins: z.number().nullish(),
		notified: z.boolean().nullish(),
		allow_email_include_pdf: z.boolean().nullish(),
		allow_late_fees: z.boolean().nullish(),
		allow_late_notifications: z.boolean().nullish(),
		contacts: ContactsSchema.nullish(),
	})
	.loose();

export type FreshBooksClient = z.infer<typeof ClientSchema>;

const ClientResponseSchema = z.object({
	client: ClientSchema,
});

const ClientsListResponseSchema = z
	.object({
		clients: z.array(ClientSchema),
		...AccountingListFields,
	})
	.loose();

// status: 1 draft, 2 sent, 3 viewed, 4 paid, 5 auto-paid, 6 retry, 7 failed.
// vis_state: 0 active, 1 deleted, 2 unknown (classic). An unknown status must
// not fail a read, so both stay plain numbers.
const InvoiceSchema = z
	.object({
		id: z.number(),
		accountid: z.string().nullish(),
		accounting_systemid: z.string().nullish(),
		customerid: z.number().nullish(),
		invoice_number: z.string().nullish(),
		create_date: z.string().nullish(),
		due_date: z.string().nullish(),
		date_paid: z.string().nullish(),
		created_at: z.string().nullish(),
		currency_code: z.string().nullish(),
		current_organization: z.string().nullish(),
		address: z.string().nullish(),
		city: z.string().nullish(),
		province: z.string().nullish(),
		country: z.string().nullish(),
		code: z.string().nullish(),
		fname: z.string().nullish(),
		lname: z.string().nullish(),
		vat_name: z.string().nullish(),
		vat_number: z.string().nullish(),
		notes: z.string().nullish(),
		terms: z.string().nullish(),
		description: z.string().nullish(),
		po_number: z.string().nullish(),
		amount: MoneySchema.nullish(),
		outstanding: z
			.object({ amount: z.string().nullish(), code: z.string().nullish() })
			.loose()
			.nullish(),
		unpaid: MoneySchema.nullish(),
		total: MoneySchema.nullish(),
		deposit_amount: MoneySchema.nullish(),
		deposit_percentage: z.string().nullish(),
		deposit_status: z.string().nullish(),
		discount_total: MoneySchema.nullish(),
		discount_value: z.string().nullish(),
		discount_description: z.string().nullish(),
		dispute_status: z.string().nullish(),
		generation_date: z.string().nullish(),
		payment_status: z.string().nullish(),
		v3_status: z.string().nullish(),
		status: z.number().nullish(),
		vis_state: z.number().nullish(),
		auto_bill: z.boolean().nullish(),
		autobill_status: z.string().nullish(),
		basecampid: z.number().nullish(),
		ownerid: z.number().nullish(),
		estimateid: z.number().nullish(),
		parent: z.number().nullish(),
		template: z.union([z.string(), z.number()]).nullish(),
	})
	.loose();

export type FreshBooksInvoice = z.infer<typeof InvoiceSchema>;

const InvoiceResponseSchema = z.object({
	invoice: InvoiceSchema,
});

const InvoicesListResponseSchema = z
	.object({
		invoices: z.array(InvoiceSchema),
		...AccountingListFields,
	})
	.loose();

// status: 1 draft, 2 sent, 3 viewed, 4 replied, 5 accepted, 6 invoiced.
const EstimateSchema = z
	.object({
		id: z.number(),
		accounting_systemid: z.string().nullish(),
		customerid: z.number().nullish(),
		estimate_number: z.string().nullish(),
		create_date: z.string().nullish(),
		created_at: z.string().nullish(),
		status: z.number().nullish(),
		vis_state: z.number().nullish(),
		reply_status: z.string().nullish(),
		ui_status: z.string().nullish(),
		invoiced: z.boolean().nullish(),
		// The docs examples disagree on whether `sent` is a date or a flag.
		sent: z.union([z.string(), z.boolean()]).nullish(),
		amount: MoneySchema.nullish(),
		discount_total: MoneySchema.nullish(),
		description: z.string().nullish(),
		terms: z.string().nullish(),
		notes: z.string().nullish(),
		current_organization: z.string().nullish(),
		address: z.string().nullish(),
		province: z.string().nullish(),
		country: z.string().nullish(),
		code: z.string().nullish(),
		street2: z.string().nullish(),
		lname: z.string().nullish(),
		vat_name: z.string().nullish(),
		vat_number: z.string().nullish(),
		ownerid: z.number().nullish(),
		template: z.union([z.string(), z.number()]).nullish(),
		updated: z.string().nullish(),
	})
	.loose();

export type FreshBooksEstimate = z.infer<typeof EstimateSchema>;

const EstimateResponseSchema = z.object({
	estimate: EstimateSchema,
});

const EstimatesListResponseSchema = z
	.object({
		estimates: z.array(EstimateSchema),
		...AccountingListFields,
	})
	.loose();

const ExpenseSchema = z
	.object({
		id: z.number(),
		accounting_systemid: z.string().nullish(),
		account_name: z.string().nullish(),
		accountid: z.string().nullish(),
		amount: MoneySchema.nullish(),
		categoryid: z.number().nullish(),
		staffid: z.number().nullish(),
		clientid: z.number().nullish(),
		// The type is undocumented and the examples disagree.
		code: z.string().nullish(),
		date: z.string().nullish(),
		vendor: z.string().nullish(),
		bank_name: z.string().nullish(),
		ext_systemid: z.string().nullish(),
		has_receipt: z.boolean().nullish(),
		isduplicate: z.boolean().nullish(),
		invoiceid: z.number().nullish(),
		markup_percent: z.number().nullish(),
		profileid: z.number().nullish(),
		projectid: z.number().nullish(),
		status: z.union([z.string(), z.number()]).nullish(),
		transactionid: z.string().nullish(),
		updated: z.string().nullish(),
		vis_state: z.number().nullish(),
	})
	.loose();

export type FreshBooksExpense = z.infer<typeof ExpenseSchema>;

const ExpenseResponseSchema = z.object({
	expense: ExpenseSchema,
});

const ExpensesListResponseSchema = z
	.object({
		expenses: z.array(ExpenseSchema),
		...AccountingListFields,
	})
	.loose();

const TaskSchema = z
	.object({
		id: z.number(),
		taskid: z.number().nullish(),
		name: z.string().nullish(),
		tname: z.string().nullish(),
		description: z.string().nullish(),
		tdesc: z.string().nullish(),
		billable: z.boolean().nullish(),
		rate: MoneySchema.nullish(),
		tax1: z.number().nullish(),
		tax2: z.number().nullish(),
		updated: z.string().nullish(),
		vis_state: z.number().nullish(),
	})
	.loose();

export type FreshBooksTask = z.infer<typeof TaskSchema>;

const TaskResponseSchema = z.object({
	task: TaskSchema,
});

const TasksListResponseSchema = z
	.object({
		tasks: z.array(TaskSchema),
		...AccountingListFields,
	})
	.loose();

// unknown: group, links, members and services are nested identity and
// service trees with no documented field list; passed through.
const ProjectSchema = z
	.object({
		id: z.number(),
		title: z.string().nullish(),
		description: z.string().nullish(),
		project_type: z.string().nullish(),
		fixed_price: z.string().nullish(),
		rate: z.string().nullish(),
		budget: z.string().nullish(),
		internal_budget: z.string().nullish(),
		complete: z.boolean().nullish(),
		active: z.boolean().nullish(),
		due_date: z.string().nullish(),
		updated_at: z.string().nullish(),
		start_date: z.string().nullish(),
		client_id: z.union([z.string(), z.number()]).nullish(),
		business_id: z.number().nullish(),
		owner: z.number().nullish(),
		identity_id: z.number().nullish(),
		sample: z.boolean().nullish(),
		group: z.record(z.string(), z.unknown()).nullish(),
		links: z.record(z.string(), z.unknown()).nullish(),
		members: z.array(z.record(z.string(), z.unknown())).nullish(),
		services: z.array(z.record(z.string(), z.unknown())).nullish(),
	})
	.loose();

export type FreshBooksProject = z.infer<typeof ProjectSchema>;

const ProjectResponseSchema = z.object({
	project: ProjectSchema,
});

const ProjectsListResponseSchema = z
	.object({
		projects: z.array(ProjectSchema),
		meta: MetaSchema,
	})
	.loose();

const TimeEntrySchema = z
	.object({
		id: z.number(),
		duration: z.number().nullish().describe('Seconds logged.'),
		is_logged: z.boolean().nullish(),
		active: z.boolean().nullish(),
		started_at: z.string().nullish(),
		note: z.string().nullish(),
		// The docs send this as a number in reads and a string in create bodies.
		project_id: z.union([z.number(), z.string()]).nullish(),
		client_id: z.union([z.number(), z.string()]).nullish(),
		identity_id: z.union([z.number(), z.string()]).nullish(),
		timer: z
			.object({
				id: z.number().nullish(),
				is_running: z.boolean().nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();

export type FreshBooksTimeEntry = z.infer<typeof TimeEntrySchema>;

const TimeEntryResponseSchema = z.object({
	time_entry: TimeEntrySchema,
});

const TimeEntriesListResponseSchema = z
	.object({
		time_entries: z.array(TimeEntrySchema),
		meta: MetaSchema,
	})
	.loose();

const BusinessSchema = z
	.object({
		id: z.number().nullish(),
		name: z.string().nullish(),
		account_id: z.string().nullish(),
	})
	.loose();

const BusinessMembershipSchema = z
	.object({
		id: z.number().nullish(),
		role: z.string().nullish(),
		business: BusinessSchema,
	})
	.loose();

// accountId and businessId are derived in shapeUsersMe from
// business_memberships, because every other group needs one of them.
const UsersMeResponseSchema = z
	.object({
		id: z.number().nullish(),
		first_name: z.string().nullish(),
		last_name: z.string().nullish(),
		email: z.string().nullish(),
		business_memberships: z.array(BusinessMembershipSchema),
		accountId: z
			.string()
			.optional()
			.describe(
				'The account_id of the first membership business that has one. Pass it as accountId to the accounting endpoints.',
			),
		businessId: z
			.number()
			.optional()
			.describe(
				'The id of the first membership business. Pass it as businessId to the projects and timeEntries endpoints.',
			),
	})
	.loose();

export type FreshBooksUsersMeResponse = z.infer<typeof UsersMeResponseSchema>;

// ── users.me ──────────────────────────────────────────────────────────────

const UsersMeInputSchema = z.object({});

export type UsersMeInput = z.infer<typeof UsersMeInputSchema>;

// ── clients ───────────────────────────────────────────────────────────────

const ClientWriteSchema = z.object({
	fname: z.string().optional(),
	lname: z.string().optional(),
	email: z.string().optional(),
	organization: z.string().optional(),
	currency_code: z.string().optional(),
	bus_phone: z.string().optional(),
	home_phone: z.string().optional(),
	mob_phone: z.string().optional(),
	fax: z.string().optional(),
	note: z.string().optional(),
	language: z.string().optional(),
	vat_name: z.string().optional(),
	vat_number: z.string().optional(),
	company_industry: z.string().optional(),
	p_city: z.string().optional(),
	p_code: z.string().optional(),
	p_country: z.string().optional(),
	p_province: z.string().optional(),
	p_street: z.string().optional(),
	p_street2: z.string().optional(),
	contacts: ContactsSchema.optional(),
});

export type FreshBooksClientWrite = z.infer<typeof ClientWriteSchema>;

const ClientsListInputSchema = z.object({
	accountId: AccountIdSchema,
	page: AccountingPageSchema,
	per_page: PerPageSchema,
});

export type ClientsListInput = z.infer<typeof ClientsListInputSchema>;

const ClientsGetInputSchema = z.object({
	accountId: AccountIdSchema,
	customerId: z
		.number()
		.int()
		.positive()
		.describe("The client id, from a client's `id`."),
});

export type ClientsGetInput = z.infer<typeof ClientsGetInputSchema>;

const ClientsCreateInputSchema = z.object({
	accountId: AccountIdSchema,
	client: ClientWriteSchema.describe('The client fields to set.'),
});

export type ClientsCreateInput = z.infer<typeof ClientsCreateInputSchema>;

const ClientsUpdateInputSchema = z.object({
	accountId: AccountIdSchema,
	customerId: z.number().int().positive().describe('The client to change.'),
	client: ClientWriteSchema.describe('The client fields to change.'),
});

export type ClientsUpdateInput = z.infer<typeof ClientsUpdateInputSchema>;

const ClientsDeleteInputSchema = z.object({
	accountId: AccountIdSchema,
	customerId: z.number().int().positive().describe('The client to delete.'),
});

export type ClientsDeleteInput = z.infer<typeof ClientsDeleteInputSchema>;

// ── invoices ──────────────────────────────────────────────────────────────

const InvoiceLineSchema = z.object({
	name: z.string().optional(),
	description: z.string().optional(),
	qty: z.number().optional(),
	unit_cost: z.number().optional(),
});

const InvoiceWriteSchema = z.object({
	customerid: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('The client id to bill.'),
	create_date: z.string().optional(),
	currency_code: z.string().optional(),
	invoice_number: z
		.string()
		.optional()
		.describe(
			'Omit to let FreshBooks assign the next number. Omitting it is also what avoids the 409 collision when several invoices are created concurrently.',
		),
	notes: z.string().optional(),
	terms: z.string().optional(),
	lines: z.array(InvoiceLineSchema).optional(),
});

export type FreshBooksInvoiceWrite = z.infer<typeof InvoiceWriteSchema>;

const InvoicesListInputSchema = z.object({
	accountId: AccountIdSchema,
	page: AccountingPageSchema,
	per_page: PerPageSchema,
});

export type InvoicesListInput = z.infer<typeof InvoicesListInputSchema>;

const InvoicesGetInputSchema = z.object({
	accountId: AccountIdSchema,
	invoiceId: z
		.number()
		.int()
		.positive()
		.describe("The invoice id, from an invoice's `id`."),
});

export type InvoicesGetInput = z.infer<typeof InvoicesGetInputSchema>;

const InvoicesCreateInputSchema = z.object({
	accountId: AccountIdSchema,
	invoice: InvoiceWriteSchema.extend({
		customerid: z.number().int().positive().describe('The client id to bill.'),
	}).describe('The invoice fields to set. FreshBooks creates it as a draft.'),
});

export type InvoicesCreateInput = z.infer<typeof InvoicesCreateInputSchema>;

const InvoicesUpdateInputSchema = z.object({
	accountId: AccountIdSchema,
	invoiceId: z.number().int().positive().describe('The invoice to change.'),
	invoice: InvoiceWriteSchema.describe('The invoice fields to change.'),
});

export type InvoicesUpdateInput = z.infer<typeof InvoicesUpdateInputSchema>;

const InvoicesMarkSentInputSchema = z.object({
	accountId: AccountIdSchema,
	invoiceId: z
		.number()
		.int()
		.positive()
		.describe('The draft invoice to mark sent.'),
});

export type InvoicesMarkSentInput = z.infer<typeof InvoicesMarkSentInputSchema>;

const InvoicesSendEmailInputSchema = z
	.object({
		accountId: AccountIdSchema,
		invoiceId: z
			.number()
			.int()
			.positive()
			.describe('The invoice to email to the client.'),
		email_recipients: z
			.array(z.string().min(3))
			.min(1)
			.optional()
			.describe(
				'Addresses to send to. Omit to let FreshBooks use the client email.',
			),
		email_include_pdf: z.boolean().optional(),
		invoice_customized_email: z
			.object({
				subject: z.string(),
				body: z.string(),
			})
			.optional()
			.describe('Overrides the email subject and body for this send.'),
	})
	.describe(
		'Sends the invoice to the client by email. This goes out immediately and cannot be unsent.',
	);

export type InvoicesSendEmailInput = z.infer<
	typeof InvoicesSendEmailInputSchema
>;

const InvoicesDeleteInputSchema = z.object({
	accountId: AccountIdSchema,
	invoiceId: z.number().int().positive().describe('The invoice to delete.'),
});

export type InvoicesDeleteInput = z.infer<typeof InvoicesDeleteInputSchema>;

// ── estimates ─────────────────────────────────────────────────────────────

const EstimateLineSchema = z.object({
	name: z.string().optional(),
	description: z.string().optional(),
	qty: z.number().optional(),
	unit_cost: z.number().optional(),
});

const EstimateWriteSchema = z.object({
	customerid: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('The client id to estimate for.'),
	create_date: z.string().optional(),
	email: z.string().optional(),
	notes: z.string().optional(),
	terms: z.string().optional(),
	lines: z.array(EstimateLineSchema).optional(),
});

export type FreshBooksEstimateWrite = z.infer<typeof EstimateWriteSchema>;

const EstimatesListInputSchema = z.object({
	accountId: AccountIdSchema,
	page: AccountingPageSchema,
	per_page: PerPageSchema,
});

export type EstimatesListInput = z.infer<typeof EstimatesListInputSchema>;

const EstimatesGetInputSchema = z.object({
	accountId: AccountIdSchema,
	estimateId: z
		.number()
		.int()
		.positive()
		.describe("The estimate id, from an estimate's `id`."),
});

export type EstimatesGetInput = z.infer<typeof EstimatesGetInputSchema>;

const EstimatesCreateInputSchema = z.object({
	accountId: AccountIdSchema,
	estimate: EstimateWriteSchema.extend({
		customerid: z
			.number()
			.int()
			.positive()
			.describe('The client id to estimate for.'),
	}).describe('The estimate fields to set. FreshBooks creates it as a draft.'),
});

export type EstimatesCreateInput = z.infer<typeof EstimatesCreateInputSchema>;

const EstimatesUpdateInputSchema = z.object({
	accountId: AccountIdSchema,
	estimateId: z.number().int().positive().describe('The estimate to change.'),
	estimate: EstimateWriteSchema.describe('The estimate fields to change.'),
});

export type EstimatesUpdateInput = z.infer<typeof EstimatesUpdateInputSchema>;

const EstimatesDeleteInputSchema = z.object({
	accountId: AccountIdSchema,
	estimateId: z.number().int().positive().describe('The estimate to delete.'),
});

export type EstimatesDeleteInput = z.infer<typeof EstimatesDeleteInputSchema>;

// ── expenses ──────────────────────────────────────────────────────────────

const ExpenseWriteSchema = z.object({
	amount: z
		.object({
			amount: z
				.string()
				.describe('The expense amount as a string, such as "39.99".'),
			code: z.string().optional().describe('Currency code, such as USD.'),
		})
		.optional()
		.describe('The amount spent. Required to create an expense.'),
	categoryid: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('The expense category id.'),
	staffid: z.number().int().positive().optional(),
	clientid: z.number().int().positive().optional(),
	projectid: z.number().int().positive().optional(),
	date: z.string().optional().describe('Expense date, such as 2026-01-31.'),
	vendor: z.string().optional(),
	note: z.string().optional(),
	isduplicate: z.boolean().optional(),
	has_receipt: z.boolean().optional(),
});

export type FreshBooksExpenseWrite = z.infer<typeof ExpenseWriteSchema>;

const ExpensesListInputSchema = z.object({
	accountId: AccountIdSchema,
	page: AccountingPageSchema,
	per_page: PerPageSchema,
});

export type ExpensesListInput = z.infer<typeof ExpensesListInputSchema>;

const ExpensesGetInputSchema = z.object({
	accountId: AccountIdSchema,
	expenseId: z
		.number()
		.int()
		.positive()
		.describe("The expense id, from an expense's `id`."),
});

export type ExpensesGetInput = z.infer<typeof ExpensesGetInputSchema>;

const ExpensesCreateInputSchema = z.object({
	accountId: AccountIdSchema,
	expense: ExpenseWriteSchema.extend({
		amount: z
			.object({
				amount: z
					.string()
					.describe('The expense amount as a string, such as "39.99".'),
				code: z.string().optional().describe('Currency code, such as USD.'),
			})
			.describe('The amount spent.'),
		categoryid: z
			.number()
			.int()
			.positive()
			.describe('The expense category id.'),
	}).describe('The expense to record.'),
});

export type ExpensesCreateInput = z.infer<typeof ExpensesCreateInputSchema>;

const ExpensesUpdateInputSchema = z.object({
	accountId: AccountIdSchema,
	expenseId: z.number().int().positive().describe('The expense to change.'),
	expense: ExpenseWriteSchema.describe('The expense fields to change.'),
});

export type ExpensesUpdateInput = z.infer<typeof ExpensesUpdateInputSchema>;

const ExpensesDeleteInputSchema = z.object({
	accountId: AccountIdSchema,
	expenseId: z.number().int().positive().describe('The expense to delete.'),
});

export type ExpensesDeleteInput = z.infer<typeof ExpensesDeleteInputSchema>;

// ── tasks (accounting billable tasks) ─────────────────────────────────────

const TaskWriteSchema = z.object({
	name: z.string().optional(),
	description: z.string().optional(),
	billable: z.boolean().optional(),
	rate: z
		.object({
			amount: z.string(),
			code: z.string().optional(),
		})
		.optional()
		.describe('The hourly rate, such as { amount: "100.00", code: "CAD" }.'),
	tax1: z.number().optional(),
	tax2: z.number().optional(),
});

export type FreshBooksTaskWrite = z.infer<typeof TaskWriteSchema>;

const TasksListInputSchema = z.object({
	accountId: AccountIdSchema,
	page: AccountingPageSchema,
	per_page: PerPageSchema,
});

export type TasksListInput = z.infer<typeof TasksListInputSchema>;

const TasksGetInputSchema = z.object({
	accountId: AccountIdSchema,
	taskId: z
		.number()
		.int()
		.positive()
		.describe("The task id, from a task's `id`."),
});

export type TasksGetInput = z.infer<typeof TasksGetInputSchema>;

const TasksCreateInputSchema = z.object({
	accountId: AccountIdSchema,
	task: TaskWriteSchema.extend({
		name: z.string().min(1).describe('The task name, such as Consulting.'),
	}).describe('The task to create.'),
});

export type TasksCreateInput = z.infer<typeof TasksCreateInputSchema>;

const TasksUpdateInputSchema = z.object({
	accountId: AccountIdSchema,
	taskId: z.number().int().positive().describe('The task to change.'),
	task: TaskWriteSchema.describe('The task fields to change.'),
});

export type TasksUpdateInput = z.infer<typeof TasksUpdateInputSchema>;

// ── projects ──────────────────────────────────────────────────────────────

const ServiceSchema = z.object({
	id: z.number().optional(),
	name: z.string().optional(),
	billable: z.boolean().optional(),
	rate: z.string().optional(),
});

const ProjectWriteSchema = z.object({
	title: z.string().optional(),
	description: z.string().optional(),
	project_type: z
		.enum(['fixed_price', 'hourly_rate'])
		.optional()
		.describe('fixed_price needs fixed_price; hourly_rate needs rate.'),
	client_id: z
		.union([z.string(), z.number()])
		.optional()
		.describe('The client this project bills.'),
	fixed_price: z.string().optional(),
	rate: z.string().optional(),
	budget: z.string().optional(),
	due_date: z.string().optional(),
	start_date: z.string().optional(),
	complete: z.boolean().optional(),
	services: z.array(ServiceSchema).optional(),
});

export type FreshBooksProjectWrite = z.infer<typeof ProjectWriteSchema>;

const ProjectsListInputSchema = z.object({
	businessId: BusinessIdSchema,
	page: ProjectsPageSchema,
	per_page: PerPageSchema,
});

export type ProjectsListInput = z.infer<typeof ProjectsListInputSchema>;

const ProjectsGetInputSchema = z.object({
	businessId: BusinessIdSchema,
	projectId: z
		.number()
		.int()
		.positive()
		.describe("The project id, from a project's `id`."),
});

export type ProjectsGetInput = z.infer<typeof ProjectsGetInputSchema>;

const ProjectsCreateInputSchema = z.object({
	businessId: BusinessIdSchema,
	project: ProjectWriteSchema.extend({
		title: z.string().min(1).describe('The project title.'),
		project_type: z
			.enum(['fixed_price', 'hourly_rate'])
			.describe('fixed_price needs fixed_price; hourly_rate needs rate.'),
	}).describe('The project to create.'),
});

export type ProjectsCreateInput = z.infer<typeof ProjectsCreateInputSchema>;

const ProjectsUpdateInputSchema = z.object({
	businessId: BusinessIdSchema,
	projectId: z.number().int().positive().describe('The project to change.'),
	project: ProjectWriteSchema.describe('The project fields to change.'),
});

export type ProjectsUpdateInput = z.infer<typeof ProjectsUpdateInputSchema>;

const ProjectsDeleteInputSchema = z.object({
	businessId: BusinessIdSchema,
	projectId: z.number().int().positive().describe('The project to delete.'),
});

export type ProjectsDeleteInput = z.infer<typeof ProjectsDeleteInputSchema>;

const ProjectsDeleteResponseSchema = z.object({
	success: z.literal(true),
	projectId: z.number(),
});

export type ProjectsDeleteResponse = z.infer<
	typeof ProjectsDeleteResponseSchema
>;

// ── timeEntries ───────────────────────────────────────────────────────────

const TimeEntryWriteSchema = z.object({
	is_logged: z
		.boolean()
		.optional()
		.describe('True records the time immediately; false starts a timer.'),
	duration: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('Seconds logged, such as 7200 for two hours.'),
	started_at: z
		.string()
		.optional()
		.describe('When the work started, such as 2026-01-31T09:00:00Z.'),
	note: z.string().optional(),
	project_id: z.union([z.number(), z.string()]).optional(),
	client_id: z.union([z.number(), z.string()]).optional(),
	identity_id: z
		.union([z.number(), z.string()])
		.optional()
		.describe('The user logging the time.'),
});

export type FreshBooksTimeEntryWrite = z.infer<typeof TimeEntryWriteSchema>;

const TimeEntriesListInputSchema = z.object({
	businessId: BusinessIdSchema,
	started_from: z
		.string()
		.optional()
		.describe('Only entries starting at or after this ISO time.'),
	started_to: z
		.string()
		.optional()
		.describe('Only entries starting at or before this ISO time.'),
	updated_since: z
		.string()
		.optional()
		.describe('Only entries updated at or after this ISO time.'),
	billed: z
		.boolean()
		.optional()
		.describe('Only billed (true) or unbilled (false) entries.'),
	include_deleted: z
		.boolean()
		.optional()
		.describe('Sent as 1; adds deleted entries.'),
	page: TimeEntriesPageSchema,
	per_page: PerPageSchema,
});

export type TimeEntriesListInput = z.infer<typeof TimeEntriesListInputSchema>;

const TimeEntriesGetInputSchema = z.object({
	businessId: BusinessIdSchema,
	timeEntryId: z
		.number()
		.int()
		.positive()
		.describe("The time entry id, from a time entry's `id`."),
});

export type TimeEntriesGetInput = z.infer<typeof TimeEntriesGetInputSchema>;

const TimeEntriesCreateInputSchema = z.object({
	businessId: BusinessIdSchema,
	time_entry: TimeEntryWriteSchema.extend({
		is_logged: z
			.boolean()
			.describe('True records the time immediately; false starts a timer.'),
		duration: z
			.number()
			.int()
			.positive()
			.describe('Seconds logged, such as 7200 for two hours.'),
		started_at: z
			.string()
			.describe('When the work started, such as 2026-01-31T09:00:00Z.'),
	}).describe('The time entry to create.'),
});

export type TimeEntriesCreateInput = z.infer<
	typeof TimeEntriesCreateInputSchema
>;

const TimeEntriesUpdateInputSchema = z.object({
	businessId: BusinessIdSchema,
	timeEntryId: z
		.number()
		.int()
		.positive()
		.describe('The time entry to change.'),
	time_entry: TimeEntryWriteSchema.describe('The time entry fields to change.'),
});

export type TimeEntriesUpdateInput = z.infer<
	typeof TimeEntriesUpdateInputSchema
>;

const TimeEntriesDeleteInputSchema = z.object({
	businessId: BusinessIdSchema,
	timeEntryId: z
		.number()
		.int()
		.positive()
		.describe('The time entry to delete.'),
});

export type TimeEntriesDeleteInput = z.infer<
	typeof TimeEntriesDeleteInputSchema
>;

const TimeEntriesDeleteResponseSchema = z.object({
	success: z.literal(true),
	timeEntryId: z.number(),
});

export type TimeEntriesDeleteResponse = z.infer<
	typeof TimeEntriesDeleteResponseSchema
>;

// ── Registries ────────────────────────────────────────────────────────────

export type FreshBooksEndpointInputs = {
	usersMe: UsersMeInput;
	clientsList: ClientsListInput;
	clientsGet: ClientsGetInput;
	clientsCreate: ClientsCreateInput;
	clientsUpdate: ClientsUpdateInput;
	clientsDelete: ClientsDeleteInput;
	invoicesList: InvoicesListInput;
	invoicesGet: InvoicesGetInput;
	invoicesCreate: InvoicesCreateInput;
	invoicesUpdate: InvoicesUpdateInput;
	invoicesMarkSent: InvoicesMarkSentInput;
	invoicesSendEmail: InvoicesSendEmailInput;
	invoicesDelete: InvoicesDeleteInput;
	estimatesList: EstimatesListInput;
	estimatesGet: EstimatesGetInput;
	estimatesCreate: EstimatesCreateInput;
	estimatesUpdate: EstimatesUpdateInput;
	estimatesDelete: EstimatesDeleteInput;
	expensesList: ExpensesListInput;
	expensesGet: ExpensesGetInput;
	expensesCreate: ExpensesCreateInput;
	expensesUpdate: ExpensesUpdateInput;
	expensesDelete: ExpensesDeleteInput;
	tasksList: TasksListInput;
	tasksGet: TasksGetInput;
	tasksCreate: TasksCreateInput;
	tasksUpdate: TasksUpdateInput;
	projectsList: ProjectsListInput;
	projectsGet: ProjectsGetInput;
	projectsCreate: ProjectsCreateInput;
	projectsUpdate: ProjectsUpdateInput;
	projectsDelete: ProjectsDeleteInput;
	timeEntriesList: TimeEntriesListInput;
	timeEntriesGet: TimeEntriesGetInput;
	timeEntriesCreate: TimeEntriesCreateInput;
	timeEntriesUpdate: TimeEntriesUpdateInput;
	timeEntriesDelete: TimeEntriesDeleteInput;
};

export type FreshBooksEndpointOutputs = {
	usersMe: FreshBooksUsersMeResponse;
	clientsList: z.infer<typeof ClientsListResponseSchema>;
	clientsGet: z.infer<typeof ClientResponseSchema>;
	clientsCreate: z.infer<typeof ClientResponseSchema>;
	clientsUpdate: z.infer<typeof ClientResponseSchema>;
	clientsDelete: z.infer<typeof ClientResponseSchema>;
	invoicesList: z.infer<typeof InvoicesListResponseSchema>;
	invoicesGet: z.infer<typeof InvoiceResponseSchema>;
	invoicesCreate: z.infer<typeof InvoiceResponseSchema>;
	invoicesUpdate: z.infer<typeof InvoiceResponseSchema>;
	invoicesMarkSent: z.infer<typeof InvoiceResponseSchema>;
	invoicesSendEmail: z.infer<typeof InvoiceResponseSchema>;
	invoicesDelete: z.infer<typeof InvoiceResponseSchema>;
	estimatesList: z.infer<typeof EstimatesListResponseSchema>;
	estimatesGet: z.infer<typeof EstimateResponseSchema>;
	estimatesCreate: z.infer<typeof EstimateResponseSchema>;
	estimatesUpdate: z.infer<typeof EstimateResponseSchema>;
	estimatesDelete: z.infer<typeof EstimateResponseSchema>;
	expensesList: z.infer<typeof ExpensesListResponseSchema>;
	expensesGet: z.infer<typeof ExpenseResponseSchema>;
	expensesCreate: z.infer<typeof ExpenseResponseSchema>;
	expensesUpdate: z.infer<typeof ExpenseResponseSchema>;
	expensesDelete: z.infer<typeof ExpenseResponseSchema>;
	tasksList: z.infer<typeof TasksListResponseSchema>;
	tasksGet: z.infer<typeof TaskResponseSchema>;
	tasksCreate: z.infer<typeof TaskResponseSchema>;
	tasksUpdate: z.infer<typeof TaskResponseSchema>;
	projectsList: z.infer<typeof ProjectsListResponseSchema>;
	projectsGet: z.infer<typeof ProjectResponseSchema>;
	projectsCreate: z.infer<typeof ProjectResponseSchema>;
	projectsUpdate: z.infer<typeof ProjectResponseSchema>;
	projectsDelete: ProjectsDeleteResponse;
	timeEntriesList: z.infer<typeof TimeEntriesListResponseSchema>;
	timeEntriesGet: z.infer<typeof TimeEntryResponseSchema>;
	timeEntriesCreate: z.infer<typeof TimeEntryResponseSchema>;
	timeEntriesUpdate: z.infer<typeof TimeEntryResponseSchema>;
	timeEntriesDelete: TimeEntriesDeleteResponse;
};

export const FreshBooksEndpointInputSchemas = {
	usersMe: UsersMeInputSchema,
	clientsList: ClientsListInputSchema,
	clientsGet: ClientsGetInputSchema,
	clientsCreate: ClientsCreateInputSchema,
	clientsUpdate: ClientsUpdateInputSchema,
	clientsDelete: ClientsDeleteInputSchema,
	invoicesList: InvoicesListInputSchema,
	invoicesGet: InvoicesGetInputSchema,
	invoicesCreate: InvoicesCreateInputSchema,
	invoicesUpdate: InvoicesUpdateInputSchema,
	invoicesMarkSent: InvoicesMarkSentInputSchema,
	invoicesSendEmail: InvoicesSendEmailInputSchema,
	invoicesDelete: InvoicesDeleteInputSchema,
	estimatesList: EstimatesListInputSchema,
	estimatesGet: EstimatesGetInputSchema,
	estimatesCreate: EstimatesCreateInputSchema,
	estimatesUpdate: EstimatesUpdateInputSchema,
	estimatesDelete: EstimatesDeleteInputSchema,
	expensesList: ExpensesListInputSchema,
	expensesGet: ExpensesGetInputSchema,
	expensesCreate: ExpensesCreateInputSchema,
	expensesUpdate: ExpensesUpdateInputSchema,
	expensesDelete: ExpensesDeleteInputSchema,
	tasksList: TasksListInputSchema,
	tasksGet: TasksGetInputSchema,
	tasksCreate: TasksCreateInputSchema,
	tasksUpdate: TasksUpdateInputSchema,
	projectsList: ProjectsListInputSchema,
	projectsGet: ProjectsGetInputSchema,
	projectsCreate: ProjectsCreateInputSchema,
	projectsUpdate: ProjectsUpdateInputSchema,
	projectsDelete: ProjectsDeleteInputSchema,
	timeEntriesList: TimeEntriesListInputSchema,
	timeEntriesGet: TimeEntriesGetInputSchema,
	timeEntriesCreate: TimeEntriesCreateInputSchema,
	timeEntriesUpdate: TimeEntriesUpdateInputSchema,
	timeEntriesDelete: TimeEntriesDeleteInputSchema,
} as const;

export const FreshBooksEndpointOutputSchemas = {
	usersMe: UsersMeResponseSchema,
	clientsList: ClientsListResponseSchema,
	clientsGet: ClientResponseSchema,
	clientsCreate: ClientResponseSchema,
	clientsUpdate: ClientResponseSchema,
	clientsDelete: ClientResponseSchema,
	invoicesList: InvoicesListResponseSchema,
	invoicesGet: InvoiceResponseSchema,
	invoicesCreate: InvoiceResponseSchema,
	invoicesUpdate: InvoiceResponseSchema,
	invoicesMarkSent: InvoiceResponseSchema,
	invoicesSendEmail: InvoiceResponseSchema,
	invoicesDelete: InvoiceResponseSchema,
	estimatesList: EstimatesListResponseSchema,
	estimatesGet: EstimateResponseSchema,
	estimatesCreate: EstimateResponseSchema,
	estimatesUpdate: EstimateResponseSchema,
	estimatesDelete: EstimateResponseSchema,
	expensesList: ExpensesListResponseSchema,
	expensesGet: ExpenseResponseSchema,
	expensesCreate: ExpenseResponseSchema,
	expensesUpdate: ExpenseResponseSchema,
	expensesDelete: ExpenseResponseSchema,
	tasksList: TasksListResponseSchema,
	tasksGet: TaskResponseSchema,
	tasksCreate: TaskResponseSchema,
	tasksUpdate: TaskResponseSchema,
	projectsList: ProjectsListResponseSchema,
	projectsGet: ProjectResponseSchema,
	projectsCreate: ProjectResponseSchema,
	projectsUpdate: ProjectResponseSchema,
	projectsDelete: ProjectsDeleteResponseSchema,
	timeEntriesList: TimeEntriesListResponseSchema,
	timeEntriesGet: TimeEntryResponseSchema,
	timeEntriesCreate: TimeEntryResponseSchema,
	timeEntriesUpdate: TimeEntryResponseSchema,
	timeEntriesDelete: TimeEntriesDeleteResponseSchema,
} as const;
