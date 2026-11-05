import type {
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
import { Content } from './endpoints';
import type {
	AgilityCmsEndpointInputs,
	AgilityCmsEndpointOutputs,
} from './endpoints/types';
import {
	AgilityCmsEndpointInputSchemas,
	AgilityCmsEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { AgilityCmsSchema } from './schema';

export type AgilityCmsPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	apiBaseUrl?: string;
	hooks?: InternalAgilityCmsPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof agilitycmsEndpointsNested>;
};

export type AgilityCmsContext = CorsairPluginContext<
	typeof AgilityCmsSchema,
	AgilityCmsPluginOptions
>;

export type AgilityCmsKeyBuilderContext =
	KeyBuilderContext<AgilityCmsPluginOptions>;

export type AgilityCmsBoundEndpoints = BindEndpoints<
	typeof agilitycmsEndpointsNested
>;

type AgilityCmsEndpoint<K extends keyof AgilityCmsEndpointOutputs> =
	CorsairEndpoint<
		AgilityCmsContext,
		AgilityCmsEndpointInputs[K],
		AgilityCmsEndpointOutputs[K]
	>;

export type AgilityCmsEndpoints = {
	getPage: AgilityCmsEndpoint<'getPage'>;
	getItem: AgilityCmsEndpoint<'getItem'>;
	getList: AgilityCmsEndpoint<'getList'>;
	getContentModels: AgilityCmsEndpoint<'getContentModels'>;
	getPageModules: AgilityCmsEndpoint<'getPageModules'>;
	getSitemapFlat: AgilityCmsEndpoint<'getSitemapFlat'>;
	getLogs: AgilityCmsEndpoint<'getLogs'>;
	syncPages: AgilityCmsEndpoint<'syncPages'>;
	getApiTypes: AgilityCmsEndpoint<'getApiTypes'>;
};

const agilitycmsEndpointsNested = {
	content: {
		getPage: Content.getPage,
		getItem: Content.getItem,
		getList: Content.getList,
		getContentModels: Content.getContentModels,
		getPageModules: Content.getPageModules,
		getSitemapFlat: Content.getSitemapFlat,
		getLogs: Content.getLogs,
		syncPages: Content.syncPages,
		getApiTypes: Content.getApiTypes,
	},
} as const;

export const agilitycmsEndpointSchemas = {
	'content.getPage': {
		input: AgilityCmsEndpointInputSchemas.getPage,
		output: AgilityCmsEndpointOutputSchemas.getPage,
	},
	'content.getItem': {
		input: AgilityCmsEndpointInputSchemas.getItem,
		output: AgilityCmsEndpointOutputSchemas.getItem,
	},
	'content.getList': {
		input: AgilityCmsEndpointInputSchemas.getList,
		output: AgilityCmsEndpointOutputSchemas.getList,
	},
	'content.getContentModels': {
		input: AgilityCmsEndpointInputSchemas.getContentModels,
		output: AgilityCmsEndpointOutputSchemas.getContentModels,
	},
	'content.getPageModules': {
		input: AgilityCmsEndpointInputSchemas.getPageModules,
		output: AgilityCmsEndpointOutputSchemas.getPageModules,
	},
	'content.getSitemapFlat': {
		input: AgilityCmsEndpointInputSchemas.getSitemapFlat,
		output: AgilityCmsEndpointOutputSchemas.getSitemapFlat,
	},
	'content.getLogs': {
		input: AgilityCmsEndpointInputSchemas.getLogs,
		output: AgilityCmsEndpointOutputSchemas.getLogs,
	},
	'content.syncPages': {
		input: AgilityCmsEndpointInputSchemas.syncPages,
		output: AgilityCmsEndpointOutputSchemas.syncPages,
	},
	'content.getApiTypes': {
		input: AgilityCmsEndpointInputSchemas.getApiTypes,
		output: AgilityCmsEndpointOutputSchemas.getApiTypes,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof agilitycmsEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const agilitycmsEndpointMeta = {
	'content.getPage': {
		riskLevel: 'read',
		description:
			'Retrieve details of a Page including metadata, content zones, and components by page ID',
	},
	'content.getItem': {
		riskLevel: 'read',
		description:
			'Fetch details of a content item by Content ID including fields and metadata',
	},
	'content.getList': {
		riskLevel: 'read',
		description:
			'Retrieve a paginated, filterable list of content items by reference name',
	},
	'content.getContentModels': {
		riskLevel: 'read',
		description: 'Retrieve content models and page module schema definitions',
	},
	'content.getPageModules': {
		riskLevel: 'read',
		description:
			'Retrieve page module UI component definitions for building pages',
	},
	'content.getSitemapFlat': {
		riskLevel: 'read',
		description:
			'Retrieve the flat sitemap dictionary for a specific channel and locale',
	},
	'content.getLogs': {
		riskLevel: 'read',
		description:
			'Retrieve sync items (content change logs) incrementally using sync tokens',
	},
	'content.syncPages': {
		riskLevel: 'read',
		description:
			'Synchronize local page data with CMS incrementally using sync tokens',
	},
	'content.getApiTypes': {
		riskLevel: 'read',
		description:
			'Retrieve enum types and metadata definitions used throughout Agility CMS API',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof agilitycmsEndpointsNested
>;

export const agilitycmsAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseAgilityCmsPlugin<T extends AgilityCmsPluginOptions> =
	CorsairPlugin<
		'agilitycms',
		typeof AgilityCmsSchema,
		typeof agilitycmsEndpointsNested,
		Record<string, never>,
		T,
		typeof defaultAuthType
	>;

export type InternalAgilityCmsPlugin =
	BaseAgilityCmsPlugin<AgilityCmsPluginOptions>;

export type ExternalAgilityCmsPlugin<T extends AgilityCmsPluginOptions> =
	BaseAgilityCmsPlugin<T>;

export function agilitycms<const T extends AgilityCmsPluginOptions>(
	incomingOptions: AgilityCmsPluginOptions & T = {} as AgilityCmsPluginOptions &
		T,
): ExternalAgilityCmsPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'agilitycms',
		authConfig: agilitycmsAuthConfig,
		schema: AgilityCmsSchema,
		options: options,
		hooks: options.hooks,
		endpoints: agilitycmsEndpointsNested,
		webhooks: {},
		endpointMeta: agilitycmsEndpointMeta,
		endpointSchemas: agilitycmsEndpointSchemas,
		webhookSchemas: {},
		pluginWebhookMatcher: () => false,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: AgilityCmsKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys?.get_api_key();
				if (!res) {
					throw new AuthMissingError('agilitycms', 'api_key');
				}
				return res;
			}

			throw new AuthMissingError('agilitycms', 'api_key');
		},
	} satisfies InternalAgilityCmsPlugin;
}

export type {
	AgilityCmsEndpointInputs,
	AgilityCmsEndpointOutputs,
	ContentItem,
	ContentItemProperties,
	ContentModel,
	GetApiTypesInput,
	GetApiTypesResponse,
	GetContentModelsInput,
	GetContentModelsResponse,
	GetItemInput,
	GetItemResponse,
	GetListInput,
	GetListResponse,
	GetLogsInput,
	GetLogsResponse,
	GetPageInput,
	GetPageModulesInput,
	GetPageModulesResponse,
	GetPageResponse,
	GetSitemapFlatInput,
	GetSitemapFlatResponse,
	Page,
	PageModule,
	SitemapNode,
	SyncItem,
	SyncPage,
	SyncPagesInput,
	SyncPagesResponse,
} from './endpoints/types';

export type {
	AgilityCmsContentItem,
	AgilityCmsContentModel,
	AgilityCmsPage,
	AgilityCmsPageModule,
	AgilityCmsSitemapNode,
	AgilityCmsSyncItem,
	AgilityCmsSyncPage,
} from './schema/database';
