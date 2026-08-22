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
import { Entries, Environments, Spaces } from './endpoints';
import type {
	ContentfulEndpointInputs,
	ContentfulEndpointOutputs,
} from './endpoints/types';
import {
	ContentfulEndpointInputSchemas,
	ContentfulEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { ContentfulSchema } from './schema';
import { EntriesWebhooks } from './webhooks';
import { matchContentfulTenantWebhook } from './webhooks/tenant-matcher';
import type {
	ContentfulWebhookOutputs,
	ContentfulWebhookPayload,
} from './webhooks/types';
import { ContentfulWebhookPayloadSchema } from './webhooks/types';

export type ContentfulPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalContentfulPlugin['hooks'];
	webhookHooks?: InternalContentfulPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof contentfulEndpointsNested>;
};

export type ContentfulContext = CorsairPluginContext<
	typeof ContentfulSchema,
	ContentfulPluginOptions
>;

export type ContentfulKeyBuilderContext =
	KeyBuilderContext<ContentfulPluginOptions>;

export type ContentfulBoundEndpoints = BindEndpoints<
	typeof contentfulEndpointsNested
>;

type ContentfulEndpoint<K extends keyof ContentfulEndpointOutputs> =
	CorsairEndpoint<
		ContentfulContext,
		ContentfulEndpointInputs[K],
		ContentfulEndpointOutputs[K]
	>;

export type ContentfulEndpoints = {
	spacesGet: ContentfulEndpoint<'spacesGet'>;
	environmentsGet: ContentfulEndpoint<'environmentsGet'>;
	entriesGet: ContentfulEndpoint<'entriesGet'>;
	entriesList: ContentfulEndpoint<'entriesList'>;
};

type ContentfulWebhook<
	K extends keyof ContentfulWebhookOutputs,
	TEvent,
> = CorsairWebhook<ContentfulContext, TEvent, ContentfulWebhookOutputs[K]>;

export type ContentfulWebhooks = {
	entryPublish: ContentfulWebhook<'entryPublish', ContentfulWebhookPayload>;
	entryUnpublish: ContentfulWebhook<'entryUnpublish', ContentfulWebhookPayload>;
};

export type ContentfulBoundWebhooks = BindWebhooks<ContentfulWebhooks>;

const contentfulEndpointsNested = {
	spaces: {
		get: Spaces.get,
	},
	environments: {
		get: Environments.get,
	},
	entries: {
		get: Entries.get,
		list: Entries.list,
	},
} as const;

const contentfulWebhooksNested = {
	entry: {
		publish: EntriesWebhooks.publish,
		unpublish: EntriesWebhooks.unpublish,
	},
} as const;

export const contentfulEndpointSchemas = {
	'spaces.get': {
		input: ContentfulEndpointInputSchemas.spacesGet,
		output: ContentfulEndpointOutputSchemas.spacesGet,
	},
	'environments.get': {
		input: ContentfulEndpointInputSchemas.environmentsGet,
		output: ContentfulEndpointOutputSchemas.environmentsGet,
	},
	'entries.get': {
		input: ContentfulEndpointInputSchemas.entriesGet,
		output: ContentfulEndpointOutputSchemas.entriesGet,
	},
	'entries.list': {
		input: ContentfulEndpointInputSchemas.entriesList,
		output: ContentfulEndpointOutputSchemas.entriesList,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof contentfulEndpointsNested
>;

const contentfulWebhookSchemas = {
	'entry.publish': {
		description: 'A Contentful entry was published',
		payload: ContentfulWebhookPayloadSchema,
		response: ContentfulWebhookPayloadSchema,
	},
	'entry.unpublish': {
		description: 'A Contentful entry was unpublished',
		payload: ContentfulWebhookPayloadSchema,
		response: ContentfulWebhookPayloadSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<
	typeof contentfulWebhooksNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const contentfulEndpointMeta = {
	'spaces.get': {
		riskLevel: 'read',
		description: 'Get a space by ID',
	},
	'environments.get': {
		riskLevel: 'read',
		description: 'Get an environment by ID',
	},
	'entries.get': {
		riskLevel: 'read',
		description: 'Get an entry by ID',
	},
	'entries.list': {
		riskLevel: 'read',
		description: 'List entries',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof contentfulEndpointsNested
>;

export const contentfulAuthConfig = {
	api_key: {
		account: ['account_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseContentfulPlugin<T extends ContentfulPluginOptions> =
	CorsairPlugin<
		'contentful',
		typeof ContentfulSchema,
		typeof contentfulEndpointsNested,
		typeof contentfulWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalContentfulPlugin =
	BaseContentfulPlugin<ContentfulPluginOptions>;

export type ExternalContentfulPlugin<T extends ContentfulPluginOptions> =
	BaseContentfulPlugin<T>;

export function contentful<const T extends ContentfulPluginOptions>(
	incomingOptions: ContentfulPluginOptions & T = {} as ContentfulPluginOptions &
		T,
): ExternalContentfulPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'contentful',
		authConfig: contentfulAuthConfig,
		schema: ContentfulSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: contentfulEndpointsNested,
		webhooks: contentfulWebhooksNested,
		endpointMeta: contentfulEndpointMeta,
		endpointSchemas: contentfulEndpointSchemas,
		webhookSchemas: contentfulWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			return 'x-contentful-topic' in headers;
		},
		pluginTenantWebhookMatcher: matchContentfulTenantWebhook,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: ContentfulKeyBuilderContext, source) => {
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
	} satisfies InternalContentfulPlugin;
}

export type {
	ContentfulEndpointInputs,
	ContentfulEndpointOutputs,
	EntriesGetInput,
	EntriesGetResponse,
	EntriesListInput,
	EntriesListResponse,
	EnvironmentsGetInput,
	EnvironmentsGetResponse,
	SpacesGetInput,
	SpacesGetResponse,
} from './endpoints/types';
export type {
	ContentfulWebhookOutputs,
	ContentfulWebhookPayload,
} from './webhooks/types';
