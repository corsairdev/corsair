import type {
	AuthTypes,
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
import { Proxy } from './endpoints';
import {
	Ip2proxyEndpointInputSchemas,
	Ip2proxyEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { Ip2proxySchema } from './schema';

export type Ip2proxyPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalIp2proxyPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof ip2proxyEndpointsNested>;
};

export type Ip2proxyContext = CorsairPluginContext<
	typeof Ip2proxySchema,
	Ip2proxyPluginOptions
>;

export type Ip2proxyKeyBuilderContext =
	KeyBuilderContext<Ip2proxyPluginOptions>;

const ip2proxyEndpointsNested = {
	proxy: Proxy,
} as const;

const ip2proxyWebhooksNested = {} as const;

export type Ip2proxyBoundEndpoints = BindEndpoints<
	typeof ip2proxyEndpointsNested
>;

export type Ip2proxyEndpoints = {
	proxy: {
		checkProxy: Ip2proxyBoundEndpoints['proxy']['checkProxy'];
	};
};

export const ip2proxyEndpointSchemas = {
	'proxy.checkProxy': {
		input: Ip2proxyEndpointInputSchemas.checkProxy,
		output: Ip2proxyEndpointOutputSchemas.checkProxy,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof ip2proxyEndpointsNested
>;

const ip2proxyEndpointMeta = {
	'proxy.checkProxy': {
		// Each query spends credits (1 for PX1 through 11 for PX11).
		riskLevel: 'destructive',
		description:
			'Check whether an IP address is a proxy, VPN, Tor exit, or data-center address.',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof ip2proxyEndpointsNested>;

const defaultAuthType = 'api_key' as const satisfies AuthTypes;

export const ip2proxyAuthConfig = {
	api_key: {
		account: [] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseIp2proxyPlugin<T extends Ip2proxyPluginOptions> = CorsairPlugin<
	'ip2proxy',
	typeof Ip2proxySchema,
	typeof ip2proxyEndpointsNested,
	typeof ip2proxyWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalIp2proxyPlugin = BaseIp2proxyPlugin<Ip2proxyPluginOptions>;

export type ExternalIp2proxyPlugin<T extends Ip2proxyPluginOptions> =
	BaseIp2proxyPlugin<T>;

export function ip2proxy<const T extends Ip2proxyPluginOptions>(
	incomingOptions: Ip2proxyPluginOptions & T = {} as Ip2proxyPluginOptions & T,
): ExternalIp2proxyPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'ip2proxy',
		authConfig: ip2proxyAuthConfig,
		schema: Ip2proxySchema,
		options,
		hooks: options.hooks,
		endpoints: ip2proxyEndpointsNested,
		webhooks: ip2proxyWebhooksNested,
		endpointMeta: ip2proxyEndpointMeta,
		endpointSchemas: ip2proxyEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: Ip2proxyKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				return key ?? '';
			}

			return '';
		},
	} satisfies InternalIp2proxyPlugin;
}
