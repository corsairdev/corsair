import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// Shared / Base Schemas
// ─────────────────────────────────────────────────────────────────────────────

export const AshbyPaginationInputSchema = z.object({
	limit: z.number().int().min(1).max(100).optional(),
	cursor: z.string().optional(),
	syncToken: z.string().optional(),
});
export type AshbyPaginationInput = z.infer<typeof AshbyPaginationInputSchema>;

export const AshbyContactInfoSchema = z.object({
	value: z.string(),
	type: z.string().optional(),
	isPrimary: z.boolean().optional(),
});
export type AshbyContactInfo = z.infer<typeof AshbyContactInfoSchema>;

export const AshbySocialLinkSchema = z.object({
	url: z.string(),
	type: z.string().optional(),
});
export type AshbySocialLink = z.infer<typeof AshbySocialLinkSchema>;

export const AshbyFileSchema = z.object({
	id: z.string(),
	name: z.string(),
	handle: z.string().optional(),
	mimeType: z.string().optional(),
	createdAt: z.string().optional(),
});
export type AshbyFile = z.infer<typeof AshbyFileSchema>;

export const AshbyCustomFieldValueSchema = z.object({
	value: z.unknown(),
	customFieldDefinitionId: z.string(),
	title: z.string().optional(),
});
export type AshbyCustomFieldValue = z.infer<typeof AshbyCustomFieldValueSchema>;

export const AshbyHiringTeamMemberSchema = z.object({
	userId: z.string(),
	role: z.string(),
	firstName: z.string().optional(),
	lastName: z.string().optional(),
	email: z.string().optional(),
});
export type AshbyHiringTeamMember = z.infer<typeof AshbyHiringTeamMemberSchema>;

function makeListResponseSchema<T extends z.ZodTypeAny>(itemSchema: T) {
	return z.object({
		success: z.boolean(),
		results: z.array(itemSchema),
		moreDataAvailable: z.boolean().optional(),
		nextCursor: z.string().optional(),
		syncToken: z.string().optional(),
	});
}

function makeSingleResponseSchema<T extends z.ZodTypeAny>(itemSchema: T) {
	return z.object({
		success: z.boolean(),
		results: itemSchema,
	});
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. Candidate Schemas
// ─────────────────────────────────────────────────────────────────────────────

export const AshbyCandidateSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		primaryEmailAddress: AshbyContactInfoSchema.nullable().optional(),
		emailAddresses: z.array(AshbyContactInfoSchema).optional(),
		primaryPhoneNumber: AshbyContactInfoSchema.nullable().optional(),
		phoneNumbers: z.array(AshbyContactInfoSchema).optional(),
		socialLinks: z.array(AshbySocialLinkSchema).optional(),
		tags: z.array(z.string()).optional(),
		customFields: z.array(AshbyCustomFieldValueSchema).optional(),
		applicationIds: z.array(z.string()).optional(),
		fileIds: z.array(z.string()).optional(),
		createdAt: z.string().optional(),
		updatedAt: z.string().optional(),
		anonymizedAt: z.string().nullable().optional(),
	})
	.loose();
export type AshbyCandidate = z.infer<typeof AshbyCandidateSchema>;

export const AshbyCandidateNoteSchema = z
	.object({
		id: z.string(),
		candidateId: z.string(),
		note: z.string(),
		authorUserId: z.string().optional(),
		createdAt: z.string().optional(),
	})
	.loose();
export type AshbyCandidateNote = z.infer<typeof AshbyCandidateNoteSchema>;

export const CandidateInfoInputSchema = z.object({
	candidateId: z.string(),
});
export type CandidateInfoInput = z.infer<typeof CandidateInfoInputSchema>;
export const CandidateInfoResponseSchema =
	makeSingleResponseSchema(AshbyCandidateSchema);
export type CandidateInfoResponse = z.infer<typeof CandidateInfoResponseSchema>;

export const CandidateListInputSchema = AshbyPaginationInputSchema.extend({
	createdAfter: z.string().optional(),
	updatedAfter: z.string().optional(),
});
export type CandidateListInput = z.infer<typeof CandidateListInputSchema>;
export const CandidateListResponseSchema =
	makeListResponseSchema(AshbyCandidateSchema);
export type CandidateListResponse = z.infer<typeof CandidateListResponseSchema>;

export const CandidateSearchInputSchema = z.object({
	email: z.string().optional(),
	name: z.string().optional(),
	phone: z.string().optional(),
});
export type CandidateSearchInput = z.infer<typeof CandidateSearchInputSchema>;
export const CandidateSearchResponseSchema = makeSingleResponseSchema(
	z.array(AshbyCandidateSchema),
);
export type CandidateSearchResponse = z.infer<
	typeof CandidateSearchResponseSchema
>;

export const CandidateCreateInputSchema = z.object({
	name: z.string(),
	email: z.string().optional(),
	phoneNumber: z.string().optional(),
	socialLinks: z.array(AshbySocialLinkSchema).optional(),
	tags: z.array(z.string()).optional(),
	customFields: z.array(AshbyCustomFieldValueSchema).optional(),
	notes: z.string().optional(),
});
export type CandidateCreateInput = z.infer<typeof CandidateCreateInputSchema>;
export const CandidateCreateResponseSchema =
	makeSingleResponseSchema(AshbyCandidateSchema);
export type CandidateCreateResponse = z.infer<
	typeof CandidateCreateResponseSchema
>;

export const CandidateUpdateInputSchema = z.object({
	candidateId: z.string(),
	name: z.string().optional(),
	primaryEmailAddress: z.string().optional(),
	primaryPhoneNumber: z.string().optional(),
	tags: z.array(z.string()).optional(),
	customFields: z.array(AshbyCustomFieldValueSchema).optional(),
});
export type CandidateUpdateInput = z.infer<typeof CandidateUpdateInputSchema>;
export const CandidateUpdateResponseSchema =
	makeSingleResponseSchema(AshbyCandidateSchema);
export type CandidateUpdateResponse = z.infer<
	typeof CandidateUpdateResponseSchema
>;

export const CandidateAddTagInputSchema = z.object({
	candidateId: z.string(),
	tag: z.string(),
});
export type CandidateAddTagInput = z.infer<typeof CandidateAddTagInputSchema>;
export const CandidateAddTagResponseSchema =
	makeSingleResponseSchema(AshbyCandidateSchema);
export type CandidateAddTagResponse = z.infer<
	typeof CandidateAddTagResponseSchema
>;

export const CandidateRemoveTagInputSchema = z.object({
	candidateId: z.string(),
	tag: z.string(),
});
export type CandidateRemoveTagInput = z.infer<
	typeof CandidateRemoveTagInputSchema
>;
export const CandidateRemoveTagResponseSchema =
	makeSingleResponseSchema(AshbyCandidateSchema);
export type CandidateRemoveTagResponse = z.infer<
	typeof CandidateRemoveTagResponseSchema
>;

export const CandidateCreateNoteInputSchema = z.object({
	candidateId: z.string(),
	note: z.string(),
});
export type CandidateCreateNoteInput = z.infer<
	typeof CandidateCreateNoteInputSchema
>;
export const CandidateCreateNoteResponseSchema = makeSingleResponseSchema(
	AshbyCandidateNoteSchema,
);
export type CandidateCreateNoteResponse = z.infer<
	typeof CandidateCreateNoteResponseSchema
>;

export const CandidateListNotesInputSchema = z.object({
	candidateId: z.string(),
});
export type CandidateListNotesInput = z.infer<
	typeof CandidateListNotesInputSchema
>;
export const CandidateListNotesResponseSchema = makeSingleResponseSchema(
	z.array(AshbyCandidateNoteSchema),
);
export type CandidateListNotesResponse = z.infer<
	typeof CandidateListNotesResponseSchema
>;

export const CandidateAnonymizeInputSchema = z.object({
	candidateId: z.string(),
});
export type CandidateAnonymizeInput = z.infer<
	typeof CandidateAnonymizeInputSchema
>;
export const CandidateAnonymizeResponseSchema = z.object({
	success: z.boolean(),
	results: z
		.object({
			candidateId: z.string(),
			anonymizedAt: z.string().optional(),
		})
		.loose(),
});
export type CandidateAnonymizeResponse = z.infer<
	typeof CandidateAnonymizeResponseSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// 2. Application Schemas
// ─────────────────────────────────────────────────────────────────────────────

export const AshbyApplicationSchema = z
	.object({
		id: z.string(),
		candidateId: z.string(),
		jobId: z.string(),
		status: z.string().optional(),
		currentInterviewStageId: z.string().nullable().optional(),
		archiveReasonId: z.string().nullable().optional(),
		customFields: z.array(AshbyCustomFieldValueSchema).optional(),
		hiringTeam: z.array(AshbyHiringTeamMemberSchema).optional(),
		createdAt: z.string().optional(),
		updatedAt: z.string().optional(),
	})
	.loose();
export type AshbyApplication = z.infer<typeof AshbyApplicationSchema>;

export const ApplicationInfoInputSchema = z.object({
	applicationId: z.string(),
});
export type ApplicationInfoInput = z.infer<typeof ApplicationInfoInputSchema>;
export const ApplicationInfoResponseSchema = makeSingleResponseSchema(
	AshbyApplicationSchema,
);
export type ApplicationInfoResponse = z.infer<
	typeof ApplicationInfoResponseSchema
>;

export const ApplicationListInputSchema = AshbyPaginationInputSchema.extend({
	candidateId: z.string().optional(),
	jobId: z.string().optional(),
	status: z.string().optional(),
});
export type ApplicationListInput = z.infer<typeof ApplicationListInputSchema>;
export const ApplicationListResponseSchema = makeListResponseSchema(
	AshbyApplicationSchema,
);
export type ApplicationListResponse = z.infer<
	typeof ApplicationListResponseSchema
>;

export const ApplicationCreateInputSchema = z.object({
	candidateId: z.string(),
	jobId: z.string(),
	interviewStageId: z.string().optional(),
	sourceId: z.string().optional(),
	customFields: z.array(AshbyCustomFieldValueSchema).optional(),
});
export type ApplicationCreateInput = z.infer<
	typeof ApplicationCreateInputSchema
>;
export const ApplicationCreateResponseSchema = makeSingleResponseSchema(
	AshbyApplicationSchema,
);
export type ApplicationCreateResponse = z.infer<
	typeof ApplicationCreateResponseSchema
>;

export const ApplicationChangeStageInputSchema = z.object({
	applicationId: z.string(),
	interviewStageId: z.string(),
	archiveReasonId: z.string().optional(),
});
export type ApplicationChangeStageInput = z.infer<
	typeof ApplicationChangeStageInputSchema
>;
export const ApplicationChangeStageResponseSchema = makeSingleResponseSchema(
	AshbyApplicationSchema,
);
export type ApplicationChangeStageResponse = z.infer<
	typeof ApplicationChangeStageResponseSchema
>;

export const ApplicationUpdateInputSchema = z.object({
	applicationId: z.string(),
	archiveReasonId: z.string().optional(),
	customFields: z.array(AshbyCustomFieldValueSchema).optional(),
});
export type ApplicationUpdateInput = z.infer<
	typeof ApplicationUpdateInputSchema
>;
export const ApplicationUpdateResponseSchema = makeSingleResponseSchema(
	AshbyApplicationSchema,
);
export type ApplicationUpdateResponse = z.infer<
	typeof ApplicationUpdateResponseSchema
>;

export const ApplicationTransferInputSchema = z.object({
	applicationId: z.string(),
	jobId: z.string(),
	interviewStageId: z.string().optional(),
});
export type ApplicationTransferInput = z.infer<
	typeof ApplicationTransferInputSchema
>;
export const ApplicationTransferResponseSchema = makeSingleResponseSchema(
	AshbyApplicationSchema,
);
export type ApplicationTransferResponse = z.infer<
	typeof ApplicationTransferResponseSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// 3. Job Schemas
// ─────────────────────────────────────────────────────────────────────────────

export const AshbyJobOpeningSchema = z
	.object({
		id: z.string(),
		identifier: z.string().optional(),
		isArchived: z.boolean().optional(),
		targetStartDate: z.string().nullable().optional(),
	})
	.loose();
export type AshbyJobOpening = z.infer<typeof AshbyJobOpeningSchema>;

export const AshbyJobSchema = z
	.object({
		id: z.string(),
		title: z.string(),
		status: z.string().optional(),
		departmentId: z.string().nullable().optional(),
		locationId: z.string().nullable().optional(),
		hiringTeam: z.array(AshbyHiringTeamMemberSchema).optional(),
		customFields: z.array(AshbyCustomFieldValueSchema).optional(),
		openings: z.array(AshbyJobOpeningSchema).optional(),
		createdAt: z.string().optional(),
		updatedAt: z.string().optional(),
	})
	.loose();
export type AshbyJob = z.infer<typeof AshbyJobSchema>;

export const JobInfoInputSchema = z.object({
	jobId: z.string(),
});
export type JobInfoInput = z.infer<typeof JobInfoInputSchema>;
export const JobInfoResponseSchema = makeSingleResponseSchema(AshbyJobSchema);
export type JobInfoResponse = z.infer<typeof JobInfoResponseSchema>;

export const JobListInputSchema = AshbyPaginationInputSchema.extend({
	status: z.string().optional(),
	departmentId: z.string().optional(),
	locationId: z.string().optional(),
});
export type JobListInput = z.infer<typeof JobListInputSchema>;
export const JobListResponseSchema = makeListResponseSchema(AshbyJobSchema);
export type JobListResponse = z.infer<typeof JobListResponseSchema>;

export const JobCreateInputSchema = z.object({
	title: z.string(),
	departmentId: z.string().optional(),
	locationId: z.string().optional(),
	status: z.string().optional(),
	customFields: z.array(AshbyCustomFieldValueSchema).optional(),
});
export type JobCreateInput = z.infer<typeof JobCreateInputSchema>;
export const JobCreateResponseSchema = makeSingleResponseSchema(AshbyJobSchema);
export type JobCreateResponse = z.infer<typeof JobCreateResponseSchema>;

export const JobUpdateInputSchema = z.object({
	jobId: z.string(),
	title: z.string().optional(),
	departmentId: z.string().optional(),
	locationId: z.string().optional(),
	status: z.string().optional(),
	customFields: z.array(AshbyCustomFieldValueSchema).optional(),
});
export type JobUpdateInput = z.infer<typeof JobUpdateInputSchema>;
export const JobUpdateResponseSchema = makeSingleResponseSchema(AshbyJobSchema);
export type JobUpdateResponse = z.infer<typeof JobUpdateResponseSchema>;

export const JobSearchInputSchema = z.object({
	title: z.string().optional(),
	status: z.string().optional(),
});
export type JobSearchInput = z.infer<typeof JobSearchInputSchema>;
export const JobSearchResponseSchema = makeSingleResponseSchema(
	z.array(AshbyJobSchema),
);
export type JobSearchResponse = z.infer<typeof JobSearchResponseSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// 4. Job Posting Schemas
// ─────────────────────────────────────────────────────────────────────────────

export const AshbyJobPostingSchema = z
	.object({
		id: z.string(),
		title: z.string(),
		jobId: z.string(),
		departmentId: z.string().nullable().optional(),
		locationId: z.string().nullable().optional(),
		secondaryLocationIds: z.array(z.string()).optional(),
		isListed: z.boolean().optional(),
		publishedDate: z.string().nullable().optional(),
		teamNameHierarchy: z.array(z.string()).optional(),
		descriptionHtml: z.string().optional(),
	})
	.loose();
export type AshbyJobPosting = z.infer<typeof AshbyJobPostingSchema>;

export const JobPostingInfoInputSchema = z.object({
	jobPostingId: z.string(),
});
export type JobPostingInfoInput = z.infer<typeof JobPostingInfoInputSchema>;
export const JobPostingInfoResponseSchema = makeSingleResponseSchema(
	AshbyJobPostingSchema,
);
export type JobPostingInfoResponse = z.infer<
	typeof JobPostingInfoResponseSchema
>;

export const JobPostingListInputSchema = AshbyPaginationInputSchema.extend({
	jobId: z.string().optional(),
	departmentId: z.string().optional(),
	locationId: z.string().optional(),
	listedOnly: z.boolean().optional(),
});
export type JobPostingListInput = z.infer<typeof JobPostingListInputSchema>;
export const JobPostingListResponseSchema = makeListResponseSchema(
	AshbyJobPostingSchema,
);
export type JobPostingListResponse = z.infer<
	typeof JobPostingListResponseSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// 5. Interview Schemas
// ─────────────────────────────────────────────────────────────────────────────

export const AshbyInterviewStageSchema = z
	.object({
		id: z.string(),
		title: z.string(),
		type: z.string().optional(),
		orderInJob: z.number().optional(),
		jobId: z.string().optional(),
	})
	.loose();
export type AshbyInterviewStage = z.infer<typeof AshbyInterviewStageSchema>;

export const AshbyInterviewScheduleSchema = z
	.object({
		id: z.string(),
		applicationId: z.string(),
		interviewStageId: z.string().optional(),
		scheduledStartTime: z.string().nullable().optional(),
		scheduledEndTime: z.string().nullable().optional(),
		status: z.string().optional(),
		interviewers: z.array(z.object({ userId: z.string() }).loose()).optional(),
	})
	.loose();
export type AshbyInterviewSchedule = z.infer<
	typeof AshbyInterviewScheduleSchema
>;

export const AshbyInterviewSchema = z
	.object({
		id: z.string(),
		title: z.string(),
		interviewStageId: z.string().optional(),
		interviewPlanId: z.string().optional(),
	})
	.loose();
export type AshbyInterview = z.infer<typeof AshbyInterviewSchema>;

export const InterviewInfoInputSchema = z.object({
	interviewId: z.string(),
});
export type InterviewInfoInput = z.infer<typeof InterviewInfoInputSchema>;
export const InterviewInfoResponseSchema =
	makeSingleResponseSchema(AshbyInterviewSchema);
export type InterviewInfoResponse = z.infer<typeof InterviewInfoResponseSchema>;

export const InterviewListInputSchema = AshbyPaginationInputSchema.extend({
	interviewPlanId: z.string().optional(),
});
export type InterviewListInput = z.infer<typeof InterviewListInputSchema>;
export const InterviewListResponseSchema =
	makeListResponseSchema(AshbyInterviewSchema);
export type InterviewListResponse = z.infer<typeof InterviewListResponseSchema>;

export const InterviewScheduleInfoInputSchema = z.object({
	interviewScheduleId: z.string(),
});
export type InterviewScheduleInfoInput = z.infer<
	typeof InterviewScheduleInfoInputSchema
>;
export const InterviewScheduleInfoResponseSchema = makeSingleResponseSchema(
	AshbyInterviewScheduleSchema,
);
export type InterviewScheduleInfoResponse = z.infer<
	typeof InterviewScheduleInfoResponseSchema
>;

export const InterviewScheduleListInputSchema =
	AshbyPaginationInputSchema.extend({
		applicationId: z.string().optional(),
	});
export type InterviewScheduleListInput = z.infer<
	typeof InterviewScheduleListInputSchema
>;
export const InterviewScheduleListResponseSchema = makeListResponseSchema(
	AshbyInterviewScheduleSchema,
);
export type InterviewScheduleListResponse = z.infer<
	typeof InterviewScheduleListResponseSchema
>;

export const InterviewStageListInputSchema = z.object({
	jobId: z.string().optional(),
	interviewPlanId: z.string().optional(),
});
export type InterviewStageListInput = z.infer<
	typeof InterviewStageListInputSchema
>;
export const InterviewStageListResponseSchema = makeSingleResponseSchema(
	z.array(AshbyInterviewStageSchema),
);
export type InterviewStageListResponse = z.infer<
	typeof InterviewStageListResponseSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// 6. Offer Schemas
// ─────────────────────────────────────────────────────────────────────────────

export const AshbyOfferSchema = z
	.object({
		id: z.string(),
		applicationId: z.string(),
		status: z.string().optional(),
		salary: z.number().nullable().optional(),
		currency: z.string().nullable().optional(),
		startDate: z.string().nullable().optional(),
		customFields: z.array(AshbyCustomFieldValueSchema).optional(),
		createdAt: z.string().optional(),
		updatedAt: z.string().optional(),
	})
	.loose();
export type AshbyOffer = z.infer<typeof AshbyOfferSchema>;

export const OfferInfoInputSchema = z.object({
	offerId: z.string(),
});
export type OfferInfoInput = z.infer<typeof OfferInfoInputSchema>;
export const OfferInfoResponseSchema =
	makeSingleResponseSchema(AshbyOfferSchema);
export type OfferInfoResponse = z.infer<typeof OfferInfoResponseSchema>;

export const OfferListInputSchema = AshbyPaginationInputSchema.extend({
	applicationId: z.string().optional(),
	status: z.string().optional(),
});
export type OfferListInput = z.infer<typeof OfferListInputSchema>;
export const OfferListResponseSchema = makeListResponseSchema(AshbyOfferSchema);
export type OfferListResponse = z.infer<typeof OfferListResponseSchema>;

export const OfferCreateInputSchema = z.object({
	applicationId: z.string(),
	salary: z.number().optional(),
	currency: z.string().optional(),
	startDate: z.string().optional(),
	customFields: z.array(AshbyCustomFieldValueSchema).optional(),
});
export type OfferCreateInput = z.infer<typeof OfferCreateInputSchema>;
export const OfferCreateResponseSchema =
	makeSingleResponseSchema(AshbyOfferSchema);
export type OfferCreateResponse = z.infer<typeof OfferCreateResponseSchema>;

export const OfferUpdateInputSchema = z.object({
	offerId: z.string(),
	salary: z.number().optional(),
	currency: z.string().optional(),
	startDate: z.string().optional(),
	status: z.string().optional(),
	customFields: z.array(AshbyCustomFieldValueSchema).optional(),
});
export type OfferUpdateInput = z.infer<typeof OfferUpdateInputSchema>;
export const OfferUpdateResponseSchema =
	makeSingleResponseSchema(AshbyOfferSchema);
export type OfferUpdateResponse = z.infer<typeof OfferUpdateResponseSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// 7. Department Schemas
// ─────────────────────────────────────────────────────────────────────────────

export const AshbyDepartmentSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		parentId: z.string().nullable().optional(),
		isArchived: z.boolean().optional(),
	})
	.loose();
export type AshbyDepartment = z.infer<typeof AshbyDepartmentSchema>;

export const DepartmentInfoInputSchema = z.object({
	departmentId: z.string(),
});
export type DepartmentInfoInput = z.infer<typeof DepartmentInfoInputSchema>;
export const DepartmentInfoResponseSchema = makeSingleResponseSchema(
	AshbyDepartmentSchema,
);
export type DepartmentInfoResponse = z.infer<
	typeof DepartmentInfoResponseSchema
>;

export const DepartmentListInputSchema = AshbyPaginationInputSchema.extend({
	includeArchived: z.boolean().optional(),
});
export type DepartmentListInput = z.infer<typeof DepartmentListInputSchema>;
export const DepartmentListResponseSchema = makeListResponseSchema(
	AshbyDepartmentSchema,
);
export type DepartmentListResponse = z.infer<
	typeof DepartmentListResponseSchema
>;

export const DepartmentCreateInputSchema = z.object({
	name: z.string(),
	parentId: z.string().optional(),
});
export type DepartmentCreateInput = z.infer<typeof DepartmentCreateInputSchema>;
export const DepartmentCreateResponseSchema = makeSingleResponseSchema(
	AshbyDepartmentSchema,
);
export type DepartmentCreateResponse = z.infer<
	typeof DepartmentCreateResponseSchema
>;

export const DepartmentUpdateInputSchema = z.object({
	departmentId: z.string(),
	name: z.string().optional(),
	parentId: z.string().optional(),
});
export type DepartmentUpdateInput = z.infer<typeof DepartmentUpdateInputSchema>;
export const DepartmentUpdateResponseSchema = makeSingleResponseSchema(
	AshbyDepartmentSchema,
);
export type DepartmentUpdateResponse = z.infer<
	typeof DepartmentUpdateResponseSchema
>;

export const DepartmentArchiveInputSchema = z.object({
	departmentId: z.string(),
});
export type DepartmentArchiveInput = z.infer<
	typeof DepartmentArchiveInputSchema
>;
export const DepartmentArchiveResponseSchema = makeSingleResponseSchema(
	AshbyDepartmentSchema,
);
export type DepartmentArchiveResponse = z.infer<
	typeof DepartmentArchiveResponseSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// 8. Location Schemas
// ─────────────────────────────────────────────────────────────────────────────

export const AshbyLocationSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		parentId: z.string().nullable().optional(),
		isArchived: z.boolean().optional(),
	})
	.loose();
export type AshbyLocation = z.infer<typeof AshbyLocationSchema>;

export const LocationInfoInputSchema = z.object({
	locationId: z.string(),
});
export type LocationInfoInput = z.infer<typeof LocationInfoInputSchema>;
export const LocationInfoResponseSchema =
	makeSingleResponseSchema(AshbyLocationSchema);
export type LocationInfoResponse = z.infer<typeof LocationInfoResponseSchema>;

export const LocationListInputSchema = AshbyPaginationInputSchema.extend({
	includeArchived: z.boolean().optional(),
});
export type LocationListInput = z.infer<typeof LocationListInputSchema>;
export const LocationListResponseSchema =
	makeListResponseSchema(AshbyLocationSchema);
export type LocationListResponse = z.infer<typeof LocationListResponseSchema>;

export const LocationCreateInputSchema = z.object({
	name: z.string(),
	parentId: z.string().optional(),
});
export type LocationCreateInput = z.infer<typeof LocationCreateInputSchema>;
export const LocationCreateResponseSchema =
	makeSingleResponseSchema(AshbyLocationSchema);
export type LocationCreateResponse = z.infer<
	typeof LocationCreateResponseSchema
>;

export const LocationUpdateInputSchema = z.object({
	locationId: z.string(),
	name: z.string().optional(),
	parentId: z.string().optional(),
});
export type LocationUpdateInput = z.infer<typeof LocationUpdateInputSchema>;
export const LocationUpdateResponseSchema =
	makeSingleResponseSchema(AshbyLocationSchema);
export type LocationUpdateResponse = z.infer<
	typeof LocationUpdateResponseSchema
>;

export const LocationArchiveInputSchema = z.object({
	locationId: z.string(),
});
export type LocationArchiveInput = z.infer<typeof LocationArchiveInputSchema>;
export const LocationArchiveResponseSchema =
	makeSingleResponseSchema(AshbyLocationSchema);
export type LocationArchiveResponse = z.infer<
	typeof LocationArchiveResponseSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// 9. User Schemas
// ─────────────────────────────────────────────────────────────────────────────

export const AshbyUserSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		email: z.string(),
		globalRole: z.string().optional(),
		isEnabled: z.boolean().optional(),
	})
	.loose();
export type AshbyUser = z.infer<typeof AshbyUserSchema>;

export const UserInfoInputSchema = z.object({
	userId: z.string(),
});
export type UserInfoInput = z.infer<typeof UserInfoInputSchema>;
export const UserInfoResponseSchema = makeSingleResponseSchema(AshbyUserSchema);
export type UserInfoResponse = z.infer<typeof UserInfoResponseSchema>;

export const UserListInputSchema = AshbyPaginationInputSchema.extend({
	isEnabled: z.boolean().optional(),
});
export type UserListInput = z.infer<typeof UserListInputSchema>;
export const UserListResponseSchema = makeListResponseSchema(AshbyUserSchema);
export type UserListResponse = z.infer<typeof UserListResponseSchema>;

export const UserSearchInputSchema = z.object({
	email: z.string().optional(),
	name: z.string().optional(),
});
export type UserSearchInput = z.infer<typeof UserSearchInputSchema>;
export const UserSearchResponseSchema = makeSingleResponseSchema(
	z.array(AshbyUserSchema),
);
export type UserSearchResponse = z.infer<typeof UserSearchResponseSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// 10. Custom Field Schemas
// ─────────────────────────────────────────────────────────────────────────────

export const AshbyCustomFieldDefinitionSchema = z
	.object({
		id: z.string(),
		title: z.string(),
		objectType: z.string(),
		fieldType: z.string(),
		isArchived: z.boolean().optional(),
	})
	.loose();
export type AshbyCustomFieldDefinition = z.infer<
	typeof AshbyCustomFieldDefinitionSchema
>;

export const CustomFieldInfoInputSchema = z.object({
	customFieldDefinitionId: z.string(),
});
export type CustomFieldInfoInput = z.infer<typeof CustomFieldInfoInputSchema>;
export const CustomFieldInfoResponseSchema = makeSingleResponseSchema(
	AshbyCustomFieldDefinitionSchema,
);
export type CustomFieldInfoResponse = z.infer<
	typeof CustomFieldInfoResponseSchema
>;

export const CustomFieldListInputSchema = AshbyPaginationInputSchema.extend({
	objectType: z.string().optional(),
});
export type CustomFieldListInput = z.infer<typeof CustomFieldListInputSchema>;
export const CustomFieldListResponseSchema = makeListResponseSchema(
	AshbyCustomFieldDefinitionSchema,
);
export type CustomFieldListResponse = z.infer<
	typeof CustomFieldListResponseSchema
>;

export const CustomFieldSetValueInputSchema = z.object({
	objectType: z.string(),
	objectId: z.string(),
	customFieldDefinitionId: z.string(),
	value: z.unknown(),
});
export type CustomFieldSetValueInput = z.infer<
	typeof CustomFieldSetValueInputSchema
>;
export const CustomFieldSetValueResponseSchema = z.object({
	success: z.boolean(),
	results: z.record(z.string(), z.unknown()).optional(),
});
export type CustomFieldSetValueResponse = z.infer<
	typeof CustomFieldSetValueResponseSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// 11. API Key Info Schemas
// ─────────────────────────────────────────────────────────────────────────────

export const AshbyApiKeyInfoSchema = z
	.object({
		id: z.string().optional(),
		name: z.string().optional(),
		scopes: z.array(z.string()).optional(),
	})
	.loose();
export type AshbyApiKeyInfo = z.infer<typeof AshbyApiKeyInfoSchema>;

export const ApiKeyInfoInputSchema = z.object({});
export type ApiKeyInfoInput = z.infer<typeof ApiKeyInfoInputSchema>;
export const ApiKeyInfoResponseSchema = makeSingleResponseSchema(
	AshbyApiKeyInfoSchema,
);
export type ApiKeyInfoResponse = z.infer<typeof ApiKeyInfoResponseSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// 12. Webhook Management Schemas
// ─────────────────────────────────────────────────────────────────────────────

export const AshbyWebhookConfigSchema = z
	.object({
		id: z.string(),
		url: z.string(),
		description: z.string().optional(),
		requestActionNames: z.array(z.string()).optional(),
		isEnabled: z.boolean().optional(),
		secretToken: z.string().optional(),
	})
	.loose();
export type AshbyWebhookConfig = z.infer<typeof AshbyWebhookConfigSchema>;

export const WebhookInfoInputSchema = z.object({
	webhookId: z.string(),
});
export type WebhookInfoInput = z.infer<typeof WebhookInfoInputSchema>;
export const WebhookInfoResponseSchema = makeSingleResponseSchema(
	AshbyWebhookConfigSchema,
);
export type WebhookInfoResponse = z.infer<typeof WebhookInfoResponseSchema>;

export const WebhookCreateInputSchema = z.object({
	url: z.string(),
	requestActionNames: z.array(z.string()),
	description: z.string().optional(),
	secretToken: z.string().optional(),
});
export type WebhookCreateInput = z.infer<typeof WebhookCreateInputSchema>;
export const WebhookCreateResponseSchema = makeSingleResponseSchema(
	AshbyWebhookConfigSchema,
);
export type WebhookCreateResponse = z.infer<typeof WebhookCreateResponseSchema>;

export const WebhookDeleteInputSchema = z.object({
	webhookId: z.string(),
});
export type WebhookDeleteInput = z.infer<typeof WebhookDeleteInputSchema>;
export const WebhookDeleteResponseSchema = z.object({
	success: z.boolean(),
	results: z.record(z.string(), z.unknown()).optional(),
});
export type WebhookDeleteResponse = z.infer<typeof WebhookDeleteResponseSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Plugin Endpoint Map
// ─────────────────────────────────────────────────────────────────────────────

export type AshbyEndpointInputs = {
	// Candidates
	'candidate.info': CandidateInfoInput;
	'candidate.list': CandidateListInput;
	'candidate.search': CandidateSearchInput;
	'candidate.create': CandidateCreateInput;
	'candidate.update': CandidateUpdateInput;
	'candidate.addTag': CandidateAddTagInput;
	'candidate.removeTag': CandidateRemoveTagInput;
	'candidate.createNote': CandidateCreateNoteInput;
	'candidate.listNotes': CandidateListNotesInput;
	'candidate.anonymize': CandidateAnonymizeInput;
	// Applications
	'application.info': ApplicationInfoInput;
	'application.list': ApplicationListInput;
	'application.create': ApplicationCreateInput;
	'application.changeStage': ApplicationChangeStageInput;
	'application.update': ApplicationUpdateInput;
	'application.transfer': ApplicationTransferInput;
	// Jobs
	'job.info': JobInfoInput;
	'job.list': JobListInput;
	'job.create': JobCreateInput;
	'job.update': JobUpdateInput;
	'job.search': JobSearchInput;
	// Job Postings
	'jobPosting.info': JobPostingInfoInput;
	'jobPosting.list': JobPostingListInput;
	// Interviews
	'interview.info': InterviewInfoInput;
	'interview.list': InterviewListInput;
	'interview.scheduleInfo': InterviewScheduleInfoInput;
	'interview.scheduleList': InterviewScheduleListInput;
	'interview.stageList': InterviewStageListInput;
	// Offers
	'offer.info': OfferInfoInput;
	'offer.list': OfferListInput;
	'offer.create': OfferCreateInput;
	'offer.update': OfferUpdateInput;
	// Departments
	'department.info': DepartmentInfoInput;
	'department.list': DepartmentListInput;
	'department.create': DepartmentCreateInput;
	'department.update': DepartmentUpdateInput;
	'department.archive': DepartmentArchiveInput;
	// Locations
	'location.info': LocationInfoInput;
	'location.list': LocationListInput;
	'location.create': LocationCreateInput;
	'location.update': LocationUpdateInput;
	'location.archive': LocationArchiveInput;
	// Users
	'user.info': UserInfoInput;
	'user.list': UserListInput;
	'user.search': UserSearchInput;
	// Custom Fields
	'customField.info': CustomFieldInfoInput;
	'customField.list': CustomFieldListInput;
	'customField.setValue': CustomFieldSetValueInput;
	// API Keys
	'apiKey.info': ApiKeyInfoInput;
	// Webhook Management
	'webhook.info': WebhookInfoInput;
	'webhook.create': WebhookCreateInput;
	'webhook.delete': WebhookDeleteInput;
};

export type AshbyEndpointOutputs = {
	// Candidates
	'candidate.info': CandidateInfoResponse;
	'candidate.list': CandidateListResponse;
	'candidate.search': CandidateSearchResponse;
	'candidate.create': CandidateCreateResponse;
	'candidate.update': CandidateUpdateResponse;
	'candidate.addTag': CandidateAddTagResponse;
	'candidate.removeTag': CandidateRemoveTagResponse;
	'candidate.createNote': CandidateCreateNoteResponse;
	'candidate.listNotes': CandidateListNotesResponse;
	'candidate.anonymize': CandidateAnonymizeResponse;
	// Applications
	'application.info': ApplicationInfoResponse;
	'application.list': ApplicationListResponse;
	'application.create': ApplicationCreateResponse;
	'application.changeStage': ApplicationChangeStageResponse;
	'application.update': ApplicationUpdateResponse;
	'application.transfer': ApplicationTransferResponse;
	// Jobs
	'job.info': JobInfoResponse;
	'job.list': JobListResponse;
	'job.create': JobCreateResponse;
	'job.update': JobUpdateResponse;
	'job.search': JobSearchResponse;
	// Job Postings
	'jobPosting.info': JobPostingInfoResponse;
	'jobPosting.list': JobPostingListResponse;
	// Interviews
	'interview.info': InterviewInfoResponse;
	'interview.list': InterviewListResponse;
	'interview.scheduleInfo': InterviewScheduleInfoResponse;
	'interview.scheduleList': InterviewScheduleListResponse;
	'interview.stageList': InterviewStageListResponse;
	// Offers
	'offer.info': OfferInfoResponse;
	'offer.list': OfferListResponse;
	'offer.create': OfferCreateResponse;
	'offer.update': OfferUpdateResponse;
	// Departments
	'department.info': DepartmentInfoResponse;
	'department.list': DepartmentListResponse;
	'department.create': DepartmentCreateResponse;
	'department.update': DepartmentUpdateResponse;
	'department.archive': DepartmentArchiveResponse;
	// Locations
	'location.info': LocationInfoResponse;
	'location.list': LocationListResponse;
	'location.create': LocationCreateResponse;
	'location.update': LocationUpdateResponse;
	'location.archive': LocationArchiveResponse;
	// Users
	'user.info': UserInfoResponse;
	'user.list': UserListResponse;
	'user.search': UserSearchResponse;
	// Custom Fields
	'customField.info': CustomFieldInfoResponse;
	'customField.list': CustomFieldListResponse;
	'customField.setValue': CustomFieldSetValueResponse;
	// API Keys
	'apiKey.info': ApiKeyInfoResponse;
	// Webhook Management
	'webhook.info': WebhookInfoResponse;
	'webhook.create': WebhookCreateResponse;
	'webhook.delete': WebhookDeleteResponse;
};

export const AshbyEndpointInputSchemas = {
	'candidate.info': CandidateInfoInputSchema,
	'candidate.list': CandidateListInputSchema,
	'candidate.search': CandidateSearchInputSchema,
	'candidate.create': CandidateCreateInputSchema,
	'candidate.update': CandidateUpdateInputSchema,
	'candidate.addTag': CandidateAddTagInputSchema,
	'candidate.removeTag': CandidateRemoveTagInputSchema,
	'candidate.createNote': CandidateCreateNoteInputSchema,
	'candidate.listNotes': CandidateListNotesInputSchema,
	'candidate.anonymize': CandidateAnonymizeInputSchema,
	'application.info': ApplicationInfoInputSchema,
	'application.list': ApplicationListInputSchema,
	'application.create': ApplicationCreateInputSchema,
	'application.changeStage': ApplicationChangeStageInputSchema,
	'application.update': ApplicationUpdateInputSchema,
	'application.transfer': ApplicationTransferInputSchema,
	'job.info': JobInfoInputSchema,
	'job.list': JobListInputSchema,
	'job.create': JobCreateInputSchema,
	'job.update': JobUpdateInputSchema,
	'job.search': JobSearchInputSchema,
	'jobPosting.info': JobPostingInfoInputSchema,
	'jobPosting.list': JobPostingListInputSchema,
	'interview.info': InterviewInfoInputSchema,
	'interview.list': InterviewListInputSchema,
	'interview.scheduleInfo': InterviewScheduleInfoInputSchema,
	'interview.scheduleList': InterviewScheduleListInputSchema,
	'interview.stageList': InterviewStageListInputSchema,
	'offer.info': OfferInfoInputSchema,
	'offer.list': OfferListInputSchema,
	'offer.create': OfferCreateInputSchema,
	'offer.update': OfferUpdateInputSchema,
	'department.info': DepartmentInfoInputSchema,
	'department.list': DepartmentListInputSchema,
	'department.create': DepartmentCreateInputSchema,
	'department.update': DepartmentUpdateInputSchema,
	'department.archive': DepartmentArchiveInputSchema,
	'location.info': LocationInfoInputSchema,
	'location.list': LocationListInputSchema,
	'location.create': LocationCreateInputSchema,
	'location.update': LocationUpdateInputSchema,
	'location.archive': LocationArchiveInputSchema,
	'user.info': UserInfoInputSchema,
	'user.list': UserListInputSchema,
	'user.search': UserSearchInputSchema,
	'customField.info': CustomFieldInfoInputSchema,
	'customField.list': CustomFieldListInputSchema,
	'customField.setValue': CustomFieldSetValueInputSchema,
	'apiKey.info': ApiKeyInfoInputSchema,
	'webhook.info': WebhookInfoInputSchema,
	'webhook.create': WebhookCreateInputSchema,
	'webhook.delete': WebhookDeleteInputSchema,
} as const;

export const AshbyEndpointOutputSchemas = {
	'candidate.info': CandidateInfoResponseSchema,
	'candidate.list': CandidateListResponseSchema,
	'candidate.search': CandidateSearchResponseSchema,
	'candidate.create': CandidateCreateResponseSchema,
	'candidate.update': CandidateUpdateResponseSchema,
	'candidate.addTag': CandidateAddTagResponseSchema,
	'candidate.removeTag': CandidateRemoveTagResponseSchema,
	'candidate.createNote': CandidateCreateNoteResponseSchema,
	'candidate.listNotes': CandidateListNotesResponseSchema,
	'candidate.anonymize': CandidateAnonymizeResponseSchema,
	'application.info': ApplicationInfoResponseSchema,
	'application.list': ApplicationListResponseSchema,
	'application.create': ApplicationCreateResponseSchema,
	'application.changeStage': ApplicationChangeStageResponseSchema,
	'application.update': ApplicationUpdateResponseSchema,
	'application.transfer': ApplicationTransferResponseSchema,
	'job.info': JobInfoResponseSchema,
	'job.list': JobListResponseSchema,
	'job.create': JobCreateResponseSchema,
	'job.update': JobUpdateResponseSchema,
	'job.search': JobSearchResponseSchema,
	'jobPosting.info': JobPostingInfoResponseSchema,
	'jobPosting.list': JobPostingListResponseSchema,
	'interview.info': InterviewInfoResponseSchema,
	'interview.list': InterviewListResponseSchema,
	'interview.scheduleInfo': InterviewScheduleInfoResponseSchema,
	'interview.scheduleList': InterviewScheduleListResponseSchema,
	'interview.stageList': InterviewStageListResponseSchema,
	'offer.info': OfferInfoResponseSchema,
	'offer.list': OfferListResponseSchema,
	'offer.create': OfferCreateResponseSchema,
	'offer.update': OfferUpdateResponseSchema,
	'department.info': DepartmentInfoResponseSchema,
	'department.list': DepartmentListResponseSchema,
	'department.create': DepartmentCreateResponseSchema,
	'department.update': DepartmentUpdateResponseSchema,
	'department.archive': DepartmentArchiveResponseSchema,
	'location.info': LocationInfoResponseSchema,
	'location.list': LocationListResponseSchema,
	'location.create': LocationCreateResponseSchema,
	'location.update': LocationUpdateResponseSchema,
	'location.archive': LocationArchiveResponseSchema,
	'user.info': UserInfoResponseSchema,
	'user.list': UserListResponseSchema,
	'user.search': UserSearchResponseSchema,
	'customField.info': CustomFieldInfoResponseSchema,
	'customField.list': CustomFieldListResponseSchema,
	'customField.setValue': CustomFieldSetValueResponseSchema,
	'apiKey.info': ApiKeyInfoResponseSchema,
	'webhook.info': WebhookInfoResponseSchema,
	'webhook.create': WebhookCreateResponseSchema,
	'webhook.delete': WebhookDeleteResponseSchema,
} as const;
