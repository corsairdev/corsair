import type {
	AuthTypes,
	CorsairErrorHandler,
	CorsairPlugin,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import type { LogoDevContext } from './context';
import { fetchLogo, searchBrands } from './endpoints';
import {
	FetchLogoInputSchema,
	FetchLogoResponseSchema,
	SearchBrandsInputSchema,
	SearchBrandsResponseSchema,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { LogoDevSchema } from './schema';

export type { LogoDevContext };

export type LogoDevPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalLogoDevPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof logoDevEndpointsNested>;
};

export type LogoDevKeyBuilderContext = KeyBuilderContext<LogoDevPluginOptions>;

const logoDevEndpointsNested = {
	brands: { search: searchBrands },
	logos: { fetch: fetchLogo },
} as const;

const logoDevWebhooksNested = {} as const;

export const logoDevEndpointSchemas = {
	'brands.search': {
		input: SearchBrandsInputSchema,
		output: SearchBrandsResponseSchema,
	},
	'logos.fetch': {
		input: FetchLogoInputSchema,
		output: FetchLogoResponseSchema,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof logoDevEndpointsNested
>;

const logoDevEndpointMeta = {
	'brands.search': {
		riskLevel: 'destructive',
		description:
			'Search brands by name. Logo.dev charges API credits on every search.',
	},
	'logos.fetch': {
		riskLevel: 'read',
		description:
			'Fetch the content type of a domain logo from the Logo.dev CDN.',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof logoDevEndpointsNested>;

const defaultAuthType = 'api_key' as const satisfies AuthTypes;

export const logoDevAuthConfig = {
	api_key: {
		account: [] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseLogoDevPlugin<T extends LogoDevPluginOptions> = CorsairPlugin<
	'logodev',
	typeof LogoDevSchema,
	typeof logoDevEndpointsNested,
	typeof logoDevWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalLogoDevPlugin = BaseLogoDevPlugin<LogoDevPluginOptions>;

export type ExternalLogoDevPlugin<T extends LogoDevPluginOptions> =
	BaseLogoDevPlugin<T>;

export function logodev<const T extends LogoDevPluginOptions>(
	incomingOptions: LogoDevPluginOptions & T = {} as LogoDevPluginOptions & T,
): ExternalLogoDevPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'logodev',
		authConfig: logoDevAuthConfig,
		schema: LogoDevSchema,
		options,
		hooks: options.hooks,
		endpoints: logoDevEndpointsNested,
		webhooks: logoDevWebhooksNested,
		endpointMeta: logoDevEndpointMeta,
		endpointSchemas: logoDevEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: LogoDevKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}
			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				return key ?? '';
			}
			return '';
		},
	} satisfies InternalLogoDevPlugin;
}
