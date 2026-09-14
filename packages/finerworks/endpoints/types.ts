import { z } from 'zod';
import {
	FinerWorksAddress,
	FinerWorksConnection,
	FinerWorksFrame,
	FinerWorksFrameCollection,
	FinerWorksGallery,
	FinerWorksGalleryTheme,
	FinerWorksGlazing,
	FinerWorksImage,
	FinerWorksMat,
	FinerWorksMediaType,
	FinerWorksOrder,
	FinerWorksOrderStatusDefinition,
	FinerWorksPrice,
	FinerWorksProductType,
	FinerWorksShippingOption,
	FinerWorksShippingQuote,
	FinerWorksStyleType,
	FinerWorksSubmittedOrder,
	FinerWorksThirdPartyIntegrations,
	FinerWorksUserAccount,
	FinerWorksVirtualInventoryProduct,
} from '../schema/database';

/**
 * Every FinerWorks v3 response carries this envelope alongside its payload.
 * Official: shown on every endpoint's "Example JSON Response".
 * https://v2.api.finerworks.com/Help
 */
export const FinerWorksStatusSchema = z
	.object({
		success: z.boolean().optional(),
		status_code: z.number().optional(),
		message: z.string().nullable().optional(),
		// FinerWorks returns an untyped diagnostic blob here (`{}` or null in the
		// reference). No published shape, so `unknown` is the narrowest safe type.
		debug: z.unknown().nullable().optional(),
		reference_id: z.string().nullable().optional(),
		domain: z.string().nullable().optional(),
	})
	.loose();

/**
 * Addresses returned by the API share the entity shape defined for the
 * plugin's database schema, so the two cannot drift apart.
 */
export const FinerWorksAddressSchema = FinerWorksAddress;

/**
 * Recipient address required to price or place an order. FinerWorks needs a
 * deliverable address, so the fields a carrier cannot ship without are
 * required here rather than optional.
 * https://v2.api.finerworks.com/Help/Api/POST-v3-submit_orders_v2
 */
export const FinerWorksRecipientInputSchema = z
	.object({
		first_name: z.string(),
		last_name: z.string(),
		company_name: z.string().nullable().optional(),
		address_1: z.string(),
		address_2: z.string().nullable().optional(),
		address_3: z.string().nullable().optional(),
		city: z.string(),
		state_code: z.string().nullable().optional(),
		province: z.string().nullable().optional(),
		zip_postal_code: z.string(),
		country_code: z.string(),
		phone: z.string().nullable().optional(),
		email: z.string().nullable().optional(),
		address_order_po: z.string().nullable().optional(),
	})
	.loose();

/**
 * Identifies which image library a file call operates against.
 * Official: `image_library` model.
 * https://v2.api.finerworks.com/Help/Api/POST-v3-list_images
 */
export const FinerWorksImageLibrarySchema = z
	.object({
		name: z.string(),
		session_id: z.string().nullable().optional(),
		account_key: z.string().nullable().optional(),
		site_id: z.number().nullable().optional(),
	})
	.loose();

/**
 * A single line item on an order.
 * https://v2.api.finerworks.com/Help/Api/POST-v3-submit_orders_v2
 */
export const FinerWorksOrderItemInputSchema = z
	.object({
		product_order_po: z.string().nullable().optional(),
		product_qty: z.number().int().positive(),
		product_sku: z.string(),
		// Pass-through blobs. These are null in every documented example and the
		// reference does not publish their shape for this endpoint, so they are
		// forwarded verbatim rather than narrowed to a guessed structure.
		product_image: z.unknown().nullable().optional(),
		product_title: z.string().nullable().optional(),
		template: z.unknown().nullable().optional(),
		product_guid: z.string().nullable().optional(),
		custom_data_1: z.string().nullable().optional(),
		custom_data_2: z.string().nullable().optional(),
		custom_data_3: z.string().nullable().optional(),
		coa: z.unknown().nullable().optional(),
	})
	.loose();

/**
 * One order in a submit / save / rate-quote batch.
 * https://v2.api.finerworks.com/Help/Api/POST-v3-submit_orders_v2
 */
export const FinerWorksOrderInputSchema = z
	.object({
		order_po: z.string(),
		order_key: z.string().nullable().optional(),
		recipient: FinerWorksRecipientInputSchema,
		order_items: z.array(FinerWorksOrderItemInputSchema).min(1),
		shipping_code: z.string().nullable().optional(),
		ship_by_date: z.string().nullable().optional(),
		// Null in every documented example; no published shape to narrow to.
		customs_tax_info: z.unknown().nullable().optional(),
		gift_message: z.string().nullable().optional(),
		test_mode: z.boolean().optional(),
		webhook_order_status_url: z.string().nullable().optional(),
		webhook_url: z.string().nullable().optional(),
		document_url: z.string().nullable().optional(),
		acct_number_ups: z.string().nullable().optional(),
		acct_number_fedex: z.string().nullable().optional(),
		custom_data_1: z.string().nullable().optional(),
		custom_data_2: z.string().nullable().optional(),
		custom_data_3: z.string().nullable().optional(),
		source: z.string().nullable().optional(),
		fulfillment_id: z.number().nullable().optional(),
	})
	.loose();

/** Shared shape for the many list endpoints that page with these two fields. */
const PaginationInput = {
	page_number: z.number().int().positive().optional(),
	per_page: z.number().int().positive().max(50).optional(),
};

/** Shared shape for the paging counters echoed back on list responses. */
const PaginationOutput = {
	page_number: z.number().nullable().optional(),
	per_page: z.number().nullable().optional(),
	count: z.number().nullable().optional(),
};

/**
 * `account_key` appears on most endpoints. It is only honoured for accounts
 * with reseller permission and is ignored otherwise, so it is always optional.
 */
const accountKey = z.string().nullable().optional();

// ---------------------------------------------------------------------------
// Account
// ---------------------------------------------------------------------------

/** https://v2.api.finerworks.com/Help/Api/GET-v3-get_company_info */
export const AccountGetCompanyInfoInputSchema = z.object({}).loose();
export const AccountGetCompanyInfoOutputSchema = z
	.object({
		status: FinerWorksStatusSchema.optional(),
		site_id: z.number().nullable().optional(),
		address: FinerWorksAddressSchema.nullable().optional(),
		lobby_hours: z.string().nullable().optional(),
	})
	.loose();

/** https://v2.api.finerworks.com/Help/Api/GET-v3-get_user_account_key */
export const AccountGetUserInputSchema = z.object({
	account_key: z.string().optional(),
});
export const AccountGetUserOutputSchema = z
	.object({
		status: FinerWorksStatusSchema.optional(),
		user_account: FinerWorksUserAccount.nullable().optional(),
	})
	.loose();

/** https://v2.api.finerworks.com/Help/Api/PUT-v3-update_user */
export const AccountUpdateUserInputSchema = z
	.object({
		account_key: accountKey,
		billing_info: FinerWorksAddressSchema.nullable().optional(),
		business_info: FinerWorksAddressSchema.nullable().optional(),
		logo_url: z.string().nullable().optional(),
		logo_data: z.string().nullable().optional(),
		portrait_data: z.string().nullable().optional(),
		payment_profile_id: z.string().nullable().optional(),
		shipping_preferences: z.array(z.number()).nullable().optional(),
		connections: z.array(FinerWorksConnection).nullable().optional(),
	})
	.loose();
export const AccountUpdateUserOutputSchema = z
	.object({ status: FinerWorksStatusSchema.optional() })
	.loose();

/** https://v2.api.finerworks.com/Help/Api/PUT-v3-update_app_details */
export const AccountUpdateAppDetailsInputSchema = z.object({
	app_details: z
		.object({
			app_key: z.string().nullable().optional(),
			app_name: z.string().nullable().optional(),
			app_description: z.string().nullable().optional(),
			app_misc_data: z.string().nullable().optional(),
			app_live_mode: z.boolean().nullable().optional(),
		})
		.loose(),
});
export const AccountUpdateAppDetailsOutputSchema = z
	.object({ status: FinerWorksStatusSchema.optional() })
	.loose();

// ---------------------------------------------------------------------------
// Images
// ---------------------------------------------------------------------------

/** https://v2.api.finerworks.com/Help/Api/POST-v3-add_images */
export const ImagesAddInputSchema = z.object({
	images: z
		.array(
			z
				.object({
					title: z.string().nullable().optional(),
					description: z.string().nullable().optional(),
					file_name: z.string().nullable().optional(),
					file_size: z.number().nullable().optional(),
					thumbnail_file_name: z.string().nullable().optional(),
					preview_file_name: z.string().nullable().optional(),
					hires_file_name: z.string().nullable().optional(),
					public_thumbnail_uri: z.string().nullable().optional(),
					public_preview_uri: z.string().nullable().optional(),
					private_hires_uri: z.string().nullable().optional(),
					pix_w: z.number().nullable().optional(),
					pix_h: z.number().nullable().optional(),
					guid: z.string().nullable().optional(),
				})
				.loose(),
		)
		// The endpoint documents a ceiling of five images per call.
		.min(1)
		.max(5),
	library: FinerWorksImageLibrarySchema,
});
export const ImagesAddOutputSchema = z
	.object({
		status: FinerWorksStatusSchema.optional(),
		images: z.array(FinerWorksImage).nullable().optional(),
	})
	.loose();

/** https://v2.api.finerworks.com/Help/Api/POST-v3-list_images */
export const ImagesListInputSchema = z.object({
	library: FinerWorksImageLibrarySchema,
	search_filter: z.string().nullable().optional(),
	guid_filter: z.array(z.string()).nullable().optional(),
	personal_gallery_id_filter: z.array(z.number()).nullable().optional(),
	public_gallery_id_filter: z.array(z.number()).nullable().optional(),
	...PaginationInput,
	sort_field: z.string().nullable().optional(),
	sort_direction: z.enum(['ASC', 'DESC']).nullable().optional(),
	upload_date_from: z.string().nullable().optional(),
	upload_date_to: z.string().nullable().optional(),
	list_products: z.boolean().nullable().optional(),
	active: z.boolean().nullable().optional(),
});
export const ImagesListOutputSchema = z
	.object({
		status: FinerWorksStatusSchema.optional(),
		images: z.array(FinerWorksImage).nullable().optional(),
		...PaginationOutput,
	})
	.loose();

/** https://v2.api.finerworks.com/Help/Api/PUT-v3-update_images */
export const ImagesUpdateInputSchema = z.object({
	images: z
		.array(
			z
				.object({
					guid: z.string(),
					title: z.string().nullable().optional(),
					description: z.string().nullable().optional(),
					visible: z.boolean().nullable().optional(),
					assigned_gallery_subcategory_ids: z
						.array(z.number())
						.nullable()
						.optional(),
					assigned_personal_gallery_ids: z
						.array(z.number())
						.nullable()
						.optional(),
					rank: z.number().nullable().optional(),
				})
				.loose(),
		)
		.min(1),
	account_key: accountKey,
});
export const ImagesUpdateOutputSchema = z
	.object({
		status: FinerWorksStatusSchema.optional(),
		images: z.array(FinerWorksImage).nullable().optional(),
	})
	.loose();

/** https://v2.api.finerworks.com/Help/Api/DELETE-v3-delete_images */
export const ImagesDeleteInputSchema = z.object({
	guids: z.array(z.string()).min(1),
	library: FinerWorksImageLibrarySchema.nullable().optional(),
	account_key: accountKey,
});
export const ImagesDeleteOutputSchema = z
	.object({ status: FinerWorksStatusSchema.optional() })
	.loose();

/** https://v2.api.finerworks.com/Help/Api/GET-v3-list_file_selection_guid */
export const ImagesListFileSelectionInputSchema = z.object({
	guid: z.string(),
});
export const ImagesListFileSelectionOutputSchema = z
	.object({
		status: FinerWorksStatusSchema.optional(),
		guids: z.array(z.string()).nullable().optional(),
		guid: z.string().nullable().optional(),
	})
	.loose();

/** https://v2.api.finerworks.com/Help/Api/PUT-v3-update_file_selection */
export const ImagesUpdateFileSelectionInputSchema = z.object({
	guids: z.array(z.string()),
	guid: z.string(),
});
export const ImagesUpdateFileSelectionOutputSchema = z
	.object({
		status: FinerWorksStatusSchema.optional(),
		guid: z.string().nullable().optional(),
	})
	.loose();

// ---------------------------------------------------------------------------
// Galleries
// ---------------------------------------------------------------------------

/** https://v2.api.finerworks.com/Help/Api/POST-v3-add_update_gallery_collection */
export const GalleriesAddOrUpdateCollectionInputSchema = z.object({
	// Omit `id` to create a collection; supply it to update an existing one.
	id: z.number().int().nullable().optional(),
	name: z.string(),
	description: z.string().nullable().optional(),
	visible: z.boolean().nullable().optional(),
	account_key: accountKey,
});
export const GalleriesAddOrUpdateCollectionOutputSchema = z
	.object({
		status: FinerWorksStatusSchema.optional(),
		id: z.number().nullable().optional(),
	})
	.loose();

/** https://v2.api.finerworks.com/Help/Api/POST-v3-list_galleries */
export const GalleriesListInputSchema = z.object({
	account_key: accountKey,
	personal: z.boolean().nullable().optional(),
	gallery_ids: z.array(z.number()).nullable().optional(),
});
export const GalleriesListOutputSchema = z
	.object({
		status: FinerWorksStatusSchema.optional(),
		galleries: z.array(FinerWorksGallery).nullable().optional(),
	})
	.loose();

/** https://v2.api.finerworks.com/Help/Api/POST-v3-list_gallery_themes */
export const GalleriesListThemesInputSchema = z.object({
	filter: z.array(z.string()).nullable().optional(),
});
export const GalleriesListThemesOutputSchema = z
	.object({
		status: FinerWorksStatusSchema.optional(),
		themes: z.array(FinerWorksGalleryTheme).nullable().optional(),
	})
	.loose();

// ---------------------------------------------------------------------------
// Orders
// ---------------------------------------------------------------------------

/** https://v2.api.finerworks.com/Help/Api/POST-v3-submit_orders_v2 */
export const OrdersSubmitInputSchema = z.object({
	// The endpoint accepts at most five orders per call.
	orders: z.array(FinerWorksOrderInputSchema).min(1).max(5),
});
export const OrdersSubmitOutputSchema = z
	.object({
		status: FinerWorksStatusSchema.optional(),
		orders: z.array(FinerWorksSubmittedOrder).nullable().optional(),
	})
	.loose();

/** https://v2.api.finerworks.com/Help/Api/POST-v3-save_pending_orders */
export const OrdersSavePendingInputSchema = z.object({
	orders: z.array(FinerWorksOrderInputSchema).min(1),
});
export const OrdersSavePendingOutputSchema = z
	.object({
		status: FinerWorksStatusSchema.optional(),
		orders: z.array(FinerWorksSubmittedOrder).nullable().optional(),
	})
	.loose();

/** https://v2.api.finerworks.com/Help/Api/POST-v3-delete_pending_orders */
export const OrdersDeletePendingInputSchema = z.object({
	ids: z.array(z.number().int()).min(1),
	account_key: accountKey,
});
export const OrdersDeletePendingOutputSchema = z
	.object({ status: FinerWorksStatusSchema.optional() })
	.loose();

/** https://v2.api.finerworks.com/Help/Api/POST-v3-fetch_order_status */
export const OrdersFetchStatusInputSchema = z
	.object({
		order_pos: z.array(z.string()).nullable().optional(),
		order_ids: z.array(z.number().int()).nullable().optional(),
		account_key: accountKey,
	})
	// The API needs at least one selector, otherwise it has no orders to match.
	.refine(
		(value) =>
			(value.order_pos?.length ?? 0) > 0 || (value.order_ids?.length ?? 0) > 0,
		{ message: 'Provide at least one of order_pos or order_ids' },
	);
export const OrdersFetchStatusOutputSchema = z
	.object({
		status: FinerWorksStatusSchema.optional(),
		orders: z.array(FinerWorksOrder).nullable().optional(),
	})
	.loose();

/** https://v2.api.finerworks.com/Help/Api/GET-v3-list_order_status_definitions */
export const OrdersListStatusDefinitionsInputSchema = z.object({}).loose();
export const OrdersListStatusDefinitionsOutputSchema = z
	.object({
		status: FinerWorksStatusSchema.optional(),
		definitions: z.array(FinerWorksOrderStatusDefinition).nullable().optional(),
	})
	.loose();

/** https://v2.api.finerworks.com/Help/Api/POST-v3-validate_recipient_address */
export const OrdersValidateRecipientAddressInputSchema = z.object({
	recipient: FinerWorksRecipientInputSchema,
});
export const OrdersValidateRecipientAddressOutputSchema = z
	.object({
		status: FinerWorksStatusSchema.optional(),
		address: FinerWorksAddressSchema.nullable().optional(),
	})
	.loose();

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------

/** https://v2.api.finerworks.com/Help/Api/POST-v3-get_prices */
export const ProductsGetPricesInputSchema = z.object({
	products: z
		.array(
			z
				.object({
					product_qty: z.number().int().positive(),
					product_sku: z.string(),
				})
				.loose(),
		)
		.min(1),
	account_key: accountKey,
});
export const ProductsGetPricesOutputSchema = z
	.object({
		status: FinerWorksStatusSchema.optional(),
		prices: z.array(FinerWorksPrice).nullable().optional(),
	})
	.loose();

/** https://v2.api.finerworks.com/Help/Api/POST-v3-list_media_types */
export const ProductsListMediaTypesInputSchema = z.object({
	ids: z.array(z.number().int()).nullable().optional(),
	site_id: z.number().int().nullable().optional(),
});
export const ProductsListMediaTypesOutputSchema = z
	.object({
		status: FinerWorksStatusSchema.optional(),
		media_types: z.array(FinerWorksMediaType).nullable().optional(),
	})
	.loose();

/** https://v2.api.finerworks.com/Help/Api/POST-v3-list_product_types */
export const ProductsListProductTypesInputSchema = z.object({
	ids: z.array(z.number().int()).nullable().optional(),
});
export const ProductsListProductTypesOutputSchema = z
	.object({
		status: FinerWorksStatusSchema.optional(),
		product_types: z.array(FinerWorksProductType).nullable().optional(),
	})
	.loose();

/** https://v2.api.finerworks.com/Help/Api/POST-v3-list_style_types */
export const ProductsListStyleTypesInputSchema = z.object({
	ids: z.array(z.number().int()).nullable().optional(),
});
export const ProductsListStyleTypesOutputSchema = z
	.object({
		status: FinerWorksStatusSchema.optional(),
		style_types: z.array(FinerWorksStyleType).nullable().optional(),
	})
	.loose();

// ---------------------------------------------------------------------------
// Framing
// ---------------------------------------------------------------------------

/** https://v2.api.finerworks.com/Help/Api/POST-v3-frame_details */
export const FramingGetFrameDetailsInputSchema = z.object({
	id: z.number().int(),
});
export const FramingGetFrameDetailsOutputSchema = z
	.object({
		status: FinerWorksStatusSchema.optional(),
		frame: FinerWorksFrame.nullable().optional(),
	})
	.loose();

/** https://v2.api.finerworks.com/Help/Api/POST-v3-list_collections */
export const FramingListCollectionsInputSchema = z.object({
	id: z.number().int().nullable().optional(),
	product_code: z.string().nullable().optional(),
});
export const FramingListCollectionsOutputSchema = z
	.object({
		status: FinerWorksStatusSchema.optional(),
		collections: z.array(FinerWorksFrameCollection).nullable().optional(),
	})
	.loose();

/** https://v2.api.finerworks.com/Help/Api/POST-v3-list_glazing */
export const FramingListGlazingInputSchema = z.object({
	id: z.number().int().nullable().optional(),
});
export const FramingListGlazingOutputSchema = z
	.object({
		status: FinerWorksStatusSchema.optional(),
		glazing: z.array(FinerWorksGlazing).nullable().optional(),
	})
	.loose();

/** https://v2.api.finerworks.com/Help/Api/POST-v3-list_mats */
export const FramingListMatsInputSchema = z.object({
	id: z.number().int().nullable().optional(),
});
export const FramingListMatsOutputSchema = z
	.object({
		status: FinerWorksStatusSchema.optional(),
		mats: z.array(FinerWorksMat).nullable().optional(),
	})
	.loose();

// ---------------------------------------------------------------------------
// Shipping
// ---------------------------------------------------------------------------

/**
 * `type` is the numeric shipping-type id. The reference only shows it as
 * `?type={type}`, but the API rejects a non-numeric value with
 * "The value '...' is not valid for Int32", so it is typed as an integer here.
 * https://v2.api.finerworks.com/Help/Api/GET-v3-get_shipping_options_ids_type
 */
export const ShippingGetOptionIdsInputSchema = z.object({
	type: z.number().int().optional(),
});
export const ShippingGetOptionIdsOutputSchema = z
	.object({
		status: FinerWorksStatusSchema.optional(),
		shipping_options: z.array(FinerWorksShippingOption).nullable().optional(),
	})
	.loose();

/** https://v2.api.finerworks.com/Help/Api/POST-v3-list_shipping_options_multiple */
export const ShippingListOptionsMultipleInputSchema = z.object({
	orders: z.array(FinerWorksOrderInputSchema).min(1),
});
export const ShippingListOptionsMultipleOutputSchema = z
	.object({
		status: FinerWorksStatusSchema.optional(),
		orders: z.array(FinerWorksShippingQuote).nullable().optional(),
	})
	.loose();

// ---------------------------------------------------------------------------
// Virtual inventory
// ---------------------------------------------------------------------------

/** https://v2.api.finerworks.com/Help/Api/POST-v3-list_virtual_inventory */
export const InventoryListInputSchema = z.object({
	search_filter: z.string().nullable().optional(),
	third_party_connections_filter: z.array(z.string()).nullable().optional(),
	sku_filter: z.array(z.string()).nullable().optional(),
	product_code_filter: z.array(z.string()).nullable().optional(),
	product_type_ids_filter: z.array(z.number()).nullable().optional(),
	guid_filter: z.array(z.string()).nullable().optional(),
	...PaginationInput,
	sort_field: z.string().nullable().optional(),
	sort_direction: z.enum(['ASC', 'DESC']).nullable().optional(),
	created_date_from: z.string().nullable().optional(),
	created_date_to: z.string().nullable().optional(),
	account_key: accountKey,
});
export const InventoryListOutputSchema = z
	.object({
		status: FinerWorksStatusSchema.optional(),
		products: z.array(FinerWorksVirtualInventoryProduct).nullable().optional(),
		...PaginationOutput,
	})
	.loose();

/** https://v2.api.finerworks.com/Help/Api/PUT-v3-update_virtual_inventory */
export const InventoryUpdateInputSchema = z.object({
	virtual_inventory: z
		.array(
			z
				.object({
					sku: z.string(),
					asking_price: z.number().nullable().optional(),
					name: z.string().nullable().optional(),
					description: z.string().nullable().optional(),
					quantity_in_stock: z.number().nullable().optional(),
					track_inventory: z.boolean().nullable().optional(),
					third_party_integrations:
						FinerWorksThirdPartyIntegrations.nullable().optional(),
				})
				.loose(),
		)
		.min(1),
	account_key: accountKey,
});
export const InventoryUpdateOutputSchema = z
	.object({
		status: FinerWorksStatusSchema.optional(),
		products: z.array(FinerWorksVirtualInventoryProduct).nullable().optional(),
	})
	.loose();

/** https://v2.api.finerworks.com/Help/Api/DELETE-v3-delete_virtual_inventory */
export const InventoryDeleteInputSchema = z.object({
	skus: z.array(z.string()).min(1),
	account_key: accountKey,
});
export const InventoryDeleteOutputSchema = z
	.object({ status: FinerWorksStatusSchema.optional() })
	.loose();

/** https://v2.api.finerworks.com/Help/Api/PUT-v3-disconnect_virtual_inventory */
export const InventoryDisconnectInputSchema = z.object({
	platform: z.string(),
	account_key: accountKey,
});
export const InventoryDisconnectOutputSchema = z
	.object({ status: FinerWorksStatusSchema.optional() })
	.loose();

// ---------------------------------------------------------------------------
// Registries
// ---------------------------------------------------------------------------

export const FinerWorksEndpointInputSchemas = {
	'account.getCompanyInfo': AccountGetCompanyInfoInputSchema,
	'account.getUser': AccountGetUserInputSchema,
	'account.updateUser': AccountUpdateUserInputSchema,
	'account.updateAppDetails': AccountUpdateAppDetailsInputSchema,
	'images.add': ImagesAddInputSchema,
	'images.list': ImagesListInputSchema,
	'images.update': ImagesUpdateInputSchema,
	'images.delete': ImagesDeleteInputSchema,
	'images.listFileSelection': ImagesListFileSelectionInputSchema,
	'images.updateFileSelection': ImagesUpdateFileSelectionInputSchema,
	'galleries.addOrUpdateCollection': GalleriesAddOrUpdateCollectionInputSchema,
	'galleries.list': GalleriesListInputSchema,
	'galleries.listThemes': GalleriesListThemesInputSchema,
	'orders.submit': OrdersSubmitInputSchema,
	'orders.savePending': OrdersSavePendingInputSchema,
	'orders.deletePending': OrdersDeletePendingInputSchema,
	'orders.fetchStatus': OrdersFetchStatusInputSchema,
	'orders.listStatusDefinitions': OrdersListStatusDefinitionsInputSchema,
	'orders.validateRecipientAddress': OrdersValidateRecipientAddressInputSchema,
	'products.getPrices': ProductsGetPricesInputSchema,
	'products.listMediaTypes': ProductsListMediaTypesInputSchema,
	'products.listProductTypes': ProductsListProductTypesInputSchema,
	'products.listStyleTypes': ProductsListStyleTypesInputSchema,
	'framing.getFrameDetails': FramingGetFrameDetailsInputSchema,
	'framing.listCollections': FramingListCollectionsInputSchema,
	'framing.listGlazing': FramingListGlazingInputSchema,
	'framing.listMats': FramingListMatsInputSchema,
	'shipping.getOptionIds': ShippingGetOptionIdsInputSchema,
	'shipping.listOptionsMultiple': ShippingListOptionsMultipleInputSchema,
	'inventory.list': InventoryListInputSchema,
	'inventory.update': InventoryUpdateInputSchema,
	'inventory.delete': InventoryDeleteInputSchema,
	'inventory.disconnect': InventoryDisconnectInputSchema,
} as const;

export const FinerWorksEndpointOutputSchemas = {
	'account.getCompanyInfo': AccountGetCompanyInfoOutputSchema,
	'account.getUser': AccountGetUserOutputSchema,
	'account.updateUser': AccountUpdateUserOutputSchema,
	'account.updateAppDetails': AccountUpdateAppDetailsOutputSchema,
	'images.add': ImagesAddOutputSchema,
	'images.list': ImagesListOutputSchema,
	'images.update': ImagesUpdateOutputSchema,
	'images.delete': ImagesDeleteOutputSchema,
	'images.listFileSelection': ImagesListFileSelectionOutputSchema,
	'images.updateFileSelection': ImagesUpdateFileSelectionOutputSchema,
	'galleries.addOrUpdateCollection': GalleriesAddOrUpdateCollectionOutputSchema,
	'galleries.list': GalleriesListOutputSchema,
	'galleries.listThemes': GalleriesListThemesOutputSchema,
	'orders.submit': OrdersSubmitOutputSchema,
	'orders.savePending': OrdersSavePendingOutputSchema,
	'orders.deletePending': OrdersDeletePendingOutputSchema,
	'orders.fetchStatus': OrdersFetchStatusOutputSchema,
	'orders.listStatusDefinitions': OrdersListStatusDefinitionsOutputSchema,
	'orders.validateRecipientAddress': OrdersValidateRecipientAddressOutputSchema,
	'products.getPrices': ProductsGetPricesOutputSchema,
	'products.listMediaTypes': ProductsListMediaTypesOutputSchema,
	'products.listProductTypes': ProductsListProductTypesOutputSchema,
	'products.listStyleTypes': ProductsListStyleTypesOutputSchema,
	'framing.getFrameDetails': FramingGetFrameDetailsOutputSchema,
	'framing.listCollections': FramingListCollectionsOutputSchema,
	'framing.listGlazing': FramingListGlazingOutputSchema,
	'framing.listMats': FramingListMatsOutputSchema,
	'shipping.getOptionIds': ShippingGetOptionIdsOutputSchema,
	'shipping.listOptionsMultiple': ShippingListOptionsMultipleOutputSchema,
	'inventory.list': InventoryListOutputSchema,
	'inventory.update': InventoryUpdateOutputSchema,
	'inventory.delete': InventoryDeleteOutputSchema,
	'inventory.disconnect': InventoryDisconnectOutputSchema,
} as const;

export type FinerWorksEndpointInputs = {
	[K in keyof typeof FinerWorksEndpointInputSchemas]: z.infer<
		(typeof FinerWorksEndpointInputSchemas)[K]
	>;
};

export type FinerWorksEndpointOutputs = {
	[K in keyof typeof FinerWorksEndpointOutputSchemas]: z.infer<
		(typeof FinerWorksEndpointOutputSchemas)[K]
	>;
};
