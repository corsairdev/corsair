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
import { AuthMissingError, getOAuthAccessToken } from 'corsair/core';
import { TIMELY_OAUTH_AUTHORIZE_URL, TIMELY_OAUTH_TOKEN_URL } from './client';
import {
	Accounts,
	Clients,
	Projects,
	Reports,
	Tags,
	Teams,
	TimeEntries,
	Users,
	Webhooks,
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
import { TimelyWebhookHandlers } from './webhooks';
import type { TimelyWebhookPayload } from './webhooks/types';
import {
	isTimelyWebhookBody,
	TimelyWebhookPayloadSchema,
} from './webhooks/types';

export type TimelyPluginOptions = {
	/** Timely only offers OAuth 2.0 (no API keys or personal tokens). */
	authType?: PickAuth<'oauth_2'>;
	/** A ready Timely access token; skips the stored OAuth credentials. */
	key?: string;
	/** Default Timely workspace (account) id for every call. */
	accountId?: string | number;
	/** Signing secret of your Timely webhook (`secret_token`). */
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
	[K in keyof TimelyEndpointOutputs]: TimelyEndpoint<K>;
};

export type TimelyWebhook = CorsairWebhook<
	TimelyContext,
	TimelyWebhookPayload,
	TimelyWebhookPayload
>;

const timelyEndpointsNested = {
	accounts: {
		list: Accounts.list,
		get: Accounts.get,
	},
	clients: {
		list: Clients.list,
		get: Clients.get,
		create: Clients.create,
		update: Clients.update,
	},
	projects: {
		list: Projects.list,
		get: Projects.get,
		create: Projects.create,
		update: Projects.update,
		delete: Projects.remove,
	},
	timeEntries: {
		list: TimeEntries.list,
		get: TimeEntries.get,
		create: TimeEntries.create,
		update: TimeEntries.update,
		delete: TimeEntries.remove,
		bulk: TimeEntries.bulk,
		startTimer: TimeEntries.startTimer,
		stopTimer: TimeEntries.stopTimer,
	},
	tags: {
		list: Tags.list,
		get: Tags.get,
		create: Tags.create,
		update: Tags.update,
		delete: Tags.remove,
	},
	teams: {
		list: Teams.list,
		get: Teams.get,
	},
	users: {
		list: Users.list,
		get: Users.get,
		current: Users.current,
	},
	reports: {
		totals: Reports.totals,
		filter: Reports.filter,
	},
	webhooks: {
		list: Webhooks.list,
		get: Webhooks.get,
		create: Webhooks.create,
		update: Webhooks.update,
		delete: Webhooks.remove,
	},
} as const;

const timelyWebhooksNested = TimelyWebhookHandlers;

export type TimelyWebhooks = typeof timelyWebhooksNested;
export type TimelyBoundWebhooks = BindWebhooks<TimelyWebhooks>;

const In = TimelyEndpointInputSchemas;
const Out = TimelyEndpointOutputSchemas;

export const timelyEndpointSchemas = {
	'accounts.list': { input: In.accountsList, output: Out.accountsList },
	'accounts.get': { input: In.accountsGet, output: Out.accountsGet },
	'clients.list': { input: In.clientsList, output: Out.clientsList },
	'clients.get': { input: In.clientsGet, output: Out.clientsGet },
	'clients.create': { input: In.clientsCreate, output: Out.clientsCreate },
	'clients.update': { input: In.clientsUpdate, output: Out.clientsUpdate },
	'projects.list': { input: In.projectsList, output: Out.projectsList },
	'projects.get': { input: In.projectsGet, output: Out.projectsGet },
	'projects.create': { input: In.projectsCreate, output: Out.projectsCreate },
	'projects.update': { input: In.projectsUpdate, output: Out.projectsUpdate },
	'projects.delete': { input: In.projectsDelete, output: Out.projectsDelete },
	'timeEntries.list': {
		input: In.timeEntriesList,
		output: Out.timeEntriesList,
	},
	'timeEntries.get': { input: In.timeEntriesGet, output: Out.timeEntriesGet },
	'timeEntries.create': {
		input: In.timeEntriesCreate,
		output: Out.timeEntriesCreate,
	},
	'timeEntries.update': {
		input: In.timeEntriesUpdate,
		output: Out.timeEntriesUpdate,
	},
	'timeEntries.delete': {
		input: In.timeEntriesDelete,
		output: Out.timeEntriesDelete,
	},
	'timeEntries.bulk': {
		input: In.timeEntriesBulk,
		output: Out.timeEntriesBulk,
	},
	'timeEntries.startTimer': {
		input: In.timeEntriesStartTimer,
		output: Out.timeEntriesStartTimer,
	},
	'timeEntries.stopTimer': {
		input: In.timeEntriesStopTimer,
		output: Out.timeEntriesStopTimer,
	},
	'tags.list': { input: In.tagsList, output: Out.tagsList },
	'tags.get': { input: In.tagsGet, output: Out.tagsGet },
	'tags.create': { input: In.tagsCreate, output: Out.tagsCreate },
	'tags.update': { input: In.tagsUpdate, output: Out.tagsUpdate },
	'tags.delete': { input: In.tagsDelete, output: Out.tagsDelete },
	'teams.list': { input: In.teamsList, output: Out.teamsList },
	'teams.get': { input: In.teamsGet, output: Out.teamsGet },
	'users.list': { input: In.usersList, output: Out.usersList },
	'users.get': { input: In.usersGet, output: Out.usersGet },
	'users.current': { input: In.usersCurrent, output: Out.usersCurrent },
	'reports.totals': { input: In.reportsTotals, output: Out.reportsTotals },
	'reports.filter': { input: In.reportsFilter, output: Out.reportsFilter },
	'webhooks.list': { input: In.webhooksList, output: Out.webhooksList },
	'webhooks.get': { input: In.webhooksGet, output: Out.webhooksGet },
	'webhooks.create': { input: In.webhooksCreate, output: Out.webhooksCreate },
	'webhooks.update': { input: In.webhooksUpdate, output: Out.webhooksUpdate },
	'webhooks.delete': { input: In.webhooksDelete, output: Out.webhooksDelete },
} as const satisfies RequiredPluginEndpointSchemas<
	typeof timelyEndpointsNested
>;

function webhookSchema(description: string) {
	return {
		description,
		payload: TimelyWebhookPayloadSchema,
		response: TimelyWebhookPayloadSchema,
	};
}

const timelyWebhookSchemas = {
	'timeEntries.created': webhookSchema(
		'A time entry was logged (Timely event hours:created)',
	),
	'timeEntries.updated': webhookSchema(
		'A time entry changed (Timely event hours:updated)',
	),
	'timeEntries.deleted': webhookSchema(
		'A time entry was deleted (Timely event hours:deleted)',
	),
	'projects.created': webhookSchema('A project was created'),
	'projects.updated': webhookSchema('A project changed'),
	'projects.deleted': webhookSchema('A project was deleted'),
	'tags.created': webhookSchema(
		'A tag was created (Timely event labels:created)',
	),
	'tags.updated': webhookSchema('A tag changed (Timely event labels:updated)'),
	'tags.deleted': webhookSchema(
		'A tag was deleted (Timely event labels:deleted)',
	),
	'tasks.created': webhookSchema(
		'A task was created (Timely event forecasts:created)',
	),
	'tasks.updated': webhookSchema(
		'A task changed (Timely event forecasts:updated)',
	),
	'tasks.deleted': webhookSchema(
		'A task was deleted (Timely event forecasts:deleted)',
	),
} as const satisfies RequiredPluginWebhookSchemas<typeof timelyWebhooksNested>;

const defaultAuthType: AuthTypes = 'oauth_2' as const;

const timelyEndpointMeta = {
	'accounts.list': {
		riskLevel: 'read',
		description: 'List the Timely workspaces (accounts) the user can reach',
	},
	'accounts.get': {
		riskLevel: 'read',
		description: 'Get a Timely workspace (account) by id',
	},
	'clients.list': { riskLevel: 'read', description: 'List clients' },
	'clients.get': { riskLevel: 'read', description: 'Get a client by id' },
	'clients.create': { riskLevel: 'write', description: 'Create a client' },
	'clients.update': {
		riskLevel: 'write',
		description: 'Update a client (active: false archives it)',
	},
	'projects.list': { riskLevel: 'read', description: 'List projects' },
	'projects.get': { riskLevel: 'read', description: 'Get a project by id' },
	'projects.create': {
		riskLevel: 'write',
		description: 'Create a project under a client',
	},
	'projects.update': {
		riskLevel: 'write',
		description:
			'Update a project; passing `users` replaces who may log time on it',
	},
	'projects.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a project',
	},
	'timeEntries.list': {
		riskLevel: 'read',
		description: 'List time entries for a day or a since/upto date range',
	},
	'timeEntries.get': {
		riskLevel: 'read',
		description: 'Get a time entry by id',
	},
	'timeEntries.create': {
		riskLevel: 'write',
		description: 'Log time on a project',
	},
	'timeEntries.update': {
		riskLevel: 'write',
		description: 'Update a time entry',
	},
	'timeEntries.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a time entry',
	},
	'timeEntries.bulk': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Create, update and delete up to 100 time entries in one request',
	},
	'timeEntries.startTimer': {
		riskLevel: 'write',
		description: 'Start the timer on a time entry',
	},
	'timeEntries.stopTimer': {
		riskLevel: 'write',
		description: 'Stop the timer on a time entry',
	},
	'tags.list': { riskLevel: 'read', description: 'List tags (labels)' },
	'tags.get': { riskLevel: 'read', description: 'Get a tag by id' },
	'tags.create': { riskLevel: 'write', description: 'Create a tag' },
	'tags.update': { riskLevel: 'write', description: 'Update a tag' },
	'tags.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a tag',
	},
	'teams.list': { riskLevel: 'read', description: 'List teams' },
	'teams.get': { riskLevel: 'read', description: 'Get a team by id' },
	'users.list': { riskLevel: 'read', description: 'List people' },
	'users.get': { riskLevel: 'read', description: 'Get a person by id' },
	'users.current': {
		riskLevel: 'read',
		description: 'Get the connected user in a workspace',
	},
	'reports.totals': {
		riskLevel: 'read',
		description: 'Logged time and cost per client and project for a period',
	},
	'reports.filter': {
		riskLevel: 'read',
		description:
			'Totals grouped by clients, users, tags, days and teams, or the matching time entries',
	},
	'webhooks.list': { riskLevel: 'read', description: 'List webhooks' },
	'webhooks.get': { riskLevel: 'read', description: 'Get a webhook by id' },
	'webhooks.create': {
		riskLevel: 'write',
		description: 'Create a signed webhook subscription',
	},
	'webhooks.update': { riskLevel: 'write', description: 'Update a webhook' },
	'webhooks.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a webhook',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof timelyEndpointsNested>;

export const timelyAuthConfig = {
	oauth_2: {
		account: ['account_id'] as const,
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
		oauthConfig: {
			providerName: 'Timely',
			authUrl: TIMELY_OAUTH_AUTHORIZE_URL,
			tokenUrl: TIMELY_OAUTH_TOKEN_URL,
			scopes: ['manage'],
		},
		schema: TimelySchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: timelyEndpointsNested,
		webhooks: timelyWebhooksNested,
		endpointMeta: timelyEndpointMeta,
		endpointSchemas: timelyEndpointSchemas,
		webhookSchemas: timelyWebhookSchemas,
		pluginWebhookMatcher: (request) => isTimelyWebhookBody(request.body),
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: TimelyKeyBuilderContext, source) => {
			if (source === 'webhook') {
				if (options.webhookSecret) return options.webhookSecret;
				// Missing secret → '' → the handler rejects the delivery (fail closed).
				return (await ctx.keys.get_webhook_signature()) ?? '';
			}

			if (options.key) return options.key;

			if (ctx.authType === 'oauth_2') {
				// Timely access tokens do not expire. Without a client secret or a hub
				// there is no refresh path, but a stored token still works as is.
				const credentials = await ctx.keys.get_integration_credentials();
				if (!credentials.client_secret && !ctx.hub) {
					const stored = await ctx.keys.get_access_token();
					if (stored) return stored;
					throw new AuthMissingError('timely', 'oauth_2');
				}
				// Returns the stored token; refreshes (rotating refresh token) only
				// when the token is missing or a call came back 401.
				return getOAuthAccessToken(ctx, {
					plugin: 'timely',
					tokenUrl: TIMELY_OAUTH_TOKEN_URL,
				});
			}

			throw new AuthMissingError('timely', ctx.authType ?? defaultAuthType);
		},
	} satisfies InternalTimelyPlugin;
}

export {
	TIMELY_API_BASE,
	TimelyAccountIdMissingError,
	TimelyAPIError,
} from './client';
export type {
	TimelyEndpointInputs,
	TimelyEndpointOutputs,
} from './endpoints/types';
export type { TimelyWebhookPayload } from './webhooks/types';
export { verifyTimelyWebhookSignature } from './webhooks/types';
