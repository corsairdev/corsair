import { z } from 'zod';

// Google Ads is query-and-mutate shaped, so most inputs are a GAQL string with
// its paging fields, and most mutations are one operation object. Outputs are
// `.loose()`: a row returns whatever fields the query selected, and Google adds
// resource fields between versions.
//
// Sources: https://developers.google.com/google-ads/api/rest/common/search for
// search and its 10,000-row pages, .../common/mutate for the create / update /
// remove operation shape and `updateMask`, .../rest/auth for the
// developer-token and login-customer-id headers, .../docs/best-practices/
// understand-api-errors for the error envelope, and the v26 service protos for
// each method's request and response message.

// ── shared ───────────────────────────────────────────────────────────────────

/**
 * A Google Ads customer ID: digits, and Google's docs say to remove the hyphens
 * rather than send them. A hyphenated ID is accepted and stripped.
 */
const customerId = z
	.string()
	.min(1)
	.describe(
		"The account's customer ID, e.g. `1234567890`. A hyphenated `123-456-7890` is accepted and the hyphens are removed, which is what the docs ask",
	);

/** GAQL: https://developers.google.com/google-ads/api/docs/query/overview */
const query = z
	.string()
	.min(1)
	.describe(
		"A Google Ads Query Language statement, e.g. `SELECT campaign.id, campaign.name FROM campaign WHERE campaign.status = 'ENABLED'`",
	);

/**
 * `Search` pages at 10,000 rows and rejects a larger page size. Omitted, Google
 * chooses the page size.
 */
const pageSize = z
	.number()
	.int()
	.min(1)
	.max(10_000)
	.nullish()
	.describe('1 to 10,000 rows. Omitted, Google chooses');

const pageToken = z
	.string()
	.nullish()
	.describe('nextPageToken from a previous page of the same query');

/**
 * `validate_only` runs the request through Google's checks without applying it.
 * The docs give it to both search and mutate.
 */
const validateOnly = z
	.boolean()
	.nullish()
	.describe(
		'Validate the request without applying it: Google returns only errors, never results',
	);

/** A resource name, the form every update and remove operation takes. */
const resourceName = z
	.string()
	.min(1)
	.describe(
		'e.g. `customers/1234567890/campaigns/456`, or a `-1` placeholder id for a resource created in the same mutate request',
	);

// ── search ───────────────────────────────────────────────────────────────────

const SearchInputSchema = z
	.object({
		customerId,
		query,
		pageSize,
		pageToken,
		validateOnly,
	})
	.strict();

const SearchStreamInputSchema = z
	.object({
		customerId,
		query,
		validateOnly,
	})
	.strict();

/**
 * One row of a search result. A row is keyed by resource, and a GAQL query
 * selects the fields inside it, so the shape changes per query and only the
 * envelope is pinned.
 */
const GoogleAdsRowSchema = z
	.record(z.string(), z.unknown()) // unknown: a row holds the queried fields.
	.describe(
		'One row, keyed by resource name (`campaign`, `adGroup`, `metrics`, `segments`). The fields are the ones the query selected',
	);

const SearchOutputSchema = z.object({
	results: z
		.array(GoogleAdsRowSchema)
		.nullish()
		.describe('Absent when the query matched nothing'),
	nextPageToken: z
		.string()
		.nullish()
		.describe('Pass back as pageToken. Absent on the last page'),
	totalResultsCount: z
		.string()
		.nullish()
		.describe(
			'int64 as a string, and only counted when the query asks for the total',
		),
	fieldMask: z
		.string()
		.nullish()
		.describe('Comma-separated fields the response carries'),
	queryResourceConsumption: z
		.string()
		.nullish()
		.describe('int64 as a string: the quota cost this query used'),
});

/**
 * `searchStream` answers a JSON array with one element per batch of results,
 * not a single object, and there is no page token. The endpoint flattens the
 * array into one `results` list.
 */
const SearchStreamOutputSchema = z.object({
	results: z.array(GoogleAdsRowSchema),
	fieldMask: z.string().nullish(),
	queryResourceConsumption: z.string().nullish(),
});

// ── mutate ───────────────────────────────────────────────────────────────────

/** The only three mutate operations the API defines. */
export const MUTATE_OPERATIONS = ['create', 'update', 'remove'] as const;

/**
 * One mutate operation. A create carries the resource, an update carries the
 * resource plus an `updateMask`, and a remove carries only a resource name.
 *
 * unknown: the resource is provider-shaped and differs per entity, so it is
 * passed through to Google, which validates it. Pinning it here would either
 * duplicate hundreds of fields or silently drop the ones not modelled.
 */
const operationBody = z.record(z.string(), z.unknown()); // unknown: per-entity resource.

const MutateOperationSchema = z
	.object({
		create: operationBody
			.nullish()
			.describe('The new resource, without a resourceName'),
		update: operationBody
			.nullish()
			.describe('The resource with the fields to change, and its resourceName'),
		remove: z
			.string()
			.nullish()
			.describe('The resource name to remove, and nothing else'),
		updateMask: z
			.string()
			.nullish()
			.describe(
				'Comma-separated field names to change, e.g. `name,status`. Required on an update unless the whole resource is sent',
			),
	})
	.strict()
	.superRefine((value, ctx) => {
		// Google accepts exactly one operation per entry. Sending two is a
		// request the API refuses, so it is caught before the call.
		const set = [value.create, value.update, value.remove].filter(
			(part) => part !== undefined && part !== null,
		);
		if (set.length !== 1) {
			ctx.addIssue({
				code: 'custom',
				message:
					'Each operation carries exactly one of create, update or remove',
			});
		}
		if (value.updateMask && !value.update) {
			ctx.addIssue({
				code: 'custom',
				path: ['updateMask'],
				message: 'updateMask only applies to an update operation',
			});
		}
	});

const operations = z
	.array(MutateOperationSchema)
	.min(1)
	.describe('One entry per resource; Google applies them as one batch');

const partialFailure = z
	.boolean()
	.nullish()
	.describe(
		'Let the request succeed for the operations that can, reporting the rest in partialFailureError. Off by default, which makes the batch all-or-nothing',
	);

/**
 * `googleAds:mutate` takes every entity in one `mutateOperations` array, where
 * each entry names its entity (`campaignOperation`, `adGroupOperation`, …).
 *
 * unknown: the per-entity operation object is provider-shaped and differs by
 * entity, so it is passed through for Google to validate. Pinning it would
 * duplicate hundreds of fields or silently drop the ones not modelled.
 */
// Google-shaped per entity, so it is passed through for Google to check.
const MutateOperationEntrySchema = z.record(
	z.string(),
	z.unknown(), // unknown: the per-entity operation body.
);

const GoogleAdsMutateInputSchema = z
	.object({
		customerId,
		mutateOperations: z
			.array(MutateOperationEntrySchema)
			.min(1)
			.describe(
				'One entry per entity, each naming its operation, e.g. `{ campaignOperation: { update: { resourceName, name }, updateMask: "name" } }`',
			),
		partialFailure,
		validateOnly,
		responseContentType: z
			.enum(['UNSPECIFIED', 'RESOURCE_NAME_ONLY', 'MUTABLE_RESOURCE'])
			.nullish()
			.describe(
				'`MUTABLE_RESOURCE` returns the changed resource; the default returns only the resource name',
			),
	})
	.strict();

const GoogleAdsFailureSchema = z
	.object({
		errors: z
			.array(
				z
					.object({
						errorCode: z
							.record(z.string(), z.string())
							.nullish()
							.describe(
								'One key naming the error group, e.g. `{ campaignError: "DUPLICATE_CAMPAIGN_NAME" }`',
							),
						message: z.string().nullish(),
						trigger: z.record(z.string(), z.unknown()).nullish(), // unknown: echo.
						location: z
							.object({
								fieldPathElements: z
									.array(
										z.object({
											fieldName: z.string().nullish(),
											index: z.number().nullish(),
										}),
									)
									.nullish(),
							})
							.nullish(),
					})
					.loose(),
			)
			.nullish(),
		requestId: z.string().nullish(),
	})
	.loose();

const MutateOutputSchema = z.object({
	results: z
		.array(
			z
				.object({
					resourceName: z.string().nullish(),
				})
				.loose(),
		)
		.nullish()
		.describe('One result per operation, in order, each naming the resource'),
	partialFailureError: GoogleAdsFailureSchema.nullish().describe(
		'Present when partialFailure was set and some operations failed',
	),
});

const googleAdsServiceMutateOutput = MutateOutputSchema;

/**
 * `customers:mutate` takes ONE `operation` and answers ONE `result`, unlike
 * every other mutate service, because only a single customer update is allowed
 * per call.
 */
const MutateCustomerOutputSchema = z.object({
	result: z
		.object({ resourceName: z.string().nullish() })
		.loose()
		.nullish()
		.describe('The mutated customer, named by its resource name'),
});

// ── entities ─────────────────────────────────────────────────────────────────

const CampaignStatusValues = [
	'UNSPECIFIED',
	'UNKNOWN',
	'ENABLED',
	'PAUSED',
	'REMOVED',
] as const;

const CampaignStatusSchema = z.enum(CampaignStatusValues);

/** The advertising channel values campaign create accepts. */
export const ADVERTISING_CHANNEL_TYPES = [
	'SEARCH',
	'DISPLAY',
	'SHOPPING',
	'VIDEO',
	'MULTI_CHANNEL',
	'LOCAL',
	'SMART',
	'PERFORMANCE_MAX',
	'LOCAL_SERVICES',
	'TRAVEL',
	'DEMAND_GEN',
] as const;

/**
 * A campaign create. Google requires `name`, `advertisingChannelType`,
 * `campaignBudget` and a bidding strategy, so the schema requires the first
 * three and the endpoint requires one of the two strategies it models.
 */
const CampaignCreateSchema = z
	.object({
		name: z.string().min(1),
		status: CampaignStatusSchema.nullish().describe('Defaults to ENABLED'),
		advertisingChannelType: z
			.enum(ADVERTISING_CHANNEL_TYPES)
			.describe(
				'Immutable. `SEARCH` for a search campaign, which is the only channel the bidding fields below are modelled for',
			),
		campaignBudget: resourceName.describe(
			'The budget resource name, e.g. `customers/1234567890/campaignBudgets/789`',
		),
		startDateTime: z
			.string()
			.nullish()
			.describe('`YYYY-MM-DD HH:MM:SS` in the account time zone'),
		endDateTime: z
			.string()
			.nullish()
			.describe('`YYYY-MM-DD HH:MM:SS`. Omitted, the campaign does not end'),
		networkSettings: z
			.object({
				targetGoogleSearch: z.boolean().nullish(),
				targetSearchNetwork: z.boolean().nullish(),
				targetContentNetwork: z.boolean().nullish(),
				targetPartnerSearchNetwork: z.boolean().nullish(),
			})
			.strict()
			.nullish(),
		manualCpc: z
			.object({
				enhancedCpcEnabled: z.boolean().nullish(),
			})
			.strict()
			.nullish()
			.describe('Manual CPC bidding, the one strategy modelled here'),
		targetSpend: z
			.object({})
			.loose()
			.nullish()
			.describe('Spend the budget without a bid target, `{}`'),
	})
	.strict()
	.superRefine((value, ctx) => {
		// Google rejects a campaign with no bidding strategy, so this is caught
		// before the request rather than after.
		const strategies = [value.manualCpc, value.targetSpend].filter(
			(part) => part !== undefined && part !== null,
		);
		if (strategies.length === 0) {
			ctx.addIssue({
				code: 'custom',
				path: ['manualCpc'],
				message: 'One bidding strategy is required: manualCpc or targetSpend',
			});
		}
		if (strategies.length > 1) {
			ctx.addIssue({
				code: 'custom',
				path: ['manualCpc'],
				message: 'Send one bidding strategy, not several',
			});
		}
	});

const CampaignUpdateSchema = z
	.object({
		name: z.string().min(1).nullish(),
		status: CampaignStatusSchema.nullish().describe(
			'`REMOVED` is how a campaign is deleted; use campaigns.remove for that',
		),
		startDateTime: z.string().nullish(),
		endDateTime: z.string().nullish(),
	})
	.strict();

const campaignUpdateMask = z
	.string()
	.min(1)
	.describe(
		'Comma-separated fields the update changes, e.g. `name,status`. Required: Google ignores an update without one',
	);

const CampaignMutationInputSchema = z
	.object({
		customerId,
		campaign: CampaignCreateSchema,
		validateOnly,
	})
	.strict();

const CampaignUpdateInputSchema = z
	.object({
		customerId,
		campaignId: z
			.string()
			.min(1)
			.describe(
				'The campaign id, or its full resource name, e.g. `1234567890`',
			),
		campaign: CampaignUpdateSchema,
		updateMask: campaignUpdateMask,
		validateOnly,
	})
	.strict();

const CampaignRemoveInputSchema = z
	.object({
		customerId,
		campaignId: z.string().min(1),
		validateOnly,
	})
	.strict();

const CampaignBudgetCreateSchema = z
	.object({
		name: z.string().min(1).describe("Unique among the account's budgets"),
		amountMicros: z
			.string()
			.min(1)
			.describe(
				'The budget in micros, as a string: `5000000` is 5.00 in the account currency',
			),
		deliveryMethod: z
			.enum(['UNSPECIFIED', 'UNKNOWN', 'STANDARD', 'ACCELERATED'])
			.nullish()
			.describe(
				'`STANDARD` spends evenly; `ACCELERATED` is not available to every account',
			),
		explicitlyShared: z
			.boolean()
			.nullish()
			.describe('Let campaigns other than the first one use this budget'),
	})
	.strict();

const CampaignBudgetUpdateSchema = z
	.object({
		name: z.string().min(1).nullish(),
		amountMicros: z.string().min(1).nullish(),
		deliveryMethod: z
			.enum(['UNSPECIFIED', 'UNKNOWN', 'STANDARD', 'ACCELERATED'])
			.nullish(),
	})
	.strict();

const CampaignBudgetMutationInputSchema = z
	.object({
		customerId,
		campaignBudget: CampaignBudgetCreateSchema,
		validateOnly,
	})
	.strict();

const CampaignBudgetUpdateInputSchema = z
	.object({
		customerId,
		campaignBudgetId: z
			.string()
			.min(1)
			.describe('The budget id, or its resource name'),
		campaignBudget: CampaignBudgetUpdateSchema,
		updateMask: z
			.string()
			.min(1)
			.describe('Comma-separated fields to change, e.g. `amountMicros`'),
		validateOnly,
	})
	.strict();

const AdGroupStatusSchema = z.enum([
	'UNSPECIFIED',
	'UNKNOWN',
	'ENABLED',
	'PAUSED',
	'REMOVED',
]);

/** The ad group types a create accepts. */
export const AD_GROUP_TYPES = [
	'UNSPECIFIED',
	'UNKNOWN',
	'SEARCH_STANDARD',
	'DISPLAY_STANDARD',
	'SHOPPING_PRODUCT_ADS',
	'HOTEL_ADS',
	'VIDEO_BUMPER',
	'VIDEO_TRUE_VIEW_IN_STREAM',
	'VIDEO_TRUE_VIEW_IN_DISPLAY',
	'VIDEO_NON_SKIPPABLE_IN_STREAM',
	'VIDEO_OUTSTREAM',
	'SEARCH_DYNAMIC_ADS',
	'SHOPPING_SMART_ADS',
	'DISPLAY_GMAIL_AD',
	'SHOPPING_COMPARISON_LISTING_ADS',
	'SMART_CAMPAIGN',
	'VIDEO_RESPONSIVE',
	'DISPLAY_SMART_CAMPAIGN',
];

const AdGroupCreateSchema = z
	.object({
		name: z.string().min(1),
		campaign: resourceName.describe(
			'The campaign resource name, e.g. `customers/1234567890/campaigns/456`',
		),
		status: AdGroupStatusSchema.nullish().describe('Defaults to ENABLED'),
		type: z
			.enum(AD_GROUP_TYPES)
			.nullish()
			.describe('Immutable. `SEARCH_STANDARD` for a search campaign'),
		cpcBidMicros: z
			.string()
			.nullish()
			.describe('The default max CPC in micros, as a string'),
	})
	.strict();

const AdGroupUpdateSchema = z
	.object({
		name: z.string().min(1).nullish(),
		status: AdGroupStatusSchema.nullish(),
		cpcBidMicros: z.string().nullish(),
	})
	.strict();

const AdGroupMutationInputSchema = z
	.object({
		customerId,
		adGroup: AdGroupCreateSchema,
		validateOnly,
	})
	.strict();

const AdGroupUpdateInputSchema = z
	.object({
		customerId,
		adGroupId: z
			.string()
			.min(1)
			.describe('The ad group id, or its resource name'),
		adGroup: AdGroupUpdateSchema,
		updateMask: z
			.string()
			.min(1)
			.describe('Comma-separated fields to change, e.g. `status`'),
		validateOnly,
	})
	.strict();

const CustomerUpdateInputSchema = z
	.object({
		customerId,
		updateMask: z
			.string()
			.min(1)
			.describe(
				'The customer fields to change. Only `autoTaggingEnabled`, `finalUrlSuffix` and the tracking settings are writable',
			),
		customer: z
			.record(z.string(), z.unknown()) // unknown: a row holds the queried fields.
			.describe('The Customer resource fields named in updateMask'),
		validateOnly,
	})
	.strict();

// ── account discovery ───────────────────────────────────────────────────────

const ListAccessibleCustomersInputSchema = z.object({}).strict();

const ListAccessibleCustomersOutputSchema = z.object({
	resourceNames: z
		.array(z.string())
		.nullish()
		.describe('e.g. `customers/1234567890`, the accounts the token can call'),
});

const SearchGoogleAdsFieldsInputSchema = z
	.object({
		query,
		pageSize,
		pageToken,
	})
	.strict();

const GoogleAdsFieldSchema = z
	.object({
		resourceName: z.string().nullish(),
		name: z.string().nullish(),
		category: z.string().nullish(),
		selectable: z.boolean().nullish(),
		filterable: z.boolean().nullish(),
		sortable: z.boolean().nullish(),
		selectableWith: z.array(z.string()).nullish(),
		attributeResources: z.array(z.string()).nullish(),
		metrics: z.array(z.string()).nullish(),
		segments: z.array(z.string()).nullish(),
		dataType: z.string().nullish(),
		typeUrl: z.string().nullish(),
		isRepeated: z.boolean().nullish(),
	})
	.loose();

const SearchGoogleAdsFieldsOutputSchema = z.object({
	results: z.array(GoogleAdsFieldSchema).nullish(),
	nextPageToken: z.string().nullish(),
	totalResultsCount: z.string().nullish(),
});

// ── exports ─────────────────────────────────────────────────────────────────

export type GoogleAdsEndpointInputs = {
	search: z.input<typeof SearchInputSchema>;
	searchStream: z.input<typeof SearchStreamInputSchema>;
	mutate: z.input<typeof GoogleAdsMutateInputSchema>;
	campaignsCreate: z.input<typeof CampaignMutationInputSchema>;
	campaignsUpdate: z.input<typeof CampaignUpdateInputSchema>;
	campaignsRemove: z.input<typeof CampaignRemoveInputSchema>;
	campaignBudgetsCreate: z.input<typeof CampaignBudgetMutationInputSchema>;
	campaignBudgetsUpdate: z.input<typeof CampaignBudgetUpdateInputSchema>;
	adGroupsCreate: z.input<typeof AdGroupMutationInputSchema>;
	adGroupsUpdate: z.input<typeof AdGroupUpdateInputSchema>;
	customersUpdate: z.input<typeof CustomerUpdateInputSchema>;
	customersListAccessible: z.input<typeof ListAccessibleCustomersInputSchema>;
	googleAdsFieldsSearch: z.input<typeof SearchGoogleAdsFieldsInputSchema>;
};

export type GoogleAdsEndpointOutputs = {
	search: z.output<typeof SearchOutputSchema>;
	searchStream: z.output<typeof SearchStreamOutputSchema>;
	mutate: z.output<typeof googleAdsServiceMutateOutput>;
	campaignsCreate: z.output<typeof MutateOutputSchema>;
	campaignsUpdate: z.output<typeof MutateOutputSchema>;
	campaignsRemove: z.output<typeof MutateOutputSchema>;
	campaignBudgetsCreate: z.output<typeof MutateOutputSchema>;
	campaignBudgetsUpdate: z.output<typeof MutateOutputSchema>;
	adGroupsCreate: z.output<typeof MutateOutputSchema>;
	adGroupsUpdate: z.output<typeof MutateOutputSchema>;
	customersUpdate: z.output<typeof MutateCustomerOutputSchema>;
	customersListAccessible: z.output<typeof ListAccessibleCustomersOutputSchema>;
	googleAdsFieldsSearch: z.output<typeof SearchGoogleAdsFieldsOutputSchema>;
};

export const GoogleAdsEndpointInputSchemas = {
	search: SearchInputSchema,
	searchStream: SearchStreamInputSchema,
	mutate: GoogleAdsMutateInputSchema,
	campaignsCreate: CampaignMutationInputSchema,
	campaignsUpdate: CampaignUpdateInputSchema,
	campaignsRemove: CampaignRemoveInputSchema,
	campaignBudgetsCreate: CampaignBudgetMutationInputSchema,
	campaignBudgetsUpdate: CampaignBudgetUpdateInputSchema,
	adGroupsCreate: AdGroupMutationInputSchema,
	adGroupsUpdate: AdGroupUpdateInputSchema,
	customersUpdate: CustomerUpdateInputSchema,
	customersListAccessible: ListAccessibleCustomersInputSchema,
	googleAdsFieldsSearch: SearchGoogleAdsFieldsInputSchema,
} as const;

export const GoogleAdsEndpointOutputSchemas = {
	search: SearchOutputSchema,
	searchStream: SearchStreamOutputSchema,
	mutate: googleAdsServiceMutateOutput,
	campaignsCreate: MutateOutputSchema,
	campaignsUpdate: MutateOutputSchema,
	campaignsRemove: MutateOutputSchema,
	campaignBudgetsCreate: MutateOutputSchema,
	campaignBudgetsUpdate: MutateOutputSchema,
	adGroupsCreate: MutateOutputSchema,
	adGroupsUpdate: MutateOutputSchema,
	customersUpdate: MutateCustomerOutputSchema,
	customersListAccessible: ListAccessibleCustomersOutputSchema,
	googleAdsFieldsSearch: SearchGoogleAdsFieldsOutputSchema,
} as const;

export {
	CampaignCreateSchema,
	CampaignUpdateSchema,
	CampaignBudgetCreateSchema,
	CampaignBudgetUpdateSchema,
	AdGroupCreateSchema,
	AdGroupUpdateSchema,
	MutateOperationSchema,
};
