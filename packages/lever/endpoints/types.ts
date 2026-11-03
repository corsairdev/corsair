import { z } from 'zod';

// ── Shared building blocks ───────────────────────────────────────────────────
const LeverRecordSchema = z.object({}).passthrough();
const LeverListOutputSchema = z
	.object({
		data: z.array(LeverRecordSchema),
		has_more: z.boolean().optional(),
	})
	.passthrough();
const LeverResourceOutputSchema = LeverRecordSchema;
const LeverEmptyOutputSchema = z.union([z.object({}), z.undefined()]);

const IdSchema = z.string().min(1);
const OpportunityIdInputSchema = z.object({ opportunityId: IdSchema });
const ApplicationIdInputSchema = OpportunityIdInputSchema.extend({
	applicationId: IdSchema,
});
const PostingIdInputSchema = z.object({ postingId: IdSchema });
const InterviewIdInputSchema = OpportunityIdInputSchema.extend({
	interviewId: IdSchema,
});
const NoteIdInputSchema = OpportunityIdInputSchema.extend({
	noteId: IdSchema,
});
const ArchiveReasonIdInputSchema = z.object({ archiveReasonId: IdSchema });
const OffsetSchema = z.number().int().min(0).optional();

// ── Opportunities ────────────────────────────────────────────────────────────
const ListOpportunitiesInputSchema = z.object({
	offset: OffsetSchema,
	include: z.string().optional(),
	expand: z.string().optional(),
	tag: z.string().optional(),
	source: z.string().optional(),
	stage: z.string().optional(),
	posting: z.string().optional(),
	owner: z.string().optional(),
	created_after: z.string().optional(),
	created_before: z.string().optional(),
	updated_after: z.string().optional(),
	updated_before: z.string().optional(),
});
const CreateOpportunityInputSchema = z.object({
	name: z.string().min(1),
	headline: z.string().optional(),
	contact: z.string().optional(),
	location: z.string().optional(),
	emails: z.array(z.string()).optional(),
	phones: z.array(z.string()).optional(),
	links: z.array(z.string()).optional(),
	tags: z.array(z.string()).optional(),
	sources: z.array(z.string()).optional(),
	stage: z.string().optional(),
	owner: z.string().optional(),
	origin: z.string().optional(),
	confidentiality: z.string().optional(),
});
const UpdateOpportunityStageInputSchema = OpportunityIdInputSchema.extend({
	stageID: z.string().min(1),
});
const UpdateOpportunityArchivedStateInputSchema =
	OpportunityIdInputSchema.extend({
		archived: z.boolean(),
		reasonID: z.string().min(1).optional(),
	});
const OpportunityLinksInputSchema = OpportunityIdInputSchema.extend({
	contactIDs: z.array(z.string().min(1)),
});
const OpportunityTagsInputSchema = OpportunityIdInputSchema.extend({
	tags: z.array(z.string().min(1)),
});
const OpportunitySourcesInputSchema = OpportunityIdInputSchema.extend({
	sourceIDs: z.array(z.string().min(1)),
});

// ── Applications ─────────────────────────────────────────────────────────────
const ListDeletedApplicationsInputSchema = z.object({ offset: OffsetSchema });

// ── Postings ─────────────────────────────────────────────────────────────────
const ListPostingsInputSchema = z.object({ offset: OffsetSchema });
const CreatePostingInputSchema = z.object({
	text: z.string().min(1),
	requirements: z.string().optional(),
	description: z.string().optional(),
	listThroughApi: z.boolean().optional(),
	employmentType: z.string().optional(),
	workplaceType: z.string().optional(),
	isRemote: z.string().optional(),
	location: z.string().optional(),
	team: z.string().optional(),
	department: z.string().optional(),
	salaryDescription: z.string().optional(),
});
const UpdatePostingInputSchema = PostingIdInputSchema.extend(
	CreatePostingInputSchema.partial().shape,
);
const ApplyToPostingInputSchema = PostingIdInputSchema.extend({
	name: z.string().min(1),
	email: z.string().min(1),
	resume: z.string().optional(),
	links: z.array(z.string()).optional(),
	phones: z.array(z.string()).optional(),
	comments: z.string().optional(),
	silent: z.boolean().optional(),
	source: z.string().optional(),
});

// ── Interviews ───────────────────────────────────────────────────────────────
const ListInterviewsInputSchema = OpportunityIdInputSchema.extend({
	expand: z.string().optional(),
});
const CreateInterviewInputSchema = OpportunityIdInputSchema.extend({
	date: z.number().int(),
	duration: z.number().int().optional(),
	location: z.string().optional(),
	interviewers: z
		.array(
			z.object({ userId: z.string().min(1), panelId: z.string().optional() }),
		)
		.optional(),
	panelId: z.string().optional(),
	stage: z.string().optional(),
	timezone: z.string().optional(),
});
const UpdateInterviewInputSchema = InterviewIdInputSchema.extend(
	CreateInterviewInputSchema.partial().omit({ opportunityId: true }).shape,
);

// ── Notes ────────────────────────────────────────────────────────────────────
const CreateNoteInputSchema = OpportunityIdInputSchema.extend({
	value: z.string().min(1),
});
const UpdateNoteInputSchema = NoteIdInputSchema.extend({
	value: z.string().min(1),
});

export const LeverEndpointInputSchemas = {
	listOpportunities: ListOpportunitiesInputSchema,
	retrieveOpportunity: OpportunityIdInputSchema.extend({
		include: z.string().optional(),
	}),
	listDeletedOpportunities: z.object({ offset: OffsetSchema }),
	listOpportunityFileActions: OpportunityIdInputSchema,
	createOpportunity: CreateOpportunityInputSchema,
	updateOpportunityStage: UpdateOpportunityStageInputSchema,
	updateOpportunityArchivedState: UpdateOpportunityArchivedStateInputSchema,
	addOpportunityLinks: OpportunityLinksInputSchema,
	removeOpportunityLinks: OpportunityLinksInputSchema,
	addOpportunityTags: OpportunityTagsInputSchema,
	removeOpportunityTags: OpportunityTagsInputSchema,
	addOpportunitySources: OpportunitySourcesInputSchema,
	removeOpportunitySources: OpportunitySourcesInputSchema,
	listApplications: OpportunityIdInputSchema,
	retrieveApplication: ApplicationIdInputSchema,
	listDeletedApplications: ListDeletedApplicationsInputSchema,
	listPostings: ListPostingsInputSchema,
	retrievePosting: PostingIdInputSchema,
	listDeletedPostings: z.object({ offset: OffsetSchema }),
	createPosting: CreatePostingInputSchema,
	updatePosting: UpdatePostingInputSchema,
	retrievePostingApplicationQuestions: PostingIdInputSchema,
	listPostingUsers: PostingIdInputSchema,
	applyToPosting: ApplyToPostingInputSchema,
	listInterviews: ListInterviewsInputSchema,
	retrieveInterview: InterviewIdInputSchema,
	createInterview: CreateInterviewInputSchema,
	updateInterview: UpdateInterviewInputSchema,
	deleteInterview: InterviewIdInputSchema,
	listNotes: OpportunityIdInputSchema,
	retrieveNote: NoteIdInputSchema,
	createNote: CreateNoteInputSchema,
	updateNote: UpdateNoteInputSchema,
	deleteNote: NoteIdInputSchema,
	listArchiveReasons: z.object({ offset: OffsetSchema }),
	retrieveArchiveReason: ArchiveReasonIdInputSchema,
	listStages: z.object({ offset: OffsetSchema }),
	retrieveStage: z.object({ stageId: IdSchema }),
} as const;

export const LeverEndpointOutputSchemas = {
	listOpportunities: LeverListOutputSchema,
	retrieveOpportunity: LeverResourceOutputSchema,
	listDeletedOpportunities: LeverListOutputSchema,
	listOpportunityFileActions: LeverListOutputSchema,
	createOpportunity: LeverResourceOutputSchema,
	updateOpportunityStage: LeverResourceOutputSchema,
	updateOpportunityArchivedState: LeverResourceOutputSchema,
	addOpportunityLinks: LeverEmptyOutputSchema,
	removeOpportunityLinks: LeverEmptyOutputSchema,
	addOpportunityTags: LeverEmptyOutputSchema,
	removeOpportunityTags: LeverEmptyOutputSchema,
	addOpportunitySources: LeverEmptyOutputSchema,
	removeOpportunitySources: LeverEmptyOutputSchema,
	listApplications: LeverListOutputSchema,
	retrieveApplication: LeverResourceOutputSchema,
	listDeletedApplications: LeverListOutputSchema,
	listPostings: LeverListOutputSchema,
	retrievePosting: LeverResourceOutputSchema,
	listDeletedPostings: LeverListOutputSchema,
	createPosting: LeverResourceOutputSchema,
	updatePosting: LeverResourceOutputSchema,
	retrievePostingApplicationQuestions: LeverResourceOutputSchema,
	listPostingUsers: LeverListOutputSchema,
	applyToPosting: LeverResourceOutputSchema,
	listInterviews: LeverListOutputSchema,
	retrieveInterview: LeverResourceOutputSchema,
	createInterview: LeverResourceOutputSchema,
	updateInterview: LeverResourceOutputSchema,
	deleteInterview: LeverEmptyOutputSchema,
	listNotes: LeverListOutputSchema,
	retrieveNote: LeverResourceOutputSchema,
	createNote: LeverResourceOutputSchema,
	updateNote: LeverResourceOutputSchema,
	deleteNote: LeverEmptyOutputSchema,
	listArchiveReasons: LeverListOutputSchema,
	retrieveArchiveReason: LeverResourceOutputSchema,
	listStages: LeverListOutputSchema,
	retrieveStage: LeverResourceOutputSchema,
} as const;

export type LeverEndpointInputs = {
	[K in keyof typeof LeverEndpointInputSchemas]: z.infer<
		(typeof LeverEndpointInputSchemas)[K]
	>;
};

export type LeverEndpointOutputs = {
	[K in keyof typeof LeverEndpointOutputSchemas]: z.infer<
		(typeof LeverEndpointOutputSchemas)[K]
	>;
};
