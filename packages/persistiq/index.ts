import type {
	AuthTypes,
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
	Campaigns,
	DncDomains,
	Events,
	LeadFields,
	LeadStatuses,
	Leads,
	Tags,
	Users,
	Webhooks,
} from './endpoints';
import type {
	PersistiqEndpointInputs,
	PersistiqEndpointOutputs,
} from './endpoints/types';
import {
	PersistiqEndpointInputSchemas,
	PersistiqEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { PersistiqSchema } from './schema';

export type PersistiqPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalPersistiqPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof persistiqEndpointsNested>;
};

export type PersistiqContext = CorsairPluginContext<
	typeof PersistiqSchema,
	PersistiqPluginOptions,
	undefined,
	typeof persistiqAuthConfig
>;

export type PersistiqKeyBuilderContext = KeyBuilderContext<
	PersistiqPluginOptions,
	typeof persistiqAuthConfig
>;

export type PersistiqBoundEndpoints = BindEndpoints<
	typeof persistiqEndpointsNested
>;

type PersistiqEndpoint<K extends keyof PersistiqEndpointOutputs> =
	CorsairEndpoint<
		PersistiqContext,
		PersistiqEndpointInputs[K],
		PersistiqEndpointOutputs[K]
	>;

export type PersistiqEndpoints = {
	[K in keyof PersistiqEndpointOutputs]: PersistiqEndpoint<K>;
};

const persistiqEndpointsNested = {
	users: {
		list: Users.list,
	},
	leads: {
		list: Leads.list,
		create: Leads.create,
		get: Leads.get,
		update: Leads.update,
	},
	campaigns: {
		list: Campaigns.list,
		create: Campaigns.create,
		duplicate: Campaigns.duplicate,
		listLeads: Campaigns.listLeads,
		addLead: Campaigns.addLead,
		removeLead: Campaigns.removeLead,
		listReplies: Campaigns.listReplies,
		replyToMessage: Campaigns.replyToMessage,
	},
	leadFields: {
		list: LeadFields.list,
	},
	leadStatuses: {
		list: LeadStatuses.list,
	},
	tags: {
		list: Tags.list,
	},
	dncDomains: {
		list: DncDomains.list,
		create: DncDomains.create,
	},
	events: {
		list: Events.list,
	},
	webhooks: {
		getSettings: Webhooks.getSettings,
		updateSettings: Webhooks.updateSettings,
	},
} as const;

export const persistiqEndpointSchemas = {
	'users.list': {
		input: PersistiqEndpointInputSchemas.usersList,
		output: PersistiqEndpointOutputSchemas.usersList,
	},
	'leads.list': {
		input: PersistiqEndpointInputSchemas.leadsList,
		output: PersistiqEndpointOutputSchemas.leadsList,
	},
	'leads.create': {
		input: PersistiqEndpointInputSchemas.leadsCreate,
		output: PersistiqEndpointOutputSchemas.leadsCreate,
	},
	'leads.get': {
		input: PersistiqEndpointInputSchemas.leadsGet,
		output: PersistiqEndpointOutputSchemas.leadsGet,
	},
	'leads.update': {
		input: PersistiqEndpointInputSchemas.leadsUpdate,
		output: PersistiqEndpointOutputSchemas.leadsUpdate,
	},
	'campaigns.list': {
		input: PersistiqEndpointInputSchemas.campaignsList,
		output: PersistiqEndpointOutputSchemas.campaignsList,
	},
	'campaigns.create': {
		input: PersistiqEndpointInputSchemas.campaignsCreate,
		output: PersistiqEndpointOutputSchemas.campaignsCreate,
	},
	'campaigns.duplicate': {
		input: PersistiqEndpointInputSchemas.campaignsDuplicate,
		output: PersistiqEndpointOutputSchemas.campaignsDuplicate,
	},
	'campaigns.listLeads': {
		input: PersistiqEndpointInputSchemas.campaignsListLeads,
		output: PersistiqEndpointOutputSchemas.campaignsListLeads,
	},
	'campaigns.addLead': {
		input: PersistiqEndpointInputSchemas.campaignsAddLead,
		output: PersistiqEndpointOutputSchemas.campaignsAddLead,
	},
	'campaigns.removeLead': {
		input: PersistiqEndpointInputSchemas.campaignsRemoveLead,
		output: PersistiqEndpointOutputSchemas.campaignsRemoveLead,
	},
	'campaigns.listReplies': {
		input: PersistiqEndpointInputSchemas.campaignsListReplies,
		output: PersistiqEndpointOutputSchemas.campaignsListReplies,
	},
	'campaigns.replyToMessage': {
		input: PersistiqEndpointInputSchemas.campaignsReplyToMessage,
		output: PersistiqEndpointOutputSchemas.campaignsReplyToMessage,
	},
	'leadFields.list': {
		input: PersistiqEndpointInputSchemas.leadFieldsList,
		output: PersistiqEndpointOutputSchemas.leadFieldsList,
	},
	'leadStatuses.list': {
		input: PersistiqEndpointInputSchemas.leadStatusesList,
		output: PersistiqEndpointOutputSchemas.leadStatusesList,
	},
	'tags.list': {
		input: PersistiqEndpointInputSchemas.tagsList,
		output: PersistiqEndpointOutputSchemas.tagsList,
	},
	'dncDomains.list': {
		input: PersistiqEndpointInputSchemas.dncDomainsList,
		output: PersistiqEndpointOutputSchemas.dncDomainsList,
	},
	'dncDomains.create': {
		input: PersistiqEndpointInputSchemas.dncDomainsCreate,
		output: PersistiqEndpointOutputSchemas.dncDomainsCreate,
	},
	'events.list': {
		input: PersistiqEndpointInputSchemas.eventsList,
		output: PersistiqEndpointOutputSchemas.eventsList,
	},
	'webhooks.getSettings': {
		input: PersistiqEndpointInputSchemas.webhooksGetSettings,
		output: PersistiqEndpointOutputSchemas.webhooksGetSettings,
	},
	'webhooks.updateSettings': {
		input: PersistiqEndpointInputSchemas.webhooksUpdateSettings,
		output: PersistiqEndpointOutputSchemas.webhooksUpdateSettings,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof persistiqEndpointsNested
>;

const persistiqEndpointMeta = {
	'users.list': {
		riskLevel: 'read',
		description: 'List the team members',
	},
	'leads.list': {
		riskLevel: 'read',
		description: 'List leads, paged by cursor',
	},
	'leads.create': {
		riskLevel: 'write',
		description: 'Create a lead with its attributes',
	},
	'leads.get': {
		riskLevel: 'read',
		description: 'Read one lead by id',
	},
	'leads.update': {
		riskLevel: 'write',
		description: 'Update a lead attributes map',
	},
	'campaigns.list': {
		riskLevel: 'read',
		description: 'List the campaigns',
	},
	'campaigns.create': {
		riskLevel: 'write',
		description: 'Create a campaign',
	},
	'campaigns.duplicate': {
		riskLevel: 'write',
		description: 'Duplicate a campaign',
	},
	'campaigns.listLeads': {
		riskLevel: 'read',
		description: 'List the leads in a campaign',
	},
	'campaigns.addLead': {
		riskLevel: 'write',
		description: 'Add a lead to a campaign',
	},
	'campaigns.removeLead': {
		riskLevel: 'write',
		description: 'Remove a lead from a campaign',
	},
	'campaigns.listReplies': {
		riskLevel: 'read',
		description: 'List the replies in a campaign',
	},
	'campaigns.replyToMessage': {
		riskLevel: 'destructive',
		description:
			'Reply to an inbox message; the email goes out and cannot be recalled',
		irreversible: true,
	},
	'leadFields.list': {
		riskLevel: 'read',
		description: 'List the lead field definitions',
	},
	'leadStatuses.list': {
		riskLevel: 'read',
		description: 'List the lead status vocabulary',
	},
	'tags.list': {
		riskLevel: 'read',
		description: 'List the tags',
	},
	'dncDomains.list': {
		riskLevel: 'read',
		description: 'List the do-not-contact domains',
	},
	'dncDomains.create': {
		riskLevel: 'write',
		description: 'Add a domain to the do-not-contact list; emails to it stop',
	},
	'events.list': {
		riskLevel: 'read',
		description: 'List activity events, paged by cursor',
	},
	'webhooks.getSettings': {
		riskLevel: 'read',
		description: 'Read the webhook plugin settings',
	},
	'webhooks.updateSettings': {
		riskLevel: 'write',
		description: 'Update the webhook plugin delivery URL and active state',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof persistiqEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

export const persistiqAuthConfig = {
	api_key: {
		// PersistIQ issues one API key per workspace; no account-level field
		// is needed beside it.
		account: [] as const,
	},
} as const satisfies PluginAuthConfig;

export type BasePersistiqPlugin<T extends PersistiqPluginOptions> =
	CorsairPlugin<
		'persistiq',
		typeof PersistiqSchema,
		typeof persistiqEndpointsNested,
		{},
		T,
		typeof defaultAuthType,
		typeof persistiqAuthConfig
	>;

export type InternalPersistiqPlugin =
	BasePersistiqPlugin<PersistiqPluginOptions>;

export type ExternalPersistiqPlugin<T extends PersistiqPluginOptions> =
	BasePersistiqPlugin<T>;

export function persistiq<const T extends PersistiqPluginOptions>(
	incomingOptions: PersistiqPluginOptions & T = {} as PersistiqPluginOptions &
		T,
): ExternalPersistiqPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'persistiq',
		authConfig: persistiqAuthConfig,
		schema: PersistiqSchema,
		options: options,
		hooks: options.hooks,
		endpoints: persistiqEndpointsNested,
		webhooks: {},
		endpointMeta: persistiqEndpointMeta,
		endpointSchemas: persistiqEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: PersistiqKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('persistiq', ctx.authType ?? 'api_key');
		},
	} satisfies InternalPersistiqPlugin;
}

export { PersistiqAPIError } from './client';

export type {
	Campaign,
	Deleted,
	Event,
	Lead,
	PersistiqEndpointInputs,
	PersistiqEndpointOutputs,
	Reply,
	WebhookSettings,
} from './endpoints/types';
