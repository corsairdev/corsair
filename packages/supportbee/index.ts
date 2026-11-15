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
import {
	AttachmentsEndpoints,
	CommentsEndpoints,
	DraftsEndpoints,
	EmailsEndpoints,
	FiltersEndpoints,
	LabelsEndpoints,
	RepliesEndpoints,
	ReportsEndpoints,
	SnippetsEndpoints,
	SupportbeeEndpointInputSchemas,
	SupportbeeEndpointOutputSchemas,
	TeamsEndpoints,
	TicketsEndpoints,
	UsersEndpoints,
} from './endpoints';
import type {
	SupportbeeEndpointInputs,
	SupportbeeEndpointOutputs,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { SupportbeeSchema } from './schema';

export type SupportbeePluginOptions = {
	authType?: PickAuth<'api_key'>;
	/**
	 * The desk, as `acme.supportbee.com` or just `acme`. SupportBee has no shared
	 * API host, so either this or a stored `company` key is required. Requests
	 * only go to `https://{company}.supportbee.com`; any other domain is
	 * rejected.
	 */
	company?: string;
	/** An API token, as found under the profile picture, then API Token. */
	key?: string;
	hooks?: InternalSupportbeePlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof supportbeeEndpointsNested>;
};

export type SupportbeeContext = CorsairPluginContext<
	typeof SupportbeeSchema,
	SupportbeePluginOptions,
	undefined,
	typeof supportbeeAuthConfig
>;

export type SupportbeeKeyBuilderContext = KeyBuilderContext<
	SupportbeePluginOptions,
	typeof supportbeeAuthConfig
>;

export type SupportbeeBoundEndpoints = BindEndpoints<
	typeof supportbeeEndpointsNested
>;

type SupportbeeEndpoint<K extends keyof SupportbeeEndpointOutputs> =
	CorsairEndpoint<
		SupportbeeContext,
		SupportbeeEndpointInputs[K],
		SupportbeeEndpointOutputs[K]
	>;

export type SupportbeeEndpoints = {
	ticketsList: SupportbeeEndpoint<'ticketsList'>;
	ticketsCreate: SupportbeeEndpoint<'ticketsCreate'>;
	ticketsSearch: SupportbeeEndpoint<'ticketsSearch'>;
	ticketsGet: SupportbeeEndpoint<'ticketsGet'>;
	ticketsDelete: SupportbeeEndpoint<'ticketsDelete'>;
	ticketsArchive: SupportbeeEndpoint<'ticketsArchive'>;
	ticketsUnarchive: SupportbeeEndpoint<'ticketsUnarchive'>;
	ticketsMarkAnswered: SupportbeeEndpoint<'ticketsMarkAnswered'>;
	ticketsMarkUnanswered: SupportbeeEndpoint<'ticketsMarkUnanswered'>;
	ticketsMarkSpam: SupportbeeEndpoint<'ticketsMarkSpam'>;
	ticketsUnmarkSpam: SupportbeeEndpoint<'ticketsUnmarkSpam'>;
	ticketsTrash: SupportbeeEndpoint<'ticketsTrash'>;
	ticketsUntrash: SupportbeeEndpoint<'ticketsUntrash'>;
	ticketsAssignUser: SupportbeeEndpoint<'ticketsAssignUser'>;
	ticketsUnassignUser: SupportbeeEndpoint<'ticketsUnassignUser'>;
	ticketsAssignTeam: SupportbeeEndpoint<'ticketsAssignTeam'>;
	ticketsUnassignTeam: SupportbeeEndpoint<'ticketsUnassignTeam'>;
	ticketsAudit: SupportbeeEndpoint<'ticketsAudit'>;
	ticketsAddLabel: SupportbeeEndpoint<'ticketsAddLabel'>;
	ticketsRemoveLabel: SupportbeeEndpoint<'ticketsRemoveLabel'>;
	repliesList: SupportbeeEndpoint<'repliesList'>;
	repliesGet: SupportbeeEndpoint<'repliesGet'>;
	repliesCreate: SupportbeeEndpoint<'repliesCreate'>;
	commentsList: SupportbeeEndpoint<'commentsList'>;
	commentsCreate: SupportbeeEndpoint<'commentsCreate'>;
	draftsGet: SupportbeeEndpoint<'draftsGet'>;
	draftsCreate: SupportbeeEndpoint<'draftsCreate'>;
	draftsUpdate: SupportbeeEndpoint<'draftsUpdate'>;
	draftsDelete: SupportbeeEndpoint<'draftsDelete'>;
	usersList: SupportbeeEndpoint<'usersList'>;
	usersCreate: SupportbeeEndpoint<'usersCreate'>;
	usersGet: SupportbeeEndpoint<'usersGet'>;
	usersUpdate: SupportbeeEndpoint<'usersUpdate'>;
	usersListMembers: SupportbeeEndpoint<'usersListMembers'>;
	usersAddMember: SupportbeeEndpoint<'usersAddMember'>;
	teamsList: SupportbeeEndpoint<'teamsList'>;
	attachmentsCreate: SupportbeeEndpoint<'attachmentsCreate'>;
	snippetsList: SupportbeeEndpoint<'snippetsList'>;
	snippetsCreate: SupportbeeEndpoint<'snippetsCreate'>;
	snippetsUpdate: SupportbeeEndpoint<'snippetsUpdate'>;
	snippetsDelete: SupportbeeEndpoint<'snippetsDelete'>;
	filtersCreateRule: SupportbeeEndpoint<'filtersCreateRule'>;
	filtersCreateConsequence: SupportbeeEndpoint<'filtersCreateConsequence'>;
	filtersCreate: SupportbeeEndpoint<'filtersCreate'>;
	emailsList: SupportbeeEndpoint<'emailsList'>;
	emailsCreate: SupportbeeEndpoint<'emailsCreate'>;
	reportsAvgFirstResponseTime: SupportbeeEndpoint<'reportsAvgFirstResponseTime'>;
	reportsTicketsCount: SupportbeeEndpoint<'reportsTicketsCount'>;
	reportsRepliesCount: SupportbeeEndpoint<'reportsRepliesCount'>;
	labelsList: SupportbeeEndpoint<'labelsList'>;
};

const supportbeeEndpointsNested = {
	tickets: TicketsEndpoints,
	replies: RepliesEndpoints,
	comments: CommentsEndpoints,
	drafts: DraftsEndpoints,
	users: UsersEndpoints,
	teams: TeamsEndpoints,
	attachments: AttachmentsEndpoints,
	snippets: SnippetsEndpoints,
	filters: FiltersEndpoints,
	emails: EmailsEndpoints,
	reports: ReportsEndpoints,
	labels: LabelsEndpoints,
} as const;

export const supportbeeEndpointSchemas = {
	'tickets.list': {
		input: SupportbeeEndpointInputSchemas.ticketsList,
		output: SupportbeeEndpointOutputSchemas.ticketsList,
	},
	'tickets.create': {
		input: SupportbeeEndpointInputSchemas.ticketsCreate,
		output: SupportbeeEndpointOutputSchemas.ticketsCreate,
	},
	'tickets.search': {
		input: SupportbeeEndpointInputSchemas.ticketsSearch,
		output: SupportbeeEndpointOutputSchemas.ticketsSearch,
	},
	'tickets.get': {
		input: SupportbeeEndpointInputSchemas.ticketsGet,
		output: SupportbeeEndpointOutputSchemas.ticketsGet,
	},
	'tickets.delete': {
		input: SupportbeeEndpointInputSchemas.ticketsDelete,
		output: SupportbeeEndpointOutputSchemas.ticketsDelete,
	},
	'tickets.archive': {
		input: SupportbeeEndpointInputSchemas.ticketsArchive,
		output: SupportbeeEndpointOutputSchemas.ticketsArchive,
	},
	'tickets.unarchive': {
		input: SupportbeeEndpointInputSchemas.ticketsUnarchive,
		output: SupportbeeEndpointOutputSchemas.ticketsUnarchive,
	},
	'tickets.markAnswered': {
		input: SupportbeeEndpointInputSchemas.ticketsMarkAnswered,
		output: SupportbeeEndpointOutputSchemas.ticketsMarkAnswered,
	},
	'tickets.markUnanswered': {
		input: SupportbeeEndpointInputSchemas.ticketsMarkUnanswered,
		output: SupportbeeEndpointOutputSchemas.ticketsMarkUnanswered,
	},
	'tickets.markSpam': {
		input: SupportbeeEndpointInputSchemas.ticketsMarkSpam,
		output: SupportbeeEndpointOutputSchemas.ticketsMarkSpam,
	},
	'tickets.unmarkSpam': {
		input: SupportbeeEndpointInputSchemas.ticketsUnmarkSpam,
		output: SupportbeeEndpointOutputSchemas.ticketsUnmarkSpam,
	},
	'tickets.trash': {
		input: SupportbeeEndpointInputSchemas.ticketsTrash,
		output: SupportbeeEndpointOutputSchemas.ticketsTrash,
	},
	'tickets.untrash': {
		input: SupportbeeEndpointInputSchemas.ticketsUntrash,
		output: SupportbeeEndpointOutputSchemas.ticketsUntrash,
	},
	'tickets.assignUser': {
		input: SupportbeeEndpointInputSchemas.ticketsAssignUser,
		output: SupportbeeEndpointOutputSchemas.ticketsAssignUser,
	},
	'tickets.unassignUser': {
		input: SupportbeeEndpointInputSchemas.ticketsUnassignUser,
		output: SupportbeeEndpointOutputSchemas.ticketsUnassignUser,
	},
	'tickets.assignTeam': {
		input: SupportbeeEndpointInputSchemas.ticketsAssignTeam,
		output: SupportbeeEndpointOutputSchemas.ticketsAssignTeam,
	},
	'tickets.unassignTeam': {
		input: SupportbeeEndpointInputSchemas.ticketsUnassignTeam,
		output: SupportbeeEndpointOutputSchemas.ticketsUnassignTeam,
	},
	'tickets.audit': {
		input: SupportbeeEndpointInputSchemas.ticketsAudit,
		output: SupportbeeEndpointOutputSchemas.ticketsAudit,
	},
	'tickets.addLabel': {
		input: SupportbeeEndpointInputSchemas.ticketsAddLabel,
		output: SupportbeeEndpointOutputSchemas.ticketsAddLabel,
	},
	'tickets.removeLabel': {
		input: SupportbeeEndpointInputSchemas.ticketsRemoveLabel,
		output: SupportbeeEndpointOutputSchemas.ticketsRemoveLabel,
	},
	'replies.list': {
		input: SupportbeeEndpointInputSchemas.repliesList,
		output: SupportbeeEndpointOutputSchemas.repliesList,
	},
	'replies.get': {
		input: SupportbeeEndpointInputSchemas.repliesGet,
		output: SupportbeeEndpointOutputSchemas.repliesGet,
	},
	'replies.create': {
		input: SupportbeeEndpointInputSchemas.repliesCreate,
		output: SupportbeeEndpointOutputSchemas.repliesCreate,
	},
	'comments.list': {
		input: SupportbeeEndpointInputSchemas.commentsList,
		output: SupportbeeEndpointOutputSchemas.commentsList,
	},
	'comments.create': {
		input: SupportbeeEndpointInputSchemas.commentsCreate,
		output: SupportbeeEndpointOutputSchemas.commentsCreate,
	},
	'drafts.get': {
		input: SupportbeeEndpointInputSchemas.draftsGet,
		output: SupportbeeEndpointOutputSchemas.draftsGet,
	},
	'drafts.create': {
		input: SupportbeeEndpointInputSchemas.draftsCreate,
		output: SupportbeeEndpointOutputSchemas.draftsCreate,
	},
	'drafts.update': {
		input: SupportbeeEndpointInputSchemas.draftsUpdate,
		output: SupportbeeEndpointOutputSchemas.draftsUpdate,
	},
	'drafts.delete': {
		input: SupportbeeEndpointInputSchemas.draftsDelete,
		output: SupportbeeEndpointOutputSchemas.draftsDelete,
	},
	'users.list': {
		input: SupportbeeEndpointInputSchemas.usersList,
		output: SupportbeeEndpointOutputSchemas.usersList,
	},
	'users.create': {
		input: SupportbeeEndpointInputSchemas.usersCreate,
		output: SupportbeeEndpointOutputSchemas.usersCreate,
	},
	'users.get': {
		input: SupportbeeEndpointInputSchemas.usersGet,
		output: SupportbeeEndpointOutputSchemas.usersGet,
	},
	'users.update': {
		input: SupportbeeEndpointInputSchemas.usersUpdate,
		output: SupportbeeEndpointOutputSchemas.usersUpdate,
	},
	'users.listMembers': {
		input: SupportbeeEndpointInputSchemas.usersListMembers,
		output: SupportbeeEndpointOutputSchemas.usersListMembers,
	},
	'users.addMember': {
		input: SupportbeeEndpointInputSchemas.usersAddMember,
		output: SupportbeeEndpointOutputSchemas.usersAddMember,
	},
	'teams.list': {
		input: SupportbeeEndpointInputSchemas.teamsList,
		output: SupportbeeEndpointOutputSchemas.teamsList,
	},
	'attachments.create': {
		input: SupportbeeEndpointInputSchemas.attachmentsCreate,
		output: SupportbeeEndpointOutputSchemas.attachmentsCreate,
	},
	'snippets.list': {
		input: SupportbeeEndpointInputSchemas.snippetsList,
		output: SupportbeeEndpointOutputSchemas.snippetsList,
	},
	'snippets.create': {
		input: SupportbeeEndpointInputSchemas.snippetsCreate,
		output: SupportbeeEndpointOutputSchemas.snippetsCreate,
	},
	'snippets.update': {
		input: SupportbeeEndpointInputSchemas.snippetsUpdate,
		output: SupportbeeEndpointOutputSchemas.snippetsUpdate,
	},
	'snippets.delete': {
		input: SupportbeeEndpointInputSchemas.snippetsDelete,
		output: SupportbeeEndpointOutputSchemas.snippetsDelete,
	},
	'filters.createRule': {
		input: SupportbeeEndpointInputSchemas.filtersCreateRule,
		output: SupportbeeEndpointOutputSchemas.filtersCreateRule,
	},
	'filters.createConsequence': {
		input: SupportbeeEndpointInputSchemas.filtersCreateConsequence,
		output: SupportbeeEndpointOutputSchemas.filtersCreateConsequence,
	},
	'filters.create': {
		input: SupportbeeEndpointInputSchemas.filtersCreate,
		output: SupportbeeEndpointOutputSchemas.filtersCreate,
	},
	'emails.list': {
		input: SupportbeeEndpointInputSchemas.emailsList,
		output: SupportbeeEndpointOutputSchemas.emailsList,
	},
	'emails.create': {
		input: SupportbeeEndpointInputSchemas.emailsCreate,
		output: SupportbeeEndpointOutputSchemas.emailsCreate,
	},
	'reports.avgFirstResponseTime': {
		input: SupportbeeEndpointInputSchemas.reportsAvgFirstResponseTime,
		output: SupportbeeEndpointOutputSchemas.reportsAvgFirstResponseTime,
	},
	'reports.ticketsCount': {
		input: SupportbeeEndpointInputSchemas.reportsTicketsCount,
		output: SupportbeeEndpointOutputSchemas.reportsTicketsCount,
	},
	'reports.repliesCount': {
		input: SupportbeeEndpointInputSchemas.reportsRepliesCount,
		output: SupportbeeEndpointOutputSchemas.reportsRepliesCount,
	},
	'labels.list': {
		input: SupportbeeEndpointInputSchemas.labelsList,
		output: SupportbeeEndpointOutputSchemas.labelsList,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof supportbeeEndpointsNested
>;

const defaultAuthType: 'api_key' = 'api_key';

/**
 * SupportBee authenticates with a **bearer token**: one string, found on the
 * desk under the profile picture, then API Token. The desk address is the other
 * half of a connection and is an account field too, because every desk is its
 * own subdomain. A tenant controls that value, so it is only ever used as a
 * company name under `supportbee.com` (see `normalizeSupportbeeCompany`).
 */
export const supportbeeAuthConfig = {
	api_key: {
		// `webhook_signature` is already an api_key base field, so declaring it
		// again would duplicate it; only the desk address is plugin-specific.
		account: ['company'] as const,
	},
} as const satisfies PluginAuthConfig;

const supportbeeEndpointMeta = {
	'tickets.list': {
		riskLevel: 'read',
		description:
			'List unarchived tickets in last-activity order, filtered by assignee, team, label, requester or date',
	},
	'tickets.create': {
		riskLevel: 'write',
		description:
			'Open a ticket for a requester. Works without a token, and an unauthenticated call is capped at 5 tickets an hour per IP',
	},
	'tickets.search': {
		riskLevel: 'read',
		description:
			'Search tickets by text across subjects, bodies and requesters',
	},
	'tickets.get': {
		riskLevel: 'read',
		description: 'Read one ticket with its requester, content and assignment',
	},
	'tickets.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a trashed ticket for good. Only an admin can delete, and only a ticket already in the trash',
	},
	'tickets.archive': {
		riskLevel: 'write',
		description:
			'Archive a ticket, which takes it out of the default list. The ticket stays readable',
	},
	'tickets.unarchive': {
		riskLevel: 'write',
		description: 'Return an archived ticket to the default list',
	},
	'tickets.markAnswered': {
		riskLevel: 'write',
		description:
			'Mark a ticket answered without sending a reply, which is how an off-system answer is recorded',
	},
	'tickets.markUnanswered': {
		riskLevel: 'write',
		description: 'Mark a ticket unanswered so it returns to the open queue',
	},
	'tickets.markSpam': {
		riskLevel: 'write',
		description: 'Mark a ticket as spam',
	},
	'tickets.unmarkSpam': {
		riskLevel: 'write',
		description: 'Clear the spam flag from a ticket',
	},
	'tickets.trash': {
		riskLevel: 'write',
		description:
			'Move a ticket to the trash. It stays restorable until an admin deletes it',
	},
	'tickets.untrash': {
		riskLevel: 'write',
		description: 'Restore a trashed ticket',
	},
	'tickets.assignUser': {
		riskLevel: 'write',
		description:
			'Assign a ticket to a user. If the ticket is already assigned to a team, the user must be a member of it',
	},
	'tickets.unassignUser': {
		riskLevel: 'write',
		description: 'Remove the ticket assignee',
	},
	'tickets.assignTeam': {
		riskLevel: 'write',
		description:
			'Assign a ticket to a team. Reassigning to another team clears the user assignee',
	},
	'tickets.unassignTeam': {
		riskLevel: 'write',
		description: 'Remove the ticket team assignee',
	},
	'tickets.audit': {
		riskLevel: 'read',
		description: 'Read the audit trail of one ticket, oldest action first',
	},
	'tickets.addLabel': {
		riskLevel: 'write',
		description:
			'Add a label to a ticket. The label has to exist on the company first',
	},
	'tickets.removeLabel': {
		riskLevel: 'write',
		description: 'Remove one label from a ticket',
	},
	'replies.list': {
		riskLevel: 'read',
		description: 'List the replies on one ticket',
	},
	'replies.get': {
		riskLevel: 'read',
		description: 'Read one reply on one ticket',
	},
	'replies.create': {
		riskLevel: 'write',
		description:
			'Send a reply to the requester. The mail leaves SupportBee, so this reaches the real customer',
	},
	'comments.list': {
		riskLevel: 'read',
		description: 'List the internal comments on one ticket',
	},
	'comments.create': {
		riskLevel: 'write',
		description:
			'Add an internal comment to a ticket. Only staff see it; the requester is not notified',
	},
	'drafts.get': {
		riskLevel: 'read',
		description:
			'Read the reply draft on a ticket, or a new one quoting the last message when none exists',
	},
	'drafts.create': {
		riskLevel: 'write',
		description: 'Save a reply draft on a ticket',
	},
	'drafts.update': {
		riskLevel: 'write',
		description: 'Replace the reply draft on a ticket',
	},
	'drafts.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete the reply draft on a ticket. The draft text is not returned anywhere afterwards',
	},
	'users.list': {
		riskLevel: 'read',
		description:
			'List the users and customer groups of the desk, optionally with invited members or roles',
	},
	'users.create': {
		riskLevel: 'write',
		description:
			'Create a user or a customer group. A group is a user with type customer_group',
	},
	'users.get': {
		riskLevel: 'read',
		description: 'Read one user or customer group',
	},
	'users.update': {
		riskLevel: 'write',
		description:
			'Change a user name, email, role, teams or group settings. The caller cannot update their own account here',
	},
	'users.listMembers': {
		riskLevel: 'read',
		description: 'List the members of a customer group',
	},
	'users.addMember': {
		riskLevel: 'write',
		description: 'Add a user to a customer group',
	},
	'teams.list': {
		riskLevel: 'read',
		description: 'List the teams of the desk, optionally with their members',
	},
	'attachments.create': {
		riskLevel: 'write',
		description:
			'Upload one file and get the id to attach to a reply, comment, draft or ticket',
	},
	'snippets.list': {
		riskLevel: 'read',
		description: 'List the reply snippets of the desk',
	},
	'snippets.create': {
		riskLevel: 'write',
		description: 'Create a reply snippet with plain text or HTML',
	},
	'snippets.update': {
		riskLevel: 'write',
		description: 'Change a snippet name, tags or content',
	},
	'snippets.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a reply snippet. The text is not returned anywhere afterwards',
	},
	'filters.createRule': {
		riskLevel: 'write',
		description:
			'Create the matching half of a filter. It does nothing until a filter links it to a consequence',
	},
	'filters.createConsequence': {
		riskLevel: 'write',
		description:
			'Create the action half of a filter: archive, spam, trash, label or assign',
	},
	'filters.create': {
		riskLevel: 'write',
		description:
			'Link a rule to a consequence, which is what makes the filter act on matching tickets',
	},
	'emails.list': {
		riskLevel: 'read',
		description: 'List the forwarding addresses that turn mail into tickets',
	},
	'emails.create': {
		riskLevel: 'write',
		description:
			'Add a forwarding address. SupportBee generates the address that mail is forwarded to',
	},
	'reports.avgFirstResponseTime': {
		riskLevel: 'read',
		description:
			'Daily average first-response time, as string data points with timestamps',
	},
	'reports.ticketsCount': {
		riskLevel: 'read',
		description: 'Daily ticket count, as string data points with timestamps',
	},
	'reports.repliesCount': {
		riskLevel: 'read',
		description: 'Daily reply count, as string data points with timestamps',
	},
	'labels.list': {
		riskLevel: 'read',
		description: 'List the company label names and colours',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof supportbeeEndpointsNested
>;

export type BaseSupportbeePlugin<T extends SupportbeePluginOptions> =
	CorsairPlugin<
		'supportbee',
		typeof SupportbeeSchema,
		typeof supportbeeEndpointsNested,
		Record<string, never>,
		T,
		typeof defaultAuthType,
		typeof supportbeeAuthConfig
	>;

export type InternalSupportbeePlugin =
	BaseSupportbeePlugin<SupportbeePluginOptions>;

export type ExternalSupportbeePlugin<T extends SupportbeePluginOptions> =
	BaseSupportbeePlugin<T>;

export function supportbee<const T extends SupportbeePluginOptions>(
	incomingOptions: SupportbeePluginOptions & T = {} as SupportbeePluginOptions &
		T,
): ExternalSupportbeePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	} as SupportbeePluginOptions & T;
	return {
		id: 'supportbee',
		authConfig: supportbeeAuthConfig,
		schema: SupportbeeSchema,
		options,
		hooks: options.hooks,
		endpoints: supportbeeEndpointsNested,
		webhooks: {},
		endpointMeta: supportbeeEndpointMeta,
		endpointSchemas: supportbeeEndpointSchemas,
		// SupportBee can POST to a URL per event, but the target is configured in
		// its dashboard, it signs nothing, and the payload carries no secret to
		// verify, so this plugin does not receive any.
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx, source) => {
			if (source !== 'endpoint') {
				throw new AuthMissingError('supportbee', 'api_key');
			}
			if (options.key) return options.key;
			// A context built without a key manager (a bare `key` option, a unit
			// test) has no `keys` at all, so this is guarded before reading it.
			if (!ctx.keys) throw new AuthMissingError('supportbee', 'api_key');
			const stored = await ctx.keys.get_api_key();
			if (!stored) throw new AuthMissingError('supportbee', 'api_key');
			// The desk is the other half of a connection. A stored token without one
			// is raised here, not in the endpoint: the binder only offers a connect
			// link for an AuthMissingError from the keyBuilder.
			if (!options.company?.trim() && !(await ctx.keys.get_company())?.trim()) {
				throw new AuthMissingError('supportbee', 'api_key');
			}
			return stored;
		},
	} satisfies InternalSupportbeePlugin;
}

export type {
	AttachmentsCreateInput,
	AttachmentsCreateResponse,
	CommentsCreateInput,
	CommentsCreateResponse,
	CommentsListInput,
	CommentsListResponse,
	DraftsCreateInput,
	DraftsCreateResponse,
	DraftsDeleteInput,
	DraftsDeleteResponse,
	DraftsGetInput,
	DraftsGetResponse,
	DraftsUpdateInput,
	DraftsUpdateResponse,
	EmailsCreateInput,
	EmailsCreateResponse,
	EmailsListInput,
	EmailsListResponse,
	FiltersCreateConsequenceInput,
	FiltersCreateConsequenceResponse,
	FiltersCreateInput,
	FiltersCreateResponse,
	FiltersCreateRuleInput,
	FiltersCreateRuleResponse,
	LabelsListInput,
	LabelsListResponse,
	RepliesCreateInput,
	RepliesCreateResponse,
	RepliesGetInput,
	RepliesGetResponse,
	RepliesListInput,
	RepliesListResponse,
	ReportsAvgFirstResponseTimeInput,
	ReportsAvgFirstResponseTimeResponse,
	ReportsRepliesCountInput,
	ReportsRepliesCountResponse,
	ReportsTicketsCountInput,
	ReportsTicketsCountResponse,
	SnippetsCreateInput,
	SnippetsCreateResponse,
	SnippetsDeleteInput,
	SnippetsDeleteResponse,
	SnippetsListInput,
	SnippetsListResponse,
	SnippetsUpdateInput,
	SnippetsUpdateResponse,
	SupportbeeEndpointInputs,
	SupportbeeEndpointOutputs,
	TeamsListInput,
	TeamsListResponse,
	TicketsAddLabelInput,
	TicketsAddLabelResponse,
	TicketsArchiveInput,
	TicketsArchiveResponse,
	TicketsAssignTeamInput,
	TicketsAssignTeamResponse,
	TicketsAssignUserInput,
	TicketsAssignUserResponse,
	TicketsAuditInput,
	TicketsAuditResponse,
	TicketsCreateInput,
	TicketsCreateResponse,
	TicketsDeleteInput,
	TicketsDeleteResponse,
	TicketsGetInput,
	TicketsGetResponse,
	TicketsListInput,
	TicketsListResponse,
	TicketsMarkAnsweredInput,
	TicketsMarkAnsweredResponse,
	TicketsMarkSpamInput,
	TicketsMarkSpamResponse,
	TicketsMarkUnansweredInput,
	TicketsMarkUnansweredResponse,
	TicketsRemoveLabelInput,
	TicketsRemoveLabelResponse,
	TicketsSearchInput,
	TicketsSearchResponse,
	TicketsTrashInput,
	TicketsTrashResponse,
	TicketsUnarchiveInput,
	TicketsUnarchiveResponse,
	TicketsUnassignTeamInput,
	TicketsUnassignTeamResponse,
	TicketsUnassignUserInput,
	TicketsUnassignUserResponse,
	TicketsUnmarkSpamInput,
	TicketsUnmarkSpamResponse,
	TicketsUntrashInput,
	TicketsUntrashResponse,
	UsersAddMemberInput,
	UsersAddMemberResponse,
	UsersCreateInput,
	UsersCreateResponse,
	UsersGetInput,
	UsersGetResponse,
	UsersListInput,
	UsersListMembersInput,
	UsersListMembersResponse,
	UsersListResponse,
	UsersUpdateInput,
	UsersUpdateResponse,
} from './endpoints/types';
