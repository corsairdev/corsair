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
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { Alerts, Sessions, Webhooks, Websites } from './endpoints';
import type {
	LiveSessionEndpointInputs,
	LiveSessionEndpointOutputs,
} from './endpoints/types';
import {
	LiveSessionEndpointInputSchemas,
	LiveSessionEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { LiveSessionSchema } from './schema';

export type LiveSessionPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalLiveSessionPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof liveSessionEndpointsNested>;
};

export type LiveSessionContext = CorsairPluginContext<
	typeof LiveSessionSchema,
	LiveSessionPluginOptions
>;
export type LiveSessionKeyBuilderContext =
	KeyBuilderContext<LiveSessionPluginOptions>;
export type LiveSessionBoundEndpoints = BindEndpoints<
	typeof liveSessionEndpointsNested
>;

type LiveSessionEndpoint<K extends keyof LiveSessionEndpointOutputs> =
	CorsairEndpoint<
		LiveSessionContext,
		LiveSessionEndpointInputs[K],
		LiveSessionEndpointOutputs[K]
	>;

export type LiveSessionEndpoints = {
	sessionsList: LiveSessionEndpoint<'sessionsList'>;
	alertsList: LiveSessionEndpoint<'alertsList'>;
	alertsCreate: LiveSessionEndpoint<'alertsCreate'>;
	alertsUpdate: LiveSessionEndpoint<'alertsUpdate'>;
	alertsDelete: LiveSessionEndpoint<'alertsDelete'>;
	webhooksList: LiveSessionEndpoint<'webhooksList'>;
	webhooksCreate: LiveSessionEndpoint<'webhooksCreate'>;
	webhooksUpdate: LiveSessionEndpoint<'webhooksUpdate'>;
	webhooksDelete: LiveSessionEndpoint<'webhooksDelete'>;
	websitesList: LiveSessionEndpoint<'websitesList'>;
	websitesCreate: LiveSessionEndpoint<'websitesCreate'>;
};

const liveSessionEndpointsNested = {
	sessions: { list: Sessions.list },
	alerts: {
		list: Alerts.list,
		create: Alerts.create,
		update: Alerts.update,
		delete: Alerts.remove,
	},
	webhooks: {
		list: Webhooks.list,
		create: Webhooks.create,
		update: Webhooks.update,
		delete: Webhooks.remove,
	},
	websites: { list: Websites.list, create: Websites.create },
} as const;

const liveSessionWebhooksNested = {} as const;

export const liveSessionEndpointSchemas = {
	'sessions.list': {
		input: LiveSessionEndpointInputSchemas.sessionsList,
		output: LiveSessionEndpointOutputSchemas.sessionsList,
	},
	'alerts.list': {
		input: LiveSessionEndpointInputSchemas.alertsList,
		output: LiveSessionEndpointOutputSchemas.alertsList,
	},
	'alerts.create': {
		input: LiveSessionEndpointInputSchemas.alertsCreate,
		output: LiveSessionEndpointOutputSchemas.alertsCreate,
	},
	'alerts.update': {
		input: LiveSessionEndpointInputSchemas.alertsUpdate,
		output: LiveSessionEndpointOutputSchemas.alertsUpdate,
	},
	'alerts.delete': {
		input: LiveSessionEndpointInputSchemas.alertsDelete,
		output: LiveSessionEndpointOutputSchemas.alertsDelete,
	},
	'webhooks.list': {
		input: LiveSessionEndpointInputSchemas.webhooksList,
		output: LiveSessionEndpointOutputSchemas.webhooksList,
	},
	'webhooks.create': {
		input: LiveSessionEndpointInputSchemas.webhooksCreate,
		output: LiveSessionEndpointOutputSchemas.webhooksCreate,
	},
	'webhooks.update': {
		input: LiveSessionEndpointInputSchemas.webhooksUpdate,
		output: LiveSessionEndpointOutputSchemas.webhooksUpdate,
	},
	'webhooks.delete': {
		input: LiveSessionEndpointInputSchemas.webhooksDelete,
		output: LiveSessionEndpointOutputSchemas.webhooksDelete,
	},
	'websites.list': {
		input: LiveSessionEndpointInputSchemas.websitesList,
		output: LiveSessionEndpointOutputSchemas.websitesList,
	},
	'websites.create': {
		input: LiveSessionEndpointInputSchemas.websitesCreate,
		output: LiveSessionEndpointOutputSchemas.websitesCreate,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof liveSessionEndpointsNested
>;

const liveSessionWebhookSchemas =
	{} as const satisfies RequiredPluginWebhookSchemas<
		typeof liveSessionWebhooksNested
	>;

const liveSessionEndpointMeta = {
	'sessions.list': {
		riskLevel: 'read',
		description:
			'List recorded sessions with page, size, visitor, email, timezone, and date filters',
	},
	'alerts.list': {
		riskLevel: 'read',
		description: 'List all alerts configured for the token scope',
	},
	'alerts.create': {
		riskLevel: 'write',
		description: 'Create an alert delivered to Slack or a webhook',
	},
	'alerts.update': {
		riskLevel: 'write',
		description: 'Update an existing alert by ID',
	},
	'alerts.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Permanently delete an alert by ID',
	},
	'webhooks.list': {
		riskLevel: 'read',
		description: 'List all outbound webhooks for the token scope',
	},
	'webhooks.create': {
		riskLevel: 'write',
		description: 'Create an outbound webhook for a website',
	},
	'webhooks.update': {
		riskLevel: 'write',
		description: 'Update an outbound webhook by ID',
	},
	'webhooks.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Permanently delete an outbound webhook by ID',
	},
	'websites.list': {
		riskLevel: 'read',
		description: 'List all websites available to the token',
	},
	'websites.create': {
		riskLevel: 'write',
		description: 'Create a tracked website',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof liveSessionEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key';
export const liveSessionAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseLiveSessionPlugin<T extends LiveSessionPluginOptions> =
	CorsairPlugin<
		'livesession',
		typeof LiveSessionSchema,
		typeof liveSessionEndpointsNested,
		typeof liveSessionWebhooksNested,
		T,
		typeof defaultAuthType
	>;
export type InternalLiveSessionPlugin =
	BaseLiveSessionPlugin<LiveSessionPluginOptions>;
export type ExternalLiveSessionPlugin<T extends LiveSessionPluginOptions> =
	BaseLiveSessionPlugin<T>;

export function livesession<const T extends LiveSessionPluginOptions>(
	// Safe: every option is optional, so `{}` satisfies LiveSessionPluginOptions;
	// TypeScript cannot prove `{}` assignable to the generic T.
	incomingOptions: LiveSessionPluginOptions &
		T = {} as LiveSessionPluginOptions & T,
): ExternalLiveSessionPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'livesession',
		authConfig: liveSessionAuthConfig,
		schema: LiveSessionSchema,
		options,
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: liveSessionEndpointsNested,
		webhooks: liveSessionWebhooksNested,
		endpointMeta: liveSessionEndpointMeta,
		endpointSchemas: liveSessionEndpointSchemas,
		webhookSchemas: liveSessionWebhookSchemas,
		pluginWebhookMatcher: undefined,
		errorHandlers: { ...errorHandlers, ...options.errorHandlers },
		keyBuilder: async (ctx: LiveSessionKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) return options.key;
			if (source === 'endpoint') {
				// Without a database core gives no key store; that is a missing credential too.
				if (!ctx.keys) throw new AuthMissingError('livesession', 'api_key');
				try {
					const key = await ctx.keys.get_api_key();
					if (key) return key;
				} catch (error) {
					if (
						error instanceof AuthMissingError ||
						(error instanceof Error && /no dek found/i.test(error.message))
					) {
						throw new AuthMissingError('livesession', 'api_key');
					}
					throw error;
				}
			}
			throw new AuthMissingError('livesession', 'api_key');
		},
	} satisfies InternalLiveSessionPlugin;
}

export type {
	LiveSessionEndpointInputs,
	LiveSessionEndpointOutputs,
} from './endpoints/types';
export { LiveSessionSchema } from './schema';
