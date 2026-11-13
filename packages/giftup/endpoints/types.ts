import { z } from 'zod';

// ==========================================
// Common & Helper Schemas
// ==========================================

export const JsonPatchOperationSchema = z.object({
	op: z.enum(['add', 'remove', 'replace', 'move', 'copy', 'test']),
	path: z.string(),
	// `unknown` because RFC 6902 JSON patch values can be any JSON type
	value: z.unknown().optional(),
	from: z.string().optional(),
});
export type JsonPatchOperation = z.infer<typeof JsonPatchOperationSchema>;

export const SuccessResponseSchema = z
	.object({
		success: z.boolean().optional(),
	})
	// `passthrough` because provider 200 responses for status/action updates may return empty body or status metadata
	.passthrough();
export type SuccessResponse = z.infer<typeof SuccessResponseSchema>;

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
	name: z.string(),
	currency: z.string(),
	onboardingCompleted: z.boolean(),
	canShowCheckout: z.boolean(),
	isCheckoutLive: z.boolean(),
});
export type Company = z.infer<typeof CompanySchema>;

// ==========================================
// 3. Gift Cards
// ==========================================

export const GiftCardLedgerEntrySchema = z.object({
	id: z.string(),
	eventType: z.string(),
	eventOccuredOn: z.string(),
	eventOccuredAtLocationId: z.string().nullable().optional(),
	units: z.number().nullable().optional(),
	value: z.number().nullable().optional(),
	whoEmail: z.string().nullable().optional(),
	whoName: z.string().nullable().optional(),
	reason: z.string().nullable().optional(),
	metadata: z.record(z.string(), z.string()).optional(),
});
export type GiftCardLedgerEntry = z.infer<typeof GiftCardLedgerEntrySchema>;

export const GiftCardPostalFulfilmentSchema = z.object({
	address: z
		.object({
			countryCode: z.string().optional(),
			address1: z.string().optional(),
			address2: z.string().nullable().optional(),
			city: z.string().optional(),
			state: z.string().nullable().optional(),
			postalCode: z.string().optional(),
			name: z.string().optional(),
		})
		.optional(),
	shippingOptionName: z.string().nullable().optional(),
});

export const GiftCardEmailFulfilmentSchema = z.object({
	emailAddress: z.string().optional(),
	scheduledFor: z.string().nullable().optional(),
});

export const GiftCardDownloadLinksSchema = z.object({
	artworkUrl: z.string().nullable().optional(),
	imageUrl: z.string().nullable().optional(),
	pdfUrl: z.string().nullable().optional(),
	appleWalletUrl: z.string().nullable().optional(),
	googleWalletUrl: z.string().nullable().optional(),
});

export const GiftCardSchema = z.object({
	canBeRedeemed: z.boolean(),
	hasExpired: z.boolean(),
	notYetValid: z.boolean(),
	isVoided: z.boolean(),
	code: z.string(),
	title: z.string(),
	subTitle: z.string().nullable().optional(),
	message: z.string().nullable().optional(),
	fulfilledOn: z.string().nullable().optional(),
	recipientName: z.string().nullable().optional(),
	recipientEmail: z.string().nullable().optional(),
	backingType: z.string(),
	remainingValue: z.number().nullable(),
	remainingUnits: z.number().nullable(),
	initialValue: z.number().nullable(),
	initialUnits: z.number().nullable(),
	equivalentValuePerUnit: z.number().nullable().optional(),
	terms: z.string().nullable().optional(),
	sku: z.string().nullable().optional(),
	expiresOn: z.string().nullable().optional(),
	validFrom: z.string().nullable().optional(),
	voidedOn: z.string().nullable().optional(),
	fulfilledBy: z.string().nullable().optional(),
	postalFulfilment: GiftCardPostalFulfilmentSchema.nullable().optional(),
	emailFulfilment: GiftCardEmailFulfilmentSchema.nullable().optional(),
	downloadLinks: GiftCardDownloadLinksSchema.nullable().optional(),
	ledger: z.array(GiftCardLedgerEntrySchema).optional(),
});
export type GiftCard = z.infer<typeof GiftCardSchema>;

export const GiftCardsListInputSchema = z
	.object({
		createdOnOrAfter: z.string().optional(),
		createdOnOrBefore: z.string().optional(),
		limit: z.number().int().min(1).max(100).optional(),
		offset: z.number().int().min(0).optional(),
		status: z.string().optional(),
		promotionId: z.string().optional(),
		orderId: z.string().optional(),
	})
	.strict();
export type GiftCardsListInput = z.infer<typeof GiftCardsListInputSchema>;

export const GiftCardsListResponseSchema = z.array(GiftCardSchema);
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

export const GiftCardsReactivateInputSchema = z
	.object({
		code: z.string().min(1),
		reason: z.string().optional(),
		locationId: z.string().nullable().optional(),
		metadata: z.record(z.string(), z.string()).optional(),
	})
	.strict();
export type GiftCardsReactivateInput = z.infer<
	typeof GiftCardsReactivateInputSchema
>;

export const GiftCardsReactivateResponseSchema = z.object({
	isRedeemed: z.boolean(),
	isAlreadyActive: z.boolean(),
});
export type GiftCardsReactivateResponse = z.infer<
	typeof GiftCardsReactivateResponseSchema
>;

export const GiftCardsVoidInputSchema = z
	.object({
		code: z.string().min(1),
		reason: z.string().optional(),
		locationId: z.string().nullable().optional(),
		metadata: z.record(z.string(), z.string()).optional(),
	})
	.strict();
export type GiftCardsVoidInput = z.infer<typeof GiftCardsVoidInputSchema>;

export const GiftCardsVoidResponseSchema = z.object({
	isRedeemed: z.boolean(),
	isAlreadyVoided: z.boolean(),
});
export type GiftCardsVoidResponse = z.infer<typeof GiftCardsVoidResponseSchema>;

export const GiftCardsTopUpInputSchema = z
	.object({
		code: z.string().min(1),
		amount: z.number().nullable().optional(),
		units: z.number().nullable().optional(),
		reason: z.string().nullable().optional(),
		locationId: z.string().nullable().optional(),
		metadata: z.record(z.string(), z.string()).optional(),
	})
	.strict();
export type GiftCardsTopUpInput = z.infer<typeof GiftCardsTopUpInputSchema>;

export const GiftCardsTopUpResponseSchema = z.object({
	transactionId: z.string(),
	remainingCredit: z.number(),
	remainingUnits: z.number().nullable(),
});
export type GiftCardsTopUpResponse = z.infer<
	typeof GiftCardsTopUpResponseSchema
>;

export const GiftCardsRedeemInputSchema = z
	.object({
		code: z.string().min(1),
		amount: z.number().nullable().optional(),
		units: z.number().nullable().optional(),
		reason: z.string().nullable().optional(),
		locationId: z.string().nullable().optional(),
		redeemedOn: z.string().nullable().optional(),
		metadata: z.record(z.string(), z.string()).optional(),
	})
	.strict();
export type GiftCardsRedeemInput = z.infer<typeof GiftCardsRedeemInputSchema>;

export const GiftCardsRedeemResponseSchema = z.object({
	transactionId: z.string(),
	redeemedAmount: z.number(),
	remainingCredit: z.number(),
	redeemedUnits: z.number().nullable(),
	remainingUnits: z.number().nullable(),
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
		metadata: z.record(z.string(), z.string()).optional(),
	})
	.strict();
export type GiftCardsRedeemInFullInput = z.infer<
	typeof GiftCardsRedeemInFullInputSchema
>;

export const GiftCardsRedeemInFullResponseSchema = z.object({
	transactionId: z.string(),
	redeemedAmount: z.number(),
	remainingCredit: z.number(),
	redeemedUnits: z.number().nullable(),
	remainingUnits: z.number().nullable(),
});
export type GiftCardsRedeemInFullResponse = z.infer<
	typeof GiftCardsRedeemInFullResponseSchema
>;

export const GiftCardsUndoRedemptionInputSchema = z
	.object({
		code: z.string().min(1),
		transactionId: z.string().min(1),
		reason: z.string().nullable().optional(),
		metadata: z.record(z.string(), z.string()).optional(),
	})
	.strict();
export type GiftCardsUndoRedemptionInput = z.infer<
	typeof GiftCardsUndoRedemptionInputSchema
>;

export const GiftCardsUndoRedemptionResponseSchema = z.object({
	transactionId: z.string(),
	amountReversed: z.number(),
	unitsReversed: z.number(),
	alreadyReversed: z.boolean(),
	remainingCredit: z.number(),
	remainingUnits: z.number().nullable(),
});
export type GiftCardsUndoRedemptionResponse = z.infer<
	typeof GiftCardsUndoRedemptionResponseSchema
>;

export const GiftCardsTransferBalancesInputSchema = z
	.object({
		sourceGiftCards: z.array(z.string().min(1)),
		destinationGiftCard: z.string().min(1),
		reason: z.string().nullable().optional(),
		locationId: z.string().nullable().optional(),
		metadata: z.record(z.string(), z.string()).optional(),
	})
	.strict();
export type GiftCardsTransferBalancesInput = z.infer<
	typeof GiftCardsTransferBalancesInputSchema
>;

export const GiftCardsTransferBalancesResponseSchema = z.object({
	transferredCredit: z.number(),
	transferredUnits: z.number().nullable(),
});
export type GiftCardsTransferBalancesResponse = z.infer<
	typeof GiftCardsTransferBalancesResponseSchema
>;

// ==========================================
// 4. Orders
// ==========================================

export const OrderPromotionSchema = z.object({
	promotionId: z.string().optional(),
	name: z.string().optional(),
	code: z.string().optional(),
});

export const OrderCustomFieldSchema = z.object({
	label: z.string(),
	value: z.string(),
});

export const OrderSalesTaxSchema = z.object({
	label: z.string(),
	amount: z.number(),
	type: z.string(),
});

export const OrderNoteSchema = z.object({
	id: z.string(),
	content: z.string(),
	createdOn: z.string(),
	username: z.string(),
});

export const OrderPaymentSchema = z.object({
	provider: z.string().optional(),
	transactionId: z.string().optional(),
});

export const OrderDownloadLinksSchema = z.object({
	single: z
		.object({
			imageUrl: z.string().optional(),
			pdfUrl: z.string().optional(),
		})
		.optional(),
	zip: z
		.object({
			imageUrl: z.string().optional(),
			pdfUrl: z.string().optional(),
		})
		.optional(),
});

export const OrderSchema = z.object({
	id: z.string(),
	orderNumber: z.string(),
	createdOn: z.string(),
	selectedRecipient: z.string().optional(),
	purchaserEmail: z.string().optional(),
	purchaserName: z.string().optional(),
	currency: z.string(),
	revenue: z.number(),
	tip: z.number().optional(),
	serviceFee: z.number().optional(),
	discount: z.number().optional(),
	shippingFee: z.number().optional(),
	referrer: z.string().nullable().optional(),
	source: z.string().optional(),
	promotions: z.array(OrderPromotionSchema).optional(),
	customFields: z.array(OrderCustomFieldSchema).optional(),
	salesTaxes: z.array(OrderSalesTaxSchema).optional(),
	notes: z.array(OrderNoteSchema).optional(),
	metadata: z.record(z.string(), z.string()).optional(),
	downloadLinks: OrderDownloadLinksSchema.nullable().optional(),
	payment: OrderPaymentSchema.nullable().optional(),
	giftCards: z.array(GiftCardSchema).optional(),
});
export type Order = z.infer<typeof OrderSchema>;

export const OrdersListInputSchema = z
	.object({
		createdOnOrAfter: z.string().optional(),
		createdOnOrBefore: z.string().optional(),
		limit: z.number().int().min(1).max(100).optional(),
		offset: z.number().int().min(0).optional(),
	})
	.strict();
export type OrdersListInput = z.infer<typeof OrdersListInputSchema>;

export const OrdersListResponseSchema = z.array(OrderSchema);
export type OrdersListResponse = z.infer<typeof OrdersListResponseSchema>;

export const OrdersGetInputSchema = z
	.object({
		id: z.string().min(1),
	})
	.strict();
export type OrdersGetInput = z.infer<typeof OrdersGetInputSchema>;

export const OrderItemDetailInputSchema = z.object({
	quantity: z.number().int().min(1).default(1),
	name: z.string().optional(),
	description: z.string().optional(),
	code: z.string().optional(),
	backingType: z.enum(['Currency', 'Units']).optional(),
	price: z.number().optional(),
	value: z.number().optional(),
	units: z.number().nullable().optional(),
	equivalentValuePerUnit: z.number().nullable().optional(),
	itemId: z.string().optional(),
	artworkId: z.string().optional(),
	terms: z.string().optional(),
	sku: z.string().optional(),
	message: z.string().optional(),
	recipientName: z.string().optional(),
	recipientEmail: z.string().optional(),
	expiresOn: z.string().optional(),
	validFrom: z.string().optional(),
	isPostalFulfilled: z.boolean().optional(),
	isDigitalFulfilled: z.boolean().optional(),
	scheduledDeliveryDate: z.string().optional(),
});

export const OrdersCreateInputSchema = z
	.object({
		orderDate: z.string().optional(),
		disableAllEmails: z.boolean().optional(),
		purchaserEmail: z.string().email(),
		purchaserName: z.string().min(1),
		tip: z.number().optional(),
		serviceFee: z.number().optional(),
		discount: z.number().optional(),
		referrer: z.string().optional(),
		revenue: z.number().optional(),
		itemDetails: z.array(OrderItemDetailInputSchema).min(1),
		customFields: z.array(OrderCustomFieldSchema).optional(),
		metadata: z.record(z.string(), z.string()).optional(),
	})
	.strict();
export type OrdersCreateInput = z.input<typeof OrdersCreateInputSchema>;

export const OrdersUpdateInputSchema = z
	.object({
		id: z.string().min(1),
		patch: z.array(JsonPatchOperationSchema),
	})
	.strict();
export type OrdersUpdateInput = z.infer<typeof OrdersUpdateInputSchema>;

export const OrdersAddNoteInputSchema = z
	.object({
		id: z.string().min(1),
		content: z.string().min(1).max(500),
	})
	.strict();
export type OrdersAddNoteInput = z.infer<typeof OrdersAddNoteInputSchema>;

export const OrderCodeUpdateSchema = z.object({
	oldCode: z.string().min(1),
	newCode: z.string().min(1),
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
	name: z.string(),
	description: z.string().nullable().optional(),
	backingType: z.string(),
	priceType: z.string(),
	price: z.number().nullable().optional(),
	value: z.number().nullable().optional(),
	units: z.number().nullable().optional(),
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
	expiryInMonths: z.number().nullable().optional(),
	expiryInDays: z.number().nullable().optional(),
	sortOrder: z.number().int().optional(),
	groupId: z.string().nullable().optional(),
	artworkId: z.string().nullable().optional(),
	isPromoted: z.boolean().optional(),
	terms: z.string().nullable().optional(),
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
		priceType: z
			.enum(['Specified', 'Variable', 'Donation'])
			.optional()
			.default('Specified'),
		price: z.number().optional(),
		value: z.number().optional(),
		units: z.number().nullable().optional(),
		equivalentValuePerUnit: z.number().nullable().optional(),
		minimumPrice: z.number().nullable().optional(),
		maximumPrice: z.number().nullable().optional(),
		availableFrom: z.string().nullable().optional(),
		availableUntil: z.string().nullable().optional(),
		validFromInDays: z.number().nullable().optional(),
		expiryInMonths: z.number().nullable().optional(),
		expiryInDays: z.number().nullable().optional(),
		sortOrder: z.number().int().optional(),
		groupId: z.string().nullable().optional(),
		artworkId: z.string().nullable().optional(),
		terms: z.string().nullable().optional(),
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
	name: z.string(),
	description: z.string().nullable().optional(),
	sortOrder: z.number().int().optional(),
	autoExpand: z.boolean().optional(),
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
	name: z.string(),
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
	name: z.string(),
	noBenefit: z.boolean().optional(),
	publishedOn: z.string().optional(),
	stoppedOn: z.string().nullable().optional(),
	// `passthrough` because promotion benefits structures vary by promotion type
	benefits: z.object({}).passthrough().optional(),
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
	eventOccuredOn: z.string(),
	eventOccuredAtLocationId: z.string().nullable().optional(),
	eventType: z.string(),
	reason: z.string().nullable().optional(),
	referrer: z.string().nullable().optional(),
	metadata: z.record(z.string(), z.string()).optional(),
	orderId: z.string().nullable().optional(),
	currency: z.string().optional(),
	giftUpFee: z.number().optional(),
	whoName: z.string().nullable().optional(),
	whoEmail: z.string().nullable().optional(),
	orderDetails: z.record(z.string(), z.string()).nullable().optional(),
	giftCard: z
		.object({
			id: z.string().optional(),
			code: z.string().optional(),
			valueChange: z.number().optional(),
			unitChange: z.number().optional(),
			title: z.string().optional(),
		})
		.nullable()
		.optional(),
});
export type ReportTransaction = z.infer<typeof ReportTransactionSchema>;

export const ReportsListTransactionsInputSchema = z
	.object({
		eventOccurredOnOrAfter: z.string().optional(),
		eventOccurredOnOrBefore: z.string().optional(),
		limit: z.number().int().min(1).max(100).optional(),
		offset: z.number().int().min(0).optional(),
	})
	.strict();
export type ReportsListTransactionsInput = z.infer<
	typeof ReportsListTransactionsInputSchema
>;

export const ReportsListTransactionsResponseSchema = z.array(
	ReportTransactionSchema,
);
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
	fontFamily: z.string().optional(),
	fontSize: z.string().optional(),
	themeColor: z.string().optional(),
	backgroundColor: z.string().optional(),
	hostedBackgroundColor: z.string().optional(),
	hostedTextColor: z.string().optional(),
	continueLinkText: z.string().nullable().optional(),
	continueLinkUrl: z.string().nullable().optional(),
	redirectUrl: z.string().nullable().optional(),
	additionalCustomHtml: z.string().nullable().optional(),
	showBalanceChecker: z.boolean().optional(),
	defaultFor: z.string().optional(),
	serviceFeeCharged: z.boolean().optional(),
	serviceFeeFixed: z.number().optional(),
	serviceFeePercentage: z.number().optional(),
	tipsEnabled: z.boolean().optional(),
	allowCustomTipValues: z.boolean().optional(),
	overrideTipValues: z.array(z.string()).optional(),
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

export const EmailSettingsSchema = z.object({
	logoUrl: z.string().nullable().optional(),
	logoAlignment: z.string().optional(),
	logoWidth: z.number().optional(),
	fromEmail: z.string().optional(),
	fromName: z.string().optional(),
	giftCardEmail: z
		.object({
			subjectLine: z.string().optional(),
			title: z.string().optional(),
			introText: z.string().optional(),
			footerText: z.string().optional(),
			buttonLabel: z.string().optional(),
			buttonUrl: z.string().optional(),
			buttonColour: z.string().optional(),
			buttonAlignment: z.string().optional(),
		})
		.optional(),
	receiptEmail: z
		.object({
			subjectLine: z.string().optional(),
			title: z.string().optional(),
			introText: z.string().optional(),
			footerText: z.string().optional(),
		})
		.optional(),
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

export const GiftCardSettingsSchema = z.object({
	defaultDescription: z.string().nullable().optional(),
	barcodeFormat: z.string().optional(),
	expiryInMonths: z.number().nullable().optional(),
	expiryInDays: z.number().nullable().optional(),
	validFromInDays: z.number().nullable().optional(),
	showIssuedOnDate: z.boolean().optional(),
	showBalance: z.boolean().optional(),
	showBarcode: z.boolean().optional(),
	generalTerms: z.string().nullable().optional(),
	codeFormat: z.string().optional(),
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

export const ArtworkSchema = z.object({
	id: z.string(),
	url: z.string(),
	sortOrder: z.number().int().optional(),
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
		url: z.string().url(),
		replaceAllExistingArtwork: z.boolean().optional(),
		replaceArtworkId: z.string().optional(),
	})
	.strict();
export type SettingsUploadArtworkInput = z.infer<
	typeof SettingsUploadArtworkInputSchema
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
	name: z.string(),
	price: z.number(),
	sortOrder: z.number().int().optional(),
	type: z.string(),
	countries: z
		.array(
			z.object({
				name: z.string(),
				IsoCode: z.string().optional(),
			}),
		)
		.optional(),
});

export const ShippingSettingsSchema = z.object({
	enableDigitalFulfilment: z.boolean(),
	enableSelfFulfilledPostal: z.boolean(),
	enablePostalMessage: z.boolean().optional(),
	postalShippingOptions: z.array(ShippingPostalOptionSchema).optional(),
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
	name: z.string(),
});

export const UserSchema = z.object({
	id: z.string(),
	name: z.string(),
	email: z.string(),
	avatarUrl: z.string().nullable().optional(),
	pin: z.string().nullable().optional(),
	isAdministrator: z.boolean().optional(),
	emailConfirmed: z.boolean().optional(),
	hiddenInRedeemApp: z.boolean().optional(),
	disableSearchInRedeemApp: z.boolean().optional(),
	hideLogInRedeemApp: z.boolean().optional(),
	expiredGiftCardRedemptionDisabled: z.boolean().optional(),
	redeemLocationRestrictionEnforced: z.boolean().optional(),
	locations: z.array(UserLocationSchema).optional(),
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
		pin: z.string().optional(),
		isAdministrator: z.boolean().optional(),
		hiddenInRedeemApp: z.boolean().optional(),
		disableSearchInRedeemApp: z.boolean().optional(),
		hideLogInRedeemApp: z.boolean().optional(),
		expiredGiftCardRedemptionDisabled: z.boolean().optional(),
		redeemLocationRestrictionEnforced: z.boolean().optional(),
		locationIds: z.array(z.string()).optional(),
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

export const UsersDeleteInputSchema = z
	.object({
		id: z.string().min(1),
	})
	.strict();
export type UsersDeleteInput = z.infer<typeof UsersDeleteInputSchema>;

// ==========================================
// 12. Integrations
// ==========================================

export const StripeConnectionSchema = z.object({
	enableIdeal: z.boolean().optional(),
	enableBancontact: z.boolean().optional(),
	enableGiropay: z.boolean().optional(),
	enableEps: z.boolean().optional(),
	enableMultibanco: z.boolean().optional(),
	enablePrzelewy24: z.boolean().optional(),
	enableWeChat: z.boolean().optional(),
	enableAlipay: z.boolean().optional(),
	stripeAccountId: z.string().nullable().optional(),
	connected: z.boolean().optional(),
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
	})
	.strict();
export type IntegrationsUpdateStripeInput = z.infer<
	typeof IntegrationsUpdateStripeInputSchema
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
	})
	.strict();
export type PartnersCreateAccountInput = z.infer<
	typeof PartnersCreateAccountInputSchema
>;

export const PartnerAccountSchema = z.object({
	companyId: z.string().optional(),
	apiKey: z.string().optional(),
	userId: z.string().optional(),
	company: CompanySchema.optional(),
});
export type PartnerAccount = z.infer<typeof PartnerAccountSchema>;

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
	'giftCards.update': GiftCardSchema,
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
	'orders.update': OrderSchema,
	'orders.addNote': SuccessResponseSchema,
	'orders.markAsPosted': SuccessResponseSchema,
	'items.list': ItemsListResponseSchema,
	'items.get': ItemSchema,
	'items.create': ItemSchema,
	'items.update': ItemSchema,
	'items.delete': SuccessResponseSchema,
	'groups.list': GroupsListResponseSchema,
	'groups.get': ItemGroupSchema,
	'groups.create': ItemGroupSchema,
	'groups.update': ItemGroupSchema,
	'groups.delete': SuccessResponseSchema,
	'locations.list': LocationsListResponseSchema,
	'promotions.list': PromotionsListResponseSchema,
	'reports.listTransactions': ReportsListTransactionsResponseSchema,
	'reports.getTransaction': ReportTransactionSchema,
	'settings.getCheckout': CheckoutSettingsSchema,
	'settings.updateCheckout': CheckoutSettingsSchema,
	'settings.getEmail': EmailSettingsSchema,
	'settings.updateEmail': EmailSettingsSchema,
	'settings.getGiftCard': GiftCardSettingsSchema,
	'settings.updateGiftCard': GiftCardSettingsSchema,
	'settings.listArtwork': SettingsListArtworkResponseSchema,
	'settings.uploadArtwork': ArtworkSchema,
	'settings.deleteArtwork': SuccessResponseSchema,
	'settings.getShipping': ShippingSettingsSchema,
	'users.list': UsersListResponseSchema,
	'users.get': UserSchema,
	'users.invite': UserSchema,
	'users.update': UserSchema,
	'users.delete': SuccessResponseSchema,
	'integrations.getStripeConnection': StripeConnectionSchema,
	'integrations.updateStripeConnection': StripeConnectionSchema,
	'partners.createAccount': PartnerAccountSchema,
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
