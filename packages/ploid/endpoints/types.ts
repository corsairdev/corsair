import { z } from 'zod';

// Requests are strict: the OpenAPI spec sets `additionalProperties: false` and
// the server 422s unknown filter keys (for example `company_domain` returns
// `unsupported_filters`). Responses are `.loose()` so a field Ploid adds later
// still reaches the caller.

const MetaSchema = z
	.object({
		request_id: z.string(),
	})
	.loose();

// --- Search ---

const TermsSchema = z.array(z.string().min(1).max(200)).min(1).max(10);

// The spec marks every filter object minProperties 1: a condition-less
// object is not a filter and must not reach the wire.
function withCondition<S extends z.ZodType>(schema: S, field: string): S {
	return schema.refine(
		// as: the generic output is only known to be zod-parsable; every
		// caller passes a strict object, so the record view is exact.
		(value) =>
			Object.values(value as Record<string, unknown>).some(
				(entry) => entry !== undefined,
			),
		{ message: `${field} filter needs at least one condition` },
	);
}

// One filter value, or { any_of, none_of } with at least one of the two.
const TextFilterSchema = z.union([
	z.string().min(1).max(200),
	withCondition(
		z.strictObject({
			any_of: TermsSchema.optional(),
			none_of: TermsSchema.optional(),
		}),
		'text',
	),
]);

const CompanyFilterSchema = z.union([
	z.string().min(1).max(200),
	withCondition(
		z.strictObject({
			any_of: TermsSchema.optional(),
			none_of: TermsSchema.optional(),
			employee_count: withCondition(
				z.strictObject({
					gte: z.number().int().min(1).optional(),
					lte: z.number().int().min(1).optional(),
				}),
				'employee_count',
			).optional(),
			funding_stage: z
				.strictObject({
					in: z
						.array(
							z.enum([
								'pre_seed',
								'seed',
								'series_a',
								'series_b',
								'series_c',
								'series_d_plus',
								'public',
								'bootstrapped',
							]),
						)
						.min(1),
				})
				.optional(),
		}),
		'company',
	),
]);

const LocationFilterSchema = z.union([
	z.string().min(1).max(200),
	withCondition(
		z.strictObject({
			any_of: TermsSchema.optional(),
			none_of: TermsSchema.optional(),
			countries: TermsSchema.optional(),
			cities: TermsSchema.optional(),
		}),
		'location',
	),
]);

const CountFilterSchema = withCondition(
	z.strictObject({
		min: z.number().int().min(1).optional(),
		max: z.number().int().min(1).optional(),
	}),
	'company_size',
);

// A bare seniority string is capped at 80 chars by the spec; the object
// form's any_of values keep the shared 200-char term bound.
const SeniorityFilterSchema = z.union([
	z.string().min(1).max(80),
	withCondition(
		z.strictObject({
			any_of: TermsSchema.optional(),
			none_of: TermsSchema.optional(),
		}),
		'seniority',
	),
]);

const SearchFiltersSchema = z.strictObject({
	title: TextFilterSchema.optional(),
	seniority: SeniorityFilterSchema.optional(),
	company: CompanyFilterSchema.optional(),
	industry: TextFilterSchema.optional(),
	location: LocationFilterSchema.optional(),
	company_size: CountFilterSchema.optional(),
	experience: z
		.strictObject({
			past_companies: z.strictObject({ any_of: TermsSchema }),
		})
		.optional(),
	education: z
		.strictObject({
			schools: z.strictObject({ any_of: TermsSchema }),
		})
		.optional(),
});

export const SearchInputSchema = z
	.strictObject({
		query: z.string().max(4000).optional(),
		type: z.enum(['instant', 'fast', 'auto', 'deep']).optional(),
		category: z.literal('people').optional(),
		num_results: z.number().int().min(1).max(5000).optional(),
		criteria: z.array(z.string().min(1).max(500)).max(5).optional(),
		async: z.boolean().optional(),
		webhook_url: z.string().optional(),
		filters: SearchFiltersSchema.optional(),
		freshness: z
			.strictObject({
				max_age_days: z.number().int().min(0).max(365),
			})
			.optional(),
		contents: z
			.strictObject({
				fields: z
					.array(z.enum(['linkedin', 'title', 'company', 'location', 'name']))
					.optional(),
			})
			.optional(),
	})
	.refine(
		(value) =>
			(value.query !== undefined && value.query.trim() !== '') ||
			(value.filters !== undefined && Object.keys(value.filters).length > 0),
		{ message: 'query or at least one filters field is required' },
	);

export type SearchInput = z.input<typeof SearchInputSchema>;

const SearchPersonSchema = z
	.object({
		person_id: z.string(),
		name: z.string().nullable().optional(),
		title: z.string().nullable().optional(),
		company: z.string().nullable().optional(),
		location: z.string().nullable().optional(),
		linkedin_url: z.string().nullable().optional(),
		profile_url: z.string().nullable().optional(),
		confidence: z.number().nullable().optional(),
		identity_verified: z.boolean().optional(),
	})
	.loose();

const SearchResultSchema = z
	.object({
		url: z.string().nullable().optional(),
		title: z.string().nullable().optional(),
		score: z.number().nullable().optional(),
		person: SearchPersonSchema,
	})
	.loose();

// 200: inline results. 202: the search became a background People Set.
export const SearchResponseSchema = z.union([
	z
		.object({
			data: z
				.object({
					results: z.array(SearchResultSchema),
				})
				.loose(),
			meta: MetaSchema,
		})
		.loose(),
	z
		.object({
			data: z
				.object({
					mode: z.literal('async'),
					set_id: z.string(),
					status: z.string().optional(),
					items_url: z.string().optional(),
					events_url: z.string().optional(),
				})
				.loose(),
			meta: MetaSchema,
		})
		.loose(),
]);

export type SearchResponse = z.infer<typeof SearchResponseSchema>;

export const SearchCandidatesInputSchema = z.strictObject({
	name: z.string().min(2).max(200),
	company: z.string().min(1).max(200).optional(),
	location: z.string().min(1).max(200).optional(),
	title: z.string().min(1).max(200).optional(),
	limit: z.number().int().min(1).max(10).optional(),
});

export type SearchCandidatesInput = z.infer<typeof SearchCandidatesInputSchema>;

const CandidateSchema = z
	.object({
		person_id: z.string(),
		name: z.string(),
		title: z.string().nullable().optional(),
		company: z.string().nullable().optional(),
		location: z.string().nullable().optional(),
		linkedin_url: z.string().nullable().optional(),
		profile_url: z.string().nullable().optional(),
	})
	.loose();

export const SearchCandidatesResponseSchema = z
	.object({
		data: z
			.object({
				matches: z.array(CandidateSchema),
				returned: z.number().int().min(0),
			})
			.loose(),
		meta: MetaSchema.loose(),
	})
	.loose();

export type SearchCandidatesResponse = z.infer<
	typeof SearchCandidatesResponseSchema
>;

// --- Person ---

// A name alone is not enough: the spec requires at least one clue.
export const ResolveInputSchema = z
	.strictObject({
		name: z.string().min(2).max(200),
		company: z.string().min(1).max(200).optional(),
		role: z.string().min(1).max(300).optional(),
		location: z.string().min(1).max(200).optional(),
		address: z.string().min(3).max(300).optional(),
		work_email: z.email().max(254).optional(),
		personal_email: z.email().max(254).optional(),
		phone: z
			.string()
			.max(40)
			.regex(/^\+?[\d\s().-]+$/)
			.optional(),
	})
	.refine(
		(value) =>
			value.company !== undefined ||
			value.role !== undefined ||
			value.location !== undefined ||
			value.address !== undefined ||
			value.work_email !== undefined ||
			value.personal_email !== undefined ||
			value.phone !== undefined,
		{
			message:
				'at least one clue is required: company, role, location, address, work_email, personal_email, or phone',
		},
	);

export type ResolveInput = z.infer<typeof ResolveInputSchema>;

const ResolveProfilesSchema = z
	.object({
		linkedin: z.string().optional(),
		github: z.string().optional(),
		x: z.string().optional(),
	})
	.loose();

const ResolvedPersonSchema = z
	.object({
		person_id: z.string(),
		name: z.string(),
		headline: z.string().nullable().optional(),
		company: z.string().nullable().optional(),
		location: z.string().nullable().optional(),
		profiles: ResolveProfilesSchema.optional(),
		identity_verified: z.boolean().optional(),
	})
	.loose();

export const ResolveResponseSchema = z
	.object({
		data: z
			.object({
				found: z.boolean(),
				person: ResolvedPersonSchema.nullable(),
				confidence: z.number(),
				summary: z.string().optional(),
				sources: z.array(z.string()).optional(),
			})
			.loose(),
		meta: MetaSchema,
	})
	.loose();

export type ResolveResponse = z.infer<typeof ResolveResponseSchema>;

// Exactly one identifier shape; the spec's oneOf rejects bodies that mix them.
const PersonIdentifierSchema = z.union([
	z.strictObject({ person_id: z.string().min(1).max(500) }),
	z.strictObject({ linkedin_url: z.string() }),
	z.strictObject({
		name: z.string().min(1).max(200),
		company_domain: z.string().min(3).max(253),
	}),
]);

export const PersonInputSchema = z.strictObject({
	identifier: PersonIdentifierSchema,
});

export type PersonInput = z.infer<typeof PersonInputSchema>;

// 200 deep profile. data is null when an uncertain identity completed with
// meta.resolution = unsure. Kept loose: the projection carries nested
// evidence and provenance that evolves with the product.
export const PersonResponseSchema = z
	.object({
		data: z
			.object({
				person_id: z.string().optional(),
				summary: z.string().nullable().optional(),
				identity: z
					.object({
						name: z.string().optional(),
						linkedin_url: z.string().nullable().optional(),
						headline: z.string().nullable().optional(),
						company: z.string().nullable().optional(),
						location: z.string().nullable().optional(),
						confidence: z.number().optional(),
					})
					.loose()
					.nullable()
					.optional(),
			})
			.loose()
			.nullable(),
		meta: MetaSchema,
	})
	.loose();

export type PersonResponse = z.infer<typeof PersonResponseSchema>;

export const PersonRunSchema = z
	.object({
		data: z
			.object({
				run_id: z.string(),
				status: z.enum(['queued', 'running', 'cancelled']),
				poll_url: z.string().optional(),
			})
			.loose(),
		meta: MetaSchema.loose(),
	})
	.loose();

export type PersonRunResponse = z.infer<typeof PersonRunSchema>;

// POST /v1/person answers 200 (cached profile) or 202 (durable run).
// The run member must come first: it requires run_id, which a profile body
// never carries, while the profile member is all-optional and would happily
// parse (and, without .loose(), strip) a run body.
export const PersonOrRunResponseSchema = z.union([
	PersonRunSchema,
	PersonResponseSchema,
]);

export type PersonOrRunResponse = z.infer<typeof PersonOrRunResponseSchema>;

export const PersonRunInputSchema = z.strictObject({
	id: z.string().min(1),
});

export type PersonRunInput = z.infer<typeof PersonRunInputSchema>;

// --- Contacts ---

// Exactly one identifier; the spec's oneOf rejects bodies that mix them.
const ContactIdentifierSchema = z.union([
	z.strictObject({
		linkedin_url: z
			.string()
			.regex(
				/^https?:\/\/(?:[^/]+\.)?linkedin\.com\/in\/[^/?#]+\/?(?:[?#].*)?$/,
			),
	}),
	z.strictObject({ person_id: z.string().min(1) }),
	z.strictObject({ email: z.email() }),
	z.strictObject({
		name: z.string().min(1),
		company_domain: z
			.string()
			.regex(
				/^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,63}$/,
			),
	}),
]);

export const EnrichInputSchema = z.strictObject({
	identifier: ContactIdentifierSchema,
	fields: z
		.array(z.enum(['work_email', 'personal_email', 'phone']))
		.min(1)
		.max(3)
		// The spec marks fields uniqueItems: a repeated field bills once but
		// the server rejects it, so reject it before the wire.
		.refine((fields) => new Set(fields).size === fields.length, {
			message: 'fields must be unique',
		}),
	response_format: z.literal('standard').optional(),
});

export type EnrichInput = z.infer<typeof EnrichInputSchema>;

const ContactFieldSchema = z
	.object({
		value: z.string().nullable(),
		status: z.enum(['found', 'not_found', 'unavailable']),
		confidence: z.enum(['guess', 'strong', 'verified']).nullable().optional(),
		source: z
			.enum(['contact_network', 'linked_profile', 'public_code', 'public_web'])
			.nullable()
			.optional(),
		last_seen: z.string().nullable().optional(),
	})
	.loose();

export const EnrichResponseSchema = z
	.object({
		data: z
			.object({
				work_email: ContactFieldSchema.optional(),
				personal_email: ContactFieldSchema.optional(),
				phone: ContactFieldSchema.optional(),
			})
			.loose(),
		meta: MetaSchema.loose(),
	})
	.loose();

export type EnrichResponse = z.infer<typeof EnrichResponseSchema>;

// --- Account ---

const AcuSummarySchema = z
	.object({
		included: z.number(),
		purchased: z.number(),
		used: z.number(),
		available: z.number(),
		overage: z.number(),
	})
	.loose();

// A plain string, not the spec's enum: Ploid adding a plan tier must not
// break reading an account balance.
const PlanSchema = z.string();

export const AccountCreditsResponseSchema = z
	.object({
		data: z
			.object({
				plan: PlanSchema.optional(),
				acu: AcuSummarySchema.optional(),
			})
			.loose(),
		meta: MetaSchema,
	})
	.loose();

export type AccountCreditsResponse = z.infer<
	typeof AccountCreditsResponseSchema
>;

export const AccountUsageResponseSchema = z
	.object({
		data: z
			.object({
				credits: z
					.object({
						plan: PlanSchema.optional(),
						acu: AcuSummarySchema.optional(),
					})
					.loose()
					.optional(),
				api_key: z
					.object({
						id: z.string().optional(),
						active_keys: z.number().int().min(1).optional(),
					})
					.loose()
					.optional(),
			})
			.loose(),
		meta: MetaSchema,
	})
	.loose();

export type AccountUsageResponse = z.infer<typeof AccountUsageResponseSchema>;

// --- Registry ---

export type PloidEndpointInputs = {
	search: SearchInput;
	searchCandidates: SearchCandidatesInput;
	resolve: ResolveInput;
	person: PersonInput;
	personRun: PersonRunInput;
	cancelPersonRun: PersonRunInput;
	enrich: EnrichInput;
	accountCredits: Record<string, never>;
	accountUsage: Record<string, never>;
};

export type PloidEndpointOutputs = {
	search: SearchResponse;
	searchCandidates: SearchCandidatesResponse;
	resolve: ResolveResponse;
	person: PersonOrRunResponse;
	// A finished poll returns the reviewed profile, not a terminal status.
	personRun: PersonOrRunResponse;
	cancelPersonRun: PersonRunResponse;
	enrich: EnrichResponse;
	accountCredits: AccountCreditsResponse;
	accountUsage: AccountUsageResponse;
};

export const PloidEndpointInputSchemas = {
	search: SearchInputSchema,
	searchCandidates: SearchCandidatesInputSchema,
	resolve: ResolveInputSchema,
	person: PersonInputSchema,
	personRun: PersonRunInputSchema,
	cancelPersonRun: PersonRunInputSchema,
	enrich: EnrichInputSchema,
	// z.object, not strictObject: no wire body to protect, and callers (LLM
	// agents especially) pass harmless extra keys to no-arg endpoints.
	accountCredits: z.object({}),
	accountUsage: z.object({}),
} as const;

export const PloidEndpointOutputSchemas = {
	search: SearchResponseSchema,
	searchCandidates: SearchCandidatesResponseSchema,
	resolve: ResolveResponseSchema,
	person: PersonOrRunResponseSchema,
	personRun: PersonOrRunResponseSchema,
	cancelPersonRun: PersonRunSchema,
	enrich: EnrichResponseSchema,
	accountCredits: AccountCreditsResponseSchema,
	accountUsage: AccountUsageResponseSchema,
} as const;
