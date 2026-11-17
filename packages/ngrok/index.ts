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
import { Resources } from './endpoints';
import type {
	NgrokEndpointInputs,
	NgrokEndpointOutputs,
} from './endpoints/types';
import {
	NgrokEndpointInputSchemas,
	NgrokEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { NgrokSchema } from './schema';

export type NgrokPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/** An ngrok API key, from dashboard.ngrok.com/api-keys. */
	key?: string;
	hooks?: InternalNgrokPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof ngrokEndpointsNested>;
};

export type NgrokContext = CorsairPluginContext<
	typeof NgrokSchema,
	NgrokPluginOptions
>;

export type NgrokKeyBuilderContext = KeyBuilderContext<NgrokPluginOptions>;

export type NgrokBoundEndpoints = BindEndpoints<typeof ngrokEndpointsNested>;

type NgrokEndpoint<K extends keyof NgrokEndpointOutputs> = CorsairEndpoint<
	NgrokContext,
	NgrokEndpointInputs[K],
	NgrokEndpointOutputs[K]
>;

export type NgrokEndpoints = {
	endpointsList: NgrokEndpoint<'endpointsList'>;
	endpointsGet: NgrokEndpoint<'endpointsGet'>;
	endpointsCreate: NgrokEndpoint<'endpointsCreate'>;
	endpointsUpdate: NgrokEndpoint<'endpointsUpdate'>;
	endpointsDelete: NgrokEndpoint<'endpointsDelete'>;
	domainsList: NgrokEndpoint<'domainsList'>;
	domainsGet: NgrokEndpoint<'domainsGet'>;
	domainsCreate: NgrokEndpoint<'domainsCreate'>;
	domainsUpdate: NgrokEndpoint<'domainsUpdate'>;
	domainsDelete: NgrokEndpoint<'domainsDelete'>;
	tunnelsList: NgrokEndpoint<'tunnelsList'>;
	apiKeysList: NgrokEndpoint<'apiKeysList'>;
	apiKeysCreate: NgrokEndpoint<'apiKeysCreate'>;
	apiKeysDelete: NgrokEndpoint<'apiKeysDelete'>;
	eventsList: NgrokEndpoint<'eventsList'>;
	eventsGet: NgrokEndpoint<'eventsGet'>;
	eventsCreate: NgrokEndpoint<'eventsCreate'>;
	eventsDelete: NgrokEndpoint<'eventsDelete'>;
};

export const ngrokEndpointsNested = {
	endpoints: {
		list: Resources.list,
		get: Resources.get,
		create: Resources.create,
		update: Resources.update,
		delete: Resources.remove,
	},
	domains: {
		list: Resources.domains,
		get: Resources.domain,
		create: Resources.createDomain,
		update: Resources.updateDomain,
		delete: Resources.deleteDomain,
	},
	tunnels: {
		list: Resources.tunnels,
	},
	apiKeys: {
		list: Resources.keys,
		create: Resources.createKey,
		delete: Resources.deleteKey,
	},
	events: {
		list: Resources.subscriptions,
		get: Resources.subscription,
		create: Resources.createSubscription,
		delete: Resources.deleteSubscription,
	},
} as const;

export const ngrokEndpointSchemas = {
	'endpoints.list': {
		input: NgrokEndpointInputSchemas.endpointsList,
		output: NgrokEndpointOutputSchemas.endpointsList,
	},
	'endpoints.get': {
		input: NgrokEndpointInputSchemas.endpointsGet,
		output: NgrokEndpointOutputSchemas.endpointsGet,
	},
	'endpoints.create': {
		input: NgrokEndpointInputSchemas.endpointsCreate,
		output: NgrokEndpointOutputSchemas.endpointsCreate,
	},
	'endpoints.update': {
		input: NgrokEndpointInputSchemas.endpointsUpdate,
		output: NgrokEndpointOutputSchemas.endpointsUpdate,
	},
	'endpoints.delete': {
		input: NgrokEndpointInputSchemas.endpointsDelete,
		output: NgrokEndpointOutputSchemas.endpointsDelete,
	},
	'domains.list': {
		input: NgrokEndpointInputSchemas.domainsList,
		output: NgrokEndpointOutputSchemas.domainsList,
	},
	'domains.get': {
		input: NgrokEndpointInputSchemas.domainsGet,
		output: NgrokEndpointOutputSchemas.domainsGet,
	},
	'domains.create': {
		input: NgrokEndpointInputSchemas.domainsCreate,
		output: NgrokEndpointOutputSchemas.domainsCreate,
	},
	'domains.update': {
		input: NgrokEndpointInputSchemas.domainsUpdate,
		output: NgrokEndpointOutputSchemas.domainsUpdate,
	},
	'domains.delete': {
		input: NgrokEndpointInputSchemas.domainsDelete,
		output: NgrokEndpointOutputSchemas.domainsDelete,
	},
	'tunnels.list': {
		input: NgrokEndpointInputSchemas.tunnelsList,
		output: NgrokEndpointOutputSchemas.tunnelsList,
	},
	'apiKeys.list': {
		input: NgrokEndpointInputSchemas.apiKeysList,
		output: NgrokEndpointOutputSchemas.apiKeysList,
	},
	'apiKeys.create': {
		input: NgrokEndpointInputSchemas.apiKeysCreate,
		output: NgrokEndpointOutputSchemas.apiKeysCreate,
	},
	'apiKeys.delete': {
		input: NgrokEndpointInputSchemas.apiKeysDelete,
		output: NgrokEndpointOutputSchemas.apiKeysDelete,
	},
	'events.list': {
		input: NgrokEndpointInputSchemas.eventsList,
		output: NgrokEndpointOutputSchemas.eventsList,
	},
	'events.get': {
		input: NgrokEndpointInputSchemas.eventsGet,
		output: NgrokEndpointOutputSchemas.eventsGet,
	},
	'events.create': {
		input: NgrokEndpointInputSchemas.eventsCreate,
		output: NgrokEndpointOutputSchemas.eventsCreate,
	},
	'events.delete': {
		input: NgrokEndpointInputSchemas.eventsDelete,
		output: NgrokEndpointOutputSchemas.eventsDelete,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof ngrokEndpointsNested>;

const defaultAuthType = 'api_key' as const;

const ngrokEndpointMeta = {
	'endpoints.list': {
		riskLevel: 'read',
		description:
			'List cloud endpoints with their public URL, upstream and traffic policy, newest first',
	},
	'endpoints.get': {
		riskLevel: 'read',
		description: 'Read one cloud endpoint by id',
	},
	'endpoints.create': {
		riskLevel: 'write',
		description:
			'Create a cloud endpoint at a URL you own (e.g. your ngrok dev domain); its required Traffic Policy decides what happens to requests, and it serves immediately',
	},
	'endpoints.update': {
		riskLevel: 'write',
		description:
			'Change an endpoint’s description, metadata, traffic policy or bindings, leaving fields that are omitted alone',
	},
	'endpoints.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a cloud endpoint; its public URL stops resolving and ngrok has no restore call',
	},
	'domains.list': {
		riskLevel: 'read',
		description:
			'List reserved domains with their CNAME target and certificate state',
	},
	'domains.get': {
		riskLevel: 'read',
		description:
			'Read one reserved domain, including its certificate provisioning status',
	},
	'domains.create': {
		riskLevel: 'write',
		description:
			'Reserve a hostname and return the CNAME target to point DNS at; certificate issuance starts once it resolves',
	},
	'domains.update': {
		riskLevel: 'write',
		description:
			'Change a reserved domain’s description, certificate, management policy or allowed IPs',
	},
	'domains.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Release a reserved domain, which stops it resolving through ngrok; another account can then claim it',
	},
	'tunnels.list': {
		riskLevel: 'read',
		description: 'List the tunnels open agent sessions and their public URLs',
	},
	'apiKeys.list': {
		riskLevel: 'read',
		description:
			'List the account’s API keys without their tokens, with owner and creation time',
	},
	'apiKeys.create': {
		riskLevel: 'write',
		description:
			'Mint an API key; the token is returned once in this response and never again, so it must be stored now',
	},
	'apiKeys.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Revoke an API key permanently; anything still using it stops authenticating',
	},
	'events.list': {
		riskLevel: 'read',
		description: 'List event subscriptions with their sources and destinations',
	},
	'events.get': {
		riskLevel: 'read',
		description: 'Read one event subscription by id',
	},
	'events.create': {
		riskLevel: 'write',
		description:
			'Subscribe to event types and deliver them to existing destination ids, which are created through a separate API',
	},
	'events.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete an event subscription, which stops those events being delivered',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof ngrokEndpointsNested>;

export type BaseNgrokPlugin<T extends NgrokPluginOptions> = CorsairPlugin<
	'ngrok',
	typeof NgrokSchema,
	typeof ngrokEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalNgrokPlugin = BaseNgrokPlugin<NgrokPluginOptions>;

export type ExternalNgrokPlugin<T extends NgrokPluginOptions> =
	BaseNgrokPlugin<T>;

export function ngrok<const T extends NgrokPluginOptions>(
	incomingOptions: NgrokPluginOptions & T = {} as NgrokPluginOptions & T,
): ExternalNgrokPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'ngrok',
		schema: NgrokSchema,
		options: options,
		hooks: options.hooks,
		endpoints: ngrokEndpointsNested,
		webhooks: {},
		endpointMeta: ngrokEndpointMeta,
		endpointSchemas: ngrokEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: NgrokKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('ngrok', ctx.authType ?? 'api_key');
		},
	} satisfies InternalNgrokPlugin;
}

export { NgrokAPIError } from './client';

export type {
	ApiKeysCreateInput,
	ApiKeysCreateResponse,
	ApiKeysDeleteInput,
	ApiKeysDeleteResponse,
	ApiKeysListInput,
	ApiKeysListResponse,
	DomainsCreateInput,
	DomainsCreateResponse,
	DomainsDeleteInput,
	DomainsDeleteResponse,
	DomainsGetInput,
	DomainsGetResponse,
	DomainsListInput,
	DomainsListResponse,
	DomainsUpdateInput,
	DomainsUpdateResponse,
	EndpointsCreateInput,
	EndpointsCreateResponse,
	EndpointsDeleteInput,
	EndpointsDeleteResponse,
	EndpointsGetInput,
	EndpointsGetResponse,
	EndpointsListInput,
	EndpointsListResponse,
	EndpointsUpdateInput,
	EndpointsUpdateResponse,
	EventsCreateInput,
	EventsCreateResponse,
	EventsDeleteInput,
	EventsDeleteResponse,
	EventsGetInput,
	EventsGetResponse,
	EventsListInput,
	EventsListResponse,
	NgrokApiKey,
	NgrokEndpoint,
	NgrokEndpointInputs,
	NgrokEndpointOutputs,
	NgrokEventSubscription,
	NgrokReservedDomain,
	NgrokTunnel,
	TunnelsListInput,
	TunnelsListResponse,
} from './endpoints/types';
