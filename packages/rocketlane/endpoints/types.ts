import { z } from 'zod';

/** Rocketlane caps a page at 100 and uses 100 when a larger size is asked for. */
export const ROCKETLANE_DEFAULT_PAGE_SIZE = 100;
export const ROCKETLANE_MAX_PAGE_SIZE = 100;

const PageSizeSchema = z
	.number()
	.int()
	.min(1)
	.max(ROCKETLANE_MAX_PAGE_SIZE)
	.optional()
	.describe(
		`Records per page, 1 to ${ROCKETLANE_MAX_PAGE_SIZE}. Rocketlane uses ${ROCKETLANE_DEFAULT_PAGE_SIZE} when this is omitted.`,
	);

/**
 * The cursor is opaque and expires after 15 minutes, so it is passed straight
 * back from `next_page_token` without interpretation.
 */
const PageTokenSchema = z
	.string()
	.optional()
	.describe(
		'The `next_page_token` from the previous page. It is valid for 15 minutes, so paging must keep moving.',
	);

/** The API spells the sort order in capitals and defaults to `DESC`. */
const SortOrderSchema = z.enum(['ASC', 'DESC']).optional();

/**
 * `match` decides how several filters combine: `all` (AND, the default) or
 * `any` (OR). It is not a text search.
 */
const MatchSchema = z
	.enum(['all', 'any'])
	.optional()
	.describe(
		'How several filters combine: `all` (every filter, the default) or `any` (at least one).',
	);

/**
 * Rocketlane filters are `field.operator` query keys. The operators used here
 * are the documented ones, and each is offered as its own field so a caller
 * cannot send `taskName.nope` and get a silent no-op.
 */
const OperatorFilterSchema = z
	.strictObject({
		eq: z.string().optional().describe('Exact match.'),
		cn: z.string().optional().describe('Contains.'),
		nc: z.string().optional().describe('Does not contain.'),
	})
	.optional();

/**
 * A status filter. The OpenAPI document types these as strings while its own
 * example is the bare number `1`, and both forms are accepted on the wire, so
 * the schema takes either and the request builder stringifies it.
 */
const StatusValueSchema = z.union([z.string(), z.number().int()]);

const EnumFilterSchema = z
	.strictObject({
		eq: StatusValueSchema.optional(),
		oneOf: z.array(StatusValueSchema).optional(),
		noneOf: z.array(StatusValueSchema).optional(),
	})
	.optional();

const IdFilterSchema = z
	.strictObject({
		eq: z.number().int().optional(),
		oneOf: z.array(z.number().int()).optional(),
		noneOf: z.array(z.number().int()).optional(),
	})
	.optional();

/**
 * The numeric filters that only take `eq`, `gt` and `lt`: task effort and
 * progress, project revenue and fee. The reference lists no `ge` or `le` for
 * them.
 */
const IntegerRangeSchema = z
	.strictObject({
		eq: z.number().int().optional(),
		gt: z.number().int().optional(),
		lt: z.number().int().optional(),
	})
	.optional();

/** A filter that only takes `eq`, for an id or a reference. */
const IdEqFilterSchema = z
	.strictObject({ eq: z.number().int().optional() })
	.optional();

const StringEqFilterSchema = z
	.strictObject({ eq: z.string().optional() })
	.optional();

const BooleanFilterSchema = z
	.strictObject({ eq: z.boolean().optional() })
	.optional();

/** A date filter: an ISO date (`2026-11-10`) with the five comparisons. */
const DateRangeSchema = z
	.strictObject({
		eq: z.string().optional(),
		gt: z.string().optional(),
		ge: z.string().optional(),
		lt: z.string().optional(),
		le: z.string().optional(),
	})
	.optional();

/** A timestamp filter: epoch milliseconds with the five comparisons. */
const EpochRangeSchema = z
	.strictObject({
		eq: z.number().int().optional(),
		gt: z.number().int().optional(),
		ge: z.number().int().optional(),
		lt: z.number().int().optional(),
		le: z.number().int().optional(),
	})
	.optional()
	.describe('Epoch milliseconds.');

/** A number filter with all five comparisons, for hours. */
const NumberRangeSchema = z
	.strictObject({
		eq: z.number().optional(),
		gt: z.number().optional(),
		ge: z.number().optional(),
		lt: z.number().optional(),
		le: z.number().optional(),
	})
	.optional();

/** The pagination object Rocketlane returns on every list. */
export const PaginationSchema = z
	.object({
		pageSize: z.number().nullish(),
		hasMore: z.boolean().nullish().describe('True when more records remain.'),
		totalRecordCount: z.number().nullish(),
		nextPage: z.string().nullish(),
		nextPageToken: z
			.string()
			.nullish()
			.describe('Valid for 15 minutes; pass it as `page_token`.'),
	})
	.loose();

export type RocketlanePagination = z.infer<typeof PaginationSchema>;

/**
 * `next_page_token`, `has_more` and `total_record_count` are declared here
 * rather than added by a transform, because the docs generator reads a
 * transform's input side and the fields would be missing from the reference.
 */
const pagingFields = {
	pagination: PaginationSchema.nullish(),
	next_page_token: z
		.string()
		.nullable()
		.describe('Pass as `page_token` to read the next page; null on the last.'),
	has_more: z.boolean(),
	total_record_count: z.number().nullable(),
};

// ── shared user reference ─────────────────────────────────────────────────

/** A member on an assignee or follower list. */
export const TaskUserSchema = z
	.object({
		userId: z.number().nullish(),
		emailId: z.string().nullish(),
		firstName: z.string().nullish(),
		lastName: z.string().nullish(),
	})
	.loose();

/** A placeholder on an assignee or follower list, awaiting a real user. */
export const TaskPlaceholderSchema = z
	.object({
		placeholderId: z.number().nullish(),
		placeholderName: z.string().nullish(),
	})
	.loose();

/** The assignee wrapper: real members and unfilled placeholders. */
export const AssigneesSchema = z
	.object({
		members: z.array(TaskUserSchema).nullish(),
		placeholders: z.array(TaskPlaceholderSchema).nullish(),
	})
	.loose();

/** The follower wrapper, the same two lists. */
export const FollowersSchema = z
	.object({
		placeholders: z.array(TaskPlaceholderSchema).nullish(),
		members: z.array(TaskUserSchema).nullish(),
	})
	.loose();

/** A task reference, as a dependency or a parent carries it. */
export const TaskLiteSchema = z
	.object({
		taskId: z.number().nullish(),
		taskName: z.string().nullish(),
	})
	.loose();

/** A per-hour rate with its currency. */
export const RateSchema = z
	.object({
		rate: z.number().nullish(),
		currency: z.string().nullish(),
	})
	.loose();

/** The budget a time entry was logged against. */
export const BudgetRefSchema = z
	.object({
		budgetId: z.number().nullish(),
		budgetName: z.string().nullish(),
	})
	.loose();

/** One permission granted to a user. */
export const UserPermissionSchema = z
	.object({
		permissionId: z.number().nullish(),
		permissionName: z.string().nullish(),
	})
	.loose();

/** A holiday calendar. The API spells the ids `calender`, with an e. */
export const HolidayCalendarSchema = z
	.object({
		calenderId: z.number().nullish(),
		calenderName: z.string().nullish(),
	})
	.loose();

/** One note on a company, from a NOTE-type custom field. */
export const CompanyNoteSchema = z
	.object({
		noteId: z.number().nullish(),
		fieldId: z.number().nullish(),
		fieldLabel: z.string().nullish(),
		noteTitle: z.string().nullish(),
		noteText: z.string().nullish(),
		createdAt: z.number().nullish(),
		updatedAt: z.number().nullish(),
		tags: z.array(z.record(z.string(), z.string())).nullish(),
	})
	.loose();

/** A template a project was created from. */
export const ProjectSourceSchema = z
	.object({
		prefix: z.string().nullish(),
		startDate: z.string().nullish(),
		templateId: z.number().nullish(),
		templateName: z.string().nullish(),
	})
	.loose();

/** A partner company on a project. */
export const ProjectPartnerSchema = z
	.object({
		companyId: z.number().nullish(),
		companyName: z.string().nullish(),
		companyUrl: z.string().nullish(),
	})
	.loose();

/** The user reference the API embeds in created-by, owner and assignee fields. */
export const UserRefSchema = z
	.object({
		userId: z.number().nullish(),
		emailId: z.string().nullish(),
		firstName: z.string().nullish(),
		lastName: z.string().nullish(),
	})
	.loose();

export type RocketlaneUserRef = z.infer<typeof UserRefSchema>;

/** A custom field value as the API returns it, alongside its definition. */
export const FieldValueSchema = z
	.object({
		fieldId: z.number().nullish(),
		fieldName: z.string().nullish(),
		fieldType: z.string().nullish(),
		value: z
			.union([
				z.string(),
				z.number(),
				z.boolean(),
				z.array(z.string()),
				z.array(z.number()),
			])
			.nullish(),
	})
	.loose();

export type RocketlaneFieldValue = z.infer<typeof FieldValueSchema>;

// ── tasks ─────────────────────────────────────────────────────────────────

const TaskStatusSchema = z
	.object({
		statusId: z.number().int().optional(),
		statusName: z.string().optional(),
	})
	.optional()
	.describe('Pick the status by id or by name.');

const TaskPhaseRefSchema = z
	.object({
		phaseId: z.number().int().optional(),
		phaseName: z.string().optional(),
	})
	.optional()
	.describe('Pick the phase by id or by name.');

const AssigneeInputSchema = z
	.object({
		user_id: z.number().int().optional(),
		email: z.string().optional(),
	})
	.superRefine((value, ctx) => {
		if (value.user_id === undefined && value.email === undefined) {
			ctx.addIssue({
				code: 'custom',
				message: 'Provide `user_id` or `email`.',
				path: ['user_id'],
			});
		}
	});

const TasksListInputSchema = z.object({
	page_size: PageSizeSchema,
	page_token: PageTokenSchema,
	include_fields: z
		.array(z.string())
		.optional()
		.describe('A projection: only these fields come back.'),
	include_all_fields: z
		.boolean()
		.optional()
		.describe('Return every custom field as well as the defaults.'),
	sort_by: z.string().optional(),
	sort_order: SortOrderSchema,
	match: MatchSchema,
	project_id: IdEqFilterSchema,
	phase_id: IdEqFilterSchema,
	task_name: OperatorFilterSchema,
	task_status: EnumFilterSchema,
	project_status: EnumFilterSchema,
	include_archive: BooleanFilterSchema,
	external_reference_id: StringEqFilterSchema,
	assignee_user_id: IdFilterSchema,
	effort_in_minutes: IntegerRangeSchema,
	progress: IntegerRangeSchema,
	start_date: DateRangeSchema,
	due_date: DateRangeSchema,
	created_at: EpochRangeSchema,
	updated_at: EpochRangeSchema,
});

export type TasksListInput = z.input<typeof TasksListInputSchema>;

const TaskProjectSchema = z
	.object({
		projectId: z.number().nullish(),
		projectName: z.string().nullish(),
		status: z.string().nullish(),
	})
	.loose();

const TaskSchema = z
	.object({
		taskId: z.number().nullish(),
		taskName: z.string().nullish(),
		taskDescription: z.string().nullish(),
		taskPrivateNote: z.string().nullish(),
		startDate: z.string().nullish(),
		dueDate: z.string().nullish(),
		startDateActual: z.string().nullish(),
		dueDateActual: z.string().nullish(),
		archived: z.boolean().nullish(),
		effortInMinutes: z.number().nullish(),
		progress: z.number().nullish(),
		atRisk: z.boolean().nullish(),
		createdAt: z.number().nullish(),
		updatedAt: z.number().nullish(),
		revenueRecognitionTask: z.boolean().nullish(),
		totalAllocatedMins: z.number().nullish(),
		type: z.string().nullish(),
		externalReferenceId: z.string().nullish(),
		billable: z.boolean().nullish(),
		csatEnabled: z.boolean().nullish(),
		private: z.boolean().nullish(),
		createdBy: UserRefSchema.nullish(),
		updatedBy: UserRefSchema.nullish(),
		project: TaskProjectSchema.nullish(),
		status: z
			.object({
				statusId: z.number().nullish(),
				statusName: z.string().nullish(),
			})
			.loose()
			.nullish(),
		phase: z
			.object({
				phaseId: z.number().nullish(),
				phaseName: z.string().nullish(),
			})
			.loose()
			.nullish(),
		priority: z
			.object({
				priorityId: z.number().nullish(),
				priorityName: z.string().nullish(),
			})
			.loose()
			.nullish(),
		fields: z.array(FieldValueSchema).nullish(),
		assignees: AssigneesSchema.nullish(),
		followers: FollowersSchema.nullish(),
		dependencies: z.array(TaskLiteSchema).nullish(),
		parent: TaskLiteSchema.nullish(),
	})
	.loose();

export type RocketlaneTask = z.infer<typeof TaskSchema>;

const TasksListResponseSchema = z.object({
	tasks: z.array(TaskSchema),
	...pagingFields,
});

export type TasksListResponse = z.infer<typeof TasksListResponseSchema>;

const TasksGetInputSchema = z.object({
	task_id: z
		.number()
		.int()
		.positive()
		.describe('The task id, from `tasks.list`.'),
	include_fields: z.array(z.string()).optional(),
	include_all_fields: z.boolean().optional(),
});

export type TasksGetInput = z.input<typeof TasksGetInputSchema>;

const TasksGetResponseSchema = z.object({ task: TaskSchema });

export type TasksGetResponse = z.infer<typeof TasksGetResponseSchema>;

/**
 * Create and update share almost every field. `task_id` is required to create
 * and the project to attach the task to is a nested object.
 */
const TasksWriteInputSchema = z.object({
	task_name: z.string().min(1).describe('The task title.'),
	project_id: z
		.number()
		.int()
		.positive()
		.describe('The project the task belongs to.'),
	task_description: z.string().optional(),
	task_private_note: z.string().optional(),
	start_date: z.string().optional().describe('An ISO date.'),
	due_date: z.string().optional().describe('An ISO date.'),
	effort_in_minutes: z.number().int().min(0).optional(),
	progress: z.number().int().min(0).max(100).optional(),
	at_risk: z.boolean().optional(),
	type: z.string().optional(),
	phase: TaskPhaseRefSchema,
	status: TaskStatusSchema,
	external_reference_id: z.string().optional(),
	private: z.boolean().optional(),
	billable: z.boolean().optional(),
	assignees: z.array(AssigneeInputSchema).optional(),
	follower_ids: z.array(z.number().int()).optional(),
	parent_task_id: z.number().int().optional(),
	fields: z
		.array(
			z.object({
				fieldId: z.number().int(),
				value: z.union([
					z.string(),
					z.number(),
					z.boolean(),
					z.array(z.string()),
				]),
			}),
		)
		.optional()
		.describe('Custom field values, keyed by the field id.'),
});

export type TasksCreateInput = z.input<typeof TasksWriteInputSchema>;
export type TasksUpdateInput = z.input<typeof TasksUpdateInputSchema>;

const TasksUpdateInputSchema = TasksWriteInputSchema.partial().extend({
	task_id: z.number().int().positive(),
});

const TasksCreateResponseSchema = z.object({ task: TaskSchema });
export type TasksCreateResponse = z.infer<typeof TasksCreateResponseSchema>;

const TasksUpdateResponseSchema = z.object({ task: TaskSchema });
export type TasksUpdateResponse = z.infer<typeof TasksUpdateResponseSchema>;

const TasksDeleteInputSchema = z.object({
	task_id: z.number().int().positive(),
});

export type TasksDeleteInput = z.input<typeof TasksDeleteInputSchema>;

const TasksDeleteResponseSchema = z.object({
	success: z.boolean(),
	task_id: z.number().nullable(),
});

export type TasksDeleteResponse = z.infer<typeof TasksDeleteResponseSchema>;

// ── projects ──────────────────────────────────────────────────────────────

const ProjectsListInputSchema = z.object({
	page_size: PageSizeSchema,
	page_token: PageTokenSchema,
	include_fields: z.array(z.string()).optional(),
	include_all_fields: z.boolean().optional(),
	sort_by: z.string().optional(),
	sort_order: SortOrderSchema,
	match: MatchSchema,
	project_name: OperatorFilterSchema,
	status: EnumFilterSchema,
	company_id: IdFilterSchema,
	customer_id: IdFilterSchema,
	team_member_id: IdFilterSchema,
	contract_type: EnumFilterSchema,
	include_archive: BooleanFilterSchema,
	external_reference_id: StringEqFilterSchema,
	annualized_recurring_revenue: IntegerRangeSchema,
	project_fee: IntegerRangeSchema,
	budgeted_hours: NumberRangeSchema,
	allocated_hours: NumberRangeSchema,
});

export type ProjectsListInput = z.input<typeof ProjectsListInputSchema>;

const ProjectSchema = z
	.object({
		projectId: z.number().nullish(),
		projectName: z.string().nullish(),
		startDate: z.string().nullish(),
		dueDate: z.string().nullish(),
		createdAt: z.number().nullish(),
		updatedAt: z.number().nullish(),
		visibility: z.string().nullish(),
		status: z.string().nullish(),
		externalReferenceId: z.string().nullish(),
		currency: z.string().nullish(),
		annualizedRecurringRevenue: z.number().nullish(),
		projectFee: z.number().nullish(),
		budgetedHours: z.number().nullish(),
		allocatedHours: z.number().nullish(),
		inferredProgress: z.number().nullish(),
		archived: z.boolean().nullish(),
		contractType: z.string().nullish(),
		customersInvited: z.number().nullish(),
		customersJoined: z.number().nullish(),
		owner: UserRefSchema.nullish(),
		// The customer block is company id plus name; both spellings appear.
		customer: z
			.object({
				companyId: z.number().nullish(),
				companyName: z.string().nullish(),
				customerId: z.number().nullish(),
				customerName: z.string().nullish(),
			})
			.loose()
			.nullish(),
		company: z
			.object({
				companyId: z.number().nullish(),
				companyName: z.string().nullish(),
			})
			.loose()
			.nullish(),
		fields: z.array(FieldValueSchema).nullish(),
		teamMembers: z.array(UserRefSchema).nullish(),
		sources: z.array(ProjectSourceSchema).nullish(),
		partners: z.array(ProjectPartnerSchema).nullish(),
	})
	.loose();

export type RocketlaneProject = z.infer<typeof ProjectSchema>;

const ProjectsListResponseSchema = z.object({
	projects: z.array(ProjectSchema),
	...pagingFields,
});

export type ProjectsListResponse = z.infer<typeof ProjectsListResponseSchema>;

const ProjectsGetInputSchema = z.object({
	project_id: z
		.number()
		.int()
		.positive()
		.describe('The project id, from `projects.list`.'),
	include_fields: z.array(z.string()).optional(),
	include_all_fields: z.boolean().optional(),
});

export type ProjectsGetInput = z.input<typeof ProjectsGetInputSchema>;

const ProjectsGetResponseSchema = z.object({ project: ProjectSchema });
export type ProjectsGetResponse = z.infer<typeof ProjectsGetResponseSchema>;

/**
 * Creating a project needs a customer and an owner, and Rocketlane takes either
 * an id or the name for each. Both are modelled so a caller never has to look
 * an id up first, while a schema check rejects a pair that names neither.
 */
const ProjectCustomerInputSchema = z
	.object({
		company_id: z.number().int().optional(),
		company_name: z.string().optional(),
	})
	.superRefine((value, ctx) => {
		if (value.company_id === undefined && value.company_name === undefined) {
			ctx.addIssue({
				code: 'custom',
				message: 'Provide `company_id` or `company_name`.',
				path: ['company_id'],
			});
		}
	});

const ProjectOwnerInputSchema = z
	.object({
		user_id: z.number().int().optional(),
		email_id: z.string().optional(),
	})
	.superRefine((value, ctx) => {
		if (value.user_id === undefined && value.email_id === undefined) {
			ctx.addIssue({
				code: 'custom',
				message: 'Provide `user_id` or `email_id`.',
				path: ['user_id'],
			});
		}
	});

const ProjectCustomFieldInputSchema = z.object({
	fieldId: z.number().int(),
	value: z.union([z.string(), z.number(), z.boolean(), z.array(z.string())]),
});

const ProjectsWriteInputSchema = z.object({
	project_name: z.string().min(1).describe('The project title.'),
	customer: ProjectCustomerInputSchema,
	owner: ProjectOwnerInputSchema,
	start_date: z.string().optional().describe('An ISO date.'),
	due_date: z
		.string()
		.optional()
		.describe('An ISO date on or after `start_date`.'),
	visibility: z
		.enum(['PRIVATE', 'PUBLIC', 'CUSTOMER'])
		.optional()
		.describe('Who can see the project.'),
	team_member_ids: z
		.array(z.number().int())
		.optional()
		.describe('Users to add to the project.'),
	currency: z.string().optional().describe('A three-letter currency code.'),
	annualized_recurring_revenue: z.number().optional(),
	project_fee: z.number().optional(),
	budgeted_hours: z.number().optional(),
	external_reference_id: z.string().optional(),
	auto_create_company: z
		.boolean()
		.optional()
		.describe('Create the customer company when it does not exist.'),
	assign_project_owner: z.boolean().optional(),
	fields: z.array(ProjectCustomFieldInputSchema).optional(),
});

export type ProjectsCreateInput = z.input<typeof ProjectsWriteInputSchema>;

const ProjectsCreateResponseSchema = z.object({ project: ProjectSchema });
export type ProjectsCreateResponse = z.infer<
	typeof ProjectsCreateResponseSchema
>;

const ProjectsUpdateInputSchema = ProjectsWriteInputSchema.partial().extend({
	project_id: z.number().int().positive(),
});

export type ProjectsUpdateInput = z.input<typeof ProjectsUpdateInputSchema>;

const ProjectsUpdateResponseSchema = z.object({ project: ProjectSchema });
export type ProjectsUpdateResponse = z.infer<
	typeof ProjectsUpdateResponseSchema
>;

const ProjectsDeleteInputSchema = z.object({
	project_id: z.number().int().positive(),
});

export type ProjectsDeleteInput = z.input<typeof ProjectsDeleteInputSchema>;

const ProjectsDeleteResponseSchema = z.object({
	success: z.boolean(),
	project_id: z.number().nullable(),
});

export type ProjectsDeleteResponse = z.infer<
	typeof ProjectsDeleteResponseSchema
>;

const ProjectsArchiveInputSchema = z.object({
	project_id: z.number().int().positive(),
});

export type ProjectsArchiveInput = z.input<typeof ProjectsArchiveInputSchema>;

const ProjectsArchiveResponseSchema = z.object({
	success: z.boolean(),
	project_id: z.number().nullable(),
});

export type ProjectsArchiveResponse = z.infer<
	typeof ProjectsArchiveResponseSchema
>;

// ── companies ─────────────────────────────────────────────────────────────

const CompaniesListInputSchema = z.object({
	page_size: PageSizeSchema,
	page_token: PageTokenSchema,
	include_fields: z.array(z.string()).optional(),
	include_all_fields: z.boolean().optional(),
	sort_by: z.string().optional(),
	sort_order: SortOrderSchema,
	match: MatchSchema,
	company_name: OperatorFilterSchema.describe(
		'Search by company name, e.g. `{ cn: "acme" }`.',
	),
});

export type CompaniesListInput = z.input<typeof CompaniesListInputSchema>;

const CompanySchema = z
	.object({
		companyId: z.number().nullish(),
		companyName: z.string().nullish(),
		companyUrl: z.string().nullish(),
		visibility: z.string().nullish(),
		description: z.string().nullish(),
		createdAt: z.number().nullish(),
		updatedAt: z.number().nullish(),
		createdBy: UserRefSchema.nullish(),
		updatedBy: UserRefSchema.nullish(),
		accountOwner: UserRefSchema.nullish(),
		fields: z.array(FieldValueSchema).nullish(),
		notes: z.array(CompanyNoteSchema).nullish(),
	})
	.loose();

export type RocketlaneCompany = z.infer<typeof CompanySchema>;

const CompaniesListResponseSchema = z.object({
	companies: z.array(CompanySchema),
	...pagingFields,
});

export type CompaniesListResponse = z.infer<typeof CompaniesListResponseSchema>;

const CompaniesGetInputSchema = z.object({
	company_id: z.number().int().positive(),
	include_fields: z.array(z.string()).optional(),
	include_all_fields: z.boolean().optional(),
});

export type CompaniesGetInput = z.input<typeof CompaniesGetInputSchema>;

const CompaniesGetResponseSchema = z.object({ company: CompanySchema });
export type CompaniesGetResponse = z.infer<typeof CompaniesGetResponseSchema>;

const CompaniesWriteInputSchema = z.object({
	company_name: z.string().min(1).describe('The company name.'),
	account_owner: ProjectOwnerInputSchema,
	company_url: z.string().optional().describe('The company website.'),
	visibility: z.enum(['PRIVATE', 'PUBLIC', 'CUSTOMER']).optional(),
	description: z.string().optional(),
	fields: z.array(ProjectCustomFieldInputSchema).optional(),
});

export type CompaniesCreateInput = z.input<typeof CompaniesWriteInputSchema>;

const CompaniesCreateResponseSchema = z.object({ company: CompanySchema });
export type CompaniesCreateResponse = z.infer<
	typeof CompaniesCreateResponseSchema
>;

const CompaniesUpdateInputSchema = CompaniesWriteInputSchema.partial().extend({
	company_id: z.number().int().positive(),
});

export type CompaniesUpdateInput = z.input<typeof CompaniesWriteInputSchema>;

const CompaniesUpdateResponseSchema = z.object({ company: CompanySchema });
export type CompaniesUpdateResponse = z.infer<
	typeof CompaniesUpdateResponseSchema
>;

const CompaniesDeleteInputSchema = z.object({
	company_id: z.number().int().positive(),
});

export type CompaniesDeleteInput = z.input<typeof CompaniesDeleteInputSchema>;

const CompaniesDeleteResponseSchema = z.object({
	success: z.boolean(),
	company_id: z.number().nullable(),
});

export type CompaniesDeleteResponse = z.infer<
	typeof CompaniesDeleteResponseSchema
>;

// ── users ─────────────────────────────────────────────────────────────────

const UsersListInputSchema = z.object({
	page_size: PageSizeSchema,
	page_token: PageTokenSchema,
	include_fields: z.array(z.string()).optional(),
	match: MatchSchema,
	sort_by: z.string().optional(),
	sort_order: SortOrderSchema,
});

export type UsersListInput = z.input<typeof UsersListInputSchema>;

const UserSchema = z
	.object({
		userId: z.number().nullish(),
		email: z.string().nullish(),
		firstName: z.string().nullish(),
		lastName: z.string().nullish(),
		type: z.string().nullish(),
		status: z.string().nullish(),
		profilePictureUrl: z.string().nullish(),
		capacityInMinutes: z.number().nullish(),
		createdAt: z.number().nullish(),
		updatedAt: z.number().nullish(),
		role: z
			.object({
				roleId: z.number().nullish(),
				roleName: z.string().nullish(),
			})
			.loose()
			.nullish(),
		company: z
			.object({
				companyId: z.number().nullish(),
				companyName: z.string().nullish(),
			})
			.loose()
			.nullish(),
		fields: z.array(FieldValueSchema).nullish(),
		permission: UserPermissionSchema.nullish(),
		holidayCalendar: HolidayCalendarSchema.nullish(),
	})
	.loose();

export type RocketlaneUser = z.infer<typeof UserSchema>;

const UsersListResponseSchema = z.object({
	users: z.array(UserSchema),
	...pagingFields,
});

export type UsersListResponse = z.infer<typeof UsersListResponseSchema>;

const UsersGetInputSchema = z.object({
	user_id: z.number().int().positive(),
	include_fields: z.array(z.string()).optional(),
});

export type UsersGetInput = z.input<typeof UsersGetInputSchema>;

const UsersGetResponseSchema = z.object({ user: UserSchema });
export type UsersGetResponse = z.infer<typeof UsersGetResponseSchema>;

// ── time entries ──────────────────────────────────────────────────────────

const TimeEntriesListInputSchema = z.object({
	page_size: PageSizeSchema,
	page_token: PageTokenSchema,
	include_fields: z.array(z.string()).optional(),
	sort_by: z.string().optional(),
	sort_order: SortOrderSchema,
	match: MatchSchema,
	date: DateRangeSchema.describe('Filter on the entry date, as an ISO date.'),
	project_id: IdEqFilterSchema,
	task_id: IdFilterSchema,
	user_email: OperatorFilterSchema,
	billable: BooleanFilterSchema,
	approval_status: StringEqFilterSchema,
	include_deleted: BooleanFilterSchema,
});

export type TimeEntriesListInput = z.input<typeof TimeEntriesListInputSchema>;

const TimeEntrySchema = z
	.object({
		timeEntryId: z.number().nullish(),
		date: z.string().nullish(),
		minutes: z.number().nullish(),
		activityName: z.string().nullish(),
		notes: z.string().nullish(),
		billable: z.boolean().nullish(),
		sourceType: z.string().nullish(),
		status: z.string().nullish(),
		deleted: z.boolean().nullish(),
		createdAt: z.number().nullish(),
		updatedAt: z.number().nullish(),
		submittedAt: z.number().nullish(),
		approvedAt: z.number().nullish(),
		rejectedAt: z.number().nullish(),
		project: z
			.object({
				projectId: z.number().nullish(),
				projectName: z.string().nullish(),
			})
			.loose()
			.nullish(),
		task: z
			.object({
				taskId: z.number().nullish(),
				taskName: z.string().nullish(),
			})
			.loose()
			.nullish(),
		projectPhase: z
			.object({
				phaseId: z.number().nullish(),
				phaseName: z.string().nullish(),
			})
			.loose()
			.nullish(),
		user: z
			.object({
				userId: z.number().nullish(),
				emailId: z.string().nullish(),
				firstName: z.string().nullish(),
				lastName: z.string().nullish(),
			})
			.loose()
			.nullish(),
		category: z
			.object({
				categoryId: z.number().nullish(),
				categoryName: z.string().nullish(),
			})
			.loose()
			.nullish(),
		createdBy: UserRefSchema.nullish(),
		updatedBy: UserRefSchema.nullish(),
		submittedBy: UserRefSchema.nullish(),
		approvedBy: UserRefSchema.nullish(),
		rejectedBy: UserRefSchema.nullish(),
		fields: z.array(FieldValueSchema).nullish(),
		costRate: RateSchema.nullish(),
		billRate: RateSchema.nullish(),
		budget: BudgetRefSchema.nullish(),
	})
	.loose();

export type RocketlaneTimeEntry = z.infer<typeof TimeEntrySchema>;

const TimeEntriesListResponseSchema = z.object({
	time_entries: z.array(TimeEntrySchema),
	...pagingFields,
});

export type TimeEntriesListResponse = z.infer<
	typeof TimeEntriesListResponseSchema
>;

const TimeEntriesGetInputSchema = z.object({
	time_entry_id: z.number().int().positive(),
	include_fields: z.array(z.string()).optional(),
});

export type TimeEntriesGetInput = z.input<typeof TimeEntriesGetInputSchema>;

const TimeEntriesGetResponseSchema = z.object({
	time_entry: TimeEntrySchema,
});

export type TimeEntriesGetResponse = z.infer<
	typeof TimeEntriesGetResponseSchema
>;

const TimeEntriesWriteInputSchema = z.object({
	date: z.string().describe('The day the time was spent, as an ISO date.'),
	minutes: z
		.number()
		.int()
		.min(1)
		.describe(
			'Minutes spent. Rocketlane rejects a day whose entries total more than 1440.',
		),
	activity_name: z.string().optional(),
	notes: z.string().optional(),
	billable: z.boolean().optional(),
	project_id: z
		.number()
		.int()
		.optional()
		.describe('The project to log against.'),
	task_id: z.number().int().optional(),
	phase_id: z.number().int().optional(),
	user_email: z.string().optional().describe('The user the entry belongs to.'),
	category_id: z.number().int().optional(),
});

export type TimeEntriesCreateInput = z.input<
	typeof TimeEntriesWriteInputSchema
>;

const TimeEntriesCreateResponseSchema = z.object({
	time_entry: TimeEntrySchema,
});

export type TimeEntriesCreateResponse = z.infer<
	typeof TimeEntriesCreateResponseSchema
>;

const TimeEntriesDeleteInputSchema = z.object({
	time_entry_id: z.number().int().positive(),
});

export type TimeEntriesDeleteInput = z.input<
	typeof TimeEntriesDeleteInputSchema
>;

const TimeEntriesDeleteResponseSchema = z.object({
	success: z.boolean(),
	time_entry_id: z.number().nullable(),
});

export type TimeEntriesDeleteResponse = z.infer<
	typeof TimeEntriesDeleteResponseSchema
>;

// ── Registry ──────────────────────────────────────────────────────────────

export type RocketlaneEndpointInputs = {
	tasksList: TasksListInput;
	tasksGet: TasksGetInput;
	tasksCreate: TasksCreateInput;
	tasksUpdate: TasksUpdateInput;
	tasksDelete: TasksDeleteInput;
	projectsList: ProjectsListInput;
	projectsGet: ProjectsGetInput;
	projectsCreate: ProjectsCreateInput;
	projectsUpdate: ProjectsUpdateInput;
	projectsDelete: ProjectsDeleteInput;
	projectsArchive: ProjectsArchiveInput;
	companiesList: CompaniesListInput;
	companiesGet: CompaniesGetInput;
	companiesCreate: CompaniesCreateInput;
	companiesUpdate: CompaniesUpdateInput;
	companiesDelete: CompaniesDeleteInput;
	usersList: UsersListInput;
	usersGet: UsersGetInput;
	timeEntriesList: TimeEntriesListInput;
	timeEntriesGet: TimeEntriesGetInput;
	timeEntriesCreate: TimeEntriesCreateInput;
	timeEntriesDelete: TimeEntriesDeleteInput;
};

export type RocketlaneEndpointOutputs = {
	tasksList: TasksListResponse;
	tasksGet: TasksGetResponse;
	tasksCreate: TasksCreateResponse;
	tasksUpdate: TasksUpdateResponse;
	tasksDelete: TasksDeleteResponse;
	projectsList: ProjectsListResponse;
	projectsGet: ProjectsGetResponse;
	projectsCreate: ProjectsCreateResponse;
	projectsUpdate: ProjectsUpdateResponse;
	projectsDelete: ProjectsDeleteResponse;
	projectsArchive: ProjectsArchiveResponse;
	companiesList: CompaniesListResponse;
	companiesGet: CompaniesGetResponse;
	companiesCreate: CompaniesCreateResponse;
	companiesUpdate: CompaniesUpdateResponse;
	companiesDelete: CompaniesDeleteResponse;
	usersList: UsersListResponse;
	usersGet: UsersGetResponse;
	timeEntriesList: TimeEntriesListResponse;
	timeEntriesGet: TimeEntriesGetResponse;
	timeEntriesCreate: TimeEntriesCreateResponse;
	timeEntriesDelete: TimeEntriesDeleteResponse;
};

export const RocketlaneEndpointInputSchemas = {
	tasksList: TasksListInputSchema,
	tasksGet: TasksGetInputSchema,
	tasksCreate: TasksWriteInputSchema,
	tasksUpdate: TasksUpdateInputSchema,
	tasksDelete: TasksDeleteInputSchema,
	projectsList: ProjectsListInputSchema,
	projectsGet: ProjectsGetInputSchema,
	projectsCreate: ProjectsWriteInputSchema,
	projectsUpdate: ProjectsUpdateInputSchema,
	projectsDelete: ProjectsDeleteInputSchema,
	projectsArchive: ProjectsArchiveInputSchema,
	companiesList: CompaniesListInputSchema,
	companiesGet: CompaniesGetInputSchema,
	companiesCreate: CompaniesWriteInputSchema,
	companiesUpdate: CompaniesUpdateInputSchema,
	companiesDelete: CompaniesDeleteInputSchema,
	usersList: UsersListInputSchema,
	usersGet: UsersGetInputSchema,
	timeEntriesList: TimeEntriesListInputSchema,
	timeEntriesGet: TimeEntriesGetInputSchema,
	timeEntriesCreate: TimeEntriesWriteInputSchema,
	timeEntriesDelete: TimeEntriesDeleteInputSchema,
} as const;

export const RocketlaneEndpointOutputSchemas = {
	tasksList: TasksListResponseSchema,
	tasksGet: TasksGetResponseSchema,
	tasksCreate: TasksCreateResponseSchema,
	tasksUpdate: TasksUpdateResponseSchema,
	tasksDelete: TasksDeleteResponseSchema,
	projectsList: ProjectsListResponseSchema,
	projectsGet: ProjectsGetResponseSchema,
	projectsCreate: ProjectsCreateResponseSchema,
	projectsUpdate: ProjectsUpdateResponseSchema,
	projectsDelete: ProjectsDeleteResponseSchema,
	projectsArchive: ProjectsArchiveResponseSchema,
	companiesList: CompaniesListResponseSchema,
	companiesGet: CompaniesGetResponseSchema,
	companiesCreate: CompaniesCreateResponseSchema,
	companiesUpdate: CompaniesUpdateResponseSchema,
	companiesDelete: CompaniesDeleteResponseSchema,
	usersList: UsersListResponseSchema,
	usersGet: UsersGetResponseSchema,
	timeEntriesList: TimeEntriesListResponseSchema,
	timeEntriesGet: TimeEntriesGetResponseSchema,
	timeEntriesCreate: TimeEntriesCreateResponseSchema,
	timeEntriesDelete: TimeEntriesDeleteResponseSchema,
} as const;
