import type {
	ShopifyContext,
	ShopifyEndpointInputs,
	ShopifyEndpointOutputs,
} from '..';
import * as Collections from './collections';
import * as Customers from './customers';
import * as Inventory from './inventory';
import * as Orders from './orders';
import * as Products from './products';
import * as Shop from './shop';
import * as Variants from './variants';
import * as WebhookSubscriptions from './webhooks';

type Endpoint<K extends keyof ShopifyEndpointOutputs> = (
	ctx: ShopifyContext,
	input: ShopifyEndpointInputs[K],
) => Promise<ShopifyEndpointOutputs[K]>;

/**
 * An explicit annotation, not `as const`. The plugin type refers back to this
 * object, so leaving the type to be inferred from its own initializer makes
 * `Shopify` resolve to `any` and every endpoint below it lose its signature.
 */
export const Shopify: {
	products: {
		list: Endpoint<'productsList'>;
		get: Endpoint<'productsGet'>;
		create: Endpoint<'productsCreate'>;
		update: Endpoint<'productsUpdate'>;
		delete: Endpoint<'productsDelete'>;
	};
	variants: {
		list: Endpoint<'variantsList'>;
		update: Endpoint<'variantsUpdate'>;
	};
	inventory: {
		list: Endpoint<'inventoryList'>;
		adjust: Endpoint<'inventoryAdjust'>;
	};
	collections: {
		list: Endpoint<'collectionsList'>;
		get: Endpoint<'collectionsGet'>;
		create: Endpoint<'collectionsCreate'>;
		addProducts: Endpoint<'collectionsAddProducts'>;
	};
	orders: {
		list: Endpoint<'ordersList'>;
		get: Endpoint<'ordersGet'>;
		listLineItems: Endpoint<'ordersListLineItems'>;
		cancel: Endpoint<'ordersCancel'>;
		markAsPaid: Endpoint<'ordersMarkAsPaid'>;
		close: Endpoint<'ordersClose'>;
	};
	customers: {
		list: Endpoint<'customersList'>;
		get: Endpoint<'customersGet'>;
		create: Endpoint<'customersCreate'>;
		update: Endpoint<'customersUpdate'>;
	};
	shop: {
		get: Endpoint<'shopGet'>;
		listLocations: Endpoint<'locationsList'>;
	};
	webhookSubscriptions: {
		list: Endpoint<'webhooksList'>;
		create: Endpoint<'webhooksCreate'>;
		delete: Endpoint<'webhooksDelete'>;
	};
} = {
	products: {
		list: Products.list,
		get: Products.get,
		create: Products.create,
		update: Products.update,
		delete: Products.remove,
	},
	variants: {
		list: Variants.list,
		update: Variants.update,
	},
	inventory: {
		list: Inventory.list,
		adjust: Inventory.adjust,
	},
	collections: {
		list: Collections.list,
		get: Collections.get,
		create: Collections.create,
		addProducts: Collections.addProducts,
	},
	orders: {
		list: Orders.list,
		get: Orders.get,
		listLineItems: Orders.listLineItems,
		cancel: Orders.cancel,
		markAsPaid: Orders.markAsPaid,
		close: Orders.close,
	},
	customers: {
		list: Customers.list,
		get: Customers.get,
		create: Customers.create,
		update: Customers.update,
	},
	shop: {
		get: Shop.get,
		listLocations: Shop.listLocations,
	},
	webhookSubscriptions: {
		list: WebhookSubscriptions.list,
		create: WebhookSubscriptions.create,
		delete: WebhookSubscriptions.remove,
	},
};

export { assertNoUserErrors, ShopifyUserError } from './call';
export * from './types';
