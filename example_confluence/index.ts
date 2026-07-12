import type {
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
} from 'corsair/core';
import * as Pages from './endpoints/pages';
import * as Spaces from './endpoints/spaces';
import type {
	ConfluenceEndpointInputs,
	ConfluenceEndpointOutputs,
} from './endpoints/types';

export type ConfluencePluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	/** Confluence Cloud URL, e.g. 'https://your-domain.atlassian.net'. */
	cloudUrl?: string;
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof confluenceEndpointsNested>;
};

export const confluenceAuthConfig = {
	api_key: {
		account: ['cloud_url'] as const,
	},
} as const satisfies PluginAuthConfig;

export type ConfluenceContext = CorsairPluginContext<
	undefined,
	ConfluencePluginOptions,
	undefined,
	typeof confluenceAuthConfig
>;

export type ConfluenceKeyBuilderContext = KeyBuilderContext<
	ConfluencePluginOptions,
	typeof confluenceAuthConfig
>;

export type ConfluenceBoundEndpoints = BindEndpoints<
	typeof confluenceEndpointsNested
>;

type ConfluenceEndpoint<K extends keyof ConfluenceEndpointOutputs> =
	CorsairEndpoint<
		ConfluenceContext,
		ConfluenceEndpointInputs[K],
		ConfluenceEndpointOutputs[K]
	>;

export type ConfluenceEndpoints = {
	pagesList: ConfluenceEndpoint<'pagesList'>;
	spacesList: ConfluenceEndpoint<'spacesList'>;
};

const confluenceEndpointsNested = {
	pages: {
		list: Pages.list,
	},
	spaces: {
		list: Spaces.list,
	},
} as const;
