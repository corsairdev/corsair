import { z } from 'zod';

// Inputs use OneDesk's own field names as the OpenAPI spec spells them
// (https://onedesk.com/public-api/swagger.html). Outputs are `.loose()` and
// their documented fields nullish, so a field OneDesk adds or omits cannot
// fail a call that has already happened.

// ── Shared building blocks ────────────────────────────────────────────────

/**
 * Every filter call accepts the same comparison objects. OneDesk documents a
 * fixed operation list per property, so a value outside it is rejected by the
 * API rather than ignored; the enum keeps that request from being sent.
 */
export const ONEDESK_FILTER_OPERATIONS = [
	'EQ',
	'NE',
	'GT',
	'LT',
	'GE',
	'LE',
	'CONTAINS',
	'NOT_CONTAINS',
] as const;

const FilterOperationSchema = z.enum(ONEDESK_FILTER_OPERATIONS);

/** A comparison the API accepts for either a property or a custom field. */
const FilterValueSchema = z.union([
	z.string(),
	z.number(),
	z.boolean(),
	z.array(z.string()),
	z.array(z.number()),
	z.null(),
]);

const PropertyFilterSchema = z.object({
	property: z.string().min(1).describe('Name of the property to compare.'),
	operation: FilterOperationSchema,
	value: FilterValueSchema.describe(
		'Value to compare against. Use null to match an unset custom field.',
	),
});

const CustomFieldFilterSchema = z.object({
	property: z.string().min(1).describe('Name of the custom field.'),
	operation: FilterOperationSchema,
	value: FilterValueSchema,
});

/**
 * A page request. OneDesk returns `totalNum` so a caller knows how many rows
 * exist; `limit` is capped by the API at 200 for id requests and 50 for detail
 * requests, and the endpoint rejects anything above 200 outright.
 */
const PagingShape = {
	limit: z
		.number()
		.int()
		.min(1)
		.max(200)
		.optional()
		.describe(
			'Rows to return. OneDesk caps this at 200 for id requests and 50 for detail requests.',
		),
	offset: z
		.number()
		.int()
		.min(0)
		.optional()
		.describe('Index of the first row to return. Defaults to 0.'),
	isAsc: z
		.boolean()
		.optional()
		.describe(
			'Sort by creation time ascending. OneDesk defaults to false, newest first.',
		),
};

/** The filter body every simple resource takes. */
const SimpleFilterSchema = z.object({
	properties: z
		.array(PropertyFilterSchema)
		.optional()
		.describe('Property comparisons to apply.'),
	...PagingShape,
});

const CustomFieldFilterBodySchema = z.object({
	properties: z.array(PropertyFilterSchema).optional(),
	...PagingShape,
	customFields: z
		.array(CustomFieldFilterSchema)
		.optional()
		.describe(
			'Custom field comparisons. Use null as the value to match fields with no value.',
		),
});

/**
 * The response envelope every filter and list call uses. `nextOffset` is
 * derived by the endpoint from `totalNum` and the page it returned, because
 * OneDesk sends no cursor of its own.
 */
const pagedResult = <T extends z.ZodType>(item: T) =>
	z
		.object({
			code: z.string().nullish(),
			data: z.array(item),
			totalNum: z.number().nullish(),
			appliedPropertyFilters: z.array(PropertyFilterSchema).nullish(),
			appliedCustomFieldFilters: z.array(CustomFieldFilterSchema).nullish(),
			notAppliedPropertyFilters: z.array(z.string()).nullish(),
			notAppliedCustomFieldFilters: z.array(z.string()).nullish(),
			// Derived: the offset to pass next, or null when the page is the last.
			nextOffset: z.number().nullable(),
		})
		.loose();

/**
 * The envelope a create call uses: `data` is the new record's external id.
 * A call that fails still arrives with HTTP 200, so the client throws on any
 * `code` other than SUCCESS before this is parsed.
 */
const createdResult = z.object({
	code: z.string().nullish(),
	data: z.string().nullish(),
});

/**
 * Updates answer a bare code string, not an object. Some also answer an empty
 * body, so both are accepted and normalised to `{ code }` by the endpoint.
 */
const updateResult = z.object({
	code: z.string(),
});

/** A timer or attachment action: a code plus an optional reason. */
const actionResult = z
	.object({
		code: z.string().nullish(),
		data: z
			.object({
				reason: z.string().nullish(),
				amountOfWork: z.number().nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();

// ── Shared entity fragments ───────────────────────────────────────────────

/** A user reference, as items and projects embed it. */
export const OnedeskUserRefSchema = z
	.object({
		typeName: z.string().nullish(),
		displayName: z.string().nullish(),
		email: z.string().nullish(),
		teamName: z.string().nullish(),
		externalId: z.string().nullish(),
	})
	.loose();

const AddressSchema = z
	.object({
		address1: z.string().nullish(),
		address2: z.string().nullish(),
		city: z.string().nullish(),
		state: z.string().nullish(),
		zip: z.string().nullish(),
		country: z.string().nullish(),
	})
	.loose();

/**
 * A custom field's value. OneDesk's field types are Date, Text, Rich Text,
 * Number, Cost, Choice and Tags, so the value is a scalar or a list of
 * scalars; the schema states that instead of leaving it untyped.
 */
const CustomFieldScalarSchema = z.union([z.string(), z.number(), z.boolean()]);

const CustomFieldValueSchema = z
	.object({
		name: z.string().nullish(),
		value: z
			.union([CustomFieldScalarSchema, z.array(CustomFieldScalarSchema)])
			.nullish(),
	})
	.loose();

/** An attachment reference embedded in a project or portfolio. */
const AttachmentRefSchema = z
	.object({
		externalId: z.string().nullish(),
		name: z.string().nullish(),
	})
	.loose();

/** A team reference embedded in a user record. */
const TeamRefSchema = z
	.object({
		externalId: z.string().nullish(),
		name: z.string().nullish(),
	})
	.loose();

const LifecycleStatusSchema = z
	.object({
		name: z.string().nullish(),
		externalId: z.string().nullish(),
		state: z.string().nullish(),
	})
	.loose();

/**
 * A custom-field map on a write. OneDesk's field types include Choice and
 * Tags, whose values are lists, so an array of strings is accepted beside the
 * scalars.
 */
const CustomFieldInputSchema = z
	.record(
		z.string(),
		z.union([z.string(), z.number(), z.boolean(), z.array(z.string())]),
	)
	.optional();

/** `[0,20,40,60,80,100]` are 0 to 5 stars. Nothing between is accepted. */
export const ONEDESK_PRIORITIES = [0, 20, 40, 60, 80, 100] as const;

const PrioritySchema = z
	.union([
		z.literal(ONEDESK_PRIORITIES[0]),
		z.literal(ONEDESK_PRIORITIES[1]),
		z.literal(ONEDESK_PRIORITIES[2]),
		z.literal(ONEDESK_PRIORITIES[3]),
		z.literal(ONEDESK_PRIORITIES[4]),
		z.literal(ONEDESK_PRIORITIES[5]),
	])
	.describe(
		'Star rating: 0, 20, 40, 60, 80 or 100 for zero to five stars. No other value is accepted.',
	);

/**
 * A list update (OneDesk's `ListUpdateData`): `replace: true` swaps the whole
 * list for `newValue`, while `add` and `remove` change the existing list.
 * `replace` is a flag, not the list, so the two travel together.
 */
const listUpdate = z
	.object({
		replace: z
			.boolean()
			.optional()
			.describe('true to replace the whole list with newValue.'),
		newValue: z
			.array(z.string())
			.optional()
			.describe('Ids that become the full list when replace is true.'),
		add: z.array(z.string()).optional().describe('Ids to append.'),
		remove: z.array(z.string()).optional().describe('Ids to remove.'),
	})
	.superRefine((value, ctx) => {
		if ((value.replace === true) !== (value.newValue !== undefined)) {
			ctx.addIssue({
				code: 'custom',
				path: ['newValue'],
				message: 'Pass replace: true together with newValue, or use add/remove.',
			});
		}
	});

// ── items ─────────────────────────────────────────────────────────────────

export const OnedeskItemSchema = z
	.object({
		id: z.number().nullish(),
		externalId: z.string().nullish(),
		name: z.string().nullish(),
		description: z.string().nullish(),
		type: z.object({ name: z.string().nullish() }).loose().nullish(),
		lifecycleStatus: LifecycleStatusSchema.nullish(),
		priority: z.number().nullish(),
		created: z.string().nullish(),
		edited: z.string().nullish(),
		latestInProgress: z.string().nullish(),
		latestClose: z.string().nullish(),
		author: OnedeskUserRefSchema.nullish(),
		assignees: z.array(OnedeskUserRefSchema).nullish(),
		project: z
			.object({
				externalId: z.string().nullish(),
				name: z.string().nullish(),
			})
			.loose()
			.nullish(),
		timesheets: z.array(z.string()).nullish(),
		agilePoints: z.number().nullish(),
		customFieldsData: z.array(CustomFieldValueSchema).nullish(),
	})
	.loose();

export type OnedeskItem = z.infer<typeof OnedeskItemSchema>;

const ItemsFilterBodySchema = SimpleFilterSchema.extend({
	itemType: z
		.array(z.string().min(1))
		.min(1)
		.describe(
			"One or more work item type names, for example ['Ticket']. A bare string is rejected by the API. Read the valid names with organization.itemTypes.",
		),
	customFields: z.array(CustomFieldFilterSchema).optional(),
});

const ItemsFilterInputSchema = ItemsFilterBodySchema;

export type ItemsFilterInput = z.input<typeof ItemsFilterInputSchema>;

const ItemsFilterIdsResponseSchema = pagedResult(z.string());

export type ItemsFilterIdsResponse = z.infer<
	typeof ItemsFilterIdsResponseSchema
>;

const ItemsFilterDetailsInputSchema = ItemsFilterBodySchema;

export type ItemsFilterDetailsInput = z.input<
	typeof ItemsFilterDetailsInputSchema
>;

const ItemsFilterDetailsResponseSchema = pagedResult(OnedeskItemSchema);

export type ItemsFilterDetailsResponse = z.infer<
	typeof ItemsFilterDetailsResponseSchema
>;

const ItemsGetInputSchema = z
	.object({
		externalId: z
			.string()
			.min(1)
			.optional()
			.describe("The item's external id."),
		id: z
			.number()
			.int()
			.optional()
			.describe("The item's numeric id in this organization."),
	})
	.superRefine((value, ctx) => {
		if (value.externalId === undefined && value.id === undefined) {
			ctx.addIssue({
				code: 'custom',
				path: ['externalId'],
				message: 'Pass externalId or id.',
			});
		}
	});

export type ItemsGetInput = z.input<typeof ItemsGetInputSchema>;

const ItemResultSchema = z
	.object({ code: z.string().nullish(), data: OnedeskItemSchema.nullish() })
	.loose();

const ItemsCreateInputSchema = z.object({
	name: z.string().min(1).describe('Name of the work item.'),
	type: z
		.string()
		.min(1)
		.optional()
		.describe(
			"Work item type name, for example 'Ticket'. Read the valid names with organization.itemTypes.",
		),
	description: z.string().optional(),
	attachmentExternalIds: z.array(z.string()).optional(),
	projectExternalId: z.string().optional(),
	priority: PrioritySchema.optional(),
	requesterExternalIds: z.array(z.string()).optional(),
	requesterEmails: z.array(z.string()).optional(),
	followerExternalIds: z.array(z.string()).optional(),
	plannedHour: z.number().min(0).optional(),
	plannedStart: z.string().optional(),
	plannedFinish: z.string().optional(),
	customFields: CustomFieldInputSchema.describe('Custom field name to value.'),
	authorExternalId: z.string().nullish(),
});

export type ItemsCreateInput = z.input<typeof ItemsCreateInputSchema>;

const ItemsUpdateInputSchema = z
	.object({
		externalId: z
			.string()
			.min(1)
			.optional()
			.describe("The item's external id."),
		id: z.number().int().optional().describe("The item's numeric id."),
		name: z.string().min(1).optional(),
		description: z.string().optional(),
		type: z.string().min(1).optional(),
		projectExternalId: z.string().optional(),
		agilePoints: z.number().int().optional(),
		priority: PrioritySchema.optional(),
		percentComplete: z.number().int().min(0).max(100).optional(),
		relatedItemExternalIds: listUpdate.optional(),
		duplicatesItemExternalIds: listUpdate.optional(),
		duplicatedByItemExternalIds: listUpdate.optional(),
		blocksItemExternalIds: listUpdate.optional(),
		blockedByItemExternalIds: listUpdate.optional(),
		precededByItemExternalIds: listUpdate.optional(),
		succeededByItemExternalIds: listUpdate.optional(),
		customFields: CustomFieldInputSchema,
		lifecycleStatusName: z
			.string()
			.min(1)
			.optional()
			.describe(
				'New lifecycle status by name. Read the valid names with organization.lifecycleStatus.',
			),
		attachmentExternalIds: listUpdate.optional(),
		plannedStart: z.string().optional(),
		plannedFinish: z.string().optional(),
		plannedHours: z.number().min(0).optional(),
		actualStart: z.string().optional(),
		actualFinish: z.string().optional(),
		actualHours: z.number().min(0).optional(),
		followerUserAndCustomerExternalIds: listUpdate.optional(),
		followerTeamAndCustomerOrganizationExternalIds: listUpdate.optional(),
		assignedUserExternalIds: listUpdate.optional(),
		assignedTeamExternalIds: listUpdate.optional(),
		requesterUserAndCustomerExternalIds: listUpdate.optional(),
		requesterTeamAndCustomerOrganizationExternalIds: listUpdate.optional(),
		archived: z.boolean().optional(),
	})
	.superRefine((value, ctx) => {
		if (value.externalId === undefined && value.id === undefined) {
			ctx.addIssue({
				code: 'custom',
				path: ['externalId'],
				message: 'Pass externalId or id.',
			});
		}
	});

export type ItemsUpdateInput = z.input<typeof ItemsUpdateInputSchema>;

const ItemsUpdateResponseSchema = z.object({
	code: z.string(),
});

export type ItemsUpdateResponse = z.infer<typeof ItemsUpdateResponseSchema>;

// ── users ─────────────────────────────────────────────────────────────────

export const OnedeskUserSchema = z
	.object({
		id: z.number().nullish(),
		externalId: z.string().nullish(),
		userType: z.string().nullish(),
		created: z.string().nullish(),
		priority: z.number().nullish(),
		registered: z.boolean().nullish(),
		profile: z
			.object({
				firstName: z.string().nullish(),
				lastName: z.string().nullish(),
				email: z.string().nullish(),
				phoneWork: z.string().nullish(),
				title: z.string().nullish(),
				language: z.string().nullish(),
			})
			.loose()
			.nullish(),
		address: AddressSchema.nullish(),
		customFieldsData: z.array(CustomFieldValueSchema).nullish(),
		// Live API: team external ids, not embedded objects.
		teams: z.array(z.string()).nullish(),
	})
	.loose();

export type OnedeskUser = z.infer<typeof OnedeskUserSchema>;

const UsersFilterInputSchema = CustomFieldFilterBodySchema;

export type UsersFilterInput = z.input<typeof UsersFilterInputSchema>;

const UsersFilterIdsResponseSchema = pagedResult(z.string());

export type UsersFilterIdsResponse = z.infer<
	typeof UsersFilterIdsResponseSchema
>;

const UsersFilterDetailsInputSchema = CustomFieldFilterBodySchema;

export type UsersFilterDetailsInput = z.input<
	typeof UsersFilterDetailsInputSchema
>;

const UsersFilterDetailsResponseSchema = pagedResult(OnedeskUserSchema);

export type UsersFilterDetailsResponse = z.infer<
	typeof UsersFilterDetailsResponseSchema
>;

const UsersGetInputSchema = z
	.object({
		externalId: z.string().min(1).optional(),
		id: z.number().int().optional(),
	})
	.superRefine((value, ctx) => {
		if (value.externalId === undefined && value.id === undefined) {
			ctx.addIssue({
				code: 'custom',
				path: ['externalId'],
				message: 'Pass externalId or id.',
			});
		}
	});

export type UsersGetInput = z.input<typeof UsersGetInputSchema>;

const UserResultSchema = z
	.object({ code: z.string().nullish(), data: OnedeskUserSchema.nullish() })
	.loose();

const UsersCreateInputSchema = z.object({
	email: z.email().describe('Login email of the new user.'),
	firstName: z.string().optional(),
	lastName: z.string().optional(),
	type: z
		.string()
		.min(1)
		.optional()
		.describe(
			'User type name, for example full-time. Read the valid names with organization.userTypes.',
		),
	teams: z.array(z.string()).optional().describe('Team external ids.'),
	isAdmin: z.boolean().optional(),
});

export type UsersCreateInput = z.input<typeof UsersCreateInputSchema>;

const UsersUpdateInputSchema = z
	.object({
		externalId: z.string().min(1).optional(),
		id: z.number().int().optional(),
		firstName: z.string().optional(),
		lastName: z.string().optional(),
		email: z.email().optional(),
		phoneNumber: z.string().optional(),
		type: z.string().min(1).optional(),
		priority: PrioritySchema.optional(),
		address: AddressSchema.optional(),
		title: z.string().optional(),
		pictureAttachmentExternalId: z.string().optional(),
		teamExternalIds: listUpdate.optional(),
		customFields: CustomFieldInputSchema,
	})
	.superRefine((value, ctx) => {
		if (value.externalId === undefined && value.id === undefined) {
			ctx.addIssue({
				code: 'custom',
				path: ['externalId'],
				message: 'Pass externalId or id.',
			});
		}
	});

export type UsersUpdateInput = z.input<typeof UsersUpdateInputSchema>;

const UsersUpdateResponseSchema = z.object({ code: z.string() });

export type UsersUpdateResponse = z.infer<typeof UsersUpdateResponseSchema>;

// ── projects and portfolios ───────────────────────────────────────────────

export const OnedeskProjectSchema = z
	.object({
		id: z.number().nullish(),
		externalId: z.string().nullish(),
		name: z.string().nullish(),
		description: z.string().nullish(),
		created: z.string().nullish(),
		archivedDate: z.string().nullish(),
		type: z.string().nullish(),
		invoiceType: z.string().nullish(),
		lifecycleStatus: LifecycleStatusSchema.nullish(),
		author: OnedeskUserRefSchema.nullish(),
		discoverable: z.boolean().nullish(),
		parentExternalIds: z.array(z.string()).nullish(),
		customFields: z.array(CustomFieldValueSchema).nullish(),
		attachments: z.array(AttachmentRefSchema).nullish(),
	})
	.loose();

export type OnedeskProject = z.infer<typeof OnedeskProjectSchema>;

export const ONEDESK_INVOICE_TYPES = [
	'actual work performed',
	'flat fee',
	'prepaid hours',
	'no invoice planned',
] as const;

const InvoiceTypeSchema = z.enum(ONEDESK_INVOICE_TYPES);

const ProjectsFilterInputSchema = CustomFieldFilterBodySchema;

export type ProjectsFilterInput = z.input<typeof ProjectsFilterInputSchema>;

const ProjectsFilterIdsResponseSchema = pagedResult(z.string());

export type ProjectsFilterIdsResponse = z.infer<
	typeof ProjectsFilterIdsResponseSchema
>;

const ProjectsFilterDetailsInputSchema = CustomFieldFilterBodySchema;

export type ProjectsFilterDetailsInput = z.input<
	typeof ProjectsFilterDetailsInputSchema
>;

const ProjectsFilterDetailsResponseSchema = pagedResult(OnedeskProjectSchema);

export type ProjectsFilterDetailsResponse = z.infer<
	typeof ProjectsFilterDetailsResponseSchema
>;

const ProjectsGetInputSchema = z
	.object({
		externalId: z.string().min(1).optional(),
		id: z.number().int().optional(),
	})
	.superRefine((value, ctx) => {
		if (value.externalId === undefined && value.id === undefined) {
			ctx.addIssue({
				code: 'custom',
				path: ['externalId'],
				message: 'Pass externalId or id.',
			});
		}
	});

export type ProjectsGetInput = z.input<typeof ProjectsGetInputSchema>;

const ProjectResultSchema = z
	.object({ code: z.string().nullish(), data: OnedeskProjectSchema.nullish() })
	.loose();

const ProjectsCreateInputSchema = z.object({
	name: z.string().min(1).describe('Name of the project.'),
	type: z.string().min(1).optional(),
	description: z.string().optional(),
	parentPortfolioExternalIds: z.array(z.string()).optional(),
	attachmentsExternalIds: z.array(z.string()).optional(),
	userFollowerExternalIds: z.array(z.string()).optional(),
	customerFollowerExternalIds: z.array(z.string()).optional(),
	customerRequesterExternalId: z.string().optional(),
	invoiceType: InvoiceTypeSchema.optional(),
	plannedStart: z.string().optional(),
	dueDate: z.string().optional(),
	authorExternalId: z.string().nullish(),
});

export type ProjectsCreateInput = z.input<typeof ProjectsCreateInputSchema>;

const ProjectsUpdateInputSchema = z
	.object({
		externalId: z.string().min(1).optional(),
		id: z.number().int().optional(),
		name: z.string().min(1).optional(),
		type: z.string().min(1).optional(),
		description: z.string().optional(),
		lifecycleStatus: z.string().min(1).optional(),
		invoiceType: InvoiceTypeSchema.optional(),
		portfolioExternalIds: listUpdate.optional(),
		attachmentExternalIds: listUpdate.optional(),
		customFields: CustomFieldInputSchema,
		archived: z.boolean().optional(),
	})
	.superRefine((value, ctx) => {
		if (value.externalId === undefined && value.id === undefined) {
			ctx.addIssue({
				code: 'custom',
				path: ['externalId'],
				message: 'Pass externalId or id.',
			});
		}
	});

export type ProjectsUpdateInput = z.input<typeof ProjectsUpdateInputSchema>;

const ProjectsUpdateResponseSchema = z.object({ code: z.string() });

export type ProjectsUpdateResponse = z.infer<
	typeof ProjectsUpdateResponseSchema
>;

export const OnedeskPortfolioSchema = z
	.object({
		id: z.number().nullish(),
		externalId: z.string().nullish(),
		name: z.string().nullish(),
		description: z.string().nullish(),
		type: z.string().nullish(),
		parentExternalIds: z.array(z.string()).nullish(),
		attachments: z.array(AttachmentRefSchema).nullish(),
	})
	.loose();

export type OnedeskPortfolio = z.infer<typeof OnedeskPortfolioSchema>;

const PortfoliosFilterInputSchema = SimpleFilterSchema;

export type PortfoliosFilterInput = z.input<typeof PortfoliosFilterInputSchema>;

const PortfoliosFilterIdsResponseSchema = pagedResult(z.string());

export type PortfoliosFilterIdsResponse = z.infer<
	typeof PortfoliosFilterIdsResponseSchema
>;

const PortfoliosFilterDetailsInputSchema = SimpleFilterSchema;

export type PortfoliosFilterDetailsInput = z.input<
	typeof PortfoliosFilterDetailsInputSchema
>;

const PortfoliosFilterDetailsResponseSchema = pagedResult(
	OnedeskPortfolioSchema,
);

export type PortfoliosFilterDetailsResponse = z.infer<
	typeof PortfoliosFilterDetailsResponseSchema
>;

const PortfoliosGetInputSchema = z.object({
	externalId: z.string().min(1).describe("The portfolio's external id."),
});

export type PortfoliosGetInput = z.input<typeof PortfoliosGetInputSchema>;

const PortfolioResultSchema = z
	.object({
		code: z.string().nullish(),
		data: OnedeskPortfolioSchema.nullish(),
	})
	.loose();

const PortfoliosCreateInputSchema = z.object({
	name: z.string().min(1).describe('Name of the portfolio.'),
	description: z.string().optional(),
	type: z.string().min(1).optional(),
	parentPortfolioExternalIds: z.array(z.string()).optional(),
	attachmentExternalIds: z.array(z.string()).optional(),
});

export type PortfoliosCreateInput = z.input<typeof PortfoliosCreateInputSchema>;

const PortfoliosUpdateInputSchema = z.object({
	externalId: z.string().min(1).describe("The portfolio's external id."),
	name: z.string().min(1).optional(),
	description: z.string().optional(),
	type: z.string().min(1).optional(),
	parentPortfolioExternalIds: listUpdate.optional(),
	attachmentExternalIds: listUpdate.optional(),
});

export type PortfoliosUpdateInput = z.input<typeof PortfoliosUpdateInputSchema>;

const PortfoliosUpdateResponseSchema = z.object({ code: z.string() });

export type PortfoliosUpdateResponse = z.infer<
	typeof PortfoliosUpdateResponseSchema
>;

// ── teams ─────────────────────────────────────────────────────────────────

export const OnedeskTeamSchema = z
	.object({
		id: z.number().nullish(),
		externalId: z.string().nullish(),
		name: z.string().nullish(),
		// Live API: a list of user external ids, not embedded objects.
		userExternalIds: z.array(z.string()).nullish(),
	})
	.loose();

export type OnedeskTeam = z.infer<typeof OnedeskTeamSchema>;

const TeamsFilterInputSchema = SimpleFilterSchema;

export type TeamsFilterInput = z.input<typeof TeamsFilterInputSchema>;

const TeamsFilterIdsResponseSchema = pagedResult(z.string());

export type TeamsFilterIdsResponse = z.infer<
	typeof TeamsFilterIdsResponseSchema
>;

const TeamsFilterDetailsInputSchema = SimpleFilterSchema;

export type TeamsFilterDetailsInput = z.input<
	typeof TeamsFilterDetailsInputSchema
>;

const TeamsFilterDetailsResponseSchema = pagedResult(OnedeskTeamSchema);

export type TeamsFilterDetailsResponse = z.infer<
	typeof TeamsFilterDetailsResponseSchema
>;

const TeamsGetInputSchema = z.object({
	externalId: z.string().min(1).describe("The team's external id."),
});

export type TeamsGetInput = z.input<typeof TeamsGetInputSchema>;

const TeamResultSchema = z
	.object({ code: z.string().nullish(), data: OnedeskTeamSchema.nullish() })
	.loose();

const TeamsCreateInputSchema = z.object({
	name: z.string().min(1).describe('Name of the team.'),
	users: z.array(z.string()).optional().describe('User external ids.'),
});

export type TeamsCreateInput = z.input<typeof TeamsCreateInputSchema>;

const TeamsUpdateInputSchema = z.object({
	externalId: z.string().min(1).describe("The team's external id."),
	name: z.string().min(1).optional(),
	users: listUpdate.optional(),
});

export type TeamsUpdateInput = z.input<typeof TeamsUpdateInputSchema>;

const TeamsUpdateResponseSchema = z.object({ code: z.string() });

export type TeamsUpdateResponse = z.infer<typeof TeamsUpdateResponseSchema>;

// ── customers and organizations ───────────────────────────────────────────

export const OnedeskCustomerSchema = z
	.object({
		id: z.number().nullish(),
		externalId: z.string().nullish(),
		firstName: z.string().nullish(),
		lastName: z.string().nullish(),
		email: z.string().nullish(),
		phoneNumber: z.string().nullish(),
		type: z.string().nullish(),
		priority: z.number().nullish(),
		title: z.string().nullish(),
		address: AddressSchema.nullish(),
		organization: z
			.object({
				externalId: z.string().nullish(),
				name: z.string().nullish(),
			})
			.loose()
			.nullish(),
		customFieldsData: z.array(CustomFieldValueSchema).nullish(),
	})
	.loose();

export type OnedeskCustomer = z.infer<typeof OnedeskCustomerSchema>;

const CustomersFilterInputSchema = CustomFieldFilterBodySchema;

export type CustomersFilterInput = z.input<typeof CustomersFilterInputSchema>;

const CustomersFilterIdsResponseSchema = pagedResult(z.string());

export type CustomersFilterIdsResponse = z.infer<
	typeof CustomersFilterIdsResponseSchema
>;

const CustomersFilterDetailsInputSchema = CustomFieldFilterBodySchema;

export type CustomersFilterDetailsInput = z.input<
	typeof CustomersFilterDetailsInputSchema
>;

const CustomersFilterDetailsResponseSchema = pagedResult(OnedeskCustomerSchema);

export type CustomersFilterDetailsResponse = z.infer<
	typeof CustomersFilterDetailsResponseSchema
>;

const CustomersGetInputSchema = z
	.object({
		externalId: z.string().min(1).optional(),
		id: z.number().int().optional(),
	})
	.superRefine((value, ctx) => {
		if (value.externalId === undefined && value.id === undefined) {
			ctx.addIssue({
				code: 'custom',
				path: ['externalId'],
				message: 'Pass externalId or id.',
			});
		}
	});

export type CustomersGetInput = z.input<typeof CustomersGetInputSchema>;

const CustomerResultSchema = z
	.object({
		code: z.string().nullish(),
		data: OnedeskCustomerSchema.nullish(),
	})
	.loose();

const CustomersCreateInputSchema = z.object({
	email: z.email().describe('Email of the customer.'),
	firstName: z.string().optional(),
	lastName: z.string().optional(),
	type: z.string().min(1).optional(),
	customerOrganization: z
		.string()
		.optional()
		.describe('Customer organization external id.'),
});

export type CustomersCreateInput = z.input<typeof CustomersCreateInputSchema>;

const CustomersUpdateInputSchema = z
	.object({
		externalId: z.string().min(1).optional(),
		id: z.number().int().optional(),
		firstName: z.string().optional(),
		lastName: z.string().optional(),
		email: z.email().optional(),
		phoneNumber: z.string().optional(),
		type: z.string().min(1).optional(),
		priority: PrioritySchema.optional(),
		address: AddressSchema.optional(),
		title: z.string().optional(),
		deactivate: z
			.boolean()
			.optional()
			.describe('Deactivate the customer, which stops them signing in.'),
		pictureAttachmentExternalId: z.string().optional(),
		customerOrganizationExternalId: z.string().optional(),
		customFields: CustomFieldInputSchema,
	})
	.superRefine((value, ctx) => {
		if (value.externalId === undefined && value.id === undefined) {
			ctx.addIssue({
				code: 'custom',
				path: ['externalId'],
				message: 'Pass externalId or id.',
			});
		}
	});

export type CustomersUpdateInput = z.input<typeof CustomersUpdateInputSchema>;

const CustomersUpdateResponseSchema = z.object({ code: z.string() });

export type CustomersUpdateResponse = z.infer<
	typeof CustomersUpdateResponseSchema
>;

export const OnedeskCustomerOrganizationSchema = z
	.object({
		id: z.number().nullish(),
		externalId: z.string().nullish(),
		name: z.string().nullish(),
		description: z.string().nullish(),
		phoneNumber: z.string().nullish(),
		address: AddressSchema.nullish(),
		domains: z
			.array(
				z
					.object({
						domain: z.string().nullish(),
						externalId: z.string().nullish(),
					})
					.loose(),
			)
			.nullish(),
		customers: z
			.array(
				z
					.object({
						externalId: z.string().nullish(),
						email: z.string().nullish(),
					})
					.loose(),
			)
			.nullish(),
	})
	.loose();

export type OnedeskCustomerOrganization = z.infer<
	typeof OnedeskCustomerOrganizationSchema
>;

const OrganizationsFilterInputSchema = CustomFieldFilterBodySchema;

export type OrganizationsFilterInput = z.input<
	typeof OrganizationsFilterInputSchema
>;

const OrganizationsFilterIdsResponseSchema = pagedResult(z.string());

export type OrganizationsFilterIdsResponse = z.infer<
	typeof OrganizationsFilterIdsResponseSchema
>;

const OrganizationsFilterDetailsInputSchema = CustomFieldFilterBodySchema;

export type OrganizationsFilterDetailsInput = z.input<
	typeof OrganizationsFilterDetailsInputSchema
>;

const OrganizationsFilterDetailsResponseSchema = pagedResult(
	OnedeskCustomerOrganizationSchema,
);

export type OrganizationsFilterDetailsResponse = z.infer<
	typeof OrganizationsFilterDetailsResponseSchema
>;

const OrganizationsGetInputSchema = z.object({
	externalId: z.string().min(1).describe("The organization's external id."),
});

export type OrganizationsGetInput = z.input<typeof OrganizationsGetInputSchema>;

const OrganizationResultSchema = z
	.object({
		code: z.string().nullish(),
		data: OnedeskCustomerOrganizationSchema.nullish(),
	})
	.loose();

const OrganizationsCreateInputSchema = z.object({
	name: z.string().min(1).describe('Name of the customer organization.'),
	domains: z.array(z.string()).optional(),
	customers: z.array(z.string()).optional().describe('Customer external ids.'),
});

export type OrganizationsCreateInput = z.input<
	typeof OrganizationsCreateInputSchema
>;

const OrganizationsUpdateInputSchema = z.object({
	externalId: z.string().min(1).describe("The organization's external id."),
	name: z.string().min(1).optional(),
	description: z.string().optional(),
	phoneNumber: z.string().optional(),
	address: AddressSchema.optional(),
	attachments: listUpdate.optional(),
	domains: listUpdate.optional(),
	customers: listUpdate.optional(),
	customFields: CustomFieldInputSchema,
});

export type OrganizationsUpdateInput = z.input<
	typeof OrganizationsUpdateInputSchema
>;

const OrganizationsUpdateResponseSchema = z.object({ code: z.string() });

export type OrganizationsUpdateResponse = z.infer<
	typeof OrganizationsUpdateResponseSchema
>;

// ── timesheets and timers ─────────────────────────────────────────────────

export const OnedeskTimesheetSchema = z
	.object({
		id: z.number().nullish(),
		externalId: z.string().nullish(),
		works: z.number().nullish(),
		billable: z.boolean().nullish(),
		note: z.string().nullish(),
		status: z.string().nullish(),
		completion: z.number().nullish(),
		start: z.string().nullish(),
		finish: z.string().nullish(),
		customFieldsData: z.array(CustomFieldValueSchema).nullish(),
	})
	.loose();

export type OnedeskTimesheet = z.infer<typeof OnedeskTimesheetSchema>;

const TimesheetsFilterInputSchema = CustomFieldFilterBodySchema;

export type TimesheetsFilterInput = z.input<typeof TimesheetsFilterInputSchema>;

const TimesheetsFilterIdsResponseSchema = pagedResult(z.string());

export type TimesheetsFilterIdsResponse = z.infer<
	typeof TimesheetsFilterIdsResponseSchema
>;

const TimesheetsFilterDetailsInputSchema = CustomFieldFilterBodySchema;

export type TimesheetsFilterDetailsInput = z.input<
	typeof TimesheetsFilterDetailsInputSchema
>;

const TimesheetsFilterDetailsResponseSchema = pagedResult(
	OnedeskTimesheetSchema,
);

export type TimesheetsFilterDetailsResponse = z.infer<
	typeof TimesheetsFilterDetailsResponseSchema
>;

const TimesheetsGetInputSchema = z
	.object({
		externalId: z.string().min(1).optional(),
		id: z.number().int().optional(),
	})
	.superRefine((value, ctx) => {
		if (value.externalId === undefined && value.id === undefined) {
			ctx.addIssue({
				code: 'custom',
				path: ['externalId'],
				message: 'Pass externalId or id.',
			});
		}
	});

export type TimesheetsGetInput = z.input<typeof TimesheetsGetInputSchema>;

const TimesheetResultSchema = z
	.object({
		code: z.string().nullish(),
		data: OnedeskTimesheetSchema.nullish(),
	})
	.loose();

const TimesheetsCreateInputSchema = z.object({
	userExternalId: z.string().min(1).describe('User the work belongs to.'),
	taskExternalId: z
		.string()
		.min(1)
		.describe('Work item the time is booked to.'),
	works: z.number().min(0).describe('Amount of work in hours.'),
	billable: z.boolean().optional(),
	note: z.string().optional(),
	lifecycleStatusName: z.string().min(1).optional(),
	percentCompleted: z.number().int().min(0).max(100),
	start: z.string().optional(),
	finish: z.string().describe('When the work finished.'),
	customFields: CustomFieldInputSchema,
	authorExternalId: z.string().nullish(),
});

export type TimesheetsCreateInput = z.input<typeof TimesheetsCreateInputSchema>;

export const ONEDESK_TIMESHEET_STATUSES = [
	'approved',
	'not approved yet',
	'declined',
] as const;

const TimesheetsUpdateInputSchema = z
	.object({
		externalId: z.string().min(1).optional(),
		id: z.number().int().optional(),
		works: z.number().min(0).optional(),
		billable: z.boolean().optional(),
		note: z.string().optional(),
		status: z.enum(ONEDESK_TIMESHEET_STATUSES).optional(),
		completion: z.number().int().min(0).max(100).optional(),
		start: z.string().optional(),
		finish: z.string().optional(),
		invoiceWork: z.number().min(0).optional(),
		userAndCustomerRequesterExternalIds: listUpdate.optional(),
		teamAndCustomerOrganizationRequesterExternalIds: listUpdate.optional(),
		invoiceableCustomerOrganizationExternalId: z.string().optional(),
		serviceType: z.string().optional(),
		customFields: CustomFieldInputSchema,
	})
	.superRefine((value, ctx) => {
		if (value.externalId === undefined && value.id === undefined) {
			ctx.addIssue({
				code: 'custom',
				path: ['externalId'],
				message: 'Pass externalId or id.',
			});
		}
	});

export type TimesheetsUpdateInput = z.input<typeof TimesheetsUpdateInputSchema>;

const TimesheetsUpdateResponseSchema = z.object({ code: z.string() });

export type TimesheetsUpdateResponse = z.infer<
	typeof TimesheetsUpdateResponseSchema
>;

export const OnedeskTimerSchema = z
	.object({
		id: z.number().nullish(),
		externalId: z.string().nullish(),
		status: z.string().nullish(),
		works: z.number().nullish(),
		start: z.string().nullish(),
		finish: z.string().nullish(),
	})
	.loose();

export type OnedeskTimer = z.infer<typeof OnedeskTimerSchema>;

const TimersFilterInputSchema = SimpleFilterSchema;

export type TimersFilterInput = z.input<typeof TimersFilterInputSchema>;

const TimersFilterIdsResponseSchema = pagedResult(z.string());

export type TimersFilterIdsResponse = z.infer<
	typeof TimersFilterIdsResponseSchema
>;

const TimersFilterDetailsInputSchema = SimpleFilterSchema;

export type TimersFilterDetailsInput = z.input<
	typeof TimersFilterDetailsInputSchema
>;

const TimersFilterDetailsResponseSchema = pagedResult(OnedeskTimerSchema);

export type TimersFilterDetailsResponse = z.infer<
	typeof TimersFilterDetailsResponseSchema
>;

const TimersGetInputSchema = z.object({
	externalId: z.string().min(1).describe("The timer's external id."),
});

export type TimersGetInput = z.input<typeof TimersGetInputSchema>;

const TimerResultSchema = z
	.object({ code: z.string().nullish(), data: OnedeskTimerSchema.nullish() })
	.loose();

const TimerStartInputSchema = z.object({
	timerExternalId: z
		.string()
		.min(1)
		.describe(
			'Timer external id: the same value resumes the same timer later.',
		),
	itemExternalId: z.string().min(1).describe('Work item the timer is for.'),
});

export type TimerStartInput = z.input<typeof TimerStartInputSchema>;

const TimerNamedInputSchema = z.object({
	timerExternalId: z.string().min(1).describe('Timer external id.'),
});

export type TimerNamedInput = z.input<typeof TimerNamedInputSchema>;

// ── invoices and quotes ───────────────────────────────────────────────────

export const OnedeskInvoiceSchema = z
	.object({
		id: z.number().nullish(),
		externalId: z.string().nullish(),
		displayNumber: z.string().nullish(),
		status: z.string().nullish(),
		dueDate: z.string().nullish(),
		total: z.number().nullish(),
		balance: z.number().nullish(),
		created: z.string().nullish(),
	})
	.loose();

export type OnedeskInvoice = z.infer<typeof OnedeskInvoiceSchema>;

export const ONEDESK_INVOICE_STATUSES = [
	'draft',
	'open',
	'sent',
	'paid',
	'not collectible',
	'void',
] as const;

/**
 * A line item. OneDesk documents the accepted keys only by example, so the
 * fields are typed as the JSON scalars those examples use rather than left
 * untyped.
 */
const LineItemValueSchema = z.union([
	z.string(),
	z.number(),
	z.boolean(),
	z.null(),
]);

const LineItemSchema = z
	.record(z.string(), LineItemValueSchema)
	.describe(
		'A line item object. OneDesk documents the accepted keys only by example, so the object passes through unchanged.',
	);

const InvoicesFilterInputSchema = SimpleFilterSchema;

export type InvoicesFilterInput = z.input<typeof InvoicesFilterInputSchema>;

const InvoicesFilterIdsResponseSchema = pagedResult(z.string());

export type InvoicesFilterIdsResponse = z.infer<
	typeof InvoicesFilterIdsResponseSchema
>;

const InvoicesFilterDetailsInputSchema = SimpleFilterSchema;

export type InvoicesFilterDetailsInput = z.input<
	typeof InvoicesFilterDetailsInputSchema
>;

const InvoicesFilterDetailsResponseSchema = pagedResult(OnedeskInvoiceSchema);

export type InvoicesFilterDetailsResponse = z.infer<
	typeof InvoicesFilterDetailsResponseSchema
>;

const InvoicesGetInputSchema = z
	.object({
		externalId: z.string().min(1).optional(),
		id: z.number().int().optional(),
	})
	.superRefine((value, ctx) => {
		if (value.externalId === undefined && value.id === undefined) {
			ctx.addIssue({
				code: 'custom',
				path: ['externalId'],
				message: 'Pass externalId or id.',
			});
		}
	});

export type InvoicesGetInput = z.input<typeof InvoicesGetInputSchema>;

const InvoiceResultSchema = z
	.object({ code: z.string().nullish(), data: OnedeskInvoiceSchema.nullish() })
	.loose();

const InvoicesUpdateInputSchema = z
	.object({
		externalId: z.string().min(1).optional(),
		id: z.number().int().optional(),
		displayNumber: z.string().optional(),
		status: z.enum(ONEDESK_INVOICE_STATUSES).optional(),
		dueDate: z.string().optional(),
		basicLineItemsToAdd: z.array(LineItemSchema).optional(),
		serviceLineItemsToAdd: z.array(LineItemSchema).optional(),
		prepaidHoursLineItemToAdd: z.array(LineItemSchema).optional(),
	})
	.superRefine((value, ctx) => {
		if (value.externalId === undefined && value.id === undefined) {
			ctx.addIssue({
				code: 'custom',
				path: ['externalId'],
				message: 'Pass externalId or id.',
			});
		}
	});

export type InvoicesUpdateInput = z.input<typeof InvoicesUpdateInputSchema>;

const InvoicesUpdateResponseSchema = z.object({ code: z.string() });

export type InvoicesUpdateResponse = z.infer<
	typeof InvoicesUpdateResponseSchema
>;

export const OnedeskQuoteSchema = z
	.object({
		id: z.number().nullish(),
		externalId: z.string().nullish(),
		displayNumber: z.string().nullish(),
		status: z.string().nullish(),
		expirationDate: z.string().nullish(),
		total: z.number().nullish(),
		created: z.string().nullish(),
	})
	.loose();

export type OnedeskQuote = z.infer<typeof OnedeskQuoteSchema>;

export const ONEDESK_QUOTE_STATUSES = [
	'draft',
	'open',
	'sent',
	'accepted',
	'cancelled',
	'convert to invoice',
] as const;

const QuotesFilterInputSchema = SimpleFilterSchema;

export type QuotesFilterInput = z.input<typeof QuotesFilterInputSchema>;

const QuotesFilterIdsResponseSchema = pagedResult(z.string());

export type QuotesFilterIdsResponse = z.infer<
	typeof QuotesFilterIdsResponseSchema
>;

const QuotesFilterDetailsInputSchema = SimpleFilterSchema;

export type QuotesFilterDetailsInput = z.input<
	typeof QuotesFilterDetailsInputSchema
>;

const QuotesFilterDetailsResponseSchema = pagedResult(OnedeskQuoteSchema);

export type QuotesFilterDetailsResponse = z.infer<
	typeof QuotesFilterDetailsResponseSchema
>;

const QuotesGetInputSchema = z
	.object({
		externalId: z.string().min(1).optional(),
		id: z.number().int().optional(),
	})
	.superRefine((value, ctx) => {
		if (value.externalId === undefined && value.id === undefined) {
			ctx.addIssue({
				code: 'custom',
				path: ['externalId'],
				message: 'Pass externalId or id.',
			});
		}
	});

export type QuotesGetInput = z.input<typeof QuotesGetInputSchema>;

const QuoteResultSchema = z
	.object({ code: z.string().nullish(), data: OnedeskQuoteSchema.nullish() })
	.loose();

const QuotesUpdateInputSchema = z
	.object({
		externalId: z.string().min(1).optional(),
		id: z.number().int().optional(),
		displayNumber: z.string().optional(),
		status: z.enum(ONEDESK_QUOTE_STATUSES).optional(),
		expirationDate: z.string().optional(),
		basicLineItemsToAdd: z.array(LineItemSchema).optional(),
		serviceLineItemsToAdd: z.array(LineItemSchema).optional(),
		prepaidHoursLineItemToAdd: z.array(LineItemSchema).optional(),
	})
	.superRefine((value, ctx) => {
		if (value.externalId === undefined && value.id === undefined) {
			ctx.addIssue({
				code: 'custom',
				path: ['externalId'],
				message: 'Pass externalId or id.',
			});
		}
	});

export type QuotesUpdateInput = z.input<typeof QuotesUpdateInputSchema>;

const QuotesUpdateResponseSchema = z.object({ code: z.string() });

export type QuotesUpdateResponse = z.infer<typeof QuotesUpdateResponseSchema>;

// ── conversations and messages ────────────────────────────────────────────

export const OnedeskConversationSchema = z
	.object({
		externalId: z.string().nullish(),
		itemExternalId: z.string().nullish(),
		projectExternalId: z.string().nullish(),
		publicConversation: z.boolean().nullish(),
		open: z.boolean().nullish(),
		lock: z.boolean().nullish(),
		author: OnedeskUserRefSchema.nullish(),
	})
	.loose();

export type OnedeskConversation = z.infer<typeof OnedeskConversationSchema>;

const ConversationsFilterInputSchema = SimpleFilterSchema;

export type ConversationsFilterInput = z.input<
	typeof ConversationsFilterInputSchema
>;

const ConversationsFilterIdsResponseSchema = pagedResult(z.string());

export type ConversationsFilterIdsResponse = z.infer<
	typeof ConversationsFilterIdsResponseSchema
>;

const ConversationsFilterDetailsInputSchema = SimpleFilterSchema;

export type ConversationsFilterDetailsInput = z.input<
	typeof ConversationsFilterDetailsInputSchema
>;

const ConversationsFilterDetailsResponseSchema = pagedResult(
	OnedeskConversationSchema,
);

export type ConversationsFilterDetailsResponse = z.infer<
	typeof ConversationsFilterDetailsResponseSchema
>;

const ConversationsGetInputSchema = z.object({
	externalId: z.string().min(1).describe("The conversation's external id."),
});

export type ConversationsGetInput = z.input<typeof ConversationsGetInputSchema>;

const ConversationResultSchema = z
	.object({
		code: z.string().nullish(),
		data: OnedeskConversationSchema.nullish(),
	})
	.loose();

const ConversationsCreateInputSchema = z
	.object({
		itemExternalId: z.string().optional().describe('Work item external id.'),
		projectExternalId: z.string().optional(),
		publicConversation: z.boolean().optional(),
		messages: z
			.array(
				z.object({
					content: z.string().optional(),
					// The spec names this attachmentIds here, unlike messages.create.
					attachmentIds: z
						.array(z.string())
						.optional()
						.describe('Attachment external ids, from attachments.upload.'),
				}),
			)
			.optional(),
		authorExternalId: z.string().nullish(),
	})
	.superRefine((value, ctx) => {
		if (!value.itemExternalId && !value.projectExternalId) {
			ctx.addIssue({
				code: 'custom',
				path: ['itemExternalId'],
				message:
					'A conversation belongs to a work item or a project; pass one of itemExternalId or projectExternalId.',
			});
		}
	});

export type ConversationsCreateInput = z.input<
	typeof ConversationsCreateInputSchema
>;

const ConversationsUpdateInputSchema = z.object({
	externalId: z.string().min(1).describe("The conversation's external id."),
	open: z.boolean().optional(),
	lock: z.boolean().optional(),
});

export type ConversationsUpdateInput = z.input<
	typeof ConversationsUpdateInputSchema
>;

const ConversationsUpdateResponseSchema = z.object({ code: z.string() });

export type ConversationsUpdateResponse = z.infer<
	typeof ConversationsUpdateResponseSchema
>;

export const OnedeskConversationMessageSchema = z
	.object({
		externalId: z.string().nullish(),
		conversationExternalId: z.string().nullish(),
		content: z.string().nullish(),
		author: OnedeskUserRefSchema.nullish(),
		created: z.string().nullish(),
	})
	.loose();

export type OnedeskConversationMessage = z.infer<
	typeof OnedeskConversationMessageSchema
>;

const MessagesFilterInputSchema = SimpleFilterSchema;

export type MessagesFilterInput = z.input<typeof MessagesFilterInputSchema>;

const MessagesFilterIdsResponseSchema = pagedResult(z.string());

export type MessagesFilterIdsResponse = z.infer<
	typeof MessagesFilterIdsResponseSchema
>;

const MessagesFilterDetailsInputSchema = SimpleFilterSchema;

export type MessagesFilterDetailsInput = z.input<
	typeof MessagesFilterDetailsInputSchema
>;

const MessagesFilterDetailsResponseSchema = pagedResult(
	OnedeskConversationMessageSchema,
);

export type MessagesFilterDetailsResponse = z.infer<
	typeof MessagesFilterDetailsResponseSchema
>;

const MessagesGetInputSchema = z.object({
	externalId: z.string().min(1).describe("The message's external id."),
});

export type MessagesGetInput = z.input<typeof MessagesGetInputSchema>;

const MessageResultSchema = z
	.object({
		code: z.string().nullish(),
		data: OnedeskConversationMessageSchema.nullish(),
	})
	.loose();

const MessagesCreateInputSchema = z.object({
	conversationExternalId: z
		.string()
		.min(1)
		.describe('Conversation to post into.'),
	content: z.string().optional(),
	attachmentExternalIds: z.array(z.string()).optional(),
	authorExternalId: z.string().nullish(),
});

export type MessagesCreateInput = z.input<typeof MessagesCreateInputSchema>;

const MessagesUpdateInputSchema = z.object({
	externalId: z.string().min(1).describe("The message's external id."),
	content: z.string().optional(),
	attachmentExternalIds: listUpdate.optional(),
});

export type MessagesUpdateInput = z.input<typeof MessagesUpdateInputSchema>;

const MessagesUpdateResponseSchema = z.object({ code: z.string() });

export type MessagesUpdateResponse = z.infer<
	typeof MessagesUpdateResponseSchema
>;

// ── activities ────────────────────────────────────────────────────────────

export const OnedeskActivitySchema = z
	.object({
		id: z.number().nullish(),
		externalId: z.string().nullish(),
		activityType: z.string().nullish(),
		created: z.string().nullish(),
	})
	.loose();

export type OnedeskActivity = z.infer<typeof OnedeskActivitySchema>;

const ActivitiesFilterDetailsInputSchema = SimpleFilterSchema;

export type ActivitiesFilterDetailsInput = z.input<
	typeof ActivitiesFilterDetailsInputSchema
>;

const ActivitiesFilterDetailsResponseSchema = pagedResult(
	OnedeskActivitySchema,
);

export type ActivitiesFilterDetailsResponse = z.infer<
	typeof ActivitiesFilterDetailsResponseSchema
>;

// ── attachments ───────────────────────────────────────────────────────────

export const OnedeskAttachmentSchema = z
	.object({
		id: z.number().nullish(),
		externalId: z.string().nullish(),
		name: z.string().nullish(),
	})
	.loose();

export type OnedeskAttachment = z.infer<typeof OnedeskAttachmentSchema>;

const AttachmentsFilterInputSchema = SimpleFilterSchema;

export type AttachmentsFilterInput = z.input<
	typeof AttachmentsFilterInputSchema
>;

const AttachmentsFilterIdsResponseSchema = pagedResult(z.string());

export type AttachmentsFilterIdsResponse = z.infer<
	typeof AttachmentsFilterIdsResponseSchema
>;

const AttachmentsFilterDetailsInputSchema = SimpleFilterSchema;

export type AttachmentsFilterDetailsInput = z.input<
	typeof AttachmentsFilterDetailsInputSchema
>;

const AttachmentsFilterDetailsResponseSchema = pagedResult(
	OnedeskAttachmentSchema,
);

export type AttachmentsFilterDetailsResponse = z.infer<
	typeof AttachmentsFilterDetailsResponseSchema
>;

const AttachmentsGetInputSchema = z.object({
	externalId: z.string().min(1).describe("The attachment's external id."),
});

export type AttachmentsGetInput = z.input<typeof AttachmentsGetInputSchema>;

const AttachmentResultSchema = z
	.object({
		code: z.string().nullish(),
		data: OnedeskAttachmentSchema.nullish(),
	})
	.loose();

/**
 * The file itself. OneDesk takes multipart uploads, so the caller supplies the
 * bytes and a filename; a URL is not accepted by this API.
 */
const AttachmentUploadInputSchema = z.object({
	fileName: z
		.string()
		.min(1)
		.describe('Filename to record, including its extension.'),
	contentType: z
		.string()
		.min(1)
		.optional()
		.describe('MIME type, for example application/pdf.'),
	contentBase64: z
		.string()
		.min(1)
		.describe('The file contents, base64 encoded.'),
});

export type AttachmentUploadInput = z.input<typeof AttachmentUploadInputSchema>;

const AttachmentAttachInputSchema = AttachmentUploadInputSchema.extend({
	externalId: z
		.string()
		.min(1)
		.describe('External id of the item, project, portfolio or organization.'),
});

export type AttachmentAttachInput = z.input<typeof AttachmentAttachInputSchema>;

const AttachmentUploadResponseSchema = z.object({
	code: z.string().nullish(),
	data: z.string().nullish(),
});

export type AttachmentUploadResponse = z.infer<
	typeof AttachmentUploadResponseSchema
>;

// ── organization settings ─────────────────────────────────────────────────

const OrganizationGetInputSchema = z.object({});

export type OrganizationGetInput = z.input<typeof OrganizationGetInputSchema>;

/** Item types answer `label`, not `name` as the spec says. */
const OrganizationItemTypesResponseSchema = z
	.object({
		code: z.string().nullish(),
		data: z.array(
			z
				.object({
					externalId: z.string().nullish(),
					label: z.string().nullish(),
					iconStyleName: z.string().nullish(),
					iconColor: z.number().nullish(),
				})
				.loose(),
		),
	})
	.loose();

export type OrganizationItemTypesResponse = z.infer<
	typeof OrganizationItemTypesResponseSchema
>;

/** Container types answer `label` and an `isPortfolio` flag. */
const OrganizationContainerTypesResponseSchema = z
	.object({
		code: z.string().nullish(),
		data: z.array(
			z
				.object({
					externalId: z.string().nullish(),
					label: z.string().nullish(),
					isPortfolio: z.boolean().nullish(),
					visible: z.boolean().nullish(),
				})
				.loose(),
		),
	})
	.loose();

export type OrganizationContainerTypesResponse = z.infer<
	typeof OrganizationContainerTypesResponseSchema
>;

/** User types answer `label`, not `name`. */
const OrganizationUserTypesResponseSchema = z
	.object({
		code: z.string().nullish(),
		data: z.array(
			z
				.object({
					label: z.string().nullish(),
					iconStyleName: z.string().nullish(),
					iconColor: z.number().nullish(),
				})
				.loose(),
		),
	})
	.loose();

export type OrganizationUserTypesResponse = z.infer<
	typeof OrganizationUserTypesResponseSchema
>;

/** Lifecycle statuses are full objects; the spec shows a string array. */
const OrganizationLifecycleStatusResponseSchema = z
	.object({
		code: z.string().nullish(),
		data: z.array(
			z
				.object({
					name: z.string().nullish(),
					externalId: z.string().nullish(),
					state: z.string().nullish(),
					type: z.string().nullish(),
				})
				.loose(),
		),
	})
	.loose();

export type OrganizationLifecycleStatusResponse = z.infer<
	typeof OrganizationLifecycleStatusResponseSchema
>;

const OrganizationProfileResponseSchema = z
	.object({
		code: z.string().nullish(),
		data: z
			.object({
				organizationName: z.string().nullish(),
				organizationUri: z.string().nullish(),
				dateFormat: z.string().nullish(),
				defaultThreadVisibilityType: z.string().nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();

export type OrganizationProfileResponse = z.infer<
	typeof OrganizationProfileResponseSchema
>;

// ── Pagination helper ─────────────────────────────────────────────────────

/**
 * OneDesk reports `totalNum` and the page it just returned, so the next offset
 * is arithmetic rather than a cursor. `null` means this page was the last.
 */
export function nextOffsetFor(
	returned: number,
	total: number | null | undefined,
	offset: number,
): number | null {
	if (typeof total !== 'number') return null;
	const seen = offset + returned;
	return returned > 0 && seen < total ? seen : null;
}

// ── Registry ──────────────────────────────────────────────────────────────

export type OnedeskEndpointInputs = {
	itemsFilter: ItemsFilterInput;
	itemsFilterDetails: ItemsFilterDetailsInput;
	itemsGet: ItemsGetInput;
	itemsCreate: ItemsCreateInput;
	itemsUpdate: ItemsUpdateInput;
	usersFilter: UsersFilterInput;
	usersFilterDetails: UsersFilterDetailsInput;
	usersGet: UsersGetInput;
	usersCreate: UsersCreateInput;
	usersUpdate: UsersUpdateInput;
	projectsFilter: ProjectsFilterInput;
	projectsFilterDetails: ProjectsFilterDetailsInput;
	projectsGet: ProjectsGetInput;
	projectsCreate: ProjectsCreateInput;
	projectsUpdate: ProjectsUpdateInput;
	portfoliosFilter: PortfoliosFilterInput;
	portfoliosFilterDetails: PortfoliosFilterDetailsInput;
	portfoliosGet: PortfoliosGetInput;
	portfoliosCreate: PortfoliosCreateInput;
	portfoliosUpdate: PortfoliosUpdateInput;
	teamsFilter: TeamsFilterInput;
	teamsFilterDetails: TeamsFilterDetailsInput;
	teamsGet: TeamsGetInput;
	teamsCreate: TeamsCreateInput;
	teamsUpdate: TeamsUpdateInput;
	customersFilter: CustomersFilterInput;
	customersFilterDetails: CustomersFilterDetailsInput;
	customersGet: CustomersGetInput;
	customersCreate: CustomersCreateInput;
	customersUpdate: CustomersUpdateInput;
	organizationsFilter: OrganizationsFilterInput;
	organizationsFilterDetails: OrganizationsFilterDetailsInput;
	organizationsGet: OrganizationsGetInput;
	organizationsCreate: OrganizationsCreateInput;
	organizationsUpdate: OrganizationsUpdateInput;
	timesheetsFilter: TimesheetsFilterInput;
	timesheetsFilterDetails: TimesheetsFilterDetailsInput;
	timesheetsGet: TimesheetsGetInput;
	timesheetsCreate: TimesheetsCreateInput;
	timesheetsUpdate: TimesheetsUpdateInput;
	timersFilter: TimersFilterInput;
	timersFilterDetails: TimersFilterDetailsInput;
	timersGet: TimersGetInput;
	timersStart: TimerStartInput;
	timersPause: TimerNamedInput;
	timersResume: TimerNamedInput;
	timersCancel: TimerNamedInput;
	invoicesFilter: InvoicesFilterInput;
	invoicesFilterDetails: InvoicesFilterDetailsInput;
	invoicesGet: InvoicesGetInput;
	invoicesUpdate: InvoicesUpdateInput;
	quotesFilter: QuotesFilterInput;
	quotesFilterDetails: QuotesFilterDetailsInput;
	quotesGet: QuotesGetInput;
	quotesUpdate: QuotesUpdateInput;
	conversationsFilter: ConversationsFilterInput;
	conversationsFilterDetails: ConversationsFilterDetailsInput;
	conversationsGet: ConversationsGetInput;
	conversationsCreate: ConversationsCreateInput;
	conversationsUpdate: ConversationsUpdateInput;
	messagesFilter: MessagesFilterInput;
	messagesFilterDetails: MessagesFilterDetailsInput;
	messagesGet: MessagesGetInput;
	messagesCreate: MessagesCreateInput;
	messagesUpdate: MessagesUpdateInput;
	activitiesFilterDetails: ActivitiesFilterDetailsInput;
	attachmentsFilter: AttachmentsFilterInput;
	attachmentsFilterDetails: AttachmentsFilterDetailsInput;
	attachmentsGet: AttachmentsGetInput;
	attachmentsUpload: AttachmentUploadInput;
	attachmentsAttachToItem: AttachmentAttachInput;
	attachmentsAttachToProject: AttachmentAttachInput;
	attachmentsAttachToPortfolio: AttachmentAttachInput;
	attachmentsAttachToOrganization: AttachmentAttachInput;
	organizationItemTypes: OrganizationGetInput;
	organizationContainerTypes: OrganizationGetInput;
	organizationUserTypes: OrganizationGetInput;
	organizationLifecycleStatus: OrganizationGetInput;
	organizationProfile: OrganizationGetInput;
};

export type OnedeskEndpointOutputs = {
	itemsFilter: ItemsFilterIdsResponse;
	itemsFilterDetails: ItemsFilterDetailsResponse;
	itemsGet: z.infer<typeof ItemResultSchema>;
	itemsCreate: z.infer<typeof createdResult>;
	itemsUpdate: ItemsUpdateResponse;
	usersFilter: UsersFilterIdsResponse;
	usersFilterDetails: UsersFilterDetailsResponse;
	usersGet: z.infer<typeof UserResultSchema>;
	usersCreate: z.infer<typeof createdResult>;
	usersUpdate: UsersUpdateResponse;
	projectsFilter: ProjectsFilterIdsResponse;
	projectsFilterDetails: ProjectsFilterDetailsResponse;
	projectsGet: z.infer<typeof ProjectResultSchema>;
	projectsCreate: z.infer<typeof createdResult>;
	projectsUpdate: ProjectsUpdateResponse;
	portfoliosFilter: PortfoliosFilterIdsResponse;
	portfoliosFilterDetails: PortfoliosFilterDetailsResponse;
	portfoliosGet: z.infer<typeof PortfolioResultSchema>;
	portfoliosCreate: z.infer<typeof createdResult>;
	portfoliosUpdate: PortfoliosUpdateResponse;
	teamsFilter: TeamsFilterIdsResponse;
	teamsFilterDetails: TeamsFilterDetailsResponse;
	teamsGet: z.infer<typeof TeamResultSchema>;
	teamsCreate: z.infer<typeof createdResult>;
	teamsUpdate: TeamsUpdateResponse;
	customersFilter: CustomersFilterIdsResponse;
	customersFilterDetails: CustomersFilterDetailsResponse;
	customersGet: z.infer<typeof CustomerResultSchema>;
	customersCreate: z.infer<typeof createdResult>;
	customersUpdate: CustomersUpdateResponse;
	organizationsFilter: OrganizationsFilterIdsResponse;
	organizationsFilterDetails: OrganizationsFilterDetailsResponse;
	organizationsGet: z.infer<typeof OrganizationResultSchema>;
	organizationsCreate: z.infer<typeof createdResult>;
	organizationsUpdate: OrganizationsUpdateResponse;
	timesheetsFilter: TimesheetsFilterIdsResponse;
	timesheetsFilterDetails: TimesheetsFilterDetailsResponse;
	timesheetsGet: z.infer<typeof TimesheetResultSchema>;
	timesheetsCreate: z.infer<typeof createdResult>;
	timesheetsUpdate: TimesheetsUpdateResponse;
	timersFilter: TimersFilterIdsResponse;
	timersFilterDetails: TimersFilterDetailsResponse;
	timersGet: z.infer<typeof TimerResultSchema>;
	timersStart: z.infer<typeof actionResult>;
	timersPause: z.infer<typeof actionResult>;
	timersResume: z.infer<typeof actionResult>;
	timersCancel: z.infer<typeof actionResult>;
	invoicesFilter: InvoicesFilterIdsResponse;
	invoicesFilterDetails: InvoicesFilterDetailsResponse;
	invoicesGet: z.infer<typeof InvoiceResultSchema>;
	invoicesUpdate: InvoicesUpdateResponse;
	quotesFilter: QuotesFilterIdsResponse;
	quotesFilterDetails: QuotesFilterDetailsResponse;
	quotesGet: z.infer<typeof QuoteResultSchema>;
	quotesUpdate: QuotesUpdateResponse;
	conversationsFilter: ConversationsFilterIdsResponse;
	conversationsFilterDetails: ConversationsFilterDetailsResponse;
	conversationsGet: z.infer<typeof ConversationResultSchema>;
	conversationsCreate: z.infer<typeof createdResult>;
	conversationsUpdate: ConversationsUpdateResponse;
	messagesFilter: MessagesFilterIdsResponse;
	messagesFilterDetails: MessagesFilterDetailsResponse;
	messagesGet: z.infer<typeof MessageResultSchema>;
	messagesCreate: z.infer<typeof createdResult>;
	messagesUpdate: MessagesUpdateResponse;
	activitiesFilterDetails: ActivitiesFilterDetailsResponse;
	attachmentsFilter: AttachmentsFilterIdsResponse;
	attachmentsFilterDetails: AttachmentsFilterDetailsResponse;
	attachmentsGet: z.infer<typeof AttachmentResultSchema>;
	attachmentsUpload: AttachmentUploadResponse;
	attachmentsAttachToItem: AttachmentUploadResponse;
	attachmentsAttachToProject: AttachmentUploadResponse;
	attachmentsAttachToPortfolio: AttachmentUploadResponse;
	attachmentsAttachToOrganization: AttachmentUploadResponse;
	organizationItemTypes: OrganizationItemTypesResponse;
	organizationContainerTypes: OrganizationContainerTypesResponse;
	organizationUserTypes: OrganizationUserTypesResponse;
	organizationLifecycleStatus: OrganizationLifecycleStatusResponse;
	organizationProfile: OrganizationProfileResponse;
};

export const OnedeskEndpointInputSchemas = {
	itemsFilter: ItemsFilterInputSchema,
	itemsFilterDetails: ItemsFilterDetailsInputSchema,
	itemsGet: ItemsGetInputSchema,
	itemsCreate: ItemsCreateInputSchema,
	itemsUpdate: ItemsUpdateInputSchema,
	usersFilter: UsersFilterInputSchema,
	usersFilterDetails: UsersFilterDetailsInputSchema,
	usersGet: UsersGetInputSchema,
	usersCreate: UsersCreateInputSchema,
	usersUpdate: UsersUpdateInputSchema,
	projectsFilter: ProjectsFilterInputSchema,
	projectsFilterDetails: ProjectsFilterDetailsInputSchema,
	projectsGet: ProjectsGetInputSchema,
	projectsCreate: ProjectsCreateInputSchema,
	projectsUpdate: ProjectsUpdateInputSchema,
	portfoliosFilter: PortfoliosFilterInputSchema,
	portfoliosFilterDetails: PortfoliosFilterDetailsInputSchema,
	portfoliosGet: PortfoliosGetInputSchema,
	portfoliosCreate: PortfoliosCreateInputSchema,
	portfoliosUpdate: PortfoliosUpdateInputSchema,
	teamsFilter: TeamsFilterInputSchema,
	teamsFilterDetails: TeamsFilterDetailsInputSchema,
	teamsGet: TeamsGetInputSchema,
	teamsCreate: TeamsCreateInputSchema,
	teamsUpdate: TeamsUpdateInputSchema,
	customersFilter: CustomersFilterInputSchema,
	customersFilterDetails: CustomersFilterDetailsInputSchema,
	customersGet: CustomersGetInputSchema,
	customersCreate: CustomersCreateInputSchema,
	customersUpdate: CustomersUpdateInputSchema,
	organizationsFilter: OrganizationsFilterInputSchema,
	organizationsFilterDetails: OrganizationsFilterDetailsInputSchema,
	organizationsGet: OrganizationsGetInputSchema,
	organizationsCreate: OrganizationsCreateInputSchema,
	organizationsUpdate: OrganizationsUpdateInputSchema,
	timesheetsFilter: TimesheetsFilterInputSchema,
	timesheetsFilterDetails: TimesheetsFilterDetailsInputSchema,
	timesheetsGet: TimesheetsGetInputSchema,
	timesheetsCreate: TimesheetsCreateInputSchema,
	timesheetsUpdate: TimesheetsUpdateInputSchema,
	timersFilter: TimersFilterInputSchema,
	timersFilterDetails: TimersFilterDetailsInputSchema,
	timersGet: TimersGetInputSchema,
	timersStart: TimerStartInputSchema,
	timersPause: TimerNamedInputSchema,
	timersResume: TimerNamedInputSchema,
	timersCancel: TimerNamedInputSchema,
	invoicesFilter: InvoicesFilterInputSchema,
	invoicesFilterDetails: InvoicesFilterDetailsInputSchema,
	invoicesGet: InvoicesGetInputSchema,
	invoicesUpdate: InvoicesUpdateInputSchema,
	quotesFilter: QuotesFilterInputSchema,
	quotesFilterDetails: QuotesFilterDetailsInputSchema,
	quotesGet: QuotesGetInputSchema,
	quotesUpdate: QuotesUpdateInputSchema,
	conversationsFilter: ConversationsFilterInputSchema,
	conversationsFilterDetails: ConversationsFilterDetailsInputSchema,
	conversationsGet: ConversationsGetInputSchema,
	conversationsCreate: ConversationsCreateInputSchema,
	conversationsUpdate: ConversationsUpdateInputSchema,
	messagesFilter: MessagesFilterInputSchema,
	messagesFilterDetails: MessagesFilterDetailsInputSchema,
	messagesGet: MessagesGetInputSchema,
	messagesCreate: MessagesCreateInputSchema,
	messagesUpdate: MessagesUpdateInputSchema,
	activitiesFilterDetails: ActivitiesFilterDetailsInputSchema,
	attachmentsFilter: AttachmentsFilterInputSchema,
	attachmentsFilterDetails: AttachmentsFilterDetailsInputSchema,
	attachmentsGet: AttachmentsGetInputSchema,
	attachmentsUpload: AttachmentUploadInputSchema,
	attachmentsAttachToItem: AttachmentAttachInputSchema,
	attachmentsAttachToProject: AttachmentAttachInputSchema,
	attachmentsAttachToPortfolio: AttachmentAttachInputSchema,
	attachmentsAttachToOrganization: AttachmentAttachInputSchema,
	organizationItemTypes: OrganizationGetInputSchema,
	organizationContainerTypes: OrganizationGetInputSchema,
	organizationUserTypes: OrganizationGetInputSchema,
	organizationLifecycleStatus: OrganizationGetInputSchema,
	organizationProfile: OrganizationGetInputSchema,
} as const;

export const OnedeskEndpointOutputSchemas = {
	itemsFilter: ItemsFilterIdsResponseSchema,
	itemsFilterDetails: ItemsFilterDetailsResponseSchema,
	itemsGet: ItemResultSchema,
	itemsCreate: createdResult,
	itemsUpdate: ItemsUpdateResponseSchema,
	usersFilter: UsersFilterIdsResponseSchema,
	usersFilterDetails: UsersFilterDetailsResponseSchema,
	usersGet: UserResultSchema,
	usersCreate: createdResult,
	usersUpdate: UsersUpdateResponseSchema,
	projectsFilter: ProjectsFilterIdsResponseSchema,
	projectsFilterDetails: ProjectsFilterDetailsResponseSchema,
	projectsGet: ProjectResultSchema,
	projectsCreate: createdResult,
	projectsUpdate: ProjectsUpdateResponseSchema,
	portfoliosFilter: PortfoliosFilterIdsResponseSchema,
	portfoliosFilterDetails: PortfoliosFilterDetailsResponseSchema,
	portfoliosGet: PortfolioResultSchema,
	portfoliosCreate: createdResult,
	portfoliosUpdate: PortfoliosUpdateResponseSchema,
	teamsFilter: TeamsFilterIdsResponseSchema,
	teamsFilterDetails: TeamsFilterDetailsResponseSchema,
	teamsGet: TeamResultSchema,
	teamsCreate: createdResult,
	teamsUpdate: TeamsUpdateResponseSchema,
	customersFilter: CustomersFilterIdsResponseSchema,
	customersFilterDetails: CustomersFilterDetailsResponseSchema,
	customersGet: CustomerResultSchema,
	customersCreate: createdResult,
	customersUpdate: CustomersUpdateResponseSchema,
	organizationsFilter: OrganizationsFilterIdsResponseSchema,
	organizationsFilterDetails: OrganizationsFilterDetailsResponseSchema,
	organizationsGet: OrganizationResultSchema,
	organizationsCreate: createdResult,
	organizationsUpdate: OrganizationsUpdateResponseSchema,
	timesheetsFilter: TimesheetsFilterIdsResponseSchema,
	timesheetsFilterDetails: TimesheetsFilterDetailsResponseSchema,
	timesheetsGet: TimesheetResultSchema,
	timesheetsCreate: createdResult,
	timesheetsUpdate: TimesheetsUpdateResponseSchema,
	timersFilter: TimersFilterIdsResponseSchema,
	timersFilterDetails: TimersFilterDetailsResponseSchema,
	timersGet: TimerResultSchema,
	timersStart: actionResult,
	timersPause: actionResult,
	timersResume: actionResult,
	timersCancel: actionResult,
	invoicesFilter: InvoicesFilterIdsResponseSchema,
	invoicesFilterDetails: InvoicesFilterDetailsResponseSchema,
	invoicesGet: InvoiceResultSchema,
	invoicesUpdate: InvoicesUpdateResponseSchema,
	quotesFilter: QuotesFilterIdsResponseSchema,
	quotesFilterDetails: QuotesFilterDetailsResponseSchema,
	quotesGet: QuoteResultSchema,
	quotesUpdate: QuotesUpdateResponseSchema,
	conversationsFilter: ConversationsFilterIdsResponseSchema,
	conversationsFilterDetails: ConversationsFilterDetailsResponseSchema,
	conversationsGet: ConversationResultSchema,
	conversationsCreate: createdResult,
	conversationsUpdate: ConversationsUpdateResponseSchema,
	messagesFilter: MessagesFilterIdsResponseSchema,
	messagesFilterDetails: MessagesFilterDetailsResponseSchema,
	messagesGet: MessageResultSchema,
	messagesCreate: createdResult,
	messagesUpdate: MessagesUpdateResponseSchema,
	activitiesFilterDetails: ActivitiesFilterDetailsResponseSchema,
	attachmentsFilter: AttachmentsFilterIdsResponseSchema,
	attachmentsFilterDetails: AttachmentsFilterDetailsResponseSchema,
	attachmentsGet: AttachmentResultSchema,
	attachmentsUpload: AttachmentUploadResponseSchema,
	attachmentsAttachToItem: AttachmentUploadResponseSchema,
	attachmentsAttachToProject: AttachmentUploadResponseSchema,
	attachmentsAttachToPortfolio: AttachmentUploadResponseSchema,
	attachmentsAttachToOrganization: AttachmentUploadResponseSchema,
	organizationItemTypes: OrganizationItemTypesResponseSchema,
	organizationContainerTypes: OrganizationContainerTypesResponseSchema,
	organizationUserTypes: OrganizationUserTypesResponseSchema,
	organizationLifecycleStatus: OrganizationLifecycleStatusResponseSchema,
	organizationProfile: OrganizationProfileResponseSchema,
} as const;
