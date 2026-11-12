import { z } from 'zod';

// Inputs use Kommo's own bracketed parameter names. Outputs are `.loose()` with
// their documented fields nullish, so a field Kommo adds or omits cannot fail a
// call that has already happened.
// Reference: https://developers.kommo.com/reference/kommo-api-reference

const EntityIdSchema = z
	.number()
	.int()
	.positive()
	.describe('The Kommo entity ID.');

const PAGE_LIMIT = 250;

// Kommo pages by number and returns at most 250 entities. `_page` and `_links`
// are in every list answer, which is how a caller knows another page exists.
const PaginationInputSchema = z.object({
	page: z.number().int().min(1).optional().describe('1-based page.'),
	limit: z
		.number()
		.int()
		.min(1)
		.max(PAGE_LIMIT)
		.optional()
		.describe(
			`Entities per page. Defaults to ${PAGE_LIMIT}, which is the maximum.`,
		),
	query: z
		.string()
		.optional()
		.describe('A search across the entity’s filled fields.'),
});

const PageLinksSchema = z
	.object({
		self: z.object({ href: z.string().nullish() }).loose().nullish(),
		next: z.object({ href: z.string().nullish() }).loose().nullish(),
	})
	.loose();

const PageSchema = z
	.object({
		_page: z.number().nullish(),
		_links: PageLinksSchema.nullish(),
	})
	.loose();

// ── custom field values ───────────────────────────────────────────────────

const CustomFieldValueSchema = z
	.object({
		// unknown: a custom field value's type follows `field_type`, so a text
		// field is a string, a numeric one a number and a date_time a Unix
		// timestamp. There is no single static type.
		value: z
			.unknown()
			.describe(
				'A string, number or boolean depending on `field_type`; a date and time is a Unix timestamp.',
			),
		enum_id: z.number().nullish(),
		enum_code: z.string().nullish(),
	})
	.loose();

export const KommoCustomFieldValueSchema = z
	.object({
		field_id: z.number().nullish(),
		field_name: z.string().nullish(),
		field_code: z
			.string()
			.nullish()
			.describe('Set on the account’s system fields.'),
		field_type: z
			.string()
			.nullish()
			.describe('Such as `text`, `select`, `date_time` or `numeric`.'),
		values: z.array(CustomFieldValueSchema).nullish(),
		is_computed: z.boolean().nullish(),
	})
	.loose();

export type KommoCustomFieldValue = z.infer<typeof KommoCustomFieldValueSchema>;

const CustomFieldsValuesSchema = z.array(KommoCustomFieldValueSchema).nullish();

const TagSchema = z
	.object({
		id: z.number().nullish(),
		name: z.string().nullish(),
		color: z.string().nullish(),
	})
	.loose();

const EmbeddedSchema = z
	.object({
		tags: z.array(TagSchema).nullish(),
		contacts: z.array(z.object({ id: z.number() }).loose()).nullish(),
		companies: z.array(z.object({ id: z.number() }).loose()).nullish(),
	})
	.loose();

// ── leads ─────────────────────────────────────────────────────────────────

export const KommoLeadSchema = z
	.object({
		id: z.number(),
		name: z.string().nullish(),
		price: z.number().nullish(),
		responsible_user_id: z.number().nullish(),
		group_id: z.number().nullish(),
		status_id: z.number().nullish(),
		pipeline_id: z.number().nullish(),
		loss_reason_id: z.number().nullish(),
		created_by: z.number().nullish(),
		updated_by: z.number().nullish(),
		// Unix seconds, not an ISO string.
		created_at: z.number().nullish(),
		updated_at: z.number().nullish(),
		closed_at: z.number().nullish(),
		closest_task_at: z.number().nullish(),
		is_deleted: z.boolean().nullish(),
		score: z.number().nullish(),
		account_id: z.number().nullish(),
		labor_cost: z.number().nullish(),
		is_price_computed: z.boolean().nullish(),
		custom_fields_values: CustomFieldsValuesSchema,
		_embedded: EmbeddedSchema.nullish(),
	})
	.loose();

export type KommoLead = z.infer<typeof KommoLeadSchema>;

const LeadsListInputSchema = PaginationInputSchema.extend({
	with: z
		.array(z.enum(['contacts', 'loss_reason', 'catalog_elements', 'source']))
		.min(1)
		.optional()
		.describe('Embed these extra details on each lead.'),
	pipeline_id: z.number().int().positive().optional(),
	status_id: z.number().int().positive().optional(),
	responsible_user_id: z.number().int().positive().optional(),
	created_from: z.string().optional().describe('ISO 8601 or a Unix timestamp.'),
	created_to: z.string().optional(),
	updated_from: z.string().optional(),
	updated_to: z.string().optional(),
	order_by: z.enum(['created_at', 'updated_at', 'id']).optional(),
	order_direction: z.enum(['asc', 'desc']).optional(),
});

export type LeadsListInput = z.input<typeof LeadsListInputSchema>;

const LeadsListResponseSchema = PageSchema.extend({
	_embedded: z.object({ leads: z.array(KommoLeadSchema) }).loose(),
	next_page: z
		.number()
		.nullable()
		.describe(
			'The page after this one while Kommo says another exists; null on the last page.',
		),
});

export type LeadsListResponse = z.infer<typeof LeadsListResponseSchema>;

const LeadGetInputSchema = z.object({
	leadId: EntityIdSchema,
	with: z
		.array(z.enum(['contacts', 'loss_reason', 'catalog_elements', 'source']))
		.min(1)
		.optional(),
});

export type LeadGetInput = z.input<typeof LeadGetInputSchema>;

const LeadResponseSchema = KommoLeadSchema.loose();

export type LeadResponse = z.infer<typeof LeadResponseSchema>;

const LeadCustomFieldsSchema = z
	.object({
		// unknown: a submitted custom field value's type follows its
		// `field_type`, so the shape cannot be closed here.
		values: z.array(z.record(z.string(), z.unknown())).min(1).optional(),
		field_id: z.number().int().positive().optional(),
		field_code: z.string().optional(),
	})
	.superRefine((value, ctx) => {
		if (value.field_id === undefined && value.field_code === undefined) {
			ctx.addIssue({
				code: 'custom',
				path: ['field_id'],
				message: 'A custom field value needs a `field_id` or a `field_code`.',
			});
		}
	});

const LeadWriteSchema = z.object({
	name: z.string().min(1).optional(),
	price: z.number().optional(),
	status_id: z.number().int().positive().optional(),
	pipeline_id: z.number().int().positive().optional(),
	responsible_user_id: z.number().int().positive().optional(),
	loss_reason_id: z.number().int().positive().optional(),
	custom_fields_values: z.array(LeadCustomFieldsSchema).min(1).optional(),
});

const LeadsCreateInputSchema = z.object({
	leads: z
		.array(LeadWriteSchema.required({ name: true }))
		.min(1)
		.describe(
			'At most 250 in one request. A lead without `status_id` or `pipeline_id` lands in the first stage of the main pipeline.',
		),
});

export type LeadsCreateInput = z.input<typeof LeadsCreateInputSchema>;

// A create answers the created entities under `_embedded`, with their IDs.
const LeadsWriteResponseSchema = z
	.object({
		_embedded: z
			.object({ leads: z.array(KommoLeadSchema) })
			.loose()
			.nullish(),
	})
	.loose();

export type LeadsWriteResponse = z.infer<typeof LeadsWriteResponseSchema>;

const LeadsUpdateInputSchema = z.object({
	leads: z
		.array(LeadWriteSchema.extend({ id: EntityIdSchema }))
		.min(1)
		.describe('Each lead carries its `id` and the fields to change.'),
});

export type LeadsUpdateInput = z.input<typeof LeadsUpdateInputSchema>;

// ── contacts ──────────────────────────────────────────────────────────────

export const KommoContactSchema = z
	.object({
		id: z.number(),
		name: z.string().nullish(),
		first_name: z.string().nullish(),
		last_name: z.string().nullish(),
		responsible_user_id: z.number().nullish(),
		group_id: z.number().nullish(),
		created_by: z.number().nullish(),
		updated_by: z.number().nullish(),
		created_at: z.number().nullish(),
		updated_at: z.number().nullish(),
		is_deleted: z.boolean().nullish(),
		account_id: z.number().nullish(),
		custom_fields_values: CustomFieldsValuesSchema,
		_embedded: EmbeddedSchema.nullish(),
	})
	.loose();

export type KommoContact = z.infer<typeof KommoContactSchema>;

const ContactsListInputSchema = PaginationInputSchema.extend({
	with: z
		.array(z.enum(['leads']))
		.min(1)
		.optional()
		.describe('Embed the leads each contact is linked to.'),
	responsible_user_id: z.number().int().positive().optional(),
	updated_from: z.string().optional(),
	updated_to: z.string().optional(),
});

export type ContactsListInput = z.input<typeof ContactsListInputSchema>;

const ContactsListResponseSchema = PageSchema.extend({
	_embedded: z.object({ contacts: z.array(KommoContactSchema) }).loose(),
	next_page: z.number().nullable(),
});

export type ContactsListResponse = z.infer<typeof ContactsListResponseSchema>;

const ContactGetInputSchema = z.object({ contactId: EntityIdSchema });

export type ContactGetInput = z.input<typeof ContactGetInputSchema>;

const ContactResponseSchema = KommoContactSchema.loose();

export type ContactResponse = z.infer<typeof ContactResponseSchema>;

// A contact needs a name or a first and last name, so the two spellings cannot
// both be missing; Kommo rejects that rather than storing an unnamed contact.
const ContactWriteSchema = z
	.object({
		name: z.string().min(1).optional(),
		first_name: z.string().min(1).optional(),
		last_name: z.string().min(1).optional(),
		responsible_user_id: z.number().int().positive().optional(),
		custom_fields_values: z.array(LeadCustomFieldsSchema).min(1).optional(),
	})
	.superRefine((value, ctx) => {
		const named =
			value.name !== undefined ||
			value.first_name !== undefined ||
			value.last_name !== undefined;
		if (!named) {
			ctx.addIssue({
				code: 'custom',
				path: ['name'],
				message: 'A contact needs a `name`, or a `first_name` and `last_name`.',
			});
		}
	});

const ContactsCreateInputSchema = z.object({
	contacts: z.array(ContactWriteSchema).min(1),
});

export type ContactsCreateInput = z.input<typeof ContactsCreateInputSchema>;

const ContactsWriteResponseSchema = z
	.object({
		_embedded: z
			.object({ contacts: z.array(KommoContactSchema) })
			.loose()
			.nullish(),
	})
	.loose();

export type ContactsWriteResponse = z.infer<typeof ContactsWriteResponseSchema>;

const ContactsUpdateInputSchema = z.object({
	contacts: z.array(ContactWriteSchema.extend({ id: EntityIdSchema })).min(1),
});

export type ContactsUpdateInput = z.input<typeof ContactsUpdateInputSchema>;

// ── companies ─────────────────────────────────────────────────────────────

export const KommoCompanySchema = z
	.object({
		id: z.number(),
		name: z.string().nullish(),
		responsible_user_id: z.number().nullish(),
		group_id: z.number().nullish(),
		created_by: z.number().nullish(),
		updated_by: z.number().nullish(),
		created_at: z.number().nullish(),
		updated_at: z.number().nullish(),
		is_deleted: z.boolean().nullish(),
		account_id: z.number().nullish(),
		custom_fields_values: CustomFieldsValuesSchema,
		_embedded: EmbeddedSchema.nullish(),
	})
	.loose();

export type KommoCompany = z.infer<typeof KommoCompanySchema>;

const CompaniesListInputSchema = PaginationInputSchema.extend({
	responsible_user_id: z.number().int().positive().optional(),
	updated_from: z.string().optional(),
	updated_to: z.string().optional(),
});

export type CompaniesListInput = z.input<typeof CompaniesListInputSchema>;

const CompaniesListResponseSchema = PageSchema.extend({
	_embedded: z.object({ companies: z.array(KommoCompanySchema) }).loose(),
	next_page: z.number().nullable(),
});

export type CompaniesListResponse = z.infer<typeof CompaniesListResponseSchema>;

// ── tasks ─────────────────────────────────────────────────────────────────

export const KommoTaskSchema = z
	.object({
		id: z.number(),
		entity_id: z.number().nullish(),
		entity_type: z
			.string()
			.nullish()
			.describe('`leads`, `contacts` or `companies`.'),
		is_completed: z.boolean().nullish(),
		task_type_id: z.number().nullish(),
		text: z.string().nullish(),
		result: z
			.object({ text: z.string().nullish(), id: z.number().nullish() })
			.loose()
			.nullish(),
		responsible_user_id: z.number().nullish(),
		created_by: z.number().nullish(),
		updated_by: z.number().nullish(),
		// Unix seconds.
		complete_till: z.number().nullish(),
		created_at: z.number().nullish(),
		updated_at: z.number().nullish(),
		account_id: z.number().nullish(),
	})
	.loose();

export type KommoTask = z.infer<typeof KommoTaskSchema>;

const TasksListInputSchema = PaginationInputSchema.extend({
	entity_type: z
		.enum(['leads', 'contacts', 'companies'])
		.optional()
		.describe('Only tasks on this kind of entity.'),
	entity_id: z.number().int().positive().optional(),
	responsible_user_id: z.number().int().positive().optional(),
	is_completed: z.boolean().optional(),
});

export type TasksListInput = z.input<typeof TasksListInputSchema>;

const TasksListResponseSchema = PageSchema.extend({
	_embedded: z.object({ tasks: z.array(KommoTaskSchema) }).loose(),
	next_page: z.number().nullable(),
});

export type TasksListResponse = z.infer<typeof TasksListResponseSchema>;

const TasksCreateInputSchema = z.object({
	tasks: z
		.array(
			z.object({
				entity_id: EntityIdSchema,
				entity_type: z.enum(['leads', 'contacts', 'companies']),
				text: z.string().min(1),
				complete_till: z
					.number()
					.int()
					.positive()
					.describe('Unix seconds. Kommo requires a deadline.'),
				task_type_id: z
					.number()
					.int()
					.positive()
					.optional()
					.describe('Defaults to `1`, a follow-up.'),
				responsible_user_id: z.number().int().positive().optional(),
			}),
		)
		.min(1),
});

export type TasksCreateInput = z.input<typeof TasksCreateInputSchema>;

const TasksWriteResponseSchema = z
	.object({
		_embedded: z
			.object({ tasks: z.array(KommoTaskSchema) })
			.loose()
			.nullish(),
	})
	.loose();

export type TasksWriteResponse = z.infer<typeof TasksWriteResponseSchema>;

// ── pipelines ─────────────────────────────────────────────────────────────

export const KommoStageSchema = z
	.object({
		id: z.number(),
		name: z.string().nullish(),
		sort: z.number().nullish(),
		color: z.string().nullish(),
		is_editable: z.boolean().nullish(),
		pipeline_id: z.number().nullish(),
	})
	.loose();

export const KommoPipelineSchema = z
	.object({
		id: z.number(),
		name: z.string().nullish(),
		sort: z.number().nullish(),
		is_main: z.boolean().nullish(),
		is_unsorted_on: z.boolean().nullish(),
		is_archive: z.boolean().nullish(),
		account_id: z.number().nullish(),
		_embedded: z
			.object({ statuses: z.array(KommoStageSchema).nullish() })
			.loose()
			.nullish(),
	})
	.loose();

export type KommoStage = z.infer<typeof KommoStageSchema>;

export type KommoPipeline = z.infer<typeof KommoPipelineSchema>;

const PipelinesListInputSchema = z.object({});

export type PipelinesListInput = z.input<typeof PipelinesListInputSchema>;

const PipelinesListResponseSchema = z
	.object({
		_embedded: z.object({ pipelines: z.array(KommoPipelineSchema) }).loose(),
	})
	.loose();

export type PipelinesListResponse = z.infer<typeof PipelinesListResponseSchema>;

// ── users ─────────────────────────────────────────────────────────────────

export const KommoUserSchema = z
	.object({
		id: z.number(),
		name: z.string().nullish(),
		email: z.string().nullish(),
		lang: z.string().nullish(),
		// unknown: Kommo's rights tree nests an arbitrary set of entity and
		// action keys, which differ per plan.
		rights: z.record(z.string(), z.unknown()).nullish(),
	})
	.loose();

export type KommoUser = z.infer<typeof KommoUserSchema>;

const UsersListInputSchema = z.object({
	limit: z.number().int().min(1).max(PAGE_LIMIT).optional(),
	page: z.number().int().min(1).optional(),
});

export type UsersListInput = z.input<typeof UsersListInputSchema>;

const UsersListResponseSchema = z
	.object({
		_embedded: z.object({ users: z.array(KommoUserSchema) }).loose(),
		_page: z.number().nullish(),
	})
	.loose();

export type UsersListResponse = z.infer<typeof UsersListResponseSchema>;

// ── account ───────────────────────────────────────────────────────────────

const AccountGetInputSchema = z.object({});

export type AccountGetInput = z.input<typeof AccountGetInputSchema>;

const AccountResponseSchema = z
	.object({
		id: z.number(),
		name: z.string().nullish(),
		subdomain: z.string().nullish(),
		currency: z.string().nullish(),
		country: z.string().nullish(),
		created_at: z.number().nullish(),
		// unknown: the account's embedded blocks vary per plan, such as
		// `custom_fields` and `users_groups`.
		_embedded: z.record(z.string(), z.unknown()).nullish(),
	})
	.loose();

export type AccountResponse = z.infer<typeof AccountResponseSchema>;

// ── Registry ──────────────────────────────────────────────────────────────

export type KommoEndpointInputs = {
	accountGet: AccountGetInput;
	leadsList: LeadsListInput;
	leadsGet: LeadGetInput;
	leadsCreate: LeadsCreateInput;
	leadsUpdate: LeadsUpdateInput;
	contactsList: ContactsListInput;
	contactsGet: ContactGetInput;
	contactsCreate: ContactsCreateInput;
	contactsUpdate: ContactsUpdateInput;
	companiesList: CompaniesListInput;
	tasksList: TasksListInput;
	tasksCreate: TasksCreateInput;
	pipelinesList: PipelinesListInput;
	usersList: UsersListInput;
};

export type KommoEndpointOutputs = {
	accountGet: AccountResponse;
	leadsList: LeadsListResponse;
	leadsGet: LeadResponse;
	leadsCreate: LeadsWriteResponse;
	leadsUpdate: LeadsWriteResponse;
	contactsList: ContactsListResponse;
	contactsGet: ContactResponse;
	contactsCreate: ContactsWriteResponse;
	contactsUpdate: ContactsWriteResponse;
	companiesList: CompaniesListResponse;
	tasksList: TasksListResponse;
	tasksCreate: TasksWriteResponse;
	pipelinesList: PipelinesListResponse;
	usersList: UsersListResponse;
};

export const KommoEndpointInputSchemas = {
	accountGet: AccountGetInputSchema,
	leadsList: LeadsListInputSchema,
	leadsGet: LeadGetInputSchema,
	leadsCreate: LeadsCreateInputSchema,
	leadsUpdate: LeadsUpdateInputSchema,
	contactsList: ContactsListInputSchema,
	contactsGet: ContactGetInputSchema,
	contactsCreate: ContactsCreateInputSchema,
	contactsUpdate: ContactsUpdateInputSchema,
	companiesList: CompaniesListInputSchema,
	tasksList: TasksListInputSchema,
	tasksCreate: TasksCreateInputSchema,
	pipelinesList: PipelinesListInputSchema,
	usersList: UsersListInputSchema,
} as const;

export const KommoEndpointOutputSchemas = {
	accountGet: AccountResponseSchema,
	leadsList: LeadsListResponseSchema,
	leadsGet: LeadResponseSchema,
	leadsCreate: LeadsWriteResponseSchema,
	leadsUpdate: LeadsWriteResponseSchema,
	contactsList: ContactsListResponseSchema,
	contactsGet: ContactResponseSchema,
	contactsCreate: ContactsWriteResponseSchema,
	contactsUpdate: ContactsWriteResponseSchema,
	companiesList: CompaniesListResponseSchema,
	tasksList: TasksListResponseSchema,
	tasksCreate: TasksWriteResponseSchema,
	pipelinesList: PipelinesListResponseSchema,
	usersList: UsersListResponseSchema,
} as const;
