import type {
	BindEndpoints,
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
import type { z } from 'zod';
import { endpoints } from './endpoints';
import { EndpointInputSchemas, EndpointOutputSchemas } from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { NangoSchema } from './schema';

export type NangoPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalNangoPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof endpoints>;
};
export type NangoContext = CorsairPluginContext<
	typeof NangoSchema,
	NangoPluginOptions
>;
export type NangoKeyBuilderContext = KeyBuilderContext<NangoPluginOptions>;
export type NangoBoundEndpoints = BindEndpoints<typeof endpoints>;

const schema = <K extends keyof typeof EndpointInputSchemas>(key: K) => ({
	input: EndpointInputSchemas[key],
	output: EndpointOutputSchemas[key],
});
export const nangoEndpointSchemas = {
	'connections.import': schema('connections.import'),
	'connections.list': schema('connections.list'),
	'connections.get': schema('connections.get'),
	'connections.patch': schema('connections.patch'),
	'connections.setMetadata': schema('connections.setMetadata'),
	'connections.updateMetadata': schema('connections.updateMetadata'),
	'connections.delete': schema('connections.delete'),
	'sessions.create': schema('sessions.create'),
	'sessions.reconnect': schema('sessions.reconnect'),
	'integrations.list': schema('integrations.list'),
	'integrations.get': schema('integrations.get'),
	'integrations.create': schema('integrations.create'),
	'integrations.update': schema('integrations.update'),
	'integrations.delete': schema('integrations.delete'),
	'functions.list': schema('functions.list'),
	'functions.get': schema('functions.get'),
	'functions.getCode': schema('functions.getCode'),
	'functions.delete': schema('functions.delete'),
	'scripts.getConfig': schema('scripts.getConfig'),
	'providers.list': schema('providers.list'),
	'providers.get': schema('providers.get'),
	'syncs.trigger': schema('syncs.trigger'),
	'syncs.start': schema('syncs.start'),
	'syncs.pause': schema('syncs.pause'),
	'syncs.status': schema('syncs.status'),
	'syncs.updateFrequency': schema('syncs.updateFrequency'),
	'records.list': schema('records.list'),
	'tools.call': schema('tools.call'),
	'actions.trigger': schema('actions.trigger'),
	'environment.getVariables': schema('environment.getVariables'),
	'proxy.get': schema('proxy.get'),
	'proxy.post': schema('proxy.post'),
	'proxy.put': schema('proxy.put'),
	'proxy.patch': schema('proxy.patch'),
	'proxy.delete': schema('proxy.delete'),
} satisfies RequiredPluginEndpointSchemas<typeof endpoints>;
export type NangoEndpointInputs = {
	[K in keyof typeof nangoEndpointSchemas]: z.input<
		(typeof nangoEndpointSchemas)[K]['input']
	>;
};
export type NangoEndpointOutputs = {
	[K in keyof typeof nangoEndpointSchemas]: z.output<
		(typeof nangoEndpointSchemas)[K]['output']
	>;
};

const endpointMeta = {
	'connections.import': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Create a connection from credentials you already hold, or overwrite an existing connection's credentials when connection_id matches. The credentials are not returned.",
	},
	'connections.list': {
		riskLevel: 'read',
		description:
			'List connections (no credentials), filtered by connection ID or tags, with page and limit.',
	},
	'connections.get': {
		riskLevel: 'read',
		description:
			'Get one connection. Pass include_credentials: true to also return its live third-party credentials (access token, API key, password); they are dropped otherwise.',
	},
	'connections.patch': {
		riskLevel: 'write',
		description:
			'Edit a connection: replace its tags or set a webhook URL override.',
	},
	'connections.setMetadata': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Replace the whole metadata object of one or more connections; keys not passed are removed.',
	},
	'connections.updateMetadata': {
		riskLevel: 'write',
		description: 'Merge keys into the metadata of one or more connections.',
	},
	'connections.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a connection and its stored credentials.',
	},
	'sessions.create': {
		riskLevel: 'write',
		description:
			'Create a Connect session; returns a short-lived token and a connect link an end user opens to authorize an integration.',
	},
	'sessions.reconnect': {
		riskLevel: 'write',
		description:
			'Create a Connect session that re-authorizes an existing connection, keeping its connection ID.',
	},
	'integrations.list': {
		riskLevel: 'read',
		description: 'List the integrations configured in this environment.',
	},
	'integrations.get': {
		riskLevel: 'read',
		description:
			'Get an integration. include: ["credentials"] also returns the developer app client secret and private key.',
	},
	'integrations.create': {
		riskLevel: 'write',
		description:
			'Create an integration for a provider, optionally with developer app credentials or integration_config.',
	},
	'integrations.update': {
		riskLevel: 'write',
		description: 'Edit an integration; fields left out keep their value.',
	},
	'integrations.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete an integration and every connection that uses it.',
	},
	'functions.list': {
		riskLevel: 'read',
		description:
			"List an integration's functions (syncs, tools, on-event functions), including Nango catalog tools.",
	},
	'functions.get': {
		riskLevel: 'read',
		description:
			'Get one function of an integration, with its schema and deployment state.',
	},
	'functions.getCode': {
		riskLevel: 'read',
		description: "Get a function's TypeScript source code.",
	},
	'functions.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a deployed function (not repo-deployed or catalog ones).',
	},
	'scripts.getConfig': {
		riskLevel: 'read',
		description:
			'Get the configuration of every deployed function in the environment, in Nango or OpenAI tool format.',
	},
	'providers.list': {
		riskLevel: 'read',
		description:
			'List the APIs Nango supports; filter with search (the full list has over 1,000).',
	},
	'providers.get': {
		riskLevel: 'read',
		description:
			"Get one provider's auth mode, proxy settings and required connection fields.",
	},
	'syncs.trigger': {
		riskLevel: 'write',
		description:
			'Run syncs once now, for one connection or all; reset starts from scratch.',
	},
	'syncs.start': {
		riskLevel: 'write',
		description:
			'Start the schedule of syncs for one connection or all; they run now and then on their frequency.',
	},
	'syncs.pause': {
		riskLevel: 'write',
		description: 'Pause the schedule of syncs for one connection or all.',
	},
	'syncs.status': {
		riskLevel: 'read',
		description:
			'Get the status, schedule, last result and record counts of syncs.',
	},
	'syncs.updateFrequency': {
		riskLevel: 'write',
		description:
			"Override a sync's frequency for one connection, or restore the default with null.",
	},
	'records.list': {
		riskLevel: 'read',
		description:
			'List the records a sync stored for a connection and model, paginated with next_cursor.',
	},
	'tools.call': {
		riskLevel: 'destructive',
		description:
			"Call a deployed tool for a connection and return its output. Tools can write to the end customer's account.",
	},
	'actions.trigger': {
		riskLevel: 'destructive',
		description:
			"Run a legacy action for a connection synchronously. Actions can write to the end customer's account.",
	},
	'environment.getVariables': {
		riskLevel: 'read',
		description:
			'Get the environment variables set in the Nango dashboard, values in plain text (they often hold secrets).',
	},
	'proxy.get': {
		riskLevel: 'read',
		description:
			"Send a GET through Nango's proxy to the end customer's API with the connection's credentials.",
	},
	'proxy.post': {
		riskLevel: 'destructive',
		description:
			"Send a POST through Nango's proxy to the end customer's API with the connection's credentials.",
	},
	'proxy.put': {
		riskLevel: 'destructive',
		description:
			"Send a PUT through Nango's proxy to the end customer's API with the connection's credentials.",
	},
	'proxy.patch': {
		riskLevel: 'destructive',
		description:
			"Send a PATCH through Nango's proxy to the end customer's API with the connection's credentials.",
	},
	'proxy.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Send a DELETE through Nango's proxy to the end customer's API with the connection's credentials.",
	},
} as const satisfies RequiredPluginEndpointMeta<typeof endpoints>;
export const nangoAuthConfig = {
	api_key: { account: [] as const },
} as const satisfies PluginAuthConfig;
const defaultAuthType = 'api_key' as const;
export type BaseNangoPlugin<T extends NangoPluginOptions> = CorsairPlugin<
	'nango',
	typeof NangoSchema,
	typeof endpoints,
	Record<string, never>,
	T,
	typeof defaultAuthType
>;
export type InternalNangoPlugin = BaseNangoPlugin<NangoPluginOptions>;
export type ExternalNangoPlugin<T extends NangoPluginOptions> =
	BaseNangoPlugin<T>;

export function nango(): ExternalNangoPlugin<{}>;
export function nango<const T extends NangoPluginOptions>(
	options: NangoPluginOptions & T,
): ExternalNangoPlugin<T>;
export function nango(
	incomingOptions: NangoPluginOptions = {},
): InternalNangoPlugin {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'nango',
		authConfig: nangoAuthConfig,
		schema: NangoSchema,
		options,
		hooks: options.hooks,
		endpoints,
		webhooks: {},
		endpointMeta,
		endpointSchemas: nangoEndpointSchemas,
		errorHandlers: {
			RATE_LIMIT_ERROR: errorHandlers.RATE_LIMIT_ERROR,
			AUTH_ERROR: errorHandlers.AUTH_ERROR,
			...options.errorHandlers,
			DEFAULT: options.errorHandlers?.DEFAULT ?? errorHandlers.DEFAULT,
		},
		keyBuilder: async (ctx: NangoKeyBuilderContext, source) => {
			if (source !== 'endpoint') return '';
			if (options.key?.trim()) return options.key;
			if (!ctx.keys) throw new AuthMissingError('nango', options.authType);
			const key = await ctx.keys.get_api_key();
			if (key?.trim()) return key;
			throw new AuthMissingError('nango', ctx.authType);
		},
	} satisfies InternalNangoPlugin;
}
export { NangoError } from './client';
export * from './endpoints/types';
