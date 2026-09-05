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
	getNews,
	listDividends,
	listEarnings,
	listEconomics,
	listGuidance,
	listIpos,
	listNewsChannels,
	listRatings,
	listSplits,
	testWebhookDelivery,
} from './endpoints';
import type {
	BenzingaEndpointInputs,
	BenzingaEndpointOutputs,
} from './endpoints/types';
import {
	BenzingaEndpointInputSchemas,
	BenzingaEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { BenzingaSchema } from './schema';
import { BenzingaWebhooks } from './webhooks';
import { resolveBenzingaOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchBenzingaTenantWebhook } from './webhooks/tenant-matcher';
import type {
	BenzingaWebhookOutputs,
	BenzingaWebhookPayload,
} from './webhooks/types';
import { BenzingaWebhookPayloadSchema } from './webhooks/types';

export type BenzingaPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalBenzingaPlugin['hooks'];
	webhookHooks?: InternalBenzingaPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof benzingaEndpointsNested>;
};

export type BenzingaContext = CorsairPluginContext<
	typeof BenzingaSchema,
	BenzingaPluginOptions
>;

export type BenzingaKeyBuilderContext =
	KeyBuilderContext<BenzingaPluginOptions>;

export type BenzingaBoundEndpoints = BindEndpoints<
	typeof benzingaEndpointsNested
>;

type BenzingaEndpoint<K extends keyof BenzingaEndpointOutputs> =
	CorsairEndpoint<
		BenzingaContext,
		BenzingaEndpointInputs[K],
		BenzingaEndpointOutputs[K]
	>;

export type BenzingaEndpoints = {
	getNews: BenzingaEndpoint<'getNews'>;
	listNewsChannels: BenzingaEndpoint<'listNewsChannels'>;
	listEarnings: BenzingaEndpoint<'listEarnings'>;
	listDividends: BenzingaEndpoint<'listDividends'>;
	listRatings: BenzingaEndpoint<'listRatings'>;
	listGuidance: BenzingaEndpoint<'listGuidance'>;
	listIpos: BenzingaEndpoint<'listIpos'>;
	listSplits: BenzingaEndpoint<'listSplits'>;
	listEconomics: BenzingaEndpoint<'listEconomics'>;
	testWebhookDelivery: BenzingaEndpoint<'testWebhookDelivery'>;
};

type BenzingaWebhook<
	K extends keyof BenzingaWebhookOutputs,
	TEvent,
> = CorsairWebhook<BenzingaContext, TEvent, BenzingaWebhookOutputs[K]>;

export type BenzingaWebhooks = {
	data: BenzingaWebhook<'data', BenzingaWebhookPayload>;
};

export type BenzingaBoundWebhooks = BindWebhooks<BenzingaWebhooks>;

const benzingaEndpointsNested = {
	news: {
		get: getNews,
		listChannels: listNewsChannels,
	},
	calendar: {
		listEarnings,
		listDividends,
		listRatings,
		listGuidance,
		listIpos,
		listSplits,
		listEconomics,
	},
	webhook: {
		testDelivery: testWebhookDelivery,
	},
} as const;

const benzingaWebhooksNested = {
	data: {
		data: BenzingaWebhooks.data,
	},
} as const;

export const benzingaEndpointSchemas = {
	'news.get': {
		input: BenzingaEndpointInputSchemas.getNews,
		output: BenzingaEndpointOutputSchemas.getNews,
	},
	'news.listChannels': {
		input: BenzingaEndpointInputSchemas.listNewsChannels,
		output: BenzingaEndpointOutputSchemas.listNewsChannels,
	},
	'calendar.listEarnings': {
		input: BenzingaEndpointInputSchemas.listEarnings,
		output: BenzingaEndpointOutputSchemas.listEarnings,
	},
	'calendar.listDividends': {
		input: BenzingaEndpointInputSchemas.listDividends,
		output: BenzingaEndpointOutputSchemas.listDividends,
	},
	'calendar.listRatings': {
		input: BenzingaEndpointInputSchemas.listRatings,
		output: BenzingaEndpointOutputSchemas.listRatings,
	},
	'calendar.listGuidance': {
		input: BenzingaEndpointInputSchemas.listGuidance,
		output: BenzingaEndpointOutputSchemas.listGuidance,
	},
	'calendar.listIpos': {
		input: BenzingaEndpointInputSchemas.listIpos,
		output: BenzingaEndpointOutputSchemas.listIpos,
	},
	'calendar.listSplits': {
		input: BenzingaEndpointInputSchemas.listSplits,
		output: BenzingaEndpointOutputSchemas.listSplits,
	},
	'calendar.listEconomics': {
		input: BenzingaEndpointInputSchemas.listEconomics,
		output: BenzingaEndpointOutputSchemas.listEconomics,
	},
	'webhook.testDelivery': {
		input: BenzingaEndpointInputSchemas.testWebhookDelivery,
		output: BenzingaEndpointOutputSchemas.testWebhookDelivery,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof benzingaEndpointsNested
>;

const benzingaWebhookSchemas = {
	'data.data': {
		description:
			'Benzinga Data Webhook Engine delivery (X-BZ-Delivery + HMAC-SHA256)',
		payload: BenzingaWebhookPayloadSchema,
		response: BenzingaWebhookPayloadSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<
	typeof benzingaWebhooksNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const benzingaEndpointMeta = {
	'news.get': {
		riskLevel: 'read',
		description:
			'Get Benzinga news articles (GET /api/v2/news, page/pageSize pagination)',
	},
	'news.listChannels': {
		riskLevel: 'read',
		description:
			'List available Benzinga news channels (GET /api/v2.1/news/channels)',
	},
	'calendar.listEarnings': {
		riskLevel: 'read',
		description:
			'List earnings calendar data (GET /api/v2.1/calendar/earnings, page/pagesize pagination)',
	},
	'calendar.listDividends': {
		riskLevel: 'read',
		description:
			'List dividends calendar data (GET /api/v2.2/calendar/dividends, page/pagesize pagination)',
	},
	'calendar.listRatings': {
		riskLevel: 'read',
		description:
			'List analyst ratings data (GET /api/v2.1/calendar/ratings, page/pagesize pagination)',
	},
	'calendar.listGuidance': {
		riskLevel: 'read',
		description:
			'List company guidance data (GET /api/v2.1/calendar/guidance, page/pagesize pagination)',
	},
	'calendar.listIpos': {
		riskLevel: 'read',
		description:
			'List IPO calendar data (GET /api/v2.1/calendar/ipos, page/pagesize pagination)',
	},
	'calendar.listSplits': {
		riskLevel: 'read',
		description:
			'List stock split data (GET /api/v2.1/calendar/splits, page/pagesize pagination)',
	},
	'calendar.listEconomics': {
		riskLevel: 'read',
		description:
			'List economic calendar data (GET /api/v2.1/calendar/economics, page/pagesize pagination)',
	},
	'webhook.testDelivery': {
		riskLevel: 'write',
		description: 'Trigger a test webhook delivery (GET /api/v1/webhook/test)',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof benzingaEndpointsNested>;

export const benzingaAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseBenzingaPlugin<T extends BenzingaPluginOptions> = CorsairPlugin<
	'benzinga',
	typeof BenzingaSchema,
	typeof benzingaEndpointsNested,
	typeof benzingaWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalBenzingaPlugin = BaseBenzingaPlugin<BenzingaPluginOptions>;

export type ExternalBenzingaPlugin<T extends BenzingaPluginOptions> =
	BaseBenzingaPlugin<T>;

function hasBenzingaDeliveryHeaders(
	headers: Record<string, string | string[] | undefined>,
): boolean {
	return (
		'x-bz-delivery' in headers ||
		'X-BZ-Delivery' in headers ||
		'x-bz-signature' in headers ||
		'X-Bz-Signature' in headers
	);
}

export function benzinga<const T extends BenzingaPluginOptions>(
	incomingOptions: BenzingaPluginOptions & T = {} as BenzingaPluginOptions & T,
): ExternalBenzingaPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'benzinga',
		authConfig: benzingaAuthConfig,
		schema: BenzingaSchema,
		options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: benzingaEndpointsNested,
		webhooks: benzingaWebhooksNested,
		endpointMeta: benzingaEndpointMeta,
		endpointSchemas: benzingaEndpointSchemas,
		webhookSchemas: benzingaWebhookSchemas,

		pluginWebhookMatcher: (request) => {
			return hasBenzingaDeliveryHeaders(request.headers);
		},

		pluginTenantWebhookMatcher: matchBenzingaTenantWebhook,

		oauthWebhookTenantLinkResolver: resolveBenzingaOAuthWebhookTenantLink,

		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},

		keyBuilder: async (ctx: BenzingaKeyBuilderContext, source) => {
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

			const res = await ctx.keys.get_api_key();

			return res ?? '';
		},
	} satisfies InternalBenzingaPlugin;
}

export type {
	BenzingaEndpointInputs,
	BenzingaEndpointOutputs,
	GetNewsInput,
	GetNewsResponse,
	ListDividendsInput,
	ListDividendsResponse,
	ListEarningsInput,
	ListEarningsResponse,
	ListEconomicsInput,
	ListEconomicsResponse,
	ListGuidanceInput,
	ListGuidanceResponse,
	ListIposInput,
	ListIposResponse,
	ListNewsChannelsInput,
	ListNewsChannelsResponse,
	ListRatingsInput,
	ListRatingsResponse,
	ListSplitsInput,
	ListSplitsResponse,
	TestWebhookDeliveryInput,
	TestWebhookDeliveryResponse,
} from './endpoints/types';
export type {
	BenzingaWebhookOutputs,
	BenzingaWebhookPayload,
} from './webhooks/types';
