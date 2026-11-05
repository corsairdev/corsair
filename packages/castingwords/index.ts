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
import {
	createOrder,
	getAudiofileDetails,
	getInvoice,
	getPrepayBalance,
	getTranscript,
	getWebhook,
	listSkus,
	orderUpgrade,
	refundAudiofile,
	registerWebhook,
	testWebhook,
} from './endpoints/handlers';
import type {
	CastingwordsEndpointInputs,
	CastingwordsEndpointOutputs,
} from './endpoints/types';
import {
	CastingwordsEndpointInputSchemas,
	CastingwordsEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { CastingwordsSchema } from './schema';

export type CastingwordsPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalCastingwordsPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof castingwordsEndpointsNested>;
};

export type CastingwordsContext = CorsairPluginContext<
	typeof CastingwordsSchema,
	CastingwordsPluginOptions
>;

export type CastingwordsKeyBuilderContext =
	KeyBuilderContext<CastingwordsPluginOptions>;
export type CastingwordsBoundEndpoints = BindEndpoints<
	typeof castingwordsEndpointsNested
>;

type CastingwordsEndpoint<K extends keyof CastingwordsEndpointOutputs> =
	CorsairEndpoint<
		CastingwordsContext,
		CastingwordsEndpointInputs[K],
		CastingwordsEndpointOutputs[K]
	>;

export type CastingwordsEndpoints = {
	createOrder: CastingwordsEndpoint<'createOrder'>;
	getPrepayBalance: CastingwordsEndpoint<'getPrepayBalance'>;
	getAudiofileDetails: CastingwordsEndpoint<'getAudiofileDetails'>;
	getTranscript: CastingwordsEndpoint<'getTranscript'>;
	orderUpgrade: CastingwordsEndpoint<'orderUpgrade'>;
	refundAudiofile: CastingwordsEndpoint<'refundAudiofile'>;
	getInvoice: CastingwordsEndpoint<'getInvoice'>;
	getWebhook: CastingwordsEndpoint<'getWebhook'>;
	registerWebhook: CastingwordsEndpoint<'registerWebhook'>;
	testWebhook: CastingwordsEndpoint<'testWebhook'>;
	listSkus: CastingwordsEndpoint<'listSkus'>;
};

const castingwordsEndpointsNested = {
	order: { create: createOrder },
	prepayBalance: { get: getPrepayBalance },
	audiofile: { get: getAudiofileDetails },
	transcript: { get: getTranscript },
	upgrade: { create: orderUpgrade },
	refund: { create: refundAudiofile },
	invoice: { get: getInvoice },
	webhook: {
		get: getWebhook,
		register: registerWebhook,
		test: testWebhook,
	},
	skus: { list: listSkus },
} as const;

const castingwordsEndpointSchemas = {
	'order.create': {
		input: CastingwordsEndpointInputSchemas.createOrder,
		output: CastingwordsEndpointOutputSchemas.createOrder,
	},
	'prepayBalance.get': {
		input: CastingwordsEndpointInputSchemas.getPrepayBalance,
		output: CastingwordsEndpointOutputSchemas.getPrepayBalance,
	},
	'audiofile.get': {
		input: CastingwordsEndpointInputSchemas.getAudiofileDetails,
		output: CastingwordsEndpointOutputSchemas.getAudiofileDetails,
	},
	'transcript.get': {
		input: CastingwordsEndpointInputSchemas.getTranscript,
		output: CastingwordsEndpointOutputSchemas.getTranscript,
	},
	'upgrade.create': {
		input: CastingwordsEndpointInputSchemas.orderUpgrade,
		output: CastingwordsEndpointOutputSchemas.orderUpgrade,
	},
	'refund.create': {
		input: CastingwordsEndpointInputSchemas.refundAudiofile,
		output: CastingwordsEndpointOutputSchemas.refundAudiofile,
	},
	'invoice.get': {
		input: CastingwordsEndpointInputSchemas.getInvoice,
		output: CastingwordsEndpointOutputSchemas.getInvoice,
	},
	'webhook.get': {
		input: CastingwordsEndpointInputSchemas.getWebhook,
		output: CastingwordsEndpointOutputSchemas.getWebhook,
	},
	'webhook.register': {
		input: CastingwordsEndpointInputSchemas.registerWebhook,
		output: CastingwordsEndpointOutputSchemas.registerWebhook,
	},
	'webhook.test': {
		input: CastingwordsEndpointInputSchemas.testWebhook,
		output: CastingwordsEndpointOutputSchemas.testWebhook,
	},
	'skus.list': {
		input: CastingwordsEndpointInputSchemas.listSkus,
		output: CastingwordsEndpointOutputSchemas.listSkus,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof castingwordsEndpointsNested
>;

const castingwordsEndpointMeta = {
	'order.create': {
		riskLevel: 'write',
		description:
			'Create a transcription order for public audio/video URLs (API4 order_url)',
	},
	'prepayBalance.get': {
		riskLevel: 'read',
		description: 'Get the current prepaid balance in USD',
	},
	'audiofile.get': {
		riskLevel: 'read',
		description: 'Get audiofile details including current state',
	},
	'transcript.get': {
		riskLevel: 'read',
		description:
			'Get a completed transcript (txt, doc, rtf, html, srt, docx, tstxt, vtt)',
	},
	'upgrade.create': {
		riskLevel: 'write',
		description: 'Order upgrades for an audiofile (timestamps, captions, etc.)',
	},
	'refund.create': {
		riskLevel: 'destructive',
		description:
			'Cancel and refund an audiofile before transcription work starts',
	},
	'invoice.get': {
		riskLevel: 'read',
		description: 'Get invoice details and line items',
	},
	'webhook.get': {
		riskLevel: 'read',
		description: 'Get the registered account webhook URL',
	},
	'webhook.register': {
		riskLevel: 'write',
		description: 'Register a webhook URL for CastingWords event notifications',
	},
	'webhook.test': {
		riskLevel: 'write',
		description: 'Request a test webhook POST for a documented event type',
	},
	'skus.list': {
		riskLevel: 'read',
		description:
			'List documented CastingWords SKUs from Store API v4 (no live sku endpoint)',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof castingwordsEndpointsNested
>;

export const castingwordsAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

const defaultAuthType: AuthTypes = 'api_key';

export type BaseCastingwordsPlugin<T extends CastingwordsPluginOptions> =
	CorsairPlugin<
		'castingwords',
		typeof CastingwordsSchema,
		typeof castingwordsEndpointsNested,
		Record<string, never>,
		T,
		typeof defaultAuthType
	>;

export type InternalCastingwordsPlugin =
	BaseCastingwordsPlugin<CastingwordsPluginOptions>;
export type ExternalCastingwordsPlugin<T extends CastingwordsPluginOptions> =
	BaseCastingwordsPlugin<T>;

export function castingwords<const T extends CastingwordsPluginOptions>(
	incomingOptions: CastingwordsPluginOptions &
		T = {} as CastingwordsPluginOptions & T,
): ExternalCastingwordsPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'castingwords',
		authConfig: castingwordsAuthConfig,
		schema: CastingwordsSchema,
		options,
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: castingwordsEndpointsNested,
		webhooks: {},
		endpointMeta: castingwordsEndpointMeta,
		endpointSchemas: castingwordsEndpointSchemas,
		webhookSchemas: {},
		pluginWebhookMatcher: undefined,
		pluginTenantWebhookMatcher: undefined,
		oauthWebhookTenantLinkResolver: undefined,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: CastingwordsKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) return options.key;
			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = (await ctx.keys.get_api_key()) ?? '';
				if (!key) throw new AuthMissingError('castingwords', 'api_key');
				return key;
			}
			throw new AuthMissingError('castingwords', 'api_key');
		},
	} satisfies InternalCastingwordsPlugin;
}

export type {
	CastingwordsEndpointInputs,
	CastingwordsEndpointOutputs,
	CreateOrderInput,
	CreateOrderResponse,
	GetAudiofileDetailsInput,
	GetAudiofileDetailsResponse,
	GetInvoiceInput,
	GetInvoiceResponse,
	GetPrepayBalanceInput,
	GetPrepayBalanceResponse,
	GetTranscriptInput,
	GetTranscriptResponse,
	GetWebhookInput,
	GetWebhookResponse,
	ListSkusInput,
	ListSkusResponse,
	OrderUpgradeInput,
	OrderUpgradeResponse,
	RefundAudiofileInput,
	RefundAudiofileResponse,
	RegisterWebhookInput,
	RegisterWebhookResponse,
	TestWebhookInput,
	TestWebhookResponse,
} from './endpoints/types';
