import { z } from 'zod';

// Inputs use Moco's own parameter names. Outputs are `.loose()` and their
// documented fields nullish, so a field Moco adds or omits cannot fail a call
// that has already happened. Source: the official OpenAPI spec at
// https://docs.mocoapp.com/api/docs/v1/openapi.json (components/schemas).

/** Moco's default page: lists come back with up to 100 entries per page. */
export const MOCO_DEFAULT_PAGE_SIZE = 100;

const DateSchema = z
	.string()
	.regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be a yyyy-mm-dd date');

const PageSchema = z
	.number()
	.int()
	.positive()
	.optional()
	.describe(
		`1-based page. Moco pages with ${MOCO_DEFAULT_PAGE_SIZE} entries per default page; next_page is null once a page comes back short.`,
	);

// ── shared entity refs ────────────────────────────────────────────────────

const UserRefSchema = z
	.object({
		id: z.number().nullish(),
		firstname: z.string().nullish(),
		lastname: z.string().nullish(),
	})
	.loose();

const ProjectRefSchema = z
	.object({
		id: z.number().nullish(),
		identifier: z.string().nullish(),
		name: z.string().nullish(),
		billable: z.boolean().nullish(),
	})
	.loose();

const TaskRefSchema = z
	.object({
		id: z.number().nullish(),
		name: z.string().nullish(),
		billable: z.boolean().nullish(),
	})
	.loose();

const CompanyRefSchema = z
	.object({
		id: z.number().nullish(),
		name: z.string().nullish(),
	})
	.loose();

const DealRefSchema = z
	.object({
		id: z.number().nullish(),
		name: z.string().nullish(),
	})
	.loose();

// unknown: custom properties are account-defined key/value pairs.
// unknown: custom properties are account-defined key/value pairs whose
// names and value types Moco does not publish.
const CustomPropertiesSchema = z.record(z.string(), z.unknown()).nullish();

// unknown: custom property values are written through and validated by
// Moco against its own field definitions.
export type CustomPropertiesInput = Record<string, unknown>;

const CustomPropertiesInputSchema = z
	.record(z.string(), z.unknown())
	.optional();

const Timestamps = {
	created_at: z.string().nullish(),
	updated_at: z.string().nullish(),
};

// ── session.verify ────────────────────────────────────────────────────────

const SessionVerifyResponseSchema = z
	.object({
		id: z.number(),
		uuid: z.string(),
	})
	.loose();

export type SessionVerifyResponse = z.infer<typeof SessionVerifyResponseSchema>;

// ── profile.get ───────────────────────────────────────────────────────────

const ProfileSchema = z
	.object({
		id: z.number().nullish(),
		uuid: z.string().nullish(),
		firstname: z.string().nullish(),
		lastname: z.string().nullish(),
		email: z.string().nullish(),
		role: z.string().nullish(),
		language: z.string().nullish(),
		locale: z.string().nullish(),
		gender: z.string().nullish(),
		birthday: z.string().nullish(),
		custom_properties: CustomPropertiesSchema,
		created_at: z.string().nullish(),
		updated_at: z.string().nullish(),
	})
	.loose();

export type Profile = z.infer<typeof ProfileSchema>;

const ProfileGetResponseSchema = ProfileSchema;

// ── activities ────────────────────────────────────────────────────────────

export const MOCO_REMOTE_SERVICES = [
	'trello',
	'jira',
	'asana',
	'basecamp',
	'wunderlist',
	'basecamp2',
	'basecamp3',
	'toggl',
	'mite',
	'github',
	'youtrack',
] as const;

const RemoteServiceSchema = z.enum(MOCO_REMOTE_SERVICES);

const ActivitySchema = z
	.object({
		id: z.number().nullish(),
		date: z.string().nullish(),
		hours: z.number().nullish(),
		description: z.string().nullish(),
		billed: z.boolean().nullish(),
		billable: z.boolean().nullish(),
		invoice_id: z.number().nullish(),
		tag: z.string().nullish(),
		remote_service: z.string().nullish(),
		remote_id: z.string().nullish(),
		remote_url: z.string().nullish(),
		project: ProjectRefSchema.nullish(),
		task: TaskRefSchema.nullish(),
		customer: CompanyRefSchema.nullish(),
		user: UserRefSchema.nullish(),
		deal: DealRefSchema.nullish(),
		hourly_rate: z.number().nullish(),
		seconds: z.number().nullish(),
		worked_seconds: z.number().nullish(),
		timer_started_at: z.string().nullish(),
		custom_properties: CustomPropertiesSchema,
		...Timestamps,
	})
	.loose();

export type Activity = z.infer<typeof ActivitySchema>;

const ActivitiesListInputSchema = z.object({
	from: DateSchema.optional().describe(
		'Only activities on or after this date.',
	),
	to: DateSchema.optional().describe('Only activities on or before this date.'),
	user_id: z.number().int().positive().optional(),
	task_id: z.number().int().positive().optional(),
	company_id: z.number().int().positive().optional(),
	project_id: z.number().int().positive().optional(),
	deal_id: z.number().int().positive().optional(),
	billable: z.boolean().optional(),
	billed: z.boolean().optional(),
	term: z.string().optional().describe('Full-text search term.'),
	tag: z.string().optional(),
	remote_id: z.string().optional(),
	page: PageSchema,
});

export type ActivitiesListInput = z.input<typeof ActivitiesListInputSchema>;

const ActivityUpsertSchema = z
	.object({
		date: DateSchema.optional(),
		project_id: z.number().int().positive().optional(),
		task_id: z.number().int().positive().optional(),
		company_id: z.number().int().positive().optional(),
		hours: z
			.number()
			.positive()
			.optional()
			.describe('Tracked hours as a decimal; seconds are derived.'),
		seconds: z
			.number()
			.int()
			.positive()
			.optional()
			.describe('Tracked seconds; hours are derived.'),
		description: z.string().optional(),
		tag: z.string().optional(),
		billable: z.boolean().optional(),
		remote_service: RemoteServiceSchema.optional(),
		remote_url: z.string().url().optional(),
		remote_id: z.string().optional(),
		stop_timer: z.boolean().optional(),
	})
	.superRefine((value, ctx) => {
		if (value.hours !== undefined && value.seconds !== undefined) {
			ctx.addIssue({
				code: 'custom',
				message: 'send hours or seconds, not both',
			});
		}
	});

export type ActivityUpsertInput = z.input<typeof ActivityUpsertSchema>;

const ActivityGetResponseSchema = ActivitySchema;

const ActivityDeleteResponseSchema = z.object({
	success: z.literal(true),
	id: z.number(),
});

export type ActivityDeleteResponse = z.infer<
	typeof ActivityDeleteResponseSchema
>;

// ── list wrapper (Moco pages with 100 entries by default) ─────────────────

// unknown: raw is the bare array Moco returns for a list call.
// unknown: raw is the bare array Moco returns for a list call.
export function wrapListPage(
	raw: unknown,
	page: number | undefined,
): { items: unknown[]; next_page: number | null } {
	if (!Array.isArray(raw)) {
		throw new Error('Moco list endpoint returned no array');
	}
	const current = page ?? 1;
	return {
		items: raw,
		// Pagination state arrives in response headers the client cannot
		// return, so a full default page is treated as "probably more".
		next_page: raw.length >= MOCO_DEFAULT_PAGE_SIZE ? current + 1 : null,
	};
}

// ── projects ──────────────────────────────────────────────────────────────

const ProjectSchema = z
	.object({
		id: z.number().nullish(),
		identifier: z.string().nullish(),
		name: z.string().nullish(),
		active: z.boolean().nullish(),
		billable: z.boolean().nullish(),
		fixed_price: z.boolean().nullish(),
		retainer: z.boolean().nullish(),
		start_date: z.string().nullish(),
		finish_date: z.string().nullish(),
		currency: z.string().nullish(),
		billing_variant: z.string().nullish(),
		budget: z.number().nullish(),
		budget_monthly: z.number().nullish(),
		budget_expenses: z.number().nullish(),
		hourly_rate: z.number().nullish(),
		info: z.string().nullish(),
		color: z.string().nullish(),
		tags: z.array(z.string()).nullish(),
		custom_properties: CustomPropertiesSchema,
		leader: UserRefSchema.nullish(),
		co_leader: UserRefSchema.nullish(),
		customer: CompanyRefSchema.nullish(),
		deal: DealRefSchema.nullish(),
		project_group: z
			.object({ id: z.number().nullish(), name: z.string().nullish() })
			.loose()
			.nullish(),
		billing_contact: UserRefSchema.nullish(),
		contact: UserRefSchema.nullish(),
		secondary_contact: UserRefSchema.nullish(),
		archived_on: z.string().nullish(),
		...Timestamps,
	})
	.loose();

export type Project = z.infer<typeof ProjectSchema>;

const ProjectsListInputSchema = z.object({
	include_archived: z.boolean().optional(),
	company_id: z.number().int().positive().optional(),
	leader_id: z.number().int().positive().optional(),
	project_group_id: z.number().int().positive().optional(),
	deal_id: z.number().int().positive().optional(),
	created_from: DateSchema.optional(),
	created_to: DateSchema.optional(),
	updated_from: DateSchema.optional(),
	updated_to: DateSchema.optional(),
	tags: z.string().optional().describe('Comma-separated tags.'),
	identifier: z.string().optional(),
	retainer: z.boolean().optional(),
	term: z.string().optional(),
	page: PageSchema,
});

export type ProjectsListInput = z.input<typeof ProjectsListInputSchema>;

const ProjectUpsertSchema = z.object({
	identifier: z.string().optional(),
	name: z.string().min(1).optional(),
	company_id: z.number().int().positive().optional(),
	leader_id: z.number().int().positive().optional(),
	co_leader_id: z.number().int().positive().optional(),
	contact_id: z.number().int().positive().optional(),
	secondary_contact_id: z.number().int().positive().optional(),
	billing_contact_id: z.number().int().positive().optional(),
	deal_id: z.number().int().positive().optional(),
	project_group_id: z.number().int().positive().optional(),
	currency: z
		.string()
		.min(3)
		.max(3)
		.optional()
		.describe('Three-letter currency code.'),
	hourly_rate: z.number().optional(),
	budget: z.number().optional(),
	budget_monthly: z.number().optional(),
	budget_expenses: z.number().optional(),
	start_date: DateSchema.optional(),
	finish_date: DateSchema.optional(),
	fixed_price: z.boolean().optional(),
	retainer: z.boolean().optional(),
	billing_variant: z.string().optional(),
	billing_address: z.string().optional(),
	billing_email_to: z.string().optional(),
	billing_email_cc: z.string().optional(),
	billing_notes: z.string().optional(),
	setting_include_time_report: z.boolean().optional(),
	info: z.string().optional(),
	color: z.string().optional(),
	skip_favorite: z.boolean().optional(),
	tags: z.array(z.string()).optional(),
	custom_properties: CustomPropertiesInputSchema,
});

export type ProjectUpsertInput = z.input<typeof ProjectUpsertSchema>;

const ProjectGetInputSchema = z.object({
	id: z.number().int().positive(),
	include_company: z.boolean().optional(),
});

export type ProjectGetInput = z.input<typeof ProjectGetInputSchema>;

/** The report body is a free-form set of indicators per the spec. */
// unknown: the report's keys depend on the project's billing setup, so the
// spec types it as an open object.
const ProjectReportSchema = z.record(z.string(), z.unknown());

export type ProjectReport = z.infer<typeof ProjectReportSchema>;

const ProjectReportResponseSchema = z.object({
	report: ProjectReportSchema,
});

export type ProjectReportResponse = z.infer<typeof ProjectReportResponseSchema>;

const ProjectArchiveResponseSchema = z.object({
	project: ProjectSchema,
});

export type ProjectArchiveResponse = z.infer<
	typeof ProjectArchiveResponseSchema
>;

// ── companies ─────────────────────────────────────────────────────────────

export const MOCO_COMPANY_TYPES = [
	'customer',
	'supplier',
	'organization',
] as const;

const CompanySchema = z
	.object({
		id: z.number().nullish(),
		type: z.string().nullish(),
		identifier: z.string().nullish(),
		name: z.string().nullish(),
		website: z.string().nullish(),
		email: z.string().nullish(),
		billing_email_cc: z.string().nullish(),
		phone: z.string().nullish(),
		fax: z.string().nullish(),
		address: z.string().nullish(),
		country_code: z.string().nullish(),
		vat_identifier: z.string().nullish(),
		iban: z.string().nullish(),
		tags: z.array(z.string()).nullish(),
		custom_properties: CustomPropertiesSchema,
		user: UserRefSchema.nullish(),
		info: z.string().nullish(),
		footer: z.string().nullish(),
		active: z.boolean().nullish(),
		archived_on: z.string().nullish(),
		currency: z.string().nullish(),
		default_invoice_due_days: z.number().nullish(),
		...Timestamps,
	})
	.loose();

export type Company = z.infer<typeof CompanySchema>;

const CompaniesListInputSchema = z.object({
	include_archived: z.boolean().optional(),
	type: z.enum(MOCO_COMPANY_TYPES).optional(),
	tags: z.string().optional().describe('Comma-separated tags.'),
	identifier: z.string().optional(),
	term: z.string().optional(),
	page: PageSchema,
});

export type CompaniesListInput = z.input<typeof CompaniesListInputSchema>;

const CompanyUpsertSchema = z.object({
	name: z.string().min(1).optional(),
	type: z.enum(MOCO_COMPANY_TYPES).optional(),
	identifier: z.string().optional(),
	email: z.string().optional(),
	website: z.string().optional(),
	phone: z.string().optional(),
	fax: z.string().optional(),
	address: z.string().optional(),
	country_code: z.string().optional(),
	currency: z
		.string()
		.min(3)
		.max(3)
		.optional()
		.describe('Three-letter currency code.'),
	vat_identifier: z.string().optional(),
	iban: z.string().optional(),
	info: z.string().optional(),
	footer: z.string().optional(),
	default_invoice_due_days: z.number().int().positive().optional(),
	billing_email_cc: z.string().optional(),
	billing_notes: z.string().optional(),
	user_id: z.number().int().positive().optional(),
	tags: z.array(z.string()).optional(),
	custom_properties: CustomPropertiesInputSchema,
});

export type CompanyUpsertInput = z.input<typeof CompanyUpsertSchema>;

const CompanyArchiveResponseSchema = z.object({
	company: CompanySchema,
});

export type CompanyArchiveResponse = z.infer<
	typeof CompanyArchiveResponseSchema
>;

// ── contacts ──────────────────────────────────────────────────────────────

export const MOCO_GENDERS = ['U', 'M', 'F'] as const;

const ContactPersonSchema = z
	.object({
		id: z.number().nullish(),
		gender: z.string().nullish(),
		firstname: z.string().nullish(),
		lastname: z.string().nullish(),
		title: z.string().nullish(),
		job_position: z.string().nullish(),
		mobile_phone: z.string().nullish(),
		work_phone: z.string().nullish(),
		work_fax: z.string().nullish(),
		work_email: z.string().nullish(),
		work_address: z.string().nullish(),
		home_email: z.string().nullish(),
		home_address: z.string().nullish(),
		birthday: z.string().nullish(),
		salutation: z.string().nullish(),
		info: z.string().nullish(),
		avatar_url: z.string().nullish(),
		tags: z.array(z.string()).nullish(),
		custom_properties: CustomPropertiesSchema,
		company: CompanyRefSchema.nullish(),
		user: UserRefSchema.nullish(),
		...Timestamps,
	})
	.loose();

export type ContactPerson = z.infer<typeof ContactPersonSchema>;

const ContactsListInputSchema = z.object({
	tags: z.string().optional().describe('Comma-separated tags.'),
	term: z.string().optional(),
	phone: z.string().optional(),
	page: PageSchema,
});

export type ContactsListInput = z.input<typeof ContactsListInputSchema>;

const ContactUpsertSchema = z.object({
	gender: z
		.enum(MOCO_GENDERS)
		.optional()
		.describe('U unknown, M male, F female.'),
	firstname: z.string().optional(),
	lastname: z.string().optional(),
	title: z.string().optional(),
	job_position: z.string().optional(),
	mobile_phone: z.string().optional(),
	work_phone: z.string().optional(),
	work_email: z.string().optional(),
	work_address: z.string().optional(),
	home_email: z.string().optional(),
	home_address: z.string().optional(),
	birthday: DateSchema.optional(),
	salutation: z.string().optional(),
	info: z.string().optional(),
	company_id: z.number().int().positive().optional(),
	user_id: z.number().int().positive().optional(),
	tags: z.array(z.string()).optional(),
	custom_properties: CustomPropertiesInputSchema,
});

export type ContactUpsertInput = z.input<typeof ContactUpsertSchema>;

const ContactDeleteResponseSchema = z.object({
	success: z.literal(true),
	id: z.number(),
});

export type ContactDeleteResponse = z.infer<typeof ContactDeleteResponseSchema>;

// ── deals ─────────────────────────────────────────────────────────────────

export const MOCO_DEAL_STATUSES = [
	'potential',
	'pending',
	'won',
	'lost',
	'dropped',
] as const;

const DealSchema = z
	.object({
		id: z.number().nullish(),
		name: z.string().nullish(),
		status: z.string().nullish(),
		reminder_date: z.string().nullish(),
		closed_on: z.string().nullish(),
		money: z.number().nullish(),
		currency: z.string().nullish(),
		info: z.string().nullish(),
		tags: z.array(z.string()).nullish(),
		custom_properties: CustomPropertiesSchema,
		user: UserRefSchema.nullish(),
		person: ContactPersonSchema.nullish(),
		company: CompanyRefSchema.nullish(),
		category: z
			.object({ id: z.number().nullish(), name: z.string().nullish() })
			.loose()
			.nullish(),
		service_period_from: z.string().nullish(),
		service_period_to: z.string().nullish(),
		inbox_email_address: z.string().nullish(),
		...Timestamps,
	})
	.loose();

export type Deal = z.infer<typeof DealSchema>;

const DealsListInputSchema = z.object({
	status: z.enum(MOCO_DEAL_STATUSES).optional(),
	tags: z.string().optional().describe('Comma-separated tags.'),
	closed_from: DateSchema.optional(),
	closed_to: DateSchema.optional(),
	company_id: z.number().int().positive().optional(),
	person_id: z.number().int().positive().optional(),
	page: PageSchema,
});

export type DealsListInput = z.input<typeof DealsListInputSchema>;

const DealUpsertSchema = z.object({
	name: z.string().min(1).optional(),
	deal_category_id: z.number().int().positive().optional(),
	money: z.number().optional(),
	currency: z
		.string()
		.min(3)
		.max(3)
		.optional()
		.describe('Three-letter currency code.'),
	status: z.enum(MOCO_DEAL_STATUSES).optional(),
	company_id: z.number().int().positive().optional(),
	customer_id: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('A contact person id.'),
	person_id: z.number().int().positive().optional(),
	user_id: z.number().int().positive().optional(),
	info: z.string().optional(),
	reminder_date: DateSchema.optional(),
	closed_on: DateSchema.optional(),
	service_period_from: DateSchema.optional(),
	service_period_to: DateSchema.optional(),
	tags: z.array(z.string()).optional(),
	custom_properties: CustomPropertiesInputSchema,
});

export type DealUpsertInput = z.input<typeof DealUpsertSchema>;

const DealDeleteResponseSchema = z.object({
	success: z.literal(true),
	id: z.number(),
});

export type DealDeleteResponse = z.infer<typeof DealDeleteResponseSchema>;

// ── invoices ──────────────────────────────────────────────────────────────

export const MOCO_INVOICE_STATUSES = [
	'draft',
	'created',
	'sent',
	'partially_paid',
	'paid',
	'overdue',
	'ignored',
	'disregarded',
] as const;

export const MOCO_INVOICE_UPDATE_STATUSES = [
	'created',
	'sent',
	'overdue',
	'ignored',
] as const;

const InvoiceLineItemSchema = z
	.object({
		id: z.number().nullish(),
		position: z.number().nullish(),
		unit: z.string().nullish(),
		quantity: z.number().nullish(),
		time_entry_type: z.string().nullish(),
		description: z.string().nullish(),
		rate: z.number().nullish(),
		rate_by_hour: z.number().nullish(),
		total: z.number().nullish(),
		tax: z.number().nullish(),
		type: z.string().nullish(),
	})
	.loose();

export type InvoiceLineItem = z.infer<typeof InvoiceLineItemSchema>;

const InvoiceSchema = z
	.object({
		id: z.number().nullish(),
		customer_id: z.number().nullish(),
		project_id: z.number().nullish(),
		offer_id: z.number().nullish(),
		identifier: z.string().nullish(),
		date: z.string().nullish(),
		due_date: z.string().nullish(),
		service_period: z.string().nullish(),
		service_period_from: z.string().nullish(),
		service_period_to: z.string().nullish(),
		status: z.string().nullish(),
		reversed: z.boolean().nullish(),
		reversal: z.boolean().nullish(),
		title: z.string().nullish(),
		recipient_address: z.string().nullish(),
		currency: z.string().nullish(),
		net_total: z.number().nullish(),
		tax: z.number().nullish(),
		gross_total: z.number().nullish(),
		discount: z.number().nullish(),
		cash_discount: z.number().nullish(),
		cash_discount_days: z.number().nullish(),
		locked: z.boolean().nullish(),
		custom_properties: CustomPropertiesSchema,
		tags: z.array(z.string()).nullish(),
		user: UserRefSchema.nullish(),
		file_url: z.string().nullish(),
		...Timestamps,
	})
	.loose();

export type Invoice = z.infer<typeof InvoiceSchema>;

/** InvoiceDetail adds the line items, payments and reminders. */
const InvoiceDetailSchema = InvoiceSchema.extend({
	salutation: z.string().nullish(),
	footer: z.string().nullish(),
	items: z.array(InvoiceLineItemSchema).nullish(),
	// unknown: payment and reminder objects mirror the dedicated API
	// resources this plugin does not wrap, so they pass through.
	payments: z.array(z.record(z.string(), z.unknown())).nullish(),
	reminders: z.array(z.record(z.string(), z.unknown())).nullish(),
	internal_contact: UserRefSchema.nullish(),
	activity_hours_modified: z.boolean().nullish(),
}).loose();

export type InvoiceDetail = z.infer<typeof InvoiceDetailSchema>;

const InvoicesListInputSchema = z.object({
	status: z.enum(MOCO_INVOICE_STATUSES).optional(),
	include_disregarded: z.boolean().optional(),
	not_booked: z.boolean().optional(),
	date_from: DateSchema.optional(),
	date_to: DateSchema.optional(),
	service_period_from: DateSchema.optional(),
	service_period_to: DateSchema.optional(),
	tags: z.string().optional().describe('Comma-separated tags.'),
	identifier: z.string().optional(),
	term: z.string().optional(),
	company_id: z.number().int().positive().optional(),
	project_id: z.number().int().positive().optional(),
	page: PageSchema,
});

export type InvoicesListInput = z.input<typeof InvoicesListInputSchema>;

const InvoiceUpdateStatusInputSchema = z.object({
	id: z.number().int().positive(),
	status: z
		.enum(MOCO_INVOICE_UPDATE_STATUSES)
		.describe('The API accepts created, sent, overdue and ignored here.'),
});

export type InvoiceUpdateStatusInput = z.input<
	typeof InvoiceUpdateStatusInputSchema
>;

const InvoiceUpdateStatusResponseSchema = z.object({
	success: z.literal(true),
	id: z.number(),
});

export type InvoiceUpdateStatusResponse = z.infer<
	typeof InvoiceUpdateStatusResponseSchema
>;

// ── users ─────────────────────────────────────────────────────────────────

const UserSchema = z
	.object({
		id: z.number().nullish(),
		firstname: z.string().nullish(),
		lastname: z.string().nullish(),
		active: z.boolean().nullish(),
		extern: z.boolean().nullish(),
		email: z.string().nullish(),
		mobile_phone: z.string().nullish(),
		work_phone: z.string().nullish(),
		home_address: z.string().nullish(),
		info: z.string().nullish(),
		birthday: z.string().nullish(),
		avatar_url: z.string().nullish(),
		tags: z.array(z.string()).nullish(),
		custom_properties: CustomPropertiesSchema,
		role: z
			.object({ id: z.number().nullish(), name: z.string().nullish() })
			.loose()
			.nullish(),
		unit: z
			.object({ id: z.number().nullish(), name: z.string().nullish() })
			.loose()
			.nullish(),
		...Timestamps,
	})
	.loose();

export type MocoUser = z.infer<typeof UserSchema>;

const UsersListInputSchema = z.object({
	include_archived: z.boolean().optional(),
	email: z.string().optional(),
	tags: z.string().optional().describe('Comma-separated tags.'),
	page: PageSchema,
});

export type UsersListInput = z.input<typeof UsersListInputSchema>;

const UserGetInputSchema = z.object({
	id: z.number().int().positive(),
});

export type UserGetInput = z.input<typeof UserGetInputSchema>;

// ── generic id input for get/update/delete paths ──────────────────────────

const IdInputSchema = z.object({
	id: z.number().int().positive(),
});

export type IdInput = z.input<typeof IdInputSchema>;

// ── Registry ──────────────────────────────────────────────────────────────

export type MocoEndpointInputs = {
	sessionVerify: Record<string, never>;
	profileGet: Record<string, never>;
	activitiesList: ActivitiesListInput;
	activitiesGet: IdInput;
	activitiesCreate: ActivityUpsertInput;
	activitiesUpdate: ActivityUpsertInput & IdInput;
	activitiesDelete: IdInput;
	projectsList: ProjectsListInput;
	projectsGet: ProjectGetInput;
	projectsCreate: ProjectUpsertInput;
	projectsUpdate: ProjectUpsertInput & IdInput;
	projectsArchive: IdInput;
	projectsUnarchive: IdInput;
	projectsReport: IdInput;
	companiesList: CompaniesListInput;
	companiesGet: IdInput;
	companiesCreate: CompanyUpsertInput;
	companiesUpdate: CompanyUpsertInput & IdInput;
	companiesArchive: IdInput;
	companiesUnarchive: IdInput;
	contactsList: ContactsListInput;
	contactsGet: IdInput;
	contactsCreate: ContactUpsertInput;
	contactsUpdate: ContactUpsertInput & IdInput;
	contactsDelete: IdInput;
	dealsList: DealsListInput;
	dealsGet: IdInput;
	dealsCreate: DealUpsertInput;
	dealsUpdate: DealUpsertInput & IdInput;
	dealsDelete: IdInput;
	invoicesList: InvoicesListInput;
	invoicesGet: IdInput;
	invoicesUpdateStatus: InvoiceUpdateStatusInput;
	usersList: UsersListInput;
	usersGet: UserGetInput;
};

export type MocoEndpointOutputs = {
	sessionVerify: SessionVerifyResponse;
	profileGet: Profile;
	activitiesList: { items: Activity[]; next_page: number | null };
	activitiesGet: Activity;
	activitiesCreate: Activity;
	activitiesUpdate: Activity;
	activitiesDelete: ActivityDeleteResponse;
	projectsList: { items: Project[]; next_page: number | null };
	projectsGet: Project;
	projectsCreate: Project;
	projectsUpdate: Project;
	projectsArchive: ProjectArchiveResponse;
	projectsUnarchive: ProjectArchiveResponse;
	projectsReport: ProjectReportResponse;
	companiesList: { items: Company[]; next_page: number | null };
	companiesGet: Company;
	companiesCreate: Company;
	companiesUpdate: Company;
	companiesArchive: CompanyArchiveResponse;
	companiesUnarchive: CompanyArchiveResponse;
	contactsList: { items: ContactPerson[]; next_page: number | null };
	contactsGet: ContactPerson;
	contactsCreate: ContactPerson;
	contactsUpdate: ContactPerson;
	contactsDelete: ContactDeleteResponse;
	dealsList: { items: Deal[]; next_page: number | null };
	dealsGet: Deal;
	dealsCreate: Deal;
	dealsUpdate: Deal;
	dealsDelete: DealDeleteResponse;
	invoicesList: { items: Invoice[]; next_page: number | null };
	invoicesGet: InvoiceDetail;
	invoicesUpdateStatus: InvoiceUpdateStatusResponse;
	usersList: { items: MocoUser[]; next_page: number | null };
	usersGet: MocoUser;
};

const ListOf = <T extends z.ZodType>(item: T) =>
	z.object({
		items: z.array(item),
		next_page: z.number().nullable(),
	});

export const MocoEndpointInputSchemas = {
	sessionVerify: z.object({}).loose(),
	profileGet: z.object({}).loose(),
	activitiesList: ActivitiesListInputSchema,
	activitiesGet: IdInputSchema,
	activitiesCreate: ActivityUpsertSchema,
	activitiesUpdate: ActivityUpsertSchema.and(IdInputSchema),
	activitiesDelete: IdInputSchema,
	projectsList: ProjectsListInputSchema,
	projectsGet: ProjectGetInputSchema,
	projectsCreate: ProjectUpsertSchema,
	projectsUpdate: ProjectUpsertSchema.and(IdInputSchema),
	projectsArchive: IdInputSchema,
	projectsUnarchive: IdInputSchema,
	projectsReport: IdInputSchema,
	companiesList: CompaniesListInputSchema,
	companiesGet: IdInputSchema,
	companiesCreate: CompanyUpsertSchema,
	companiesUpdate: CompanyUpsertSchema.and(IdInputSchema),
	companiesArchive: IdInputSchema,
	companiesUnarchive: IdInputSchema,
	contactsList: ContactsListInputSchema,
	contactsGet: IdInputSchema,
	contactsCreate: ContactUpsertSchema,
	contactsUpdate: ContactUpsertSchema.and(IdInputSchema),
	contactsDelete: IdInputSchema,
	dealsList: DealsListInputSchema,
	dealsGet: IdInputSchema,
	dealsCreate: DealUpsertSchema,
	dealsUpdate: DealUpsertSchema.and(IdInputSchema),
	dealsDelete: IdInputSchema,
	invoicesList: InvoicesListInputSchema,
	invoicesGet: IdInputSchema,
	invoicesUpdateStatus: InvoiceUpdateStatusInputSchema,
	usersList: UsersListInputSchema,
	usersGet: UserGetInputSchema,
} as const;

export const MocoEndpointOutputSchemas = {
	sessionVerify: SessionVerifyResponseSchema,
	profileGet: ProfileGetResponseSchema,
	activitiesList: ListOf(ActivitySchema),
	activitiesGet: ActivityGetResponseSchema,
	activitiesCreate: ActivitySchema,
	activitiesUpdate: ActivitySchema,
	activitiesDelete: ActivityDeleteResponseSchema,
	projectsList: ListOf(ProjectSchema),
	projectsGet: ProjectSchema,
	projectsCreate: ProjectSchema,
	projectsUpdate: ProjectSchema,
	projectsArchive: ProjectArchiveResponseSchema,
	projectsUnarchive: ProjectArchiveResponseSchema,
	projectsReport: ProjectReportResponseSchema,
	companiesList: ListOf(CompanySchema),
	companiesGet: CompanySchema,
	companiesCreate: CompanySchema,
	companiesUpdate: CompanySchema,
	companiesArchive: CompanyArchiveResponseSchema,
	companiesUnarchive: CompanyArchiveResponseSchema,
	contactsList: ListOf(ContactPersonSchema),
	contactsGet: ContactPersonSchema,
	contactsCreate: ContactPersonSchema,
	contactsUpdate: ContactPersonSchema,
	contactsDelete: ContactDeleteResponseSchema,
	dealsList: ListOf(DealSchema),
	dealsGet: DealSchema,
	dealsCreate: DealSchema,
	dealsUpdate: DealSchema,
	dealsDelete: DealDeleteResponseSchema,
	invoicesList: ListOf(InvoiceSchema),
	invoicesGet: InvoiceDetailSchema,
	invoicesUpdateStatus: InvoiceUpdateStatusResponseSchema,
	usersList: ListOf(UserSchema),
	usersGet: UserSchema,
} as const;
