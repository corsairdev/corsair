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
import { Checks, Nodes } from './endpoints';
import type {
	UpdownIOEndpointInputs,
	UpdownIOEndpointOutputs,
} from './endpoints/types';
import {
	UpdownIOEndpointInputSchemas,
	UpdownIOEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { UpdownIOSchema } from './schema';

export type UpdownIOPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalUpdownIOPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof updownIOEndpointsNested>;
};
export type UpdownIOContext = CorsairPluginContext<
	typeof UpdownIOSchema,
	UpdownIOPluginOptions
>;
export type UpdownIOKeyBuilderContext =
	KeyBuilderContext<UpdownIOPluginOptions>;
export type UpdownIOBoundEndpoints = BindEndpoints<
	typeof updownIOEndpointsNested
>;

type UpdownIOEndpoint<K extends keyof UpdownIOEndpointOutputs> =
	CorsairEndpoint<
		UpdownIOContext,
		UpdownIOEndpointInputs[K],
		UpdownIOEndpointOutputs[K]
	>;
export type UpdownIOEndpoints = {
	checksList: UpdownIOEndpoint<'checksList'>;
	nodesList: UpdownIOEndpoint<'nodesList'>;
	nodesListIps: UpdownIOEndpoint<'nodesListIps'>;
	nodesListIpv4: UpdownIOEndpoint<'nodesListIpv4'>;
	nodesListIpv6: UpdownIOEndpoint<'nodesListIpv6'>;
};

const updownIOEndpointsNested = {
	checks: { list: Checks.list },
	nodes: {
		list: Nodes.list,
		listIps: Nodes.listIps,
		listIpv4: Nodes.listIpv4,
		listIpv6: Nodes.listIpv6,
	},
} as const;
const updownIOWebhooksNested = {} as const;

export const updownIOEndpointSchemas = {
	'checks.list': {
		input: UpdownIOEndpointInputSchemas.checksList,
		output: UpdownIOEndpointOutputSchemas.checksList,
	},
	'nodes.list': {
		input: UpdownIOEndpointInputSchemas.nodesList,
		output: UpdownIOEndpointOutputSchemas.nodesList,
	},
	'nodes.listIps': {
		input: UpdownIOEndpointInputSchemas.nodesListIps,
		output: UpdownIOEndpointOutputSchemas.nodesListIps,
	},
	'nodes.listIpv4': {
		input: UpdownIOEndpointInputSchemas.nodesListIpv4,
		output: UpdownIOEndpointOutputSchemas.nodesListIpv4,
	},
	'nodes.listIpv6': {
		input: UpdownIOEndpointInputSchemas.nodesListIpv6,
		output: UpdownIOEndpointOutputSchemas.nodesListIpv6,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof updownIOEndpointsNested
>;
const updownIOWebhookSchemas =
	{} as const satisfies RequiredPluginWebhookSchemas<
		typeof updownIOWebhooksNested
	>;

const updownIOEndpointMeta = {
	'checks.list': {
		riskLevel: 'read',
		description: 'List all monitoring checks on the account',
	},
	'nodes.list': {
		riskLevel: 'read',
		description: 'List all Updown.io monitoring and webhook nodes',
	},
	'nodes.listIps': {
		riskLevel: 'read',
		description: 'List all Updown.io node IP addresses',
	},
	'nodes.listIpv4': {
		riskLevel: 'read',
		description: 'List all Updown.io node IPv4 addresses',
	},
	'nodes.listIpv6': {
		riskLevel: 'read',
		description: 'List all Updown.io node IPv6 addresses',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof updownIOEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key';
export const updownIOAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseUpdownIOPlugin<T extends UpdownIOPluginOptions> = CorsairPlugin<
	'updownio',
	typeof UpdownIOSchema,
	typeof updownIOEndpointsNested,
	typeof updownIOWebhooksNested,
	T,
	typeof defaultAuthType
>;
export type InternalUpdownIOPlugin = BaseUpdownIOPlugin<UpdownIOPluginOptions>;
export type ExternalUpdownIOPlugin<T extends UpdownIOPluginOptions> =
	BaseUpdownIOPlugin<T>;

export function updownio<const T extends UpdownIOPluginOptions>(
	incomingOptions: UpdownIOPluginOptions & T = {} as UpdownIOPluginOptions & T,
): ExternalUpdownIOPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'updownio',
		authConfig: updownIOAuthConfig,
		schema: UpdownIOSchema,
		options,
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: updownIOEndpointsNested,
		webhooks: updownIOWebhooksNested,
		endpointMeta: updownIOEndpointMeta,
		endpointSchemas: updownIOEndpointSchemas,
		webhookSchemas: updownIOWebhookSchemas,
		pluginWebhookMatcher: undefined,
		errorHandlers: { ...errorHandlers, ...options.errorHandlers },
		keyBuilder: async (ctx: UpdownIOKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) return options.key;
			if (source === 'endpoint') {
				const key = await ctx.keys.get_api_key();
				if (key) return key;
			}
			throw new AuthMissingError('updownio', 'api_key');
		},
	} satisfies InternalUpdownIOPlugin;
}

export * from './endpoints/types';
export { UpdownIOSchema } from './schema';
