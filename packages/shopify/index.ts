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
import { resolveShopifyCredentials } from './auth';
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
		// Both are account-level: a token is scoped to one shop, and the domain
		// has to travel with it. `get_integration_credentials` is only installed
		// for oauth_2, so putting the domain under `integration` would throw.
		account: ['shop_domain'] as const,
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
		description: 'Create a manual or smart collection with a title and handle',
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
		riskLevel: 'write',
		description:
			'Mark an order as paid without taking a payment; recorded against a manual gateway',
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

			// The key builder returns one string, but a Shopify call needs a
			// token *and* a shop domain. The token is returned here because core
			// assigns it to `ctx.key`; the endpoints read both through
			// `resolveShopifyCredentials`, which normalises the domain.
			const credentials: ShopifyCredentials = await resolveShopifyCredentials(
				// unknown: the key builder's context carries the account key
				// manager; ShopifyAuthContext is the structural slice it needs,
				// including the domain accessor generated from authConfig.
				ctx as unknown as ShopifyAuthContext,
				{
					key: options.key,
					shopDomain: options.shopDomain,
				},
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
export type { ShopifyWebhookOutput } from './webhooks/receive';
