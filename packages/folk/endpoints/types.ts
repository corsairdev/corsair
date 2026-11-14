import { z } from 'zod';

// Shared entity schemas

export const PaginationSchema = z.object({
	nextLink: z.string().optional(),
});

export const DeprecationsSchema = z.array(z.string()).optional();

export const UserSummarySchema = z.object({
	id: z.string(),
	fullName: z.string().nullable().optional(),
	email: z.string().nullable().optional(),
});

export const GroupRefSchema = z.object({
	id: z.string(),
	name: z.string().optional(),
});

export const CompanyRefSchema = z.object({
	id: z.string().optional(),
	name: z.string().optional(),
});

export const PersonSchema = z.object({
	id: z.string(),
	firstName: z.string().nullable().optional(),
	lastName: z.string().nullable().optional(),
	fullName: z.string().nullable().optional(),
	description: z.string().nullable().optional(),
	birthday: z.string().nullable().optional(),
	gender: z.string().nullable().optional(),
	jobTitle: z.string().nullable().optional(),
	createdAt: z.string().nullable().optional(),
	createdBy: UserSummarySchema.nullable().optional(),
	groups: z.array(GroupRefSchema).optional(),
	companies: z.array(CompanyRefSchema).optional(),
	addresses: z.array(z.string()).optional(),
	emails: z.array(z.string()).optional(),
	phones: z.array(z.string()).optional(),
	urls: z.array(z.string()).optional(),
	// `unknown` because custom field values map to dynamic custom field definitions configured in each Folk workspace.
	customFieldValues: z
		.record(z.string(), z.record(z.string(), z.unknown()))
		.optional(),
	interactionMetadata: z
		.object({
			user: z
				.object({
					approximateCount: z.number().optional(),
					lastInteractedAt: z.string().nullable().optional(),
				})
				.optional(),
			workspace: z
				.object({
					approximateCount: z.number().optional(),
					lastInteractedAt: z.string().nullable().optional(),
					lastInteractedBy: z.array(UserSummarySchema).optional(),
				})
				.optional(),
		})
		.nullable()
		.optional(),
	strongestConnection: z
		.record(z.string(), UserSummarySchema)
		.nullable()
		.optional(),
});

export const CompanySchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string().nullable().optional(),
	fundingRaised: z.union([z.number(), z.string()]).nullable().optional(),
	lastFundingDate: z.string().nullable().optional(),
	industry: z.string().nullable().optional(),
	foundationYear: z.union([z.number(), z.string()]).nullable().optional(),
	employeeRange: z.string().nullable().optional(),
	groups: z.array(GroupRefSchema).optional(),
	addresses: z.array(z.string()).optional(),
	emails: z.array(z.string()).optional(),
	phones: z.array(z.string()).optional(),
	urls: z.array(z.string()).optional(),
	createdAt: z.string().nullable().optional(),
	createdBy: UserSummarySchema.nullable().optional(),
	// `unknown` because custom field values map to dynamic custom field definitions configured in each Folk workspace.
	customFieldValues: z
		.record(z.string(), z.record(z.string(), z.unknown()))
		.optional(),
});

export const GroupSchema = z.object({
	id: z.string(),
	name: z.string(),
	visibility: z.enum(['public', 'private']),
	// Folk returns the creating user's ID here, not a user object.
	createdBy: z.string().nullable().optional(),
	emoji: z.string().nullable().optional(),
});

export const GroupMemberSchema = z.object({
	id: z.string(),
	fullName: z.string().nullable().optional(),
	email: z.string().nullable().optional(),
	role: z.enum(['owner', 'admin', 'contributor', 'reader']),
});

export const InteractionParticipantSchema = z.object({
	type: z.string().optional(),
	value: z.string().optional(),
	name: z.string().optional(),
	picture: z.string().optional(),
	userId: z.string().optional(),
});

export const InteractionSchema = z.object({
	id: z.string(),
	interactionType: z.string().optional(),
	from: InteractionParticipantSchema.optional(),
	// A logged interaction has one recipient; imported emails, calendar events, WhatsApp messages and calls list several.
	to: z
		.union([
			InteractionParticipantSchema,
			z.array(InteractionParticipantSchema),
		])
		.optional(),
	entity: z
		.object({
			id: z.string(),
			entityType: z.string().optional(),
			fullName: z.string().optional(),
		})
		.optional(),
	dateTime: z.string().optional(),
	url: z.string().nullable().optional(),
	privacyLevel: z.string().optional(),
	title: z.string().optional(),
	// A logged interaction's content is text; imported ones carry an object (subject, snippet, text, status, ...) whose fields depend on the source, hence `unknown`.
	content: z.union([z.string(), z.record(z.string(), z.unknown())]).optional(),
	type: z.string().optional(),
	activityType: z.string().optional(),
});

// A note's author is a workspace user, a deleted user (id only) or Folk's assistant (no id).
export const NoteAuthorSchema = z.object({
	type: z.string().optional(),
	id: z.string().optional(),
	fullName: z.string().nullable().optional(),
	email: z.string().nullable().optional(),
	deleted: z.boolean().optional(),
});

export const NoteSchema = z.object({
	id: z.string(),
	entity: z
		.object({
			id: z.string(),
			entityType: z.string().optional(),
			fullName: z.string().optional(),
		})
		.optional(),
	content: z.string(),
	visibility: z.enum(['public', 'private']),
	author: NoteAuthorSchema.nullable().optional(),
	createdAt: z.string().nullable().optional(),
	parentNote: z
		.object({
			id: z.string(),
		})
		.nullable()
		.optional(),
});

export const UserSchema = z.object({
	id: z.string(),
	fullName: z.string().nullable().optional(),
	email: z.string().nullable().optional(),
});

export const CreditItemSchema = z.object({
	feature: z.string(),
	scope: z.string(),
	used: z.number(),
	limit: z.number().nullable(),
	periodStart: z.string(),
	periodEnd: z.string(),
});

// People Schemas

export const PeopleListInputSchema = z
	.object({
		limit: z.number().min(1).max(100).optional(),
		cursor: z.string().max(512).optional(),
		combinator: z.enum(['and', 'or']).optional(),
		// `unknown` because filter parameter accepts arbitrary nested field queries.
		filter: z.record(z.string(), z.unknown()).optional(),
	})
	.strict();

export const PeopleListResponseSchema = z.object({
	data: z.object({
		items: z.array(PersonSchema),
		pagination: PaginationSchema,
	}),
	deprecations: DeprecationsSchema,
});

export const PeopleGetInputSchema = z
	.object({
		personId: z.string().min(1),
	})
	.strict();

export const PeopleGetResponseSchema = z.object({
	data: PersonSchema,
	deprecations: DeprecationsSchema,
});

export const PeopleCreateInputSchema = z
	.object({
		firstName: z.string().max(500).optional(),
		lastName: z.string().max(500).optional(),
		fullName: z.string().max(1000).optional(),
		description: z.string().max(5000).optional(),
		birthday: z.string().nullable().optional(),
		gender: z
			.enum(['Male', 'Female', 'Unknown', 'Other'])
			.nullable()
			.optional(),
		jobTitle: z.string().max(500).optional(),
		groups: z
			.array(z.object({ id: z.string() }))
			.max(100)
			.optional(),
		companies: z
			.array(
				z.object({ id: z.string().optional(), name: z.string().optional() }),
			)
			.max(20)
			.optional(),
		addresses: z.array(z.string().max(500)).max(20).optional(),
		emails: z.array(z.string().max(254)).max(20).optional(),
		phones: z.array(z.string().max(50)).max(20).optional(),
		urls: z.array(z.string().max(2000)).max(20).optional(),
		// `unknown` because customFieldValues maps group IDs to dynamic custom field names and values.
		customFieldValues: z
			.record(z.string(), z.record(z.string(), z.unknown()))
			.optional(),
		idempotencyKey: z.string().max(255).optional(),
	})
	.strict();

export const PeopleCreateResponseSchema = z.object({
	data: PersonSchema,
	deprecations: DeprecationsSchema,
});

export const PeopleUpdateInputSchema = z
	.object({
		personId: z.string().min(1),
		firstName: z.string().max(500).optional(),
		lastName: z.string().max(500).optional(),
		fullName: z.string().max(1000).optional(),
		description: z.string().max(5000).optional(),
		birthday: z.string().nullable().optional(),
		gender: z
			.enum(['Male', 'Female', 'Unknown', 'Other'])
			.nullable()
			.optional(),
		jobTitle: z.string().max(500).optional(),
		groups: z
			.array(z.object({ id: z.string() }))
			.max(100)
			.optional(),
		companies: z
			.array(
				z.object({ id: z.string().optional(), name: z.string().optional() }),
			)
			.max(20)
			.optional(),
		addresses: z.array(z.string().max(500)).max(20).optional(),
		emails: z.array(z.string().max(254)).max(20).optional(),
		phones: z.array(z.string().max(50)).max(20).optional(),
		urls: z.array(z.string().max(2000)).max(20).optional(),
		// `unknown` because customFieldValues maps group IDs to dynamic custom field names and values.
		customFieldValues: z
			.record(z.string(), z.record(z.string(), z.unknown()))
			.optional(),
		idempotencyKey: z.string().max(255).optional(),
	})
	.strict();

export const PeopleUpdateResponseSchema = z.object({
	data: PersonSchema,
	deprecations: DeprecationsSchema,
});

export const PeopleDeleteInputSchema = z
	.object({
		personId: z.string().min(1),
		idempotencyKey: z.string().max(255).optional(),
	})
	.strict();

export const PeopleDeleteResponseSchema = z.object({
	data: z.object({
		id: z.string(),
	}),
	deprecations: DeprecationsSchema,
});

// Companies Schemas

export const CompaniesListInputSchema = z
	.object({
		limit: z.number().min(1).max(100).optional(),
		cursor: z.string().max(512).optional(),
		combinator: z.enum(['and', 'or']).optional(),
		// `unknown` because filter parameter accepts arbitrary nested field queries.
		filter: z.record(z.string(), z.unknown()).optional(),
	})
	.strict();

export const CompaniesListResponseSchema = z.object({
	data: z.object({
		items: z.array(CompanySchema),
		pagination: PaginationSchema,
	}),
	deprecations: DeprecationsSchema,
});

export const CompaniesGetInputSchema = z
	.object({
		companyId: z.string().min(1),
	})
	.strict();

export const CompaniesGetResponseSchema = z.object({
	data: CompanySchema,
	deprecations: DeprecationsSchema,
});

export const CompaniesCreateInputSchema = z
	.object({
		name: z.string().min(1).max(1000),
		description: z.string().max(5000).optional(),
		fundingRaised: z.union([z.number(), z.string()]).nullable().optional(),
		lastFundingDate: z.string().nullable().optional(),
		industry: z.string().nullable().optional(),
		foundationYear: z.union([z.number(), z.string()]).nullable().optional(),
		employeeRange: z
			.enum([
				'1-10',
				'11-50',
				'51-200',
				'201-500',
				'501-1000',
				'1001-5000',
				'5001-10000',
				'10000+',
			])
			.nullable()
			.optional(),
		groups: z
			.array(z.object({ id: z.string() }))
			.max(100)
			.optional(),
		addresses: z.array(z.string().max(500)).max(20).optional(),
		emails: z.array(z.string().max(254)).max(20).optional(),
		phones: z.array(z.string().max(50)).max(20).optional(),
		urls: z.array(z.string().max(2000)).max(20).optional(),
		// `unknown` because customFieldValues maps group IDs to dynamic custom field names and values.
		customFieldValues: z
			.record(z.string(), z.record(z.string(), z.unknown()))
			.optional(),
		idempotencyKey: z.string().max(255).optional(),
	})
	.strict();

export const CompaniesCreateResponseSchema = z.object({
	data: CompanySchema,
	deprecations: DeprecationsSchema,
});

export const CompaniesUpdateInputSchema = z
	.object({
		companyId: z.string().min(1),
		name: z.string().min(1).max(1000).optional(),
		description: z.string().max(5000).optional(),
		fundingRaised: z.union([z.number(), z.string()]).nullable().optional(),
		lastFundingDate: z.string().nullable().optional(),
		industry: z.string().nullable().optional(),
		foundationYear: z.union([z.number(), z.string()]).nullable().optional(),
		employeeRange: z
			.enum([
				'1-10',
				'11-50',
				'51-200',
				'201-500',
				'501-1000',
				'1001-5000',
				'5001-10000',
				'10000+',
			])
			.nullable()
			.optional(),
		groups: z
			.array(z.object({ id: z.string() }))
			.max(100)
			.optional(),
		addresses: z.array(z.string().max(500)).max(20).optional(),
		emails: z.array(z.string().max(254)).max(20).optional(),
		phones: z.array(z.string().max(50)).max(20).optional(),
		urls: z.array(z.string().max(2000)).max(20).optional(),
		// `unknown` because customFieldValues maps group IDs to dynamic custom field names and values.
		customFieldValues: z
			.record(z.string(), z.record(z.string(), z.unknown()))
			.optional(),
		idempotencyKey: z.string().max(255).optional(),
	})
	.strict();

export const CompaniesUpdateResponseSchema = z.object({
	data: CompanySchema,
	deprecations: DeprecationsSchema,
});

export const CompaniesDeleteInputSchema = z
	.object({
		companyId: z.string().min(1),
		idempotencyKey: z.string().max(255).optional(),
	})
	.strict();

export const CompaniesDeleteResponseSchema = z.object({
	data: z.object({
		id: z.string(),
	}),
	deprecations: DeprecationsSchema,
});

// Groups Schemas

export const GroupsListInputSchema = z
	.object({
		limit: z.number().min(1).max(100).optional(),
		cursor: z.string().max(512).optional(),
	})
	.strict();

export const GroupsListResponseSchema = z.object({
	data: z.object({
		items: z.array(GroupSchema),
		pagination: PaginationSchema,
	}),
	deprecations: DeprecationsSchema,
});

export const GroupsCreateInputSchema = z
	.object({
		name: z.string().min(1).max(255),
		visibility: z.enum(['public', 'private']),
		emoji: z.string().max(50).optional(),
		idempotencyKey: z.string().max(255).optional(),
	})
	.strict();

export const GroupsCreateResponseSchema = z.object({
	data: GroupSchema,
	deprecations: DeprecationsSchema,
});

export const GroupsUpdateInputSchema = z
	.object({
		groupId: z.string().min(1),
		name: z.string().min(1).max(255).optional(),
		visibility: z.enum(['public', 'private']).optional(),
		emoji: z.string().max(50).optional(),
		idempotencyKey: z.string().max(255).optional(),
	})
	.strict();

export const GroupsUpdateResponseSchema = z.object({
	data: GroupSchema,
	deprecations: DeprecationsSchema,
});

// Group Members Schemas

export const GroupMembersListInputSchema = z
	.object({
		groupId: z.string().min(1),
		limit: z.number().min(1).max(100).optional(),
		cursor: z.string().max(512).optional(),
	})
	.strict();

export const GroupMembersListResponseSchema = z.object({
	data: z.object({
		items: z.array(GroupMemberSchema),
		pagination: PaginationSchema,
	}),
	deprecations: DeprecationsSchema,
});

export const GroupMembersAddInputSchema = z
	.object({
		groupId: z.string().min(1),
		id: z.string().min(1),
		role: z.enum(['admin', 'contributor', 'reader']),
		idempotencyKey: z.string().max(255).optional(),
	})
	.strict();

export const GroupMembersAddResponseSchema = z.object({
	data: GroupMemberSchema,
	deprecations: DeprecationsSchema,
});

export const GroupMembersUpdateInputSchema = z
	.object({
		groupId: z.string().min(1),
		userId: z.string().min(1),
		role: z.enum(['admin', 'contributor', 'reader']),
		idempotencyKey: z.string().max(255).optional(),
	})
	.strict();

export const GroupMembersUpdateResponseSchema = z.object({
	data: GroupMemberSchema,
	deprecations: DeprecationsSchema,
});

export const GroupMembersRemoveInputSchema = z
	.object({
		groupId: z.string().min(1),
		userId: z.string().min(1),
		idempotencyKey: z.string().max(255).optional(),
	})
	.strict();

export const GroupMembersRemoveResponseSchema = z.object({
	data: z.object({
		id: z.string(),
	}),
	deprecations: DeprecationsSchema,
});

// Interactions Schemas

export const InteractionsListInputSchema = z
	.object({
		cursor: z.string().max(512).optional(),
		// Sent as Folk's required `entity.id` query parameter.
		entityId: z.string().min(1).max(40),
		timeframe: z.enum(['past', 'upcoming']),
	})
	.strict();

export const InteractionsListResponseSchema = z.object({
	data: z.object({
		items: z.array(InteractionSchema),
		pagination: PaginationSchema,
	}),
	deprecations: DeprecationsSchema,
});

export const InteractionsListPastInputSchema = z
	.object({
		cursor: z.string().max(512).optional(),
		// Sent as Folk's required `entity.id` query parameter.
		entityId: z.string().min(1).max(40),
	})
	.strict();

export const InteractionsListPastResponseSchema = z.object({
	data: z.object({
		items: z.array(InteractionSchema),
		pagination: PaginationSchema,
	}),
	deprecations: DeprecationsSchema,
});

export const InteractionsListUpcomingInputSchema = z
	.object({
		cursor: z.string().max(512).optional(),
		// Sent as Folk's required `entity.id` query parameter.
		entityId: z.string().min(1).max(40),
	})
	.strict();

export const InteractionsListUpcomingResponseSchema = z.object({
	data: z.object({
		items: z.array(InteractionSchema),
		pagination: PaginationSchema,
	}),
	deprecations: DeprecationsSchema,
});

export const InteractionsGetInputSchema = z
	.object({
		interactionId: z.string().min(1),
		// Sent as Folk's required `entity.id` query parameter.
		entityId: z.string().min(1).max(40),
	})
	.strict();

export const InteractionsGetResponseSchema = z.object({
	data: InteractionSchema,
	deprecations: DeprecationsSchema,
});

export const InteractionsCreateInputSchema = z
	.object({
		entity: z.object({ id: z.string().min(1) }),
		dateTime: z.string().min(1),
		title: z.string().min(1).max(255),
		content: z.string().max(100000),
		activityType: z.string().optional(),
		idempotencyKey: z.string().max(255).optional(),
	})
	.strict();

export const InteractionsCreateResponseSchema = z.object({
	data: InteractionSchema,
	deprecations: DeprecationsSchema,
});

export const InteractionsUpdateInputSchema = z
	.object({
		interactionId: z.string().min(1),
		entity: z.object({ id: z.string().min(1) }),
		dateTime: z.string().optional(),
		title: z.string().max(255).optional(),
		content: z.string().max(100000).optional(),
		activityType: z.string().optional(),
		idempotencyKey: z.string().max(255).optional(),
	})
	.strict();

export const InteractionsUpdateResponseSchema = z.object({
	data: InteractionSchema,
	deprecations: DeprecationsSchema,
});

export const InteractionsDeleteInputSchema = z
	.object({
		interactionId: z.string().min(1),
		// Sent as Folk's required `entity.id` query parameter.
		entityId: z.string().min(1).max(40),
		idempotencyKey: z.string().max(255).optional(),
	})
	.strict();

export const InteractionsDeleteResponseSchema = z.object({
	data: z.object({
		id: z.string(),
	}),
	deprecations: DeprecationsSchema,
});

// Notes Schemas

export const NotesListInputSchema = z
	.object({
		limit: z.number().min(1).max(100).optional(),
		cursor: z.string().max(512).optional(),
		// Sent as Folk's `entity.id` query parameter.
		entityId: z.string().max(40).optional(),
		query: z.string().max(500).optional(),
		createdAfter: z.string().max(100).optional(),
		createdBefore: z.string().max(100).optional(),
	})
	.strict();

export const NotesListResponseSchema = z.object({
	data: z.object({
		items: z.array(NoteSchema),
		pagination: PaginationSchema,
	}),
	deprecations: DeprecationsSchema,
});

export const NotesGetInputSchema = z
	.object({
		noteId: z.string().min(1),
	})
	.strict();

export const NotesGetResponseSchema = z.object({
	data: NoteSchema,
	deprecations: DeprecationsSchema,
});

export const NotesCreateInputSchema = z
	.object({
		entity: z.object({ id: z.string().min(1) }),
		visibility: z.enum(['public', 'private']),
		content: z.string().min(1).max(100000),
		parentNote: z.object({ id: z.string().min(1) }).optional(),
		idempotencyKey: z.string().max(255).optional(),
	})
	.strict();

export const NotesCreateResponseSchema = z.object({
	data: NoteSchema,
	deprecations: DeprecationsSchema,
});

export const NotesUpdateInputSchema = z
	.object({
		noteId: z.string().min(1),
		content: z.string().min(1).max(100000).optional(),
		visibility: z.enum(['public', 'private']).optional(),
		idempotencyKey: z.string().max(255).optional(),
	})
	.strict();

export const NotesUpdateResponseSchema = z.object({
	data: NoteSchema,
	deprecations: DeprecationsSchema,
});

export const NotesDeleteInputSchema = z
	.object({
		noteId: z.string().min(1),
		idempotencyKey: z.string().max(255).optional(),
	})
	.strict();

export const NotesDeleteResponseSchema = z.object({
	data: z.object({
		id: z.string(),
	}),
	deprecations: DeprecationsSchema,
});

// Users Schemas

export const UsersListInputSchema = z
	.object({
		limit: z.number().min(1).max(100).optional(),
		cursor: z.string().max(512).optional(),
	})
	.strict();

export const UsersListResponseSchema = z.object({
	data: z.object({
		items: z.array(UserSchema),
		pagination: PaginationSchema,
	}),
	deprecations: DeprecationsSchema,
});

export const UsersGetCurrentUserInputSchema = z.object({}).strict();

export const UsersGetCurrentUserResponseSchema = z.object({
	data: UserSchema,
	deprecations: DeprecationsSchema,
});

export const UsersGetInputSchema = z
	.object({
		userId: z.string().min(1),
	})
	.strict();

export const UsersGetResponseSchema = z.object({
	data: UserSchema,
	deprecations: DeprecationsSchema,
});

// Credits Schemas

export const CreditsGetInputSchema = z.object({}).strict();

export const CreditsGetResponseSchema = z.object({
	data: z.object({
		items: z.array(CreditItemSchema),
	}),
	deprecations: DeprecationsSchema,
});

// Type definitions

export type Person = z.infer<typeof PersonSchema>;
export type Company = z.infer<typeof CompanySchema>;
export type Group = z.infer<typeof GroupSchema>;
export type GroupMember = z.infer<typeof GroupMemberSchema>;
export type Interaction = z.infer<typeof InteractionSchema>;
export type Note = z.infer<typeof NoteSchema>;
export type User = z.infer<typeof UserSchema>;
export type CreditItem = z.infer<typeof CreditItemSchema>;

export type PeopleListInput = z.infer<typeof PeopleListInputSchema>;
export type PeopleListResponse = z.infer<typeof PeopleListResponseSchema>;
export type PeopleGetInput = z.infer<typeof PeopleGetInputSchema>;
export type PeopleGetResponse = z.infer<typeof PeopleGetResponseSchema>;
export type PeopleCreateInput = z.infer<typeof PeopleCreateInputSchema>;
export type PeopleCreateResponse = z.infer<typeof PeopleCreateResponseSchema>;
export type PeopleUpdateInput = z.infer<typeof PeopleUpdateInputSchema>;
export type PeopleUpdateResponse = z.infer<typeof PeopleUpdateResponseSchema>;
export type PeopleDeleteInput = z.infer<typeof PeopleDeleteInputSchema>;
export type PeopleDeleteResponse = z.infer<typeof PeopleDeleteResponseSchema>;

export type CompaniesListInput = z.infer<typeof CompaniesListInputSchema>;
export type CompaniesListResponse = z.infer<typeof CompaniesListResponseSchema>;
export type CompaniesGetInput = z.infer<typeof CompaniesGetInputSchema>;
export type CompaniesGetResponse = z.infer<typeof CompaniesGetResponseSchema>;
export type CompaniesCreateInput = z.infer<typeof CompaniesCreateInputSchema>;
export type CompaniesCreateResponse = z.infer<
	typeof CompaniesCreateResponseSchema
>;
export type CompaniesUpdateInput = z.infer<typeof CompaniesUpdateInputSchema>;
export type CompaniesUpdateResponse = z.infer<
	typeof CompaniesUpdateResponseSchema
>;
export type CompaniesDeleteInput = z.infer<typeof CompaniesDeleteInputSchema>;
export type CompaniesDeleteResponse = z.infer<
	typeof CompaniesDeleteResponseSchema
>;

export type GroupsListInput = z.infer<typeof GroupsListInputSchema>;
export type GroupsListResponse = z.infer<typeof GroupsListResponseSchema>;
export type GroupsCreateInput = z.infer<typeof GroupsCreateInputSchema>;
export type GroupsCreateResponse = z.infer<typeof GroupsCreateResponseSchema>;
export type GroupsUpdateInput = z.infer<typeof GroupsUpdateInputSchema>;
export type GroupsUpdateResponse = z.infer<typeof GroupsUpdateResponseSchema>;

export type GroupMembersListInput = z.infer<typeof GroupMembersListInputSchema>;
export type GroupMembersListResponse = z.infer<
	typeof GroupMembersListResponseSchema
>;
export type GroupMembersAddInput = z.infer<typeof GroupMembersAddInputSchema>;
export type GroupMembersAddResponse = z.infer<
	typeof GroupMembersAddResponseSchema
>;
export type GroupMembersUpdateInput = z.infer<
	typeof GroupMembersUpdateInputSchema
>;
export type GroupMembersUpdateResponse = z.infer<
	typeof GroupMembersUpdateResponseSchema
>;
export type GroupMembersRemoveInput = z.infer<
	typeof GroupMembersRemoveInputSchema
>;
export type GroupMembersRemoveResponse = z.infer<
	typeof GroupMembersRemoveResponseSchema
>;

export type InteractionsListInput = z.infer<typeof InteractionsListInputSchema>;
export type InteractionsListResponse = z.infer<
	typeof InteractionsListResponseSchema
>;
export type InteractionsListPastInput = z.infer<
	typeof InteractionsListPastInputSchema
>;
export type InteractionsListPastResponse = z.infer<
	typeof InteractionsListPastResponseSchema
>;
export type InteractionsListUpcomingInput = z.infer<
	typeof InteractionsListUpcomingInputSchema
>;
export type InteractionsListUpcomingResponse = z.infer<
	typeof InteractionsListUpcomingResponseSchema
>;
export type InteractionsGetInput = z.infer<typeof InteractionsGetInputSchema>;
export type InteractionsGetResponse = z.infer<
	typeof InteractionsGetResponseSchema
>;
export type InteractionsCreateInput = z.infer<
	typeof InteractionsCreateInputSchema
>;
export type InteractionsCreateResponse = z.infer<
	typeof InteractionsCreateResponseSchema
>;
export type InteractionsUpdateInput = z.infer<
	typeof InteractionsUpdateInputSchema
>;
export type InteractionsUpdateResponse = z.infer<
	typeof InteractionsUpdateResponseSchema
>;
export type InteractionsDeleteInput = z.infer<
	typeof InteractionsDeleteInputSchema
>;
export type InteractionsDeleteResponse = z.infer<
	typeof InteractionsDeleteResponseSchema
>;

export type NotesListInput = z.infer<typeof NotesListInputSchema>;
export type NotesListResponse = z.infer<typeof NotesListResponseSchema>;
export type NotesGetInput = z.infer<typeof NotesGetInputSchema>;
export type NotesGetResponse = z.infer<typeof NotesGetResponseSchema>;
export type NotesCreateInput = z.infer<typeof NotesCreateInputSchema>;
export type NotesCreateResponse = z.infer<typeof NotesCreateResponseSchema>;
export type NotesUpdateInput = z.infer<typeof NotesUpdateInputSchema>;
export type NotesUpdateResponse = z.infer<typeof NotesUpdateResponseSchema>;
export type NotesDeleteInput = z.infer<typeof NotesDeleteInputSchema>;
export type NotesDeleteResponse = z.infer<typeof NotesDeleteResponseSchema>;

export type UsersListInput = z.infer<typeof UsersListInputSchema>;
export type UsersListResponse = z.infer<typeof UsersListResponseSchema>;
export type UsersGetCurrentUserInput = z.infer<
	typeof UsersGetCurrentUserInputSchema
>;
export type UsersGetCurrentUserResponse = z.infer<
	typeof UsersGetCurrentUserResponseSchema
>;
export type UsersGetInput = z.infer<typeof UsersGetInputSchema>;
export type UsersGetResponse = z.infer<typeof UsersGetResponseSchema>;

export type CreditsGetInput = z.infer<typeof CreditsGetInputSchema>;
export type CreditsGetResponse = z.infer<typeof CreditsGetResponseSchema>;

// Input & Output Schemas Maps

export const FolkEndpointInputSchemas = {
	peopleList: PeopleListInputSchema,
	peopleGet: PeopleGetInputSchema,
	peopleCreate: PeopleCreateInputSchema,
	peopleUpdate: PeopleUpdateInputSchema,
	peopleDelete: PeopleDeleteInputSchema,
	companiesList: CompaniesListInputSchema,
	companiesGet: CompaniesGetInputSchema,
	companiesCreate: CompaniesCreateInputSchema,
	companiesUpdate: CompaniesUpdateInputSchema,
	companiesDelete: CompaniesDeleteInputSchema,
	groupsList: GroupsListInputSchema,
	groupsCreate: GroupsCreateInputSchema,
	groupsUpdate: GroupsUpdateInputSchema,
	groupMembersList: GroupMembersListInputSchema,
	groupMembersAdd: GroupMembersAddInputSchema,
	groupMembersUpdate: GroupMembersUpdateInputSchema,
	groupMembersRemove: GroupMembersRemoveInputSchema,
	interactionsList: InteractionsListInputSchema,
	interactionsListPast: InteractionsListPastInputSchema,
	interactionsListUpcoming: InteractionsListUpcomingInputSchema,
	interactionsGet: InteractionsGetInputSchema,
	interactionsCreate: InteractionsCreateInputSchema,
	interactionsUpdate: InteractionsUpdateInputSchema,
	interactionsDelete: InteractionsDeleteInputSchema,
	notesList: NotesListInputSchema,
	notesGet: NotesGetInputSchema,
	notesCreate: NotesCreateInputSchema,
	notesUpdate: NotesUpdateInputSchema,
	notesDelete: NotesDeleteInputSchema,
	usersList: UsersListInputSchema,
	usersGetCurrentUser: UsersGetCurrentUserInputSchema,
	usersGet: UsersGetInputSchema,
	creditsGet: CreditsGetInputSchema,
} as const;

export const FolkEndpointOutputSchemas = {
	peopleList: PeopleListResponseSchema,
	peopleGet: PeopleGetResponseSchema,
	peopleCreate: PeopleCreateResponseSchema,
	peopleUpdate: PeopleUpdateResponseSchema,
	peopleDelete: PeopleDeleteResponseSchema,
	companiesList: CompaniesListResponseSchema,
	companiesGet: CompaniesGetResponseSchema,
	companiesCreate: CompaniesCreateResponseSchema,
	companiesUpdate: CompaniesUpdateResponseSchema,
	companiesDelete: CompaniesDeleteResponseSchema,
	groupsList: GroupsListResponseSchema,
	groupsCreate: GroupsCreateResponseSchema,
	groupsUpdate: GroupsUpdateResponseSchema,
	groupMembersList: GroupMembersListResponseSchema,
	groupMembersAdd: GroupMembersAddResponseSchema,
	groupMembersUpdate: GroupMembersUpdateResponseSchema,
	groupMembersRemove: GroupMembersRemoveResponseSchema,
	interactionsList: InteractionsListResponseSchema,
	interactionsListPast: InteractionsListPastResponseSchema,
	interactionsListUpcoming: InteractionsListUpcomingResponseSchema,
	interactionsGet: InteractionsGetResponseSchema,
	interactionsCreate: InteractionsCreateResponseSchema,
	interactionsUpdate: InteractionsUpdateResponseSchema,
	interactionsDelete: InteractionsDeleteResponseSchema,
	notesList: NotesListResponseSchema,
	notesGet: NotesGetResponseSchema,
	notesCreate: NotesCreateResponseSchema,
	notesUpdate: NotesUpdateResponseSchema,
	notesDelete: NotesDeleteResponseSchema,
	usersList: UsersListResponseSchema,
	usersGetCurrentUser: UsersGetCurrentUserResponseSchema,
	usersGet: UsersGetResponseSchema,
	creditsGet: CreditsGetResponseSchema,
} as const;

export type FolkEndpointInputs = {
	peopleList: PeopleListInput;
	peopleGet: PeopleGetInput;
	peopleCreate: PeopleCreateInput;
	peopleUpdate: PeopleUpdateInput;
	peopleDelete: PeopleDeleteInput;
	companiesList: CompaniesListInput;
	companiesGet: CompaniesGetInput;
	companiesCreate: CompaniesCreateInput;
	companiesUpdate: CompaniesUpdateInput;
	companiesDelete: CompaniesDeleteInput;
	groupsList: GroupsListInput;
	groupsCreate: GroupsCreateInput;
	groupsUpdate: GroupsUpdateInput;
	groupMembersList: GroupMembersListInput;
	groupMembersAdd: GroupMembersAddInput;
	groupMembersUpdate: GroupMembersUpdateInput;
	groupMembersRemove: GroupMembersRemoveInput;
	interactionsList: InteractionsListInput;
	interactionsListPast: InteractionsListPastInput;
	interactionsListUpcoming: InteractionsListUpcomingInput;
	interactionsGet: InteractionsGetInput;
	interactionsCreate: InteractionsCreateInput;
	interactionsUpdate: InteractionsUpdateInput;
	interactionsDelete: InteractionsDeleteInput;
	notesList: NotesListInput;
	notesGet: NotesGetInput;
	notesCreate: NotesCreateInput;
	notesUpdate: NotesUpdateInput;
	notesDelete: NotesDeleteInput;
	usersList: UsersListInput;
	usersGetCurrentUser: UsersGetCurrentUserInput;
	usersGet: UsersGetInput;
	creditsGet: CreditsGetInput;
};

export type FolkEndpointOutputs = {
	peopleList: PeopleListResponse;
	peopleGet: PeopleGetResponse;
	peopleCreate: PeopleCreateResponse;
	peopleUpdate: PeopleUpdateResponse;
	peopleDelete: PeopleDeleteResponse;
	companiesList: CompaniesListResponse;
	companiesGet: CompaniesGetResponse;
	companiesCreate: CompaniesCreateResponse;
	companiesUpdate: CompaniesUpdateResponse;
	companiesDelete: CompaniesDeleteResponse;
	groupsList: GroupsListResponse;
	groupsCreate: GroupsCreateResponse;
	groupsUpdate: GroupsUpdateResponse;
	groupMembersList: GroupMembersListResponse;
	groupMembersAdd: GroupMembersAddResponse;
	groupMembersUpdate: GroupMembersUpdateResponse;
	groupMembersRemove: GroupMembersRemoveResponse;
	interactionsList: InteractionsListResponse;
	interactionsListPast: InteractionsListPastResponse;
	interactionsListUpcoming: InteractionsListUpcomingResponse;
	interactionsGet: InteractionsGetResponse;
	interactionsCreate: InteractionsCreateResponse;
	interactionsUpdate: InteractionsUpdateResponse;
	interactionsDelete: InteractionsDeleteResponse;
	notesList: NotesListResponse;
	notesGet: NotesGetResponse;
	notesCreate: NotesCreateResponse;
	notesUpdate: NotesUpdateResponse;
	notesDelete: NotesDeleteResponse;
	usersList: UsersListResponse;
	usersGetCurrentUser: UsersGetCurrentUserResponse;
	usersGet: UsersGetResponse;
	creditsGet: CreditsGetResponse;
};
