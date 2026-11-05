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
import {
	Attractions,
	Classifications,
	Events,
	Suggest,
	Venues,
} from './endpoints';
import type {
	TicketmasterEndpointInputs,
	TicketmasterEndpointOutputs,
} from './endpoints/types';
import {
	TicketmasterEndpointInputSchemas,
	TicketmasterEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { TicketmasterSchema } from './schema';

export type TicketmasterPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalTicketmasterPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof ticketmasterEndpointsNested>;
};

export type TicketmasterContext = CorsairPluginContext<
	typeof TicketmasterSchema,
	TicketmasterPluginOptions
>;

export type TicketmasterKeyBuilderContext =
	KeyBuilderContext<TicketmasterPluginOptions>;

export type TicketmasterBoundEndpoints = BindEndpoints<
	typeof ticketmasterEndpointsNested
>;

type TicketmasterEndpoint<K extends keyof TicketmasterEndpointOutputs> =
	CorsairEndpoint<
		TicketmasterContext,
		TicketmasterEndpointInputs[K],
		TicketmasterEndpointOutputs[K]
	>;

export type TicketmasterEndpoints = {
	eventsSearch: TicketmasterEndpoint<'eventsSearch'>;
	eventsGet: TicketmasterEndpoint<'eventsGet'>;
	eventsGetImages: TicketmasterEndpoint<'eventsGetImages'>;
	attractionsSearch: TicketmasterEndpoint<'attractionsSearch'>;
	attractionsGet: TicketmasterEndpoint<'attractionsGet'>;
	venuesSearch: TicketmasterEndpoint<'venuesSearch'>;
	venuesGet: TicketmasterEndpoint<'venuesGet'>;
	classificationsSearch: TicketmasterEndpoint<'classificationsSearch'>;
	classificationsGet: TicketmasterEndpoint<'classificationsGet'>;
	suggestGet: TicketmasterEndpoint<'suggestGet'>;
};

const ticketmasterEndpointsNested = {
	events: {
		search: Events.search,
		get: Events.get,
		getImages: Events.getImages,
	},
	attractions: {
		search: Attractions.search,
		get: Attractions.get,
	},
	venues: {
		search: Venues.search,
		get: Venues.get,
	},
	classifications: {
		search: Classifications.search,
		get: Classifications.get,
	},
	suggest: {
		get: Suggest.get,
	},
} as const;

export const ticketmasterEndpointSchemas = {
	'events.search': {
		input: TicketmasterEndpointInputSchemas.eventsSearch,
		output: TicketmasterEndpointOutputSchemas.eventsSearch,
	},
	'events.get': {
		input: TicketmasterEndpointInputSchemas.eventsGet,
		output: TicketmasterEndpointOutputSchemas.eventsGet,
	},
	'events.getImages': {
		input: TicketmasterEndpointInputSchemas.eventsGetImages,
		output: TicketmasterEndpointOutputSchemas.eventsGetImages,
	},
	'attractions.search': {
		input: TicketmasterEndpointInputSchemas.attractionsSearch,
		output: TicketmasterEndpointOutputSchemas.attractionsSearch,
	},
	'attractions.get': {
		input: TicketmasterEndpointInputSchemas.attractionsGet,
		output: TicketmasterEndpointOutputSchemas.attractionsGet,
	},
	'venues.search': {
		input: TicketmasterEndpointInputSchemas.venuesSearch,
		output: TicketmasterEndpointOutputSchemas.venuesSearch,
	},
	'venues.get': {
		input: TicketmasterEndpointInputSchemas.venuesGet,
		output: TicketmasterEndpointOutputSchemas.venuesGet,
	},
	'classifications.search': {
		input: TicketmasterEndpointInputSchemas.classificationsSearch,
		output: TicketmasterEndpointOutputSchemas.classificationsSearch,
	},
	'classifications.get': {
		input: TicketmasterEndpointInputSchemas.classificationsGet,
		output: TicketmasterEndpointOutputSchemas.classificationsGet,
	},
	'suggest.get': {
		input: TicketmasterEndpointInputSchemas.suggestGet,
		output: TicketmasterEndpointOutputSchemas.suggestGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof ticketmasterEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const ticketmasterEndpointMeta = {
	'events.search': {
		riskLevel: 'read',
		description:
			'Search events by keyword, attraction, venue, location, date, classification or onsale window, with paging and sorting',
	},
	'events.get': {
		riskLevel: 'read',
		description:
			'Get one event by ID, including its dates, sales window, price ranges, images, venue and attractions',
	},
	'events.getImages': {
		riskLevel: 'read',
		description:
			'Get the images for one event by ID, with each ratio, size and URL',
	},
	'attractions.search': {
		riskLevel: 'read',
		description:
			'Search attractions (artists, teams, shows) by keyword, classification or source, with paging and sorting',
	},
	'attractions.get': {
		riskLevel: 'read',
		description:
			'Get one attraction by ID, including its images, classifications and aliases',
	},
	'venues.search': {
		riskLevel: 'read',
		description:
			'Search venues by keyword, country, state or geo point, with paging and sorting',
	},
	'venues.get': {
		riskLevel: 'read',
		description:
			'Get one venue by ID, including its address, location, timezone, markets and images',
	},
	'classifications.search': {
		riskLevel: 'read',
		description:
			'Search the segment, genre and sub-genre tree Ticketmaster uses to classify events and attractions',
	},
	'classifications.get': {
		riskLevel: 'read',
		description:
			'Get one segment, genre or sub-genre by ID, with the level below it',
	},
	'suggest.get': {
		riskLevel: 'read',
		description:
			'Suggest attractions, events, venues and products for a partial search term, as a type-ahead would',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof ticketmasterEndpointsNested
>;

export type BaseTicketmasterPlugin<T extends TicketmasterPluginOptions> =
	CorsairPlugin<
		'ticketmaster',
		typeof TicketmasterSchema,
		typeof ticketmasterEndpointsNested,
		{},
		T,
		typeof defaultAuthType
	>;

export type InternalTicketmasterPlugin =
	BaseTicketmasterPlugin<TicketmasterPluginOptions>;

export type ExternalTicketmasterPlugin<T extends TicketmasterPluginOptions> =
	BaseTicketmasterPlugin<T>;

/**
 * Creates the Ticketmaster plugin.
 *
 * Auth is a single API key, sent as the `apikey` query parameter. Every
 * operation is a read: the Discovery API has no writes. The plugin registers no
 * webhooks, and no error handler is called with a webhook source.
 */
export function ticketmaster<const T extends TicketmasterPluginOptions>(
	incomingOptions: TicketmasterPluginOptions &
		T = {} as TicketmasterPluginOptions & T,
): ExternalTicketmasterPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'ticketmaster',
		schema: TicketmasterSchema,
		options: options,
		hooks: options.hooks,
		endpoints: ticketmasterEndpointsNested,
		webhooks: {},
		endpointMeta: ticketmasterEndpointMeta,
		endpointSchemas: ticketmasterEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: TicketmasterKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('ticketmaster', ctx.authType ?? 'api_key');
		},
	} satisfies InternalTicketmasterPlugin;
}

export { TicketmasterAPIError } from './client';

export type {
	AttractionsGetInput,
	AttractionsGetResponse,
	AttractionsSearchInput,
	AttractionsSearchResponse,
	ClassificationsGetInput,
	ClassificationsGetResponse,
	ClassificationsSearchInput,
	ClassificationsSearchResponse,
	EventsGetImagesInput,
	EventsGetImagesResponse,
	EventsGetInput,
	EventsGetResponse,
	EventsSearchInput,
	EventsSearchResponse,
	SuggestGetInput,
	SuggestGetResponse,
	TicketmasterAttraction,
	TicketmasterClassification,
	TicketmasterClassificationEntry,
	TicketmasterEndpointInputs,
	TicketmasterEndpointOutputs,
	TicketmasterEvent,
	TicketmasterGenre,
	TicketmasterImage,
	TicketmasterPage,
	TicketmasterSaleWindow,
	TicketmasterSegment,
	TicketmasterSubGenre,
	TicketmasterVenue,
	VenuesGetInput,
	VenuesGetResponse,
	VenuesSearchInput,
	VenuesSearchResponse,
} from './endpoints/types';
