import { z } from 'zod';

const PageInfoSchema = z.object({
	hasNextPage: z.boolean(),
	hasPreviousPage: z.boolean(),
	startCursor: z.string().nullable(),
	endCursor: z.string().nullable(),
});

const UpsertResultSchema = z.enum(['CREATED', 'UPDATED', 'NOOP']);

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

const CustomerSchema = z
	.object({
		id: z.string(),
		externalId: z.string().nullable().optional(),
		fullName: z.string(),
		shortName: z.string().nullable().optional(),
		email: z
			.object({
				email: z.string(),
				isVerified: z.boolean(),
			})
			.optional(),
	})
	.loose();

const ThreadSummarySchema = z
	.object({
		id: z.string(),
		ref: z.string().optional(),
		title: z.string(),
		status: z.string().optional(),
		priority: z.number().int().optional(),
	})
	.loose();

const ThreadLinkSchema = z
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

const UserSchema = z
	.object({
		id: z.string(),
		fullName: z.string(),
		publicName: z.string().optional(),
		email: z.string(),
		isDeleted: z.boolean().optional(),
	})
	.loose();

const CompanySchema = z
	.object({
		id: z.string(),
		name: z.string(),
		domainName: z.string().optional(),
		contractValue: z.number().int().nullable().optional(),
	})
	.loose();

const TierSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		description: z.string().nullable().optional(),
	})
	.loose();

const CustomerGroupSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		key: z.string(),
		color: z.string(),
		externalId: z.string().nullable().optional(),
	})
	.loose();

const CustomerGroupMembershipSchema = z
	.object({
		customerId: z.string(),
		customerGroup: CustomerGroupSchema,
	})
	.loose();

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

const GetCustomerByIdInputSchema = z.object({
	customerId: z.string(),
});

const GetCustomerByEmailInputSchema = z.object({
	email: z.string().email(),
});

const GetCustomersInputSchema = z.object({
	filters: CustomersFilterSchema.optional(),
	sortBy: z
		.object({
			field: z.enum(['FULL_NAME']),
			direction: z.enum(['ASC', 'DESC']),
		})
		.optional(),
	first: z.number().int().positive().max(100).optional(),
	after: z.string().optional(),
	last: z.number().int().positive().max(100).optional(),
	before: z.string().optional(),
});

const UpsertCustomerInputSchema = z.object({
	identifier: CustomerIdentifierInputSchema,
	onCreate: z
		.object({
			externalId: z.string().optional(),
			fullName: z.string(),
			shortName: z.string().optional(),
			email: z.object({ email: z.string().email() }).optional(),
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
			email: z.object({ email: z.string().email() }).optional(),
		})
		.loose(),
});

const DeleteCustomerInputSchema = z.object({
	customerId: z.string(),
});

const GetThreadByIdInputSchema = z.object({
	threadId: z.string(),
});

const QueryThreadsInputSchema = z.object({
	filters: z.record(z.string(), z.unknown()).optional(),
	sortBy: ThreadsSortSchema.optional(),
	first: z.number().int().positive().max(100).optional(),
	after: z.string().optional(),
	last: z.number().int().positive().max(100).optional(),
	before: z.string().optional(),
});

const FetchIssuesInputSchema = z.object({
	customerId: z.string(),
	threadFirst: z.number().int().positive().max(100).optional(),
	threadAfter: z.string().optional(),
	threadLast: z.number().int().positive().max(100).optional(),
	threadBefore: z.string().optional(),
	linkFirst: z.number().int().positive().max(100).optional(),
});

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

const CreateThreadInputSchema = z.object({
	customerIdentifier: CustomerIdentifierInputSchema,
	title: z.string().optional(),
	description: z.string().optional(),
	priority: z.number().int().min(0).max(3).optional(),
	labelTypeIds: z.array(z.string()).optional(),
	threadFields: z.array(z.record(z.string(), z.unknown())).optional(),
	assignedTo: z
		.object({
			userId: z.string().optional(),
			machineUserId: z.string().optional(),
		})
		.optional(),
	externalId: z.string().optional(),
	tenantIdentifier: TenantIdentifierInputSchema.optional(),
	channel: z
		.enum(['API', 'EMAIL', 'SLACK', 'MS_TEAMS', 'CHAT', 'INTERNAL'])
		.optional(),
});

const UpdateThreadInputSchema = z.object({
	threadId: z.string(),
	title: z.string().min(1),
});

const GetUserByIdInputSchema = z.object({
	userId: z.string(),
});

const DeleteUserInputSchema = z.object({
	userId: z.string(),
});

const FetchCompanyInputSchema = z.object({
	companyId: z.string(),
});

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

const ListTiersInputSchema = z.object({
	first: z.number().int().positive().max(100).optional(),
	after: z.string().optional(),
	last: z.number().int().positive().max(100).optional(),
	before: z.string().optional(),
});

const CreateCustomerGroupInputSchema = z.object({
	name: z.string().min(1),
	key: z.string().min(1),
	color: z.string().min(1),
	externalId: z.string().optional(),
});

const ListCustomerGroupsInputSchema = z.object({
	filters: z
		.object({
			externalIds: z.array(z.string()).optional(),
		})
		.optional(),
	first: z.number().int().positive().max(100).optional(),
	after: z.string().optional(),
	last: z.number().int().positive().max(100).optional(),
	before: z.string().optional(),
});

const AddCustomerToGroupInputSchema = z.object({
	customerId: z.string(),
	customerGroupIdentifiers: z
		.array(CustomerGroupIdentifierSchema)
		.min(1)
		.max(25),
});

const RemoveCustomerFromGroupInputSchema = z.object({
	customerId: z.string(),
	customerGroupIdentifiers: z
		.array(CustomerGroupIdentifierSchema)
		.min(1)
		.max(25),
});

const RunGraphqlQueryInputSchema = z.object({
	query: z.string().min(1),
	variables: z.record(z.string(), z.unknown()).optional(),
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

const RunGraphqlQueryResponseSchema = z
	.unknown()
	.transform((data) => ({ data }));

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
