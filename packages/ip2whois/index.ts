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
import type { Ip2whoisContext } from './context';
import { Domain, Hosted } from './endpoints';
import {
	DomainLookupInputSchema,
	DomainLookupResponseSchema,
	HostedLookupInputSchema,
	HostedLookupResponseSchema,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { Ip2whoisSchema } from './schema';

export type { Ip2whoisContext };

export type Ip2whoisPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalIp2whoisPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof ip2whoisEndpointsNested>;
};

export type Ip2whoisKeyBuilderContext =
	KeyBuilderContext<Ip2whoisPluginOptions>;

const ip2whoisEndpointsNested = {
	domain: Domain,
	hosted: Hosted,
} as const;

const ip2whoisWebhooksNested = {} as const;

export type Ip2whoisBoundEndpoints = BindEndpoints<
	typeof ip2whoisEndpointsNested
>;

export const ip2whoisEndpointSchemas = {
	'domain.lookup': {
		input: DomainLookupInputSchema,
		output: DomainLookupResponseSchema,
	},
	'hosted.lookup': {
		input: HostedLookupInputSchema,
		output: HostedLookupResponseSchema,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof ip2whoisEndpointsNested
>;

const ip2whoisEndpointMeta = {
	'domain.lookup': {
		// Each query spends credits.
		riskLevel: 'destructive',
		description: 'Look up WHOIS registration data for a domain.',
	},
	'hosted.lookup': {
		// Each query spends credits. The IP stays out of the event payload.
		riskLevel: 'destructive',
		description: 'List domains hosted on an IP address.',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof ip2whoisEndpointsNested>;

const defaultAuthType = 'api_key' as const satisfies AuthTypes;

export const ip2whoisAuthConfig = {
	api_key: {
		account: [] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseIp2whoisPlugin<T extends Ip2whoisPluginOptions> = CorsairPlugin<
	'ip2whois',
	typeof Ip2whoisSchema,
	typeof ip2whoisEndpointsNested,
	typeof ip2whoisWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalIp2whoisPlugin = BaseIp2whoisPlugin<Ip2whoisPluginOptions>;

export type ExternalIp2whoisPlugin<T extends Ip2whoisPluginOptions> =
	BaseIp2whoisPlugin<T>;

export function ip2whois<const T extends Ip2whoisPluginOptions>(
	incomingOptions: Ip2whoisPluginOptions & T = {} as Ip2whoisPluginOptions & T,
): ExternalIp2whoisPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'ip2whois',
		authConfig: ip2whoisAuthConfig,
		schema: Ip2whoisSchema,
		options,
		hooks: options.hooks,
		endpoints: ip2whoisEndpointsNested,
		webhooks: ip2whoisWebhooksNested,
		endpointMeta: ip2whoisEndpointMeta,
		endpointSchemas: ip2whoisEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: Ip2whoisKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				return key ?? '';
			}

			return '';
		},
	} satisfies InternalIp2whoisPlugin;
}
