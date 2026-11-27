// Generated from the WooCommerce REST index (GET /wp-json/?context=help on
// a wordpress:latest Docker site with WooCommerce 11.3.1, fetched 2026-11-27); woocommerce-manifest.json is the same contract as JSON.
// Inputs are the route args (path, query and body fields) in one object. Outputs
// make every field optional and nullable and keep unknown fields, matching how
// the zod output schemas parse. Regenerate rather than edit.

export type WoocommerceJsonValue =
	| null
	| boolean
	| number
	| string
	| WoocommerceJsonValue[]
	| { [key: string]: WoocommerceJsonValue | undefined };

export const WOOCOMMERCE_OPERATION_IDS = [
	'coupons.batch',
	'coupons.create',
	'coupons.delete',
	'coupons.get',
	'coupons.list',
	'coupons.update',
	'customers.batch',
	'customers.create',
	'customers.delete',
	'customers.downloads',
	'customers.get',
	'customers.list',
	'customers.update',
	'data.continents.get',
	'data.continents.list',
	'data.countries.get',
	'data.countries.list',
	'data.currencies.current',
	'data.currencies.get',
	'data.currencies.list',
	'data.index',
	'orders.batch',
	'orders.create',
	'orders.delete',
	'orders.emailTemplates',
	'orders.get',
	'orders.list',
	'orders.notes.create',
	'orders.notes.delete',
	'orders.notes.get',
	'orders.notes.list',
	'orders.receipt.create',
	'orders.receipt.get',
	'orders.refunds.create',
	'orders.refunds.delete',
	'orders.refunds.get',
	'orders.refunds.list',
	'orders.refunds.preview',
	'orders.sendEmail',
	'orders.sendOrderDetails',
	'orders.statuses',
	'orders.update',
	'paymentGateways.get',
	'paymentGateways.list',
	'paymentGateways.update',
	'products.attributes.batch',
	'products.attributes.create',
	'products.attributes.delete',
	'products.attributes.get',
	'products.attributes.list',
	'products.attributes.terms.batch',
	'products.attributes.terms.create',
	'products.attributes.terms.delete',
	'products.attributes.terms.get',
	'products.attributes.terms.list',
	'products.attributes.terms.update',
	'products.attributes.update',
	'products.batch',
	'products.brands.batch',
	'products.brands.create',
	'products.brands.delete',
	'products.brands.get',
	'products.brands.list',
	'products.brands.update',
	'products.categories.batch',
	'products.categories.create',
	'products.categories.delete',
	'products.categories.get',
	'products.categories.list',
	'products.categories.update',
	'products.create',
	'products.customFieldNames',
	'products.delete',
	'products.duplicate',
	'products.get',
	'products.list',
	'products.related',
	'products.reviews.batch',
	'products.reviews.create',
	'products.reviews.delete',
	'products.reviews.get',
	'products.reviews.list',
	'products.reviews.update',
	'products.shippingClasses.batch',
	'products.shippingClasses.create',
	'products.shippingClasses.delete',
	'products.shippingClasses.get',
	'products.shippingClasses.list',
	'products.shippingClasses.suggestSlug',
	'products.shippingClasses.update',
	'products.suggested',
	'products.tags.batch',
	'products.tags.create',
	'products.tags.delete',
	'products.tags.get',
	'products.tags.list',
	'products.tags.update',
	'products.update',
	'products.variations.batch',
	'products.variations.create',
	'products.variations.delete',
	'products.variations.generate',
	'products.variations.get',
	'products.variations.list',
	'products.variations.update',
	'refunds.list',
	'reports.couponTotals',
	'reports.customerTotals',
	'reports.list',
	'reports.orderTotals',
	'reports.productTotals',
	'reports.reviewTotals',
	'reports.sales',
	'reports.topSellers',
	'settings.batch',
	'settings.batchAll',
	'settings.get',
	'settings.groups',
	'settings.list',
	'settings.update',
	'shipping.zones.create',
	'shipping.zones.delete',
	'shipping.zones.get',
	'shipping.zones.list',
	'shipping.zones.locations.list',
	'shipping.zones.locations.replace',
	'shipping.zones.methods.create',
	'shipping.zones.methods.delete',
	'shipping.zones.methods.get',
	'shipping.zones.methods.list',
	'shipping.zones.methods.update',
	'shipping.zones.update',
	'shippingMethods.get',
	'shippingMethods.list',
	'systemStatus.get',
	'systemStatus.tools.get',
	'systemStatus.tools.list',
	'systemStatus.tools.run',
	'taxes.batch',
	'taxes.classes.create',
	'taxes.classes.delete',
	'taxes.classes.get',
	'taxes.classes.list',
	'taxes.create',
	'taxes.delete',
	'taxes.get',
	'taxes.list',
	'taxes.update',
	'variations.list',
	'webhooks.batch',
	'webhooks.create',
	'webhooks.delete',
	'webhooks.get',
	'webhooks.list',
	'webhooks.update',
] as const;

export type WoocommerceOperationId = (typeof WOOCOMMERCE_OPERATION_IDS)[number];

export type WoocommerceEmailTemplate = {
	/** A unique ID string for the email template. */
	id?: string | null;
	/** The display name of the email template. */
	title?: string | number | null;
	/** A description of the purpose of the email template. */
	description?: string | number | null;
	[key: string]: unknown;
};

export type WoocommerceOrderActions = {
	/** A message indicating that the action completed successfully. */
	message?: string | number | null;
	[key: string]: unknown;
};

export type WoocommerceBatch = {
	/** List of created resources. */
	create?: Array<Record<string, WoocommerceJsonValue>> | null;
	/** List of updated resources. */
	update?: Array<Record<string, WoocommerceJsonValue>> | null;
	/** List of delete resources. */
	delete?: Array<number | string> | null;
	[key: string]: unknown;
};

export type WoocommerceCustomer = {
	/** Unique identifier for the resource. */
	id?: number | string | null;
	/** The date the customer was created, in the site's timezone. */
	date_created?: WoocommerceJsonValue | null;
	/** The date the customer was created, as GMT. */
	date_created_gmt?: WoocommerceJsonValue | null;
	/** The date the customer was last modified, in the site's timezone. */
	date_modified?: WoocommerceJsonValue | null;
	/** The date the customer was last modified, as GMT. */
	date_modified_gmt?: WoocommerceJsonValue | null;
	/** The email address for the customer. */
	email?: string | number | null;
	/** Customer first name. */
	first_name?: string | number | null;
	/** Customer last name. */
	last_name?: string | number | null;
	/** Customer role. */
	role?: string | number | null;
	/** Customer login name. */
	username?: string | number | null;
	/** Customer password. */
	password?: string | number | null;
	/** List of billing address data. */
	billing?: {
		/** First name. */
		first_name?: string | number | null;
		/** Last name. */
		last_name?: string | number | null;
		/** Company name. */
		company?: string | number | null;
		/** Address line 1 */
		address_1?: string | number | null;
		/** Address line 2 */
		address_2?: string | number | null;
		/** City name. */
		city?: string | number | null;
		/** ISO code or name of the state, province or district. */
		state?: string | number | null;
		/** Postal code. */
		postcode?: string | number | null;
		/** ISO code of the country. */
		country?: string | number | null;
		/** Email address. */
		email?: string | number | null;
		/** Phone number. */
		phone?: string | number | null;
		[key: string]: unknown;
	} | null;
	/** List of shipping address data. */
	shipping?: {
		/** First name. */
		first_name?: string | number | null;
		/** Last name. */
		last_name?: string | number | null;
		/** Company name. */
		company?: string | number | null;
		/** Address line 1 */
		address_1?: string | number | null;
		/** Address line 2 */
		address_2?: string | number | null;
		/** City name. */
		city?: string | number | null;
		/** ISO code or name of the state, province or district. */
		state?: string | number | null;
		/** Postal code. */
		postcode?: string | number | null;
		/** ISO code of the country. */
		country?: string | number | null;
		/** Phone number. */
		phone?: string | number | null;
		[key: string]: unknown;
	} | null;
	/** Is the customer a paying customer? */
	is_paying_customer?: WoocommerceJsonValue | null;
	/** Avatar URL. */
	avatar_url?: string | number | null;
	/** Meta data. */
	meta_data?: Array<{
		/** Meta ID. */
		id?: number | string | null;
		/** Meta key. */
		key?: string | number | null;
		/** Meta value. */
		value?: WoocommerceJsonValue | null;
		[key: string]: unknown;
	}> | null;
	[key: string]: unknown;
};

export type WoocommerceCustomerDownload = {
	/** Download ID. */
	download_id?: string | number | null;
	/** Download file URL. */
	download_url?: string | number | null;
	/** Downloadable product ID. */
	product_id?: number | string | null;
	/** Product name. */
	product_name?: string | number | null;
	/** Downloadable file name. */
	download_name?: string | number | null;
	/** Order ID. */
	order_id?: number | string | null;
	/** Order key. */
	order_key?: string | number | null;
	/** Number of downloads remaining. */
	downloads_remaining?: string | number | null;
	/** The date when download access expires, in the site's timezone. */
	access_expires?: string | number | null;
	/** The date when download access expires, as GMT. */
	access_expires_gmt?: string | number | null;
	/** File details. */
	file?: {
		/** File name. */
		name?: string | number | null;
		/** File URL. */
		file?: string | number | null;
		[key: string]: unknown;
	} | null;
	[key: string]: unknown;
};

export type WoocommerceDataContinents = {
	/** 2 character continent code. */
	code?: string | number | null;
	/** Full name of continent. */
	name?: string | number | null;
	/** List of countries on this continent. */
	countries?: Array<{
		/** ISO3166 alpha-2 country code. */
		code?: string | number | null;
		/** Default ISO4127 alpha-3 currency code for the country. */
		currency_code?: string | number | null;
		/** Currency symbol position for this country. */
		currency_pos?: string | number | null;
		/** Decimal separator for displayed prices for this country. */
		decimal_sep?: string | number | null;
		/** The unit lengths are defined in for this country. */
		dimension_unit?: string | number | null;
		/** Full name of country. */
		name?: string | number | null;
		/** Number of decimal points shown in displayed prices for this country. */
		num_decimals?: number | string | null;
		/** List of states in this country. */
		states?: Array<{
			/** State code. */
			code?: string | number | null;
			/** Full name of state. */
			name?: string | number | null;
			[key: string]: unknown;
		}> | null;
		/** Thousands separator for displayed prices in this country. */
		thousand_sep?: string | number | null;
		/** The unit weights are defined in for this country. */
		weight_unit?: string | number | null;
		[key: string]: unknown;
	}> | null;
	[key: string]: unknown;
};

export type WoocommerceDataCountries = {
	/** ISO3166 alpha-2 country code. */
	code?: string | number | null;
	/** Full name of country. */
	name?: string | number | null;
	/** List of states in this country. */
	states?: Array<{
		/** State code. */
		code?: string | number | null;
		/** Full name of state. */
		name?: string | number | null;
		[key: string]: unknown;
	}> | null;
	[key: string]: unknown;
};

export type WoocommerceDataCurrencies = {
	/** ISO4217 currency code. */
	code?: string | number | null;
	/** Full name of currency. */
	name?: string | number | null;
	/** Currency symbol. */
	symbol?: string | number | null;
	[key: string]: unknown;
};

export type WoocommerceDataIndex = {
	/** Data resource ID. */
	slug?: string | number | null;
	/** Data resource description. */
	description?: string | number | null;
	[key: string]: unknown;
};

export type WoocommerceOrderNote = {
	/** Unique identifier for the resource. */
	id?: number | string | null;
	/** Order note author. */
	author?: string | number | null;
	/** The date the order note was created, in the site's timezone. */
	date_created?: WoocommerceJsonValue | null;
	/** The date the order note was created, as GMT. */
	date_created_gmt?: WoocommerceJsonValue | null;
	/** Order note content. */
	note?: string | number | null;
	/** If true, the note will be shown to customers and they will be notified. If false, the note will be for admin reference only. */
	customer_note?: boolean | null;
	/** If true, this note will be attributed to the current user. If false, the note will be attributed to the system. */
	added_by_user?: boolean | null;
	[key: string]: unknown;
};

export type WoocommerceOrderRefundPreview = {
	/** Refund breakdown by item type. */
	breakdown?: {
		products?: {
			/** Line items in this section. */
			items?: Array<{
				/** The original order line item ID. */
				id?: number | string | null;
				/** The line item name. */
				name?: string | number | null;
				/** The quantity being refunded. Null when the refund was specified by amount only. */
				quantity?: number | string | null;
				/** The refund subtotal for this item (excluding tax). */
				subtotal?: string | number | null;
				/** The tax amount for this item. */
				tax?: string | number | null;
				/** The refund total for this item (tax-inclusive). */
				total?: string | number | null;
				/** Product or variation ID. */
				product_id?: number | string | null;
				[key: string]: unknown;
			}> | null;
			/** Section subtotal (excluding tax). */
			subtotal?: string | number | null;
			/** Section tax total. */
			tax?: string | number | null;
			/** Section total (tax-inclusive). */
			total?: string | number | null;
			[key: string]: unknown;
		} | null;
		shipping?: {
			/** Line items in this section. */
			items?: Array<{
				/** The original order line item ID. */
				id?: number | string | null;
				/** The line item name. */
				name?: string | number | null;
				/** The quantity being refunded. Null when the refund was specified by amount only. */
				quantity?: number | string | null;
				/** The refund subtotal for this item (excluding tax). */
				subtotal?: string | number | null;
				/** The tax amount for this item. */
				tax?: string | number | null;
				/** The refund total for this item (tax-inclusive). */
				total?: string | number | null;
				[key: string]: unknown;
			}> | null;
			/** Section subtotal (excluding tax). */
			subtotal?: string | number | null;
			/** Section tax total. */
			tax?: string | number | null;
			/** Section total (tax-inclusive). */
			total?: string | number | null;
			[key: string]: unknown;
		} | null;
		fees?: {
			/** Line items in this section. */
			items?: Array<{
				/** The original order line item ID. */
				id?: number | string | null;
				/** The line item name. */
				name?: string | number | null;
				/** The quantity being refunded. Null when the refund was specified by amount only. */
				quantity?: number | string | null;
				/** The refund subtotal for this item (excluding tax). */
				subtotal?: string | number | null;
				/** The tax amount for this item. */
				tax?: string | number | null;
				/** The refund total for this item (tax-inclusive). */
				total?: string | number | null;
				[key: string]: unknown;
			}> | null;
			/** Section subtotal (excluding tax). */
			subtotal?: string | number | null;
			/** Section tax total. */
			tax?: string | number | null;
			/** Section total (tax-inclusive). */
			total?: string | number | null;
			[key: string]: unknown;
		} | null;
		[key: string]: unknown;
	} | null;
	/** Grand subtotal of the refund preview (excluding tax). */
	subtotal?: string | number | null;
	/** Grand tax total of the refund preview. */
	tax?: string | number | null;
	/** Grand total of the refund preview (tax-inclusive). */
	total?: string | number | null;
	/** Maximum refundable amount remaining on the order. */
	max_refundable?: string | number | null;
	[key: string]: unknown;
};

export type WoocommerceOrderStatus = {
	/** Order status slug. */
	slug?: string | number | null;
	/** Order status name. */
	name?: string | number | null;
	[key: string]: unknown;
};

export type WoocommercePaymentGateway = {
	/** Payment gateway ID. */
	id?: string | number | null;
	/** Payment gateway title on checkout. */
	title?: string | number | null;
	/** Payment gateway description on checkout. */
	description?: string | number | null;
	/** Payment gateway sort order. */
	order?: number | string | null;
	/** Payment gateway enabled status. */
	enabled?: boolean | null;
	/** Payment gateway method title. */
	method_title?: string | number | null;
	/** Payment gateway method description. */
	method_description?: string | number | null;
	/** Supported features for this payment gateway. */
	method_supports?: Array<string | number> | null;
	/** Payment gateway settings. */
	settings?: {
		/** A unique identifier for the setting. */
		id?: string | number | null;
		/** A human readable label for the setting used in interfaces. */
		label?: string | number | null;
		/** A human readable description for the setting used in interfaces. */
		description?: string | number | null;
		/** Type of setting. */
		type?: string | null;
		/** Setting value. */
		value?: string | number | null;
		/** Default value for the setting. */
		default?: string | number | null;
		/** Additional help text shown to the user about the setting. */
		tip?: string | number | null;
		/** Placeholder text to be displayed in text inputs. */
		placeholder?: string | number | null;
		[key: string]: unknown;
	} | null;
	[key: string]: unknown;
};

export type WoocommerceProduct = {
	/** Unique identifier for the resource. */
	id?: number | string | null;
	/** Product name. */
	name?: string | number | null;
	/** Product slug. */
	slug?: string | number | null;
	/** Product URL. */
	permalink?: string | number | null;
	/** The date the product was created, in the site's timezone. */
	date_created?: WoocommerceJsonValue | null;
	/** The date the product was created, as GMT. */
	date_created_gmt?: WoocommerceJsonValue | null;
	/** The date the product was last modified, in the site's timezone. */
	date_modified?: WoocommerceJsonValue | null;
	/** The date the product was last modified, as GMT. */
	date_modified_gmt?: WoocommerceJsonValue | null;
	/** Product type. */
	type?: string | null;
	/** Product status (post status). */
	status?: string | null;
	/** Featured product. */
	featured?: boolean | null;
	/** Catalog visibility. */
	catalog_visibility?: string | null;
	/** Product description. */
	description?: string | number | null;
	/** Product short description. */
	short_description?: string | number | null;
	/** Stock Keeping Unit. */
	sku?: string | number | null;
	/** GTIN, UPC, EAN or ISBN. */
	global_unique_id?: string | number | null;
	/** Current product price. */
	price?: string | number | null;
	/** Product regular price. */
	regular_price?: string | number | null;
	/** Product sale price. */
	sale_price?: string | number | null;
	/** Start date of sale price, in the site's timezone. */
	date_on_sale_from?: WoocommerceJsonValue | null;
	/** Start date of sale price, as GMT. */
	date_on_sale_from_gmt?: WoocommerceJsonValue | null;
	/** End date of sale price, in the site's timezone. */
	date_on_sale_to?: WoocommerceJsonValue | null;
	/** End date of sale price, in the site's timezone. */
	date_on_sale_to_gmt?: WoocommerceJsonValue | null;
	/** Price formatted in HTML. */
	price_html?: string | number | null;
	/** Shows if the product is on sale. */
	on_sale?: boolean | null;
	/** Shows if the product can be bought. */
	purchasable?: boolean | null;
	/** Amount of sales. */
	total_sales?: number | string | null;
	/** If the product is virtual. */
	virtual?: boolean | null;
	/** If the product is downloadable. */
	downloadable?: boolean | null;
	/** List of downloadable files. */
	downloads?: Array<{
		/** File ID. */
		id?: string | number | null;
		/** File name. */
		name?: string | number | null;
		/** File URL. */
		file?: string | number | null;
		[key: string]: unknown;
	}> | null;
	/** Number of times downloadable files can be downloaded after purchase. */
	download_limit?: number | string | null;
	/** Number of days until access to downloadable files expires. */
	download_expiry?: number | string | null;
	/** Product external URL. Only for external products. */
	external_url?: string | number | null;
	/** Product external button text. Only for external products. */
	button_text?: string | number | null;
	/** Tax status. */
	tax_status?: string | null;
	/** Tax class. */
	tax_class?: string | number | null;
	/** Stock management at product level. */
	manage_stock?: boolean | null;
	/** Stock quantity. */
	stock_quantity?: number | string | null;
	/** Controls the stock status of the product. */
	stock_status?: string | null;
	/** If managing stock, this controls if backorders are allowed. */
	backorders?: string | null;
	/** Shows if backorders are allowed. */
	backorders_allowed?: boolean | null;
	/** Shows if the product is on backordered. */
	backordered?: boolean | null;
	/** Low Stock amount for the product. */
	low_stock_amount?: number | string | null;
	/** Allow one item to be bought in a single order. */
	sold_individually?: boolean | null;
	/** Product weight (lbs). */
	weight?: string | number | null;
	/** Product dimensions. */
	dimensions?: {
		/** Product length (in). */
		length?: string | number | null;
		/** Product width (in). */
		width?: string | number | null;
		/** Product height (in). */
		height?: string | number | null;
		[key: string]: unknown;
	} | null;
	/** Shows if the product need to be shipped. */
	shipping_required?: boolean | null;
	/** Shows whether or not the product shipping is taxable. */
	shipping_taxable?: boolean | null;
	/** Shipping class slug. */
	shipping_class?: string | number | null;
	/** Shipping class ID. */
	shipping_class_id?: string | number | null;
	/** Allow reviews. */
	reviews_allowed?: boolean | null;
	/** Post password. */
	post_password?: string | number | null;
	/** Reviews average rating. */
	average_rating?: string | number | null;
	/** Amount of reviews that the product have. */
	rating_count?: number | string | null;
	/** List of related products IDs. */
	related_ids?: Array<number | string> | null;
	/** List of up-sell products IDs. */
	upsell_ids?: Array<number | string> | null;
	/** List of cross-sell products IDs. */
	cross_sell_ids?: Array<number | string> | null;
	/** Product parent ID. */
	parent_id?: number | string | null;
	/** Optional note to send the customer after purchase. */
	purchase_note?: string | number | null;
	/** List of categories. */
	categories?: Array<{
		/** Category ID. */
		id?: number | string | null;
		/** Category name. */
		name?: string | number | null;
		/** Category slug. */
		slug?: string | number | null;
		[key: string]: unknown;
	}> | null;
	/** List of brands. */
	brands?: Array<{
		/** Brand ID. */
		id?: number | string | null;
		/** Brand name. */
		name?: string | number | null;
		/** Brand slug. */
		slug?: string | number | null;
		[key: string]: unknown;
	}> | null;
	/** List of tags. */
	tags?: Array<{
		/** Tag ID. */
		id?: number | string | null;
		/** Tag name. */
		name?: string | number | null;
		/** Tag slug. */
		slug?: string | number | null;
		[key: string]: unknown;
	}> | null;
	/** List of images. */
	images?: Array<{
		/** Image ID. */
		id?: number | string | null;
		/** The date the image was created, in the site's timezone. */
		date_created?: WoocommerceJsonValue | null;
		/** The date the image was created, as GMT. */
		date_created_gmt?: WoocommerceJsonValue | null;
		/** The date the image was last modified, in the site's timezone. */
		date_modified?: WoocommerceJsonValue | null;
		/** The date the image was last modified, as GMT. */
		date_modified_gmt?: WoocommerceJsonValue | null;
		/** Image URL. */
		src?: string | number | null;
		/** Image name. */
		name?: string | number | null;
		/** Image alternative text. */
		alt?: string | number | null;
		[key: string]: unknown;
	}> | null;
	/** Shows if the product needs to be configured before it can be bought. */
	has_options?: boolean | null;
	/** List of attributes. */
	attributes?: Array<{
		/** Attribute ID. */
		id?: number | string | null;
		/** Attribute name. */
		name?: string | number | null;
		/** Attribute position. */
		position?: number | string | null;
		/** Define if the attribute is visible on the "Additional information" tab in the product's page. */
		visible?: boolean | null;
		/** Define if the attribute can be used as variation. */
		variation?: boolean | null;
		/** List of available term names of the attribute. */
		options?: Array<string | number> | null;
		[key: string]: unknown;
	}> | null;
	/** Defaults variation attributes. */
	default_attributes?: Array<{
		/** Attribute ID. */
		id?: number | string | null;
		/** Attribute name. */
		name?: string | number | null;
		/** Selected attribute term name. */
		option?: string | number | null;
		[key: string]: unknown;
	}> | null;
	/** List of variations IDs. */
	variations?: Array<number | string> | null;
	/** List of grouped products ID. */
	grouped_products?: Array<number | string> | null;
	/** Menu order, used to custom sort products. */
	menu_order?: number | string | null;
	/** Meta data. */
	meta_data?: Array<{
		/** Meta ID. */
		id?: number | string | null;
		/** Meta key. */
		key?: string | number | null;
		/** Meta value. */
		value?: WoocommerceJsonValue | null;
		[key: string]: unknown;
	}> | null;
	/** Permalink template for the product. */
	permalink_template?: string | number | null;
	/** Slug automatically generated from the product name. */
	generated_slug?: string | number | null;
	/** Customs commodity code containing 6 to 14 digits. Punctuation and spaces are removed. */
	customs_commodity_code?: string | number | null;
	/** Two-letter country of origin code. */
	customs_country_of_origin?: string | number | null;
	/** Plain-text customs description, up to 35 characters, without emoji or special symbols such as ™. */
	customs_description?: string | number | null;
	[key: string]: unknown;
};

export type WoocommerceProductAttribute = {
	/** Unique identifier for the resource. */
	id?: number | string | null;
	/** Attribute name. */
	name?: string | number | null;
	/** An alphanumeric identifier for the resource unique to its type. */
	slug?: string | number | null;
	/** Type of attribute. */
	type?: string | null;
	/** Default sort order. */
	order_by?: string | null;
	/** Enable/Disable attribute archives. */
	has_archives?: boolean | null;
	[key: string]: unknown;
};

export type WoocommerceProductAttributeTerm = {
	/** Unique identifier for the resource. */
	id?: number | string | null;
	/** Term name. */
	name?: string | number | null;
	/** An alphanumeric identifier for the resource unique to its type. */
	slug?: string | number | null;
	/** HTML description of the resource. */
	description?: string | number | null;
	/** Menu order, used to custom sort the resource. */
	menu_order?: number | string | null;
	/** Number of published products for the resource. */
	count?: number | string | null;
	[key: string]: unknown;
};

export type WoocommerceProductBrand = {
	/** Unique identifier for the resource. */
	id?: number | string | null;
	/** Category name. */
	name?: string | number | null;
	/** An alphanumeric identifier for the resource unique to its type. */
	slug?: string | number | null;
	/** The ID for the parent of the resource. */
	parent?: number | string | null;
	/** HTML description of the resource. */
	description?: string | number | null;
	/** Category archive display type. */
	display?: string | null;
	/** Image data. */
	image?: {
		/** Image ID. */
		id?: number | string | null;
		/** The date the image was created, in the site's timezone. */
		date_created?: WoocommerceJsonValue | null;
		/** The date the image was created, as GMT. */
		date_created_gmt?: WoocommerceJsonValue | null;
		/** The date the image was last modified, in the site's timezone. */
		date_modified?: WoocommerceJsonValue | null;
		/** The date the image was last modified, as GMT. */
		date_modified_gmt?: WoocommerceJsonValue | null;
		/** Image URL. */
		src?: string | number | null;
		/** Image name. */
		name?: string | number | null;
		/** Image alternative text. */
		alt?: string | number | null;
		[key: string]: unknown;
	} | null;
	/** Menu order, used to custom sort the resource. */
	menu_order?: number | string | null;
	/** Number of published products for the resource. */
	count?: number | string | null;
	[key: string]: unknown;
};

export type WoocommerceProductCat = {
	/** Unique identifier for the resource. */
	id?: number | string | null;
	/** Category name. */
	name?: string | number | null;
	/** An alphanumeric identifier for the resource unique to its type. */
	slug?: string | number | null;
	/** The ID for the parent of the resource. */
	parent?: number | string | null;
	/** HTML description of the resource. */
	description?: string | number | null;
	/** Category archive display type. */
	display?: string | null;
	/** Image data. */
	image?: {
		/** Image ID. */
		id?: number | string | null;
		/** The date the image was created, in the site's timezone. */
		date_created?: WoocommerceJsonValue | null;
		/** The date the image was created, as GMT. */
		date_created_gmt?: WoocommerceJsonValue | null;
		/** The date the image was last modified, in the site's timezone. */
		date_modified?: WoocommerceJsonValue | null;
		/** The date the image was last modified, as GMT. */
		date_modified_gmt?: WoocommerceJsonValue | null;
		/** Image URL. */
		src?: string | number | null;
		/** Image name. */
		name?: string | number | null;
		/** Image alternative text. */
		alt?: string | number | null;
		[key: string]: unknown;
	} | null;
	/** Menu order, used to custom sort the term. */
	menu_order?: number | string | null;
	/** Number of published products for the resource. */
	count?: number | string | null;
	[key: string]: unknown;
};

export type WoocommerceProductReview = {
	/** Unique identifier for the resource. */
	id?: number | string | null;
	/** The date the review was created, in the site's timezone. */
	date_created?: WoocommerceJsonValue | null;
	/** The date the review was created, as GMT. */
	date_created_gmt?: WoocommerceJsonValue | null;
	/** Unique identifier for the product that the review belongs to. */
	product_id?: number | string | null;
	/** Product name. */
	product_name?: string | number | null;
	/** Product URL. */
	product_permalink?: string | number | null;
	/** Status of the review. */
	status?: string | null;
	/** Reviewer name. */
	reviewer?: string | number | null;
	/** Reviewer email. */
	reviewer_email?: string | number | null;
	/** The content of the review. */
	review?: string | number | null;
	/** Review rating (0 to 5). */
	rating?: number | string | null;
	/** Shows if the reviewer bought the product or not. */
	verified?: boolean | null;
	/** Avatar URLs for the object reviewer. */
	reviewer_avatar_urls?: {
		/** Avatar URL with image size of 24 pixels. */
		'24'?: string | number | null;
		/** Avatar URL with image size of 48 pixels. */
		'48'?: string | number | null;
		/** Avatar URL with image size of 96 pixels. */
		'96'?: string | number | null;
		[key: string]: unknown;
	} | null;
	[key: string]: unknown;
};

export type WoocommerceProductShippingClass = {
	/** Unique identifier for the resource. */
	id?: number | string | null;
	/** Shipping class name. */
	name?: string | number | null;
	/** An alphanumeric identifier for the resource unique to its type. */
	slug?: string | number | null;
	/** HTML description of the resource. */
	description?: string | number | null;
	/** Number of published products for the resource. */
	count?: number | string | null;
	[key: string]: unknown;
};

export type WoocommerceProductTag = {
	/** Unique identifier for the resource. */
	id?: number | string | null;
	/** Tag name. */
	name?: string | number | null;
	/** An alphanumeric identifier for the resource unique to its type. */
	slug?: string | number | null;
	/** HTML description of the resource. */
	description?: string | number | null;
	/** Number of published products for the resource. */
	count?: number | string | null;
	[key: string]: unknown;
};

export type WoocommerceProductVariation = {
	/** Unique identifier for the resource. */
	id?: number | string | null;
	/** Product type. */
	type?: string | number | null;
	/** The date the variation was created, in the site's timezone. */
	date_created?: WoocommerceJsonValue | null;
	/** The date the variation was last modified, in the site's timezone. */
	date_modified?: WoocommerceJsonValue | null;
	/** Variation description. */
	description?: string | number | null;
	/** Variation URL. */
	permalink?: string | number | null;
	/** Stock Keeping Unit. */
	sku?: string | number | null;
	/** GTIN, UPC, EAN or ISBN. */
	global_unique_id?: string | number | null;
	/** Current variation price. */
	price?: string | number | null;
	/** Variation regular price. */
	regular_price?: string | number | null;
	/** Variation sale price. */
	sale_price?: string | number | null;
	/** Start date of sale price, in the site's timezone. */
	date_on_sale_from?: WoocommerceJsonValue | null;
	/** Start date of sale price, as GMT. */
	date_on_sale_from_gmt?: WoocommerceJsonValue | null;
	/** End date of sale price, in the site's timezone. */
	date_on_sale_to?: WoocommerceJsonValue | null;
	/** End date of sale price, in the site's timezone. */
	date_on_sale_to_gmt?: WoocommerceJsonValue | null;
	/** Shows if the variation is on sale. */
	on_sale?: boolean | null;
	/** Variation status. */
	status?: string | null;
	/** Shows if the variation can be bought. */
	purchasable?: boolean | null;
	/** If the variation is virtual. */
	virtual?: boolean | null;
	/** If the variation is downloadable. */
	downloadable?: boolean | null;
	/** List of downloadable files. */
	downloads?: Array<{
		/** File ID. */
		id?: string | number | null;
		/** File name. */
		name?: string | number | null;
		/** File URL. */
		file?: string | number | null;
		[key: string]: unknown;
	}> | null;
	/** Number of times downloadable files can be downloaded after purchase. */
	download_limit?: number | string | null;
	/** Number of days until access to downloadable files expires. */
	download_expiry?: number | string | null;
	/** Tax status. */
	tax_status?: string | null;
	/** Tax class. */
	tax_class?: string | number | null;
	/** Stock management at variation level. */
	manage_stock?: (boolean | string | number) | null;
	/** Stock quantity. */
	stock_quantity?: number | string | null;
	/** Controls the stock status of the product. */
	stock_status?: string | null;
	/** If managing stock, this controls if backorders are allowed. */
	backorders?: string | null;
	/** Shows if backorders are allowed. */
	backorders_allowed?: boolean | null;
	/** Shows if the variation is on backordered. */
	backordered?: boolean | null;
	/** Low Stock amount for the variation. */
	low_stock_amount?: number | string | null;
	/** Variation weight (lbs). */
	weight?: string | number | null;
	/** Variation dimensions. */
	dimensions?: {
		/** Variation length (in). */
		length?: string | number | null;
		/** Variation width (in). */
		width?: string | number | null;
		/** Variation height (in). */
		height?: string | number | null;
		[key: string]: unknown;
	} | null;
	/** Shipping class slug. */
	shipping_class?: string | number | null;
	/** Shipping class ID. */
	shipping_class_id?: string | number | null;
	/** Variation image data. */
	image?: {
		/** Image ID. */
		id?: number | string | null;
		/** The date the image was created, in the site's timezone. */
		date_created?: WoocommerceJsonValue | null;
		/** The date the image was created, as GMT. */
		date_created_gmt?: WoocommerceJsonValue | null;
		/** The date the image was last modified, in the site's timezone. */
		date_modified?: WoocommerceJsonValue | null;
		/** The date the image was last modified, as GMT. */
		date_modified_gmt?: WoocommerceJsonValue | null;
		/** Image URL. */
		src?: string | number | null;
		/** Image name. */
		name?: string | number | null;
		/** Image alternative text. */
		alt?: string | number | null;
		[key: string]: unknown;
	} | null;
	/** Variation gallery image IDs, excluding the featured image (which is set via "image"). Mirrors how galleries work on parent products. */
	gallery_image_ids?: Array<number | string> | null;
	/** List of attributes. */
	attributes?: Array<{
		/** Attribute ID. */
		id?: number | string | null;
		/** Attribute name. */
		name?: string | number | null;
		/** Selected attribute term name. */
		option?: string | number | null;
		[key: string]: unknown;
	}> | null;
	/** Menu order, used to custom sort products. */
	menu_order?: number | string | null;
	/** Meta data. */
	meta_data?: Array<{
		/** Meta ID. */
		id?: number | string | null;
		/** Meta key. */
		key?: string | number | null;
		/** Meta value. */
		value?: WoocommerceJsonValue | null;
		[key: string]: unknown;
	}> | null;
	/** Product parent ID. */
	parent_id?: number | string | null;
	/** Customs commodity code containing 6 to 14 digits. Punctuation and spaces are removed. In view context, an empty value inherits the parent value; in edit context, only the stored value is returned (null when inherited). */
	customs_commodity_code?: string | number | null;
	/** Two-letter country of origin code. In view context, an empty value inherits the parent value; in edit context, only the stored value is returned (null when inherited). */
	customs_country_of_origin?: string | number | null;
	/** Plain-text customs description, up to 35 characters, without emoji or special symbols such as ™. In view context, an empty value inherits the parent value; in edit context, only the stored value is returned (null when inherited). */
	customs_description?: string | number | null;
	[key: string]: unknown;
};

export type WoocommerceReport = {
	/** An alphanumeric identifier for the resource. */
	slug?: string | number | null;
	/** A human-readable description of the resource. */
	description?: string | number | null;
	[key: string]: unknown;
};

export type WoocommerceReportCouponTotal = {
	/** An alphanumeric identifier for the resource. */
	slug?: string | number | null;
	/** Coupon type name. */
	name?: string | number | null;
	/** Amount of coupons. */
	total?: string | number | null;
	[key: string]: unknown;
};

export type WoocommerceReportCustomerTotal = {
	/** An alphanumeric identifier for the resource. */
	slug?: string | number | null;
	/** Customer type name. */
	name?: string | number | null;
	/** Amount of customers. */
	total?: string | number | null;
	[key: string]: unknown;
};

export type WoocommerceReportOrderTotal = {
	/** An alphanumeric identifier for the resource. */
	slug?: string | number | null;
	/** Order status name. */
	name?: string | number | null;
	/** Amount of orders. */
	total?: string | number | null;
	[key: string]: unknown;
};

export type WoocommerceReportProductTotal = {
	/** An alphanumeric identifier for the resource. */
	slug?: string | number | null;
	/** Product type name. */
	name?: string | number | null;
	/** Amount of products. */
	total?: string | number | null;
	[key: string]: unknown;
};

export type WoocommerceReportReviewTotal = {
	/** An alphanumeric identifier for the resource. */
	slug?: string | number | null;
	/** Review type name. */
	name?: string | number | null;
	/** Amount of reviews. */
	total?: string | number | null;
	[key: string]: unknown;
};

export type WoocommerceSalesReport = {
	/** Gross sales in the period. */
	total_sales?: string | number | null;
	/** Net sales in the period. */
	net_sales?: string | number | null;
	/** Average net daily sales. */
	average_sales?: string | number | null;
	/** Total of orders placed. */
	total_orders?: number | string | null;
	/** Total of items purchased. */
	total_items?: number | string | null;
	/** Total charged for taxes. */
	total_tax?: string | number | null;
	/** Total charged for shipping. */
	total_shipping?: string | number | null;
	/** Total of refunded orders. */
	total_refunds?: number | string | null;
	/** Total of coupons used. */
	total_discount?: number | string | null;
	/** Group type. */
	totals_grouped_by?: string | number | null;
	/** Totals. */
	totals?: Record<
		string,
		{
			/** Gross sales in the period. */
			sales?: string | number | null;
			/** Number of orders in the period. */
			orders?: number | string | null;
			/** Number of items sold in the period. */
			items?: number | string | null;
			/** Tax charged in the period. */
			tax?: string | number | null;
			/** Shipping charged in the period. */
			shipping?: string | number | null;
			/** Discounts applied in the period. */
			discount?: string | number | null;
			/** Refunds issued in the period. */
			refunds?: string | number | null;
			/** New customers in the period. */
			customers?: number | string | null;
			[key: string]: unknown;
		}
	> | null;
	[key: string]: unknown;
};

export type WoocommerceSetting = {
	/** A unique identifier for the setting. */
	id?: string | number | null;
	/** An identifier for the group this setting belongs to. */
	group_id?: string | number | null;
	/** A human readable label for the setting used in interfaces. */
	label?: string | number | null;
	/** A human readable description for the setting used in interfaces. */
	description?: string | number | null;
	/** Setting value. */
	value?: WoocommerceJsonValue | null;
	/** Default value for the setting. */
	default?: WoocommerceJsonValue | null;
	/** Additional help text shown to the user about the setting. */
	tip?: string | number | null;
	/** Placeholder text to be displayed in text inputs. */
	placeholder?: string | number | null;
	/** Type of setting. */
	type?: string | null;
	/** Array of options (key value pairs) for inputs such as select, multiselect, and radio buttons. */
	options?: Record<string, WoocommerceJsonValue> | null;
	[key: string]: unknown;
};

export type WoocommerceSettingGroup = {
	/** A unique identifier that can be used to link settings together. */
	id?: string | number | null;
	/** A human readable label for the setting used in interfaces. */
	label?: string | number | null;
	/** A human readable description for the setting used in interfaces. */
	description?: string | number | null;
	/** ID of parent grouping. */
	parent_id?: string | number | null;
	/** Ids of the sub groups. */
	sub_groups?: Array<string | number> | null;
	[key: string]: unknown;
};

export type WoocommerceShippingMethod = {
	/** Method ID. */
	id?: string | number | null;
	/** Shipping method title. */
	title?: string | number | null;
	/** Shipping method description. */
	description?: string | number | null;
	[key: string]: unknown;
};

export type WoocommerceShippingZone = {
	/** Unique identifier for the resource. */
	id?: number | string | null;
	/** Shipping zone name. */
	name?: string | number | null;
	/** Shipping zone order. */
	order?: number | string | null;
	[key: string]: unknown;
};

export type WoocommerceShippingZoneLocation = {
	/** Shipping zone location code. */
	code?: string | number | null;
	/** Shipping zone location type. */
	type?: string | null;
	[key: string]: unknown;
};

export type WoocommerceShippingZoneMethod = {
	/** Shipping method instance ID. */
	id?: number | string | null;
	/** Shipping method instance ID. */
	instance_id?: number | string | null;
	/** Shipping method customer facing title. */
	title?: string | number | null;
	/** Shipping method sort order. */
	order?: number | string | null;
	/** Shipping method enabled status. */
	enabled?: boolean | null;
	/** Shipping method ID. */
	method_id?: string | number | null;
	/** Shipping method title. */
	method_title?: string | number | null;
	/** Shipping method description. */
	method_description?: string | number | null;
	/** Shipping method settings. */
	settings?: Record<
		string,
		{
			/** A unique identifier for the setting. */
			id?: string | number | null;
			/** A human readable label for the setting used in interfaces. */
			label?: string | number | null;
			/** A human readable description for the setting used in interfaces. */
			description?: string | number | null;
			/** Type of setting. */
			type?: string | null;
			/** Setting value. */
			value?: string | number | null;
			/** Default value for the setting. */
			default?: string | number | null;
			/** Additional help text shown to the user about the setting. */
			tip?: string | number | null;
			/** Placeholder text to be displayed in text inputs. */
			placeholder?: string | number | null;
			[key: string]: unknown;
		}
	> | null;
	[key: string]: unknown;
};

export type WoocommerceShopCoupon = {
	/** Unique identifier for the object. */
	id?: number | string | null;
	/** Coupon code. */
	code?: string | number | null;
	/** The amount of discount. Should always be numeric, even if setting a percentage. */
	amount?: (number | string | string | number) | null;
	/** The status of the coupon. Should always be draft, published, or pending review */
	status?: string | number | null;
	/** The date the coupon was created, in the site's timezone. */
	date_created?: WoocommerceJsonValue | null;
	/** The date the coupon was created, as GMT. */
	date_created_gmt?: WoocommerceJsonValue | null;
	/** The date the coupon was last modified, in the site's timezone. */
	date_modified?: WoocommerceJsonValue | null;
	/** The date the coupon was last modified, as GMT. */
	date_modified_gmt?: WoocommerceJsonValue | null;
	/** Determines the type of discount that will be applied. */
	discount_type?: string | null;
	/** Coupon description. */
	description?: string | number | null;
	/** The date the coupon expires, in the site's timezone. */
	date_expires?: WoocommerceJsonValue | null;
	/** The date the coupon expires, as GMT. */
	date_expires_gmt?: WoocommerceJsonValue | null;
	/** Number of times the coupon has been used already. */
	usage_count?: number | string | null;
	/** If true, the coupon can only be used individually. Other applied coupons will be removed from the cart. */
	individual_use?: boolean | null;
	/** List of product IDs the coupon can be used on. */
	product_ids?: Array<number | string> | null;
	/** List of product IDs the coupon cannot be used on. */
	excluded_product_ids?: Array<number | string> | null;
	/** How many times the coupon can be used in total. */
	usage_limit?: number | string | null;
	/** How many times the coupon can be used per customer. */
	usage_limit_per_user?: number | string | null;
	/** Max number of items in the cart the coupon can be applied to. */
	limit_usage_to_x_items?: number | string | null;
	/** If true and if the free shipping method requires a coupon, this coupon will enable free shipping. */
	free_shipping?: boolean | null;
	/** List of category IDs the coupon applies to. */
	product_categories?: Array<number | string> | null;
	/** List of category IDs the coupon does not apply to. */
	excluded_product_categories?: Array<number | string> | null;
	/** If true, this coupon will not be applied to items that have sale prices. */
	exclude_sale_items?: boolean | null;
	/** Minimum order amount that needs to be in the cart before coupon applies. */
	minimum_amount?: (number | string | string | number) | null;
	/** Maximum order amount allowed when using the coupon. */
	maximum_amount?: (number | string | string | number) | null;
	/** List of email addresses that can use this coupon. */
	email_restrictions?: Array<string | number> | null;
	/** List of user IDs (or guest email addresses) that have used the coupon. */
	used_by?: Array<number | string> | null;
	/** Meta data. */
	meta_data?: Array<{
		/** Meta ID. */
		id?: number | string | null;
		/** Meta key. */
		key?: string | number | null;
		/** Meta value. */
		value?: WoocommerceJsonValue | null;
		[key: string]: unknown;
	}> | null;
	[key: string]: unknown;
};

export type WoocommerceShopOrder = {
	/** Unique identifier for the resource. */
	id?: number | string | null;
	/** Parent order ID. */
	parent_id?: number | string | null;
	/** Order number. */
	number?: string | number | null;
	/** Order key. */
	order_key?: string | number | null;
	/** Shows where the order was created. */
	created_via?: string | number | null;
	/** Version of WooCommerce which last updated the order. */
	version?: string | number | null;
	/** Order status. */
	status?: string | null;
	/** Currency the order was created with, in ISO format. */
	currency?: string | null;
	/** The date the order was created, in the site's timezone. */
	date_created?: WoocommerceJsonValue | null;
	/** The date the order was created, as GMT. */
	date_created_gmt?: WoocommerceJsonValue | null;
	/** The date the order was last modified, in the site's timezone. */
	date_modified?: WoocommerceJsonValue | null;
	/** The date the order was last modified, as GMT. */
	date_modified_gmt?: WoocommerceJsonValue | null;
	/** Total discount amount for the order. */
	discount_total?: string | number | null;
	/** Total discount tax amount for the order. */
	discount_tax?: string | number | null;
	/** Total shipping amount for the order. */
	shipping_total?: string | number | null;
	/** Total shipping tax amount for the order. */
	shipping_tax?: string | number | null;
	/** Sum of line item taxes only. */
	cart_tax?: string | number | null;
	/** Grand total, including tax. */
	total?: string | number | null;
	/** Sum of all taxes. */
	total_tax?: string | number | null;
	/** Whether prices included tax during checkout. */
	prices_include_tax?: boolean | null;
	/** User ID who owns the order. 0 for guests. */
	customer_id?: number | string | null;
	/** Customer's IP address. */
	customer_ip_address?: string | number | null;
	/** User agent of the customer. */
	customer_user_agent?: string | number | null;
	/** Note left by customer during checkout. */
	customer_note?: string | number | null;
	/** Billing address. */
	billing?: {
		/** First name. */
		first_name?: string | number | null;
		/** Last name. */
		last_name?: string | number | null;
		/** Company name. */
		company?: string | number | null;
		/** Address line 1 */
		address_1?: string | number | null;
		/** Address line 2 */
		address_2?: string | number | null;
		/** City name. */
		city?: string | number | null;
		/** ISO code or name of the state, province or district. */
		state?: string | number | null;
		/** Postal code. */
		postcode?: string | number | null;
		/** Country code in ISO 3166-1 alpha-2 format. */
		country?: string | number | null;
		/** Email address. */
		email?: string | number | null;
		/** Phone number. */
		phone?: string | number | null;
		[key: string]: unknown;
	} | null;
	/** Shipping address. */
	shipping?: {
		/** First name. */
		first_name?: string | number | null;
		/** Last name. */
		last_name?: string | number | null;
		/** Company name. */
		company?: string | number | null;
		/** Address line 1 */
		address_1?: string | number | null;
		/** Address line 2 */
		address_2?: string | number | null;
		/** City name. */
		city?: string | number | null;
		/** ISO code or name of the state, province or district. */
		state?: string | number | null;
		/** Postal code. */
		postcode?: string | number | null;
		/** Country code in ISO 3166-1 alpha-2 format. */
		country?: string | number | null;
		[key: string]: unknown;
	} | null;
	/** Payment method ID. */
	payment_method?: string | number | null;
	/** Payment method title. */
	payment_method_title?: string | number | null;
	/** Unique transaction ID. */
	transaction_id?: string | number | null;
	/** The date the order was paid, in the site's timezone. */
	date_paid?: WoocommerceJsonValue | null;
	/** The date the order was paid, as GMT. */
	date_paid_gmt?: WoocommerceJsonValue | null;
	/** The date the order was completed, in the site's timezone. */
	date_completed?: WoocommerceJsonValue | null;
	/** The date the order was completed, as GMT. */
	date_completed_gmt?: WoocommerceJsonValue | null;
	/** MD5 hash of cart items to ensure orders are not modified. */
	cart_hash?: string | number | null;
	/** Meta data. */
	meta_data?: Array<{
		/** Meta ID. */
		id?: number | string | null;
		/** Meta key. */
		key?: string | number | null;
		/** Meta value. */
		value?: WoocommerceJsonValue | null;
		[key: string]: unknown;
	}> | null;
	/** Line items data. */
	line_items?: Array<{
		/** Item ID. */
		id?: number | string | null;
		/** Product name. */
		name?: WoocommerceJsonValue | null;
		/** Parent product name if the product is a variation. */
		parent_name?: string | number | null;
		/** Product ID. */
		product_id?: WoocommerceJsonValue | null;
		/** Variation ID, if applicable. */
		variation_id?: number | string | null;
		/** Quantity ordered. */
		quantity?: number | string | null;
		/** Tax class of product. */
		tax_class?: string | number | null;
		/** Line subtotal, excluding tax (before discounts). */
		subtotal?: string | number | null;
		/** Line subtotal tax (before discounts). */
		subtotal_tax?: string | number | null;
		/** Line total, excluding tax (after discounts). */
		total?: string | number | null;
		/** Line total tax (after discounts). */
		total_tax?: string | number | null;
		/** Line taxes. */
		taxes?: Array<{
			/** Tax rate ID. */
			id?: number | string | null;
			/** Tax total. */
			total?: string | number | null;
			/** Tax subtotal. */
			subtotal?: string | number | null;
			[key: string]: unknown;
		}> | null;
		/** Meta data. */
		meta_data?: Array<{
			/** Meta ID. */
			id?: number | string | null;
			/** Meta key. */
			key?: string | number | null;
			/** Meta value. */
			value?: WoocommerceJsonValue | null;
			/** Meta key for UI display. */
			display_key?: string | number | null;
			/** Meta value for UI display. May be a string or, when mirroring a complex meta value, an array or object. */
			display_value?: WoocommerceJsonValue | null;
			[key: string]: unknown;
		}> | null;
		/** Product SKU. */
		sku?: string | number | null;
		/** GTIN, UPC, EAN or ISBN. */
		global_unique_id?: string | number | null;
		/** Product price. */
		price?: number | string | null;
		/** Properties of the main product image. */
		image?: {
			/** Image ID. */
			id?: number | string | null;
			/** Image URL. */
			src?: string | number | null;
			[key: string]: unknown;
		} | null;
		[key: string]: unknown;
	}> | null;
	/** Tax lines data. */
	tax_lines?: Array<{
		/** Item ID. */
		id?: number | string | null;
		/** Tax rate code. */
		rate_code?: string | number | null;
		/** Tax rate ID. */
		rate_id?: number | string | null;
		/** Tax rate label. */
		label?: string | number | null;
		/** Show if is a compound tax rate. */
		compound?: boolean | null;
		/** Tax total (not including shipping taxes). */
		tax_total?: string | number | null;
		/** Shipping tax total. */
		shipping_tax_total?: string | number | null;
		/** Meta data. */
		meta_data?: Array<{
			/** Meta ID. */
			id?: number | string | null;
			/** Meta key. */
			key?: string | number | null;
			/** Meta value. */
			value?: WoocommerceJsonValue | null;
			[key: string]: unknown;
		}> | null;
		[key: string]: unknown;
	}> | null;
	/** Shipping lines data. */
	shipping_lines?: Array<{
		/** Item ID. */
		id?: number | string | null;
		/** Shipping method name. */
		method_title?: WoocommerceJsonValue | null;
		/** Shipping method ID. */
		method_id?: WoocommerceJsonValue | null;
		/** Shipping instance ID. */
		instance_id?: string | number | null;
		/** Shipping total, excluding tax. */
		total?: string | number | null;
		/** Shipping total tax. */
		total_tax?: string | number | null;
		/** Line taxes. */
		taxes?: Array<{
			/** Tax rate ID. */
			id?: number | string | null;
			/** Tax total. */
			total?: string | number | null;
			[key: string]: unknown;
		}> | null;
		/** Meta data. */
		meta_data?: Array<{
			/** Meta ID. */
			id?: number | string | null;
			/** Meta key. */
			key?: string | number | null;
			/** Meta value. */
			value?: WoocommerceJsonValue | null;
			[key: string]: unknown;
		}> | null;
		[key: string]: unknown;
	}> | null;
	/** Fee lines data. */
	fee_lines?: Array<{
		/** Item ID. */
		id?: number | string | null;
		/** Fee name. */
		name?: WoocommerceJsonValue | null;
		/** Tax class of fee. */
		tax_class?: string | number | null;
		/** Tax status of fee. */
		tax_status?: string | null;
		/** Fee total, excluding tax. */
		total?: string | number | null;
		/** Fee total tax. */
		total_tax?: string | number | null;
		/** Line taxes. */
		taxes?: Array<{
			/** Tax rate ID. */
			id?: number | string | null;
			/** Tax total. */
			total?: string | number | null;
			/** Tax subtotal. */
			subtotal?: string | number | null;
			[key: string]: unknown;
		}> | null;
		/** Meta data. */
		meta_data?: Array<{
			/** Meta ID. */
			id?: number | string | null;
			/** Meta key. */
			key?: string | number | null;
			/** Meta value. */
			value?: WoocommerceJsonValue | null;
			[key: string]: unknown;
		}> | null;
		[key: string]: unknown;
	}> | null;
	/** Coupons line data. */
	coupon_lines?: Array<{
		/** Item ID. */
		id?: number | string | null;
		/** Coupon code. */
		code?: WoocommerceJsonValue | null;
		/** Discount total. */
		discount?: string | number | null;
		/** Discount total tax. */
		discount_tax?: string | number | null;
		/** Discount type. */
		discount_type?: string | number | null;
		/** Discount amount as defined in the coupon (absolute value or a percent, depending on the discount type). */
		nominal_amount?: number | string | null;
		/** Whether the coupon grants free shipping or not. */
		free_shipping?: boolean | null;
		/** Meta data. */
		meta_data?: Array<{
			/** Meta ID. */
			id?: number | string | null;
			/** Meta key. */
			key?: string | number | null;
			/** Meta value. */
			value?: WoocommerceJsonValue | null;
			[key: string]: unknown;
		}> | null;
		[key: string]: unknown;
	}> | null;
	/** List of refunds. */
	refunds?: Array<{
		/** Refund ID. */
		id?: number | string | null;
		/** Refund reason. */
		reason?: string | number | null;
		/** Refund total, including tax. */
		total?: string | number | null;
		/** Refund total tax. */
		total_tax?: string | number | null;
		[key: string]: unknown;
	}> | null;
	/** Order payment URL. */
	payment_url?: string | number | null;
	/** Define if the order is paid. It will set the status to processing and reduce stock items. */
	set_paid?: boolean | null;
	/** Whether an order can be edited. */
	is_editable?: boolean | null;
	/** Whether an order needs payment, based on status and order total. */
	needs_payment?: boolean | null;
	/** Whether an order needs processing before it can be completed. */
	needs_processing?: boolean | null;
	/** Set the action as manual so that the order note registers as "added by user". */
	manual_update?: boolean | null;
	[key: string]: unknown;
};

export type WoocommerceShopOrderRefund = {
	/** Unique identifier for the resource. */
	id?: number | string | null;
	/** The date the order refund was created, in the site's timezone. */
	date_created?: WoocommerceJsonValue | null;
	/** The date the order refund was created, as GMT. */
	date_created_gmt?: WoocommerceJsonValue | null;
	/** Refund amount. */
	amount?: string | number | null;
	/** Reason for refund. */
	reason?: string | number | null;
	/** User ID of user who created the refund. */
	refunded_by?: number | string | null;
	/** If the payment was refunded via the API. */
	refunded_payment?: boolean | null;
	/** Meta data. */
	meta_data?: Array<{
		/** Meta ID. */
		id?: number | string | null;
		/** Meta key. */
		key?: string | number | null;
		/** Meta value. */
		value?: WoocommerceJsonValue | null;
		[key: string]: unknown;
	}> | null;
	/** Line items data. */
	line_items?: Array<{
		/** Item ID. */
		id?: number | string | null;
		/** Product name. */
		name?: WoocommerceJsonValue | null;
		/** Product ID. */
		product_id?: WoocommerceJsonValue | null;
		/** Variation ID, if applicable. */
		variation_id?: number | string | null;
		/** Quantity ordered. */
		quantity?: number | string | null;
		/** Tax class of product. */
		tax_class?: string | number | null;
		/** Line subtotal (before discounts). */
		subtotal?: string | number | null;
		/** Line subtotal tax (before discounts). */
		subtotal_tax?: string | number | null;
		/** Line total (after discounts). */
		total?: string | number | null;
		/** Line total tax (after discounts). */
		total_tax?: string | number | null;
		/** Line taxes. */
		taxes?: Array<{
			/** Tax rate ID. */
			id?: number | string | null;
			/** Tax total. */
			total?: string | number | null;
			/** Tax subtotal. */
			subtotal?: string | number | null;
			/** Amount that will be refunded for this tax. */
			refund_total?: number | string | null;
			[key: string]: unknown;
		}> | null;
		/** Meta data. */
		meta_data?: Array<{
			/** Meta ID. */
			id?: number | string | null;
			/** Meta key. */
			key?: string | number | null;
			/** Meta value. */
			value?: WoocommerceJsonValue | null;
			[key: string]: unknown;
		}> | null;
		/** Product SKU. */
		sku?: string | number | null;
		/** Product price. */
		price?: number | string | null;
		/** Amount that will be refunded for this line item (excluding taxes). */
		refund_total?: number | string | null;
		[key: string]: unknown;
	}> | null;
	/** Tax lines data. */
	tax_lines?: Array<{
		/** Item ID. */
		id?: number | string | null;
		/** Tax rate code. */
		rate_code?: string | number | null;
		/** Tax rate ID. */
		rate_id?: number | string | null;
		/** Tax rate label. */
		label?: string | number | null;
		/** Show if is a compound tax rate. */
		compound?: boolean | null;
		/** Tax total (not including shipping taxes). */
		tax_total?: string | number | null;
		/** Shipping tax total. */
		shipping_tax_total?: string | number | null;
		/** Meta data. */
		meta_data?: Array<{
			/** Meta ID. */
			id?: number | string | null;
			/** Meta key. */
			key?: string | number | null;
			/** Meta value. */
			value?: WoocommerceJsonValue | null;
			[key: string]: unknown;
		}> | null;
		[key: string]: unknown;
	}> | null;
	/** Shipping lines data. */
	shipping_lines?: Array<{
		/** Item ID. */
		id?: number | string | null;
		/** Shipping method name. */
		method_title?: WoocommerceJsonValue | null;
		/** Shipping method ID. */
		method_id?: WoocommerceJsonValue | null;
		/** Shipping instance ID. */
		instance_id?: string | number | null;
		/** Line total (after discounts). */
		total?: string | number | null;
		/** Line total tax (after discounts). */
		total_tax?: string | number | null;
		/** Line taxes. */
		taxes?: Array<{
			/** Tax rate ID. */
			id?: number | string | null;
			/** Tax total. */
			total?: string | number | null;
			[key: string]: unknown;
		}> | null;
		/** Meta data. */
		meta_data?: Array<{
			/** Meta ID. */
			id?: number | string | null;
			/** Meta key. */
			key?: string | number | null;
			/** Meta value. */
			value?: WoocommerceJsonValue | null;
			[key: string]: unknown;
		}> | null;
		[key: string]: unknown;
	}> | null;
	/** Fee lines data. */
	fee_lines?: Array<{
		/** Item ID. */
		id?: number | string | null;
		/** Fee name. */
		name?: WoocommerceJsonValue | null;
		/** Tax class of fee. */
		tax_class?: string | number | null;
		/** Tax status of fee. */
		tax_status?: string | null;
		/** Line total (after discounts). */
		total?: string | number | null;
		/** Line total tax (after discounts). */
		total_tax?: string | number | null;
		/** Line taxes. */
		taxes?: Array<{
			/** Tax rate ID. */
			id?: number | string | null;
			/** Tax total. */
			total?: string | number | null;
			/** Tax subtotal. */
			subtotal?: string | number | null;
			[key: string]: unknown;
		}> | null;
		/** Meta data. */
		meta_data?: Array<{
			/** Meta ID. */
			id?: number | string | null;
			/** Meta key. */
			key?: string | number | null;
			/** Meta value. */
			value?: WoocommerceJsonValue | null;
			[key: string]: unknown;
		}> | null;
		[key: string]: unknown;
	}> | null;
	/** When true, the payment gateway API is used to generate the refund. */
	api_refund?: boolean | null;
	/** When true, refunded items are restocked. */
	api_restock?: boolean | null;
	/** When true, the server computes per-line refund amounts from quantities using the order's stored prices and taxes, validating the request against the order's refund history. Defaults to false, which preserves the pre-existing behavior of this endpoint. */
	compute_totals?: boolean | null;
	[key: string]: unknown;
};

export type WoocommerceShopOrderRefund2 = {
	/** Unique identifier for the resource. */
	id?: number | string | null;
	/** Parent order ID. */
	parent_id?: number | string | null;
	/** The date the order refund was created, in the site's timezone. */
	date_created?: WoocommerceJsonValue | null;
	/** The date the order refund was created, as GMT. */
	date_created_gmt?: WoocommerceJsonValue | null;
	/** Refund amount. */
	amount?: string | number | null;
	/** Reason for refund. */
	reason?: string | number | null;
	/** User ID of user who created the refund. */
	refunded_by?: number | string | null;
	/** If the payment was refunded via the API. */
	refunded_payment?: boolean | null;
	/** Meta data. */
	meta_data?: Array<{
		/** Meta ID. */
		id?: number | string | null;
		/** Meta key. */
		key?: string | number | null;
		/** Meta value. */
		value?: WoocommerceJsonValue | null;
		[key: string]: unknown;
	}> | null;
	/** Line items data. */
	line_items?: Array<{
		/** Item ID. */
		id?: number | string | null;
		/** Product name. */
		name?: WoocommerceJsonValue | null;
		/** Product ID. */
		product_id?: WoocommerceJsonValue | null;
		/** Variation ID, if applicable. */
		variation_id?: number | string | null;
		/** Quantity ordered. */
		quantity?: number | string | null;
		/** Tax class of product. */
		tax_class?: string | number | null;
		/** Line subtotal (before discounts). */
		subtotal?: string | number | null;
		/** Line subtotal tax (before discounts). */
		subtotal_tax?: string | number | null;
		/** Line total (after discounts). */
		total?: string | number | null;
		/** Line total tax (after discounts). */
		total_tax?: string | number | null;
		/** Line taxes. */
		taxes?: Array<{
			/** Tax rate ID. */
			id?: number | string | null;
			/** Tax total. */
			total?: string | number | null;
			/** Tax subtotal. */
			subtotal?: string | number | null;
			/** Amount that will be refunded for this tax. */
			refund_total?: number | string | null;
			[key: string]: unknown;
		}> | null;
		/** Meta data. */
		meta_data?: Array<{
			/** Meta ID. */
			id?: number | string | null;
			/** Meta key. */
			key?: string | number | null;
			/** Meta value. */
			value?: WoocommerceJsonValue | null;
			[key: string]: unknown;
		}> | null;
		/** Product SKU. */
		sku?: string | number | null;
		/** Product price. */
		price?: number | string | null;
		/** Amount that will be refunded for this line item (excluding taxes). */
		refund_total?: number | string | null;
		[key: string]: unknown;
	}> | null;
	/** Tax lines data. */
	tax_lines?: Array<{
		/** Item ID. */
		id?: number | string | null;
		/** Tax rate code. */
		rate_code?: string | number | null;
		/** Tax rate ID. */
		rate_id?: number | string | null;
		/** Tax rate label. */
		label?: string | number | null;
		/** Show if is a compound tax rate. */
		compound?: boolean | null;
		/** Tax total (not including shipping taxes). */
		tax_total?: string | number | null;
		/** Shipping tax total. */
		shipping_tax_total?: string | number | null;
		/** Meta data. */
		meta_data?: Array<{
			/** Meta ID. */
			id?: number | string | null;
			/** Meta key. */
			key?: string | number | null;
			/** Meta value. */
			value?: WoocommerceJsonValue | null;
			[key: string]: unknown;
		}> | null;
		[key: string]: unknown;
	}> | null;
	/** Shipping lines data. */
	shipping_lines?: Array<{
		/** Item ID. */
		id?: number | string | null;
		/** Shipping method name. */
		method_title?: WoocommerceJsonValue | null;
		/** Shipping method ID. */
		method_id?: WoocommerceJsonValue | null;
		/** Shipping instance ID. */
		instance_id?: string | number | null;
		/** Line total (after discounts). */
		total?: string | number | null;
		/** Line total tax (after discounts). */
		total_tax?: string | number | null;
		/** Line taxes. */
		taxes?: Array<{
			/** Tax rate ID. */
			id?: number | string | null;
			/** Tax total. */
			total?: string | number | null;
			[key: string]: unknown;
		}> | null;
		/** Meta data. */
		meta_data?: Array<{
			/** Meta ID. */
			id?: number | string | null;
			/** Meta key. */
			key?: string | number | null;
			/** Meta value. */
			value?: WoocommerceJsonValue | null;
			[key: string]: unknown;
		}> | null;
		[key: string]: unknown;
	}> | null;
	/** Fee lines data. */
	fee_lines?: Array<{
		/** Item ID. */
		id?: number | string | null;
		/** Fee name. */
		name?: WoocommerceJsonValue | null;
		/** Tax class of fee. */
		tax_class?: string | number | null;
		/** Tax status of fee. */
		tax_status?: string | null;
		/** Line total (after discounts). */
		total?: string | number | null;
		/** Line total tax (after discounts). */
		total_tax?: string | number | null;
		/** Line taxes. */
		taxes?: Array<{
			/** Tax rate ID. */
			id?: number | string | null;
			/** Tax total. */
			total?: string | number | null;
			/** Tax subtotal. */
			subtotal?: string | number | null;
			[key: string]: unknown;
		}> | null;
		/** Meta data. */
		meta_data?: Array<{
			/** Meta ID. */
			id?: number | string | null;
			/** Meta key. */
			key?: string | number | null;
			/** Meta value. */
			value?: WoocommerceJsonValue | null;
			[key: string]: unknown;
		}> | null;
		[key: string]: unknown;
	}> | null;
	/** When true, the payment gateway API is used to generate the refund. */
	api_refund?: boolean | null;
	/** When true, refunded items are restocked. */
	api_restock?: boolean | null;
	/** When true, the server computes per-line refund amounts from quantities using the order's stored prices and taxes, validating the request against the order's refund history. Defaults to false, which preserves the pre-existing behavior of this endpoint. */
	compute_totals?: boolean | null;
	[key: string]: unknown;
};

export type WoocommerceSystemStatus = {
	/** Environment. */
	environment?: {
		/** Home URL. */
		home_url?: string | number | null;
		/** Site URL. */
		site_url?: string | number | null;
		/** WooCommerce Store Identifier. */
		store_id?: string | number | null;
		/** WooCommerce version. */
		version?: string | number | null;
		/** Log directory. */
		log_directory?: string | number | null;
		/** Is log directory writable? */
		log_directory_writable?: boolean | null;
		/** WordPress version. */
		wp_version?: string | number | null;
		/** Is WordPress multisite? */
		wp_multisite?: boolean | null;
		/** WordPress memory limit in bytes, or at least 32G if there is no memory limit. */
		wp_memory_limit?: number | string | null;
		/** Is WordPress debug mode active? */
		wp_debug_mode?: boolean | null;
		/** Are WordPress cron jobs enabled? */
		wp_cron?: boolean | null;
		/** The WordPress environment type. */
		wp_environment_type?: string | number | null;
		/** WordPress language. */
		language?: string | number | null;
		/** Server info. */
		server_info?: string | number | null;
		/** Server architecture. */
		server_architecture?: string | number | null;
		/** PHP version. */
		php_version?: string | number | null;
		/** PHP post max size. */
		php_post_max_size?: number | string | null;
		/** PHP max execution time. */
		php_max_execution_time?: number | string | null;
		/** PHP max input vars. */
		php_max_input_vars?: number | string | null;
		/** cURL version. */
		curl_version?: string | number | null;
		/** Is SUHOSIN installed? */
		suhosin_installed?: boolean | null;
		/** Max upload size. */
		max_upload_size?: number | string | null;
		/** MySQL version. */
		mysql_version?: string | number | null;
		/** MySQL version string. */
		mysql_version_string?: string | number | null;
		/** Default timezone. */
		default_timezone?: string | number | null;
		/** Is fsockopen/cURL enabled? */
		fsockopen_or_curl_enabled?: boolean | null;
		/** Is SoapClient class enabled? */
		soapclient_enabled?: boolean | null;
		/** Is DomDocument class enabled? */
		domdocument_enabled?: boolean | null;
		/** Is GZip enabled? */
		gzip_enabled?: boolean | null;
		/** Is mbstring enabled? */
		mbstring_enabled?: boolean | null;
		/** Remote POST successful? */
		remote_post_successful?: boolean | null;
		/** Remote POST response. */
		remote_post_response?: string | number | null;
		/** Remote GET successful? */
		remote_get_successful?: boolean | null;
		/** Remote GET response. */
		remote_get_response?: string | number | null;
		[key: string]: unknown;
	} | null;
	/** Database. */
	database?: {
		/** WC database version. */
		wc_database_version?: string | number | null;
		/** Database prefix. */
		database_prefix?: string | number | null;
		/** MaxMind GeoIP database. */
		maxmind_geoip_database?: string | number | null;
		/** WooCommerce and other tables with their data and index sizes. */
		database_tables?: Record<string, WoocommerceJsonValue> | null;
		[key: string]: unknown;
	} | null;
	/** Active plugins. */
	active_plugins?: Array<{
		/** Plugin basename. The path to the main plugin file relative to the plugins directory. */
		plugin?: string | number | null;
		/** Name of the plugin. */
		name?: string | number | null;
		/** Current plugin version. */
		version?: string | number | null;
		/** Latest available plugin version. */
		version_latest?: string | number | null;
		/** Plugin URL. */
		url?: string | number | null;
		/** Plugin author name. */
		author_name?: string | number | null;
		/** Plugin author URL. */
		author_url?: string | number | null;
		/** Whether the plugin can only be activated network-wide. */
		network_activated?: boolean | null;
		[key: string]: unknown;
	}> | null;
	/** Inactive plugins. */
	inactive_plugins?: Array<{
		/** Plugin basename. The path to the main plugin file relative to the plugins directory. */
		plugin?: string | number | null;
		/** Name of the plugin. */
		name?: string | number | null;
		/** Current plugin version. */
		version?: string | number | null;
		/** Latest available plugin version. */
		version_latest?: string | number | null;
		/** Plugin URL. */
		url?: string | number | null;
		/** Plugin author name. */
		author_name?: string | number | null;
		/** Plugin author URL. */
		author_url?: string | number | null;
		/** Whether the plugin can only be activated network-wide. */
		network_activated?: boolean | null;
		[key: string]: unknown;
	}> | null;
	/** Drop-ins and must-use plugins. */
	dropins_mu_plugins?: Record<string, WoocommerceJsonValue> | null;
	/** Theme. */
	theme?: {
		/** Theme name. */
		name?: string | number | null;
		/** Theme version. */
		version?: string | number | null;
		/** Latest version of theme. */
		version_latest?: string | number | null;
		/** Theme author URL. */
		author_url?: string | number | null;
		/** Is this theme a child theme? */
		is_child_theme?: boolean | null;
		/** Is this theme a block theme? */
		is_block_theme?: boolean | null;
		/** Does the theme declare WooCommerce support? */
		has_woocommerce_support?: boolean | null;
		/** Does the theme have a woocommerce.php file? */
		has_woocommerce_file?: boolean | null;
		/** Does this theme have outdated templates? */
		has_outdated_templates?: boolean | null;
		/** Template overrides. */
		overrides?: Array<string | number> | null;
		/** Parent theme name. */
		parent_name?: string | number | null;
		/** Parent theme version. */
		parent_version?: string | number | null;
		/** Parent theme author URL. */
		parent_author_url?: string | number | null;
		[key: string]: unknown;
	} | null;
	/** Settings. */
	settings?: {
		/** Legacy REST API enabled? */
		api_enabled?: boolean | null;
		/** SSL forced? */
		force_ssl?: boolean | null;
		/** Currency. */
		currency?: string | number | null;
		/** Currency symbol. */
		currency_symbol?: string | number | null;
		/** Currency position. */
		currency_position?: string | number | null;
		/** Thousand separator. */
		thousand_separator?: string | number | null;
		/** Decimal separator. */
		decimal_separator?: string | number | null;
		/** Number of decimals. */
		number_of_decimals?: number | string | null;
		/** Geolocation enabled? */
		geolocation_enabled?: boolean | null;
		/** Are tax rates and calculations enabled? */
		taxes_enabled?: boolean | null;
		/** Are prices treated as including tax? */
		prices_include_tax?: boolean | null;
		/** Address type used to calculate tax. */
		tax_based_on?: string | number | null;
		/** Tax class used for shipping. */
		shipping_tax_class?: string | number | null;
		/** Is tax rounded at subtotal level? */
		tax_round_at_subtotal?: boolean | null;
		/** Additional tax classes. */
		additional_tax_classes?: Array<string | number> | null;
		/** How prices are displayed in the shop. */
		tax_display_shop?: string | number | null;
		/** How prices are displayed during cart and checkout. */
		tax_display_cart?: string | number | null;
		/** Price display suffix. */
		price_display_suffix?: string | number | null;
		/** How tax totals are displayed. */
		tax_total_display?: string | number | null;
		/** Number of configured tax rates. */
		tax_rate_count?: number | string | null;
		/** Store base country. */
		store_base_country?: string | number | null;
		/** Store base state. */
		store_base_state?: string | number | null;
		/** Default customer location. */
		default_customer_location?: string | number | null;
		/** Product type term names by slug. */
		taxonomies?: Record<string, WoocommerceJsonValue> | null;
		/** Product visibility term ids by slug. */
		product_visibility_terms?: Record<string, WoocommerceJsonValue> | null;
		/** Is store connected to WooCommerce.com? */
		wccom_connected?: string | number | null;
		/** Enforce approved download directories? */
		enforce_approved_download_dirs?: boolean | null;
		/** Is HPOS enabled? */
		HPOS_enabled?: boolean | null;
		/** Order datastore. */
		order_datastore?: string | number | null;
		/** Is HPOS sync enabled? */
		HPOS_sync_enabled?: boolean | null;
		/** Enabled features. */
		enabled_features?: Array<WoocommerceJsonValue> | null;
		[key: string]: unknown;
	} | null;
	/** Security. */
	security?: {
		/** Is the connection to your store secure? */
		secure_connection?: boolean | null;
		/** Hide errors from visitors? */
		hide_errors?: boolean | null;
		[key: string]: unknown;
	} | null;
	/** WooCommerce pages. */
	pages?: Array<{
		page_name?: string | number | null;
		page_id?: string | number | null;
		page_set?: boolean | null;
		page_exists?: boolean | null;
		page_visible?: boolean | null;
		shortcode?: string | number | null;
		block?: string | number | null;
		shortcode_required?: boolean | null;
		shortcode_present?: boolean | null;
		block_present?: boolean | null;
		block_required?: boolean | null;
		[key: string]: unknown;
	}> | null;
	/** Post counts per type. */
	post_type_counts?: Array<{
		type?: string | number | null;
		count?: number | string | null;
		[key: string]: unknown;
	}> | null;
	/** Logging. */
	logging?: {
		/** Is logging enabled? */
		logging_enabled?: boolean | null;
		/** The logging handler class. */
		default_handler?: string | number | null;
		/** The number of days log entries are retained. */
		retention_period_days?: number | string | null;
		/** Minimum severity level. */
		level_threshold?: string | number | null;
		/** The size of the log directory. */
		log_directory_size?: string | number | null;
		[key: string]: unknown;
	} | null;
	[key: string]: unknown;
};

export type WoocommerceSystemStatusTool = {
	/** A unique identifier for the tool. */
	id?: string | number | null;
	/** Tool name. */
	name?: string | number | null;
	/** What running the tool will do. */
	action?: string | number | null;
	/** Tool description. */
	description?: string | number | null;
	/** Did the tool run successfully? */
	success?: boolean | null;
	/** Tool return message. */
	message?: string | number | null;
	[key: string]: unknown;
};

export type WoocommerceTax = {
	/** Unique identifier for the resource. */
	id?: number | string | null;
	/** Country ISO 3166 code. */
	country?: string | number | null;
	/** State code. */
	state?: string | number | null;
	/** Postcode/ZIP, it doesn't support multiple values. Deprecated as of WooCommerce 5.3, 'postcodes' should be used instead. */
	postcode?: string | number | null;
	/** City name, it doesn't support multiple values. Deprecated as of WooCommerce 5.3, 'cities' should be used instead. */
	city?: string | number | null;
	/** Tax rate. */
	rate?: string | number | null;
	/** Tax rate name. */
	name?: string | number | null;
	/** Tax priority. */
	priority?: number | string | null;
	/** Whether or not this is a compound rate. */
	compound?: boolean | null;
	/** Whether or not this tax rate also gets applied to shipping. */
	shipping?: boolean | null;
	/** Indicates the order that will appear in queries. */
	order?: number | string | null;
	/** Tax class. */
	class?: string | null;
	/** List of postcodes / ZIPs. Introduced in WooCommerce 5.3. */
	postcodes?: Array<string | number> | null;
	/** List of city names. Introduced in WooCommerce 5.3. */
	cities?: Array<string | number> | null;
	[key: string]: unknown;
};

export type WoocommerceTaxClass = {
	/** Unique identifier for the resource. */
	slug?: string | number | null;
	/** Tax class name. */
	name?: string | number | null;
	[key: string]: unknown;
};

export type WoocommerceTopSellersReport = {
	/** Product name. */
	name?: string | number | null;
	/** Product ID. */
	product_id?: number | string | null;
	/** Total number of purchases. */
	quantity?: number | string | null;
	[key: string]: unknown;
};

export type WoocommerceWebhook = {
	/** Unique identifier for the resource. */
	id?: number | string | null;
	/** A friendly name for the webhook. */
	name?: string | number | null;
	/** Webhook status. */
	status?: string | null;
	/** Webhook topic. */
	topic?: string | number | null;
	/** Webhook resource. */
	resource?: string | number | null;
	/** Webhook event. */
	event?: string | number | null;
	/** WooCommerce action names associated with the webhook. */
	hooks?: Array<string | number> | null;
	/** The URL where the webhook payload is delivered. */
	delivery_url?: string | number | null;
	/** Secret key used to generate a hash of the delivered webhook and provided in the request headers. This will default to a MD5 hash from the current user's ID|username if not provided. */
	secret?: string | number | null;
	/** The date the webhook was created, in the site's timezone. */
	date_created?: WoocommerceJsonValue | null;
	/** The date the webhook was created, as GMT. */
	date_created_gmt?: WoocommerceJsonValue | null;
	/** The date the webhook was last modified, in the site's timezone. */
	date_modified?: WoocommerceJsonValue | null;
	/** The date the webhook was last modified, as GMT. */
	date_modified_gmt?: WoocommerceJsonValue | null;
	[key: string]: unknown;
};

export type WoocommerceWebhookPayloads = {
	action: {
		/** The hook that fired. */
		action?: string | number | null;
		/** The first argument the hook was called with. */
		arg?: WoocommerceJsonValue | null;
		[key: string]: unknown;
	};
	coupon: WoocommerceShopCoupon;
	customer: WoocommerceCustomer;
	order: WoocommerceShopOrder;
	product: WoocommerceProduct;
};

export type WoocommerceOperationInputs = {
	'coupons.batch': {
		/** Records to create, each with the same fields as the create operation. */
		create?: Array<Record<string, WoocommerceJsonValue>>;
		/** Records to update, each with its `id` (settings: `id` and `value`) and the fields to change. */
		update?: Array<Record<string, WoocommerceJsonValue>>;
		/** Ids of records to delete (permanently). */
		delete?: Array<number>;
	};
	'coupons.create': {
		/** Coupon code. */
		code: string;
		/** The amount of discount. Should always be numeric, even if setting a percentage. */
		amount?: number | string;
		/** The status of the coupon. Should always be draft, published, or pending review */
		status?: string;
		/** Determines the type of discount that will be applied. */
		discount_type?: 'percent' | 'fixed_cart' | 'fixed_product';
		/** Coupon description. */
		description?: string;
		/** The date the coupon expires, in the site's timezone. */
		date_expires?: string | null;
		/** The date the coupon expires, as GMT. */
		date_expires_gmt?: string | null;
		/** If true, the coupon can only be used individually. Other applied coupons will be removed from the cart. */
		individual_use?: boolean;
		/** List of product IDs the coupon can be used on. */
		product_ids?: Array<number>;
		/** List of product IDs the coupon cannot be used on. */
		excluded_product_ids?: Array<number>;
		/** How many times the coupon can be used in total. */
		usage_limit?: number;
		/** How many times the coupon can be used per customer. */
		usage_limit_per_user?: number;
		/** Max number of items in the cart the coupon can be applied to. */
		limit_usage_to_x_items?: number;
		/** If true and if the free shipping method requires a coupon, this coupon will enable free shipping. */
		free_shipping?: boolean;
		/** List of category IDs the coupon applies to. */
		product_categories?: Array<number>;
		/** List of category IDs the coupon does not apply to. */
		excluded_product_categories?: Array<number>;
		/** If true, this coupon will not be applied to items that have sale prices. */
		exclude_sale_items?: boolean;
		/** Minimum order amount that needs to be in the cart before coupon applies. */
		minimum_amount?: number | string;
		/** Maximum order amount allowed when using the coupon. */
		maximum_amount?: number | string;
		/** List of email addresses that can use this coupon. */
		email_restrictions?: Array<string>;
		/** Meta data. */
		meta_data?: Array<{
			/** Meta key. */
			key?: string;
			/** Meta value. */
			value?: WoocommerceJsonValue;
		}>;
	};
	'coupons.delete': {
		/** Unique identifier for the resource. */
		id: number;
		/** Whether to bypass trash and force deletion. */
		force?: boolean;
	};
	'coupons.get': {
		/** Unique identifier for the resource. */
		id: number;
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'edit';
	};
	'coupons.list': {
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'edit';
		/** Current page of the collection. */
		page?: number;
		/** Maximum number of items to be returned in result set. */
		per_page?: number;
		/** Limit results to those matching a string. */
		search?: string;
		/** Limit response to resources published after a given ISO8601 compliant date. */
		after?: string;
		/** Limit response to resources published before a given ISO8601 compliant date. */
		before?: string;
		/** Limit response to resources modified after a given ISO8601 compliant date. */
		modified_after?: string;
		/** Limit response to resources modified before a given ISO8601 compliant date. */
		modified_before?: string;
		/** Whether to consider GMT post dates when limiting response by published or modified date. */
		dates_are_gmt?: boolean;
		/** Ensure result set excludes specific IDs. */
		exclude?: Array<number>;
		/** Limit result set to specific ids. */
		include?: Array<number>;
		/** Offset the result set by a specific number of items. */
		offset?: number;
		/** Order sort attribute ascending or descending. */
		order?: 'asc' | 'desc';
		/** Sort collection by object attribute. */
		orderby?: 'date' | 'id' | 'include' | 'title' | 'slug' | 'modified';
		/** Limit result set to resources with a specific code. */
		code?: string;
	};
	'coupons.update': {
		/** Unique identifier for the resource. */
		id: number;
		/** Coupon code. */
		code?: string;
		/** The amount of discount. Should always be numeric, even if setting a percentage. */
		amount?: number | string;
		/** The status of the coupon. Should always be draft, published, or pending review */
		status?: string;
		/** Determines the type of discount that will be applied. */
		discount_type?: 'percent' | 'fixed_cart' | 'fixed_product';
		/** Coupon description. */
		description?: string;
		/** The date the coupon expires, in the site's timezone. */
		date_expires?: string | null;
		/** The date the coupon expires, as GMT. */
		date_expires_gmt?: string | null;
		/** If true, the coupon can only be used individually. Other applied coupons will be removed from the cart. */
		individual_use?: boolean;
		/** List of product IDs the coupon can be used on. */
		product_ids?: Array<number>;
		/** List of product IDs the coupon cannot be used on. */
		excluded_product_ids?: Array<number>;
		/** How many times the coupon can be used in total. */
		usage_limit?: number;
		/** How many times the coupon can be used per customer. */
		usage_limit_per_user?: number;
		/** Max number of items in the cart the coupon can be applied to. */
		limit_usage_to_x_items?: number;
		/** If true and if the free shipping method requires a coupon, this coupon will enable free shipping. */
		free_shipping?: boolean;
		/** List of category IDs the coupon applies to. */
		product_categories?: Array<number>;
		/** List of category IDs the coupon does not apply to. */
		excluded_product_categories?: Array<number>;
		/** If true, this coupon will not be applied to items that have sale prices. */
		exclude_sale_items?: boolean;
		/** Minimum order amount that needs to be in the cart before coupon applies. */
		minimum_amount?: number | string;
		/** Maximum order amount allowed when using the coupon. */
		maximum_amount?: number | string;
		/** List of email addresses that can use this coupon. */
		email_restrictions?: Array<string>;
		/** Meta data. */
		meta_data?: Array<{
			/** Meta key. */
			key?: string;
			/** Meta value. */
			value?: WoocommerceJsonValue;
		}>;
	};
	'customers.batch': {
		/** Records to create, each with the same fields as the create operation. */
		create?: Array<Record<string, WoocommerceJsonValue>>;
		/** Records to update, each with its `id` (settings: `id` and `value`) and the fields to change. */
		update?: Array<Record<string, WoocommerceJsonValue>>;
		/** Ids of records to delete (permanently). */
		delete?: Array<number>;
	};
	'customers.create': {
		/** New user email address. */
		email: string;
		/** Customer first name. */
		first_name?: string;
		/** Customer last name. */
		last_name?: string;
		/** New user username. */
		username?: string;
		/** New user password. */
		password?: string;
		/** List of billing address data. */
		billing?: {
			/** First name. */
			first_name?: string;
			/** Last name. */
			last_name?: string;
			/** Company name. */
			company?: string;
			/** Address line 1 */
			address_1?: string;
			/** Address line 2 */
			address_2?: string;
			/** City name. */
			city?: string;
			/** ISO code or name of the state, province or district. */
			state?: string;
			/** Postal code. */
			postcode?: string;
			/** ISO code of the country. */
			country?: string;
			/** Email address. */
			email?: string;
			/** Phone number. */
			phone?: string;
		};
		/** List of shipping address data. */
		shipping?: {
			/** First name. */
			first_name?: string;
			/** Last name. */
			last_name?: string;
			/** Company name. */
			company?: string;
			/** Address line 1 */
			address_1?: string;
			/** Address line 2 */
			address_2?: string;
			/** City name. */
			city?: string;
			/** ISO code or name of the state, province or district. */
			state?: string;
			/** Postal code. */
			postcode?: string;
			/** ISO code of the country. */
			country?: string;
			/** Phone number. */
			phone?: string;
		};
		/** Meta data. */
		meta_data?: Array<{
			/** Meta key. */
			key?: string;
			/** Meta value. */
			value?: WoocommerceJsonValue;
		}>;
	};
	'customers.delete': {
		/** Unique identifier for the resource. */
		id: number;
		/** Required to be true, as resource does not support trashing. */
		force?: boolean;
		/** ID to reassign posts to. */
		reassign?: number;
	};
	'customers.downloads': {
		/** Unique identifier for the resource. */
		customer_id: number;
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view';
	};
	'customers.get': {
		/** Unique identifier for the resource. */
		id: number;
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'edit';
	};
	'customers.list': {
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'edit';
		/** Current page of the collection. */
		page?: number;
		/** Maximum number of items to be returned in result set. */
		per_page?: number;
		/** Limit results to those matching a string. */
		search?: string;
		/** Ensure result set excludes specific IDs. */
		exclude?: Array<number>;
		/** Limit result set to specific IDs. */
		include?: Array<number>;
		/** Offset the result set by a specific number of items. */
		offset?: number;
		/** Order sort attribute ascending or descending. */
		order?: 'asc' | 'desc';
		/** Sort collection by object attribute. */
		orderby?: 'id' | 'include' | 'name' | 'registered_date';
		/** Limit result set to resources with a specific email. */
		email?: string;
		/** Limit result set to resources with a specific role. */
		role?:
			| 'all'
			| 'administrator'
			| 'editor'
			| 'author'
			| 'contributor'
			| 'subscriber'
			| 'customer'
			| 'shop_manager';
	};
	'customers.update': {
		/** Unique identifier for the resource. */
		id: number;
		/** The email address for the customer. */
		email?: string;
		/** Customer first name. */
		first_name?: string;
		/** Customer last name. */
		last_name?: string;
		/** Customer login name. */
		username?: string;
		/** Customer password. */
		password?: string;
		/** List of billing address data. */
		billing?: {
			/** First name. */
			first_name?: string;
			/** Last name. */
			last_name?: string;
			/** Company name. */
			company?: string;
			/** Address line 1 */
			address_1?: string;
			/** Address line 2 */
			address_2?: string;
			/** City name. */
			city?: string;
			/** ISO code or name of the state, province or district. */
			state?: string;
			/** Postal code. */
			postcode?: string;
			/** ISO code of the country. */
			country?: string;
			/** Email address. */
			email?: string;
			/** Phone number. */
			phone?: string;
		};
		/** List of shipping address data. */
		shipping?: {
			/** First name. */
			first_name?: string;
			/** Last name. */
			last_name?: string;
			/** Company name. */
			company?: string;
			/** Address line 1 */
			address_1?: string;
			/** Address line 2 */
			address_2?: string;
			/** City name. */
			city?: string;
			/** ISO code or name of the state, province or district. */
			state?: string;
			/** Postal code. */
			postcode?: string;
			/** ISO code of the country. */
			country?: string;
			/** Phone number. */
			phone?: string;
		};
		/** Meta data. */
		meta_data?: Array<{
			/** Meta key. */
			key?: string;
			/** Meta value. */
			value?: WoocommerceJsonValue;
		}>;
	};
	'data.continents.get': {
		/** A continent code (`EU`) or country code (`US`). */
		location: string;
		/** 2 character continent code. */
		continent?: string;
	};
	'data.continents.list': Record<string, never>;
	'data.countries.get': {
		/** ISO3166 alpha-2 country code. */
		location: string;
	};
	'data.countries.list': Record<string, never>;
	'data.currencies.current': Record<string, never>;
	'data.currencies.get': {
		/** ISO currency code (`USD`). */
		currency: string;
		/** ISO4217 currency code. */
		location?: string;
	};
	'data.currencies.list': Record<string, never>;
	'data.index': Record<string, never>;
	'orders.batch': {
		/** Records to create, each with the same fields as the create operation. */
		create?: Array<Record<string, WoocommerceJsonValue>>;
		/** Records to update, each with its `id` (settings: `id` and `value`) and the fields to change. */
		update?: Array<Record<string, WoocommerceJsonValue>>;
		/** Ids of records to delete (permanently). */
		delete?: Array<number>;
	};
	'orders.create': {
		/** Parent order ID. */
		parent_id?: number;
		/** Shows where the order was created. */
		created_via?: string;
		/** Order status. */
		status?:
			| 'auto-draft'
			| 'pending'
			| 'processing'
			| 'on-hold'
			| 'completed'
			| 'cancelled'
			| 'refunded'
			| 'failed'
			| 'checkout-draft';
		/** Currency the order was created with, in ISO format. */
		currency?:
			| 'AED'
			| 'AFN'
			| 'ALL'
			| 'AMD'
			| 'ANG'
			| 'AOA'
			| 'ARS'
			| 'AUD'
			| 'AWG'
			| 'AZN'
			| 'BAM'
			| 'BBD'
			| 'BDT'
			| 'BGN'
			| 'BHD'
			| 'BIF'
			| 'BMD'
			| 'BND'
			| 'BOB'
			| 'BRL'
			| 'BSD'
			| 'BTC'
			| 'BTN'
			| 'BWP'
			| 'BYR'
			| 'BYN'
			| 'BZD'
			| 'CAD'
			| 'CDF'
			| 'CHF'
			| 'CHW'
			| 'CLP'
			| 'CNY'
			| 'COP'
			| 'CRC'
			| 'CUC'
			| 'CUP'
			| 'CVE'
			| 'CZK'
			| 'DJF'
			| 'DKK'
			| 'DOP'
			| 'DZD'
			| 'EGP'
			| 'ERN'
			| 'ETB'
			| 'EUR'
			| 'FJD'
			| 'FKP'
			| 'GBP'
			| 'GEL'
			| 'GGP'
			| 'GHS'
			| 'GIP'
			| 'GMD'
			| 'GNF'
			| 'GTQ'
			| 'GYD'
			| 'HKD'
			| 'HNL'
			| 'HRK'
			| 'HTG'
			| 'HUF'
			| 'IDR'
			| 'ILS'
			| 'IMP'
			| 'INR'
			| 'IQD'
			| 'IRR'
			| 'IRT'
			| 'ISK'
			| 'JEP'
			| 'JMD'
			| 'JOD'
			| 'JPY'
			| 'KES'
			| 'KGS'
			| 'KHR'
			| 'KMF'
			| 'KPW'
			| 'KRW'
			| 'KWD'
			| 'KYD'
			| 'KZT'
			| 'LAK'
			| 'LBP'
			| 'LKR'
			| 'LRD'
			| 'LSL'
			| 'LYD'
			| 'MAD'
			| 'MDL'
			| 'MGA'
			| 'MKD'
			| 'MMK'
			| 'MNT'
			| 'MOP'
			| 'MRU'
			| 'MUR'
			| 'MVR'
			| 'MWK'
			| 'MXN'
			| 'MYR'
			| 'MZN'
			| 'NAD'
			| 'NGN'
			| 'NIO'
			| 'NOK'
			| 'NPR'
			| 'NZD'
			| 'OMR'
			| 'PAB'
			| 'PEN'
			| 'PGK'
			| 'PHP'
			| 'PKR'
			| 'PLN'
			| 'PRB'
			| 'PYG'
			| 'QAR'
			| 'RON'
			| 'RSD'
			| 'RUB'
			| 'RWF'
			| 'SAR'
			| 'SBD'
			| 'SCR'
			| 'SDG'
			| 'SEK'
			| 'SGD'
			| 'SHP'
			| 'SLL'
			| 'SOS'
			| 'SRD'
			| 'SSP'
			| 'STN'
			| 'SYP'
			| 'SZL'
			| 'THB'
			| 'TJS'
			| 'TMT'
			| 'TND'
			| 'TOP'
			| 'TRY'
			| 'TTD'
			| 'TWD'
			| 'TZS'
			| 'UAH'
			| 'UGX'
			| 'USD'
			| 'UYU'
			| 'UZS'
			| 'VEF'
			| 'VES'
			| 'VND'
			| 'VUV'
			| 'WST'
			| 'XAF'
			| 'XCD'
			| 'XOF'
			| 'XPF'
			| 'YER'
			| 'ZAR'
			| 'ZMW';
		/** User ID who owns the order. 0 for guests. */
		customer_id?: number;
		/** Note left by customer during checkout. */
		customer_note?: string;
		/** Billing address. */
		billing?: {
			/** First name. */
			first_name?: string;
			/** Last name. */
			last_name?: string;
			/** Company name. */
			company?: string;
			/** Address line 1 */
			address_1?: string;
			/** Address line 2 */
			address_2?: string;
			/** City name. */
			city?: string;
			/** ISO code or name of the state, province or district. */
			state?: string;
			/** Postal code. */
			postcode?: string;
			/** Country code in ISO 3166-1 alpha-2 format. */
			country?: string;
			/** Email address. */
			email?: string | null;
			/** Phone number. */
			phone?: string;
		};
		/** Shipping address. */
		shipping?: {
			/** First name. */
			first_name?: string;
			/** Last name. */
			last_name?: string;
			/** Company name. */
			company?: string;
			/** Address line 1 */
			address_1?: string;
			/** Address line 2 */
			address_2?: string;
			/** City name. */
			city?: string;
			/** ISO code or name of the state, province or district. */
			state?: string;
			/** Postal code. */
			postcode?: string;
			/** Country code in ISO 3166-1 alpha-2 format. */
			country?: string;
		};
		/** Payment method ID. */
		payment_method?: string;
		/** Payment method title. */
		payment_method_title?: string;
		/** Unique transaction ID. */
		transaction_id?: string;
		/** Meta data. */
		meta_data?: Array<{
			/** Meta key. */
			key?: string;
			/** Meta value. */
			value?: WoocommerceJsonValue;
		}>;
		/** Line items data. */
		line_items?: Array<{
			/** Product name. */
			name?: WoocommerceJsonValue;
			/** Parent product name if the product is a variation. */
			parent_name?: string | null;
			/** Product ID. */
			product_id?: WoocommerceJsonValue;
			/** Variation ID, if applicable. */
			variation_id?: number;
			/** Quantity ordered. */
			quantity?: number;
			/** Tax class of product. */
			tax_class?: string;
			/** Line subtotal, excluding tax (before discounts). */
			subtotal?: string;
			/** Line total, excluding tax (after discounts). */
			total?: string;
			/** Meta data. */
			meta_data?: Array<{
				/** Meta key. */
				key?: string;
				/** Meta value. */
				value?: WoocommerceJsonValue;
			}>;
		}>;
		/** Shipping lines data. */
		shipping_lines?: Array<{
			/** Shipping method name. */
			method_title?: WoocommerceJsonValue;
			/** Shipping method ID. */
			method_id?: WoocommerceJsonValue;
			/** Shipping instance ID. */
			instance_id?: string;
			/** Shipping total, excluding tax. */
			total?: string;
			/** Meta data. */
			meta_data?: Array<{
				/** Meta key. */
				key?: string;
				/** Meta value. */
				value?: WoocommerceJsonValue;
			}>;
		}>;
		/** Fee lines data. */
		fee_lines?: Array<{
			/** Fee name. */
			name?: WoocommerceJsonValue;
			/** Tax class of fee. */
			tax_class?: string;
			/** Tax status of fee. */
			tax_status?: 'taxable' | 'none';
			/** Fee total, excluding tax. */
			total?: string;
			/** Meta data. */
			meta_data?: Array<{
				/** Meta key. */
				key?: string;
				/** Meta value. */
				value?: WoocommerceJsonValue;
			}>;
		}>;
		/** Coupons line data. */
		coupon_lines?: Array<{
			/** Coupon code. */
			code?: WoocommerceJsonValue;
			/** Meta data. */
			meta_data?: Array<{
				/** Meta key. */
				key?: string;
				/** Meta value. */
				value?: WoocommerceJsonValue;
			}>;
		}>;
		/** Define if the order is paid. It will set the status to processing and reduce stock items. */
		set_paid?: boolean;
		/** Set the action as manual so that the order note registers as "added by user". */
		manual_update?: boolean;
	};
	'orders.delete': {
		/** Unique identifier for the resource. */
		id: number;
		/** Whether to bypass trash and force deletion. */
		force?: boolean;
	};
	'orders.emailTemplates': {
		/** Unique identifier of the order. */
		id: number;
	};
	'orders.get': {
		/** Unique identifier for the resource. */
		id: number;
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'edit';
	};
	'orders.list': {
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'edit';
		/** Current page of the collection. */
		page?: number;
		/** Maximum number of items to be returned in result set. */
		per_page?: number;
		/** Limit results to those matching a string. */
		search?: string;
		/** Limit response to resources published after a given ISO8601 compliant date. */
		after?: string;
		/** Limit response to resources published before a given ISO8601 compliant date. */
		before?: string;
		/** Limit response to resources modified after a given ISO8601 compliant date. */
		modified_after?: string;
		/** Limit response to resources modified before a given ISO8601 compliant date. */
		modified_before?: string;
		/** Whether to consider GMT post dates when limiting response by published or modified date. */
		dates_are_gmt?: boolean;
		/** Ensure result set excludes specific IDs. */
		exclude?: Array<number>;
		/** Limit result set to specific ids. */
		include?: Array<number>;
		/** Offset the result set by a specific number of items. */
		offset?: number;
		/** Order sort attribute ascending or descending. */
		order?: 'asc' | 'desc';
		/** Sort collection by object attribute. */
		orderby?: 'date' | 'id' | 'include' | 'title' | 'slug' | 'modified';
		/** Limit result set to those of particular parent IDs. */
		parent?: Array<number>;
		/** Limit result set to all items except those of a particular parent ID. */
		parent_exclude?: Array<number>;
		/** Limit result set to orders which have specific statuses. */
		status?: Array<
			| 'any'
			| 'trash'
			| 'auto-draft'
			| 'pending'
			| 'processing'
			| 'on-hold'
			| 'completed'
			| 'cancelled'
			| 'refunded'
			| 'failed'
			| 'checkout-draft'
		>;
		/** Limit result set to orders assigned a specific customer. */
		customer?: number;
		/** Limit result set to orders assigned a specific product. */
		product?: number;
		/** Number of decimal points to use in each resource. */
		dp?: number;
		/** Only show meta which is meant to be displayed for an order. */
		order_item_display_meta?: boolean;
		/** Limit meta_data to specific keys. */
		include_meta?: Array<string>;
		/** Ensure meta_data excludes specific keys. */
		exclude_meta?: Array<string>;
		/** Limit result set to orders created via specific sources (e.g. checkout, admin). */
		created_via?: Array<string>;
	};
	'orders.notes.create': {
		/** The order ID. */
		order_id: number;
		/** Order note content. */
		note: string;
		/** If true, the note will be shown to customers and they will be notified. If false, the note will be for admin reference only. */
		customer_note?: boolean;
		/** If true, this note will be attributed to the current user. If false, the note will be attributed to the system. */
		added_by_user?: boolean;
	};
	'orders.notes.delete': {
		/** The order ID. */
		order_id: number;
		/** Unique identifier for the resource. */
		id: number;
		/** Required to be true, as resource does not support trashing. */
		force?: boolean;
	};
	'orders.notes.get': {
		/** The order ID. */
		order_id: number;
		/** Unique identifier for the resource. */
		id: number;
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'edit';
	};
	'orders.notes.list': {
		/** The order ID. */
		order_id: number;
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'edit';
		/** Limit result to customers or internal notes. */
		type?: 'any' | 'customer' | 'internal';
	};
	'orders.receipt.create': {
		/** Unique identifier of the order. */
		id: number;
		/** Expiration date formatted as yyyy-mm-dd. */
		expiration_date?: string;
		/** Number of days to be added to the current date to get the expiration date. */
		expiration_days?: number;
		/** True to force the creation of a new receipt even if one already exists and has not expired yet. */
		force_new?: boolean;
	};
	'orders.receipt.get': {
		/** Unique identifier of the order. */
		id: number;
	};
	'orders.refunds.create': {
		/** The order ID. */
		order_id: number;
		/** Refund amount. */
		amount?: string;
		/** Reason for refund. */
		reason?: string;
		/** User ID of user who created the refund. */
		refunded_by?: number;
		/** Meta data. */
		meta_data?: Array<{
			/** Meta key. */
			key?: string;
			/** Meta value. */
			value?: WoocommerceJsonValue;
		}>;
		/** Shipping lines data. */
		shipping_lines?: Array<{
			/** Shipping method name. */
			method_title?: WoocommerceJsonValue;
			/** Shipping method ID. */
			method_id?: WoocommerceJsonValue;
			/** Shipping instance ID. */
			instance_id?: string;
			/** Line total (after discounts). */
			total?: string;
			/** Meta data. */
			meta_data?: Array<{
				/** Meta key. */
				key?: string;
				/** Meta value. */
				value?: WoocommerceJsonValue;
			}>;
		}>;
		/** Fee lines data. */
		fee_lines?: Array<{
			/** Fee name. */
			name?: WoocommerceJsonValue;
			/** Tax class of fee. */
			tax_class?: string;
			/** Tax status of fee. */
			tax_status?: 'taxable' | 'none';
			/** Line total (after discounts). */
			total?: string;
			/** Meta data. */
			meta_data?: Array<{
				/** Meta key. */
				key?: string;
				/** Meta value. */
				value?: WoocommerceJsonValue;
			}>;
		}>;
		/** When true, the payment gateway API is used to generate the refund. */
		api_refund?: boolean;
		/** When true, refunded items are restocked. */
		api_restock?: boolean;
		/** When true, the server computes per-line refund amounts from quantities using the order's stored prices and taxes, validating the request against the order's refund history. Defaults to false, which preserves the pre-existing behavior of this endpoint. */
		compute_totals?: boolean;
	};
	'orders.refunds.delete': {
		/** The order ID. */
		order_id: number;
		/** Unique identifier for the resource. */
		id: number;
		/** Required to be true, as resource does not support trashing. */
		force?: boolean;
	};
	'orders.refunds.get': {
		/** The order ID. */
		order_id: number;
		/** Unique identifier for the resource. */
		id: number;
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'edit';
	};
	'orders.refunds.list': {
		/** The order ID. */
		order_id: number;
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'edit';
		/** Current page of the collection. */
		page?: number;
		/** Maximum number of items to be returned in result set. */
		per_page?: number;
		/** Limit results to those matching a string. */
		search?: string;
		/** Limit response to resources published after a given ISO8601 compliant date. */
		after?: string;
		/** Limit response to resources published before a given ISO8601 compliant date. */
		before?: string;
		/** Limit response to resources modified after a given ISO8601 compliant date. */
		modified_after?: string;
		/** Limit response to resources modified before a given ISO8601 compliant date. */
		modified_before?: string;
		/** Whether to consider GMT post dates when limiting response by published or modified date. */
		dates_are_gmt?: boolean;
		/** Ensure result set excludes specific IDs. */
		exclude?: Array<number>;
		/** Limit result set to specific ids. */
		include?: Array<number>;
		/** Offset the result set by a specific number of items. */
		offset?: number;
		/** Order sort attribute ascending or descending. */
		order?: 'asc' | 'desc';
		/** Sort collection by object attribute. */
		orderby?: 'date' | 'id' | 'include' | 'title' | 'slug' | 'modified';
		/** Limit result set to those of particular parent IDs. */
		parent?: Array<number>;
		/** Limit result set to all items except those of a particular parent ID. */
		parent_exclude?: Array<number>;
		/** Number of decimal points to use in each resource. */
		dp?: number;
		/** Only show meta which is meant to be displayed for an order. */
		order_item_display_meta?: boolean;
		/** Limit meta_data to specific keys. */
		include_meta?: Array<string>;
		/** Ensure meta_data excludes specific keys. */
		exclude_meta?: Array<string>;
	};
	'orders.refunds.preview': {
		/** The order ID. */
		order_id: number;
		/** Line items to include in the refund preview. */
		line_items: Array<{
			/** ID of the original order line item. */
			line_item_id: number;
			/** Quantity to refund. Required when refund_total is omitted. */
			quantity?: number;
			/** Tax-inclusive amount to refund for this line item. Must be non-zero and match the line's sign (negative for discount or credit lines, positive otherwise). Required when quantity is omitted. */
			refund_total?: number | null;
		}>;
	};
	'orders.sendEmail': {
		/** Unique identifier of the order. */
		id: number;
		/** Email address to send the order details to. */
		email?: string;
		/** Whether to update the billing email of the order, even if it already has one. */
		force_email_update?: boolean;
		/** The email template to use. If omitted, the best template is auto-selected based on order status. */
		template_id?:
			| 'new_order'
			| 'cancelled_order'
			| 'customer_cancelled_order'
			| 'failed_order'
			| 'customer_failed_order'
			| 'customer_on_hold_order'
			| 'customer_processing_order'
			| 'customer_completed_order'
			| 'customer_refunded_order'
			| 'customer_invoice'
			| 'customer_note'
			| 'customer_reset_password'
			| 'customer_new_account'
			| 'admin_payment_gateway_enabled'
			| 'customer_pos_completed_order'
			| 'customer_pos_refunded_order'
			| 'customer_verify_email';
	};
	'orders.sendOrderDetails': {
		/** Unique identifier of the order. */
		id: number;
		/** Email address to send the order details to. */
		email?: string;
		/** Whether to update the billing email of the order, even if it already has one. */
		force_email_update?: boolean;
	};
	'orders.statuses': Record<string, never>;
	'orders.update': {
		/** Unique identifier for the resource. */
		id: number;
		/** Parent order ID. */
		parent_id?: number;
		/** Shows where the order was created. */
		created_via?: string;
		/** Order status. */
		status?:
			| 'auto-draft'
			| 'pending'
			| 'processing'
			| 'on-hold'
			| 'completed'
			| 'cancelled'
			| 'refunded'
			| 'failed'
			| 'checkout-draft';
		/** Currency the order was created with, in ISO format. */
		currency?:
			| 'AED'
			| 'AFN'
			| 'ALL'
			| 'AMD'
			| 'ANG'
			| 'AOA'
			| 'ARS'
			| 'AUD'
			| 'AWG'
			| 'AZN'
			| 'BAM'
			| 'BBD'
			| 'BDT'
			| 'BGN'
			| 'BHD'
			| 'BIF'
			| 'BMD'
			| 'BND'
			| 'BOB'
			| 'BRL'
			| 'BSD'
			| 'BTC'
			| 'BTN'
			| 'BWP'
			| 'BYR'
			| 'BYN'
			| 'BZD'
			| 'CAD'
			| 'CDF'
			| 'CHF'
			| 'CHW'
			| 'CLP'
			| 'CNY'
			| 'COP'
			| 'CRC'
			| 'CUC'
			| 'CUP'
			| 'CVE'
			| 'CZK'
			| 'DJF'
			| 'DKK'
			| 'DOP'
			| 'DZD'
			| 'EGP'
			| 'ERN'
			| 'ETB'
			| 'EUR'
			| 'FJD'
			| 'FKP'
			| 'GBP'
			| 'GEL'
			| 'GGP'
			| 'GHS'
			| 'GIP'
			| 'GMD'
			| 'GNF'
			| 'GTQ'
			| 'GYD'
			| 'HKD'
			| 'HNL'
			| 'HRK'
			| 'HTG'
			| 'HUF'
			| 'IDR'
			| 'ILS'
			| 'IMP'
			| 'INR'
			| 'IQD'
			| 'IRR'
			| 'IRT'
			| 'ISK'
			| 'JEP'
			| 'JMD'
			| 'JOD'
			| 'JPY'
			| 'KES'
			| 'KGS'
			| 'KHR'
			| 'KMF'
			| 'KPW'
			| 'KRW'
			| 'KWD'
			| 'KYD'
			| 'KZT'
			| 'LAK'
			| 'LBP'
			| 'LKR'
			| 'LRD'
			| 'LSL'
			| 'LYD'
			| 'MAD'
			| 'MDL'
			| 'MGA'
			| 'MKD'
			| 'MMK'
			| 'MNT'
			| 'MOP'
			| 'MRU'
			| 'MUR'
			| 'MVR'
			| 'MWK'
			| 'MXN'
			| 'MYR'
			| 'MZN'
			| 'NAD'
			| 'NGN'
			| 'NIO'
			| 'NOK'
			| 'NPR'
			| 'NZD'
			| 'OMR'
			| 'PAB'
			| 'PEN'
			| 'PGK'
			| 'PHP'
			| 'PKR'
			| 'PLN'
			| 'PRB'
			| 'PYG'
			| 'QAR'
			| 'RON'
			| 'RSD'
			| 'RUB'
			| 'RWF'
			| 'SAR'
			| 'SBD'
			| 'SCR'
			| 'SDG'
			| 'SEK'
			| 'SGD'
			| 'SHP'
			| 'SLL'
			| 'SOS'
			| 'SRD'
			| 'SSP'
			| 'STN'
			| 'SYP'
			| 'SZL'
			| 'THB'
			| 'TJS'
			| 'TMT'
			| 'TND'
			| 'TOP'
			| 'TRY'
			| 'TTD'
			| 'TWD'
			| 'TZS'
			| 'UAH'
			| 'UGX'
			| 'USD'
			| 'UYU'
			| 'UZS'
			| 'VEF'
			| 'VES'
			| 'VND'
			| 'VUV'
			| 'WST'
			| 'XAF'
			| 'XCD'
			| 'XOF'
			| 'XPF'
			| 'YER'
			| 'ZAR'
			| 'ZMW';
		/** User ID who owns the order. 0 for guests. */
		customer_id?: number;
		/** Note left by customer during checkout. */
		customer_note?: string;
		/** Billing address. */
		billing?: {
			/** First name. */
			first_name?: string;
			/** Last name. */
			last_name?: string;
			/** Company name. */
			company?: string;
			/** Address line 1 */
			address_1?: string;
			/** Address line 2 */
			address_2?: string;
			/** City name. */
			city?: string;
			/** ISO code or name of the state, province or district. */
			state?: string;
			/** Postal code. */
			postcode?: string;
			/** Country code in ISO 3166-1 alpha-2 format. */
			country?: string;
			/** Email address. */
			email?: string | null;
			/** Phone number. */
			phone?: string;
		};
		/** Shipping address. */
		shipping?: {
			/** First name. */
			first_name?: string;
			/** Last name. */
			last_name?: string;
			/** Company name. */
			company?: string;
			/** Address line 1 */
			address_1?: string;
			/** Address line 2 */
			address_2?: string;
			/** City name. */
			city?: string;
			/** ISO code or name of the state, province or district. */
			state?: string;
			/** Postal code. */
			postcode?: string;
			/** Country code in ISO 3166-1 alpha-2 format. */
			country?: string;
		};
		/** Payment method ID. */
		payment_method?: string;
		/** Payment method title. */
		payment_method_title?: string;
		/** Unique transaction ID. */
		transaction_id?: string;
		/** Meta data. */
		meta_data?: Array<{
			/** Meta key. */
			key?: string;
			/** Meta value. */
			value?: WoocommerceJsonValue;
		}>;
		/** Line items data. */
		line_items?: Array<{
			/** Product name. */
			name?: WoocommerceJsonValue;
			/** Parent product name if the product is a variation. */
			parent_name?: string | null;
			/** Product ID. */
			product_id?: WoocommerceJsonValue;
			/** Variation ID, if applicable. */
			variation_id?: number;
			/** Quantity ordered. */
			quantity?: number;
			/** Tax class of product. */
			tax_class?: string;
			/** Line subtotal, excluding tax (before discounts). */
			subtotal?: string;
			/** Line total, excluding tax (after discounts). */
			total?: string;
			/** Meta data. */
			meta_data?: Array<{
				/** Meta key. */
				key?: string;
				/** Meta value. */
				value?: WoocommerceJsonValue;
			}>;
		}>;
		/** Shipping lines data. */
		shipping_lines?: Array<{
			/** Shipping method name. */
			method_title?: WoocommerceJsonValue;
			/** Shipping method ID. */
			method_id?: WoocommerceJsonValue;
			/** Shipping instance ID. */
			instance_id?: string;
			/** Shipping total, excluding tax. */
			total?: string;
			/** Meta data. */
			meta_data?: Array<{
				/** Meta key. */
				key?: string;
				/** Meta value. */
				value?: WoocommerceJsonValue;
			}>;
		}>;
		/** Fee lines data. */
		fee_lines?: Array<{
			/** Fee name. */
			name?: WoocommerceJsonValue;
			/** Tax class of fee. */
			tax_class?: string;
			/** Tax status of fee. */
			tax_status?: 'taxable' | 'none';
			/** Fee total, excluding tax. */
			total?: string;
			/** Meta data. */
			meta_data?: Array<{
				/** Meta key. */
				key?: string;
				/** Meta value. */
				value?: WoocommerceJsonValue;
			}>;
		}>;
		/** Coupons line data. */
		coupon_lines?: Array<{
			/** Coupon code. */
			code?: WoocommerceJsonValue;
			/** Meta data. */
			meta_data?: Array<{
				/** Meta key. */
				key?: string;
				/** Meta value. */
				value?: WoocommerceJsonValue;
			}>;
		}>;
		/** Define if the order is paid. It will set the status to processing and reduce stock items. */
		set_paid?: boolean;
		/** Set the action as manual so that the order note registers as "added by user". */
		manual_update?: boolean;
	};
	'paymentGateways.get': {
		/** Unique identifier for the resource. */
		id: string;
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'edit';
	};
	'paymentGateways.list': {
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'edit';
	};
	'paymentGateways.update': {
		/** Unique identifier for the resource. */
		id: string;
		/** Payment gateway title on checkout. */
		title?: string;
		/** Payment gateway description on checkout. */
		description?: string;
		/** Payment gateway sort order. */
		order?: number;
		/** Payment gateway enabled status. */
		enabled?: boolean;
		/** Payment gateway settings. */
		settings?: {
			/** Setting value. */
			value?: string;
		};
	};
	'products.attributes.batch': {
		/** Records to create, each with the same fields as the create operation. */
		create?: Array<Record<string, WoocommerceJsonValue>>;
		/** Records to update, each with its `id` (settings: `id` and `value`) and the fields to change. */
		update?: Array<Record<string, WoocommerceJsonValue>>;
		/** Ids of records to delete (permanently). */
		delete?: Array<number>;
	};
	'products.attributes.create': {
		/** Name for the resource. */
		name: string;
		/** An alphanumeric identifier for the resource unique to its type. */
		slug?: string;
		/** Type of attribute. */
		type?: 'select';
		/** Default sort order. */
		order_by?: 'menu_order' | 'name' | 'name_num' | 'id';
		/** Enable/Disable attribute archives. */
		has_archives?: boolean;
	};
	'products.attributes.delete': {
		/** Unique identifier for the resource. */
		id: number;
		/** Required to be true, as resource does not support trashing. */
		force?: boolean;
	};
	'products.attributes.get': {
		/** Unique identifier for the resource. */
		id: number;
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'edit';
	};
	'products.attributes.list': {
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'edit';
	};
	'products.attributes.terms.batch': {
		/** Unique identifier for the attribute of the terms. */
		attribute_id: number;
		/** Records to create, each with the same fields as the create operation. */
		create?: Array<Record<string, WoocommerceJsonValue>>;
		/** Records to update, each with its `id` (settings: `id` and `value`) and the fields to change. */
		update?: Array<Record<string, WoocommerceJsonValue>>;
		/** Ids of records to delete (permanently). */
		delete?: Array<number>;
	};
	'products.attributes.terms.create': {
		/** Unique identifier for the attribute of the terms. */
		attribute_id: number;
		/** Name for the resource. */
		name: string;
		/** An alphanumeric identifier for the resource unique to its type. */
		slug?: string;
		/** HTML description of the resource. */
		description?: string;
		/** Menu order, used to custom sort the resource. */
		menu_order?: number;
	};
	'products.attributes.terms.delete': {
		/** Unique identifier for the attribute of the terms. */
		attribute_id: number;
		/** Unique identifier for the resource. */
		id: number;
		/** Required to be true, as resource does not support trashing. */
		force?: boolean;
	};
	'products.attributes.terms.get': {
		/** Unique identifier for the attribute of the terms. */
		attribute_id: number;
		/** Unique identifier for the resource. */
		id: number;
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'edit';
	};
	'products.attributes.terms.list': {
		/** Unique identifier for the attribute of the terms. */
		attribute_id: number;
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'edit';
		/** Current page of the collection. */
		page?: number;
		/** Maximum number of items to be returned in result set. */
		per_page?: number;
		/** Limit results to those matching a string. */
		search?: string;
		/** Ensure result set excludes specific IDs. */
		exclude?: Array<number>;
		/** Limit result set to specific ids. */
		include?: Array<number>;
		/** Offset the result set by a specific number of items. Applies to hierarchical taxonomies only. */
		offset?: number;
		/** Order sort attribute ascending or descending. */
		order?: 'asc' | 'desc';
		/** Sort collection by resource attribute. */
		orderby?:
			| 'id'
			| 'include'
			| 'name'
			| 'slug'
			| 'term_group'
			| 'description'
			| 'count';
		/** Whether to hide resources not assigned to any products. */
		hide_empty?: boolean;
		/** Limit result set to resources assigned to a specific parent. Applies to hierarchical taxonomies only. */
		parent?: number;
		/** Limit result set to resources assigned to a specific product. */
		product?: number;
		/** Limit result set to resources with a specific slug. */
		slug?: string | Array<string>;
	};
	'products.attributes.terms.update': {
		/** Unique identifier for the attribute of the terms. */
		attribute_id: number;
		/** Unique identifier for the resource. */
		id: number;
		/** Term name. */
		name?: string;
		/** An alphanumeric identifier for the resource unique to its type. */
		slug?: string;
		/** HTML description of the resource. */
		description?: string;
		/** Menu order, used to custom sort the resource. */
		menu_order?: number;
	};
	'products.attributes.update': {
		/** Unique identifier for the resource. */
		id: number;
		/** Attribute name. */
		name?: string;
		/** An alphanumeric identifier for the resource unique to its type. */
		slug?: string;
		/** Type of attribute. */
		type?: 'select';
		/** Default sort order. */
		order_by?: 'menu_order' | 'name' | 'name_num' | 'id';
		/** Enable/Disable attribute archives. */
		has_archives?: boolean;
	};
	'products.batch': {
		/** Records to create, each with the same fields as the create operation. */
		create?: Array<Record<string, WoocommerceJsonValue>>;
		/** Records to update, each with its `id` (settings: `id` and `value`) and the fields to change. */
		update?: Array<Record<string, WoocommerceJsonValue>>;
		/** Ids of records to delete (permanently). */
		delete?: Array<number>;
	};
	'products.brands.batch': {
		/** Records to create, each with the same fields as the create operation. */
		create?: Array<Record<string, WoocommerceJsonValue>>;
		/** Records to update, each with its `id` (settings: `id` and `value`) and the fields to change. */
		update?: Array<Record<string, WoocommerceJsonValue>>;
		/** Ids of records to delete (permanently). */
		delete?: Array<number>;
	};
	'products.brands.create': {
		/** Name for the resource. */
		name: string;
		/** An alphanumeric identifier for the resource unique to its type. */
		slug?: string;
		/** The ID for the parent of the resource. */
		parent?: number;
		/** HTML description of the resource. */
		description?: string;
		/** Category archive display type. */
		display?: 'default' | 'products' | 'subcategories' | 'both';
		/** Image data. */
		image?: {
			/** Image ID. */
			id?: number;
			/** Image URL. */
			src?: string;
			/** Image name. */
			name?: string;
			/** Image alternative text. */
			alt?: string;
		};
		/** Menu order, used to custom sort the resource. */
		menu_order?: number;
	};
	'products.brands.delete': {
		/** Unique identifier for the resource. */
		id: number;
		/** Required to be true, as resource does not support trashing. */
		force?: boolean;
	};
	'products.brands.get': {
		/** Unique identifier for the resource. */
		id: number;
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'edit';
	};
	'products.brands.list': {
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'edit';
		/** Current page of the collection. */
		page?: number;
		/** Maximum number of items to be returned in result set. */
		per_page?: number;
		/** Limit results to those matching a string. */
		search?: string;
		/** Ensure result set excludes specific IDs. */
		exclude?: Array<number>;
		/** Limit result set to specific ids. */
		include?: Array<number>;
		/** Offset the result set by a specific number of items. Applies to hierarchical taxonomies only. */
		offset?: number;
		/** Order sort attribute ascending or descending. */
		order?: 'asc' | 'desc';
		/** Sort collection by resource attribute. */
		orderby?:
			| 'id'
			| 'include'
			| 'name'
			| 'slug'
			| 'term_group'
			| 'description'
			| 'count';
		/** Whether to hide resources not assigned to any products. */
		hide_empty?: boolean;
		/** Limit result set to resources assigned to a specific parent. Applies to hierarchical taxonomies only. */
		parent?: number;
		/** Limit result set to resources assigned to a specific product. */
		product?: number;
		/** Limit result set to resources with a specific slug. */
		slug?: string | Array<string>;
	};
	'products.brands.update': {
		/** Unique identifier for the resource. */
		id: number;
		/** Category name. */
		name?: string;
		/** An alphanumeric identifier for the resource unique to its type. */
		slug?: string;
		/** The ID for the parent of the resource. */
		parent?: number;
		/** HTML description of the resource. */
		description?: string;
		/** Category archive display type. */
		display?: 'default' | 'products' | 'subcategories' | 'both';
		/** Image data. */
		image?: {
			/** Image ID. */
			id?: number;
			/** Image URL. */
			src?: string;
			/** Image name. */
			name?: string;
			/** Image alternative text. */
			alt?: string;
		};
		/** Menu order, used to custom sort the resource. */
		menu_order?: number;
	};
	'products.categories.batch': {
		/** Records to create, each with the same fields as the create operation. */
		create?: Array<Record<string, WoocommerceJsonValue>>;
		/** Records to update, each with its `id` (settings: `id` and `value`) and the fields to change. */
		update?: Array<Record<string, WoocommerceJsonValue>>;
		/** Ids of records to delete (permanently). */
		delete?: Array<number>;
	};
	'products.categories.create': {
		/** Name for the resource. */
		name: string;
		/** An alphanumeric identifier for the resource unique to its type. */
		slug?: string;
		/** The ID for the parent of the resource. */
		parent?: number;
		/** HTML description of the resource. */
		description?: string;
		/** Category archive display type. */
		display?: 'default' | 'products' | 'subcategories' | 'both';
		/** Image data. */
		image?: {
			/** Image ID. */
			id?: number;
			/** Image URL. */
			src?: string;
			/** Image name. */
			name?: string;
			/** Image alternative text. */
			alt?: string;
		};
	};
	'products.categories.delete': {
		/** Unique identifier for the resource. */
		id: number;
		/** Required to be true, as resource does not support trashing. */
		force?: boolean;
	};
	'products.categories.get': {
		/** Unique identifier for the resource. */
		id: number;
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'edit';
	};
	'products.categories.list': {
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'edit';
		/** Current page of the collection. */
		page?: number;
		/** Maximum number of items to be returned in result set. */
		per_page?: number;
		/** Limit results to those matching a string. */
		search?: string;
		/** Ensure result set excludes specific IDs. */
		exclude?: Array<number>;
		/** Limit result set to specific ids. */
		include?: Array<number>;
		/** Offset the result set by a specific number of items. Applies to hierarchical taxonomies only. */
		offset?: number;
		/** Order sort attribute ascending or descending. */
		order?: 'asc' | 'desc';
		/** Sort collection by resource attribute. */
		orderby?:
			| 'id'
			| 'include'
			| 'name'
			| 'slug'
			| 'term_group'
			| 'description'
			| 'count';
		/** Whether to hide resources not assigned to any products. */
		hide_empty?: boolean;
		/** Limit result set to resources assigned to a specific parent. Applies to hierarchical taxonomies only. */
		parent?: number;
		/** Limit result set to resources assigned to a specific product. */
		product?: number;
		/** Limit result set to resources with a specific slug. */
		slug?: string | Array<string>;
	};
	'products.categories.update': {
		/** Unique identifier for the resource. */
		id: number;
		/** Category name. */
		name?: string;
		/** An alphanumeric identifier for the resource unique to its type. */
		slug?: string;
		/** The ID for the parent of the resource. */
		parent?: number;
		/** HTML description of the resource. */
		description?: string;
		/** Category archive display type. */
		display?: 'default' | 'products' | 'subcategories' | 'both';
		/** Image data. */
		image?: {
			/** Image ID. */
			id?: number;
			/** Image URL. */
			src?: string;
			/** Image name. */
			name?: string;
			/** Image alternative text. */
			alt?: string;
		};
	};
	'products.create': {
		/** Product name. */
		name?: string;
		/** Product slug. */
		slug?: string;
		/** The date the product was created, in the site's timezone. */
		date_created?: string | null;
		/** The date the product was created, as GMT. */
		date_created_gmt?: string | null;
		/** Product type. */
		type?: 'simple' | 'grouped' | 'external' | 'variable';
		/** Product status (post status). */
		status?:
			| 'draft'
			| 'pending'
			| 'private'
			| 'publish'
			| 'future'
			| 'auto-draft'
			| 'trash';
		/** Featured product. */
		featured?: boolean;
		/** Catalog visibility. */
		catalog_visibility?: 'visible' | 'catalog' | 'search' | 'hidden';
		/** Product description. */
		description?: string;
		/** Product short description. */
		short_description?: string;
		/** Stock Keeping Unit. */
		sku?: string;
		/** GTIN, UPC, EAN or ISBN. */
		global_unique_id?: string;
		/** Product regular price. */
		regular_price?: string;
		/** Product sale price. */
		sale_price?: string;
		/** Start date of sale price, in the site's timezone. */
		date_on_sale_from?: string | null;
		/** Start date of sale price, as GMT. */
		date_on_sale_from_gmt?: string | null;
		/** End date of sale price, in the site's timezone. */
		date_on_sale_to?: string | null;
		/** End date of sale price, in the site's timezone. */
		date_on_sale_to_gmt?: string | null;
		/** If the product is virtual. */
		virtual?: boolean;
		/** If the product is downloadable. */
		downloadable?: boolean;
		/** List of downloadable files. */
		downloads?: Array<{
			/** File ID. */
			id?: string;
			/** File name. */
			name?: string;
			/** File URL. */
			file?: string;
		}>;
		/** Number of times downloadable files can be downloaded after purchase. */
		download_limit?: number;
		/** Number of days until access to downloadable files expires. */
		download_expiry?: number;
		/** Product external URL. Only for external products. */
		external_url?: string;
		/** Product external button text. Only for external products. */
		button_text?: string;
		/** Tax status. */
		tax_status?: 'taxable' | 'shipping' | 'none';
		/** Tax class. */
		tax_class?: string;
		/** Stock management at product level. */
		manage_stock?: boolean;
		/** Stock quantity. */
		stock_quantity?: number;
		/** Controls the stock status of the product. */
		stock_status?: 'instock' | 'outofstock' | 'onbackorder';
		/** If managing stock, this controls if backorders are allowed. */
		backorders?: 'no' | 'notify' | 'yes';
		/** Low Stock amount for the product. */
		low_stock_amount?: number | null;
		/** Allow one item to be bought in a single order. */
		sold_individually?: boolean;
		/** Product weight (lbs). */
		weight?: string;
		/** Product dimensions. */
		dimensions?: {
			/** Product length (in). */
			length?: string;
			/** Product width (in). */
			width?: string;
			/** Product height (in). */
			height?: string;
		};
		/** Shipping class slug. */
		shipping_class?: string;
		/** Allow reviews. */
		reviews_allowed?: boolean;
		/** Post password. */
		post_password?: string;
		/** List of up-sell products IDs. */
		upsell_ids?: Array<number>;
		/** List of cross-sell products IDs. */
		cross_sell_ids?: Array<number>;
		/** Product parent ID. */
		parent_id?: number;
		/** Optional note to send the customer after purchase. */
		purchase_note?: string;
		/** List of categories. */
		categories?: Array<{
			/** Category ID. */
			id?: number;
		}>;
		/** List of brands. */
		brands?: Array<{
			/** Brand ID. */
			id?: number;
		}>;
		/** List of tags. */
		tags?: Array<{
			/** Tag ID. */
			id?: number;
		}>;
		/** List of images. */
		images?: Array<{
			/** Image ID. */
			id?: number;
			/** Image URL. */
			src?: string;
			/** Image name. */
			name?: string;
			/** Image alternative text. */
			alt?: string;
		}>;
		/** List of attributes. */
		attributes?: Array<{
			/** Attribute ID. */
			id?: number;
			/** Attribute name. */
			name?: string;
			/** Attribute position. */
			position?: number;
			/** Define if the attribute is visible on the "Additional information" tab in the product's page. */
			visible?: boolean;
			/** Define if the attribute can be used as variation. */
			variation?: boolean;
			/** List of available term names of the attribute. */
			options?: Array<string>;
		}>;
		/** Defaults variation attributes. */
		default_attributes?: Array<{
			/** Attribute ID. */
			id?: number;
			/** Attribute name. */
			name?: string;
			/** Selected attribute term name. */
			option?: string;
		}>;
		/** Menu order, used to custom sort products. */
		menu_order?: number;
		/** Meta data. */
		meta_data?: Array<{
			/** Meta key. */
			key?: string;
			/** Meta value. */
			value?: WoocommerceJsonValue;
		}>;
		/** Customs commodity code containing 6 to 14 digits. Punctuation and spaces are removed. */
		customs_commodity_code?: string | null;
		/** Two-letter country of origin code. */
		customs_country_of_origin?: string | null;
		/** Plain-text customs description, up to 35 characters, without emoji or special symbols such as ™. */
		customs_description?: string | null;
	};
	'products.customFieldNames': {
		/** Scope under which the request is made; determines fields present in response. */
		context?: string;
		/** Current page of the collection. */
		page?: number;
		/** Maximum number of items to be returned in result set. */
		per_page?: number;
		/** Limit results to those matching a string. */
		search?: string;
		/** Order sort items ascending or descending. */
		order?: 'asc' | 'desc';
	};
	'products.delete': {
		/** Unique identifier for the resource. */
		id: number;
		/** Whether to bypass trash and force deletion. */
		force?: boolean;
	};
	'products.duplicate': {
		/** Unique identifier for the resource. */
		id: number;
		/** Product name. */
		name?: string;
		/** Product slug. */
		slug?: string;
		/** The date the product was created, in the site's timezone. */
		date_created?: string | null;
		/** The date the product was created, as GMT. */
		date_created_gmt?: string | null;
		/** Product type. */
		type?: 'simple' | 'grouped' | 'external' | 'variable';
		/** Product status (post status). */
		status?:
			| 'draft'
			| 'pending'
			| 'private'
			| 'publish'
			| 'future'
			| 'auto-draft'
			| 'trash';
		/** Featured product. */
		featured?: boolean;
		/** Catalog visibility. */
		catalog_visibility?: 'visible' | 'catalog' | 'search' | 'hidden';
		/** Product description. */
		description?: string;
		/** Product short description. */
		short_description?: string;
		/** Stock Keeping Unit. */
		sku?: string;
		/** GTIN, UPC, EAN or ISBN. */
		global_unique_id?: string;
		/** Product regular price. */
		regular_price?: string;
		/** Product sale price. */
		sale_price?: string;
		/** Start date of sale price, in the site's timezone. */
		date_on_sale_from?: string | null;
		/** Start date of sale price, as GMT. */
		date_on_sale_from_gmt?: string | null;
		/** End date of sale price, in the site's timezone. */
		date_on_sale_to?: string | null;
		/** End date of sale price, in the site's timezone. */
		date_on_sale_to_gmt?: string | null;
		/** If the product is virtual. */
		virtual?: boolean;
		/** If the product is downloadable. */
		downloadable?: boolean;
		/** List of downloadable files. */
		downloads?: Array<{
			/** File ID. */
			id?: string;
			/** File name. */
			name?: string;
			/** File URL. */
			file?: string;
		}>;
		/** Number of times downloadable files can be downloaded after purchase. */
		download_limit?: number;
		/** Number of days until access to downloadable files expires. */
		download_expiry?: number;
		/** Product external URL. Only for external products. */
		external_url?: string;
		/** Product external button text. Only for external products. */
		button_text?: string;
		/** Tax status. */
		tax_status?: 'taxable' | 'shipping' | 'none';
		/** Tax class. */
		tax_class?: string;
		/** Stock management at product level. */
		manage_stock?: boolean;
		/** Stock quantity. */
		stock_quantity?: number;
		/** Controls the stock status of the product. */
		stock_status?: 'instock' | 'outofstock' | 'onbackorder';
		/** If managing stock, this controls if backorders are allowed. */
		backorders?: 'no' | 'notify' | 'yes';
		/** Low Stock amount for the product. */
		low_stock_amount?: number | null;
		/** Allow one item to be bought in a single order. */
		sold_individually?: boolean;
		/** Product weight (lbs). */
		weight?: string;
		/** Product dimensions. */
		dimensions?: {
			/** Product length (in). */
			length?: string;
			/** Product width (in). */
			width?: string;
			/** Product height (in). */
			height?: string;
		};
		/** Shipping class slug. */
		shipping_class?: string;
		/** Allow reviews. */
		reviews_allowed?: boolean;
		/** Post password. */
		post_password?: string;
		/** List of up-sell products IDs. */
		upsell_ids?: Array<number>;
		/** List of cross-sell products IDs. */
		cross_sell_ids?: Array<number>;
		/** Product parent ID. */
		parent_id?: number;
		/** Optional note to send the customer after purchase. */
		purchase_note?: string;
		/** List of categories. */
		categories?: Array<{
			/** Category ID. */
			id?: number;
		}>;
		/** List of brands. */
		brands?: Array<{
			/** Brand ID. */
			id?: number;
		}>;
		/** List of tags. */
		tags?: Array<{
			/** Tag ID. */
			id?: number;
		}>;
		/** List of images. */
		images?: Array<{
			/** Image ID. */
			id?: number;
			/** Image URL. */
			src?: string;
			/** Image name. */
			name?: string;
			/** Image alternative text. */
			alt?: string;
		}>;
		/** List of attributes. */
		attributes?: Array<{
			/** Attribute ID. */
			id?: number;
			/** Attribute name. */
			name?: string;
			/** Attribute position. */
			position?: number;
			/** Define if the attribute is visible on the "Additional information" tab in the product's page. */
			visible?: boolean;
			/** Define if the attribute can be used as variation. */
			variation?: boolean;
			/** List of available term names of the attribute. */
			options?: Array<string>;
		}>;
		/** Defaults variation attributes. */
		default_attributes?: Array<{
			/** Attribute ID. */
			id?: number;
			/** Attribute name. */
			name?: string;
			/** Selected attribute term name. */
			option?: string;
		}>;
		/** Menu order, used to custom sort products. */
		menu_order?: number;
		/** Meta data. */
		meta_data?: Array<{
			/** Meta key. */
			key?: string;
			/** Meta value. */
			value?: WoocommerceJsonValue;
		}>;
		/** Customs commodity code containing 6 to 14 digits. Punctuation and spaces are removed. */
		customs_commodity_code?: string | null;
		/** Two-letter country of origin code. */
		customs_country_of_origin?: string | null;
		/** Plain-text customs description, up to 35 characters, without emoji or special symbols such as ™. */
		customs_description?: string | null;
	};
	'products.get': {
		/** Unique identifier for the resource. */
		id: number;
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'edit';
		/** Image size to return. Accepts any registered WordPress image size. */
		image_size?: string;
	};
	'products.list': {
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'edit';
		/** Current page of the collection. */
		page?: number;
		/** Maximum number of items to be returned in result set. */
		per_page?: number;
		/** Limit results to those matching a string. */
		search?: string;
		/** Limit response to resources published after a given ISO8601 compliant date. */
		after?: string;
		/** Limit response to resources published before a given ISO8601 compliant date. */
		before?: string;
		/** Limit response to resources modified after a given ISO8601 compliant date. */
		modified_after?: string;
		/** Limit response to resources modified before a given ISO8601 compliant date. */
		modified_before?: string;
		/** Whether to consider GMT post dates when limiting response by published or modified date. */
		dates_are_gmt?: boolean;
		/** Ensure result set excludes specific IDs. */
		exclude?: Array<number>;
		/** Limit result set to specific ids. */
		include?: Array<number>;
		/** Offset the result set by a specific number of items. */
		offset?: number;
		/** Order sort attribute ascending or descending. */
		order?: 'asc' | 'desc';
		/** Sort collection by object attribute. */
		orderby?:
			| 'date'
			| 'id'
			| 'include'
			| 'title'
			| 'slug'
			| 'modified'
			| 'popularity'
			| 'rating'
			| 'post__in'
			| 'price'
			| 'sales'
			| 'menu_order'
			| 'random'
			| 'popularity'
			| 'rating'
			| 'menu_order'
			| 'price'
			| 'popularity'
			| 'rating';
		/** Limit result set to those of particular parent IDs. */
		parent?: Array<number>;
		/** Limit result set to all items except those of a particular parent ID. */
		parent_exclude?: Array<number>;
		/** Limit result set to products assigned a specific brand ID. */
		brand?: string;
		/** Limit result set to products with a specific slug. */
		slug?: string;
		/** Limit result set to products assigned a specific status. */
		status?:
			| 'any'
			| 'future'
			| 'trash'
			| 'draft'
			| 'pending'
			| 'private'
			| 'publish';
		/** Limit result set to products assigned a specific type. */
		type?: 'simple' | 'grouped' | 'external' | 'variable';
		/** Limit result set to products with specific SKU(s). Use commas to separate. */
		sku?: string;
		/** Limit result set to featured products. */
		featured?: boolean;
		/** Limit result set to products assigned a specific category ID. */
		category?: string;
		/** Limit result set to products assigned a specific tag ID. */
		tag?: string;
		/** Limit result set to products assigned a specific shipping class ID. */
		shipping_class?: string;
		/** Limit result set to products with a specific attribute. Use the taxonomy name/attribute slug. */
		attribute?: string;
		/** Limit result set to products with a specific attribute term ID (required an assigned attribute). */
		attribute_term?: string;
		/** Limit result set to products on sale. */
		on_sale?: boolean;
		/** Limit result set to products based on a minimum price. */
		min_price?: string;
		/** Limit result set to products based on a maximum price. */
		max_price?: string;
		/** Limit meta_data to specific keys. */
		include_meta?: Array<string>;
		/** Ensure meta_data excludes specific keys. */
		exclude_meta?: Array<string>;
		/** Image size to return. Accepts any registered WordPress image size. */
		image_size?: string;
		/** Limit result set to products with specified stock status. */
		stock_status?: 'instock' | 'outofstock' | 'onbackorder';
		/** Limit results to those with a SKU that partial matches a string. This argument takes precedence over 'sku'. */
		search_sku?: string;
		/** Limit results to those with a name or SKU that partial matches a string. This argument takes precedence over 'search', 'sku' and 'search_sku'. */
		search_name_or_sku?: string;
		/** Limit search to specific fields when used with search parameter. Available fields: name, sku, global_unique_id, description, short_description. This argument takes precedence over all other search parameters. */
		search_fields?: Array<
			'name' | 'global_unique_id' | 'description' | 'short_description' | 'sku'
		>;
		/** Limit result set to products with any of the statuses. */
		include_status?: Array<
			'any' | 'future' | 'trash' | 'draft' | 'pending' | 'private' | 'publish'
		>;
		/** Exclude products with any of the statuses from result set. */
		exclude_status?: Array<
			'future' | 'trash' | 'draft' | 'pending' | 'private' | 'publish'
		>;
		/** Limit result set to products with any of the types. */
		include_types?: Array<'simple' | 'grouped' | 'external' | 'variable'>;
		/** Exclude products with any of the types from result set. */
		exclude_types?: Array<'simple' | 'grouped' | 'external' | 'variable'>;
		/** Limit result set to downloadable products. */
		downloadable?: boolean;
		/** Limit result set to virtual products. */
		virtual?: boolean;
		/** Limit result set to products visible in Point of Sale. */
		pos_products_only?: boolean;
	};
	'products.related': {
		/** Unique identifier for the resource. */
		id: number;
	};
	'products.reviews.batch': {
		/** Records to create, each with the same fields as the create operation. */
		create?: Array<Record<string, WoocommerceJsonValue>>;
		/** Records to update, each with its `id` (settings: `id` and `value`) and the fields to change. */
		update?: Array<Record<string, WoocommerceJsonValue>>;
		/** Ids of records to delete (permanently). */
		delete?: Array<number>;
	};
	'products.reviews.create': {
		/** Unique identifier for the product. */
		product_id: number;
		/** Product name. */
		product_name?: string;
		/** Status of the review. */
		status?: 'approved' | 'hold' | 'spam' | 'unspam' | 'trash' | 'untrash';
		/** Name of the reviewer. */
		reviewer: string;
		/** Email of the reviewer. */
		reviewer_email: string;
		/** Review content. */
		review: string;
		/** Review rating (0 to 5). */
		rating?: number;
	};
	'products.reviews.delete': {
		/** Unique identifier for the resource. */
		id: number;
		/** Whether to bypass trash and force deletion. */
		force?: boolean;
	};
	'products.reviews.get': {
		/** Unique identifier for the resource. */
		id: number;
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'edit';
	};
	'products.reviews.list': {
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'edit';
		/** Current page of the collection. */
		page?: number;
		/** Maximum number of items to be returned in result set. */
		per_page?: number;
		/** Limit results to those matching a string. */
		search?: string;
		/** Limit response to resources published after a given ISO8601 compliant date. */
		after?: string;
		/** Limit response to reviews published before a given ISO8601 compliant date. */
		before?: string;
		/** Ensure result set excludes specific IDs. */
		exclude?: Array<number>;
		/** Limit result set to specific IDs. */
		include?: Array<number>;
		/** Offset the result set by a specific number of items. */
		offset?: number;
		/** Order sort attribute ascending or descending. */
		order?: 'asc' | 'desc';
		/** Sort collection by object attribute. */
		orderby?: 'date' | 'date_gmt' | 'id' | 'include' | 'product';
		/** Limit result set to reviews assigned to specific user IDs. */
		reviewer?: Array<number>;
		/** Ensure result set excludes reviews assigned to specific user IDs. */
		reviewer_exclude?: Array<number>;
		/** Limit result set to that from a specific author email. */
		reviewer_email?: string;
		/** Limit result set to reviews assigned to specific product IDs. */
		product?: Array<number>;
		/** Limit result set to reviews assigned a specific status. */
		status?: 'all' | 'hold' | 'approved' | 'spam' | 'trash';
	};
	'products.reviews.update': {
		/** Unique identifier for the resource. */
		id: number;
		/** Unique identifier for the product that the review belongs to. */
		product_id?: number;
		/** Product name. */
		product_name?: string;
		/** Status of the review. */
		status?: 'approved' | 'hold' | 'spam' | 'unspam' | 'trash' | 'untrash';
		/** Reviewer name. */
		reviewer?: string;
		/** Reviewer email. */
		reviewer_email?: string;
		/** The content of the review. */
		review?: string;
		/** Review rating (0 to 5). */
		rating?: number;
	};
	'products.shippingClasses.batch': {
		/** Records to create, each with the same fields as the create operation. */
		create?: Array<Record<string, WoocommerceJsonValue>>;
		/** Records to update, each with its `id` (settings: `id` and `value`) and the fields to change. */
		update?: Array<Record<string, WoocommerceJsonValue>>;
		/** Ids of records to delete (permanently). */
		delete?: Array<number>;
	};
	'products.shippingClasses.create': {
		/** Name for the resource. */
		name: string;
		/** An alphanumeric identifier for the resource unique to its type. */
		slug?: string;
		/** HTML description of the resource. */
		description?: string;
	};
	'products.shippingClasses.delete': {
		/** Unique identifier for the resource. */
		id: number;
		/** Required to be true, as resource does not support trashing. */
		force?: boolean;
	};
	'products.shippingClasses.get': {
		/** Unique identifier for the resource. */
		id: number;
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'edit';
	};
	'products.shippingClasses.list': {
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'edit';
		/** Current page of the collection. */
		page?: number;
		/** Maximum number of items to be returned in result set. */
		per_page?: number;
		/** Limit results to those matching a string. */
		search?: string;
		/** Ensure result set excludes specific IDs. */
		exclude?: Array<number>;
		/** Limit result set to specific ids. */
		include?: Array<number>;
		/** Offset the result set by a specific number of items. Applies to hierarchical taxonomies only. */
		offset?: number;
		/** Order sort attribute ascending or descending. */
		order?: 'asc' | 'desc';
		/** Sort collection by resource attribute. */
		orderby?:
			| 'id'
			| 'include'
			| 'name'
			| 'slug'
			| 'term_group'
			| 'description'
			| 'count';
		/** Whether to hide resources not assigned to any products. */
		hide_empty?: boolean;
		/** Limit result set to resources assigned to a specific parent. Applies to hierarchical taxonomies only. */
		parent?: number;
		/** Limit result set to resources assigned to a specific product. */
		product?: number;
		/** Limit result set to resources with a specific slug. */
		slug?: string | Array<string>;
	};
	'products.shippingClasses.suggestSlug': {
		/** Shipping class name. */
		name?: string;
		/** An alphanumeric identifier for the resource unique to its type. */
		slug?: string;
		/** HTML description of the resource. */
		description?: string;
	};
	'products.shippingClasses.update': {
		/** Unique identifier for the resource. */
		id: number;
		/** Shipping class name. */
		name?: string;
		/** An alphanumeric identifier for the resource unique to its type. */
		slug?: string;
		/** HTML description of the resource. */
		description?: string;
	};
	'products.suggested': {
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'edit';
		/** Current page of the collection. */
		page?: number;
		/** Maximum number of items to be returned in result set. */
		per_page?: number;
		/** Limit results to those matching a string. */
		search?: string;
		/** Limit response to resources published after a given ISO8601 compliant date. */
		after?: string;
		/** Limit response to resources published before a given ISO8601 compliant date. */
		before?: string;
		/** Limit response to resources modified after a given ISO8601 compliant date. */
		modified_after?: string;
		/** Limit response to resources modified before a given ISO8601 compliant date. */
		modified_before?: string;
		/** Whether to consider GMT post dates when limiting response by published or modified date. */
		dates_are_gmt?: boolean;
		/** Ensure result set excludes specific IDs. */
		exclude?: Array<number>;
		/** Limit result set to specific ids. */
		include?: Array<number>;
		/** Offset the result set by a specific number of items. */
		offset?: number;
		/** Order sort attribute ascending or descending. */
		order?: 'asc' | 'desc';
		/** Sort collection by object attribute. */
		orderby?:
			| 'date'
			| 'id'
			| 'include'
			| 'title'
			| 'slug'
			| 'modified'
			| 'popularity'
			| 'rating'
			| 'post__in'
			| 'price'
			| 'sales'
			| 'menu_order'
			| 'random'
			| 'popularity'
			| 'rating'
			| 'menu_order';
		/** Limit result set to those of particular parent IDs. */
		parent?: Array<number>;
		/** Limit result set to all items except those of a particular parent ID. */
		parent_exclude?: Array<number>;
		/** Limit result set to products assigned a specific brand ID. */
		brand?: string;
		/** Limit result set to products with a specific slug. */
		slug?: string;
		/** Limit result set to products assigned a specific status. */
		status?:
			| 'any'
			| 'future'
			| 'trash'
			| 'draft'
			| 'pending'
			| 'private'
			| 'publish';
		/** Limit result set to products assigned a specific type. */
		type?: 'simple' | 'grouped' | 'external' | 'variable';
		/** Limit result set to products with specific SKU(s). Use commas to separate. */
		sku?: string;
		/** Limit result set to featured products. */
		featured?: boolean;
		/** Limit result set to products assigned a specific category ID. */
		category?: string;
		/** Limit result set to products assigned a specific tag ID. */
		tag?: string;
		/** Limit result set to products assigned a specific shipping class ID. */
		shipping_class?: string;
		/** Limit result set to products with a specific attribute. Use the taxonomy name/attribute slug. */
		attribute?: string;
		/** Limit result set to products with a specific attribute term ID (required an assigned attribute). */
		attribute_term?: string;
		/** Limit result set to products in stock or out of stock. */
		in_stock?: boolean;
		/** Limit result set to products on sale. */
		on_sale?: boolean;
		/** Limit result set to products based on a minimum price. */
		min_price?: string;
		/** Limit result set to products based on a maximum price. */
		max_price?: string;
		/** Limit meta_data to specific keys. */
		include_meta?: Array<string>;
		/** Ensure meta_data excludes specific keys. */
		exclude_meta?: Array<string>;
		/** Image size to return. Accepts any registered WordPress image size. */
		image_size?: string;
		/** Limit result set to specific product category ids. */
		categories?: Array<number>;
		/** Limit result set to specific product tag ids. */
		tags?: Array<number>;
		/** Limit result set to specific amount of suggested products. */
		limit?: number;
	};
	'products.tags.batch': {
		/** Records to create, each with the same fields as the create operation. */
		create?: Array<Record<string, WoocommerceJsonValue>>;
		/** Records to update, each with its `id` (settings: `id` and `value`) and the fields to change. */
		update?: Array<Record<string, WoocommerceJsonValue>>;
		/** Ids of records to delete (permanently). */
		delete?: Array<number>;
	};
	'products.tags.create': {
		/** Name for the resource. */
		name: string;
		/** An alphanumeric identifier for the resource unique to its type. */
		slug?: string;
		/** HTML description of the resource. */
		description?: string;
	};
	'products.tags.delete': {
		/** Unique identifier for the resource. */
		id: number;
		/** Required to be true, as resource does not support trashing. */
		force?: boolean;
	};
	'products.tags.get': {
		/** Unique identifier for the resource. */
		id: number;
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'edit';
	};
	'products.tags.list': {
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'edit';
		/** Current page of the collection. */
		page?: number;
		/** Maximum number of items to be returned in result set. */
		per_page?: number;
		/** Limit results to those matching a string. */
		search?: string;
		/** Ensure result set excludes specific IDs. */
		exclude?: Array<number>;
		/** Limit result set to specific ids. */
		include?: Array<number>;
		/** Offset the result set by a specific number of items. Applies to hierarchical taxonomies only. */
		offset?: number;
		/** Order sort attribute ascending or descending. */
		order?: 'asc' | 'desc';
		/** Sort collection by resource attribute. */
		orderby?:
			| 'id'
			| 'include'
			| 'name'
			| 'slug'
			| 'term_group'
			| 'description'
			| 'count';
		/** Whether to hide resources not assigned to any products. */
		hide_empty?: boolean;
		/** Limit result set to resources assigned to a specific parent. Applies to hierarchical taxonomies only. */
		parent?: number;
		/** Limit result set to resources assigned to a specific product. */
		product?: number;
		/** Limit result set to resources with a specific slug. */
		slug?: string | Array<string>;
	};
	'products.tags.update': {
		/** Unique identifier for the resource. */
		id: number;
		/** Tag name. */
		name?: string;
		/** An alphanumeric identifier for the resource unique to its type. */
		slug?: string;
		/** HTML description of the resource. */
		description?: string;
	};
	'products.update': {
		/** Unique identifier for the resource. */
		id: number;
		/** Product name. */
		name?: string;
		/** Product slug. */
		slug?: string;
		/** The date the product was created, in the site's timezone. */
		date_created?: string | null;
		/** The date the product was created, as GMT. */
		date_created_gmt?: string | null;
		/** Product type. */
		type?: 'simple' | 'grouped' | 'external' | 'variable';
		/** Product status (post status). */
		status?:
			| 'draft'
			| 'pending'
			| 'private'
			| 'publish'
			| 'future'
			| 'auto-draft'
			| 'trash';
		/** Featured product. */
		featured?: boolean;
		/** Catalog visibility. */
		catalog_visibility?: 'visible' | 'catalog' | 'search' | 'hidden';
		/** Product description. */
		description?: string;
		/** Product short description. */
		short_description?: string;
		/** Stock Keeping Unit. */
		sku?: string;
		/** GTIN, UPC, EAN or ISBN. */
		global_unique_id?: string;
		/** Product regular price. */
		regular_price?: string;
		/** Product sale price. */
		sale_price?: string;
		/** Start date of sale price, in the site's timezone. */
		date_on_sale_from?: string | null;
		/** Start date of sale price, as GMT. */
		date_on_sale_from_gmt?: string | null;
		/** End date of sale price, in the site's timezone. */
		date_on_sale_to?: string | null;
		/** End date of sale price, in the site's timezone. */
		date_on_sale_to_gmt?: string | null;
		/** If the product is virtual. */
		virtual?: boolean;
		/** If the product is downloadable. */
		downloadable?: boolean;
		/** List of downloadable files. */
		downloads?: Array<{
			/** File ID. */
			id?: string;
			/** File name. */
			name?: string;
			/** File URL. */
			file?: string;
		}>;
		/** Number of times downloadable files can be downloaded after purchase. */
		download_limit?: number;
		/** Number of days until access to downloadable files expires. */
		download_expiry?: number;
		/** Product external URL. Only for external products. */
		external_url?: string;
		/** Product external button text. Only for external products. */
		button_text?: string;
		/** Tax status. */
		tax_status?: 'taxable' | 'shipping' | 'none';
		/** Tax class. */
		tax_class?: string;
		/** Stock management at product level. */
		manage_stock?: boolean;
		/** Stock quantity. */
		stock_quantity?: number;
		/** Controls the stock status of the product. */
		stock_status?: 'instock' | 'outofstock' | 'onbackorder';
		/** If managing stock, this controls if backorders are allowed. */
		backorders?: 'no' | 'notify' | 'yes';
		/** Low Stock amount for the product. */
		low_stock_amount?: number | null;
		/** Allow one item to be bought in a single order. */
		sold_individually?: boolean;
		/** Product weight (lbs). */
		weight?: string;
		/** Product dimensions. */
		dimensions?: {
			/** Product length (in). */
			length?: string;
			/** Product width (in). */
			width?: string;
			/** Product height (in). */
			height?: string;
		};
		/** Shipping class slug. */
		shipping_class?: string;
		/** Allow reviews. */
		reviews_allowed?: boolean;
		/** Post password. */
		post_password?: string;
		/** List of up-sell products IDs. */
		upsell_ids?: Array<number>;
		/** List of cross-sell products IDs. */
		cross_sell_ids?: Array<number>;
		/** Product parent ID. */
		parent_id?: number;
		/** Optional note to send the customer after purchase. */
		purchase_note?: string;
		/** List of categories. */
		categories?: Array<{
			/** Category ID. */
			id?: number;
		}>;
		/** List of brands. */
		brands?: Array<{
			/** Brand ID. */
			id?: number;
		}>;
		/** List of tags. */
		tags?: Array<{
			/** Tag ID. */
			id?: number;
		}>;
		/** List of images. */
		images?: Array<{
			/** Image ID. */
			id?: number;
			/** Image URL. */
			src?: string;
			/** Image name. */
			name?: string;
			/** Image alternative text. */
			alt?: string;
		}>;
		/** List of attributes. */
		attributes?: Array<{
			/** Attribute ID. */
			id?: number;
			/** Attribute name. */
			name?: string;
			/** Attribute position. */
			position?: number;
			/** Define if the attribute is visible on the "Additional information" tab in the product's page. */
			visible?: boolean;
			/** Define if the attribute can be used as variation. */
			variation?: boolean;
			/** List of available term names of the attribute. */
			options?: Array<string>;
		}>;
		/** Defaults variation attributes. */
		default_attributes?: Array<{
			/** Attribute ID. */
			id?: number;
			/** Attribute name. */
			name?: string;
			/** Selected attribute term name. */
			option?: string;
		}>;
		/** Menu order, used to custom sort products. */
		menu_order?: number;
		/** Meta data. */
		meta_data?: Array<{
			/** Meta key. */
			key?: string;
			/** Meta value. */
			value?: WoocommerceJsonValue;
		}>;
		/** Customs commodity code containing 6 to 14 digits. Punctuation and spaces are removed. */
		customs_commodity_code?: string | null;
		/** Two-letter country of origin code. */
		customs_country_of_origin?: string | null;
		/** Plain-text customs description, up to 35 characters, without emoji or special symbols such as ™. */
		customs_description?: string | null;
	};
	'products.variations.batch': {
		/** Unique identifier for the variable product. */
		product_id: number;
		/** Records to create, each with the same fields as the create operation. */
		create?: Array<Record<string, WoocommerceJsonValue>>;
		/** Records to update, each with its `id` (settings: `id` and `value`) and the fields to change. */
		update?: Array<Record<string, WoocommerceJsonValue>>;
		/** Ids of records to delete (permanently). */
		delete?: Array<number>;
	};
	'products.variations.create': {
		/** Unique identifier for the variable product. */
		product_id: number;
		/** Variation description. */
		description?: string;
		/** Stock Keeping Unit. */
		sku?: string;
		/** GTIN, UPC, EAN or ISBN. */
		global_unique_id?: string;
		/** Variation regular price. */
		regular_price?: string;
		/** Variation sale price. */
		sale_price?: string;
		/** Start date of sale price, in the site's timezone. */
		date_on_sale_from?: string | null;
		/** Start date of sale price, as GMT. */
		date_on_sale_from_gmt?: string | null;
		/** End date of sale price, in the site's timezone. */
		date_on_sale_to?: string | null;
		/** End date of sale price, in the site's timezone. */
		date_on_sale_to_gmt?: string | null;
		/** Variation status. */
		status?: 'draft' | 'pending' | 'private' | 'publish';
		/** If the variation is virtual. */
		virtual?: boolean;
		/** If the variation is downloadable. */
		downloadable?: boolean;
		/** List of downloadable files. */
		downloads?: Array<{
			/** File ID. */
			id?: string;
			/** File name. */
			name?: string;
			/** File URL. */
			file?: string;
		}>;
		/** Number of times downloadable files can be downloaded after purchase. */
		download_limit?: number;
		/** Number of days until access to downloadable files expires. */
		download_expiry?: number;
		/** Tax status. */
		tax_status?: 'taxable' | 'shipping' | 'none';
		/** Tax class. */
		tax_class?: string;
		/** Stock management at variation level. */
		manage_stock?: boolean | string;
		/** Stock quantity. */
		stock_quantity?: number;
		/** Controls the stock status of the product. */
		stock_status?: 'instock' | 'outofstock' | 'onbackorder';
		/** If managing stock, this controls if backorders are allowed. */
		backorders?: 'no' | 'notify' | 'yes';
		/** Low Stock amount for the variation. */
		low_stock_amount?: number | null;
		/** Variation weight (lbs). */
		weight?: string;
		/** Variation dimensions. */
		dimensions?: {
			/** Variation length (in). */
			length?: string;
			/** Variation width (in). */
			width?: string;
			/** Variation height (in). */
			height?: string;
		};
		/** Shipping class slug. */
		shipping_class?: string;
		/** Variation image data. */
		image?: {
			/** Image ID. */
			id?: number;
			/** Image URL. */
			src?: string;
			/** Image name. */
			name?: string;
			/** Image alternative text. */
			alt?: string;
		};
		/** Variation gallery image IDs, excluding the featured image (which is set via "image"). Mirrors how galleries work on parent products. */
		gallery_image_ids?: Array<number>;
		/** List of attributes. */
		attributes?: Array<{
			/** Attribute ID. */
			id?: number;
			/** Attribute name. */
			name?: string;
			/** Selected attribute term name. */
			option?: string;
		}>;
		/** Menu order, used to custom sort products. */
		menu_order?: number;
		/** Meta data. */
		meta_data?: Array<{
			/** Meta key. */
			key?: string;
			/** Meta value. */
			value?: WoocommerceJsonValue;
		}>;
		/** Customs commodity code containing 6 to 14 digits. Punctuation and spaces are removed. In view context, an empty value inherits the parent value; in edit context, only the stored value is returned (null when inherited). */
		customs_commodity_code?: string | null;
		/** Two-letter country of origin code. In view context, an empty value inherits the parent value; in edit context, only the stored value is returned (null when inherited). */
		customs_country_of_origin?: string | null;
		/** Plain-text customs description, up to 35 characters, without emoji or special symbols such as ™. In view context, an empty value inherits the parent value; in edit context, only the stored value is returned (null when inherited). */
		customs_description?: string | null;
	};
	'products.variations.delete': {
		/** Unique identifier for the variable product. */
		product_id: number;
		/** Unique identifier for the variation. */
		id: number;
		/** Whether to bypass trash and force deletion. */
		force?: boolean;
	};
	'products.variations.generate': {
		/** Unique identifier for the variable product. */
		product_id: number;
		/** Deletes unused variations. */
		delete?: boolean;
		/** Default values for generated variations. */
		default_values?: {
			/** Variation description. */
			description?: string;
			/** Stock Keeping Unit. */
			sku?: string;
			/** GTIN, UPC, EAN or ISBN. */
			global_unique_id?: string;
			/** Variation regular price. */
			regular_price?: string;
			/** Variation sale price. */
			sale_price?: string;
			/** Start date of sale price, in the site's timezone. */
			date_on_sale_from?: string | null;
			/** Start date of sale price, as GMT. */
			date_on_sale_from_gmt?: string | null;
			/** End date of sale price, in the site's timezone. */
			date_on_sale_to?: string | null;
			/** End date of sale price, in the site's timezone. */
			date_on_sale_to_gmt?: string | null;
			/** Variation status. */
			status?: 'draft' | 'pending' | 'private' | 'publish';
			/** If the variation is virtual. */
			virtual?: boolean;
			/** If the variation is downloadable. */
			downloadable?: boolean;
			/** List of downloadable files. */
			downloads?: Array<{
				/** File ID. */
				id?: string;
				/** File name. */
				name?: string;
				/** File URL. */
				file?: string;
			}>;
			/** Number of times downloadable files can be downloaded after purchase. */
			download_limit?: number;
			/** Number of days until access to downloadable files expires. */
			download_expiry?: number;
			/** Tax status. */
			tax_status?: 'taxable' | 'shipping' | 'none';
			/** Tax class. */
			tax_class?: string;
			/** Stock management at variation level. */
			manage_stock?: boolean | string;
			/** Stock quantity. */
			stock_quantity?: number;
			/** Controls the stock status of the product. */
			stock_status?: 'instock' | 'outofstock' | 'onbackorder';
			/** If managing stock, this controls if backorders are allowed. */
			backorders?: 'no' | 'notify' | 'yes';
			/** Low Stock amount for the variation. */
			low_stock_amount?: number | null;
			/** Variation weight (lbs). */
			weight?: string;
			/** Variation dimensions. */
			dimensions?: {
				/** Variation length (in). */
				length?: string;
				/** Variation width (in). */
				width?: string;
				/** Variation height (in). */
				height?: string;
			};
			/** Shipping class slug. */
			shipping_class?: string;
			/** Variation image data. */
			image?: {
				/** Image ID. */
				id?: number;
				/** Image URL. */
				src?: string;
				/** Image name. */
				name?: string;
				/** Image alternative text. */
				alt?: string;
			};
			/** Variation gallery image IDs, excluding the featured image (which is set via "image"). Mirrors how galleries work on parent products. */
			gallery_image_ids?: Array<number>;
			/** List of attributes. */
			attributes?: Array<{
				/** Attribute ID. */
				id?: number;
				/** Attribute name. */
				name?: string;
				/** Selected attribute term name. */
				option?: string;
			}>;
			/** Menu order, used to custom sort products. */
			menu_order?: number;
			/** Meta data. */
			meta_data?: Array<{
				/** Meta key. */
				key?: string;
				/** Meta value. */
				value?: WoocommerceJsonValue;
			}>;
			/** Customs commodity code containing 6 to 14 digits. Punctuation and spaces are removed. In view context, an empty value inherits the parent value; in edit context, only the stored value is returned (null when inherited). */
			customs_commodity_code?: string | null;
			/** Two-letter country of origin code. In view context, an empty value inherits the parent value; in edit context, only the stored value is returned (null when inherited). */
			customs_country_of_origin?: string | null;
			/** Plain-text customs description, up to 35 characters, without emoji or special symbols such as ™. In view context, an empty value inherits the parent value; in edit context, only the stored value is returned (null when inherited). */
			customs_description?: string | null;
		};
		/** Variation description. */
		description?: string;
		/** Stock Keeping Unit. */
		sku?: string;
		/** GTIN, UPC, EAN or ISBN. */
		global_unique_id?: string;
		/** Variation regular price. */
		regular_price?: string;
		/** Variation sale price. */
		sale_price?: string;
		/** Start date of sale price, in the site's timezone. */
		date_on_sale_from?: string | null;
		/** Start date of sale price, as GMT. */
		date_on_sale_from_gmt?: string | null;
		/** End date of sale price, in the site's timezone. */
		date_on_sale_to?: string | null;
		/** End date of sale price, in the site's timezone. */
		date_on_sale_to_gmt?: string | null;
		/** Variation status. */
		status?: 'draft' | 'pending' | 'private' | 'publish';
		/** If the variation is virtual. */
		virtual?: boolean;
		/** If the variation is downloadable. */
		downloadable?: boolean;
		/** List of downloadable files. */
		downloads?: Array<{
			/** File ID. */
			id?: string;
			/** File name. */
			name?: string;
			/** File URL. */
			file?: string;
		}>;
		/** Number of times downloadable files can be downloaded after purchase. */
		download_limit?: number;
		/** Number of days until access to downloadable files expires. */
		download_expiry?: number;
		/** Tax status. */
		tax_status?: 'taxable' | 'shipping' | 'none';
		/** Tax class. */
		tax_class?: string;
		/** Stock management at variation level. */
		manage_stock?: boolean | string;
		/** Stock quantity. */
		stock_quantity?: number;
		/** Controls the stock status of the product. */
		stock_status?: 'instock' | 'outofstock' | 'onbackorder';
		/** If managing stock, this controls if backorders are allowed. */
		backorders?: 'no' | 'notify' | 'yes';
		/** Low Stock amount for the variation. */
		low_stock_amount?: number | null;
		/** Variation weight (lbs). */
		weight?: string;
		/** Variation dimensions. */
		dimensions?: {
			/** Variation length (in). */
			length?: string;
			/** Variation width (in). */
			width?: string;
			/** Variation height (in). */
			height?: string;
		};
		/** Shipping class slug. */
		shipping_class?: string;
		/** Variation image data. */
		image?: {
			/** Image ID. */
			id?: number;
			/** Image URL. */
			src?: string;
			/** Image name. */
			name?: string;
			/** Image alternative text. */
			alt?: string;
		};
		/** Variation gallery image IDs, excluding the featured image (which is set via "image"). Mirrors how galleries work on parent products. */
		gallery_image_ids?: Array<number>;
		/** List of attributes. */
		attributes?: Array<{
			/** Attribute ID. */
			id?: number;
			/** Attribute name. */
			name?: string;
			/** Selected attribute term name. */
			option?: string;
		}>;
		/** Menu order, used to custom sort products. */
		menu_order?: number;
		/** Meta data. */
		meta_data?: Array<{
			/** Meta key. */
			key?: string;
			/** Meta value. */
			value?: WoocommerceJsonValue;
		}>;
		/** Customs commodity code containing 6 to 14 digits. Punctuation and spaces are removed. In view context, an empty value inherits the parent value; in edit context, only the stored value is returned (null when inherited). */
		customs_commodity_code?: string | null;
		/** Two-letter country of origin code. In view context, an empty value inherits the parent value; in edit context, only the stored value is returned (null when inherited). */
		customs_country_of_origin?: string | null;
		/** Plain-text customs description, up to 35 characters, without emoji or special symbols such as ™. In view context, an empty value inherits the parent value; in edit context, only the stored value is returned (null when inherited). */
		customs_description?: string | null;
	};
	'products.variations.get': {
		/** Unique identifier for the variable product. */
		product_id: number;
		/** Unique identifier for the variation. */
		id: number;
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'edit';
		/** Image size to return. Accepts any registered WordPress image size. */
		image_size?: string;
	};
	'products.variations.list': {
		/** Unique identifier for the variable product. */
		product_id: number;
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'edit';
		/** Current page of the collection. */
		page?: number;
		/** Maximum number of items to be returned in result set. */
		per_page?: number;
		/** Limit results to those matching a string. */
		search?: string;
		/** Limit response to resources published after a given ISO8601 compliant date. */
		after?: string;
		/** Limit response to resources published before a given ISO8601 compliant date. */
		before?: string;
		/** Limit response to resources modified after a given ISO8601 compliant date. */
		modified_after?: string;
		/** Limit response to resources modified before a given ISO8601 compliant date. */
		modified_before?: string;
		/** Whether to consider GMT post dates when limiting response by published or modified date. */
		dates_are_gmt?: boolean;
		/** Ensure result set excludes specific IDs. */
		exclude?: Array<number>;
		/** Limit result set to specific ids. */
		include?: Array<number>;
		/** Offset the result set by a specific number of items. */
		offset?: number;
		/** Order sort attribute ascending or descending. */
		order?: 'asc' | 'desc';
		/** Sort collection by object attribute. */
		orderby?:
			| 'date'
			| 'id'
			| 'include'
			| 'title'
			| 'slug'
			| 'modified'
			| 'menu_order';
		/** Limit result set to those of particular parent IDs. */
		parent?: Array<number>;
		/** Limit result set to all items except those of a particular parent ID. */
		parent_exclude?: Array<number>;
		/** Limit result set to products with a specific slug. */
		slug?: string;
		/** Limit result set to products assigned a specific status. */
		status?:
			| 'any'
			| 'future'
			| 'trash'
			| 'draft'
			| 'pending'
			| 'private'
			| 'publish';
		/** Limit result set to products with specific SKU(s). Use commas to separate. */
		sku?: string;
		/** Limit result set to products on sale. */
		on_sale?: boolean;
		/** Limit result set to products based on a minimum price. */
		min_price?: string;
		/** Limit result set to products based on a maximum price. */
		max_price?: string;
		/** Limit meta_data to specific keys. */
		include_meta?: Array<string>;
		/** Ensure meta_data excludes specific keys. */
		exclude_meta?: Array<string>;
		/** Use a specific registered image size for the returned variation image src. Falls back to the full size if the requested size is not registered. */
		image_size?: string;
		/** Limit result set to products with specified stock status. */
		stock_status?: 'instock' | 'outofstock' | 'onbackorder';
		/** Limit result set to products with or without price. */
		has_price?: boolean;
		/** Limit result set to products with specified attributes. */
		attributes?: Array<{
			/** Attribute slug. */
			attribute?: string;
			/** Attribute term. */
			term?: string;
			/** Attribute terms. */
			terms?: Array<WoocommerceJsonValue>;
		}>;
		/** Limit result set to virtual product variations. */
		virtual?: boolean;
		/** Limit result set to downloadable product variations. */
		downloadable?: boolean;
		/** Limit result set to product variations with any of the statuses. */
		include_status?: Array<
			'any' | 'future' | 'trash' | 'draft' | 'pending' | 'private' | 'publish'
		>;
		/** Exclude product variations with any of the statuses from result set. */
		exclude_status?: Array<
			'future' | 'trash' | 'draft' | 'pending' | 'private' | 'publish'
		>;
		/** Limit result set to variations visible in Point of Sale. */
		pos_products_only?: boolean;
	};
	'products.variations.update': {
		/** Unique identifier for the variable product. */
		product_id: number;
		/** Unique identifier for the variation. */
		id: number;
		/** Variation description. */
		description?: string;
		/** Stock Keeping Unit. */
		sku?: string;
		/** GTIN, UPC, EAN or ISBN. */
		global_unique_id?: string;
		/** Variation regular price. */
		regular_price?: string;
		/** Variation sale price. */
		sale_price?: string;
		/** Start date of sale price, in the site's timezone. */
		date_on_sale_from?: string | null;
		/** Start date of sale price, as GMT. */
		date_on_sale_from_gmt?: string | null;
		/** End date of sale price, in the site's timezone. */
		date_on_sale_to?: string | null;
		/** End date of sale price, in the site's timezone. */
		date_on_sale_to_gmt?: string | null;
		/** Variation status. */
		status?: 'draft' | 'pending' | 'private' | 'publish';
		/** If the variation is virtual. */
		virtual?: boolean;
		/** If the variation is downloadable. */
		downloadable?: boolean;
		/** List of downloadable files. */
		downloads?: Array<{
			/** File ID. */
			id?: string;
			/** File name. */
			name?: string;
			/** File URL. */
			file?: string;
		}>;
		/** Number of times downloadable files can be downloaded after purchase. */
		download_limit?: number;
		/** Number of days until access to downloadable files expires. */
		download_expiry?: number;
		/** Tax status. */
		tax_status?: 'taxable' | 'shipping' | 'none';
		/** Tax class. */
		tax_class?: string;
		/** Stock management at variation level. */
		manage_stock?: boolean | string;
		/** Stock quantity. */
		stock_quantity?: number;
		/** Controls the stock status of the product. */
		stock_status?: 'instock' | 'outofstock' | 'onbackorder';
		/** If managing stock, this controls if backorders are allowed. */
		backorders?: 'no' | 'notify' | 'yes';
		/** Low Stock amount for the variation. */
		low_stock_amount?: number | null;
		/** Variation weight (lbs). */
		weight?: string;
		/** Variation dimensions. */
		dimensions?: {
			/** Variation length (in). */
			length?: string;
			/** Variation width (in). */
			width?: string;
			/** Variation height (in). */
			height?: string;
		};
		/** Shipping class slug. */
		shipping_class?: string;
		/** Variation image data. */
		image?: {
			/** Image ID. */
			id?: number;
			/** Image URL. */
			src?: string;
			/** Image name. */
			name?: string;
			/** Image alternative text. */
			alt?: string;
		};
		/** Variation gallery image IDs, excluding the featured image (which is set via "image"). Mirrors how galleries work on parent products. */
		gallery_image_ids?: Array<number>;
		/** List of attributes. */
		attributes?: Array<{
			/** Attribute ID. */
			id?: number;
			/** Attribute name. */
			name?: string;
			/** Selected attribute term name. */
			option?: string;
		}>;
		/** Menu order, used to custom sort products. */
		menu_order?: number;
		/** Meta data. */
		meta_data?: Array<{
			/** Meta key. */
			key?: string;
			/** Meta value. */
			value?: WoocommerceJsonValue;
		}>;
		/** Customs commodity code containing 6 to 14 digits. Punctuation and spaces are removed. In view context, an empty value inherits the parent value; in edit context, only the stored value is returned (null when inherited). */
		customs_commodity_code?: string | null;
		/** Two-letter country of origin code. In view context, an empty value inherits the parent value; in edit context, only the stored value is returned (null when inherited). */
		customs_country_of_origin?: string | null;
		/** Plain-text customs description, up to 35 characters, without emoji or special symbols such as ™. In view context, an empty value inherits the parent value; in edit context, only the stored value is returned (null when inherited). */
		customs_description?: string | null;
	};
	'refunds.list': {
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'edit';
		/** Current page of the collection. */
		page?: number;
		/** Maximum number of items to be returned in result set. */
		per_page?: number;
		/** Limit results to those matching a string. */
		search?: string;
		/** Limit response to resources published after a given ISO8601 compliant date. */
		after?: string;
		/** Limit response to resources published before a given ISO8601 compliant date. */
		before?: string;
		/** Limit response to resources modified after a given ISO8601 compliant date. */
		modified_after?: string;
		/** Limit response to resources modified before a given ISO8601 compliant date. */
		modified_before?: string;
		/** Whether to consider GMT post dates when limiting response by published or modified date. */
		dates_are_gmt?: boolean;
		/** Ensure result set excludes specific IDs. */
		exclude?: Array<number>;
		/** Limit result set to specific ids. */
		include?: Array<number>;
		/** Offset the result set by a specific number of items. */
		offset?: number;
		/** Order sort attribute ascending or descending. */
		order?: 'asc' | 'desc';
		/** Sort collection by object attribute. */
		orderby?: 'date' | 'id' | 'include' | 'title' | 'slug' | 'modified';
		/** Limit result set to those of particular parent IDs. */
		parent?: Array<number>;
		/** Limit result set to all items except those of a particular parent ID. */
		parent_exclude?: Array<number>;
		/** Number of decimal points to use in each resource. */
		dp?: number;
		/** Only show meta which is meant to be displayed for an order. */
		order_item_display_meta?: boolean;
		/** Limit meta_data to specific keys. */
		include_meta?: Array<string>;
		/** Ensure meta_data excludes specific keys. */
		exclude_meta?: Array<string>;
	};
	'reports.couponTotals': {
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view';
	};
	'reports.customerTotals': {
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view';
	};
	'reports.list': {
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view';
	};
	'reports.orderTotals': {
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view';
	};
	'reports.productTotals': {
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view';
	};
	'reports.reviewTotals': {
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view';
	};
	'reports.sales': {
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view';
		/** Report period. */
		period?: 'week' | 'month' | 'last_month' | 'year';
		/** Return sales for a specific start date, the date need to be in the YYYY-MM-DD format. */
		date_min?: string;
		/** Return sales for a specific end date, the date need to be in the YYYY-MM-DD format. */
		date_max?: string;
	};
	'reports.topSellers': {
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view';
		/** Report period. */
		period?: 'week' | 'month' | 'last_month' | 'year';
		/** Return sales for a specific start date, the date need to be in the YYYY-MM-DD format. */
		date_min?: string;
		/** Return sales for a specific end date, the date need to be in the YYYY-MM-DD format. */
		date_max?: string;
	};
	'settings.batch': {
		/** Settings group id (`general`, `products`, `tax`, `shipping`, `checkout`, `account`, `email`, `advanced` ...). */
		group_id: string;
		/** Records to create, each with the same fields as the create operation. */
		create?: Array<Record<string, WoocommerceJsonValue>>;
		/** Records to update, each with its `id` (settings: `id` and `value`) and the fields to change. */
		update?: Array<Record<string, WoocommerceJsonValue>>;
		/** Ids of records to delete (permanently). */
		delete?: Array<number>;
	};
	'settings.batchAll': {
		/** Records to create, each with the same fields as the create operation. */
		create?: Array<Record<string, WoocommerceJsonValue>>;
		/** Records to update, each with its `id` (settings: `id` and `value`) and the fields to change. */
		update?: Array<Record<string, WoocommerceJsonValue>>;
		/** Ids of records to delete (permanently). */
		delete?: Array<number>;
	};
	'settings.get': {
		/** Settings group id (`general`, `products`, `tax`, `shipping`, `checkout`, `account`, `email`, `advanced` ...). */
		group_id: string;
		/** Unique identifier for the resource. */
		id: string;
		/** Settings group ID. */
		group?: string;
	};
	'settings.groups': Record<string, never>;
	'settings.list': {
		/** Settings group id (`general`, `products`, `tax`, `shipping`, `checkout`, `account`, `email`, `advanced` ...). */
		group_id: string;
		/** Settings group ID. */
		group?: string;
	};
	'settings.update': {
		/** Settings group id (`general`, `products`, `tax`, `shipping`, `checkout`, `account`, `email`, `advanced` ...). */
		group_id: string;
		/** Unique identifier for the resource. */
		id: string;
		/** Settings group ID. */
		group?: string;
		/** Setting value. */
		value?: WoocommerceJsonValue;
	};
	'shipping.zones.create': {
		/** Shipping zone name. */
		name: string;
		/** Shipping zone order. */
		order?: number;
	};
	'shipping.zones.delete': {
		/** Unique ID for the resource. */
		id: number;
		/** Whether to bypass trash and force deletion. */
		force?: boolean;
	};
	'shipping.zones.get': {
		/** Unique ID for the resource. */
		id: number;
	};
	'shipping.zones.list': Record<string, never>;
	'shipping.zones.locations.list': {
		/** Unique ID for the resource. */
		id: number;
	};
	'shipping.zones.locations.replace': {
		/** Unique ID for the resource. */
		id: number;
		/** Shipping zone location code. */
		code?: string;
		/** Shipping zone location type. */
		type?: 'postcode' | 'state' | 'country' | 'continent';
	};
	'shipping.zones.methods.create': {
		/** Unique ID for the zone. */
		zone_id: number;
		/** Shipping method sort order. */
		order?: number;
		/** Shipping method enabled status. */
		enabled?: boolean;
		/** Shipping method settings. */
		settings?: {
			/** Setting value. */
			value?: string;
		};
		/** Shipping method ID. */
		method_id: WoocommerceJsonValue;
	};
	'shipping.zones.methods.delete': {
		/** Unique ID for the zone. */
		zone_id: number;
		/** Unique ID for the instance. */
		instance_id: number;
		/** Whether to bypass trash and force deletion. */
		force?: boolean;
	};
	'shipping.zones.methods.get': {
		/** Unique ID for the zone. */
		zone_id: number;
		/** Unique ID for the instance. */
		instance_id: number;
	};
	'shipping.zones.methods.list': {
		/** Unique ID for the zone. */
		zone_id: number;
	};
	'shipping.zones.methods.update': {
		/** Unique ID for the zone. */
		zone_id: number;
		/** Unique ID for the instance. */
		instance_id: number;
		/** Shipping method sort order. */
		order?: number;
		/** Shipping method enabled status. */
		enabled?: boolean;
		/** Shipping method settings. */
		settings?: {
			/** Setting value. */
			value?: string;
		};
	};
	'shipping.zones.update': {
		/** Unique ID for the resource. */
		id: number;
		/** Shipping zone name. */
		name?: string;
		/** Shipping zone order. */
		order?: number;
	};
	'shippingMethods.get': {
		/** Unique identifier for the resource. */
		id: string;
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view';
	};
	'shippingMethods.list': {
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view';
	};
	'systemStatus.get': {
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view';
	};
	'systemStatus.tools.get': {
		/** Unique identifier for the resource. */
		id: string;
	};
	'systemStatus.tools.list': {
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'edit';
	};
	'systemStatus.tools.run': {
		/** A unique identifier for the tool. */
		id: string;
		/** Tool name. */
		name?: string;
		/** What running the tool will do. */
		action?: string;
		/** Tool description. */
		description?: string;
		/** Did the tool run successfully? */
		success?: boolean;
		/** Tool return message. */
		message?: string;
	};
	'taxes.batch': {
		/** Records to create, each with the same fields as the create operation. */
		create?: Array<Record<string, WoocommerceJsonValue>>;
		/** Records to update, each with its `id` (settings: `id` and `value`) and the fields to change. */
		update?: Array<Record<string, WoocommerceJsonValue>>;
		/** Ids of records to delete (permanently). */
		delete?: Array<number>;
	};
	'taxes.classes.create': {
		/** Tax class name. */
		name: string;
	};
	'taxes.classes.delete': {
		/** Unique slug for the resource. */
		slug: string;
		/** Required to be true, as resource does not support trashing. */
		force?: boolean;
	};
	'taxes.classes.get': {
		/** Unique slug for the resource. */
		slug: string;
	};
	'taxes.classes.list': {
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'edit';
	};
	'taxes.create': {
		/** Country ISO 3166 code. */
		country?: string;
		/** State code. */
		state?: string;
		/** Postcode/ZIP, it doesn't support multiple values. Deprecated as of WooCommerce 5.3, 'postcodes' should be used instead. */
		postcode?: string;
		/** City name, it doesn't support multiple values. Deprecated as of WooCommerce 5.3, 'cities' should be used instead. */
		city?: string;
		/** Tax rate. */
		rate?: string;
		/** Tax rate name. */
		name?: string;
		/** Tax priority. */
		priority?: number;
		/** Whether or not this is a compound rate. */
		compound?: boolean;
		/** Whether or not this tax rate also gets applied to shipping. */
		shipping?: boolean;
		/** Indicates the order that will appear in queries. */
		order?: number;
		/** Tax class. */
		class?: 'standard' | 'reduced-rate' | 'zero-rate';
		/** List of postcodes / ZIPs. Introduced in WooCommerce 5.3. */
		postcodes?: Array<string>;
		/** List of city names. Introduced in WooCommerce 5.3. */
		cities?: Array<string>;
	};
	'taxes.delete': {
		/** Unique identifier for the resource. */
		id: number;
		/** Required to be true, as resource does not support trashing. */
		force?: boolean;
	};
	'taxes.get': {
		/** Unique identifier for the resource. */
		id: number;
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'edit';
	};
	'taxes.list': {
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'edit';
		/** Current page of the collection. */
		page?: number;
		/** Maximum number of items to be returned in result set. */
		per_page?: number;
		/** Offset the result set by a specific number of items. */
		offset?: number;
		/** Order sort attribute ascending or descending. */
		order?: 'asc' | 'desc';
		/** Sort collection by object attribute. */
		orderby?: 'id' | 'order' | 'priority';
		/** Sort by tax class. */
		class?: 'standard' | 'reduced-rate' | 'zero-rate';
	};
	'taxes.update': {
		/** Unique identifier for the resource. */
		id: number;
		/** Country ISO 3166 code. */
		country?: string;
		/** State code. */
		state?: string;
		/** Postcode/ZIP, it doesn't support multiple values. Deprecated as of WooCommerce 5.3, 'postcodes' should be used instead. */
		postcode?: string;
		/** City name, it doesn't support multiple values. Deprecated as of WooCommerce 5.3, 'cities' should be used instead. */
		city?: string;
		/** Tax rate. */
		rate?: string;
		/** Tax rate name. */
		name?: string;
		/** Tax priority. */
		priority?: number;
		/** Whether or not this is a compound rate. */
		compound?: boolean;
		/** Whether or not this tax rate also gets applied to shipping. */
		shipping?: boolean;
		/** Indicates the order that will appear in queries. */
		order?: number;
		/** Tax class. */
		class?: 'standard' | 'reduced-rate' | 'zero-rate';
		/** List of postcodes / ZIPs. Introduced in WooCommerce 5.3. */
		postcodes?: Array<string>;
		/** List of city names. Introduced in WooCommerce 5.3. */
		cities?: Array<string>;
	};
	'variations.list': {
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'edit';
		/** Current page of the collection. */
		page?: number;
		/** Maximum number of items to be returned in result set. */
		per_page?: number;
		/** Limit results to those matching a string. */
		search?: string;
		/** Limit response to resources published after a given ISO8601 compliant date. */
		after?: string;
		/** Limit response to resources published before a given ISO8601 compliant date. */
		before?: string;
		/** Limit response to resources modified after a given ISO8601 compliant date. */
		modified_after?: string;
		/** Limit response to resources modified before a given ISO8601 compliant date. */
		modified_before?: string;
		/** Whether to consider GMT post dates when limiting response by published or modified date. */
		dates_are_gmt?: boolean;
		/** Ensure result set excludes specific IDs. */
		exclude?: Array<number>;
		/** Limit result set to specific ids. */
		include?: Array<number>;
		/** Offset the result set by a specific number of items. */
		offset?: number;
		/** Order sort attribute ascending or descending. */
		order?: 'asc' | 'desc';
		/** Sort collection by object attribute. */
		orderby?:
			| 'date'
			| 'id'
			| 'include'
			| 'title'
			| 'slug'
			| 'modified'
			| 'menu_order';
		/** Limit result set to those of particular parent IDs. */
		parent?: Array<number>;
		/** Limit result set to all items except those of a particular parent ID. */
		parent_exclude?: Array<number>;
		/** Limit result set to products with a specific slug. */
		slug?: string;
		/** Limit result set to products assigned a specific status. */
		status?:
			| 'any'
			| 'future'
			| 'trash'
			| 'draft'
			| 'pending'
			| 'private'
			| 'publish';
		/** Limit result set to products with specific SKU(s). Use commas to separate. */
		sku?: string;
		/** Limit result set to products on sale. */
		on_sale?: boolean;
		/** Limit result set to products based on a minimum price. */
		min_price?: string;
		/** Limit result set to products based on a maximum price. */
		max_price?: string;
		/** Limit meta_data to specific keys. */
		include_meta?: Array<string>;
		/** Ensure meta_data excludes specific keys. */
		exclude_meta?: Array<string>;
		/** Use a specific registered image size for the returned variation image src. Falls back to the full size if the requested size is not registered. */
		image_size?: string;
		/** Limit result set to products with specified stock status. */
		stock_status?: 'instock' | 'outofstock' | 'onbackorder';
		/** Limit result set to products with or without price. */
		has_price?: boolean;
		/** Limit result set to products with specified attributes. */
		attributes?: Array<{
			/** Attribute slug. */
			attribute?: string;
			/** Attribute term. */
			term?: string;
			/** Attribute terms. */
			terms?: Array<WoocommerceJsonValue>;
		}>;
		/** Limit result set to virtual product variations. */
		virtual?: boolean;
		/** Limit result set to downloadable product variations. */
		downloadable?: boolean;
		/** Limit result set to product variations with any of the statuses. */
		include_status?: Array<
			'any' | 'future' | 'trash' | 'draft' | 'pending' | 'private' | 'publish'
		>;
		/** Exclude product variations with any of the statuses from result set. */
		exclude_status?: Array<
			'future' | 'trash' | 'draft' | 'pending' | 'private' | 'publish'
		>;
		/** Limit result set to variations visible in Point of Sale. */
		pos_products_only?: boolean;
	};
	'webhooks.batch': {
		/** Records to create, each with the same fields as the create operation. */
		create?: Array<Record<string, WoocommerceJsonValue>>;
		/** Records to update, each with its `id` (settings: `id` and `value`) and the fields to change. */
		update?: Array<Record<string, WoocommerceJsonValue>>;
		/** Ids of records to delete (permanently). */
		delete?: Array<number>;
	};
	'webhooks.create': {
		/** A friendly name for the webhook. */
		name?: string;
		/** Webhook status. */
		status?: 'active' | 'paused' | 'disabled';
		/** Webhook topic. */
		topic: string;
		/** Secret key used to generate a hash of the delivered webhook and provided in the request headers. This will default to a MD5 hash from the current user's ID|username if not provided. */
		secret?: string;
		/** Webhook delivery URL. */
		delivery_url: string;
	};
	'webhooks.delete': {
		/** Unique identifier for the resource. */
		id: number;
		/** Required to be true, as resource does not support trashing. */
		force?: boolean;
	};
	'webhooks.get': {
		/** Unique identifier for the resource. */
		id: number;
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'edit';
	};
	'webhooks.list': {
		/** Scope under which the request is made; determines fields present in response. */
		context?: 'view' | 'edit';
		/** Current page of the collection. */
		page?: number;
		/** Maximum number of items to be returned in result set. */
		per_page?: number;
		/** Limit results to those matching a string. */
		search?: string;
		/** Limit response to resources published after a given ISO8601 compliant date. */
		after?: string;
		/** Limit response to resources published before a given ISO8601 compliant date. */
		before?: string;
		/** Ensure result set excludes specific IDs. */
		exclude?: Array<number>;
		/** Limit result set to specific ids. */
		include?: Array<number>;
		/** Offset the result set by a specific number of items. Takes precedence over the page parameter. */
		offset?: number;
		/** Order sort attribute ascending or descending. */
		order?: 'asc' | 'desc';
		/** Sort collection by object attribute. */
		orderby?: 'date' | 'id' | 'title';
		/** Limit result set to webhooks assigned a specific status. */
		status?: 'all' | 'active' | 'paused' | 'disabled';
	};
	'webhooks.update': {
		/** Unique identifier for the resource. */
		id: number;
		/** A friendly name for the webhook. */
		name?: string;
		/** Webhook status. */
		status?: 'active' | 'paused' | 'disabled';
		/** Webhook topic. */
		topic?: string;
		/** Secret key used to generate a hash of the delivered webhook and provided in the request headers. This will default to a MD5 hash from the current user's ID|username if not provided. */
		secret?: string;
	};
};

export type WoocommerceOperationOutputs = {
	'coupons.batch': {
		create?: Array<WoocommerceBatch> | null;
		update?: Array<WoocommerceBatch> | null;
		delete?: Array<WoocommerceBatch> | null;
		[key: string]: unknown;
	};
	'coupons.create': WoocommerceShopCoupon;
	'coupons.delete':
		| {
				/** Whether the record was deleted. */
				deleted?: boolean | null;
				previous?: WoocommerceShopCoupon | null;
				[key: string]: unknown;
		  }
		| WoocommerceShopCoupon;
	'coupons.get': WoocommerceShopCoupon;
	'coupons.list': {
		/** One page of results. */
		items: Array<WoocommerceShopCoupon>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'coupons.update': WoocommerceShopCoupon;
	'customers.batch': {
		create?: Array<WoocommerceBatch> | null;
		update?: Array<WoocommerceBatch> | null;
		delete?: Array<WoocommerceBatch> | null;
		[key: string]: unknown;
	};
	'customers.create': WoocommerceCustomer;
	'customers.delete':
		| {
				/** Whether the record was deleted. */
				deleted?: boolean | null;
				previous?: WoocommerceCustomer | null;
				[key: string]: unknown;
		  }
		| WoocommerceCustomer;
	'customers.downloads': Array<WoocommerceCustomerDownload>;
	'customers.get': WoocommerceCustomer;
	'customers.list': {
		/** One page of results. */
		items: Array<WoocommerceCustomer>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'customers.update': WoocommerceCustomer;
	'data.continents.get': WoocommerceDataContinents;
	'data.continents.list': Array<WoocommerceDataContinents>;
	'data.countries.get': WoocommerceDataCountries;
	'data.countries.list': Array<WoocommerceDataCountries>;
	'data.currencies.current': WoocommerceDataCurrencies;
	'data.currencies.get': WoocommerceDataCurrencies;
	'data.currencies.list': Array<WoocommerceDataCurrencies>;
	'data.index': Array<WoocommerceDataIndex>;
	'orders.batch': {
		create?: Array<WoocommerceBatch> | null;
		update?: Array<WoocommerceBatch> | null;
		delete?: Array<WoocommerceBatch> | null;
		[key: string]: unknown;
	};
	'orders.create': WoocommerceShopOrder;
	'orders.delete':
		| {
				/** Whether the record was deleted. */
				deleted?: boolean | null;
				previous?: WoocommerceShopOrder | null;
				[key: string]: unknown;
		  }
		| WoocommerceShopOrder;
	'orders.emailTemplates': Array<WoocommerceEmailTemplate>;
	'orders.get': WoocommerceShopOrder;
	'orders.list': {
		/** One page of results. */
		items: Array<WoocommerceShopOrder>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'orders.notes.create': WoocommerceOrderNote;
	'orders.notes.delete':
		| {
				/** Whether the record was deleted. */
				deleted?: boolean | null;
				previous?: WoocommerceOrderNote | null;
				[key: string]: unknown;
		  }
		| WoocommerceOrderNote;
	'orders.notes.get': WoocommerceOrderNote;
	'orders.notes.list': Array<WoocommerceOrderNote>;
	'orders.receipt.create': WoocommerceJsonValue;
	'orders.receipt.get': WoocommerceJsonValue;
	'orders.refunds.create': WoocommerceShopOrderRefund;
	'orders.refunds.delete':
		| {
				/** Whether the record was deleted. */
				deleted?: boolean | null;
				previous?: WoocommerceShopOrderRefund | null;
				[key: string]: unknown;
		  }
		| WoocommerceShopOrderRefund;
	'orders.refunds.get': WoocommerceShopOrderRefund;
	'orders.refunds.list': {
		/** One page of results. */
		items: Array<WoocommerceShopOrderRefund>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'orders.refunds.preview': WoocommerceOrderRefundPreview;
	'orders.sendEmail': WoocommerceOrderActions;
	'orders.sendOrderDetails': WoocommerceOrderActions;
	'orders.statuses': Array<WoocommerceOrderStatus>;
	'orders.update': WoocommerceShopOrder;
	'paymentGateways.get': WoocommercePaymentGateway;
	'paymentGateways.list': Array<WoocommercePaymentGateway>;
	'paymentGateways.update': WoocommercePaymentGateway;
	'products.attributes.batch': {
		create?: Array<WoocommerceBatch> | null;
		update?: Array<WoocommerceBatch> | null;
		delete?: Array<WoocommerceBatch> | null;
		[key: string]: unknown;
	};
	'products.attributes.create': WoocommerceProductAttribute;
	'products.attributes.delete':
		| {
				/** Whether the record was deleted. */
				deleted?: boolean | null;
				previous?: WoocommerceProductAttribute | null;
				[key: string]: unknown;
		  }
		| WoocommerceProductAttribute;
	'products.attributes.get': WoocommerceProductAttribute;
	'products.attributes.list': Array<WoocommerceProductAttribute>;
	'products.attributes.terms.batch': {
		create?: Array<WoocommerceBatch> | null;
		update?: Array<WoocommerceBatch> | null;
		delete?: Array<WoocommerceBatch> | null;
		[key: string]: unknown;
	};
	'products.attributes.terms.create': WoocommerceProductAttributeTerm;
	'products.attributes.terms.delete':
		| {
				/** Whether the record was deleted. */
				deleted?: boolean | null;
				previous?: WoocommerceProductAttributeTerm | null;
				[key: string]: unknown;
		  }
		| WoocommerceProductAttributeTerm;
	'products.attributes.terms.get': WoocommerceProductAttributeTerm;
	'products.attributes.terms.list': {
		/** One page of results. */
		items: Array<WoocommerceProductAttributeTerm>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'products.attributes.terms.update': WoocommerceProductAttributeTerm;
	'products.attributes.update': WoocommerceProductAttribute;
	'products.batch': {
		create?: Array<WoocommerceBatch> | null;
		update?: Array<WoocommerceBatch> | null;
		delete?: Array<WoocommerceBatch> | null;
		[key: string]: unknown;
	};
	'products.brands.batch': {
		create?: Array<WoocommerceBatch> | null;
		update?: Array<WoocommerceBatch> | null;
		delete?: Array<WoocommerceBatch> | null;
		[key: string]: unknown;
	};
	'products.brands.create': WoocommerceProductBrand;
	'products.brands.delete':
		| {
				/** Whether the record was deleted. */
				deleted?: boolean | null;
				previous?: WoocommerceProductBrand | null;
				[key: string]: unknown;
		  }
		| WoocommerceProductBrand;
	'products.brands.get': WoocommerceProductBrand;
	'products.brands.list': {
		/** One page of results. */
		items: Array<WoocommerceProductBrand>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'products.brands.update': WoocommerceProductBrand;
	'products.categories.batch': {
		create?: Array<WoocommerceBatch> | null;
		update?: Array<WoocommerceBatch> | null;
		delete?: Array<WoocommerceBatch> | null;
		[key: string]: unknown;
	};
	'products.categories.create': WoocommerceProductCat;
	'products.categories.delete':
		| {
				/** Whether the record was deleted. */
				deleted?: boolean | null;
				previous?: WoocommerceProductCat | null;
				[key: string]: unknown;
		  }
		| WoocommerceProductCat;
	'products.categories.get': WoocommerceProductCat;
	'products.categories.list': {
		/** One page of results. */
		items: Array<WoocommerceProductCat>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'products.categories.update': WoocommerceProductCat;
	'products.create': WoocommerceProduct;
	'products.customFieldNames': Array<string | number>;
	'products.delete':
		| {
				/** Whether the record was deleted. */
				deleted?: boolean | null;
				previous?: WoocommerceProduct | null;
				[key: string]: unknown;
		  }
		| WoocommerceProduct;
	'products.duplicate': WoocommerceProduct;
	'products.get': WoocommerceProduct;
	'products.list': {
		/** One page of results. */
		items: Array<WoocommerceProduct>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'products.related': Record<string, WoocommerceJsonValue>;
	'products.reviews.batch': {
		create?: Array<WoocommerceBatch> | null;
		update?: Array<WoocommerceBatch> | null;
		delete?: Array<WoocommerceBatch> | null;
		[key: string]: unknown;
	};
	'products.reviews.create': WoocommerceProductReview;
	'products.reviews.delete':
		| {
				/** Whether the record was deleted. */
				deleted?: boolean | null;
				previous?: WoocommerceProductReview | null;
				[key: string]: unknown;
		  }
		| WoocommerceProductReview;
	'products.reviews.get': WoocommerceProductReview;
	'products.reviews.list': {
		/** One page of results. */
		items: Array<WoocommerceProductReview>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'products.reviews.update': WoocommerceProductReview;
	'products.shippingClasses.batch': {
		create?: Array<WoocommerceBatch> | null;
		update?: Array<WoocommerceBatch> | null;
		delete?: Array<WoocommerceBatch> | null;
		[key: string]: unknown;
	};
	'products.shippingClasses.create': WoocommerceProductShippingClass;
	'products.shippingClasses.delete':
		| {
				/** Whether the record was deleted. */
				deleted?: boolean | null;
				previous?: WoocommerceProductShippingClass | null;
				[key: string]: unknown;
		  }
		| WoocommerceProductShippingClass;
	'products.shippingClasses.get': WoocommerceProductShippingClass;
	'products.shippingClasses.list': {
		/** One page of results. */
		items: Array<WoocommerceProductShippingClass>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'products.shippingClasses.suggestSlug': string | number;
	'products.shippingClasses.update': WoocommerceProductShippingClass;
	'products.suggested': {
		/** One page of results. */
		items: Array<WoocommerceProduct>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'products.tags.batch': {
		create?: Array<WoocommerceBatch> | null;
		update?: Array<WoocommerceBatch> | null;
		delete?: Array<WoocommerceBatch> | null;
		[key: string]: unknown;
	};
	'products.tags.create': WoocommerceProductTag;
	'products.tags.delete':
		| {
				/** Whether the record was deleted. */
				deleted?: boolean | null;
				previous?: WoocommerceProductTag | null;
				[key: string]: unknown;
		  }
		| WoocommerceProductTag;
	'products.tags.get': WoocommerceProductTag;
	'products.tags.list': {
		/** One page of results. */
		items: Array<WoocommerceProductTag>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'products.tags.update': WoocommerceProductTag;
	'products.update': WoocommerceProduct;
	'products.variations.batch': {
		create?: Array<WoocommerceBatch> | null;
		update?: Array<WoocommerceBatch> | null;
		delete?: Array<WoocommerceBatch> | null;
		[key: string]: unknown;
	};
	'products.variations.create': WoocommerceProductVariation;
	'products.variations.delete':
		| {
				/** Whether the record was deleted. */
				deleted?: boolean | null;
				previous?: WoocommerceProductVariation | null;
				[key: string]: unknown;
		  }
		| WoocommerceProductVariation;
	'products.variations.generate': WoocommerceProductVariation;
	'products.variations.get': WoocommerceProductVariation;
	'products.variations.list': {
		/** One page of results. */
		items: Array<WoocommerceProductVariation>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'products.variations.update': WoocommerceProductVariation;
	'refunds.list': {
		/** One page of results. */
		items: Array<WoocommerceShopOrderRefund2>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'reports.couponTotals': Array<WoocommerceReportCouponTotal>;
	'reports.customerTotals': Array<WoocommerceReportCustomerTotal>;
	'reports.list': Array<WoocommerceReport>;
	'reports.orderTotals': Array<WoocommerceReportOrderTotal>;
	'reports.productTotals': Array<WoocommerceReportProductTotal>;
	'reports.reviewTotals': Array<WoocommerceReportReviewTotal>;
	'reports.sales': Array<WoocommerceSalesReport>;
	'reports.topSellers': Array<WoocommerceTopSellersReport>;
	'settings.batch': {
		create?: Array<WoocommerceBatch> | null;
		update?: Array<WoocommerceBatch> | null;
		delete?: Array<WoocommerceBatch> | null;
		[key: string]: unknown;
	};
	'settings.batchAll': {
		create?: Array<WoocommerceBatch> | null;
		update?: Array<WoocommerceBatch> | null;
		delete?: Array<WoocommerceBatch> | null;
		[key: string]: unknown;
	};
	'settings.get': WoocommerceSetting;
	'settings.groups': Array<WoocommerceSettingGroup>;
	'settings.list': Array<WoocommerceSetting>;
	'settings.update': WoocommerceSetting;
	'shipping.zones.create': WoocommerceShippingZone;
	'shipping.zones.delete':
		| {
				/** Whether the record was deleted. */
				deleted?: boolean | null;
				previous?: WoocommerceShippingZone | null;
				[key: string]: unknown;
		  }
		| WoocommerceShippingZone;
	'shipping.zones.get': WoocommerceShippingZone;
	'shipping.zones.list': Array<WoocommerceShippingZone>;
	'shipping.zones.locations.list': Array<WoocommerceShippingZoneLocation>;
	'shipping.zones.locations.replace': Array<WoocommerceShippingZoneLocation>;
	'shipping.zones.methods.create': WoocommerceShippingZoneMethod;
	'shipping.zones.methods.delete':
		| {
				/** Whether the record was deleted. */
				deleted?: boolean | null;
				previous?: WoocommerceShippingZoneMethod | null;
				[key: string]: unknown;
		  }
		| WoocommerceShippingZoneMethod;
	'shipping.zones.methods.get': WoocommerceShippingZoneMethod;
	'shipping.zones.methods.list': Array<WoocommerceShippingZoneMethod>;
	'shipping.zones.methods.update': WoocommerceShippingZoneMethod;
	'shipping.zones.update': WoocommerceShippingZone;
	'shippingMethods.get': WoocommerceShippingMethod;
	'shippingMethods.list': Array<WoocommerceShippingMethod>;
	'systemStatus.get': WoocommerceSystemStatus;
	'systemStatus.tools.get': WoocommerceSystemStatusTool;
	'systemStatus.tools.list': Array<WoocommerceSystemStatusTool>;
	'systemStatus.tools.run': WoocommerceSystemStatusTool;
	'taxes.batch': {
		create?: Array<WoocommerceBatch> | null;
		update?: Array<WoocommerceBatch> | null;
		delete?: Array<WoocommerceBatch> | null;
		[key: string]: unknown;
	};
	'taxes.classes.create': WoocommerceTaxClass;
	'taxes.classes.delete':
		| {
				/** Whether the record was deleted. */
				deleted?: boolean | null;
				previous?: WoocommerceTaxClass | null;
				[key: string]: unknown;
		  }
		| WoocommerceTaxClass;
	'taxes.classes.get': Array<WoocommerceTaxClass>;
	'taxes.classes.list': Array<WoocommerceTaxClass>;
	'taxes.create': WoocommerceTax;
	'taxes.delete':
		| {
				/** Whether the record was deleted. */
				deleted?: boolean | null;
				previous?: WoocommerceTax | null;
				[key: string]: unknown;
		  }
		| WoocommerceTax;
	'taxes.get': WoocommerceTax;
	'taxes.list': {
		/** One page of results. */
		items: Array<WoocommerceTax>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'taxes.update': WoocommerceTax;
	'variations.list': {
		/** One page of results. */
		items: Array<WoocommerceProductVariation>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'webhooks.batch': {
		create?: Array<WoocommerceBatch> | null;
		update?: Array<WoocommerceBatch> | null;
		delete?: Array<WoocommerceBatch> | null;
		[key: string]: unknown;
	};
	'webhooks.create': WoocommerceWebhook;
	'webhooks.delete':
		| {
				/** Whether the record was deleted. */
				deleted?: boolean | null;
				previous?: WoocommerceWebhook | null;
				[key: string]: unknown;
		  }
		| WoocommerceWebhook;
	'webhooks.get': WoocommerceWebhook;
	'webhooks.list': {
		/** One page of results. */
		items: Array<WoocommerceWebhook>;
		/** The page to ask for next, or null on the last page. */
		next_page: number | null;
	};
	'webhooks.update': WoocommerceWebhook;
};
