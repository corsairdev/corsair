import type {
	AuthTypes,
	BindEndpoints,
	CorsairErrorHandler,
	CorsairPlugin,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import type { Ip2proxyContext } from './context';
import { Account, Proxy } from './endpoints';
import {
	Ip2proxyEndpointInputSchemas,
	Ip2proxyEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { Ip2proxySchema } from './schema';

export type { Ip2proxyContext };

export type Ip2proxyPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalIp2proxyPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof ip2proxyEndpointsNested>;
};

export type Ip2proxyKeyBuilderContext =
	KeyBuilderContext<Ip2proxyPluginOptions>;

const ip2proxyEndpointsNested = {
	proxy: Proxy,
	account: Account,
} as const;

const ip2proxyWebhooksNested = {} as const;

export type Ip2proxyBoundEndpoints = BindEndpoints<
	typeof ip2proxyEndpointsNested
>;

export type Ip2proxyEndpoints = {
	proxy: {
		checkProxy: Ip2proxyBoundEndpoints['proxy']['checkProxy'];
	};
	account: {
		getCredits: Ip2proxyBoundEndpoints['account']['getCredits'];
	};
};

export const ip2proxyEndpointSchemas = {
	'proxy.checkProxy': {
		input: Ip2proxyEndpointInputSchemas.checkProxy,
		output: Ip2proxyEndpointOutputSchemas.checkProxy,
	},
	'account.getCredits': {
		input: Ip2proxyEndpointInputSchemas.getCredits,
		output: Ip2proxyEndpointOutputSchemas.getCredits,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof ip2proxyEndpointsNested
>;

const ip2proxyEndpointMeta = {
	'proxy.checkProxy': {
		// A metered lookup (1 credit for PX1 up to 11 for PX11) that only returns
		// data, so it stays `read`, like the Ahrefs plugin's metered reads.
		riskLevel: 'read',
		description:
			'Check whether an IP address is a proxy, VPN, Tor exit, or data-center address.',
	},
	'account.getCredits': {
		riskLevel: 'read',
		description:
			'Get the credits left on the API key. The balance lags by about 10 minutes.',
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
