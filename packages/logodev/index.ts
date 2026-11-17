import type {
	AuthTypes,
	CorsairErrorHandler,
	CorsairPlugin,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import type { LogoDevContext } from './context';
import {
	createWebhookEndpoint,
	deleteWebhookEndpoint,
	fetchLogo,
	getAccount,
	getBrand,
	getBrandmark,
	getSubscription,
	getWebhookEndpoint,
	listWebhookEndpoints,
	lookupBrand,
	searchBrands,
	subscribe,
	unsubscribe,
	updateWebhookEndpoint,
} from './endpoints';
import {
	AccountResponseSchema,
	BrandIdInputSchema,
	BrandResponseSchema,
	CreateWebhookEndpointInputSchema,
	DeleteWebhookEndpointResponseSchema,
	FetchLogoInputSchema,
	GetAccountInputSchema,
	GetBrandInputSchema,
	ImageResponseSchema,
	ListWebhookEndpointsInputSchema,
	ListWebhookEndpointsResponseSchema,
	LookupBrandInputSchema,
	SearchBrandsInputSchema,
	SearchBrandsResponseSchema,
	SubscriptionResponseSchema,
	UnsubscribeResponseSchema,
	UpdateWebhookEndpointInputSchema,
	WebhookEndpointIdInputSchema,
	WebhookEndpointResponseSchema,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { LogoDevSchema } from './schema';

export type { LogoDevContext };

export type LogoDevPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalLogoDevPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof logoDevEndpointsNested>;
};

export type LogoDevKeyBuilderContext = KeyBuilderContext<LogoDevPluginOptions>;

const logoDevEndpointsNested = {
	brands: { search: searchBrands, lookup: lookupBrand, get: getBrand },
	logos: { fetch: fetchLogo, getBrandmark },
	account: { get: getAccount },
	subscriptions: { get: getSubscription, subscribe, unsubscribe },
	webhookEndpoints: {
		list: listWebhookEndpoints,
		get: getWebhookEndpoint,
		create: createWebhookEndpoint,
		update: updateWebhookEndpoint,
		delete: deleteWebhookEndpoint,
	},
} as const;

const logoDevWebhooksNested = {} as const;

export const logoDevEndpointSchemas = {
	'brands.search': {
		input: SearchBrandsInputSchema,
		output: SearchBrandsResponseSchema,
	},
	'brands.lookup': {
		input: LookupBrandInputSchema,
		output: BrandResponseSchema,
	},
	'brands.get': { input: GetBrandInputSchema, output: BrandResponseSchema },
	'logos.fetch': { input: FetchLogoInputSchema, output: ImageResponseSchema },
	'logos.getBrandmark': {
		input: FetchLogoInputSchema,
		output: ImageResponseSchema,
	},
	'account.get': {
		input: GetAccountInputSchema,
		output: AccountResponseSchema,
	},
	'subscriptions.get': {
		input: BrandIdInputSchema,
		output: SubscriptionResponseSchema,
	},
	'subscriptions.subscribe': {
		input: BrandIdInputSchema,
		output: SubscriptionResponseSchema,
	},
	'subscriptions.unsubscribe': {
		input: BrandIdInputSchema,
		output: UnsubscribeResponseSchema,
	},
	'webhookEndpoints.list': {
		input: ListWebhookEndpointsInputSchema,
		output: ListWebhookEndpointsResponseSchema,
	},
	'webhookEndpoints.get': {
		input: WebhookEndpointIdInputSchema,
		output: WebhookEndpointResponseSchema,
	},
	'webhookEndpoints.create': {
		input: CreateWebhookEndpointInputSchema,
		output: WebhookEndpointResponseSchema,
	},
	'webhookEndpoints.update': {
		input: UpdateWebhookEndpointInputSchema,
		output: WebhookEndpointResponseSchema,
	},
	'webhookEndpoints.delete': {
		input: WebhookEndpointIdInputSchema,
		output: DeleteWebhookEndpointResponseSchema,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof logoDevEndpointsNested
>;

// Lookups use API credits but only return data, so they stay `read`, like the
// Ahrefs plugin's metered reads (R8 covers sends, purchases, paid generation
// jobs and irreversible changes).
const logoDevEndpointMeta = {
	'brands.search': {
		riskLevel: 'read',
		description:
			'Search brands by name and get each match with its domain and logo URL. Billed at 1 API credit per 1,000 searches.',
	},
	'brands.lookup': {
		riskLevel: 'read',
		description:
			'Look up a brand profile (name, description, colors, socials, logo) by domain, ticker, ISIN, crypto symbol or name. 5 API credits.',
	},
	'brands.get': {
		riskLevel: 'read',
		description: 'Get a brand profile by its Logo.dev brand id. 5 API credits.',
	},
	'logos.fetch': {
		riskLevel: 'read',
		description:
			"Get a brand's logo as a temporary download URL with its size, format and blurhash. 2 API credits.",
	},
	'logos.getBrandmark': {
		riskLevel: 'read',
		description:
			"Get a brand's brandmark (the symbol without the name) as a temporary download URL. 3 API credits.",
	},
	'account.get': {
		riskLevel: 'read',
		description: 'Get the plan and API credit balance. Not billed.',
	},
	'subscriptions.get': {
		riskLevel: 'read',
		description:
			"Check whether the account follows a brand's update events (paid plans).",
	},
	'subscriptions.subscribe': {
		riskLevel: 'write',
		description: "Follow a brand's update events (paid plans with webhooks).",
	},
	'subscriptions.unsubscribe': {
		riskLevel: 'write',
		description: "Stop following a brand's update events.",
	},
	'webhookEndpoints.list': {
		riskLevel: 'read',
		description: "List the team's webhook endpoints.",
	},
	'webhookEndpoints.get': {
		riskLevel: 'read',
		description: 'Get one webhook endpoint.',
	},
	'webhookEndpoints.create': {
		riskLevel: 'write',
		description:
			'Register a URL to receive brand.updated and brand.indexed events (paid plans).',
	},
	'webhookEndpoints.update': {
		riskLevel: 'write',
		description:
			"Change a webhook endpoint's URL, description, event types or disabled state.",
	},
	'webhookEndpoints.delete': {
		riskLevel: 'destructive',
		description: 'Delete a webhook endpoint. This cannot be undone.',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof logoDevEndpointsNested>;

const defaultAuthType = 'api_key' as const satisfies AuthTypes;

export const logoDevAuthConfig = {
	api_key: {
		account: [] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseLogoDevPlugin<T extends LogoDevPluginOptions> = CorsairPlugin<
	'logodev',
	typeof LogoDevSchema,
	typeof logoDevEndpointsNested,
	typeof logoDevWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalLogoDevPlugin = BaseLogoDevPlugin<LogoDevPluginOptions>;

export type ExternalLogoDevPlugin<T extends LogoDevPluginOptions> =
	BaseLogoDevPlugin<T>;

export function logodev<const T extends LogoDevPluginOptions>(
	incomingOptions: LogoDevPluginOptions & T = {} as LogoDevPluginOptions & T,
): ExternalLogoDevPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'logodev',
		authConfig: logoDevAuthConfig,
		schema: LogoDevSchema,
		options,
		hooks: options.hooks,
		endpoints: logoDevEndpointsNested,
		webhooks: logoDevWebhooksNested,
		endpointMeta: logoDevEndpointMeta,
		endpointSchemas: logoDevEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: LogoDevKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}
			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				return key ?? '';
			}
			return '';
		},
	} satisfies InternalLogoDevPlugin;
}
