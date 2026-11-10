import { z } from 'zod';

/** Recruitee pages by `limit`/`offset`; its own default limit applies. */
const LimitSchema = z
	.number()
	.int()
	.min(1)
	.optional()
	.describe(
		'Records per page. Recruitee applies its own default when omitted.',
	);

const OffsetSchema = z
	.number()
	.int()
	.min(0)
	.optional()
	.describe('Records to skip, 0-based.');

const pagingQuery = { limit: LimitSchema, offset: OffsetSchema };

const pagingFields = {
	meta: z
		.object({
			total: z.number().nullish(),
			page: z.number().nullish(),
			limit: z.number().nullish(),
		})
		.loose()
		.nullish(),
	next_offset: z
		.number()
		.nullable()
		.describe('Pass as `offset` to read the next page; null on the last.'),
};

// ── candidates ────────────────────────────────────────────────────────────

/**
 * `/search/new/candidates` filters by stage, offer and status. The parameters
 * are query strings, and Recruitee rejects a body on this route.
 */
const CandidatesListInputSchema = z.object({
	...pagingQuery,
	query: z.string().optional().describe('A free-text search.'),
	offer_id: z
		.number()
		.int()
		.optional()
		.describe('Only candidates on this offer.'),
	stage: z.string().optional().describe('The pipeline stage name.'),
	status: z.string().optional().describe('The candidate status.'),
	department_id: z.number().int().optional(),
	location_id: z.number().int().optional(),
	sort_by: z
		.string()
		.optional()
		.describe('The column to sort on, such as `created_at`.'),
	sort_direction: z.enum(['asc', 'desc']).optional(),
});

export type CandidatesListInput = z.input<typeof CandidatesListInputSchema>;

/** A placement: the candidate's position on a stage of an offer. */
const PlacementSchema = z
	.object({
		id: z.number().nullish(),
		candidate_id: z.number().nullish(),
		offer_id: z.number().nullish(),
		stage: z.string().nullish(),
		stage_id: z.number().nullish(),
		status: z.string().nullish(),
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
		status: z.string().nullish(),
		stage: z.string().nullish(),
		admin_id: z.number().nullish(),
		created_at: z.string().nullish(),
		updated_at: z.string().nullish(),
		last_activity_at: z.string().nullish(),
		my_last_rating: z.number().nullish(),
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

const CandidatesUpdateInputSchema = z.object({
	candidate_id: z.number().int().positive(),
	name: z.string().optional(),
	emails: z.array(z.string()).optional(),
	phones: z.array(z.string()).optional(),
	cover_letter: z.string().optional(),
	status: z.string().optional(),
	stage: z.string().optional(),
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
	query: z.string().optional(),
	department_id: z.number().int().optional(),
	location_id: z.number().int().optional(),
	status: z.enum(['published', 'draft', 'archived']).optional(),
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
		location_id: z.number().nullish(),
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

const OffersCreateInputSchema = z.object({
	title: z.string().min(1),
	kind: z.enum(['job', 'talent_pool']).optional(),
	description: z.string().optional(),
	requirements: z.string().optional(),
	department_id: z.number().int().optional(),
	location_id: z.number().int().optional(),
	// A new offer starts as a draft unless it is published explicitly, which is
	// what the create route does.
	status: z.enum(['draft', 'published']).optional(),
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

const DepartmentsListInputSchema = z.object({
	...pagingQuery,
});

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
	...pagingFields,
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
		country: z.string().nullish(),
		country_code: z.string().nullish(),
		note: z.string().nullish(),
		offers_count: z.number().nullish(),
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
