import { z } from 'zod';

/**
 * Locally persisted Harvest entities.
 *
 * Harvest splits into reference data and transactional records. The reference
 * side — clients, projects, tasks, users, invoices, estimates, categories,
 * company — is mirrored. Time entries, expenses, messages and payments are
 * not: they are appended constantly and only make sense against a date range.
 *
 * Field names match official JSON keys.
 * Docs: https://help.getharvest.com/api-v2/
 *
 * Each field is labeled from the official attribute table, or as live-observed
 * when Harvest returns it on this account (2026-08-13) but the docs table omits
 * it. Only the primary key is required: Harvest omits or nulls most fields
 * depending on plan, permissions and enabled features.
 */

/** Nullable-optional helpers — Harvest nulls unset fields rather than omitting them. */
const S = z.string().nullable().optional();
const N = z.number().nullable().optional();
const B = z.boolean().nullable().optional();

/**
 * `{ id, name }` reference stubs embedded in larger objects.
 *
 * Harvest inlines a compact reference rather than the full record — a project
 * stub carries `code`, a client stub carries `currency`. `.loose()` keeps any
 * field a given stub happens to add.
 */
export const HarvestReference = z
	.object({
		id: N,
		name: S,
		code: S,
		currency: S,
	})
	.loose();
export type HarvestReference = z.infer<typeof HarvestReference>;

/**
 * Shared line item on invoices and estimates.
 * Invoice: https://help.getharvest.com/api-v2/invoices-api/invoices/invoices/
 * Estimate: https://help.getharvest.com/api-v2/estimates-api/estimates/estimates/
 * Estimate line items have no `project`.
 */
export const HarvestLineItem = z
	.object({
		/** Unique ID for the line item. */
		id: N,
		/** Name of an invoice/estimate item category. */
		kind: S,
		/** Text description of the line item. */
		description: S,
		/** Unit quantity of the item. */
		quantity: N,
		/** Individual price per unit. */
		unit_price: N,
		/** Line item subtotal (`quantity` * `unit_price`). */
		amount: N,
		/** Whether the document’s `tax` percentage applies. */
		taxed: B,
		/** Whether the document’s `tax2` percentage applies. */
		taxed2: B,
		/** Invoice line items only: associated project id, name, and code. */
		project: HarvestReference.nullable().optional(),
	})
	.loose();
export type HarvestLineItem = z.infer<typeof HarvestLineItem>;

/**
 * Clients. Official: https://help.getharvest.com/api-v2/clients-api/clients/clients/
 * Live 2026-08-13: id, name, is_active, address, statement_key, created_at,
 * updated_at, currency — matches the official table exactly.
 */
export const HarvestClientEntity = z
	.object({
		/** Unique ID for the client. */
		id: z.number(),
		/** A textual description of the client. */
		name: S,
		/** Whether the client is active or archived. */
		is_active: B,
		/** The physical address for the client. */
		address: S,
		/** Builds the client invoice dashboard URL with the account subdomain. */
		statement_key: S,
		/** Currency code associated with this client. */
		currency: S,
		/** Date and time the client was created. */
		created_at: S,
		/** Date and time the client was last updated. */
		updated_at: S,
	})
	.loose();
export type HarvestClientEntity = z.infer<typeof HarvestClientEntity>;

/**
 * Client contacts.
 * Official: https://help.getharvest.com/api-v2/clients-api/clients/contacts/
 * Live 2026-08-13 matches the official table, including
 * `invoice_recipient_status`.
 */
export const HarvestContactEntity = z
	.object({
		/** Unique ID for the contact. */
		id: z.number(),
		/** An object containing the contact’s client id and name. */
		client: HarvestReference.nullable().optional(),
		/** The title of the contact. */
		title: S,
		/** The first name of the contact. */
		first_name: S,
		/** The last name of the contact. */
		last_name: S,
		/** The contact’s email address. */
		email: S,
		/** The contact’s office phone number. */
		phone_office: S,
		/** The contact’s mobile phone number. */
		phone_mobile: S,
		/** The contact’s fax number. */
		fax: S,
		/** Invoice email default: `none`, `recipient`, `cc`, or `bcc`. */
		invoice_recipient_status: S,
		/** Date and time the contact was created. */
		created_at: S,
		/** Date and time the contact was last updated. */
		updated_at: S,
	})
	.loose();
export type HarvestContactEntity = z.infer<typeof HarvestContactEntity>;

/**
 * Projects.
 * Official: https://help.getharvest.com/api-v2/projects-api/projects/projects/
 * Live 2026-08-13 also returns `currency` on the project itself (official table
 * only lists currency on the embedded client stub).
 */
export const HarvestProjectEntity = z
	.object({
		/** Unique ID for the project. */
		id: z.number(),
		/** Project client id, name, and currency. */
		client: HarvestReference.nullable().optional(),
		/** Unique name for the project. */
		name: S,
		/** The code associated with the project. */
		code: S,
		/** Whether the project is active or archived. */
		is_active: B,
		/** Whether the project is billable or not. */
		is_billable: B,
		/** Whether the project is a fixed-fee project or not. */
		is_fixed_fee: B,
		/** How the project is invoiced: `Project`, `Tasks`, `People`, or `none`. */
		bill_by: S,
		/** Rate for projects billed by Project Hourly Rate. */
		hourly_rate: N,
		/** How the project is budgeted. */
		budget_by: S,
		/** Option to have the budget reset every month. */
		budget_is_monthly: B,
		/** Budget in hours when budgeting by time. */
		budget: N,
		/** Monetary budget when budgeting by money. */
		cost_budget: N,
		/** Whether Total Project Fees budgets include tracked expenses. */
		cost_budget_include_expenses: B,
		/** Whether project managers are notified when the project goes over budget. */
		notify_when_over_budget: B,
		/** Percentage that triggers over-budget email alerts. */
		over_budget_notification_percentage: N,
		/** Date of last over-budget notification; null if none sent. */
		over_budget_notification_date: S,
		/** Show project budget to all employees. */
		show_budget_to_all: B,
		/** Planned invoice amount; only used by fixed-fee projects. */
		fee: N,
		/** Project notes. */
		notes: S,
		/** Date the project was started. */
		starts_on: S,
		/** Date the project will end. */
		ends_on: S,
		/** Date and time the project was created. */
		created_at: S,
		/** Date and time the project was last updated. */
		updated_at: S,
		/** Live (not in official project table): currency code on the project. */
		currency: S,
	})
	.loose();
export type HarvestProjectEntity = z.infer<typeof HarvestProjectEntity>;

/**
 * Tasks. Official: https://help.getharvest.com/api-v2/tasks-api/tasks/tasks/
 * Live 2026-08-13 matches the official table exactly.
 */
export const HarvestTaskEntity = z
	.object({
		/** Unique ID for the task. */
		id: z.number(),
		/** The name of the task. */
		name: S,
		/** Whether default tasks should be marked billable on new projects. */
		billable_by_default: B,
		/** Hourly rate used when this task is added to a project. */
		default_hourly_rate: N,
		/** Whether this task should be automatically added to future projects. */
		is_default: B,
		/** Whether this task is active or archived. */
		is_active: B,
		/** Date and time the task was created. */
		created_at: S,
		/** Date and time the task was last updated. */
		updated_at: S,
	})
	.loose();
export type HarvestTaskEntity = z.infer<typeof HarvestTaskEntity>;

/**
 * Users. Official: https://help.getharvest.com/api-v2/users-api/users/users/
 * Live 2026-08-13 also returns employee_id, calendar_integration_*,
 * can_create_projects, permissions_claims. `saml_exempt` is official but only
 * returned when SSO exemptions are enabled — this account does not send it.
 */
export const HarvestUserEntity = z
	.object({
		/** Unique ID for the user. */
		id: z.number(),
		/** The first name of the user. */
		first_name: S,
		/** The last name of the user. */
		last_name: S,
		/** The email address of the user. */
		email: S,
		/** The user’s telephone number. */
		telephone: S,
		/** The user’s timezone. */
		timezone: S,
		/** Whether the user should be automatically added to future projects. */
		has_access_to_all_future_projects: B,
		/** Whether the user is a contractor or an employee. */
		is_contractor: B,
		/** Whether the user is active or archived. */
		is_active: B,
		/**
		 * Whether the user is exempt from required SSO.
		 * Official; only returned on SSO accounts with exemptions enabled.
		 */
		saml_exempt: B,
		/** Weekly capacity in seconds, in half-hour increments. */
		weekly_capacity: N,
		/** Billable rate used when this user is added to a project. */
		default_hourly_rate: N,
		/** Cost rate used when calculating a project’s costs vs billable amount. */
		cost_rate: N,
		/** Descriptive business-role names; no effect on permissions. */
		roles: z.array(z.string()).nullable().optional(),
		/** Access role(s): `administrator`, `manager`, `member`, plus manager extras. */
		access_roles: z.array(z.string()).nullable().optional(),
		/** URL to the user’s avatar image. */
		avatar_url: S,
		/** Date and time the user was created. */
		created_at: S,
		/** Date and time the user was last updated. */
		updated_at: S,
		/** Live: employee identifier string. */
		employee_id: S,
		/** Live: whether calendar integration is enabled. */
		calendar_integration_enabled: B,
		/** Live: calendar integration source. */
		calendar_integration_source: S,
		/** Live: whether the user can create projects. */
		can_create_projects: B,
		/** Live: returned for `/users/me`, not for other users in a list. */
		permissions_claims: z.array(z.string()).nullable().optional(),
	})
	.loose();
export type HarvestUserEntity = z.infer<typeof HarvestUserEntity>;

/**
 * Invoices. Official: https://help.getharvest.com/api-v2/invoices-api/invoices/invoices/
 * Live 2026-08-13 matches the official table exactly.
 */
export const HarvestInvoiceEntity = z
	.object({
		/** Unique ID for the invoice. */
		id: z.number(),
		/** Invoice client id and name. */
		client: HarvestReference.nullable().optional(),
		/** Array of invoice line items. */
		line_items: z.array(HarvestLineItem).nullable().optional(),
		/** Associated estimate’s id. */
		estimate: HarvestReference.nullable().optional(),
		/** Associated retainer’s id. */
		retainer: HarvestReference.nullable().optional(),
		/** Id and name of the person that created the invoice. */
		creator: HarvestReference.nullable().optional(),
		/** Builds the public web invoice URL (`/client/invoices/{CLIENT_KEY}`). */
		client_key: S,
		/** Invoice number; auto-generated if unset. */
		number: S,
		/** The purchase order number. */
		purchase_order: S,
		/** Total amount including discounts and taxes. */
		amount: N,
		/** Total amount due at this time. */
		due_amount: N,
		/** Tax percentage applied to the subtotal. */
		tax: N,
		/** Amount calculated from `tax`. */
		tax_amount: N,
		/** Second tax percentage applied to the subtotal. */
		tax2: N,
		/** Amount calculated from `tax2`. */
		tax2_amount: N,
		/** Discount percentage subtracted from the subtotal. */
		discount: N,
		/** Amount calculated from `discount`. */
		discount_amount: N,
		/** The invoice subject. */
		subject: S,
		/** Additional notes included on the invoice. */
		notes: S,
		/** Currency code associated with this invoice. */
		currency: S,
		/** Current state: `draft`, `open`, `paid`, or `closed`. */
		state: S,
		/** Start of the period whose time entries were added. */
		period_start: S,
		/** End of the period whose time entries were added. */
		period_end: S,
		/** Date the invoice was issued. */
		issue_date: S,
		/** Date the invoice is due. */
		due_date: S,
		/** Payment timeframe: `upon receipt`, `net 15/30/45/60`, or `custom`. */
		payment_term: S,
		/** Enabled payment options: `ach`, `credit_card`, `paypal`. */
		payment_options: z.array(z.string()).nullable().optional(),
		/** Date and time the invoice was sent. */
		sent_at: S,
		/** Date and time the invoice was paid. */
		paid_at: S,
		/** Date the invoice was paid. */
		paid_date: S,
		/** Date and time the invoice was closed. */
		closed_at: S,
		/** Unique ID of the associated recurring invoice. */
		recurring_invoice_id: N,
		/** Date and time the invoice was created. */
		created_at: S,
		/** Date and time the invoice was last updated. */
		updated_at: S,
	})
	.loose();
export type HarvestInvoiceEntity = z.infer<typeof HarvestInvoiceEntity>;

/**
 * Estimates.
 * Official: https://help.getharvest.com/api-v2/estimates-api/estimates/estimates/
 * Live 2026-08-13 matches the official table exactly. Estimates have no
 * `due_*` or `paid_*` fields; they carry `accepted_at` / `declined_at`.
 */
export const HarvestEstimateEntity = z
	.object({
		/** Unique ID for the estimate. */
		id: z.number(),
		/** Estimate client id and name. */
		client: HarvestReference.nullable().optional(),
		/** Array of estimate line items. */
		line_items: z.array(HarvestLineItem).nullable().optional(),
		/** Id and name of the person that created the estimate. */
		creator: HarvestReference.nullable().optional(),
		/** Builds the public web estimate URL. */
		client_key: S,
		/** Estimate number; auto-generated if unset. */
		number: S,
		/** The purchase order number. */
		purchase_order: S,
		/** Total amount including discounts and taxes. */
		amount: N,
		/** Tax percentage applied to the subtotal. */
		tax: N,
		/** Amount calculated from `tax`. */
		tax_amount: N,
		/** Second tax percentage applied to the subtotal. */
		tax2: N,
		/** Amount calculated from `tax2`. */
		tax2_amount: N,
		/** Discount percentage subtracted from the subtotal. */
		discount: N,
		/** Amount calculated from `discount`. */
		discount_amount: N,
		/** The estimate subject. */
		subject: S,
		/** Additional notes included on the estimate. */
		notes: S,
		/** Currency code associated with this estimate. */
		currency: S,
		/** Current state: `draft`, `sent`, `accepted`, or `declined`. */
		state: S,
		/** Date the estimate was issued. */
		issue_date: S,
		/** Date and time the estimate was sent. */
		sent_at: S,
		/** Date and time the estimate was accepted. */
		accepted_at: S,
		/** Date and time the estimate was declined. */
		declined_at: S,
		/** Date and time the estimate was created. */
		created_at: S,
		/** Date and time the estimate was last updated. */
		updated_at: S,
	})
	.loose();
export type HarvestEstimateEntity = z.infer<typeof HarvestEstimateEntity>;

/**
 * Expense categories.
 * Official: https://help.getharvest.com/api-v2/expenses-api/expenses/expense-categories/
 * Live 2026-08-13 matches the official table exactly.
 */
export const HarvestExpenseCategoryEntity = z
	.object({
		/** Unique ID for the expense category. */
		id: z.number(),
		/** The name of the expense category. */
		name: S,
		/** The unit name of the expense category. */
		unit_name: S,
		/** The unit price of the expense category. */
		unit_price: N,
		/** Whether the expense category is active or archived. */
		is_active: B,
		/** Date and time the expense category was created. */
		created_at: S,
		/** Date and time the expense category was last updated. */
		updated_at: S,
	})
	.loose();
export type HarvestExpenseCategoryEntity = z.infer<
	typeof HarvestExpenseCategoryEntity
>;

/**
 * Invoice item categories.
 * Official: https://help.getharvest.com/api-v2/invoices-api/invoices/invoice-item-categories/
 * Live 2026-08-13 matches the official table exactly.
 */
export const HarvestInvoiceItemCategoryEntity = z
	.object({
		/** Unique ID for the invoice item category. */
		id: z.number(),
		/** The name of the invoice item category. */
		name: S,
		/** Used for billable hours when generating an invoice. */
		use_as_service: B,
		/** Used for expenses when generating an invoice. */
		use_as_expense: B,
		/** Date and time the invoice item category was created. */
		created_at: S,
		/** Date and time the invoice item category was last updated. */
		updated_at: S,
	})
	.loose();
export type HarvestInvoiceItemCategoryEntity = z.infer<
	typeof HarvestInvoiceItemCategoryEntity
>;

/**
 * Company settings.
 * Official: https://help.getharvest.com/api-v2/company-api/company/company/
 * The company object has no `id`; it is a singleton per account, so
 * `full_domain` is the stable identifier.
 *
 * Live 2026-08-13 also returns `currency`, `saml_sign_in_required`, and
 * `day_entry_notes_required`, which the official attribute table omits.
 */
export const HarvestCompanyEntity = z
	.object({
		/** Harvest domain for the company. Used as the cache key. */
		full_domain: z.string(),
		/** The Harvest URL for the company. */
		base_uri: S,
		/** The name of the company. */
		name: S,
		/** Whether the company is active or archived. */
		is_active: B,
		/** Week start: `Saturday`, `Sunday`, or `Monday`. */
		week_start_day: S,
		/** Whether time is tracked via duration or start and end times. */
		wants_timestamp_timers: B,
		/** Time display format: `decimal` or `hours_minutes`. */
		time_format: S,
		/** Date display format (`%m/%d/%Y`, `%Y-%m-%d`, …). */
		date_format: S,
		/** Plan type, e.g. `trial`, `free`, or `simple-v4`. */
		plan_type: S,
		/** 12-hour or 24-hour clock: `12h` or `24h`. */
		clock: S,
		/** How to display the currency code when formatting currency. */
		currency_code_display: S,
		/** How to display the currency symbol when formatting currency. */
		currency_symbol_display: S,
		/** Symbol used when formatting decimals. */
		decimal_symbol: S,
		/** Separator used when formatting numbers. */
		thousands_separator: S,
		/** Color scheme used in the Harvest web client. */
		color_scheme: S,
		/** Weekly capacity in seconds. */
		weekly_capacity: N,
		/** Whether the expense module is enabled. */
		expense_feature: B,
		/** Whether the invoice module is enabled. */
		invoice_feature: B,
		/** Whether the estimate module is enabled. */
		estimate_feature: B,
		/** Whether the approval module is enabled. */
		approval_feature: B,
		/** Whether the team module is enabled. */
		team_feature: B,
		/** Live (not in official table): account currency code. */
		currency: S,
		/** Live (not in official table): whether SAML sign-in is required. */
		saml_sign_in_required: B,
		/** Live (not in official table): whether day-entry notes are required. */
		day_entry_notes_required: B,
	})
	.loose();
export type HarvestCompanyEntity = z.infer<typeof HarvestCompanyEntity>;
