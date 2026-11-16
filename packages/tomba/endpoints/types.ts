import { z } from 'zod';

/**
 * A person's record, as the finder, verifier and enrichment routes return it.
 *
 * The response types every field with `| null` rather than omitting it, which is
 * why they are `.nullish()` here: Tomba has been observed to leave a field out
 * of `data` when it was never looked up, and the docs show `null`.
 */
const VerificationSchema = z
	.object({
		date: z.string().nullish(),
		status: z
			.string()
			.nullish()
			.describe('valid, invalid, accept_all or unknown'),
	})
	.loose();

const PhoneDataSchema = z
	.object({
		carrier: z.string().nullish(),
		country_code: z.string().nullish(),
		e164_format: z.string().nullish(),
		intl_format: z.string().nullish(),
		local_format: z.string().nullish(),
		line_type: z.string().nullish(),
	})
	.loose();

const SourceSchema = z
	.object({
		uri: z.string().nullish(),
		website_url: z.string().nullish(),
		extracted_on: z.string().nullish(),
		last_seen_on: z.string().nullish(),
		still_on_page: z.boolean().nullish(),
	})
	.loose();

const PersonSchema = z
	.object({
		email: z.string().nullish().describe('null when no address was found'),
		first_name: z.string().nullish(),
		last_name: z.string().nullish(),
		full_name: z.string().nullish(),
		company: z.string().nullish(),
		position: z.string().nullish(),
		department: z.string().nullish(),
		country: z.string().nullish(),
		gender: z.string().nullish(),
		linkedin: z.string().nullish(),
		twitter: z.string().nullish(),
		website_url: z.string().nullish(),
		pattern: z
			.string()
			.nullish()
			.describe('Address format, such as {first}.{last}'),
		score: z.number().nullish().describe('Confidence from 0 to 100'),
		accept_all: z.boolean().nullish(),
		phone_number: z.boolean().nullish(),
		type: z.string().nullish().describe('personal, generic, or null'),
		verification: VerificationSchema.nullish(),
		sources: z.array(SourceSchema).nullish(),
		phone_data: z.array(PhoneDataSchema).nullish(),
	})
	.loose();
export type PersonOutput = z.output<typeof PersonSchema>;

/** Tomba wraps lookup answers in `data` and adds a paging block when it pages. */
const DataEnvelope = <T extends z.ZodType>(data: T) =>
	z.object({ data }).loose();

const PagedEnvelope = <T extends z.ZodType>(data: T) =>
	z
		.object({
			data,
			meta: z
				.object({
					total: z.number().nullish(),
					pageSize: z.number().nullish(),
					current: z.number().nullish(),
					total_pages: z.number().nullish(),
				})
				.loose()
				.nullish(),
		})
		.loose();

const AccountSchema = z
	.object({
		first_name: z.string().nullish(),
		last_name: z.string().nullish(),
		email: z.string().nullish(),
		country: z.string().nullish(),
		confirmed: z.boolean().nullish(),
		blocked: z.boolean().nullish(),
		deleted: z.boolean().nullish(),
		created_at: z.string().nullish(),
		expired: z.string().nullish().describe('End of the current usage window'),
		expired_subscription: z.string().nullish(),
		requests: z
			.object({
				domains: z
					.object({ available: z.number(), used: z.number() })
					.loose()
					.nullish(),
				verifications: z
					.object({ available: z.number(), used: z.number() })
					.loose()
					.nullish(),
				count: z
					.object({ available: z.number(), used: z.number() })
					.loose()
					.nullish(),
			})
			.loose()
			.nullish(),
		credits: z
			.record(
				z.string(),
				z
					.object({
						plan: z.number().nullish(),
						used: z.number().nullish(),
						packs: z.number().nullish(),
						remaining: z.number().nullish(),
					})
					.loose(),
			)
			.nullish()
			.describe(
				'Search and verification credits: plan, used, packs, remaining',
			),
	})
	.loose();
export type AccountOutput = z.output<typeof AccountSchema>;

// unknown: Tomba sends some counts and years as numbers on one route and as
// strings on another.
const NumberOrString = z.union([z.number(), z.string()]);

const HandleSchema = z
	.object({ handle: z.string().nullish() })
	.loose()
	.nullish();

/** The organization block of a domain search. */
const OrganizationSchema = z
	.object({
		website_url: z.string().nullish(),
		organization: z.string().nullish(),
		location: z
			.object({
				country: z.string().nullish(),
				city: z.string().nullish(),
				state: z.string().nullish(),
				street_address: z.string().nullish(),
				postal_code: z.string().nullish(),
			})
			.loose()
			.nullish(),
		social_links: z.record(z.string(), z.string().nullish()).nullish(),
		disposable: z.boolean().nullish(),
		webmail: z.boolean().nullish(),
		phone_number: z.boolean().nullish(),
		industries: z.string().nullish(),
		founded: NumberOrString.nullish(),
		company_size: z.string().nullish(),
		company_type: z.string().nullish(),
		revenue: NumberOrString.nullish(),
		accept_all: z.boolean().nullish(),
		description: z.string().nullish(),
		pattern: z.string().nullish(),
		total_similar: z.number().nullish(),
		keywords: z.array(z.string()).nullish(),
		last_updated: z.string().nullish(),
	})
	.loose();

/** A company profile from `companies/find` and `combined/find`. */
const CompanySchema = z
	.object({
		name: z.string().nullish(),
		legalName: z.string().nullish(),
		domain: z.string().nullish(),
		domainAliases: z.array(z.string()).nullish(),
		site: z
			.object({
				phoneNumbers: z.array(z.string()).nullish(),
				emailAddresses: z.array(z.string()).nullish(),
			})
			.loose()
			.nullish(),
		category: z
			.object({
				sector: z.string().nullish(),
				industryGroup: z.string().nullish(),
				industry: z.string().nullish(),
				subIndustry: z.string().nullish(),
				sicCode: z.string().nullish(),
				naicsCode: z.string().nullish(),
			})
			.loose()
			.nullish(),
		tags: z.array(z.string()).nullish(),
		description: z.string().nullish(),
		foundedYear: NumberOrString.nullish(),
		location: z.string().nullish(),
		geo: z
			.object({
				city: z.string().nullish(),
				state: z.string().nullish(),
				country: z.string().nullish(),
				countryCode: z.string().nullish(),
			})
			.loose()
			.nullish(),
		logo: z.string().nullish(),
		facebook: HandleSchema,
		linkedin: HandleSchema,
		twitter: HandleSchema,
		type: z.string().nullish(),
		metrics: z
			.object({
				employees: NumberOrString.nullish(),
				annualRevenue: NumberOrString.nullish(),
				estimatedAnnualRevenue: NumberOrString.nullish(),
			})
			.loose()
			.nullish(),
		tech: z.array(z.string()).nullish(),
	})
	.loose();
export type CompanyOutput = z.output<typeof CompanySchema>;

/** A person profile from `people/find` and `combined/find`. */
const PersonProfileSchema = z
	.object({
		name: z
			.object({
				fullName: z.string().nullish(),
				givenName: z.string().nullish(),
				familyName: z.string().nullish(),
			})
			.loose()
			.nullish(),
		email: z.string().nullish(),
		location: z.string().nullish(),
		gender: z.string().nullish(),
		geo: z
			.object({
				city: z.string().nullish(),
				state: z.string().nullish(),
				country: z.string().nullish(),
				countryCode: z.string().nullish(),
			})
			.loose()
			.nullish(),
		bio: z.string().nullish(),
		site: z.string().nullish(),
		avatar: z.string().nullish(),
		employment: z
			.object({
				domain: z.string().nullish(),
				name: z.string().nullish(),
				title: z.string().nullish(),
				role: z.string().nullish(),
				subRole: z.string().nullish(),
				seniority: z.string().nullish(),
			})
			.loose()
			.nullish(),
		facebook: HandleSchema,
		github: HandleSchema,
		twitter: HandleSchema,
		linkedin: HandleSchema,
		verification: VerificationSchema.nullish(),
		phone: z.boolean().nullish(),
	})
	.loose();
export type PersonProfileOutput = z.output<typeof PersonProfileSchema>;

/** A company in a `reveal/search` page. */
const RevealCompanySchema = z
	.object({
		name: z.string().nullish(),
		description: z.string().nullish(),
		website_url: z.string().nullish(),
		industry: z.string().nullish(),
		company_size: z.string().nullish(),
		type: z.string().nullish(),
		founded: NumberOrString.nullish(),
		country: z.string().nullish(),
		state: z.string().nullish(),
		city: z.string().nullish(),
		street_address: z.string().nullish(),
		postal_code: z.string().nullish(),
		revenue: NumberOrString.nullish(),
		total_emails: z.number().nullish(),
		total_similar: z.number().nullish(),
		phone_number: z.boolean().nullish(),
		linkedin_url: z.string().nullish(),
		facebook_url: z.string().nullish(),
		twitter_url: z.string().nullish(),
	})
	.loose();

const EmailCountSchema = z
	.object({
		website_id: z.number().nullish(),
		total: z.number().nullish(),
		personal_emails: z.number().nullish(),
		generic_emails: z.number().nullish(),
		department: z.record(z.string(), z.number()).nullish(),
		seniority: z.record(z.string(), z.number()).nullish(),
	})
	.loose();

const EmailFormatSchema = z
	.object({
		format: z.string().nullish().describe('Such as {first}.{last}'),
		percentage: z.number().nullish(),
	})
	.loose();

const LocationSchema = z
	.object({
		name: z.string().nullish().describe('Two-letter country code'),
		total: z.number().nullish(),
	})
	.loose();

const TechnologySchema = z
	.object({
		slug: z.string().nullish(),
		name: z.string().nullish(),
		icon: z.string().nullish(),
		website: z.string().nullish(),
		description: z.string().nullish(),
		categories: z
			.array(
				z
					.object({
						id: NumberOrString.nullish(),
						slug: z.string().nullish(),
						name: z.string().nullish(),
					})
					.loose(),
			)
			.nullish(),
	})
	.loose();

const SimilarSchema = z
	.object({
		website_url: z.string().nullish(),
		name: z.string().nullish(),
		industries: z.string().nullish(),
	})
	.loose();

const DomainStatusSchema = z
	.object({
		domain: z.string().nullish(),
		webmail: z.boolean().nullish(),
		disposable: z.boolean().nullish(),
	})
	.loose();

const SuggestionSchema = z
	.object({
		name: z.string().nullish(),
		domain: z.string().nullish(),
		email_count: z.number().nullish(),
	})
	.loose();

const PhoneValidationSchema = z
	.object({
		email: z.string().nullish(),
		domain: z.string().nullish(),
		valid: z.boolean().nullish(),
		local_format: z.string().nullish(),
		intl_format: z.string().nullish(),
		e164_format: z.string().nullish(),
		rfc3966_format: z.string().nullish(),
		country_code: z.string().nullish(),
		line_type: z.string().nullish(),
		carrier: z.string().nullish(),
		region: z
			.object({ name: z.string().nullish(), code: z.string().nullish() })
			.loose()
			.nullish(),
		timezones: z.array(z.string()).nullish(),
	})
	.loose();
export type PhoneValidationOutput = z.output<typeof PhoneValidationSchema>;

const RateLimitsSchema = z
	.object({
		data: z
			.record(
				z.string(),
				z
					.object({
						limits: z
							.object({
								rps: z.number().nullish(),
								rpm: z.number().nullish(),
								daily: z.number().nullish(),
							})
							.loose()
							.nullish(),
						usage: z
							.object({
								rpm_used: z.number().nullish(),
								daily_used: z.number().nullish(),
							})
							.loose()
							.nullish(),
					})
					.loose(),
			)
			.nullish()
			.describe('Limits and usage keyed by route, such as email-finder'),
	})
	.loose();

/** Shared query fields. */
const EnrichMobile = z
	.boolean()
	.optional()
	.describe('Also return phone numbers; costs extra search credits');

const WebhookUrl = z
	.string()
	.optional()
	.describe('Also POST the result to this URL when the lookup finishes');

// ---------------------------------------------------------------------------
// account
// ---------------------------------------------------------------------------

const GetAccountInputSchema = z.object({});
export type GetAccountInput = z.input<typeof GetAccountInputSchema>;

const GetAccountOutputSchema = DataEnvelope(AccountSchema);
export type GetAccountOutput = z.output<typeof GetAccountOutputSchema>;

const RateLimitsInputSchema = z.object({});
export type RateLimitsInput = z.input<typeof RateLimitsInputSchema>;

const RateLimitsOutputSchema = RateLimitsSchema;

// ---------------------------------------------------------------------------
// finder
// ---------------------------------------------------------------------------

const DomainSearchInputSchema = z.object({
	domain: z.string().min(1).describe('Company domain, such as stripe.com'),
	page: z.number().int().min(1).optional().describe('Default 1'),
	limit: z
		.number()
		.int()
		.min(1)
		.optional()
		.describe('Addresses per page; the credit cost follows this value'),
	department: z
		.string()
		.optional()
		.describe('Only this department, such as engineering'),
	country: z.string().optional().describe('Two-letter country code'),
	enrich_mobile: EnrichMobile,
	webhook_url: WebhookUrl,
});
export type DomainSearchInput = z.input<typeof DomainSearchInputSchema>;

const DomainSearchOutputSchema = PagedEnvelope(
	z
		.object({
			organization: OrganizationSchema.nullish(),
			emails: z.array(PersonSchema),
		})
		.loose(),
);
export type DomainSearchOutput = z.output<typeof DomainSearchOutputSchema>;

const EmailFinderInputSchema = z
	.object({
		domain: z.string().optional().describe('Company domain, or use `company`'),
		company: z
			.string()
			.optional()
			.describe('Company name, when the domain is unknown'),
		first_name: z.string().optional(),
		last_name: z.string().optional(),
		full_name: z
			.string()
			.optional()
			.describe('Used when first and last are absent'),
		enrich_mobile: EnrichMobile,
		webhook_url: WebhookUrl,
	})
	.superRefine((value, ctx) => {
		// The reference requires a domain or a company name, and a way to name the
		// person.
		if (value.domain === undefined && value.company === undefined) {
			ctx.addIssue({
				code: 'custom',
				message: 'Pass either `domain` or `company`',
				path: ['domain'],
			});
		}
		if (value.full_name === undefined && value.first_name === undefined) {
			ctx.addIssue({
				code: 'custom',
				message: 'Pass either `full_name`, or `first_name`',
				path: ['first_name'],
			});
		}
	});
export type EmailFinderInput = z.input<typeof EmailFinderInputSchema>;

const EmailFinderOutputSchema = DataEnvelope(PersonSchema);
export type EmailFinderOutput = z.output<typeof EmailFinderOutputSchema>;

const LinkedinFinderInputSchema = z.object({
	url: z.string().min(1).describe('The LinkedIn profile URL'),
	enrich_mobile: EnrichMobile,
	full: z
		.boolean()
		.optional()
		.describe('Return the full record instead of the minimal one'),
	webhook_url: WebhookUrl,
});
export type LinkedinFinderInput = z.input<typeof LinkedinFinderInputSchema>;

// With `full`, every stored address comes back as an array.
const LinkedinFinderOutputSchema = DataEnvelope(
	z.union([PersonSchema, z.array(PersonSchema)]),
);

const AuthorFinderInputSchema = z.object({
	url: z.string().min(1).describe('URL of the article'),
	webhook_url: WebhookUrl,
});
export type AuthorFinderInput = z.input<typeof AuthorFinderInputSchema>;

const AuthorFinderOutputSchema = DataEnvelope(PersonSchema);

const EmailEnrichmentInputSchema = z.object({
	email: z.email(),
	enrich_mobile: EnrichMobile,
	webhook_url: WebhookUrl,
});
export type EmailEnrichmentInput = z.input<typeof EmailEnrichmentInputSchema>;

const EmailEnrichmentOutputSchema = DataEnvelope(PersonSchema);

const PhoneFinderInputSchema = z
	.object({
		email: z.email().optional(),
		domain: z.string().optional(),
		linkedin: z.string().optional(),
		full: z.boolean().optional(),
		webhook_url: WebhookUrl,
	})
	.superRefine((value, ctx) => {
		// One of the three identifies the person.
		if (
			value.email === undefined &&
			value.domain === undefined &&
			value.linkedin === undefined
		) {
			ctx.addIssue({
				code: 'custom',
				message: 'Pass one of `email`, `domain` or `linkedin`',
				path: ['email'],
			});
		}
	});
export type PhoneFinderInput = z.input<typeof PhoneFinderInputSchema>;

// One number as an object, every number as an array with `full`, and an empty
// array when nothing was found.
const PhoneFinderOutputSchema = DataEnvelope(
	z.union([PhoneValidationSchema, z.array(PhoneValidationSchema)]),
);

// ---------------------------------------------------------------------------
// verifier
// ---------------------------------------------------------------------------

const EmailVerifierInputSchema = z.object({
	email: z.email(),
	enrich_mobile: EnrichMobile,
	webhook_url: WebhookUrl,
});
export type EmailVerifierInput = z.input<typeof EmailVerifierInputSchema>;

const EmailVerifierOutputSchema = DataEnvelope(
	z
		.object({
			email: z
				.object({
					email: z.string().nullish(),
					status: z
						.string()
						.nullish()
						.describe('valid, invalid, accept_all, disposable or unknown'),
					result: z
						.string()
						.nullish()
						.describe('deliverable, undeliverable, risky, or empty'),
					score: z.number().nullish(),
					regex: z.boolean().nullish(),
					gibberish: z.boolean().nullish(),
					disposable: z.boolean().nullish(),
					accept_all: z.boolean().nullish(),
					block: z.boolean().nullish(),
					greylisted: z.boolean().nullish(),
					mx_check: z.boolean().nullish(),
					smtp_check: z.boolean().nullish(),
					smtp_server: z.boolean().nullish(),
					smtp_provider: z.string().nullish(),
					mx: z
						.object({ records: z.array(z.string()).nullish() })
						.loose()
						.nullish(),
					phone_number: z.boolean().nullish(),
				})
				.loose(),
		})
		.loose(),
);
export type EmailVerifierOutput = z.output<typeof EmailVerifierOutputSchema>;

const PhoneValidatorInputSchema = z.object({
	phone: z
		.string()
		.min(1)
		.describe('Number to validate, ideally in E.164 form'),
	country_code: z
		.string()
		.optional()
		.describe('Two-letter code, used when the number has no country prefix'),
});
export type PhoneValidatorInput = z.input<typeof PhoneValidatorInputSchema>;

// A number that is not valid answers 200 with an empty `data` array.
const PhoneValidatorOutputSchema = DataEnvelope(
	z.union([PhoneValidationSchema, z.array(PhoneValidationSchema)]),
);
export type PhoneValidatorOutput = z.output<typeof PhoneValidatorOutputSchema>;

// ---------------------------------------------------------------------------
// company
// ---------------------------------------------------------------------------

const CompanyFindInputSchema = z.object({
	domain: z.string().min(1),
});
export type CompanyFindInput = z.input<typeof CompanyFindInputSchema>;

const CompanyFindOutputSchema = DataEnvelope(CompanySchema);
export type CompanyFindOutput = z.output<typeof CompanyFindOutputSchema>;

const PersonFindInputSchema = z.object({
	email: z.email(),
});
export type PersonFindInput = z.input<typeof PersonFindInputSchema>;

const PersonFindOutputSchema = DataEnvelope(PersonProfileSchema);
export type PersonFindOutput = z.output<typeof PersonFindOutputSchema>;

const CombinedFindInputSchema = z.object({
	email: z.email(),
});
export type CombinedFindInput = z.input<typeof CombinedFindInputSchema>;

const CombinedFindOutputSchema = DataEnvelope(
	z
		.object({
			person: PersonProfileSchema.nullish(),
			company: CompanySchema.nullish(),
		})
		.loose(),
);

// ---------------------------------------------------------------------------
// domain data
// ---------------------------------------------------------------------------

const EmailCountInputSchema = z.object({
	domain: z.string().min(1),
	type: z
		.enum(['all', 'personal', 'generic'])
		.optional()
		.describe('Count only one address type; default all'),
});
export type EmailCountInput = z.input<typeof EmailCountInputSchema>;

const EmailCountOutputSchema = DataEnvelope(EmailCountSchema);
export type EmailCountOutput = z.output<typeof EmailCountOutputSchema>;

const EmailFormatInputSchema = z.object({ domain: z.string().min(1) });
export type EmailFormatInput = z.input<typeof EmailFormatInputSchema>;

const EmailFormatOutputSchema = DataEnvelope(z.array(EmailFormatSchema));

const LocationInputSchema = z.object({ domain: z.string().min(1) });
export type LocationInput = z.input<typeof LocationInputSchema>;

const LocationOutputSchema = DataEnvelope(z.array(LocationSchema));

const TechnologyInputSchema = z.object({ domain: z.string().min(1) });
export type TechnologyInput = z.input<typeof TechnologyInputSchema>;

const TechnologyOutputSchema = z
	.object({
		domain: z.string().nullish(),
		data: z
			.array(TechnologySchema)
			.nullish()
			.describe('null when Tomba has no technology data for the domain'),
	})
	.loose();

const SimilarInputSchema = z.object({
	domain: z.string().min(1),
	page: z.number().int().min(1).optional().describe('Default 1'),
	limit: z
		.union([
			z.literal(10),
			z.literal(20),
			z.literal(50),
			z.literal(100),
			z.literal(150),
			z.literal(200),
			z.literal(250),
		])
		.optional()
		.describe('Companies per page, default 10; 1 search credit per 10'),
});
export type SimilarInput = z.input<typeof SimilarInputSchema>;

const SimilarOutputSchema = PagedEnvelope(z.array(SimilarSchema));

const DomainStatusInputSchema = z.object({ domain: z.string().min(1) });
export type DomainStatusInput = z.input<typeof DomainStatusInputSchema>;

// The only route that is not wrapped in `data`.
const DomainStatusOutputSchema = DomainStatusSchema;

const DomainSuggestionsInputSchema = z.object({
	query: z
		.string()
		.min(1)
		.describe('Company name or domain to match, such as stripe'),
});
export type DomainSuggestionsInput = z.input<
	typeof DomainSuggestionsInputSchema
>;

const DomainSuggestionsOutputSchema = DataEnvelope(z.array(SuggestionSchema));
export type DomainSuggestionsOutput = z.output<
	typeof DomainSuggestionsOutputSchema
>;

const EmailSourcesInputSchema = z.object({
	email: z.email().describe('The address whose sources to list'),
});
export type EmailSourcesInput = z.input<typeof EmailSourcesInputSchema>;

const EmailSourcesOutputSchema = z
	.object({
		data: z
			.array(SourceSchema)
			.describe('Up to 20 pages; empty, with HTTP 201, when there are none'),
		email: z.string().nullish(),
	})
	.loose();

// ---------------------------------------------------------------------------
// company search
// ---------------------------------------------------------------------------

/**
 * One filter is a pair of include and exclude value lists. Most values are
 * matched against Tomba's company data rather than a fixed list, so they are
 * free strings.
 */
const FilterPairSchema = z
	.object({
		include: z.array(z.string()).nullish(),
		exclude: z.array(z.string()).nullish(),
	})
	.loose();

const SearchCompaniesInputSchema = z
	.object({
		query: z
			.string()
			.optional()
			.describe(
				'Plain-language query; filters are generated from it and any `filters` sent are ignored',
			),
		filters: z
			.record(
				z.string(),
				z.union([FilterPairSchema, z.string(), z.array(z.string())]),
			)
			.optional()
			.describe(
				'Structured filters, keyed by field such as industry or location_city',
			),
		page: z.number().int().min(1).optional().describe('50 companies per page'),
	})
	.superRefine((value, ctx) => {
		// One of the two has to identify what to search for.
		if (value.query === undefined && value.filters === undefined) {
			ctx.addIssue({
				code: 'custom',
				message: 'Pass either `query` or `filters`',
				path: ['query'],
			});
		}
	});
export type SearchCompaniesInput = z.input<typeof SearchCompaniesInputSchema>;

const SearchCompaniesOutputSchema = z
	.object({
		success: z.boolean().nullish(),
		data: z.object({ companies: z.array(RevealCompanySchema) }).loose(),
		meta: z
			.object({
				total: z.number().nullish(),
				page: z.number().nullish(),
				limit: z.number().nullish(),
				pages: z.number().nullish(),
				// unknown: the filters Tomba generated from the query, by field.
				filters: z.record(z.string(), z.unknown()).nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();
export type SearchCompaniesOutput = z.output<
	typeof SearchCompaniesOutputSchema
>;

export type TombaEndpointInputs = {
	getAccount: GetAccountInput;
	rateLimits: RateLimitsInput;
	domainSearch: DomainSearchInput;
	emailFinder: EmailFinderInput;
	linkedinFinder: LinkedinFinderInput;
	authorFinder: AuthorFinderInput;
	emailEnrichment: EmailEnrichmentInput;
	phoneFinder: PhoneFinderInput;
	emailVerifier: EmailVerifierInput;
	phoneValidator: PhoneValidatorInput;
	companyFind: CompanyFindInput;
	personFind: PersonFindInput;
	combinedFind: CombinedFindInput;
	emailCount: EmailCountInput;
	emailFormat: EmailFormatInput;
	location: LocationInput;
	technology: TechnologyInput;
	similar: SimilarInput;
	domainStatus: DomainStatusInput;
	domainSuggestions: DomainSuggestionsInput;
	emailSources: EmailSourcesInput;
	searchCompanies: SearchCompaniesInput;
};

export type TombaEndpointOutputs = {
	getAccount: GetAccountOutput;
	rateLimits: z.output<typeof RateLimitsSchema>;
	domainSearch: DomainSearchOutput;
	emailFinder: EmailFinderOutput;
	linkedinFinder: z.output<typeof LinkedinFinderOutputSchema>;
	authorFinder: z.output<typeof AuthorFinderOutputSchema>;
	emailEnrichment: z.output<typeof EmailEnrichmentOutputSchema>;
	phoneFinder: z.output<typeof PhoneFinderOutputSchema>;
	emailVerifier: EmailVerifierOutput;
	phoneValidator: PhoneValidatorOutput;
	companyFind: CompanyFindOutput;
	personFind: PersonFindOutput;
	combinedFind: z.output<typeof CombinedFindOutputSchema>;
	emailCount: EmailCountOutput;
	emailFormat: z.output<typeof EmailFormatOutputSchema>;
	location: z.output<typeof LocationOutputSchema>;
	technology: z.output<typeof TechnologyOutputSchema>;
	similar: z.output<typeof SimilarOutputSchema>;
	domainStatus: z.output<typeof DomainStatusOutputSchema>;
	domainSuggestions: DomainSuggestionsOutput;
	emailSources: z.output<typeof EmailSourcesOutputSchema>;
	searchCompanies: SearchCompaniesOutput;
};

export const TombaEndpointInputSchemas = {
	getAccount: GetAccountInputSchema,
	rateLimits: RateLimitsInputSchema,
	domainSearch: DomainSearchInputSchema,
	emailFinder: EmailFinderInputSchema,
	linkedinFinder: LinkedinFinderInputSchema,
	authorFinder: AuthorFinderInputSchema,
	emailEnrichment: EmailEnrichmentInputSchema,
	phoneFinder: PhoneFinderInputSchema,
	emailVerifier: EmailVerifierInputSchema,
	phoneValidator: PhoneValidatorInputSchema,
	companyFind: CompanyFindInputSchema,
	personFind: PersonFindInputSchema,
	combinedFind: CombinedFindInputSchema,
	emailCount: EmailCountInputSchema,
	emailFormat: EmailFormatInputSchema,
	location: LocationInputSchema,
	technology: TechnologyInputSchema,
	similar: SimilarInputSchema,
	domainStatus: DomainStatusInputSchema,
	domainSuggestions: DomainSuggestionsInputSchema,
	emailSources: EmailSourcesInputSchema,
	searchCompanies: SearchCompaniesInputSchema,
} as const;

export const TombaEndpointOutputSchemas = {
	getAccount: GetAccountOutputSchema,
	rateLimits: RateLimitsSchema,
	domainSearch: DomainSearchOutputSchema,
	emailFinder: EmailFinderOutputSchema,
	linkedinFinder: LinkedinFinderOutputSchema,
	authorFinder: AuthorFinderOutputSchema,
	emailEnrichment: EmailEnrichmentOutputSchema,
	phoneFinder: PhoneFinderOutputSchema,
	emailVerifier: EmailVerifierOutputSchema,
	phoneValidator: PhoneValidatorOutputSchema,
	companyFind: CompanyFindOutputSchema,
	personFind: PersonFindOutputSchema,
	combinedFind: CombinedFindOutputSchema,
	emailCount: EmailCountOutputSchema,
	emailFormat: EmailFormatOutputSchema,
	location: LocationOutputSchema,
	technology: TechnologyOutputSchema,
	similar: SimilarOutputSchema,
	domainStatus: DomainStatusOutputSchema,
	domainSuggestions: DomainSuggestionsOutputSchema,
	emailSources: EmailSourcesOutputSchema,
	searchCompanies: SearchCompaniesOutputSchema,
} as const;
