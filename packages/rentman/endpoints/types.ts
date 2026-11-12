import { z } from 'zod';

/** Rentman defaults to 300 records a page and caps a request at 1500. */
export const RENTMAN_DEFAULT_LIMIT = 300;
export const RENTMAN_MAX_LIMIT = 1500;

const LimitSchema = z
	.number()
	.int()
	.min(1)
	.max(RENTMAN_MAX_LIMIT)
	.optional()
	.describe(
		`Records per page, 1 to ${RENTMAN_MAX_LIMIT}. Rentman uses ${RENTMAN_DEFAULT_LIMIT} when omitted and carries the value into later pages.`,
	);

/**
 * Rentman paginates with an opaque cursor inside `next_page_url`. The docs warn
 * that the token must not be built or edited by hand, so it is passed through
 * unchanged from `next_cursor`.
 */
const CursorSchema = z
	.string()
	.optional()
	.describe(
		'The `next_cursor` from the previous page, used verbatim. Rentman warns against constructing or editing it.',
	);

/**
 * A projection is a set of field names, and `sort` is a comma-separated list
 * with `+` for ascending and `-` for descending.
 */
const FieldsSchema = z
	.array(z.string())
	.optional()
	.describe(
		'Return only these fields. `id`, `created` and `modified` always come back.',
	);

const ExpandSchema = z
	.array(z.string())
	.optional()
	.describe(
		'Inline these linked resources instead of returning a path string. Nested links use dot notation and go three levels deep at most.',
	);

const SortSchema = z
	.string()
	.optional()
	.describe(
		'A comma-separated sort, such as `+id,-firstname`: `+` ascending, `-` descending.',
	);

/** Every list query shares these four. */
const listQueryFields = {
	limit: LimitSchema,
	cursor: CursorSchema,
	fields: FieldsSchema,
	expand: ExpandSchema,
	sort: SortSchema,
};

/** A numeric filter, sent as `field[operator]=value`. */
const NumericFilterSchema = z
	.object({
		lt: z.number().optional(),
		gt: z.number().optional(),
		lte: z.number().optional(),
		gte: z.number().optional(),
		neq: z.number().optional(),
	})
	.strict()
	.optional();

/**
 * A string or date filter. Rentman accepts `eq`, `lt`, `gt`, `lte`, `gte` and
 * `neq` (and answers 400 to any other), and an ISO date reaches them as a
 * string. The object is strict so an unsupported operator fails here instead
 * of being dropped and sending an unfiltered request.
 */
const StringFilterSchema = z
	.object({
		eq: z.string().optional(),
		neq: z.string().optional(),
		lt: z.string().optional(),
		gt: z.string().optional(),
		lte: z.string().optional(),
		gte: z.string().optional(),
	})
	.strict()
	.optional();

/**
 * `next_cursor` and `next_page_url` are declared here rather than added by a
 * transform, because the docs generator reads a transform's input side and the
 * fields would be missing from the reference.
 */
const pagingFields = {
	next_cursor: z
		.string()
		.nullable()
		.describe('Pass as `cursor` to read the next page; null on the last.'),
	next_page_url: z
		.string()
		.nullable()
		.describe(
			'The absolute next-page URL, for callers that follow it directly.',
		),
	item_count: z.number().describe('Items in this page.'),
	limit: z.number().nullish(),
};

/**
 * A linked item: a path such as `/contacts/12` by default, or the linked
 * object itself when the caller names the field in `expand`.
 * unknown: an expanded object has the linked resource's own fields, which
 * depend on what was expanded.
 */
const LinkSchema = z.union([z.string(), z.record(z.string(), z.unknown())]);

/**
 * Custom fields are keyed `custom_<n>` and typed by the account's own field
 * definitions (text, number, boolean, date, ...).
 * unknown: the value type is set per account, not by the API.
 */
const CustomFieldsSchema = z.record(z.string(), z.unknown());

/** The keys every Rentman entity carries. */
const EntityBaseSchema = z
	.object({
		id: z.number().nullish(),
		created: z.string().nullish(),
		modified: z.string().nullish(),
		creator: LinkSchema.nullish(),
		displayname: z.string().nullish(),
	})
	.loose();

// ── contacts ──────────────────────────────────────────────────────────────

const ContactsListInputSchema = z.object({
	...listQueryFields,
	country: z.string().optional().describe('A two-letter country code.'),
	type: z
		.enum(['private', 'company'])
		.optional()
		.describe('The contact type: `company` or `private` (a person).'),
	folder: z
		.string()
		.optional()
		.describe(
			'The folder a contact is filed under, as a path such as `/folders/34`.',
		),
	modified: StringFilterSchema,
});

export type ContactsListInput = z.input<typeof ContactsListInputSchema>;

const ContactSchema = EntityBaseSchema.extend({
	name: z.string().nullish(),
	firstname: z.string().nullish(),
	surname: z.string().nullish(),
	ext_name_line: z.string().nullish(),
	surfix: z.string().nullish(),
	gender: z.string().nullish(),
	type: z.string().nullish(),
	code: z.string().nullish(),
	accounting_code: z.string().nullish(),
	vendor_accounting_code: z.string().nullish(),
	folder: LinkSchema.nullish(),
	// The visiting address has no `visit_country`: its country is `country`.
	country: z.string().nullish(),
	distance: z.number().nullish(),
	travel_time: z.number().nullish(),
	longitude: z.number().nullish(),
	latitude: z.number().nullish(),
	email_1: z.string().nullish(),
	email_2: z.string().nullish(),
	phone_1: z.string().nullish(),
	phone_2: z.string().nullish(),
	website: z.string().nullish(),
	VAT_code: z.string().nullish(),
	commerce_code: z.string().nullish(),
	mailing_street: z.string().nullish(),
	mailing_number: z.string().nullish(),
	mailing_unit_number: z.string().nullish(),
	mailing_district: z.string().nullish(),
	mailing_extra_address_line: z.string().nullish(),
	mailing_postalcode: z.string().nullish(),
	mailing_city: z.string().nullish(),
	mailing_state: z.string().nullish(),
	mailing_country: z.string().nullish(),
	visit_street: z.string().nullish(),
	visit_number: z.string().nullish(),
	visit_unit_number: z.string().nullish(),
	visit_district: z.string().nullish(),
	visit_extra_address_line: z.string().nullish(),
	visit_postalcode: z.string().nullish(),
	visit_city: z.string().nullish(),
	visit_state: z.string().nullish(),
	invoice_street: z.string().nullish(),
	invoice_number: z.string().nullish(),
	invoice_unit_number: z.string().nullish(),
	invoice_district: z.string().nullish(),
	invoice_extra_address_line: z.string().nullish(),
	invoice_postalcode: z.string().nullish(),
	invoice_city: z.string().nullish(),
	invoice_state: z.string().nullish(),
	invoice_country: z.string().nullish(),
	default_person: LinkSchema.nullish(),
	admin_contactperson: LinkSchema.nullish(),
	tags: z.string().nullish(),
	custom: CustomFieldsSchema.nullish(),
});

export type RentmanContact = z.infer<typeof ContactSchema>;

const ContactsListResponseSchema = z.object({
	contacts: z.array(ContactSchema),
	...pagingFields,
});

export type ContactsListResponse = z.infer<typeof ContactsListResponseSchema>;

const ContactsGetInputSchema = z.object({
	contact_id: z.number().int().positive().describe('The contact id.'),
	fields: FieldsSchema,
	expand: ExpandSchema,
});

export type ContactsGetInput = z.input<typeof ContactsGetInputSchema>;

const ContactsGetResponseSchema = z.object({ contact: ContactSchema });
export type ContactsGetResponse = z.infer<typeof ContactsGetResponseSchema>;

/**
 * A postal address. A contact carries three of these, each sent under its own
 * prefix (`mailing_`, `visit_`, `invoice_`), so the input keeps them nested and
 * the request builder folds the prefix into each field name.
 */
const AddressInputSchema = z.object({
	street: z.string().optional(),
	number: z.string().optional(),
	unit_number: z.string().optional(),
	district: z.string().optional(),
	extra_address_line: z.string().optional(),
	postalcode: z.string().optional(),
	city: z.string().optional(),
	state: z.string().optional(),
	country: z
		.string()
		.optional()
		.describe(
			'A two-letter country code, lowercase as Rentman stores it (`nl`). For the visit address it is sent as the contact `country`.',
		),
});

const ContactsWriteInputSchema = z.object({
	folder: z.string().optional(),
	type: z
		.enum(['private', 'company'])
		.optional()
		.describe(
			'`company` or `private` (a person); Rentman derives `displayname` from it.',
		),
	ext_name_line: z.string().optional(),
	name: z.string().optional().describe('The company name.'),
	firstname: z.string().optional(),
	surname: z.string().optional(),
	surfix: z.string().optional(),
	gender: z.string().optional(),
	code: z.string().optional(),
	accounting_code: z.string().optional(),
	vendor_accounting_code: z.string().optional(),
	country: z
		.string()
		.optional()
		.describe(
			'The visit address country, a two-letter code such as `nl`. Same as `visit_address.country`.',
		),
	longitude: z.number().min(-180).max(180).optional(),
	latitude: z.number().min(-90).max(90).optional(),
	distance: z.number().optional(),
	travel_time: z.number().optional(),
	email: z
		.string()
		.optional()
		.describe('The primary email address, stored as `email_1`.'),
	phone: z
		.string()
		.optional()
		.describe('The primary phone number, stored as `phone_1`.'),
	mailing_address: AddressInputSchema.optional(),
	visit_address: AddressInputSchema.optional(),
	invoice_address: AddressInputSchema.optional(),
});

export type ContactsCreateInput = z.input<typeof ContactsWriteInputSchema>;

const ContactsCreateResponseSchema = z.object({ contact: ContactSchema });
export type ContactsCreateResponse = z.infer<
	typeof ContactsCreateResponseSchema
>;

const ContactsUpdateInputSchema = ContactsWriteInputSchema.partial().extend({
	contact_id: z.number().int().positive(),
});

export type ContactsUpdateInput = z.input<typeof ContactsUpdateInputSchema>;

const ContactsUpdateResponseSchema = z.object({ contact: ContactSchema });
export type ContactsUpdateResponse = z.infer<
	typeof ContactsUpdateResponseSchema
>;

const ContactsDeleteInputSchema = z.object({
	contact_id: z.number().int().positive(),
});

export type ContactsDeleteInput = z.input<typeof ContactsDeleteInputSchema>;

const ContactsDeleteResponseSchema = z.object({
	success: z.boolean(),
	contact_id: z.number(),
});

export type ContactsDeleteResponse = z.infer<
	typeof ContactsDeleteResponseSchema
>;

// ── projects ──────────────────────────────────────────────────────────────

const ProjectsListInputSchema = z.object({
	...listQueryFields,
	name: StringFilterSchema,
	number: StringFilterSchema,
	deposit_status: z
		.string()
		.optional()
		.describe('`no_deposit_paid`, `deposit_paid` or `deposit_returned`.'),
	modified: StringFilterSchema,
});

export type ProjectsListInput = z.input<typeof ProjectsListInputSchema>;

const ProjectSchema = EntityBaseSchema.extend({
	name: z.string().nullish(),
	// Rentman's spec says string; the live API returns an integer.
	number: z.union([z.number(), z.string()]).nullish(),
	reference: z.string().nullish(),
	project_type: LinkSchema.nullish(),
	deposit_status: z.string().nullish(),
	color: z.string().nullish(),
	conditions: z.string().nullish(),
	tags: z.string().nullish(),
	// Linked resources come back as a path such as `/contacts/12` unless the
	// caller passes `expand`, which inlines the object.
	customer: LinkSchema.nullish(),
	cust_contact: LinkSchema.nullish(),
	loc_contact: LinkSchema.nullish(),
	location: LinkSchema.nullish(),
	account_manager: LinkSchema.nullish(),
	usageperiod_start: z.string().nullish(),
	usageperiod_end: z.string().nullish(),
	planperiod_start: z.string().nullish(),
	planperiod_end: z.string().nullish(),
	equipment_period_from: z.string().nullish(),
	equipment_period_to: z.string().nullish(),
	refundabledeposit: z.number().nullish(),
	project_total_price: z.number().nullish(),
	project_rental_price: z.number().nullish(),
	project_sale_price: z.number().nullish(),
	project_crew_price: z.number().nullish(),
	project_transport_price: z.number().nullish(),
	project_other_price: z.number().nullish(),
	project_insurance_price: z.number().nullish(),
	project_services_price: z.number().nullish(),
	estimated_cost: z.number().nullish(),
	planned_cost: z.number().nullish(),
	actual_cost: z.number().nullish(),
	already_invoiced: z.number().nullish(),
	weight: z.number().nullish(),
	power: z.number().nullish(),
	current: z.number().nullish(),
	purchasecosts: z.number().nullish(),
	volume: z.number().nullish(),
	custom: CustomFieldsSchema.nullish(),
});

export type RentmanProject = z.infer<typeof ProjectSchema>;

const ProjectsListResponseSchema = z.object({
	projects: z.array(ProjectSchema),
	...pagingFields,
});

export type ProjectsListResponse = z.infer<typeof ProjectsListResponseSchema>;

const ProjectsGetInputSchema = z.object({
	project_id: z.number().int().positive(),
	fields: FieldsSchema,
	expand: ExpandSchema,
});

export type ProjectsGetInput = z.input<typeof ProjectsGetInputSchema>;

const ProjectsGetResponseSchema = z.object({ project: ProjectSchema });
export type ProjectsGetResponse = z.infer<typeof ProjectsGetResponseSchema>;

/**
 * Rentman answers 400 "not permitted to set the following field: customer" to
 * a project write that names a customer, so the customer is set in the app.
 */
const ProjectsCreateInputSchema = z.object({
	name: z.string().min(1).describe('The project name.'),
	number: z.string().optional(),
	reference: z.string().optional(),
	account_manager: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('A crew member id, sent as the link `/crew/<id>`.'),
	deposit_status: z
		.enum(['no_deposit_paid', 'deposit_paid', 'deposit_returned'])
		.optional(),
	color: z.string().optional(),
	conditions: z.string().optional(),
	refundabledeposit: z.number().optional(),
});

export type ProjectsCreateInput = z.input<typeof ProjectsCreateInputSchema>;

const ProjectsCreateResponseSchema = z.object({ project: ProjectSchema });
export type ProjectsCreateResponse = z.infer<
	typeof ProjectsCreateResponseSchema
>;

const ProjectsUpdateInputSchema = ProjectsCreateInputSchema.partial().extend({
	project_id: z.number().int().positive(),
});

export type ProjectsUpdateInput = z.input<typeof ProjectsUpdateInputSchema>;

const ProjectsUpdateResponseSchema = z.object({ project: ProjectSchema });
export type ProjectsUpdateResponse = z.infer<
	typeof ProjectsUpdateResponseSchema
>;

// ── equipment ─────────────────────────────────────────────────────────────

const EquipmentListInputSchema = z.object({
	...listQueryFields,
	name: StringFilterSchema,
	code: StringFilterSchema,
	in_shop: z.boolean().optional(),
	folder: z.string().optional(),
	modified: StringFilterSchema,
});

export type EquipmentListInput = z.input<typeof EquipmentListInputSchema>;

const EquipmentSchema = EntityBaseSchema.extend({
	name: z.string().nullish(),
	code: z.string().nullish(),
	folder: LinkSchema.nullish(),
	factor_group: LinkSchema.nullish(),
	unit: z.string().nullish(),
	type: z.string().nullish(),
	taxclass: LinkSchema.nullish(),
	ledger: LinkSchema.nullish(),
	ledger_debit: LinkSchema.nullish(),
	defaultgroup: z.string().nullish(),
	country_of_origin: z.string().nullish(),
	image: LinkSchema.nullish(),
	// There is no `active` on equipment: availability is `in_shop`, `in_planner`
	// and `in_archive`.
	in_shop: z.boolean().nullish(),
	in_planner: z.boolean().nullish(),
	in_archive: z.boolean().nullish(),
	// Strings, not flags: `Rental` or `Sale`, and `Track stock` or
	// `Exclude from stock tracking`. Read as strings so a new value parses.
	rental_sales: z.string().nullish(),
	is_physical: z.string().nullish(),
	temporary: z.boolean().nullish(),
	stock_management: z.string().nullish(),
	price: z.number().nullish(),
	list_price: z.number().nullish(),
	subrental_costs: z.number().nullish(),
	critical_stock_level: z.number().nullish(),
	volume: z.number().nullish(),
	packed_per: z.number().nullish(),
	height: z.number().nullish(),
	width: z.number().nullish(),
	length: z.number().nullish(),
	weight: z.number().nullish(),
	empty_weight: z.number().nullish(),
	power: z.number().nullish(),
	current: z.number().nullish(),
	internal_remark: z.string().nullish(),
	external_remark: z.string().nullish(),
	custom: CustomFieldsSchema.nullish(),
});

export type RentmanEquipment = z.infer<typeof EquipmentSchema>;

const EquipmentListResponseSchema = z.object({
	equipment: z.array(EquipmentSchema),
	...pagingFields,
});

export type EquipmentListResponse = z.infer<typeof EquipmentListResponseSchema>;

const EquipmentGetInputSchema = z.object({
	equipment_id: z.number().int().positive(),
	fields: FieldsSchema,
	expand: ExpandSchema,
});

export type EquipmentGetInput = z.input<typeof EquipmentGetInputSchema>;

const EquipmentGetResponseSchema = z.object({ equipment: EquipmentSchema });
export type EquipmentGetResponse = z.infer<typeof EquipmentGetResponseSchema>;

const EquipmentCreateInputSchema = z.object({
	name: z.string().min(1).describe('The equipment name.'),
	code: z.string().optional(),
	in_shop: z
		.boolean()
		.optional()
		.describe(
			'Whether the item is offered in the shop. Equipment has no `active` flag.',
		),
	folder: z
		.string()
		.optional()
		.describe('A folder link such as `/folders/11`.'),
	type: z.enum(['item', 'set', 'case']).optional(),
	price: z.number().optional().describe('The rental price.'),
	list_price: z.number().optional().describe('The replacement value.'),
	weight: z.number().optional(),
	volume: z.number().optional(),
	power: z.number().optional(),
	height: z.number().optional(),
	width: z.number().optional(),
	length: z.number().optional(),
	internal_remark: z.string().optional(),
	external_remark: z.string().optional(),
});

export type EquipmentCreateInput = z.input<typeof EquipmentCreateInputSchema>;

const EquipmentCreateResponseSchema = z.object({ equipment: EquipmentSchema });
export type EquipmentCreateResponse = z.infer<
	typeof EquipmentCreateResponseSchema
>;

const EquipmentUpdateInputSchema = EquipmentCreateInputSchema.partial().extend({
	equipment_id: z.number().int().positive(),
});

export type EquipmentUpdateInput = z.input<typeof EquipmentUpdateInputSchema>;

const EquipmentUpdateResponseSchema = z.object({ equipment: EquipmentSchema });
export type EquipmentUpdateResponse = z.infer<
	typeof EquipmentUpdateResponseSchema
>;

// ── crew ──────────────────────────────────────────────────────────────────

const CrewListInputSchema = z.object({
	...listQueryFields,
	name: StringFilterSchema,
	active: z.boolean().optional(),
	modified: StringFilterSchema,
});

export type CrewListInput = z.input<typeof CrewListInputSchema>;

const CrewSchema = EntityBaseSchema.extend({
	firstname: z.string().nullish(),
	middle_name: z.string().nullish(),
	lastname: z.string().nullish(),
	email: z.string().nullish(),
	phone: z.string().nullish(),
	active: z.boolean().nullish(),
	avatar: LinkSchema.nullish(),
	folder: LinkSchema.nullish(),
	company_name: z.string().nullish(),
	external_reference: z.string().nullish(),
	tags: z.string().nullish(),
	street: z.string().nullish(),
	housenumber: z.string().nullish(),
	unit_number: z.string().nullish(),
	district: z.string().nullish(),
	city: z.string().nullish(),
	postal_code: z.string().nullish(),
	addressline2: z.string().nullish(),
	extraaddressline: z.string().nullish(),
	state: z.string().nullish(),
	country: z.string().nullish(),
	default_warehouse: LinkSchema.nullish(),
	custom: CustomFieldsSchema.nullish(),
});

export type RentmanCrewMember = z.infer<typeof CrewSchema>;

const CrewListResponseSchema = z.object({
	crew: z.array(CrewSchema),
	...pagingFields,
});

export type CrewListResponse = z.infer<typeof CrewListResponseSchema>;

const CrewGetInputSchema = z.object({
	crew_id: z.number().int().positive(),
	fields: FieldsSchema,
	expand: ExpandSchema,
});

export type CrewGetInput = z.input<typeof CrewGetInputSchema>;

const CrewGetResponseSchema = z.object({ crew: CrewSchema });
export type CrewGetResponse = z.infer<typeof CrewGetResponseSchema>;

// ── appointments ──────────────────────────────────────────────────────────

const AppointmentsListInputSchema = z.object({
	...listQueryFields,
	start: StringFilterSchema,
	end: StringFilterSchema,
	modified: StringFilterSchema,
});

export type AppointmentsListInput = z.input<typeof AppointmentsListInputSchema>;

const AppointmentSchema = EntityBaseSchema.extend({
	name: z.string().nullish(),
	start: z.string().nullish(),
	end: z.string().nullish(),
	color: z.string().nullish(),
	location: z.string().nullish(),
	remark: z.string().nullish(),
	is_public: z.boolean().nullish(),
	is_plannable: z.boolean().nullish(),
	recurrence_interval_unit: z.string().nullish(),
	recurrence_enddate: z.string().nullish(),
	recurrence_interval: z.number().nullish(),
	recurrence_group: z.number().nullish(),
	recurrence_weekdays: z.string().nullish(),
	synchronization_id: z.string().nullish(),
	synchronisation_uri: z.string().nullish(),
});

export type RentmanAppointment = z.infer<typeof AppointmentSchema>;

const AppointmentsListResponseSchema = z.object({
	appointments: z.array(AppointmentSchema),
	...pagingFields,
});

export type AppointmentsListResponse = z.infer<
	typeof AppointmentsListResponseSchema
>;

const AppointmentsGetInputSchema = z.object({
	appointment_id: z.number().int().positive(),
	fields: FieldsSchema,
	expand: ExpandSchema,
});

export type AppointmentsGetInput = z.input<typeof AppointmentsGetInputSchema>;

const AppointmentsGetResponseSchema = z.object({
	appointment: AppointmentSchema,
});

export type AppointmentsGetResponse = z.infer<
	typeof AppointmentsGetResponseSchema
>;

// ── invoices ──────────────────────────────────────────────────────────────

const InvoicesListInputSchema = z.object({
	...listQueryFields,
	number: StringFilterSchema,
	project: z.number().int().optional(),
	modified: StringFilterSchema,
});

export type InvoicesListInput = z.input<typeof InvoicesListInputSchema>;

const InvoiceSchema = EntityBaseSchema.extend({
	number: z.string().nullish(),
	subject: z.string().nullish(),
	project: LinkSchema.nullish(),
	customer: LinkSchema.nullish(),
	contact: LinkSchema.nullish(),
	account_manager: LinkSchema.nullish(),
	date: z.string().nullish(),
	expiration: z.string().nullish().describe('The latest payment date.'),
	// `F` for an invoice, `C` for a credit note.
	invoicetype: z.string().nullish(),
	finalized: z.boolean().nullish(),
	price: z.number().nullish().describe('Total excluding VAT.'),
	price_invat: z.number().nullish().describe('Total including VAT.'),
	vat_amount: z.number().nullish(),
	total_paid: z.number().nullish(),
	outstanding_balance: z.number().nullish(),
	is_paid: z.boolean().nullish(),
	date_sent: z.string().nullish(),
	payment_date: z.string().nullish(),
});

export type RentmanInvoice = z.infer<typeof InvoiceSchema>;

const InvoicesListResponseSchema = z.object({
	invoices: z.array(InvoiceSchema),
	...pagingFields,
});

export type InvoicesListResponse = z.infer<typeof InvoicesListResponseSchema>;

const InvoicesGetInputSchema = z.object({
	invoice_id: z.number().int().positive(),
	fields: FieldsSchema,
	expand: ExpandSchema,
});

export type InvoicesGetInput = z.input<typeof InvoicesGetInputSchema>;

const InvoicesGetResponseSchema = z.object({ invoice: InvoiceSchema });
export type InvoicesGetResponse = z.infer<typeof InvoicesGetResponseSchema>;

// ── Registry ──────────────────────────────────────────────────────────────

export type RentmanEndpointInputs = {
	contactsList: ContactsListInput;
	contactsGet: ContactsGetInput;
	contactsCreate: ContactsCreateInput;
	contactsUpdate: ContactsUpdateInput;
	contactsDelete: ContactsDeleteInput;
	projectsList: ProjectsListInput;
	projectsGet: ProjectsGetInput;
	projectsCreate: ProjectsCreateInput;
	projectsUpdate: ProjectsUpdateInput;
	equipmentList: EquipmentListInput;
	equipmentGet: EquipmentGetInput;
	equipmentCreate: EquipmentCreateInput;
	equipmentUpdate: EquipmentUpdateInput;
	crewList: CrewListInput;
	crewGet: CrewGetInput;
	appointmentsList: AppointmentsListInput;
	appointmentsGet: AppointmentsGetInput;
	invoicesList: InvoicesListInput;
	invoicesGet: InvoicesGetInput;
};

export type RentmanEndpointOutputs = {
	contactsList: ContactsListResponse;
	contactsGet: ContactsGetResponse;
	contactsCreate: ContactsCreateResponse;
	contactsUpdate: ContactsUpdateResponse;
	contactsDelete: ContactsDeleteResponse;
	projectsList: ProjectsListResponse;
	projectsGet: ProjectsGetResponse;
	projectsCreate: ProjectsCreateResponse;
	projectsUpdate: ProjectsUpdateResponse;
	equipmentList: EquipmentListResponse;
	equipmentGet: EquipmentGetResponse;
	equipmentCreate: EquipmentCreateResponse;
	equipmentUpdate: EquipmentUpdateResponse;
	crewList: CrewListResponse;
	crewGet: CrewGetResponse;
	appointmentsList: AppointmentsListResponse;
	appointmentsGet: AppointmentsGetResponse;
	invoicesList: InvoicesListResponse;
	invoicesGet: InvoicesGetResponse;
};

export const RentmanEndpointInputSchemas = {
	contactsList: ContactsListInputSchema,
	contactsGet: ContactsGetInputSchema,
	contactsCreate: ContactsWriteInputSchema,
	contactsUpdate: ContactsUpdateInputSchema,
	contactsDelete: ContactsDeleteInputSchema,
	projectsList: ProjectsListInputSchema,
	projectsGet: ProjectsGetInputSchema,
	projectsCreate: ProjectsCreateInputSchema,
	projectsUpdate: ProjectsUpdateInputSchema,
	equipmentList: EquipmentListInputSchema,
	equipmentGet: EquipmentGetInputSchema,
	equipmentCreate: EquipmentCreateInputSchema,
	equipmentUpdate: EquipmentUpdateInputSchema,
	crewList: CrewListInputSchema,
	crewGet: CrewGetInputSchema,
	appointmentsList: AppointmentsListInputSchema,
	appointmentsGet: AppointmentsGetInputSchema,
	invoicesList: InvoicesListInputSchema,
	invoicesGet: InvoicesGetInputSchema,
} as const;

export const RentmanEndpointOutputSchemas = {
	contactsList: ContactsListResponseSchema,
	contactsGet: ContactsGetResponseSchema,
	contactsCreate: ContactsCreateResponseSchema,
	contactsUpdate: ContactsUpdateResponseSchema,
	contactsDelete: ContactsDeleteResponseSchema,
	projectsList: ProjectsListResponseSchema,
	projectsGet: ProjectsGetResponseSchema,
	projectsCreate: ProjectsCreateResponseSchema,
	projectsUpdate: ProjectsUpdateResponseSchema,
	equipmentList: EquipmentListResponseSchema,
	equipmentGet: EquipmentGetResponseSchema,
	equipmentCreate: EquipmentCreateResponseSchema,
	equipmentUpdate: EquipmentUpdateResponseSchema,
	crewList: CrewListResponseSchema,
	crewGet: CrewGetResponseSchema,
	appointmentsList: AppointmentsListResponseSchema,
	appointmentsGet: AppointmentsGetResponseSchema,
	invoicesList: InvoicesListResponseSchema,
	invoicesGet: InvoicesGetResponseSchema,
} as const;
