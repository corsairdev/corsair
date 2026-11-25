import { z } from 'zod';

// Inputs use Lusha's own field names. Outputs are `.loose()` and their
// documented fields nullish, so a field Lusha adds or omits cannot fail a
// call that has already happened. Field reference:
// https://docs.lusha.com/openapi.json (V3, the current API).

/** Search and enrich inputs accept up to 100 items per call. */
const MAX_BATCH = 100;

export const LUSHA_CONTACT_REVEAL_FIELDS = ['emails', 'phones'] as const;

export const LUSHA_COMPANY_REVEAL_FIELDS = [
	'employeesByDepartment',
	'employeesByLocation',
	'employeesBySeniority',
	'competitors',
	'estimatedAnnualItSpend',
	'monthlyWebsiteTraffic',
	'openJobsTotal',
	'openJobsByDepartment',
	'openJobsByLocation',
	'openJobsBySeniority',
	'directParent',
	'ultimateParent',
] as const;

export const LUSHA_CONTACT_SIGNAL_TYPES = [
	'allSignals',
	'promotion',
	'companyChange',
] as const;

export const LUSHA_COMPANY_SIGNAL_TYPES = [
	'allSignals',
	'linkedinActivityIntent',
	'websiteTrafficDecrease',
	'websiteTrafficIncrease',
	'itSpendIncrease',
	'itSpendDecrease',
	'linkedinFollowersIncrease',
	'linkedinFollowersDecrease',
	'surgeInHiring',
	'headcountIncrease1m',
	'headcountIncrease3m',
	'headcountIncrease6m',
	'headcountIncrease12m',
	'headcountDecrease1m',
	'headcountDecrease3m',
	'headcountDecrease6m',
	'headcountDecrease12m',
	'surgeInHiringByDepartment',
	'surgeInHiringByLocation',
	'riskNews',
	'commercialActivityNews',
	'corporateStrategyNews',
	'financialEventsNews',
	'peopleNews',
	'marketIntelligenceNews',
	'productActivityNews',
	'newJobPost',
	'newIntentTopic',
	'intentScoreIncrease',
	'intentScoreDecrease',
	'intentTopicRemoved',
] as const;

/** Waterfall outcome on the enrich responses; omitted when it did not run. */
export const LUSHA_ENRICH_STATUSES = [
	'completed',
	'partial',
	'halted',
	'OUT_OF_CREDITS',
	'PARTIAL_OUT_OF_CREDITS',
] as const;

export const LUSHA_STATUS_REASONS = [
	'WATERFALL_NOT_CONFIGURED',
	'WATERFALL_NOT_IN_PLAN',
	'WATERFALL_DISABLED',
] as const;

/** Terminal values sort into done/failed; `processing` is the running one. */
export const LUSHA_JOB_STATUSES = [
	'processing',
	'complete',
	'expired',
	'failed',
] as const;

// ── shared pieces ─────────────────────────────────────────────────────────

const BillingSchema = z
	.object({
		creditsCharged: z.number().nullish(),
		resultsReturned: z.number().nullish(),
		lowBalance: z.boolean().nullish(),
	})
	.loose();

const JobTitleSchema = z
	.object({
		title: z.string().nullish(),
		departments: z.array(z.string()).nullish(),
		seniority: z.string().nullish(),
		startDate: z.string().nullish(),
	})
	.loose();

const CompanyRefSchema = z
	.object({
		id: z.string().nullish(),
		name: z.string().nullish(),
		domain: z.string().nullish(),
		industry: z.string().nullish(),
	})
	.loose();

const LocationSchema = z
	.object({
		country: z.string().nullish(),
		countryIso2: z.string().nullish(),
		continent: z.string().nullish(),
		state: z.string().nullish(),
		city: z.string().nullish(),
		zipCode: z.string().nullish(),
		// Lusha sends [longitude, latitude] when present.
		coordinates: z.array(z.number()).nullish(),
		isEuContact: z.boolean().nullish(),
	})
	.loose();

const SocialLinksSchema = z
	.object({
		linkedin: z.string().nullish(),
		xUrl: z.string().nullish(),
	})
	.loose();

const ContactCanRevealItemSchema = z
	.object({
		field: z.string().nullish(),
		credits: z.number().nullish(),
		source: z.string().nullish(),
		availability: z.string().nullish(),
		vendors: z.array(z.string()).nullish(),
	})
	.loose();

const CompanyCanRevealItemSchema = z
	.object({
		field: z.string().nullish(),
		credits: z.number().nullish(),
	})
	.loose();

/** A soft miss inside one result: the record exists but Lusha has no data. */
const ItemErrorSchema = z
	.object({
		code: z.string().nullish(),
		message: z.string().nullish(),
	})
	.loose();

const EmailAddressSchema = z
	.object({
		email: z.string().nullish(),
		type: z.string().nullish(),
		confidence: z.string().nullish(),
		updateDate: z.string().nullish(),
		dataSource: z.string().nullish(),
		credits: z.number().nullish(),
	})
	.loose();

const PhoneNumberSchema = z
	.object({
		number: z.string().nullish(),
		type: z.string().nullish(),
		doNotCall: z.boolean().nullish(),
		updateDate: z.string().nullish(),
		dataSource: z.string().nullish(),
		credits: z.number().nullish(),
	})
	.loose();

/** `{exact?, min?, max?}`; Lusha uses it for employee counts and revenue ranges. */
const NumberRangeSchema = z
	.object({
		exact: z.number().nullish(),
		min: z.number().nullish(),
		max: z.number().nullish(),
	})
	.loose();

const ParentCompanySchema = z
	.object({
		lushaCompanyId: z.string().nullish(),
		name: z.string().nullish(),
		domain: z.string().nullish(),
		hqCountry: z.string().nullish(),
	})
	.loose();

const TableWriteSchema = z
	.object({
		tableId: z.string().nullish(),
		added: z.number().nullish(),
		alreadyPresent: z.number().nullish(),
		columnsCreated: z.number().nullish(),
		rowsProcessed: z.number().nullish(),
		rowsCharged: z.number().nullish(),
		rowsAlreadyPaidInTable: z.number().nullish(),
		creditsCharged: z.number().nullish(),
	})
	.loose();

const SearchOptionsSchema = z.object({
	includePartialProfiles: z
		.boolean()
		.optional()
		.describe('Include partial profiles in the results.'),
});

const MaxResultsPerSignalSchema = z
	.number()
	.int()
	.min(1)
	.max(100)
	.optional()
	.describe('Cap per signal type, 1 to 100.');

const ContactSignalsDtoSchema = z.object({
	types: z
		.array(z.enum(LUSHA_CONTACT_SIGNAL_TYPES))
		.min(1)
		.describe('Contact signal types to match.'),
	startDate: z
		.string()
		.optional()
		.describe('Only signals from this date onwards, as YYYY-MM-DD.'),
	maxResultsPerSignal: MaxResultsPerSignalSchema,
});

const CompanySignalsDtoSchema = z.object({
	types: z
		.array(z.enum(LUSHA_COMPANY_SIGNAL_TYPES))
		.min(1)
		.describe('Company signal types to match.'),
	startDate: z
		.string()
		.optional()
		.describe('Only signals from this date onwards, as YYYY-MM-DD.'),
	maxResultsPerSignal: MaxResultsPerSignalSchema,
});

// ── person.searchContacts ─────────────────────────────────────────────────

const ContactSearchItemSchema = z
	.object({
		clientReferenceId: z
			.string()
			.optional()
			.describe('Your own reference, echoed back on the result.'),
		id: z.string().optional().describe('A Lusha contact id.'),
		linkedinUrl: z.string().optional().describe('The LinkedIn profile URL.'),
		email: z.email().optional().describe('A known email address.'),
		firstName: z.string().optional(),
		lastName: z.string().optional(),
		companyName: z.string().optional(),
		companyDomain: z.string().optional(),
	})
	// Lusha documents exactly one identifier per contact, and name plus
	// company counts as one. Failing here saves the API call.
	.superRefine((item, ctx) => {
		const identifiers = [
			item.id !== undefined,
			item.linkedinUrl !== undefined,
			item.email !== undefined,
			item.firstName !== undefined &&
				item.lastName !== undefined &&
				(item.companyName !== undefined ||
					item.companyDomain !== undefined),
		].filter(Boolean).length;
		if (identifiers !== 1) {
			ctx.addIssue({
				code: 'custom',
				message:
					'Each contact needs exactly one identifier: id, linkedinUrl, email, or firstName and lastName together with companyName or companyDomain.',
			});
		}
	});

export type LushaContactSearchItem = z.input<typeof ContactSearchItemSchema>;

const SearchContactsInputSchema = z.object({
	contacts: z
		.array(ContactSearchItemSchema)
		.min(1)
		.max(MAX_BATCH)
		.describe('1 to 100 contacts to look up, each with exactly one identifier.'),
	options: SearchOptionsSchema.optional(),
	signals: ContactSignalsDtoSchema.optional(),
});

export type PersonSearchContactsInput = z.input<
	typeof SearchContactsInputSchema
>;

const ContactPreviewSchema = z
	.object({
		clientReferenceId: z.string().nullish(),
		id: z.string().nullish(),
		firstName: z.string().nullish(),
		lastName: z.string().nullish(),
		jobTitle: JobTitleSchema.nullish(),
		company: CompanyRefSchema.nullish(),
		location: LocationSchema.nullish(),
		socialLinks: SocialLinksSchema.nullish(),
		/** Data points present on the record; revealing them costs credits. */
		has: z.array(z.string()).nullish(),
		/** What can be revealed and what it costs. */
		canReveal: z.array(ContactCanRevealItemSchema).nullish(),
		signalTypes: z.array(z.string()).nullish(),
		error: ItemErrorSchema.nullish(),
	})
	.loose();

const SearchContactsResponseSchema = z
	.object({
		requestId: z.string().nullish(),
		results: z.array(ContactPreviewSchema),
		billing: BillingSchema.nullish(),
	})
	.loose();

export type PersonSearchContactsResponse = z.infer<
	typeof SearchContactsResponseSchema
>;

// ── person.enrichContacts ─────────────────────────────────────────────────

const IdsSchema = z
	.array(z.string())
	.min(1)
	.max(MAX_BATCH)
	.describe('1 to 100 ids from a search result.');

const ContactRevealSchema = z
	.array(z.enum(LUSHA_CONTACT_REVEAL_FIELDS))
	.optional()
	.describe('Data points to reveal, each charged per result: emails, phones.');

const EnrichContactsInputSchema = z.object({
	ids: IdsSchema,
	reveal: ContactRevealSchema,
	waterfallEnabled: z
		.boolean()
		.optional()
		.describe(
			'Allow the Data Waterfall to fall through to your enabled third-party providers when Lusha has no match. Defaults to true when the waterfall is enabled on your account; false means Lusha data only.',
		),
	tableId: z
		.string()
		.optional()
		.describe('Also add these contacts to this table and fill its columns.'),
});

export type PersonEnrichContactsInput = z.input<
	typeof EnrichContactsInputSchema
>;

const EnrichJobRefSchema = z
	.object({
		id: z.string().nullish(),
		status: z.enum(['processing']).nullish(),
		expiresAt: z.string().nullish(),
		retryAfter: z.number().nullish(),
	})
	.loose();

const ContactTagSchema = z
	.object({
		id: z.string().nullish(),
		name: z.string().nullish(),
		color: z.string().nullish(),
	})
	.loose();

const MissingDataPointSchema = z
	.object({
		type: z.string().nullish(),
		status: z.string().nullish(),
		description: z.string().nullish(),
	})
	.loose();

const EnrichedContactSchema = z
	.object({
		id: z.string().nullish(),
		firstName: z.string().nullish(),
		lastName: z.string().nullish(),
		fullName: z.string().nullish(),
		jobTitle: JobTitleSchema.nullish(),
		location: LocationSchema.nullish(),
		tags: z.array(ContactTagSchema).nullish(),
		emails: z.array(EmailAddressSchema).nullish(),
		phones: z.array(PhoneNumberSchema).nullish(),
		company: CompanyRefSchema.nullish(),
		socialLinks: SocialLinksSchema.nullish(),
		// unknown: per-employer objects, passed through as Lusha sends them.
		previousEmployment: z.array(z.record(z.string(), z.unknown())).nullish(),
		linkedinFollowers: z.number().nullish(),
		linkedinConnections: z.number().nullish(),
		partialProfile: z.boolean().nullish(),
		updateDate: z.string().nullish(),
		error: ItemErrorSchema.nullish(),
		missingDataPoints: z.array(MissingDataPointSchema).nullish(),
	})
	.loose();

const EnrichContactsResponseSchema = z
	.object({
		requestId: z.string().nullish(),
		results: z.array(EnrichedContactSchema),
		tableWrite: TableWriteSchema.nullish(),
		billing: BillingSchema.nullish(),
		status: z.enum(LUSHA_ENRICH_STATUSES).nullish(),
		statusDescription: z.string().nullish(),
		statusReason: z.enum(LUSHA_STATUS_REASONS).nullish(),
		/** Present only while an async provider is still working. */
		job: EnrichJobRefSchema.nullish(),
	})
	.loose();

export type PersonEnrichContactsResponse = z.infer<
	typeof EnrichContactsResponseSchema
>;

// ── person.searchAndEnrichContacts ────────────────────────────────────────

const SearchAndEnrichContactsInputSchema = z.object({
	contacts: z
		.array(ContactSearchItemSchema)
		.min(1)
		.max(MAX_BATCH)
		.describe('1 to 100 contacts to look up, each with exactly one identifier.'),
	reveal: ContactRevealSchema,
	options: SearchOptionsSchema.optional(),
});

export type PersonSearchAndEnrichContactsInput = z.input<
	typeof SearchAndEnrichContactsInputSchema
>;

const SearchAndEnrichContactResultSchema = EnrichedContactSchema; // plus clientReferenceId, which .loose() passes through

const SearchAndEnrichContactsResponseSchema = z
	.object({
		requestId: z.string().nullish(),
		results: z.array(SearchAndEnrichContactResultSchema),
		billing: BillingSchema.nullish(),
		status: z.enum(LUSHA_ENRICH_STATUSES).nullish(),
		statusDescription: z.string().nullish(),
		statusReason: z.enum(LUSHA_STATUS_REASONS).nullish(),
	})
	.loose();

export type PersonSearchAndEnrichContactsResponse = z.infer<
	typeof SearchAndEnrichContactsResponseSchema
>;

// ── company.searchCompanies ───────────────────────────────────────────────

const CompanySearchItemSchema = z.object({
	clientReferenceId: z
		.string()
		.optional()
		.describe('Your own reference, echoed back on the result.'),
	id: z.string().optional().describe('A Lusha company id.'),
	name: z.string().optional(),
	domain: z.string().optional(),
});

const SearchCompaniesInputSchema = z.object({
	companies: z
		.array(CompanySearchItemSchema)
		.min(1)
		.max(MAX_BATCH)
		.describe('1 to 100 companies, each identified by id, name or domain.'),
	options: SearchOptionsSchema.optional(),
	signals: CompanySignalsDtoSchema.optional(),
});

export type CompanySearchCompaniesInput = z.input<
	typeof SearchCompaniesInputSchema
>;

const CompanyPreviewSchema = z
	.object({
		clientReferenceId: z.string().nullish(),
		id: z.string().nullish(),
		name: z.string().nullish(),
		domain: z.string().nullish(),
		employeeCount: NumberRangeSchema.nullish(),
		industry: z.string().nullish(),
		location: LocationSchema.nullish(),
		socialLinks: SocialLinksSchema.nullish(),
		has: z.array(z.string()).nullish(),
		canReveal: z.array(CompanyCanRevealItemSchema).nullish(),
		signalTypes: z.array(z.string()).nullish(),
		error: ItemErrorSchema.nullish(),
	})
	.loose();

const SearchCompaniesResponseSchema = z
	.object({
		requestId: z.string().nullish(),
		results: z.array(CompanyPreviewSchema),
		billing: BillingSchema.nullish(),
	})
	.loose();

export type CompanySearchCompaniesResponse = z.infer<
	typeof SearchCompaniesResponseSchema
>;

// ── company.enrichCompanies ───────────────────────────────────────────────

const CompanyRevealSchema = z
	.array(z.enum(LUSHA_COMPANY_REVEAL_FIELDS))
	.optional()
	.describe(
		'Premium fields to reveal, each charged separately per result: employeesByDepartment, employeesByLocation, employeesBySeniority, competitors, estimatedAnnualItSpend, monthlyWebsiteTraffic, openJobsTotal, openJobsByDepartment, openJobsByLocation, openJobsBySeniority, directParent, ultimateParent. Omitting reveal returns base firmographics only.',
	);

const EnrichCompaniesInputSchema = z.object({
	ids: IdsSchema,
	reveal: CompanyRevealSchema,
	tableId: z
		.string()
		.optional()
		.describe('Also add these companies to this table and fill its columns.'),
});

export type CompanyEnrichCompaniesInput = z.input<
	typeof EnrichCompaniesInputSchema
>;

const SicCodeSchema = z
	.object({
		code: z.number().nullish(),
		description: z.string().nullish(),
	})
	.loose();

const CompanyFundingSchema = z
	.object({
		rounds: z
			// unknown: per-round objects, passed through as Lusha sends them.
			.array(z.record(z.string(), z.unknown()))
			.nullish(),
		totalRounds: z.number().nullish(),
		totalRoundsAmount: z.number().nullish(),
		currency: z.string().nullish(),
		isIpo: z.boolean().nullish(),
		lastRoundType: z.string().nullish(),
		lastRoundAmount: z.number().nullish(),
		lastRoundDate: z.string().nullish(),
	})
	.loose();

const EnrichedCompanySchema = z
	.object({
		id: z.string().nullish(),
		name: z.string().nullish(),
		alternativeName: z.string().nullish(),
		domain: z.string().nullish(),
		alternativeDomains: z.array(z.string()).nullish(),
		description: z.string().nullish(),
		companyType: z.string().nullish(),
		yearFounded: z.number().nullish(),
		employeeCount: NumberRangeSchema.nullish(),
		industry: z.string().nullish(),
		subIndustry: z.string().nullish(),
		specialities: z.array(z.string()).nullish(),
		sicCodes: z.array(SicCodeSchema).nullish(),
		naicsCodes: z.array(SicCodeSchema).nullish(),
		location: LocationSchema.nullish(),
		additionalLocations: z.array(LocationSchema).nullish(),
		socialLinks: SocialLinksSchema.nullish(),
		linkedinFollowers: z.number().nullish(),
		funding: CompanyFundingSchema.nullish(),
		revenueRange: NumberRangeSchema.nullish(),
		technologies: z.array(z.string()).nullish(),
		popularityTier: z.number().nullish(),
		logoUrl: z.string().nullish(),
		businessModel: z.array(z.string()).nullish(),
		// Company phone/email entries carry a subset of the contact fields.
		phones: z.array(PhoneNumberSchema).nullish(),
		emails: z.array(EmailAddressSchema).nullish(),
		keywords: z.array(z.string()).nullish(),
		openJobs: z
			.object({
				total: z.number().nullish(),
				byDepartment: z
					// unknown: per-department rows, passed through as Lusha sends them.
					.array(z.record(z.string(), z.unknown()))
					.nullish(),
				byLocation: z
					// unknown: per-location rows, passed through as Lusha sends them.
					.array(z.record(z.string(), z.unknown()))
					.nullish(),
				bySeniority: z
					// unknown: per-seniority rows, passed through as Lusha sends them.
					.array(z.record(z.string(), z.unknown()))
					.nullish(),
			})
			.loose()
			.nullish(),
		estimatedAnnualItSpend: z
			// unknown: spend breakdown, passed through as Lusha sends it.
			.record(z.string(), z.unknown())
			.nullish(),
		monthlyWebsiteTraffic: z
			// unknown: traffic series, passed through as Lusha sends it.
			.record(z.string(), z.unknown())
			.nullish(),
		employeesByDepartment: z
			// unknown: per-department rows, passed through as Lusha sends them.
			.array(z.record(z.string(), z.unknown()))
			.nullish(),
		employeesByLocation: z
			// unknown: per-location rows, passed through as Lusha sends them.
			.array(z.record(z.string(), z.unknown()))
			.nullish(),
		employeesBySeniority: z
			// unknown: per-seniority rows, passed through as Lusha sends them.
			.array(z.record(z.string(), z.unknown()))
			.nullish(),
		competitors: z
			// unknown: per-competitor rows, passed through as Lusha sends them.
			.array(z.record(z.string(), z.unknown()))
			.nullish(),
		directParent: ParentCompanySchema.nullish(),
		ultimateParent: ParentCompanySchema.nullish(),
		error: ItemErrorSchema.nullish(),
	})
	.loose();

const EnrichCompaniesResponseSchema = z
	.object({
		requestId: z.string().nullish(),
		results: z.array(EnrichedCompanySchema),
		tableWrite: TableWriteSchema.nullish(),
		billing: BillingSchema.nullish(),
	})
	.loose();

export type CompanyEnrichCompaniesResponse = z.infer<
	typeof EnrichCompaniesResponseSchema
>;

// ── company.searchAndEnrichCompanies ──────────────────────────────────────

const SearchAndEnrichCompaniesInputSchema = z.object({
	companies: z
		.array(CompanySearchItemSchema)
		.min(1)
		.max(MAX_BATCH)
		.describe('1 to 100 companies, each identified by id, name or domain.'),
	reveal: CompanyRevealSchema,
	options: SearchOptionsSchema.optional(),
});

export type CompanySearchAndEnrichCompaniesInput = z.input<
	typeof SearchAndEnrichCompaniesInputSchema
>;

const SearchAndEnrichCompaniesResponseSchema = z
	.object({
		requestId: z.string().nullish(),
		results: z.array(EnrichedCompanySchema),
		billing: BillingSchema.nullish(),
	})
	.loose();

export type CompanySearchAndEnrichCompaniesResponse = z.infer<
	typeof SearchAndEnrichCompaniesResponseSchema
>;

// ── account.getAccountUsage ───────────────────────────────────────────────

const GetAccountUsageInputSchema = z.object({});

export type AccountGetAccountUsageInput = z.input<
	typeof GetAccountUsageInputSchema
>;

const RateLimitWindowSchema = z
	.object({
		limit: z.number().nullish(),
		used: z.number().nullish(),
		remaining: z.number().nullish(),
		resetsAt: z.string().nullish(),
	})
	.loose();

const PricingEntrySchema = z
	.object({
		credits: z.number().nullish(),
		perQuantity: z.number().nullish(),
	})
	.loose();

const GetAccountUsageResponseSchema = z
	.object({
		credits: z
			.object({
				total: z.number().nullish(),
				used: z.number().nullish(),
				remaining: z.number().nullish(),
			})
			.loose()
			.nullish(),
		rateLimits: z
			.object({
				daily: RateLimitWindowSchema.nullish(),
				hourly: RateLimitWindowSchema.nullish(),
				minute: RateLimitWindowSchema.nullish(),
			})
			.loose()
			.nullish(),
		plan: z
			.object({
				category: z.string().nullish(),
				renewalType: z.string().nullish(),
				startDate: z.string().nullish(),
				endDate: z.string().nullish(),
			})
			.loose()
			.nullish(),
		/** Action name to its price, e.g. api_search, reveal_company, email, phone. */
		pricing: z.record(z.string(), PricingEntrySchema).nullish(),
	})
	.loose();

export type AccountGetAccountUsageResponse = z.infer<
	typeof GetAccountUsageResponseSchema
>;

// ── jobs.getContactsEnrichJob ─────────────────────────────────────────────

const GetContactsEnrichJobInputSchema = z.object({
	jobId: z
		.string()
		.describe('The job id from a partial enrichContacts response.'),
});

export type JobsGetContactsEnrichJobInput = z.input<
	typeof GetContactsEnrichJobInputSchema
>;

const JobCoverSchema = z
	.object({
		contactId: z.string().nullish(),
		refId: z.string().nullish(),
		dataPoints: z.array(z.string()).nullish(),
	})
	.loose();

const GetContactsEnrichJobResponseSchema = z
	.object({
		jobId: z.string().nullish(),
		// Spec-required and the field callers branch on: a missing value must
		// fail loudly rather than read as "still running" forever.
		status: z.enum(LUSHA_JOB_STATUSES),
		requestId: z.string().nullish(),
		expiresAt: z.string().nullish(),
		/** `processing` only: seconds to wait before polling again. */
		retryAfter: z.number().nullish(),
		/** `processing` only: what is still outstanding. */
		covers: z.array(JobCoverSchema).nullish(),
		/** `complete` only: the contacts this job covered, merge into your results by id. */
		contacts: z.array(EnrichedContactSchema).nullish(),
		/** `complete` only: credits charged by the async phase. */
		creditsCharged: z.number().nullish(),
		/** `failed` only: why the job failed. */
		reason: z.string().nullish(),
	})
	.loose();

export type JobsGetContactsEnrichJobResponse = z.infer<
	typeof GetContactsEnrichJobResponseSchema
>;

// ── registry ──────────────────────────────────────────────────────────────

export const LushaEndpointInputSchemas = {
	personSearchContacts: SearchContactsInputSchema,
	personEnrichContacts: EnrichContactsInputSchema,
	personSearchAndEnrichContacts: SearchAndEnrichContactsInputSchema,
	companySearchCompanies: SearchCompaniesInputSchema,
	companyEnrichCompanies: EnrichCompaniesInputSchema,
	companySearchAndEnrichCompanies: SearchAndEnrichCompaniesInputSchema,
	accountGetAccountUsage: GetAccountUsageInputSchema,
	jobsGetContactsEnrichJob: GetContactsEnrichJobInputSchema,
} as const;

export const LushaEndpointOutputSchemas = {
	personSearchContacts: SearchContactsResponseSchema,
	personEnrichContacts: EnrichContactsResponseSchema,
	personSearchAndEnrichContacts: SearchAndEnrichContactsResponseSchema,
	companySearchCompanies: SearchCompaniesResponseSchema,
	companyEnrichCompanies: EnrichCompaniesResponseSchema,
	companySearchAndEnrichCompanies: SearchAndEnrichCompaniesResponseSchema,
	accountGetAccountUsage: GetAccountUsageResponseSchema,
	jobsGetContactsEnrichJob: GetContactsEnrichJobResponseSchema,
} as const;

export type LushaEndpointInputs = {
	[K in keyof typeof LushaEndpointInputSchemas]: z.input<
		(typeof LushaEndpointInputSchemas)[K]
	>;
};

export type LushaEndpointOutputs = {
	[K in keyof typeof LushaEndpointOutputSchemas]: z.infer<
		(typeof LushaEndpointOutputSchemas)[K]
	>;
};
