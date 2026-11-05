import type {
	AuthTypes,
	BindEndpoints,
	BindWebhooks,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	CorsairWebhook,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import {
	Accounts,
	Clients,
	Projects,
	Reports,
	Tags,
	Teams,
	TimeEntries,
	Users,
} from './endpoints';
import type {
	TimelyEndpointInputs,
	TimelyEndpointOutputs,
} from './endpoints/types';
import {
	TimelyEndpointInputSchemas,
	TimelyEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { TimelySchema } from './schema';
import { TimelyWebhooks as TimelyWebhookHandlers } from './webhooks';
import { resolveTimelyOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchTimelyTenantWebhook } from './webhooks/tenant-matcher';
import type {
	TimelyWebhookEvent,
	TimelyWebhookOutputs,
} from './webhooks/types';
import { createTimelyMatch, TimelyWebhookEventSchema } from './webhooks/types';

export type TimelyPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalTimelyPlugin['hooks'];
	webhookHooks?: InternalTimelyPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof timelyEndpointsNested>;
};

export type TimelyContext = CorsairPluginContext<
	typeof TimelySchema,
	TimelyPluginOptions
>;

export type TimelyKeyBuilderContext = KeyBuilderContext<TimelyPluginOptions>;

export type TimelyBoundEndpoints = BindEndpoints<typeof timelyEndpointsNested>;

type TimelyEndpoint<K extends keyof TimelyEndpointOutputs> = CorsairEndpoint<
	TimelyContext,
	TimelyEndpointInputs[K],
	TimelyEndpointOutputs[K]
>;

export type TimelyEndpoints = {
	accountsList: TimelyEndpoint<'accountsList'>;
	accountsGet: TimelyEndpoint<'accountsGet'>;
	clientsList: TimelyEndpoint<'clientsList'>;
	clientsGet: TimelyEndpoint<'clientsGet'>;
	projectsList: TimelyEndpoint<'projectsList'>;
	projectsGet: TimelyEndpoint<'projectsGet'>;
	usersList: TimelyEndpoint<'usersList'>;
	usersGet: TimelyEndpoint<'usersGet'>;
	teamsList: TimelyEndpoint<'teamsList'>;
	teamsGet: TimelyEndpoint<'teamsGet'>;
	tagsList: TimelyEndpoint<'tagsList'>;
	tagsGet: TimelyEndpoint<'tagsGet'>;
	timeEntriesList: TimelyEndpoint<'timeEntriesList'>;
	timeEntriesGet: TimelyEndpoint<'timeEntriesGet'>;
	reportsList: TimelyEndpoint<'reportsList'>;
	reportsGet: TimelyEndpoint<'reportsGet'>;
};

type TimelyWebhook<
	K extends keyof TimelyWebhookOutputs,
	TEvent,
> = CorsairWebhook<TimelyContext, TEvent, TimelyWebhookOutputs[K]>;

export type TimelyWebhooks = {
	event: TimelyWebhook<'event', TimelyWebhookEvent>;
};

export type TimelyBoundWebhooks = BindWebhooks<TimelyWebhooks>;

const timelyEndpointsNested = {
	accounts: {
		list: Accounts.list,
		get: Accounts.get,
	},
	clients: {
		list: Clients.list,
		get: Clients.get,
	},
	projects: {
		list: Projects.list,
		get: Projects.get,
	},
	users: {
		list: Users.list,
		get: Users.get,
	},
	teams: {
		list: Teams.list,
		get: Teams.get,
	},
	tags: {
		list: Tags.list,
		get: Tags.get,
	},
	timeEntries: {
		list: TimeEntries.list,
		get: TimeEntries.get,
	},
	reports: {
		list: Reports.list,
		get: Reports.get,
	},
} as const;

const timelyWebhooksNested = {
	event: {
		event: TimelyWebhookHandlers.event,
	},
} as const;

export const timelyEndpointSchemas = {
	'accounts.list': {
		input: TimelyEndpointInputSchemas.accountsList,
		output: TimelyEndpointOutputSchemas.accountsList,
	},
	'accounts.get': {
		input: TimelyEndpointInputSchemas.accountsGet,
		output: TimelyEndpointOutputSchemas.accountsGet,
	},
	'clients.list': {
		input: TimelyEndpointInputSchemas.clientsList,
		output: TimelyEndpointOutputSchemas.clientsList,
	},
	'clients.get': {
		input: TimelyEndpointInputSchemas.clientsGet,
		output: TimelyEndpointOutputSchemas.clientsGet,
	},
	'projects.list': {
		input: TimelyEndpointInputSchemas.projectsList,
		output: TimelyEndpointOutputSchemas.projectsList,
	},
	'projects.get': {
		input: TimelyEndpointInputSchemas.projectsGet,
		output: TimelyEndpointOutputSchemas.projectsGet,
	},
	'users.list': {
		input: TimelyEndpointInputSchemas.usersList,
		output: TimelyEndpointOutputSchemas.usersList,
	},
	'users.get': {
		input: TimelyEndpointInputSchemas.usersGet,
		output: TimelyEndpointOutputSchemas.usersGet,
	},
	'teams.list': {
		input: TimelyEndpointInputSchemas.teamsList,
		output: TimelyEndpointOutputSchemas.teamsList,
	},
	'teams.get': {
		input: TimelyEndpointInputSchemas.teamsGet,
		output: TimelyEndpointOutputSchemas.teamsGet,
	},
	'tags.list': {
		input: TimelyEndpointInputSchemas.tagsList,
		output: TimelyEndpointOutputSchemas.tagsList,
	},
	'tags.get': {
		input: TimelyEndpointInputSchemas.tagsGet,
		output: TimelyEndpointOutputSchemas.tagsGet,
	},
	'timeEntries.list': {
		input: TimelyEndpointInputSchemas.timeEntriesList,
		output: TimelyEndpointOutputSchemas.timeEntriesList,
	},
	'timeEntries.get': {
		input: TimelyEndpointInputSchemas.timeEntriesGet,
		output: TimelyEndpointOutputSchemas.timeEntriesGet,
	},
	'reports.list': {
		input: TimelyEndpointInputSchemas.reportsList,
		output: TimelyEndpointOutputSchemas.reportsList,
	},
	'reports.get': {
		input: TimelyEndpointInputSchemas.reportsGet,
		output: TimelyEndpointOutputSchemas.reportsGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof timelyEndpointsNested
>;

const timelyWebhookSchemas = {
	'event.event': {
		description: 'A Timely webhook event',
		payload: TimelyWebhookEventSchema,
		response: TimelyWebhookEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof timelyWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const timelyEndpointMeta = {
	'accounts.list': { riskLevel: 'read', description: 'List Timely accounts' },
	'accounts.get': {
		riskLevel: 'read',
		description: 'Get a Timely account by ID',
	},
	'clients.list': {
		riskLevel: 'read',
		description: 'List clients for an account',
	},
	'clients.get': { riskLevel: 'read', description: 'Get a client by ID' },
	'projects.list': {
		riskLevel: 'read',
		description: 'List projects for an account',
	},
	'projects.get': { riskLevel: 'read', description: 'Get a project by ID' },
	'users.list': { riskLevel: 'read', description: 'List users for an account' },
	'users.get': { riskLevel: 'read', description: 'Get a user by ID' },
	'teams.list': { riskLevel: 'read', description: 'List teams for an account' },
	'teams.get': { riskLevel: 'read', description: 'Get a team by ID' },
	'tags.list': { riskLevel: 'read', description: 'List labels for an account' },
	'tags.get': { riskLevel: 'read', description: 'Get a label by ID' },
	'timeEntries.list': {
		riskLevel: 'read',
		description: 'List time entries for an account',
	},
	'timeEntries.get': {
		riskLevel: 'read',
		description: 'Get a time entry by ID',
	},
	'reports.list': {
		riskLevel: 'read',
		description: 'List reports for an account',
	},
	'reports.get': { riskLevel: 'read', description: 'Get a report by ID' },
} as const satisfies RequiredPluginEndpointMeta<typeof timelyEndpointsNested>;

export const timelyAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseTimelyPlugin<T extends TimelyPluginOptions> = CorsairPlugin<
	'timely',
	typeof TimelySchema,
	typeof timelyEndpointsNested,
	typeof timelyWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalTimelyPlugin = BaseTimelyPlugin<TimelyPluginOptions>;

export type ExternalTimelyPlugin<T extends TimelyPluginOptions> =
	BaseTimelyPlugin<T>;

export function timely<const T extends TimelyPluginOptions>(
	incomingOptions: TimelyPluginOptions & T = {} as TimelyPluginOptions & T,
): ExternalTimelyPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'timely',
		authConfig: timelyAuthConfig,
		schema: TimelySchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: timelyEndpointsNested,
		webhooks: timelyWebhooksNested,
		endpointMeta: timelyEndpointMeta,
		endpointSchemas: timelyEndpointSchemas,
		webhookSchemas: timelyWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			return 'x-timely-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchTimelyTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveTimelyOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: TimelyKeyBuilderContext, source) => {
			if (source === 'webhook' && options.webhookSecret) {
				return options.webhookSecret;
			}

			if (source === 'webhook') {
				const res = await ctx.keys.get_webhook_signature();
				return res ?? '';
			}

			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			if (source === 'endpoint' && ctx.authType === 'oauth_2') {
				const res = await ctx.keys.get_access_token();
				return res ?? '';
			}

			return '';
		},
	} satisfies InternalTimelyPlugin;
}

export type {
	TimelyEndpointInputs,
	TimelyEndpointOutputs,
} from './endpoints/types';
export type {
	TimelyWebhookEvent,
	TimelyWebhookOutputs,
} from './webhooks/types';
