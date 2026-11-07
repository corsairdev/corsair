import { z } from 'zod';
import {
	DeletedResponseSchema,
	FubFlagSchema,
	FubMetadataSchema,
	IdSchema,
	ListQuerySchema,
} from './types';

// Inputs use Follow Up Boss's own parameter names; outputs are `.loose()` and
// their documented fields nullish, so a field FUB adds or omits cannot fail a
// call that has already happened. Field reference:
// https://docs.followupboss.com/reference

// ── shared provider shapes ─────────────────────────────────────────────────

const UserGroupMembershipSchema = z
	.object({
		id: IdSchema.nullish(),
		name: z.string().nullish(),
	})
	.loose();

const GroupUserSchema = z
	.object({
		id: IdSchema.nullish(),
		name: z.string().nullish(),
		firstName: z.string().nullish(),
		lastName: z.string().nullish(),
		role: z.string().nullish(),
		pauseLeadDistribution: FubFlagSchema.nullish(),
	})
	.loose();

// unknown: the limit buckets are keyed per endpoint (`GET.people` and similar),
// so each map passes through as sent.
const RateLimitCurrentLimitsSchema = z
	.object({
		across_all_accounts: z.record(z.string(), z.unknown()).nullish(),
		per_account: z.record(z.string(), z.unknown()).nullish(),
	})
	.loose();

// ── users ──────────────────────────────────────────────────────────────────

export const UserSchema = z
	.object({
		id: IdSchema.nullish(),
		created: z.string().nullish(),
		updated: z.string().nullish(),
		name: z.string().nullish(),
		firstName: z.string().nullish(),
		lastName: z.string().nullish(),
		email: z.string().nullish(),
		phone: z.string().nullish(),
		role: z.string().nullish(),
		status: z.string().nullish(),
		timezone: z.string().nullish(),
		beta: FubFlagSchema.nullish(),
		// unknown: the docs example shows `picture` as an empty array, so its
		// shape is provider defined and passes through as sent.
		picture: z.unknown().nullish(),
		pauseLeadDistribution: FubFlagSchema.nullish(),
		lastSeenIos: z.string().nullish(),
		lastSeenAndroid: z.string().nullish(),
		lastSeenFub2: z.string().nullish(),
		canExport: FubFlagSchema.nullish(),
		canCreateApiKeys: FubFlagSchema.nullish(),
		isOwner: FubFlagSchema.nullish(),
		groups: z.array(UserGroupMembershipSchema).nullish(),
		teamIds: z.array(z.number()).nullish(),
		teamLeaderOf: z.array(z.number()).nullish(),
		leadEmailAddress: z.string().nullish(),
	})
	.loose();

export type FollowUpBossUser = z.infer<typeof UserSchema>;

const UsersListInputSchema = ListQuerySchema.extend({
	sort: z
		.string()
		.optional()
		.describe(
			'Sort by `id`, `name` or `created`, optionally prefixed with `-` for descending.',
		),
	role: z
		.string()
		.optional()
		.describe('Find users by role, e.g. `Broker`, `Agent` or `Lender`.'),
	name: z
		.string()
		.optional()
		.describe('Exact full-name match; no partial matching.'),
	email: z.string().optional(),
	fields: z
		.string()
		.optional()
		.describe(
			'Comma separated fields to return (e.g. `id,name`), or `allFields`.',
		),
	includeDeleted: z.boolean().optional(),
});

export type UsersListInput = z.infer<typeof UsersListInputSchema>;

const UsersListResponseSchema = z
	.object({
		users: z.array(UserSchema),
		_metadata: FubMetadataSchema.nullish(),
	})
	.loose();

export type UsersListResponse = z.infer<typeof UsersListResponseSchema>;

const UsersGetInputSchema = z.object({
	id: IdSchema.describe('The user ID.'),
});

export type UsersGetInput = z.infer<typeof UsersGetInputSchema>;

const UsersGetResponseSchema = UserSchema;

export type UsersGetResponse = z.infer<typeof UsersGetResponseSchema>;

const UsersDeleteInputSchema = z.object({
	id: IdSchema.describe('The user ID to delete.'),
	assignTo: IdSchema.describe(
		'ID of another user to reassign the deleted user’s leads to.',
	),
});

export type UsersDeleteInput = z.infer<typeof UsersDeleteInputSchema>;

const UsersDeleteResponseSchema = DeletedResponseSchema;

export type UsersDeleteResponse = z.infer<typeof UsersDeleteResponseSchema>;

// ── teams ──────────────────────────────────────────────────────────────────

export const TeamSchema = z
	.object({
		id: IdSchema.nullish(),
		name: z.string().nullish(),
		userIds: z.array(z.number()).nullish(),
		leaderIds: z.array(z.number()).nullish(),
	})
	.loose();

export type FollowUpBossTeam = z.infer<typeof TeamSchema>;

const TeamsListInputSchema = ListQuerySchema;

export type TeamsListInput = z.infer<typeof TeamsListInputSchema>;

const TeamsListResponseSchema = z
	.object({
		teams: z.array(TeamSchema),
		_metadata: FubMetadataSchema.nullish(),
	})
	.loose();

export type TeamsListResponse = z.infer<typeof TeamsListResponseSchema>;

const TeamsCreateInputSchema = z.object({
	name: z.string().describe('The name of the team.'),
	userIds: z
		.array(z.number().int())
		.describe('User IDs that will be members of this team.'),
	leaderIds: z
		.array(z.number().int())
		.optional()
		.describe('The complete list of team leaders.'),
});

export type TeamsCreateInput = z.infer<typeof TeamsCreateInputSchema>;

// FUB answers 200 (not 201) with the created team.
const TeamsCreateResponseSchema = TeamSchema;

export type TeamsCreateResponse = z.infer<typeof TeamsCreateResponseSchema>;

const TeamsGetInputSchema = z.object({
	id: IdSchema.describe('The team ID.'),
});

export type TeamsGetInput = z.infer<typeof TeamsGetInputSchema>;

const TeamsGetResponseSchema = TeamSchema;

export type TeamsGetResponse = z.infer<typeof TeamsGetResponseSchema>;

const TeamsUpdateInputSchema = z.object({
	id: IdSchema.describe('The team ID.'),
	name: z.string().optional(),
	userIds: z
		.array(z.number().int())
		.optional()
		.describe('The complete list of members of this team.'),
	leaderIds: z
		.array(z.number().int())
		.optional()
		.describe('The complete list of team leaders.'),
});

export type TeamsUpdateInput = z.infer<typeof TeamsUpdateInputSchema>;

const TeamsUpdateResponseSchema = TeamSchema;

export type TeamsUpdateResponse = z.infer<typeof TeamsUpdateResponseSchema>;

const TeamsDeleteInputSchema = z.object({
	id: IdSchema.describe('The team ID to delete.'),
	moveToTeamId: z
		.number()
		.int()
		.optional()
		.describe(
			'Merge before deleting: all members of this team join the target team first.',
		),
});

export type TeamsDeleteInput = z.infer<typeof TeamsDeleteInputSchema>;

const TeamsDeleteResponseSchema = DeletedResponseSchema;

export type TeamsDeleteResponse = z.infer<typeof TeamsDeleteResponseSchema>;

// ── groups ─────────────────────────────────────────────────────────────────

export const GROUP_DISTRIBUTIONS = ['first-to-claim', 'round-robin'] as const;
export const GROUP_TYPES = ['Agent', 'Lender'] as const;

export const GroupSchema = z
	.object({
		id: IdSchema.nullish(),
		name: z.string().nullish(),
		type: z.string().nullish(),
		distribution: z.string().nullish(),
		claimWindow: z.number().nullish(),
		nextRoundRobinUser: z.number().nullish(),
		isPrimary: FubFlagSchema.nullish(),
		defaultUserId: z.number().nullish(),
		defaultPondId: z.number().nullish(),
		defaultGroupId: z.number().nullish(),
		users: z.array(GroupUserSchema).nullish(),
	})
	.loose();

export type FollowUpBossGroup = z.infer<typeof GroupSchema>;

const GroupsListInputSchema = ListQuerySchema.extend({
	type: z
		.enum(GROUP_TYPES)
		.optional()
		.describe(
			'`Agent` groups allow admins and agents and `Lender` groups allow lender role users.',
		),
	sort: z
		.string()
		.optional()
		.describe(
			'Sort by `id` or `name`, optionally prefixed with `-` for descending.',
		),
});

export type GroupsListInput = z.infer<typeof GroupsListInputSchema>;

const GroupsResponseSchema = z
	.object({
		groups: z.array(GroupSchema),
		_metadata: FubMetadataSchema.nullish(),
	})
	.loose();

export type GroupsListResponse = z.infer<typeof GroupsResponseSchema>;

// The create and update bodies are the same document; both require `name` and
// the complete `users` list per the published contract.
const GroupBodySchema = {
	name: z.string().describe('The name of the group.'),
	distribution: z
		.enum(GROUP_DISTRIBUTIONS)
		.optional()
		.describe(
			'Distribution model; Lender groups cannot be set to `first-to-claim`.',
		),
	users: z
		.array(z.number().int())
		.describe('User IDs that will be members of this group.'),
	type: z.enum(GROUP_TYPES).optional(),
	claimWindow: z
		.number()
		.int()
		.min(60)
		.max(1800)
		.optional()
		.describe(
			'Seconds a first-to-claim lead waits before reassignment; default 1800, minimum 60, maximum 1800.',
		),
	defaultGroupId: z
		.number()
		.int()
		.optional()
		.describe('Group that receives unclaimed first-to-claim leads.'),
	defaultPondId: z
		.number()
		.int()
		.optional()
		.describe('Pond that receives unclaimed first-to-claim leads.'),
	defaultUserId: z
		.number()
		.int()
		.optional()
		.describe('User who receives unclaimed first-to-claim leads.'),
};

const GroupsCreateInputSchema = z.object(GroupBodySchema);

export type GroupsCreateInput = z.infer<typeof GroupsCreateInputSchema>;

// FUB answers 201 with the created group.
const GroupsCreateResponseSchema = GroupSchema;

export type GroupsCreateResponse = z.infer<typeof GroupsCreateResponseSchema>;

const GroupsGetInputSchema = z.object({
	id: IdSchema.describe('The group ID.'),
});

export type GroupsGetInput = z.infer<typeof GroupsGetInputSchema>;

const GroupsGetResponseSchema = GroupSchema;

export type GroupsGetResponse = z.infer<typeof GroupsGetResponseSchema>;

const GroupsUpdateInputSchema = z.object({
	id: IdSchema.describe('The group ID.'),
	...GroupBodySchema,
});

export type GroupsUpdateInput = z.infer<typeof GroupsUpdateInputSchema>;

const GroupsUpdateResponseSchema = GroupSchema;

export type GroupsUpdateResponse = z.infer<typeof GroupsUpdateResponseSchema>;

const GroupsDeleteInputSchema = z.object({
	id: IdSchema.describe('The group ID to delete.'),
});

export type GroupsDeleteInput = z.infer<typeof GroupsDeleteInputSchema>;

const GroupsDeleteResponseSchema = DeletedResponseSchema;

export type GroupsDeleteResponse = z.infer<typeof GroupsDeleteResponseSchema>;

const GroupsRoundRobinInputSchema = GroupsListInputSchema;

export type GroupsRoundRobinInput = z.infer<typeof GroupsRoundRobinInputSchema>;

const GroupsRoundRobinResponseSchema = GroupsResponseSchema;

export type GroupsRoundRobinResponse = z.infer<
	typeof GroupsRoundRobinResponseSchema
>;

// ── ponds ──────────────────────────────────────────────────────────────────

export const PondSchema = z
	.object({
		id: IdSchema.nullish(),
		name: z.string().nullish(),
		userId: z.number().nullish(),
		userIds: z.array(z.number()).nullish(),
	})
	.loose();

export type FollowUpBossPond = z.infer<typeof PondSchema>;

const PondsListInputSchema = ListQuerySchema;

export type PondsListInput = z.infer<typeof PondsListInputSchema>;

const PondsListResponseSchema = z
	.object({
		ponds: z.array(PondSchema),
		_metadata: FubMetadataSchema.nullish(),
	})
	.loose();

export type PondsListResponse = z.infer<typeof PondsListResponseSchema>;

const PondsCreateInputSchema = z.object({
	name: z.string().describe('The name of the pond to create.'),
	userId: IdSchema.describe('The Pond Lead Agent.'),
	userIds: z
		.array(z.number().int())
		.describe('IDs of all users to add as members of the pond.'),
});

export type PondsCreateInput = z.infer<typeof PondsCreateInputSchema>;

const PondsCreateResponseSchema = PondSchema;

export type PondsCreateResponse = z.infer<typeof PondsCreateResponseSchema>;

const PondsGetInputSchema = z.object({
	id: IdSchema.describe('The pond ID.'),
});

export type PondsGetInput = z.infer<typeof PondsGetInputSchema>;

const PondsGetResponseSchema = PondSchema;

export type PondsGetResponse = z.infer<typeof PondsGetResponseSchema>;

// The published PUT body types `userId` and `userIds` as strings while the
// create body and every response use integers, so the integer forms are kept
// here (docs bug).
const PondsUpdateInputSchema = z.object({
	id: IdSchema.describe('The pond ID.'),
	name: z.string().optional(),
	// The published PUT types userId/userIds as strings while every other
	// surface uses integers; both spellings are accepted and integers kept.
	userId: z.union([IdSchema, z.string().regex(/^\d+$/)]).optional(),
	userIds: z.array(z.union([IdSchema, z.string().regex(/^\d+$/)])).optional(),
});

export type PondsUpdateInput = z.infer<typeof PondsUpdateInputSchema>;

const PondsUpdateResponseSchema = PondSchema;

export type PondsUpdateResponse = z.infer<typeof PondsUpdateResponseSchema>;

const PondsDeleteInputSchema = z.object({
	id: IdSchema.describe('The pond ID to delete.'),
	assignTo: IdSchema.describe(
		'Agent who receives the contacts currently in this pond after it is deleted.',
	),
});

export type PondsDeleteInput = z.infer<typeof PondsDeleteInputSchema>;

const PondsDeleteResponseSchema = DeletedResponseSchema;

export type PondsDeleteResponse = z.infer<typeof PondsDeleteResponseSchema>;

// ── rate limit ─────────────────────────────────────────────────────────────

// The spec marks `X-System` and `X-System-Key` as required header parameters,
// but those are the client's system identification headers rather than
// endpoint inputs, so the input is empty; unregistered systems get 403.
const RateLimitLimitsInputSchema = z.object({});

export type RateLimitLimitsInput = z.infer<typeof RateLimitLimitsInputSchema>;

const RateLimitLimitsResponseSchema = z
	.object({
		system: z.string().nullish(),
		current_limits: RateLimitCurrentLimitsSchema.nullish(),
	})
	.loose();

export type RateLimitLimitsResponse = z.infer<
	typeof RateLimitLimitsResponseSchema
>;

const RateLimitUsageInputSchema = z.object({});

export type RateLimitUsageInput = z.infer<typeof RateLimitUsageInputSchema>;

// Both rate limit answers carry the per-endpoint limit maps, so the unknown
// blocks stay open and only the documented scalars are declared.
export const RateLimitUsageSchema = z
	.object({
		system: z.string().nullish(),
		period: z.string().nullish(),
		usage: z
			.object({
				total_requests: z.number().nullish(),
				rate_limited_requests: z.number().nullish(),
				rate_limit_percentage: z.number().nullish(),
				peak_hour: z.string().nullish(),
				current_limits: RateLimitCurrentLimitsSchema.nullish(),
			})
			.loose()
			.nullish(),
		current_limits: RateLimitCurrentLimitsSchema.nullish(),
	})
	.loose();

export type FollowUpBossRateLimitUsage = z.infer<typeof RateLimitUsageSchema>;

const RateLimitUsageResponseSchema = RateLimitUsageSchema;

export type RateLimitUsageResponse = z.infer<
	typeof RateLimitUsageResponseSchema
>;

// ── type maps ──────────────────────────────────────────────────────────────

export type AdminEndpointInputs = {
	usersList: UsersListInput;
	usersGet: UsersGetInput;
	usersDelete: UsersDeleteInput;
	teamsList: TeamsListInput;
	teamsCreate: TeamsCreateInput;
	teamsGet: TeamsGetInput;
	teamsUpdate: TeamsUpdateInput;
	teamsDelete: TeamsDeleteInput;
	groupsList: GroupsListInput;
	groupsCreate: GroupsCreateInput;
	groupsGet: GroupsGetInput;
	groupsUpdate: GroupsUpdateInput;
	groupsDelete: GroupsDeleteInput;
	groupsRoundRobin: GroupsRoundRobinInput;
	pondsList: PondsListInput;
	pondsCreate: PondsCreateInput;
	pondsGet: PondsGetInput;
	pondsUpdate: PondsUpdateInput;
	pondsDelete: PondsDeleteInput;
	rateLimitLimits: RateLimitLimitsInput;
	rateLimitUsage: RateLimitUsageInput;
};

export type AdminEndpointOutputs = {
	usersList: UsersListResponse;
	usersGet: UsersGetResponse;
	usersDelete: UsersDeleteResponse;
	teamsList: TeamsListResponse;
	teamsCreate: TeamsCreateResponse;
	teamsGet: TeamsGetResponse;
	teamsUpdate: TeamsUpdateResponse;
	teamsDelete: TeamsDeleteResponse;
	groupsList: GroupsListResponse;
	groupsCreate: GroupsCreateResponse;
	groupsGet: GroupsGetResponse;
	groupsUpdate: GroupsUpdateResponse;
	groupsDelete: GroupsDeleteResponse;
	groupsRoundRobin: GroupsRoundRobinResponse;
	pondsList: PondsListResponse;
	pondsCreate: PondsCreateResponse;
	pondsGet: PondsGetResponse;
	pondsUpdate: PondsUpdateResponse;
	pondsDelete: PondsDeleteResponse;
	rateLimitLimits: RateLimitLimitsResponse;
	rateLimitUsage: RateLimitUsageResponse;
};

export const AdminInputSchemas = {
	usersList: UsersListInputSchema,
	usersGet: UsersGetInputSchema,
	usersDelete: UsersDeleteInputSchema,
	teamsList: TeamsListInputSchema,
	teamsCreate: TeamsCreateInputSchema,
	teamsGet: TeamsGetInputSchema,
	teamsUpdate: TeamsUpdateInputSchema,
	teamsDelete: TeamsDeleteInputSchema,
	groupsList: GroupsListInputSchema,
	groupsCreate: GroupsCreateInputSchema,
	groupsGet: GroupsGetInputSchema,
	groupsUpdate: GroupsUpdateInputSchema,
	groupsDelete: GroupsDeleteInputSchema,
	groupsRoundRobin: GroupsRoundRobinInputSchema,
	pondsList: PondsListInputSchema,
	pondsCreate: PondsCreateInputSchema,
	pondsGet: PondsGetInputSchema,
	pondsUpdate: PondsUpdateInputSchema,
	pondsDelete: PondsDeleteInputSchema,
	rateLimitLimits: RateLimitLimitsInputSchema,
	rateLimitUsage: RateLimitUsageInputSchema,
} as const;

export const AdminOutputSchemas = {
	usersList: UsersListResponseSchema,
	usersGet: UsersGetResponseSchema,
	usersDelete: UsersDeleteResponseSchema,
	teamsList: TeamsListResponseSchema,
	teamsCreate: TeamsCreateResponseSchema,
	teamsGet: TeamsGetResponseSchema,
	teamsUpdate: TeamsUpdateResponseSchema,
	teamsDelete: TeamsDeleteResponseSchema,
	groupsList: GroupsResponseSchema,
	groupsCreate: GroupsCreateResponseSchema,
	groupsGet: GroupsGetResponseSchema,
	groupsUpdate: GroupsUpdateResponseSchema,
	groupsDelete: GroupsDeleteResponseSchema,
	groupsRoundRobin: GroupsRoundRobinResponseSchema,
	pondsList: PondsListResponseSchema,
	pondsCreate: PondsCreateResponseSchema,
	pondsGet: PondsGetResponseSchema,
	pondsUpdate: PondsUpdateResponseSchema,
	pondsDelete: PondsDeleteResponseSchema,
	rateLimitLimits: RateLimitLimitsResponseSchema,
	rateLimitUsage: RateLimitUsageResponseSchema,
} as const;
