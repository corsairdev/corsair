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

/**
 * The page counters ProAbono sends beside `Items` on every paginated list.
 * `TotalItems` is the size of the whole collection, so a caller can tell
 * whether another page exists.
 */
const pageFields = {
	Page: z.number().nullish().describe('The page this answer holds, from 1.'),
	SizePage: z.number().nullish().describe('Rows per page.'),
	Count: z.number().nullish().describe('Rows on this page.'),
	TotalItems: z
		.number()
		.nullish()
		.describe('Rows in the whole collection, across pages.'),
};

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
		Status: z
			.string()
			.nullish()
			.describe('The customer status, such as `Enabled`.'),
		ReferenceAffiliation: z.string().nullish(),
		DateAffiliation: z.string().nullish(),
		DateCreated: z.string().nullish(),
		Metadata: ProabonoJsonValueSchema.nullish(),
		Links: linksField,
	})
	.loose();

export type ProabonoCustomer = z.infer<typeof CustomerSchema>;

// The create body takes only the documented fields: ProAbono rejects an
// undocumented property with `Error.Property.UnexpectedProperty`. The billing
// address (company, country) has its own route.
export const CustomersCreateInputSchema = z.object({
	ReferenceCustomer: ReferenceSchema,
	Name: z.string().min(1).optional().describe('Full name of the customer.'),
	Email: z.string().min(1).optional(),
	Language: z.string().min(2).optional(),
	ReferenceSegment: ReferenceSchema.optional(),
	ReferenceOffer: ReferenceSchema.optional().describe(
		'An offer the customer wants; the answer then carries a subscribe link.',
	),
	ReferenceAffiliation: z
		.string()
		.min(1)
		.optional()
		.describe('The affiliate who brought the customer.'),
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

/** A list answers a paginated envelope; its rows land under `customers`. */
export const CustomersListOutputSchema = z.object({
	customers: z.array(CustomerSchema),
	...pageFields,
});

export type CustomersListOutput = z.infer<typeof CustomersListOutputSchema>;

export const CustomersUpdateInputSchema = z
	.object({
		ReferenceCustomer: ReferenceSchema,
		Name: z.string().min(1).optional(),
		Email: z.string().min(1).optional(),
		Language: z.string().min(2).optional(),
		ReferenceAffiliation: z.string().min(1).optional(),
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
	Page: z.number().int().positive().optional().describe('1-based page number.'),
	SizePage: z.number().int().min(1).optional().describe('Rows per page.'),
});

export type OffersListInput = z.infer<typeof OffersListInputSchema>;

const OffersListOutputSchema = z.object({
	offers: z.array(OfferSchema),
	...pageFields,
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
	IsVisible: z.boolean().optional(),
	Page: z.number().int().positive().optional().describe('1-based page number.'),
	SizePage: z.number().int().min(1).optional().describe('Rows per page.'),
});

export type FeaturesListInput = z.infer<typeof FeaturesListInputSchema>;

const FeaturesListOutputSchema = z.object({
	features: z.array(FeatureSchema),
	...pageFields,
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

// Only the documented filters: an unknown one would be ignored and the caller
// would read every subscription as the filtered set.
const SubscriptionsListInputSchema = z.object({
	ReferenceCustomer: ReferenceSchema.optional(),
	ReferenceCustomerBuyer: ReferenceSchema.optional(),
	ReferenceSegment: ReferenceSchema.optional(),
	IgnoreFeatures: z
		.boolean()
		.optional()
		.describe('Leave the feature list out of the answer.'),
	Page: z.number().int().positive().optional(),
	SizePage: z.number().int().min(1).optional(),
});

export type SubscriptionsListInput = z.infer<
	typeof SubscriptionsListInputSchema
>;

const SubscriptionsListOutputSchema = z.object({
	subscriptions: z.array(SubscriptionSchema),
	...pageFields,
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

/**
 * A usage is the compiled state of one feature for one customer: on/off for an
 * `OnOff` feature, quantities for `Limitation` and `Consumption`. It has no id
 * of its own; a customer and a feature reference identify it.
 */
export const UsageSchema = z
	.object({
		IdSegment: IdSchema.nullish(),
		IdFeature: IdSchema.nullish(),
		IdCustomer: IdSchema.nullish(),
		IdSubscription: IdSchema.nullish().describe(
			'Absent when several subscriptions match the usage.',
		),
		ReferenceSegment: z.string().nullish(),
		ReferenceFeature: z.string().nullish(),
		ReferenceCustomer: z.string().nullish(),
		TypeFeature: z
			.string()
			.nullish()
			.describe('`OnOff`, `Limitation` or `Consumption`.'),
		IsIncluded: z.boolean().nullish().describe('OnOff features only.'),
		IsEnabled: z.boolean().nullish().describe('OnOff features only.'),
		QuantityIncluded: z
			.number()
			.nullish()
			.describe('Included quantity; absent means unlimited.'),
		QuantityCurrent: z.number().nullish().describe('Quantity used so far.'),
		DatePeriodStart: z.string().nullish(),
		DatePeriodEnd: z.string().nullish(),
	})
	.loose();

export type ProabonoUsage = z.infer<typeof UsageSchema>;

const UsagesListInputSchema = z.object({
	ReferenceCustomer: ReferenceSchema.optional(),
	ReferenceFeature: ReferenceSchema.optional(),
	IdSubscription: IdSchema.optional(),
	Page: z.number().int().positive().optional().describe('1-based page number.'),
	SizePage: z.number().int().min(1).optional().describe('Rows per page.'),
});

export type UsagesListInput = z.infer<typeof UsagesListInputSchema>;

const UsagesListOutputSchema = z.object({
	usages: z.array(UsageSchema),
	...pageFields,
});

export type UsagesListOutput = z.infer<typeof UsagesListOutputSchema>;

const UsagesGetInputSchema = z.object({
	ReferenceCustomer: ReferenceSchema,
	ReferenceFeature: ReferenceSchema,
	IdSubscription: IdSchema.optional().describe(
		'Read the usage of this subscription when the customer has several.',
	),
});

export type UsagesGetInput = z.infer<typeof UsagesGetInputSchema>;

const DateStampSchema = z
	.string()
	.min(1)
	.describe(
		'When the change happened, as an ISO 8601 timestamp. ProAbono records two changes with the same timestamp once, so it doubles as an idempotency key.',
	);

/**
 * Usage update by increment takes one row at a time; the increment can be
 * negative, which is how a refunded action is recorded.
 */
export const UsageIncrementInputSchema = z.object({
	ReferenceCustomer: ReferenceSchema,
	ReferenceFeature: ReferenceSchema,
	IdSubscription: IdSchema.optional(),
	Increment: z
		.number()
		.int()
		.describe('How much to add. A negative value subtracts.'),
	DateStamp: DateStampSchema,
	EnsureBillable: z
		.boolean()
		.optional()
		.describe(
			'True by default on ProAbono: a customer without valid payment information answers 403. False skips that check.',
		),
});

export type UsageIncrementInput = z.infer<typeof UsageIncrementInputSchema>;

/**
 * One row of a multi-usage update: exactly one of `Increment` (Limitation or
 * Consumption), `QuantityCurrent` (Limitation) or `IsEnabled` (OnOff).
 */
export const UsageUpdateRowSchema = z
	.object({
		ReferenceCustomer: ReferenceSchema,
		ReferenceFeature: ReferenceSchema,
		IdSubscription: IdSchema.optional(),
		Increment: z.number().int().optional(),
		QuantityCurrent: z
			.number()
			.int()
			.optional()
			.describe('The new current quantity, for a Limitation feature.'),
		IsEnabled: z.boolean().optional().describe('For an OnOff feature.'),
		DateStamp: DateStampSchema,
	})
	.superRefine((row, ctx) => {
		const set = [row.Increment, row.QuantityCurrent, row.IsEnabled].filter(
			(value) => value !== undefined,
		);
		if (set.length !== 1) {
			ctx.addIssue({
				code: 'custom',
				message: 'Set exactly one of Increment, QuantityCurrent or IsEnabled.',
				path: ['Increment'],
			});
		}
	});

export type ProabonoUsageUpdateRow = z.infer<typeof UsageUpdateRowSchema>;

export const UsagesUpdateInputSchema = z.object({
	usages: z
		.array(UsageUpdateRowSchema)
		.min(1)
		.max(50)
		.describe('ProAbono asks for at most 50 rows per call.'),
});

export type UsagesUpdateInput = z.infer<typeof UsagesUpdateInputSchema>;

const UsagesUpdateOutputSchema = z.object({
	usages: z.array(UsageSchema),
});

export type UsagesUpdateOutput = z.infer<typeof UsagesUpdateOutputSchema>;

// ── balance lines and invoices ────────────────────────────────────────────

export const BalanceLineSchema = z
	.object({
		IdSegment: IdSchema.nullish(),
		IdCustomer: IdSchema.nullish(),
		IdSubscription: IdSchema.nullish(),
		ReferenceSegment: z.string().nullish(),
		ReferenceCustomer: z.string().nullish(),
		LabelLocalized: z.string().nullish(),
		PricingLocalized: z.string().nullish().describe('HTML.'),
		Currency: z.string().nullish(),
		AmountSubtotal: z.number().nullish().describe('In cents, before taxes.'),
		AmountTotal: z.number().nullish().describe('In cents, with taxes.'),
		DateMove: z
			.string()
			.nullish()
			.describe('When the line is billed, for a line outside a period.'),
		QuantityReported: z.number().nullish(),
		QuantityBilled: z.number().nullish(),
		DatePeriodStart: z.string().nullish(),
		DatePeriodTerm: z.string().nullish(),
	})
	.loose();

export type ProabonoBalanceLine = z.infer<typeof BalanceLineSchema>;

export const BalanceLinesCreateInputSchema = z.object({
	ReferenceCustomer: ReferenceSchema,
	IdSubscription: IdSchema.optional(),
	Label: z
		.string()
		.min(1)
		.optional()
		.describe('The line label, shown on the invoice.'),
	Amount: z
		.number()
		.int()
		.describe('In cents, before taxes. A negative value is a credit.'),
	Quantity: z
		.number()
		.int()
		.optional()
		.describe('Shown on the invoice only; it does not change the amount.'),
	EnsureBillable: z
		.boolean()
		.optional()
		.describe(
			'True by default on ProAbono: a customer without valid payment information answers 403. False adds the line anyway.',
		),
});

export type BalanceLinesCreateInput = z.infer<
	typeof BalanceLinesCreateInputSchema
>;

const BalanceLinesListInputSchema = z.object({
	ReferenceCustomer: ReferenceSchema.optional(),
	ReferenceSegment: ReferenceSchema.optional(),
	ReferenceFeature: ReferenceSchema.optional(),
	IdSubscription: IdSchema.optional(),
	Page: z.number().int().positive().optional(),
	SizePage: z
		.number()
		.int()
		.min(0)
		.optional()
		.describe('Rows per page. 0 returns only the totals in `Computations`.'),
});

export type BalanceLinesListInput = z.infer<typeof BalanceLinesListInputSchema>;

const BalanceLinesListOutputSchema = z.object({
	balanceLines: z.array(BalanceLineSchema),
	...pageFields,
	Computations: z
		.object({
			AmountSubtotal: z.number().nullish(),
			AmountTotal: z.number().nullish(),
		})
		.loose()
		.nullish()
		.describe('Totals in cents over every matching line.'),
});

export type BalanceLinesListOutput = z.infer<
	typeof BalanceLinesListOutputSchema
>;

export const InvoiceSchema = z
	.object({
		Id: IdSchema.nullish(),
		IdSegment: IdSchema.nullish(),
		IdCustomer: IdSchema.nullish(),
		ReferenceSegment: z.string().nullish(),
		ReferenceCustomer: z.string().nullish(),
		FullNumber: z.string().nullish().describe('Such as `S-3.00000004`.'),
		Status: z.string().nullish().describe('Such as `Due` or `Paid`.'),
		StateInvoice: z
			.string()
			.nullish()
			.describe('The detailed state, such as `DuePending`.'),
		DateIssue: z.string().nullish(),
		DatePayment: z.string().nullish(),
		DatePaymentLimit: z.string().nullish(),
		TypePayment: z.string().nullish(),
		AmountSubtotal: z.number().nullish().describe('In cents.'),
		AmountTotal: z.number().nullish().describe('In cents, with taxes.'),
		Currency: z.string().nullish(),
		DateUpdate: z.string().nullish(),
		Links: linksField,
	})
	.loose();

export type ProabonoInvoice = z.infer<typeof InvoiceSchema>;

const InvoicesListInputSchema = z.object({
	ReferenceCustomer: ReferenceSchema.optional(),
	IdSubscription: IdSchema.optional(),
	Page: z.number().int().positive().optional(),
	SizePage: z.number().int().min(1).optional(),
});

export type InvoicesListInput = z.infer<typeof InvoicesListInputSchema>;

const InvoicesListOutputSchema = z.object({
	invoices: z.array(InvoiceSchema),
	...pageFields,
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
