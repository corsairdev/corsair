import type {
	AuthTypes,
	BindEndpoints,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import type { SquareEnvironment } from './client';
import { errorHandlers } from './error-handlers';
import { SquareSchema } from './schema';

export type SquarePluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	// Which Square host to call. Sandbox tokens only work on sandbox and
	// production tokens only on production. Defaults to production.
	environment?: SquareEnvironment;
	hooks?: InternalSquarePlugin['hooks'];
	webhookHooks?: InternalSquarePlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof squareEndpointsNested>;
};

export type SquareContext = CorsairPluginContext<
	typeof SquareSchema,
	SquarePluginOptions
>;

export type SquareKeyBuilderContext = KeyBuilderContext<SquarePluginOptions>;

export type SquareBoundEndpoints = BindEndpoints<typeof squareEndpointsNested>;

export type SquareWebhooks = Record<string, never>;

export type SquareBoundWebhooks = Record<string, never>;

// One group per Square API family; operations are added group by group.
const squareEndpointsNested = {
	payments: {},
	refunds: {},
	orders: {},
	paymentLinks: {},
	checkout: {},
	invoices: {},
	customers: {},
	customerGroups: {},
	customerSegments: {},
	customAttributes: {
		customer: {},
		location: {},
		merchant: {},
	},
	customAttributeDefinitions: {
		customer: {},
		location: {},
		merchant: {},
	},
	disputes: {},
	cards: {},
	catalog: {},
	inventory: {},
	locations: {},
	merchants: {},
	channels: {},
	bookings: {},
	oauth: {},
	webhookSubscriptions: {},
	webhookEventTypes: {},
} as const;

const squareWebhooksNested = {} as const;

export const squareEndpointSchemas =
	{} as const satisfies RequiredPluginEndpointSchemas<
		typeof squareEndpointsNested
	>;

const squareWebhookSchemas = {} as const satisfies RequiredPluginWebhookSchemas<
	typeof squareWebhooksNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const squareEndpointMeta = {} as const satisfies RequiredPluginEndpointMeta<
	typeof squareEndpointsNested
>;

export const squareAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseSquarePlugin<T extends SquarePluginOptions> = CorsairPlugin<
	'square',
	typeof SquareSchema,
	typeof squareEndpointsNested,
	typeof squareWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalSquarePlugin = BaseSquarePlugin<SquarePluginOptions>;

export type ExternalSquarePlugin<T extends SquarePluginOptions> =
	BaseSquarePlugin<T>;

export function square<const T extends SquarePluginOptions>(
	incomingOptions: SquarePluginOptions & T = {} as SquarePluginOptions & T,
): ExternalSquarePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'square',
		authConfig: squareAuthConfig,
		schema: SquareSchema,
		options: options,
		oauthConfig: {
			providerName: 'Square',
			authUrl: 'https://connect.squareup.com/oauth2/authorize',
			tokenUrl: 'https://connect.squareup.com/oauth2/token',
			// The scopes Square's spec lists for the operations in this plugin.
			scopes: [
				'APPOINTMENTS_BUSINESS_SETTINGS_READ',
				'CHANNELS_READ',
				'CUSTOMERS_READ',
				'CUSTOMERS_WRITE',
				'DISPUTES_READ',
				'DISPUTES_WRITE',
				'INVENTORY_READ',
				'INVOICES_READ',
				'INVOICES_WRITE',
				'ITEMS_READ',
				'ITEMS_WRITE',
				'MERCHANT_PROFILE_READ',
				'MERCHANT_PROFILE_WRITE',
				'ORDERS_READ',
				'ORDERS_WRITE',
				'PAYMENTS_READ',
				'PAYMENTS_WRITE',
			],
			requiresRegisteredRedirect: true,
		},
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: squareEndpointsNested,
		webhooks: squareWebhooksNested,
		endpointMeta: squareEndpointMeta,
		endpointSchemas: squareEndpointSchemas,
		webhookSchemas: squareWebhookSchemas,
		// This plugin declares no webhooks yet.
		pluginWebhookMatcher: () => false,
		pluginTenantWebhookMatcher: () => null,
		oauthWebhookTenantLinkResolver: () => null,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: SquareKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			if (source === 'endpoint' && ctx.authType === 'oauth_2') {
				const res = await ctx.keys.get_access_token();
				return res ?? '';
			}

			return '';
		},
	} satisfies InternalSquarePlugin;
}

export type { SquareEnvironment } from './client';
export { SQUARE_API_VERSION, SquareAPIError } from './client';
export type {
	SquareEndpointInputs,
	SquareEndpointOutputs,
} from './endpoints/types';
