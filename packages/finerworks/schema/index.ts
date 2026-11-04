import {
	FinerWorksImage,
	FinerWorksOrder,
	FinerWorksVirtualInventoryProduct,
} from './database';

/**
 * Only the account's own records are synced: image files, virtual inventory
 * products and orders. The other models in `./database` describe catalog
 * lookups (frames, mats, media types, prices, shipping options) and account
 * details; endpoints return them, but they are not stored.
 */
export const FinerWorksSchema = {
	version: '1.0.0',
	entities: {
		images: FinerWorksImage,
		virtualInventoryProducts: FinerWorksVirtualInventoryProduct,
		orders: FinerWorksOrder,
	},
} as const;

export {
	FinerWorksAddress,
	FinerWorksCompanyInfo,
	FinerWorksConnection,
	FinerWorksDimensions,
	FinerWorksFrame,
	FinerWorksFrameCollection,
	FinerWorksGallery,
	FinerWorksGalleryTheme,
	FinerWorksGlazing,
	FinerWorksImage,
	FinerWorksMat,
	FinerWorksMediaType,
	FinerWorksMountingAddOn,
	FinerWorksOrder,
	FinerWorksOrderStatusDefinition,
	FinerWorksOrderTotals,
	FinerWorksPrice,
	FinerWorksProductPricing,
	FinerWorksProductType,
	FinerWorksShipment,
	FinerWorksShippingOption,
	FinerWorksShippingQuote,
	FinerWorksShippingQuoteOption,
	FinerWorksStyleType,
	FinerWorksSubmittedOrder,
	FinerWorksThirdPartyIntegrations,
	FinerWorksUserAccount,
	FinerWorksVirtualInventoryProduct,
} from './database';
