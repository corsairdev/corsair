import { z } from 'zod';

// Inputs use RocketReach's own parameter names. Outputs are `.loose()` and their
// schema-optional fields nullish, so a field RocketReach adds or omits cannot
// fail a call that has already happened. The shapes come from the OpenAPI
// fragments embedded in each page at https://docs.rocketreach.co.
//
// The one exception is the universal account: it returns `api_key`, the caller's
// own credential, which the client strips before the schema ever sees it.

const NonBlankStringSchema = z
	.string()
	.min(1)
	.refine((value) => value.trim().length > 0, 'Must not be blank');

const IdSchema = z.union([z.number().int(), NonBlankStringSchema]);

/**
 * A JSON value. Used where a field's shape belongs to the data rather than the
 * API - social links, a credit-usage map, NPI data - so it is described as JSON
 * rather than as `unknown`, which would reach the docs as `any`.
 */
export type RocketReachJsonValue =
	| string
	| number
	| boolean
	| null
	| RocketReachJsonValue[]
	| { [key: string]: RocketReachJsonValue };

const JsonValueSchema: z.ZodType<RocketReachJsonValue> = z.lazy(() =>
	z.union([
		z.string(),
		z.number(),
		z.boolean(),
		z.null(),
		z.array(JsonValueSchema),
		z.record(z.string(), JsonValueSchema),
	]),
);

const JsonObjectSchema = z.record(z.string(), JsonValueSchema);

// ── shared ────────────────────────────────────────────────────────────────

const LinkMapSchema = JsonObjectSchema.describe(
	'Social links keyed by network.',
);

const EmailSchema = z
	.object({
		email: z.string().nullish(),
		smtp_valid: z
			.string()
			.nullish()
			.describe('valid, invalid, accept-all or unknown.'),
		type: z
			.string()
			.nullish()
			.describe('personal, professional, disposable or another kind.'),
		last_validation_check: z.string().nullish(),
		grade: z.string().nullish().describe('A confidence grade, best at A.'),
	})
	.loose();

export type RocketReachEmail = z.infer<typeof EmailSchema>;

const PhoneSchema = z
	.object({
		number: z
			.string()
			.nullish()
			.describe('The number in international format.'),
		e164: z.string().nullish(),
		country_code: z.string().nullish(),
		extension: z.string().nullish(),
		type: z.string().nullish().describe('mobile, direct dial or other.'),
		grade: z.string().nullish().describe('A is the best grade.'),
		recommended: z.boolean().nullish(),
	})
	.loose();

const JobHistorySchema = z
	.object({
		start_date: z.string().nullish(),
		end_date: z
			.string()
			.nullish()
			.describe('Absent while the role is current.'),
		company: z.string().nullish(),
		company_name: z.string().nullish(),
		company_id: z.number().nullish(),
		company_linkedin_url: z.string().nullish(),
		company_city: z.string().nullish(),
		company_region: z.string().nullish(),
		company_country_code: z.string().nullish(),
		department: z.string().nullish(),
		title: z.string().nullish(),
		highest_level: z.string().nullish(),
		description: z.string().nullish(),
		last_updated: z.string().nullish(),
		sub_department: z.string().nullish(),
		is_current: z.boolean().nullish(),
	})
	.loose();

const EducationSchema = z
	.object({
		major: z.string().nullish(),
		school: z.string().nullish(),
		degree: z.string().nullish(),
		start: z.number().nullish(),
		end: z.number().nullish(),
	})
	.loose();

const ProfileListSchema = z
	.object({
		id: z.number().nullish(),
		name: z.string().nullish(),
	})
	.loose();

/**
 * A profile as the lookup routes return it.
 *
 * `status` is the field that matters: anything other than `complete` means the
 * lookup is still running, and the contact fields are not final. `complete` is
 * the normal case for a cached profile.
 */
export const ProfileSchema = z
	.object({
		id: z.number().nullish().describe('The RocketReach profile ID.'),
		status: z
			.string()
			.nullish()
			.describe(
				'complete, progress, searching or not queued. Anything but complete means the answer is not final yet; poll person.checkStatus.',
			),
		profile_list: ProfileListSchema.nullish(),
		name: z.string().nullish(),
		linkedin_url: z.string().nullish(),
		connections: z.number().nullish(),
		links: LinkMapSchema.nullish(),
		location: z.string().nullish(),
		city: z.string().nullish(),
		region: z.string().nullish(),
		country: z.string().nullish(),
		country_code: z.string().nullish(),
		birth_year: z.number().nullish(),
		current_title: z.string().nullish(),
		current_employer: z.string().nullish(),
		current_employer_id: z.number().nullish(),
		current_employer_domain: z.string().nullish(),
		current_employer_website: z.string().nullish(),
		current_employer_linkedin_url: z.string().nullish(),
		current_employer_industry: z.string().nullish(),
		current_employer_phone: PhoneSchema.nullish(),
		job_history: z.array(JobHistorySchema).nullish(),
		education: z.array(EducationSchema).nullish(),
		skills: z.array(z.string()).nullish(),
		npi_data: JsonObjectSchema.nullish().describe(
			'Present for a US healthcare professional.',
		),
		tags: z.string().nullish(),
		return_cached_emails: z
			.boolean()
			.nullish()
			.describe(
				'True when cached emails were included in this synchronous answer.',
			),
		linkedin_url_active: z.boolean().nullish(),
		recommended_email: z.string().nullish(),
		recommended_personal_email: z.string().nullish(),
		recommended_professional_email: z.string().nullish(),
		current_work_email: z.string().nullish(),
		current_personal_email: z.string().nullish(),
		emails: z.array(EmailSchema).nullish(),
		phones: z.array(PhoneSchema).nullish(),
		metadata: JsonObjectSchema.nullish(),
	})
	.loose();

export type RocketReachProfile = z.infer<typeof ProfileSchema>;

/** A row from a search. It has no contact details, only the summary. */
const ProfileSearchRowSchema = z
	.object({
		id: z.number().nullish(),
		status: z.string().nullish(),
		name: z.string().nullish(),
		linkedin_url: z.string().nullish(),
		connections: z.number().nullish(),
		links: LinkMapSchema.nullish(),
		location: z.string().nullish(),
		city: z.string().nullish(),
		region: z.string().nullish(),
		country: z.string().nullish(),
		country_code: z.string().nullish(),
		birth_year: z.number().nullish(),
		current_title: z.string().nullish(),
		current_employer: z.string().nullish(),
		current_employer_id: z.number().nullish(),
		current_employer_domain: z.string().nullish(),
		current_employer_website: z.string().nullish(),
		current_employer_linkedin_url: z.string().nullish(),
		region_latitude: z.number().nullish(),
		region_longitude: z.number().nullish(),
		teaser: JsonObjectSchema.nullish().describe(
			'A preview of contact data. A lookup unlocks the rest.',
		),
		suppressed: z
			.string()
			.nullish()
			.describe('True when a suppression list blocks this profile.'),
		update_time: z.string().nullish(),
	})
	.loose();

export type RocketReachProfileSearchRow = z.infer<
	typeof ProfileSearchRowSchema
>;

// ── account.get ───────────────────────────────────────────────────────────

const AccountGetInputSchema = z.object({});

const CreditUsageSchema = z
	.object({
		credit_type: z.string().nullish(),
		allocated: z
			.union([z.number(), z.literal('inf')])
			.nullish()
			.describe('RocketReach sends the string "inf" on an unlimited plan.'),
		used: z.number().nullish(),
		remaining: z.union([z.number(), z.literal('inf')]).nullish(),
	})
	.loose();

const RateLimitSchema = z
	.object({
		action: z.string().nullish(),
		duration: z.string().nullish(),
		limit: z.number().nullish(),
		used: z.number().nullish(),
		remaining: z.number().nullish(),
	})
	.loose();

const AccountGetResponseSchema = z
	.object({
		id: z.number().nullish(),
		first_name: z.string().nullish(),
		last_name: z.string().nullish(),
		email: z.string().nullish(),
		state: z.string().nullish().describe('anonymous, test_user or registered.'),
		credit_usage: z.array(CreditUsageSchema).nullish(),
		rate_limits: z.array(RateLimitSchema).nullish(),
	})
	.loose();

export type AccountGetResponse = z.infer<typeof AccountGetResponseSchema>;

// ── account.universal ─────────────────────────────────────────────────────

const AccountUniversalInputSchema = z.object({});

const PlanSchema = z
	.object({
		id: z.number().nullish(),
		name: z.string().nullish(),
		lookup_limit: z.number().nullish(),
		export_limit: z.number().nullish(),
	})
	.loose();

/**
 * The account with universal credits.
 *
 * RocketReach returns the caller's own `api_key` in this body. The client strips
 * it, because echoing a live credential back into a caller's logs and stored
 * records is the one thing a read should never do.
 */
const AccountUniversalResponseSchema = z
	.object({
		id: z.number().nullish(),
		first_name: z.string().nullish(),
		last_name: z.string().nullish(),
		email: z.string().nullish(),
		state: z.string().nullish(),
		plan: PlanSchema.nullish(),
		api_key_domain: z.string().nullish(),
		daily_api_num_calls: z.number().nullish(),
		daily_api_limit: z
			.string()
			.nullish()
			.describe('A numeric string, as RocketReach sends it.'),
		credit_usage: JsonObjectSchema.nullish(),
		credit_usage_by_action: z.array(JsonObjectSchema).nullish(),
		rate_limits: z.array(RateLimitSchema).nullish(),
	})
	.loose();

export type AccountUniversalResponse = z.infer<
	typeof AccountUniversalResponseSchema
>;

// ── person.lookup ─────────────────────────────────────────────────────────

export const ROCKETREACH_LOOKUP_TYPES = [
	'standard',
	'premium',
	'premium (feeds disabled)',
	'bulk',
	'phone',
	'enrich',
] as const;

const LookupInputSchema = z.object({
	email: NonBlankStringSchema.optional().describe('An email address.'),
	id: IdSchema.optional().describe('A RocketReach profile ID.'),
	linkedin_url: NonBlankStringSchema.optional().describe(
		'Such as www.linkedin.com/in/jamesgullbrand.',
	),
	name: NonBlankStringSchema.optional().describe(
		'Requires current_employer as well.',
	),
	current_employer: NonBlankStringSchema.optional().describe(
		'Requires name as well.',
	),
	title: NonBlankStringSchema.optional(),
	phone: NonBlankStringSchema.optional().describe(
		'E.164 or international format.',
	),
	npi_number: z
		.union([z.number().int(), z.string().regex(/^\d+$/)])
		.optional()
		.describe('For a US healthcare professional.'),
	lookup_type: z
		.enum(ROCKETREACH_LOOKUP_TYPES)
		.optional()
		.describe('standard is the default.'),
	return_cached_emails: z
		.boolean()
		.optional()
		.describe(
			'Include cached emails in a progress answer. False nulls every email field until the lookup finishes.',
		),
	webhook_id: z
		.number()
		.int()
		.optional()
		.describe('Post the finished result to this webhook instead of polling.'),
});

function hasPersonIdentifier(
	input: z.infer<typeof LookupInputSchema>,
): boolean {
	return (
		input.email !== undefined ||
		input.id !== undefined ||
		input.linkedin_url !== undefined ||
		input.phone !== undefined ||
		input.npi_number !== undefined ||
		(input.name !== undefined && input.current_employer !== undefined)
	);
}

const personIdentifierMessage =
	'Provide email, id, linkedin_url, phone, npi_number, or name with current_employer';

const PersonLookupInputSchema = LookupInputSchema.refine(
	hasPersonIdentifier,
	personIdentifierMessage,
);

export type PersonLookupInput = z.infer<typeof PersonLookupInputSchema>;

const PersonLookupResponseSchema = ProfileSchema;

export type PersonLookupResponse = z.infer<typeof PersonLookupResponseSchema>;

const PersonBulkLookupInputSchema = z.object({
	queries: LookupInputSchema.omit({ webhook_id: true })
		.refine(hasPersonIdentifier, personIdentifierMessage)
		.array()
		.min(1)
		.max(100)
		.describe('Between 1 and 100 people.'),
	profile_list: z
		.string()
		.optional()
		.describe(
			'Add the looked-up profiles to this list. Defaults to API Bulk Lookup.',
		),
	webhook_id: z.number().int().optional(),
});

export type PersonBulkLookupInput = z.infer<typeof PersonBulkLookupInputSchema>;

/**
 * The bulk routes answer with a bare 200 and the request ID in the
 * `RR-Request-ID` header; there is no body to parse. The ID is what to pass to
 * `person.checkStatus`.
 */
const PersonBulkLookupResponseSchema = z
	.object({
		requestId: z
			.string()
			.nullish()
			.describe(
				'The RR-Request-ID header, to poll person.checkStatus or match a webhook delivery.',
			),
	})
	.loose();

export type PersonBulkLookupResponse = z.infer<
	typeof PersonBulkLookupResponseSchema
>;

const PersonCheckStatusInputSchema = z
	.object({
		ids: z
			.array(IdSchema)
			.min(1)
			.optional()
			.describe('The profile IDs to check.'),
		rr_request_id: NonBlankStringSchema.optional().describe(
			'The RR-Request-ID from a lookup or bulk lookup. Takes priority over ids.',
		),
	})
	.refine(
		(input) => input.ids !== undefined || input.rr_request_id !== undefined,
		'Provide ids or rr_request_id',
	);

export type PersonCheckStatusInput = z.infer<
	typeof PersonCheckStatusInputSchema
>;

const PersonCheckStatusResponseSchema = z.array(ProfileSchema);

export type PersonCheckStatusResponse = z.infer<
	typeof PersonCheckStatusResponseSchema
>;

// ── person.search ─────────────────────────────────────────────────────────

/**
 * The documented search filters, as a named subset. RocketReach accepts around
 * seventy; the ones here are the contact-prospecting fields, and any other
 * documented key is still sent because the object is `.loose()`.
 */
// unknown: loose query objects may include additional provider-defined filters.
function hasSearchFilter(query: Record<string, unknown>): boolean {
	return Object.values(query).some((value) =>
		typeof value === 'string'
			? value.trim().length > 0
			: Array.isArray(value) &&
				value.some(
					(item) => typeof item === 'string' && item.trim().length > 0,
				),
	);
}

const PersonQuerySchema = z
	.object({
		name: z.array(z.string()).optional().describe('Full names.'),
		current_title: z.array(z.string()).optional(),
		previous_title: z.array(z.string()).optional(),
		current_or_previous_title: z.array(z.string()).optional(),
		employer: z.array(z.string()).optional().describe('Current employers.'),
		previous_employer: z.array(z.string()).optional(),
		company_domain: z.array(z.string()).optional(),
		company_name: z.array(z.string()).optional(),
		company_industry: z.array(z.string()).optional(),
		company_size: z
			.array(z.string())
			.optional()
			.describe('Bands such as 51-200.'),
		company_revenue: z
			.array(z.string())
			.optional()
			.describe('Bands such as 10000000-50000000.'),
		company_publicly_traded: z.array(z.string()).optional(),
		company_naics_code: z.array(z.string()).optional(),
		company_sic_code: z.array(z.string()).optional(),
		department: z.array(z.string()).optional(),
		management_levels: z.array(z.string()).optional(),
		skills: z
			.array(z.string())
			.optional()
			.describe('Any of these skills (OR).'),
		all_skills: z
			.array(z.string())
			.optional()
			.describe('Every one of these skills (AND).'),
		geo: z
			.array(z.string())
			.optional()
			.describe('Geographies, in the documented format.'),
		country_code: z.array(z.string()).optional(),
		state: z
			.array(z.string())
			.optional()
			.describe('Deprecated in favour of geo.'),
		email: z.array(z.string()).optional(),
		email_grade: z
			.string()
			.optional()
			.describe('The minimum email confidence grade a profile must have.'),
		phone: z.array(z.string()).optional(),
		phone_grade: z
			.array(z.string())
			.optional()
			.describe('Allowed grades are A, A- and so on.'),
		contact_method: z
			.array(z.string())
			.optional()
			.describe('mobile, direct dial, office phone and so on.'),
		linkedin_url: z.array(z.string()).optional(),
		school: z.array(z.string()).optional(),
		degree: z.array(z.string()).optional(),
		major: z.array(z.string()).optional(),
		years_experience: z.array(z.string()).optional(),
		keyword: z.string().optional(),
		keywords: z.string().optional(),
		update_time: z
			.array(z.string())
			.optional()
			.describe('Only profiles updated since this date.'),
	})
	.loose()
	.refine(hasSearchFilter, 'Provide at least one non-empty search filter');

export type RocketReachPersonQuery = z.infer<typeof PersonQuerySchema>;

const PersonSearchInputSchema = z.object({
	query: PersonQuerySchema.describe('At least one filter.'),
	start: z
		.number()
		.int()
		.min(1)
		.max(10_000)
		.optional()
		.describe('1-based result to start at.'),
	page_size: z
		.number()
		.int()
		.min(1)
		.max(100)
		.optional()
		.describe('Defaults to 10, maximum 100.'),
	order_by: z
		.enum(['relevance', 'popularity', 'score'])
		.optional()
		.describe('Defaults to relevance.'),
});

export type PersonSearchInput = z.infer<typeof PersonSearchInputSchema>;

const PersonSearchResponseSchema = z.array(ProfileSearchRowSchema);

export type PersonSearchResponse = z.infer<typeof PersonSearchResponseSchema>;

// ── company.lookup ────────────────────────────────────────────────────────

const CompanyLookupInputSchema = z
	.object({
		domain: NonBlankStringSchema.optional().describe('Preferred identifier.'),
		id: IdSchema.optional().describe('A RocketReach company ID.'),
		name: NonBlankStringSchema.optional(),
		linkedin_url: NonBlankStringSchema.optional(),
		ticker: NonBlankStringSchema.optional().describe('A stock ticker.'),
	})
	.refine(
		(input) => Object.values(input).some((value) => value !== undefined),
		'Provide a company identifier',
	);

export type CompanyLookupInput = z.infer<typeof CompanyLookupInputSchema>;

const CompanyAddressSchema = z
	.object({
		street: z.string().nullish(),
		city: z.string().nullish(),
		region: z.string().nullish(),
		country: z.string().nullish(),
		postal_code: z.string().nullish(),
	})
	.loose();

/** A company with the extended attributes the lookup route adds. */
export const CompanySchema = z
	.object({
		id: z.number().nullish(),
		name: z.string().nullish(),
		domain: z.string().nullish(),
		email_domain: z.string().nullish(),
		website_domain: z.string().nullish(),
		ticker_symbol: z.string().nullish(),
		links: LinkMapSchema.nullish(),
		year_founded: z.number().nullish(),
		address: CompanyAddressSchema.nullish(),
		phone: z.string().nullish(),
		fax: z.string().nullish(),
		num_employees: z.number().nullish(),
		revenue: z.number().nullish(),
		funding_investors: z.array(z.string()).nullish(),
		industry: z.string().nullish(),
		sic_codes: z.array(z.string()).nullish(),
		naics_codes: z.array(z.string()).nullish(),
		rr_profile_url: z.string().nullish(),
		description: z.string().nullish(),
		industry_keywords: z.array(z.string()).nullish(),
		techstack: z.array(z.string()).nullish(),
		industries: z.array(z.string()).nullish(),
		competitors: z.array(z.string()).nullish(),
		departments: JsonObjectSchema.nullish(),
		company_growth: z.array(JsonObjectSchema).nullish(),
	})
	.loose();

export type RocketReachCompany = z.infer<typeof CompanySchema>;

const CompanyLookupResponseSchema = CompanySchema;

export type CompanyLookupResponse = z.infer<typeof CompanyLookupResponseSchema>;

const CompanySearchInputSchema = z.object({
	query: z
		.object({
			name: z.array(z.string()).optional(),
			domain: z.array(z.string()).optional(),
			email_domain: z.array(z.string()).optional(),
			website_url: z.array(z.string()).optional(),
			industry: z.array(z.string()).optional(),
			industry_keywords: z.array(z.string()).optional(),
			employees: z
				.array(z.string())
				.optional()
				.describe('Bands such as 51-200.'),
			revenue: z
				.array(z.string())
				.optional()
				.describe('Bands such as 10000000-50000000.'),
			total_funding: z.array(z.string()).optional(),
			publicly_traded: z.array(z.string()).optional(),
			naics_code: z.array(z.string()).optional(),
			sic_code: z.array(z.string()).optional(),
			geo: z.array(z.string()).optional(),
			location: z.array(z.string()).optional(),
			techstack: z.array(z.string()).optional(),
			competitors: z.array(z.string()).optional(),
			keyword: z.array(z.string()).optional(),
			link: z.array(z.string()).optional(),
			phone: z.array(z.string()).optional(),
		})
		.loose()
		.refine(hasSearchFilter, 'Provide at least one non-empty search filter')
		.describe('At least one filter.'),
	start: z.number().int().min(1).max(10_000).optional(),
	page_size: z.number().int().min(1).max(100).optional(),
	order_by: z.enum(['relevance', 'popularity', 'score']).optional(),
});

export type CompanySearchInput = z.infer<typeof CompanySearchInputSchema>;

const CompanySearchRowSchema = z
	.object({
		id: z.number().nullish(),
		name: z.string().nullish(),
		email_domain: z.string().nullish(),
		ticker_symbol: z.string().nullish(),
		industry_str: z.string().nullish(),
		city: z.string().nullish(),
		region: z.string().nullish(),
		country_code: z.string().nullish(),
		linkedin_url: z.string().nullish(),
		logo_url: z.string().nullish(),
	})
	.loose();

const CompanySearchResponseSchema = z.array(CompanySearchRowSchema);

export type CompanySearchResponse = z.infer<typeof CompanySearchResponseSchema>;

// ── email.verify ──────────────────────────────────────────────────────────

const EmailVerifyInputSchema = z.object({
	email: NonBlankStringSchema.describe('The address to verify.'),
});

export type EmailVerifyInput = z.infer<typeof EmailVerifyInputSchema>;

const EmailVerifyChecksSchema = z
	.object({
		format_valid: z
			.boolean()
			.nullish()
			.describe('False means the result was refunded.'),
		domain_valid: z.boolean().nullish(),
		disposable: z
			.boolean()
			.nullish()
			.describe('True for a disposable or high-risk provider.'),
		catchall: z
			.boolean()
			.nullish()
			.describe(
				'True when the domain accepts mail at any address. This answers a different question from status: a catch-all domain whose mailbox was confirmed is valid while catchall is true.',
			),
	})
	.loose();

const EmailVerifyResponseSchema = z
	.object({
		email: z.string().nullish().describe('The address, canonicalized.'),
		status: z
			.string()
			.nullish()
			.describe(
				'valid, invalid, catchall or unknown. invalid covers a malformed, disposable or risky address.',
			),
		credits_charged: z
			.number()
			.nullish()
			.describe('1, or 0 when the result was refunded.'),
		mx_record: z
			.string()
			.nullish()
			.describe(
				"The domain's primary MX host. Null when it publishes none, so it is not on its own evidence that mail cannot be delivered.",
			),
		checks: EmailVerifyChecksSchema.nullish(),
	})
	.loose();

export type EmailVerifyResponse = z.infer<typeof EmailVerifyResponseSchema>;

// ── the maps ──────────────────────────────────────────────────────────────

export type RocketReachEndpointInputs = {
	accountGet: z.infer<typeof AccountGetInputSchema>;
	accountUniversal: z.infer<typeof AccountUniversalInputSchema>;
	personLookup: PersonLookupInput;
	personBulkLookup: PersonBulkLookupInput;
	personCheckStatus: PersonCheckStatusInput;
	personSearch: PersonSearchInput;
	companyLookup: CompanyLookupInput;
	companySearch: CompanySearchInput;
	emailVerify: EmailVerifyInput;
};

export type RocketReachEndpointOutputs = {
	accountGet: AccountGetResponse;
	accountUniversal: AccountUniversalResponse;
	personLookup: PersonLookupResponse;
	personBulkLookup: PersonBulkLookupResponse;
	personCheckStatus: PersonCheckStatusResponse;
	personSearch: PersonSearchResponse;
	companyLookup: CompanyLookupResponse;
	companySearch: CompanySearchResponse;
	emailVerify: EmailVerifyResponse;
};

export const RocketReachEndpointInputSchemas = {
	accountGet: AccountGetInputSchema,
	accountUniversal: AccountUniversalInputSchema,
	personLookup: PersonLookupInputSchema,
	personBulkLookup: PersonBulkLookupInputSchema,
	personCheckStatus: PersonCheckStatusInputSchema,
	personSearch: PersonSearchInputSchema,
	companyLookup: CompanyLookupInputSchema,
	companySearch: CompanySearchInputSchema,
	emailVerify: EmailVerifyInputSchema,
} as const;

export const RocketReachEndpointOutputSchemas = {
	accountGet: AccountGetResponseSchema,
	accountUniversal: AccountUniversalResponseSchema,
	personLookup: PersonLookupResponseSchema,
	personBulkLookup: PersonBulkLookupResponseSchema,
	personCheckStatus: PersonCheckStatusResponseSchema,
	personSearch: PersonSearchResponseSchema,
	companyLookup: CompanyLookupResponseSchema,
	companySearch: CompanySearchResponseSchema,
	emailVerify: EmailVerifyResponseSchema,
} as const;
