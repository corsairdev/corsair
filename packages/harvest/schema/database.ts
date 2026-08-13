import { z } from 'zod';

/**
 * Locally persisted Harvest entities.
 *
 * Harvest splits cleanly into reference data and transactional records. The
 * reference side — who the clients are, which projects and tasks exist, who is
 * on the team — changes rarely and is the lookup every other operation needs,
 * so it is mirrored. Time entries, expenses, invoice and estimate messages and
 * payments are transactional: they are appended constantly and are only
 * meaningful against a date range, so caching them would mirror a moving target
 * without helping any lookup.
 *
 * Field names match the official JSON keys exactly.
 * Docs: https://help.getharvest.com/api-v2/
 *
 * Every field below except the primary key was observed on a live response
 * (live account, 2026-08-13). Only `id` is required: Harvest omits or nulls
 * most fields depending on plan, permissions and account features, so a
 * stricter schema would reject valid rows.
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

/** Shared line item on both invoices and estimates. */
export const HarvestLineItem = z
	.object({
		id: N,
		kind: S,
		description: S,
		quantity: N,
		unit_price: N,
		amount: N,
		taxed: B,
		taxed2: B,
		project: HarvestReference.nullable().optional(),
	})
	.loose();
export type HarvestLineItem = z.infer<typeof HarvestLineItem>;

/**
 * Clients. https://help.getharvest.com/api-v2/clients-api/clients/clients/
 * Live keys: id, name, is_active, address, statement_key, created_at,
 * updated_at, currency
 */
export const HarvestClientEntity = z
	.object({
		id: z.number(),
		name: S,
		is_active: B,
		address: S,
		statement_key: S,
		currency: S,
		created_at: S,
		updated_at: S,
	})
	.loose();
export type HarvestClientEntity = z.infer<typeof HarvestClientEntity>;

/**
 * Client contacts.
 * https://help.getharvest.com/api-v2/clients-api/clients/contacts/
 * Live keys: id, title, first_name, last_name, email, phone_office,
 * phone_mobile, fax, invoice_recipient_status, created_at, updated_at, client
 */
export const HarvestContactEntity = z
	.object({
		id: z.number(),
		title: S,
		first_name: S,
		last_name: S,
		email: S,
		phone_office: S,
		phone_mobile: S,
		fax: S,
		invoice_recipient_status: S,
		client: HarvestReference.nullable().optional(),
		created_at: S,
		updated_at: S,
	})
	.loose();
export type HarvestContactEntity = z.infer<typeof HarvestContactEntity>;

/**
 * Projects.
 * https://help.getharvest.com/api-v2/projects-api/projects/projects/
 * 25 live keys.
 */
export const HarvestProjectEntity = z
	.object({
		id: z.number(),
		name: S,
		code: S,
		is_active: B,
		is_billable: B,
		is_fixed_fee: B,
		bill_by: S,
		budget: N,
		budget_by: S,
		budget_is_monthly: B,
		notify_when_over_budget: B,
		over_budget_notification_percentage: N,
		over_budget_notification_date: S,
		show_budget_to_all: B,
		cost_budget: N,
		cost_budget_include_expenses: B,
		hourly_rate: N,
		fee: N,
		currency: S,
		notes: S,
		starts_on: S,
		ends_on: S,
		client: HarvestReference.nullable().optional(),
		created_at: S,
		updated_at: S,
	})
	.loose();
export type HarvestProjectEntity = z.infer<typeof HarvestProjectEntity>;

/**
 * Tasks. https://help.getharvest.com/api-v2/tasks-api/tasks/tasks/
 * Live keys: id, name, billable_by_default, is_default, is_active,
 * created_at, updated_at, default_hourly_rate
 */
export const HarvestTaskEntity = z
	.object({
		id: z.number(),
		name: S,
		billable_by_default: B,
		is_default: B,
		is_active: B,
		default_hourly_rate: N,
		created_at: S,
		updated_at: S,
	})
	.loose();
export type HarvestTaskEntity = z.infer<typeof HarvestTaskEntity>;

/**
 * Users. https://help.getharvest.com/api-v2/users-api/users/users/
 * 22 live keys.
 *
 * `permissions_claims` is only returned for the authenticated user
 * (`/users/me`), not for other users in a list, so it stays optional like
 * everything else.
 */
export const HarvestUserEntity = z
	.object({
		id: z.number(),
		first_name: S,
		last_name: S,
		email: S,
		employee_id: S,
		telephone: S,
		timezone: S,
		weekly_capacity: N,
		has_access_to_all_future_projects: B,
		is_contractor: B,
		is_active: B,
		calendar_integration_enabled: B,
		calendar_integration_source: S,
		can_create_projects: B,
		default_hourly_rate: N,
		cost_rate: N,
		roles: z.array(z.string()).nullable().optional(),
		access_roles: z.array(z.string()).nullable().optional(),
		permissions_claims: z.array(z.string()).nullable().optional(),
		avatar_url: S,
		created_at: S,
		updated_at: S,
	})
	.loose();
export type HarvestUserEntity = z.infer<typeof HarvestUserEntity>;

/**
 * Invoices. https://help.getharvest.com/api-v2/invoices-api/invoices/invoices/
 * 34 live keys.
 */
export const HarvestInvoiceEntity = z
	.object({
		id: z.number(),
		client_key: S,
		number: S,
		purchase_order: S,
		amount: N,
		due_amount: N,
		tax: N,
		tax_amount: N,
		tax2: N,
		tax2_amount: N,
		discount: N,
		discount_amount: N,
		subject: S,
		notes: S,
		state: S,
		period_start: S,
		period_end: S,
		issue_date: S,
		due_date: S,
		payment_term: S,
		sent_at: S,
		paid_at: S,
		paid_date: S,
		closed_at: S,
		recurring_invoice_id: N,
		currency: S,
		payment_options: z.array(z.string()).nullable().optional(),
		client: HarvestReference.nullable().optional(),
		estimate: HarvestReference.nullable().optional(),
		retainer: HarvestReference.nullable().optional(),
		creator: HarvestReference.nullable().optional(),
		line_items: z.array(HarvestLineItem).nullable().optional(),
		created_at: S,
		updated_at: S,
	})
	.loose();
export type HarvestInvoiceEntity = z.infer<typeof HarvestInvoiceEntity>;

/**
 * Estimates.
 * https://help.getharvest.com/api-v2/estimates-api/estimates/estimates/
 * 24 live keys. Estimates have no `due_*` or `paid_*` fields; they carry
 * `accepted_at` / `declined_at` instead.
 */
export const HarvestEstimateEntity = z
	.object({
		id: z.number(),
		client_key: S,
		number: S,
		purchase_order: S,
		amount: N,
		tax: N,
		tax_amount: N,
		tax2: N,
		tax2_amount: N,
		discount: N,
		discount_amount: N,
		subject: S,
		notes: S,
		state: S,
		issue_date: S,
		sent_at: S,
		accepted_at: S,
		declined_at: S,
		currency: S,
		client: HarvestReference.nullable().optional(),
		creator: HarvestReference.nullable().optional(),
		line_items: z.array(HarvestLineItem).nullable().optional(),
		created_at: S,
		updated_at: S,
	})
	.loose();
export type HarvestEstimateEntity = z.infer<typeof HarvestEstimateEntity>;

/**
 * Expense categories.
 * https://help.getharvest.com/api-v2/expenses-api/expenses/expense-categories/
 */
export const HarvestExpenseCategoryEntity = z
	.object({
		id: z.number(),
		name: S,
		unit_name: S,
		unit_price: N,
		is_active: B,
		created_at: S,
		updated_at: S,
	})
	.loose();
export type HarvestExpenseCategoryEntity = z.infer<
	typeof HarvestExpenseCategoryEntity
>;

/**
 * Invoice item categories.
 * https://help.getharvest.com/api-v2/invoices-api/invoices/invoice-item-categories/
 */
export const HarvestInvoiceItemCategoryEntity = z
	.object({
		id: z.number(),
		name: S,
		use_as_service: B,
		use_as_expense: B,
		created_at: S,
		updated_at: S,
	})
	.loose();
export type HarvestInvoiceItemCategoryEntity = z.infer<
	typeof HarvestInvoiceItemCategoryEntity
>;

/**
 * Company settings.
 * https://help.getharvest.com/api-v2/company-api/company/company/
 * 24 live keys. The company object has no `id`; it is a singleton per account,
 * so `full_domain` is the stable identifier and the entity is keyed on it.
 */
export const HarvestCompanyEntity = z
	.object({
		full_domain: z.string(),
		base_uri: S,
		name: S,
		is_active: B,
		week_start_day: S,
		wants_timestamp_timers: B,
		time_format: S,
		date_format: S,
		plan_type: S,
		clock: S,
		currency: S,
		currency_code_display: S,
		currency_symbol_display: S,
		decimal_symbol: S,
		thousands_separator: S,
		color_scheme: S,
		weekly_capacity: N,
		expense_feature: B,
		invoice_feature: B,
		estimate_feature: B,
		team_feature: B,
		approval_feature: B,
		saml_sign_in_required: B,
		day_entry_notes_required: B,
	})
	.loose();
export type HarvestCompanyEntity = z.infer<typeof HarvestCompanyEntity>;
