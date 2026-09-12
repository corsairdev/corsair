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
import { Metadata, Transcript, Web, Youtube } from './endpoints';
import type {
	SupadataEndpointInputs,
	SupadataEndpointOutputs,
} from './endpoints/types';
import {
	SupadataEndpointInputSchemas,
	SupadataEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { SupadataSchema } from './schema';

export type SupadataPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalSupadataPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof supadataEndpointsNested>;
};

export type SupadataContext = CorsairPluginContext<
	typeof SupadataSchema,
	SupadataPluginOptions
>;

export type SupadataKeyBuilderContext =
	KeyBuilderContext<SupadataPluginOptions>;

export type SupadataBoundEndpoints = BindEndpoints<
	typeof supadataEndpointsNested
>;

type SupadataEndpoint<K extends keyof SupadataEndpointOutputs> =
	CorsairEndpoint<
		SupadataContext,
		SupadataEndpointInputs[K],
		SupadataEndpointOutputs[K]
	>;

export type SupadataEndpoints = {
	transcriptGet: SupadataEndpoint<'transcriptGet'>;
	transcriptGetJob: SupadataEndpoint<'transcriptGetJob'>;
	metadataGet: SupadataEndpoint<'metadataGet'>;
	webScrape: SupadataEndpoint<'webScrape'>;
	webMap: SupadataEndpoint<'webMap'>;
	youtubeSearch: SupadataEndpoint<'youtubeSearch'>;
};

const supadataEndpointsNested = {
	transcript: {
		get: Transcript.get,
		getJob: Transcript.getJob,
	},
	metadata: {
		get: Metadata.get,
	},
	web: {
		scrape: Web.scrape,
		map: Web.map,
	},
	youtube: {
		search: Youtube.search,
	},
} as const;

/** No webhook capability of any kind - Supadata API is synchronous/job-based without webhook callbacks. */
const supadataWebhooksNested = {} as const;

export const supadataEndpointSchemas = {
	'transcript.get': {
		input: SupadataEndpointInputSchemas.transcriptGet,
		output: SupadataEndpointOutputSchemas.transcriptGet,
	},
	'transcript.getJob': {
		input: SupadataEndpointInputSchemas.transcriptGetJob,
		output: SupadataEndpointOutputSchemas.transcriptGetJob,
	},
	'metadata.get': {
		input: SupadataEndpointInputSchemas.metadataGet,
		output: SupadataEndpointOutputSchemas.metadataGet,
	},
	'web.scrape': {
		input: SupadataEndpointInputSchemas.webScrape,
		output: SupadataEndpointOutputSchemas.webScrape,
	},
	'web.map': {
		input: SupadataEndpointInputSchemas.webMap,
		output: SupadataEndpointOutputSchemas.webMap,
	},
	'youtube.search': {
		input: SupadataEndpointInputSchemas.youtubeSearch,
		output: SupadataEndpointOutputSchemas.youtubeSearch,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof supadataEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const supadataEndpointMeta = {
	'transcript.get': {
		riskLevel: 'read',
		description: 'Retrieve transcripts for a video or file URL',
	},
	'transcript.getJob': {
		riskLevel: 'read',
		description:
			'Retrieve the status or result of an asynchronous transcript job',
	},
	'metadata.get': {
		riskLevel: 'read',
		description: 'Retrieve metadata for media from social platforms',
	},
	'web.scrape': {
		riskLevel: 'read',
		description: 'Scrape and extract web page content in markdown format',
	},
	'web.map': {
		riskLevel: 'read',
		description: 'Discover and map URLs on a target website domain',
	},
	'youtube.search': {
		riskLevel: 'read',
		description: 'Search YouTube for videos, channels, or playlists',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof supadataEndpointsNested>;

export const supadataAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseSupadataPlugin<T extends SupadataPluginOptions> = CorsairPlugin<
	'supadata',
	typeof SupadataSchema,
	typeof supadataEndpointsNested,
	typeof supadataWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalSupadataPlugin = BaseSupadataPlugin<SupadataPluginOptions>;

export type ExternalSupadataPlugin<T extends SupadataPluginOptions> =
	BaseSupadataPlugin<T>;

export function supadata<const T extends SupadataPluginOptions>(
	incomingOptions: SupadataPluginOptions & T = {} as SupadataPluginOptions & T,
): ExternalSupadataPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'supadata',
		authConfig: supadataAuthConfig,
		schema: SupadataSchema,
		options: options,
		hooks: options.hooks,
		endpoints: supadataEndpointsNested,
		webhooks: supadataWebhooksNested,
		endpointMeta: supadataEndpointMeta,
		endpointSchemas: supadataEndpointSchemas,
		webhookSchemas: {},
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: SupadataKeyBuilderContext) => {
			if (options.key) {
				return options.key;
			}

			if (ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) {
					return res;
				}
				throw new AuthMissingError('supadata', 'api_key');
			}

			throw new AuthMissingError('supadata', 'api_key');
		},
	} satisfies InternalSupadataPlugin;
}

export type {
	MetadataAuthor,
	MetadataInput,
	MetadataOutput,
	SupadataEndpointInputs,
	SupadataEndpointOutputs,
	TranscriptChunk,
	TranscriptInput,
	TranscriptJobInput,
	TranscriptJobStatusOutput,
	TranscriptOutput,
	WebMapInput,
	WebMapOutput,
	WebScrapeInput,
	WebScrapeOutput,
	YoutubeSearchInput,
	YoutubeSearchOutput,
	YoutubeSearchResultItem,
} from './endpoints/types';
export {
	SupadataEndpointInputSchemas,
	SupadataEndpointOutputSchemas,
} from './endpoints/types';
