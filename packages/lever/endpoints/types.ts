import { z } from 'zod';

// ── Shared building blocks ───────────────────────────────────────────────────
const LeverRecordSchema = z.object({}).passthrough();
// Every Lever list endpoint returns { data, hasNext, next }. `next` is an
// opaque offset token: pass it back as `offset` to fetch the following page.
const LeverListOutputSchema = z
	.object({
		data: z.array(LeverRecordSchema),
		hasNext: z.boolean().optional(),
		next: z.string().optional(),
	})
	.passthrough();
// A few report endpoints (EEO responses, disposition stages) wrap an object,
// not an array, in `data`.
const LeverObjectEnvelopeOutputSchema = z
	.object({ data: LeverRecordSchema })
	.passthrough();
const LeverResourceOutputSchema = LeverRecordSchema;
// File, resume and offer downloads: raw bytes as base64 plus their MIME type.
const LeverDownloadOutputSchema = z.object({
	data: z.string(),
	contentType: z.string(),
});
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

// Lever pages with an opaque offset token (the `next` value of the previous
// page), not a numeric offset, and caps `limit` at 100.
const PaginationInputSchema = z.object({
	limit: z.number().int().min(1).max(100).optional(),
	offset: z
		.string()
		.min(1)
		.optional()
		.describe('The `next` token returned by the previous page'),
});
// Lever filters that accept the parameter more than once (union of results).
const MultiValueSchema = z.union([z.string(), z.array(z.string())]);
const TimestampSchema = z.number().int();

// perform_as is the Lever user ID a write is attributed to. Lever reads it
// from the query string; some writes reject requests without it.
const PerformAsDescription =
	'Lever user ID to perform this action as (sent as the perform_as query parameter)';
const RequiredPerformAsSchema = z.object({
	perform_as: IdSchema.describe(PerformAsDescription),
});
const OptionalPerformAsSchema = z.object({
	perform_as: IdSchema.optional().describe(PerformAsDescription),
});

// Form field values vary by field type: text, numbers (currency, date,
// score), string arrays (multiple select) and objects (scorecard).
const FormFieldValueSchema = z.union([
	z.string(),
	z.number(),
	z.boolean(),
	z.null(),
	z.array(z.union([z.string(), z.number(), LeverRecordSchema])),
	LeverRecordSchema,
]);
const FieldValueInputSchema = z.object({
	id: z.string().min(1),
	value: FormFieldValueSchema,
});

// ── Opportunities ────────────────────────────────────────────────────────────
const ListOpportunitiesInputSchema = PaginationInputSchema.extend({
	include: MultiValueSchema.optional(),
	expand: MultiValueSchema.optional(),
	tag: MultiValueSchema.optional(),
	email: z.string().optional(),
	origin: MultiValueSchema.optional(),
	source: MultiValueSchema.optional(),
	confidentiality: z
		.enum(['confidential', 'non-confidential', 'all'])
		.optional(),
	stage_id: MultiValueSchema.optional(),
	posting_id: MultiValueSchema.optional(),
	archived_posting_id: MultiValueSchema.optional(),
	created_at_start: TimestampSchema.optional(),
	created_at_end: TimestampSchema.optional(),
	updated_at_start: TimestampSchema.optional(),
	updated_at_end: TimestampSchema.optional(),
	advanced_at_start: TimestampSchema.optional(),
	advanced_at_end: TimestampSchema.optional(),
	archived_at_start: TimestampSchema.optional(),
	archived_at_end: TimestampSchema.optional(),
	archived: z.boolean().optional(),
	archive_reason_id: MultiValueSchema.optional(),
	snoozed: z.boolean().optional(),
	contact_id: MultiValueSchema.optional(),
});
const PhoneSchema = z.object({
	value: z.string().min(1),
	type: z.enum(['mobile', 'home', 'work', 'skype', 'other']).optional(),
});
const CreateOpportunityInputSchema = RequiredPerformAsSchema.extend({
	parse: z.boolean().optional(),
	perform_as_posting_owner: z.boolean().optional(),
	name: z.string().min(1).optional(),
	headline: z.string().optional(),
	contact: z.string().optional(),
	location: z.string().optional(),
	emails: z.array(z.string()).optional(),
	phones: z.array(PhoneSchema).optional(),
	links: z.array(z.string()).optional(),
	tags: z.array(z.string()).optional(),
	sources: z.array(z.string()).optional(),
	stage: z.string().optional(),
	owner: z.string().optional(),
	followers: z.array(z.string()).optional(),
	postings: z.array(z.string()).max(1).optional(),
	origin: z
		.enum([
			'agency',
			'applied',
			'internal',
			'referred',
			'sourced',
			'university',
		])
		.optional(),
	createdAt: TimestampSchema.optional(),
	archived: z
		.object({
			reason: z.string().min(1),
			archivedAt: TimestampSchema.optional(),
		})
		.optional(),
});
const UpdateOpportunityStageInputSchema = OpportunityIdInputSchema.extend({
	stage: z.string().min(1),
}).extend(OptionalPerformAsSchema.shape);
const UpdateOpportunityArchivedStateInputSchema =
	OpportunityIdInputSchema.extend({
		// null unarchives the opportunity.
		reason: z.string().min(1).nullable(),
		cleanInterviews: z.boolean().optional(),
		requisitionId: z.string().min(1).optional(),
	}).extend(OptionalPerformAsSchema.shape);
const OpportunityLinksInputSchema = OpportunityIdInputSchema.extend({
	links: z.array(z.string().min(1)).min(1),
}).extend(OptionalPerformAsSchema.shape);
const OpportunityTagsInputSchema = OpportunityIdInputSchema.extend({
	tags: z.array(z.string().min(1)).min(1),
}).extend(OptionalPerformAsSchema.shape);
const OpportunitySourcesInputSchema = OpportunityIdInputSchema.extend({
	sources: z.array(z.string().min(1)).min(1),
}).extend(OptionalPerformAsSchema.shape);

// ── Applications ─────────────────────────────────────────────────────────────
// Lever requires a deletion window of at most 30 days on the deleted lists.
const DeletedWindowSchema = z.object({
	deleted_at_start: TimestampSchema,
	deleted_at_end: TimestampSchema,
});
const ListDeletedApplicationsInputSchema = PaginationInputSchema.extend(
	DeletedWindowSchema.shape,
);

// ── Postings ─────────────────────────────────────────────────────────────────
const ListPostingsInputSchema = PaginationInputSchema.extend({
	include: MultiValueSchema.optional(),
	expand: MultiValueSchema.optional(),
	state: MultiValueSchema.optional(),
	distributionChannel: MultiValueSchema.optional(),
	confidentiality: z
		.enum(['confidential', 'non-confidential', 'all'])
		.optional(),
	group: z.enum(['location', 'team', 'department', 'commitment']).optional(),
	team: MultiValueSchema.optional(),
	department: MultiValueSchema.optional(),
	location: MultiValueSchema.optional(),
	commitment: MultiValueSchema.optional(),
	level: MultiValueSchema.optional(),
	tag: MultiValueSchema.optional(),
	updated_at_start: TimestampSchema.optional(),
	updated_at_end: TimestampSchema.optional(),
});
// Lever groups a posting's team, department, location and work type under
// `categories`; top-level team/location fields are not part of the API.
const PostingCategoriesSchema = z
	.object({
		team: z.string().optional(),
		department: z.string().optional(),
		location: z.string().optional(),
		commitment: z.string().optional(),
		locationDetails: LeverRecordSchema.optional(),
	})
	.passthrough();
const PostingContentSchema = z
	.object({
		descriptionHtml: z.string().optional(),
		lists: z
			.array(z.object({ text: z.string(), content: z.string() }))
			.optional(),
		closingPostingHtml: z.string().optional(),
	})
	.passthrough();
const PostingBodySchema = z.object({
	text: z.string().min(1),
	state: z
		.enum(['published', 'internal', 'closed', 'draft', 'pending', 'rejected'])
		.optional(),
	distributionChannels: z.array(z.enum(['public', 'internal'])).optional(),
	owner: z.string().optional(),
	hiringManager: z.string().optional(),
	categories: PostingCategoriesSchema.optional(),
	tags: z.array(z.string()).optional(),
	content: PostingContentSchema.optional(),
	workplaceType: z
		.enum(['onsite', 'remote', 'hybrid', 'unspecified'])
		.optional(),
	requisitionCodes: z.array(z.string()).optional(),
	salaryDescriptionHtml: z.string().optional(),
	salaryRange: z
		.object({
			min: z.number().optional(),
			max: z.number().optional(),
			currency: z.string().optional(),
			interval: z.string().optional(),
		})
		.optional(),
});
const CreatePostingInputSchema = PostingBodySchema.extend(
	RequiredPerformAsSchema.shape,
);
const UpdatePostingInputSchema = PostingIdInputSchema.extend(
	PostingBodySchema.partial().shape,
).extend(RequiredPerformAsSchema.shape);
const NameValueSchema = z.object({
	name: z.string().min(1),
	value: z.string(),
});
const ApplyToPostingInputSchema = PostingIdInputSchema.extend({
	send_confirmation_email: z.boolean().optional(),
	personalInformation: z.array(NameValueSchema).min(1),
	customQuestions: z
		.array(
			z.object({
				id: z.string().min(1),
				fields: z.array(z.object({ value: FormFieldValueSchema })),
			}),
		)
		.optional(),
	eeoResponses: z.record(z.string(), z.string()).optional(),
	urls: z.array(NameValueSchema).optional(),
	ipAddress: z.string().optional(),
	timezone: z.string().optional(),
	source: z.string().optional(),
	consent: z.object({ marketing: z.boolean() }).optional(),
	diversitySurvey: LeverRecordSchema.optional(),
	origin: z.enum(['applied', 'internal']).optional(),
});

// ── Interviews ───────────────────────────────────────────────────────────────
const ListInterviewsInputSchema = OpportunityIdInputSchema.extend({
	expand: MultiValueSchema.optional(),
});
const InterviewerSchema = z.object({
	id: z.string().min(1),
	feedbackTemplate: z.string().optional(),
});
const FeedbackReminderSchema = z.enum(['once', 'daily', 'frequently', 'none']);
const InterviewBodySchema = z.object({
	panel: z.string().min(1),
	subject: z.string().optional(),
	note: z.string().optional(),
	interviewers: z.array(InterviewerSchema).min(1),
	date: TimestampSchema,
	duration: z.number().int().min(1),
	location: z.string().optional(),
	feedbackTemplate: z.string().optional(),
	feedbackReminder: FeedbackReminderSchema.optional(),
	conferenceData: z
		.object({
			conferenceUrl: z.string().min(1),
			conferenceSolution: z.string().optional(),
		})
		.nullable()
		.optional(),
});
const CreateInterviewInputSchema = OpportunityIdInputSchema.extend(
	InterviewBodySchema.shape,
).extend(RequiredPerformAsSchema.shape);
// Lever replaces the whole interview on update, so the create fields stay
// required here.
const UpdateInterviewInputSchema = InterviewIdInputSchema.extend(
	InterviewBodySchema.shape,
).extend(RequiredPerformAsSchema.shape);
const DeleteInterviewInputSchema = InterviewIdInputSchema.extend(
	RequiredPerformAsSchema.shape,
);

// ── Notes ────────────────────────────────────────────────────────────────────
const NoteScoreSchema = z.number().int().min(1).max(4);
const CreateNoteInputSchema = OpportunityIdInputSchema.extend({
	value: z.string().min(1),
	secret: z.boolean().optional(),
	score: NoteScoreSchema.optional(),
	notifyFollowers: z.boolean().optional(),
	createdAt: TimestampSchema.optional(),
	note_id: z
		.string()
		.min(1)
		.optional()
		.describe('Add this as a threaded comment on an existing note'),
}).extend(OptionalPerformAsSchema.shape);
// Lever replaces the whole note thread on update: send every comment.
const UpdateNoteInputSchema = NoteIdInputSchema.extend({
	values: z
		.array(
			z
				.object({
					value: z.string().min(1),
					createdAt: TimestampSchema.optional(),
				})
				.passthrough(),
		)
		.min(1),
	user: z.string().optional(),
	secret: z.boolean().optional(),
	score: NoteScoreSchema.optional(),
	createdAt: TimestampSchema.optional(),
	completedAt: TimestampSchema.optional(),
});

// ── Panels ───────────────────────────────────────────────────────────────────
const PanelBodySchema = z
	.object({
		applications: z.array(z.string().min(1)).optional(),
		timezone: z.string().min(1),
		feedbackReminder: FeedbackReminderSchema.optional(),
		note: z.string().optional(),
		externalUrl: z.string().optional(),
		interviews: z.array(LeverRecordSchema).min(1),
	})
	.passthrough();

// ── Feedback ─────────────────────────────────────────────────────────────────
const CreateFeedbackInputSchema = OpportunityIdInputSchema.extend({
	baseTemplateId: z.string().min(1),
	panel: z.string().min(1).optional(),
	interview: z.string().min(1).optional(),
	fieldValues: z.array(FieldValueInputSchema).optional(),
	createdAt: TimestampSchema.optional(),
	completedAt: TimestampSchema.optional(),
}).extend(RequiredPerformAsSchema.shape);
const UpdateFeedbackInputSchema = OpportunityIdInputSchema.extend({
	feedbackId: IdSchema,
	fieldValues: z.array(FieldValueInputSchema).optional(),
	completedAt: TimestampSchema.optional(),
}).extend(RequiredPerformAsSchema.shape);
const DeleteFeedbackInputSchema = OpportunityIdInputSchema.extend({
	feedbackId: IdSchema,
}).extend(RequiredPerformAsSchema.shape);

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
	uploaded_at_start: TimestampSchema.optional(),
	uploaded_at_end: TimestampSchema.optional(),
});

// ── Form templates ───────────────────────────────────────────────────────────
const FormTemplateBodySchema = z.object({
	text: z.string().min(1),
	instructions: z.string().optional(),
	group: z.string().optional(),
	secretByDefault: z.boolean().optional(),
	fields: z
		.array(z.object({ type: z.string(), text: z.string() }).passthrough())
		.min(1),
});

// ── Requisition fields and their dropdown options ────────────────────────────
const RequisitionFieldBodySchema = z.object({
	id: z.string().min(1),
	text: z.string().min(1),
	type: z.enum(['number', 'text', 'date', 'object', 'dropdown']),
	isRequired: z.boolean().optional(),
	subfields: z
		.array(
			z.object({
				id: z.string().min(1),
				text: z.string().min(1),
				type: z.enum(['number', 'text', 'date']),
			}),
		)
		.optional(),
	options: z.array(z.object({ text: z.string() })).optional(),
});

// ── Requisitions ─────────────────────────────────────────────────────────────
const RequisitionBodySchema = z
	.object({
		requisitionCode: z.string().min(1),
		name: z.string().min(1),
		headcountTotal: z.union([z.number().int().min(0), z.literal('unlimited')]),
		backfill: z.boolean().optional(),
		compensationBand: z
			.object({
				currency: z.string().optional(),
				interval: z.string().optional(),
				min: z.number().optional(),
				max: z.number().optional(),
			})
			.optional(),
		createdAt: TimestampSchema.optional(),
		customFields: LeverRecordSchema.optional(),
		employmentStatus: z.string().optional(),
		hiringManager: z.string().optional(),
		internalNotes: z.string().optional(),
		location: z.string().optional(),
		owner: z.string().optional(),
		status: z.enum(['draft', 'open', 'closed', 'onHold']).optional(),
		team: z.string().optional(),
		department: z.string().optional(),
		postingIds: z.array(z.string()).optional(),
	})
	.passthrough();

// ── Profile form submissions ─────────────────────────────────────────────────
// Lever creates a profile form from a form template: `fields` mirrors the
// template's fields, each carrying the answer in `value`.
const CreateProfileFormInputSchema = OpportunityIdInputSchema.extend({
	baseTemplateId: z.string().min(1),
	fields: z
		.array(
			z
				.object({
					type: z.string().min(1),
					text: z.string().min(1),
					value: FormFieldValueSchema.optional(),
				})
				.passthrough(),
		)
		.min(1),
	secret: z.boolean().optional(),
}).extend(OptionalPerformAsSchema.shape);

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
	headline: z.string().optional(),
	location: z.union([z.string(), LeverRecordSchema]).optional(),
	phones: z.array(PhoneSchema).optional(),
	emails: z.array(z.string()).optional(),
});

// ── Webhooks ─────────────────────────────────────────────────────────────────
const CreateWebhookInputSchema = z.object({
	url: z.string().min(1),
	event: z.string().min(1),
	configuration: LeverRecordSchema.optional(),
});
// Lever updates webhooks in bulk with PUT /webhooks { data: [...] }; the event
// of an existing webhook cannot change.
const UpdateWebhookInputSchema = z.object({
	webhookId: IdSchema,
	url: z.string().min(1).optional(),
	configuration: LeverRecordSchema.optional(),
});

export const LeverEndpointInputSchemas = {
	listOpportunities: ListOpportunitiesInputSchema,
	retrieveOpportunity: OpportunityIdInputSchema.extend({
		include: MultiValueSchema.optional(),
		expand: MultiValueSchema.optional(),
	}),
	listDeletedOpportunities: PaginationInputSchema.extend({
		deleted_at_start: TimestampSchema.optional(),
		deleted_at_end: TimestampSchema.optional(),
	}),
	listOpportunityFileActions: OpportunityIdInputSchema.extend(
		PaginationInputSchema.shape,
	).extend({
		occurred_at_start: TimestampSchema.optional(),
		occurred_at_end: TimestampSchema.optional(),
	}),
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
	listDeletedPostings: PaginationInputSchema.extend(DeletedWindowSchema.shape),
	createPosting: CreatePostingInputSchema,
	updatePosting: UpdatePostingInputSchema,
	retrievePostingApplicationQuestions: PostingIdInputSchema,
	listPostingUsers: PostingIdInputSchema,
	applyToPosting: ApplyToPostingInputSchema,
	listInterviews: ListInterviewsInputSchema,
	retrieveInterview: InterviewIdInputSchema,
	createInterview: CreateInterviewInputSchema,
	updateInterview: UpdateInterviewInputSchema,
	deleteInterview: DeleteInterviewInputSchema,
	listNotes: OpportunityIdInputSchema,
	retrieveNote: NoteIdInputSchema,
	createNote: CreateNoteInputSchema,
	updateNote: UpdateNoteInputSchema,
	deleteNote: NoteIdInputSchema,
	listArchiveReasons: PaginationInputSchema.extend({
		type: z.enum(['hired', 'non-hired']).optional(),
	}),
	retrieveArchiveReason: ArchiveReasonIdInputSchema,
	listStages: PaginationInputSchema,
	retrieveStage: z.object({ stageId: IdSchema }),
	listPanels: OpportunityIdInputSchema,
	retrievePanel: z.object({ opportunityId: IdSchema, panelId: IdSchema }),
	createPanel: PanelBodySchema.extend({ opportunityId: IdSchema }).extend(
		RequiredPerformAsSchema.shape,
	),
	updatePanel: z
		.object({ opportunityId: IdSchema, panelId: IdSchema })
		.extend(PanelBodySchema.shape)
		.extend(RequiredPerformAsSchema.shape)
		.passthrough(),
	deletePanel: z
		.object({ opportunityId: IdSchema, panelId: IdSchema })
		.extend(RequiredPerformAsSchema.shape),
	listFeedback: OpportunityIdInputSchema,
	retrieveFeedback: z.object({ opportunityId: IdSchema, feedbackId: IdSchema }),
	createFeedback: CreateFeedbackInputSchema,
	updateFeedback: UpdateFeedbackInputSchema,
	deleteFeedback: DeleteFeedbackInputSchema,
	listFeedbackTemplates: PaginationInputSchema,
	retrieveFeedbackTemplate: z.object({ feedbackTemplateId: IdSchema }),
	createFeedbackTemplate: FeedbackTemplateBodySchema,
	updateFeedbackTemplate: FeedbackTemplateBodySchema.partial().extend({
		feedbackTemplateId: IdSchema,
	}),
	deleteFeedbackTemplate: z.object({ feedbackTemplateId: IdSchema }),
	listFiles: FilesListInputSchema,
	retrieveFile: z.object({ opportunityId: IdSchema, fileId: IdSchema }),
	downloadFile: z.object({ opportunityId: IdSchema, fileId: IdSchema }),
	deleteFile: z
		.object({ opportunityId: IdSchema, fileId: IdSchema })
		.extend(RequiredPerformAsSchema.shape),
	listFormTemplates: PaginationInputSchema,
	retrieveFormTemplate: z.object({ formTemplateId: IdSchema }),
	createFormTemplate: FormTemplateBodySchema,
	updateFormTemplate: FormTemplateBodySchema.partial().extend({
		formTemplateId: IdSchema,
	}),
	deleteFormTemplate: z.object({ formTemplateId: IdSchema }),
	listRequisitionFields: PaginationInputSchema.extend({
		isRequired: z.boolean().optional(),
		type: z.enum(['number', 'text', 'date', 'object', 'dropdown']).optional(),
	}),
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
	listRequisitions: PaginationInputSchema.extend({
		created_at_start: TimestampSchema.optional(),
		created_at_end: TimestampSchema.optional(),
		requisition_code: z.string().optional(),
		status: z.string().optional(),
		confidentiality: z
			.enum(['confidential', 'non-confidential', 'all'])
			.optional(),
	}),
	createRequisition: RequisitionBodySchema,
	retrieveRequisition: z.object({ requisitionId: IdSchema }),
	// Lever replaces the whole requisition on PUT, so the required create
	// fields stay required.
	updateRequisition: RequisitionBodySchema.extend({ requisitionId: IdSchema }),
	deleteRequisition: z.object({ requisitionId: IdSchema }),
	listForms: OpportunityIdInputSchema,
	retrieveForm: z.object({ opportunityId: IdSchema, formId: IdSchema }),
	createForm: CreateProfileFormInputSchema,
	listResumes: OpportunityIdInputSchema.extend({
		uploaded_at_start: TimestampSchema.optional(),
		uploaded_at_end: TimestampSchema.optional(),
	}),
	retrieveResume: z.object({ opportunityId: IdSchema, resumeId: IdSchema }),
	downloadResume: z.object({ opportunityId: IdSchema, resumeId: IdSchema }),
	listUsers: PaginationInputSchema.extend({
		include: MultiValueSchema.optional(),
		email: z.string().optional(),
		accessRole: z.string().optional(),
		includeDeactivated: z.boolean().optional(),
		external_directory_id: z.string().optional(),
	}),
	retrieveUser: z.object({ userId: IdSchema }),
	createUser: CreateUserInputSchema,
	updateUser: UpdateUserInputSchema,
	deactivateUser: z.object({ userId: IdSchema }),
	reactivateUser: z.object({ userId: IdSchema }),
	listReferrals: OpportunityIdInputSchema,
	retrieveReferral: z.object({ opportunityId: IdSchema, referralId: IdSchema }),
	retrieveContact: z.object({ contactId: IdSchema }),
	updateContact: UpdateContactInputSchema,
	retrieveEeoResponsesWithPii: z.object({
		expand: MultiValueSchema.optional(),
		created_at_start: TimestampSchema.optional(),
		created_at_end: TimestampSchema.optional(),
	}),
	retrieveEeoResponsesAnonymous: z.object({
		fromDate: TimestampSchema.optional(),
		toDate: TimestampSchema.optional(),
	}),
	listDispositionStages: z.object({}),
	retrieveDiversitySurvey: z.object({
		postingId: IdSchema,
		country_code: z.string().optional(),
	}),
	listWebhooks: z.object({}),
	createWebhook: CreateWebhookInputSchema,
	updateWebhook: UpdateWebhookInputSchema,
	deleteWebhook: z.object({ webhookId: IdSchema }),
	listAuditEvents: PaginationInputSchema.extend({
		type: z.string().optional(),
		user_id: z.string().optional(),
		target_type: z.string().optional(),
		target_id: z.string().optional(),
		created_at_start: TimestampSchema.optional(),
		created_at_end: TimestampSchema.optional(),
	}),
	listSources: z.object({}),
	listTags: z.object({}),
	listOpportunityOffers: OpportunityIdInputSchema.extend({
		expand: MultiValueSchema.optional(),
	}),
	downloadOpportunityOffer: z.object({
		opportunityId: IdSchema,
		offerId: IdSchema,
		status: z.enum(['sent', 'signed']).optional(),
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
	downloadFile: LeverDownloadOutputSchema,
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
	downloadResume: LeverDownloadOutputSchema,
	listUsers: LeverListOutputSchema,
	retrieveUser: LeverResourceOutputSchema,
	createUser: LeverResourceOutputSchema,
	updateUser: LeverResourceOutputSchema,
	// Both return the updated user wrapped in `data`.
	deactivateUser: LeverResourceOutputSchema,
	reactivateUser: LeverResourceOutputSchema,
	listReferrals: LeverListOutputSchema,
	retrieveReferral: LeverResourceOutputSchema,
	retrieveContact: LeverResourceOutputSchema,
	updateContact: LeverResourceOutputSchema,
	retrieveEeoResponsesWithPii: LeverObjectEnvelopeOutputSchema,
	retrieveEeoResponsesAnonymous: LeverObjectEnvelopeOutputSchema,
	listDispositionStages: LeverObjectEnvelopeOutputSchema,
	retrieveDiversitySurvey: LeverResourceOutputSchema,
	listWebhooks: LeverListOutputSchema,
	createWebhook: LeverResourceOutputSchema,
	updateWebhook: LeverListOutputSchema,
	deleteWebhook: LeverEmptyOutputSchema,
	listAuditEvents: LeverListOutputSchema,
	listSources: LeverListOutputSchema,
	listTags: LeverListOutputSchema,
	listOpportunityOffers: LeverListOutputSchema,
	downloadOpportunityOffer: LeverDownloadOutputSchema,
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
