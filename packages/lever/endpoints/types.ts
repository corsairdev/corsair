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
// unknown: delete acknowledgements arrive as an empty 204 body, an empty
// object, or occasionally a provider-side echo; any of these is a success.
const LeverEmptyOutputSchema = z.union([
	z.object({}).passthrough(),
	z.undefined(),
]);

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

// ── Panels ───────────────────────────────────────────────────────────────────
const PanelBodySchema = z
	.object({
		applications: z.array(z.string().min(1)).optional(),
		timezone: z.string().optional(),
		feedbackReminder: z.string().optional(),
		note: z.string().optional(),
		externalUrl: z.string().optional(),
		interviews: z.array(LeverRecordSchema).optional(),
	})
	.passthrough();

// ── Feedback ─────────────────────────────────────────────────────────────────
const FeedbackBodySchema = z
	.object({
		baseTemplateId: z.string().min(1).optional(),
		panel: z.string().min(1).optional(),
		interview: z.string().min(1).optional(),
		fieldValues: z
			.array(z.object({ id: z.string().min(1), value: z.string() }))
			.optional(),
		completedAt: z.number().int().optional(),
	})
	.passthrough();

// ── Feedback templates ───────────────────────────────────────────────────────
const FeedbackTemplateBodySchema = z.object({
	text: z.string().min(1),
	instructions: z.string().optional(),
	group: z.string().optional(),
	fields: z
		.array(z.object({ type: z.string(), text: z.string() }).passthrough())
		.optional(),
});

// ── Files (the multipart upload is excluded from the shared client) ──────────
const FilesListInputSchema = OpportunityIdInputSchema.extend({
	offset: OffsetSchema,
});

// ── Form templates ───────────────────────────────────────────────────────────
const FormTemplateBodySchema = z.object({
	title: z.string().min(1),
	formFields: z.array(z.record(z.string(), z.unknown())).optional(),
});

// ── Requisition fields and their dropdown options ────────────────────────────
const RequisitionFieldBodySchema = z.object({
	id: z.string().min(1).optional(),
	text: z.string().min(1),
	type: z.string().min(1),
	isRequired: z.boolean().optional(),
	description: z.string().optional(),
	subfields: z
		.array(
			z.object({
				id: z.string().optional(),
				text: z.string(),
				type: z.string().optional(),
			}),
		)
		.optional(),
	options: z.array(z.object({ text: z.string() })).optional(),
});

// ── Requisitions ─────────────────────────────────────────────────────────────
const RequisitionBodySchema = z
	.object({
		title: z.string().min(1),
		hiringManagerId: z.string().optional(),
	})
	.passthrough();

// ── Profile form submissions ─────────────────────────────────────────────────
const CreateProfileFormInputSchema = OpportunityIdInputSchema.extend({
	formTemplateId: z.string().min(1).optional(),
	values: z
		.array(z.object({ id: z.string().min(1), value: z.string() }))
		.optional(),
});

// ── Users ────────────────────────────────────────────────────────────────────
const CreateUserInputSchema = z.object({
	name: z.string().min(1),
	email: z.string().min(1),
	accessRole: z.string().optional(),
	externalDirectoryId: z.string().optional(),
	jobTitle: z.string().optional(),
	managerId: z.string().optional(),
});
const UpdateUserInputSchema = z.object({
	userId: IdSchema,
	name: z.string().min(1).optional(),
	email: z.string().min(1).optional(),
	accessRole: z.string().optional(),
	externalDirectoryId: z.string().optional(),
	jobTitle: z.string().optional(),
	managerId: z.string().optional(),
});

// ── Contacts ─────────────────────────────────────────────────────────────────
const UpdateContactInputSchema = z.object({
	contactId: IdSchema,
	name: z.string().min(1).optional(),
	phones: z.array(z.string()).optional(),
	emails: z.array(z.string()).optional(),
	links: z.array(z.string()).optional(),
});

// ── Webhooks ─────────────────────────────────────────────────────────────────
const CreateWebhookInputSchema = z.object({
	url: z.string().min(1),
	event: z.string().min(1),
	configuration: LeverRecordSchema.optional(),
});
const UpdateWebhookInputSchema = z.object({
	webhookId: IdSchema,
	url: z.string().min(1).optional(),
	event: z.string().min(1).optional(),
	configuration: LeverRecordSchema.optional(),
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
	listPanels: OpportunityIdInputSchema,
	retrievePanel: z.object({ opportunityId: IdSchema, panelId: IdSchema }),
	createPanel: PanelBodySchema.extend({ opportunityId: IdSchema }),
	updatePanel: z
		.object({ opportunityId: IdSchema, panelId: IdSchema })
		.extend(PanelBodySchema.shape),
	deletePanel: z.object({ opportunityId: IdSchema, panelId: IdSchema }),
	listFeedback: OpportunityIdInputSchema,
	retrieveFeedback: z.object({ opportunityId: IdSchema, feedbackId: IdSchema }),
	createFeedback: FeedbackBodySchema.extend({ opportunityId: IdSchema }),
	updateFeedback: z
		.object({ opportunityId: IdSchema, feedbackId: IdSchema })
		.extend(FeedbackBodySchema.shape),
	deleteFeedback: z.object({ opportunityId: IdSchema, feedbackId: IdSchema }),
	listFeedbackTemplates: z.object({ offset: OffsetSchema }),
	retrieveFeedbackTemplate: z.object({ feedbackTemplateId: IdSchema }),
	createFeedbackTemplate: FeedbackTemplateBodySchema,
	updateFeedbackTemplate: FeedbackTemplateBodySchema.partial().extend({
		feedbackTemplateId: IdSchema,
	}),
	deleteFeedbackTemplate: z.object({ feedbackTemplateId: IdSchema }),
	listFiles: FilesListInputSchema,
	retrieveFile: z.object({ opportunityId: IdSchema, fileId: IdSchema }),
	downloadFile: z.object({ opportunityId: IdSchema, fileId: IdSchema }),
	deleteFile: z.object({ opportunityId: IdSchema, fileId: IdSchema }),
	listFormTemplates: z.object({ offset: OffsetSchema }),
	retrieveFormTemplate: z.object({ formTemplateId: IdSchema }),
	createFormTemplate: FormTemplateBodySchema,
	updateFormTemplate: FormTemplateBodySchema.partial().extend({
		formTemplateId: IdSchema,
	}),
	deleteFormTemplate: z.object({ formTemplateId: IdSchema }),
	listRequisitionFields: z.object({ offset: OffsetSchema }),
	retrieveRequisitionField: z.object({ requisitionFieldId: IdSchema }),
	createRequisitionField: RequisitionFieldBodySchema,
	updateRequisitionField: RequisitionFieldBodySchema.partial().extend({
		requisitionFieldId: IdSchema,
	}),
	deleteRequisitionField: z.object({ requisitionFieldId: IdSchema }),
	addRequisitionFieldOptions: z.object({
		requisitionFieldId: IdSchema,
		values: z.array(z.object({ text: z.string().min(1) })),
	}),
	replaceRequisitionFieldOptions: z.object({
		requisitionFieldId: IdSchema,
		values: z.array(
			z.object({ id: z.string().optional(), text: z.string().min(1) }),
		),
	}),
	deleteRequisitionFieldOptions: z.object({
		requisitionFieldId: IdSchema,
		values: z.array(z.string().min(1)),
	}),
	listRequisitions: z.object({ offset: OffsetSchema }),
	createRequisition: z.object({ title: z.string().min(1) }).passthrough(),
	retrieveRequisition: z.object({ requisitionId: IdSchema }),
	updateRequisition: z.object({ requisitionId: IdSchema }).passthrough(),
	deleteRequisition: z.object({ requisitionId: IdSchema }),
	listForms: OpportunityIdInputSchema,
	retrieveForm: z.object({ opportunityId: IdSchema, formId: IdSchema }),
	createForm: CreateProfileFormInputSchema,
	listResumes: OpportunityIdInputSchema,
	retrieveResume: z.object({ opportunityId: IdSchema, resumeId: IdSchema }),
	downloadResume: z.object({ opportunityId: IdSchema, resumeId: IdSchema }),
	listUsers: z.object({ offset: OffsetSchema, include: z.string().optional() }),
	retrieveUser: z.object({ userId: IdSchema }),
	createUser: CreateUserInputSchema,
	updateUser: UpdateUserInputSchema,
	deactivateUser: z.object({ userId: IdSchema }),
	reactivateUser: z.object({ userId: IdSchema }),
	listReferrals: OpportunityIdInputSchema,
	retrieveReferral: z.object({ opportunityId: IdSchema, referralId: IdSchema }),
	retrieveContact: z.object({ contactId: IdSchema }),
	updateContact: UpdateContactInputSchema,
	retrieveEeoResponsesWithPii: z.object({}),
	retrieveEeoResponsesAnonymous: z.object({}),
	listDispositionStages: z.object({}),
	retrieveDiversitySurvey: z.object({ postingId: IdSchema }),
	listWebhooks: z.object({}),
	createWebhook: CreateWebhookInputSchema,
	updateWebhook: UpdateWebhookInputSchema,
	deleteWebhook: z.object({ webhookId: IdSchema }),
	listAuditEvents: z.object({ offset: OffsetSchema }),
	listSources: z.object({}),
	listTags: z.object({}),
	listOpportunityOffers: OpportunityIdInputSchema,
	downloadOpportunityOffer: z.object({
		opportunityId: IdSchema,
		offerId: IdSchema,
	}),
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
	listPanels: LeverListOutputSchema,
	retrievePanel: LeverResourceOutputSchema,
	createPanel: LeverResourceOutputSchema,
	updatePanel: LeverResourceOutputSchema,
	deletePanel: LeverEmptyOutputSchema,
	listFeedback: LeverListOutputSchema,
	retrieveFeedback: LeverResourceOutputSchema,
	createFeedback: LeverResourceOutputSchema,
	updateFeedback: LeverResourceOutputSchema,
	deleteFeedback: LeverEmptyOutputSchema,
	listFeedbackTemplates: LeverListOutputSchema,
	retrieveFeedbackTemplate: LeverResourceOutputSchema,
	createFeedbackTemplate: LeverResourceOutputSchema,
	updateFeedbackTemplate: LeverResourceOutputSchema,
	deleteFeedbackTemplate: LeverEmptyOutputSchema,
	listFiles: LeverListOutputSchema,
	retrieveFile: LeverResourceOutputSchema,
	// unknown: the shared transport yields provider bytes as text; the
	// endpoint returns the documented envelope for the binary download.
	downloadFile: LeverResourceOutputSchema,
	deleteFile: LeverEmptyOutputSchema,
	listFormTemplates: LeverListOutputSchema,
	retrieveFormTemplate: LeverResourceOutputSchema,
	createFormTemplate: LeverResourceOutputSchema,
	updateFormTemplate: LeverResourceOutputSchema,
	deleteFormTemplate: LeverEmptyOutputSchema,
	listRequisitionFields: LeverListOutputSchema,
	retrieveRequisitionField: LeverResourceOutputSchema,
	createRequisitionField: LeverResourceOutputSchema,
	updateRequisitionField: LeverResourceOutputSchema,
	deleteRequisitionField: LeverEmptyOutputSchema,
	addRequisitionFieldOptions: LeverResourceOutputSchema,
	replaceRequisitionFieldOptions: LeverResourceOutputSchema,
	deleteRequisitionFieldOptions: LeverEmptyOutputSchema,
	listRequisitions: LeverListOutputSchema,
	createRequisition: LeverResourceOutputSchema,
	retrieveRequisition: LeverResourceOutputSchema,
	updateRequisition: LeverResourceOutputSchema,
	deleteRequisition: LeverEmptyOutputSchema,
	listForms: LeverListOutputSchema,
	retrieveForm: LeverResourceOutputSchema,
	createForm: LeverResourceOutputSchema,
	listResumes: LeverListOutputSchema,
	retrieveResume: LeverResourceOutputSchema,
	// unknown: same binary-download envelope as files.download.
	downloadResume: LeverResourceOutputSchema,
	listUsers: LeverListOutputSchema,
	retrieveUser: LeverResourceOutputSchema,
	createUser: LeverResourceOutputSchema,
	updateUser: LeverResourceOutputSchema,
	// unknown: the provider documents a 200 acknowledgement whose body shape
	// is not specified; stricter typing would invent undocumented fields.
	deactivateUser: z.unknown(),
	// unknown: same undocumented lifecycle acknowledgement as deactivate.
	reactivateUser: z.unknown(),
	listReferrals: LeverListOutputSchema,
	retrieveReferral: LeverResourceOutputSchema,
	retrieveContact: LeverResourceOutputSchema,
	updateContact: LeverResourceOutputSchema,
	retrieveEeoResponsesWithPii: LeverListOutputSchema,
	retrieveEeoResponsesAnonymous: LeverListOutputSchema,
	listDispositionStages: LeverListOutputSchema,
	retrieveDiversitySurvey: LeverResourceOutputSchema,
	listWebhooks: LeverListOutputSchema,
	createWebhook: LeverResourceOutputSchema,
	updateWebhook: LeverResourceOutputSchema,
	deleteWebhook: LeverEmptyOutputSchema,
	listAuditEvents: LeverListOutputSchema,
	listSources: LeverListOutputSchema,
	listTags: LeverListOutputSchema,
	listOpportunityOffers: LeverListOutputSchema,
	// unknown: same binary-download envelope as files.download.
	downloadOpportunityOffer: LeverResourceOutputSchema,
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
