import type {
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { normalizeLoomioBaseUrl } from './client';
import {
	Comments,
	Discussions,
	Groups,
	Memberships,
	Polls,
	Reports,
	Search,
	Server,
	Threads,
	Webhooks,
} from './endpoints';
import type {
	LoomioEndpointInputs,
	LoomioEndpointOutputs,
} from './endpoints/types';
import {
	LoomioEndpointInputSchemas,
	LoomioEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { LoomioSchema } from './schema';

export type LoomioPluginOptions = {
	/**
	 * Installation origin for a self-hosted Loomio, e.g.
	 * `https://loomio.example.org`. Overrides the account's `base_url`;
	 * defaults to https://www.loomio.com.
	 */
	baseUrl?: string;
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalLoomioPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof loomioEndpointsNested>;
};

/**
 * Loomio is open source and self-hostable, so each account may store its
 * installation origin (`base_url`) next to the API key. Leave it empty for
 * loomio.com. The Server API (`server.*`) exists only on self-hosted installs
 * and takes the install's SERVER_API_KEY as the key.
 */
export const loomioAuthConfig = {
	api_key: {
		account: ['base_url'] as const,
	},
} as const satisfies PluginAuthConfig;

export type LoomioContext = CorsairPluginContext<
	typeof LoomioSchema,
	LoomioPluginOptions,
	undefined,
	typeof loomioAuthConfig
>;

export type LoomioKeyBuilderContext = KeyBuilderContext<
	LoomioPluginOptions,
	typeof loomioAuthConfig
>;

export type LoomioBoundEndpoints = BindEndpoints<typeof loomioEndpointsNested>;

type LoomioEndpoint<K extends keyof LoomioEndpointOutputs> = CorsairEndpoint<
	LoomioContext,
	LoomioEndpointInputs[K],
	LoomioEndpointOutputs[K]
>;

export type LoomioEndpoints = {
	groupsList: LoomioEndpoint<'groupsList'>;
	groupsGet: LoomioEndpoint<'groupsGet'>;
	discussionsList: LoomioEndpoint<'discussionsList'>;
	discussionsGet: LoomioEndpoint<'discussionsGet'>;
	discussionsCreate: LoomioEndpoint<'discussionsCreate'>;
	discussionsUpdate: LoomioEndpoint<'discussionsUpdate'>;
	discussionsDelete: LoomioEndpoint<'discussionsDelete'>;
	commentsCreate: LoomioEndpoint<'commentsCreate'>;
	commentsUpdate: LoomioEndpoint<'commentsUpdate'>;
	commentsDelete: LoomioEndpoint<'commentsDelete'>;
	threadsList: LoomioEndpoint<'threadsList'>;
	threadsGet: LoomioEndpoint<'threadsGet'>;
	threadsItems: LoomioEndpoint<'threadsItems'>;
	threadsMarkdown: LoomioEndpoint<'threadsMarkdown'>;
	pollsList: LoomioEndpoint<'pollsList'>;
	pollsGet: LoomioEndpoint<'pollsGet'>;
	pollsCreate: LoomioEndpoint<'pollsCreate'>;
	pollsUpdate: LoomioEndpoint<'pollsUpdate'>;
	pollsDelete: LoomioEndpoint<'pollsDelete'>;
	membershipsList: LoomioEndpoint<'membershipsList'>;
	membershipsManage: LoomioEndpoint<'membershipsManage'>;
	reportsGet: LoomioEndpoint<'reportsGet'>;
	searchQuery: LoomioEndpoint<'searchQuery'>;
	webhooksList: LoomioEndpoint<'webhooksList'>;
	webhooksCreate: LoomioEndpoint<'webhooksCreate'>;
	webhooksUpdate: LoomioEndpoint<'webhooksUpdate'>;
	webhooksDelete: LoomioEndpoint<'webhooksDelete'>;
	webhooksCheck: LoomioEndpoint<'webhooksCheck'>;
	serverGroupsList: LoomioEndpoint<'serverGroupsList'>;
	serverMembershipsList: LoomioEndpoint<'serverMembershipsList'>;
	serverMembershipsSync: LoomioEndpoint<'serverMembershipsSync'>;
	serverMembershipsUpdate: LoomioEndpoint<'serverMembershipsUpdate'>;
	serverMembershipsRevoke: LoomioEndpoint<'serverMembershipsRevoke'>;
	serverUsersList: LoomioEndpoint<'serverUsersList'>;
	serverUsersCreate: LoomioEndpoint<'serverUsersCreate'>;
	serverUsersGet: LoomioEndpoint<'serverUsersGet'>;
	serverUsersUpdate: LoomioEndpoint<'serverUsersUpdate'>;
	serverUsersDelete: LoomioEndpoint<'serverUsersDelete'>;
	serverUsersDeactivate: LoomioEndpoint<'serverUsersDeactivate'>;
	serverUsersReactivate: LoomioEndpoint<'serverUsersReactivate'>;
	serverUsersRedact: LoomioEndpoint<'serverUsersRedact'>;
	serverUsersGetByIdentity: LoomioEndpoint<'serverUsersGetByIdentity'>;
	serverUsersUpdateByIdentity: LoomioEndpoint<'serverUsersUpdateByIdentity'>;
	serverUsersDeleteByIdentity: LoomioEndpoint<'serverUsersDeleteByIdentity'>;
	serverUsersDeactivateByIdentity: LoomioEndpoint<'serverUsersDeactivateByIdentity'>;
	serverUsersReactivateByIdentity: LoomioEndpoint<'serverUsersReactivateByIdentity'>;
	serverUsersRedactByIdentity: LoomioEndpoint<'serverUsersRedactByIdentity'>;
};

const loomioEndpointsNested = {
	groups: {
		list: Groups.list,
		get: Groups.get,
	},
	discussions: {
		list: Discussions.list,
		get: Discussions.get,
		create: Discussions.create,
		update: Discussions.update,
		delete: Discussions.remove,
	},
	comments: {
		create: Comments.create,
		update: Comments.update,
		delete: Comments.remove,
	},
	threads: {
		list: Threads.list,
		get: Threads.get,
		items: Threads.items,
		markdown: Threads.markdown,
	},
	polls: {
		list: Polls.list,
		get: Polls.get,
		create: Polls.create,
		update: Polls.update,
		delete: Polls.remove,
	},
	memberships: {
		list: Memberships.list,
		manage: Memberships.manage,
	},
	reports: {
		get: Reports.get,
	},
	search: {
		query: Search.query,
	},
	webhooks: {
		list: Webhooks.list,
		create: Webhooks.create,
		update: Webhooks.update,
		delete: Webhooks.remove,
		check: Webhooks.check,
	},
	server: {
		groups: {
			list: Server.groupsList,
		},
		memberships: {
			list: Server.membershipsList,
			sync: Server.membershipsSync,
			update: Server.membershipsUpdate,
			revoke: Server.membershipsRevoke,
		},
		users: {
			list: Server.usersList,
			create: Server.usersCreate,
			get: Server.usersGet,
			update: Server.usersUpdate,
			delete: Server.usersDelete,
			deactivate: Server.usersDeactivate,
			reactivate: Server.usersReactivate,
			redact: Server.usersRedact,
			getByIdentity: Server.usersGetByIdentity,
			updateByIdentity: Server.usersUpdateByIdentity,
			deleteByIdentity: Server.usersDeleteByIdentity,
			deactivateByIdentity: Server.usersDeactivateByIdentity,
			reactivateByIdentity: Server.usersReactivateByIdentity,
			redactByIdentity: Server.usersRedactByIdentity,
		},
	},
} as const;

export const loomioEndpointSchemas = {
	'groups.list': {
		input: LoomioEndpointInputSchemas.groupsList,
		output: LoomioEndpointOutputSchemas.groupsList,
	},
	'groups.get': {
		input: LoomioEndpointInputSchemas.groupsGet,
		output: LoomioEndpointOutputSchemas.groupsGet,
	},
	'discussions.list': {
		input: LoomioEndpointInputSchemas.discussionsList,
		output: LoomioEndpointOutputSchemas.discussionsList,
	},
	'discussions.get': {
		input: LoomioEndpointInputSchemas.discussionsGet,
		output: LoomioEndpointOutputSchemas.discussionsGet,
	},
	'discussions.create': {
		input: LoomioEndpointInputSchemas.discussionsCreate,
		output: LoomioEndpointOutputSchemas.discussionsCreate,
	},
	'discussions.update': {
		input: LoomioEndpointInputSchemas.discussionsUpdate,
		output: LoomioEndpointOutputSchemas.discussionsUpdate,
	},
	'discussions.delete': {
		input: LoomioEndpointInputSchemas.discussionsDelete,
		output: LoomioEndpointOutputSchemas.discussionsDelete,
	},
	'comments.create': {
		input: LoomioEndpointInputSchemas.commentsCreate,
		output: LoomioEndpointOutputSchemas.commentsCreate,
	},
	'comments.update': {
		input: LoomioEndpointInputSchemas.commentsUpdate,
		output: LoomioEndpointOutputSchemas.commentsUpdate,
	},
	'comments.delete': {
		input: LoomioEndpointInputSchemas.commentsDelete,
		output: LoomioEndpointOutputSchemas.commentsDelete,
	},
	'threads.list': {
		input: LoomioEndpointInputSchemas.threadsList,
		output: LoomioEndpointOutputSchemas.threadsList,
	},
	'threads.get': {
		input: LoomioEndpointInputSchemas.threadsGet,
		output: LoomioEndpointOutputSchemas.threadsGet,
	},
	'threads.items': {
		input: LoomioEndpointInputSchemas.threadsItems,
		output: LoomioEndpointOutputSchemas.threadsItems,
	},
	'threads.markdown': {
		input: LoomioEndpointInputSchemas.threadsMarkdown,
		output: LoomioEndpointOutputSchemas.threadsMarkdown,
	},
	'polls.list': {
		input: LoomioEndpointInputSchemas.pollsList,
		output: LoomioEndpointOutputSchemas.pollsList,
	},
	'polls.get': {
		input: LoomioEndpointInputSchemas.pollsGet,
		output: LoomioEndpointOutputSchemas.pollsGet,
	},
	'polls.create': {
		input: LoomioEndpointInputSchemas.pollsCreate,
		output: LoomioEndpointOutputSchemas.pollsCreate,
	},
	'polls.update': {
		input: LoomioEndpointInputSchemas.pollsUpdate,
		output: LoomioEndpointOutputSchemas.pollsUpdate,
	},
	'polls.delete': {
		input: LoomioEndpointInputSchemas.pollsDelete,
		output: LoomioEndpointOutputSchemas.pollsDelete,
	},
	'memberships.list': {
		input: LoomioEndpointInputSchemas.membershipsList,
		output: LoomioEndpointOutputSchemas.membershipsList,
	},
	'memberships.manage': {
		input: LoomioEndpointInputSchemas.membershipsManage,
		output: LoomioEndpointOutputSchemas.membershipsManage,
	},
	'reports.get': {
		input: LoomioEndpointInputSchemas.reportsGet,
		output: LoomioEndpointOutputSchemas.reportsGet,
	},
	'search.query': {
		input: LoomioEndpointInputSchemas.searchQuery,
		output: LoomioEndpointOutputSchemas.searchQuery,
	},
	'webhooks.list': {
		input: LoomioEndpointInputSchemas.webhooksList,
		output: LoomioEndpointOutputSchemas.webhooksList,
	},
	'webhooks.create': {
		input: LoomioEndpointInputSchemas.webhooksCreate,
		output: LoomioEndpointOutputSchemas.webhooksCreate,
	},
	'webhooks.update': {
		input: LoomioEndpointInputSchemas.webhooksUpdate,
		output: LoomioEndpointOutputSchemas.webhooksUpdate,
	},
	'webhooks.delete': {
		input: LoomioEndpointInputSchemas.webhooksDelete,
		output: LoomioEndpointOutputSchemas.webhooksDelete,
	},
	'webhooks.check': {
		input: LoomioEndpointInputSchemas.webhooksCheck,
		output: LoomioEndpointOutputSchemas.webhooksCheck,
	},
	'server.groups.list': {
		input: LoomioEndpointInputSchemas.serverGroupsList,
		output: LoomioEndpointOutputSchemas.serverGroupsList,
	},
	'server.memberships.list': {
		input: LoomioEndpointInputSchemas.serverMembershipsList,
		output: LoomioEndpointOutputSchemas.serverMembershipsList,
	},
	'server.memberships.sync': {
		input: LoomioEndpointInputSchemas.serverMembershipsSync,
		output: LoomioEndpointOutputSchemas.serverMembershipsSync,
	},
	'server.memberships.update': {
		input: LoomioEndpointInputSchemas.serverMembershipsUpdate,
		output: LoomioEndpointOutputSchemas.serverMembershipsUpdate,
	},
	'server.memberships.revoke': {
		input: LoomioEndpointInputSchemas.serverMembershipsRevoke,
		output: LoomioEndpointOutputSchemas.serverMembershipsRevoke,
	},
	'server.users.list': {
		input: LoomioEndpointInputSchemas.serverUsersList,
		output: LoomioEndpointOutputSchemas.serverUsersList,
	},
	'server.users.create': {
		input: LoomioEndpointInputSchemas.serverUsersCreate,
		output: LoomioEndpointOutputSchemas.serverUsersCreate,
	},
	'server.users.get': {
		input: LoomioEndpointInputSchemas.serverUsersGet,
		output: LoomioEndpointOutputSchemas.serverUsersGet,
	},
	'server.users.update': {
		input: LoomioEndpointInputSchemas.serverUsersUpdate,
		output: LoomioEndpointOutputSchemas.serverUsersUpdate,
	},
	'server.users.delete': {
		input: LoomioEndpointInputSchemas.serverUsersDelete,
		output: LoomioEndpointOutputSchemas.serverUsersDelete,
	},
	'server.users.deactivate': {
		input: LoomioEndpointInputSchemas.serverUsersDeactivate,
		output: LoomioEndpointOutputSchemas.serverUsersDeactivate,
	},
	'server.users.reactivate': {
		input: LoomioEndpointInputSchemas.serverUsersReactivate,
		output: LoomioEndpointOutputSchemas.serverUsersReactivate,
	},
	'server.users.redact': {
		input: LoomioEndpointInputSchemas.serverUsersRedact,
		output: LoomioEndpointOutputSchemas.serverUsersRedact,
	},
	'server.users.getByIdentity': {
		input: LoomioEndpointInputSchemas.serverUsersGetByIdentity,
		output: LoomioEndpointOutputSchemas.serverUsersGetByIdentity,
	},
	'server.users.updateByIdentity': {
		input: LoomioEndpointInputSchemas.serverUsersUpdateByIdentity,
		output: LoomioEndpointOutputSchemas.serverUsersUpdateByIdentity,
	},
	'server.users.deleteByIdentity': {
		input: LoomioEndpointInputSchemas.serverUsersDeleteByIdentity,
		output: LoomioEndpointOutputSchemas.serverUsersDeleteByIdentity,
	},
	'server.users.deactivateByIdentity': {
		input: LoomioEndpointInputSchemas.serverUsersDeactivateByIdentity,
		output: LoomioEndpointOutputSchemas.serverUsersDeactivateByIdentity,
	},
	'server.users.reactivateByIdentity': {
		input: LoomioEndpointInputSchemas.serverUsersReactivateByIdentity,
		output: LoomioEndpointOutputSchemas.serverUsersReactivateByIdentity,
	},
	'server.users.redactByIdentity': {
		input: LoomioEndpointInputSchemas.serverUsersRedactByIdentity,
		output: LoomioEndpointOutputSchemas.serverUsersRedactByIdentity,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof loomioEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const loomioEndpointMeta = {
	'groups.list': {
		riskLevel: 'read',
		description:
			'List the groups the key user belongs to, including subgroups, oldest first',
	},
	'groups.get': {
		riskLevel: 'read',
		description:
			'Read one group by numeric id, url key, or handle, with its settings and member counts',
	},
	'discussions.list': {
		riskLevel: 'read',
		description:
			'List discussions in one group, filtered by open or closed status, ordered by latest activity',
	},
	'discussions.get': {
		riskLevel: 'read',
		description:
			'Read one discussion by numeric id or url key, with its author and thread record',
	},
	'discussions.create': {
		riskLevel: 'destructive',
		description:
			'Start a discussion in a group; can notify the whole group and email invitations to recipient addresses',
	},
	'discussions.update': {
		riskLevel: 'destructive',
		description:
			'Edit a discussion title or context; can notify the group and email invitations to recipient addresses',
	},
	'discussions.delete': {
		riskLevel: 'destructive',
		description:
			'Soft-delete a discussion; it disappears for members and the API cannot restore it',
	},
	'comments.create': {
		riskLevel: 'write',
		description:
			'Post a comment, or a reply to a comment, on a discussion, in markdown or html',
	},
	'comments.update': {
		riskLevel: 'write',
		description: 'Edit the body of a comment the key user may edit',
	},
	'comments.delete': {
		riskLevel: 'destructive',
		description:
			'Soft-delete a comment: its body is hidden and the API cannot restore it',
	},
	'threads.list': {
		riskLevel: 'read',
		description:
			'List the threads the key user can see, ordered by latest activity, across all groups',
	},
	'threads.get': {
		riskLevel: 'read',
		description:
			'Read one thread record by topic id, with its discussion or poll in the related arrays',
	},
	'threads.items': {
		riskLevel: 'read',
		description:
			'Read one thread timeline in sequence order: comments, polls, votes, and outcomes as one event stream',
	},
	'threads.markdown': {
		riskLevel: 'read',
		description:
			'Export one thread as a single markdown document; needs export permission on the thread',
	},
	'polls.list': {
		riskLevel: 'read',
		description:
			'List polls in one group, filtered by active or closed status, newest first, with current outcomes',
	},
	'polls.get': {
		riskLevel: 'read',
		description:
			'Read one poll by numeric id or url key, with vote counts and its options',
	},
	'polls.create': {
		riskLevel: 'destructive',
		description:
			'Create a poll in a group or on a discussion; can invite the group to vote and email invitations to recipient addresses',
	},
	'polls.update': {
		riskLevel: 'destructive',
		description:
			'Edit a poll (title, details, options, closing time); can change existing votes and email invitations',
	},
	'polls.delete': {
		riskLevel: 'destructive',
		description:
			'Soft-delete a poll; it disappears for voters and the API cannot restore it',
	},
	'memberships.list': {
		riskLevel: 'read',
		description:
			"List a group's memberships with related users; emails only for members the key user invited or in groups it administers",
	},
	'memberships.manage': {
		riskLevel: 'destructive',
		description:
			'Invite email addresses to a group (Loomio emails them) and optionally remove every member not listed; group admin only',
	},
	'reports.get': {
		riskLevel: 'read',
		description:
			"Generate a participation report (overview, per-person, or per-country counts) for the key user's groups",
	},
	'search.query': {
		riskLevel: 'read',
		description:
			'Search visible discussions, comments, polls, votes, and outcomes; up to 20 results',
	},
	'webhooks.list': {
		riskLevel: 'read',
		description:
			"List a group's outgoing webhooks and chat integrations, with destination URLs; group admin only",
	},
	'webhooks.create': {
		riskLevel: 'write',
		description:
			'Create an outgoing webhook or chat integration that posts group events to a URL; group admin only',
	},
	'webhooks.update': {
		riskLevel: 'write',
		description:
			"Change a webhook's name, destination, format, or events; group admin only",
	},
	'webhooks.delete': {
		riskLevel: 'destructive',
		description: 'Delete a webhook or chat integration; future deliveries stop',
	},
	'webhooks.check': {
		riskLevel: 'destructive',
		description:
			'Ask Loomio to send a test message to a webhook destination URL; success does not confirm delivery',
	},
	'server.groups.list': {
		riskLevel: 'read',
		description:
			'Self-hosted Server API: list every group on the install, private ones included (server key)',
	},
	'server.memberships.list': {
		riskLevel: 'read',
		description:
			"Self-hosted Server API: list a group's memberships and pending invitations with emails (server key)",
	},
	'server.memberships.sync': {
		riskLevel: 'destructive',
		description:
			'Self-hosted Server API: invite emails to a group and optionally revoke everyone not listed (server key)',
	},
	'server.memberships.update': {
		riskLevel: 'write',
		description:
			"Self-hosted Server API: grant or remove a member's admin and delegate roles (server key)",
	},
	'server.memberships.revoke': {
		riskLevel: 'destructive',
		description:
			'Self-hosted Server API: revoke a membership in its group and subgroups (server key)',
	},
	'server.users.list': {
		riskLevel: 'read',
		description:
			'Self-hosted Server API: list every user account with emails and identities (server key)',
	},
	'server.users.create': {
		riskLevel: 'write',
		description:
			'Self-hosted Server API: create an unverified account without sending an invitation (server key)',
	},
	'server.users.get': {
		riskLevel: 'read',
		description:
			'Self-hosted Server API: read one user account by id (server key)',
	},
	'server.users.update': {
		riskLevel: 'write',
		description:
			"Self-hosted Server API: change a user's name, username, email, or admin flag (server key)",
	},
	'server.users.delete': {
		riskLevel: 'destructive',
		description:
			'Self-hosted Server API: permanently delete a user and their records (server key)',
	},
	'server.users.deactivate': {
		riskLevel: 'destructive',
		description:
			'Self-hosted Server API: queue a user deactivation; success means queued, so read the user again and check active is false (server key)',
	},
	'server.users.reactivate': {
		riskLevel: 'write',
		description:
			'Self-hosted Server API: reactivate a deactivated user (server key)',
	},
	'server.users.redact': {
		riskLevel: 'destructive',
		description:
			"Self-hosted Server API: irreversibly remove a user's identifying data, keeping their content (server key)",
	},
	'server.users.getByIdentity': {
		riskLevel: 'read',
		description:
			'Self-hosted Server API: find a user by external identity provider and uid (server key)',
	},
	'server.users.updateByIdentity': {
		riskLevel: 'write',
		description:
			'Self-hosted Server API: update a user found by external identity (server key)',
	},
	'server.users.deleteByIdentity': {
		riskLevel: 'destructive',
		description:
			'Self-hosted Server API: permanently delete a user found by external identity (server key)',
	},
	'server.users.deactivateByIdentity': {
		riskLevel: 'destructive',
		description:
			'Self-hosted Server API: queue deactivation of a user found by external identity; read again and check active is false (server key)',
	},
	'server.users.reactivateByIdentity': {
		riskLevel: 'write',
		description:
			'Self-hosted Server API: reactivate a user found by external identity (server key)',
	},
	'server.users.redactByIdentity': {
		riskLevel: 'destructive',
		description:
			'Self-hosted Server API: irreversibly redact a user found by external identity (server key)',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof loomioEndpointsNested>;

export type BaseLoomioPlugin<T extends LoomioPluginOptions> = CorsairPlugin<
	'loomio',
	typeof LoomioSchema,
	typeof loomioEndpointsNested,
	{},
	T,
	typeof defaultAuthType,
	typeof loomioAuthConfig
>;

export type InternalLoomioPlugin = BaseLoomioPlugin<LoomioPluginOptions>;

export type ExternalLoomioPlugin<T extends LoomioPluginOptions> =
	BaseLoomioPlugin<T>;

export function loomio<const T extends LoomioPluginOptions>(
	incomingOptions: LoomioPluginOptions & T = {} as LoomioPluginOptions & T,
): ExternalLoomioPlugin<T> {
	const options = {
		...incomingOptions,
		// Validate early so a bad origin fails at setup, not on the first call.
		baseUrl:
			incomingOptions.baseUrl === undefined
				? undefined
				: normalizeLoomioBaseUrl(incomingOptions.baseUrl),
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'loomio',
		authConfig: loomioAuthConfig,
		schema: LoomioSchema,
		options: options,
		hooks: options.hooks,
		endpoints: loomioEndpointsNested,
		webhooks: {},
		endpointMeta: loomioEndpointMeta,
		endpointSchemas: loomioEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: LoomioKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('loomio', ctx.authType ?? 'api_key');
		},
	} satisfies InternalLoomioPlugin;
}

export {
	LOOMIO_API_BASE,
	LOOMIO_DEFAULT_BASE_URL,
	normalizeLoomioBaseUrl,
} from './client';

export type {
	CommentsCreateInput,
	CommentsCreateResponse,
	DiscussionsCreateInput,
	DiscussionsCreateResponse,
	DiscussionsGetInput,
	DiscussionsGetResponse,
	DiscussionsListInput,
	DiscussionsListResponse,
	GroupsGetInput,
	GroupsGetResponse,
	GroupsListInput,
	GroupsListResponse,
	LoomioComment,
	LoomioDiscussion,
	LoomioEndpointInputs,
	LoomioEndpointOutputs,
	LoomioGroup,
	LoomioMembership,
	LoomioMeta,
	LoomioPoll,
	LoomioServerUser,
	LoomioSuccessResponse,
	LoomioTopic,
	LoomioTopicItem,
	LoomioWebhook,
	PollsCreateInput,
	PollsCreateResponse,
	PollsGetInput,
	PollsGetResponse,
	PollsListInput,
	PollsListResponse,
	ThreadsItemsInput,
	ThreadsItemsResponse,
	ThreadsListInput,
	ThreadsListResponse,
	ThreadsMarkdownInput,
	ThreadsMarkdownResponse,
} from './endpoints/types';
