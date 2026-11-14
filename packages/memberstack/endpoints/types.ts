import { z } from 'zod';

// Memberstack data tables and member JSON use application-defined keys and values.
const arbitraryObject = z.record(z.string(), z.unknown());
export const pathSegment = z
	.string()
	.min(1)
	.refine(
		(value) => value !== '.' && value !== '..' && !/[\\/"']/.test(value),
		'Must be a safe path segment',
	);
const member = z
	.object({
		id: z.string(),
		auth: z.object({ email: z.string().optional() }).loose().optional(),
		createdAt: z.string().optional(),
		lastLogin: z.string().nullable().optional(),
		verified: z.boolean().optional(),
		customFields: arbitraryObject.nullable().optional(),
		metaData: arbitraryObject.nullable().optional(),
		json: arbitraryObject.nullable().optional(),
		loginRedirect: z.string().nullable().optional(),
		stripeCustomerId: z.string().nullable().optional(),
		profileImage: z.string().nullable().optional(),
		permissions: z.array(z.string()).optional(),
		planConnections: z
			.array(
				z
					.object({
						id: z.string().optional(),
						active: z.boolean().optional(),
						status: z.string().optional(),
						planId: z.string().optional(),
						planName: z.string().optional(),
						type: z.string().optional(),
						payment: arbitraryObject.nullable().optional(),
					})
					.loose(),
			)
			.optional(),
		teams: z
			.array(
				z
					.object({
						id: z.string(),
						role: z.string(),
						createdAt: z.string(),
						inviteToken: z.string(),
						currentTeamMemberCount: z.number(),
						maxTeamMembers: z.number().nullable(),
						plan: z
							.object({
								id: z.string(),
								name: z.string(),
								teamAccountInviteSignupLink: z.string(),
								teamAccountUpgradeLink: z.string(),
							})
							.nullable(),
					})
					.loose(),
			)
			.optional(),
	})
	.loose();
const tableField = z
	.object({
		id: z.string(),
		key: z.string(),
		name: z.string(),
		type: z.string(),
		required: z.boolean(),
		defaultValue: z.unknown(),
		tableOrder: z.number(),
		referencedTableId: z.string().nullable(),
		referencedTable: z
			.object({ id: z.string(), key: z.string(), name: z.string() })
			.nullable()
			.optional(),
	})
	.loose();
const table = z
	.object({
		id: z.string(),
		key: z.string(),
		name: z.string(),
		createRule: z.string(),
		readRule: z.string(),
		updateRule: z.string(),
		deleteRule: z.string(),
		createdAt: z.string(),
		updatedAt: z.string(),
		fields: z.array(tableField),
	})
	.loose();
const record = z
	.object({
		id: z.string(),
		tableKey: z.string().optional(),
		data: arbitraryObject,
		createdAt: z.string(),
		updatedAt: z.string(),
		internalOrder: z.number(),
		createdByMemberId: z.string().nullable().optional(),
	})
	.loose();
const memberFields = {
	email: z.string().email().optional(),
	customFields: arbitraryObject.optional(),
	metaData: arbitraryObject.optional(),
	json: arbitraryObject.optional(),
	loginRedirect: z.string().optional(),
};
const findMany = z
	.object({
		where: arbitraryObject.optional(),
		include: arbitraryObject.optional(),
		select: arbitraryObject.optional(),
		orderBy: z.union([arbitraryObject, z.array(arbitraryObject)]).optional(),
		take: z.number().int().min(1).max(100).optional(),
		skip: z.number().int().min(0).max(10000).optional(),
		after: z.union([z.string(), z.number()]).optional(),
		_count: z.boolean().optional(),
	})
	.refine(
		(v) => !(v.skip !== undefined && v.after !== undefined),
		'skip and after cannot be combined',
	)
	.refine(
		(v) => !(v.include && v.select),
		'include and select cannot be combined',
	);
const findUnique = z
	.object({
		where: z.object({ id: z.string().min(1) }),
		include: arbitraryObject.optional(),
		select: arbitraryObject.optional(),
	})
	.refine(
		(v) => !(v.include && v.select),
		'include and select cannot be combined',
	);

export const inputs = {
	membersList: z.object({
		after: z.number().optional(),
		order: z.enum(['ASC', 'DESC']).optional(),
		first: z.number().int().positive().optional(),
		limit: z.number().int().positive().optional(),
		includeJSON: z.literal('true').optional(),
	}),
	membersGet: z.object({
		id_or_email: pathSegment,
		include: z.string().optional(),
	}),
	membersCreate: z.object({
		...memberFields,
		email: z.string().email(),
		password: z.string().optional(),
		plans: z.array(z.object({ planId: z.string().min(1) })).optional(),
	}),
	membersUpdate: z.object({
		id: pathSegment,
		...memberFields,
		verified: z.boolean().optional(),
		profileImage: z.string().optional(),
	}),
	membersDelete: z.object({
		id: pathSegment,
		deleteStripeCustomer: z.boolean().optional(),
		cancelStripeSubscriptions: z.boolean().optional(),
	}),
	membersAddPlan: z.object({ id: pathSegment, planId: z.string().min(1) }),
	membersRemovePlan: z.object({ id: pathSegment, planId: z.string().min(1) }),
	membersVerifyToken: z.object({ token: z.string().min(1) }),
	tablesList: z.object({}),
	tablesGet: z.object({ tableKey: pathSegment }),
	recordsCreate: z.object({
		tableKey: pathSegment,
		data: arbitraryObject,
		memberId: z.string().min(1).optional(),
	}),
	recordsQuery: z.object({
		tableKey: pathSegment,
		query: z.union([
			z.object({ findMany, findUnique: z.never().optional() }),
			z.object({ findUnique, findMany: z.never().optional() }),
		]),
	}),
	recordsUpdate: z.object({
		tableKey: pathSegment,
		recordId: pathSegment,
		data: arbitraryObject.refine(
			(v) => Object.keys(v).length > 0,
			'data cannot be empty',
		),
	}),
	recordsDelete: z.object({ tableKey: pathSegment, recordId: pathSegment }),
} as const;
export const outputs = {
	membersList: z
		.object({
			data: z.array(member),
			totalCount: z.number(),
			endCursor: z.number().nullable(),
			hasNextPage: z.boolean(),
		})
		.loose(),
	membersGet: z.object({ data: member.nullable() }).loose(),
	membersCreate: z.object({ data: member }).loose(),
	membersUpdate: z.object({ data: member }).loose(),
	membersDelete: z
		.object({ data: z.object({ id: z.string() }).loose() })
		.loose(),
	membersAddPlan: z.void(),
	membersRemovePlan: z.void(),
	membersVerifyToken: z
		.object({
			data: z
				.object({
					id: z.string(),
					type: z.string(),
					iat: z.number(),
					exp: z.number(),
					aud: z.string(),
					iss: z.string(),
				})
				.loose(),
		})
		.loose(),
	tablesList: z
		.object({ data: z.object({ tables: z.array(table) }).loose() })
		.loose(),
	tablesGet: z.object({ data: table }).loose(),
	recordsCreate: z.object({ data: record }).loose(),
	recordsQuery: z
		.object({
			data: z.union([
				z
					.object({
						records: z.array(record),
						pagination: z
							.object({
								hasMore: z.boolean(),
								limit: z.number(),
								endCursor: z.union([z.number(), z.string()]).nullable(),
							})
							.loose(),
					})
					.loose(),
				z.object({ record }).loose(),
				z.object({ _count: z.number() }).loose(),
			]),
		})
		.loose(),
	recordsUpdate: z.object({ data: record }).loose(),
	recordsDelete: z.object({ data: record }).loose(),
} as const;
export type MemberstackEndpointInputs = {
	[K in keyof typeof inputs]: z.infer<(typeof inputs)[K]>;
};
export type MemberstackEndpointOutputs = {
	[K in keyof typeof outputs]: z.infer<(typeof outputs)[K]>;
};
