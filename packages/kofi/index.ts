import type {
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
import { AuthMissingError } from 'corsair/core';
import { Webhooks } from './endpoints';
import type {
	KofiEndpointInputs,
	KofiEndpointOutputs,
} from './endpoints/types';
import {
	KofiEndpointInputSchemas,
	KofiEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { KofiSchema } from './schema';
import { PaymentWebhooks } from './webhooks';
import type { KofiPayment, KofiWebhookOutputs } from './webhooks/types';
import { KofiPaymentSchema } from './webhooks/types';
import { looksLikeKofiPayment } from './webhooks/verify';

export type KofiPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/**
	 * The verification token from the Ko-fi webhooks page. Ko-fi does not sign a
	 * delivery, so this token is the only proof it came from Ko-fi.
	 */
	key?: string;
	hooks?: InternalKofiPlugin['hooks'];
	webhookHooks?: InternalKofiPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof kofiEndpointsNested>;
};

/**
 * The verification token is an account-level field, so `key` carries it and the
 * key manager stores it beside the key rather than as an integration field.
 */
export const kofiAuthConfig = {
	api_key: {
		account: ['verification_token'] as const,
	},
} as const satisfies PluginAuthConfig;

export type KofiContext = CorsairPluginContext<
	typeof KofiSchema,
	KofiPluginOptions,
	undefined,
	typeof kofiAuthConfig
>;

export type KofiKeyBuilderContext = KeyBuilderContext<
	KofiPluginOptions,
	typeof kofiAuthConfig
>;

export type KofiBoundEndpoints = BindEndpoints<typeof kofiEndpointsNested>;

type KofiEndpoint<K extends keyof KofiEndpointOutputs> = CorsairEndpoint<
	KofiContext,
	KofiEndpointInputs[K],
	KofiEndpointOutputs[K]
>;

export type KofiEndpoints = {
	webhooksListEvents: KofiEndpoint<'webhooksListEvents'>;
};

type KofiWebhook<K extends keyof KofiWebhookOutputs> = CorsairWebhook<
	KofiContext,
	KofiPayment,
	KofiWebhookOutputs[K]
>;

export type KofiWebhooks = {
	donation: KofiWebhook<'donation'>;
	subscription: KofiWebhook<'subscription'>;
	shopOrder: KofiWebhook<'shopOrder'>;
	commission: KofiWebhook<'commission'>;
};

export type KofiBoundWebhooks = BindWebhooks<KofiWebhooks>;

const kofiEndpointsNested = {
	webhooks: {
		listEvents: Webhooks.listEvents,
	},
} as const;

const kofiWebhooksNested = {
	donation: PaymentWebhooks.donation,
	subscription: PaymentWebhooks.subscription,
	shopOrder: PaymentWebhooks.shopOrder,
	commission: PaymentWebhooks.commission,
} as const;

export const kofiEndpointSchemas = {
	'webhooks.listEvents': {
		input: KofiEndpointInputSchemas.webhooksListEvents,
		output: KofiEndpointOutputSchemas.webhooksListEvents,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof kofiEndpointsNested>;

// Every webhook path answers the same payment shape, so the schema is shared
// rather than restated four times.
export const kofiWebhookSchemas = {
	donation: {
		description:
			'A tip or donation. `amount` is a decimal string, and `message` holds the note left with it.',
		payload: KofiPaymentSchema,
		response: KofiPaymentSchema,
	},
	subscription: {
		description:
			'A membership payment, which fires on every payment including the first. `tier_name` names the tier.',
		payload: KofiPaymentSchema,
		response: KofiPaymentSchema,
	},
	shopOrder: {
		description:
			'A shop purchase, with `shop_items` and, for physical goods, `shipping`.',
		payload: KofiPaymentSchema,
		response: KofiPaymentSchema,
	},
	commission: {
		description:
			'A paid commission. Ko-fi documents the type but publishes no example payload.',
		payload: KofiPaymentSchema,
		response: KofiPaymentSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof kofiWebhooksNested>;

const defaultAuthType = 'api_key' as const;

const kofiEndpointMeta = {
	'webhooks.listEvents': {
		riskLevel: 'read',
		description:
			'List the payment types Ko-fi can deliver, from its webhook reference; makes no API call, because Ko-fi has no REST API',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof kofiEndpointsNested>;

export type BaseKofiPlugin<T extends KofiPluginOptions> = CorsairPlugin<
	'kofi',
	typeof KofiSchema,
	typeof kofiEndpointsNested,
	typeof kofiWebhooksNested,
	T,
	typeof defaultAuthType,
	typeof kofiAuthConfig
>;

export type InternalKofiPlugin = BaseKofiPlugin<KofiPluginOptions>;

export type ExternalKofiPlugin<T extends KofiPluginOptions> = BaseKofiPlugin<T>;

export function kofi<const T extends KofiPluginOptions>(
	incomingOptions: KofiPluginOptions & T = {} as KofiPluginOptions & T,
): ExternalKofiPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'kofi',
		schema: KofiSchema,
		options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: kofiEndpointsNested,
		webhooks: kofiWebhooksNested,
		authConfig: kofiAuthConfig,
		endpointMeta: kofiEndpointMeta,
		endpointSchemas: kofiEndpointSchemas,
		webhookSchemas: kofiWebhookSchemas,
		// A delivery is form-encoded, so the match reads the body rather than a
		// header: Ko-fi signs nothing and sends no signature to look for.
		pluginWebhookMatcher: (request) => looksLikeKofiPayment(request.body),
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: KofiKeyBuilderContext, source) => {
			// The webhook path needs the verification token, which is the only
			// thing that makes a delivery trustworthy. An empty string fails the
			// comparison closed rather than accepting everything.
			// `corsair setup ... api_key=<token>` and Hub's connect page store the
			// token as the account's api_key, so that is read when no
			// verification_token was saved.
			if (source === 'webhook') {
				if (options.key) return options.key;
				const stored =
					(await ctx.keys.get_verification_token()) ??
					(await ctx.keys.get_api_key());
				return stored ?? '';
			}

			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res =
					(await ctx.keys.get_verification_token()) ??
					(await ctx.keys.get_api_key());
				if (res) return res;
			}

			throw new AuthMissingError('kofi', ctx.authType ?? 'api_key');
		},
	} satisfies InternalKofiPlugin;
}

export type {
	KofiEndpointInputs,
	KofiEndpointOutputs,
	KofiWebhookEvent,
	WebhooksListEventsInput,
	WebhooksListEventsResponse,
} from './endpoints/types';
export type { KofiPayment, KofiWebhookOutputs } from './webhooks/types';
