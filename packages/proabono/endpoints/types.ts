import { z } from 'zod';

// ProAbono is subscription billing: customers subscribe to offers, and usages and
// balance lines accrue against a subscription. Amounts are in the currency's
// minor unit, as an integer of cents. Outputs are `.loose()` with documented
// fields nullish, so a field ProAbono adds or omits cannot fail a call that has
// already happened.
// Reference: https://doc-api.proabono.com

/**
 * Any JSON value. `Metadata` and a subscription's `Features` are provider-shaped
 * open data, so they are described exactly rather than left untyped.
 */
export type ProabonoJsonValue =
	| string
	| number
	| boolean
	| null
	| ProabonoJsonValue[]
	| { [key: string]: ProabonoJsonValue };

export const ProabonoJsonValueSchema: z.ZodType<ProabonoJsonValue> = z.lazy(
	() =>
		z.union([
			z.string(),
			z.number(),
			z.boolean(),
			z.null(),
			z.array(ProabonoJsonValueSchema),
			z.record(z.string(), ProabonoJsonValueSchema),
		]),
);

/** The subscription lifecycle states the docs use in examples. */
export const PROABONO_SUBSCRIPTION_STATES = [
	'InitiatedAgent',
	'ActiveRunning',
	'Suspended',
	'Terminated',
] as const;

/** The feature kinds a subscription carries. */
export const PROABONO_FEATURE_TYPES = [
	'Limitation',
	'OnOff',
	'Quantifiable',
] as const;

const ReferenceSchema = z
	.string()
	.min(1)
	.describe('Your own identifier for the resource, unique within its kind.');

const IdSchema = z
	.number()
	.int()
	.positive()
	.describe('The ProAbono numeric id.');

const MetadataSchema = z
	.record(z.string(), ProabonoJsonValueSchema)
	.optional()
	.describe('Your own key-value data, stored on the resource.');

/** A link ProAbono returns, such as the encrypted portal URL. */
export const LinkSchema = z
	.object({
		rel: z
			.string()
			.nullish()
			.describe('What the link is for, such as `insite-home`.'),
		href: z.string().nullish(),
		query: z.string().nullish(),
	})
	.loose();

export type ProabonoLink = z.infer<typeof LinkSchema>;

const linksField = z
	.array(LinkSchema)
	.nullish()
	.describe('Links for the resource, including the encrypted portal URL.');

// ── customers ─────────────────────────────────────────────────────────────

export const CustomerSchema = z
	.object({
		Id: IdSchema.nullish(),
		ReferenceCustomer: z.string().nullish(),
		IdSegment: IdSchema.nullish(),
		ReferenceSegment: z.string().nullish(),
		Name: z.string().nullish(),
		FirstName: z.string().nullish(),
		LastName: z.string().nullish(),
		Email: z.string().nullish(),
		Company: z.string().nullish(),
		Country: z.string().nullish(),
		Language: z.string().nullish(),
		Currency: z.string().nullish(),
		IsBillable: z
			.boolean()
			.nullish()
			.describe('False until the customer has valid payment information.'),
		IsActive: z.boolean().nullish(),
		DateCreated: z.string().nullish(),
		Metadata: ProabonoJsonValueSchema.nullish(),
		Links: linksField,
	})
	.loose();

export type ProabonoCustomer = z.infer<typeof CustomerSchema>;

export const CustomersCreateInputSchema = z.object({
	ReferenceCustomer: ReferenceSchema,
	Name: z.string().min(1).optional(),
	FirstName: z.string().min(1).optional(),
	LastName: z.string().min(1).optional(),
	Email: z.string().min(1).optional(),
	Company: z.string().min(1).optional(),
	Country: z.string().min(2).optional().describe('ISO 3166-1 alpha-2.'),
	Language: z.string().min(2).optional(),
	ReferenceSegment: ReferenceSchema.optional(),
	Metadata: MetadataSchema,
});

export type CustomersCreateInput = z.infer<typeof CustomersCreateInputSchema>;

const CustomersGetInputSchema = z.object({
	ReferenceCustomer: ReferenceSchema,
});

export type CustomersGetInput = z.infer<typeof CustomersGetInputSchema>;

const CustomersListInputSchema = z.object({
	ReferenceSegment: ReferenceSchema.optional(),
	Page: z.number().int().positive().optional().describe('1-based page number.'),
	SizePage: z.number().int().min(1).optional().describe('Rows per page.'),
});

export type CustomersListInput = z.infer<typeof CustomersListInputSchema>;

/** A list answers a bare array. */
export const CustomersListOutputSchema = z.object({
	customers: z.array(CustomerSchema),
});

export type CustomersListOutput = z.infer<typeof CustomersListOutputSchema>;

export const CustomersUpdateInputSchema = z
	.object({
		ReferenceCustomer: ReferenceSchema,
		Name: z.string().min(1).optional(),
		FirstName: z.string().min(1).optional(),
		LastName: z.string().min(1).optional(),
		Email: z.string().min(1).optional(),
		Company: z.string().min(1).optional(),
		Country: z.string().min(2).optional(),
		Language: z.string().min(2).optional(),
		Metadata: MetadataSchema,
	})
	.superRefine((value, ctx) => {
		const { ReferenceCustomer: _ignored, ...changes } = value;
		if (Object.values(changes).every((field) => field === undefined)) {
			ctx.addIssue({
				code: 'custom',
				message: 'Supply at least one field to change.',
				path: ['ReferenceCustomer'],
			});
		}
	});

export type CustomersUpdateInput = z.infer<typeof CustomersUpdateInputSchema>;

const CustomersActionInputSchema = z.object({
	ReferenceCustomer: ReferenceSchema,
});

export type CustomersActionInput = z.infer<typeof CustomersActionInputSchema>;

const CustomerActionOutputSchema = z
	.object({
		Id: IdSchema.nullish(),
		ReferenceCustomer: z.string().nullish(),
		IsActive: z.boolean().nullish(),
	})
	.loose();

export type CustomerActionOutput = z.infer<typeof CustomerActionOutputSchema>;

// ── offers ────────────────────────────────────────────────────────────────

export const OfferSchema = z
	.object({
		Id: IdSchema.nullish(),
		ReferenceOffer: z.string().nullish(),
		IdSegment: IdSchema.nullish(),
		ReferenceSegment: z.string().nullish(),
		TitleLocalized: z.string().nullish(),
		DescriptionLocalized: z.string().nullish(),
		PricingLocalized: z.string().nullish().describe('HTML by default.'),
		IsVisible: z.boolean().nullish(),
		IsFree: z.boolean().nullish(),
		Currency: z.string().nullish(),
		AmountRecurrence: z
			.number()
			.nullish()
			.describe('The recurring amount in cents.'),
		UnitRecurrence: z.string().nullish(),
		DurationTrial: z.number().nullish(),
		UnitTrial: z.string().nullish(),
		// unknown: the feature list is provider-shaped and varies per offer.
		Features: z.array(ProabonoJsonValueSchema).nullish(),
		Links: linksField,
	})
	.loose();

export type ProabonoOffer = z.infer<typeof OfferSchema>;

const OffersListInputSchema = z.object({
	ReferenceSegment: ReferenceSchema.optional(),
	ReferenceCustomer: ReferenceSchema.optional().describe(
		"Read the offers in this customer's language, with links for that customer.",
	),
	IsVisible: z.boolean().optional(),
	IgnoreFeatures: z
		.boolean()
		.optional()
		.describe('Leave the feature list out of the answer.'),
	Language: z.string().min(2).optional(),
	Html: z
		.boolean()
		.optional()
		.describe('False returns the pricing as plain text.'),
	Links: z.boolean().optional().describe('False leaves the links out.'),
});

export type OffersListInput = z.infer<typeof OffersListInputSchema>;

const OffersListOutputSchema = z.object({
	offers: z.array(OfferSchema),
});

export type OffersListOutput = z.infer<typeof OffersListOutputSchema>;

const OffersGetInputSchema = z.object({
	ReferenceOffer: ReferenceSchema,
	ReferenceSegment: ReferenceSchema.optional(),
	ReferenceCustomer: ReferenceSchema.optional(),
	Upgrade: z
		.boolean()
		.optional()
		.describe(
			'Make the link point at the upgrade workflow. Needs `ReferenceCustomer` or `IdSubscription`.',
		),
	IdSubscription: IdSchema.optional(),
	IgnoreFeatures: z.boolean().optional(),
	Language: z.string().min(2).optional(),
	Html: z.boolean().optional(),
	Links: z.boolean().optional(),
});

export type OffersGetInput = z.infer<typeof OffersGetInputSchema>;

// ── features ──────────────────────────────────────────────────────────────

export const FeatureSchema = z
	.object({
		Id: IdSchema.nullish(),
		ReferenceFeature: z.string().nullish(),
		IdSegment: IdSchema.nullish(),
		TitleLocalized: z.string().nullish(),
		DescriptionLocalized: z.string().nullish(),
		TypeFeature: z
			.string()
			.nullish()
			.describe('`Limitation`, `OnOff` or `Quantifiable`.'),
		IsVisible: z.boolean().nullish(),
		CodeFeature: z.string().nullish(),
	})
	.loose();

export type ProabonoFeature = z.infer<typeof FeatureSchema>;

const FeaturesListInputSchema = z.object({
	ReferenceSegment: ReferenceSchema.optional(),
	ReferenceCustomer: ReferenceSchema.optional(),
	Language: z.string().min(2).optional(),
});

export type FeaturesListInput = z.infer<typeof FeaturesListInputSchema>;

const FeaturesListOutputSchema = z.object({
	features: z.array(FeatureSchema),
});

export type FeaturesListOutput = z.infer<typeof FeaturesListOutputSchema>;

const FeaturesGetInputSchema = z.object({
	ReferenceFeature: ReferenceSchema,
	ReferenceSegment: ReferenceSchema.optional(),
	ReferenceCustomer: ReferenceSchema.optional(),
	Language: z.string().min(2).optional(),
});

export type FeaturesGetInput = z.infer<typeof FeaturesGetInputSchema>;

// ── subscriptions ─────────────────────────────────────────────────────────

export const SubscriptionSchema = z
	.object({
		Id: IdSchema.nullish(),
		IdSegment: IdSchema.nullish(),
		IdOffer: IdSchema.nullish(),
		IdCustomer: IdSchema.nullish(),
		IdCustomerBuyer: IdSchema.nullish(),
		ReferenceSegment: z.string().nullish(),
		ReferenceOffer: z.string().nullish(),
		ReferenceCustomer: z.string().nullish(),
		ReferenceCustomerBuyer: z.string().nullish(),
		Status: z
			.string()
			.nullish()
			.describe('The lifecycle status, such as `Active`.'),
		StateSubscription: z
			.string()
			.nullish()
			.describe('The detailed state, such as `ActiveRunning`.'),
		DateStart: z.string().nullish(),
		DatePeriodStart: z.string().nullish(),
		DatePeriodEnd: z.string().nullish(),
		DateTerm: z.string().nullish(),
		StatusAfterTerm: z.string().nullish(),
		StateSubscriptionAfterTerm: z.string().nullish(),
		IsTrial: z.boolean().nullish(),
		CountDaysTrial: z.number().nullish(),
		IsEngaged: z.boolean().nullish(),
		IsCustomerBillable: z.boolean().nullish(),
		IsPaymentCappingReached: z.boolean().nullish(),
		DateNextBilling: z.string().nullish(),
		TitleLocalized: z.string().nullish(),
		PricingSubtotal: z.number().nullish().describe('In cents.'),
		PricingTotal: z.number().nullish().describe('In cents, with taxes.'),
		AmountUpFront: z.number().nullish(),
		DurationTrial: z.number().nullish(),
		UnitTrial: z.string().nullish(),
		AmountRecurrence: z.number().nullish(),
		DurationRecurrence: z.number().nullish(),
		UnitRecurrence: z.string().nullish(),
		CountRecurrences: z.number().nullish(),
		CountMinRecurrences: z.number().nullish(),
		// unknown: each feature is provider-shaped, so the list passes through.
		Features: z.array(ProabonoJsonValueSchema).nullish(),
		Metadata: ProabonoJsonValueSchema.nullish(),
		DateUpdate: z.string().nullish(),
		Links: linksField,
	})
	.loose();

export type ProabonoSubscription = z.infer<typeof SubscriptionSchema>;

export const SubscriptionsCreateInputSchema = z.object({
	ReferenceOffer: ReferenceSchema,
	ReferenceCustomer: ReferenceSchema.describe(
		'The customer, which must already exist in ProAbono.',
	),
	ReferenceCustomerBuyer: ReferenceSchema.optional().describe(
		'When the buyer is not the recipient.',
	),
	Metadata: MetadataSchema,
	EnsureBillable: z
		.boolean()
		.optional()
		.describe(
			'Check paying information even for a free offer; a customer without any answers 403.',
		),
	TryStart: z
		.boolean()
		.optional()
		.describe(
			'False creates without starting, so the subscription can be customised first; true forces a start.',
		),
	BillNow: z.boolean().optional().describe('Bill the start immediately.'),
});

export type SubscriptionsCreateInput = z.infer<
	typeof SubscriptionsCreateInputSchema
>;

const SubscriptionIdInputSchema = z.object({
	IdSubscription: IdSchema,
});

export type SubscriptionIdInput = z.infer<typeof SubscriptionIdInputSchema>;

const SubscriptionsListInputSchema = z.object({
	ReferenceCustomer: ReferenceSchema.optional(),
	ReferenceOffer: ReferenceSchema.optional(),
	ReferenceSegment: ReferenceSchema.optional(),
	Page: z.number().int().positive().optional(),
	SizePage: z.number().int().min(1).optional(),
});

export type SubscriptionsListInput = z.infer<
	typeof SubscriptionsListInputSchema
>;

const SubscriptionsListOutputSchema = z.object({
	subscriptions: z.array(SubscriptionSchema),
});

export type SubscriptionsListOutput = z.infer<
	typeof SubscriptionsListOutputSchema
>;

const SubscriptionTermInputSchema = z.object({
	IdSubscription: IdSchema,
	DateTerm: z
		.string()
		.min(1)
		.describe('The new end date, as an ISO 8601 timestamp.'),
});

export type SubscriptionTermInput = z.infer<typeof SubscriptionTermInputSchema>;

const SubscriptionUpgradeInputSchema = z.object({
	IdSubscription: IdSchema,
	ReferenceOffer: ReferenceSchema.describe(
		'The offer to move the subscription to.',
	),
});

export type SubscriptionUpgradeInput = z.infer<
	typeof SubscriptionUpgradeInputSchema
>;

// ── usages ────────────────────────────────────────────────────────────────

export const UsageSchema = z
	.object({
		Id: IdSchema.nullish(),
		IdSubscription: IdSchema.nullish(),
		IdCustomer: IdSchema.nullish(),
		ReferenceCustomer: z.string().nullish(),
		ReferenceFeature: z.string().nullish(),
		IdFeature: IdSchema.nullish(),
		Date: z.string().nullish(),
		DateStart: z.string().nullish(),
		DateEnd: z.string().nullish(),
		Quantity: z.number().nullish(),
	})
	.loose();

export type ProabonoUsage = z.infer<typeof UsageSchema>;

const UsagesListInputSchema = z.object({
	ReferenceCustomer: ReferenceSchema.optional(),
	ReferenceFeature: ReferenceSchema.optional(),
	IdSubscription: IdSchema.optional(),
	DateStart: z.string().min(1).optional(),
	DateEnd: z.string().min(1).optional(),
});

export type UsagesListInput = z.infer<typeof UsagesListInputSchema>;

const UsagesListOutputSchema = z.object({
	usages: z.array(UsageSchema),
});

export type UsagesListOutput = z.infer<typeof UsagesListOutputSchema>;

const UsagesGetInputSchema = z.object({
	IdUsage: IdSchema,
});

export type UsagesGetInput = z.infer<typeof UsagesGetInputSchema>;

/**
 * Usage update by increment takes one row at a time; the increment can be
 * negative, which is how a refunded action is recorded.
 */
export const UsageIncrementInputSchema = z.object({
	ReferenceCustomer: ReferenceSchema,
	ReferenceFeature: ReferenceSchema,
	Increment: z
		.number()
		.int()
		.describe('How much to add. A negative value subtracts.'),
	Date: z
		.string()
		.min(1)
		.optional()
		.describe('When the usage happened. Defaults to now.'),
});

export type UsageIncrementInput = z.infer<typeof UsageIncrementInputSchema>;

/** One row of a multi-usage update. */
export const UsageUpdateRowSchema = z.object({
	ReferenceCustomer: ReferenceSchema,
	ReferenceFeature: ReferenceSchema,
	Increment: z.number().int().optional(),
	Quantity: z.number().int().optional(),
	Date: z.string().min(1).optional(),
});

export type ProabonoUsageUpdateRow = z.infer<typeof UsageUpdateRowSchema>;

export const UsagesUpdateInputSchema = z.object({
	usages: z.array(UsageUpdateRowSchema).min(1),
});

export type UsagesUpdateInput = z.infer<typeof UsagesUpdateInputSchema>;

const UsagesUpdateOutputSchema = z.object({
	usages: z.array(UsageSchema),
});

export type UsagesUpdateOutput = z.infer<typeof UsagesUpdateOutputSchema>;

// ── balance lines and invoices ────────────────────────────────────────────

export const BalanceLineSchema = z
	.object({
		Id: IdSchema.nullish(),
		IdCustomer: IdSchema.nullish(),
		ReferenceCustomer: z.string().nullish(),
		IdSegment: IdSchema.nullish(),
		Title: z.string().nullish(),
		Description: z.string().nullish(),
		Amount: z.number().nullish().describe('In cents.'),
		Date: z.string().nullish(),
		TypeBalanceLine: z.string().nullish(),
		IsBilled: z.boolean().nullish(),
	})
	.loose();

export type ProabonoBalanceLine = z.infer<typeof BalanceLineSchema>;

export const BalanceLinesCreateInputSchema = z.object({
	ReferenceCustomer: ReferenceSchema,
	Title: z.string().min(1),
	Amount: z.number().int().describe('In cents. A negative value is a credit.'),
	Description: z.string().min(1).optional(),
	Date: z.string().min(1).optional(),
});

export type BalanceLinesCreateInput = z.infer<
	typeof BalanceLinesCreateInputSchema
>;

const BalanceLinesListInputSchema = z.object({
	ReferenceCustomer: ReferenceSchema.optional(),
	IsBilled: z.boolean().optional(),
	Page: z.number().int().positive().optional(),
	SizePage: z.number().int().min(1).optional(),
});

export type BalanceLinesListInput = z.infer<typeof BalanceLinesListInputSchema>;

const BalanceLinesListOutputSchema = z.object({
	balanceLines: z.array(BalanceLineSchema),
});

export type BalanceLinesListOutput = z.infer<
	typeof BalanceLinesListOutputSchema
>;

export const InvoiceSchema = z
	.object({
		Id: IdSchema.nullish(),
		IdCustomer: IdSchema.nullish(),
		ReferenceCustomer: z.string().nullish(),
		IdSubscription: IdSchema.nullish(),
		Number: z.string().nullish(),
		AmountSubtotal: z.number().nullish().describe('In cents.'),
		AmountTotal: z.number().nullish().describe('In cents, with taxes.'),
		Currency: z.string().nullish(),
		Date: z.string().nullish(),
		DateDue: z.string().nullish(),
		State: z.string().nullish().describe('The invoice state, such as `Paid`.'),
		Links: linksField,
	})
	.loose();

export type ProabonoInvoice = z.infer<typeof InvoiceSchema>;

const InvoicesListInputSchema = z.object({
	ReferenceCustomer: ReferenceSchema.optional(),
	State: z.string().min(1).optional(),
	DateStart: z.string().min(1).optional(),
	DateEnd: z.string().min(1).optional(),
	Page: z.number().int().positive().optional(),
	SizePage: z.number().int().min(1).optional(),
});

export type InvoicesListInput = z.infer<typeof InvoicesListInputSchema>;

const InvoicesListOutputSchema = z.object({
	invoices: z.array(InvoiceSchema),
});

export type InvoicesListOutput = z.infer<typeof InvoicesListOutputSchema>;

const InvoicesGetInputSchema = z.object({
	IdInvoice: IdSchema,
});

export type InvoicesGetInput = z.infer<typeof InvoicesGetInputSchema>;

// ── Registry ──────────────────────────────────────────────────────────────

export type ProabonoEndpointInputs = {
	customersCreate: CustomersCreateInput;
	customersGet: CustomersGetInput;
	customersList: CustomersListInput;
	customersUpdate: CustomersUpdateInput;
	customersAnonymize: CustomersActionInput;
	customersInvalidate: CustomersActionInput;
	customersSuspend: CustomersActionInput;
	offersList: OffersListInput;
	offersGet: OffersGetInput;
	featuresList: FeaturesListInput;
	featuresGet: FeaturesGetInput;
	subscriptionsCreate: SubscriptionsCreateInput;
	subscriptionsGet: SubscriptionIdInput;
	subscriptionsList: SubscriptionsListInput;
	subscriptionsStart: SubscriptionIdInput;
	subscriptionsSuspend: SubscriptionIdInput;
	subscriptionsTerminate: SubscriptionIdInput;
	subscriptionsUpgrade: SubscriptionUpgradeInput;
	subscriptionsUpdateTerm: SubscriptionTermInput;
	usagesList: UsagesListInput;
	usagesGet: UsagesGetInput;
	usagesIncrement: UsageIncrementInput;
	usagesUpdate: UsagesUpdateInput;
	balanceLinesCreate: BalanceLinesCreateInput;
	balanceLinesList: BalanceLinesListInput;
	invoicesList: InvoicesListInput;
	invoicesGet: InvoicesGetInput;
};

export type ProabonoEndpointOutputs = {
	customersCreate: ProabonoCustomer;
	customersGet: ProabonoCustomer;
	customersList: CustomersListOutput;
	customersUpdate: ProabonoCustomer;
	customersAnonymize: CustomerActionOutput;
	customersInvalidate: CustomerActionOutput;
	customersSuspend: CustomerActionOutput;
	offersList: OffersListOutput;
	offersGet: ProabonoOffer;
	featuresList: FeaturesListOutput;
	featuresGet: ProabonoFeature;
	subscriptionsCreate: ProabonoSubscription;
	subscriptionsGet: ProabonoSubscription;
	subscriptionsList: SubscriptionsListOutput;
	subscriptionsStart: ProabonoSubscription;
	subscriptionsSuspend: ProabonoSubscription;
	subscriptionsTerminate: ProabonoSubscription;
	subscriptionsUpgrade: ProabonoSubscription;
	subscriptionsUpdateTerm: ProabonoSubscription;
	usagesList: UsagesListOutput;
	usagesGet: ProabonoUsage;
	usagesIncrement: ProabonoUsage;
	usagesUpdate: UsagesUpdateOutput;
	balanceLinesCreate: ProabonoBalanceLine;
	balanceLinesList: BalanceLinesListOutput;
	invoicesList: InvoicesListOutput;
	invoicesGet: ProabonoInvoice;
};

export const ProabonoEndpointInputSchemas = {
	customersCreate: CustomersCreateInputSchema,
	customersGet: CustomersGetInputSchema,
	customersList: CustomersListInputSchema,
	customersUpdate: CustomersUpdateInputSchema,
	customersAnonymize: CustomersActionInputSchema,
	customersInvalidate: CustomersActionInputSchema,
	customersSuspend: CustomersActionInputSchema,
	offersList: OffersListInputSchema,
	offersGet: OffersGetInputSchema,
	featuresList: FeaturesListInputSchema,
	featuresGet: FeaturesGetInputSchema,
	subscriptionsCreate: SubscriptionsCreateInputSchema,
	subscriptionsGet: SubscriptionIdInputSchema,
	subscriptionsList: SubscriptionsListInputSchema,
	subscriptionsStart: SubscriptionIdInputSchema,
	subscriptionsSuspend: SubscriptionIdInputSchema,
	subscriptionsTerminate: SubscriptionIdInputSchema,
	subscriptionsUpgrade: SubscriptionUpgradeInputSchema,
	subscriptionsUpdateTerm: SubscriptionTermInputSchema,
	usagesList: UsagesListInputSchema,
	usagesGet: UsagesGetInputSchema,
	usagesIncrement: UsageIncrementInputSchema,
	usagesUpdate: UsagesUpdateInputSchema,
	balanceLinesCreate: BalanceLinesCreateInputSchema,
	balanceLinesList: BalanceLinesListInputSchema,
	invoicesList: InvoicesListInputSchema,
	invoicesGet: InvoicesGetInputSchema,
} as const;

export const ProabonoEndpointOutputSchemas = {
	customersCreate: CustomerSchema,
	customersGet: CustomerSchema,
	customersList: CustomersListOutputSchema,
	customersUpdate: CustomerSchema,
	customersAnonymize: CustomerActionOutputSchema,
	customersInvalidate: CustomerActionOutputSchema,
	customersSuspend: CustomerActionOutputSchema,
	offersList: OffersListOutputSchema,
	offersGet: OfferSchema,
	featuresList: FeaturesListOutputSchema,
	featuresGet: FeatureSchema,
	subscriptionsCreate: SubscriptionSchema,
	subscriptionsGet: SubscriptionSchema,
	subscriptionsList: SubscriptionsListOutputSchema,
	subscriptionsStart: SubscriptionSchema,
	subscriptionsSuspend: SubscriptionSchema,
	subscriptionsTerminate: SubscriptionSchema,
	subscriptionsUpgrade: SubscriptionSchema,
	subscriptionsUpdateTerm: SubscriptionSchema,
	usagesList: UsagesListOutputSchema,
	usagesGet: UsageSchema,
	usagesIncrement: UsageSchema,
	usagesUpdate: UsagesUpdateOutputSchema,
	balanceLinesCreate: BalanceLineSchema,
	balanceLinesList: BalanceLinesListOutputSchema,
	invoicesList: InvoicesListOutputSchema,
	invoicesGet: InvoiceSchema,
} as const;
