import { z } from 'zod';

// ==========================================
// Common & Helper Schemas
// ==========================================

export const JsonPatchOperationSchema = z.discriminatedUnion('op', [
	z.object({
		op: z.literal('add'),
		path: z.string(),
		// `unknown` because RFC 6902 JSON patch values can be any JSON type
		value: z.unknown(),
	}),
	z.object({
		op: z.literal('remove'),
		path: z.string(),
	}),
	z.object({
		op: z.literal('replace'),
		path: z.string(),
		// `unknown` because RFC 6902 JSON patch values can be any JSON type
		value: z.unknown(),
	}),
	z.object({
		op: z.literal('move'),
		path: z.string(),
		from: z.string(),
	}),
	z.object({
		op: z.literal('copy'),
		path: z.string(),
		from: z.string(),
	}),
	z.object({
		op: z.literal('test'),
		path: z.string(),
		// `unknown` because RFC 6902 JSON patch values can be any JSON type
		value: z.unknown(),
	}),
]);
export type JsonPatchOperation = z.infer<typeof JsonPatchOperationSchema>;

// `unknown` because Gift Up metadata values can be any JSON type (string, number, boolean, object, array)
export const MetadataSchema = z.record(z.string(), z.unknown());
export type Metadata = z.infer<typeof MetadataSchema>;

// `unknown` because endpoints documented as "returns a 200" can answer with no body (undefined),
// an empty text body (''), null, or a confirmation object
export const EmptyResponseSchema = z.union([
	z.record(z.string(), z.unknown()),
	z.literal(''),
	z.null(),
	z.undefined(),
]);
export type EmptyResponse = z.infer<typeof EmptyResponseSchema>;
export const SuccessResponseSchema = EmptyResponseSchema;
export type SuccessResponse = EmptyResponse;

// ==========================================
// 1. Ping
// ==========================================

export const PingGetInputSchema = z.object({}).strict();
export type PingGetInput = z.infer<typeof PingGetInputSchema>;

export const PingGetResponseSchema = z.string();
export type PingGetResponse = z.infer<typeof PingGetResponseSchema>;

export const PingPostInputSchema = z
	.object({
		// `unknown` because POST /ping accepts any arbitrary payload to echo
		payload: z.unknown().optional(),
	})
	.strict();
export type PingPostInput = z.infer<typeof PingPostInputSchema>;

// `unknown` because POST /ping echoes whatever raw payload was sent
export const PingPostResponseSchema = z.unknown();
export type PingPostResponse = z.infer<typeof PingPostResponseSchema>;

// ==========================================
// 2. Company
// ==========================================

export const CompanyGetInputSchema = z.object({}).strict();
export type CompanyGetInput = z.infer<typeof CompanyGetInputSchema>;

export const CompanySchema = z.object({
	id: z.string(),
	name: z.string().nullable().optional(),
	currency: z.string().nullable().optional(),
	onboardingCompleted: z.boolean().nullable().optional(),
	canShowCheckout: z.boolean().nullable().optional(),
	// Documented as a boolean in the example and as a string in the property table
	isCheckoutLive: z.union([z.boolean(), z.string()]).nullable().optional(),
});
export type Company = z.infer<typeof CompanySchema>;

// ==========================================
// 3. Gift Cards
// ==========================================

// Response schemas below are lenient on purpose: Gift Up documents example payloads,
// not a schema, so optional fields accept null and absent values.

export const GiftCardLedgerEntrySchema = z.object({
	id: z.string(),
	eventType: z.string().nullable().optional(),
	eventOccuredOn: z.string().nullable().optional(),
	eventOccuredAtLocationId: z.string().nullable().optional(),
	units: z.number().nullable().optional(),
	value: z.number().nullable().optional(),
	whoEmail: z.string().nullable().optional(),
	whoName: z.string().nullable().optional(),
	reason: z.string().nullable().optional(),
	metadata: MetadataSchema.nullable().optional(),
});
export type GiftCardLedgerEntry = z.infer<typeof GiftCardLedgerEntrySchema>;

export const GiftCardPostalFulfilmentSchema = z.object({
	address: z
		.object({
			countryCode: z.string().nullable().optional(),
			address1: z.string().nullable().optional(),
			address2: z.string().nullable().optional(),
			city: z.string().nullable().optional(),
			state: z.string().nullable().optional(),
			postalCode: z.string().nullable().optional(),
			name: z.string().nullable().optional(),
		})
		.nullable()
		.optional(),
	shippingOptionName: z.string().nullable().optional(),
});

export const GiftCardEmailFulfilmentSchema = z.object({
	emailAddress: z.string().nullable().optional(),
	scheduledFor: z.string().nullable().optional(),
});

export const GiftCardDownloadLinksSchema = z.object({
	artworkUrl: z.string().nullable().optional(),
	imageUrl: z.string().nullable().optional(),
	pdfUrl: z.string().nullable().optional(),
	appleWalletUrl: z.string().nullable().optional(),
	googleWalletUrl: z.string().nullable().optional(),
});

/** Custom field values can be strings, integers or booleans (Gift Up docs). */
export const CustomFieldValueSchema = z.union([
	z.string(),
	z.number(),
	z.boolean(),
]);

export const OrderPromotionSchema = z.object({
	promotionId: z.string().nullable().optional(),
	name: z.string().nullable().optional(),
	code: z.string().nullable().optional(),
});

export const OrderCustomFieldSchema = z.object({
	label: z.string(),
	value: CustomFieldValueSchema.nullable().optional(),
});

export const OrderSalesTaxSchema = z.object({
	label: z.string().nullable().optional(),
	amount: z.number().nullable().optional(),
	type: z.string().nullable().optional(),
});

export const OrderNoteSchema = z.object({
	id: z.string().nullable().optional(),
	content: z.string().nullable().optional(),
	createdOn: z.string().nullable().optional(),
	username: z.string().nullable().optional(),
});

export const OrderPaymentSchema = z.object({
	provider: z.string().nullable().optional(),
	transactionId: z.string().nullable().optional(),
	accountId: z.string().nullable().optional(),
});

const OrderDownloadLinkPairSchema = z.object({
	imageUrl: z.string().nullable().optional(),
	pdfUrl: z.string().nullable().optional(),
});

export const OrderDownloadLinksSchema = z.object({
	single: OrderDownloadLinkPairSchema.nullable().optional(),
	zip: OrderDownloadLinkPairSchema.nullable().optional(),
});

export const OrderFulfilmentSchema = z.object({
	id: z.string().nullable().optional(),
	emailAddress: z.string().nullable().optional(),
	scheduledFor: z.string().nullable().optional(),
	success: z.boolean().nullable().optional(),
});

/** Order fields shared by the order object and the `order` embedded in a gift card. */
export const OrderBaseSchema = z.object({
	id: z.string(),
	orderNumber: z.string().nullable().optional(),
	createdOn: z.string().nullable().optional(),
	selectedRecipient: z.string().nullable().optional(),
	purchaserEmail: z.string().nullable().optional(),
	purchaserName: z.string().nullable().optional(),
	currency: z.string().nullable().optional(),
	revenue: z.number().nullable().optional(),
	tip: z.number().nullable().optional(),
	serviceFee: z.number().nullable().optional(),
	discount: z.number().nullable().optional(),
	shippingFee: z.number().nullable().optional(),
	referrer: z.string().nullable().optional(),
	source: z.string().nullable().optional(),
	promotions: z.array(OrderPromotionSchema).nullable().optional(),
	customFields: z.array(OrderCustomFieldSchema).nullable().optional(),
	salesTaxes: z.array(OrderSalesTaxSchema).nullable().optional(),
	notes: z.array(OrderNoteSchema).nullable().optional(),
	metadata: MetadataSchema.nullable().optional(),
	downloadLinks: OrderDownloadLinksSchema.nullable().optional(),
	payment: OrderPaymentSchema.nullable().optional(),
});

export const GiftCardSchema = z.object({
	canBeRedeemed: z.boolean().nullable().optional(),
	hasExpired: z.boolean().nullable().optional(),
	notYetValid: z.boolean().nullable().optional(),
	isVoided: z.boolean().nullable().optional(),
	code: z.string(),
	title: z.string().nullable().optional(),
	subTitle: z.string().nullable().optional(),
	message: z.string().nullable().optional(),
	fulfilledOn: z.string().nullable().optional(),
	recipientName: z.string().nullable().optional(),
	recipientEmail: z.string().nullable().optional(),
	backingType: z.string().nullable().optional(),
	remainingValue: z.number().nullable().optional(),
	remainingUnits: z.number().nullable().optional(),
	initialValue: z.number().nullable().optional(),
	initialUnits: z.number().nullable().optional(),
	equivalentValuePerUnit: z.number().nullable().optional(),
	terms: z.string().nullable().optional(),
	sku: z.string().nullable().optional(),
	expiresOn: z.string().nullable().optional(),
	validFrom: z.string().nullable().optional(),
	voidedOn: z.string().nullable().optional(),
	fulfilledBy: z.string().nullable().optional(),
	order: OrderBaseSchema.nullable().optional(),
	postalFulfilment: GiftCardPostalFulfilmentSchema.nullable().optional(),
	emailFulfilment: GiftCardEmailFulfilmentSchema.nullable().optional(),
	downloadLinks: GiftCardDownloadLinksSchema.nullable().optional(),
	ledger: z.array(GiftCardLedgerEntrySchema).nullable().optional(),
});
export type GiftCard = z.infer<typeof GiftCardSchema>;

export const GiftCardsListInputSchema = z
	.object({
		status: z.enum(['active', 'expired', 'redeemed', 'voided']).optional(),
		createdOnOrAfter: z.string().optional(),
		updatedOnOrAfter: z.string().optional(),
		orderId: z.string().optional(),
		sku: z.string().optional(),
		recipientEmail: z.string().optional(),
		purchaserEmail: z.string().optional(),
		paymentTransactionId: z.string().optional(),
		limit: z.number().int().min(1).max(100).optional(),
		offset: z.number().int().min(0).optional(),
	})
	.strict();
export type GiftCardsListInput = z.infer<typeof GiftCardsListInputSchema>;

/** GET /gift-cards returns `{ giftCards, total, hasMore }`, not a bare array. */
export const GiftCardsListResponseSchema = z.object({
	giftCards: z.array(GiftCardSchema),
	total: z.number().nullable().optional(),
	hasMore: z.boolean().nullable().optional(),
});
export type GiftCardsListResponse = z.infer<typeof GiftCardsListResponseSchema>;

export const GiftCardsGetInputSchema = z
	.object({
		code: z.string().min(1),
	})
	.strict();
export type GiftCardsGetInput = z.infer<typeof GiftCardsGetInputSchema>;

export const GiftCardsUpdateInputSchema = z
	.object({
		code: z.string().min(1),
		patch: z.array(JsonPatchOperationSchema),
	})
	.strict();
export type GiftCardsUpdateInput = z.infer<typeof GiftCardsUpdateInputSchema>;

/** PATCH /gift-cards/{code}: Gift Up documents the status only, so an empty body is accepted. */
export const GiftCardsUpdateResponseSchema = z.union([
	GiftCardSchema,
	EmptyResponseSchema,
]);
export type GiftCardsUpdateResponse = z.infer<
	typeof GiftCardsUpdateResponseSchema
>;

export const GiftCardsReactivateInputSchema = z
	.object({
		code: z.string().min(1),
		reason: z.string().optional(),
		locationId: z.string().nullable().optional(),
		metadata: MetadataSchema.optional(),
	})
	.strict();
export type GiftCardsReactivateInput = z.infer<
	typeof GiftCardsReactivateInputSchema
>;

// Gift Up documents no 2xx body for reactivate/void; `isAlreadyActive` and
// `isAlreadyVoided` belong to the 422 error body, which core raises as an ApiError.
export const GiftCardsReactivateResponseSchema = EmptyResponseSchema;
export type GiftCardsReactivateResponse = z.infer<
	typeof GiftCardsReactivateResponseSchema
>;

export const GiftCardsVoidInputSchema = z
	.object({
		code: z.string().min(1),
		reason: z.string().optional(),
		locationId: z.string().nullable().optional(),
		metadata: MetadataSchema.optional(),
	})
	.strict();
export type GiftCardsVoidInput = z.infer<typeof GiftCardsVoidInputSchema>;

export const GiftCardsVoidResponseSchema = EmptyResponseSchema;
export type GiftCardsVoidResponse = z.infer<typeof GiftCardsVoidResponseSchema>;

export const GiftCardsTopUpInputSchema = z
	.object({
		code: z.string().min(1),
		amount: z.number().positive().nullable().optional(),
		units: z.number().int().positive().nullable().optional(),
		reason: z.string().nullable().optional(),
		locationId: z.string().nullable().optional(),
		metadata: MetadataSchema.optional(),
	})
	.strict();
export type GiftCardsTopUpInput = z.infer<typeof GiftCardsTopUpInputSchema>;

export const GiftCardsTopUpResponseSchema = z.object({
	transactionId: z.string(),
	remainingCredit: z.number().nullable().optional(),
	remainingUnits: z.number().nullable().optional(),
});
export type GiftCardsTopUpResponse = z.infer<
	typeof GiftCardsTopUpResponseSchema
>;

export const GiftCardsRedeemInputSchema = z
	.object({
		code: z.string().min(1),
		amount: z.number().positive().nullable().optional(),
		units: z.number().int().positive().nullable().optional(),
		reason: z.string().nullable().optional(),
		locationId: z.string().nullable().optional(),
		redeemedOn: z.string().nullable().optional(),
		metadata: MetadataSchema.optional(),
	})
	.strict();
export type GiftCardsRedeemInput = z.infer<typeof GiftCardsRedeemInputSchema>;

export const GiftCardsRedeemResponseSchema = z.object({
	transactionId: z.string(),
	redeemedAmount: z.number().nullable().optional(),
	remainingCredit: z.number().nullable().optional(),
	redeemedUnits: z.number().nullable().optional(),
	remainingUnits: z.number().nullable().optional(),
});
export type GiftCardsRedeemResponse = z.infer<
	typeof GiftCardsRedeemResponseSchema
>;

export const GiftCardsRedeemInFullInputSchema = z
	.object({
		code: z.string().min(1),
		reason: z.string().nullable().optional(),
		locationId: z.string().nullable().optional(),
		redeemedOn: z.string().nullable().optional(),
		metadata: MetadataSchema.optional(),
	})
	.strict();
export type GiftCardsRedeemInFullInput = z.infer<
	typeof GiftCardsRedeemInFullInputSchema
>;

export const GiftCardsRedeemInFullResponseSchema =
	GiftCardsRedeemResponseSchema;
export type GiftCardsRedeemInFullResponse = z.infer<
	typeof GiftCardsRedeemInFullResponseSchema
>;

export const GiftCardsUndoRedemptionInputSchema = z
	.object({
		code: z.string().min(1),
		transactionId: z.string().min(1),
		reason: z.string().nullable().optional(),
		metadata: MetadataSchema.optional(),
	})
	.strict();
export type GiftCardsUndoRedemptionInput = z.infer<
	typeof GiftCardsUndoRedemptionInputSchema
>;

export const GiftCardsUndoRedemptionResponseSchema = z.object({
	transactionId: z.string(),
	amountReversed: z.number().nullable().optional(),
	unitsReversed: z.number().nullable().optional(),
	alreadyReversed: z.boolean().nullable().optional(),
	remainingCredit: z.number().nullable().optional(),
	remainingUnits: z.number().nullable().optional(),
});
export type GiftCardsUndoRedemptionResponse = z.infer<
	typeof GiftCardsUndoRedemptionResponseSchema
>;

export const GiftCardsTransferBalancesInputSchema = z
	.object({
		sourceGiftCards: z.array(z.string().min(1)).min(1),
		destinationGiftCard: z.string().min(1),
		reason: z.string().nullable().optional(),
		locationId: z.string().nullable().optional(),
		metadata: MetadataSchema.optional(),
	})
	.strict();
export type GiftCardsTransferBalancesInput = z.infer<
	typeof GiftCardsTransferBalancesInputSchema
>;

export const GiftCardsTransferBalancesResponseSchema = z.object({
	transferredCredit: z.number().nullable().optional(),
	transferredUnits: z.number().nullable().optional(),
});
export type GiftCardsTransferBalancesResponse = z.infer<
	typeof GiftCardsTransferBalancesResponseSchema
>;

// ==========================================
// 4. Orders
// ==========================================

export const OrderSchema = OrderBaseSchema.extend({
	fulfilments: z.array(OrderFulfilmentSchema).nullable().optional(),
	giftCards: z.array(GiftCardSchema).nullable().optional(),
});
export type Order = z.infer<typeof OrderSchema>;

export const OrdersListInputSchema = z
	.object({
		createdOnOrAfter: z.string().optional(),
		purchaserEmail: z.string().optional(),
		source: z
			.enum([
				'API',
				'Checkout',
				'Dashboard',
				'Import',
				'Square',
				'Vend',
				'External',
			])
			.optional(),
		limit: z.number().int().min(1).max(100).optional(),
		offset: z.number().int().min(0).optional(),
	})
	.strict();
export type OrdersListInput = z.infer<typeof OrdersListInputSchema>;

/** GET /orders returns `{ orders, total, hasMore }`, not a bare array. */
export const OrdersListResponseSchema = z.object({
	orders: z.array(OrderSchema),
	total: z.number().nullable().optional(),
	hasMore: z.boolean().nullable().optional(),
});
export type OrdersListResponse = z.infer<typeof OrdersListResponseSchema>;

export const OrdersGetInputSchema = z
	.object({
		id: z.string().min(1),
	})
	.strict();
export type OrdersGetInput = z.infer<typeof OrdersGetInputSchema>;

export const OrderItemDetailInputSchema = z
	.object({
		quantity: z.number().int().min(1).max(1000).default(1),
		/** Id of an existing item. When set, Gift Up ignores the other fields except quantity, value and price. */
		id: z.string().optional(),
		name: z.string().optional(),
		description: z.string().optional(),
		code: z.string().optional(),
		backingType: z.enum(['Currency', 'Units']).optional(),
		price: z.number().optional(),
		value: z.number().optional(),
		units: z.number().int().nullable().optional(),
		equivalentValuePerUnit: z.number().nullable().optional(),
		overrideExpiry: z.boolean().optional(),
		expiresOn: z.string().nullable().optional(),
		expiresInMonths: z.number().int().nullable().optional(),
		expiresInDays: z.number().nullable().optional(),
		overrideValidFrom: z.boolean().optional(),
		validFrom: z.string().nullable().optional(),
		validFromInDays: z.number().nullable().optional(),
		sku: z.string().optional(),
		terms: z.string().nullable().optional(),
	})
	.strict();
export type OrderItemDetailInput = z.infer<typeof OrderItemDetailInputSchema>;

export const OrderShippingAddressInputSchema = z
	.object({
		address1: z.string().optional(),
		address2: z.string().optional(),
		city: z.string().optional(),
		state: z.string().optional(),
		postalCode: z.string().optional(),
		countryCode: z.string().length(3).optional(),
	})
	.strict();

export const OrderShippingOptionInputSchema = z
	.object({
		id: z.string().optional(),
		name: z.string().optional(),
		price: z.number().optional(),
	})
	.strict();

/** Order-level recipient. Without it Gift Up sends no gift card email. */
export const OrderRecipientDetailsInputSchema = z
	.object({
		recipientName: z.string().optional(),
		recipientEmail: z.string().email().optional(),
		message: z.string().optional(),
		scheduledFor: z.string().optional(),
		fulfilmentMethod: z.enum(['Email', 'Post', 'None']).optional(),
		shippingAddress: OrderShippingAddressInputSchema.optional(),
		shippingOption: OrderShippingOptionInputSchema.optional(),
	})
	.strict();

export const OrderCustomFieldInputSchema = z
	.object({
		label: z.string().min(1),
		value: CustomFieldValueSchema,
		showOnGiftCard: z.boolean().optional(),
		showOnRedeemApp: z.boolean().optional(),
	})
	.strict();

export const OrderSalesTaxInputSchema = z
	.object({
		label: z.string().min(1),
		amount: z.number(),
		type: z.enum(['inclusive', 'exclusive']),
	})
	.strict();

export const OrdersCreateInputSchema = z
	.object({
		orderDate: z.string().optional(),
		disableAllEmails: z.boolean().optional(),
		purchaserEmail: z.string().email(),
		purchaserName: z.string().min(1),
		tip: z.number().min(0).optional(),
		serviceFee: z.number().min(0).optional(),
		discount: z.number().min(0).optional(),
		referrer: z.string().optional(),
		revenue: z.number().min(0).optional(),
		itemDetails: z.array(OrderItemDetailInputSchema).min(1),
		recipientDetails: OrderRecipientDetailsInputSchema.optional(),
		customFields: z.array(OrderCustomFieldInputSchema).optional(),
		salesTaxes: z.array(OrderSalesTaxInputSchema).optional(),
		metadata: MetadataSchema.optional(),
	})
	.strict();
export type OrdersCreateInput = z.input<typeof OrdersCreateInputSchema>;

export const OrdersUpdateInputSchema = z
	.object({
		/** Order id or order number. */
		id: z.string().min(1),
		patch: z.array(JsonPatchOperationSchema),
	})
	.strict();
export type OrdersUpdateInput = z.infer<typeof OrdersUpdateInputSchema>;

/** PATCH /orders/{id}: Gift Up documents the status only, so an empty body is accepted. */
export const OrdersUpdateResponseSchema = z.union([
	OrderSchema,
	EmptyResponseSchema,
]);
export type OrdersUpdateResponse = z.infer<typeof OrdersUpdateResponseSchema>;

export const OrdersAddNoteInputSchema = z
	.object({
		id: z.string().min(1),
		content: z.string().min(1).max(500),
	})
	.strict();
export type OrdersAddNoteInput = z.infer<typeof OrdersAddNoteInputSchema>;

export const OrderCodeUpdateSchema = z.object({
	oldCode: z.string().min(1),
	newCode: z.string().min(3),
});

export const OrdersMarkAsPostedInputSchema = z
	.object({
		id: z.string().min(1),
		codes: z.array(OrderCodeUpdateSchema).min(1),
	})
	.strict();
export type OrdersMarkAsPostedInput = z.infer<
	typeof OrdersMarkAsPostedInputSchema
>;

// ==========================================
// 5. Items
// ==========================================

export const ItemSchema = z.object({
	id: z.string(),
	name: z.string().nullable().optional(),
	description: z.string().nullable().optional(),
	backingType: z.string().nullable().optional(),
	priceType: z.string().nullable().optional(),
	price: z.number().nullable().optional(),
	value: z.number().nullable().optional(),
	units: z.number().nullable().optional(),
	equivalentValuePerUnit: z.number().nullable().optional(),
	minimumPrice: z.number().nullable().optional(),
	maximumPrice: z.number().nullable().optional(),
	availableFrom: z.string().nullable().optional(),
	availableUntil: z.string().nullable().optional(),
	overrideValidFrom: z.boolean().nullable().optional(),
	validFrom: z.string().nullable().optional(),
	validFromInDays: z.number().nullable().optional(),
	overrideExpiry: z.boolean().nullable().optional(),
	expiresOn: z.string().nullable().optional(),
	expiresInMonths: z.number().nullable().optional(),
	expiresInDays: z.number().nullable().optional(),
	group: z.string().nullable().optional(),
	groupId: z.string().nullable().optional(),
	detailsURL: z.string().nullable().optional(),
	artworkURL: z.string().nullable().optional(),
	stockLevel: z.number().nullable().optional(),
	codes: z.array(z.string()).nullable().optional(),
	perOrderLimit: z.number().nullable().optional(),
	additionalTerms: z.string().nullable().optional(),
	sku: z.string().nullable().optional(),
});
export type Item = z.infer<typeof ItemSchema>;

export const ItemsListInputSchema = z
	.object({
		groupId: z.string().optional(),
	})
	.strict();
export type ItemsListInput = z.infer<typeof ItemsListInputSchema>;

export const ItemsListResponseSchema = z.array(ItemSchema);
export type ItemsListResponse = z.infer<typeof ItemsListResponseSchema>;

export const ItemsGetInputSchema = z
	.object({
		id: z.string().min(1),
	})
	.strict();
export type ItemsGetInput = z.infer<typeof ItemsGetInputSchema>;

export const ItemsCreateInputSchema = z
	.object({
		name: z.string().min(1),
		description: z.string().optional(),
		backingType: z.enum(['Currency', 'Units']).optional().default('Currency'),
		priceType: z.enum(['Specified', 'Custom']).optional().default('Specified'),
		price: z.number().optional(),
		value: z.number().optional(),
		units: z.number().int().nullable().optional(),
		equivalentValuePerUnit: z.number().nullable().optional(),
		minimumPrice: z.number().nullable().optional(),
		maximumPrice: z.number().nullable().optional(),
		availableFrom: z.string().nullable().optional(),
		availableUntil: z.string().nullable().optional(),
		overrideValidFrom: z.boolean().optional(),
		validFrom: z.string().nullable().optional(),
		validFromInDays: z.number().nullable().optional(),
		overrideExpiry: z.boolean().optional(),
		expiresOn: z.string().nullable().optional(),
		expiresInMonths: z.number().int().nullable().optional(),
		expiresInDays: z.number().nullable().optional(),
		/** Group name. Set either group or groupId, not both. */
		group: z.string().nullable().optional(),
		groupId: z.string().nullable().optional(),
		detailsURL: z.string().url().nullable().optional(),
		stockLevel: z.number().int().nullable().optional(),
		codes: z.array(z.string()).optional(),
		perOrderLimit: z.number().int().nullable().optional(),
		additionalTerms: z.string().nullable().optional(),
		sku: z.string().nullable().optional(),
	})
	.strict();
export type ItemsCreateInput = z.input<typeof ItemsCreateInputSchema>;

export const ItemsUpdateInputSchema = z
	.object({
		id: z.string().min(1),
		patch: z.array(JsonPatchOperationSchema),
	})
	.strict();
export type ItemsUpdateInput = z.infer<typeof ItemsUpdateInputSchema>;

/** PATCH /items/{id}: Gift Up documents the status only, so an empty body is accepted. */
export const ItemsUpdateResponseSchema = z.union([
	ItemSchema,
	EmptyResponseSchema,
]);
export type ItemsUpdateResponse = z.infer<typeof ItemsUpdateResponseSchema>;

export const ItemsDeleteInputSchema = z
	.object({
		id: z.string().min(1),
	})
	.strict();
export type ItemsDeleteInput = z.infer<typeof ItemsDeleteInputSchema>;

// ==========================================
// 6. Item Groups
// ==========================================

export const ItemGroupSchema = z.object({
	id: z.string(),
	name: z.string().nullable().optional(),
	description: z.string().nullable().optional(),
	sortOrder: z.number().nullable().optional(),
	autoExpand: z.boolean().nullable().optional(),
});
export type ItemGroup = z.infer<typeof ItemGroupSchema>;

export const GroupsListInputSchema = z.object({}).strict();
export type GroupsListInput = z.infer<typeof GroupsListInputSchema>;

export const GroupsListResponseSchema = z.array(ItemGroupSchema);
export type GroupsListResponse = z.infer<typeof GroupsListResponseSchema>;

export const GroupsGetInputSchema = z
	.object({
		id: z.string().min(1),
	})
	.strict();
export type GroupsGetInput = z.infer<typeof GroupsGetInputSchema>;

export const GroupsCreateInputSchema = z
	.object({
		name: z.string().min(1),
		description: z.string().optional(),
		sortOrder: z.number().int().optional(),
		autoExpand: z.boolean().optional(),
	})
	.strict();
export type GroupsCreateInput = z.infer<typeof GroupsCreateInputSchema>;

/** POST /groups and PATCH /groups/{id}: Gift Up documents the 200 status only, so an empty body is accepted. */
export const GroupsWriteResponseSchema = z.union([
	ItemGroupSchema,
	EmptyResponseSchema,
]);
export type GroupsWriteResponse = z.infer<typeof GroupsWriteResponseSchema>;

export const GroupsUpdateInputSchema = z
	.object({
		id: z.string().min(1),
		patch: z.array(JsonPatchOperationSchema),
	})
	.strict();
export type GroupsUpdateInput = z.infer<typeof GroupsUpdateInputSchema>;

export const GroupsDeleteInputSchema = z
	.object({
		id: z.string().min(1),
	})
	.strict();
export type GroupsDeleteInput = z.infer<typeof GroupsDeleteInputSchema>;

// ==========================================
// 7. Locations
// ==========================================

export const LocationSchema = z.object({
	id: z.string(),
	name: z.string().nullable().optional(),
});
export type Location = z.infer<typeof LocationSchema>;

export const LocationsListInputSchema = z.object({}).strict();
export type LocationsListInput = z.infer<typeof LocationsListInputSchema>;

export const LocationsListResponseSchema = z.array(LocationSchema);
export type LocationsListResponse = z.infer<typeof LocationsListResponseSchema>;

// ==========================================
// 8. Promotions
// ==========================================

export const PromotionSchema = z.object({
	id: z.string(),
	name: z.string().nullable().optional(),
	noBenefit: z.boolean().nullable().optional(),
	publishedOn: z.string().nullable().optional(),
	stoppedOn: z.string().nullable().optional(),
	// `passthrough` because benefits, usage, limitations and triggers vary by promotion type
	benefits: z.object({}).passthrough().nullable().optional(),
	usage: z.object({}).passthrough().nullable().optional(),
	limitations: z.object({}).passthrough().nullable().optional(),
	triggers: z.object({}).passthrough().nullable().optional(),
});
export type Promotion = z.infer<typeof PromotionSchema>;

export const PromotionsListInputSchema = z.object({}).strict();
export type PromotionsListInput = z.infer<typeof PromotionsListInputSchema>;

export const PromotionsListResponseSchema = z.array(PromotionSchema);
export type PromotionsListResponse = z.infer<
	typeof PromotionsListResponseSchema
>;

// ==========================================
// 9. Reports
// ==========================================

export const ReportTransactionSchema = z.object({
	id: z.string(),
	eventOccuredOn: z.string().nullable().optional(),
	eventOccuredAtLocationId: z.string().nullable().optional(),
	eventType: z.string().nullable().optional(),
	reason: z.string().nullable().optional(),
	referrer: z.string().nullable().optional(),
	metadata: MetadataSchema.nullable().optional(),
	orderId: z.string().nullable().optional(),
	currency: z.string().nullable().optional(),
	giftUpFee: z.union([z.number(), z.string()]).nullable().optional(),
	whoName: z.string().nullable().optional(),
	whoEmail: z.string().nullable().optional(),
	/** Financial details; only set on OrderPlaced events. */
	orderDetails: z
		.object({
			income: z.number().nullable().optional(),
			serviceFee: z.number().nullable().optional(),
			tip: z.number().nullable().optional(),
			shippingFee: z.number().nullable().optional(),
		})
		.nullable()
		.optional(),
	giftCard: z
		.object({
			id: z.string().nullable().optional(),
			code: z.string().nullable().optional(),
			valueChange: z.number().nullable().optional(),
			unitChange: z.number().nullable().optional(),
			title: z.string().nullable().optional(),
		})
		.nullable()
		.optional(),
});
export type ReportTransaction = z.infer<typeof ReportTransactionSchema>;

export const ReportsListTransactionsInputSchema = z
	.object({
		eventOccurredOnOrAfter: z.string().optional(),
		eventOccurredOnOrBefore: z.string().optional(),
		events: z
			.array(
				z.enum([
					'OrderPlaced',
					'GiftCardCreated',
					'CreditAdded',
					'Redeemed',
					'Expired',
					'Unexpired',
					'Voided',
					'Reactivated',
				]),
			)
			.optional(),
		users: z.array(z.string()).optional(),
		locations: z.array(z.string()).optional(),
		code: z.string().optional(),
		limit: z.number().int().min(1).max(100).optional(),
		offset: z.number().int().min(0).optional(),
	})
	.strict();
export type ReportsListTransactionsInput = z.infer<
	typeof ReportsListTransactionsInputSchema
>;

/** GET /reports/transactions returns `{ transactions, total, hasMore }`, not a bare array. */
export const ReportsListTransactionsResponseSchema = z.object({
	transactions: z.array(ReportTransactionSchema),
	total: z.number().nullable().optional(),
	hasMore: z.boolean().nullable().optional(),
});
export type ReportsListTransactionsResponse = z.infer<
	typeof ReportsListTransactionsResponseSchema
>;

export const ReportsGetTransactionInputSchema = z
	.object({
		id: z.string().min(1),
	})
	.strict();
export type ReportsGetTransactionInput = z.infer<
	typeof ReportsGetTransactionInputSchema
>;

// ==========================================
// 10. Settings
// ==========================================

export const CheckoutSettingsSchema = z.object({
	logoUrl: z.string().nullable().optional(),
	introductionText: z.string().nullable().optional(),
	fontFamily: z.string().nullable().optional(),
	fontSize: z.string().nullable().optional(),
	themeColor: z.string().nullable().optional(),
	backgroundColor: z.string().nullable().optional(),
	hostedBackgroundColor: z.string().nullable().optional(),
	hostedTextColor: z.string().nullable().optional(),
	continueLinkText: z.string().nullable().optional(),
	continueLinkUrl: z.string().nullable().optional(),
	redirectUrl: z.string().nullable().optional(),
	additionalCustomHtml: z.string().nullable().optional(),
	showBalanceChecker: z.boolean().nullable().optional(),
	defaultFor: z.string().nullable().optional(),
	serviceFeeCharged: z.boolean().nullable().optional(),
	serviceFeeFixed: z.number().nullable().optional(),
	serviceFeePercentage: z.number().nullable().optional(),
	tipsEnabled: z.boolean().nullable().optional(),
	allowCustomTipValues: z.boolean().nullable().optional(),
	overrideTipValues: z.array(z.string()).nullable().optional(),
});
export type CheckoutSettings = z.infer<typeof CheckoutSettingsSchema>;

export const SettingsGetCheckoutInputSchema = z.object({}).strict();
export type SettingsGetCheckoutInput = z.infer<
	typeof SettingsGetCheckoutInputSchema
>;

export const SettingsUpdateCheckoutInputSchema = z
	.object({
		patch: z.array(JsonPatchOperationSchema),
	})
	.strict();
export type SettingsUpdateCheckoutInput = z.infer<
	typeof SettingsUpdateCheckoutInputSchema
>;

/** The settings PATCH endpoints document a 200 status only, so an empty body is accepted. */
export const SettingsUpdateCheckoutResponseSchema = z.union([
	CheckoutSettingsSchema,
	EmptyResponseSchema,
]);
export type SettingsUpdateCheckoutResponse = z.infer<
	typeof SettingsUpdateCheckoutResponseSchema
>;

const EmailTemplateSettingsSchema = z.object({
	subjectLine: z.string().nullable().optional(),
	title: z.string().nullable().optional(),
	introText: z.string().nullable().optional(),
	footerText: z.string().nullable().optional(),
	buttonLabel: z.string().nullable().optional(),
	buttonUrl: z.string().nullable().optional(),
	buttonColour: z.string().nullable().optional(),
	buttonAlignment: z.string().nullable().optional(),
});

export const EmailSettingsSchema = z.object({
	logoUrl: z.string().nullable().optional(),
	logoAlignment: z.string().nullable().optional(),
	logoWidth: z.number().nullable().optional(),
	fromEmail: z.string().nullable().optional(),
	fromName: z.string().nullable().optional(),
	giftCardEmail: EmailTemplateSettingsSchema.nullable().optional(),
	receiptEmail: EmailTemplateSettingsSchema.nullable().optional(),
});
export type EmailSettings = z.infer<typeof EmailSettingsSchema>;

export const SettingsGetEmailInputSchema = z.object({}).strict();
export type SettingsGetEmailInput = z.infer<typeof SettingsGetEmailInputSchema>;

export const SettingsUpdateEmailInputSchema = z
	.object({
		patch: z.array(JsonPatchOperationSchema),
	})
	.strict();
export type SettingsUpdateEmailInput = z.infer<
	typeof SettingsUpdateEmailInputSchema
>;

export const SettingsUpdateEmailResponseSchema = z.union([
	EmailSettingsSchema,
	EmptyResponseSchema,
]);
export type SettingsUpdateEmailResponse = z.infer<
	typeof SettingsUpdateEmailResponseSchema
>;

export const GiftCardSettingsSchema = z.object({
	defaultDescription: z.string().nullable().optional(),
	barcodeFormat: z.string().nullable().optional(),
	expiryInMonths: z.number().nullable().optional(),
	expiryInDays: z.number().nullable().optional(),
	validFromInDays: z.number().nullable().optional(),
	showIssuedOnDate: z.boolean().nullable().optional(),
	showBalance: z.boolean().nullable().optional(),
	showBarcode: z.boolean().nullable().optional(),
	generalTerms: z.string().nullable().optional(),
	codeFormat: z.string().nullable().optional(),
});
export type GiftCardSettings = z.infer<typeof GiftCardSettingsSchema>;

export const SettingsGetGiftCardInputSchema = z.object({}).strict();
export type SettingsGetGiftCardInput = z.infer<
	typeof SettingsGetGiftCardInputSchema
>;

export const SettingsUpdateGiftCardInputSchema = z
	.object({
		patch: z.array(JsonPatchOperationSchema),
	})
	.strict();
export type SettingsUpdateGiftCardInput = z.infer<
	typeof SettingsUpdateGiftCardInputSchema
>;

export const SettingsUpdateGiftCardResponseSchema = z.union([
	GiftCardSettingsSchema,
	EmptyResponseSchema,
]);
export type SettingsUpdateGiftCardResponse = z.infer<
	typeof SettingsUpdateGiftCardResponseSchema
>;

export const ArtworkSchema = z.object({
	id: z.string(),
	url: z.string().nullable().optional(),
	sortOrder: z.number().nullable().optional(),
});
export type Artwork = z.infer<typeof ArtworkSchema>;

export const SettingsListArtworkInputSchema = z.object({}).strict();
export type SettingsListArtworkInput = z.infer<
	typeof SettingsListArtworkInputSchema
>;

export const SettingsListArtworkResponseSchema = z.array(ArtworkSchema);
export type SettingsListArtworkResponse = z.infer<
	typeof SettingsListArtworkResponseSchema
>;

export const SettingsUploadArtworkInputSchema = z
	.object({
		/** An absolute image URL, or a base64 data URI starting with `data:image`. */
		url: z
			.string()
			.min(1)
			.refine((v) => v.startsWith('data:image') || /^https?:\/\//i.test(v), {
				message: 'url must be an absolute http(s) URL or a data:image URI',
			}),
		/** Deletes every existing artwork before adding this one. */
		replaceAllExistingArtwork: z.boolean().optional(),
		replaceArtworkId: z.string().optional(),
	})
	.strict();
export type SettingsUploadArtworkInput = z.infer<
	typeof SettingsUploadArtworkInputSchema
>;

/** POST /settings/gift-card/artwork documents a 200 status only, so an empty body is accepted. */
export const SettingsUploadArtworkResponseSchema = z.union([
	ArtworkSchema,
	z.array(ArtworkSchema),
	EmptyResponseSchema,
]);
export type SettingsUploadArtworkResponse = z.infer<
	typeof SettingsUploadArtworkResponseSchema
>;

export const SettingsDeleteArtworkInputSchema = z
	.object({
		id: z.string().min(1),
	})
	.strict();
export type SettingsDeleteArtworkInput = z.infer<
	typeof SettingsDeleteArtworkInputSchema
>;

export const ShippingPostalOptionSchema = z.object({
	id: z.string(),
	name: z.string().nullable().optional(),
	price: z.number().nullable().optional(),
	sortOrder: z.number().nullable().optional(),
	type: z.string().nullable().optional(),
	countries: z
		.array(
			z.object({
				name: z.string().nullable().optional(),
				// The docs' example uses `IsoCode`, the property table `isoCode`
				IsoCode: z.string().nullable().optional(),
				isoCode: z.string().nullable().optional(),
			}),
		)
		.nullable()
		.optional(),
});

export const ShippingSettingsSchema = z.object({
	enableDigitalFulfilment: z.boolean().nullable().optional(),
	enableSelfFulfilledPostal: z.boolean().nullable().optional(),
	enablePostalMessage: z.boolean().nullable().optional(),
	postalShippingOptions: z
		.array(ShippingPostalOptionSchema)
		.nullable()
		.optional(),
});
export type ShippingSettings = z.infer<typeof ShippingSettingsSchema>;

export const SettingsGetShippingInputSchema = z.object({}).strict();
export type SettingsGetShippingInput = z.infer<
	typeof SettingsGetShippingInputSchema
>;

// ==========================================
// 11. Users
// ==========================================

export const UserLocationSchema = z.object({
	id: z.string(),
	name: z.string().nullable().optional(),
});

export const UserSchema = z.object({
	id: z.string(),
	name: z.string().nullable().optional(),
	email: z.string().nullable().optional(),
	avatarUrl: z.string().nullable().optional(),
	pin: z.string().nullable().optional(),
	isAdministrator: z.boolean().nullable().optional(),
	emailConfirmed: z.boolean().nullable().optional(),
	hiddenInRedeemApp: z.boolean().nullable().optional(),
	disableSearchInRedeemApp: z.boolean().nullable().optional(),
	hideLogInRedeemApp: z.boolean().nullable().optional(),
	expiredGiftCardRedemptionDisabled: z.boolean().nullable().optional(),
	redeemLocationRestrictionEnforced: z.boolean().nullable().optional(),
	locations: z.array(UserLocationSchema).nullable().optional(),
});
export type User = z.infer<typeof UserSchema>;

export const UsersListInputSchema = z.object({}).strict();
export type UsersListInput = z.infer<typeof UsersListInputSchema>;

export const UsersListResponseSchema = z.array(UserSchema);
export type UsersListResponse = z.infer<typeof UsersListResponseSchema>;

export const UsersGetInputSchema = z
	.object({
		id: z.string().min(1),
	})
	.strict();
export type UsersGetInput = z.infer<typeof UsersGetInputSchema>;

export const UsersInviteInputSchema = z
	.object({
		email: z.string().email(),
		name: z.string().optional(),
		/** An image URL or a base64 data URI. */
		avatarUrl: z.string().optional(),
		pin: z.string().optional(),
		isAdministrator: z.boolean().optional(),
		hiddenInRedeemApp: z.boolean().optional(),
		disableSearchInRedeemApp: z.boolean().optional(),
		hideLogInRedeemApp: z.boolean().optional(),
		expiredGiftCardRedemptionDisabled: z.boolean().optional(),
		redeemLocationRestrictionEnforced: z.boolean().optional(),
	})
	.strict();
export type UsersInviteInput = z.infer<typeof UsersInviteInputSchema>;

export const UsersUpdateInputSchema = z
	.object({
		id: z.string().min(1),
		patch: z.array(JsonPatchOperationSchema),
	})
	.strict();
export type UsersUpdateInput = z.infer<typeof UsersUpdateInputSchema>;

/** PATCH /users/{id}: Gift Up documents the status only, so an empty body is accepted. */
export const UsersUpdateResponseSchema = z.union([
	UserSchema,
	EmptyResponseSchema,
]);
export type UsersUpdateResponse = z.infer<typeof UsersUpdateResponseSchema>;

export const UsersDeleteInputSchema = z
	.object({
		id: z.string().min(1),
	})
	.strict();
export type UsersDeleteInput = z.infer<typeof UsersDeleteInputSchema>;

// ==========================================
// 12. Integrations
// ==========================================

// The Stripe secret keys (liveSecretKey, testSecretKey) are left out on purpose:
// z.object strips them from the GET response so they never reach an agent.
export const StripeConnectionSchema = z.object({
	enableIdeal: z.boolean().nullable().optional(),
	enableBancontact: z.boolean().nullable().optional(),
	enableGiropay: z.boolean().nullable().optional(),
	enableEps: z.boolean().nullable().optional(),
	enableMultibanco: z.boolean().nullable().optional(),
	enablePrzelewy24: z.boolean().nullable().optional(),
	enableWeChat: z.boolean().nullable().optional(),
	enableAlipay: z.boolean().nullable().optional(),
	enablePayPal: z.boolean().nullable().optional(),
	enableKlarna: z.boolean().nullable().optional(),
	enableAffirm: z.boolean().nullable().optional(),
	enableAfterpayClearpay: z.boolean().nullable().optional(),
	enableFpx: z.boolean().nullable().optional(),
	enableBlik: z.boolean().nullable().optional(),
	enableCashApp: z.boolean().nullable().optional(),
	enableGrabPay: z.boolean().nullable().optional(),
	enablePayNow: z.boolean().nullable().optional(),
	enablePromptPay: z.boolean().nullable().optional(),
	enablePix: z.boolean().nullable().optional(),
	enableZip: z.boolean().nullable().optional(),
	enableMobilePay: z.boolean().nullable().optional(),
	livePublicKey: z.string().nullable().optional(),
	testPublicKey: z.string().nullable().optional(),
	connectAccountId: z.string().nullable().optional(),
	applicationFeePercentage: z.number().nullable().optional(),
	applicationFeeFixed: z.number().nullable().optional(),
	statementDescriptor: z.string().nullable().optional(),
	reviewAction: z.string().nullable().optional(),
	threeDSecureRequired: z.boolean().nullable().optional(),
	useStripeCheckout: z.boolean().nullable().optional(),
	createCustomerAccounts: z.boolean().nullable().optional(),
	askForFullAddress: z.boolean().nullable().optional(),
});
export type StripeConnection = z.infer<typeof StripeConnectionSchema>;

export const IntegrationsGetStripeInputSchema = z.object({}).strict();
export type IntegrationsGetStripeInput = z.infer<
	typeof IntegrationsGetStripeInputSchema
>;

export const IntegrationsUpdateStripeInputSchema = z
	.object({
		enableIdeal: z.boolean().optional(),
		enableBancontact: z.boolean().optional(),
		enableGiropay: z.boolean().optional(),
		enableEps: z.boolean().optional(),
		enableMultibanco: z.boolean().optional(),
		enablePrzelewy24: z.boolean().optional(),
		enableWeChat: z.boolean().optional(),
		enableAlipay: z.boolean().optional(),
		enablePayPal: z.boolean().optional(),
		enableKlarna: z.boolean().optional(),
		enableAffirm: z.boolean().optional(),
		enableAfterpayClearpay: z.boolean().optional(),
		enableFpx: z.boolean().optional(),
		enableBlik: z.boolean().optional(),
		enableCashApp: z.boolean().optional(),
		enableGrabPay: z.boolean().optional(),
		enablePayNow: z.boolean().optional(),
		enablePromptPay: z.boolean().optional(),
		enablePix: z.boolean().optional(),
		enableZip: z.boolean().optional(),
		enableMobilePay: z.boolean().optional(),
		statementDescriptor: z.string().optional(),
		reviewAction: z.enum(['Continue', 'WaitForApproval']).optional(),
		threeDSecureRequired: z.boolean().optional(),
		useStripeCheckout: z.boolean().optional(),
		createCustomerAccounts: z.boolean().optional(),
		askForFullAddress: z.boolean().optional(),
	})
	.strict();
export type IntegrationsUpdateStripeInput = z.infer<
	typeof IntegrationsUpdateStripeInputSchema
>;

/** POST /integrations/stripe/connection returns the connection test result. */
export const IntegrationsUpdateStripeResponseSchema = z.object({
	testResult: z
		.object({
			hasWebhooks: z.boolean().nullable().optional(),
			canReadAccount: z.boolean().nullable().optional(),
			canReadSource: z.boolean().nullable().optional(),
			canWritePaymentIntent: z.boolean().nullable().optional(),
			canWriteCharge: z.boolean().nullable().optional(),
		})
		.nullable()
		.optional(),
});
export type IntegrationsUpdateStripeResponse = z.infer<
	typeof IntegrationsUpdateStripeResponseSchema
>;

// ==========================================
// 13. Partners
// ==========================================

export const PartnersCreateAccountInputSchema = z
	.object({
		email: z.string().email(),
		name: z.string().min(1),
		companyName: z.string().min(1),
		address: z.string().optional(),
		currency: z.string().length(3),
		countryCode: z.string().length(3),
		websiteUrl: z.string().url().optional(),
		timeZone: z.string().optional(),
		inviteCode: z.string().optional(),
		isPartnerResponsibleForBilling: z.boolean().optional(),
		isPartnerResponsibleForPaymentProviders: z.boolean().optional(),
	})
	.strict();
export type PartnersCreateAccountInput = z.infer<
	typeof PartnersCreateAccountInputSchema
>;

export const PartnerAccountSchema = z.object({
	companyId: z.string(),
	companyName: z.string().nullable().optional(),
	accountName: z.string().nullable().optional(),
	currency: z.string().nullable().optional(),
	createdOn: z.string().nullable().optional(),
});
export type PartnerAccount = z.infer<typeof PartnerAccountSchema>;

/** POST /partners/account/create returns an array of account records. */
export const PartnersCreateAccountResponseSchema =
	z.array(PartnerAccountSchema);
export type PartnersCreateAccountResponse = z.infer<
	typeof PartnersCreateAccountResponseSchema
>;

// ==========================================
// Master Schemas and Types Map
// ==========================================

export const GiftUpEndpointInputSchemas = {
	'ping.get': PingGetInputSchema,
	'ping.post': PingPostInputSchema,
	'company.get': CompanyGetInputSchema,
	'giftCards.list': GiftCardsListInputSchema,
	'giftCards.get': GiftCardsGetInputSchema,
	'giftCards.update': GiftCardsUpdateInputSchema,
	'giftCards.reactivate': GiftCardsReactivateInputSchema,
	'giftCards.void': GiftCardsVoidInputSchema,
	'giftCards.topUp': GiftCardsTopUpInputSchema,
	'giftCards.redeem': GiftCardsRedeemInputSchema,
	'giftCards.redeemInFull': GiftCardsRedeemInFullInputSchema,
	'giftCards.undoRedemption': GiftCardsUndoRedemptionInputSchema,
	'giftCards.transferBalances': GiftCardsTransferBalancesInputSchema,
	'orders.list': OrdersListInputSchema,
	'orders.get': OrdersGetInputSchema,
	'orders.create': OrdersCreateInputSchema,
	'orders.update': OrdersUpdateInputSchema,
	'orders.addNote': OrdersAddNoteInputSchema,
	'orders.markAsPosted': OrdersMarkAsPostedInputSchema,
	'items.list': ItemsListInputSchema,
	'items.get': ItemsGetInputSchema,
	'items.create': ItemsCreateInputSchema,
	'items.update': ItemsUpdateInputSchema,
	'items.delete': ItemsDeleteInputSchema,
	'groups.list': GroupsListInputSchema,
	'groups.get': GroupsGetInputSchema,
	'groups.create': GroupsCreateInputSchema,
	'groups.update': GroupsUpdateInputSchema,
	'groups.delete': GroupsDeleteInputSchema,
	'locations.list': LocationsListInputSchema,
	'promotions.list': PromotionsListInputSchema,
	'reports.listTransactions': ReportsListTransactionsInputSchema,
	'reports.getTransaction': ReportsGetTransactionInputSchema,
	'settings.getCheckout': SettingsGetCheckoutInputSchema,
	'settings.updateCheckout': SettingsUpdateCheckoutInputSchema,
	'settings.getEmail': SettingsGetEmailInputSchema,
	'settings.updateEmail': SettingsUpdateEmailInputSchema,
	'settings.getGiftCard': SettingsGetGiftCardInputSchema,
	'settings.updateGiftCard': SettingsUpdateGiftCardInputSchema,
	'settings.listArtwork': SettingsListArtworkInputSchema,
	'settings.uploadArtwork': SettingsUploadArtworkInputSchema,
	'settings.deleteArtwork': SettingsDeleteArtworkInputSchema,
	'settings.getShipping': SettingsGetShippingInputSchema,
	'users.list': UsersListInputSchema,
	'users.get': UsersGetInputSchema,
	'users.invite': UsersInviteInputSchema,
	'users.update': UsersUpdateInputSchema,
	'users.delete': UsersDeleteInputSchema,
	'integrations.getStripeConnection': IntegrationsGetStripeInputSchema,
	'integrations.updateStripeConnection': IntegrationsUpdateStripeInputSchema,
	'partners.createAccount': PartnersCreateAccountInputSchema,
} as const;

export const GiftUpEndpointOutputSchemas = {
	'ping.get': PingGetResponseSchema,
	'ping.post': PingPostResponseSchema,
	'company.get': CompanySchema,
	'giftCards.list': GiftCardsListResponseSchema,
	'giftCards.get': GiftCardSchema,
	'giftCards.update': GiftCardsUpdateResponseSchema,
	'giftCards.reactivate': GiftCardsReactivateResponseSchema,
	'giftCards.void': GiftCardsVoidResponseSchema,
	'giftCards.topUp': GiftCardsTopUpResponseSchema,
	'giftCards.redeem': GiftCardsRedeemResponseSchema,
	'giftCards.redeemInFull': GiftCardsRedeemInFullResponseSchema,
	'giftCards.undoRedemption': GiftCardsUndoRedemptionResponseSchema,
	'giftCards.transferBalances': GiftCardsTransferBalancesResponseSchema,
	'orders.list': OrdersListResponseSchema,
	'orders.get': OrderSchema,
	'orders.create': OrderSchema,
	'orders.update': OrdersUpdateResponseSchema,
	'orders.addNote': SuccessResponseSchema,
	'orders.markAsPosted': SuccessResponseSchema,
	'items.list': ItemsListResponseSchema,
	'items.get': ItemSchema,
	'items.create': ItemSchema,
	'items.update': ItemsUpdateResponseSchema,
	'items.delete': SuccessResponseSchema,
	'groups.list': GroupsListResponseSchema,
	'groups.get': ItemGroupSchema,
	'groups.create': GroupsWriteResponseSchema,
	'groups.update': GroupsWriteResponseSchema,
	'groups.delete': SuccessResponseSchema,
	'locations.list': LocationsListResponseSchema,
	'promotions.list': PromotionsListResponseSchema,
	'reports.listTransactions': ReportsListTransactionsResponseSchema,
	'reports.getTransaction': ReportTransactionSchema,
	'settings.getCheckout': CheckoutSettingsSchema,
	'settings.updateCheckout': SettingsUpdateCheckoutResponseSchema,
	'settings.getEmail': EmailSettingsSchema,
	'settings.updateEmail': SettingsUpdateEmailResponseSchema,
	'settings.getGiftCard': GiftCardSettingsSchema,
	'settings.updateGiftCard': SettingsUpdateGiftCardResponseSchema,
	'settings.listArtwork': SettingsListArtworkResponseSchema,
	'settings.uploadArtwork': SettingsUploadArtworkResponseSchema,
	'settings.deleteArtwork': SuccessResponseSchema,
	'settings.getShipping': ShippingSettingsSchema,
	'users.list': UsersListResponseSchema,
	'users.get': UserSchema,
	'users.invite': UserSchema,
	'users.update': UsersUpdateResponseSchema,
	'users.delete': SuccessResponseSchema,
	'integrations.getStripeConnection': StripeConnectionSchema,
	'integrations.updateStripeConnection': IntegrationsUpdateStripeResponseSchema,
	'partners.createAccount': PartnersCreateAccountResponseSchema,
} as const;

export type GiftUpEndpointInputs = {
	[K in keyof typeof GiftUpEndpointInputSchemas]: z.input<
		(typeof GiftUpEndpointInputSchemas)[K]
	>;
};

export type GiftUpEndpointOutputs = {
	[K in keyof typeof GiftUpEndpointOutputSchemas]: z.infer<
		(typeof GiftUpEndpointOutputSchemas)[K]
	>;
};
