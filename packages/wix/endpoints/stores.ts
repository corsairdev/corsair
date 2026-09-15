import { defineOp } from './factory';

export const searchProducts = defineOp('searchProducts');
export const queryInventory = defineOp('queryInventoryItems');
export const bulkDeleteProducts = defineOp('bulkDeleteProducts');
export const bulkDeleteInventoryItems = defineOp('bulkDeleteInventoryItems');
export const bulkDeleteBrands = defineOp('bulkDeleteBrands');
export const bulkGetOrCreateBrands = defineOp('bulkGetOrCreateBrands');
export const bulkUpdateProductsByFilter = defineOp(
	'bulkUpdateProductsByFilter',
);
export const bulkUpdateInventoryItemsByFilter = defineOp(
	'bulkUpdateInventoryItemsByFilter',
);
export const bulkUpdateCustomizations = defineOp('bulkUpdateCustomizations');
export const bulkCreateProductsWithInventory = defineOp(
	'bulkCreateProductsWithInventory',
);
export const bulkRemoveInfoSectionsByFilter = defineOp(
	'bulkRemoveInfoSectionsByFilter',
);
export const deleteCustomization = defineOp('deleteCustomization');
export const deleteInfoSection = defineOp('deleteInfoSection');
export const deleteProductOptions = defineOp('deleteProductOptions');
export const setCustomizationChoices = defineOp('setCustomizationChoices');
export const updateInventoryVariants = defineOp('updateInventoryVariants');
export const getCollectionBySlug = defineOp('getCollectionBySlug');
export const listCurrencies = defineOp('listCurrencies');
export const queryCoupons = defineOp('queryCoupons');
export const deleteBackInStockNotification = defineOp(
	'deleteBackInStockNotification',
);

export const StoresEndpoints = {
	searchProducts,
	queryInventory,
	bulkDeleteProducts,
	bulkDeleteInventoryItems,
	bulkDeleteBrands,
	bulkGetOrCreateBrands,
	bulkUpdateProductsByFilter,
	bulkUpdateInventoryItemsByFilter,
	bulkUpdateCustomizations,
	bulkCreateProductsWithInventory,
	bulkRemoveInfoSectionsByFilter,
	deleteCustomization,
	deleteInfoSection,
	deleteProductOptions,
	setCustomizationChoices,
	updateInventoryVariants,
	getCollectionBySlug,
	listCurrencies,
	queryCoupons,
	deleteBackInStockNotification,
} as const;
