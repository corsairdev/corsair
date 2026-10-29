import { z } from 'zod';

// Schema source: live introspection of
// https://core-api.uk.plain.com/graphql/v1/schema.graphql (fetched 2026-09-11)
// plus https://www.plain.com/docs/graphql-reference. Every section below names
// the exact schema type it mirrors. Deviations from the schema are marked
// DEVIATION with a reason. No `unknown` appears in this file: open-ended JSON
// uses `z.json()` (typed JSONValue) instead.

// `type PageInfo` in schema.graphql.
export const PageInfoSchema = z.object({
	hasNextPage: z.boolean(),
	hasPreviousPage: z.boolean(),
	startCursor: z.string().nullable(),
	endCursor: z.string().nullable(),
});

// `enum UpsertResult` in schema.graphql.
export const UpsertResultSchema = z.enum(['CREATED', 'UPDATED', 'NOOP']);

// `input UpsertCustomerIdentifierInput`: all fields nullable, exactly one set
// (documented on `input CustomerIdentifierInput`: "Only one of the fields can
// be set").
const CustomerIdentifierInputSchema = z
	.object({
		externalId: z.string().optional(),
		emailAddress: z.string().optional(),
		customerId: z.string().optional(),
	})
	.refine(
		(value) =>
			Number(Boolean(value.externalId)) +
				Number(Boolean(value.emailAddress)) +
				Number(Boolean(value.customerId)) ===
			1,
		'Exactly one customer identifier must be set',
	);

// `input CompanyIdentifierInput`: both fields nullable, no exactly-one rule in
// the schema; the exactly-one rule lives on `input UpsertCompanyInput`
// (identifier is required there, one of the two sub-fields must locate the
// company). Enforced here so bad input fails before the network call.
const CompanyIdentifierInputSchema = z
	.object({
		companyId: z.string().optional(),
		companyDomainName: z.string().optional(),
	})
	.refine(
		(value) =>
			Number(Boolean(value.companyId)) +
				Number(Boolean(value.companyDomainName)) ===
			1,
		'Exactly one company identifier must be set',
	);

// `input CustomerGroupIdentifier` ("Provide exactly one field").
const CustomerGroupIdentifierSchema = z
	.object({
		customerGroupId: z.string().optional(),
		customerGroupKey: z.string().optional(),
		externalId: z.string().optional(),
	})
	.refine(
		(value) =>
			Number(Boolean(value.customerGroupId)) +
				Number(Boolean(value.customerGroupKey)) +
				Number(Boolean(value.externalId)) ===
			1,
		'Exactly one customer group identifier must be set',
	);

// `input TenantIdentifierInput`: both fields nullable.
const TenantIdentifierInputSchema = z
	.object({
		tenantId: z.string().optional(),
		externalId: z.string().optional(),
	})
	.refine(
		(value) =>
			Number(Boolean(value.tenantId)) + Number(Boolean(value.externalId)) === 1,
		'Exactly one tenant identifier must be set',
	);

// `input TierIdentifierInput`: both fields nullable, no exactly-one rule.
const TierIdentifierInputSchema = z.object({
	tierId: z.string().optional(),
	externalId: z.string().optional(),
});

// `input EmailAddressInput`: both fields required by the schema.
const EmailAddressInputSchema = z.object({
	email: z.string().email(),
	isVerified: z.boolean(),
});

// Subset of `type Customer` (id/externalId/fullName/shortName/email are all
// selected verbatim). `email: EmailAddress!` is non-null in the schema, so it
// is required here. `.loose()` tolerates future server-side additions.
// Exported for the raw GraphQL envelope schemas in operations.ts.
export const CustomerSchema = z
	.object({
		id: z.string(),
		externalId: z.string().nullable().optional(),
		fullName: z.string(),
		shortName: z.string().nullable().optional(),
		email: z.object({
			email: z.string(),
			isVerified: z.boolean(),
		}),
	})
	.loose();

// Subset of `type Thread`. `ref: String!`, `status: ThreadStatus!` and
// `priority: Int!` are non-null in the schema, so they are required here.
// Status stays a string (not an enum) because the schema documents TODO /
// SNOOZED / DONE today and string parsing stays forward-compatible if Plain
// adds values. Priority 0 = urgent … 3 = low per the Thread type docs.
// Exported for the raw GraphQL envelope schemas in operations.ts.
export const ThreadSummarySchema = z
	.object({
		id: z.string(),
		ref: z.string(),
		title: z.string(),
		status: z.string(),
		priority: z.number().int(),
	})
	.loose();

// Subset of `interface ThreadLink` (id/threadId/sourceId/sourceType/title/url/
// status/linkType non-null; description nullable). Status and linkType stay
// strings for the same forward-compatibility reason as Thread.status; the
// schema enums are `enum ThreadLinkStatus` and `enum ThreadLinkLinkType`.
// Exported for the raw GraphQL envelope schemas in operations.ts.
export const ThreadLinkSchema = z
	.object({
		id: z.string(),
		sourceId: z.string(),
		sourceType: z.string(),
		title: z.string(),
		description: z.string().nullable().optional(),
		url: z.string(),
		status: z.string(),
		linkType: z.string(),
	})
	.loose();

// Subset of `type User`. `publicName: String!`, `email: String!` and
// `isDeleted: Boolean!` are non-null in the schema, so they are required here.
const UserSchema = z
	.object({
		id: z.string(),
		fullName: z.string(),
		publicName: z.string(),
		email: z.string(),
		isDeleted: z.boolean().optional(),
	})
	.loose();

// Subset of `type Company`. `domainName: String!` is non-null in the schema.
// `contractValue: Int` is annual value in cents, nullable when unset.
const CompanySchema = z
	.object({
		id: z.string(),
		name: z.string(),
		domainName: z.string(),
		contractValue: z.number().int().nullable().optional(),
	})
	.loose();

// Subset of `type Tier`. The schema Tier has NO `description` field, so this
// selects id/name/externalId/color/isDefault verbatim from the schema.
// Exported for the raw GraphQL envelope schemas in operations.ts.
export const TierSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		externalId: z.string().nullable().optional(),
		color: z.string().optional(),
		isDefault: z.boolean().optional(),
	})
	.loose();

// Full scalar surface of `type CustomerGroup` (externalId nullable).
// Exported for the raw GraphQL envelope schemas in operations.ts.
export const CustomerGroupSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		key: z.string(),
		color: z.string(),
		externalId: z.string().nullable().optional(),
	})
	.loose();

// `type CustomerGroupMembership`: customerId/customerGroup non-null.
// Exported for the raw GraphQL envelope schemas in operations.ts.
export const CustomerGroupMembershipSchema = z
	.object({
		customerId: z.string(),
		customerGroup: CustomerGroupSchema,
	})
	.loose();

// `type MutationError`: message/code non-null when an error is present.
// Exported for the mutation-payload error check in operations.ts.
export const MutationErrorSchema = z
	.object({
		message: z.string(),
		code: z.string(),
	})
	.loose();

// `input CustomersFilter` in schema.graphql (only documented fields; object
// stays loose for future filter additions).
const CustomersFilterSchema = z
	.object({
		isMarkedAsSpam: z.boolean().optional(),
		customerGroupIds: z.array(z.string()).optional(),
		customerGroupKeys: z.array(z.string()).optional(),
		companyIdentifiers: z.array(CompanyIdentifierInputSchema).optional(),
		tenantIdentifiers: z.array(TenantIdentifierInputSchema).optional(),
		slackChannelId: z.string().optional(),
	})
	.loose();

// `input ThreadsSort` + `enum ThreadsSortField` + `enum SortDirection`.
// `enum ThreadsSortField` =
// STATUS_CHANGED_AT | CREATED_AT | CLOSEST_TO_BREACH_SLA |
// LAST_INBOUND_MESSAGE_AT | PRIORITY | THREAD_FIELD.
const ThreadsSortSchema = z
	.object({
		field: z.enum([
			'STATUS_CHANGED_AT',
			'CREATED_AT',
			'CLOSEST_TO_BREACH_SLA',
			'LAST_INBOUND_MESSAGE_AT',
			'PRIORITY',
			'THREAD_FIELD',
		]),
		direction: z.enum(['ASC', 'DESC']),
		threadFieldKey: z.string().optional(),
	})
	.loose();

// Explicit subset of `input ThreadsFilter` in schema.graphql. The schema input
// has ~25 fields; the complex nested ones (threadFields, statusChangedAt,
// createdAt, serviceLevelAgreements, threadLinkSources, …) are intentionally
// left to `.loose()` passthrough and validated server-side, which is stated
// here instead of guessed.
const ThreadsFilterSchema = z
	.object({
		threadIds: z.array(z.string()).optional(),
		refs: z.array(z.string()).optional(),
		labelTypeIds: z.array(z.string()).optional(),
		priorities: z.array(z.number().int()).optional(),
		customerIds: z.array(z.string()).optional(),
		isAssigned: z.boolean().optional(),
		assignedToUser: z.array(z.string()).optional(),
		isMarkedAsSpam: z.boolean().optional(),
		supportEmailAddresses: z.array(z.string()).optional(),
		customerGroupIdentifiers: z.array(CustomerGroupIdentifierSchema).optional(),
		tierIdentifiers: z.array(TierIdentifierInputSchema).optional(),
		companyIdentifiers: z.array(CompanyIdentifierInputSchema).optional(),
		tenantIdentifiers: z.array(TenantIdentifierInputSchema).optional(),
		messageSource: z
			.array(
				z.enum([
					'CHAT',
					'EMAIL',
					'API',
					'SLACK',
					'MS_TEAMS',
					'DISCORD',
					'INTERNAL',
				]),
			)
			.optional(),
		participantIds: z.array(z.string()).optional(),
		broadcastIds: z.array(z.string()).optional(),
		statuses: z.array(z.enum(['TODO', 'SNOOZED', 'DONE'])).optional(),
	})
	.loose();

// `input CreateThreadFieldOnThreadInput` + `enum ThreadFieldSchemaType`
// (STRING | BOOL | ENUM | NUMBER | CURRENCY | DATE).
const ThreadFieldOnThreadInputSchema = z.object({
	key: z.string(),
	type: z.enum(['STRING', 'BOOL', 'ENUM', 'NUMBER', 'CURRENCY', 'DATE']),
	stringValue: z.string().optional(),
	booleanValue: z.boolean().optional(),
	numberValue: z.number().optional(),
	dateValue: z.string().optional(),
});

// Cursor-pagination guard shared by every paginated input. Typed on the
// pagination fields themselves (not on `unknown`), so no casts are needed to
// read them. Forward = first/after, reverse = last/before; mixing both
// directions is rejected because the Plain connections honor one direction
// per call (`customers(...)`, `threads(...)`, `tiers(...)`,
// `customerGroups(...)` in schema.graphql).
type PaginationControls = {
	readonly first?: number;
	readonly after?: string;
	readonly last?: number;
	readonly before?: string;
};

function hasMixedPaginationControls(value: PaginationControls): boolean {
	const hasForward = value.first !== undefined || value.after !== undefined;
	const hasReverse = value.last !== undefined || value.before !== undefined;
	return hasForward && hasReverse;
}

function mixedPaginationIssue(): {
	code: typeof z.ZodIssueCode.custom;
	message: string;
} {
	return {
		code: z.ZodIssueCode.custom,
		message:
			'Cannot mix forward (first/after) and reverse (last/before) pagination controls',
	};
}

const GetCustomerByIdInputSchema = z.object({
	customerId: z.string(),
});

const GetCustomerByEmailInputSchema = z.object({
	email: z.string().email(),
});

const GetCustomersInputSchema = z
	.object({
		filters: CustomersFilterSchema.optional(),
		sortBy: z
			.object({
				// `enum CustomersSortField` has exactly one value: FULL_NAME.
				field: z.enum(['FULL_NAME']),
				direction: z.enum(['ASC', 'DESC']),
			})
			.optional(),
		first: z.number().int().positive().max(100).optional(),
		after: z.string().optional(),
		last: z.number().int().positive().max(100).optional(),
		before: z.string().optional(),
	})
	.superRefine((value, ctx) => {
		if (hasMixedPaginationControls(value)) {
			ctx.addIssue(mixedPaginationIssue());
		}
	});

// `input UpsertCustomerInput` in schema.graphql. `onCreate.email` is
// `EmailAddressInput!` (required) in the schema, mirrored here.
const UpsertCustomerInputSchema = z.object({
	identifier: CustomerIdentifierInputSchema,
	onCreate: z
		.object({
			externalId: z.string().optional(),
			fullName: z.string(),
			shortName: z.string().optional(),
			email: EmailAddressInputSchema,
			customerGroupIdentifiers: z
				.array(CustomerGroupIdentifierSchema)
				.max(25)
				.optional(),
			tenantIdentifiers: z.array(TenantIdentifierInputSchema).optional(),
		})
		.loose(),
	onUpdate: z
		.object({
			externalId: z
				.object({ value: z.string().nullable().optional() })
				.optional(),
			fullName: z.object({ value: z.string() }).optional(),
			shortName: z
				.object({ value: z.string().nullable().optional() })
				.optional(),
			email: EmailAddressInputSchema.optional(),
		})
		.loose(),
});

// `input DeleteCustomerInput`: customerId required.
const DeleteCustomerInputSchema = z.object({
	customerId: z.string(),
});

const GetThreadByIdInputSchema = z.object({
	threadId: z.string(),
});

const QueryThreadsInputSchema = z
	.object({
		filters: ThreadsFilterSchema.optional(),
		sortBy: ThreadsSortSchema.optional(),
		first: z.number().int().positive().max(100).optional(),
		after: z.string().optional(),
		last: z.number().int().positive().max(100).optional(),
		before: z.string().optional(),
	})
	.superRefine((value, ctx) => {
		if (hasMixedPaginationControls(value)) {
			ctx.addIssue(mixedPaginationIssue());
		}
	});

// `threads(first/after/last/before)` nested under `customer(customerId:)` plus
// `links(first:)` on `type Thread`. Same forward/reverse guard as above, on
// the thread* control names.
const FetchIssuesInputSchema = z
	.object({
		customerId: z.string(),
		threadFirst: z.number().int().positive().max(100).optional(),
		threadAfter: z.string().optional(),
		threadLast: z.number().int().positive().max(100).optional(),
		threadBefore: z.string().optional(),
		linkFirst: z.number().int().positive().max(100).optional(),
	})
	.superRefine((value, ctx) => {
		const hasForward =
			value.threadFirst !== undefined || value.threadAfter !== undefined;
		const hasReverse =
			value.threadLast !== undefined || value.threadBefore !== undefined;
		if (hasForward && hasReverse) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message:
					'Cannot mix forward (threadFirst/threadAfter) and reverse (threadLast/threadBefore) thread pagination controls',
			});
		}
	});

// `input ReplyToThreadInput` in schema.graphql. `channelSpecificOptions` is
// omitted: its shape is channel-dependent and out of scope for this plugin;
// the server rejects misuse. `impersonation` mirrors
// `input ImpersonationInput` (`asCustomer` wrapping
// `input CustomerImpersonationInput`, which holds CustomerIdentifierInput).
const SendMessageInputSchema = z.object({
	threadId: z.string(),
	textContent: z.string().min(1),
	markdownContent: z.string().optional(),
	attachmentIds: z.array(z.string()).optional(),
	impersonation: z
		.object({
			asCustomer: z.object({
				customerIdentifier: CustomerIdentifierInputSchema,
			}),
		})
		.optional(),
});

// `input CreateThreadInput` in schema.graphql. Deprecated `components` /
// `attachmentIds` are not exposed. `channelDetails` (required only for SLACK /
// MS_TEAMS channels) is omitted — noted here instead of guessed. `channel`
// mirrors `enum ThreadChannel` (all 8 values).
const CreateThreadInputSchema = z.object({
	customerIdentifier: CustomerIdentifierInputSchema,
	title: z.string().optional(),
	description: z.string().optional(),
	priority: z.number().int().min(0).max(3).optional(),
	labelTypeIds: z.array(z.string()).optional(),
	threadFields: z.array(ThreadFieldOnThreadInputSchema).optional(),
	assignedTo: z
		.object({
			userId: z.string().optional(),
			machineUserId: z.string().optional(),
		})
		.optional(),
	externalId: z.string().optional(),
	tenantIdentifier: TenantIdentifierInputSchema.optional(),
	channel: z
		.enum([
			'API',
			'EMAIL',
			'SLACK',
			'MS_TEAMS',
			'CHAT',
			'INTERNAL',
			'DISCORD',
			'IMPORT',
		])
		.optional(),
});

// `input UpdateThreadTitleInput`: threadId + title required.
const UpdateThreadInputSchema = z.object({
	threadId: z.string(),
	title: z.string().min(1),
});

const GetUserByIdInputSchema = z.object({
	userId: z.string(),
});

// `input DeleteUserInput`: userId required.
const DeleteUserInputSchema = z.object({
	userId: z.string(),
});

const FetchCompanyInputSchema = z.object({
	companyId: z.string(),
});

// `input UpsertCompanyInput`: identifier/name/domainName required,
// contractValue is an Int (cents), accountOwnerUserId an ID.
const UpdateCompanyInputSchema = z.object({
	identifier: CompanyIdentifierInputSchema,
	name: z.string(),
	domainName: z.string(),
	contractValue: z.number().int().optional(),
	accountOwnerUserId: z.string().optional(),
});

const FetchTierInputSchema = z.object({
	tierId: z.string(),
});

// `tiers(first/after/last/before)` in schema.graphql.
const ListTiersInputSchema = z
	.object({
		first: z.number().int().positive().max(100).optional(),
		after: z.string().optional(),
		last: z.number().int().positive().max(100).optional(),
		before: z.string().optional(),
	})
	.superRefine((value, ctx) => {
		if (hasMixedPaginationControls(value)) {
			ctx.addIssue(mixedPaginationIssue());
		}
	});

// `input CreateCustomerGroupInput`: name/key/color required, externalId
// optional.
const CreateCustomerGroupInputSchema = z.object({
	name: z.string().min(1),
	key: z.string().min(1),
	color: z.string().min(1),
	externalId: z.string().optional(),
});

// `customerGroups(filters/first/after/last/before)`; `input
// CustomerGroupsFilter` holds only `externalIds: [String!]`.
const ListCustomerGroupsInputSchema = z
	.object({
		filters: z
			.object({
				externalIds: z.array(z.string()).optional(),
			})
			.optional(),
		first: z.number().int().positive().max(100).optional(),
		after: z.string().optional(),
		last: z.number().int().positive().max(100).optional(),
		before: z.string().optional(),
	})
	.superRefine((value, ctx) => {
		if (hasMixedPaginationControls(value)) {
			ctx.addIssue(mixedPaginationIssue());
		}
	});

// `input AddCustomerToCustomerGroupsInput`: docs cap at 25 groups per call.
const AddCustomerToGroupInputSchema = z.object({
	customerId: z.string(),
	customerGroupIdentifiers: z
		.array(CustomerGroupIdentifierSchema)
		.min(1)
		.max(25),
});

// `input RemoveCustomerFromCustomerGroupsInput`: same shape.
const RemoveCustomerFromGroupInputSchema = z.object({
	customerId: z.string(),
	customerGroupIdentifiers: z
		.array(CustomerGroupIdentifierSchema)
		.min(1)
		.max(25),
});

// `variables` uses `z.json()` (typed JSON, not `unknown`): GraphQL variables
// are arbitrary JSON by definition (see API introduction docs: `variables` is
// "a JSON object of variables").
const RunGraphqlQueryInputSchema = z.object({
	query: z.string().min(1),
	variables: z.record(z.string(), z.json()).optional(),
	operationName: z.string().optional(),
});

const GetCustomerByIdResponseSchema = z
	.object({
		customer: CustomerSchema.nullable(),
	})
	.loose();

const GetCustomerByEmailResponseSchema = z
	.object({
		customer: CustomerSchema.nullable(),
	})
	.loose();

const GetCustomersResponseSchema = z
	.object({
		customers: z.array(CustomerSchema),
		pageInfo: PageInfoSchema,
		totalCount: z.number().int(),
	})
	.loose();

const UpsertCustomerResponseSchema = z
	.object({
		result: UpsertResultSchema.optional().nullable(),
		customer: CustomerSchema.nullable(),
	})
	.loose();

const DeleteCustomerResponseSchema = z
	.object({
		success: z.literal(true),
	})
	.loose();

const GetThreadByIdResponseSchema = z
	.object({
		thread: ThreadSummarySchema.nullable(),
	})
	.loose();

const QueryThreadsResponseSchema = z
	.object({
		threads: z.array(ThreadSummarySchema),
		pageInfo: PageInfoSchema,
		totalCount: z.number().int(),
	})
	.loose();

const FetchIssuesResponseSchema = z
	.object({
		issues: z.array(
			z.object({
				threadId: z.string(),
				threadRef: z.string(),
				threadTitle: z.string(),
				link: ThreadLinkSchema,
			}),
		),
		pageInfo: PageInfoSchema,
		totalThreads: z.number().int(),
	})
	.loose();

const SendMessageResponseSchema = z
	.object({
		success: z.literal(true),
	})
	.loose();

const CreateThreadResponseSchema = z
	.object({
		thread: ThreadSummarySchema.nullable(),
	})
	.loose();

const UpdateThreadResponseSchema = z
	.object({
		thread: ThreadSummarySchema.nullable(),
	})
	.loose();

const GetUserByIdResponseSchema = z
	.object({
		user: UserSchema.nullable(),
	})
	.loose();

const DeleteUserResponseSchema = z
	.object({
		success: z.literal(true),
	})
	.loose();

const FetchCompanyResponseSchema = z
	.object({
		company: CompanySchema.nullable(),
	})
	.loose();

const UpdateCompanyResponseSchema = z
	.object({
		result: UpsertResultSchema.optional().nullable(),
		company: CompanySchema.nullable(),
	})
	.loose();

const FetchTierResponseSchema = z
	.object({
		tier: TierSchema.nullable(),
	})
	.loose();

const ListTiersResponseSchema = z
	.object({
		tiers: z.array(TierSchema),
		pageInfo: PageInfoSchema,
	})
	.loose();

const CreateCustomerGroupResponseSchema = z
	.object({
		customerGroup: CustomerGroupSchema,
	})
	.loose();

const ListCustomerGroupsResponseSchema = z
	.object({
		customerGroups: z.array(CustomerGroupSchema),
		pageInfo: PageInfoSchema,
	})
	.loose();

const AddCustomerToGroupResponseSchema = z
	.object({
		customerGroupMemberships: z.array(CustomerGroupMembershipSchema),
	})
	.loose();

const RemoveCustomerFromGroupResponseSchema = z
	.object({
		success: z.literal(true),
	})
	.loose();

// The wrapped `{ data }` envelope for arbitrary GraphQL results. `z.json()`
// (not `z.unknown()`) because a GraphQL `data` payload is JSON by definition.
const RunGraphqlQueryResponseSchema = z.json().transform((data) => ({ data }));

// JUSTIFY(as const): registry objects need readonly literal keys so the
// `PlainEndpointInputs` / `PlainEndpointOutputs` mapped types and the
// `RequiredPluginEndpointSchemas` check in index.ts resolve per-operation.
// `as const` only narrows literals here; it never reinterprets a value's type
// the way a value cast (`x as T`) does.
export const PlainEndpointInputSchemas = {
	getCustomerById: GetCustomerByIdInputSchema,
	getCustomerByEmail: GetCustomerByEmailInputSchema,
	getCustomers: GetCustomersInputSchema,
	upsertCustomer: UpsertCustomerInputSchema,
	deleteCustomer: DeleteCustomerInputSchema,
	createThread: CreateThreadInputSchema,
	getThreadById: GetThreadByIdInputSchema,
	queryThreads: QueryThreadsInputSchema,
	listThreadsDeprecated: QueryThreadsInputSchema,
	fetchIssues: FetchIssuesInputSchema,
	sendMessage: SendMessageInputSchema,
	updateThread: UpdateThreadInputSchema,
	getUserById: GetUserByIdInputSchema,
	deleteUser: DeleteUserInputSchema,
	fetchCompany: FetchCompanyInputSchema,
	updateCompany: UpdateCompanyInputSchema,
	fetchTier: FetchTierInputSchema,
	listTiers: ListTiersInputSchema,
	createCustomerGroup: CreateCustomerGroupInputSchema,
	listCustomerGroups: ListCustomerGroupsInputSchema,
	addCustomerToGroup: AddCustomerToGroupInputSchema,
	removeCustomerFromGroup: RemoveCustomerFromGroupInputSchema,
	runGraphqlQuery: RunGraphqlQueryInputSchema,
} as const;

export const PlainEndpointOutputSchemas = {
	getCustomerById: GetCustomerByIdResponseSchema,
	getCustomerByEmail: GetCustomerByEmailResponseSchema,
	getCustomers: GetCustomersResponseSchema,
	upsertCustomer: UpsertCustomerResponseSchema,
	deleteCustomer: DeleteCustomerResponseSchema,
	createThread: CreateThreadResponseSchema,
	getThreadById: GetThreadByIdResponseSchema,
	queryThreads: QueryThreadsResponseSchema,
	listThreadsDeprecated: QueryThreadsResponseSchema,
	fetchIssues: FetchIssuesResponseSchema,
	sendMessage: SendMessageResponseSchema,
	updateThread: UpdateThreadResponseSchema,
	getUserById: GetUserByIdResponseSchema,
	deleteUser: DeleteUserResponseSchema,
	fetchCompany: FetchCompanyResponseSchema,
	updateCompany: UpdateCompanyResponseSchema,
	fetchTier: FetchTierResponseSchema,
	listTiers: ListTiersResponseSchema,
	createCustomerGroup: CreateCustomerGroupResponseSchema,
	listCustomerGroups: ListCustomerGroupsResponseSchema,
	addCustomerToGroup: AddCustomerToGroupResponseSchema,
	removeCustomerFromGroup: RemoveCustomerFromGroupResponseSchema,
	runGraphqlQuery: RunGraphqlQueryResponseSchema,
} as const;

export type PlainEndpointInputs = {
	[K in keyof typeof PlainEndpointInputSchemas]: z.infer<
		(typeof PlainEndpointInputSchemas)[K]
	>;
};

export type PlainEndpointOutputs = {
	[K in keyof typeof PlainEndpointOutputSchemas]: z.infer<
		(typeof PlainEndpointOutputSchemas)[K]
	>;
};

export type GetCustomerByIdInput = PlainEndpointInputs['getCustomerById'];
export type GetCustomerByEmailInput = PlainEndpointInputs['getCustomerByEmail'];
export type GetCustomersInput = PlainEndpointInputs['getCustomers'];
export type UpsertCustomerInput = PlainEndpointInputs['upsertCustomer'];
export type DeleteCustomerInput = PlainEndpointInputs['deleteCustomer'];
export type CreateThreadInput = PlainEndpointInputs['createThread'];
export type GetThreadByIdInput = PlainEndpointInputs['getThreadById'];
export type QueryThreadsInput = PlainEndpointInputs['queryThreads'];
export type FetchIssuesInput = PlainEndpointInputs['fetchIssues'];
export type SendMessageInput = PlainEndpointInputs['sendMessage'];
export type UpdateThreadInput = PlainEndpointInputs['updateThread'];
export type GetUserByIdInput = PlainEndpointInputs['getUserById'];
export type DeleteUserInput = PlainEndpointInputs['deleteUser'];
export type FetchCompanyInput = PlainEndpointInputs['fetchCompany'];
export type UpdateCompanyInput = PlainEndpointInputs['updateCompany'];
export type FetchTierInput = PlainEndpointInputs['fetchTier'];
export type ListTiersInput = PlainEndpointInputs['listTiers'];
export type CreateCustomerGroupInput =
	PlainEndpointInputs['createCustomerGroup'];
export type ListCustomerGroupsInput = PlainEndpointInputs['listCustomerGroups'];
export type AddCustomerToGroupInput = PlainEndpointInputs['addCustomerToGroup'];
export type RemoveCustomerFromGroupInput =
	PlainEndpointInputs['removeCustomerFromGroup'];
export type RunGraphqlQueryInput = PlainEndpointInputs['runGraphqlQuery'];

export type GetCustomerByIdResponse = PlainEndpointOutputs['getCustomerById'];
export type GetCustomerByEmailResponse =
	PlainEndpointOutputs['getCustomerByEmail'];
export type GetCustomersResponse = PlainEndpointOutputs['getCustomers'];
export type UpsertCustomerResponse = PlainEndpointOutputs['upsertCustomer'];
export type DeleteCustomerResponse = PlainEndpointOutputs['deleteCustomer'];
export type CreateThreadResponse = PlainEndpointOutputs['createThread'];
export type GetThreadByIdResponse = PlainEndpointOutputs['getThreadById'];
export type QueryThreadsResponse = PlainEndpointOutputs['queryThreads'];
export type FetchIssuesResponse = PlainEndpointOutputs['fetchIssues'];
export type SendMessageResponse = PlainEndpointOutputs['sendMessage'];
export type UpdateThreadResponse = PlainEndpointOutputs['updateThread'];
export type GetUserByIdResponse = PlainEndpointOutputs['getUserById'];
export type DeleteUserResponse = PlainEndpointOutputs['deleteUser'];
export type FetchCompanyResponse = PlainEndpointOutputs['fetchCompany'];
export type UpdateCompanyResponse = PlainEndpointOutputs['updateCompany'];
export type FetchTierResponse = PlainEndpointOutputs['fetchTier'];
export type ListTiersResponse = PlainEndpointOutputs['listTiers'];
export type CreateCustomerGroupResponse =
	PlainEndpointOutputs['createCustomerGroup'];
export type ListCustomerGroupsResponse =
	PlainEndpointOutputs['listCustomerGroups'];
export type AddCustomerToGroupResponse =
	PlainEndpointOutputs['addCustomerToGroup'];
export type RemoveCustomerFromGroupResponse =
	PlainEndpointOutputs['removeCustomerFromGroup'];
export type RunGraphqlQueryResponse = PlainEndpointOutputs['runGraphqlQuery'];
