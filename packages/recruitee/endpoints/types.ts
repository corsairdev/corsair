import { z } from 'zod';

/** Recruitee pages by `page` and `limit`; its own default limit applies. */
const LimitSchema = z
	.number()
	.int()
	.min(1)
	.optional()
	.describe(
		'Records per page. Recruitee applies its own default when omitted.',
	);

const PageSchema = z
	.number()
	.int()
	.min(1)
	.optional()
	.describe('The page to read, 1-based. Defaults to 1.');

const pagingQuery = { limit: LimitSchema, page: PageSchema };

const pagingFields = {
	total: z
		.number()
		.nullable()
		.describe('How many records match in total, when the route says.'),
	next_page: z
		.number()
		.nullable()
		.describe('Pass as `page` to read the next page; null on the last.'),
};

// ── candidates ────────────────────────────────────────────────────────────

/**
 * `/search/new/candidates` takes its filters as one `filters_json` array and
 * pages by `page`; the plugin builds that array from these fields.
 */
const CandidatesListInputSchema = z.object({
	...pagingQuery,
	query: z
		.string()
		.optional()
		.describe(
			'A free-text search over name, emails, phones, tags, sources, stage, cover letter and CV.',
		),
	offer_id: z
		.number()
		.int()
		.optional()
		.describe('Only candidates on this offer.'),
	stage: z
		.string()
		.optional()
		.describe('Only candidates in a stage with this name, such as `Applied`.'),
	status: z
		.string()
		.optional()
		.describe('The candidate status: `qualified`, `disqualified` or `new`.'),
	department_id: z
		.number()
		.int()
		.optional()
		.describe('Only candidates on offers in this department.'),
	location_id: z
		.number()
		.int()
		.optional()
		.describe('Only candidates on offers at this location.'),
	sort_by: z
		.string()
		.optional()
		.describe(
			'The column to sort on, such as `created_at`, `candidate_name` or `relevance`.',
		),
	sort_direction: z
		.enum(['asc', 'desc'])
		.optional()
		.describe('Defaults to `desc` when `sort_by` is set.'),
});

export type CandidatesListInput = z.input<typeof CandidatesListInputSchema>;

/**
 * A placement: the candidate's position on a stage of an offer. The search
 * route nests `offer` and `stage` as objects; the candidate route sends
 * `offer_id` and `stage_id` instead.
 */
const PlacementSchema = z
	.object({
		id: z.number().nullish(),
		candidate_id: z.number().nullish(),
		offer_id: z.number().nullish(),
		talent_pool_id: z.number().nullish(),
		offer: z
			.object({
				id: z.number().nullish(),
				title: z.string().nullish(),
				kind: z.string().nullish(),
				status: z.string().nullish(),
			})
			.loose()
			.nullish(),
		stage: z
			.object({ id: z.number().nullish(), name: z.string().nullish() })
			.loose()
			.nullish(),
		stage_id: z.number().nullish(),
		disqualified: z.boolean().nullish(),
		created_at: z.string().nullish(),
		updated_at: z.string().nullish(),
	})
	.loose();

/** One locale's version of an offer. */
const OfferTranslationSchema = z
	.object({
		locale: z.string().nullish(),
		title: z.string().nullish(),
		description: z.string().nullish(),
		requirements: z.string().nullish(),
	})
	.loose();

const CandidateSchema = z
	.object({
		id: z.number().nullish(),
		name: z.string().nullish(),
		emails: z.array(z.string()).nullish(),
		phones: z.array(z.string()).nullish(),
		social_links: z.array(z.string()).nullish(),
		links: z.array(z.string()).nullish(),
		cover_letter: z.string().nullish(),
		sources: z.array(z.string()).nullish(),
		admin_id: z.number().nullish(),
		created_at: z.string().nullish(),
		updated_at: z.string().nullish(),
		last_activity_at: z.string().nullish(),
		// A score on numeric scales, or a word such as `yes` on thumbs scales.
		my_last_rating: z.union([z.number(), z.string()]).nullish(),
		photo_url: z.string().nullish(),
		cv_url: z.string().nullish(),
		placements: z.array(PlacementSchema).nullish(),
		tags: z.array(z.string()).nullish(),
	})
	.loose();

export type RecruiteeCandidate = z.infer<typeof CandidateSchema>;

const CandidatesListResponseSchema = z.object({
	candidates: z.array(CandidateSchema),
	...pagingFields,
});

export type CandidatesListResponse = z.infer<
	typeof CandidatesListResponseSchema
>;

const CandidatesGetInputSchema = z.object({
	candidate_id: z.number().int().positive(),
});

export type CandidatesGetInput = z.input<typeof CandidatesGetInputSchema>;

const CandidatesGetResponseSchema = z.object({ candidate: CandidateSchema });
export type CandidatesGetResponse = z.infer<typeof CandidatesGetResponseSchema>;

const CandidatesCreateInputSchema = z.object({
	name: z.string().min(1).describe('The candidate name.'),
	emails: z.array(z.string()).optional(),
	phones: z.array(z.string()).optional(),
	social_links: z.array(z.string()).optional(),
	links: z.array(z.string()).optional(),
	cover_letter: z.string().optional(),
	sources: z.array(z.string()).optional(),
	remote_cv_url: z
		.string()
		.optional()
		.describe('A link to a CV hosted elsewhere, instead of an upload.'),
	offer_id: z
		.number()
		.int()
		.optional()
		.describe('The offer the candidate is assigned to at its default stage.'),
});

export type CandidatesCreateInput = z.input<typeof CandidatesCreateInputSchema>;

const CandidatesCreateResponseSchema = z.object({
	candidate: CandidateSchema,
});

export type CandidatesCreateResponse = z.infer<
	typeof CandidatesCreateResponseSchema
>;

/**
 * The profile fields the update route takes. Stage moves and disqualification
 * belong to the candidate's placement on an offer, not to this route.
 */
const CandidatesUpdateInputSchema = z.object({
	candidate_id: z.number().int().positive(),
	name: z.string().optional(),
	emails: z.array(z.string()).optional(),
	phones: z.array(z.string()).optional(),
	cover_letter: z.string().optional(),
});

export type CandidatesUpdateInput = z.input<typeof CandidatesUpdateInputSchema>;

const CandidatesUpdateResponseSchema = z.object({
	candidate: CandidateSchema,
});

export type CandidatesUpdateResponse = z.infer<
	typeof CandidatesUpdateResponseSchema
>;

const CandidatesDeleteInputSchema = z.object({
	candidate_id: z.number().int().positive(),
});

export type CandidatesDeleteInput = z.input<typeof CandidatesDeleteInputSchema>;

const CandidatesDeleteResponseSchema = z.object({
	success: z.boolean(),
	candidate_id: z.number(),
});

export type CandidatesDeleteResponse = z.infer<
	typeof CandidatesDeleteResponseSchema
>;

// ── offers ────────────────────────────────────────────────────────────────

const OffersListInputSchema = z.object({
	...pagingQuery,
	department_id: z
		.number()
		.int()
		.optional()
		.describe('Only offers in this department.'),
	location_id: z
		.number()
		.int()
		.optional()
		.describe('Only offers at this location.'),
	status: z
		.enum(['draft', 'published', 'internal', 'closed', 'archived'])
		.optional()
		.describe('Only offers in this status.'),
	kind: z
		.enum(['job', 'talent_pool'])
		.optional()
		.describe('`job` for a posted role, `talent_pool` for a pool.'),
});

export type OffersListInput = z.input<typeof OffersListInputSchema>;

const OfferSchema = z
	.object({
		id: z.number().nullish(),
		title: z.string().nullish(),
		slug: z.string().nullish(),
		status: z.string().nullish(),
		kind: z.string().nullish(),
		department: z.string().nullish(),
		department_id: z.number().nullish(),
		location: z.string().nullish(),
		location_ids: z.array(z.number()).nullish(),
		city: z.string().nullish(),
		country_code: z.string().nullish(),
		description: z.string().nullish(),
		requirements: z.string().nullish(),
		created_at: z.string().nullish(),
		updated_at: z.string().nullish(),
		published_at: z.string().nullish(),
		translations: z.array(OfferTranslationSchema).nullish(),
	})
	.loose();

export type RecruiteeOffer = z.infer<typeof OfferSchema>;

const OffersListResponseSchema = z.object({
	offers: z.array(OfferSchema),
	...pagingFields,
});

export type OffersListResponse = z.infer<typeof OffersListResponseSchema>;

const OffersGetInputSchema = z.object({
	offer_id: z.number().int().positive(),
});

export type OffersGetInput = z.input<typeof OffersGetInputSchema>;

const OffersGetResponseSchema = z.object({ offer: OfferSchema });
export type OffersGetResponse = z.infer<typeof OffersGetResponseSchema>;

/**
 * A new offer starts as a draft; publishing is a separate step in Recruitee, so
 * the create route takes no status.
 */
const OffersCreateInputSchema = z.object({
	title: z.string().min(1),
	kind: z.enum(['job', 'talent_pool']).optional(),
	description: z.string().optional().describe('The description, as HTML.'),
	requirements: z
		.string()
		.optional()
		.describe('The requirements, as HTML. Recruitee requires them for a job.'),
	department_id: z.number().int().optional(),
	location_ids: z
		.array(z.number().int())
		.optional()
		.describe(
			'Location ids from `locations.list`. Recruitee requires at least one for a job.',
		),
});

export type OffersCreateInput = z.input<typeof OffersCreateInputSchema>;

const OffersCreateResponseSchema = z.object({ offer: OfferSchema });
export type OffersCreateResponse = z.infer<typeof OffersCreateResponseSchema>;

const OffersUpdateInputSchema = OffersCreateInputSchema.partial().extend({
	offer_id: z.number().int().positive(),
});

export type OffersUpdateInput = z.input<typeof OffersUpdateInputSchema>;

const OffersUpdateResponseSchema = z.object({ offer: OfferSchema });
export type OffersUpdateResponse = z.infer<typeof OffersUpdateResponseSchema>;

// ── departments and locations ─────────────────────────────────────────────

/** The departments route returns every department in one answer. */
const DepartmentsListInputSchema = z.object({});

export type DepartmentsListInput = z.input<typeof DepartmentsListInputSchema>;

const DepartmentSchema = z
	.object({
		id: z.number().nullish(),
		name: z.string().nullish(),
		// The docs note this is only set on a create response.
		status: z.string().nullish(),
		offers_count: z.number().nullish(),
	})
	.loose();

export type RecruiteeDepartment = z.infer<typeof DepartmentSchema>;

const DepartmentsListResponseSchema = z.object({
	departments: z.array(DepartmentSchema),
});

export type DepartmentsListResponse = z.infer<
	typeof DepartmentsListResponseSchema
>;

const LocationsListInputSchema = z.object({
	...pagingQuery,
});

export type LocationsListInput = z.input<typeof LocationsListInputSchema>;

const LocationSchema = z
	.object({
		id: z.number().nullish(),
		name: z.string().nullish(),
		city: z.string().nullish(),
		state_name: z.string().nullish(),
		country_code: z.string().nullish(),
		full_address: z.string().nullish(),
		note: z.string().nullish(),
		archived_at: z.string().nullish(),
	})
	.loose();

export type RecruiteeLocation = z.infer<typeof LocationSchema>;

const LocationsListResponseSchema = z.object({
	locations: z.array(LocationSchema),
	...pagingFields,
});

export type LocationsListResponse = z.infer<typeof LocationsListResponseSchema>;

// ── Registry ──────────────────────────────────────────────────────────────

export type RecruiteeEndpointInputs = {
	candidatesList: CandidatesListInput;
	candidatesGet: CandidatesGetInput;
	candidatesCreate: CandidatesCreateInput;
	candidatesUpdate: CandidatesUpdateInput;
	candidatesDelete: CandidatesDeleteInput;
	offersList: OffersListInput;
	offersGet: OffersGetInput;
	offersCreate: OffersCreateInput;
	offersUpdate: OffersUpdateInput;
	departmentsList: DepartmentsListInput;
	locationsList: LocationsListInput;
};

export type RecruiteeEndpointOutputs = {
	candidatesList: CandidatesListResponse;
	candidatesGet: CandidatesGetResponse;
	candidatesCreate: CandidatesCreateResponse;
	candidatesUpdate: CandidatesUpdateResponse;
	candidatesDelete: CandidatesDeleteResponse;
	offersList: OffersListResponse;
	offersGet: OffersGetResponse;
	offersCreate: OffersCreateResponse;
	offersUpdate: OffersUpdateResponse;
	departmentsList: DepartmentsListResponse;
	locationsList: LocationsListResponse;
};

export const RecruiteeEndpointInputSchemas = {
	candidatesList: CandidatesListInputSchema,
	candidatesGet: CandidatesGetInputSchema,
	candidatesCreate: CandidatesCreateInputSchema,
	candidatesUpdate: CandidatesUpdateInputSchema,
	candidatesDelete: CandidatesDeleteInputSchema,
	offersList: OffersListInputSchema,
	offersGet: OffersGetInputSchema,
	offersCreate: OffersCreateInputSchema,
	offersUpdate: OffersUpdateInputSchema,
	departmentsList: DepartmentsListInputSchema,
	locationsList: LocationsListInputSchema,
} as const;

export const RecruiteeEndpointOutputSchemas = {
	candidatesList: CandidatesListResponseSchema,
	candidatesGet: CandidatesGetResponseSchema,
	candidatesCreate: CandidatesCreateResponseSchema,
	candidatesUpdate: CandidatesUpdateResponseSchema,
	candidatesDelete: CandidatesDeleteResponseSchema,
	offersList: OffersListResponseSchema,
	offersGet: OffersGetResponseSchema,
	offersCreate: OffersCreateResponseSchema,
	offersUpdate: OffersUpdateResponseSchema,
	departmentsList: DepartmentsListResponseSchema,
	locationsList: LocationsListResponseSchema,
} as const;
