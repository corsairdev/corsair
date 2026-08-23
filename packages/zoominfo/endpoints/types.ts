import { z } from 'zod';

// Field names, types and value ranges below come from ZoomInfo's own
// /lookup/inputfields/<resource>/search and /lookup/outputfields/<resource>
// listings, which are the API's self-description of what each endpoint accepts
// and returns. Response schemas are loose: ZoomInfo returns only the fields a
// subscription is entitled to, and adds new ones without a version bump.

/** Shared by all five search endpoints. */
export const ZoominfoPaginationSchema = z.object({
	/** Results per page. */
	rpp: z.number().int().positive().optional(),
	/** Page number, used with rpp. */
	page: z.number().int().positive().optional(),
	/** Sorts by one of the endpoint's valid output fields. */
	sortBy: z.string().optional(),
	sortOrder: z
		.enum(['asc', 'ascending', 'desc', 'descending'])
		.optional()
		.describe('Defaults to desc.'),
});

/**
 * Firmographic filters accepted by the company, contact, intent and scoop
 * searches alike. Several take comma-separated lists whose valid values come
 * from a /lookup/<name> endpoint; those are typed as plain strings because the
 * value sets are account-specific.
 */
export const ZoominfoCompanyCriteriaSchema = z.object({
	companyDescription: z.string().optional(),
	companyType: z.string().optional(),
	companyRanking: z.string().optional(),
	companyStructureIncludedSubUnitTypes: z.string().optional(),
	subUnitTypes: z.string().optional(),
	address: z.string().optional(),
	street: z.string().optional(),
	state: z.string().optional(),
	zipCode: z.string().optional(),
	country: z.string().optional(),
	continent: z.string().optional(),
	metroRegion: z.string().optional(),
	excludedRegions: z.string().optional(),
	zipCodeRadiusMiles: z.string().optional(),
	locationSearchType: z
		.enum(['PersonOrHQ', 'PersonAndHQ', 'Person', 'HQ', 'PersonThenHQ'])
		.optional(),
	hashTagString: z.string().optional(),
	techAttributeTagList: z.string().optional(),
	primaryIndustriesOnly: z.boolean().optional(),
	industryCodes: z.string().optional(),
	industryKeywords: z.string().optional(),
	sicCodes: z.string().optional(),
	naicsCodes: z.string().optional(),
	revenue: z.string().optional(),
	/** Thousands of USD. */
	revenueMin: z.number().int().optional(),
	revenueMax: z.number().int().optional(),
	employeeCount: z.string().optional(),
	employeeRangeMin: z.string().optional(),
	employeeRangeMax: z.string().optional(),
	/** Thousands of USD. */
	fundingAmountMin: z.number().int().optional(),
	fundingAmountMax: z.number().int().optional(),
	/** YYYY-MM-DD. */
	fundingStartDate: z.string().optional(),
	fundingEndDate: z.string().optional(),
	oneYearEmployeeGrowthRateMin: z.string().optional(),
	oneYearEmployeeGrowthRateMax: z.string().optional(),
	twoYearEmployeeGrowthRateMin: z.string().optional(),
	twoYearEmployeeGrowthRateMax: z.string().optional(),
	zoominfoContactsMin: z.string().optional(),
	zoominfoContactsMax: z.string().optional(),
});

/** Company identity filters, shared by the company, contact and scoop searches. */
export const ZoominfoCompanyIdentitySchema = z.object({
	/** Accepts a comma-separated list. */
	companyId: z.string().optional(),
	companyName: z.string().optional(),
	/** Domain; accepts a comma-separated list. */
	companyWebsite: z.string().optional(),
	parentId: z.string().optional(),
	ultimateParentId: z.string().optional(),
});

/** Person filters, shared by the contact and scoop searches. */
export const ZoominfoPersonCriteriaSchema = z.object({
	/** Accepts a comma-separated list. */
	personId: z.string().optional(),
	emailAddress: z.string().optional(),
	/** MD5, SHA1, SHA256 or SHA512 of the work email. */
	hashedEmail: z.string().optional(),
	fullName: z.string().optional(),
	firstName: z.string().optional(),
	middleInitial: z.string().optional(),
	lastName: z.string().optional(),
	jobTitle: z.string().optional(),
	excludeJobTitle: z.string().optional(),
	managementLevel: z.string().optional(),
	excludeManagementLevel: z.string().optional(),
	department: z.string().optional(),
	jobFunction: z.string().optional(),
	boardMember: z.enum(['include', 'exclude', 'only']).optional(),
	hasBeenNotified: z.enum(['include', 'exclude', 'only']).optional(),
	companyPastOrPresent: z
		.enum(['present', 'past', 'pastAndPresent'])
		.optional(),
	excludePartialProfiles: z.boolean().optional(),
	executivesOnly: z.boolean().optional(),
	requiredFields: z.string().optional(),
	contactAccuracyScoreMin: z.string().optional(),
	contactAccuracyScoreMax: z.string().optional(),
	lastUpdatedInMonths: z.number().int().optional(),
	school: z.string().optional(),
	degree: z.string().optional(),
	locationCompanyId: z.array(z.string()).optional(),
});

// ── Response building blocks ────────────────────────────────────────────────

const ZoominfoCompanyRefSchema = z.looseObject({
	id: z.number().optional(),
	name: z.string().optional(),
});

/**
 * The envelope shared by the five searches and by the location, intent, news,
 * scoop and technology enrichments. `totalResults` is absent from the news
 * responses, so it stays optional.
 */
function searchEnvelope<T extends z.ZodTypeAny>(item: T) {
	return z.looseObject({
		maxResults: z.number().optional(),
		totalResults: z.number().optional(),
		currentPage: z.number().optional(),
		data: z.array(item),
	});
}

/**
 * The envelope used by the company and contact enrichments, which report a
 * per-input match rather than a result page.
 */
function matchEnvelope<T extends z.ZodTypeAny>(item: T) {
	return z.looseObject({
		success: z.boolean().optional(),
		data: z.looseObject({
			outputFields: z.array(z.unknown()).optional(),
			result: z.array(
				z.looseObject({
					input: z.unknown().optional(),
					data: item,
				}),
			),
		}),
	});
}

/** Row shape returned by every /lookup/inputfields/<resource>/search endpoint. */
export const ZoominfoInputFieldSchema = z.looseObject({
	fieldName: z.string(),
	fieldType: z.string().optional(),
	description: z.string().optional(),
	/** Returned as the string "true"/"false", not a boolean. */
	accessGranted: z.string().optional(),
});

export const ZoominfoInputFieldsResponseSchema = z.array(
	ZoominfoInputFieldSchema,
);

// ── Company search ──────────────────────────────────────────────────────────

export const SearchCompaniesInputSchema = ZoominfoPaginationSchema.extend(
	ZoominfoCompanyCriteriaSchema.shape,
)
	.extend(ZoominfoCompanyIdentitySchema.shape)
	.extend({
		companyTicker: z.array(z.string()).optional(),
		/** 1 = ZoomInfo confirmed activity in the past 12 months, 0 = not. */
		certified: z.union([z.literal(0), z.literal(1)]).optional(),
		excludeDefunctCompanies: z.boolean().optional(),
		businessModel: z.array(z.enum(['B2C', 'B2B', 'B2G'])).optional(),
		/** YYYY-MM-DD. engagementStartDate is required to use engagementEndDate. */
		engagementStartDate: z.string().optional(),
		engagementEndDate: z.string().optional(),
		engagementType: z
			.array(z.enum(['email', 'phone', 'online meeting']))
			.optional(),
		/** Thousands of USD. */
		marketingDepartmentBudgetMin: z.number().int().min(0).optional(),
		marketingDepartmentBudgetMax: z.number().int().min(0).optional(),
		financeDepartmentBudgetMin: z.number().int().min(0).optional(),
		financeDepartmentBudgetMax: z.number().int().min(0).optional(),
		itDepartmentBudgetMin: z.number().int().min(0).optional(),
		itDepartmentBudgetMax: z.number().int().min(0).optional(),
		hrDepartmentBudgetMin: z.number().int().min(0).optional(),
		hrDepartmentBudgetMax: z.number().int().min(0).optional(),
	});

export const SearchCompaniesResponseSchema = searchEnvelope(
	z.looseObject({
		id: z.number(),
		name: z.string().optional(),
	}),
);

// ── Contact search ──────────────────────────────────────────────────────────

export const SearchContactsInputSchema = ZoominfoPaginationSchema.extend(
	ZoominfoCompanyCriteriaSchema.shape,
)
	.extend(ZoominfoCompanyIdentitySchema.shape)
	.extend(ZoominfoPersonCriteriaSchema.shape)
	.extend({
		companyTicker: z.array(z.string()).optional(),
		exactJobTitle: z.string().optional(),
		yearsOfExperience: z.string().optional(),
		phone: z.array(z.string()).optional(),
		supplementalEmail: z.array(z.string()).optional(),
		webReferences: z.array(z.string()).optional(),
		techSkills: z.array(z.string()).optional(),
		/** Exactly one Buying Group ID. */
		buyingGroup: z.array(z.string()).max(1).optional(),
		lastUpdatedDateAfter: z.string().optional(),
		validDateAfter: z.string().optional(),
		positionStartDateMin: z.string().optional(),
		positionStartDateMax: z.string().optional(),
		engagementStartDate: z.string().optional(),
		engagementEndDate: z.string().optional(),
		engagementType: z
			.array(z.enum(['email', 'phone', 'online meeting']))
			.optional(),
	});

export const SearchContactsResponseSchema = searchEnvelope(
	z.looseObject({
		id: z.number(),
		firstName: z.string().optional(),
		middleName: z.string().optional(),
		lastName: z.string().optional(),
		validDate: z.string().optional(),
		lastUpdatedDate: z.string().optional(),
		jobTitle: z.string().optional(),
		contactAccuracyScore: z.number().optional(),
		hasEmail: z.boolean().optional(),
		hasSupplementalEmail: z.boolean().optional(),
		hasDirectPhone: z.boolean().optional(),
		hasMobilePhone: z.boolean().optional(),
		hasCompanyIndustry: z.boolean().optional(),
		hasCompanyPhone: z.boolean().optional(),
		hasCompanyStreet: z.boolean().optional(),
		hasCompanyState: z.boolean().optional(),
		hasCompanyZipCode: z.boolean().optional(),
		hasCompanyCountry: z.boolean().optional(),
		hasCompanyRevenue: z.boolean().optional(),
		hasCompanyEmployeeCount: z.boolean().optional(),
		company: ZoominfoCompanyRefSchema.optional(),
	}),
);

// ── Intent search ───────────────────────────────────────────────────────────

const AudienceStrengthSchema = z.enum(['A', 'B', 'C', 'D', 'E']);

export const SearchIntentInputSchema = ZoominfoPaginationSchema.extend(
	ZoominfoCompanyCriteriaSchema.shape,
).extend({
	/** Values come from the /lookup/intent/topics endpoint. */
	topics: z.array(z.string()).optional(),
	signalStartDate: z.string().optional(),
	signalEndDate: z.string().optional(),
	signalScoreMin: z.number().int().min(60).max(100).optional(),
	signalScoreMax: z.number().int().min(60).max(100).optional(),
	/** A is the strongest. */
	audienceStrengthMin: AudienceStrengthSchema.optional(),
	audienceStrengthMax: AudienceStrengthSchema.optional(),
	certified: z.union([z.literal(0), z.literal(1)]).optional(),
	excludeDefunctCompanies: z.boolean().optional(),
});

const IntentSignalSchema = z.looseObject({
	id: z.string(),
	category: z.string().optional(),
	topic: z.string().optional(),
	signalScore: z.number().optional(),
	audienceStrength: z.string().optional(),
	newSignal: z.boolean().optional(),
	signalDate: z.string().optional(),
	trend: z.number().optional(),
	recommendedContacts: z
		.array(
			z.looseObject({
				id: z.number().optional(),
				firstName: z.string().optional(),
				lastName: z.string().optional(),
				jobTitle: z.string().optional(),
				jobFunction: z
					.array(
						z.looseObject({
							name: z.string().optional(),
							department: z.string().optional(),
						}),
					)
					.optional(),
			}),
		)
		.optional(),
	company: ZoominfoCompanyRefSchema.extend({
		website: z.string().optional(),
		hasOtherTopicConsumption: z.boolean().optional(),
	}).optional(),
});

export const SearchIntentResponseSchema = searchEnvelope(IntentSignalSchema);

// ── News search ─────────────────────────────────────────────────────────────

export const SearchNewsInputSchema = z.object({
	rpp: z.number().int().positive().optional(),
	page: z.number().int().positive().optional(),
	/** Values come from the /lookup/news/categories endpoint. */
	categories: z.array(z.string()).optional(),
	/** Earliest publish date, e.g. 2020-01-01. */
	pageDateMin: z.string().optional(),
	/** Latest publish date, e.g. 2020-01-31. */
	pageDateMax: z.string().optional(),
});

const NewsArticleSchema = z.looseObject({
	domain: z.string().optional(),
	title: z.string().optional(),
	url: z.string().optional(),
	imageUrl: z.string().optional(),
	pageDate: z.string().optional(),
	description: z.string().optional(),
	categories: z.array(z.string()).optional(),
	/** News is company-scoped, so this is a list rather than a single ref. */
	company: z.array(ZoominfoCompanyRefSchema).optional(),
});

export const SearchNewsResponseSchema = searchEnvelope(NewsArticleSchema);

// ── Scoop search ────────────────────────────────────────────────────────────

export const SearchScoopsInputSchema = ZoominfoPaginationSchema.extend(
	ZoominfoCompanyCriteriaSchema.shape,
)
	.extend(ZoominfoCompanyIdentitySchema.shape)
	.extend(ZoominfoPersonCriteriaSchema.shape)
	.extend({
		/** Accepts a comma-separated list. */
		scoopId: z.string().optional(),
		scoopType: z.string().optional(),
		scoopTopic: z.string().optional(),
		description: z.string().optional(),
		/** YYYY-MM-DD. */
		publishedStartDate: z.string().optional(),
		publishedEndDate: z.string().optional(),
		updatedSinceCreation: z.boolean().optional(),
		certified: z.union([z.literal(0), z.literal(1)]).optional(),
		excludeDefunctCompanies: z.boolean().optional(),
	});

const ScoopSchema = z.looseObject({
	id: z.number(),
	publishedDate: z.string().optional(),
	originalPublishedDate: z.string().optional(),
	linkText: z.string().optional(),
	link: z.string().optional(),
	description: z.string().optional(),
	updateText: z.string().optional(),
	topics: z.array(z.unknown()).optional(),
	types: z
		.array(
			z.looseObject({
				id: z.number().optional(),
				type: z.string().optional(),
			}),
		)
		.optional(),
	contacts: z.array(z.unknown()).optional(),
	company: ZoominfoCompanyRefSchema.optional(),
});

export const SearchScoopsResponseSchema = searchEnvelope(ScoopSchema);

// ── Company enrich ──────────────────────────────────────────────────────────

/** 1–25 companies per request; at least one identifier per entry. */
export const EnrichCompanyInputSchema = z.object({
	matchCompanyInput: z
		.array(
			z
				.object({
					companyId: z.union([z.number(), z.string()]).optional(),
					companyName: z.string().optional(),
					companyWebsite: z.string().optional(),
					companyTicker: z.string().optional(),
					companyPhone: z.string().optional(),
					companyFax: z.string().optional(),
					companyStreet: z.string().optional(),
					companyCity: z.string().optional(),
					companyState: z.string().optional(),
					companyZipCode: z.string().optional(),
					companyCountry: z.string().optional(),
					ipAddress: z.string().optional(),
				})
				.refine((entry) => Object.values(entry).some((v) => v !== undefined), {
					message: 'each matchCompanyInput entry needs one identifier',
				}),
		)
		.min(1)
		.max(25),
	/** Values come from /lookup/outputfields/company/enrich. */
	outputFields: z.array(z.string()).optional(),
});

export const EnrichCompanyResponseSchema = matchEnvelope(z.unknown());

// ── Contact enrich ──────────────────────────────────────────────────────────

/** 1–25 contacts per request; at least one identifier per entry. */
export const EnrichContactInputSchema = z.object({
	matchPersonInput: z
		.array(
			z
				.object({
					personId: z.union([z.number(), z.string()]).optional(),
					firstName: z.string().optional(),
					lastName: z.string().optional(),
					fullName: z.string().optional(),
					emailAddress: z.string().optional(),
					hashedEmail: z.string().optional(),
					phone: z.string().optional(),
					jobTitle: z.string().optional(),
					companyId: z.union([z.number(), z.string()]).optional(),
					companyName: z.string().optional(),
					companyWebsite: z.string().optional(),
				})
				.refine((entry) => Object.values(entry).some((v) => v !== undefined), {
					message: 'each matchPersonInput entry needs one identifier',
				}),
		)
		.min(1)
		.max(25),
	/** Values come from /lookup/outputfields/contact/enrich. */
	outputFields: z.array(z.string()).optional(),
});

export const EnrichContactResponseSchema = matchEnvelope(z.unknown());

// ── Location enrich ─────────────────────────────────────────────────────────

export const EnrichLocationInputSchema = ZoominfoPaginationSchema.extend({
	companyId: z.string().optional(),
	companyName: z.string().optional(),
	companyWebsite: z.string().optional(),
	street: z.string().optional(),
	city: z.string().optional(),
	state: z.string().optional(),
	zipCode: z.string().optional(),
	country: z.string().optional(),
}).refine(
	(input) =>
		input.companyId !== undefined ||
		input.companyName !== undefined ||
		input.companyWebsite !== undefined,
	{ message: 'companyId, companyName or companyWebsite is required' },
);

export const EnrichLocationResponseSchema = searchEnvelope(
	z.looseObject({
		phone: z.string().optional(),
		fax: z.string().optional(),
		street: z.string().optional(),
		city: z.string().optional(),
		state: z.string().optional(),
		zipCode: z.string().optional(),
		country: z.string().optional(),
		company: ZoominfoCompanyRefSchema.extend({
			addressStatus: z.string().optional(),
			subUnitType: z.string().optional(),
			locationName: z.string().optional(),
			locationEmployeeCount: z.number().optional(),
		}).optional(),
	}),
);

// ── Intent enrich ───────────────────────────────────────────────────────────

export const EnrichIntentInputSchema = ZoominfoPaginationSchema.extend({
	companyId: z.union([z.number(), z.string()]).optional(),
	companyName: z.string().optional(),
	companyWebsite: z.string().optional(),
	topics: z.array(z.string()).optional(),
	signalStartDate: z.string().optional(),
	signalEndDate: z.string().optional(),
	signalScoreMin: z.number().int().min(60).max(100).optional(),
	signalScoreMax: z.number().int().min(60).max(100).optional(),
	audienceStrengthMin: AudienceStrengthSchema.optional(),
	audienceStrengthMax: AudienceStrengthSchema.optional(),
}).refine(
	(input) =>
		input.companyId !== undefined ||
		input.companyName !== undefined ||
		input.companyWebsite !== undefined,
	{ message: 'companyId, companyName or companyWebsite is required' },
);

export const EnrichIntentResponseSchema = searchEnvelope(IntentSignalSchema);

// ── News enrich ─────────────────────────────────────────────────────────────

export const EnrichNewsInputSchema = z
	.object({
		companyId: z.union([z.number(), z.string()]).optional(),
		companyName: z.string().optional(),
		companyWebsite: z.string().optional(),
		categories: z.array(z.string()).optional(),
		/** Restricts results to these publisher domains. */
		url: z.array(z.string()).optional(),
		pageDateMin: z.string().optional(),
		pageDateMax: z.string().optional(),
		limit: z.number().int().positive().optional(),
	})
	.refine(
		(input) =>
			input.companyId !== undefined ||
			input.companyName !== undefined ||
			input.companyWebsite !== undefined,
		{ message: 'companyId, companyName or companyWebsite is required' },
	);

export const EnrichNewsResponseSchema = searchEnvelope(NewsArticleSchema);

// ── Scoop enrich ────────────────────────────────────────────────────────────

export const EnrichScoopInputSchema = ZoominfoPaginationSchema.extend({
	companyId: z.union([z.number(), z.string()]).optional(),
	companyName: z.string().optional(),
	companyWebsite: z.string().optional(),
	scoopType: z.string().optional(),
	scoopTopic: z.string().optional(),
	department: z.string().optional(),
	publishedStartDate: z.string().optional(),
	publishedEndDate: z.string().optional(),
	updatedSinceCreation: z.boolean().optional(),
}).refine(
	(input) =>
		input.companyId !== undefined ||
		input.companyName !== undefined ||
		input.companyWebsite !== undefined,
	{ message: 'companyId, companyName or companyWebsite is required' },
);

export const EnrichScoopResponseSchema = searchEnvelope(ScoopSchema);

// ── Technology enrich ───────────────────────────────────────────────────────

export const EnrichTechnologyInputSchema = ZoominfoPaginationSchema.extend({
	companyId: z.union([z.number(), z.string()]).optional(),
	companyName: z.string().optional(),
	companyWebsite: z.string().optional(),
}).refine(
	(input) =>
		input.companyId !== undefined ||
		input.companyName !== undefined ||
		input.companyWebsite !== undefined,
	{ message: 'companyId, companyName or companyWebsite is required' },
);

export const EnrichTechnologyResponseSchema = searchEnvelope(
	z.looseObject({
		tag: z.string().optional(),
		categoryParent: z.string().optional(),
		category: z.string().optional(),
		vendor: z.string().optional(),
		product: z.string().optional(),
		attribute: z.string().optional(),
		website: z.string().optional(),
		logo: z.string().optional(),
		domain: z.string().optional(),
		createdTime: z.string().optional(),
		modifiedTime: z.string().optional(),
		description: z.string().optional(),
	}),
);

// ── Input-field lookups ─────────────────────────────────────────────────────

/** These take no parameters; the endpoint itself selects the resource. */
export const LookupInputFieldsInputSchema = z.object({});

// ── Registry ────────────────────────────────────────────────────────────────

export const ZoominfoEndpointInputSchemas = {
	searchCompanies: SearchCompaniesInputSchema,
	searchContacts: SearchContactsInputSchema,
	searchIntent: SearchIntentInputSchema,
	searchNews: SearchNewsInputSchema,
	searchScoops: SearchScoopsInputSchema,
	enrichCompany: EnrichCompanyInputSchema,
	enrichContact: EnrichContactInputSchema,
	enrichIntent: EnrichIntentInputSchema,
	enrichLocation: EnrichLocationInputSchema,
	enrichNews: EnrichNewsInputSchema,
	enrichScoop: EnrichScoopInputSchema,
	enrichTechnology: EnrichTechnologyInputSchema,
	getCompanySearchInputFields: LookupInputFieldsInputSchema,
	getContactSearchInputFields: LookupInputFieldsInputSchema,
	getIntentSearchInputFields: LookupInputFieldsInputSchema,
	getNewsSearchInputFields: LookupInputFieldsInputSchema,
	getScoopSearchInputFields: LookupInputFieldsInputSchema,
} as const;

export const ZoominfoEndpointOutputSchemas = {
	searchCompanies: SearchCompaniesResponseSchema,
	searchContacts: SearchContactsResponseSchema,
	searchIntent: SearchIntentResponseSchema,
	searchNews: SearchNewsResponseSchema,
	searchScoops: SearchScoopsResponseSchema,
	enrichCompany: EnrichCompanyResponseSchema,
	enrichContact: EnrichContactResponseSchema,
	enrichIntent: EnrichIntentResponseSchema,
	enrichLocation: EnrichLocationResponseSchema,
	enrichNews: EnrichNewsResponseSchema,
	enrichScoop: EnrichScoopResponseSchema,
	enrichTechnology: EnrichTechnologyResponseSchema,
	getCompanySearchInputFields: ZoominfoInputFieldsResponseSchema,
	getContactSearchInputFields: ZoominfoInputFieldsResponseSchema,
	getIntentSearchInputFields: ZoominfoInputFieldsResponseSchema,
	getNewsSearchInputFields: ZoominfoInputFieldsResponseSchema,
	getScoopSearchInputFields: ZoominfoInputFieldsResponseSchema,
} as const;

export type ZoominfoEndpointInputs = {
	[K in keyof typeof ZoominfoEndpointInputSchemas]: z.infer<
		(typeof ZoominfoEndpointInputSchemas)[K]
	>;
};

export type ZoominfoEndpointOutputs = {
	[K in keyof typeof ZoominfoEndpointOutputSchemas]: z.infer<
		(typeof ZoominfoEndpointOutputSchemas)[K]
	>;
};

export type SearchCompaniesInput = ZoominfoEndpointInputs['searchCompanies'];
export type SearchCompaniesResponse =
	ZoominfoEndpointOutputs['searchCompanies'];
export type ZoominfoInputField = z.infer<typeof ZoominfoInputFieldSchema>;
