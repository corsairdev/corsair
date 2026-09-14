import { z } from 'zod';

/**
 * Entity shapes mirror the models documented in the FinerWorks v3 API
 * reference. Every field below is taken from the "Example JSON Response" of
 * the endpoint named in each doc comment. Objects are `.loose()` because
 * FinerWorks adds fields to these models without versioning the route.
 * https://v2.api.finerworks.com/Help
 */

/**
 * Postal address, used for order recipients and for the billing and business
 * addresses on an account.
 * Official: POST /v3/validate_recipient_address
 * https://v2.api.finerworks.com/Help/Api/POST-v3-validate_recipient_address
 */
export const FinerWorksAddress = z
	.object({
		first_name: z.string().nullable().optional(),
		last_name: z.string().nullable().optional(),
		company_name: z.string().nullable().optional(),
		address_1: z.string().nullable().optional(),
		address_2: z.string().nullable().optional(),
		address_3: z.string().nullable().optional(),
		city: z.string().nullable().optional(),
		state_code: z.string().nullable().optional(),
		province: z.string().nullable().optional(),
		zip_postal_code: z.string().nullable().optional(),
		country_code: z.string().nullable().optional(),
		phone: z.string().nullable().optional(),
		email: z.string().nullable().optional(),
		address_order_po: z.string().nullable().optional(),
	})
	.loose();
export type FinerWorksAddress = z.infer<typeof FinerWorksAddress>;

/**
 * A width/height pair in inches, used for print size limits and offered sizes.
 * Official: POST /v3/list_style_types -> `min` / `max` / `available_sizes[]`
 * https://v2.api.finerworks.com/Help/Api/POST-v3-list_style_types
 */
export const FinerWorksDimensions = z
	.object({
		width: z.number().nullable().optional(),
		height: z.number().nullable().optional(),
	})
	.loose();
export type FinerWorksDimensions = z.infer<typeof FinerWorksDimensions>;

/**
 * An optional mounting upgrade offered for a print style.
 * Official: POST /v3/list_style_types -> `mounting_add_ons[]`
 * https://v2.api.finerworks.com/Help/Api/POST-v3-list_style_types
 */
export const FinerWorksMountingAddOn = z
	.object({
		id: z.number().nullable().optional(),
		name: z.string().nullable().optional(),
		description: z.string().nullable().optional(),
		icon_url: z.string().nullable().optional(),
		rate: z.number().nullable().optional(),
		price: z.number().nullable().optional(),
		min: FinerWorksDimensions.nullable().optional(),
		max: FinerWorksDimensions.nullable().optional(),
	})
	.loose();
export type FinerWorksMountingAddOn = z.infer<typeof FinerWorksMountingAddOn>;

/**
 * Storefront product identifiers a virtual inventory item is synced to.
 * Official: PUT /v3/update_virtual_inventory -> `third_party_integrations`
 * https://v2.api.finerworks.com/Help/Api/PUT-v3-update_virtual_inventory
 */
export const FinerWorksThirdPartyIntegrations = z
	.object({
		etsy_product_id: z.number().nullable().optional(),
		shopify_product_id: z.number().nullable().optional(),
		shopify_variant_id: z.number().nullable().optional(),
		shopify_graphql_product_id: z.string().nullable().optional(),
		shopify_graphql_variant_id: z.string().nullable().optional(),
		squarespace_product_id: z.string().nullable().optional(),
		squarespace_variant_id: z.string().nullable().optional(),
		square_product_id: z.string().nullable().optional(),
		square_variant_id: z.string().nullable().optional(),
		bigcommerce_id: z.number().nullable().optional(),
		bigcommerce_variant_id: z.number().nullable().optional(),
		wix_inventory_id: z.string().nullable().optional(),
		wix_product_id: z.string().nullable().optional(),
		wix_variant_id: z.string().nullable().optional(),
		woocommerce_product_id: z.number().nullable().optional(),
		woocommerce_variant_id: z.number().nullable().optional(),
	})
	.loose();
export type FinerWorksThirdPartyIntegrations = z.infer<
	typeof FinerWorksThirdPartyIntegrations
>;

/**
 * A third-party storefront connection on the account profile.
 * Official: PUT /v3/update_user -> `connections[]`
 * https://v2.api.finerworks.com/Help/Api/PUT-v3-update_user
 */
export const FinerWorksConnection = z
	.object({
		name: z.string().nullable().optional(),
		id: z.string().nullable().optional(),
		data: z.string().nullable().optional(),
	})
	.loose();
export type FinerWorksConnection = z.infer<typeof FinerWorksConnection>;

/**
 * The confirmation FinerWorks returns for each accepted order.
 * Official: POST /v3/submit_orders_v2 -> `orders[]`
 * https://v2.api.finerworks.com/Help/Api/POST-v3-submit_orders_v2
 */
export const FinerWorksSubmittedOrder = z
	.object({
		order_po: z.string().nullable().optional(),
		order_id: z.number().nullable().optional(),
		order_confirmation_id: z.number().nullable().optional(),
		order_guid: z.string().nullable().optional(),
		order_email: z.string().nullable().optional(),
		order_confirmation_datetime: z.string().nullable().optional(),
		order_source: z.string().nullable().optional(),
		order_status: z.string().nullable().optional(),
	})
	.loose();
export type FinerWorksSubmittedOrder = z.infer<typeof FinerWorksSubmittedOrder>;

/**
 * Per-SKU pricing inside a shipping quote's calculated total.
 * Official: POST /v3/list_shipping_options_multiple -> `calculated_total.product_pricing[]`
 * https://v2.api.finerworks.com/Help/Api/POST-v3-list_shipping_options_multiple
 */
export const FinerWorksProductPricing = z
	.object({
		product_qty: z.number().nullable().optional(),
		product_sku: z.string().nullable().optional(),
	})
	.loose();
export type FinerWorksProductPricing = z.infer<typeof FinerWorksProductPricing>;

/**
 * Order totals for one shipping option.
 * Official: POST /v3/list_shipping_options_multiple -> `calculated_total`
 * https://v2.api.finerworks.com/Help/Api/POST-v3-list_shipping_options_multiple
 */
export const FinerWorksOrderTotals = z
	.object({
		order_po: z.string().nullable().optional(),
		order_subtotal: z.number().nullable().optional(),
		order_shipping_rate: z.number().nullable().optional(),
		order_discount: z.number().nullable().optional(),
		order_sales_tax: z.number().nullable().optional(),
		order_sales_tax_rate: z.number().nullable().optional(),
		order_expedite_fee: z.number().nullable().optional(),
		order_credits_used: z.number().nullable().optional(),
		order_grand_total: z.number().nullable().optional(),
		product_pricing: z.array(FinerWorksProductPricing).nullable().optional(),
	})
	.loose();
export type FinerWorksOrderTotals = z.infer<typeof FinerWorksOrderTotals>;

/**
 * One priced shipping option for an order.
 * Official: POST /v3/list_shipping_options_multiple -> `orders[].options[]`
 * https://v2.api.finerworks.com/Help/Api/POST-v3-list_shipping_options_multiple
 */
export const FinerWorksShippingQuoteOption = z
	.object({
		id: z.number().nullable().optional(),
		rate: z.number().nullable().optional(),
		shipping_method: z.string().nullable().optional(),
		shipping_code: z.string().nullable().optional(),
		shipping_class_code: z.string().nullable().optional(),
		calculated_total: FinerWorksOrderTotals.nullable().optional(),
	})
	.loose();
export type FinerWorksShippingQuoteOption = z.infer<
	typeof FinerWorksShippingQuoteOption
>;

/**
 * The shipping options available for a single order in a batch quote.
 * Official: POST /v3/list_shipping_options_multiple -> `orders[]`
 * https://v2.api.finerworks.com/Help/Api/POST-v3-list_shipping_options_multiple
 */
export const FinerWorksShippingQuote = z
	.object({
		order_po: z.string().nullable().optional(),
		options: z.array(FinerWorksShippingQuoteOption).nullable().optional(),
	})
	.loose();
export type FinerWorksShippingQuote = z.infer<typeof FinerWorksShippingQuote>;

/**
 * An image file in a FinerWorks library.
 * Official: POST /v3/list_images
 * https://v2.api.finerworks.com/Help/Api/POST-v3-list_images
 */
export const FinerWorksImage = z
	.object({
		id: z.number().nullable().optional(),
		guid: z.string().nullable().optional(),
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
		personal_gallery_title: z.string().nullable().optional(),
		members_gallery_category: z.string().nullable().optional(),
		pix_w: z.number().nullable().optional(),
		pix_h: z.number().nullable().optional(),
		date_added: z.string().nullable().optional(),
		date_updated: z.string().nullable().optional(),
		date_expires: z.string().nullable().optional(),
		active: z.boolean().nullable().optional(),
		assigned_gallery_subcategory_ids: z.array(z.number()).nullable().optional(),
		assigned_personal_gallery_ids: z.array(z.number()).nullable().optional(),
		username: z.string().nullable().optional(),
		account_key: z.string().nullable().optional(),
		artistname: z.string().nullable().optional(),
		rank: z.number().nullable().optional(),
	})
	.loose();
export type FinerWorksImage = z.infer<typeof FinerWorksImage>;

/**
 * A virtual inventory product — a print product configuration bound to an
 * image, optionally synced to a third-party storefront.
 * Official: POST /v3/list_virtual_inventory
 * https://v2.api.finerworks.com/Help/Api/POST-v3-list_virtual_inventory
 */
export const FinerWorksVirtualInventoryProduct = z
	.object({
		id: z.number().nullable().optional(),
		sku: z.string().nullable().optional(),
		product_code: z.string().nullable().optional(),
		product_guid: z.string().nullable().optional(),
		image_guid: z.string().nullable().optional(),
		name: z.string().nullable().optional(),
		description_short: z.string().nullable().optional(),
		description_long: z.string().nullable().optional(),
		artist: z.string().nullable().optional(),
		monetary_format: z.string().nullable().optional(),
		quantity: z.number().nullable().optional(),
		quantity_in_stock: z.number().nullable().optional(),
		track_inventory: z.boolean().nullable().optional(),
		per_item_price: z.number().nullable().optional(),
		total_price: z.number().nullable().optional(),
		asking_price: z.number().nullable().optional(),
		geo_price: z.number().nullable().optional(),
		third_party_integrations:
			FinerWorksThirdPartyIntegrations.nullable().optional(),
		// `price_details`, `framing_options` and `product_size` are null in every
		// documented response for this endpoint and FinerWorks does not publish a
		// shape for them, so there is no better type to narrow to yet. Kept as
		// `unknown` rather than `any` so callers must narrow before use.
		price_details: z.unknown().nullable().optional(),
		framing_options: z.unknown().nullable().optional(),
		product_size: z.unknown().nullable().optional(),
		updated: z.string().nullable().optional(),
		valid: z.boolean().nullable().optional(),
	})
	.loose();
export type FinerWorksVirtualInventoryProduct = z.infer<
	typeof FinerWorksVirtualInventoryProduct
>;

/**
 * A shipment attached to an order, with carrier tracking details.
 * Official: POST /v3/fetch_order_status
 * https://v2.api.finerworks.com/Help/Api/POST-v3-fetch_order_status
 */
export const FinerWorksShipment = z
	.object({
		creation_date: z.string().nullable().optional(),
		shipment_date: z.string().nullable().optional(),
		eta_date: z.string().nullable().optional(),
		delivery_date: z.string().nullable().optional(),
		weight: z.number().nullable().optional(),
		width: z.number().nullable().optional(),
		height: z.number().nullable().optional(),
		depth: z.number().nullable().optional(),
		tracking_number: z.string().nullable().optional(),
		tracking_url: z.string().nullable().optional(),
		carrier: z.string().nullable().optional(),
		service: z.string().nullable().optional(),
		// Documented as null on every shipment in the reference; no published
		// shape to narrow to. `unknown` keeps it opaque but type-safe.
		history: z.unknown().nullable().optional(),
	})
	.loose();
export type FinerWorksShipment = z.infer<typeof FinerWorksShipment>;

/**
 * An order and its current production status.
 * Official: POST /v3/fetch_order_status
 * https://v2.api.finerworks.com/Help/Api/POST-v3-fetch_order_status
 */
export const FinerWorksOrder = z
	.object({
		order_confirmation_id: z.number().nullable().optional(),
		order_po: z.string().nullable().optional(),
		order_id: z.number().nullable().optional(),
		order_status_id: z.number().nullable().optional(),
		order_status_label: z.string().nullable().optional(),
		order_source: z.string().nullable().optional(),
		shipments: z.array(FinerWorksShipment).nullable().optional(),
		processing: z.boolean().nullable().optional(),
	})
	.loose();
export type FinerWorksOrder = z.infer<typeof FinerWorksOrder>;

/**
 * A production status an order can be reported in.
 * Official: GET /v3/list_order_status_definitions
 * https://v2.api.finerworks.com/Help/Api/GET-v3-list_order_status_definitions
 */
export const FinerWorksOrderStatusDefinition = z
	.object({
		order_status_id: z.number().nullable().optional(),
		order_status_label: z.string().nullable().optional(),
	})
	.loose();
export type FinerWorksOrderStatusDefinition = z.infer<
	typeof FinerWorksOrderStatusDefinition
>;

/**
 * Per-SKU price breakdown.
 * Official: POST /v3/get_prices
 * https://v2.api.finerworks.com/Help/Api/POST-v3-get_prices
 */
export const FinerWorksPrice = z
	.object({
		product_qty: z.number().nullable().optional(),
		product_sku: z.string().nullable().optional(),
		product_code: z.string().nullable().optional(),
		product_price: z.number().nullable().optional(),
		add_frame_price: z.number().nullable().optional(),
		add_mat_1_price: z.number().nullable().optional(),
		add_mat_2_price: z.number().nullable().optional(),
		add_glazing_price: z.number().nullable().optional(),
		add_color_correct_price: z.number().nullable().optional(),
		total_price: z.number().nullable().optional(),
		geo_price: z.number().nullable().optional(),
		info: z.string().nullable().optional(),
	})
	.loose();
export type FinerWorksPrice = z.infer<typeof FinerWorksPrice>;

/**
 * A GeoGalleries.com gallery belonging to the account.
 * Official: POST /v3/list_galleries
 * https://v2.api.finerworks.com/Help/Api/POST-v3-list_galleries
 */
export const FinerWorksGallery = z
	.object({
		id: z.number().nullable().optional(),
		name: z.string().nullable().optional(),
		alias: z.string().nullable().optional(),
		personal: z.boolean().nullable().optional(),
		visible: z.boolean().nullable().optional(),
		url: z.string().nullable().optional(),
		description: z.string().nullable().optional(),
		keywords: z.string().nullable().optional(),
		image_count: z.number().nullable().optional(),
	})
	.loose();
export type FinerWorksGallery = z.infer<typeof FinerWorksGallery>;

/**
 * A gallery colour theme.
 * Official: POST /v3/list_gallery_themes
 * https://v2.api.finerworks.com/Help/Api/POST-v3-list_gallery_themes
 */
export const FinerWorksGalleryTheme = z
	.object({
		slug: z.string().nullable().optional(),
		name: z.string().nullable().optional(),
		background: z.string().nullable().optional(),
		foreground: z.string().nullable().optional(),
		primary_color: z.string().nullable().optional(),
		secondary_color: z.string().nullable().optional(),
		accent_color: z.string().nullable().optional(),
		surface: z.string().nullable().optional(),
		muted: z.string().nullable().optional(),
		description: z.string().nullable().optional(),
	})
	.loose();
export type FinerWorksGalleryTheme = z.infer<typeof FinerWorksGalleryTheme>;

/**
 * A frame moulding, with physical dimensions and pricing.
 * Official: POST /v3/frame_details
 * https://v2.api.finerworks.com/Help/Api/POST-v3-frame_details
 */
export const FinerWorksFrame = z
	.object({
		id: z.number().nullable().optional(),
		name: z.string().nullable().optional(),
		thickness: z.number().nullable().optional(),
		depth: z.number().nullable().optional(),
		float_offset: z.number().nullable().optional(),
		rabbet: z.number().nullable().optional(),
		lip: z.number().nullable().optional(),
		profile_svg_url: z.string().nullable().optional(),
		sample_image_url_1: z.string().nullable().optional(),
		sample_image_url_2: z.string().nullable().optional(),
		sample_image_url_3: z.string().nullable().optional(),
		min_width: z.number().nullable().optional(),
		min_height: z.number().nullable().optional(),
		max_width: z.number().nullable().optional(),
		max_height: z.number().nullable().optional(),
		price_level: z.number().nullable().optional(),
		allow_glazing: z.boolean().nullable().optional(),
		allow_matting: z.boolean().nullable().optional(),
		color: z.string().nullable().optional(),
		composite: z.string().nullable().optional(),
		segment_url: z.string().nullable().optional(),
		sample_length: z.number().nullable().optional(),
		class_alias: z.string().nullable().optional(),
		starting_price: z.number().nullable().optional(),
		type: z.string().nullable().optional(),
		type_description: z.string().nullable().optional(),
	})
	.loose();
export type FinerWorksFrame = z.infer<typeof FinerWorksFrame>;

/**
 * A named collection of frames.
 * Official: POST /v3/list_collections
 * https://v2.api.finerworks.com/Help/Api/POST-v3-list_collections
 */
export const FinerWorksFrameCollection = z
	.object({
		id: z.number().nullable().optional(),
		name: z.string().nullable().optional(),
		description: z.string().nullable().optional(),
		alias: z.string().nullable().optional(),
		icon_url_1: z.string().nullable().optional(),
		icon_url_2: z.string().nullable().optional(),
		icon_url_3: z.string().nullable().optional(),
		starting_price: z.number().nullable().optional(),
		frames: z.array(FinerWorksFrame).nullable().optional(),
	})
	.loose();
export type FinerWorksFrameCollection = z.infer<
	typeof FinerWorksFrameCollection
>;

/**
 * A glazing (glass) option.
 * Official: POST /v3/list_glazing
 * https://v2.api.finerworks.com/Help/Api/POST-v3-list_glazing
 */
export const FinerWorksGlazing = z
	.object({
		id: z.number().nullable().optional(),
		name: z.string().nullable().optional(),
		description: z.string().nullable().optional(),
		composite: z.number().nullable().optional(),
		image_1: z.string().nullable().optional(),
		starting_price: z.number().nullable().optional(),
	})
	.loose();
export type FinerWorksGlazing = z.infer<typeof FinerWorksGlazing>;

/**
 * A mat board option, with size limits and pricing.
 * Official: POST /v3/list_mats
 * https://v2.api.finerworks.com/Help/Api/POST-v3-list_mats
 */
export const FinerWorksMat = z
	.object({
		id: z.number().nullable().optional(),
		name: z.string().nullable().optional(),
		color: z.string().nullable().optional(),
		core_color: z.string().nullable().optional(),
		thickness: z.number().nullable().optional(),
		min_width: z.number().nullable().optional(),
		min_height: z.number().nullable().optional(),
		max_width: z.number().nullable().optional(),
		max_height: z.number().nullable().optional(),
		composite: z.string().nullable().optional(),
		starting_price: z.number().nullable().optional(),
	})
	.loose();
export type FinerWorksMat = z.infer<typeof FinerWorksMat>;

/**
 * A printing substrate such as canvas, fine art paper or vinyl.
 * Official: POST /v3/list_media_types
 * https://v2.api.finerworks.com/Help/Api/POST-v3-list_media_types
 */
export const FinerWorksMediaType = z
	.object({
		id: z.number().nullable().optional(),
		product_type_id: z.number().nullable().optional(),
		name: z.string().nullable().optional(),
		description: z.string().nullable().optional(),
		style_ids: z.array(z.number()).nullable().optional(),
		icon_url: z.string().nullable().optional(),
	})
	.loose();
export type FinerWorksMediaType = z.infer<typeof FinerWorksMediaType>;

/**
 * A printing category such as Canvas Prints or Metal Prints.
 * Official: POST /v3/list_product_types
 * https://v2.api.finerworks.com/Help/Api/POST-v3-list_product_types
 */
export const FinerWorksProductType = z
	.object({
		id: z.number().nullable().optional(),
		name: z.string().nullable().optional(),
		description: z.string().nullable().optional(),
		media_ids: z.array(z.number()).nullable().optional(),
		printable_ids: z.array(z.number()).nullable().optional(),
		icon_url: z.string().nullable().optional(),
		color_code: z.string().nullable().optional(),
	})
	.loose();
export type FinerWorksProductType = z.infer<typeof FinerWorksProductType>;

/**
 * A print formatting option — borders, wraps and the sizes it supports.
 * Official: POST /v3/list_style_types
 * https://v2.api.finerworks.com/Help/Api/POST-v3-list_style_types
 */
export const FinerWorksStyleType = z
	.object({
		id: z.number().nullable().optional(),
		name: z.string().nullable().optional(),
		description: z.string().nullable().optional(),
		can_frame: z.boolean().nullable().optional(),
		can_mat: z.boolean().nullable().optional(),
		can_glaze: z.boolean().nullable().optional(),
		frame_class_ids: z.array(z.number()).nullable().optional(),
		custom_sizing: z.boolean().nullable().optional(),
		min: FinerWorksDimensions.nullable().optional(),
		max: FinerWorksDimensions.nullable().optional(),
		available_sizes: z.array(FinerWorksDimensions).nullable().optional(),
		border_size: z.number().nullable().optional(),
		bleed_amt: z.number().nullable().optional(),
		corner_radius: z.number().nullable().optional(),
		depth: z.number().nullable().optional(),
		icon_url: z.string().nullable().optional(),
		allow_decimal: z.boolean().nullable().optional(),
		mounting_add_ons: z.array(FinerWorksMountingAddOn).nullable().optional(),
	})
	.loose();
export type FinerWorksStyleType = z.infer<typeof FinerWorksStyleType>;

/**
 * A shipping method identifier.
 * Official: GET /v3/get_shipping_options_ids
 * https://v2.api.finerworks.com/Help/Api/GET-v3-get_shipping_options_ids_type
 */
export const FinerWorksShippingOption = z
	.object({
		id: z.number().nullable().optional(),
		shipping_method: z.string().nullable().optional(),
		shipping_code: z.string().nullable().optional(),
		shipping_class_code: z.string().nullable().optional(),
		is_international: z.boolean().nullable().optional(),
	})
	.loose();
export type FinerWorksShippingOption = z.infer<typeof FinerWorksShippingOption>;

/**
 * The authenticated FinerWorks account profile.
 * Official: GET /v3/get_user
 * https://v2.api.finerworks.com/Help/Api/GET-v3-get_user_account_key
 */
export const FinerWorksUserAccount = z
	.object({
		account_id: z.number().nullable().optional(),
		account_username: z.string().nullable().optional(),
		account_email: z.string().nullable().optional(),
		account_title: z.string().nullable().optional(),
		account_firstname: z.string().nullable().optional(),
		account_lastname: z.string().nullable().optional(),
		billing_info: FinerWorksAddress.nullable().optional(),
		business_info: FinerWorksAddress.nullable().optional(),
		logo_url: z.string().nullable().optional(),
		payment_profile_id: z.string().nullable().optional(),
		shipping_preferences: z.array(z.number()).nullable().optional(),
		connections: z.array(FinerWorksConnection).nullable().optional(),
	})
	.loose();
export type FinerWorksUserAccount = z.infer<typeof FinerWorksUserAccount>;

/**
 * FinerWorks' own company details.
 * Official: GET /v3/get_company_info
 * https://v2.api.finerworks.com/Help/Api/GET-v3-get_company_info
 */
export const FinerWorksCompanyInfo = z
	.object({
		site_id: z.number().nullable().optional(),
		address: FinerWorksAddress.nullable().optional(),
		lobby_hours: z.string().nullable().optional(),
	})
	.loose();
export type FinerWorksCompanyInfo = z.infer<typeof FinerWorksCompanyInfo>;
