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
import type { ShopifyAuthContext, ShopifyCredentials } from './auth';
import { resolveShopDomain, resolveShopifyCredentials } from './auth';
import { Shopify } from './endpoints';
import type {
	ShopifyEndpointInputs,
	ShopifyEndpointOutputs,
} from './endpoints/types';
import {
	ShopifyEndpointInputSchemas,
	ShopifyEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { ShopifySchema } from './schema';
import {
	isTokenFresh,
	requestShopifyClientCredentialsToken,
	shareMint,
} from './token';
import { ShopifyWebhookHandlers } from './webhooks';
import type { ShopifyWebhookOutput } from './webhooks/receive';
import {
	CustomerWebhookSchema,
	OrderWebhookSchema,
	ProductWebhookSchema,
	ShopifyWebhookOutputSchema,
} from './webhooks/types';

export const shopifyAuthConfig = {
	api_key: {
		// All account-level: a token, and the app that mints it, are scoped to
		// one shop, and the domain has to travel with them.
		// `get_integration_credentials` is only installed for oauth_2, so
		// putting these under `integration` would throw.
		//
		// Two ways to connect:
		// - `api_key`: a static Admin API token (`shpat_…` from a legacy custom
		//   app), which does not expire.
		// - `client_id` + `client_secret` of a Dev Dashboard app: the key
		//   builder mints a 24-hour token with them and keeps it in `api_key`,
		//   with its expiry in `expires_at`. Core and Hub never ask for
		//   `expires_at`; the plugin writes it.
		account: [
			'shop_domain',
			'client_id',
			'client_secret',
			'expires_at',
		] as const,
	},
} as const satisfies PluginAuthConfig;

export type ShopifyPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/**
	 * Admin API access token. Prefer the stored key; this exists so one
	 * instance can point at a specific shop without touching account state.
	 */
	key?: string;
	/**
	 * `<shop>.myshopify.com`. Paired with the token because every request URL
	 * is built from it; a bare handle is expanded, and a full URL is accepted.
	 */
	shopDomain?: string;
	/** App secret used to verify `X-Shopify-Hmac-Sha256` on deliveries. */
	webhookSecret?: string;
	hooks?: InternalShopifyPlugin['hooks'];
	webhookHooks?: InternalShopifyPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof shopifyEndpointsNested>;
};

// The endpoint tree is deliberately not part of this type. Passing it here
// makes each endpoint reference a context that references every endpoint,
// which TypeScript rejects as a circular alias.
export type ShopifyContext = CorsairPluginContext<
	typeof ShopifySchema,
	ShopifyPluginOptions,
	undefined,
	typeof shopifyAuthConfig
>;

export type ShopifyKeyBuilderContext = KeyBuilderContext<
	ShopifyPluginOptions,
	typeof shopifyAuthConfig
>;

export type ShopifyBoundEndpoints = BindEndpoints<
	typeof shopifyEndpointsNested
>;

type ShopifyEndpoint<K extends keyof ShopifyEndpointOutputs> = CorsairEndpoint<
	ShopifyContext,
	ShopifyEndpointInputs[K],
	ShopifyEndpointOutputs[K]
>;

export type ShopifyEndpoints = {
	[K in keyof ShopifyEndpointOutputs]: ShopifyEndpoint<K>;
};

type ShopifyWebhook<K extends keyof ShopifyWebhooks, TEvent> = CorsairWebhook<
	ShopifyContext,
	TEvent,
	ShopifyWebhookOutput
>;

export type ShopifyWebhooks = {
	// unknown: one handler serves every topic, and the topic header chooses
	// the payload schema at runtime, so no single payload type is correct.
	receive: ShopifyWebhook<'receive', unknown>;
};

export type ShopifyBoundWebhooks = BindWebhooks<ShopifyWebhooks>;

const shopifyEndpointsNested = {
	products: {
		list: Shopify.products.list,
		get: Shopify.products.get,
		create: Shopify.products.create,
		update: Shopify.products.update,
		delete: Shopify.products.delete,
	},
	variants: {
		list: Shopify.variants.list,
		update: Shopify.variants.update,
	},
	inventory: {
		list: Shopify.inventory.list,
		adjust: Shopify.inventory.adjust,
	},
	collections: {
		list: Shopify.collections.list,
		get: Shopify.collections.get,
		create: Shopify.collections.create,
		addProducts: Shopify.collections.addProducts,
	},
	orders: {
		list: Shopify.orders.list,
		get: Shopify.orders.get,
		listLineItems: Shopify.orders.listLineItems,
		cancel: Shopify.orders.cancel,
		markAsPaid: Shopify.orders.markAsPaid,
		close: Shopify.orders.close,
	},
	customers: {
		list: Shopify.customers.list,
		get: Shopify.customers.get,
		create: Shopify.customers.create,
		update: Shopify.customers.update,
	},
	shop: {
		get: Shopify.shop.get,
		listLocations: Shopify.shop.listLocations,
	},
	webhookSubscriptions: {
		list: Shopify.webhookSubscriptions.list,
		create: Shopify.webhookSubscriptions.create,
		delete: Shopify.webhookSubscriptions.delete,
	},
} as const;

const shopifyWebhooksNested = {
	shopify: ShopifyWebhookHandlers,
} as const;

export const shopifyEndpointSchemas = {
	'products.list': {
		input: ShopifyEndpointInputSchemas.productsList,
		output: ShopifyEndpointOutputSchemas.productsList,
	},
	'products.get': {
		input: ShopifyEndpointInputSchemas.productsGet,
		output: ShopifyEndpointOutputSchemas.productsGet,
	},
	'products.create': {
		input: ShopifyEndpointInputSchemas.productsCreate,
		output: ShopifyEndpointOutputSchemas.productsCreate,
	},
	'products.update': {
		input: ShopifyEndpointInputSchemas.productsUpdate,
		output: ShopifyEndpointOutputSchemas.productsUpdate,
	},
	'products.delete': {
		input: ShopifyEndpointInputSchemas.productsDelete,
		output: ShopifyEndpointOutputSchemas.productsDelete,
	},
	'variants.list': {
		input: ShopifyEndpointInputSchemas.variantsList,
		output: ShopifyEndpointOutputSchemas.variantsList,
	},
	'variants.update': {
		input: ShopifyEndpointInputSchemas.variantsUpdate,
		output: ShopifyEndpointOutputSchemas.variantsUpdate,
	},
	'inventory.list': {
		input: ShopifyEndpointInputSchemas.inventoryList,
		output: ShopifyEndpointOutputSchemas.inventoryList,
	},
	'inventory.adjust': {
		input: ShopifyEndpointInputSchemas.inventoryAdjust,
		output: ShopifyEndpointOutputSchemas.inventoryAdjust,
	},
	'collections.list': {
		input: ShopifyEndpointInputSchemas.collectionsList,
		output: ShopifyEndpointOutputSchemas.collectionsList,
	},
	'collections.get': {
		input: ShopifyEndpointInputSchemas.collectionsGet,
		output: ShopifyEndpointOutputSchemas.collectionsGet,
	},
	'collections.create': {
		input: ShopifyEndpointInputSchemas.collectionsCreate,
		output: ShopifyEndpointOutputSchemas.collectionsCreate,
	},
	'collections.addProducts': {
		input: ShopifyEndpointInputSchemas.collectionsAddProducts,
		output: ShopifyEndpointOutputSchemas.collectionsAddProducts,
	},
	'orders.list': {
		input: ShopifyEndpointInputSchemas.ordersList,
		output: ShopifyEndpointOutputSchemas.ordersList,
	},
	'orders.get': {
		input: ShopifyEndpointInputSchemas.ordersGet,
		output: ShopifyEndpointOutputSchemas.ordersGet,
	},
	'orders.listLineItems': {
		input: ShopifyEndpointInputSchemas.ordersListLineItems,
		output: ShopifyEndpointOutputSchemas.ordersListLineItems,
	},
	'orders.cancel': {
		input: ShopifyEndpointInputSchemas.ordersCancel,
		output: ShopifyEndpointOutputSchemas.ordersCancel,
	},
	'orders.markAsPaid': {
		input: ShopifyEndpointInputSchemas.ordersMarkAsPaid,
		output: ShopifyEndpointOutputSchemas.ordersMarkAsPaid,
	},
	'orders.close': {
		input: ShopifyEndpointInputSchemas.ordersClose,
		output: ShopifyEndpointOutputSchemas.ordersClose,
	},
	'customers.list': {
		input: ShopifyEndpointInputSchemas.customersList,
		output: ShopifyEndpointOutputSchemas.customersList,
	},
	'customers.get': {
		input: ShopifyEndpointInputSchemas.customersGet,
		output: ShopifyEndpointOutputSchemas.customersGet,
	},
	'customers.create': {
		input: ShopifyEndpointInputSchemas.customersCreate,
		output: ShopifyEndpointOutputSchemas.customersCreate,
	},
	'customers.update': {
		input: ShopifyEndpointInputSchemas.customersUpdate,
		output: ShopifyEndpointOutputSchemas.customersUpdate,
	},
	'shop.get': {
		input: ShopifyEndpointInputSchemas.shopGet,
		output: ShopifyEndpointOutputSchemas.shopGet,
	},
	'shop.listLocations': {
		input: ShopifyEndpointInputSchemas.locationsList,
		output: ShopifyEndpointOutputSchemas.locationsList,
	},
	'webhookSubscriptions.list': {
		input: ShopifyEndpointInputSchemas.webhooksList,
		output: ShopifyEndpointOutputSchemas.webhooksList,
	},
	'webhookSubscriptions.create': {
		input: ShopifyEndpointInputSchemas.webhooksCreate,
		output: ShopifyEndpointOutputSchemas.webhooksCreate,
	},
	'webhookSubscriptions.delete': {
		input: ShopifyEndpointInputSchemas.webhooksDelete,
		output: ShopifyEndpointOutputSchemas.webhooksDelete,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof shopifyEndpointsNested
>;

const shopifyWebhookSchemas = {
	'shopify.receive': {
		description:
			'A verified delivery for one topic; the topic header selects the payload schema',
		payload: OrderWebhookSchema.or(ProductWebhookSchema).or(
			CustomerWebhookSchema,
		),
		// The handler returns its own summary in `response.data`, not the
		// resource: `payload` is what Shopify sends, `response` is what a caller
		// receives back.
		response: ShopifyWebhookOutputSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof shopifyWebhooksNested>;

const defaultAuthType = 'api_key' as const;

const shopifyEndpointMeta = {
	'products.list': {
		riskLevel: 'read',
		description:
			'List products with their first variants, cursor-paged and filtered with Shopify search syntax',
	},
	'products.get': {
		riskLevel: 'read',
		description:
			'Read one product by GID, including its first variants and inventory totals',
	},
	'products.create': {
		riskLevel: 'write',
		description:
			'Create a product with its title and catalog fields; variants are added separately',
	},
	'products.update': {
		riskLevel: 'write',
		description: 'Update a product, changing only the fields that are passed',
	},
	'products.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Permanently delete a product with its variants, media and inventory items',
	},
	'variants.list': {
		riskLevel: 'read',
		description:
			'List the variants of one product, cursor-paged, with price and stock',
	},
	'variants.update': {
		riskLevel: 'write',
		description:
			'Update price, SKU, barcode or inventory policy on one variant',
	},
	'inventory.list': {
		riskLevel: 'read',
		description:
			'Read the available stock of one inventory item at every active location',
	},
	'inventory.adjust': {
		riskLevel: 'write',
		description:
			'Adjust available stock by a signed delta at one location, with a reason',
	},
	'collections.list': {
		riskLevel: 'read',
		description: 'List collections with their product counts, cursor-paged',
	},
	'collections.get': {
		riskLevel: 'read',
		description: 'Read one collection by GID',
	},
	'collections.create': {
		riskLevel: 'write',
		description: 'Create a manual collection with a title and handle',
	},
	'collections.addProducts': {
		riskLevel: 'write',
		description:
			'Add products to a collection; the whole call fails if any is already present',
	},
	'orders.list': {
		riskLevel: 'read',
		description:
			'List orders with totals and line items, filtered and sorted, cursor-paged',
	},
	'orders.get': {
		riskLevel: 'read',
		description:
			'Read one order by GID with its customer and a page of its line items',
	},
	'orders.listLineItems': {
		riskLevel: 'read',
		description:
			'Read one page of an order line items, cursor-paged, for orders with more than one page',
	},
	'orders.cancel': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Cancel an order, optionally restocking and notifying the customer; does not refund',
	},
	'orders.markAsPaid': {
		// Shopify captures an existing payment authorization when the order has
		// one, which charges the customer and cannot be taken back without a
		// refund (R8).
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Mark an order as paid: captures an existing payment authorization, or records a manual payment for the outstanding amount',
	},
	'orders.close': {
		riskLevel: 'write',
		description:
			'Close a completed or cancelled order so it no longer counts as open',
	},
	'customers.list': {
		riskLevel: 'read',
		description:
			'List customers with order counts and spend, cursor-paged and filtered',
	},
	'customers.get': {
		riskLevel: 'read',
		description: 'Read one customer by GID, including addresses and spend',
	},
	'customers.create': {
		riskLevel: 'write',
		description: 'Create a customer with an email, name and tags',
	},
	'customers.update': {
		riskLevel: 'write',
		description: 'Update a customer, overwriting tags when tags are passed',
	},
	'shop.get': {
		riskLevel: 'read',
		description:
			'Read the shop name, domain, currency and plan for the configured token',
	},
	'shop.listLocations': {
		riskLevel: 'read',
		description:
			'List the inventory locations of the shop, for use with inventory.adjust',
	},
	'webhookSubscriptions.list': {
		riskLevel: 'read',
		description:
			'List shop-scoped webhook subscriptions, optionally filtered by topic',
	},
	'webhookSubscriptions.create': {
		riskLevel: 'write',
		description: 'Register a JSON webhook subscription for one topic and URI',
	},
	'webhookSubscriptions.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a webhook subscription, stopping further deliveries for that topic',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof shopifyEndpointsNested>;

export type BaseShopifyPlugin<T extends ShopifyPluginOptions> = CorsairPlugin<
	'shopify',
	typeof ShopifySchema,
	typeof shopifyEndpointsNested,
	typeof shopifyWebhooksNested,
	T,
	typeof defaultAuthType,
	typeof shopifyAuthConfig
>;

export type InternalShopifyPlugin = BaseShopifyPlugin<ShopifyPluginOptions>;

export type ExternalShopifyPlugin<T extends ShopifyPluginOptions> =
	BaseShopifyPlugin<T>;

export function shopify<const T extends ShopifyPluginOptions>(
	incomingOptions: ShopifyPluginOptions & T = {} as ShopifyPluginOptions & T,
): ExternalShopifyPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'shopify',
		authConfig: shopifyAuthConfig,
		schema: ShopifySchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: shopifyEndpointsNested,
		webhooks: shopifyWebhooksNested,
		endpointMeta: shopifyEndpointMeta,
		endpointSchemas: shopifyEndpointSchemas,
		webhookSchemas: shopifyWebhookSchemas,
		pluginWebhookMatcher: (request) =>
			Object.keys(request.headers ?? {}).some(
				(key) => key.toLowerCase() === 'x-shopify-topic',
			),
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: ShopifyKeyBuilderContext, source) => {
			if (source === 'webhook') {
				// The HMAC secret is what authenticates a delivery; there is no
				// per-tenant API key to resolve on this path.
				const secret = options.webhookSecret;
				if (secret) return secret;
				const stored = await ctx.keys.get_webhook_signature();
				if (!stored) {
					throw new AuthMissingError('shopify', 'webhook_signature');
				}
				return stored;
			}

			// An instance-level token wins, as before.
			if (options.key?.trim()) {
				await resolveShopDomain(ctx, options);
				return options.key.trim();
			}

			// A Dev Dashboard app: mint a 24-hour token from its client
			// credentials, reuse it until shortly before it expires, and give
			// core a way to mint a new one when Shopify rejects it early.
			const [clientId, clientSecret] = await Promise.all([
				ctx.keys.get_client_id(),
				ctx.keys.get_client_secret(),
			]);
			if (clientId?.trim() && clientSecret?.trim()) {
				const shopDomain = await resolveShopDomain(ctx, options);
				const mint = (kind: 'routine' | 'forced') =>
					shareMint(ctx.keys, kind, async () => {
						const token = await requestShopifyClientCredentialsToken({
							shopDomain,
							clientId: clientId.trim(),
							clientSecret: clientSecret.trim(),
						});
						// Token first, then its expiry: the writes are separate, and
						// a new expiry beside the old token would keep a dead token
						// looking fresh.
						await ctx.keys.set_api_key(token.accessToken);
						await ctx.keys.set_expires_at(String(token.expiresAt));
						return token.accessToken;
					});
				// Called once after a 401: by the endpoint's own request path
				// (`endpoints/call.ts`) or by core, never both.
				// unknown: `_refreshAuth` is core's convention for a keyBuilder to
				// hand the binder a renewal (read in core/endpoints/bind.ts), but
				// KeyBuilderContext does not declare it, so the context is widened
				// to the one member set here, as ramp's key builder does.
				(
					ctx as unknown as { _refreshAuth?: () => Promise<string> }
				)._refreshAuth = () => mint('forced');
				const [cached, expiresAt] = await Promise.all([
					ctx.keys.get_api_key(),
					ctx.keys.get_expires_at(),
				]);
				if (cached && isTokenFresh(expiresAt)) return cached;
				return mint('routine');
			}

			// A static Admin API token (legacy custom app), which never expires.
			const credentials: ShopifyCredentials = await resolveShopifyCredentials(
				// unknown: the key builder's context carries the account key
				// manager; ShopifyAuthContext is the structural slice it needs,
				// including the domain accessor generated from authConfig.
				ctx as unknown as ShopifyAuthContext,
				{ shopDomain: options.shopDomain },
			);
			return credentials.accessToken;
		},
	} satisfies InternalShopifyPlugin;
}

export { resolveShopDomain, resolveShopifyCredentials } from './auth';
export {
	getReplayMeta,
	normaliseShopDomain,
	ShopifyAPIError,
	throttleDelayMs,
} from './client';
export { assertNoUserErrors, ShopifyUserError } from './endpoints/call';
export { adjustmentIdempotencyKey } from './endpoints/inventory';
export type {
	ShopifyEndpointInputs,
	ShopifyEndpointOutputs,
} from './endpoints/types';
export {
	isTokenFresh,
	requestShopifyClientCredentialsToken,
	ShopifyTokenError,
	TOKEN_RENEW_BEFORE_SECONDS,
} from './token';
export type { ShopifyWebhookOutput } from './webhooks/receive';
