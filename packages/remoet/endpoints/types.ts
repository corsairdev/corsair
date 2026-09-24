import { z } from 'zod';

// ── Shared shapes ────────────────────────────────────────────────────────────

/**
 * A single profile value plus its visibility flag. Remoet may add keys to
 * this object over time, so unknown keys are kept rather than rejected.
 */
export const RemoetDataFieldSchema = z
	.object({
		value: z.string().nullable(),
		isPublic: z.boolean(),
	})
	.loose();

export type RemoetDataField = z.infer<typeof RemoetDataFieldSchema>;

/** ISO 8601 timestamp as sent on the wire. */
const IsoDateSchema = z.string();

/**
 * Remoet's slug rule: trimmed, lowercased (slugs are stored lowercase) and at
 * most 100 characters, matching the server's own slugSchema.
 */
const SlugSchema = z.string().trim().toLowerCase().min(1).max(100);

// ── Work experience ──────────────────────────────────────────────────────────

/**
 * One entry of the user's WORK EXPERIENCE (their employment history). This is
 * not a job posting.
 */
export const RemoetWorkExperienceSchema = z
	.object({
		createdAt: IsoDateSchema,
		updatedAt: IsoDateSchema,
		userId: z.string().nullish(),
		title: z.string(),
		startDate: IsoDateSchema,
		/** Null or absent for a current role. */
		endDate: IsoDateSchema.nullish(),
		isCurrent: z.boolean().nullish(),
		isPublic: z.boolean().nullish(),
		companyName: z.string().nullish(),
		technologies: z.array(z.string()).nullish(),
		description: z.string().nullish(),
		isRemote: z.boolean().nullish(),
		companyUrl: z.string().nullish(),
		listingId: z.string().nullish(),
	})
	.loose();

export type RemoetWorkExperience = z.infer<typeof RemoetWorkExperienceSchema>;

// ── Projects ─────────────────────────────────────────────────────────────────

export const RemoetProjectSchema = z
	.object({
		title: z.string(),
		shortDescription: z.string().nullish(),
		technologies: z.array(z.string()).nullish(),
		isCurrent: z.boolean().nullish(),
		isRemote: z.boolean().nullish(),
		isOpenSource: z.boolean().nullish(),
		description: z.string().nullish(),
		role: z.string().nullish(),
		startDate: IsoDateSchema.nullable(),
		endDate: IsoDateSchema.nullable(),
		repoUrl: z.string().nullish(),
		demoUrl: z.string().nullish(),
		jobId: z.string().nullish(),
	})
	.loose();

export type RemoetProject = z.infer<typeof RemoetProjectSchema>;

// ── Education ────────────────────────────────────────────────────────────────

export const RemoetEducationSchema = z
	.object({
		institution: z.string(),
		institutionUrl: z.string().nullish(),
		studyLevel: z.string().nullish(),
		fieldOfStudy: z.string().nullish(),
		startDate: IsoDateSchema.nullable(),
		endDate: IsoDateSchema.nullable(),
		isCurrent: z.boolean().nullish(),
		description: z.string().nullish(),
	})
	.loose();

export type RemoetEducation = z.infer<typeof RemoetEducationSchema>;

// ── Link trees ───────────────────────────────────────────────────────────────

export const RemoetLinkTreeLinkSchema = z
	.object({
		id: z.string(),
		label: z.string(),
		url: z.string(),
	})
	.loose();

export const RemoetLinkTreeSchema = z
	.object({
		id: z.string(),
		title: z.string(),
		description: z.string().nullish(),
		slug: z.string(),
		links: z.array(RemoetLinkTreeLinkSchema),
		createdAt: IsoDateSchema,
		updatedAt: IsoDateSchema,
	})
	.loose();

export type RemoetLinkTree = z.infer<typeof RemoetLinkTreeSchema>;

// ── profile.get (GET /user/full) ─────────────────────────────────────────────

export const ProfileGetInputSchema = z.object({});
export type ProfileGetInput = z.infer<typeof ProfileGetInputSchema>;

export const RemoetProfileSchema = z
	.object({
		updatedAt: IsoDateSchema,
		isPublic: z.boolean().nullish(),
		slug: z.string().nullish(),
		name: RemoetDataFieldSchema.nullish(),
		avatarUrl: RemoetDataFieldSchema.nullish(),
		phone: RemoetDataFieldSchema.nullish(),
		url: RemoetDataFieldSchema.nullish(),
		summary: RemoetDataFieldSchema.nullish(),
		location: RemoetDataFieldSchema.nullish(),
		githubUrl: RemoetDataFieldSchema.nullish(),
		facebookUrl: RemoetDataFieldSchema.nullish(),
		twitterUrl: RemoetDataFieldSchema.nullish(),
		linkedinUrl: RemoetDataFieldSchema.nullish(),
		youtubeUrl: RemoetDataFieldSchema.nullish(),
	})
	.loose();

export type RemoetProfile = z.infer<typeof RemoetProfileSchema>;

export const ProfileGetResponseSchema = z
	.object({
		createdAt: IsoDateSchema,
		updatedAt: IsoDateSchema,
		/** Numeric GitHub user id; absent for users who never linked GitHub. */
		ghId: z.number().nullish(),
		email: z.string().nullish(),
		profile: RemoetProfileSchema,
		jobs: z.array(RemoetWorkExperienceSchema),
		projects: z.array(RemoetProjectSchema),
		linkTrees: z.array(RemoetLinkTreeSchema),
		education: z.array(RemoetEducationSchema),
	})
	.loose();

export type ProfileGetResponse = z.infer<typeof ProfileGetResponseSchema>;

// ── profile.getLinks (GET /user/links) ───────────────────────────────────────

export const ProfileGetLinksInputSchema = z.object({});
export type ProfileGetLinksInput = z.infer<typeof ProfileGetLinksInputSchema>;

/** Public links only: a field the user keeps private comes back as null. */
export const ProfileGetLinksResponseSchema = z
	.object({
		url: z.string().nullable(),
		githubUrl: z.string().nullable(),
		facebookUrl: z.string().nullable(),
		twitterUrl: z.string().nullable(),
		linkedinUrl: z.string().nullable(),
		youtubeUrl: z.string().nullable(),
	})
	.loose();

export type ProfileGetLinksResponse = z.infer<
	typeof ProfileGetLinksResponseSchema
>;

// ── profile.update (PATCH /user/profile) ─────────────────────────────────────

/** Remoet rejects any value longer than this after trimming. */
export const REMOET_PROFILE_FIELD_MAX_LENGTH = 500;

const WritableProfileValueSchema = z
	.string()
	.trim()
	.min(1)
	.max(REMOET_PROFILE_FIELD_MAX_LENGTH);

export const ProfileUpdateInputSchema = z
	.object({
		phone: WritableProfileValueSchema.optional(),
		url: WritableProfileValueSchema.optional(),
		location: WritableProfileValueSchema.optional(),
		githubUrl: WritableProfileValueSchema.optional(),
		linkedinUrl: WritableProfileValueSchema.optional(),
	})
	.strict()
	.refine((input) => Object.values(input).some((v) => v !== undefined), {
		message:
			'Provide at least one of: phone, url, location, githubUrl, linkedinUrl',
	});

export type ProfileUpdateInput = z.input<typeof ProfileUpdateInputSchema>;

export const ProfileUpdateResponseSchema = z
	.object({
		updated: z.array(z.string()),
	})
	.loose();

export type ProfileUpdateResponse = z.infer<typeof ProfileUpdateResponseSchema>;

// ── workExperience.list (GET /user/jobs) ─────────────────────────────────────

export const WorkExperienceListInputSchema = z.object({});
export type WorkExperienceListInput = z.infer<
	typeof WorkExperienceListInputSchema
>;

export const WorkExperienceListResponseSchema = z.array(
	RemoetWorkExperienceSchema,
);
export type WorkExperienceListResponse = z.infer<
	typeof WorkExperienceListResponseSchema
>;

// ── projects.list (GET /user/projects) ───────────────────────────────────────

export const ProjectsListInputSchema = z.object({});
export type ProjectsListInput = z.infer<typeof ProjectsListInputSchema>;

export const ProjectsListResponseSchema = z.array(RemoetProjectSchema);
export type ProjectsListResponse = z.infer<typeof ProjectsListResponseSchema>;

// ── education.list (GET /user/education) ─────────────────────────────────────

export const EducationListInputSchema = z.object({});
export type EducationListInput = z.infer<typeof EducationListInputSchema>;

export const EducationListResponseSchema = z.array(RemoetEducationSchema);
export type EducationListResponse = z.infer<typeof EducationListResponseSchema>;

// ── linkTrees.list / linkTrees.get (GET /user/linktrees[/:slug]) ─────────────

export const LinkTreesListInputSchema = z.object({});
export type LinkTreesListInput = z.infer<typeof LinkTreesListInputSchema>;

export const LinkTreesListResponseSchema = z.array(RemoetLinkTreeSchema);
export type LinkTreesListResponse = z.infer<typeof LinkTreesListResponseSchema>;

export const LinkTreesGetInputSchema = z.object({
	slug: z.string().trim().min(1),
});
export type LinkTreesGetInput = z.input<typeof LinkTreesGetInputSchema>;

export const LinkTreesGetResponseSchema = RemoetLinkTreeSchema;
export type LinkTreesGetResponse = z.infer<typeof LinkTreesGetResponseSchema>;

// ── jobContext.get (GET /user/job-context) ───────────────────────────────────

export const JobContextGetInputSchema = z.object({
	/** Full URL of the job page, e.g. an ATS posting. */
	url: z.url(),
});
export type JobContextGetInput = z.input<typeof JobContextGetInputSchema>;

export const RemoetJobRepostSchema = z
	.object({
		removedAt: IsoDateSchema,
		repostedAt: IsoDateSchema,
		gapDays: z.number(),
	})
	.loose();

export const RemoetSalarySchema = z
	.object({
		from: z.number().nullish(),
		to: z.number().nullish(),
		currency: z.string().nullish(),
		period: z.string().nullish(),
	})
	.loose();

export const RemoetJobContextMatchSchema = z
	.object({
		company: z.string(),
		companySlug: z.string(),
		/**
		 * When Remoet FIRST SAW the job, not when the company posted it. Read it
		 * as "at least n days old", never as "posted n days ago".
		 */
		firstSeenAt: IsoDateSchema,
		/** Whole days since Remoet first saw the job: a lower bound on its age. */
		daysSinceFirstSeen: z.number(),
		/** Always true: the posting may be older than Remoet's first sighting. */
		firstSeenAtIsCensored: z.boolean(),
		isActive: z.boolean(),
		deactivatedAt: IsoDateSchema.nullable(),
		reposts: z.array(RemoetJobRepostSchema),
		otherOpenRoles: z.number(),
		isStarred: z.boolean(),
		techStack: z.array(z.string()),
		remotePolicy: z.string().nullable(),
		remoteRestrictions: z.string().nullable(),
		salary: RemoetSalarySchema.nullable(),
		experienceLevel: z.string().nullable(),
		summary: z.string().nullable(),
	})
	.loose();

export type RemoetJobContextMatch = z.infer<typeof RemoetJobContextMatchSchema>;

/** `match` is null when Remoet does not track the page; that is not an error. */
export const JobContextGetResponseSchema = z
	.object({
		match: RemoetJobContextMatchSchema.nullable(),
	})
	.loose();
export type JobContextGetResponse = z.infer<typeof JobContextGetResponseSchema>;

// ── stars.create (POST /user/stars) ──────────────────────────────────────────

export const StarsCreateInputSchema = z.object({
	/** Slug of an active Remoet company, e.g. from jobContext.get. */
	companySlug: SlugSchema,
});
export type StarsCreateInput = z.input<typeof StarsCreateInputSchema>;

export const StarsCreateResponseSchema = z
	.object({
		company: z.string(),
	})
	.loose();
export type StarsCreateResponse = z.infer<typeof StarsCreateResponseSchema>;

// ── Discovery: shared inputs ─────────────────────────────────────────────────

/** Remoet's page number bound on every paginated list. */
const PageSchema = z.number().int().min(1).max(10_000);

/** A 24-character hex Remoet id. */
const RemoetIdSchema = z
	.string()
	.regex(/^[0-9a-fA-F]{24}$/, 'Must be a valid 24-character hex ID');

const FreeTextSchema = z.string().max(500);
const TechnologySchema = z.string().max(100);

export const RemoetRemotePolicySchema = z.enum([
	'onsite',
	'hybrid',
	'remote',
	'remote-restricted',
]);
export const RemoetExperienceLevelSchema = z.enum(['junior', 'mid', 'senior']);
const TechStackMatchSchema = z.enum(['any', 'all']);
const SortOrderSchema = z.enum(['asc', 'desc']);

/**
 * Remoet's REST rule for salaryMin, applied to the number as it is written into
 * the query string: up to 12 whole digits and at most four decimals, never
 * negative. Anything else is rejected by Remoet with 400.
 */
const SalaryMinSchema = z
	.number()
	.refine((n) => /^\d{1,12}(\.\d{1,4})?$/.test(String(n)), {
		message:
			'Must be a non-negative number with at most 12 digits and 4 decimals',
	});

// ── Discovery: shared outputs ────────────────────────────────────────────────

const ExperienceLevelCountsSchema = z
	.object({
		junior: z.number().nullish(),
		mid: z.number().nullish(),
		senior: z.number().nullish(),
	})
	.loose();

/** A company as it appears in a search result. */
export const RemoetCompanySummarySchema = z
	.object({
		id: z.string(),
		name: z.string(),
		slug: z.string(),
		url: z.string().nullish(),
		nbrOfStars: z.number().nullish(),
		jobCount: z.number().nullish(),
		/** A preview capped by Remoet; techStackCount is the full size. */
		techStack: z.array(z.string()).nullish(),
		matchedTechStack: z.array(z.string()).nullish(),
		techStackCount: z.number().nullish(),
		experienceLevels: ExperienceLevelCountsSchema.nullish(),
		shortDescription: z.string().nullish(),
		isStarred: z.boolean().nullish(),
		jobPreview: z.array(z.string()).nullish(),
	})
	.loose();

export type RemoetCompanySummary = z.infer<typeof RemoetCompanySummarySchema>;

/** A public job posting from Remoet's catalogue. */
export const RemoetJobPostingSchema = z
	.object({
		id: z.string(),
		title: z.string(),
		company: z.string(),
		companySlug: z.string(),
		url: z.string().nullish(),
		applyUrl: z.string().nullish(),
		companyUrl: z.string().nullish(),
		location: z.string().nullish(),
		remotePolicy: z.string().nullish(),
		remoteRestrictions: z.string().nullish(),
		experienceLevel: z.string().nullish(),
		salary: RemoetSalarySchema.nullish(),
		techStack: z.array(z.string()).nullish(),
		summary: z.string().nullish(),
		/** When Remoet first saw the role, not when the company posted it. */
		firstSeenAt: IsoDateSchema,
		lastVerifiedAt: IsoDateSchema.nullish(),
		duplicateCount: z.number().nullish(),
	})
	.loose();

export type RemoetJobPosting = z.infer<typeof RemoetJobPostingSchema>;

// ── jobs.search (GET /user/job-postings) ─────────────────────────────────────

export const JobsSearchInputSchema = z.object({
	/** Free text over title, summary and tech stack; commas require ALL words. */
	searchQuery: z.string().optional(),
	techStack: z.array(z.string()).optional(),
	techStackMatch: TechStackMatchSchema.optional(),
	companySlug: SlugSchema.optional(),
	remotePolicy: z.array(RemoetRemotePolicySchema).optional(),
	experienceLevel: z.array(RemoetExperienceLevelSchema).optional(),
	salaryMin: SalaryMinSchema.optional(),
	/** Place names; each may itself contain commas, e.g. "Portland, OR". */
	location: z.array(z.string()).optional(),
	sortBy: z.enum(['newest', 'salary']).optional(),
	sortOrder: SortOrderSchema.optional(),
	page: PageSchema.optional(),
	pageSize: z.number().int().min(1).max(50).optional(),
});
export type JobsSearchInput = z.input<typeof JobsSearchInputSchema>;

export const JobsSearchResponseSchema = z
	.object({
		jobs: z.array(RemoetJobPostingSchema),
		totalCount: z.number(),
		page: z.number(),
		pageSize: z.number(),
		totalPages: z.number(),
		hasNextPage: z.boolean(),
		/** Present on an empty result: which filter emptied it and what to try. */
		hint: z.string().nullish(),
	})
	.loose();
export type JobsSearchResponse = z.infer<typeof JobsSearchResponseSchema>;

// ── companies.search (GET /user/companies) ───────────────────────────────────

export const CompaniesSearchInputSchema = z.object({
	/** True lists the user's starred companies instead of searching. */
	starred: z.boolean().optional(),
	searchQuery: FreeTextSchema.optional(),
	techStack: z.array(TechnologySchema).optional(),
	techStackMatch: TechStackMatchSchema.optional(),
	experienceLevel: z.array(RemoetExperienceLevelSchema).optional(),
	sortBy: z.enum(['stars', 'jobCount', 'name']).optional(),
	page: PageSchema.optional(),
	pageSize: z.number().int().min(1).max(100).optional(),
});
export type CompaniesSearchInput = z.input<typeof CompaniesSearchInputSchema>;

/** Paging fields are absent in `starred: true` mode, which is not paginated. */
export const CompaniesSearchResponseSchema = z
	.object({
		listings: z.array(RemoetCompanySummarySchema),
		totalCount: z.number(),
		page: z.number().nullish(),
		pageSize: z.number().nullish(),
		totalPages: z.number().nullish(),
		hasNextPage: z.boolean().nullish(),
		starred: z.boolean().nullish(),
		hint: z.string().nullish(),
		note: z.string().nullish(),
	})
	.loose();
export type CompaniesSearchResponse = z.infer<
	typeof CompaniesSearchResponseSchema
>;

// ── companies.get (GET /user/companies/:slug) ────────────────────────────────

export const CompaniesGetInputSchema = z.object({
	slug: SlugSchema,
	/** Technologies to check against the company's full stack (max 50). */
	checkTechStack: z.array(TechnologySchema).max(50).optional(),
});
export type CompaniesGetInput = z.input<typeof CompaniesGetInputSchema>;

export const CompaniesGetResponseSchema = RemoetCompanySummarySchema.extend({
	about: z.string().nullish(),
	careersUrl: z.string().nullish(),
	verified: z.boolean().nullish(),
	urls: z.record(z.string(), z.string().nullish()).nullish(),
	perks: z
		.array(
			z
				.object({
					id: z.string().nullish(),
					title: z.string(),
					tags: z.array(z.string()).nullish(),
					description: z.string().nullish(),
					category: z.string().nullish(),
				})
				.loose(),
		)
		.nullish(),
	createdAt: IsoDateSchema.nullish(),
	updatedAt: IsoDateSchema.nullish(),
}).loose();
export type CompaniesGetResponse = z.infer<typeof CompaniesGetResponseSchema>;

// ── starredJobs.list (GET /user/starred-jobs) ────────────────────────────────

export const StarredJobsListInputSchema = z.object({
	searchQuery: FreeTextSchema.optional(),
	locationQuery: FreeTextSchema.optional(),
	techStack: z.array(TechnologySchema).optional(),
	techStackMatch: TechStackMatchSchema.optional(),
	remotePolicy: z.array(RemoetRemotePolicySchema).optional(),
	experienceLevel: z.array(RemoetExperienceLevelSchema).optional(),
	salaryMin: SalaryMinSchema.optional(),
	sortBy: z
		.enum([
			'createdAt',
			'remotePolicy',
			'salaryEnriched.from',
			'experienceLevel',
		])
		.optional(),
	sortOrder: SortOrderSchema.optional(),
	page: PageSchema.optional(),
	pageSize: z.number().int().min(1).max(50).optional(),
});
export type StarredJobsListInput = z.input<typeof StarredJobsListInputSchema>;

export const RemoetStarredJobSchema = z
	.object({
		id: z.string(),
		title: z.string(),
		url: z.string().nullish(),
		/** When Remoet first saw the role, not when the company posted it. */
		createdAt: IsoDateSchema,
		remotePolicy: z.string().nullish(),
		remoteRestrictions: z.string().nullish(),
		techStack: z.array(z.string()).nullish(),
		salaryEnriched: RemoetSalarySchema.nullish(),
		experienceLevel: z.string().nullish(),
		benefits: z.array(z.string()).nullish(),
		summary: z.string().nullish(),
		isOnPublishablePlatform: z.boolean().nullish(),
		listing: z
			.object({ id: z.string(), name: z.string(), slug: z.string() })
			.loose(),
		postingCount: z.number().nullish(),
		postingLocations: z.array(z.string()).nullish(),
	})
	.loose();
export type RemoetStarredJob = z.infer<typeof RemoetStarredJobSchema>;

export const StarredJobsListResponseSchema = z
	.object({
		jobs: z.array(RemoetStarredJobSchema),
		totalCount: z.number(),
		totalPages: z.number(),
		page: z.number(),
		pageSize: z.number(),
		hasNextPage: z.boolean(),
		/** Present when the user holds more stars than the cap allows. */
		starsOverCap: z
			.object({
				surplusStars: z.number(),
				maxActiveStars: z.number(),
				starsPendingDeletionAt: IsoDateSchema.nullish(),
				note: z.string(),
			})
			.loose()
			.nullish(),
	})
	.loose();
export type StarredJobsListResponse = z.infer<
	typeof StarredJobsListResponseSchema
>;

// ── savedJobs.* (/user/saved-jobs) ───────────────────────────────────────────

export const RemoetSavedJobDetailSchema = z
	.object({
		title: z.string(),
		listingId: z.string().nullish(),
		techStack: z.array(z.string()).nullish(),
		remotePolicy: z.string().nullish(),
		experienceLevel: z.string().nullish(),
		salaryMin: z.number().nullish(),
		salaryMax: z.number().nullish(),
		salaryCurrency: z.string().nullish(),
		applicationUrl: z.string().nullish(),
		isActive: z.boolean().nullish(),
		deactivatedAt: IsoDateSchema.nullish(),
	})
	.loose();

/**
 * A saved-job entry. A LOCKED entry has `job: null`, `locked: true` and a
 * `lockedReason` such as "Star Acme to see this job again.".
 */
export const RemoetSavedJobSchema = z
	.object({
		/** The saved-job entry id, used by savedJobs.update and savedJobs.delete. */
		id: z.string(),
		jobId: z.string(),
		jobType: z.string(),
		note: z.string().nullish(),
		savedAt: IsoDateSchema,
		job: RemoetSavedJobDetailSchema.nullable(),
		locked: z.boolean().optional(),
		lockedReason: z.string().optional(),
	})
	.loose();
export type RemoetSavedJob = z.infer<typeof RemoetSavedJobSchema>;

export const SavedJobsListInputSchema = z.object({
	page: PageSchema.optional(),
	pageSize: z.number().int().min(1).max(50).optional(),
});
export type SavedJobsListInput = z.input<typeof SavedJobsListInputSchema>;

export const SavedJobsListResponseSchema = z
	.object({
		items: z.array(RemoetSavedJobSchema),
		totalCount: z.number(),
		page: z.number(),
		pageSize: z.number(),
		totalPages: z.number(),
		hasNextPage: z.boolean(),
	})
	.loose();
export type SavedJobsListResponse = z.infer<typeof SavedJobsListResponseSchema>;

export const SavedJobsCreateInputSchema = z.object({
	/** Id of the job, e.g. from jobs.search or starredJobs.list. */
	jobId: RemoetIdSchema,
	/** "ai_job" (the default) or "listing_job". */
	jobType: z.enum(['ai_job', 'listing_job']).optional(),
	note: z.string().max(500).nullable().optional(),
});
export type SavedJobsCreateInput = z.input<typeof SavedJobsCreateInputSchema>;

export const SavedJobsCreateResponseSchema = RemoetSavedJobSchema;
export type SavedJobsCreateResponse = z.infer<
	typeof SavedJobsCreateResponseSchema
>;

export const SavedJobsUpdateInputSchema = z.object({
	/** The saved-job entry id, not the job id. */
	savedJobId: RemoetIdSchema,
	/** The new note, or null to clear it. */
	note: z.string().max(500).nullable(),
});
export type SavedJobsUpdateInput = z.input<typeof SavedJobsUpdateInputSchema>;

export const SavedJobsUpdateResponseSchema = RemoetSavedJobSchema;
export type SavedJobsUpdateResponse = z.infer<
	typeof SavedJobsUpdateResponseSchema
>;

export const SavedJobsDeleteInputSchema = z.object({
	/** The saved-job entry id, not the job id. */
	savedJobId: RemoetIdSchema,
});
export type SavedJobsDeleteInput = z.input<typeof SavedJobsDeleteInputSchema>;

export const SavedJobsDeleteResponseSchema = z
	.object({
		deleted: z.boolean(),
		id: z.string(),
	})
	.loose();
export type SavedJobsDeleteResponse = z.infer<
	typeof SavedJobsDeleteResponseSchema
>;

// ── stars.delete (DELETE /user/stars/:companySlug) ───────────────────────────

export const StarsDeleteInputSchema = z.object({
	companySlug: SlugSchema,
});
export type StarsDeleteInput = z.input<typeof StarsDeleteInputSchema>;

export const StarsDeleteResponseSchema = z
	.object({
		company: z.string(),
	})
	.loose();
export type StarsDeleteResponse = z.infer<typeof StarsDeleteResponseSchema>;

// ── Endpoint maps ────────────────────────────────────────────────────────────

export type RemoetEndpointInputs = {
	profileGet: ProfileGetInput;
	profileGetLinks: ProfileGetLinksInput;
	profileUpdate: ProfileUpdateInput;
	workExperienceList: WorkExperienceListInput;
	projectsList: ProjectsListInput;
	educationList: EducationListInput;
	linkTreesList: LinkTreesListInput;
	linkTreesGet: LinkTreesGetInput;
	jobContextGet: JobContextGetInput;
	starsCreate: StarsCreateInput;
	jobsSearch: JobsSearchInput;
	companiesSearch: CompaniesSearchInput;
	companiesGet: CompaniesGetInput;
	starredJobsList: StarredJobsListInput;
	savedJobsList: SavedJobsListInput;
	savedJobsCreate: SavedJobsCreateInput;
	savedJobsUpdate: SavedJobsUpdateInput;
	savedJobsDelete: SavedJobsDeleteInput;
	starsDelete: StarsDeleteInput;
};

export type RemoetEndpointOutputs = {
	profileGet: ProfileGetResponse;
	profileGetLinks: ProfileGetLinksResponse;
	profileUpdate: ProfileUpdateResponse;
	workExperienceList: WorkExperienceListResponse;
	projectsList: ProjectsListResponse;
	educationList: EducationListResponse;
	linkTreesList: LinkTreesListResponse;
	linkTreesGet: LinkTreesGetResponse;
	jobContextGet: JobContextGetResponse;
	starsCreate: StarsCreateResponse;
	jobsSearch: JobsSearchResponse;
	companiesSearch: CompaniesSearchResponse;
	companiesGet: CompaniesGetResponse;
	starredJobsList: StarredJobsListResponse;
	savedJobsList: SavedJobsListResponse;
	savedJobsCreate: SavedJobsCreateResponse;
	savedJobsUpdate: SavedJobsUpdateResponse;
	savedJobsDelete: SavedJobsDeleteResponse;
	starsDelete: StarsDeleteResponse;
};

export const RemoetEndpointInputSchemas = {
	profileGet: ProfileGetInputSchema,
	profileGetLinks: ProfileGetLinksInputSchema,
	profileUpdate: ProfileUpdateInputSchema,
	workExperienceList: WorkExperienceListInputSchema,
	projectsList: ProjectsListInputSchema,
	educationList: EducationListInputSchema,
	linkTreesList: LinkTreesListInputSchema,
	linkTreesGet: LinkTreesGetInputSchema,
	jobContextGet: JobContextGetInputSchema,
	starsCreate: StarsCreateInputSchema,
	jobsSearch: JobsSearchInputSchema,
	companiesSearch: CompaniesSearchInputSchema,
	companiesGet: CompaniesGetInputSchema,
	starredJobsList: StarredJobsListInputSchema,
	savedJobsList: SavedJobsListInputSchema,
	savedJobsCreate: SavedJobsCreateInputSchema,
	savedJobsUpdate: SavedJobsUpdateInputSchema,
	savedJobsDelete: SavedJobsDeleteInputSchema,
	starsDelete: StarsDeleteInputSchema,
} as const;

export const RemoetEndpointOutputSchemas = {
	profileGet: ProfileGetResponseSchema,
	profileGetLinks: ProfileGetLinksResponseSchema,
	profileUpdate: ProfileUpdateResponseSchema,
	workExperienceList: WorkExperienceListResponseSchema,
	projectsList: ProjectsListResponseSchema,
	educationList: EducationListResponseSchema,
	linkTreesList: LinkTreesListResponseSchema,
	linkTreesGet: LinkTreesGetResponseSchema,
	jobContextGet: JobContextGetResponseSchema,
	starsCreate: StarsCreateResponseSchema,
	jobsSearch: JobsSearchResponseSchema,
	companiesSearch: CompaniesSearchResponseSchema,
	companiesGet: CompaniesGetResponseSchema,
	starredJobsList: StarredJobsListResponseSchema,
	savedJobsList: SavedJobsListResponseSchema,
	savedJobsCreate: SavedJobsCreateResponseSchema,
	savedJobsUpdate: SavedJobsUpdateResponseSchema,
	savedJobsDelete: SavedJobsDeleteResponseSchema,
	starsDelete: StarsDeleteResponseSchema,
} as const;
