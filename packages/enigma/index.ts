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
import { Brands, LegalEntities, Locations } from './endpoints';
import type {
	EnigmaEndpointInputs,
	EnigmaEndpointOutputs,
} from './endpoints/types';
import {
	EnigmaEndpointInputSchemas,
	EnigmaEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { EnigmaSchema } from './schema';

export type EnigmaPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalEnigmaPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof enigmaEndpointsNested>;
};

export type EnigmaContext = CorsairPluginContext<
	typeof EnigmaSchema,
	EnigmaPluginOptions
>;

export type EnigmaKeyBuilderContext = KeyBuilderContext<EnigmaPluginOptions>;

export type EnigmaBoundEndpoints = BindEndpoints<typeof enigmaEndpointsNested>;

type EnigmaEndpoint<K extends keyof EnigmaEndpointOutputs> = CorsairEndpoint<
	EnigmaContext,
	EnigmaEndpointInputs[K],
	EnigmaEndpointOutputs[K]
>;

export type EnigmaEndpoints = {
	brandsMatch: EnigmaEndpoint<'brandsMatch'>;
	brandsGet: EnigmaEndpoint<'brandsGet'>;
	locationsMatch: EnigmaEndpoint<'locationsMatch'>;
	legalEntitiesGet: EnigmaEndpoint<'legalEntitiesGet'>;
};

const enigmaEndpointsNested = {
	brands: {
		match: Brands.match,
		get: Brands.get,
	},
	locations: {
		match: Locations.match,
	},
	legalEntities: {
		get: LegalEntities.get,
	},
} as const;

export const enigmaEndpointSchemas = {
	'brands.match': {
		input: EnigmaEndpointInputSchemas.brandsMatch,
		output: EnigmaEndpointOutputSchemas.brandsMatch,
	},
	'brands.get': {
		input: EnigmaEndpointInputSchemas.brandsGet,
		output: EnigmaEndpointOutputSchemas.brandsGet,
	},
	'locations.match': {
		input: EnigmaEndpointInputSchemas.locationsMatch,
		output: EnigmaEndpointOutputSchemas.locationsMatch,
	},
	'legalEntities.get': {
		input: EnigmaEndpointInputSchemas.legalEntitiesGet,
		output: EnigmaEndpointOutputSchemas.legalEntitiesGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof enigmaEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const enigmaEndpointMeta = {
	'brands.match': {
		riskLevel: 'read',
		description:
			'Match a business by name, website, phone number or a natural-language prompt, with an optional address and confidence threshold; returns the best-matching brand with its industries, location count and 12-month card revenue',
	},
	'brands.get': {
		riskLevel: 'read',
		description:
			'Get a brand by ID with its operating locations (paged by cursor) and legal entities, each location with its address, operating status and 12-month card revenue',
	},
	'locations.match': {
		riskLevel: 'read',
		description:
			'Match a business location by name, address, website or phone number; returns the address, phone numbers, operating status and parent brands',
	},
	'legalEntities.get': {
		riskLevel: 'read',
		description:
			'Get a legal entity by ID or name, with its registered entities, formation dates, addresses and brands; each list returns up to three entries with a pageInfo flag when more exist',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof enigmaEndpointsNested>;

export type BaseEnigmaPlugin<T extends EnigmaPluginOptions> = CorsairPlugin<
	'enigma',
	typeof EnigmaSchema,
	typeof enigmaEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalEnigmaPlugin = BaseEnigmaPlugin<EnigmaPluginOptions>;

export type ExternalEnigmaPlugin<T extends EnigmaPluginOptions> =
	BaseEnigmaPlugin<T>;

export function enigma<const T extends EnigmaPluginOptions>(
	incomingOptions: EnigmaPluginOptions & T = {} as EnigmaPluginOptions & T,
): ExternalEnigmaPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'enigma',
		schema: EnigmaSchema,
		options: options,
		hooks: options.hooks,
		endpoints: enigmaEndpointsNested,
		webhooks: {},
		endpointMeta: enigmaEndpointMeta,
		endpointSchemas: enigmaEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: EnigmaKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('enigma', ctx.authType ?? 'api_key');
		},
	} satisfies InternalEnigmaPlugin;
}

export { EnigmaAPIError } from './client';

export type {
	BrandsGetInput,
	BrandsGetResponse,
	BrandsMatchInput,
	BrandsMatchResponse,
	EnigmaEndpointInputs,
	EnigmaEndpointOutputs,
	LegalEntitiesGetInput,
	LegalEntitiesGetResponse,
	LocationsMatchInput,
	LocationsMatchResponse,
} from './endpoints/types';
