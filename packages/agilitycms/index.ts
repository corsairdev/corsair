import type {
	AuthTypes,
	BindEndpoints,
	BindWebhooks,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	CorsairWebhook,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import {
	getContentModels,
	getItem,
	getList,
	getPage,
	getSitemap,
} from './endpoints/example';
import type {
	AgilityCmsEndpointInputs,
	AgilityCmsEndpointOutputs,
	GetContentModelsInput,
	GetItemInput,
	GetListInput,
	GetPageInput,
	GetSitemapInput,
} from './endpoints/types';
import {
	AgilityCmsEndpointInputSchemas,
	AgilityCmsEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { AgilityCmsSchema } from './schema';
import { contentChanged } from './webhooks/example';
import { matchAgilityCmsTenantWebhook } from './webhooks/tenant-matcher';
import type {
	AgilityCmsWebhookOutputs,
	ContentChangedEvent,
} from './webhooks/types';
import { AgilityCmsWebhookPayloadSchema } from './webhooks/types';

export type AgilityCmsPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalAgilityCmsPlugin['hooks'];
	webhookHooks?: InternalAgilityCmsPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof agilityCmsEndpointsNested>;
};

export type AgilityCmsContext = CorsairPluginContext<
	typeof AgilityCmsSchema,
	AgilityCmsPluginOptions
>;

export type AgilityCmsKeyBuilderContext =
	KeyBuilderContext<AgilityCmsPluginOptions>;

export type AgilityCmsBoundEndpoints = BindEndpoints<
	typeof agilityCmsEndpointsNested
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
	getSitemap: AgilityCmsEndpoint<'getSitemap'>;
	getContentModels: AgilityCmsEndpoint<'getContentModels'>;
};

type AgilityCmsWebhook<
	K extends keyof AgilityCmsWebhookOutputs,
	TEvent,
> = CorsairWebhook<AgilityCmsContext, TEvent, AgilityCmsWebhookOutputs[K]>;

export type AgilityCmsWebhooks = {
	contentChanged: AgilityCmsWebhook<'contentChanged', ContentChangedEvent>;
};

export type AgilityCmsBoundWebhooks = BindWebhooks<AgilityCmsWebhooks>;

const agilityCmsEndpointsNested = {
	content: {
		getPage,
		getItem,
		getList,
		getSitemap,
		getContentModels,
	},
} as const;

const agilityCmsWebhooksNested = {
	content: {
		changed: contentChanged,
	},
} as const;

export const agilityCmsEndpointSchemas = {
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

	'content.getSitemap': {
		input: AgilityCmsEndpointInputSchemas.getSitemap,
		output: AgilityCmsEndpointOutputSchemas.getSitemap,
	},

	'content.getContentModels': {
		input: AgilityCmsEndpointInputSchemas.getContentModels,
		output: AgilityCmsEndpointOutputSchemas.getContentModels,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof agilityCmsEndpointsNested
>;

const agilityCmsWebhookSchemas = {
	'content.changed': {
		description: 'Agility CMS content or page changed',
		payload: AgilityCmsWebhookPayloadSchema,
		response: AgilityCmsWebhookPayloadSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<
	typeof agilityCmsWebhooksNested
>;

const defaultAuthType: AuthTypes = 'api_key';

const agilityCmsEndpointMeta = {
	'content.getPage': {
		riskLevel: 'read',
		description: 'Get an Agility CMS page',
	},

	'content.getItem': {
		riskLevel: 'read',
		description: 'Get an Agility CMS content item',
	},

	'content.getList': {
		riskLevel: 'read',
		description: 'Get an Agility CMS content list',
	},

	'content.getSitemap': {
		riskLevel: 'read',
		description: 'Get an Agility CMS sitemap',
	},

	'content.getContentModels': {
		riskLevel: 'read',
		description: 'Get Agility CMS content models',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof agilityCmsEndpointsNested
>;

export const agilityCmsAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseAgilityCmsPlugin<T extends AgilityCmsPluginOptions> =
	CorsairPlugin<
		'agilitycms',
		typeof AgilityCmsSchema,
		typeof agilityCmsEndpointsNested,
		typeof agilityCmsWebhooksNested,
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

		authConfig: agilityCmsAuthConfig,

		schema: AgilityCmsSchema,

		options,

		hooks: options.hooks,

		webhookHooks: options.webhookHooks,

		endpoints: agilityCmsEndpointsNested,

		webhooks: agilityCmsWebhooksNested,

		endpointMeta: agilityCmsEndpointMeta,

		endpointSchemas: agilityCmsEndpointSchemas,

		webhookSchemas: agilityCmsWebhookSchemas,

		pluginWebhookMatcher: (request) => {
			const headers = request.headers;

			return 'x-agility-security-key' in headers;
		},

		pluginTenantWebhookMatcher: matchAgilityCmsTenantWebhook,

		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},

		keyBuilder: async (ctx: AgilityCmsKeyBuilderContext, source) => {
			if (source === 'webhook' && options.webhookSecret) {
				return options.webhookSecret;
			}

			if (source === 'webhook') {
				const res = await ctx.keys.get_webhook_signature();

				return res ?? '';
			}

			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();

				return res ?? '';
			}

			return '';
		},
	} satisfies InternalAgilityCmsPlugin;
}

export type {
	AgilityCmsEndpointInputs,
	AgilityCmsEndpointOutputs,
	GetContentModelsInput,
	GetItemInput,
	GetListInput,
	GetPageInput,
	GetSitemapInput,
} from './endpoints/types';
export type {
	AgilityCmsWebhookOutputs,
	ContentChangedEvent,
} from './webhooks/types';
