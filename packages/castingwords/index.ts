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
	orderUpgrade,
	refundAudiofile,
	setWebhook,
} from './endpoints';
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
	setWebhook: CastingwordsEndpoint<'setWebhook'>;
};

const castingwordsEndpointsNested = {
	createOrder: { create: createOrder },
	prepayBalance: { get: getPrepayBalance },
	audiofileDetails: { get: getAudiofileDetails },
	transcript: { get: getTranscript },
	upgrade: { create: orderUpgrade },
	refund: { create: refundAudiofile },
	invoice: { get: getInvoice },
	webhook: {
		get: getWebhook,
		set: setWebhook,
	},
} as const;

const castingwordsEndpointSchemas = {
	'createOrder.create': {
		input: CastingwordsEndpointInputSchemas.createOrder,
		output: CastingwordsEndpointOutputSchemas.createOrder,
	},
	'prepayBalance.get': {
		input: CastingwordsEndpointInputSchemas.getPrepayBalance,
		output: CastingwordsEndpointOutputSchemas.getPrepayBalance,
	},
	'audiofileDetails.get': {
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
	'webhook.set': {
		input: CastingwordsEndpointInputSchemas.setWebhook,
		output: CastingwordsEndpointOutputSchemas.setWebhook,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof castingwordsEndpointsNested
>;

const castingwordsEndpointMeta = {
	'createOrder.create': {
		riskLevel: 'write',
		description:
			'Create a new CastingWords transcription order from a public media URL',
	},
	'prepayBalance.get': {
		riskLevel: 'read',
		description: 'Get the current CastingWords prepaid balance',
	},
	'audiofileDetails.get': {
		riskLevel: 'read',
		description:
			'Get the current state and details of a CastingWords audiofile',
	},
	'transcript.get': {
		riskLevel: 'read',
		description: 'Retrieve the transcript for a CastingWords audiofile',
	},
	'upgrade.create': {
		riskLevel: 'write',
		description: 'Order one or more upgrades for a CastingWords audiofile',
	},
	'refund.create': {
		riskLevel: 'destructive',
		description:
			'Refund a CastingWords audiofile before transcription work begins',
	},
	'invoice.get': {
		riskLevel: 'read',
		description: 'Get details for a CastingWords invoice',
	},
	'webhook.get': {
		riskLevel: 'read',
		description: 'Get the registered CastingWords webhook URL',
	},
	'webhook.set': {
		riskLevel: 'write',
		description: 'Set the CastingWords webhook URL',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof castingwordsEndpointsNested
>;

export const castingwordsAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
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
	OrderUpgradeInput,
	OrderUpgradeResponse,
	RefundAudiofileInput,
	RefundAudiofileResponse,
	SetWebhookInput,
	SetWebhookResponse,
} from './endpoints/types';
