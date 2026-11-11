import type {
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import {
	Accounts,
	Attributes,
	Content,
	ContentSessions,
	Events,
	Groups,
	Memberships,
	Users,
	WebhookSubscriptions,
} from './endpoints';
import type {
	UserflowEndpointInputs,
	UserflowEndpointOutputs,
} from './endpoints/types';
import {
	UserflowEndpointInputSchemas,
	UserflowEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { UserflowSchema } from './schema';

/** Which regional Userflow host to call. Environment keys are region-scoped. */
export type UserflowRegion = 'us' | 'eu';

export type UserflowPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/** A Users API environment key (`ak_...`). */
	key?: string;
	/**
	 * A personal key (`pak_...`) for the Accounts API. Members and invites need one;
	 * an environment key is refused there with `invalid_pak`.
	 */
	personalKey?: string;
	/**
	 * The region the environment lives in. An EU environment's Users API lives on
	 * `api.eu.userflow.com`; the Accounts API is on `api.userflow.com` in every
	 * region, and the client picks the host per operation.
	 */
	region?: UserflowRegion;
	hooks?: InternalUserflowPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof userflowEndpointsNested>;
};

/**
 * True for the operations the Accounts API serves. They are the ones under the
 * `accounts`, `members` and `invites` groups, and they need a personal key.
 */
export function isAccountsOperation(shortPath: string | undefined): boolean {
	if (!shortPath) return false;
	return /^(accounts|members|invites)\./.test(shortPath);
}

export type UserflowContext = CorsairPluginContext<
	typeof UserflowSchema,
	UserflowPluginOptions
>;

export type UserflowKeyBuilderContext =
	KeyBuilderContext<UserflowPluginOptions>;

export type UserflowBoundEndpoints = BindEndpoints<
	typeof userflowEndpointsNested
>;

type UserflowEndpoint<K extends keyof UserflowEndpointOutputs> =
	CorsairEndpoint<
		UserflowContext,
		UserflowEndpointInputs[K],
		UserflowEndpointOutputs[K]
	>;

export type UserflowEndpoints = {
	usersUpsert: UserflowEndpoint<'usersUpsert'>;
	usersGet: UserflowEndpoint<'usersGet'>;
	usersDelete: UserflowEndpoint<'usersDelete'>;
	usersList: UserflowEndpoint<'usersList'>;
	groupsUpsert: UserflowEndpoint<'groupsUpsert'>;
	groupsGet: UserflowEndpoint<'groupsGet'>;
	groupsDelete: UserflowEndpoint<'groupsDelete'>;
	groupsList: UserflowEndpoint<'groupsList'>;
	membershipsRemove: UserflowEndpoint<'membershipsRemove'>;
	eventsTrack: UserflowEndpoint<'eventsTrack'>;
	contentGet: UserflowEndpoint<'contentGet'>;
	contentList: UserflowEndpoint<'contentList'>;
	contentVersionsGet: UserflowEndpoint<'contentVersionsGet'>;
	contentVersionsList: UserflowEndpoint<'contentVersionsList'>;
	contentSessionsGet: UserflowEndpoint<'contentSessionsGet'>;
	contentSessionsEnd: UserflowEndpoint<'contentSessionsEnd'>;
	contentSessionsDelete: UserflowEndpoint<'contentSessionsDelete'>;
	contentSessionsList: UserflowEndpoint<'contentSessionsList'>;
	attributesList: UserflowEndpoint<'attributesList'>;
	eventDefinitionsList: UserflowEndpoint<'eventDefinitionsList'>;
	webhookSubscriptionsCreate: UserflowEndpoint<'webhookSubscriptionsCreate'>;
	webhookSubscriptionsGet: UserflowEndpoint<'webhookSubscriptionsGet'>;
	webhookSubscriptionsUpdate: UserflowEndpoint<'webhookSubscriptionsUpdate'>;
	webhookSubscriptionsDelete: UserflowEndpoint<'webhookSubscriptionsDelete'>;
	webhookSubscriptionsList: UserflowEndpoint<'webhookSubscriptionsList'>;
	accountsList: UserflowEndpoint<'accountsList'>;
	accountsGet: UserflowEndpoint<'accountsGet'>;
	membersList: UserflowEndpoint<'membersList'>;
	membersGet: UserflowEndpoint<'membersGet'>;
	membersUpdate: UserflowEndpoint<'membersUpdate'>;
	membersRemove: UserflowEndpoint<'membersRemove'>;
	invitesList: UserflowEndpoint<'invitesList'>;
	invitesGet: UserflowEndpoint<'invitesGet'>;
	invitesCreate: UserflowEndpoint<'invitesCreate'>;
	invitesDelete: UserflowEndpoint<'invitesDelete'>;
};

const userflowEndpointsNested = {
	users: {
		upsert: Users.upsert,
		get: Users.get,
		delete: Users.remove,
		list: Users.list,
	},
	groups: {
		upsert: Groups.upsert,
		get: Groups.get,
		delete: Groups.remove,
		list: Groups.list,
	},
	memberships: {
		remove: Memberships.remove,
	},
	events: {
		track: Events.track,
	},
	content: {
		get: Content.get,
		list: Content.list,
		getVersion: Content.getVersion,
		listVersions: Content.listVersions,
	},
	contentSessions: {
		get: ContentSessions.get,
		end: ContentSessions.end,
		delete: ContentSessions.remove,
		list: ContentSessions.list,
	},
	attributes: {
		list: Attributes.listAttributes,
	},
	eventDefinitions: {
		list: Attributes.listEvents,
	},
	webhookSubscriptions: {
		create: WebhookSubscriptions.create,
		get: WebhookSubscriptions.get,
		update: WebhookSubscriptions.update,
		delete: WebhookSubscriptions.remove,
		list: WebhookSubscriptions.list,
	},
	accounts: {
		list: Accounts.listAccounts,
		get: Accounts.getAccount,
	},
	members: {
		list: Accounts.listMembers,
		get: Accounts.getMember,
		update: Accounts.updateMember,
		remove: Accounts.removeMember,
	},
	invites: {
		list: Accounts.listInvites,
		get: Accounts.getInvite,
		create: Accounts.createInvite,
		delete: Accounts.deleteInvite,
	},
} as const;

export const userflowEndpointSchemas = {
	'users.upsert': {
		input: UserflowEndpointInputSchemas.usersUpsert,
		output: UserflowEndpointOutputSchemas.usersUpsert,
	},
	'users.get': {
		input: UserflowEndpointInputSchemas.usersGet,
		output: UserflowEndpointOutputSchemas.usersGet,
	},
	'users.delete': {
		input: UserflowEndpointInputSchemas.usersDelete,
		output: UserflowEndpointOutputSchemas.usersDelete,
	},
	'users.list': {
		input: UserflowEndpointInputSchemas.usersList,
		output: UserflowEndpointOutputSchemas.usersList,
	},
	'groups.upsert': {
		input: UserflowEndpointInputSchemas.groupsUpsert,
		output: UserflowEndpointOutputSchemas.groupsUpsert,
	},
	'groups.get': {
		input: UserflowEndpointInputSchemas.groupsGet,
		output: UserflowEndpointOutputSchemas.groupsGet,
	},
	'groups.delete': {
		input: UserflowEndpointInputSchemas.groupsDelete,
		output: UserflowEndpointOutputSchemas.groupsDelete,
	},
	'groups.list': {
		input: UserflowEndpointInputSchemas.groupsList,
		output: UserflowEndpointOutputSchemas.groupsList,
	},
	'memberships.remove': {
		input: UserflowEndpointInputSchemas.membershipsRemove,
		output: UserflowEndpointOutputSchemas.membershipsRemove,
	},
	'events.track': {
		input: UserflowEndpointInputSchemas.eventsTrack,
		output: UserflowEndpointOutputSchemas.eventsTrack,
	},
	'content.get': {
		input: UserflowEndpointInputSchemas.contentGet,
		output: UserflowEndpointOutputSchemas.contentGet,
	},
	'content.list': {
		input: UserflowEndpointInputSchemas.contentList,
		output: UserflowEndpointOutputSchemas.contentList,
	},
	'content.getVersion': {
		input: UserflowEndpointInputSchemas.contentVersionsGet,
		output: UserflowEndpointOutputSchemas.contentVersionsGet,
	},
	'content.listVersions': {
		input: UserflowEndpointInputSchemas.contentVersionsList,
		output: UserflowEndpointOutputSchemas.contentVersionsList,
	},
	'contentSessions.get': {
		input: UserflowEndpointInputSchemas.contentSessionsGet,
		output: UserflowEndpointOutputSchemas.contentSessionsGet,
	},
	'contentSessions.end': {
		input: UserflowEndpointInputSchemas.contentSessionsEnd,
		output: UserflowEndpointOutputSchemas.contentSessionsEnd,
	},
	'contentSessions.delete': {
		input: UserflowEndpointInputSchemas.contentSessionsDelete,
		output: UserflowEndpointOutputSchemas.contentSessionsDelete,
	},
	'contentSessions.list': {
		input: UserflowEndpointInputSchemas.contentSessionsList,
		output: UserflowEndpointOutputSchemas.contentSessionsList,
	},
	'attributes.list': {
		input: UserflowEndpointInputSchemas.attributesList,
		output: UserflowEndpointOutputSchemas.attributesList,
	},
	'eventDefinitions.list': {
		input: UserflowEndpointInputSchemas.eventDefinitionsList,
		output: UserflowEndpointOutputSchemas.eventDefinitionsList,
	},
	'webhookSubscriptions.create': {
		input: UserflowEndpointInputSchemas.webhookSubscriptionsCreate,
		output: UserflowEndpointOutputSchemas.webhookSubscriptionsCreate,
	},
	'webhookSubscriptions.get': {
		input: UserflowEndpointInputSchemas.webhookSubscriptionsGet,
		output: UserflowEndpointOutputSchemas.webhookSubscriptionsGet,
	},
	'webhookSubscriptions.update': {
		input: UserflowEndpointInputSchemas.webhookSubscriptionsUpdate,
		output: UserflowEndpointOutputSchemas.webhookSubscriptionsUpdate,
	},
	'webhookSubscriptions.delete': {
		input: UserflowEndpointInputSchemas.webhookSubscriptionsDelete,
		output: UserflowEndpointOutputSchemas.webhookSubscriptionsDelete,
	},
	'webhookSubscriptions.list': {
		input: UserflowEndpointInputSchemas.webhookSubscriptionsList,
		output: UserflowEndpointOutputSchemas.webhookSubscriptionsList,
	},
	'accounts.list': {
		input: UserflowEndpointInputSchemas.accountsList,
		output: UserflowEndpointOutputSchemas.accountsList,
	},
	'accounts.get': {
		input: UserflowEndpointInputSchemas.accountsGet,
		output: UserflowEndpointOutputSchemas.accountsGet,
	},
	'members.list': {
		input: UserflowEndpointInputSchemas.membersList,
		output: UserflowEndpointOutputSchemas.membersList,
	},
	'members.get': {
		input: UserflowEndpointInputSchemas.membersGet,
		output: UserflowEndpointOutputSchemas.membersGet,
	},
	'members.update': {
		input: UserflowEndpointInputSchemas.membersUpdate,
		output: UserflowEndpointOutputSchemas.membersUpdate,
	},
	'members.remove': {
		input: UserflowEndpointInputSchemas.membersRemove,
		output: UserflowEndpointOutputSchemas.membersRemove,
	},
	'invites.list': {
		input: UserflowEndpointInputSchemas.invitesList,
		output: UserflowEndpointOutputSchemas.invitesList,
	},
	'invites.get': {
		input: UserflowEndpointInputSchemas.invitesGet,
		output: UserflowEndpointOutputSchemas.invitesGet,
	},
	'invites.create': {
		input: UserflowEndpointInputSchemas.invitesCreate,
		output: UserflowEndpointOutputSchemas.invitesCreate,
	},
	'invites.delete': {
		input: UserflowEndpointInputSchemas.invitesDelete,
		output: UserflowEndpointOutputSchemas.invitesDelete,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof userflowEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const userflowEndpointMeta = {
	'users.upsert': {
		riskLevel: 'write',
		description:
			'Create or update a user by your own id, merging the attributes sent and optionally syncing their groups or memberships',
	},
	'users.get': {
		riskLevel: 'read',
		description:
			'Read one user with their attributes, optionally expanding their groups or memberships',
	},
	'users.delete': {
		riskLevel: 'destructive',
		description:
			'Permanently delete a user with their attributes, memberships, events and flow history; groups they were in stay',
	},
	'users.list': {
		riskLevel: 'read',
		description:
			'List users, filtered by email, group, segment or a condition expression, with cursor paging',
	},
	'groups.upsert': {
		riskLevel: 'write',
		description:
			'Create or update a group or company by your own id, merging the attributes sent',
	},
	'groups.get': {
		riskLevel: 'read',
		description:
			'Read one group with its attributes, optionally expanding its users or memberships',
	},
	'groups.delete': {
		riskLevel: 'destructive',
		description:
			'Permanently delete a group with its attributes, memberships and events; the users in it stay',
	},
	'groups.list': {
		riskLevel: 'read',
		description: 'List groups, optionally filtered by a condition expression',
	},
	'memberships.remove': {
		riskLevel: 'write',
		description:
			'Remove one user from one group, leaving both the user and the group in place',
	},
	'events.track': {
		riskLevel: 'write',
		description:
			'Record an event against a user, a group or both, optionally with attributes and a past timestamp',
	},
	'content.get': {
		riskLevel: 'read',
		description:
			'Read one flow, checklist, launcher or other content object with its labels and version ids',
	},
	'content.list': {
		riskLevel: 'read',
		description: 'List content objects, filtered by type',
	},
	'content.getVersion': {
		riskLevel: 'read',
		description:
			"Read one content version, which holds the flow's questions or the checklist's tasks",
	},
	'content.listVersions': {
		riskLevel: 'read',
		description:
			'List the versions of one content object; Userflow cannot list versions across content',
	},
	'contentSessions.get': {
		riskLevel: 'read',
		description:
			'Read one content session with its progress, completion and optionally its survey answers',
	},
	'contentSessions.end': {
		riskLevel: 'write',
		description:
			'End an active content session for a user; idempotent, and the session keeps its answers',
	},
	'contentSessions.delete': {
		riskLevel: 'destructive',
		description:
			'Permanently delete a content session with its progress and survey answers',
	},
	'contentSessions.list': {
		riskLevel: 'read',
		description:
			'List content sessions, filtered by content or user, to see who has seen or completed what',
	},
	'attributes.list': {
		riskLevel: 'read',
		description:
			'List the attribute definitions Userflow has recorded, filtered by scope or by the events that use them',
	},
	'eventDefinitions.list': {
		riskLevel: 'read',
		description: 'List the event definitions Userflow has recorded',
	},
	'webhookSubscriptions.create': {
		riskLevel: 'write',
		description:
			'Subscribe a URL to user, group and event topics; the response is the only place the signing secret is shown',
	},
	'webhookSubscriptions.get': {
		riskLevel: 'read',
		description: 'Read one webhook subscription; the secret is not included',
	},
	'webhookSubscriptions.update': {
		riskLevel: 'write',
		description:
			'Change a subscription url, topics or api_version, or disable it without deleting it',
	},
	'webhookSubscriptions.delete': {
		riskLevel: 'destructive',
		description:
			'Permanently delete a webhook subscription; prefer update with disabled to pause delivery',
	},
	'webhookSubscriptions.list': {
		riskLevel: 'read',
		description: 'List webhook subscriptions',
	},
	'accounts.list': {
		riskLevel: 'read',
		description:
			'List the accounts your personal key is a member of; needs a personal key, not an environment key',
	},
	'accounts.get': {
		riskLevel: 'read',
		description:
			'Read one account, optionally expanding its environments with their region and primary flag',
	},
	'members.list': {
		riskLevel: 'read',
		description: 'List the members of an account, filtered by email or role',
	},
	'members.get': {
		riskLevel: 'read',
		description:
			'Read one member of an account with their role and permissions',
	},
	'members.update': {
		riskLevel: 'write',
		description:
			"Change a member's role or replace their permissions within an account",
	},
	'members.remove': {
		riskLevel: 'destructive',
		description: 'Remove a member from an account, revoking their access to it',
	},
	'invites.list': {
		riskLevel: 'read',
		description: 'List pending and expired invites for an account',
	},
	'invites.get': {
		riskLevel: 'read',
		description: 'Read one invite for an account',
	},
	'invites.create': {
		riskLevel: 'write',
		description:
			'Send an email invite to join an account with a role and optional permissions; a pending invite or existing member makes it fail',
	},
	'invites.delete': {
		riskLevel: 'destructive',
		description: 'Delete a pending invite, so its link stops working',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof userflowEndpointsNested>;

export type BaseUserflowPlugin<T extends UserflowPluginOptions> = CorsairPlugin<
	'userflow',
	typeof UserflowSchema,
	typeof userflowEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalUserflowPlugin = BaseUserflowPlugin<UserflowPluginOptions>;

export type ExternalUserflowPlugin<T extends UserflowPluginOptions> =
	BaseUserflowPlugin<T>;

export function userflow<const T extends UserflowPluginOptions>(
	incomingOptions: UserflowPluginOptions & T = {} as UserflowPluginOptions & T,
): ExternalUserflowPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'userflow',
		schema: UserflowSchema,
		options: options,
		hooks: options.hooks,
		endpoints: userflowEndpointsNested,
		webhooks: {},
		endpointMeta: userflowEndpointMeta,
		endpointSchemas: userflowEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: UserflowKeyBuilderContext, source) => {
			if (source !== 'endpoint') {
				throw new AuthMissingError('userflow', ctx.authType ?? 'api_key');
			}

			const needsPersonal = isAccountsOperation(ctx.meteredOperationId);

			if (needsPersonal) {
				if (options.personalKey) return options.personalKey;
				// A plugin without an authConfig field for a second key has one slot, so
				// the personal key comes from the option or the stored key as a whole.
				if (ctx.authType === 'api_key') {
					const stored = await ctx.keys.get_api_key();
					if (stored) return stored;
				}
				throw new AuthMissingError('userflow', ctx.authType ?? 'api_key');
			}

			if (options.key) return options.key;
			if (ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('userflow', ctx.authType ?? 'api_key');
		},
	} satisfies InternalUserflowPlugin;
}

export {
	describeKeyType,
	USERFLOW_API_BASE,
	USERFLOW_API_VERSION,
	USERFLOW_EU_API_BASE,
	UserflowAPIError,
} from './client';

export type {
	AccountsGetInput,
	AccountsGetResponse,
	AccountsListInput,
	AccountsListResponse,
	AttributesListInput,
	AttributesListResponse,
	ContentGetInput,
	ContentGetResponse,
	ContentListInput,
	ContentListResponse,
	ContentSessionsDeleteInput,
	ContentSessionsDeleteResponse,
	ContentSessionsEndInput,
	ContentSessionsEndResponse,
	ContentSessionsGetInput,
	ContentSessionsGetResponse,
	ContentSessionsListInput,
	ContentSessionsListResponse,
	ContentVersionsGetInput,
	ContentVersionsGetResponse,
	ContentVersionsListInput,
	ContentVersionsListResponse,
	EventDefinitionsListInput,
	EventDefinitionsListResponse,
	EventsTrackInput,
	EventsTrackResponse,
	GroupsDeleteInput,
	GroupsDeleteResponse,
	GroupsGetInput,
	GroupsGetResponse,
	GroupsListInput,
	GroupsListResponse,
	GroupsUpsertInput,
	GroupsUpsertResponse,
	InvitesCreateInput,
	InvitesCreateResponse,
	InvitesDeleteInput,
	InvitesDeleteResponse,
	InvitesGetInput,
	InvitesGetResponse,
	InvitesListInput,
	InvitesListResponse,
	MembersGetInput,
	MembersGetResponse,
	MembershipsRemoveInput,
	MembershipsRemoveResponse,
	MembersListInput,
	MembersListResponse,
	MembersRemoveInput,
	MembersRemoveResponse,
	MembersUpdateInput,
	MembersUpdateResponse,
	UserflowAccount,
	UserflowAttributeDefinition,
	UserflowContent,
	UserflowContentSession,
	UserflowContentVersion,
	UserflowEndpointInputs,
	UserflowEndpointOutputs,
	UserflowEnvironment,
	UserflowEvent,
	UserflowEventDefinition,
	UserflowGroup,
	UserflowGroupMembership,
	UserflowInvite,
	UserflowMember,
	UserflowUser,
	UserflowWebhookSubscription,
	UsersDeleteInput,
	UsersDeleteResponse,
	UsersGetInput,
	UsersGetResponse,
	UsersListInput,
	UsersListResponse,
	UsersUpsertInput,
	UsersUpsertResponse,
	WebhookSubscriptionsCreateInput,
	WebhookSubscriptionsCreateResponse,
	WebhookSubscriptionsDeleteInput,
	WebhookSubscriptionsDeleteResponse,
	WebhookSubscriptionsGetInput,
	WebhookSubscriptionsGetResponse,
	WebhookSubscriptionsListInput,
	WebhookSubscriptionsListResponse,
	WebhookSubscriptionsUpdateInput,
	WebhookSubscriptionsUpdateResponse,
} from './endpoints/types';
