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
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { Google } from './endpoints';
import type {
	AutomEndpointInputs,
	AutomEndpointOutputs,
} from './endpoints/types';
import {
	AutomEndpointInputSchemas,
	AutomEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { AutomSchema } from './schema';

export type AutomPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalAutomPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof automEndpointsNested>;
};

export type AutomContext = CorsairPluginContext<
	typeof AutomSchema,
	AutomPluginOptions
>;

export type AutomKeyBuilderContext = KeyBuilderContext<AutomPluginOptions>;

export type AutomBoundEndpoints = BindEndpoints<typeof automEndpointsNested>;

type AutomEndpoint<K extends keyof AutomEndpointOutputs> = CorsairEndpoint<
	AutomContext,
	AutomEndpointInputs[K],
	AutomEndpointOutputs[K]
>;

export type AutomEndpoints = {
	googleCountries: AutomEndpoint<'googleCountries'>;
	googleLanguages: AutomEndpoint<'googleLanguages'>;
	googleLocations: AutomEndpoint<'googleLocations'>;
	googleImages: AutomEndpoint<'googleImages'>;
};

const automEndpointsNested = {
	google: {
		countries: Google.countries,
		languages: Google.languages,
		locations: Google.locations,
		images: Google.images,
	},
} as const;

export const automEndpointSchemas = {
	'google.countries': {
		input: AutomEndpointInputSchemas.googleCountries,
		output: AutomEndpointOutputSchemas.googleCountries,
	},
	'google.languages': {
		input: AutomEndpointInputSchemas.googleLanguages,
		output: AutomEndpointOutputSchemas.googleLanguages,
	},
	'google.locations': {
		input: AutomEndpointInputSchemas.googleLocations,
		output: AutomEndpointOutputSchemas.googleLocations,
	},
	'google.images': {
		input: AutomEndpointInputSchemas.googleImages,
		output: AutomEndpointOutputSchemas.googleImages,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof automEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const automEndpointMeta = {
	'google.countries': {
		riskLevel: 'read',
		description: 'Retrieve Google-supported countries filtered by search term.',
	},
	'google.languages': {
		riskLevel: 'read',
		description: 'Retrieve Google-supported languages filtered by search term.',
	},
	'google.locations': {
		riskLevel: 'read',
		description: 'Retrieve Google-supported locations filtered by search term.',
	},
	'google.images': {
		riskLevel: 'read',
		description: 'Fetch image search results from Google Search.',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof automEndpointsNested>;

export const automAuthConfig = {
	api_key: {
		account: ['generic_api_key'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseAutomPlugin<T extends AutomPluginOptions> = CorsairPlugin<
	'autom',
	typeof AutomSchema,
	typeof automEndpointsNested,
	Record<string, never>,
	T,
	typeof defaultAuthType,
	typeof automAuthConfig
>;

export type InternalAutomPlugin = BaseAutomPlugin<AutomPluginOptions>;

export type ExternalAutomPlugin<T extends AutomPluginOptions> =
	BaseAutomPlugin<T>;

export function autom<const T extends AutomPluginOptions>(
	incomingOptions: AutomPluginOptions & T = {} as AutomPluginOptions & T,
): ExternalAutomPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'autom',
		authConfig: automAuthConfig,
		schema: AutomSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: automEndpointsNested,
		webhooks: {},
		endpointMeta: automEndpointMeta,
		endpointSchemas: automEndpointSchemas,
		webhookSchemas: {},
		pluginWebhookMatcher: () => false,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: AutomKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key?.trim()) {
				return options.key.trim();
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res?.trim()) return res.trim();
			}

			throw new AuthMissingError('autom', 'api_key');
		},
	} satisfies InternalAutomPlugin;
}

export type {
	AutomEndpointInputs,
	AutomEndpointOutputs,
	GoogleCountriesInput,
	GoogleCountriesResponse,
	GoogleImagesInput,
	GoogleImagesResponse,
	GoogleLanguagesInput,
	GoogleLanguagesResponse,
	GoogleLocationsInput,
	GoogleLocationsResponse,
} from './endpoints/types';
