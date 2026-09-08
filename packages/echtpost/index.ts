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
import { Cards, Templates } from './endpoints';
import type {
	EchtpostEndpointInputs,
	EchtpostEndpointOutputs,
} from './endpoints/types';
import {
	EchtpostEndpointInputSchemas,
	EchtpostEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { EchtpostSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { resolveEchtpostOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchEchtpostTenantWebhook } from './webhooks/tenant-matcher';
import type { EchtpostWebhookOutputs, ExampleEvent } from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';

export type EchtpostPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalEchtpostPlugin['hooks'];
	webhookHooks?: InternalEchtpostPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof echtpostEndpointsNested>;
};

export type EchtpostContext = CorsairPluginContext<
	typeof EchtpostSchema,
	EchtpostPluginOptions
>;
export type EchtpostKeyBuilderContext =
	KeyBuilderContext<EchtpostPluginOptions>;
export type EchtpostBoundEndpoints = BindEndpoints<
	typeof echtpostEndpointsNested
>;

type EchtpostEndpoint<K extends keyof EchtpostEndpointOutputs> =
	CorsairEndpoint<
		EchtpostContext,
		EchtpostEndpointInputs[K],
		EchtpostEndpointOutputs[K]
	>;

export type EchtpostEndpoints = {
	listTemplates: EchtpostEndpoint<'listTemplates'>;
	createCard: EchtpostEndpoint<'createCard'>;
	createCardFromTemplate: EchtpostEndpoint<'createCardFromTemplate'>;
	previewFit: EchtpostEndpoint<'previewFit'>;
};

type EchtpostWebhook<
	K extends keyof EchtpostWebhookOutputs,
	TEvent,
> = CorsairWebhook<EchtpostContext, TEvent, EchtpostWebhookOutputs[K]>;

export type EchtpostWebhooks = {
	example: EchtpostWebhook<'example', ExampleEvent>;
};

export type EchtpostBoundWebhooks = BindWebhooks<EchtpostWebhooks>;

const echtpostEndpointsNested = {
	templates: {
		list: Templates.list,
	},
	cards: {
		create: Cards.create,
		createFromTemplate: Cards.createFromTemplate,
		previewFit: Cards.previewFit,
	},
} as const;

const echtpostWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const echtpostEndpointSchemas = {
	'templates.list': {
		input: EchtpostEndpointInputSchemas.listTemplates,
		output: EchtpostEndpointOutputSchemas.listTemplates,
	},
	'cards.create': {
		input: EchtpostEndpointInputSchemas.createCard,
		output: EchtpostEndpointOutputSchemas.createCard,
	},
	'cards.createFromTemplate': {
		input: EchtpostEndpointInputSchemas.createCardFromTemplate,
		output: EchtpostEndpointOutputSchemas.createCardFromTemplate,
	},
	'cards.previewFit': {
		input: EchtpostEndpointInputSchemas.previewFit,
		output: EchtpostEndpointOutputSchemas.previewFit,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof echtpostEndpointsNested
>;

const echtpostWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<
	typeof echtpostWebhooksNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const echtpostEndpointMeta = {
	'templates.list': {
		riskLevel: 'read',
		description:
			'List all available postcard templates in the Echtpost account',
	},
	'cards.create': {
		riskLevel: 'write',
		description: 'Create and send a postcard with custom content and font',
	},
	'cards.createFromTemplate': {
		riskLevel: 'write',
		description: 'Create and send a postcard using a saved template',
	},
	'cards.previewFit': {
		riskLevel: 'read',
		description:
			'Check whether a message fits on a postcard at a given font size',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof echtpostEndpointsNested>;

export const echtpostAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseEchtpostPlugin<T extends EchtpostPluginOptions> = CorsairPlugin<
	'echtpost',
	typeof EchtpostSchema,
	typeof echtpostEndpointsNested,
	typeof echtpostWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalEchtpostPlugin = BaseEchtpostPlugin<EchtpostPluginOptions>;
export type ExternalEchtpostPlugin<T extends EchtpostPluginOptions> =
	BaseEchtpostPlugin<T>;

export function echtpost<const T extends EchtpostPluginOptions>(
	incomingOptions: EchtpostPluginOptions & T = {} as EchtpostPluginOptions & T,
): ExternalEchtpostPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'echtpost',
		authConfig: echtpostAuthConfig,
		schema: EchtpostSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: echtpostEndpointsNested,
		webhooks: echtpostWebhooksNested,
		endpointMeta: echtpostEndpointMeta,
		endpointSchemas: echtpostEndpointSchemas,
		webhookSchemas: echtpostWebhookSchemas,
		pluginWebhookMatcher: (_request) => false,
		pluginTenantWebhookMatcher: matchEchtpostTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveEchtpostOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: EchtpostKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) return options.key;
			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}
			return '';
		},
	} satisfies InternalEchtpostPlugin;
}

export type {
	CreateCardFromTemplateInput,
	CreateCardFromTemplateResponse,
	CreateCardInput,
	CreateCardResponse,
	EchtpostEndpointInputs,
	EchtpostEndpointOutputs,
	ListTemplatesInput,
	ListTemplatesResponse,
	PreviewFitInput,
	PreviewFitResponse,
} from './endpoints/types';
export type { EchtpostWebhookOutputs, ExampleEvent } from './webhooks/types';
