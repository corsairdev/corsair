import type { z } from 'zod';
import type {
	CollectionSchema,
	CustomerSchema,
	InventoryLevelSchema,
	LocationSchema,
	MoneyBagSchema,
	MoneySchema,
	OrderSchema,
	ProductSchema,
	ShopSchema,
	WebhookSubscriptionSchema,
} from './schemas';
import {
	collectionsAddProductsInput,
	collectionsAddProductsOutput,
	collectionsCreateInput,
	collectionsCreateOutput,
	collectionsGetInput,
	collectionsGetOutput,
	collectionsListInput,
	collectionsListOutput,
	customersCreateInput,
	customersCreateOutput,
	customersGetInput,
	customersGetOutput,
	customersListInput,
	customersListOutput,
	customersUpdateInput,
	customersUpdateOutput,
	inventoryAdjustInput,
	inventoryAdjustOutput,
	inventoryListInput,
	inventoryListOutput,
	locationsListInput,
	locationsListOutput,
	ordersCancelInput,
	ordersCancelOutput,
	ordersCloseInput,
	ordersCloseOutput,
	ordersGetInput,
	ordersGetOutput,
	ordersListInput,
	ordersListOutput,
	ordersMarkAsPaidInput,
	ordersMarkAsPaidOutput,
	productsCreateInput,
	productsCreateOutput,
	productsDeleteInput,
	productsDeleteOutput,
	productsGetInput,
	productsGetOutput,
	productsListInput,
	productsListOutput,
	productsUpdateInput,
	productsUpdateOutput,
	shopGetInput,
	shopGetOutput,
	variantsListInput,
	variantsListOutput,
	variantsUpdateInput,
	variantsUpdateOutput,
	webhooksCreateInput,
	webhooksCreateOutput,
	webhooksDeleteInput,
	webhooksDeleteOutput,
	webhooksListInput,
	webhooksListOutput,
} from './schemas';

export type ShopifyEndpointInputs = {
	productsList: z.input<typeof productsListInput>;
	productsGet: z.input<typeof productsGetInput>;
	productsCreate: z.input<typeof productsCreateInput>;
	productsUpdate: z.input<typeof productsUpdateInput>;
	productsDelete: z.input<typeof productsDeleteInput>;
	variantsList: z.input<typeof variantsListInput>;
	variantsUpdate: z.input<typeof variantsUpdateInput>;
	inventoryList: z.input<typeof inventoryListInput>;
	inventoryAdjust: z.input<typeof inventoryAdjustInput>;
	collectionsList: z.input<typeof collectionsListInput>;
	collectionsGet: z.input<typeof collectionsGetInput>;
	collectionsCreate: z.input<typeof collectionsCreateInput>;
	collectionsAddProducts: z.input<typeof collectionsAddProductsInput>;
	ordersList: z.input<typeof ordersListInput>;
	ordersGet: z.input<typeof ordersGetInput>;
	ordersCancel: z.input<typeof ordersCancelInput>;
	ordersMarkAsPaid: z.input<typeof ordersMarkAsPaidInput>;
	ordersClose: z.input<typeof ordersCloseInput>;
	customersList: z.input<typeof customersListInput>;
	customersGet: z.input<typeof customersGetInput>;
	customersCreate: z.input<typeof customersCreateInput>;
	customersUpdate: z.input<typeof customersUpdateInput>;
	shopGet: z.input<typeof shopGetInput>;
	locationsList: z.input<typeof locationsListInput>;
	webhooksList: z.input<typeof webhooksListInput>;
	webhooksCreate: z.input<typeof webhooksCreateInput>;
	webhooksDelete: z.input<typeof webhooksDeleteInput>;
};

export type ShopifyEndpointOutputs = {
	productsList: z.output<typeof productsListOutput>;
	productsGet: z.output<typeof productsGetOutput>;
	productsCreate: z.output<typeof productsCreateOutput>;
	productsUpdate: z.output<typeof productsUpdateOutput>;
	productsDelete: z.output<typeof productsDeleteOutput>;
	variantsList: z.output<typeof variantsListOutput>;
	variantsUpdate: z.output<typeof variantsUpdateOutput>;
	inventoryList: z.output<typeof inventoryListOutput>;
	inventoryAdjust: z.output<typeof inventoryAdjustOutput>;
	collectionsList: z.output<typeof collectionsListOutput>;
	collectionsGet: z.output<typeof collectionsGetOutput>;
	collectionsCreate: z.output<typeof collectionsCreateOutput>;
	collectionsAddProducts: z.output<typeof collectionsAddProductsOutput>;
	ordersList: z.output<typeof ordersListOutput>;
	ordersGet: z.output<typeof ordersGetOutput>;
	ordersCancel: z.output<typeof ordersCancelOutput>;
	ordersMarkAsPaid: z.output<typeof ordersMarkAsPaidOutput>;
	ordersClose: z.output<typeof ordersCloseOutput>;
	customersList: z.output<typeof customersListOutput>;
	customersGet: z.output<typeof customersGetOutput>;
	customersCreate: z.output<typeof customersCreateOutput>;
	customersUpdate: z.output<typeof customersUpdateOutput>;
	shopGet: z.output<typeof shopGetOutput>;
	locationsList: z.output<typeof locationsListOutput>;
	webhooksList: z.output<typeof webhooksListOutput>;
	webhooksCreate: z.output<typeof webhooksCreateOutput>;
	webhooksDelete: z.output<typeof webhooksDeleteOutput>;
};

export const ShopifyEndpointInputSchemas = {
	productsList: productsListInput,
	productsGet: productsGetInput,
	productsCreate: productsCreateInput,
	productsUpdate: productsUpdateInput,
	productsDelete: productsDeleteInput,
	variantsList: variantsListInput,
	variantsUpdate: variantsUpdateInput,
	inventoryList: inventoryListInput,
	inventoryAdjust: inventoryAdjustInput,
	collectionsList: collectionsListInput,
	collectionsGet: collectionsGetInput,
	collectionsCreate: collectionsCreateInput,
	collectionsAddProducts: collectionsAddProductsInput,
	ordersList: ordersListInput,
	ordersGet: ordersGetInput,
	ordersCancel: ordersCancelInput,
	ordersMarkAsPaid: ordersMarkAsPaidInput,
	ordersClose: ordersCloseInput,
	customersList: customersListInput,
	customersGet: customersGetInput,
	customersCreate: customersCreateInput,
	customersUpdate: customersUpdateInput,
	shopGet: shopGetInput,
	locationsList: locationsListInput,
	webhooksList: webhooksListInput,
	webhooksCreate: webhooksCreateInput,
	webhooksDelete: webhooksDeleteInput,
} as const;

export const ShopifyEndpointOutputSchemas = {
	productsList: productsListOutput,
	productsGet: productsGetOutput,
	productsCreate: productsCreateOutput,
	productsUpdate: productsUpdateOutput,
	productsDelete: productsDeleteOutput,
	variantsList: variantsListOutput,
	variantsUpdate: variantsUpdateOutput,
	inventoryList: inventoryListOutput,
	inventoryAdjust: inventoryAdjustOutput,
	collectionsList: collectionsListOutput,
	collectionsGet: collectionsGetOutput,
	collectionsCreate: collectionsCreateOutput,
	collectionsAddProducts: collectionsAddProductsOutput,
	ordersList: ordersListOutput,
	ordersGet: ordersGetOutput,
	ordersCancel: ordersCancelOutput,
	ordersMarkAsPaid: ordersMarkAsPaidOutput,
	ordersClose: ordersCloseOutput,
	customersList: customersListOutput,
	customersGet: customersGetOutput,
	customersCreate: customersCreateOutput,
	customersUpdate: customersUpdateOutput,
	shopGet: shopGetOutput,
	locationsList: locationsListOutput,
	webhooksList: webhooksListOutput,
	webhooksCreate: webhooksCreateOutput,
	webhooksDelete: webhooksDeleteOutput,
} as const;

export type {
	CollectionSchema,
	CustomerSchema,
	InventoryLevelSchema,
	LocationSchema,
	MoneyBagSchema,
	MoneySchema,
	OrderSchema,
	ProductSchema,
	ShopSchema,
	WebhookSubscriptionSchema,
};
