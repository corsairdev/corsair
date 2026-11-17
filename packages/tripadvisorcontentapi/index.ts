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
import type { TripadvisorContentApiContext } from './context';
import {
	getLocation,
	listPhotos,
	listReviews,
	searchLocations,
	searchNearby,
} from './endpoints';
import {
	LocationInputSchema,
	LocationListResponseSchema,
	LocationResponseSchema,
	NearbyInputSchema,
	PhotoListResponseSchema,
	ReviewListResponseSchema,
	SearchInputSchema,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { TripadvisorContentApiSchema } from './schema';

export type { TripadvisorContentApiContext };

export type TripadvisorContentApiPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalTripadvisorContentApiPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof tripadvisorEndpointsNested>;
};

export type TripadvisorContentApiKeyBuilderContext =
	KeyBuilderContext<TripadvisorContentApiPluginOptions>;

const tripadvisorEndpointsNested = {
	locations: {
		search: searchLocations,
		nearby: searchNearby,
		get: getLocation,
	},
	photos: { list: listPhotos },
	reviews: { list: listReviews },
} as const;

const tripadvisorWebhooksNested = {} as const;

export const tripadvisorEndpointSchemas = {
	'locations.search': {
		input: SearchInputSchema,
		output: LocationListResponseSchema,
	},
	'locations.nearby': {
		input: NearbyInputSchema,
		output: LocationListResponseSchema,
	},
	'locations.get': {
		input: LocationInputSchema,
		output: LocationResponseSchema,
	},
	'photos.list': {
		input: LocationInputSchema,
		output: PhotoListResponseSchema,
	},
	'reviews.list': {
		input: LocationInputSchema,
		output: ReviewListResponseSchema,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof tripadvisorEndpointsNested
>;

const read = (description: string) =>
	({ riskLevel: 'read', description }) as const;

const tripadvisorEndpointMeta = {
	'locations.search': read(
		'Search locations by name. The query is not stored.',
	),
	'locations.nearby': read(
		'Search locations near a coordinate. The coordinate is not stored.',
	),
	'locations.get': read(
		'Read one location. The address and description are not stored.',
	),
	'photos.list': read(
		'List photos for a location. Image URLs and captions are not stored.',
	),
	'reviews.list': read(
		'List reviews for a location. Review text and usernames are not stored.',
	),
} as const satisfies RequiredPluginEndpointMeta<
	typeof tripadvisorEndpointsNested
>;

const defaultAuthType = 'api_key' as const satisfies AuthTypes;

export const tripadvisorAuthConfig = {
	api_key: { account: [] as const },
} as const satisfies PluginAuthConfig;

export type BaseTripadvisorContentApiPlugin<
	T extends TripadvisorContentApiPluginOptions,
> = CorsairPlugin<
	'tripadvisorcontentapi',
	typeof TripadvisorContentApiSchema,
	typeof tripadvisorEndpointsNested,
	typeof tripadvisorWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalTripadvisorContentApiPlugin =
	BaseTripadvisorContentApiPlugin<TripadvisorContentApiPluginOptions>;
export type ExternalTripadvisorContentApiPlugin<
	T extends TripadvisorContentApiPluginOptions,
> = BaseTripadvisorContentApiPlugin<T>;

export function tripadvisorcontentapi<
	const T extends TripadvisorContentApiPluginOptions,
>(
	incomingOptions: TripadvisorContentApiPluginOptions &
		T = {} as TripadvisorContentApiPluginOptions & T,
): ExternalTripadvisorContentApiPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'tripadvisorcontentapi',
		authConfig: tripadvisorAuthConfig,
		schema: TripadvisorContentApiSchema,
		options,
		hooks: options.hooks,
		endpoints: tripadvisorEndpointsNested,
		webhooks: tripadvisorWebhooksNested,
		endpointMeta: tripadvisorEndpointMeta,
		endpointSchemas: tripadvisorEndpointSchemas,
		errorHandlers: { ...errorHandlers, ...options.errorHandlers },
		keyBuilder: async (ctx: TripadvisorContentApiKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) return options.key;
			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				return key ?? '';
			}
			return '';
		},
	} satisfies InternalTripadvisorContentApiPlugin;
}
