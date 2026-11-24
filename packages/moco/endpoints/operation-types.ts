// Generated from MOCO's OpenAPI spec (https://docs.mocoapp.com/api/docs/v1/openapi.json,
// fetched 2026-11-24); moco-manifest.json is the same contract as JSON.
// Inputs are the published parameters and request bodies in one object. Outputs
// make every field optional and nullable and keep unknown fields, matching how
// the zod output schemas parse. Regenerate rather than edit.

import type { FileInput, FileOutput } from 'corsair/http';

export type MocoJsonValue =
	| null
	| boolean
	| number
	| string
	| MocoJsonValue[]
	| { [key: string]: MocoJsonValue | undefined };

export const MOCO_OPERATION_IDS = [
	'account.catalogServices.create',
	'account.catalogServices.delete',
	'account.catalogServices.get',
	'account.catalogServices.items.create',
	'account.catalogServices.items.delete',
	'account.catalogServices.items.get',
	'account.catalogServices.items.update',
	'account.catalogServices.list',
	'account.catalogServices.update',
	'account.customProperties.create',
	'account.customProperties.delete',
	'account.customProperties.get',
	'account.customProperties.list',
	'account.customProperties.update',
	'account.expenseTemplates.create',
	'account.expenseTemplates.delete',
	'account.expenseTemplates.get',
	'account.expenseTemplates.list',
	'account.expenseTemplates.update',
	'account.fixedCosts.list',
	'account.hourlyRates.get',
	'account.internalHourlyRates.get',
	'account.internalHourlyRates.update',
	'account.taskTemplates.create',
	'account.taskTemplates.delete',
	'account.taskTemplates.get',
	'account.taskTemplates.list',
	'account.taskTemplates.update',
	'account.webHooks.create',
	'account.webHooks.delete',
	'account.webHooks.disable',
	'account.webHooks.enable',
	'account.webHooks.get',
	'account.webHooks.list',
	'account.webHooks.update',
	'activities.bulkCreate',
	'activities.create',
	'activities.delete',
	'activities.disregard',
	'activities.get',
	'activities.list',
	'activities.startTimer',
	'activities.stopTimer',
	'activities.update',
	'activities.updateBillableSeconds',
	'approvals.approve',
	'approvals.create',
	'approvals.delete',
	'approvals.deny',
	'approvals.get',
	'approvals.list',
	'comments.bulkCreate',
	'comments.create',
	'comments.delete',
	'comments.get',
	'comments.list',
	'comments.update',
	'companies.archive',
	'companies.create',
	'companies.delete',
	'companies.get',
	'companies.list',
	'companies.unarchive',
	'companies.update',
	'contacts.create',
	'contacts.delete',
	'contacts.get',
	'contacts.list',
	'contacts.update',
	'dealCategories.create',
	'dealCategories.delete',
	'dealCategories.get',
	'dealCategories.list',
	'dealCategories.update',
	'deals.create',
	'deals.delete',
	'deals.get',
	'deals.list',
	'deals.update',
	'invoiceReminders.create',
	'invoiceReminders.delete',
	'invoiceReminders.get',
	'invoiceReminders.list',
	'invoiceReminders.sendEmail',
	'invoices.attachments.create',
	'invoices.attachments.delete',
	'invoices.attachments.list',
	'invoices.bookkeepingExports.create',
	'invoices.bookkeepingExports.get',
	'invoices.bookkeepingExports.list',
	'invoices.create',
	'invoices.delete',
	'invoices.get',
	'invoices.getPdf',
	'invoices.getTimesheet',
	'invoices.getTimesheetPdf',
	'invoices.list',
	'invoices.listExpenses',
	'invoices.listLocked',
	'invoices.payments.bulkCreate',
	'invoices.payments.create',
	'invoices.payments.delete',
	'invoices.payments.get',
	'invoices.payments.list',
	'invoices.payments.update',
	'invoices.sendEmail',
	'invoices.updateStatus',
	'letterPapers.list',
	'offerConfirmations.create',
	'offerConfirmations.delete',
	'offerConfirmations.get',
	'offerConfirmations.getPdf',
	'offerConfirmations.list',
	'offerConfirmations.update',
	'offers.assign',
	'offers.attachments.create',
	'offers.attachments.delete',
	'offers.attachments.list',
	'offers.create',
	'offers.customerApproval.activate',
	'offers.customerApproval.deactivate',
	'offers.customerApproval.get',
	'offers.delete',
	'offers.get',
	'offers.getPdf',
	'offers.list',
	'offers.sendEmail',
	'offers.update',
	'offers.updateStatus',
	'plannedPurchases.create',
	'plannedPurchases.delete',
	'plannedPurchases.get',
	'plannedPurchases.list',
	'plannedPurchases.update',
	'planningEntries.create',
	'planningEntries.delete',
	'planningEntries.get',
	'planningEntries.list',
	'planningEntries.update',
	'profile.get',
	'profile.performanceReport',
	'projects.archive',
	'projects.assignProjectGroup',
	'projects.contracts.create',
	'projects.contracts.delete',
	'projects.contracts.get',
	'projects.contracts.list',
	'projects.contracts.update',
	'projects.create',
	'projects.delete',
	'projects.disableShare',
	'projects.expenses.bulkCreate',
	'projects.expenses.create',
	'projects.expenses.delete',
	'projects.expenses.disregard',
	'projects.expenses.get',
	'projects.expenses.list',
	'projects.expenses.listAll',
	'projects.expenses.update',
	'projects.get',
	'projects.groups.get',
	'projects.groups.list',
	'projects.list',
	'projects.listAssigned',
	'projects.paymentSchedules.create',
	'projects.paymentSchedules.delete',
	'projects.paymentSchedules.get',
	'projects.paymentSchedules.list',
	'projects.paymentSchedules.listAll',
	'projects.paymentSchedules.update',
	'projects.recurringExpenses.create',
	'projects.recurringExpenses.delete',
	'projects.recurringExpenses.get',
	'projects.recurringExpenses.list',
	'projects.recurringExpenses.recur',
	'projects.recurringExpenses.update',
	'projects.report',
	'projects.share',
	'projects.tasks.create',
	'projects.tasks.delete',
	'projects.tasks.deleteAll',
	'projects.tasks.get',
	'projects.tasks.list',
	'projects.tasks.update',
	'projects.unarchive',
	'projects.unassignProjectGroup',
	'projects.update',
	'purchases.assignToProject',
	'purchases.bookkeepingExports.create',
	'purchases.bookkeepingExports.get',
	'purchases.bookkeepingExports.list',
	'purchases.budgets.create',
	'purchases.budgets.delete',
	'purchases.budgets.list',
	'purchases.budgets.update',
	'purchases.budgets.updateTarget',
	'purchases.categories.get',
	'purchases.categories.list',
	'purchases.create',
	'purchases.delete',
	'purchases.drafts.create',
	'purchases.drafts.delete',
	'purchases.drafts.get',
	'purchases.drafts.getPdf',
	'purchases.drafts.list',
	'purchases.get',
	'purchases.list',
	'purchases.payments.bulkCreate',
	'purchases.payments.create',
	'purchases.payments.delete',
	'purchases.payments.get',
	'purchases.payments.list',
	'purchases.payments.update',
	'purchases.storeDocument',
	'purchases.update',
	'purchases.updateStatus',
	'receipts.create',
	'receipts.delete',
	'receipts.get',
	'receipts.list',
	'receipts.update',
	'recurringExpenses.list',
	'reports.absences',
	'reports.cashflow',
	'reports.finance',
	'reports.plannedVsTracked',
	'reports.utilization',
	'revenueCategories.create',
	'revenueCategories.delete',
	'revenueCategories.get',
	'revenueCategories.list',
	'revenueCategories.update',
	'schedules.create',
	'schedules.delete',
	'schedules.get',
	'schedules.list',
	'schedules.update',
	'session.verify',
	'taggings.add',
	'taggings.list',
	'taggings.remove',
	'taggings.replace',
	'tags.create',
	'tags.delete',
	'tags.get',
	'tags.list',
	'tags.update',
	'todos.get',
	'todos.list',
	'units.create',
	'units.delete',
	'units.get',
	'units.list',
	'units.update',
	'users.absenceRequests.create',
	'users.absenceRequests.delete',
	'users.absenceRequests.get',
	'users.absenceRequests.list',
	'users.create',
	'users.delete',
	'users.employments.create',
	'users.employments.delete',
	'users.employments.get',
	'users.employments.list',
	'users.employments.update',
	'users.get',
	'users.holidays.create',
	'users.holidays.delete',
	'users.holidays.get',
	'users.holidays.list',
	'users.holidays.update',
	'users.list',
	'users.performanceReport',
	'users.presences.create',
	'users.presences.delete',
	'users.presences.get',
	'users.presences.list',
	'users.presences.touch',
	'users.presences.update',
	'users.roles.list',
	'users.update',
	'users.workTimeAdjustments.create',
	'users.workTimeAdjustments.delete',
	'users.workTimeAdjustments.get',
	'users.workTimeAdjustments.list',
	'users.workTimeAdjustments.update',
	'vatCodePurchases.get',
	'vatCodePurchases.list',
	'vatCodeSales.get',
	'vatCodeSales.list',
] as const;

export type MocoOperationId = (typeof MOCO_OPERATION_IDS)[number];

export type MocoAccountCatalogServiceItemCreateRequestInput = {
	id?: number;
	type:
		| 'title'
		| 'description'
		| 'item'
		| 'subtotal'
		| 'page-break'
		| 'separator'
		| 'position-group';
	title?: string;
	description?: string;
	quantity?: number;
	unit?: string;
	unit_price?: number;
	unit_cost?: number;
	net_total?: number;
	optional?: boolean;
	part?: boolean;
	subtotal_type?:
		| 'part_total'
		| 'sub_total'
		| 'optional_part_total'
		| 'optional_sub_total';
	destroyed?: boolean;
	additional?: boolean;
	position_group_display?: string;
	revenue_category_id?: number | null;
	position_group_items?: Array<{
		title?: string;
		unit?: string;
		quantity?: number;
		unit_price?: number;
		unit_cost?: number;
	}>;
};

/** Payload for creating or updating a single activity. Compatibility notes: - `project_id` is mapped to internal assignment relation. - `hours` is deprecated; use `seconds`. */
export type MocoActivityUpsertRequestInput = {
	/** Activity date. */
	date?: string;
	/** Task/service ID. */
	task_id?: number;
	/** Optional company/customer ID shortcut. */
	company_id?: number;
	/** Project ID (mapped internally to assignment). */
	project_id?: number;
	/** Free-text activity description. */
	description?: string;
	/** Optional activity tag label. */
	tag?: string;
	/** Duration in seconds. */
	seconds?: number;
	/** Deprecated duration field, converted to seconds. */
	hours?: number;
	/** Whether the activity is billable. */
	billable?: boolean;
	/** External source system identifier. */
	remote_service?:
		| ''
		| 'trello'
		| 'jira'
		| 'asana'
		| 'basecamp'
		| 'wunderlist'
		| 'basecamp2'
		| 'basecamp3'
		| 'toggl'
		| 'mite'
		| 'github'
		| 'youtrack'
		| null;
	/** URL to related external item. */
	remote_url?: string;
	/** External identifier of linked remote item. */
	remote_id?: string;
	/** If true, stops any running timer before applying the update. This allows updating `seconds` even when a timer is running. */
	stop_timer?: boolean;
};

/** Single item payload accepted by project expense bulk endpoint. */
export type MocoExpenseBulkItemRequestInput = {
	date?: string;
	title?: string;
	description?: string;
	quantity?: number;
	unit?: string;
	unit_price?: number;
	unit_cost?: number;
	billable?: boolean;
	budget_relevant?: boolean;
	purchase_assignment_locked?: boolean;
	service_period_from?: string;
	service_period_to?: string;
	planned_purchase_date?: string;
	cost_total_planned?: number;
	/** Rejected with 422 when the revenue category only applies to tasks, unless the stored value is unchanged. */
	revenue_category_id?: number;
	custom_properties?: Record<string, MocoJsonValue>;
};

/** Input model for invoice line items. Depending on the selected `type`, some fields are ignored by the backend. To bill linked activities/expenses (`activity_ids` / `expense_ids`), item pricing fields (`quantity`, `unit`, `unit_price`) should be set. */
export type MocoInvoiceLineItemInputInput = {
	/** Existing line item ID (for updates/reordering). */
	id?: number;
	/** Line item type. */
	type:
		| 'title'
		| 'description'
		| 'item'
		| 'subtotal'
		| 'page-break'
		| 'separator';
	/** Item title. */
	title?: string;
	/** Item description text. */
	description?: string;
	/** Quantity for billable items. */
	quantity?: number;
	/** Unit label (for example `h` or `pcs`). */
	unit?: string;
	/** Unit price. */
	unit_price?: number;
	/** Net total for this line. */
	net_total?: number;
	/** Deprecated legacy subtotal switch. */
	part?: boolean;
	/** Subtotal behavior. */
	subtotal_type?: 'part_total' | 'sub_total';
	/** Marks item as additional service. */
	additional?: boolean;
	/** Marks item as optional position. */
	optional?: boolean;
	/** Revenue category ID. */
	revenue_category_id?: number;
	/** Linked activity ids. */
	activity_ids?: Array<number>;
	/** Linked expense IDs. */
	expense_ids?: Array<number>;
};

export type MocoPurchasePaymentUpsertRequestInput = {
	date: string;
	total: number;
	purchase_id: number;
	description?: string;
	currency?: string;
	payment_account_id?: number;
	/** Indicates whether the purchase is partially paid. */
	partially_paid?: boolean;
};

/** Resource type a webhook watches for events. Values correspond to internal class names. Namespace qualifiers (`::`) are used where the resource lives under another model (for example `Invoice::Approval`, `Project::PaymentSchedule`, `User::AbsenceRequest`). */
export type MocoWebHookTargetInput =
	| 'Activity'
	| 'Comment'
	| 'Company'
	| 'Contact'
	| 'Contract'
	| 'Deal'
	| 'Expense'
	| 'Invoice'
	| 'Invoice::Approval'
	| 'Invoice::BookkeepingExport'
	| 'Invoice::Payment'
	| 'InvoiceDraft'
	| 'InvoiceReminder'
	| 'Offer'
	| 'PlanningEntry'
	| 'Presence'
	| 'Project'
	| 'Project::PaymentSchedule'
	| 'ProjectGroup'
	| 'Purchase'
	| 'Purchase::Approval'
	| 'Purchase::BookkeepingExport'
	| 'Purchase::Draft'
	| 'Purchase::Order'
	| 'Purchase::Payment'
	| 'RecurringExpense'
	| 'Schedule'
	| 'Task'
	| 'User'
	| 'User::HolidayRequest'
	| 'User::AbsenceRequest'
	| 'User::PeriodLockOverride'
	| 'User::WorkTimeAdjustment';

export type MocoAbsenceRow = {
	user?: {
		id?: number | null;
		firstname?: string | null;
		lastname?: string | null;
	} | null;
	total_vacation_days?: number | null;
	used_vacation_days?: number | null;
	planned_vacation_days?: number | null;
	sickdays?: number | null;
};

export type MocoAccountCatalogService = {
	id?: number | null;
	title?: string | null;
	items?: Array<MocoAccountCatalogServiceItem> | null;
	created_at?: string | null;
	updated_at?: string | null;
};

export type MocoAccountCatalogServiceItem = {
	id?: number | null;
	type?: string | null;
	title?: string | null;
	description?: string | null;
	quantity?: number | null;
	unit?: string | null;
	unit_price?: number | null;
	net_total?: number | null;
	unit_cost?: number | null;
	optional?: boolean | null;
	part?: boolean | null;
	subtotal_type?: string | null;
	additional?: boolean | null;
	position_group_display?: string | null;
	revenue_category?: MocoRevenueCategoryRef | null;
	position_group_items?: Array<{
		title?: string | null;
		unit?: string | null;
		quantity?: number | null;
		unit_price?: number | null;
		unit_cost?: number | null;
	}> | null;
	created_at?: string | null;
	updated_at?: string | null;
};

export type MocoAccountCurrencyHourlyRate = {
	currency?: string | null;
	hourly_rate?: number | null;
};

/** Account-level custom property definition. */
export type MocoAccountCustomProperty = {
	id?: number | null;
	name?: string | null;
	kind?: string | null;
	entity?: string | null;
	defaults?: Array<string> | null;
	placeholder?: string | null;
	placeholder_alt?: string | null;
	print_on_invoice?: boolean | null;
	print_on_offer?: boolean | null;
	print_on_timesheet?: boolean | null;
	notification_enabled?: boolean | null;
	api_only?: boolean | null;
};

export type MocoAccountExpenseTemplate = {
	id?: number | null;
	title?: string | null;
	description?: string | null;
	unit?: string | null;
	unit_price?: number | null;
	unit_cost?: number | null;
	currency?: string | null;
	revenue_category?: MocoRevenueCategoryRef | null;
	created_at?: string | null;
	updated_at?: string | null;
};

export type MocoAccountFixedCost = {
	id?: number | null;
	title?: string | null;
	description?: string | null;
	payment_day?: number | null;
	costs?: Array<{
		year?: number | null;
		month?: number | null;
		amount?: number | null;
	}> | null;
	created_at?: string | null;
	updated_at?: string | null;
};

export type MocoAccountHourlyRateTask = {
	id?: number | null;
	name?: string | null;
	rates?: Array<MocoAccountCurrencyHourlyRate> | null;
};

export type MocoAccountHourlyRateUser = {
	id?: number | null;
	full_name?: string | null;
	rates?: Array<MocoAccountCurrencyHourlyRate> | null;
};

export type MocoAccountHourlyRatesResponse = {
	/** API key name kept for compatibility. */
	defaults_rates?: Array<MocoAccountCurrencyHourlyRate> | null;
	tasks?: Array<MocoAccountHourlyRateTask> | null;
	users?: Array<MocoAccountHourlyRateUser> | null;
};

export type MocoAccountInternalHourlyRate = {
	year?: number | null;
	rate?: number | null;
};

export type MocoAccountInternalHourlyRateUser = {
	id?: number | null;
	full_name?: string | null;
	rates?: Array<MocoAccountInternalHourlyRate> | null;
};

export type MocoAccountInternalHourlyRatesResponse =
	Array<MocoAccountInternalHourlyRateUser>;

export type MocoAccountTaskTemplate = {
	id?: number | null;
	name?: string | null;
	description?: string | null;
	revenue_category?: MocoRevenueCategoryRef | null;
	billable?: boolean | null;
	project_default?: boolean | null;
	index?: number | null;
	created_at?: string | null;
	updated_at?: string | null;
};

export type MocoAccountWebHook = {
	id?: number | null;
	target?: MocoWebHookTarget | null;
	event?: string | null;
	hook?: string | null;
	disabled?: boolean | null;
	disabled_at?: string | null;
	created_at?: string | null;
	updated_at?: string | null;
};

/** Tracked activity entry. */
export type MocoActivity = {
	/** Activity ID. */
	id?: number | null;
	/** Activity date. */
	date?: string | null;
	/** Tracked hours as decimal value. */
	hours?: number | null;
	/** Free-text description. */
	description?: string | null;
	/** Whether this activity has been billed. */
	billed?: boolean | null;
	/** Whether this activity is billable. */
	billable?: boolean | null;
	/** Linked invoice ID if billed. */
	invoice_id?: number | null;
	/** Activity tag. */
	tag?: string | null;
	/** External integration identifier. */
	remote_service?: string | null;
	/** External activity ID. */
	remote_id?: string | null;
	/** External activity URL. */
	remote_url?: string | null;
	project?: MocoProjectRef | null;
	task?: MocoTaskRef | null;
	customer?: MocoCompanyRef | null;
	user?: MocoUserRef | null;
	deal?: MocoDealRef | null;
	/** Effective hourly rate if visible to caller. */
	hourly_rate?: number | null;
	/** Tracked seconds. */
	seconds?: number | null;
	/** Effective worked seconds including rounding logic. */
	worked_seconds?: number | null;
	/** Active timer start timestamp, if timer is running. */
	timer_started_at?: string | null;
	/** Creation timestamp in UTC. */
	created_at?: string | null;
	/** Last update timestamp in UTC. */
	updated_at?: string | null;
};

/** Approval entry for an invoice or purchase. An approval tracks whether an invoice or purchase has been approved or denied by a designated approver. The `target_type` field indicates whether the approval belongs to an invoice or a purchase, and the `target` field contains the corresponding invoice… */
export type MocoApproval = {
	/** Approval ID. */
	id?: number | null;
	/** Current approval status. */
	status?: string | null;
	/** The type of the approval target. */
	target_type?: string | null;
	/** Creation timestamp in UTC. */
	created_at?: string | null;
	/** Last update timestamp in UTC. */
	updated_at?: string | null;
	/** Timestamp when the approval decision was made. */
	decided_at?: string | null;
	/** Note attached to the approval request. */
	note?: string | null;
	/** Note attached when denying the approval. */
	deny_note?: string | null;
	/** Creator of this approval request. */
	creator?: MocoUserRef | null;
	/** First assigned user for approval. */
	approver?: MocoUserRef | null;
	/** Second assigned user for approval (optional). */
	approver2?: MocoUserRef | null;
	/** User who approved or denied the approval request. */
	processed_by?: MocoUserRef | null;
	/** The invoice or purchase this approval belongs to. */
	target?: {
		/** Target ID. */
		id?: number | null;
		/** Target title. */
		title?: string | null;
		/** Target date. */
		date?: string | null;
		/** Net total amount. */
		net_total?: number | null;
		/** Currency code (ISO 4217). */
		currency?: string | null;
	} | null;
};

/** Reduced project payload returned by `/projects/assigned`. */
export type MocoAssignedProject = {
	id?: number | null;
	identifier?: string | null;
	name?: string | null;
	active?: boolean | null;
	billable?: boolean | null;
	customer?: {
		id?: number | null;
		name?: string | null;
	} | null;
	tasks?: Array<{
		id?: number | null;
		name?: string | null;
		active?: boolean | null;
		billable?: boolean | null;
	}> | null;
	contract?: {
		user_id?: number | null;
		active?: boolean | null;
	} | null;
};

export type MocoCashflowRow = {
	record_id?: number | null;
	company_id?: number | null;
	description?: string | null;
	user_id?: number | null;
	amount_in_account_currency?: number | null;
	kind?: string | null;
	date?: string | null;
	company?: {
		id?: number | null;
		name?: string | null;
	} | null;
	user?: {
		id?: number | null;
		firstname?: string | null;
		lastname?: string | null;
	} | null;
};

/** Comment attached to a business entity. */
export type MocoComment = {
	id?: number | null;
	commentable_id?: number | null;
	commentable_type?: string | null;
	text?: string | null;
	manual?: boolean | null;
	created_at?: string | null;
	updated_at?: string | null;
	user?: MocoUserRef | null;
	impersonating_user?: MocoUserRef | null;
};

export type MocoCommentWithAttachment = MocoComment & {
	attachment_filename?: string | null;
	/** Base64 encoded attachment content. */
	attachment_content?: string | null;
};

/** Customer, supplier, or organization record. */
export type MocoCompany = {
	id?: number | null;
	type?: string | null;
	/** Customer identifier (customer records only). */
	identifier?: string | null;
	name?: string | null;
	website?: string | null;
	email?: string | null;
	billing_email_cc?: string | null;
	phone?: string | null;
	fax?: string | null;
	address?: string | null;
	country_code?: string | null;
	vat_identifier?: string | null;
	alternative_correspondence_language?: boolean | null;
	english_correspondence_language?: boolean | null;
	tags?: Array<string> | null;
	labels?: Array<string> | null;
	user?: MocoUserRef | null;
	info?: string | null;
	footer?: string | null;
	custom_properties?: Record<string, MocoJsonValue> | null;
	active?: boolean | null;
	archived_on?: string | null;
	currency?: string | null;
	/** Customer VAT settings (customers only). */
	customer_vat?: MocoVatCodeSale | null;
	/** Supplier VAT settings (suppliers only). */
	supplier_vat?: MocoVatCodePurchase | null;
	default_invoice_due_days?: number | null;
	invoice_format?: string | null;
	default_payment_means?: string | null;
	projects?: Array<{
		id?: number | null;
		identifier?: string | null;
		name?: string | null;
		active?: boolean | null;
		billable?: boolean | null;
	}> | null;
	iban?: string | null;
	bank_bic?: string | null;
	bank_owner?: string | null;
	debit_number?: number | null;
	credit_number?: number | null;
	created_at?: string | null;
	updated_at?: string | null;
};

/** Minimal company reference used in nested resources. */
export type MocoCompanyRef = {
	/** Company ID. */
	id?: number | null;
	/** Company name. */
	name?: string | null;
};

/** Contact person representation. */
export type MocoContactPerson = {
	id?: number | null;
	gender?: string | null;
	firstname?: string | null;
	lastname?: string | null;
	title?: string | null;
	job_position?: string | null;
	mobile_phone?: string | null;
	work_fax?: string | null;
	work_phone?: string | null;
	work_email?: string | null;
	work_address?: string | null;
	home_email?: string | null;
	home_address?: string | null;
	birthday?: string | null;
	salutation?: string | null;
	info?: string | null;
	avatar_url?: string | null;
	tags?: Array<string> | null;
	custom_properties?: Record<string, MocoJsonValue> | null;
	company?: {
		id?: number | null;
		type?: string | null;
		name?: string | null;
	} | null;
	user?: MocoUserRef | null;
	created_at?: string | null;
	updated_at?: string | null;
};

export type MocoContract = {
	id?: number | null;
	user_id?: number | null;
	firstname?: string | null;
	lastname?: string | null;
	billable?: boolean | null;
	active?: boolean | null;
	budget?: number | null;
	hourly_rate?: number | null;
	project?: {
		id?: number | null;
		name?: string | null;
	} | null;
	created_at?: string | null;
	updated_at?: string | null;
};

/** Sales deal with status, value, ownership, and links. */
export type MocoDeal = {
	id?: number | null;
	name?: string | null;
	status?: string | null;
	reminder_date?: string | null;
	closed_on?: string | null;
	money?: number | null;
	currency?: string | null;
	info?: string | null;
	tags?: Array<string> | null;
	custom_properties?: Record<string, MocoJsonValue> | null;
	user?: MocoUserRef | null;
	person?: {
		id?: number | null;
		name?: string | null;
	} | null;
	customer?: {
		id?: number | null;
		name?: string | null;
	} | null;
	company?: {
		id?: number | null;
		type?: string | null;
		name?: string | null;
	} | null;
	category?: {
		id?: number | null;
		name?: string | null;
		probability?: number | null;
	} | null;
	service_period_from?: string | null;
	service_period_to?: string | null;
	inbox_email_address?: string | null;
	created_at?: string | null;
	updated_at?: string | null;
};

/** Deal pipeline category with probability. */
export type MocoDealCategory = {
	id?: number | null;
	name?: string | null;
	probability?: number | null;
	created_at?: string | null;
	updated_at?: string | null;
};

/** Minimal deal reference used in nested resources. */
export type MocoDealRef = {
	/** Deal ID. */
	id?: number | null;
	/** Deal name. */
	name?: string | null;
};

/** Project expense entry. */
export type MocoExpense = {
	/** Expense ID. */
	id?: number | null;
	/** Expense date. */
	date?: string | null;
	/** Expense title. */
	title?: string | null;
	/** Expense description. */
	description?: string | null;
	/** Quantity. */
	quantity?: number | null;
	/** Unit label. */
	unit?: string | null;
	/** Unit selling price. */
	unit_price?: number | null;
	/** Unit internal cost. */
	unit_cost?: number | null;
	/** Total selling price. */
	price?: number | null;
	/** Total internal cost. */
	cost?: number | null;
	/** Expense currency. */
	currency?: string | null;
	/** Whether this expense affects budget calculations. */
	budget_relevant?: boolean | null;
	/** Whether this expense can be billed to customer. */
	billable?: boolean | null;
	/** Whether this expense has already been billed. */
	billed?: boolean | null;
	/** Whether purchase assignment is locked. */
	purchase_assignment_locked?: boolean | null;
	/** Planned cost total. */
	cost_total_planned?: number | null;
	/** Planned purchase date. */
	planned_purchase_date?: string | null;
	/** Linked invoice ID if billed. */
	invoice_id?: number | null;
	/** Human-readable service period. */
	service_period?: string | null;
	/** Service period start date. */
	service_period_from?: string | null;
	/** Service period end date. */
	service_period_to?: string | null;
	/** Linked recurring expense ID. */
	recurring_expense_id?: number | null;
	/** Linked document URL. */
	file_url?: string | null;
	/** Custom field values keyed by custom field name. */
	custom_properties?: Record<string, MocoJsonValue> | null;
	company?: MocoCompanyRef | null;
	project?: MocoProjectRef | null;
	group?: MocoExpenseGroupRef | null;
	/** Linked purchase item allocations. */
	purchase_items?: Array<MocoExpensePurchaseItemRef> | null;
	user?: MocoUserRef | null;
	revenue_category?: MocoRevenueCategoryRef | null;
	/** Creation timestamp in UTC. */
	created_at?: string | null;
	/** Last update timestamp in UTC. */
	updated_at?: string | null;
};

/** Minimal expense group reference used in nested resources. */
export type MocoExpenseGroupRef = {
	/** Expense group ID. */
	id?: number | null;
	/** Expense group title. */
	title?: string | null;
	/** Expense group budget. */
	budget?: number | null;
};

/** Minimal document reference used in expense purchase item nested resources. */
export type MocoExpensePurchaseItemDocumentRef = {
	/** Document ID. */
	id?: number | null;
	/** Document file URL. */
	file_url?: string | null;
} | null;

/** Minimal purchase item reference used in expense nested resources. */
export type MocoExpensePurchaseItemRef = {
	/** Purchase item ID. */
	id?: number | null;
	/** Purchase item title. */
	title?: string | null;
	/** Net total amount. */
	net_total?: number | null;
	/** Purchase currency. */
	currency?: string | null;
	/** Linked purchase ID. */
	purchase_id?: number | null;
	document?: MocoExpensePurchaseItemDocumentRef | null;
};

export type MocoFinanceRow = {
	record_id?: number | null;
	company_id?: number | null;
	description?: string | null;
	user_id?: number | null;
	net_amount_in_account_currency?: number | null;
	kind?: string | null;
	date?: string | null;
	company?: {
		id?: number | null;
		name?: string | null;
	} | null;
	user?: {
		id?: number | null;
		firstname?: string | null;
		lastname?: string | null;
	} | null;
};

/** Base invoice representation returned in invoice list endpoints. */
export type MocoInvoice = {
	/** Internal invoice ID. */
	id?: number | null;
	/** Customer company ID. */
	customer_id?: number | null;
	/** Linked project ID. */
	project_id?: number | null;
	/** Linked offer ID. */
	offer_id?: number | null;
	/** Human-readable invoice number. */
	identifier?: string | null;
	/** Invoice date. */
	date?: string | null;
	/** Due date. */
	due_date?: string | null;
	/** Human-readable service period. */
	service_period?: string | null;
	/** Service period start date. */
	service_period_from?: string | null;
	/** Service period end date. */
	service_period_to?: string | null;
	/** Public API status. */
	status?: string | null;
	/** Whether this invoice has been reversed. */
	reversed?: boolean | null;
	/** Id of the reversal invoice, if any. */
	reversal_invoice_id?: number | null;
	/** Whether this invoice itself is a reversal invoice. */
	reversal?: boolean | null;
	/** Id of the invoice that was reversed by this one. */
	reversed_invoice_id?: number | null;
	/** Invoice title/subject. */
	title?: string | null;
	/** Recipient address printed on the invoice. */
	recipient_address?: string | null;
	/** Invoice currency. */
	currency?: string | null;
	/** Net total amount. */
	net_total?: number | null;
	/** VAT/tax percentage. */
	tax?: number | null;
	/** Full VAT code block. */
	vat?: MocoVatCodeSale | null;
	/** Gross total amount. */
	gross_total?: number | null;
	/** Discount value. */
	discount?: number | null;
	/** Cash discount percentage. */
	cash_discount?: number | null;
	/** Number of days cash discount is valid. */
	cash_discount_days?: number | null;
	/** Creditor reference used for payments. */
	creditor_reference?: string | null;
	/** Bookkeeping debit account number. */
	debit_number?: number | null;
	/** Bookkeeping credit account number. */
	credit_number?: number | null;
	/** Whether accounting/printing has locked modifications. */
	locked?: boolean | null;
	/** Custom field values keyed by custom field name. */
	custom_properties?: Record<string, MocoJsonValue> | null;
	/** Invoice tags. */
	tags?: Array<string> | null;
	/** Letter paper ID used for this invoice. Available letter papers can be fetched via `GET /api/v1/letter_papers`. */
	letter_paper_id?: number | null;
	/** Whether the invoice is set to be printed without letter paper (white). When `true`, `letter_paper_id` will be `null`. */
	without_letter_paper?: boolean | null;
	user?: MocoUserRef | null;
	/** Download URL to the invoice file. URL is temporary and can change. */
	file_url?: string | null;
	/** Debt collection procedure linked to this invoice, if any. */
	debt_collection_procedure?: MocoInvoiceDebtCollectionProcedure | null;
	/** Creation timestamp in UTC. */
	created_at?: string | null;
	/** Last update timestamp in UTC. */
	updated_at?: string | null;
	/** Deprecated date-only version of `created_at`. */
	created_on?: string | null;
	/** Deprecated date-only version of `updated_at`. */
	updated_on?: string | null;
};

export type MocoInvoiceBookkeepingExport = {
	id?: number | null;
	from?: string | null;
	to?: string | null;
	invoice_ids?: Array<number> | null;
	comment?: string | null;
	user?: MocoUserRef | null;
	status?: string | null;
	created_at?: string | null;
	updated_at?: string | null;
};

/** A debt collection procedure linked to an invoice. */
export type MocoInvoiceDebtCollectionProcedure = {
	/** Internal ID of the debt collection procedure. */
	id?: number | null;
	user?: MocoUserRef | null;
	/** Optional note about the debt collection procedure. */
	note?: string | null;
	/** Creation timestamp in UTC. */
	created_at?: string | null;
	/** Last update timestamp in UTC. */
	updated_at?: string | null;
};

/** Detailed invoice representation returned by `/invoices/{id}`. */
export type MocoInvoiceDetail = MocoInvoice & {
	/** Salutation used in invoice document. */
	salutation?: string | null;
	/** Footer text used in invoice document. */
	footer?: string | null;
	/** Invoice line items in display order. */
	items?: Array<MocoInvoiceLineItem> | null;
	/** Payments linked to this invoice. */
	payments?: Array<MocoInvoicePaymentOnInvoice> | null;
	/** Payment reminders linked to this invoice. */
	reminders?: Array<MocoInvoiceReminder> | null;
	internal_contact?: MocoUserRef | null;
	/** Indicates that invoiced activity hours were modified. */
	activity_hours_modified?: boolean | null;
};

/** Invoice line item in read responses. */
export type MocoInvoiceLineItem = {
	/** Line item ID. */
	id?: number | null;
	/** Public line item type. */
	type?: string | null;
	/** Line title. */
	title?: string | null;
	revenue_category?: MocoRevenueCategoryRef | null;
	/** Line description text. */
	description?: string | null;
	/** Quantity for billable items. */
	quantity?: number | null;
	/** Unit label. */
	unit?: string | null;
	/** Unit price. */
	unit_price?: number | null;
	/** Net total amount for this line. */
	net_total?: number | null;
	/** Whether line is optional. */
	optional?: boolean | null;
	/** Derived service type. */
	service_type?: string | null;
	/** Linked expense ids (expense lines only). */
	expense_ids?: Array<number> | null;
	/** Subtotal behavior (subtotal lines only). */
	subtotal_type?: string | null;
};

/** Invoice payment returned by `/invoices/payments` endpoints. */
export type MocoInvoicePayment = {
	/** Payment ID. */
	id?: number | null;
	/** Payment date. */
	date?: string | null;
	/** Linked invoice (if available). */
	invoice?: {
		id?: number | null;
		identifier?: string | null;
		title?: string | null;
	} | null;
	/** Linked payment account (if available). */
	payment_account?: {
		id?: number | null;
		title?: string | null;
		kind?: string | null;
	} | null;
	/** Amount paid. */
	paid_total?: number | null;
	/** Amount paid converted to the account currency. */
	paid_total_in_account_currency?: number | null;
	/** Currency of paid amount. */
	currency?: string | null;
	/** Optional payment description. */
	description?: string | null;
	/** Creation timestamp. */
	created_at?: string | null;
	/** Last update timestamp. */
	updated_at?: string | null;
};

/** Payment representation embedded in invoice details. */
export type MocoInvoicePaymentOnInvoice = {
	/** Payment ID. */
	id?: number | null;
	/** Payment date. */
	date?: string | null;
	/** Amount paid. */
	paid_total?: number | null;
	/** Currency of paid amount. */
	currency?: string | null;
	/** Creation date. */
	created_on?: string | null;
	/** Last update date. */
	updated_on?: string | null;
};

/** Payment reminder linked to an invoice. */
export type MocoInvoiceReminder = {
	/** Reminder ID. */
	id?: number | null;
	/** Reminder creation date. */
	date?: string | null;
	/** Reminder due date. */
	due_date?: string | null;
	/** Reminder fee amount. */
	fee?: number | null;
	/** Reminder text. */
	text?: string | null;
	/** Creation date. */
	created_on?: string | null;
	/** Last update date. */
	updated_on?: string | null;
};

/** Invoice reminder resource returned by `/invoice_reminders` endpoints. */
export type MocoInvoiceReminderRecord = {
	id?: number | null;
	title?: string | null;
	text?: string | null;
	fee?: number | null;
	date?: string | null;
	due_date?: string | null;
	status?: string | null;
	file_url?: string | null;
	invoice?: {
		id?: number | null;
		identifier?: string | null;
		title?: string | null;
		dunning_level?: number | null;
	} | null;
	created_at?: string | null;
	updated_at?: string | null;
};

/** Echoed email payload after successful invoice email sending. */
export type MocoInvoiceSendEmailResponse = {
	/** Final `to` recipients (semicolon-separated). */
	emails_to?: string | null;
	/** Final `cc` recipients (semicolon-separated). */
	emails_cc?: string | null;
	/** Final `bcc` recipients (semicolon-separated). */
	emails_bcc?: string | null;
	/** Email subject. */
	subject?: string | null;
	/** Email body text. */
	text?: string | null;
};

export type MocoLetterPaper = {
	id?: number | null;
	name?: string | null;
	active?: boolean | null;
	template?: string | null;
	file?: string | null;
	created_at?: string | null;
	updated_at?: string | null;
};

/** Offer representation returned by `/offers`. */
export type MocoOffer = {
	id?: number | null;
	invoice_id?: number | null;
	identifier?: string | null;
	date?: string | null;
	due_date?: string | null;
	title?: string | null;
	recipient_address?: string | null;
	currency?: string | null;
	net_total?: number | null;
	tax?: number | null;
	vat?: MocoVatCodeSale | null;
	gross_total?: number | null;
	discount?: number | null;
	status?: string | null;
	tags?: Array<string> | null;
	custom_properties?: Record<string, MocoJsonValue> | null;
	company?: {
		id?: number | null;
		name?: string | null;
	} | null;
	project?: {
		id?: number | null;
		identifier?: string | null;
		name?: string | null;
	} | null;
	deal?: {
		id?: number | null;
		name?: string | null;
	} | null;
	user?: MocoUserRef | null;
	offer_confirmation?: {
		id?: number | null;
		title?: string | null;
		date?: string | null;
		created_at?: string | null;
		updated_at?: string | null;
	} | null;
	customer_approval?: {
		id?: number | null;
		active?: boolean | null;
		url?: string | null;
		customer_full_name?: string | null;
		customer_email?: string | null;
		signed_at?: string | null;
	} | null;
	created_at?: string | null;
	updated_at?: string | null;
	created_on?: string | null;
	updated_on?: string | null;
	/** Full URL to the generated PDF document via the API v1 endpoint. */
	file_url?: string | null;
};

/** Offer confirmation (Auftragsbestätigung) for an accepted offer. Contains the confirmation document metadata, the authoring user, and the parent offer. */
export type MocoOfferConfirmation = {
	/** Internal offer confirmation ID. */
	id?: number | null;
	/** Confirmation date. */
	date?: string | null;
	/** Confirmation title. */
	title?: string | null;
	/** Salutation text (raw HTML). */
	salutation_raw?: string | null;
	/** Footer text (raw HTML). */
	footer_raw?: string | null;
	/** Full URL to the generated PDF document via the API v1 endpoint. */
	file_url?: string | null;
	user?: MocoUserRef | null;
	/** Parent offer. */
	offer?: {
		id?: number | null;
		identifier?: string | null;
		title?: string | null;
	} | null;
};

/** Customer approval state and public URLs for an offer. */
export type MocoOfferCustomerApproval = {
	id?: number | null;
	approval_url?: string | null;
	offer_document_url?: string | null;
	active?: boolean | null;
	customer_full_name?: string | null;
	customer_email?: string | null;
	signature_url?: string | null;
	signed_at?: string | null;
	created_at?: string | null;
	updated_at?: string | null;
};

/** Detailed offer representation returned by `/offers/{id}` and mutation responses. */
export type MocoOfferDetail = MocoOffer & {
	salutation?: string | null;
	footer?: string | null;
	items?: Array<MocoOfferLineItem> | null;
	internal_contact?: MocoUserRef | null;
};

export type MocoOfferLineItem = {
	id?: number | null;
	type?: string | null;
	title?: string | null;
	revenue_category?: MocoRevenueCategoryRef | null;
	description?: string | null;
	quantity?: number | null;
	unit?: string | null;
	unit_price?: number | null;
	net_total?: number | null;
	unit_cost?: number | null;
	optional?: boolean | null;
	service_type?: string | null;
	subtotal_type?: string | null;
};

export type MocoOfferSendEmailResponse = {
	emails_to?: string | null;
	emails_cc?: string | null;
	emails_bcc?: string | null;
	subject?: string | null;
	text?: string | null;
};

/** Planned purchase definition for recurring or one-time purchases. A planned purchase defines a budget for purchases with a specific supplier, purchase budget, and user. It can be one-time or recurring (weekly, monthly, etc.). */
export type MocoPlannedPurchase = {
	/** Internal planned purchase ID. */
	id?: number | null;
	/** Start date of the planned purchase. */
	date?: string | null;
	/** Whether the planned purchase is active. */
	active?: boolean | null;
	/** End date of the planned purchase (for recurring planned purchases). */
	finish_date?: string | null;
	/** Recurrence frequency. */
	frequency?: string | null;
	/** Planned purchase variant type (`once` for one-time planned purchases, `recurring` for recurring planned purchases). */
	variant?: string | null;
	/** Title of the planned purchase. */
	title?: string | null;
	/** Additional information. */
	info?: string | null;
	/** Net total amount in the planned purchase currency. */
	net_total?: number | null;
	/** Net total in account currency. */
	net_total_in_account_currency?: number | null;
	/** Amount already spent from planned purchase. */
	exhausted?: number | null;
	/** Amount spent in account currency. */
	exhausted_in_account_currency?: number | null;
	/** Currency code (ISO 4217). */
	currency?: string | null;
	company?: {
		id?: number | null;
		name?: string | null;
	} | null;
	purchase_budget?: {
		id?: number | null;
		title?: string | null;
	} | null;
	user?: MocoUserRef | null;
	/** Linked purchases created from this planned purchase. */
	purchases?: Array<{
		id?: number | null;
		number?: string | null;
		date?: string | null;
		net_total?: number | null;
		currency?: string | null;
		status?: string | null;
	}> | null;
	/** Custom property values for the planned purchase. */
	custom_properties?: Record<string, MocoJsonValue> | null;
	/** Whether to automatically create purchases on recurrence. */
	create_on_recur?: boolean | null;
	/** Next scheduled recurrence date. */
	recur_next_on?: string | null;
	updated_at?: string | null;
	created_at?: string | null;
};

export type MocoPlannedVsTrackedRow = {
	user_id?: number | null;
	project_id?: number | null;
	tracked_hours?: number | null;
	planned_hours?: number | null;
	delta?: number | null;
	quota?: number | null;
	user?: {
		id?: number | null;
		firstname?: string | null;
		name?: string | null;
		initials?: string | null;
		color?: string | null;
		unit?: {
			id?: number | null;
			name?: string | null;
		} | null;
	} | null;
	project?: {
		id?: number | null;
		identifier?: string | null;
		name?: string | null;
		company?: {
			id?: number | null;
			name?: string | null;
		} | null;
	} | null;
};

/** Planning entry assigned to a user and optionally linked to project/deal/task. */
export type MocoPlanningEntry = {
	id?: number | null;
	title?: string | null;
	starts_on?: string | null;
	ends_on?: string | null;
	hours_per_day?: number | null;
	comment?: string | null;
	symbol?: number | null;
	color?: string | null;
	read_only?: boolean | null;
	user?: MocoUserRef | null;
	project?: {
		id?: number | null;
		identifier?: string | null;
		name?: string | null;
		customer_name?: string | null;
		color?: string | null;
	} | null;
	task?: {
		id?: number | null;
		name?: string | null;
	} | null;
	deal?: {
		id?: number | null;
		name?: string | null;
		customer_name?: string | null;
		color?: string | null;
	} | null;
	series_id?: string | null;
	tentative?: boolean | null;
	series_repeat?: string | null;
	created_at?: string | null;
	updated_at?: string | null;
};

/** Profile of the currently authenticated user. */
export type MocoProfile = {
	id?: number | null;
	email?: string | null;
	full_name?: string | null;
	first_name?: string | null;
	last_name?: string | null;
	active?: boolean | null;
	external?: boolean | null;
	avatar_url?: string | null;
	unit?: {
		id?: number | null;
		name?: string | null;
	} | null;
	created_at?: string | null;
	updated_at?: string | null;
};

/** Full project representation returned by `/projects` and `/projects/{id}`. It includes nested customer, task, contract, leadership and custom field data. */
export type MocoProject = {
	/** Internal project ID. */
	id?: number | null;
	/** Human-readable project number/identifier. */
	identifier?: string | null;
	/** Project name. */
	name?: string | null;
	/** Whether the project is active. */
	active?: boolean | null;
	/** Whether project work is billable. */
	billable?: boolean | null;
	/** Whether the project is fixed price. */
	fixed_price?: boolean | null;
	/** Whether the project is a retainer project. */
	retainer?: boolean | null;
	/** Project start date in ISO-8601 date format. */
	start_date?: string | null;
	/** Project finish date in ISO-8601 date format. */
	finish_date?: string | null;
	/** Billing currency of the project. */
	currency?: string | null;
	/** How rates are applied: - `project`: one project rate - `task`: per task rate - `user`: per assigned user rate */
	billing_variant?: string | null;
	/** Billing address used for documents. */
	billing_address?: string | null;
	/** Default recipient email(s) for billing. */
	billing_email_to?: string | null;
	/** Default CC recipient email(s) for billing. */
	billing_email_cc?: string | null;
	/** Internal or document billing notes. */
	billing_notes?: string | null;
	/** If true, include time report on generated billing documents. */
	setting_include_time_report?: boolean | null;
	/** Budget amount in project currency. */
	budget?: number | null;
	/** Monthly budget for retainers. */
	budget_monthly?: number | null;
	/** Expense budget amount. */
	budget_expenses?: number | null;
	/** Effective hourly rate according to billing variant. */
	hourly_rate?: number | null;
	/** Free text information field. */
	info?: string | null;
	/** Day of month used for retainer billing. */
	retainer_billing_date?: number | null;
	/** Default title used for retainer schedule items. */
	retainer_billing_title?: string | null;
	/** Default description used for retainer schedule items. */
	retainer_billing_description?: string | null;
	/** Project color in hex format. */
	color?: string | null;
	/** Public customer report URL when sharing is enabled. */
	customer_report_url?: string | null;
	/** Tag names assigned to this project. */
	tags?: Array<string> | null;
	/** Deprecated alias for `tags`. */
	labels?: Array<string> | null;
	/** Custom field values keyed by custom field name. */
	custom_properties?: Record<string, MocoJsonValue> | null;
	leader?: MocoUserRef | null;
	co_leader?: MocoUserRef | null;
	/** Customer representation. Returns `{id, name}` by default; full company payload when `include_company=true` is passed. */
	customer?: (MocoCompanyRef | MocoCompany) | null;
	/** Project tasks/services. */
	tasks?: Array<MocoProjectTask> | null;
	/** Assigned user contracts. */
	contracts?: Array<MocoProjectContract> | null;
	deal?: MocoDealRef | null;
	project_group?: MocoProjectGroupRef | null;
	billing_contact?: MocoUserRef | null;
	contact?: MocoUserRef | null;
	secondary_contact?: MocoUserRef | null;
	/** Timestamp when project was archived. */
	archived_on?: string | null;
	/** Creation timestamp in UTC. */
	created_at?: string | null;
	/** Last update timestamp in UTC. */
	updated_at?: string | null;
};

/** User assignment contract within a project. */
export type MocoProjectContract = {
	id?: number | null;
	user_id?: number | null;
	firstname?: string | null;
	lastname?: string | null;
	billable?: boolean | null;
	active?: boolean | null;
	budget?: number | null;
	hourly_rate?: number | null;
};

export type MocoProjectGroup = {
	id?: number | null;
	name?: string | null;
	user?: MocoUserRef | null;
	company?: {
		id?: number | null;
		name?: string | null;
	} | null;
	budget?: number | null;
	currency?: string | null;
	info?: string | null;
	custom_properties?: Record<string, MocoJsonValue> | null;
	customer_report_url?: string | null;
	projects?: Array<{
		id?: number | null;
		identifier?: string | null;
		name?: string | null;
		active?: boolean | null;
		budget?: number | null;
	}> | null;
	created_at?: string | null;
	updated_at?: string | null;
};

/** Minimal project group reference used in nested resources. */
export type MocoProjectGroupRef = {
	/** Project group ID. */
	id?: number | null;
	/** Project group name. */
	name?: string | null;
};

export type MocoProjectPaymentSchedule = {
	id?: number | null;
	date?: string | null;
	title?: string | null;
	net_total?: number | null;
	checked?: boolean | null;
	billed?: boolean | null;
	description?: string | null;
	project?: {
		id?: number | null;
		identifier?: string | null;
		name?: string | null;
	} | null;
	created_at?: string | null;
	updated_at?: string | null;
};

/** Minimal project reference used in nested resources. */
export type MocoProjectRef = {
	/** Project ID. */
	id?: number | null;
	/** Project identifier/number. */
	identifier?: string | null;
	/** Project name. */
	name?: string | null;
	/** Whether the project is billable. */
	billable?: boolean | null;
};

/** Key project business indicators and cost breakdowns. */
export type MocoProjectReport = Record<string, MocoJsonValue>;

export type MocoProjectShareState = {
	id?: number | null;
	active?: boolean | null;
	url?: string | null;
};

/** Task/service within a project. */
export type MocoProjectTask = {
	id?: number | null;
	name?: string | null;
	billable?: boolean | null;
	active?: boolean | null;
	budget?: number | null;
	hourly_rate?: number | null;
	description?: string | null;
};

/** Purchase including supplier, items, and payment information. */
export type MocoPurchase = {
	id?: number | null;
	identifier?: string | null;
	receipt_identifier?: string | null;
	title?: string | null;
	info?: string | null;
	iban?: string | null;
	reference?: string | null;
	date?: string | null;
	due_date?: string | null;
	service_period_from?: string | null;
	service_period_to?: string | null;
	/** either `pending` for inbox, `approved` if archived. */
	status?: string | null;
	/** Indicates whether the purchase is partially paid. */
	partially_paid?: boolean | null;
	payment_method?: string | null;
	net_total?: number | null;
	gross_total?: number | null;
	currency?: string | null;
	file_url?: string | null;
	custom_properties?: Record<string, MocoJsonValue> | null;
	tags?: Array<string> | null;
	company?: {
		id?: number | null;
		name?: string | null;
		iban?: string | null;
	} | null;
	purchase_budget?: {
		id?: number | null;
		title?: string | null;
	} | null;
	payments?: Array<{
		id?: number | null;
		date?: string | null;
		total?: number | null;
		currency?: string | null;
		user?: MocoUserRef | null;
	}> | null;
	user?: MocoUserRef | null;
	refund_request?: {
		id?: number | null;
		comment?: string | null;
		user_id?: number | null;
	} | null;
	approval_status?: string | null;
	credit_card_transaction?: {
		source?: string | null;
		transaction_identifier?: string | null;
	} | null;
	items?: Array<MocoPurchaseItem> | null;
	created_at?: string | null;
	updated_at?: string | null;
};

export type MocoPurchaseBookkeepingExport = {
	id?: number | null;
	from?: string | null;
	to?: string | null;
	purchase_ids?: Array<number> | null;
	comment?: string | null;
	user?: MocoUserRef | null;
	status?: string | null;
	created_at?: string | null;
	updated_at?: string | null;
};

export type MocoPurchaseBudget = {
	id?: number | null;
	year?: number | null;
	title?: string | null;
	active?: boolean | null;
	cost_category?: string | null;
	target?: number | null;
	/** Kept for API compatibility (original key spelling). */
	exhaused?: number | null;
	planned?: number | null;
	remaining?: number | null;
};

export type MocoPurchaseCategory = {
	id?: number | null;
	name?: string | null;
	credit_account?: string | null;
	active?: boolean | null;
	created_at?: string | null;
	updated_at?: string | null;
};

export type MocoPurchaseDraft = {
	id?: number | null;
	title?: string | null;
	email_from?: string | null;
	email_body?: string | null;
	user?: MocoUserRef | null;
	file_url?: string | null;
	net_total?: number | null;
	gross_total?: number | null;
	credit_card_transaction?: {
		source?: string | null;
		transaction_identifier?: string | null;
	} | null;
	created_at?: string | null;
	updated_at?: string | null;
};

export type MocoPurchaseItem = {
	id?: number | null;
	title?: string | null;
	net_total?: number | null;
	tax_total?: number | null;
	tax?: number | null;
	vat?: MocoVatCodePurchase | null;
	tax_included?: boolean | null;
	ksk_relevant?: boolean | null;
	gross_total?: number | null;
	category?: {
		id?: number | null;
		name?: string | null;
		credit_account?: string | null;
	} | null;
	supplier_credit_number?: number | null;
	expense?: {
		id?: number | null;
		project?: {
			id?: number | null;
			company_id?: number | null;
		} | null;
	} | null;
	receipt?: {
		id?: number | null;
		title?: string | null;
		date?: string | null;
		attachment_url?: string | null;
	} | null;
};

export type MocoPurchasePayment = {
	id?: number | null;
	date?: string | null;
	purchase?: {
		id?: number | null;
		identifier?: string | null;
		title?: string | null;
		/** Date of the latest payment recorded for the purchase, or null if no payment has been made yet. */
		paid_on?: string | null;
		/** Indicates whether the purchase is partially paid. */
		partially_paid?: boolean | null;
	} | null;
	payment_account?: {
		id?: number | null;
		title?: string | null;
		kind?: string | null;
	} | null;
	total?: number | null;
	currency?: string | null;
	/** ID of the remittance export (Überweisungsauftrag) that triggered this payment, or null if the payment was created manually. */
	remittance_export_id?: number | null;
	created_at?: string | null;
	updated_at?: string | null;
};

/** Employee receipt with VAT split lines. */
export type MocoReceipt = {
	id?: number | null;
	title?: string | null;
	date?: string | null;
	billable?: boolean | null;
	pending?: boolean | null;
	gross_total?: number | null;
	currency?: string | null;
	items?: Array<MocoReceiptItem> | null;
	project?: {
		id?: number | null;
		name?: string | null;
		billable?: boolean | null;
		company?: {
			id?: number | null;
			name?: string | null;
		} | null;
	} | null;
	info?: string | null;
	user?: MocoUserRef | null;
	refund_request?: {
		id?: number | null;
		status?: string | null;
	} | null;
	attachment_url?: string | null;
};

export type MocoReceiptItem = {
	gross_total?: number | null;
	vat?: MocoVatCodePurchase | null;
	purchase_category?: {
		id?: number | null;
		name?: string | null;
	} | null;
};

export type MocoRecurringExpense = {
	id?: number | null;
	start_date?: string | null;
	finish_date?: string | null;
	recur_next_date?: string | null;
	period?: string | null;
	title?: string | null;
	description?: string | null;
	quantity?: number | null;
	unit?: string | null;
	unit_price?: number | null;
	unit_cost?: number | null;
	price?: number | null;
	cost?: number | null;
	currency?: string | null;
	budget_relevant?: boolean | null;
	billable?: boolean | null;
	purchase_assignment_locked?: boolean | null;
	service_period_direction?: string | null;
	custom_properties?: Record<string, MocoJsonValue> | null;
	project?: MocoProjectRef | null;
	user?: MocoUserRef | null;
	revenue_category?: MocoRevenueCategoryRef | null;
	created_at?: string | null;
	updated_at?: string | null;
};

/** Revenue category for classifying tasks and expenses for accounting exports. */
export type MocoRevenueCategory = {
	id?: number | null;
	name?: string | null;
	revenue_account?: number | null;
	cost_category?: string | null;
	assignment_kind?: string | null;
};

/** Minimal revenue category reference used in nested resources. */
export type MocoRevenueCategoryRef = {
	/** Revenue category ID. */
	id?: number | null;
	/** Revenue category name. */
	name?: string | null;
	/** Revenue account number. */
	revenue_account?: number | null;
	/** Cost category identifier. */
	cost_category?: string | null;
	/** Which entity types this category applies to. */
	assignment_kind?: string | null;
};

/** Attachment linked to a sales document (invoice/offer). */
export type MocoSalesDocumentAttachment = {
	/** Attachment ID. */
	id?: number | null;
	/** Display name of attachment. */
	title?: string | null;
	/** Creation timestamp in UTC. */
	created_at?: string | null;
	/** Last update timestamp in UTC. */
	updated_at?: string | null;
};

/** Contains among the standard fields: assignment (absence) and user (assigned staff). */
export type MocoSchedule = {
	id?: number | null;
	date?: string | null;
	comment?: string | null;
	am?: boolean | null;
	pm?: boolean | null;
	symbol?: string | null;
	assignment?: {
		id?: number | null;
		name?: string | null;
		code?: string | null;
		customer_name?: string | null;
		color?: string | null;
		type?: string | null;
	} | null;
	user?: MocoUserRef | null;
	created_at?: string | null;
	updated_at?: string | null;
};

/** Identity of the current user for the provided API key. */
export type MocoSessionShowResponse = {
	/** Internal user ID. */
	id?: number | null;
	/** Stable user UUID. */
	uuid?: string | null;
};

/** Generic tag entity used across contexts. */
export type MocoTag = {
	id?: number | null;
	name?: string | null;
	color?: string | null;
	/** Public context; internal `Assignment` is exposed as `Project`. */
	context?: string | null;
	created_at?: string | null;
	updated_at?: string | null;
};

export type MocoTask = {
	id?: number | null;
	name?: string | null;
	description?: string | null;
	billable?: boolean | null;
	active?: boolean | null;
	budget?: number | null;
	hourly_rate?: number | null;
	revenue_category?: MocoRevenueCategoryRef | null;
	created_at?: string | null;
	updated_at?: string | null;
};

/** Minimal task reference used in nested resources. */
export type MocoTaskRef = {
	/** Task ID. */
	id?: number | null;
	/** Task name. */
	name?: string | null;
	/** Whether the task is billable. */
	billable?: boolean | null;
};

/** Todo item returned by `/todos/{id}`. */
export type MocoTodo = {
	id?: number | null;
	title?: string | null;
	due_date?: string | null;
	completed_at?: string | null;
	completed?: boolean | null;
	personal?: boolean | null;
	todoable_id?: number | null;
	todoable_type?: string | null;
	todoable_description?: string | null;
	created_by?: MocoUserRef | null;
	assigned_to?: MocoUserRef | null;
	created_at?: string | null;
	updated_at?: string | null;
};

/** Organizational unit with assigned users. */
export type MocoUnit = {
	id?: number | null;
	name?: string | null;
	custom_properties?: Record<string, MocoJsonValue> | null;
	users?: Array<{
		id?: number | null;
		firstname?: string | null;
		lastname?: string | null;
		email?: string | null;
	}> | null;
	created_at?: string | null;
	updated_at?: string | null;
};

/** Account user representation. */
export type MocoUser = {
	id?: number | null;
	firstname?: string | null;
	lastname?: string | null;
	active?: boolean | null;
	/** Indicates external collaborator flag. */
	extern?: boolean | null;
	email?: string | null;
	mobile_phone?: string | null;
	work_phone?: string | null;
	home_address?: string | null;
	info?: string | null;
	birthday?: string | null;
	iban?: string | null;
	avatar_url?: string | null;
	tags?: Array<string> | null;
	custom_properties?: Record<string, MocoJsonValue> | null;
	/** The bookkeeping credit account number for supplier transactions (for refunds). */
	credit_number?: string | null;
	role?: {
		id?: number | null;
		name?: string | null;
	} | null;
	unit?: {
		id?: number | null;
		name?: string | null;
	} | null;
	created_at?: string | null;
	updated_at?: string | null;
};

export type MocoUserAbsenceRequest = {
	id?: number | null;
	type?: string | null;
	status?: string | null;
	total_days?: number | null;
	days?: Array<{
		date?: string | null;
		am?: boolean | null;
		pm?: boolean | null;
	}> | null;
	comment?: string | null;
	approved_at?: string | null;
	created_at?: string | null;
	updated_at?: string | null;
	user?: MocoUserRef | null;
	approver?: MocoUserRef | null;
	selected_approver?: MocoUserRef | null;
	/** Custom field values keyed by custom field name. */
	custom_properties?: Record<string, MocoJsonValue> | null;
};

export type MocoUserEmployment = {
	id?: number | null;
	weekly_target_hours?: number | null;
	pattern?: {
		am?: Array<number> | null;
		pm?: Array<number> | null;
	} | null;
	from?: string | null;
	to?: string | null;
	user?: MocoUserRef | null;
	created_at?: string | null;
	updated_at?: string | null;
};

export type MocoUserHoliday = {
	id?: number | null;
	year?: number | null;
	title?: string | null;
	days?: number | null;
	hours?: number | null;
	user?: MocoUserRef | null;
	creator?: MocoUserRef | null;
	created_at?: string | null;
	updated_at?: string | null;
};

/** Annual and monthly performance report for one user. */
export type MocoUserPerformanceReport = {
	annually?: {
		year?: number | null;
		employment_hours?: number | null;
		target_hours?: number | null;
		hours_tracked_total?: number | null;
		variation?: number | null;
		variation_until_today?: number | null;
		hours_billable_total?: number | null;
	} | null;
	monthly?: Array<{
		year?: number | null;
		month?: number | null;
		target_hours?: number | null;
		hours_tracked_total?: number | null;
		variation?: number | null;
		hours_billable_total?: number | null;
	}> | null;
};

export type MocoUserPresence = {
	id?: number | null;
	date?: string | null;
	from?: string | null;
	to?: string | null;
	is_home_office?: boolean | null;
	user?: MocoUserRef | null;
	created_at?: string | null;
	updated_at?: string | null;
};

/** Minimal user reference used in nested resources. */
export type MocoUserRef = {
	/** User ID. */
	id?: number | null;
	/** First name. */
	firstname?: string | null;
	/** Last name. */
	lastname?: string | null;
} | null;

export type MocoUserRole = {
	id?: number | null;
	name?: string | null;
	is_default?: boolean | null;
	is_admin?: boolean | null;
	permission?: {
		report?: string | null;
		companies?: string | null;
		contacts?: string | null;
		people?: string | null;
		purchases?: string | null;
		settings?: string | null;
		sales?: string | null;
		projects?: string | null;
		calendar?: string | null;
		time_tracking?: string | null;
		invoicing?: string | null;
	} | null;
	created_at?: string | null;
	updated_at?: string | null;
};

export type MocoUserWorkTimeAdjustment = {
	id?: number | null;
	date?: string | null;
	description?: string | null;
	hours?: number | null;
	user?: MocoUserRef | null;
	creator?: MocoUserRef | null;
	created_at?: string | null;
	updated_at?: string | null;
};

export type MocoUtilizationRow = {
	date?: string | null;
	user_id?: number | null;
	target_hours?: number | null;
	billable_hours?: number | null;
	unbillable_hours?: number | null;
	billable_seconds?: number | null;
	unbillable_seconds?: number | null;
};

export type MocoVatCodePurchase = {
	id?: number | null;
	tax?: number | null;
	description?: string | null;
	reverse_charge?: boolean | null;
	intra_eu?: boolean | null;
	active?: boolean | null;
	code?: string | null;
};

export type MocoVatCodeSale = {
	id?: number | null;
	tax?: number | null;
	description?: string | null;
	reverse_charge?: boolean | null;
	intra_eu?: boolean | null;
	print_gross_total?: boolean | null;
	notice_tax_exemption?: string | null;
	notice_tax_exemption_en?: string | null;
	notice_tax_exemption_alt?: string | null;
	active?: boolean | null;
	code?: string | null;
	credit_account?: string | null;
};

/** Resource type a webhook watches for events. Values correspond to internal class names. Namespace qualifiers (`::`) are used where the resource lives under another model (for example `Invoice::Approval`, `Project::PaymentSchedule`, `User::AbsenceRequest`). */
export type MocoWebHookTarget = string;

export type MocoOperationInputs = {
	'account.catalogServices.create': {
		title: string;
		items: Array<MocoAccountCatalogServiceItemCreateRequestInput>;
	};
	'account.catalogServices.delete': {
		/** Resource ID. */
		id: number;
	};
	'account.catalogServices.get': {
		/** Resource ID. */
		id: number;
	};
	'account.catalogServices.items.create': {
		catalog_service_id: number;
		id?: number;
		type:
			| 'title'
			| 'description'
			| 'item'
			| 'subtotal'
			| 'page-break'
			| 'separator'
			| 'position-group';
		title?: string;
		description?: string;
		quantity?: number;
		unit?: string;
		unit_price?: number;
		unit_cost?: number;
		net_total?: number;
		optional?: boolean;
		part?: boolean;
		subtotal_type?:
			| 'part_total'
			| 'sub_total'
			| 'optional_part_total'
			| 'optional_sub_total';
		destroyed?: boolean;
		additional?: boolean;
		position_group_display?: string;
		revenue_category_id?: number | null;
		position_group_items?: Array<{
			title?: string;
			unit?: string;
			quantity?: number;
			unit_price?: number;
			unit_cost?: number;
		}>;
	};
	'account.catalogServices.items.delete': {
		catalog_service_id: number;
		/** Resource ID. */
		id: number;
	};
	'account.catalogServices.items.get': {
		catalog_service_id: number;
		/** Resource ID. */
		id: number;
	};
	'account.catalogServices.items.update': {
		catalog_service_id: number;
		/** Resource ID. */
		id: number;
		type?:
			| 'title'
			| 'description'
			| 'item'
			| 'subtotal'
			| 'page-break'
			| 'separator'
			| 'position-group';
		title?: string;
		description?: string;
		quantity?: number;
		unit?: string;
		unit_price?: number;
		unit_cost?: number;
		net_total?: number;
		optional?: boolean;
		part?: boolean;
		subtotal_type?:
			| 'part_total'
			| 'sub_total'
			| 'optional_part_total'
			| 'optional_sub_total';
		destroyed?: boolean;
		additional?: boolean;
		position_group_display?: string;
		revenue_category_id?: number | null;
		position_group_items?: Array<{
			title?: string;
			unit?: string;
			quantity?: number;
			unit_price?: number;
			unit_cost?: number;
		}>;
	};
	'account.catalogServices.list': {
		/** Page number, starting at 1. */
		page?: number;
		/** Page size. */
		per_page?: number;
		/** Comma-separated IDs. */
		ids?: number | string;
		/** ISO 8601 UTC timestamp (e.g. `2026-01-31T14:30:00Z`). Returns entities created or updated after this timestamp and is intended for incremental synchronization. Combine with delete webhooks for full synchronization. */
		updated_after?: string;
	};
	'account.catalogServices.update': {
		/** Resource ID. */
		id: number;
		title?: string;
	};
	'account.customProperties.create': {
		id?: number;
		name?: string;
		kind?:
			| 'String'
			| 'Textarea'
			| 'Link'
			| 'Boolean'
			| 'Select'
			| 'MultiSelect'
			| 'Date';
		entity?:
			| 'Project'
			| 'Customer'
			| 'Supplier'
			| 'Organization'
			| 'Contact'
			| 'Unit'
			| 'User'
			| 'AbsenceRequest'
			| 'HolidayRequest'
			| 'Deal'
			| 'Expense'
			| 'Purchase'
			| 'Invoice'
			| 'Offer'
			| 'ProjectGroup'
			| 'PurchaseOrder';
		placeholder?: string;
		placeholder_alt?: string;
		print_on_invoice?: boolean;
		print_on_offer?: boolean;
		print_on_timesheet?: boolean;
		notification_enabled?: boolean;
		api_only?: boolean;
		defaults?: Array<string>;
	};
	'account.customProperties.delete': {
		/** Resource ID. */
		id: number;
	};
	'account.customProperties.get': {
		/** Resource ID. */
		id: number;
	};
	'account.customProperties.list': {
		/** Page number, starting at 1. */
		page?: number;
		/** Page size. */
		per_page?: number;
		/** Comma-separated IDs. */
		ids?: number | string;
		/** ISO 8601 UTC timestamp (e.g. `2026-01-31T14:30:00Z`). Returns entities created or updated after this timestamp and is intended for incremental synchronization. Combine with delete webhooks for full synchronization. */
		updated_after?: string;
		entity?:
			| 'Project'
			| 'Customer'
			| 'Supplier'
			| 'Organization'
			| 'Contact'
			| 'Unit'
			| 'User'
			| 'AbsenceRequest'
			| 'HolidayRequest'
			| 'Deal'
			| 'Expense'
			| 'Purchase'
			| 'Invoice'
			| 'Offer'
			| 'ProjectGroup'
			| 'PurchaseOrder';
	};
	'account.customProperties.update': {
		/** Resource ID. */
		id: number;
		name: string;
		kind?:
			| 'String'
			| 'Textarea'
			| 'Link'
			| 'Boolean'
			| 'Select'
			| 'MultiSelect'
			| 'Date';
		entity?:
			| 'Project'
			| 'Customer'
			| 'Supplier'
			| 'Organization'
			| 'Contact'
			| 'Unit'
			| 'User'
			| 'AbsenceRequest'
			| 'HolidayRequest'
			| 'Deal'
			| 'Expense'
			| 'Purchase'
			| 'Invoice'
			| 'Offer'
			| 'ProjectGroup'
			| 'PurchaseOrder';
		placeholder?: string;
		placeholder_alt?: string;
		print_on_invoice?: boolean;
		print_on_offer?: boolean;
		print_on_timesheet?: boolean;
		notification_enabled?: boolean;
		api_only?: boolean;
		defaults?: Array<string>;
	};
	'account.expenseTemplates.create': {
		title?: string;
		description?: string;
		unit?: string;
		unit_price?: number;
		unit_cost?: number;
		revenue_category_id?: number;
		/** Currency code, like USD or EUR. */
		currency: string;
	};
	'account.expenseTemplates.delete': {
		/** Resource ID. */
		id: number;
	};
	'account.expenseTemplates.get': {
		/** Resource ID. */
		id: number;
	};
	'account.expenseTemplates.list': {
		/** Page number, starting at 1. */
		page?: number;
		/** Page size. */
		per_page?: number;
		/** Comma-separated IDs. */
		ids?: number | string;
		/** ISO 8601 UTC timestamp (e.g. `2026-01-31T14:30:00Z`). Returns entities created or updated after this timestamp and is intended for incremental synchronization. Combine with delete webhooks for full synchronization. */
		updated_after?: string;
	};
	'account.expenseTemplates.update': {
		/** Resource ID. */
		id: number;
		title?: string;
		description?: string;
		unit?: string;
		unit_price?: number;
		unit_cost?: number;
		revenue_category_id?: number;
		/** Currency code, like USD or EUR. */
		currency?: string;
	};
	'account.fixedCosts.list': {
		/** Page number, starting at 1. */
		page?: number;
		/** Optional year filter for monthly cost entries. */
		year?: number;
	};
	'account.hourlyRates.get': {
		/** Optional company ID. Returns company-specific defaults when available. */
		company_id?: number;
		/** Include archived users in the `users` section. */
		include_archived_users?: boolean;
	};
	'account.internalHourlyRates.get': {
		/** Comma-separated years, for example `2024,2025`. Defaults to current year. */
		years?: string;
		/** Optional unit filter. */
		unit_id?: number;
		/** Include archived users in response. */
		include_archived?: boolean;
	};
	'account.internalHourlyRates.update': {
		year: number;
		rates: Array<{
			user_id: number;
			rate: number;
		}>;
	};
	'account.taskTemplates.create': {
		name?: string;
		description?: string;
		revenue_category_id?: number;
		billable?: boolean;
		project_default?: boolean;
		index?: number;
	};
	'account.taskTemplates.delete': {
		/** Resource ID. */
		id: number;
	};
	'account.taskTemplates.get': {
		/** Resource ID. */
		id: number;
	};
	'account.taskTemplates.list': {
		/** Page number, starting at 1. */
		page?: number;
		/** Page size. */
		per_page?: number;
		/** Comma-separated IDs. */
		ids?: number | string;
		/** ISO 8601 UTC timestamp (e.g. `2026-01-31T14:30:00Z`). Returns entities created or updated after this timestamp and is intended for incremental synchronization. Combine with delete webhooks for full synchronization. */
		updated_after?: string;
	};
	'account.taskTemplates.update': {
		/** Resource ID. */
		id: number;
		name?: string;
		description?: string;
		revenue_category_id?: number;
		billable?: boolean;
		project_default?: boolean;
		index?: number;
	};
	'account.webHooks.create': {
		target: MocoWebHookTargetInput;
		event: string;
		hook: string;
	};
	'account.webHooks.delete': {
		/** Resource ID. */
		id: number;
	};
	'account.webHooks.disable': {
		/** Resource ID. */
		id: number;
	};
	'account.webHooks.enable': {
		/** Resource ID. */
		id: number;
	};
	'account.webHooks.get': {
		/** Resource ID. */
		id: number;
	};
	'account.webHooks.list': {
		/** Page number, starting at 1. */
		page?: number;
		/** Page size. */
		per_page?: number;
		/** Comma-separated IDs. */
		ids?: number | string;
		/** ISO 8601 UTC timestamp (e.g. `2026-01-31T14:30:00Z`). Returns entities created or updated after this timestamp and is intended for incremental synchronization. Combine with delete webhooks for full synchronization. */
		updated_after?: string;
	};
	'account.webHooks.update': {
		/** Resource ID. */
		id: number;
		hook: string;
	};
	'activities.bulkCreate': {
		/** Up to 100 activity entries. */
		activities: Array<MocoActivityUpsertRequestInput>;
	};
	'activities.create': {
		/** Execute request on behalf of another user if the authenticated user has permission to *Staff*. Some resources, such as Activities and User Presences, can be created for other users only if this header is used. */
		impersonate_user_id?: number;
		/** Activity date. */
		date?: string;
		/** Task/service ID. */
		task_id?: number;
		/** Optional company/customer ID shortcut. */
		company_id?: number;
		/** Project ID (mapped internally to assignment). */
		project_id?: number;
		/** Free-text activity description. */
		description?: string;
		/** Optional activity tag label. */
		tag?: string;
		/** Duration in seconds. */
		seconds?: number;
		/** Deprecated duration field, converted to seconds. */
		hours?: number;
		/** Whether the activity is billable. */
		billable?: boolean;
		/** External source system identifier. */
		remote_service?:
			| ''
			| 'trello'
			| 'jira'
			| 'asana'
			| 'basecamp'
			| 'wunderlist'
			| 'basecamp2'
			| 'basecamp3'
			| 'toggl'
			| 'mite'
			| 'github'
			| 'youtrack'
			| null;
		/** URL to related external item. */
		remote_url?: string;
		/** External identifier of linked remote item. */
		remote_id?: string;
		/** If true, stops any running timer before applying the update. This allows updating `seconds` even when a timer is running. */
		stop_timer?: boolean;
	};
	'activities.delete': {
		/** Resource ID. */
		id: number;
	};
	'activities.disregard': {
		/** Customer/company ID used for disregard context. */
		company_id: number;
		/** Deprecated alias for `company_id`. */
		customer_id?: number;
		/** Reason shown in history/audit context. */
		reason: string;
		/** Optional project scope. */
		project_id?: number;
		/** IDs of activities to disregard. */
		activity_ids: Array<number>;
	};
	'activities.get': {
		/** Resource ID. */
		id: number;
	};
	'activities.list': {
		/** Page number, starting at 1. */
		page?: number;
		/** Page size. */
		per_page?: number;
		/** Comma-separated IDs. */
		ids?: number | string;
		/** Field and optional direction, e.g. `title desc`. */
		sort_by?: string;
		/** ISO 8601 UTC timestamp (e.g. `2026-01-31T14:30:00Z`). Returns entities created or updated after this timestamp and is intended for incremental synchronization. Combine with delete webhooks for full synchronization. */
		updated_after?: string;
		/** Start date filter. Format: YYYY-MM-DD (e.g. `2026-01-01`). */
		from?: string;
		/** End date filter. Format: YYYY-MM-DD (e.g. `2026-01-31`). */
		to?: string;
		user_id?: number;
		task_id?: number;
		company_id?: number;
		project_id?: number;
		/** Single ID or comma-separated list. */
		deal_id?: number | string;
		billable?: boolean;
		billed?: boolean;
		term?: string;
		/** Single tag or comma-separated list of tags. */
		tag?: string;
		/** Single remote ID or comma-separated list of remote IDs. */
		remote_id?: number | string;
	};
	'activities.startTimer': {
		/** Resource ID. */
		id: number;
	};
	'activities.stopTimer': {
		/** Resource ID. */
		id: number;
	};
	'activities.update': {
		/** Resource ID. */
		id: number;
		/** Activity date. */
		date?: string;
		/** Task/service ID. */
		task_id?: number;
		/** Optional company/customer ID shortcut. */
		company_id?: number;
		/** Project ID (mapped internally to assignment). */
		project_id?: number;
		/** Free-text activity description. */
		description?: string;
		/** Optional activity tag label. */
		tag?: string;
		/** Duration in seconds. */
		seconds?: number;
		/** Deprecated duration field, converted to seconds. */
		hours?: number;
		/** Whether the activity is billable. */
		billable?: boolean;
		/** External source system identifier. */
		remote_service?:
			| ''
			| 'trello'
			| 'jira'
			| 'asana'
			| 'basecamp'
			| 'wunderlist'
			| 'basecamp2'
			| 'basecamp3'
			| 'toggl'
			| 'mite'
			| 'github'
			| 'youtrack'
			| null;
		/** URL to related external item. */
		remote_url?: string;
		/** External identifier of linked remote item. */
		remote_id?: string;
		/** If true, stops any running timer before applying the update. This allows updating `seconds` even when a timer is running. */
		stop_timer?: boolean;
	};
	'activities.updateBillableSeconds': {
		/** Resource ID. */
		id: number;
		/** Billable seconds (may differ from worked_seconds). */
		seconds?: number;
	};
	'approvals.approve': {
		/** Resource ID. */
		id: number;
	};
	'approvals.create': {
		/** The type of the approval target. */
		target_type: 'invoice' | 'purchase';
		/** ID of the invoice or purchase to approve. */
		target_id: number;
		/** ID of the first user assigned to approve. */
		approver_id: number;
		/** ID of an optional second approver. */
		approver2_id?: number | null;
		/** Optional note attached to the approval request. */
		note?: string | null;
	};
	'approvals.delete': {
		/** Resource ID. */
		id: number;
	};
	'approvals.deny': {
		/** Resource ID. */
		id: number;
		/** Reason for denial. */
		note?: string;
	};
	'approvals.get': {
		/** Resource ID. */
		id: number;
	};
	'approvals.list': {
		/** Page number, starting at 1. */
		page?: number;
		/** Page size. */
		per_page?: number;
		/** Comma-separated IDs. */
		ids?: number | string;
		/** ISO 8601 UTC timestamp (e.g. `2026-01-31T14:30:00Z`). Returns entities created or updated after this timestamp and is intended for incremental synchronization. Combine with delete webhooks for full synchronization. */
		updated_after?: string;
		/** Filter by approval target type. */
		type?: 'invoice' | 'purchase';
		/** Filter by approver user ID. */
		approver_user_id?: number;
		/** Filter by creator user ID. */
		creator_user_id?: number;
		/** Filter by approval status. */
		approval_status?: 'pending' | 'approved' | 'denied';
	};
	'comments.bulkCreate': {
		text: string;
		created_at?: string;
		commentable_type:
			| 'Company'
			| 'Contact'
			| 'Deal'
			| 'DeliveryNote'
			| 'Expense'
			| 'Invoice'
			| 'InvoiceBookkeepingExport'
			| 'InvoiceDeletion'
			| 'InvoiceReminder'
			| 'Offer'
			| 'OfferConfirmation'
			| 'Project'
			| 'ProjectGroup'
			| 'Purchase'
			| 'PurchaseBookkeepingExport'
			| 'PurchaseDraft'
			| 'Receipt'
			| 'ReceiptRefundRequest'
			| 'RecurringExpense'
			| 'Unit'
			| 'User'
			| 'UserHolidayRequest';
		commentable_ids: Array<number>;
	};
	'comments.create': {
		text?: string;
		created_at?: string;
		commentable_id?: number;
		/** Public target type (for example `Project`, `Invoice`, `Purchase`). */
		commentable_type?:
			| 'Company'
			| 'Contact'
			| 'Deal'
			| 'DeliveryNote'
			| 'Expense'
			| 'Invoice'
			| 'InvoiceBookkeepingExport'
			| 'InvoiceDeletion'
			| 'InvoiceReminder'
			| 'Offer'
			| 'OfferConfirmation'
			| 'Project'
			| 'ProjectGroup'
			| 'Purchase'
			| 'PurchaseBookkeepingExport'
			| 'PurchaseDraft'
			| 'Receipt'
			| 'ReceiptRefundRequest'
			| 'RecurringExpense'
			| 'Unit'
			| 'User'
			| 'UserHolidayRequest';
		attachment_filename?: string;
		attachment_content?: string;
	};
	'comments.delete': {
		/** Resource ID. */
		id: number;
	};
	'comments.get': {
		/** Resource ID. */
		id: number;
	};
	'comments.list': {
		/** Page number, starting at 1. */
		page?: number;
		/** Page size. */
		per_page?: number;
		/** Comma-separated IDs. */
		ids?: number | string;
		/** ISO 8601 UTC timestamp (e.g. `2026-01-31T14:30:00Z`). Returns entities created or updated after this timestamp and is intended for incremental synchronization. Combine with delete webhooks for full synchronization. */
		updated_after?: string;
		/** Comment target type (for example `Project`, `Invoice`, `Purchase`). */
		commentable_type?:
			| 'Company'
			| 'Contact'
			| 'Deal'
			| 'DeliveryNote'
			| 'Expense'
			| 'Invoice'
			| 'InvoiceBookkeepingExport'
			| 'InvoiceDeletion'
			| 'InvoiceReminder'
			| 'Offer'
			| 'OfferConfirmation'
			| 'Project'
			| 'ProjectGroup'
			| 'Purchase'
			| 'PurchaseBookkeepingExport'
			| 'PurchaseDraft'
			| 'Receipt'
			| 'ReceiptRefundRequest'
			| 'RecurringExpense'
			| 'Unit'
			| 'User'
			| 'UserHolidayRequest';
		commentable_id?: number;
		user_id?: number;
		manual?: boolean;
	};
	'comments.update': {
		/** Resource ID. */
		id: number;
		text?: string;
		created_at?: string;
		commentable_id?: number;
		/** Public target type (for example `Project`, `Invoice`, `Purchase`). */
		commentable_type?:
			| 'Company'
			| 'Contact'
			| 'Deal'
			| 'DeliveryNote'
			| 'Expense'
			| 'Invoice'
			| 'InvoiceBookkeepingExport'
			| 'InvoiceDeletion'
			| 'InvoiceReminder'
			| 'Offer'
			| 'OfferConfirmation'
			| 'Project'
			| 'ProjectGroup'
			| 'Purchase'
			| 'PurchaseBookkeepingExport'
			| 'PurchaseDraft'
			| 'Receipt'
			| 'ReceiptRefundRequest'
			| 'RecurringExpense'
			| 'Unit'
			| 'User'
			| 'UserHolidayRequest';
		attachment_filename?: string;
		attachment_content?: string;
	};
	'companies.archive': {
		/** Resource ID. */
		id: number;
	};
	'companies.create': {
		type?: 'customer' | 'supplier' | 'organization';
		identifier?: string;
		name?: string;
		email?: string;
		address?: string;
		currency?: string;
		/** Deprecated VAT shortcut for customer records. */
		customer_tax?: number;
		/** Deprecated VAT shortcut for supplier records. */
		supplier_tax?: number;
		customer_vat_code_id?: number;
		supplier_vat_code_id?: number;
		info?: string;
		default_invoice_due_days?: number;
		invoice_due_days?: number;
		website?: string;
		phone?: string;
		fax?: string;
		user_id?: number;
		country_code?: string;
		footer?: string;
		iban?: string;
		vat_identifier?: string;
		billing_email_cc?: string;
		debit_number?: number;
		credit_number?: number;
		alternative_correspondence_language?: boolean;
		billing_notes?: string;
		bank_bic?: string;
		bank_owner?: string;
		invoice_format?: 'regular_pdf' | 'x_invoice' | 'zugferd_x_invoice';
		default_payment_means?: 'not_defined' | 'credit_transfer';
		tags?: Array<string>;
		labels?: Array<string>;
		custom_properties?: Record<string, MocoJsonValue>;
	};
	'companies.delete': {
		/** Resource ID. */
		id: number;
	};
	'companies.get': {
		/** Resource ID. */
		id: number;
	};
	'companies.list': {
		/** Page number, starting at 1. */
		page?: number;
		/** Page size. */
		per_page?: number;
		/** Comma-separated IDs. */
		ids?: number | string;
		/** ISO 8601 UTC timestamp (e.g. `2026-01-31T14:30:00Z`). Returns entities created or updated after this timestamp and is intended for incremental synchronization. Combine with delete webhooks for full synchronization. */
		updated_after?: string;
		include_archived?: boolean;
		type?: 'customer' | 'supplier' | 'organization';
		/** Comma-separated list of tag names. */
		tags?: string;
		identifier?: string;
		term?: string;
		/** Filter by custom field values. Unknown custom field names return an empty result set. For MultiSelect fields, pass multiple values using `custom_properties[Field][]=A&custom_properties[Field][]=B`. Boolean fields should be queried with `true` or `false`. */
		custom_properties?: Record<string, string | boolean | Array<string>>;
	};
	'companies.unarchive': {
		/** Resource ID. */
		id: number;
	};
	'companies.update': {
		/** Resource ID. */
		id: number;
		type?: 'customer' | 'supplier' | 'organization';
		identifier?: string;
		name?: string;
		email?: string;
		address?: string;
		currency?: string;
		/** Deprecated VAT shortcut for customer records. */
		customer_tax?: number;
		/** Deprecated VAT shortcut for supplier records. */
		supplier_tax?: number;
		customer_vat_code_id?: number;
		supplier_vat_code_id?: number;
		info?: string;
		default_invoice_due_days?: number;
		invoice_due_days?: number;
		website?: string;
		phone?: string;
		fax?: string;
		user_id?: number;
		country_code?: string;
		footer?: string;
		iban?: string;
		vat_identifier?: string;
		billing_email_cc?: string;
		debit_number?: number;
		credit_number?: number;
		alternative_correspondence_language?: boolean;
		billing_notes?: string;
		bank_bic?: string;
		bank_owner?: string;
		invoice_format?: 'regular_pdf' | 'x_invoice' | 'zugferd_x_invoice';
		default_payment_means?: 'not_defined' | 'credit_transfer';
		tags?: Array<string>;
		labels?: Array<string>;
		custom_properties?: Record<string, MocoJsonValue>;
	};
	'contacts.create': {
		/** Unknown values are stored as `U`. */
		gender?: 'U' | 'M' | 'F';
		firstname?: string;
		lastname?: string;
		name?: string;
		title?: string;
		job_position?: string;
		mobile_phone?: string;
		work_email?: string;
		work_phone?: string;
		work_fax?: string;
		work_address?: string;
		home_email?: string;
		home_address?: string;
		bday?: string;
		birthday?: string;
		salutation?: string;
		info?: string;
		company_id?: number;
		customer_id?: number;
		organization_id?: number;
		user_id?: number;
		tags?: Array<string>;
		custom_properties?: Record<string, MocoJsonValue>;
		avatar?: {
			filename?: string;
			/** Image must be under 1 MB. */
			base64?: string;
		};
	};
	'contacts.delete': {
		/** Resource ID. */
		id: number;
	};
	'contacts.get': {
		/** Resource ID. */
		id: number;
	};
	'contacts.list': {
		/** Page number, starting at 1. */
		page?: number;
		/** Page size. */
		per_page?: number;
		/** Comma-separated IDs. */
		ids?: number | string;
		/** ISO 8601 UTC timestamp (e.g. `2026-01-31T14:30:00Z`). Returns entities created or updated after this timestamp and is intended for incremental synchronization. Combine with delete webhooks for full synchronization. */
		updated_after?: string;
		/** Comma-separated list of tag names. */
		tags?: string;
		/** Full text search on name, email and company. */
		term?: string;
		/** Reverse lookup on work/mobile phone. */
		phone?: string;
		/** Filter by custom field values. Unknown custom field names return an empty result set. For MultiSelect fields, pass multiple values using `custom_properties[Field][]=A&custom_properties[Field][]=B`. Boolean fields should be queried with `true` or `false`. */
		custom_properties?: Record<string, string | boolean | Array<string>>;
	};
	'contacts.update': {
		/** Resource ID. */
		id: number;
		/** Unknown values are stored as `U`. */
		gender?: 'U' | 'M' | 'F';
		firstname?: string;
		lastname?: string;
		name?: string;
		title?: string;
		job_position?: string;
		mobile_phone?: string;
		work_email?: string;
		work_phone?: string;
		work_fax?: string;
		work_address?: string;
		home_email?: string;
		home_address?: string;
		bday?: string;
		birthday?: string;
		salutation?: string;
		info?: string;
		company_id?: number;
		customer_id?: number;
		organization_id?: number;
		user_id?: number;
		tags?: Array<string>;
		custom_properties?: Record<string, MocoJsonValue>;
		avatar?: {
			filename?: string;
			/** Image must be under 1 MB. */
			base64?: string;
		};
	};
	'dealCategories.create': {
		name?: string;
		/** Probability in percent (0-100). */
		probability?: number;
	};
	'dealCategories.delete': {
		/** Resource ID. */
		id: number;
	};
	'dealCategories.get': {
		/** Resource ID. */
		id: number;
	};
	'dealCategories.list': {
		/** Page number, starting at 1. */
		page?: number;
		/** Page size. */
		per_page?: number;
		/** Comma-separated IDs. */
		ids?: number | string;
		/** ISO 8601 UTC timestamp (e.g. `2026-01-31T14:30:00Z`). Returns entities created or updated after this timestamp and is intended for incremental synchronization. Combine with delete webhooks for full synchronization. */
		updated_after?: string;
	};
	'dealCategories.update': {
		/** Resource ID. */
		id: number;
		name?: string;
		/** Probability in percent (0-100). */
		probability?: number;
	};
	'deals.create': {
		/** Deal category ID. Required only when `status` is `pending`. */
		deal_category_id?: number;
		/** Deal value in selected currency. */
		money?: number;
		name?: string;
		/** Company/customer ID. */
		company_id?: number;
		/** Deprecated alias for `company_id`. */
		customer_id?: number;
		/** Linked contact person ID. */
		person_id?: number;
		/** Responsible user ID. */
		user_id?: number;
		status?: 'potential' | 'pending' | 'won' | 'lost' | 'dropped';
		info?: string;
		reminder_date?: string;
		closed_on?: string;
		currency?: string;
		service_period_from?: string;
		service_period_to?: string;
		tags?: Array<string>;
		custom_properties?: Record<string, MocoJsonValue>;
	};
	'deals.delete': {
		/** Resource ID. */
		id: number;
	};
	'deals.get': {
		/** Resource ID. */
		id: number;
	};
	'deals.list': {
		/** Page number, starting at 1. */
		page?: number;
		/** Page size. */
		per_page?: number;
		/** Comma-separated IDs. */
		ids?: number | string;
		/** ISO 8601 UTC timestamp (e.g. `2026-01-31T14:30:00Z`). Returns entities created or updated after this timestamp and is intended for incremental synchronization. Combine with delete webhooks for full synchronization. */
		updated_after?: string;
		/** Filter by custom field values. Unknown custom field names return an empty result set. For MultiSelect fields, pass multiple values using `custom_properties[Field][]=A&custom_properties[Field][]=B`. Boolean fields should be queried with `true` or `false`. */
		custom_properties?: Record<string, string | boolean | Array<string>>;
		status?: 'potential' | 'pending' | 'won' | 'lost' | 'dropped';
		/** Comma-separated list of deal tag names. */
		tags?: string;
		/** Closed date range start. Format: YYYY-MM-DD (e.g. `2026-01-01`). */
		closed_from?: string;
		/** Closed date range end. Format: YYYY-MM-DD (e.g. `2026-01-31`). */
		closed_to?: string;
		company_id?: number;
		person_id?: number;
	};
	'deals.update': {
		/** Resource ID. */
		id: number;
		/** Deal category ID. Required only when `status` is `pending`. */
		deal_category_id?: number;
		/** Deal value in selected currency. */
		money?: number;
		name?: string;
		/** Company/customer ID. */
		company_id?: number;
		/** Deprecated alias for `company_id`. */
		customer_id?: number;
		/** Linked contact person ID. */
		person_id?: number;
		/** Responsible user ID. */
		user_id?: number;
		status?: 'potential' | 'pending' | 'won' | 'lost' | 'dropped';
		info?: string;
		reminder_date?: string;
		closed_on?: string;
		currency?: string;
		service_period_from?: string;
		service_period_to?: string;
		tags?: Array<string>;
		custom_properties?: Record<string, MocoJsonValue>;
	};
	'invoiceReminders.create': {
		invoice_id?: number;
		title?: string;
		text?: string;
		fee?: number;
		date?: string;
		due_date?: string;
	};
	'invoiceReminders.delete': {
		/** Resource ID. */
		id: number;
	};
	'invoiceReminders.get': {
		/** Resource ID. */
		id: number;
	};
	'invoiceReminders.list': {
		/** Page number, starting at 1. */
		page?: number;
		/** Page size. */
		per_page?: number;
		/** Comma-separated IDs. */
		ids?: number | string;
		/** ISO 8601 UTC timestamp (e.g. `2026-01-31T14:30:00Z`). Returns entities created or updated after this timestamp and is intended for incremental synchronization. Combine with delete webhooks for full synchronization. */
		updated_after?: string;
		invoice_id?: number;
		/** Reminder date range start. Format: YYYY-MM-DD (e.g. `2026-01-01`). */
		date_from?: string;
		/** Reminder date range end. Format: YYYY-MM-DD (e.g. `2026-01-31`). */
		date_to?: string;
	};
	'invoiceReminders.sendEmail': {
		/** Resource ID. */
		id: number;
		/** Semicolon-separated email list. */
		emails_to?: string;
		/** Semicolon-separated email list. */
		emails_cc?: string;
		/** Semicolon-separated email list. */
		emails_bcc?: string;
		subject: string;
		text: string;
	};
	'invoices.attachments.create': {
		invoice_id: number;
		attachment: {
			/** File name including extension. */
			filename: string;
			/** Base64-encoded file content. */
			base64: string;
		};
	};
	'invoices.attachments.delete': {
		invoice_id: number;
		/** Resource ID. */
		id: number;
	};
	'invoices.attachments.list': {
		invoice_id: number;
	};
	'invoices.bookkeepingExports.create': {
		comment?: string;
		/** Whether to trigger direct online submission. */
		trigger_submission?: boolean;
		invoice_ids?: Array<number>;
	};
	'invoices.bookkeepingExports.get': {
		/** Resource ID. */
		id: number;
	};
	'invoices.bookkeepingExports.list': {
		/** Page number, starting at 1. */
		page?: number;
		/** Page size. */
		per_page?: number;
		/** ISO 8601 UTC timestamp (e.g. `2026-01-31T14:30:00Z`). Returns entities created or updated after this timestamp and is intended for incremental synchronization. Combine with delete webhooks for full synchronization. */
		updated_after?: string;
	};
	'invoices.create': {
		/** Initial invoice status. When omitted, the backend applies its default behavior. Set to `draft` to create a draft invoice that is not yet issued and can be edited further. */
		status?: 'created' | 'draft';
		/** Customer company ID. */
		customer_id: number;
		/** Optional source offer ID. */
		offer_id?: number;
		/** Optional project ID. */
		project_id?: number;
		/** Invoice category. When omitted, defaults to `default`. - `default`: Regular invoice. - `partial`: Partial invoice (Abschlagsrechnung). Cannot be combined with a discount. - `final`: Final invoice (Schlussrechnung). */
		category?: 'default' | 'partial' | 'final';
		/** Currency code. */
		currency: string;
		/** Optional custom invoice number. Only applied when the invoice number range is set to manual numbering; then it is required and must be unique within the account. Ignored with automatic numbering and for drafts. */
		identifier?: string;
		/** Invoice title. */
		title: string;
		/** Invoice date. */
		date: string;
		/** Due date. */
		due_date: string;
		/** Service period start. Use together with `service_period_to`. */
		service_period_from?: string;
		/** Service period end. Use together with `service_period_from`. */
		service_period_to?: string;
		/** Salutation text. Supports template variables such as `{salutation}`, `{recipient}`, `{company_name}`, `{date}`, `{due_date}`, and more. */
		salutation?: string;
		/** Footer text. Supports template variables such as `{identifier}`, `{gross_total}`, `{net_total}`, `{user}`, `{me}`, and more. */
		footer?: string;
		/** Recipient address. */
		recipient_address: string;
		/** Replace recipient address from selected source. */
		change_address?: 'invoice' | 'project' | 'customer';
		/** Discount value. */
		discount?: number;
		/** Deprecated. VAT/tax percentage. Use `vat_code_id` instead. When `vat_code_id` is provided, this field is ignored. */
		tax?: number;
		/** VAT code ID for this invoice. Takes precedence over the deprecated `tax` field. Available VAT codes can be fetched via `GET /api/v1/vat_code_sales`. */
		vat_code_id?: number;
		/** External contact person ID. */
		contact_id?: number;
		/** Internal contact user ID. */
		internal_contact_id?: number;
		/** Cash discount percentage. */
		cash_discount?: number;
		/** Cash discount validity in days. */
		cash_discount_days?: number;
		/** Include detailed columns in print layouts. */
		print_detail_columns?: boolean;
		/** Payment means for this invoice. When omitted, derived from the customer's e-invoice configuration (`credit_transfer` for e-invoice customers whose payment means default is bank transfer, otherwise `not_defined`). Must be `credit_transfer` when `payment_account_id` is provided;… */
		payment_means?: 'not_defined' | 'credit_transfer';
		/** Payment account receiving the payment. When omitted, derived from the customer's default payment account or the account's default incoming payment account (for e-invoice customers with `credit_transfer`). Only allowed together with `payment_means=credit_transfer`. */
		payment_account_id?: number | null;
		/** Invoice tags. */
		tags?: Array<string>;
		/** Custom field values keyed by custom field name. */
		custom_properties?: Record<string, MocoJsonValue>;
		/** Letter paper ID to use for this invoice. When omitted, the account's default invoice letter paper is used. If `without_letter_paper` is set to `true`, this field is ignored. Available letter papers can be fetched via `GET /api/v1/letter_papers`. */
		letter_paper_id?: number | null;
		/** When set to `true`, creates the invoice without letter paper (white). This takes precedence over `letter_paper_id`. */
		without_letter_paper?: boolean;
		/** Invoice line items. */
		items: Array<MocoInvoiceLineItemInputInput>;
	};
	'invoices.delete': {
		/** Resource ID. */
		id: number;
		/** Human-readable deletion reason for audit/history. */
		reason?: string;
	};
	'invoices.get': {
		/** Resource ID. */
		id: number;
	};
	'invoices.getPdf': {
		/** Resource ID. */
		id: number;
		/** Return PDF without letter paper. */
		blank?: boolean;
		/** Letter paper ID. Defaults to account default when omitted. */
		letter_paper_id?: number;
	};
	'invoices.getTimesheet': {
		/** Resource ID. */
		id: number;
	};
	'invoices.getTimesheetPdf': {
		/** Resource ID. */
		id: number;
		letter_paper_id?: number;
	};
	'invoices.list': {
		/** Page number, starting at 1. */
		page?: number;
		/** Page size. */
		per_page?: number;
		/** Field and optional direction, e.g. `title desc`. */
		sort_by?: string;
		/** Comma-separated IDs. */
		ids?: number | string;
		/** ISO 8601 UTC timestamp (e.g. `2026-01-31T14:30:00Z`). Returns entities created or updated after this timestamp and is intended for incremental synchronization. Combine with delete webhooks for full synchronization. */
		updated_after?: string;
		/** Comma-separated API statuses: `draft`, `created`, `sent`, `partially_paid`, `paid`, `overdue`, `ignored`, `disregarded`. `disregarded` invoices are only returned with `include_disregarded=true`. */
		status?: string;
		include_disregarded?: boolean;
		not_booked?: boolean;
		/** Invoice date range start. Format: YYYY-MM-DD (e.g. `2026-01-01`). */
		date_from?: string;
		/** Invoice date range end. Format: YYYY-MM-DD (e.g. `2026-01-31`). */
		date_to?: string;
		/** Service period start. Format: YYYY-MM-DD (e.g. `2026-01-01`). */
		service_period_from?: string;
		/** Service period end. Format: YYYY-MM-DD (e.g. `2026-01-31`). */
		service_period_to?: string;
		/** Comma-separated list of tag names. */
		tags?: string;
		identifier?: string;
		term?: string;
		/** Single ID or comma-separated list. */
		company_id?: number | string;
		/** Single ID or comma-separated list. */
		project_id?: number | string;
		/** Filter by custom field values. Unknown custom field names return an empty result set. For MultiSelect fields, pass multiple values using `custom_properties[Field][]=A&custom_properties[Field][]=B`. Boolean fields should be queried with `true` or `false`. */
		custom_properties?: Record<string, string | boolean | Array<string>>;
	};
	'invoices.listExpenses': {
		/** Resource ID. */
		id: number;
	};
	'invoices.listLocked': {
		/** Page number, starting at 1. */
		page?: number;
		/** Page size. */
		per_page?: number;
		/** Comma-separated API statuses: `draft`, `created`, `sent`, `partially_paid`, `paid`, `overdue`, `ignored`, `disregarded`. `disregarded` invoices are only returned with `include_disregarded=true`. */
		status?: string;
		include_disregarded?: boolean;
		/** Invoice date range start. Format: YYYY-MM-DD (e.g. `2026-01-01`). */
		date_from?: string;
		/** Invoice date range end. Format: YYYY-MM-DD (e.g. `2026-01-31`). */
		date_to?: string;
		identifier?: string;
	};
	'invoices.payments.bulkCreate': {
		bulk_data: Array<{
			date?: string;
			paid_total?: number;
			currency?: string;
			invoice_id?: number;
			payment_account_id?: number;
		}>;
	};
	'invoices.payments.create': {
		date: string;
		paid_total: number;
		currency?: string;
		invoice_id: number;
		payment_account_id?: number;
		partially_paid?: boolean;
		description?: string;
	};
	'invoices.payments.delete': {
		/** Resource ID. */
		id: number;
	};
	'invoices.payments.get': {
		/** Resource ID. */
		id: number;
	};
	'invoices.payments.list': {
		/** Page number, starting at 1. */
		page?: number;
		/** Page size. */
		per_page?: number;
		/** Comma-separated IDs. */
		ids?: number | string;
		/** ISO 8601 UTC timestamp (e.g. `2026-01-31T14:30:00Z`). Returns entities created or updated after this timestamp and is intended for incremental synchronization. Combine with delete webhooks for full synchronization. */
		updated_after?: string;
		/** Single ID or comma-separated list. */
		invoice_id?: number | string;
		/** Payment date range start. Format: YYYY-MM-DD (e.g. `2026-01-01`). */
		date_from?: string;
		/** Payment date range end. Format: YYYY-MM-DD (e.g. `2026-01-31`). */
		date_to?: string;
	};
	'invoices.payments.update': {
		/** Resource ID. */
		id: number;
		date: string;
		paid_total: number;
		currency?: string;
		invoice_id: number;
		payment_account_id?: number;
		partially_paid?: boolean;
		description?: string;
	};
	'invoices.sendEmail': {
		/** Resource ID. */
		id: number;
		/** To recipients as semicolon-separated list. */
		emails_to?: string;
		/** CC recipients as semicolon-separated list. */
		emails_cc?: string;
		/** BCC recipients as semicolon-separated list. */
		emails_bcc?: string;
		/** Email subject. */
		subject: string;
		/** Email body text. */
		text: string;
		/** Optional letter paper ID used for generated PDF. */
		letter_paper_id?: number;
	};
	'invoices.updateStatus': {
		/** Resource ID. */
		id: number;
		/** Target API status. */
		status: 'created' | 'sent' | 'overdue' | 'ignored';
	};
	'letterPapers.list': Record<string, never>;
	'offerConfirmations.create': {
		/** Execute request on behalf of another user if the authenticated user has permission to *Staff*. Some resources, such as Activities and User Presences, can be created for other users only if this header is used. */
		impersonate_user_id?: number;
		/** ID of the offer this confirmation belongs to. */
		offer_id: number;
		/** Confirmation title. Defaults to "Auftragsbestätigung – {offer title}" if omitted. */
		title?: string;
		/** Confirmation date. Defaults to current date if omitted. */
		date?: string;
		/** Salutation text (raw HTML). Defaults to account default if omitted. */
		salutation_raw?: string | null;
		/** Footer text (raw HTML). Defaults to account default if omitted. */
		footer_raw?: string | null;
	};
	'offerConfirmations.delete': {
		/** Resource ID. */
		id: number;
		/** Execute request on behalf of another user if the authenticated user has permission to *Staff*. Some resources, such as Activities and User Presences, can be created for other users only if this header is used. */
		impersonate_user_id?: number;
	};
	'offerConfirmations.get': {
		/** Resource ID. */
		id: number;
	};
	'offerConfirmations.getPdf': {
		/** Resource ID. */
		id: number;
		/** Letter paper ID. Defaults to account default when omitted. */
		letter_paper_id?: number;
	};
	'offerConfirmations.list': {
		/** Page number, starting at 1. */
		page?: number;
		/** Page size. */
		per_page?: number;
		/** Comma-separated IDs. */
		ids?: number | string;
		/** ISO 8601 UTC timestamp (e.g. `2026-01-31T14:30:00Z`). Returns entities created or updated after this timestamp and is intended for incremental synchronization. Combine with delete webhooks for full synchronization. */
		updated_after?: string;
		/** Single ID or comma-separated list of offer IDs. */
		offer_id?: number | string;
	};
	'offerConfirmations.update': {
		/** Resource ID. */
		id: number;
		/** Execute request on behalf of another user if the authenticated user has permission to *Staff*. Some resources, such as Activities and User Presences, can be created for other users only if this header is used. */
		impersonate_user_id?: number;
		/** Confirmation title. */
		title?: string;
		/** Confirmation date. Keeps the existing date if omitted. */
		date?: string;
		/** Salutation text (raw HTML). */
		salutation_raw?: string | null;
		/** Footer text (raw HTML). */
		footer_raw?: string | null;
	};
	'offers.assign': {
		/** Resource ID. */
		id: number;
		company_id?: number;
		deal_id?: number;
		project_id?: number;
	};
	'offers.attachments.create': {
		offer_id: number;
		attachment: {
			/** File name including extension. */
			filename: string;
			/** Base64-encoded file content. */
			base64: string;
		};
	};
	'offers.attachments.delete': {
		offer_id: number;
		/** Resource ID. */
		id: number;
	};
	'offers.attachments.list': {
		offer_id: number;
	};
	'offers.create': {
		company_id?: number;
		deal_id?: number;
		project_id?: number;
		identifier?: string;
		title?: string;
		date?: string;
		due_date?: string;
		salutation?: string;
		footer?: string;
		recipient_address?: string;
		change_address?: 'offer' | 'customer';
		discount?: number;
		/** Deprecated: use `vat_code_id` instead. Must match an active sale VAT code tax in the account. */
		tax?: number;
		/** ID of an active sale VAT code in the account. */
		vat_code_id: number;
		contact_id?: number;
		internal_contact_id?: number;
		table_header_visible?: boolean;
		print_detail_columns?: boolean;
		totals_section_visible?: boolean;
		currency?: string;
		tags?: Array<string>;
		custom_properties?: Record<string, MocoJsonValue>;
		items: Array<MocoInvoiceLineItemInputInput>;
	};
	'offers.customerApproval.activate': {
		offer_id: number;
	};
	'offers.customerApproval.deactivate': {
		offer_id: number;
	};
	'offers.customerApproval.get': {
		offer_id: number;
	};
	'offers.delete': {
		/** Resource ID. */
		id: number;
	};
	'offers.get': {
		/** Resource ID. */
		id: number;
	};
	'offers.getPdf': {
		/** Resource ID. */
		id: number;
		/** Letter paper ID. Defaults to account default when omitted. */
		letter_paper_id?: number;
	};
	'offers.list': {
		/** Page number, starting at 1. */
		page?: number;
		/** Page size. */
		per_page?: number;
		/** Comma-separated IDs. */
		ids?: number | string;
		/** ISO 8601 UTC timestamp (e.g. `2026-01-31T14:30:00Z`). Returns entities created or updated after this timestamp and is intended for incremental synchronization. Combine with delete webhooks for full synchronization. */
		updated_after?: string;
		/** Field and optional direction, e.g. `title desc`. */
		sort_by?: string;
		status?:
			| 'created'
			| 'sent'
			| 'accepted'
			| 'partially_billed'
			| 'billed'
			| 'archived';
		/** Offer date range start. Format: YYYY-MM-DD (e.g. `2026-01-01`). */
		from?: string;
		/** Offer date range end. Format: YYYY-MM-DD (e.g. `2026-01-31`). */
		to?: string;
		identifier?: string;
		/** Single ID or comma-separated list. */
		deal_id?: number | string;
		/** Single ID or comma-separated list. */
		project_id?: number | string;
		/** Single ID or comma-separated list. */
		company_id?: number | string;
		/** Comma-separated list of tag names. */
		tags?: string;
		/** Filter by custom field values. Unknown custom field names return an empty result set. For MultiSelect fields, pass multiple values using `custom_properties[Field][]=A&custom_properties[Field][]=B`. Boolean fields should be queried with `true` or `false`. */
		custom_properties?: Record<string, string | boolean | Array<string>>;
	};
	'offers.sendEmail': {
		/** Resource ID. */
		id: number;
		/** Semicolon-separated email list. */
		emails_to?: string;
		/** Semicolon-separated email list. */
		emails_cc?: string;
		/** Semicolon-separated email list. */
		emails_bcc?: string;
		subject: string;
		text: string;
		letter_paper_id?: number;
	};
	'offers.update': {
		/** Resource ID. */
		id: number;
		identifier?: string;
		title?: string;
		date?: string;
		due_date?: string;
		salutation?: string;
		footer?: string;
		recipient_address?: string;
		change_address?: 'offer' | 'customer';
		discount?: number;
		/** ID of an active sale VAT code in the account. */
		vat_code_id?: number;
		contact_id?: number;
		internal_contact_id?: number;
		table_header_visible?: boolean;
		print_detail_columns?: boolean;
		totals_section_visible?: boolean;
		tags?: Array<string>;
		custom_properties?: Record<string, MocoJsonValue>;
		items?: Array<MocoInvoiceLineItemInputInput>;
	};
	'offers.updateStatus': {
		/** Resource ID. */
		id: number;
		status:
			| 'created'
			| 'sent'
			| 'accepted'
			| 'partially_billed'
			| 'billed'
			| 'archived';
	};
	'plannedPurchases.create': {
		/** Execute request on behalf of another user if the authenticated user has permission to *Staff*. Some resources, such as Activities and User Presences, can be created for other users only if this header is used. */
		impersonate_user_id?: number;
		date: string;
		finish_date?: string;
		frequency:
			| 'once'
			| 'weekly'
			| 'biweekly'
			| 'monthly'
			| 'quarterly'
			| 'biannual'
			| 'annual';
		title: string;
		info?: string | null;
		net_total: number;
		currency: string;
		company_id?: number | null;
		purchase_budget_id?: number | null;
		user_id: number;
		custom_properties?: Record<string, MocoJsonValue> | null;
	};
	'plannedPurchases.delete': {
		/** Resource ID. */
		id: number;
		/** Execute request on behalf of another user if the authenticated user has permission to *Staff*. Some resources, such as Activities and User Presences, can be created for other users only if this header is used. */
		impersonate_user_id?: number;
	};
	'plannedPurchases.get': {
		/** Resource ID. */
		id: number;
	};
	'plannedPurchases.list': {
		/** Page number, starting at 1. */
		page?: number;
		/** Page size. */
		per_page?: number;
		/** Comma-separated IDs. */
		ids?: number | string;
		/** ISO 8601 UTC timestamp (e.g. `2026-01-31T14:30:00Z`). Returns entities created or updated after this timestamp and is intended for incremental synchronization. Combine with delete webhooks for full synchronization. */
		updated_after?: string;
	};
	'plannedPurchases.update': {
		/** Resource ID. */
		id: number;
		/** Execute request on behalf of another user if the authenticated user has permission to *Staff*. Some resources, such as Activities and User Presences, can be created for other users only if this header is used. */
		impersonate_user_id?: number;
		date?: string;
		finish_date?: string;
		frequency?:
			| 'once'
			| 'weekly'
			| 'biweekly'
			| 'monthly'
			| 'quarterly'
			| 'biannual'
			| 'annual';
		title?: string;
		info?: string | null;
		net_total?: number;
		currency?: string;
		company_id?: number | null;
		purchase_budget_id?: number | null;
		user_id?: number;
		custom_properties?: Record<string, MocoJsonValue> | null;
	};
	'planningEntries.create': {
		project_id?: number;
		deal_id?: number;
		task_id?: number;
		title?: string;
		starts_on?: string;
		ends_on?: string;
		hours_per_day?: number;
		comment?: string;
		symbol?: string;
		color?: string;
		tentative?: boolean;
		/** Optional and only accepted when caller can modify user assignment. */
		user_id?: number;
	};
	'planningEntries.delete': {
		/** Resource ID. */
		id: number;
	};
	'planningEntries.get': {
		/** Resource ID. */
		id: number;
	};
	'planningEntries.list': {
		/** Page number, starting at 1. */
		page?: number;
		/** Page size. */
		per_page?: number;
		/** Comma-separated IDs. */
		ids?: number | string;
		/** ISO 8601 UTC timestamp (e.g. `2026-01-31T14:30:00Z`). Returns entities created or updated after this timestamp and is intended for incremental synchronization. Combine with delete webhooks for full synchronization. */
		updated_after?: string;
		/** Date range in `YYYY-MM-DD:YYYY-MM-DD` format (e.g. `2020-04-01:2020-07-31`). */
		period?: string;
		/** Single ID or comma-separated list. */
		user_id?: number | string;
		/** Single ID or comma-separated list. */
		project_id?: number | string;
		/** Single ID or comma-separated list. */
		deal_id?: number | string;
	};
	'planningEntries.update': {
		/** Resource ID. */
		id: number;
		project_id?: number;
		deal_id?: number;
		task_id?: number;
		title?: string;
		starts_on?: string;
		ends_on?: string;
		hours_per_day?: number;
		comment?: string;
		symbol?: string;
		color?: string;
		tentative?: boolean;
		/** Optional and only accepted when caller can modify user assignment. */
		user_id?: number;
	};
	'profile.get': {
		/** Execute request on behalf of another user if the authenticated user has permission to *Staff*. Some resources, such as Activities and User Presences, can be created for other users only if this header is used. */
		impersonate_user_id?: number;
	};
	'profile.performanceReport': {
		/** Execute request on behalf of another user if the authenticated user has permission to *Staff*. Some resources, such as Activities and User Presences, can be created for other users only if this header is used. */
		impersonate_user_id?: number;
		/** Report year. Must be between 2000 and 2100. */
		year?: number;
	};
	'projects.archive': {
		/** Resource ID. */
		id: number;
	};
	'projects.assignProjectGroup': {
		/** Resource ID. */
		id: number;
		project_group_id: number;
	};
	'projects.contracts.create': {
		project_id: number;
		hourly_rate?: number;
		user_id?: number;
		active?: boolean;
		billable?: boolean;
		budget?: number;
	};
	'projects.contracts.delete': {
		project_id: number;
		/** Resource ID. */
		id: number;
	};
	'projects.contracts.get': {
		project_id: number;
		/** Resource ID. */
		id: number;
	};
	'projects.contracts.list': {
		/** Page number, starting at 1. */
		page?: number;
		/** Page size. */
		per_page?: number;
		/** ISO 8601 UTC timestamp (e.g. `2026-01-31T14:30:00Z`). Returns entities created or updated after this timestamp and is intended for incremental synchronization. Combine with delete webhooks for full synchronization. */
		updated_after?: string;
		project_id: number;
	};
	'projects.contracts.update': {
		project_id: number;
		/** Resource ID. */
		id: number;
		hourly_rate?: number;
		active?: boolean;
		billable?: boolean;
		budget?: number;
	};
	'projects.create': {
		/** Project number/identifier. Required when number ranges are manual. */
		identifier?: string;
		/** Project name. */
		name?: string;
		/** Whether the project is fixed price. */
		fixed_price?: boolean;
		/** Customer company ID. */
		company_id?: number;
		/** Deprecated alias of `company_id`. */
		customer_id?: number;
		/** Linked deal ID. */
		deal_id?: number;
		/** Linked project group ID. */
		project_group_id?: number;
		/** Main responsible user ID. */
		leader_id?: number;
		/** Secondary responsible user ID. */
		co_leader_id?: number;
		/** Main external contact ID. */
		contact_id?: number;
		/** Secondary external contact ID. */
		secondary_contact_id?: number;
		/** Billing contact ID. */
		billing_contact_id?: number;
		/** Internal project notes. */
		info?: string;
		/** Project start date. */
		start_date?: string;
		/** Project finish date. */
		finish_date?: string;
		/** Whether project is billed as retainer. */
		retainer?: boolean;
		/** Retainer billing day in month (1-31). */
		retainer_billing_date?: number;
		/** Default title for generated retainer items. */
		retainer_billing_title?: string;
		/** Default description for generated retainer items. */
		retainer_billing_description?: string;
		/** Pricing mode for hourly rates. Preferred values are `project`, `task`, `user`. `billing_variant_rate_per_project`, `billing_variant_rate_per_task`, `billing_variant_rate_per_user` are also accepted. */
		billing_variant?:
			| 'project'
			| 'task'
			| 'user'
			| 'billing_variant_rate_per_project'
			| 'billing_variant_rate_per_task'
			| 'billing_variant_rate_per_user';
		/** Effective hourly rate for project pricing. */
		hourly_rate?: number;
		/** Project budget in project currency. */
		budget?: number;
		/** Monthly budget for retainers. */
		budget_monthly?: number;
		/** Expense budget in project currency. */
		budget_expenses?: number;
		/** Project currency. Mandatory on create and immutable afterwards. */
		currency?: string;
		/** Billing address for generated documents. */
		billing_address?: string;
		/** Notes printed or used during billing. */
		billing_notes?: string;
		/** Include time report in billing output. */
		setting_include_time_report?: boolean;
		/** Default recipient email(s), semicolon-separated. */
		billing_email_to?: string;
		/** Default CC email(s), semicolon-separated. */
		billing_email_cc?: string;
		/** Do not add this project to favorites for the creator. */
		skip_favorite?: boolean;
		/** Project tags. */
		tags?: Array<string>;
		/** Deprecated alias for `tags`. */
		labels?: Array<string>;
		/** Custom field values keyed by custom field name. */
		custom_properties?: Record<string, MocoJsonValue>;
	};
	'projects.delete': {
		/** Resource ID. */
		id: number;
	};
	'projects.disableShare': {
		/** Resource ID. */
		id: number;
	};
	'projects.expenses.bulkCreate': {
		project_id: number;
		/** Expense entries created in one transaction. */
		bulk_data: Array<MocoExpenseBulkItemRequestInput>;
	};
	'projects.expenses.create': {
		/** Project ID. */
		project_id: number;
		/** Responsible user ID (must be active on create). */
		user_id?: number;
		/** Expense date. */
		date?: string;
		/** Expense title. */
		title?: string;
		/** Expense description text. */
		description?: string;
		/** Quantity. */
		quantity?: number;
		/** Unit label. */
		unit?: string;
		/** Unit selling price. */
		unit_price?: number;
		/** Deprecated total selling price alias. */
		price?: number;
		/** Unit internal cost. */
		unit_cost?: number;
		/** Whether this expense can be billed. */
		billable?: boolean;
		/** Whether this expense affects project budget. */
		budget_relevant?: boolean;
		/** Locks assignment to purchase items. */
		purchase_assignment_locked?: boolean;
		/** Start of service period. */
		service_period_from?: string;
		/** End of service period. */
		service_period_to?: string;
		/** Planned purchase date (when planned purchases are enabled). */
		planned_purchase_date?: string;
		/** Planned internal cost total. */
		cost_total_planned?: number;
		/** Revenue category ID for billing assignment. Rejected with 422 when the revenue category only applies to tasks, unless the stored value is unchanged. */
		revenue_category_id?: number;
		/** Custom field values keyed by custom field name. */
		custom_properties?: Record<string, MocoJsonValue>;
		/** Optional attachment payload. */
		file?: {
			/** Original file name including extension. */
			filename?: string;
			/** Base64 encoded file content. */
			base64?: string;
		};
	};
	'projects.expenses.delete': {
		project_id: number;
		/** Resource ID. */
		id: number;
	};
	'projects.expenses.disregard': {
		project_id: number;
		/** Reason shown in history/audit context. */
		reason: string;
		/** IDs of expenses to disregard. */
		expense_ids: Array<number>;
	};
	'projects.expenses.get': {
		project_id: number;
		/** Resource ID. */
		id: number;
	};
	'projects.expenses.list': {
		/** Page number, starting at 1. */
		page?: number;
		/** Page size. */
		per_page?: number;
		/** ISO 8601 UTC timestamp (e.g. `2026-01-31T14:30:00Z`). Returns entities created or updated after this timestamp and is intended for incremental synchronization. Combine with delete webhooks for full synchronization. */
		updated_after?: string;
		/** Filter by custom field values. Unknown custom field names return an empty result set. For MultiSelect fields, pass multiple values using `custom_properties[Field][]=A&custom_properties[Field][]=B`. Boolean fields should be queried with `true` or `false`. */
		custom_properties?: Record<string, string | boolean | Array<string>>;
		billable?: boolean;
		billed?: boolean;
		budget_relevant?: boolean;
		user_id?: number;
		/** Project ID. */
		project_id: number;
	};
	'projects.expenses.listAll': {
		/** Page number, starting at 1. */
		page?: number;
		/** Page size. */
		per_page?: number;
		/** Comma-separated IDs. */
		ids?: number | string;
		/** ISO 8601 UTC timestamp (e.g. `2026-01-31T14:30:00Z`). Returns entities created or updated after this timestamp and is intended for incremental synchronization. Combine with delete webhooks for full synchronization. */
		updated_after?: string;
		/** Filter by custom field values. Unknown custom field names return an empty result set. For MultiSelect fields, pass multiple values using `custom_properties[Field][]=A&custom_properties[Field][]=B`. Boolean fields should be queried with `true` or `false`. */
		custom_properties?: Record<string, string | boolean | Array<string>>;
		/** Expense date range start. Format: YYYY-MM-DD (e.g. `2026-01-01`). */
		from?: string;
		/** Expense date range end. Format: YYYY-MM-DD (e.g. `2026-01-31`). */
		to?: string;
		billable?: boolean;
		billed?: boolean;
		budget_relevant?: boolean;
		/** Comma-separated project tag names. */
		tags?: string;
		user_id?: number;
	};
	'projects.expenses.update': {
		project_id: number;
		/** Resource ID. */
		id: number;
		/** Responsible user ID (must be active on create). */
		user_id?: number;
		/** Expense date. */
		date?: string;
		/** Expense title. */
		title?: string;
		/** Expense description text. */
		description?: string;
		/** Quantity. */
		quantity?: number;
		/** Unit label. */
		unit?: string;
		/** Unit selling price. */
		unit_price?: number;
		/** Deprecated total selling price alias. */
		price?: number;
		/** Unit internal cost. */
		unit_cost?: number;
		/** Whether this expense can be billed. */
		billable?: boolean;
		/** Whether this expense affects project budget. */
		budget_relevant?: boolean;
		/** Locks assignment to purchase items. */
		purchase_assignment_locked?: boolean;
		/** Start of service period. */
		service_period_from?: string;
		/** End of service period. */
		service_period_to?: string;
		/** Planned purchase date (when planned purchases are enabled). */
		planned_purchase_date?: string;
		/** Planned internal cost total. */
		cost_total_planned?: number;
		/** Revenue category ID for billing assignment. Rejected with 422 when the revenue category only applies to tasks, unless the stored value is unchanged. */
		revenue_category_id?: number;
		/** Custom field values keyed by custom field name. */
		custom_properties?: Record<string, MocoJsonValue>;
		/** Optional attachment payload. */
		file?: {
			/** Original file name including extension. */
			filename?: string;
			/** Base64 encoded file content. */
			base64?: string;
		};
	};
	'projects.get': {
		include_company?: boolean;
		/** Resource ID. */
		id: number;
	};
	'projects.groups.get': {
		/** Resource ID. */
		id: number;
	};
	'projects.groups.list': {
		/** Page number, starting at 1. */
		page?: number;
		/** Page size. */
		per_page?: number;
		/** Comma-separated IDs. */
		ids?: number | string;
		/** ISO 8601 UTC timestamp (e.g. `2026-01-31T14:30:00Z`). Returns entities created or updated after this timestamp and is intended for incremental synchronization. Combine with delete webhooks for full synchronization. */
		updated_after?: string;
		/** Filter by custom field values. Unknown custom field names return an empty result set. For MultiSelect fields, pass multiple values using `custom_properties[Field][]=A&custom_properties[Field][]=B`. Boolean fields should be queried with `true` or `false`. */
		custom_properties?: Record<string, string | boolean | Array<string>>;
		user_id?: number;
		company_id?: number;
	};
	'projects.list': {
		/** Page number, starting at 1. */
		page?: number;
		/** Page size. */
		per_page?: number;
		/** Field and optional direction, e.g. `title desc`. */
		sort_by?: string;
		/** Comma-separated IDs. */
		ids?: number | string;
		/** ISO 8601 UTC timestamp (e.g. `2026-01-31T14:30:00Z`). Returns entities created or updated after this timestamp and is intended for incremental synchronization. Combine with delete webhooks for full synchronization. */
		updated_after?: string;
		include_archived?: boolean;
		/** Return full customer company payload instead of `{id,name}`. */
		include_company?: boolean;
		/** Single ID or comma-separated list. */
		leader_id?: number | string;
		/** Single ID or comma-separated list. */
		company_id?: number | string;
		/** Creation date range start. Format: YYYY-MM-DD (e.g. `2026-01-01`). */
		created_from?: string;
		/** Creation date range end. Format: YYYY-MM-DD (e.g. `2026-01-31`). */
		created_to?: string;
		/** Update date range start. Format: YYYY-MM-DD (e.g. `2026-01-01`). */
		updated_from?: string;
		/** Update date range end. Format: YYYY-MM-DD (e.g. `2026-01-31`). */
		updated_to?: string;
		/** Comma-separated list of tag names. */
		tags?: string;
		/** Single identifier or comma-separated list. */
		identifier?: string;
		retainer?: boolean;
		/** Single ID or comma-separated list. */
		project_group_id?: number | string;
		/** Single ID or comma-separated list. */
		deal_id?: number | string;
		/** Searches project name, project identifier and customer company name. */
		term?: string;
		/** Filter by custom field values. Unknown custom field names return an empty result set. For MultiSelect fields, pass multiple values using `custom_properties[Field][]=A&custom_properties[Field][]=B`. Boolean fields should be queried with `true` or `false`. */
		custom_properties?: Record<string, string | boolean | Array<string>>;
	};
	'projects.listAssigned': {
		active?: boolean;
	};
	'projects.paymentSchedules.create': {
		project_id: number;
		date?: string;
		net_total?: number;
		title?: string;
		checked?: boolean;
		description?: string;
	};
	'projects.paymentSchedules.delete': {
		project_id: number;
		/** Resource ID. */
		id: number;
	};
	'projects.paymentSchedules.get': {
		project_id: number;
		/** Resource ID. */
		id: number;
	};
	'projects.paymentSchedules.list': {
		/** Page number, starting at 1. */
		page?: number;
		/** Page size. */
		per_page?: number;
		/** Comma-separated IDs. */
		ids?: number | string;
		/** ISO 8601 UTC timestamp (e.g. `2026-01-31T14:30:00Z`). Returns entities created or updated after this timestamp and is intended for incremental synchronization. Combine with delete webhooks for full synchronization. */
		updated_after?: string;
		/** Payment schedule date range start. Format: YYYY-MM-DD (e.g. `2026-01-01`). */
		from?: string;
		/** Payment schedule date range end. Format: YYYY-MM-DD (e.g. `2026-01-31`). */
		to?: string;
		checked?: boolean;
		company_id?: number;
		project_id: number;
	};
	'projects.paymentSchedules.listAll': {
		/** Page number, starting at 1. */
		page?: number;
		/** Page size. */
		per_page?: number;
		/** Comma-separated IDs. */
		ids?: number | string;
		/** ISO 8601 UTC timestamp (e.g. `2026-01-31T14:30:00Z`). Returns entities created or updated after this timestamp and is intended for incremental synchronization. Combine with delete webhooks for full synchronization. */
		updated_after?: string;
		/** Payment schedule date range start. Format: YYYY-MM-DD (e.g. `2026-01-01`). */
		from?: string;
		/** Payment schedule date range end. Format: YYYY-MM-DD (e.g. `2026-01-31`). */
		to?: string;
		checked?: boolean;
		company_id?: number;
		project_id?: number;
	};
	'projects.paymentSchedules.update': {
		project_id: number;
		/** Resource ID. */
		id: number;
		date?: string;
		net_total?: number;
		title?: string;
		checked?: boolean;
		description?: string;
	};
	'projects.recurringExpenses.create': {
		project_id: number;
		start_date?: string;
		finish_date?: string;
		period?:
			| 'weekly'
			| 'biweekly'
			| 'monthly'
			| 'quarterly'
			| 'biannual'
			| 'annual'
			| 'annual2'
			| 'annual3';
		title?: string;
		description?: string;
		quantity?: number;
		unit?: string;
		unit_price?: number;
		unit_cost?: number;
		billable?: boolean;
		budget_relevant?: boolean;
		service_period_direction?: 'none' | 'forward' | 'backward';
		/** Deprecated alias for `service_period_direction` (true=forward, false=backward). */
		billing_in_advance?: boolean;
		purchase_assignment_locked?: boolean;
		user_id?: number;
		/** Rejected with 422 when the revenue category only applies to tasks, unless the stored value is unchanged. */
		revenue_category_id?: number;
		custom_properties?: Record<string, MocoJsonValue>;
	};
	'projects.recurringExpenses.delete': {
		project_id: number;
		/** Resource ID. */
		id: number;
	};
	'projects.recurringExpenses.get': {
		project_id: number;
		/** Resource ID. */
		id: number;
	};
	'projects.recurringExpenses.list': {
		/** Page number, starting at 1. */
		page?: number;
		/** Page size. */
		per_page?: number;
		/** Comma-separated IDs. */
		ids?: number | string;
		/** Field and optional direction, e.g. `title desc`. */
		sort_by?: string;
		/** ISO 8601 UTC timestamp (e.g. `2026-01-31T14:30:00Z`). Returns entities created or updated after this timestamp and is intended for incremental synchronization. Combine with delete webhooks for full synchronization. */
		updated_after?: string;
		/** Filter by custom field values. Unknown custom field names return an empty result set. For MultiSelect fields, pass multiple values using `custom_properties[Field][]=A&custom_properties[Field][]=B`. Boolean fields should be queried with `true` or `false`. */
		custom_properties?: Record<string, string | boolean | Array<string>>;
		project_id: number;
	};
	'projects.recurringExpenses.recur': {
		project_id: number;
		/** Resource ID. */
		id: number;
	};
	'projects.recurringExpenses.update': {
		project_id: number;
		/** Resource ID. */
		id: number;
		start_date?: string;
		finish_date?: string;
		period?:
			| 'weekly'
			| 'biweekly'
			| 'monthly'
			| 'quarterly'
			| 'biannual'
			| 'annual'
			| 'annual2'
			| 'annual3';
		title?: string;
		description?: string;
		quantity?: number;
		unit?: string;
		unit_price?: number;
		unit_cost?: number;
		billable?: boolean;
		budget_relevant?: boolean;
		service_period_direction?: 'none' | 'forward' | 'backward';
		/** Deprecated alias for `service_period_direction` (true=forward, false=backward). */
		billing_in_advance?: boolean;
		purchase_assignment_locked?: boolean;
		user_id?: number;
		/** Rejected with 422 when the revenue category only applies to tasks, unless the stored value is unchanged. */
		revenue_category_id?: number;
		custom_properties?: Record<string, MocoJsonValue>;
	};
	'projects.report': {
		/** Resource ID. */
		id: number;
	};
	'projects.share': {
		/** Resource ID. */
		id: number;
	};
	'projects.tasks.create': {
		project_id: number;
		name?: string;
		description?: string;
		hourly_rate?: number;
		billable?: boolean;
		active?: boolean;
		budget?: number;
		index?: number;
	};
	'projects.tasks.delete': {
		project_id: number;
		/** Resource ID. */
		id: number;
	};
	'projects.tasks.deleteAll': {
		project_id: number;
	};
	'projects.tasks.get': {
		project_id: number;
		/** Resource ID. */
		id: number;
	};
	'projects.tasks.list': {
		/** Page number, starting at 1. */
		page?: number;
		/** Page size. */
		per_page?: number;
		/** ISO 8601 UTC timestamp (e.g. `2026-01-31T14:30:00Z`). Returns entities created or updated after this timestamp and is intended for incremental synchronization. Combine with delete webhooks for full synchronization. */
		updated_after?: string;
		project_id: number;
	};
	'projects.tasks.update': {
		project_id: number;
		/** Resource ID. */
		id: number;
		name?: string;
		description?: string;
		hourly_rate?: number;
		billable?: boolean;
		active?: boolean;
		budget?: number;
		index?: number;
	};
	'projects.unarchive': {
		/** Resource ID. */
		id: number;
	};
	'projects.unassignProjectGroup': {
		/** Resource ID. */
		id: number;
	};
	'projects.update': {
		/** Resource ID. */
		id: number;
		/** Project number/identifier. Required when number ranges are manual. */
		identifier?: string;
		/** Project name. */
		name?: string;
		/** Whether the project is fixed price. */
		fixed_price?: boolean;
		/** Customer company ID. */
		company_id?: number;
		/** Deprecated alias of `company_id`. */
		customer_id?: number;
		/** Linked deal ID. */
		deal_id?: number;
		/** Linked project group ID. */
		project_group_id?: number;
		/** Main responsible user ID. */
		leader_id?: number;
		/** Secondary responsible user ID. */
		co_leader_id?: number;
		/** Main external contact ID. */
		contact_id?: number;
		/** Secondary external contact ID. */
		secondary_contact_id?: number;
		/** Billing contact ID. */
		billing_contact_id?: number;
		/** Internal project notes. */
		info?: string;
		/** Project start date. */
		start_date?: string;
		/** Project finish date. */
		finish_date?: string;
		/** Whether project is billed as retainer. */
		retainer?: boolean;
		/** Retainer billing day in month (1-31). */
		retainer_billing_date?: number;
		/** Default title for generated retainer items. */
		retainer_billing_title?: string;
		/** Default description for generated retainer items. */
		retainer_billing_description?: string;
		/** Pricing mode for hourly rates. Preferred values are `project`, `task`, `user`. `billing_variant_rate_per_project`, `billing_variant_rate_per_task`, `billing_variant_rate_per_user` are also accepted. */
		billing_variant?:
			| 'project'
			| 'task'
			| 'user'
			| 'billing_variant_rate_per_project'
			| 'billing_variant_rate_per_task'
			| 'billing_variant_rate_per_user';
		/** Effective hourly rate for project pricing. */
		hourly_rate?: number;
		/** Project budget in project currency. */
		budget?: number;
		/** Monthly budget for retainers. */
		budget_monthly?: number;
		/** Expense budget in project currency. */
		budget_expenses?: number;
		/** Project currency. Mandatory on create and immutable afterwards. */
		currency?: string;
		/** Billing address for generated documents. */
		billing_address?: string;
		/** Notes printed or used during billing. */
		billing_notes?: string;
		/** Include time report in billing output. */
		setting_include_time_report?: boolean;
		/** Default recipient email(s), semicolon-separated. */
		billing_email_to?: string;
		/** Default CC email(s), semicolon-separated. */
		billing_email_cc?: string;
		/** Do not add this project to favorites for the creator. */
		skip_favorite?: boolean;
		/** Project tags. */
		tags?: Array<string>;
		/** Deprecated alias for `tags`. */
		labels?: Array<string>;
		/** Custom field values keyed by custom field name. */
		custom_properties?: Record<string, MocoJsonValue>;
	};
	'purchases.assignToProject': {
		/** Resource ID. */
		id: number;
		/** Single purchase item ID. */
		item_id?: number;
		project_id: number;
		/** Existing expense ID to attach to. */
		expense_id?: number;
		notify_project_leader?: boolean;
		billable?: boolean;
		budget_relevant?: boolean;
		surcharge?: number;
	};
	'purchases.bookkeepingExports.create': {
		comment?: string;
		/** Whether to trigger direct online submission. */
		trigger_submission?: boolean;
		archive_after_export?: boolean;
		purchase_ids?: Array<number>;
	};
	'purchases.bookkeepingExports.get': {
		/** Resource ID. */
		id: number;
	};
	'purchases.bookkeepingExports.list': {
		/** Page number, starting at 1. */
		page?: number;
	};
	'purchases.budgets.create': {
		title: string;
		cost_category?: string | null;
		active?: boolean;
	};
	'purchases.budgets.delete': {
		/** Resource ID. */
		id: number;
	};
	'purchases.budgets.list': {
		year?: number;
	};
	'purchases.budgets.update': {
		/** Resource ID. */
		id: number;
		title?: string;
		cost_category?: string | null;
		active?: boolean;
	};
	'purchases.budgets.updateTarget': {
		/** Resource ID. */
		id: number;
		/** The target budget amount. */
		target_amount: number;
		/** The budget year. Defaults to the current year if omitted. */
		year?: number;
	};
	'purchases.categories.get': {
		/** Resource ID. */
		id: number;
	};
	'purchases.categories.list': {
		/** Page number, starting at 1. */
		page?: number;
		/** Comma-separated IDs. */
		ids?: number | string;
		/** ISO 8601 UTC timestamp (e.g. `2026-01-31T14:30:00Z`). Returns entities created or updated after this timestamp and is intended for incremental synchronization. Combine with delete webhooks for full synchronization. */
		updated_after?: string;
	};
	'purchases.create': {
		date?: string;
		due_date?: string;
		service_period_from?: string;
		service_period_to?: string;
		company_id?: number;
		purchase_draft_id?: number;
		inbound_email_id?: number;
		receipt_identifier?: string;
		currency?: string;
		payment_method?:
			| 'bank_transfer'
			| 'direct_debit'
			| 'credit_card'
			| 'paypal'
			| 'cash'
			| 'bank_transfer_swiss_qr_esr';
		info?: string;
		iban?: string;
		reference?: string;
		bank_account_number?: string;
		title?: string;
		user_id?: number;
		purchase_budget_id?: number;
		cash_discount_rate?: number;
		cash_discount_until?: string;
		custom_properties?: Record<string, MocoJsonValue>;
		tags?: Array<string>;
		items?: Array<{
			title?: string;
			total?: number;
			tax?: number;
			vat_code_id?: number;
			tax_included?: boolean;
			ksk_relevant?: boolean;
			category_id?: number;
		}>;
		file?: {
			filename?: string;
			base64?: string;
		};
	};
	'purchases.delete': {
		/** Resource ID. */
		id: number;
	};
	'purchases.drafts.create': {
		/** Title of the purchase draft. */
		title: string;
		/** Optional file attachment. */
		file?: {
			/** Original file name including extension. */
			filename: string;
			/** Base64-encoded file content. */
			base64: string;
		};
	};
	'purchases.drafts.delete': {
		/** Resource ID. */
		id: number;
	};
	'purchases.drafts.get': {
		/** Resource ID. */
		id: number;
	};
	'purchases.drafts.getPdf': {
		/** Resource ID. */
		id: number;
	};
	'purchases.drafts.list': {
		/** Page number, starting at 1. */
		page?: number;
		/** Comma-separated IDs. */
		ids?: number | string;
		/** ISO 8601 UTC timestamp (e.g. `2026-01-31T14:30:00Z`). Returns entities created or updated after this timestamp and is intended for incremental synchronization. Combine with delete webhooks for full synchronization. */
		updated_after?: string;
	};
	'purchases.get': {
		/** Resource ID. */
		id: number;
	};
	'purchases.list': {
		/** Page number, starting at 1. */
		page?: number;
		/** Page size. */
		per_page?: number;
		/** Legacy alias for filtering by purchase ID (single ID or comma-separated list). */
		id?: string;
		/** Comma-separated IDs. */
		ids?: number | string;
		/** ISO 8601 UTC timestamp (e.g. `2026-01-31T14:30:00Z`). Returns entities created or updated after this timestamp and is intended for incremental synchronization. Combine with delete webhooks for full synchronization. */
		updated_after?: string;
		/** Filter by custom field values. Unknown custom field names return an empty result set. For MultiSelect fields, pass multiple values using `custom_properties[Field][]=A&custom_properties[Field][]=B`. Boolean fields should be queried with `true` or `false`. */
		custom_properties?: Record<string, string | boolean | Array<string>>;
		category_id?: number;
		term?: string;
		/** Supplier company ID. Use `0` for purchases without supplier. */
		company_id?: number;
		status?: 'pending' | 'archived';
		approval_status?: 'none' | 'approved' | 'denied' | 'pending';
		approver_user_id?: number;
		not_booked?: boolean;
		/** Comma-separated list of tag names. */
		tags?: string;
		/** Comma-separated list of tag IDs. */
		tag_ids?: string;
		/** Use `date_from`/`date_to` instead. Date range, e.g. `2020-02-01:2020-02-22`. */
		date?: string;
		/** Purchase date range start. Format: YYYY-MM-DD (e.g. `2026-01-01`). See also date_to. */
		date_from?: string;
		/** Purchase date range end. Format: YYYY-MM-DD (e.g. `2026-01-31`). See also date_from. */
		date_to?: string;
		unpaid?: boolean;
		partially_paid?: boolean;
		payment_method?:
			| 'bank_transfer'
			| 'direct_debit'
			| 'credit_card'
			| 'paypal'
			| 'cash'
			| 'bank_transfer_swiss_qr_esr';
		receipt_identifier?: string;
		identifier?: string;
		/** User ID (responsible for purchase) */
		user_id?: number;
	};
	'purchases.payments.bulkCreate': {
		bulk_data: Array<MocoPurchasePaymentUpsertRequestInput>;
	};
	'purchases.payments.create': {
		date: string;
		total: number;
		purchase_id: number;
		description?: string;
		currency?: string;
		payment_account_id?: number;
		/** Indicates whether the purchase is partially paid. */
		partially_paid?: boolean;
	};
	'purchases.payments.delete': {
		/** Resource ID. */
		id: number;
	};
	'purchases.payments.get': {
		/** Resource ID. */
		id: number;
	};
	'purchases.payments.list': {
		/** Page number, starting at 1. */
		page?: number;
		/** Comma-separated IDs. */
		ids?: number | string;
		/** ISO 8601 UTC timestamp (e.g. `2026-01-31T14:30:00Z`). Returns entities created or updated after this timestamp and is intended for incremental synchronization. Combine with delete webhooks for full synchronization. */
		updated_after?: string;
		/** Single ID or comma-separated list. */
		purchase_id?: number | string;
		/** Payment date range start. Format: YYYY-MM-DD (e.g. `2026-01-01`). */
		date_from?: string;
		/** Payment date range end. Format: YYYY-MM-DD (e.g. `2026-01-31`). */
		date_to?: string;
	};
	'purchases.payments.update': {
		/** Resource ID. */
		id: number;
		date: string;
		total: number;
		purchase_id: number;
		description?: string;
		currency?: string;
		payment_account_id?: number;
		/** Indicates whether the purchase is partially paid. */
		partially_paid?: boolean;
	};
	'purchases.storeDocument': {
		/** Resource ID. */
		id: number;
		file: FileInput;
	};
	'purchases.update': {
		/** Resource ID. */
		id: number;
		date?: string;
		due_date?: string;
		service_period_from?: string;
		service_period_to?: string;
		company_id?: number;
		purchase_draft_id?: number;
		inbound_email_id?: number;
		receipt_identifier?: string;
		currency?: string;
		payment_method?:
			| 'bank_transfer'
			| 'direct_debit'
			| 'credit_card'
			| 'paypal'
			| 'cash'
			| 'bank_transfer_swiss_qr_esr';
		info?: string;
		iban?: string;
		reference?: string;
		bank_account_number?: string;
		title?: string;
		user_id?: number;
		purchase_budget_id?: number;
		cash_discount_rate?: number;
		cash_discount_until?: string;
		custom_properties?: Record<string, MocoJsonValue>;
		tags?: Array<string>;
		file?: {
			filename?: string;
			base64?: string;
		};
	};
	'purchases.updateStatus': {
		/** Resource ID. */
		id: number;
		/** Supports legacy `approved` (mapped to internal `archived`) and direct `archived`. */
		status: 'pending' | 'approved' | 'archived';
	};
	'receipts.create': {
		date?: string;
		title?: string;
		billable?: boolean;
		info?: string;
		project_id?: number;
		currency?: string;
		items?: Array<{
			purchase_category_id?: number;
			gross_total?: number;
			vat_code_id?: number;
		}>;
		attachment?: {
			filename?: string;
			base64?: string;
		};
	};
	'receipts.delete': {
		/** Resource ID. */
		id: number;
	};
	'receipts.get': {
		/** Resource ID. */
		id: number;
	};
	'receipts.list': {
		/** Page number, starting at 1. */
		page?: number;
		/** Page size. */
		per_page?: number;
		/** Comma-separated IDs. */
		ids?: number | string;
		/** ISO 8601 UTC timestamp (e.g. `2026-01-31T14:30:00Z`). Returns entities created or updated after this timestamp and is intended for incremental synchronization. Combine with delete webhooks for full synchronization. */
		updated_after?: string;
		user_id?: number;
		project_id?: number;
		/** Receipt date range start. Format: YYYY-MM-DD (e.g. `2026-01-01`). */
		from?: string;
		/** Receipt date range end. Format: YYYY-MM-DD (e.g. `2026-01-31`). */
		to?: string;
		purchase_category_id?: number;
		/** `true` for submitted/closed receipts, `false` for pending. */
		submitted?: boolean;
		/** Single ID or comma-separated list. */
		refund_request_id?: number | string;
	};
	'receipts.update': {
		/** Resource ID. */
		id: number;
		date?: string;
		title?: string;
		billable?: boolean;
		info?: string;
		project_id?: number;
		currency?: string;
		items?: Array<{
			purchase_category_id?: number;
			gross_total?: number;
			vat_code_id?: number;
		}>;
		attachment?: {
			filename?: string;
			base64?: string;
		};
	};
	'recurringExpenses.list': {
		/** Page number, starting at 1. */
		page?: number;
		/** Page size. */
		per_page?: number;
		/** Field and optional direction, e.g. `title desc`. */
		sort_by?: string;
		/** Comma-separated IDs. */
		ids?: number | string;
		/** ISO 8601 UTC timestamp (e.g. `2026-01-31T14:30:00Z`). Returns entities created or updated after this timestamp and is intended for incremental synchronization. Combine with delete webhooks for full synchronization. */
		updated_after?: string;
		/** Filter by custom field values. Unknown custom field names return an empty result set. For MultiSelect fields, pass multiple values using `custom_properties[Field][]=A&custom_properties[Field][]=B`. Boolean fields should be queried with `true` or `false`. */
		custom_properties?: Record<string, string | boolean | Array<string>>;
		project_id?: number;
	};
	'reports.absences': {
		year?: number;
		active?: boolean;
	};
	'reports.cashflow': {
		/** Page number, starting at 1. */
		page?: number;
		/** Page size. */
		per_page?: number;
		/** Report range start. Format: YYYY-MM-DD (e.g. `2026-01-01`). */
		from?: string;
		/** Report range end. Format: YYYY-MM-DD (e.g. `2026-01-31`). */
		to?: string;
		term?: string;
		/** Filter by record kinds. Pass multiple values as `kinds[]=a&kinds[]=b` (repeating `kinds=` without brackets keeps only the last value). If omitted, all kinds are included. `outgoing_fix_costs` includes planned fixed costs. */
		kinds?: Array<
			| 'incoming_invoice_payments'
			| 'incoming_invoice_open'
			| 'incoming_payment_schedules'
			| 'incoming_time_and_material_retainer_budgets'
			| 'incoming_expenses'
			| 'incoming_unbilled_activities'
			| 'incoming_planned_activities'
			| 'outgoing_purchase_payments'
			| 'outgoing_purchase_unpaid'
			| 'outgoing_fix_costs'
			| 'outgoing_purchase_order_once'
			| 'outgoing_purchase_order_recurring'
			| 'outgoing_purchase_order_expense'
		>;
	};
	'reports.finance': {
		/** Page number, starting at 1. */
		page?: number;
		/** Page size. */
		per_page?: number;
		/** Report range start. Format: YYYY-MM-DD (e.g. `2026-01-01`). */
		from?: string;
		/** Report range end. Format: YYYY-MM-DD (e.g. `2026-01-31`). */
		to?: string;
		term?: string;
		company_id?: number;
		/** Filter by record kinds. Pass multiple values as `kinds[]=a&kinds[]=b` (repeating `kinds=` without brackets keeps only the last value). If omitted, all kinds are included. */
		kinds?: Array<
			| 'incoming_invoices'
			| 'incoming_draft_invoices'
			| 'incoming_payment_schedules'
			| 'incoming_fixprice_retainer_payment_schedules'
			| 'incoming_time_and_material_retainer_budgets'
			| 'incoming_expenses'
			| 'incoming_activities'
			| 'incoming_activities_planned'
			| 'incoming_recurring_expenses'
			| 'outgoing_purchases'
			| 'outgoing_fixed_costs'
			| 'outgoing_fixed_costs_planned'
			| 'outgoing_purchase_orders_once'
			| 'outgoing_purchase_orders_recurring'
			| 'outgoing_purchase_orders_expenses'
		>;
	};
	'reports.plannedVsTracked': {
		/** Page number, starting at 1. */
		page?: number;
		/** Page size. */
		per_page?: number;
		/** Report range start. Format: YYYY-MM-DD (e.g. `2026-01-01`). */
		from?: string;
		/** Report range end. Format: YYYY-MM-DD (e.g. `2026-01-31`). */
		to?: string;
		/** List of user IDs as repeated params or comma-separated string. */
		user_ids?: Array<number> | string;
		project_id?: number;
	};
	'reports.utilization': {
		/** Report range start. Format: YYYY-MM-DD (e.g. `2026-01-01`). */
		from?: string;
		/** Report range end. Format: YYYY-MM-DD (e.g. `2026-01-31`). */
		to?: string;
	};
	'revenueCategories.create': {
		name?: string;
		revenue_account?: number | null;
		cost_category?: string | null;
		assignment_kind: 'only_tasks' | 'only_expenses' | 'tasks_and_expenses';
	};
	'revenueCategories.delete': {
		/** Resource ID. */
		id: number;
	};
	'revenueCategories.get': {
		/** Resource ID. */
		id: number;
	};
	'revenueCategories.list': {
		/** Page number, starting at 1. */
		page?: number;
		/** Page size. */
		per_page?: number;
		/** Comma-separated IDs. */
		ids?: number | string;
		/** ISO 8601 UTC timestamp (e.g. `2026-01-31T14:30:00Z`). Returns entities created or updated after this timestamp and is intended for incremental synchronization. Combine with delete webhooks for full synchronization. */
		updated_after?: string;
		/** Filter by name or revenue account number. */
		term?: string;
		/** Filter by revenue account number. */
		revenue_account?: number;
		/** Filter by cost category identifier. */
		cost_category?: string;
	};
	'revenueCategories.update': {
		/** Resource ID. */
		id: number;
		name?: string;
		revenue_account?: number | null;
		cost_category?: string | null;
		assignment_kind?: 'only_tasks' | 'only_expenses' | 'tasks_and_expenses';
	};
	'schedules.create': {
		date?: string;
		user_id?: number;
		comment?: string;
		am?: boolean;
		pm?: boolean;
		symbol?: string;
		/** Absence code of the schedule: `1` (unplannable absence), `2` (public holiday), `3` (sick day), `4` (holiday), `5` (absence). */
		absence_code?: string;
		/** When true, clears any existing schedule entries for the same user/date before creating the new one. Only honored on create. */
		overwrite?: boolean;
	};
	'schedules.delete': {
		/** Resource ID. */
		id: number;
	};
	'schedules.get': {
		/** Resource ID. */
		id: number;
	};
	'schedules.list': {
		/** Page number, starting at 1. */
		page?: number;
		/** Page size. */
		per_page?: number;
		/** Comma-separated IDs. */
		ids?: number | string;
		/** ISO 8601 UTC timestamp (e.g. `2026-01-31T14:30:00Z`). Returns entities created or updated after this timestamp and is intended for incremental synchronization. Combine with delete webhooks for full synchronization. */
		updated_after?: string;
		/** Schedule range start. Format: YYYY-MM-DD (e.g. `2026-01-01`). */
		from?: string;
		/** Schedule range end. Format: YYYY-MM-DD (e.g. `2026-01-31`). */
		to?: string;
		user_id?: number;
		/** Filter by absence code: `1` (unplannable absence), `2` (public holiday), `3` (sick day), `4` (holiday), `5` (absence). Comma-separated values are supported (e.g. `3,4`). */
		absence_code?: string;
		absence_request_id?: number;
	};
	'schedules.update': {
		/** Resource ID. */
		id: number;
		date?: string;
		user_id?: number;
		comment?: string;
		am?: boolean;
		pm?: boolean;
		symbol?: string;
		/** Absence code of the schedule: `1` (unplannable absence), `2` (public holiday), `3` (sick day), `4` (holiday), `5` (absence). */
		absence_code?: string;
	};
	'session.verify': Record<string, never>;
	'taggings.add': {
		taggable_type: string;
		taggable_id: number;
		tags?: Array<string> | string;
	};
	'taggings.list': {
		taggable_type: string;
		taggable_id: number;
	};
	'taggings.remove': {
		taggable_type: string;
		taggable_id: number;
		tags?: Array<string> | string;
	};
	'taggings.replace': {
		taggable_type: string;
		taggable_id: number;
		tags?: Array<string> | string;
	};
	'tags.create': {
		name?: string;
		color?: string;
		/** `Project` is mapped to internal `Assignment`. */
		context?:
			| 'Company'
			| 'Contact'
			| 'Project'
			| 'Deal'
			| 'Purchase'
			| 'Invoice'
			| 'Offer'
			| 'User';
	};
	'tags.delete': {
		/** Optional tag ID to merge existing taggings into. */
		merge_tag_id?: number;
		/** Resource ID. */
		id: number;
	};
	'tags.get': {
		/** Resource ID. */
		id: number;
	};
	'tags.list': {
		/** Page number, starting at 1. */
		page?: number;
		/** Page size. */
		per_page?: number;
		/** Comma-separated IDs. */
		ids?: number | string;
		/** ISO 8601 UTC timestamp (e.g. `2026-01-31T14:30:00Z`). Returns entities created or updated after this timestamp and is intended for incremental synchronization. Combine with delete webhooks for full synchronization. */
		updated_after?: string;
		/** Tag context. */
		context?:
			| 'Company'
			| 'Contact'
			| 'Project'
			| 'Deal'
			| 'Purchase'
			| 'Invoice'
			| 'Offer'
			| 'User';
	};
	'tags.update': {
		/** Resource ID. */
		id: number;
		name?: string;
		color?: string;
	};
	'todos.get': {
		/** Resource ID. */
		id: number;
	};
	'todos.list': {
		/** Page number, starting at 1. */
		page?: number;
		/** Page size. */
		per_page?: number;
		/** Filter by the responsible user ID */
		responsible_user_id?: number;
		/** Search term for todo title */
		term?: string;
		/** Filter by the assigned user ID */
		assigned_to_user_id?: number;
		/** Filter by the creating user ID */
		created_by_user_id?: number;
		/** Filter by completion status */
		completed?: boolean;
	};
	'units.create': {
		name?: string;
		custom_properties?: Record<string, MocoJsonValue>;
	};
	'units.delete': {
		/** Resource ID. */
		id: number;
	};
	'units.get': {
		/** Resource ID. */
		id: number;
	};
	'units.list': {
		/** Page number, starting at 1. */
		page?: number;
		/** Page size. */
		per_page?: number;
		/** Comma-separated IDs. */
		ids?: number | string;
		/** ISO 8601 UTC timestamp (e.g. `2026-01-31T14:30:00Z`). Returns entities created or updated after this timestamp and is intended for incremental synchronization. Combine with delete webhooks for full synchronization. */
		updated_after?: string;
		/** Filter by custom field values. Unknown custom field names return an empty result set. For MultiSelect fields, pass multiple values using `custom_properties[Field][]=A&custom_properties[Field][]=B`. Boolean fields should be queried with `true` or `false`. */
		custom_properties?: Record<string, string | boolean | Array<string>>;
	};
	'units.update': {
		/** Resource ID. */
		id: number;
		name?: string;
		custom_properties?: Record<string, MocoJsonValue>;
	};
	'users.absenceRequests.create': {
		/** ID of the selected approver. */
		approver_user_id: string;
		/** Absence request type. */
		type: 'vacation' | 'sickness' | 'other';
		/** Absence request day entries. */
		entries: Array<{
			/** Entry date. Format: YYYY-MM-DD (e.g. `2026-01-01`). */
			date: string;
			/** Whether the morning (AM) is requested. */
			am: boolean;
			/** Whether the afternoon (PM) is requested. */
			pm: boolean;
		}>;
		/** Comment or reason for the absence request. */
		comment?: string;
		/** Values for this absence request's custom fields. */
		custom_values?: Array<{
			/** ID of the custom property. */
			custom_property_id: string;
			/** Value of the custom property. */
			value: string;
		}>;
	};
	'users.absenceRequests.delete': {
		/** Resource ID. */
		id: number;
		/** Reason for deleting the absence request. */
		comment: string;
	};
	'users.absenceRequests.get': {
		/** Resource ID. */
		id: number;
	};
	'users.absenceRequests.list': {
		/** Page number, starting at 1. */
		page?: number;
		/** Page size. */
		per_page?: number;
		/** Comma-separated IDs. */
		ids?: number | string;
		/** ISO 8601 UTC timestamp (e.g. `2026-01-31T14:30:00Z`). Returns entities created or updated after this timestamp and is intended for incremental synchronization. Combine with delete webhooks for full synchronization. */
		updated_after?: string;
		/** Filter by user ID. */
		user_id?: number;
		/** Filter by selected approver user ID. */
		selected_approver_id?: number;
		/** Filter by absence request type. */
		type?: 'vacation' | 'sickness' | 'other';
		/** Filter by absence request status. */
		status?: 'pending' | 'approved';
	};
	'users.create': {
		firstname?: string;
		name?: string;
		email?: string;
		active?: boolean;
		role_id?: number;
		info?: string;
		external?: boolean;
		language?: 'de' | 'de-AT' | 'de-CH' | 'en' | 'it' | 'fr';
		mobile_phone?: string;
		work_phone?: string;
		home_address?: string;
		bday?: string;
		iban?: string;
		/** Applied on create, defaults to `true`. */
		welcome_email?: boolean;
		password?: string;
		unit_id?: number;
		tags?: Array<string>;
		custom_properties?: Record<string, MocoJsonValue>;
		/** Bookkeeping credit account number for supplier transactions (for refunds). */
		credit_number?: string;
		avatar?: {
			filename?: string;
			base64?: string;
		};
	};
	'users.delete': {
		/** Resource ID. */
		id: number;
	};
	'users.employments.create': {
		user_id?: number;
		from?: string;
		to?: string;
		pattern?: {
			am?: Array<number>;
			pm?: Array<number>;
		};
	};
	'users.employments.delete': {
		/** Resource ID. */
		id: number;
	};
	'users.employments.get': {
		/** Resource ID. */
		id: number;
	};
	'users.employments.list': {
		/** Page number, starting at 1. */
		page?: number;
		/** Page size. */
		per_page?: number;
		/** Comma-separated IDs. */
		ids?: number | string;
		/** ISO 8601 UTC timestamp (e.g. `2026-01-31T14:30:00Z`). Returns entities created or updated after this timestamp and is intended for incremental synchronization. Combine with delete webhooks for full synchronization. */
		updated_after?: string;
		user_id?: number;
		/** Employment date range start. Format: YYYY-MM-DD (e.g. `2026-01-01`). */
		from?: string;
		/** Employment date range end. Format: YYYY-MM-DD (e.g. `2026-01-31`). */
		to?: string;
	};
	'users.employments.update': {
		/** Resource ID. */
		id: number;
		user_id?: number;
		from?: string;
		to?: string;
		pattern?: {
			am?: Array<number>;
			pm?: Array<number>;
		};
	};
	'users.get': {
		/** Resource ID. */
		id: number;
	};
	'users.holidays.create': {
		user_id?: number;
		creator_id?: number;
		year?: number;
		title?: string;
		hours?: number;
		days?: number;
	};
	'users.holidays.delete': {
		/** Resource ID. */
		id: number;
	};
	'users.holidays.get': {
		/** Resource ID. */
		id: number;
	};
	'users.holidays.list': {
		/** Page number, starting at 1. */
		page?: number;
		/** Page size. */
		per_page?: number;
		/** Comma-separated IDs. */
		ids?: number | string;
		/** ISO 8601 UTC timestamp (e.g. `2026-01-31T14:30:00Z`). Returns entities created or updated after this timestamp and is intended for incremental synchronization. Combine with delete webhooks for full synchronization. */
		updated_after?: string;
		user_id?: number;
		year?: number;
	};
	'users.holidays.update': {
		/** Resource ID. */
		id: number;
		user_id?: number;
		creator_id?: number;
		year?: number;
		title?: string;
		hours?: number;
		days?: number;
	};
	'users.list': {
		/** Page number, starting at 1. */
		page?: number;
		/** Page size. */
		per_page?: number;
		/** Field and optional direction, e.g. `title desc`. */
		sort_by?: string;
		/** Comma-separated IDs. */
		ids?: number | string;
		/** ISO 8601 UTC timestamp (e.g. `2026-01-31T14:30:00Z`). Returns entities created or updated after this timestamp and is intended for incremental synchronization. Combine with delete webhooks for full synchronization. */
		updated_after?: string;
		/** Filter by custom field values. Unknown custom field names return an empty result set. For MultiSelect fields, pass multiple values using `custom_properties[Field][]=A&custom_properties[Field][]=B`. Boolean fields should be queried with `true` or `false`. */
		custom_properties?: Record<string, string | boolean | Array<string>>;
		include_archived?: boolean;
		/** Filter by exact email address (e.g. `max.muster@example.com`). */
		email?: string;
		/** Comma-separated user tag names. */
		tags?: string;
	};
	'users.performanceReport': {
		/** Resource ID. */
		id: number;
		/** Report year. Must be between 2000 and 2100. */
		year?: number;
	};
	'users.presences.create': {
		date?: string;
		from?: string;
		to?: string;
		is_home_office?: boolean;
	};
	'users.presences.delete': {
		/** Resource ID. */
		id: number;
	};
	'users.presences.get': {
		/** Resource ID. */
		id: number;
	};
	'users.presences.list': {
		/** Page number, starting at 1. */
		page?: number;
		/** Page size. */
		per_page?: number;
		/** Comma-separated IDs. */
		ids?: number | string;
		/** ISO 8601 UTC timestamp (e.g. `2026-01-31T14:30:00Z`). Returns entities created or updated after this timestamp and is intended for incremental synchronization. Combine with delete webhooks for full synchronization. */
		updated_after?: string;
		user_id?: number;
		/** Presence date range start. Format: YYYY-MM-DD (e.g. `2026-01-01`). */
		from?: string;
		/** Presence date range end. Format: YYYY-MM-DD (e.g. `2026-01-31`). */
		to?: string;
		is_home_office?: boolean;
	};
	'users.presences.touch': {
		is_home_office?: boolean;
		override?: boolean;
	};
	'users.presences.update': {
		/** Resource ID. */
		id: number;
		date?: string;
		from?: string;
		to?: string;
		is_home_office?: boolean;
	};
	'users.roles.list': Record<string, never>;
	'users.update': {
		/** Resource ID. */
		id: number;
		firstname?: string;
		name?: string;
		email?: string;
		active?: boolean;
		role_id?: number;
		info?: string;
		external?: boolean;
		language?: 'de' | 'de-AT' | 'de-CH' | 'en' | 'it' | 'fr';
		mobile_phone?: string;
		work_phone?: string;
		home_address?: string;
		bday?: string;
		iban?: string;
		/** Applied on create, defaults to `true`. */
		welcome_email?: boolean;
		password?: string;
		unit_id?: number;
		tags?: Array<string>;
		custom_properties?: Record<string, MocoJsonValue>;
		/** Bookkeeping credit account number for supplier transactions (for refunds). */
		credit_number?: string;
		avatar?: {
			filename?: string;
			base64?: string;
		};
	};
	'users.workTimeAdjustments.create': {
		date?: string;
		description?: string;
		hours?: number;
		user_id?: number;
	};
	'users.workTimeAdjustments.delete': {
		/** Resource ID. */
		id: number;
	};
	'users.workTimeAdjustments.get': {
		/** Resource ID. */
		id: number;
	};
	'users.workTimeAdjustments.list': {
		/** Page number, starting at 1. */
		page?: number;
		/** Page size. */
		per_page?: number;
		/** Comma-separated IDs. */
		ids?: number | string;
		/** ISO 8601 UTC timestamp (e.g. `2026-01-31T14:30:00Z`). Returns entities created or updated after this timestamp and is intended for incremental synchronization. Combine with delete webhooks for full synchronization. */
		updated_after?: string;
		user_id?: number;
		/** Adjustment date range start. Format: YYYY-MM-DD (e.g. `2026-01-01`). */
		from?: string;
		/** Adjustment date range end. Format: YYYY-MM-DD (e.g. `2026-01-31`). */
		to?: string;
	};
	'users.workTimeAdjustments.update': {
		/** Resource ID. */
		id: number;
		date?: string;
		description?: string;
		hours?: number;
	};
	'vatCodePurchases.get': {
		/** Resource ID. */
		id: number;
	};
	'vatCodePurchases.list': {
		/** Page number, starting at 1. */
		page?: number;
		/** Page size. */
		per_page?: number;
		/** Comma-separated IDs. */
		ids?: number | string;
		/** ISO 8601 UTC timestamp (e.g. `2026-01-31T14:30:00Z`). Returns entities created or updated after this timestamp and is intended for incremental synchronization. Combine with delete webhooks for full synchronization. */
		updated_after?: string;
		active?: boolean;
		intra_eu?: boolean;
		reverse_charge?: boolean;
	};
	'vatCodeSales.get': {
		/** Resource ID. */
		id: number;
	};
	'vatCodeSales.list': {
		/** Page number, starting at 1. */
		page?: number;
		/** Page size. */
		per_page?: number;
		/** Comma-separated IDs. */
		ids?: number | string;
		/** ISO 8601 UTC timestamp (e.g. `2026-01-31T14:30:00Z`). Returns entities created or updated after this timestamp and is intended for incremental synchronization. Combine with delete webhooks for full synchronization. */
		updated_after?: string;
		active?: boolean;
		intra_eu?: boolean;
		reverse_charge?: boolean;
	};
};

export type MocoOperationOutputs = {
	'account.catalogServices.create': MocoAccountCatalogService;
	'account.catalogServices.delete':
		| MocoAccountCatalogService
		| {
				/** MOCO accepted the call; it answered with no body. */ success: true;
		  };
	'account.catalogServices.get': MocoAccountCatalogService;
	'account.catalogServices.items.create': MocoAccountCatalogServiceItem;
	'account.catalogServices.items.delete':
		| MocoAccountCatalogServiceItem
		| {
				/** MOCO accepted the call; it answered with no body. */ success: true;
		  };
	'account.catalogServices.items.get': MocoAccountCatalogServiceItem;
	'account.catalogServices.items.update': MocoAccountCatalogServiceItem;
	'account.catalogServices.list': {
		/** One page of results. */
		items: Array<MocoAccountCatalogService>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'account.catalogServices.update': MocoAccountCatalogService;
	'account.customProperties.create': MocoAccountCustomProperty;
	'account.customProperties.delete':
		| MocoAccountCustomProperty
		| {
				/** MOCO accepted the call; it answered with no body. */ success: true;
		  };
	'account.customProperties.get': MocoAccountCustomProperty;
	'account.customProperties.list': {
		/** One page of results. */
		items: Array<MocoAccountCustomProperty>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'account.customProperties.update': MocoAccountCustomProperty;
	'account.expenseTemplates.create': MocoAccountExpenseTemplate;
	'account.expenseTemplates.delete':
		| MocoAccountExpenseTemplate
		| {
				/** MOCO accepted the call; it answered with no body. */ success: true;
		  };
	'account.expenseTemplates.get': MocoAccountExpenseTemplate;
	'account.expenseTemplates.list': {
		/** One page of results. */
		items: Array<MocoAccountExpenseTemplate>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'account.expenseTemplates.update': MocoAccountExpenseTemplate;
	'account.fixedCosts.list': {
		/** One page of results. */
		items: Array<MocoAccountFixedCost>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'account.hourlyRates.get': MocoAccountHourlyRatesResponse;
	'account.internalHourlyRates.get': MocoAccountInternalHourlyRatesResponse;
	'account.internalHourlyRates.update': {
		status?: string | null;
	};
	'account.taskTemplates.create': MocoAccountTaskTemplate;
	'account.taskTemplates.delete': {
		/** MOCO accepted the call; it answered with no body. */
		success: true;
	};
	'account.taskTemplates.get': MocoAccountTaskTemplate;
	'account.taskTemplates.list': {
		/** One page of results. */
		items: Array<MocoAccountTaskTemplate>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'account.taskTemplates.update': MocoAccountTaskTemplate;
	'account.webHooks.create': MocoAccountWebHook;
	'account.webHooks.delete':
		| MocoAccountWebHook
		| {
				/** MOCO accepted the call; it answered with no body. */ success: true;
		  };
	'account.webHooks.disable': MocoAccountWebHook;
	'account.webHooks.enable': MocoAccountWebHook;
	'account.webHooks.get': MocoAccountWebHook;
	'account.webHooks.list': {
		/** One page of results. */
		items: Array<MocoAccountWebHook>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'account.webHooks.update': MocoAccountWebHook;
	'activities.bulkCreate': Array<MocoActivity>;
	'activities.create': MocoActivity;
	'activities.delete':
		| MocoActivity
		| {
				/** MOCO accepted the call; it answered with no body. */ success: true;
		  };
	'activities.disregard': Array<number>;
	'activities.get': MocoActivity;
	'activities.list': {
		/** One page of results. */
		items: Array<MocoActivity>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'activities.startTimer': MocoActivity;
	'activities.stopTimer': MocoActivity;
	'activities.update': MocoActivity;
	'activities.updateBillableSeconds': MocoActivity;
	'approvals.approve': MocoApproval;
	'approvals.create': MocoApproval;
	'approvals.delete':
		| MocoApproval
		| {
				/** MOCO accepted the call; it answered with no body. */ success: true;
		  };
	'approvals.deny': MocoApproval;
	'approvals.get': MocoApproval;
	'approvals.list': {
		/** One page of results. */
		items: Array<MocoApproval>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'comments.bulkCreate': Array<MocoComment>;
	'comments.create': MocoComment;
	'comments.delete': {
		/** MOCO accepted the call; it answered with no body. */
		success: true;
	};
	'comments.get': MocoCommentWithAttachment;
	'comments.list': {
		/** One page of results. */
		items: Array<MocoComment>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'comments.update': MocoComment;
	'companies.archive': MocoCompany;
	'companies.create': MocoCompany;
	'companies.delete':
		| MocoCompany
		| {
				/** MOCO accepted the call; it answered with no body. */ success: true;
		  };
	'companies.get': MocoCompany;
	'companies.list': {
		/** One page of results. */
		items: Array<MocoCompany>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'companies.unarchive': MocoCompany;
	'companies.update': MocoCompany;
	'contacts.create': MocoContactPerson;
	'contacts.delete':
		| MocoContactPerson
		| {
				/** MOCO accepted the call; it answered with no body. */ success: true;
		  };
	'contacts.get': MocoContactPerson;
	'contacts.list': {
		/** One page of results. */
		items: Array<MocoContactPerson>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'contacts.update': MocoContactPerson;
	'dealCategories.create': MocoDealCategory;
	'dealCategories.delete':
		| MocoDealCategory
		| {
				/** MOCO accepted the call; it answered with no body. */ success: true;
		  };
	'dealCategories.get': MocoDealCategory;
	'dealCategories.list': {
		/** One page of results. */
		items: Array<MocoDealCategory>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'dealCategories.update': MocoDealCategory;
	'deals.create': MocoDeal;
	'deals.delete':
		| MocoDeal
		| {
				/** MOCO accepted the call; it answered with no body. */ success: true;
		  };
	'deals.get': MocoDeal;
	'deals.list': {
		/** One page of results. */
		items: Array<MocoDeal>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'deals.update': MocoDeal;
	'invoiceReminders.create': MocoInvoiceReminderRecord;
	'invoiceReminders.delete':
		| MocoInvoiceReminderRecord
		| {
				/** MOCO accepted the call; it answered with no body. */ success: true;
		  };
	'invoiceReminders.get': MocoInvoiceReminderRecord;
	'invoiceReminders.list': {
		/** One page of results. */
		items: Array<MocoInvoiceReminderRecord>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'invoiceReminders.sendEmail': MocoInvoiceSendEmailResponse;
	'invoices.attachments.create': MocoSalesDocumentAttachment;
	'invoices.attachments.delete':
		| MocoSalesDocumentAttachment
		| {
				/** MOCO accepted the call; it answered with no body. */ success: true;
		  };
	'invoices.attachments.list': Array<MocoSalesDocumentAttachment>;
	'invoices.bookkeepingExports.create': MocoInvoiceBookkeepingExport;
	'invoices.bookkeepingExports.get': MocoInvoiceBookkeepingExport;
	'invoices.bookkeepingExports.list': {
		/** One page of results. */
		items: Array<MocoInvoiceBookkeepingExport>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'invoices.create': MocoInvoiceDetail;
	'invoices.delete': {
		/** MOCO accepted the call; it answered with no body. */
		success: true;
	};
	'invoices.get': MocoInvoiceDetail;
	'invoices.getPdf': FileOutput;
	'invoices.getTimesheet': Array<MocoActivity>;
	'invoices.getTimesheetPdf': FileOutput;
	'invoices.list': {
		/** One page of results. */
		items: Array<MocoInvoice>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'invoices.listExpenses': Array<MocoExpense>;
	'invoices.listLocked': {
		/** One page of results. */
		items: Array<MocoInvoice>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'invoices.payments.bulkCreate': Array<MocoInvoicePayment>;
	'invoices.payments.create': MocoInvoicePayment;
	'invoices.payments.delete':
		| MocoInvoicePayment
		| {
				/** MOCO accepted the call; it answered with no body. */ success: true;
		  };
	'invoices.payments.get': MocoInvoicePayment;
	'invoices.payments.list': {
		/** One page of results. */
		items: Array<MocoInvoicePayment>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'invoices.payments.update': MocoInvoicePayment;
	'invoices.sendEmail': MocoInvoiceSendEmailResponse;
	'invoices.updateStatus': {
		/** MOCO accepted the call; it answered with no body. */
		success: true;
	};
	'letterPapers.list': Array<MocoLetterPaper>;
	'offerConfirmations.create': MocoOfferConfirmation;
	'offerConfirmations.delete':
		| MocoOfferConfirmation
		| {
				/** MOCO accepted the call; it answered with no body. */ success: true;
		  };
	'offerConfirmations.get': MocoOfferConfirmation;
	'offerConfirmations.getPdf': FileOutput;
	'offerConfirmations.list': {
		/** One page of results. */
		items: Array<MocoOfferConfirmation>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'offerConfirmations.update': MocoOfferConfirmation;
	'offers.assign': MocoOfferDetail;
	'offers.attachments.create': MocoSalesDocumentAttachment;
	'offers.attachments.delete':
		| MocoSalesDocumentAttachment
		| {
				/** MOCO accepted the call; it answered with no body. */ success: true;
		  };
	'offers.attachments.list': Array<MocoSalesDocumentAttachment>;
	'offers.create': MocoOfferDetail;
	'offers.customerApproval.activate': MocoOfferCustomerApproval;
	'offers.customerApproval.deactivate': MocoOfferCustomerApproval;
	'offers.customerApproval.get': MocoOfferCustomerApproval;
	'offers.delete':
		| MocoOfferDetail
		| {
				/** MOCO accepted the call; it answered with no body. */ success: true;
		  };
	'offers.get': MocoOfferDetail;
	'offers.getPdf': FileOutput;
	'offers.list': {
		/** One page of results. */
		items: Array<MocoOffer>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'offers.sendEmail': MocoOfferSendEmailResponse;
	'offers.update': MocoOfferDetail;
	'offers.updateStatus': {
		/** MOCO accepted the call; it answered with no body. */
		success: true;
	};
	'plannedPurchases.create': MocoPlannedPurchase;
	'plannedPurchases.delete':
		| MocoPlannedPurchase
		| {
				/** MOCO accepted the call; it answered with no body. */ success: true;
		  };
	'plannedPurchases.get': MocoPlannedPurchase;
	'plannedPurchases.list': {
		/** One page of results. */
		items: Array<MocoPlannedPurchase>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'plannedPurchases.update': MocoPlannedPurchase;
	'planningEntries.create': MocoPlanningEntry;
	'planningEntries.delete':
		| MocoPlanningEntry
		| {
				/** MOCO accepted the call; it answered with no body. */ success: true;
		  };
	'planningEntries.get': MocoPlanningEntry;
	'planningEntries.list': {
		/** One page of results. */
		items: Array<MocoPlanningEntry>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'planningEntries.update': MocoPlanningEntry;
	'profile.get': MocoProfile;
	'profile.performanceReport': MocoUserPerformanceReport;
	'projects.archive': MocoProject;
	'projects.assignProjectGroup': MocoProject;
	'projects.contracts.create': MocoContract;
	'projects.contracts.delete':
		| MocoContract
		| {
				/** MOCO accepted the call; it answered with no body. */ success: true;
		  };
	'projects.contracts.get': MocoContract;
	'projects.contracts.list': {
		/** One page of results. */
		items: Array<MocoContract>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'projects.contracts.update': MocoContract;
	'projects.create': MocoProject;
	'projects.delete':
		| MocoProject
		| {
				/** MOCO accepted the call; it answered with no body. */ success: true;
		  };
	'projects.disableShare': MocoProjectShareState;
	'projects.expenses.bulkCreate': Array<MocoExpense>;
	'projects.expenses.create': MocoExpense;
	'projects.expenses.delete':
		| MocoExpense
		| {
				/** MOCO accepted the call; it answered with no body. */ success: true;
		  };
	'projects.expenses.disregard': {
		/** MOCO accepted the call; it answered with no body. */
		success: true;
	};
	'projects.expenses.get': MocoExpense;
	'projects.expenses.list': {
		/** One page of results. */
		items: Array<MocoExpense>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'projects.expenses.listAll': {
		/** One page of results. */
		items: Array<MocoExpense>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'projects.expenses.update': MocoExpense;
	'projects.get': MocoProject;
	'projects.groups.get': MocoProjectGroup;
	'projects.groups.list': {
		/** One page of results. */
		items: Array<MocoProjectGroup>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'projects.list': {
		/** One page of results. */
		items: Array<MocoProject>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'projects.listAssigned': Array<MocoAssignedProject>;
	'projects.paymentSchedules.create': MocoProjectPaymentSchedule;
	'projects.paymentSchedules.delete':
		| MocoProjectPaymentSchedule
		| {
				/** MOCO accepted the call; it answered with no body. */ success: true;
		  };
	'projects.paymentSchedules.get': MocoProjectPaymentSchedule;
	'projects.paymentSchedules.list': {
		/** One page of results. */
		items: Array<MocoProjectPaymentSchedule>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'projects.paymentSchedules.listAll': {
		/** One page of results. */
		items: Array<MocoProjectPaymentSchedule>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'projects.paymentSchedules.update': MocoProjectPaymentSchedule;
	'projects.recurringExpenses.create': MocoRecurringExpense;
	'projects.recurringExpenses.delete':
		| MocoRecurringExpense
		| {
				/** MOCO accepted the call; it answered with no body. */ success: true;
		  };
	'projects.recurringExpenses.get': MocoRecurringExpense;
	'projects.recurringExpenses.list': {
		/** One page of results. */
		items: Array<MocoRecurringExpense>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'projects.recurringExpenses.recur': MocoExpense;
	'projects.recurringExpenses.update': MocoRecurringExpense;
	'projects.report': MocoProjectReport;
	'projects.share': MocoProjectShareState;
	'projects.tasks.create': MocoTask;
	'projects.tasks.delete':
		| MocoTask
		| {
				/** MOCO accepted the call; it answered with no body. */ success: true;
		  };
	'projects.tasks.deleteAll': {
		/** MOCO accepted the call; it answered with no body. */
		success: true;
	};
	'projects.tasks.get': MocoTask;
	'projects.tasks.list': {
		/** One page of results. */
		items: Array<MocoTask>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'projects.tasks.update': MocoTask;
	'projects.unarchive': MocoProject;
	'projects.unassignProjectGroup': MocoProject;
	'projects.update': MocoProject;
	'purchases.assignToProject': {
		/** MOCO accepted the call; it answered with no body. */
		success: true;
	};
	'purchases.bookkeepingExports.create': MocoPurchaseBookkeepingExport;
	'purchases.bookkeepingExports.get': MocoPurchaseBookkeepingExport;
	'purchases.bookkeepingExports.list': {
		/** One page of results. */
		items: Array<MocoPurchaseBookkeepingExport>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'purchases.budgets.create': MocoPurchaseBudget;
	'purchases.budgets.delete':
		| MocoPurchaseBudget
		| {
				/** MOCO accepted the call; it answered with no body. */ success: true;
		  };
	'purchases.budgets.list': Array<MocoPurchaseBudget>;
	'purchases.budgets.update': MocoPurchaseBudget;
	'purchases.budgets.updateTarget': MocoPurchaseBudget;
	'purchases.categories.get': MocoPurchaseCategory;
	'purchases.categories.list': {
		/** One page of results. */
		items: Array<MocoPurchaseCategory>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'purchases.create': MocoPurchase;
	'purchases.delete':
		| MocoPurchase
		| {
				/** MOCO accepted the call; it answered with no body. */ success: true;
		  };
	'purchases.drafts.create': MocoPurchaseDraft;
	'purchases.drafts.delete':
		| MocoPurchaseDraft
		| {
				/** MOCO accepted the call; it answered with no body. */ success: true;
		  };
	'purchases.drafts.get': MocoPurchaseDraft;
	'purchases.drafts.getPdf': FileOutput;
	'purchases.drafts.list': {
		/** One page of results. */
		items: Array<MocoPurchaseDraft>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'purchases.get': MocoPurchase;
	'purchases.list': {
		/** One page of results. */
		items: Array<MocoPurchase>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'purchases.payments.bulkCreate': Array<MocoPurchasePayment>;
	'purchases.payments.create': MocoPurchasePayment;
	'purchases.payments.delete':
		| MocoPurchasePayment
		| {
				/** MOCO accepted the call; it answered with no body. */ success: true;
		  };
	'purchases.payments.get': MocoPurchasePayment;
	'purchases.payments.list': {
		/** One page of results. */
		items: Array<MocoPurchasePayment>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'purchases.payments.update': MocoPurchasePayment;
	'purchases.storeDocument': {
		/** MOCO accepted the call; it answered with no body. */
		success: true;
	};
	'purchases.update': MocoPurchase;
	'purchases.updateStatus': {
		/** MOCO accepted the call; it answered with no body. */
		success: true;
	};
	'receipts.create': MocoReceipt;
	'receipts.delete':
		| MocoReceipt
		| {
				/** MOCO accepted the call; it answered with no body. */ success: true;
		  };
	'receipts.get': MocoReceipt;
	'receipts.list': {
		/** One page of results. */
		items: Array<MocoReceipt>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'receipts.update': MocoReceipt;
	'recurringExpenses.list': {
		/** One page of results. */
		items: Array<MocoRecurringExpense>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'reports.absences': Array<MocoAbsenceRow>;
	'reports.cashflow': {
		/** One page of results. */
		items: Array<MocoCashflowRow>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'reports.finance': {
		/** One page of results. */
		items: Array<MocoFinanceRow>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'reports.plannedVsTracked': {
		/** One page of results. */
		items: Array<MocoPlannedVsTrackedRow>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'reports.utilization': Array<MocoUtilizationRow>;
	'revenueCategories.create': MocoRevenueCategory;
	'revenueCategories.delete':
		| MocoRevenueCategory
		| {
				/** MOCO accepted the call; it answered with no body. */ success: true;
		  };
	'revenueCategories.get': MocoRevenueCategory;
	'revenueCategories.list': {
		/** One page of results. */
		items: Array<MocoRevenueCategory>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'revenueCategories.update': MocoRevenueCategory;
	'schedules.create': MocoSchedule;
	'schedules.delete':
		| MocoSchedule
		| {
				/** MOCO accepted the call; it answered with no body. */ success: true;
		  };
	'schedules.get': MocoSchedule;
	'schedules.list': {
		/** One page of results. */
		items: Array<MocoSchedule>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'schedules.update': MocoSchedule;
	'session.verify': MocoSessionShowResponse;
	'taggings.add': Array<string>;
	'taggings.list': Array<string>;
	'taggings.remove':
		| Array<string>
		| {
				/** MOCO accepted the call; it answered with no body. */ success: true;
		  };
	'taggings.replace': Array<string>;
	'tags.create': MocoTag;
	'tags.delete':
		| MocoTag
		| {
				/** MOCO accepted the call; it answered with no body. */ success: true;
		  };
	'tags.get': MocoTag;
	'tags.list': {
		/** One page of results. */
		items: Array<MocoTag>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'tags.update': MocoTag;
	'todos.get': MocoTodo;
	'todos.list': {
		/** One page of results. */
		items: Array<MocoTodo>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'units.create': MocoUnit;
	'units.delete':
		| MocoUnit
		| {
				/** MOCO accepted the call; it answered with no body. */ success: true;
		  };
	'units.get': MocoUnit;
	'units.list': {
		/** One page of results. */
		items: Array<MocoUnit>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'units.update': MocoUnit;
	'users.absenceRequests.create': MocoUserAbsenceRequest;
	'users.absenceRequests.delete':
		| MocoUserAbsenceRequest
		| {
				/** MOCO accepted the call; it answered with no body. */ success: true;
		  };
	'users.absenceRequests.get': MocoUserAbsenceRequest;
	'users.absenceRequests.list': {
		/** One page of results. */
		items: Array<MocoUserAbsenceRequest>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'users.create': MocoUser;
	'users.delete':
		| MocoUser
		| {
				/** MOCO accepted the call; it answered with no body. */ success: true;
		  };
	'users.employments.create': MocoUserEmployment;
	'users.employments.delete':
		| MocoUserEmployment
		| {
				/** MOCO accepted the call; it answered with no body. */ success: true;
		  };
	'users.employments.get': MocoUserEmployment;
	'users.employments.list': {
		/** One page of results. */
		items: Array<MocoUserEmployment>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'users.employments.update': MocoUserEmployment;
	'users.get': MocoUser;
	'users.holidays.create': MocoUserHoliday;
	'users.holidays.delete':
		| MocoUserHoliday
		| {
				/** MOCO accepted the call; it answered with no body. */ success: true;
		  };
	'users.holidays.get': MocoUserHoliday;
	'users.holidays.list': {
		/** One page of results. */
		items: Array<MocoUserHoliday>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'users.holidays.update': MocoUserHoliday;
	'users.list': {
		/** One page of results. */
		items: Array<MocoUser>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'users.performanceReport': MocoUserPerformanceReport;
	'users.presences.create': MocoUserPresence;
	'users.presences.delete':
		| MocoUserPresence
		| {
				/** MOCO accepted the call; it answered with no body. */ success: true;
		  };
	'users.presences.get': MocoUserPresence;
	'users.presences.list': {
		/** One page of results. */
		items: Array<MocoUserPresence>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'users.presences.touch': MocoUserPresence;
	'users.presences.update': MocoUserPresence;
	'users.roles.list': Array<MocoUserRole>;
	'users.update': MocoUser;
	'users.workTimeAdjustments.create': MocoUserWorkTimeAdjustment;
	'users.workTimeAdjustments.delete':
		| MocoUserWorkTimeAdjustment
		| {
				/** MOCO accepted the call; it answered with no body. */ success: true;
		  };
	'users.workTimeAdjustments.get': MocoUserWorkTimeAdjustment;
	'users.workTimeAdjustments.list': {
		/** One page of results. */
		items: Array<MocoUserWorkTimeAdjustment>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'users.workTimeAdjustments.update': MocoUserWorkTimeAdjustment;
	'vatCodePurchases.get': MocoVatCodePurchase;
	'vatCodePurchases.list': {
		/** One page of results. */
		items: Array<MocoVatCodePurchase>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'vatCodeSales.get': MocoVatCodeSale;
	'vatCodeSales.list': {
		/** One page of results. */
		items: Array<MocoVatCodeSale>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
};
