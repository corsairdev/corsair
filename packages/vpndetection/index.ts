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
import type { VpndetectionContext } from './context';
import { Ip } from './endpoints';
import {
	VpndetectionEndpointInputSchemas,
	VpndetectionEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { VpndetectionSchema } from './schema';

export type { VpndetectionContext };

export type VpndetectionPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/** Optional. The API answers without a key; a key adds its plan's fields. */
	key?: string;
	hooks?: InternalVpndetectionPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof vpndetectionEndpointsNested>;
};

export type VpndetectionKeyBuilderContext =
	KeyBuilderContext<VpndetectionPluginOptions>;

const vpndetectionEndpointsNested = {
	ip: Ip,
} as const;

const vpndetectionWebhooksNested = {} as const;

export type VpndetectionBoundEndpoints = BindEndpoints<
	typeof vpndetectionEndpointsNested
>;

export type VpndetectionEndpoints = {
	ip: {
		lookup: VpndetectionBoundEndpoints['ip']['lookup'];
	};
};

export const vpndetectionEndpointSchemas = {
	'ip.lookup': {
		input: VpndetectionEndpointInputSchemas.lookup,
		output: VpndetectionEndpointOutputSchemas.lookup,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof vpndetectionEndpointsNested
>;

const vpndetectionEndpointMeta = {
	'ip.lookup': {
		riskLevel: 'read',
		description:
			'Check whether an IP address is a VPN, a Tor node or a privacy relay, with its country and ASN.',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof vpndetectionEndpointsNested
>;

const defaultAuthType = 'api_key' as const satisfies AuthTypes;

export const vpndetectionAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseVpndetectionPlugin<T extends VpndetectionPluginOptions> =
	CorsairPlugin<
		'vpndetection',
		typeof VpndetectionSchema,
		typeof vpndetectionEndpointsNested,
		typeof vpndetectionWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalVpndetectionPlugin =
	BaseVpndetectionPlugin<VpndetectionPluginOptions>;

export type ExternalVpndetectionPlugin<T extends VpndetectionPluginOptions> =
	BaseVpndetectionPlugin<T>;

export function vpndetection<const T extends VpndetectionPluginOptions>(
	incomingOptions: VpndetectionPluginOptions &
		T = {} as VpndetectionPluginOptions & T,
): ExternalVpndetectionPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'vpndetection',
		authConfig: vpndetectionAuthConfig,
		schema: VpndetectionSchema,
		options,
		hooks: options.hooks,
		endpoints: vpndetectionEndpointsNested,
		webhooks: vpndetectionWebhooksNested,
		endpointMeta: vpndetectionEndpointMeta,
		endpointSchemas: vpndetectionEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		// The key is optional: with none stored, the lookup goes out keyless.
		keyBuilder: async (ctx: VpndetectionKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				return key ?? '';
			}

			return '';
		},
	} satisfies InternalVpndetectionPlugin;
}
