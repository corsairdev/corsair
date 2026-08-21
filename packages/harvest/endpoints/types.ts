import { z } from 'zod';
import type { HarvestLineItem } from '../schema/database';
import {
	HarvestClientEntity,
	HarvestCompanyEntity,
	HarvestContactEntity,
	HarvestEstimateEntity,
	HarvestExpenseCategoryEntity,
	HarvestInvoiceEntity,
	HarvestInvoiceItemCategoryEntity,
	HarvestProjectEntity,
	HarvestReference,
	HarvestTaskEntity,
	HarvestUserEntity,
} from '../schema/database';

/**
 * Input and output schemas for every Harvest operation.
 *
 * Output schemas reuse the entity definitions in `schema/database.ts` rather
 * than restating them, so the persisted shape and the returned shape cannot
 * drift apart.
 */

const S = z.string().nullable().optional();
const N = z.number().nullable().optional();
const B = z.boolean().nullable().optional();

/* -------------------------------------------------------------------------- */
/*                                  Envelopes                                  */
/* -------------------------------------------------------------------------- */

/**
 * Harvest wraps every collection in the same envelope; only the key holding the
 * rows changes. Declaring the wrapper once keeps all twenty list operations
 * consistent and means a change to Harvest's pagination is a one-line edit.
 *
 * @see https://help.getharvest.com/api-v2/introduction/overview/pagination/
 */
const PaginationFields = {
	per_page: N,
	total_pages: N,
	total_entries: N,
	next_page: N,
	previous_page: N,
	page: N,
	links: z
		.object({ first: S, next: S, previous: S, last: S })
		.loose()
		.nullable()
		.optional(),
};

const withPagination = <Shape extends z.ZodRawShape>(shape: Shape) =>
	z.object({ ...shape, ...PaginationFields }).loose();

/** Query parameters accepted by every list operation. */
const ListQuery = {
	page: z.number().int().positive().optional(),
	per_page: z.number().int().min(1).max(2000).optional(),
	updated_since: z.string().optional(),
};

/**
 * Harvest answers a successful DELETE with 200 and an empty body, so there is
 * nothing to parse. The operations report the outcome explicitly instead of
 * returning an empty object, which would be indistinguishable from a failure
 * that was swallowed.
 */
export const DeleteResultSchema = z.object({
	success: z.boolean(),
	id: z.number().nullable().optional(),
});

/* -------------------------------------------------------------------------- */
/*                          Sub-resources without a cache                      */
/* -------------------------------------------------------------------------- */

/**
 * Invoice and estimate messages, and invoice payments.
 *
 * These are transactional records rather than reference data, so they are not
 * persisted and their shapes live here rather than in `schema/database.ts`.
 * Every field is optional: which ones Harvest returns depends on the event that
 * produced the message.
 */
export const InvoiceMessageSchema = z
	.object({
		id: N,
		sent_by: S,
		sent_by_email: S,
		sent_from: S,
		sent_from_email: S,
		include_link_to_client_invoice: B,
		send_me_a_copy: B,
		thank_you: B,
		reminder: B,
		send_reminder_on: S,
		attach_pdf: B,
		subject: S,
		body: S,
		event_type: S,
		recipients: z
			.array(z.object({ name: S, email: S }).loose())
			.nullable()
			.optional(),
		created_at: S,
		updated_at: S,
	})
	.loose();

export const EstimateMessageSchema = z
	.object({
		id: N,
		sent_by: S,
		sent_by_email: S,
		sent_from: S,
		sent_from_email: S,
		send_me_a_copy: B,
		subject: S,
		body: S,
		event_type: S,
		recipients: z
			.array(z.object({ name: S, email: S }).loose())
			.nullable()
			.optional(),
		created_at: S,
		updated_at: S,
	})
	.loose();

export const InvoicePaymentSchema = z
	.object({
		id: N,
		amount: N,
		paid_at: S,
		paid_date: S,
		recorded_by: S,
		recorded_by_email: S,
		notes: S,
		transaction_id: S,
		payment_gateway: HarvestReference.nullable().optional(),
		created_at: S,
		updated_at: S,
	})
	.loose();

/**
 * Project user assignment stub returned on expenses and time entries.
 * Official expense example + live 2026-08-13 (includes `use_default_rates`).
 */
const UserAssignmentSchema = z
	.object({
		id: N,
		is_project_manager: B,
		is_active: B,
		budget: N,
		hourly_rate: N,
		use_default_rates: B,
		created_at: S,
		updated_at: S,
	})
	.loose();

/** Project task assignment stub returned on time entries. Live 2026-08-13. */
const TaskAssignmentSchema = z
	.object({
		id: N,
		billable: B,
		is_active: B,
		budget: N,
		hourly_rate: N,
		created_at: S,
		updated_at: S,
	})
	.loose();

/**
 * Expense receipt. Official:
 * https://help.getharvest.com/api-v2/expenses-api/expenses/expenses/
 */
const ReceiptSchema = z
	.object({
		url: S,
		file_name: S,
		file_size: N,
		content_type: S,
	})
	.loose();

/**
 * External reference on a time entry. Official:
 * https://help.getharvest.com/api-v2/timesheets-api/timesheets/time-entries/
 */
const ExternalReferenceSchema = z
	.object({
		id: S,
		group_id: S,
		account_id: S,
		permalink: S,
		service: S,
		service_icon_url: S,
	})
	.loose();

const ExternalReferenceInput = z.object({
	id: z.string().optional(),
	group_id: z.string().optional(),
	account_id: z.string().optional(),
	permalink: z.string().optional(),
});

/**
 * Expenses are returned by create and update but never cached.
 *
 * Official: https://help.getharvest.com/api-v2/expenses-api/expenses/expenses/
 * Live 2026-08-13 also returns `is_explicitly_locked` and `reimbursement`.
 */
export const ExpenseSchema = z
	.object({
		id: z.number(),
		spent_date: S,
		notes: S,
		total_cost: N,
		units: N,
		billable: B,
		receipt: ReceiptSchema.nullable().optional(),
		approval_status: S,
		is_closed: B,
		is_locked: B,
		is_explicitly_locked: B,
		is_billed: B,
		locked_reason: S,
		reimbursement: B,
		user: HarvestReference.nullable().optional(),
		client: HarvestReference.nullable().optional(),
		project: HarvestReference.nullable().optional(),
		expense_category: HarvestReference.nullable().optional(),
		user_assignment: UserAssignmentSchema.nullable().optional(),
		invoice: HarvestReference.nullable().optional(),
		created_at: S,
		updated_at: S,
	})
	.loose();

/**
 * Time entries are returned by five operations but never cached.
 *
 * Official: https://help.getharvest.com/api-v2/timesheets-api/timesheets/time-entries/
 * Live 2026-08-13 also returns `is_explicitly_locked`.
 */
export const TimeEntrySchema = z
	.object({
		id: z.number(),
		spent_date: S,
		hours: N,
		hours_without_timer: N,
		rounded_hours: N,
		notes: S,
		is_locked: B,
		is_explicitly_locked: B,
		locked_reason: S,
		approval_status: S,
		is_closed: B,
		is_billed: B,
		timer_started_at: S,
		started_time: S,
		ended_time: S,
		is_running: B,
		billable: B,
		budgeted: B,
		billable_rate: N,
		cost_rate: N,
		user: HarvestReference.nullable().optional(),
		client: HarvestReference.nullable().optional(),
		project: HarvestReference.nullable().optional(),
		task: HarvestReference.nullable().optional(),
		user_assignment: UserAssignmentSchema.nullable().optional(),
		task_assignment: TaskAssignmentSchema.nullable().optional(),
		invoice: HarvestReference.nullable().optional(),
		external_reference: ExternalReferenceSchema.nullable().optional(),
		created_at: S,
		updated_at: S,
	})
	.loose();

/** Estimate item categories carry only a name; no cache entity is warranted. */
export const EstimateItemCategorySchema = z
	.object({
		id: z.number(),
		name: S,
		created_at: S,
		updated_at: S,
	})
	.loose();

/* -------------------------------------------------------------------------- */
/*                                   Inputs                                    */
/* -------------------------------------------------------------------------- */

/**
 * Line items accepted when creating or updating an invoice or estimate.
 * `kind` must name an existing item category.
 */
const LineItemInput = z.object({
	id: z.number().int().optional(),
	kind: z.string(),
	description: z.string().optional(),
	quantity: z.number().optional(),
	unit_price: z.number(),
	taxed: z.boolean().optional(),
	taxed2: z.boolean().optional(),
	project_id: z.number().int().optional(),
});

export const HarvestEndpointInputSchemas = {
	/* ------------------------------ Clients ------------------------------- */
	clientsList: z.object({ is_active: z.boolean().optional(), ...ListQuery }),
	clientsGet: z.object({ client_id: z.number().int() }),
	clientsCreate: z.object({
		name: z.string().min(1),
		is_active: z.boolean().optional(),
		address: z.string().optional(),
		currency: z.string().optional(),
	}),
	clientsUpdate: z.object({
		client_id: z.number().int(),
		name: z.string().min(1).optional(),
		is_active: z.boolean().optional(),
		address: z.string().optional(),
		currency: z.string().optional(),
	}),
	clientsDelete: z.object({ client_id: z.number().int() }),

	/* ------------------------------ Contacts ------------------------------ */
	contactsList: z.object({
		client_id: z.number().int().optional(),
		...ListQuery,
	}),
	contactsCreate: z.object({
		client_id: z.number().int(),
		first_name: z.string().min(1),
		last_name: z.string().optional(),
		title: z.string().optional(),
		email: z.email().optional(),
		phone_office: z.string().optional(),
		phone_mobile: z.string().optional(),
		fax: z.string().optional(),
		invoice_recipient_status: z
			.enum(['none', 'recipient', 'cc', 'bcc'])
			.optional(),
	}),
	contactsUpdate: z.object({
		contact_id: z.number().int(),
		client_id: z.number().int().optional(),
		first_name: z.string().min(1).optional(),
		last_name: z.string().optional(),
		title: z.string().optional(),
		email: z.email().optional(),
		phone_office: z.string().optional(),
		phone_mobile: z.string().optional(),
		fax: z.string().optional(),
		invoice_recipient_status: z
			.enum(['none', 'recipient', 'cc', 'bcc'])
			.optional(),
	}),
	contactsDelete: z.object({ contact_id: z.number().int() }),

	/* ------------------------------- Company ------------------------------ */
	companyGet: z.object({}),
	/**
	 * Only these two settings are writable through the API; everything else on
	 * the company object must be changed in the Harvest web interface.
	 */
	companyUpdate: z.object({
		wants_timestamp_timers: z.boolean().optional(),
		weekly_capacity: z.number().int().optional(),
	}),

	/* ------------------------------ Projects ------------------------------ */
	projectsList: z.object({
		is_active: z.boolean().optional(),
		client_id: z.number().int().optional(),
		...ListQuery,
	}),
	projectsGet: z.object({ project_id: z.number().int() }),
	projectsCreate: z.object({
		client_id: z.number().int(),
		name: z.string().min(1),
		is_billable: z.boolean(),
		bill_by: z.enum(['Project', 'Tasks', 'People', 'none']),
		budget_by: z.enum([
			'project',
			'project_cost',
			'task',
			'task_fees',
			'person',
			'none',
		]),
		code: z.string().optional(),
		is_active: z.boolean().optional(),
		is_fixed_fee: z.boolean().optional(),
		hourly_rate: z.number().optional(),
		budget: z.number().optional(),
		budget_is_monthly: z.boolean().optional(),
		notify_when_over_budget: z.boolean().optional(),
		over_budget_notification_percentage: z.number().optional(),
		show_budget_to_all: z.boolean().optional(),
		cost_budget: z.number().optional(),
		cost_budget_include_expenses: z.boolean().optional(),
		fee: z.number().optional(),
		notes: z.string().optional(),
		starts_on: z.string().optional(),
		ends_on: z.string().optional(),
	}),
	projectsUpdate: z.object({
		project_id: z.number().int(),
		client_id: z.number().int().optional(),
		name: z.string().min(1).optional(),
		code: z.string().optional(),
		is_active: z.boolean().optional(),
		is_billable: z.boolean().optional(),
		is_fixed_fee: z.boolean().optional(),
		bill_by: z.enum(['Project', 'Tasks', 'People', 'none']).optional(),
		budget_by: z
			.enum(['project', 'project_cost', 'task', 'task_fees', 'person', 'none'])
			.optional(),
		hourly_rate: z.number().optional(),
		budget: z.number().optional(),
		budget_is_monthly: z.boolean().optional(),
		notify_when_over_budget: z.boolean().optional(),
		over_budget_notification_percentage: z.number().optional(),
		show_budget_to_all: z.boolean().optional(),
		cost_budget: z.number().optional(),
		cost_budget_include_expenses: z.boolean().optional(),
		fee: z.number().optional(),
		notes: z.string().optional(),
		starts_on: z.string().optional(),
		ends_on: z.string().optional(),
	}),
	projectsDelete: z.object({ project_id: z.number().int() }),

	/* -------------------------------- Tasks ------------------------------- */
	tasksList: z.object({ is_active: z.boolean().optional(), ...ListQuery }),
	tasksGet: z.object({ task_id: z.number().int() }),
	tasksCreate: z.object({
		name: z.string().min(1),
		billable_by_default: z.boolean().optional(),
		default_hourly_rate: z.number().optional(),
		is_default: z.boolean().optional(),
		is_active: z.boolean().optional(),
	}),
	tasksUpdate: z.object({
		task_id: z.number().int(),
		name: z.string().min(1).optional(),
		billable_by_default: z.boolean().optional(),
		default_hourly_rate: z.number().optional(),
		is_default: z.boolean().optional(),
		is_active: z.boolean().optional(),
	}),
	tasksDelete: z.object({ task_id: z.number().int() }),

	/* ----------------------------- Time entries --------------------------- */
	timeEntriesList: z.object({
		user_id: z.number().int().optional(),
		client_id: z.number().int().optional(),
		project_id: z.number().int().optional(),
		task_id: z.number().int().optional(),
		external_reference_id: z.string().optional(),
		is_billed: z.boolean().optional(),
		is_running: z.boolean().optional(),
		approval_status: z
			.enum(['unsubmitted', 'submitted', 'approved'])
			.optional(),
		from: z.string().optional(),
		to: z.string().optional(),
		...ListQuery,
	}),
	timeEntriesGet: z.object({ time_entry_id: z.number().int() }),
	/**
	 * `hours` and `started_time`/`ended_time` are alternatives: which one
	 * Harvest accepts depends on the account's `wants_timestamp_timers`
	 * setting, so both are optional and the API decides.
	 */
	timeEntriesCreate: z.object({
		project_id: z.number().int(),
		task_id: z.number().int(),
		spent_date: z.string(),
		user_id: z.number().int().optional(),
		hours: z.number().optional(),
		started_time: z.string().optional(),
		ended_time: z.string().optional(),
		notes: z.string().optional(),
		external_reference: ExternalReferenceInput.optional(),
	}),
	timeEntriesUpdate: z.object({
		time_entry_id: z.number().int(),
		project_id: z.number().int().optional(),
		task_id: z.number().int().optional(),
		spent_date: z.string().optional(),
		hours: z.number().optional(),
		started_time: z.string().optional(),
		ended_time: z.string().optional(),
		notes: z.string().optional(),
		external_reference: ExternalReferenceInput.optional(),
	}),
	timeEntriesDelete: z.object({ time_entry_id: z.number().int() }),

	/* -------------------------------- Users ------------------------------- */
	usersList: z.object({ is_active: z.boolean().optional(), ...ListQuery }),
	usersGet: z.object({ user_id: z.number().int() }),
	/**
	 * Creating a user sends an invitation email to `email`. There is no
	 * dry-run mode.
	 */
	usersCreate: z.object({
		first_name: z.string().min(1),
		last_name: z.string().min(1),
		email: z.email(),
		timezone: z.string().optional(),
		is_contractor: z.boolean().optional(),
		is_active: z.boolean().optional(),
		weekly_capacity: z.number().int().optional(),
		default_hourly_rate: z.number().optional(),
		cost_rate: z.number().optional(),
		has_access_to_all_future_projects: z.boolean().optional(),
		saml_exempt: z.boolean().optional(),
		roles: z.array(z.string()).optional(),
		access_roles: z.array(z.string()).optional(),
	}),
	usersUpdate: z.object({
		user_id: z.number().int(),
		first_name: z.string().min(1).optional(),
		last_name: z.string().min(1).optional(),
		email: z.email().optional(),
		timezone: z.string().optional(),
		is_contractor: z.boolean().optional(),
		is_active: z.boolean().optional(),
		weekly_capacity: z.number().int().optional(),
		default_hourly_rate: z.number().optional(),
		cost_rate: z.number().optional(),
		has_access_to_all_future_projects: z.boolean().optional(),
		saml_exempt: z.boolean().optional(),
		roles: z.array(z.string()).optional(),
		access_roles: z.array(z.string()).optional(),
	}),
	usersDelete: z.object({ user_id: z.number().int() }),

	/* ------------------------------- Expenses ----------------------------- */
	/**
	 * Harvest requires either `units` (priced by the category's unit rate) or
	 * `total_cost`, and rejects a request carrying neither.
	 */
	expensesCreate: z
		.object({
			project_id: z.number().int(),
			expense_category_id: z.number().int(),
			spent_date: z.string(),
			user_id: z.number().int().optional(),
			units: z.number().optional(),
			total_cost: z.number().optional(),
			notes: z.string().optional(),
			billable: z.boolean().optional(),
		})
		.refine(
			(value) => value.units !== undefined || value.total_cost !== undefined,
			{ message: 'Provide either units or total_cost' },
		),
	expensesUpdate: z.object({
		expense_id: z.number().int(),
		project_id: z.number().int().optional(),
		expense_category_id: z.number().int().optional(),
		spent_date: z.string().optional(),
		units: z.number().optional(),
		total_cost: z.number().optional(),
		notes: z.string().optional(),
		billable: z.boolean().optional(),
		delete_receipt: z.boolean().optional(),
	}),
	expenseCategoriesList: z.object({
		is_active: z.boolean().optional(),
		...ListQuery,
	}),

	/* ------------------------------- Invoices ----------------------------- */
	invoicesList: z.object({
		client_id: z.number().int().optional(),
		project_id: z.number().int().optional(),
		state: z.enum(['draft', 'open', 'paid', 'closed']).optional(),
		from: z.string().optional(),
		to: z.string().optional(),
		...ListQuery,
	}),
	invoicesGet: z.object({ invoice_id: z.number().int() }),
	invoicesCreate: z.object({
		client_id: z.number().int(),
		retainer_id: z.number().int().optional(),
		estimate_id: z.number().int().optional(),
		subject: z.string().optional(),
		notes: z.string().optional(),
		number: z.string().optional(),
		purchase_order: z.string().optional(),
		currency: z.string().optional(),
		issue_date: z.string().optional(),
		due_date: z.string().optional(),
		payment_term: z.string().optional(),
		payment_options: z
			.array(z.enum(['ach', 'credit_card', 'paypal']))
			.optional(),
		tax: z.number().optional(),
		tax2: z.number().optional(),
		discount: z.number().optional(),
		line_items: z.array(LineItemInput).optional(),
	}),
	invoicesUpdate: z.object({
		invoice_id: z.number().int(),
		client_id: z.number().int().optional(),
		retainer_id: z.number().int().optional(),
		estimate_id: z.number().int().optional(),
		subject: z.string().optional(),
		notes: z.string().optional(),
		number: z.string().optional(),
		purchase_order: z.string().optional(),
		currency: z.string().optional(),
		issue_date: z.string().optional(),
		due_date: z.string().optional(),
		payment_term: z.string().optional(),
		payment_options: z
			.array(z.enum(['ach', 'credit_card', 'paypal']))
			.optional(),
		tax: z.number().optional(),
		tax2: z.number().optional(),
		discount: z.number().optional(),
		line_items: z.array(LineItemInput).optional(),
	}),
	invoicesDelete: z.object({ invoice_id: z.number().int() }),

	invoiceMessagesList: z.object({
		invoice_id: z.number().int(),
		...ListQuery,
	}),
	/**
	 * This endpoint is two operations sharing one route, and `event_type` is what
	 * selects between them - the opposite way round to what the name suggests.
	 *
	 * Omitting `event_type` is "create and send an invoice message": this is the
	 * call that emails the client. Supplying one runs a state event instead -
	 * `send` is "mark a draft invoice as sent", which records that it went out
	 * without sending anything, and `close`, `re-open` and `draft` likewise only
	 * move the invoice.
	 *
	 * Harvest rejects a send with nowhere to go - no recipients and no copy to
	 * self - so that combination is refused here rather than round-tripped, and
	 * an explicitly empty `recipients` is refused as the same mistake stated
	 * outright.
	 *
	 * @see https://help.getharvest.com/api-v2/invoices-api/invoices/invoice-messages/
	 */
	invoiceMessagesCreate: z
		.object({
			invoice_id: z.number().int(),
			event_type: z.enum(['send', 'close', 're-open', 'draft']).optional(),
			subject: z.string().optional(),
			body: z.string().optional(),
			include_link_to_client_invoice: z.boolean().optional(),
			attach_pdf: z.boolean().optional(),
			send_me_a_copy: z.boolean().optional(),
			thank_you: z.boolean().optional(),
			recipients: z
				.array(z.object({ name: z.string().optional(), email: z.email() }))
				.min(1)
				.optional(),
		})
		.refine(
			(value) =>
				value.event_type !== undefined ||
				(value.recipients?.length ?? 0) > 0 ||
				value.send_me_a_copy === true,
			{
				message:
					'Sending an invoice message needs at least one recipient, or send_me_a_copy. Pass an event_type to run a state event instead.',
			},
		),
	invoiceMessagesDelete: z.object({
		invoice_id: z.number().int(),
		message_id: z.number().int(),
	}),

	invoicePaymentsList: z.object({
		invoice_id: z.number().int(),
		...ListQuery,
	}),
	invoicePaymentsCreate: z.object({
		invoice_id: z.number().int(),
		amount: z.number(),
		paid_at: z.string().optional(),
		paid_date: z.string().optional(),
		notes: z.string().optional(),
		send_thank_you: z.boolean().optional(),
	}),
	invoicePaymentsDelete: z.object({
		invoice_id: z.number().int(),
		payment_id: z.number().int(),
	}),

	invoiceItemCategoriesList: z.object({ ...ListQuery }),
	invoiceItemCategoriesCreate: z.object({ name: z.string().min(1) }),
	invoiceItemCategoriesDelete: z.object({
		invoice_item_category_id: z.number().int(),
	}),

	/* ------------------------------ Estimates ----------------------------- */
	estimatesGet: z.object({ estimate_id: z.number().int() }),
	estimatesCreate: z.object({
		client_id: z.number().int(),
		subject: z.string().optional(),
		notes: z.string().optional(),
		number: z.string().optional(),
		purchase_order: z.string().optional(),
		currency: z.string().optional(),
		issue_date: z.string().optional(),
		tax: z.number().optional(),
		tax2: z.number().optional(),
		discount: z.number().optional(),
		line_items: z.array(LineItemInput).optional(),
	}),
	estimatesUpdate: z.object({
		estimate_id: z.number().int(),
		client_id: z.number().int().optional(),
		subject: z.string().optional(),
		notes: z.string().optional(),
		number: z.string().optional(),
		purchase_order: z.string().optional(),
		currency: z.string().optional(),
		issue_date: z.string().optional(),
		tax: z.number().optional(),
		tax2: z.number().optional(),
		discount: z.number().optional(),
		line_items: z.array(LineItemInput).optional(),
	}),
	estimatesDelete: z.object({ estimate_id: z.number().int() }),

	estimateMessagesList: z.object({
		estimate_id: z.number().int(),
		...ListQuery,
	}),
	/**
	 * Same split as `invoiceMessagesCreate`: omitting `event_type` is "create an
	 * estimate message", the call that reaches the client, while supplying one
	 * runs a state event - `send` marks a draft estimate as sent, and `accept`,
	 * `decline` and `re-open` move it through the rest of its state machine.
	 *
	 * @see https://help.getharvest.com/api-v2/estimates-api/estimates/estimate-messages/
	 */
	estimateMessagesCreate: z
		.object({
			estimate_id: z.number().int(),
			event_type: z.enum(['send', 'accept', 'decline', 're-open']).optional(),
			subject: z.string().optional(),
			body: z.string().optional(),
			send_me_a_copy: z.boolean().optional(),
			recipients: z
				.array(z.object({ name: z.string().optional(), email: z.email() }))
				.min(1)
				.optional(),
		})
		.refine(
			(value) =>
				value.event_type !== undefined ||
				(value.recipients?.length ?? 0) > 0 ||
				value.send_me_a_copy === true,
			{
				message:
					'Sending an estimate message needs at least one recipient, or send_me_a_copy. Pass an event_type to run a state event instead.',
			},
		),
	estimateMessagesDelete: z.object({
		estimate_id: z.number().int(),
		message_id: z.number().int(),
	}),

	estimateItemCategoriesCreate: z.object({ name: z.string().min(1) }),
	estimateItemCategoriesUpdate: z.object({
		estimate_item_category_id: z.number().int(),
		name: z.string().min(1),
	}),
} as const;

/* -------------------------------------------------------------------------- */
/*                                   Outputs                                   */
/* -------------------------------------------------------------------------- */

export const HarvestEndpointOutputSchemas = {
	clientsList: withPagination({ clients: z.array(HarvestClientEntity) }),
	clientsGet: HarvestClientEntity,
	clientsCreate: HarvestClientEntity,
	clientsUpdate: HarvestClientEntity,
	clientsDelete: DeleteResultSchema,

	contactsList: withPagination({ contacts: z.array(HarvestContactEntity) }),
	contactsCreate: HarvestContactEntity,
	contactsUpdate: HarvestContactEntity,
	contactsDelete: DeleteResultSchema,

	companyGet: HarvestCompanyEntity,
	companyUpdate: HarvestCompanyEntity,

	projectsList: withPagination({ projects: z.array(HarvestProjectEntity) }),
	projectsGet: HarvestProjectEntity,
	projectsCreate: HarvestProjectEntity,
	projectsUpdate: HarvestProjectEntity,
	projectsDelete: DeleteResultSchema,

	tasksList: withPagination({ tasks: z.array(HarvestTaskEntity) }),
	tasksGet: HarvestTaskEntity,
	tasksCreate: HarvestTaskEntity,
	tasksUpdate: HarvestTaskEntity,
	tasksDelete: DeleteResultSchema,

	timeEntriesList: withPagination({ time_entries: z.array(TimeEntrySchema) }),
	timeEntriesGet: TimeEntrySchema,
	timeEntriesCreate: TimeEntrySchema,
	timeEntriesUpdate: TimeEntrySchema,
	timeEntriesDelete: DeleteResultSchema,

	usersList: withPagination({ users: z.array(HarvestUserEntity) }),
	usersGet: HarvestUserEntity,
	usersCreate: HarvestUserEntity,
	usersUpdate: HarvestUserEntity,
	usersDelete: DeleteResultSchema,

	expensesCreate: ExpenseSchema,
	expensesUpdate: ExpenseSchema,
	expenseCategoriesList: withPagination({
		expense_categories: z.array(HarvestExpenseCategoryEntity),
	}),

	invoicesList: withPagination({ invoices: z.array(HarvestInvoiceEntity) }),
	invoicesGet: HarvestInvoiceEntity,
	invoicesCreate: HarvestInvoiceEntity,
	invoicesUpdate: HarvestInvoiceEntity,
	invoicesDelete: DeleteResultSchema,

	invoiceMessagesList: withPagination({
		invoice_messages: z.array(InvoiceMessageSchema),
	}),
	invoiceMessagesCreate: InvoiceMessageSchema,
	invoiceMessagesDelete: DeleteResultSchema,

	invoicePaymentsList: withPagination({
		invoice_payments: z.array(InvoicePaymentSchema),
	}),
	invoicePaymentsCreate: InvoicePaymentSchema,
	invoicePaymentsDelete: DeleteResultSchema,

	invoiceItemCategoriesList: withPagination({
		invoice_item_categories: z.array(HarvestInvoiceItemCategoryEntity),
	}),
	invoiceItemCategoriesCreate: HarvestInvoiceItemCategoryEntity,
	invoiceItemCategoriesDelete: DeleteResultSchema,

	estimatesGet: HarvestEstimateEntity,
	estimatesCreate: HarvestEstimateEntity,
	estimatesUpdate: HarvestEstimateEntity,
	estimatesDelete: DeleteResultSchema,

	estimateMessagesList: withPagination({
		estimate_messages: z.array(EstimateMessageSchema),
	}),
	estimateMessagesCreate: EstimateMessageSchema,
	estimateMessagesDelete: DeleteResultSchema,

	estimateItemCategoriesCreate: EstimateItemCategorySchema,
	estimateItemCategoriesUpdate: EstimateItemCategorySchema,
} as const;

export type HarvestEndpointInputs = {
	[K in keyof typeof HarvestEndpointInputSchemas]: z.infer<
		(typeof HarvestEndpointInputSchemas)[K]
	>;
};

export type HarvestEndpointOutputs = {
	[K in keyof typeof HarvestEndpointOutputSchemas]: z.infer<
		(typeof HarvestEndpointOutputSchemas)[K]
	>;
};

export type HarvestLineItemInput = z.infer<typeof LineItemInput>;
export type { HarvestLineItem };
