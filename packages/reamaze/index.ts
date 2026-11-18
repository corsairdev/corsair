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
	ArticlesEndpoints,
	ChannelsEndpoints,
	ContactsEndpoints,
	ConversationsEndpoints,
	IdentitiesEndpoints,
	IncidentsEndpoints,
	MessagesEndpoints,
	NotesEndpoints,
	ReportsEndpoints,
	ResponseTemplatesEndpoints,
	SatisfactionEndpoints,
	StaffEndpoints,
	SystemsEndpoints,
} from './endpoints';
import type {
	ReamazeEndpointInputs,
	ReamazeEndpointOutputs,
} from './endpoints/types';
import {
	ReamazeEndpointInputSchemas,
	ReamazeEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { ReamazeSchema } from './schema';

export type ReamazePluginOptions = {
	authType?: PickAuth<'api_key'>;
	/**
	 * The brand, as `acme.reamaze.io` or just `acme`. Re:amaze has no shared API
	 * host, so either this or a stored `host` key is required. Requests only go
	 * to `https://{brand}.reamaze.io`; any other domain is rejected.
	 */
	host?: string;
	/** A login email and API token already joined as `{"email":...,"token":...}`. */
	key?: string;
	hooks?: InternalReamazePlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof reamazeEndpointsNested>;
};

export type ReamazeContext = CorsairPluginContext<
	typeof ReamazeSchema,
	ReamazePluginOptions,
	undefined,
	typeof reamazeAuthConfig
>;

export type ReamazeKeyBuilderContext = KeyBuilderContext<
	ReamazePluginOptions,
	typeof reamazeAuthConfig
>;

export type ReamazeBoundEndpoints = BindEndpoints<
	typeof reamazeEndpointsNested
>;

type ReamazeEndpoint<K extends keyof ReamazeEndpointOutputs> = CorsairEndpoint<
	ReamazeContext,
	ReamazeEndpointInputs[K],
	ReamazeEndpointOutputs[K]
>;

export type ReamazeEndpoints = {
	conversationsList: ReamazeEndpoint<'conversationsList'>;
	conversationsGet: ReamazeEndpoint<'conversationsGet'>;
	conversationsCreate: ReamazeEndpoint<'conversationsCreate'>;
	conversationsUpdate: ReamazeEndpoint<'conversationsUpdate'>;
	messagesList: ReamazeEndpoint<'messagesList'>;
	messagesCreate: ReamazeEndpoint<'messagesCreate'>;
	contactsList: ReamazeEndpoint<'contactsList'>;
	contactsCreate: ReamazeEndpoint<'contactsCreate'>;
	contactsUpdate: ReamazeEndpoint<'contactsUpdate'>;
	identitiesList: ReamazeEndpoint<'identitiesList'>;
	identitiesCreate: ReamazeEndpoint<'identitiesCreate'>;
	notesList: ReamazeEndpoint<'notesList'>;
	notesCreate: ReamazeEndpoint<'notesCreate'>;
	notesUpdate: ReamazeEndpoint<'notesUpdate'>;
	notesDelete: ReamazeEndpoint<'notesDelete'>;
	channelsList: ReamazeEndpoint<'channelsList'>;
	channelsGet: ReamazeEndpoint<'channelsGet'>;
	articlesList: ReamazeEndpoint<'articlesList'>;
	articlesGet: ReamazeEndpoint<'articlesGet'>;
	articlesCreate: ReamazeEndpoint<'articlesCreate'>;
	articlesUpdate: ReamazeEndpoint<'articlesUpdate'>;
	reportsVolume: ReamazeEndpoint<'reportsVolume'>;
	reportsResponseTime: ReamazeEndpoint<'reportsResponseTime'>;
	reportsStaff: ReamazeEndpoint<'reportsStaff'>;
	reportsTags: ReamazeEndpoint<'reportsTags'>;
	reportsChannelSummary: ReamazeEndpoint<'reportsChannelSummary'>;
	responseTemplatesList: ReamazeEndpoint<'responseTemplatesList'>;
	responseTemplatesGet: ReamazeEndpoint<'responseTemplatesGet'>;
	responseTemplatesCreate: ReamazeEndpoint<'responseTemplatesCreate'>;
	responseTemplatesUpdate: ReamazeEndpoint<'responseTemplatesUpdate'>;
	staffList: ReamazeEndpoint<'staffList'>;
	staffCreate: ReamazeEndpoint<'staffCreate'>;
	satisfactionRatingsList: ReamazeEndpoint<'satisfactionRatingsList'>;
	incidentsList: ReamazeEndpoint<'incidentsList'>;
	incidentsGet: ReamazeEndpoint<'incidentsGet'>;
	incidentsCreate: ReamazeEndpoint<'incidentsCreate'>;
	incidentsUpdate: ReamazeEndpoint<'incidentsUpdate'>;
	systemsList: ReamazeEndpoint<'systemsList'>;
};

const reamazeEndpointsNested = {
	conversations: ConversationsEndpoints,
	messages: MessagesEndpoints,
	contacts: ContactsEndpoints,
	identities: IdentitiesEndpoints,
	notes: NotesEndpoints,
	channels: ChannelsEndpoints,
	articles: ArticlesEndpoints,
	reports: ReportsEndpoints,
	responseTemplates: ResponseTemplatesEndpoints,
	staff: StaffEndpoints,
	satisfaction: SatisfactionEndpoints,
	incidents: IncidentsEndpoints,
	systems: SystemsEndpoints,
} as const;

export const reamazeEndpointSchemas = {
	'conversations.list': {
		input: ReamazeEndpointInputSchemas.conversationsList,
		output: ReamazeEndpointOutputSchemas.conversationsList,
	},
	'conversations.get': {
		input: ReamazeEndpointInputSchemas.conversationsGet,
		output: ReamazeEndpointOutputSchemas.conversationsGet,
	},
	'conversations.create': {
		input: ReamazeEndpointInputSchemas.conversationsCreate,
		output: ReamazeEndpointOutputSchemas.conversationsCreate,
	},
	'conversations.update': {
		input: ReamazeEndpointInputSchemas.conversationsUpdate,
		output: ReamazeEndpointOutputSchemas.conversationsUpdate,
	},
	'messages.list': {
		input: ReamazeEndpointInputSchemas.messagesList,
		output: ReamazeEndpointOutputSchemas.messagesList,
	},
	'messages.create': {
		input: ReamazeEndpointInputSchemas.messagesCreate,
		output: ReamazeEndpointOutputSchemas.messagesCreate,
	},
	'contacts.list': {
		input: ReamazeEndpointInputSchemas.contactsList,
		output: ReamazeEndpointOutputSchemas.contactsList,
	},
	'contacts.create': {
		input: ReamazeEndpointInputSchemas.contactsCreate,
		output: ReamazeEndpointOutputSchemas.contactsCreate,
	},
	'contacts.update': {
		input: ReamazeEndpointInputSchemas.contactsUpdate,
		output: ReamazeEndpointOutputSchemas.contactsUpdate,
	},
	'identities.list': {
		input: ReamazeEndpointInputSchemas.identitiesList,
		output: ReamazeEndpointOutputSchemas.identitiesList,
	},
	'identities.create': {
		input: ReamazeEndpointInputSchemas.identitiesCreate,
		output: ReamazeEndpointOutputSchemas.identitiesCreate,
	},
	'notes.list': {
		input: ReamazeEndpointInputSchemas.notesList,
		output: ReamazeEndpointOutputSchemas.notesList,
	},
	'notes.create': {
		input: ReamazeEndpointInputSchemas.notesCreate,
		output: ReamazeEndpointOutputSchemas.notesCreate,
	},
	'notes.update': {
		input: ReamazeEndpointInputSchemas.notesUpdate,
		output: ReamazeEndpointOutputSchemas.notesUpdate,
	},
	'notes.delete': {
		input: ReamazeEndpointInputSchemas.notesDelete,
		output: ReamazeEndpointOutputSchemas.notesDelete,
	},
	'channels.list': {
		input: ReamazeEndpointInputSchemas.channelsList,
		output: ReamazeEndpointOutputSchemas.channelsList,
	},
	'channels.get': {
		input: ReamazeEndpointInputSchemas.channelsGet,
		output: ReamazeEndpointOutputSchemas.channelsGet,
	},
	'articles.list': {
		input: ReamazeEndpointInputSchemas.articlesList,
		output: ReamazeEndpointOutputSchemas.articlesList,
	},
	'articles.get': {
		input: ReamazeEndpointInputSchemas.articlesGet,
		output: ReamazeEndpointOutputSchemas.articlesGet,
	},
	'articles.create': {
		input: ReamazeEndpointInputSchemas.articlesCreate,
		output: ReamazeEndpointOutputSchemas.articlesCreate,
	},
	'articles.update': {
		input: ReamazeEndpointInputSchemas.articlesUpdate,
		output: ReamazeEndpointOutputSchemas.articlesUpdate,
	},
	'reports.volume': {
		input: ReamazeEndpointInputSchemas.reportsVolume,
		output: ReamazeEndpointOutputSchemas.reportsVolume,
	},
	'reports.responseTime': {
		input: ReamazeEndpointInputSchemas.reportsResponseTime,
		output: ReamazeEndpointOutputSchemas.reportsResponseTime,
	},
	'reports.staff': {
		input: ReamazeEndpointInputSchemas.reportsStaff,
		output: ReamazeEndpointOutputSchemas.reportsStaff,
	},
	'reports.tags': {
		input: ReamazeEndpointInputSchemas.reportsTags,
		output: ReamazeEndpointOutputSchemas.reportsTags,
	},
	'reports.channelSummary': {
		input: ReamazeEndpointInputSchemas.reportsChannelSummary,
		output: ReamazeEndpointOutputSchemas.reportsChannelSummary,
	},
	'responseTemplates.list': {
		input: ReamazeEndpointInputSchemas.responseTemplatesList,
		output: ReamazeEndpointOutputSchemas.responseTemplatesList,
	},
	'responseTemplates.get': {
		input: ReamazeEndpointInputSchemas.responseTemplatesGet,
		output: ReamazeEndpointOutputSchemas.responseTemplatesGet,
	},
	'responseTemplates.create': {
		input: ReamazeEndpointInputSchemas.responseTemplatesCreate,
		output: ReamazeEndpointOutputSchemas.responseTemplatesCreate,
	},
	'responseTemplates.update': {
		input: ReamazeEndpointInputSchemas.responseTemplatesUpdate,
		output: ReamazeEndpointOutputSchemas.responseTemplatesUpdate,
	},
	'staff.list': {
		input: ReamazeEndpointInputSchemas.staffList,
		output: ReamazeEndpointOutputSchemas.staffList,
	},
	'staff.create': {
		input: ReamazeEndpointInputSchemas.staffCreate,
		output: ReamazeEndpointOutputSchemas.staffCreate,
	},
	'satisfaction.list': {
		input: ReamazeEndpointInputSchemas.satisfactionRatingsList,
		output: ReamazeEndpointOutputSchemas.satisfactionRatingsList,
	},
	'incidents.list': {
		input: ReamazeEndpointInputSchemas.incidentsList,
		output: ReamazeEndpointOutputSchemas.incidentsList,
	},
	'incidents.get': {
		input: ReamazeEndpointInputSchemas.incidentsGet,
		output: ReamazeEndpointOutputSchemas.incidentsGet,
	},
	'incidents.create': {
		input: ReamazeEndpointInputSchemas.incidentsCreate,
		output: ReamazeEndpointOutputSchemas.incidentsCreate,
	},
	'incidents.update': {
		input: ReamazeEndpointInputSchemas.incidentsUpdate,
		output: ReamazeEndpointOutputSchemas.incidentsUpdate,
	},
	'systems.list': {
		input: ReamazeEndpointInputSchemas.systemsList,
		output: ReamazeEndpointOutputSchemas.systemsList,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof reamazeEndpointsNested
>;

const defaultAuthType: 'api_key' = 'api_key';

/**
 * Re:amaze authenticates with **HTTP Basic**: the user's login email and their
 * personal API token are both required. They are account-level fields with a
 * JSON-encoded pair in `api_key`, because `keyBuilder` returns a single string
 * and `get_host`-style accessors only exist for fields declared here.
 *
 * `host` is an account field too: it is per-brand, and the resolver reads it
 * from the same manager. A tenant controls that value, so it is only ever used
 * as a brand name under `reamaze.io` (see `normalizeReamazeHost`).
 */
export const reamazeAuthConfig = {
	api_key: {
		// `webhook_signature` is already an api_key base field, so declaring it
		// again would duplicate it; only the brand host is plugin-specific.
		account: ['host'] as const,
	},
} as const satisfies PluginAuthConfig;

const reamazeEndpointMeta = {
	'conversations.list': {
		riskLevel: 'read',
		description:
			'List conversations, filtered by status, assignee, tag, channel, origin or date',
	},
	'conversations.get': {
		riskLevel: 'read',
		description:
			'Read one conversation by slug, reference id, or origin id within a channel',
	},
	'conversations.create': {
		riskLevel: 'write',
		description:
			'Create a conversation on behalf of a customer, with its first message',
	},
	'conversations.update': {
		riskLevel: 'write',
		description:
			'Change a conversation status, tags, assignee, data attributes or channel',
	},
	'messages.list': {
		riskLevel: 'read',
		description:
			'List messages across the brand, filtered by sender, tag, channel or date',
	},
	'messages.create': {
		riskLevel: 'write',
		description:
			'Send a reply in a conversation. It goes out to the real customer and the other participants unless suppress_notifications is set. visibility 1 posts an internal note only staff see',
	},
	'contacts.list': {
		riskLevel: 'read',
		description:
			'List contacts, filtered by search text, type or data attributes',
	},
	'contacts.create': {
		riskLevel: 'write',
		description: 'Create a contact for the account',
	},
	'contacts.update': {
		riskLevel: 'write',
		description:
			'Change a contact name, friendly name, avatar or data attributes, and append notes',
	},
	'identities.list': {
		riskLevel: 'read',
		description:
			'List the emails, handles and phone numbers attached to a contact',
	},
	'identities.create': {
		riskLevel: 'write',
		description:
			'Attach an identity to a contact. An identity already on another contact is moved here with its messages',
	},
	'notes.list': {
		riskLevel: 'read',
		description: 'List the notes on one contact',
	},
	'notes.create': {
		riskLevel: 'write',
		description: 'Add a note to one contact',
	},
	'notes.update': {
		riskLevel: 'write',
		description: 'Replace the text of one contact note',
	},
	'notes.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete one contact note. Re:amaze keeps no undo and the note text is not returned anywhere afterwards',
	},
	'channels.list': {
		riskLevel: 'read',
		description: 'List the brand channels, optionally by type',
	},
	'channels.get': {
		riskLevel: 'read',
		description: 'Read one channel by slug',
	},
	'articles.list': {
		riskLevel: 'read',
		description: 'List help center articles, filtered by status or search text',
	},
	'articles.get': {
		riskLevel: 'read',
		description: 'Read one help center article by slug',
	},
	'articles.create': {
		riskLevel: 'write',
		description: 'Create a help center article under a topic',
	},
	'articles.update': {
		riskLevel: 'write',
		description: 'Change an article title, body, status or topic',
	},
	'reports.volume': {
		riskLevel: 'read',
		description: 'Daily conversation volume over a date range',
	},
	'reports.responseTime': {
		riskLevel: 'read',
		description:
			'Daily first-response time in seconds, with averages and ratios',
	},
	'reports.staff': {
		riskLevel: 'read',
		description: 'Per-staff response counts, response time and appreciations',
	},
	'reports.tags': {
		riskLevel: 'read',
		description: 'Tag usage counts over a date range',
	},
	'reports.channelSummary': {
		riskLevel: 'read',
		description:
			'Per-channel response counts, response time, satisfaction and thread size',
	},
	'responseTemplates.list': {
		riskLevel: 'read',
		description: 'List response templates, filtered by search text',
	},
	'responseTemplates.get': {
		riskLevel: 'read',
		description: 'Read one response template by id',
	},
	'responseTemplates.create': {
		riskLevel: 'write',
		description: 'Create a response template',
	},
	'responseTemplates.update': {
		riskLevel: 'write',
		description: 'Change a response template name or body',
	},
	'staff.list': {
		riskLevel: 'read',
		description: 'List staff users, oldest first',
	},
	'staff.create': {
		riskLevel: 'write',
		description:
			'Create a staff user, which counts toward the monthly subscription. No invite email is sent',
	},
	'satisfaction.list': {
		riskLevel: 'read',
		description:
			'List satisfaction survey ratings, filtered by brand, rating or date',
	},
	'incidents.list': {
		riskLevel: 'read',
		description: 'List status page incidents',
	},
	'incidents.get': {
		riskLevel: 'read',
		description: 'Read one status page incident by id',
	},
	'incidents.create': {
		riskLevel: 'write',
		description:
			'Create a status page incident with its first update, which shows on the public status page',
	},
	'incidents.update': {
		riskLevel: 'write',
		description:
			'Change a status page incident and append an update, which shows on the public status page',
	},
	'systems.list': {
		riskLevel: 'read',
		description: 'List the status page systems and their current status',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof reamazeEndpointsNested>;

export type BaseReamazePlugin<T extends ReamazePluginOptions> = CorsairPlugin<
	'reamaze',
	typeof ReamazeSchema,
	typeof reamazeEndpointsNested,
	Record<string, never>,
	T,
	typeof defaultAuthType,
	typeof reamazeAuthConfig
>;

export type InternalReamazePlugin = BaseReamazePlugin<ReamazePluginOptions>;

export type ExternalReamazePlugin<T extends ReamazePluginOptions> =
	BaseReamazePlugin<T>;

export function reamaze<const T extends ReamazePluginOptions>(
	incomingOptions: ReamazePluginOptions & T = {} as ReamazePluginOptions & T,
): ExternalReamazePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	} as ReamazePluginOptions & T;
	return {
		id: 'reamaze',
		authConfig: reamazeAuthConfig,
		schema: ReamazeSchema,
		options,
		hooks: options.hooks,
		endpoints: reamazeEndpointsNested,
		webhooks: {},
		endpointMeta: reamazeEndpointMeta,
		endpointSchemas: reamazeEndpointSchemas,
		// Re:amaze can deliver webhooks, but the events are configured per brand
		// in its dashboard and this plugin has no signature scheme to verify, so
		// it does not receive any.
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx, source) => {
			if (source !== 'endpoint') {
				throw new AuthMissingError('reamaze', 'api_key');
			}
			if (options.key) return options.key;
			// A context built without a key manager (a bare `key` option, a unit
			// test) has no `keys` at all, so this is guarded before reading it.
			if (!ctx.keys) throw new AuthMissingError('reamaze', 'api_key');
			const stored = await ctx.keys.get_api_key();
			if (!stored) throw new AuthMissingError('reamaze', 'api_key');
			// The brand host is the other half of a connection. A stored pair
			// without one is raised here, not in the endpoint: the binder only
			// offers a connect link for an AuthMissingError from the keyBuilder.
			if (!options.host?.trim() && !(await ctx.keys.get_host())?.trim()) {
				throw new AuthMissingError('reamaze', 'api_key');
			}
			return stored;
		},
	} satisfies InternalReamazePlugin;
}

export type {
	ArticlesCreateInput,
	ArticlesCreateResponse,
	ArticlesGetInput,
	ArticlesGetResponse,
	ArticlesListInput,
	ArticlesListResponse,
	ArticlesUpdateInput,
	ArticlesUpdateResponse,
	ChannelsGetInput,
	ChannelsGetResponse,
	ChannelsListInput,
	ChannelsListResponse,
	ContactsCreateInput,
	ContactsCreateResponse,
	ContactsListInput,
	ContactsListResponse,
	ContactsUpdateInput,
	ContactsUpdateResponse,
	ConversationsCreateInput,
	ConversationsCreateResponse,
	ConversationsGetInput,
	ConversationsGetResponse,
	ConversationsListInput,
	ConversationsListResponse,
	ConversationsUpdateInput,
	ConversationsUpdateResponse,
	IdentitiesCreateInput,
	IdentitiesCreateResponse,
	IdentitiesListInput,
	IdentitiesListResponse,
	IncidentsCreateInput,
	IncidentsCreateResponse,
	IncidentsGetInput,
	IncidentsGetResponse,
	IncidentsListInput,
	IncidentsListResponse,
	IncidentsUpdateInput,
	IncidentsUpdateResponse,
	MessagesCreateInput,
	MessagesCreateResponse,
	MessagesListInput,
	MessagesListResponse,
	NotesCreateInput,
	NotesCreateResponse,
	NotesDeleteInput,
	NotesDeleteResponse,
	NotesListInput,
	NotesListResponse,
	NotesUpdateInput,
	NotesUpdateResponse,
	ReamazeEndpointInputs,
	ReamazeEndpointOutputs,
	ReportsChannelSummaryInput,
	ReportsChannelSummaryResponse,
	ReportsResponseTimeInput,
	ReportsResponseTimeResponse,
	ReportsStaffInput,
	ReportsStaffResponse,
	ReportsTagsInput,
	ReportsTagsResponse,
	ReportsVolumeInput,
	ReportsVolumeResponse,
	ResponseTemplatesCreateInput,
	ResponseTemplatesCreateResponse,
	ResponseTemplatesGetInput,
	ResponseTemplatesGetResponse,
	ResponseTemplatesListInput,
	ResponseTemplatesListResponse,
	ResponseTemplatesUpdateInput,
	ResponseTemplatesUpdateResponse,
	SatisfactionRatingsListInput,
	SatisfactionRatingsListResponse,
	StaffCreateInput,
	StaffCreateResponse,
	StaffListInput,
	StaffListResponse,
	SystemsListInput,
	SystemsListResponse,
} from './endpoints/types';
