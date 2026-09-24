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
		from: z.number().nullable(),
		to: z.number().nullable(),
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
	companySlug: z.string().trim().min(1),
});
export type StarsCreateInput = z.input<typeof StarsCreateInputSchema>;

export const StarsCreateResponseSchema = z
	.object({
		company: z.string(),
	})
	.loose();
export type StarsCreateResponse = z.infer<typeof StarsCreateResponseSchema>;

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
} as const;
