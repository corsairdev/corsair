import { z } from 'zod';

// Response parsing is lenient on purpose: the live API sends numbers as strings
// (prices, gift card denominations), 0/1 for booleans, and nulls for absent fields.
// Inputs stay strict.
const NumLike = z.union([z.number(), z.string()]);
const BoolLike = z.union([z.boolean(), z.number()]);

// Shared Models mirroring Handwrytten API OpenAPI 3.15.0 responses

export const PaginationSchema = z
	.object({
		is_last: BoolLike.nullable().optional(),
		next: NumLike.nullable().optional(),
		per_page: NumLike.nullable().optional(),
	})
	.passthrough();

export type Pagination = z.infer<typeof PaginationSchema>;

export const CardDimensionSchema = z
	.object({
		id: NumLike.nullable().optional(),
		closed_height: NumLike.nullable().optional(),
		closed_width: NumLike.nullable().optional(),
		character_width: NumLike.nullable().optional(),
		character_height: NumLike.nullable().optional(),
		orientation: z.string().nullable().optional(),
		open_height: NumLike.nullable().optional(),
		open_width: NumLike.nullable().optional(),
	})
	.passthrough();

export type CardDimension = z.infer<typeof CardDimensionSchema>;

export const CardSchema = z
	.object({
		id: NumLike,
		name: z.string().nullable().optional(),
		title: z.string().nullable().optional(),
		description: z.string().nullable().optional(),
		dimension_id: NumLike.nullable().optional(),
		cover: z.string().nullable().optional(),
		inside_image: z.string().nullable().optional(),
		price: NumLike.nullable().optional(),
		category_id: NumLike.nullable().optional(),
		category_name: z.string().nullable().optional(),
		orientation: z.string().nullable().optional(),
		card_dimension: CardDimensionSchema.nullable().optional(),
	})
	.passthrough();

export type Card = z.infer<typeof CardSchema>;

export const CategorySchema = z
	.object({
		id: NumLike,
		name: z.string(),
		slug: z.string().nullable().optional(),
		meta_title: z.string().nullable().optional(),
		meta_description: z.string().nullable().optional(),
	})
	.passthrough();

export type Category = z.infer<typeof CategorySchema>;

export const FontSchema = z
	.object({
		id: z.string(),
		label: z.string().nullable().optional(),
		font_name: z.string().nullable().optional(),
		image: z.string().nullable().optional(),
		path: z.string().nullable().optional(),
		font_id: NumLike.nullable().optional(),
		line_spacing: NumLike.nullable().optional(),
	})
	.passthrough();

export type Font = z.infer<typeof FontSchema>;

export const SignatureSchema = z
	.object({
		id: NumLike,
		preview: z.string().nullable().optional(),
		name: z.string().nullable().optional(),
	})
	.passthrough();

export type Signature = z.infer<typeof SignatureSchema>;

export const CountrySchema = z
	.object({
		id: NumLike.nullable().optional(),
		name: z.string(),
		short_name: z.string().nullable().optional(),
		code: z.string().nullable().optional(),
	})
	.passthrough();

export type Country = z.infer<typeof CountrySchema>;

export const StateSchema = z
	.object({
		id: NumLike.nullable().optional(),
		name: z.string(),
		short_name: z.string().nullable().optional(),
	})
	.passthrough();

export type State = z.infer<typeof StateSchema>;

export const SavedAddressSchema = z
	.object({
		id: NumLike.nullable().optional(),
		address_id: NumLike.nullable().optional(),
		name: z.string().nullable().optional(),
		first_name: z.string().nullable().optional(),
		last_name: z.string().nullable().optional(),
		business_name: z.string().nullable().optional(),
		address1: z.string().nullable().optional(),
		address2: z.string().nullable().optional(),
		city: z.string().nullable().optional(),
		state: z.string().nullable().optional(),
		zip: NumLike.nullable().optional(),
		country: z.string().nullable().optional(),
		country_id: NumLike.nullable().optional(),
	})
	.passthrough();

export type SavedAddress = z.infer<typeof SavedAddressSchema>;

export const TemplateCategorySchema = z
	.object({
		id: NumLike,
		name: z.string(),
		price: NumLike.nullable().optional(),
	})
	.passthrough();

export type TemplateCategory = z.infer<typeof TemplateCategorySchema>;

export const TemplateSchema = z
	.object({
		id: NumLike,
		category_id: NumLike.nullable().optional(),
		name: z.string().nullable().optional(),
		message: z.string().nullable().optional(),
		wishes: z.string().nullable().optional(),
	})
	.passthrough();

export type Template = z.infer<typeof TemplateSchema>;

export const DenominationSchema = z
	.object({
		id: NumLike,
		nominal: NumLike.nullable().optional(),
		price: NumLike.nullable().optional(),
	})
	.passthrough();

export type Denomination = z.infer<typeof DenominationSchema>;

export const GiftCardSchema = z
	.object({
		id: NumLike,
		name: z.string().nullable().optional(),
		image: z.string().nullable().optional(),
		denominations: z.array(DenominationSchema).nullable().optional(),
	})
	.passthrough();

export type GiftCard = z.infer<typeof GiftCardSchema>;

export const InsertSchema = z
	.object({
		id: NumLike,
		name: z.string().nullable().optional(),
		image: z.string().nullable().optional(),
		price: NumLike.nullable().optional(),
	})
	.passthrough();

export type Insert = z.infer<typeof InsertSchema>;

export const BundleSchema = z
	.object({
		id: NumLike,
		name: z.string().nullable().optional(),
		description: z.string().nullable().optional(),
		price: NumLike.nullable().optional(),
		delivery_cost: NumLike.nullable().optional(),
	})
	.passthrough();

export type Bundle = z.infer<typeof BundleSchema>;

export const QRCodeSchema = z
	.object({
		id: NumLike,
		name: z.string().nullable().optional(),
		url: z.string().nullable().optional(),
	})
	.passthrough();

export type QRCode = z.infer<typeof QRCodeSchema>;

export const StampOptionSchema = z
	.object({
		id: NumLike,
		name: z.string().nullable().optional(),
		description: z.string().nullable().optional(),
		price: NumLike.nullable().optional(),
	})
	.passthrough();

export type StampOption = z.infer<typeof StampOptionSchema>;

export const CustomImageSchema = z
	.object({
		id: NumLike,
		src: z.string().nullable().optional(),
		type: z.string().nullable().optional(),
	})
	.passthrough();

export type CustomImage = z.infer<typeof CustomImageSchema>;

export const PresetImageSchema = z
	.object({
		id: NumLike,
		src: z.string().nullable().optional(),
		name: z.string().nullable().optional(),
	})
	.passthrough();

export type PresetImage = z.infer<typeof PresetImageSchema>;

// ── Cards Endpoints ───────────────────────────────────────────────────────────

export const CardsListInputSchema = z
	.object({
		category_id: z.number().int().optional(),
		with_images: z.boolean().optional(),
		with_detailed_images: z.boolean().optional(),
		page: z.number().int().nonnegative().optional(),
		lowres: z.boolean().optional(),
	})
	.strict();

export type CardsListInput = z.infer<typeof CardsListInputSchema>;

export const CardsListResponseSchema = z
	.object({
		httpCode: NumLike.nullable().optional(),
		status: z.union([z.string(), z.number()]).nullable().optional(),
		cards: z.array(CardSchema).nullable().optional(),
		pagination: PaginationSchema.nullable().optional(),
	})
	.passthrough();

export type CardsListResponse = z.infer<typeof CardsListResponseSchema>;

export const CardsGetInputSchema = z
	.object({
		card_id: z.number().int().positive('Card ID must be positive'),
		lowres: z.boolean().optional(),
	})
	.strict();

export type CardsGetInput = z.infer<typeof CardsGetInputSchema>;

export const CardsGetResponseSchema = z
	.object({
		httpCode: NumLike.nullable().optional(),
		status: z.union([z.string(), z.number()]).nullable().optional(),
		card: CardSchema.nullable().optional(),
	})
	.passthrough();

export type CardsGetResponse = z.infer<typeof CardsGetResponseSchema>;

export const CardsSectionsInputSchema = z
	.object({
		category_id: z.number().int().optional(),
		with_images: z.boolean().optional(),
		with_detailed_images: z.boolean().optional(),
		page: z.number().int().nonnegative().optional(),
		lowres: z.boolean().optional(),
	})
	.strict();

export type CardsSectionsInput = z.infer<typeof CardsSectionsInputSchema>;

export const CardsSectionsResponseSchema = z
	.object({
		httpCode: NumLike.nullable().optional(),
		status: z.union([z.string(), z.number()]).nullable().optional(),
		// `unknown` because cards sections payload returns dynamic heterogeneous category trees.
		cards: z.unknown().optional(),
		discount: z.unknown().optional(),
	})
	.passthrough();

export type CardsSectionsResponse = z.infer<typeof CardsSectionsResponseSchema>;

export const CardsCategoriesInputSchema = z.object({}).strict();
export type CardsCategoriesInput = z.infer<typeof CardsCategoriesInputSchema>;

export const CardsCategoriesResponseSchema = z
	.object({
		httpCode: NumLike.nullable().optional(),
		status: z.union([z.string(), z.number()]).nullable().optional(),
		categories: z.array(CategorySchema).nullable().optional(),
	})
	.passthrough();

export type CardsCategoriesResponse = z.infer<
	typeof CardsCategoriesResponseSchema
>;

// ── Custom Cards Endpoints ────────────────────────────────────────────────────

export const CustomCardsDimensionsInputSchema = z
	.object({
		orientation: z.string().optional(),
		format: z.string().optional(),
	})
	.strict();

export type CustomCardsDimensionsInput = z.infer<
	typeof CustomCardsDimensionsInputSchema
>;

export const CustomCardsDimensionsResponseSchema = z
	.object({
		httpCode: NumLike.nullable().optional(),
		status: z.union([z.string(), z.number()]).nullable().optional(),
		dimensions: z.array(CardDimensionSchema).nullable().optional(),
	})
	.passthrough();

export type CustomCardsDimensionsResponse = z.infer<
	typeof CustomCardsDimensionsResponseSchema
>;

export const CustomCardsPresetImagesInputSchema = z
	.object({
		dimension_id: z.number().int().positive('dimension_id is required'),
	})
	.strict();

export type CustomCardsPresetImagesInput = z.infer<
	typeof CustomCardsPresetImagesInputSchema
>;

export const CustomCardsPresetImagesResponseSchema = z
	.object({
		httpCode: NumLike.nullable().optional(),
		status: z.union([z.string(), z.number()]).nullable().optional(),
		images: z.array(PresetImageSchema).nullable().optional(),
	})
	.passthrough();

export type CustomCardsPresetImagesResponse = z.infer<
	typeof CustomCardsPresetImagesResponseSchema
>;

export const CustomCardsListImagesInputSchema = z
	.object({
		type: z.enum(['logo', 'cover']).optional(),
	})
	.strict();

export type CustomCardsListImagesInput = z.infer<
	typeof CustomCardsListImagesInputSchema
>;

export const CustomCardsListImagesResponseSchema = z
	.object({
		httpCode: NumLike.nullable().optional(),
		status: z.union([z.string(), z.number()]).nullable().optional(),
		images: z.array(CustomImageSchema).nullable().optional(),
	})
	.passthrough();

export type CustomCardsListImagesResponse = z.infer<
	typeof CustomCardsListImagesResponseSchema
>;

export const CustomCardsUploadImageInputSchema = z
	.object({
		file: z
			.string()
			.min(1, 'file is required')
			.describe('Image file content, base64-encoded (JPG or PNG)'),
		file_name: z
			.string()
			.min(1)
			.optional()
			.describe('File name sent with the upload, e.g. logo.png'),
		mime_type: z
			.enum(['image/png', 'image/jpeg'])
			.optional()
			.describe('Defaults to image/png'),
		type: z.enum(['logo', 'cover']).optional(),
	})
	.strict();

export type CustomCardsUploadImageInput = z.infer<
	typeof CustomCardsUploadImageInputSchema
>;

export const CustomCardsUploadImageResponseSchema = z
	.object({
		httpCode: NumLike.nullable().optional(),
		status: z.union([z.string(), z.number()]).nullable().optional(),
		id: NumLike.nullable().optional(),
		image_url: z.string().nullable().optional(),
		image_id: NumLike.nullable().optional(),
	})
	.passthrough();

export type CustomCardsUploadImageResponse = z.infer<
	typeof CustomCardsUploadImageResponseSchema
>;

export const CustomCardsCheckImageInputSchema = z
	.object({
		image_id: z.number().int().positive('Image ID must be positive'),
		card_id: z.number().int().optional(),
	})
	.strict();

export type CustomCardsCheckImageInput = z.infer<
	typeof CustomCardsCheckImageInputSchema
>;

export const CustomCardsCheckImageResponseSchema = z
	.object({
		httpCode: NumLike.nullable().optional(),
		status: z.union([z.string(), z.number()]).nullable().optional(),
		warning: z.string().nullable().optional(),
		error: z.string().nullable().optional(),
	})
	.passthrough();

export type CustomCardsCheckImageResponse = z.infer<
	typeof CustomCardsCheckImageResponseSchema
>;

export const CustomCardsDeleteImageInputSchema = z
	.object({
		image_id: z.number().int().positive('Image ID must be positive'),
	})
	.strict();

export type CustomCardsDeleteImageInput = z.infer<
	typeof CustomCardsDeleteImageInputSchema
>;

export const CustomCardsDeleteImageResponseSchema = z
	.object({
		httpCode: NumLike.nullable().optional(),
		status: z.union([z.string(), z.number()]).nullable().optional(),
	})
	.passthrough();

export type CustomCardsDeleteImageResponse = z.infer<
	typeof CustomCardsDeleteImageResponseSchema
>;

const Align = z.enum(['left', 'center', 'right']);

export const CustomCardsCreateInputSchema = z
	.object({
		card_id: z.number().int().optional(),
		name: z.string().min(1, 'Card name cannot be empty'),
		dimension_id: z.number().int().positive().optional(),
		is_update: z.boolean().optional(),
		cover_id: z.number().int().optional(),
		preset_cover_id: z.number().int().optional(),
		cover_size_percent: z.number().int().optional(),
		header_type: z.enum(['text', 'logo']).optional(),
		header_text: z.string().optional(),
		header_font_size: z.number().int().optional(),
		header_font_color: z.string().optional(),
		header_font_id: z.number().int().optional(),
		header_align: Align.optional(),
		header_logo_id: z.number().int().optional(),
		header_logo_size_percent: z.number().int().optional(),
		footer_type: z.enum(['text', 'logo']).optional(),
		footer_text: z.string().optional(),
		footer_font_size: z.number().int().optional(),
		footer_font_color: z.string().optional(),
		footer_font_id: z.number().int().optional(),
		footer_align: Align.optional(),
		footer_logo_id: z.number().int().optional(),
		footer_logo_size_percent: z.number().int().optional(),
		main_type: z.enum(['text', 'logo']).optional(),
		main_text: z.string().optional(),
		main_font_size: z.number().int().optional(),
		main_font_color: z.string().optional(),
		main_font_id: z.number().int().optional(),
		main_align: Align.optional(),
		main_logo_id: z.number().int().optional(),
		main_logo_size_percent: z.number().int().optional(),
		back_type: z.enum(['text', 'logo']).optional(),
		back_text: z.string().optional(),
		back_font_size: z.number().int().optional(),
		back_font_color: z.string().optional(),
		back_font_id: z.number().int().optional(),
		back_align: Align.optional(),
		back_vertical_align: z.enum(['top', 'center', 'bottom']).optional(),
		back_logo_id: z.number().int().optional(),
		back_size_percent: z.number().int().optional(),
		back_cover_id: z.number().int().optional(),
		preset_back_cover_id: z.number().int().optional(),
		qr_code_id: z.number().int().optional(),
		qr_code_size_percent: z.number().int().optional(),
		qr_code_align: Align.optional(),
		qr_code_location: z.enum(['header', 'footer']).optional(),
		qr_code_frame_id: z.number().int().optional(),
	})
	.strict();

export type CustomCardsCreateInput = z.infer<
	typeof CustomCardsCreateInputSchema
>;

export const CustomCardsCreateResponseSchema = z
	.object({
		httpCode: NumLike.nullable().optional(),
		status: z.union([z.string(), z.number()]).nullable().optional(),
		card_id: NumLike.nullable().optional(),
		id: NumLike.nullable().optional(),
	})
	.passthrough();

export type CustomCardsCreateResponse = z.infer<
	typeof CustomCardsCreateResponseSchema
>;

export const CustomCardsDeleteInputSchema = z
	.object({
		id: z.number().int().positive('Card ID must be positive'),
	})
	.strict();

export type CustomCardsDeleteInput = z.infer<
	typeof CustomCardsDeleteInputSchema
>;

export const CustomCardsDeleteResponseSchema = z
	.object({
		httpCode: NumLike.nullable().optional(),
		status: z.union([z.string(), z.number()]).nullable().optional(),
	})
	.passthrough();

export type CustomCardsDeleteResponse = z.infer<
	typeof CustomCardsDeleteResponseSchema
>;

// ── Orders Endpoints ──────────────────────────────────────────────────────────

const DeliveryConfirmation = z.union([
	z.literal(0),
	z.literal(1),
	z.literal(2),
]);

export const OrdersSendSingleInputSchema = z
	.object({
		card_id: z.number().int().positive('Card ID is required'),
		message: z.string().min(1, 'Message is required'),
		wishes: z.string().optional(),
		font_label: z.string().min(1, 'font_label is required'),
		// Saved card to charge; without it Handwrytten uses account credit or the default card
		credit_card_id: z.number().int().optional(),
		denomination_id: z.number().int().optional(),
		insert_id: z.number().int().optional(),
		bundle_id: z.number().int().optional(),
		couponCode: z.string().optional(),
		date_send: z.string().optional(),
		validate_address: z.boolean().optional(),
		// 0 = none, 1 = delivery confirmation, 2 = CASS address validation only
		delivery_confirmation: DeliveryConfirmation.optional(),
		webhook_url: z.string().url().optional(),
		stamp_option_id: z.number().int().optional(),
		sender_first_name: z.string().optional(),
		sender_last_name: z.string().optional(),
		sender_business_name: z.string().optional(),
		sender_address1: z.string().min(1, 'sender_address1 is required'),
		sender_address2: z.string().optional(),
		sender_city: z.string().min(1, 'sender_city is required'),
		sender_zip: z.string().min(1, 'sender_zip is required'),
		sender_state: z.string().optional(),
		sender_country_id: z.number().int().optional(),
		sender_country: z.string().optional(),
		recipient_first_name: z.string().optional(),
		recipient_last_name: z.string().optional(),
		recipient_business_name: z.string().optional(),
		recipient_address1: z.string().min(1, 'Recipient address is required'),
		recipient_address2: z.string().optional(),
		recipient_city: z.string().min(1, 'Recipient city is required'),
		recipient_zip: z.string().min(1, 'Recipient zip is required'),
		recipient_state: z.string().optional(),
		recipient_country_id: z.number().int().optional(),
		recipient_country: z.string().optional(),
		client_metadata: z.string().optional(),
	})
	.strict();

export type OrdersSendSingleInput = z.infer<typeof OrdersSendSingleInputSchema>;

export const OrdersSendSingleResponseSchema = z
	.object({
		httpCode: NumLike.nullable().optional(),
		status: z.union([z.string(), z.number()]).nullable().optional(),
		order_id: NumLike.nullable().optional(),
		mail_sent: BoolLike.nullable().optional(),
	})
	.passthrough();

export type OrdersSendSingleResponse = z.infer<
	typeof OrdersSendSingleResponseSchema
>;

const BasketAddressSchema = z
	.object({
		to_first_name: z.string().optional(),
		to_last_name: z.string().optional(),
		to_business_name: z.string().optional(),
		to_address1: z.string().min(1),
		to_address2: z.string().optional(),
		to_city: z.string().min(1),
		to_state: z.string().optional(),
		to_zip: z.string().min(1),
		to_country: z.string().optional(),
		return_first_name: z.string().optional(),
		return_last_name: z.string().optional(),
		return_business_name: z.string().optional(),
		return_address1: z.string().optional(),
		return_address2: z.string().optional(),
		return_city: z.string().optional(),
		return_state: z.string().optional(),
		return_zip: z.string().optional(),
		return_country: z.string().optional(),
		message: z.string().optional(),
		wishes: z.string().optional(),
		signature_id: z.number().int().optional(),
		signature2_id: z.number().int().optional(),
		date_send: z.string().optional(),
	})
	.strict();

export const OrdersAddToBasketInputSchema = z
	.object({
		card_id: z.number().int().positive('Card ID is required'),
		message: z.string().optional(),
		wishes: z.string().optional(),
		return_address_id: z.number().int().optional(),
		address_id: z.number().int().optional(),
		address_ids: z.array(z.number().int()).optional(),
		addresses: z
			.array(BasketAddressSchema)
			.optional()
			.describe(
				'Inline recipients (each with its own message), instead of saved address_ids',
			),
		font: z.string().optional(),
		font_size: z.number().optional(),
		auto_font_size: z.boolean().optional(),
		signature_id: z.number().int().optional(),
		signature2_id: z.number().int().optional(),
		date_send: z.string().optional(),
		couponCode: z.string().optional(),
		denomination_id: z.number().int().optional(),
		insert_id: z.number().int().optional(),
		bundle_id: z.number().int().optional(),
		quantity: z.number().int().optional(),
		check_quantity: z.boolean().optional(),
		delivery_confirmation: DeliveryConfirmation.optional(),
		stamp_option_id: z.number().int().optional(),
		client_metadata: z.string().optional(),
	})
	.strict();

export type OrdersAddToBasketInput = z.infer<
	typeof OrdersAddToBasketInputSchema
>;

export const OrdersAddToBasketResponseSchema = z
	.object({
		httpCode: NumLike.nullable().optional(),
		status: z.union([z.string(), z.number()]).nullable().optional(),
		order_id: NumLike.nullable().optional(),
	})
	.passthrough();

export type OrdersAddToBasketResponse = z.infer<
	typeof OrdersAddToBasketResponseSchema
>;

export const OrdersGetInputSchema = z
	.object({
		id: z.number().int().positive('Order ID must be positive'),
	})
	.strict();

export type OrdersGetInput = z.infer<typeof OrdersGetInputSchema>;

export const OrdersGetResponseSchema = z
	.object({
		httpCode: NumLike.nullable().optional(),
		status: z.union([z.string(), z.number()]).nullable().optional(),
		// `unknown` because order details contain extensive provider order schemas.
		order: z.unknown().optional(),
	})
	.passthrough();

export type OrdersGetResponse = z.infer<typeof OrdersGetResponseSchema>;

export const OrdersCancelInputSchema = z
	.object({
		order_id: z.number().int().positive('Order ID must be positive'),
	})
	.strict();

export type OrdersCancelInput = z.infer<typeof OrdersCancelInputSchema>;

export const OrdersCancelResponseSchema = z
	.object({
		httpCode: NumLike.nullable().optional(),
		status: z.union([z.string(), z.number()]).nullable().optional(),
	})
	.passthrough();

export type OrdersCancelResponse = z.infer<typeof OrdersCancelResponseSchema>;

// ── Basket Endpoints ──────────────────────────────────────────────────────────

export const BasketCountInputSchema = z.object({}).strict();
export type BasketCountInput = z.infer<typeof BasketCountInputSchema>;

export const BasketCountResponseSchema = z
	.object({
		httpCode: NumLike.nullable().optional(),
		status: z.union([z.string(), z.number()]).nullable().optional(),
		count: NumLike.nullable().optional(),
	})
	.passthrough();

export type BasketCountResponse = z.infer<typeof BasketCountResponseSchema>;

export const BasketClearInputSchema = z.object({}).strict();
export type BasketClearInput = z.infer<typeof BasketClearInputSchema>;

export const BasketClearResponseSchema = z
	.object({
		httpCode: NumLike.nullable().optional(),
		status: z.union([z.string(), z.number()]).nullable().optional(),
		// `unknown` because basket clear item is an optional provider object.
		item: z.unknown().optional(),
	})
	.passthrough();

export type BasketClearResponse = z.infer<typeof BasketClearResponseSchema>;

export const BasketSendInputSchema = z
	.object({
		couponCode: z.string().optional(),
		check_quantity: z.boolean().optional(),
		notes: z
			.record(z.string(), z.string())
			.optional()
			.describe('Order notes keyed by order id'),
	})
	.strict();

export type BasketSendInput = z.infer<typeof BasketSendInputSchema>;

export const BasketSendResponseSchema = z
	.object({
		httpCode: NumLike.nullable().optional(),
		status: z.union([z.string(), z.number()]).nullable().optional(),
		// `unknown` because items payload can be array of placed orders or summary.
		items: z.unknown().optional(),
	})
	.passthrough();

export type BasketSendResponse = z.infer<typeof BasketSendResponseSchema>;

// ── Fonts Endpoints ───────────────────────────────────────────────────────────

export const FontsListInputSchema = z.object({}).strict();
export type FontsListInput = z.infer<typeof FontsListInputSchema>;

export const FontsListResponseSchema = z
	.object({
		httpCode: NumLike.nullable().optional(),
		status: z.union([z.string(), z.number()]).nullable().optional(),
		fonts: z.array(FontSchema).nullable().optional(),
	})
	.passthrough();

export type FontsListResponse = z.infer<typeof FontsListResponseSchema>;

// ── Signatures Endpoints ──────────────────────────────────────────────────────

export const SignaturesListInputSchema = z.object({}).strict();
export type SignaturesListInput = z.infer<typeof SignaturesListInputSchema>;

export const SignaturesListResponseSchema = z
	.object({
		httpCode: NumLike.nullable().optional(),
		status: z.union([z.string(), z.number()]).nullable().optional(),
		signatures: z.array(SignatureSchema).nullable().optional(),
	})
	.passthrough();

export type SignaturesListResponse = z.infer<
	typeof SignaturesListResponseSchema
>;

// ── Address Book Endpoints ────────────────────────────────────────────────────

export const AddressBookCountriesInputSchema = z.object({}).strict();
export type AddressBookCountriesInput = z.infer<
	typeof AddressBookCountriesInputSchema
>;

export const AddressBookCountriesResponseSchema = z
	.object({
		httpCode: NumLike.nullable().optional(),
		status: z.union([z.string(), z.number()]).nullable().optional(),
		countries: z.array(CountrySchema).nullable().optional(),
	})
	.passthrough();

export type AddressBookCountriesResponse = z.infer<
	typeof AddressBookCountriesResponseSchema
>;

export const AddressBookStatesInputSchema = z
	.object({
		country_id: z.number().int().positive('country_id is required'),
	})
	.strict();

export type AddressBookStatesInput = z.infer<
	typeof AddressBookStatesInputSchema
>;

export const AddressBookStatesResponseSchema = z
	.object({
		httpCode: NumLike.nullable().optional(),
		status: z.union([z.string(), z.number()]).nullable().optional(),
		states: z.array(StateSchema).nullable().optional(),
	})
	.passthrough();

export type AddressBookStatesResponse = z.infer<
	typeof AddressBookStatesResponseSchema
>;

export const AddressBookListRecipientsInputSchema = z.object({}).strict();
export type AddressBookListRecipientsInput = z.infer<
	typeof AddressBookListRecipientsInputSchema
>;

export const AddressBookListRecipientsResponseSchema = z
	.object({
		httpCode: NumLike.nullable().optional(),
		status: z.union([z.string(), z.number()]).nullable().optional(),
		addresses: z.array(SavedAddressSchema).nullable().optional(),
	})
	.passthrough();

export type AddressBookListRecipientsResponse = z.infer<
	typeof AddressBookListRecipientsResponseSchema
>;

export const AddressBookAddRecipientInputSchema = z
	.object({
		name: z.string().optional(),
		first_name: z.string().optional(),
		last_name: z.string().optional(),
		business_name: z.string().optional(),
		address1: z.string().min(1, 'address1 is required'),
		address2: z.string().optional(),
		city: z.string().min(1, 'city is required'),
		state: z.string().min(1, 'state is required'),
		zip: z.string().min(1, 'zip is required'),
		country: z.string().optional(),
		country_id: z.number().int().optional(),
		birthday: z.string().optional(),
	})
	.strict();

export type AddressBookAddRecipientInput = z.infer<
	typeof AddressBookAddRecipientInputSchema
>;

export const AddressBookAddRecipientResponseSchema = z
	.object({
		httpCode: NumLike.nullable().optional(),
		status: z.union([z.string(), z.number()]).nullable().optional(),
		address_id: NumLike.nullable().optional(),
	})
	.passthrough();

export type AddressBookAddRecipientResponse = z.infer<
	typeof AddressBookAddRecipientResponseSchema
>;

export const AddressBookUpdateRecipientInputSchema = z
	.object({
		address_id: z.number().int().positive('address_id is required'),
		name: z.string().optional(),
		first_name: z.string().optional(),
		last_name: z.string().optional(),
		business_name: z.string().optional(),
		address1: z.string().optional(),
		address2: z.string().optional(),
		city: z.string().optional(),
		state: z.string().optional(),
		zip: z.string().optional(),
		country_id: z.number().int().optional(),
		birthday: z.string().optional(),
	})
	.strict();

export type AddressBookUpdateRecipientInput = z.infer<
	typeof AddressBookUpdateRecipientInputSchema
>;

export const AddressBookUpdateRecipientResponseSchema = z
	.object({
		httpCode: NumLike.nullable().optional(),
		status: z.union([z.string(), z.number()]).nullable().optional(),
		address_id: NumLike.nullable().optional(),
	})
	.passthrough();

export type AddressBookUpdateRecipientResponse = z.infer<
	typeof AddressBookUpdateRecipientResponseSchema
>;

export const AddressBookDeleteRecipientInputSchema = z
	.object({
		address_id: z.number().int().positive('address_id is required'),
	})
	.strict();

export type AddressBookDeleteRecipientInput = z.infer<
	typeof AddressBookDeleteRecipientInputSchema
>;

export const AddressBookDeleteRecipientResponseSchema = z
	.object({
		httpCode: NumLike.nullable().optional(),
		status: z.union([z.string(), z.number()]).nullable().optional(),
		address_id: NumLike.nullable().optional(),
	})
	.passthrough();

export type AddressBookDeleteRecipientResponse = z.infer<
	typeof AddressBookDeleteRecipientResponseSchema
>;

export const AddressBookListSendersInputSchema = z.object({}).strict();
export type AddressBookListSendersInput = z.infer<
	typeof AddressBookListSendersInputSchema
>;

export const AddressBookListSendersResponseSchema = z
	.object({
		httpCode: NumLike.nullable().optional(),
		status: z.union([z.string(), z.number()]).nullable().optional(),
		addresses: z.array(SavedAddressSchema).nullable().optional(),
	})
	.passthrough();

export type AddressBookListSendersResponse = z.infer<
	typeof AddressBookListSendersResponseSchema
>;

export const AddressBookGetSenderInputSchema = z.object({}).strict();
export type AddressBookGetSenderInput = z.infer<
	typeof AddressBookGetSenderInputSchema
>;

export const AddressBookGetSenderResponseSchema = z
	.object({
		httpCode: NumLike.nullable().optional(),
		status: z.union([z.string(), z.number()]).nullable().optional(),
		// `unknown` because billing_info and subscription are complex account objects.
		billing_info: z.unknown().optional(),
		subscription: z.unknown().optional(),
	})
	.passthrough();

export type AddressBookGetSenderResponse = z.infer<
	typeof AddressBookGetSenderResponseSchema
>;

export const AddressBookAddSenderInputSchema = z
	.object({
		name: z.string().optional(),
		first_name: z.string().optional(),
		last_name: z.string().optional(),
		business_name: z.string().optional(),
		address1: z.string().min(1, 'address1 is required'),
		address2: z.string().optional(),
		city: z.string().min(1, 'city is required'),
		state: z.string().min(1, 'state is required'),
		zip: z.string().min(1, 'zip is required'),
		country_id: z.number().int().optional(),
		default: z.boolean().optional(),
	})
	.strict();

export type AddressBookAddSenderInput = z.infer<
	typeof AddressBookAddSenderInputSchema
>;

export const AddressBookAddSenderResponseSchema = z
	.object({
		httpCode: NumLike.nullable().optional(),
		status: z.union([z.string(), z.number()]).nullable().optional(),
		// `unknown` because address response can return saved address object or id.
		address: z.unknown().optional(),
	})
	.passthrough();

export type AddressBookAddSenderResponse = z.infer<
	typeof AddressBookAddSenderResponseSchema
>;

export const AddressBookUpdateSenderInputSchema = z
	.object({
		address1: z.string().min(1, 'address1 is required'),
		address2: z.string().optional(),
		city: z.string().min(1, 'city is required'),
		state: z.string().min(1, 'state is required'),
		zip: z.string().min(1, 'zip is required'),
	})
	.strict();

export type AddressBookUpdateSenderInput = z.infer<
	typeof AddressBookUpdateSenderInputSchema
>;

export const AddressBookUpdateSenderResponseSchema = z
	.object({
		httpCode: NumLike.nullable().optional(),
		status: z.union([z.string(), z.number()]).nullable().optional(),
		// `unknown` because updated address array is returned by provider.
		addresses: z.unknown().optional(),
	})
	.passthrough();

export type AddressBookUpdateSenderResponse = z.infer<
	typeof AddressBookUpdateSenderResponseSchema
>;

export const AddressBookDeleteSenderInputSchema = z
	.object({
		id: z.number().int().positive('Address ID must be positive'),
	})
	.strict();

export type AddressBookDeleteSenderInput = z.infer<
	typeof AddressBookDeleteSenderInputSchema
>;

export const AddressBookDeleteSenderResponseSchema = z
	.object({
		httpCode: NumLike.nullable().optional(),
		status: z.union([z.string(), z.number()]).nullable().optional(),
	})
	.passthrough();

export type AddressBookDeleteSenderResponse = z.infer<
	typeof AddressBookDeleteSenderResponseSchema
>;

export const AddressBookSetDefaultSenderInputSchema = z
	.object({
		id: z.number().int().positive('Address ID must be positive'),
	})
	.strict();

export type AddressBookSetDefaultSenderInput = z.infer<
	typeof AddressBookSetDefaultSenderInputSchema
>;

export const AddressBookSetDefaultSenderResponseSchema = z
	.object({
		httpCode: NumLike.nullable().optional(),
		status: z.union([z.string(), z.number()]).nullable().optional(),
	})
	.passthrough();

export type AddressBookSetDefaultSenderResponse = z.infer<
	typeof AddressBookSetDefaultSenderResponseSchema
>;

// ── Templates Endpoints ───────────────────────────────────────────────────────

export const TemplatesCategoriesInputSchema = z.object({}).strict();
export type TemplatesCategoriesInput = z.infer<
	typeof TemplatesCategoriesInputSchema
>;

export const TemplatesCategoriesResponseSchema = z
	.object({
		httpCode: NumLike.nullable().optional(),
		status: z.union([z.string(), z.number()]).nullable().optional(),
		categories: z.array(TemplateCategorySchema).nullable().optional(),
	})
	.passthrough();

export type TemplatesCategoriesResponse = z.infer<
	typeof TemplatesCategoriesResponseSchema
>;

export const TemplatesListInputSchema = z
	.object({
		category_id: z.number().int().optional(),
	})
	.strict();

export type TemplatesListInput = z.infer<typeof TemplatesListInputSchema>;

export const TemplatesListResponseSchema = z
	.object({
		httpCode: NumLike.nullable().optional(),
		status: z.union([z.string(), z.number()]).nullable().optional(),
		templates: z.array(TemplateSchema).nullable().optional(),
	})
	.passthrough();

export type TemplatesListResponse = z.infer<typeof TemplatesListResponseSchema>;

export const TemplatesGetInputSchema = z
	.object({
		template_id: z.number().int().positive('template_id must be positive'),
	})
	.strict();

export type TemplatesGetInput = z.infer<typeof TemplatesGetInputSchema>;

export const TemplatesGetResponseSchema = z
	.object({
		httpCode: NumLike.nullable().optional(),
		status: z.union([z.string(), z.number()]).nullable().optional(),
		template: TemplateSchema.nullable().optional(),
	})
	.passthrough();

export type TemplatesGetResponse = z.infer<typeof TemplatesGetResponseSchema>;

export const TemplatesCreateInputSchema = z
	.object({
		name: z.string().min(1, 'Template name is required'),
		message: z.string().min(1, 'Template message is required'),
		category_id: z.number().int().optional(),
		wishes: z.string().optional(),
	})
	.strict();

export type TemplatesCreateInput = z.infer<typeof TemplatesCreateInputSchema>;

export const TemplatesCreateResponseSchema = z
	.object({
		httpCode: NumLike.nullable().optional(),
		status: z.union([z.string(), z.number()]).nullable().optional(),
		template: TemplateSchema.nullable().optional(),
		template_id: NumLike.nullable().optional(),
		id: NumLike.nullable().optional(),
	})
	.passthrough();

export type TemplatesCreateResponse = z.infer<
	typeof TemplatesCreateResponseSchema
>;

export const TemplatesUpdateInputSchema = z
	.object({
		template_id: z.number().int().positive('template_id must be positive'),
		name: z.string().optional(),
		message: z.string().optional(),
		category_id: z.number().int().optional(),
		wishes: z.string().optional(),
	})
	.strict();

export type TemplatesUpdateInput = z.infer<typeof TemplatesUpdateInputSchema>;

export const TemplatesUpdateResponseSchema = z
	.object({
		httpCode: NumLike.nullable().optional(),
		status: z.union([z.string(), z.number()]).nullable().optional(),
		template: TemplateSchema.nullable().optional(),
	})
	.passthrough();

export type TemplatesUpdateResponse = z.infer<
	typeof TemplatesUpdateResponseSchema
>;

export const TemplatesDeleteInputSchema = z
	.object({
		template_id: z.number().int().positive('template_id must be positive'),
	})
	.strict();

export type TemplatesDeleteInput = z.infer<typeof TemplatesDeleteInputSchema>;

export const TemplatesDeleteResponseSchema = z
	.object({
		httpCode: NumLike.nullable().optional(),
		status: z.union([z.string(), z.number()]).nullable().optional(),
	})
	.passthrough();

export type TemplatesDeleteResponse = z.infer<
	typeof TemplatesDeleteResponseSchema
>;

// ── Gift Cards Endpoints ──────────────────────────────────────────────────────

export const GiftCardsListInputSchema = z.object({}).strict();
export type GiftCardsListInput = z.infer<typeof GiftCardsListInputSchema>;

export const GiftCardsListResponseSchema = z
	.object({
		httpCode: NumLike.nullable().optional(),
		status: z.union([z.string(), z.number()]).nullable().optional(),
		gcards: z.array(GiftCardSchema).nullable().optional(),
	})
	.passthrough();

export type GiftCardsListResponse = z.infer<typeof GiftCardsListResponseSchema>;

// ── Inserts Endpoints ─────────────────────────────────────────────────────────

export const InsertsListInputSchema = z
	.object({
		include_historical: z.boolean().optional(),
	})
	.strict();

export type InsertsListInput = z.infer<typeof InsertsListInputSchema>;

export const InsertsListResponseSchema = z
	.object({
		httpCode: NumLike.nullable().optional(),
		status: z.union([z.string(), z.number()]).nullable().optional(),
		inserts: z.array(InsertSchema).nullable().optional(),
	})
	.passthrough();

export type InsertsListResponse = z.infer<typeof InsertsListResponseSchema>;

// ── Bundles Endpoints ─────────────────────────────────────────────────────────

export const BundlesListInputSchema = z.object({}).strict();
export type BundlesListInput = z.infer<typeof BundlesListInputSchema>;

export const BundlesListResponseSchema = z
	.object({
		httpCode: NumLike.nullable().optional(),
		status: z.union([z.string(), z.number()]).nullable().optional(),
		bundles: z.array(BundleSchema).nullable().optional(),
	})
	.passthrough();

export type BundlesListResponse = z.infer<typeof BundlesListResponseSchema>;

// ── QR Codes Endpoints ────────────────────────────────────────────────────────

export const QrCodesListInputSchema = z.object({}).strict();
export type QrCodesListInput = z.infer<typeof QrCodesListInputSchema>;

export const QrCodesListResponseSchema = z
	.object({
		httpCode: NumLike.nullable().optional(),
		status: z.union([z.string(), z.number()]).nullable().optional(),
		list: z.array(QRCodeSchema).nullable().optional(),
	})
	.passthrough();

export type QrCodesListResponse = z.infer<typeof QrCodesListResponseSchema>;

export const QrCodesCreateInputSchema = z
	.object({
		name: z.string().min(1, 'QR code name is required'),
		url: z.string().url('A valid URL is required'),
	})
	.strict();

export type QrCodesCreateInput = z.infer<typeof QrCodesCreateInputSchema>;

export const QrCodesCreateResponseSchema = z
	.object({
		httpCode: NumLike.nullable().optional(),
		status: z.union([z.string(), z.number()]).nullable().optional(),
		id: NumLike.nullable().optional(),
	})
	.passthrough();

export type QrCodesCreateResponse = z.infer<typeof QrCodesCreateResponseSchema>;

export const QrCodesDeleteInputSchema = z
	.object({
		id: z.union([
			z.number().int().positive(),
			z.string().min(1, 'QR code ID is required'),
		]),
	})
	.strict();

export type QrCodesDeleteInput = z.infer<typeof QrCodesDeleteInputSchema>;

export const QrCodesDeleteResponseSchema = z
	.object({
		httpCode: NumLike.nullable().optional(),
		status: z.union([z.string(), z.number()]).nullable().optional(),
	})
	.passthrough();

export type QrCodesDeleteResponse = z.infer<typeof QrCodesDeleteResponseSchema>;

export const QrCodesDashboardInputSchema = z.object({}).strict();
export type QrCodesDashboardInput = z.infer<typeof QrCodesDashboardInputSchema>;

export const QrCodesDashboardResponseSchema = z
	.object({
		httpCode: NumLike.nullable().optional(),
		status: z.union([z.string(), z.number()]).nullable().optional(),
		// `unknown` for the analytics blocks: the live API returns `stats`, `chart`,
		// `map` and `recent_scans`, while the spec documents `scans`/`statistics`.
		stats: z.unknown().optional(),
		chart: z.unknown().optional(),
		map: z.unknown().optional(),
		recent_scans: z.unknown().optional(),
		statistics: z.unknown().optional(),
		total_scans: NumLike.nullable().optional(),
	})
	.passthrough();

export type QrCodesDashboardResponse = z.infer<
	typeof QrCodesDashboardResponseSchema
>;

export const QrCodesFramesInputSchema = z.object({}).strict();
export type QrCodesFramesInput = z.infer<typeof QrCodesFramesInputSchema>;

export const QrCodesFramesResponseSchema = z
	.object({
		httpCode: NumLike.nullable().optional(),
		status: z.union([z.string(), z.number()]).nullable().optional(),
		// `unknown` because frames array carries layout styling options.
		frames: z.unknown().optional(),
	})
	.passthrough();

export type QrCodesFramesResponse = z.infer<typeof QrCodesFramesResponseSchema>;

// ── Shipping Endpoints ────────────────────────────────────────────────────────

export const ShippingStampOptionsInputSchema = z.object({}).strict();
export type ShippingStampOptionsInput = z.infer<
	typeof ShippingStampOptionsInputSchema
>;

export const ShippingStampOptionsResponseSchema = z
	.object({
		httpCode: NumLike.nullable().optional(),
		status: z.union([z.string(), z.number()]).nullable().optional(),
		stamp_options: z.array(StampOptionSchema).nullable().optional(),
	})
	.passthrough();

export type ShippingStampOptionsResponse = z.infer<
	typeof ShippingStampOptionsResponseSchema
>;

// ── Prospecting Endpoints ─────────────────────────────────────────────────────

export const ProspectingCalculateTargetsInputSchema = z
	.object({
		type: z.enum(['residential', 'business']).optional(),
		address: z.string().optional(),
		city: z.string().optional(),
		zip: z.string().optional(),
		country: z.string().optional(),
		radius: z.number().optional(),
		latitude: z.string().optional(),
		longitude: z.string().optional(),
		// Demographic filters, passed through as the provider names them.
		'ownRent-d': z.string().optional(),
		'hinc-d': z.string().optional(),
		'worth-d': z.string().optional(),
		'Home-d': z.string().optional(),
		'resLen-d': z.string().optional(),
		hAge: z.string().optional(),
		people: z.string().optional(),
		kids: z.string().optional(),
		marital: z.string().optional(),
		staff: z.string().optional(),
		sale: z.string().optional(),
		one: z.enum(['0', '1']).optional(),
		sic: z.string().optional(),
	})
	.strict();

export type ProspectingCalculateTargetsInput = z.infer<
	typeof ProspectingCalculateTargetsInputSchema
>;

export const ProspectingCalculateTargetsResponseSchema = z
	.object({
		httpCode: NumLike.nullable().optional(),
		status: z.union([z.string(), z.number()]).nullable().optional(),
		total_records: NumLike.nullable().optional(),
		mask: z.union([z.boolean(), z.string()]).nullable().optional(),
	})
	.passthrough();

export type ProspectingCalculateTargetsResponse = z.infer<
	typeof ProspectingCalculateTargetsResponseSchema
>;

const ShippingMethod = z.union([
	z.literal(1),
	z.literal(2),
	z.literal(3),
	z.literal(4),
	z.literal(5),
	z.literal(6),
]);
const ShippingRate = z.union([
	z.literal(1),
	z.literal(2),
	z.literal(3),
	z.literal(4),
]);

export const ProspectingPreviewInputSchema = z
	.object({
		card_id: z.number().int().positive('card_id is required'),
		message: z.string().min(1, 'message is required'),
		records: z.number().int().positive('records count is required'),
		country: z.string().min(1, 'country is required'),
		return_address_id: z
			.number()
			.int()
			.positive('return_address_id is required'),
		insert_id: z.number().int().optional(),
		must_deliver_by: z.string().optional(),
		shipping_address_id: z.number().int().optional(),
		// Optional in the spec, but the live API answers 400 "The shipping method id
		// is incorrect" without it; methods other than 1 also need shipping_rate_id.
		shipping_method_id: ShippingMethod,
		shipping_rate_id: ShippingRate.optional(),
	})
	.strict();

export type ProspectingPreviewInput = z.infer<
	typeof ProspectingPreviewInputSchema
>;

export const ProspectingPreviewResponseSchema = z
	.object({
		httpCode: NumLike.nullable().optional(),
		status: z.union([z.string(), z.number()]).nullable().optional(),
		// `unknown` because prices structure depends on chosen prospecting demographic options.
		prices: z.unknown().optional(),
		quantity: NumLike.nullable().optional(),
	})
	.passthrough();

export type ProspectingPreviewResponse = z.infer<
	typeof ProspectingPreviewResponseSchema
>;

export const ProspectingCreateOrderInputSchema = z
	.object({
		card_id: z.number().int().positive('card_id is required'),
		message: z.string().min(1, 'message is required'),
		wishes: z.string().optional(),
		records: z.number().int().positive('records count is required'),
		return_address_id: z
			.number()
			.int()
			.positive('return_address_id is required'),
		font: z.string().min(1, 'font is required'),
		font_size: z.number().optional(),
		address: z.string().optional(),
		city: z.string().optional(),
		zip: z.string().optional(),
		country: z.string().optional(),
		radius: z.number().optional(),
		latitude: z.string().optional(),
		longitude: z.string().optional(),
		// Demographic filters, passed through as the provider names them.
		'ownRent-d': z.string().optional(),
		'hinc-d': z.string().optional(),
		'worth-d': z.string().optional(),
		'Home-d': z.string().optional(),
		'resLen-d': z.string().optional(),
		hAge: z.string().optional(),
		people: z.string().optional(),
		kids: z.string().optional(),
		marital: z.string().optional(),
		insert_id: z.number().int().optional(),
		signature_id: z.number().int().optional(),
		signature2_id: z.number().int().optional(),
		must_deliver_by: z.string().optional(),
		shipping_address_id: z.number().int().optional(),
		// Optional in the spec, but the live API answers 400 "The shipping method id
		// is incorrect" without it; methods other than 1 also need shipping_rate_id.
		shipping_method_id: ShippingMethod,
		shipping_rate_id: ShippingRate.optional(),
	})
	.strict();

export type ProspectingCreateOrderInput = z.infer<
	typeof ProspectingCreateOrderInputSchema
>;

export const ProspectingCreateOrderResponseSchema = z
	.object({
		httpCode: NumLike.nullable().optional(),
		status: z.union([z.string(), z.number()]).nullable().optional(),
		order_id: NumLike.nullable().optional(),
	})
	.passthrough();

export type ProspectingCreateOrderResponse = z.infer<
	typeof ProspectingCreateOrderResponseSchema
>;

// ── Auth / Account Endpoints ──────────────────────────────────────────────────

export const AuthGetUserInputSchema = z.object({}).strict();
export type AuthGetUserInput = z.infer<typeof AuthGetUserInputSchema>;

export const AuthGetUserResponseSchema = z
	.object({
		httpCode: NumLike.nullable().optional(),
		status: z.union([z.string(), z.number()]).nullable().optional(),
		id: NumLike.nullable().optional(),
		email: z.string().nullable().optional(),
		first_name: z.string().nullable().optional(),
		last_name: z.string().nullable().optional(),
		credits: NumLike.nullable().optional(),
	})
	.passthrough();

export type AuthGetUserResponse = z.infer<typeof AuthGetUserResponseSchema>;

export const AuthCheckAuthInputSchema = z.object({}).strict();
export type AuthCheckAuthInput = z.infer<typeof AuthCheckAuthInputSchema>;

export const AuthCheckAuthResponseSchema = z
	.object({
		httpCode: NumLike.nullable().optional(),
		status: z.union([z.string(), z.number()]).nullable().optional(),
		login: z.string().nullable().optional(),
		test_mode: BoolLike.nullable().optional(),
	})
	.passthrough();

export type AuthCheckAuthResponse = z.infer<typeof AuthCheckAuthResponseSchema>;

export const AuthSetTestModeInputSchema = z
	.object({
		test_mode: z.boolean(),
	})
	.strict();

export type AuthSetTestModeInput = z.infer<typeof AuthSetTestModeInputSchema>;

export const AuthSetTestModeResponseSchema = z
	.object({
		httpCode: NumLike.nullable().optional(),
		status: z.union([z.string(), z.number()]).nullable().optional(),
		test_mode: BoolLike.nullable().optional(),
	})
	.passthrough();

export type AuthSetTestModeResponse = z.infer<
	typeof AuthSetTestModeResponseSchema
>;

export const AuthLogoutInputSchema = z.object({}).strict();
export type AuthLogoutInput = z.infer<typeof AuthLogoutInputSchema>;

export const AuthLogoutResponseSchema = z
	.object({
		httpCode: NumLike.nullable().optional(),
		status: z.union([z.string(), z.number()]).nullable().optional(),
	})
	.passthrough();

export type AuthLogoutResponse = z.infer<typeof AuthLogoutResponseSchema>;

// ── Schema Maps ───────────────────────────────────────────────────────────────

export const HandwryttenEndpointInputSchemas = {
	'cards.list': CardsListInputSchema,
	'cards.get': CardsGetInputSchema,
	'cards.sections': CardsSectionsInputSchema,
	'cards.categories': CardsCategoriesInputSchema,

	'customCards.dimensions': CustomCardsDimensionsInputSchema,
	'customCards.presetImages': CustomCardsPresetImagesInputSchema,
	'customCards.listImages': CustomCardsListImagesInputSchema,
	'customCards.uploadImage': CustomCardsUploadImageInputSchema,
	'customCards.checkImage': CustomCardsCheckImageInputSchema,
	'customCards.deleteImage': CustomCardsDeleteImageInputSchema,
	'customCards.create': CustomCardsCreateInputSchema,
	'customCards.delete': CustomCardsDeleteInputSchema,

	'orders.sendSingle': OrdersSendSingleInputSchema,
	'orders.addToBasket': OrdersAddToBasketInputSchema,
	'orders.get': OrdersGetInputSchema,
	'orders.cancel': OrdersCancelInputSchema,

	'basket.count': BasketCountInputSchema,
	'basket.clear': BasketClearInputSchema,
	'basket.send': BasketSendInputSchema,

	'fonts.list': FontsListInputSchema,

	'signatures.list': SignaturesListInputSchema,

	'addressBook.countries': AddressBookCountriesInputSchema,
	'addressBook.states': AddressBookStatesInputSchema,
	'addressBook.listRecipients': AddressBookListRecipientsInputSchema,
	'addressBook.addRecipient': AddressBookAddRecipientInputSchema,
	'addressBook.updateRecipient': AddressBookUpdateRecipientInputSchema,
	'addressBook.deleteRecipient': AddressBookDeleteRecipientInputSchema,
	'addressBook.listSenders': AddressBookListSendersInputSchema,
	'addressBook.getSender': AddressBookGetSenderInputSchema,
	'addressBook.addSender': AddressBookAddSenderInputSchema,
	'addressBook.updateSender': AddressBookUpdateSenderInputSchema,
	'addressBook.deleteSender': AddressBookDeleteSenderInputSchema,
	'addressBook.setDefaultSender': AddressBookSetDefaultSenderInputSchema,

	'templates.categories': TemplatesCategoriesInputSchema,
	'templates.list': TemplatesListInputSchema,
	'templates.get': TemplatesGetInputSchema,
	'templates.create': TemplatesCreateInputSchema,
	'templates.update': TemplatesUpdateInputSchema,
	'templates.delete': TemplatesDeleteInputSchema,

	'giftCards.list': GiftCardsListInputSchema,

	'inserts.list': InsertsListInputSchema,

	'bundles.list': BundlesListInputSchema,

	'qrCodes.list': QrCodesListInputSchema,
	'qrCodes.create': QrCodesCreateInputSchema,
	'qrCodes.delete': QrCodesDeleteInputSchema,
	'qrCodes.dashboard': QrCodesDashboardInputSchema,
	'qrCodes.frames': QrCodesFramesInputSchema,

	'shipping.stampOptions': ShippingStampOptionsInputSchema,

	'prospecting.calculateTargets': ProspectingCalculateTargetsInputSchema,
	'prospecting.preview': ProspectingPreviewInputSchema,
	'prospecting.createOrder': ProspectingCreateOrderInputSchema,

	'auth.getUser': AuthGetUserInputSchema,
	'auth.checkAuth': AuthCheckAuthInputSchema,
	'auth.setTestMode': AuthSetTestModeInputSchema,
	'auth.logout': AuthLogoutInputSchema,
} as const;

export const HandwryttenEndpointOutputSchemas = {
	'cards.list': CardsListResponseSchema,
	'cards.get': CardsGetResponseSchema,
	'cards.sections': CardsSectionsResponseSchema,
	'cards.categories': CardsCategoriesResponseSchema,

	'customCards.dimensions': CustomCardsDimensionsResponseSchema,
	'customCards.presetImages': CustomCardsPresetImagesResponseSchema,
	'customCards.listImages': CustomCardsListImagesResponseSchema,
	'customCards.uploadImage': CustomCardsUploadImageResponseSchema,
	'customCards.checkImage': CustomCardsCheckImageResponseSchema,
	'customCards.deleteImage': CustomCardsDeleteImageResponseSchema,
	'customCards.create': CustomCardsCreateResponseSchema,
	'customCards.delete': CustomCardsDeleteResponseSchema,

	'orders.sendSingle': OrdersSendSingleResponseSchema,
	'orders.addToBasket': OrdersAddToBasketResponseSchema,
	'orders.get': OrdersGetResponseSchema,
	'orders.cancel': OrdersCancelResponseSchema,

	'basket.count': BasketCountResponseSchema,
	'basket.clear': BasketClearResponseSchema,
	'basket.send': BasketSendResponseSchema,

	'fonts.list': FontsListResponseSchema,

	'signatures.list': SignaturesListResponseSchema,

	'addressBook.countries': AddressBookCountriesResponseSchema,
	'addressBook.states': AddressBookStatesResponseSchema,
	'addressBook.listRecipients': AddressBookListRecipientsResponseSchema,
	'addressBook.addRecipient': AddressBookAddRecipientResponseSchema,
	'addressBook.updateRecipient': AddressBookUpdateRecipientResponseSchema,
	'addressBook.deleteRecipient': AddressBookDeleteRecipientResponseSchema,
	'addressBook.listSenders': AddressBookListSendersResponseSchema,
	'addressBook.getSender': AddressBookGetSenderResponseSchema,
	'addressBook.addSender': AddressBookAddSenderResponseSchema,
	'addressBook.updateSender': AddressBookUpdateSenderResponseSchema,
	'addressBook.deleteSender': AddressBookDeleteSenderResponseSchema,
	'addressBook.setDefaultSender': AddressBookSetDefaultSenderResponseSchema,

	'templates.categories': TemplatesCategoriesResponseSchema,
	'templates.list': TemplatesListResponseSchema,
	'templates.get': TemplatesGetResponseSchema,
	'templates.create': TemplatesCreateResponseSchema,
	'templates.update': TemplatesUpdateResponseSchema,
	'templates.delete': TemplatesDeleteResponseSchema,

	'giftCards.list': GiftCardsListResponseSchema,

	'inserts.list': InsertsListResponseSchema,

	'bundles.list': BundlesListResponseSchema,

	'qrCodes.list': QrCodesListResponseSchema,
	'qrCodes.create': QrCodesCreateResponseSchema,
	'qrCodes.delete': QrCodesDeleteResponseSchema,
	'qrCodes.dashboard': QrCodesDashboardResponseSchema,
	'qrCodes.frames': QrCodesFramesResponseSchema,

	'shipping.stampOptions': ShippingStampOptionsResponseSchema,

	'prospecting.calculateTargets': ProspectingCalculateTargetsResponseSchema,
	'prospecting.preview': ProspectingPreviewResponseSchema,
	'prospecting.createOrder': ProspectingCreateOrderResponseSchema,

	'auth.getUser': AuthGetUserResponseSchema,
	'auth.checkAuth': AuthCheckAuthResponseSchema,
	'auth.setTestMode': AuthSetTestModeResponseSchema,
	'auth.logout': AuthLogoutResponseSchema,
} as const;

export type HandwryttenEndpointInputs = {
	[K in keyof typeof HandwryttenEndpointInputSchemas]: z.infer<
		(typeof HandwryttenEndpointInputSchemas)[K]
	>;
};

export type HandwryttenEndpointOutputs = {
	[K in keyof typeof HandwryttenEndpointOutputSchemas]: z.infer<
		(typeof HandwryttenEndpointOutputSchemas)[K]
	>;
};
