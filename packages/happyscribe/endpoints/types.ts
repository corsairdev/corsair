import { z } from 'zod';

// Inputs use HappyScribe's own parameter names. Outputs are `.loose()` and
// their documented fields nullish, so a field HappyScribe adds or omits
// cannot fail a call that has already happened. Field reference:
// https://dev.happyscribe.com/sections/product/

// organizations.list returns ids as strings on the live API while the docs
// examples show numbers, so both are accepted and serialized as given.
const OrganizationIdSchema = z
	.union([z.string().min(1), z.number().int().positive()])
	.describe(
		'ID of the organization to act on, as `organizations.list` returned it.',
	);

const FileIdSchema = z
	.string()
	.min(1)
	.describe('Transcription ID, e.g. `9josdjdfo09j309omsldknslkjndfjknsdfs`.');

// Transcriptions page from 0 with per_page default 5; companies and people
// page from 1 with per_page up to 100. Each list input keeps its own page
// semantics.
const PageSchema = z
	.number()
	.int()
	.min(0)
	.optional()
	.describe('Page to retrieve; transcriptions count from 0.');

const PerPageSchema = z
	.number()
	.int()
	.min(1)
	.optional()
	.describe('Results per page.');

const IntelligencePerPageSchema = z
	.number()
	.int()
	.min(1)
	.max(100)
	.optional()
	.describe('Results per page, up to 100; the default is 5.');

const TagsSchema = z
	.array(z.string().min(1))
	.optional()
	.describe('Tags to attach.');

const CompanyRefSchema = z
	.object({
		id: z.number(),
		name: z.string().nullish(),
		primaryDomain: z.string().nullish(),
	})
	.loose();

const PersonRefSchema = z
	.object({
		id: z.number(),
		name: z.string().nullish(),
		primaryEmail: z.string().nullish(),
		company: CompanyRefSchema.nullish(),
	})
	.loose();

// ── shared output shapes ──────────────────────────────────────────────────

// The live API sends transcription fields in snake_case (checked 11-11);
// the reference examples show camelCase.
export const HappyScribeTranscriptionSchema = z
	.object({
		id: z.string(),
		name: z.string().nullish(),
		folder: z
			.object({ id: z.number().nullish(), name: z.string().nullish() })
			.loose()
			.nullish(),
		created_at: z.string().nullish(),
		updated_at: z.string().nullish(),
		sharing_enabled: z.boolean().nullish(),
		share_code: z.string().nullish(),
		// A string rather than the enum: an unknown state must not fail a
		// read. Documented: initial, ingesting, automatic_transcribing,
		// automatic_done, aligning, locked, failed, demo.
		state: z.string().nullish(),
		failure_reason: z.string().nullish(),
		language: z.string().nullish(),
		public_url: z.string().nullish(),
		audio_length_in_seconds: z.number().nullish(),
		cost_in_cents: z.number().nullish(),
		refunded: z.boolean().nullish(),
		soundwave_url: z.string().nullish(),
		audio_url: z.string().nullish(),
		video_url: z.string().nullish(),
		tags: z.array(z.string()).nullish(),
		// unknown: the meeting a notetaker transcription came from; null on
		// uploaded media.
		meeting: z.record(z.string(), z.unknown()).nullish(),
		people: z.array(PersonRefSchema).nullish(),
		companies: z.array(CompanyRefSchema).nullish(),
		// unknown: HATEOAS links (editor_url, download_url) pass through.
		links: z.record(z.string(), z.unknown()).nullish(),
	})
	.loose();

export type HappyScribeTranscription = z.infer<
	typeof HappyScribeTranscriptionSchema
>;

export const HappyScribeMeetingSchema = z
	.object({
		id: z.string(),
		object: z.string().nullish(),
		// HappyScribe sends meeting fields in snake_case.
		meeting_url: z.string().nullish(),
		join_at: z.string().nullish(),
		// Strings rather than enums: queued, joining, in_call, processing,
		// completed, failed must not fail a read that HappyScribe extends.
		status: z.string().nullish(),
		language: z.string().nullish(),
		participants: z
			.array(
				z
					.object({ email: z.string().nullish(), name: z.string().nullish() })
					.loose(),
			)
			.nullish(),
		// unknown: free-form partner metadata passes through as sent.
		metadata: z.record(z.string(), z.unknown()).nullish(),
		// unknown: effective notetaker settings vary by plan and origin.
		settings: z.record(z.string(), z.unknown()).nullish(),
	})
	.loose();

export type HappyScribeMeeting = z.infer<typeof HappyScribeMeetingSchema>;

export const HappyScribeExportSchema = z
	.object({
		id: z.string(),
		// pending on creation, ready once the download exists.
		state: z.string().nullish(),
		format: z.string().nullish(),
		// Export fields are snake_case on the wire.
		show_timestamps: z.boolean().nullish(),
		show_speakers: z.boolean().nullish(),
		show_comments: z.boolean().nullish(),
		show_highlights: z.boolean().nullish(),
		transcription_ids: z.array(z.string()).nullish(),
		download_link: z.string().nullish(),
	})
	.loose();

export type HappyScribeExport = z.infer<typeof HappyScribeExportSchema>;

export const HappyScribeTranslationTaskSchema = z
	.object({
		id: z.string(),
		// done and failed are terminal; working is the running state.
		state: z.string().nullish(),
		failureReason: z.string().nullish(),
		progressPercent: z.number().nullish(),
		targetLanguage: z.string().nullish(),
		translatedTranscriptionId: z.string().nullish(),
	})
	.loose();

export type HappyScribeTranslationTask = z.infer<
	typeof HappyScribeTranslationTaskSchema
>;

export const HappyScribeOrderSchema = z
	.object({
		id: z.string(),
		// Order fields are snake_case on the wire.
		folder_id: z.number().nullish(),
		// incomplete until confirmed, then the human-service lifecycle.
		state: z.string().nullish(),
		// unknown: per-operation service lines vary by order type.
		operations: z.array(z.record(z.string(), z.unknown())).nullish(),
	})
	.loose();

export type HappyScribeOrder = z.infer<typeof HappyScribeOrderSchema>;

export const HappyScribeGlossarySchema = z
	.object({
		id: z.number(),
		name: z.string().nullish(),
		// Glossary fields are snake_case on the wire.
		source_language: z.string().nullish(),
		target_languages: z.array(z.string()).nullish(),
		organization_default: z.boolean().nullish(),
		imported: z.boolean().nullish(),
		created_at: z.string().nullish(),
		updated_at: z.string().nullish(),
	})
	.loose();

export type HappyScribeGlossary = z.infer<typeof HappyScribeGlossarySchema>;

export const HappyScribeStyleGuideSchema = z
	.object({
		id: z.number(),
		// unknown: style guide contents beyond the id are not documented
		// field by field.
		name: z.string().nullish(),
	})
	.loose();

export type HappyScribeStyleGuide = z.infer<typeof HappyScribeStyleGuideSchema>;

// Live (11-11): snake_case fields and a string id (`wks_…`); the
// reference shows camelCase and numbers. Either id type is accepted and
// passed back to organizationId as given.
export const HappyScribeOrganizationSchema = z
	.object({
		id: z.union([z.string(), z.number()]),
		name: z.string().nullish(),
		role: z.string().nullish(),
		created_at: z.string().nullish(),
		updated_at: z.string().nullish(),
		owner_email: z.string().nullish(),
		members_count: z.number().nullish(),
		is_human_transcription_allowed: z.boolean().nullish(),
		is_human_translation_allowed: z.boolean().nullish(),
		email_domains: z.array(z.string()).nullish(),
		idp_company_names: z.array(z.string()).nullish(),
		currency: z.string().nullish(),
		// unknown: free-form organization metadata.
		metadata: z.record(z.string(), z.unknown()).nullish(),
	})
	.loose();

export type HappyScribeOrganization = z.infer<
	typeof HappyScribeOrganizationSchema
>;

// Live (11-11): snake_case fields; organization_id is the organization's
// string id.
export const HappyScribeMembershipSchema = z
	.object({
		id: z.number(),
		organization_id: z.union([z.string(), z.number()]).nullish(),
		organization_name: z.string().nullish(),
		email: z.string().nullish(),
		name: z.string().nullish(),
		role: z.string().nullish(),
		created_at: z.string().nullish(),
		updated_at: z.string().nullish(),
	})
	.loose();

export type HappyScribeMembership = z.infer<typeof HappyScribeMembershipSchema>;

export const HappyScribeCompanySchema = z
	.object({
		id: z.number(),
		name: z.string().nullish(),
		primaryDomain: z.string().nullish(),
		domains: z.array(z.string()).nullish(),
		industry: z.string().nullish(),
		employeeCount: z.number().nullish(),
		foundedYear: z.number().nullish(),
		shortDescription: z.string().nullish(),
		keywords: z.array(z.string()).nullish(),
		city: z.string().nullish(),
		country: z.string().nullish(),
		websiteUrl: z.string().nullish(),
		linkedinUrl: z.string().nullish(),
		logoUrl: z.string().nullish(),
		totalFunding: z.number().nullish(),
		annualRevenue: z.number().nullish(),
		latestFundingStage: z.string().nullish(),
		createdAt: z.string().nullish(),
		updatedAt: z.string().nullish(),
	})
	.loose();

export type HappyScribeCompany = z.infer<typeof HappyScribeCompanySchema>;

export const HappyScribePersonSchema = z
	.object({
		id: z.number(),
		name: z.string().nullish(),
		fullName: z.string().nullish(),
		emails: z.array(z.string()).nullish(),
		primaryEmail: z.string().nullish(),
		company: CompanyRefSchema.nullish(),
		jobTitle: z.string().nullish(),
		seniority: z.string().nullish(),
		headline: z.string().nullish(),
		linkedinUrl: z.string().nullish(),
		city: z.string().nullish(),
		country: z.string().nullish(),
		photoUrl: z.string().nullish(),
		avatarUrl: z.string().nullish(),
		enrichedAt: z.string().nullish(),
		createdAt: z.string().nullish(),
		updatedAt: z.string().nullish(),
	})
	.loose();

export type HappyScribePerson = z.infer<typeof HappyScribePersonSchema>;

// List endpoints answer `{ results: [...], _links: { next: { url } } }`; the
// shape helper flattens `_links.next.url` into nextPageUrl for the caller.
export const HappyScribeTranscriptionListSchema = z
	.object({
		results: z.array(HappyScribeTranscriptionSchema),
		nextPageUrl: z.string().nullish(),
	})
	.loose();

export const HappyScribeCompanyListSchema = z
	.object({
		results: z.array(HappyScribeCompanySchema),
		nextPageUrl: z.string().nullish(),
	})
	.loose();

export const HappyScribePersonListSchema = z
	.object({
		results: z.array(HappyScribePersonSchema),
		nextPageUrl: z.string().nullish(),
	})
	.loose();

// unknown: list wrappers other than transcriptions/companies/people are
// keyed by resource (`glossaries`, `members`, organizations as an array);
// the shape helpers below normalize each to its documented key.
export const HappyScribeGlossaryListSchema = z
	.object({ glossaries: z.array(HappyScribeGlossarySchema) })
	.loose();

// Memberships page 25 at a time; the shape helper flattens
// `_links.next.url` into nextPageUrl.
export const HappyScribeMembershipListSchema = z
	.object({
		members: z.array(HappyScribeMembershipSchema),
		nextPageUrl: z.string().nullish(),
	})
	.loose();

// Adding answers `{ member }` (201) for an existing user or `{ invite }`
// (202) when HappyScribe emailed an invitation instead.
const HappyScribeMembershipAddResultSchema = z
	.object({
		member: HappyScribeMembershipSchema.nullish(),
		invite: z
			.object({ email: z.string().nullish(), role: z.string().nullish() })
			.loose()
			.nullish(),
	})
	.loose();

// A role change answers `{ member }`.
const HappyScribeMembershipUpdateResultSchema = z
	.object({ member: HappyScribeMembershipSchema.nullish() })
	.loose();

export const HappyScribeOrganizationListSchema = z
	.object({ organizations: z.array(HappyScribeOrganizationSchema) })
	.loose();

export const HappyScribeStyleGuideListSchema = z
	.object({ styleGuides: z.array(HappyScribeStyleGuideSchema) })
	.loose();

// ── transcriptions.list ───────────────────────────────────────────────────

const TranscriptionsListInputSchema = z.object({
	organizationId: OrganizationIdSchema.describe(
		'Organization to list transcriptions from.',
	),
	folderId: z
		.number()
		.int()
		.optional()
		.describe('Only transcriptions inside this folder or its subfolders.'),
	page: PageSchema,
	perPage: PerPageSchema,
	personId: z
		.number()
		.int()
		.optional()
		.describe('Intelligence API: transcriptions where this person was linked.'),
	personEmail: z
		.string()
		.optional()
		.describe('Intelligence API: same, resolved by email.'),
	companyId: z
		.number()
		.int()
		.optional()
		.describe(
			'Intelligence API: transcriptions with a participant from this company.',
		),
	companyDomain: z
		.string()
		.optional()
		.describe('Intelligence API: same, resolved by domain.'),
});

export type TranscriptionsListInput = z.input<
	typeof TranscriptionsListInputSchema
>;

const TranscriptionsListResponseSchema = HappyScribeTranscriptionListSchema;

// ── transcriptions.create ─────────────────────────────────────────────────

const TranscriptionsCreateInputSchema = z.object({
	organizationId: OrganizationIdSchema,
	name: z.string().min(1).describe('Name of the transcription.'),
	language: z
		.string()
		.min(1)
		.describe('BCP-47 language code the media is spoken in, e.g. `en-GB`.'),
	tmpUrl: z
		.string()
		.min(1)
		.describe('Public https URL of the media file to transcribe.'),
	isSubtitle: z
		.boolean()
		.optional()
		.describe('Create a subtitle file instead of a transcript.'),
	folderId: z
		.number()
		.int()
		.optional()
		.describe('Folder to create the transcription in.'),
	tags: TagsSchema,
});

export type TranscriptionsCreateInput = z.input<
	typeof TranscriptionsCreateInputSchema
>;

const TranscriptionsCreateResponseSchema = HappyScribeTranscriptionSchema;

// ── transcriptions.getDetails / getSummary / updateDetails / delete ───────

const TranscriptionsGetDetailsInputSchema = z.object({ fileId: FileIdSchema });

export type TranscriptionsGetDetailsInput = z.input<
	typeof TranscriptionsGetDetailsInputSchema
>;

const TranscriptionsGetDetailsResponseSchema = HappyScribeTranscriptionSchema;

const TranscriptionsGetSummaryInputSchema = z.object({ fileId: FileIdSchema });

export type TranscriptionsGetSummaryInput = z.input<
	typeof TranscriptionsGetSummaryInputSchema
>;

const TranscriptionsGetSummaryResponseSchema = z
	.object({ summary: z.string().nullish() })
	.loose();

const TranscriptionsUpdateDetailsInputSchema = z.object({
	fileId: FileIdSchema,
	organizationId: OrganizationIdSchema.describe(
		'Organization the transcription belongs to.',
	),
	name: z.string().min(1).optional().describe('New name.'),
	folderId: z
		.number()
		.int()
		.optional()
		.describe('Folder in the same organization to move the transcription to.'),
	sharingEnabled: z
		.boolean()
		.optional()
		.describe('Turn the public sharing link on or off.'),
});

export type TranscriptionsUpdateDetailsInput = z.input<
	typeof TranscriptionsUpdateDetailsInputSchema
>;

const TranscriptionsUpdateDetailsResponseSchema =
	HappyScribeTranscriptionSchema;

const TranscriptionsDeleteInputSchema = z.object({
	fileId: FileIdSchema,
	permanent: z
		.boolean()
		.optional()
		.describe(
			'Delete for good. Without it the transcription moves to the Trash and can be restored.',
		),
});

export type TranscriptionsDeleteInput = z.input<
	typeof TranscriptionsDeleteInputSchema
>;

// delete answers an empty body; the file is gone.
const TranscriptionsDeleteResponseSchema = z.object({}).loose();

// ── exports.create / exports.get ──────────────────────────────────────────

// The documented format list; mp3 and mp4 take exactly one transcription.
const EXPORT_FORMATS = [
	'txt',
	'docx',
	'pdf',
	'srt',
	'vtt',
	'stl',
	'avid',
	'avid_script',
	'avid_ds_subtitles',
	'avid_edl',
	'facebook_srt',
	'html',
	'premiere',
	'maxqda',
	'json',
	'fcp',
	'edl',
	'csv',
	'xlsx',
	'mp3',
	'mp4',
] as const;

const TranscriptionsCreateExportInputSchema = z.object({
	format: z
		.enum(EXPORT_FORMATS)
		.describe('Export format, e.g. `txt`, `srt`, `vtt`, `docx`, `json`.'),
	transcriptionIds: z
		.array(FileIdSchema)
		.min(1)
		.describe('Transcription IDs to include in the export.'),
	showTimestamps: z
		.boolean()
		.optional()
		.describe('Include timestamps in the exported file.'),
	showSpeakers: z.boolean().optional().describe('Include speaker names.'),
	showComments: z.boolean().optional().describe('Include comments.'),
	showHighlights: z.boolean().optional().describe('Include highlights.'),
});

export type TranscriptionsCreateExportInput = z.input<
	typeof TranscriptionsCreateExportInputSchema
>;

const TranscriptionsCreateExportResponseSchema = HappyScribeExportSchema;

const TranscriptionsGetExportInputSchema = z.object({
	exportId: z.string().min(1).describe('Export ID from an export creation.'),
});

export type TranscriptionsGetExportInput = z.input<
	typeof TranscriptionsGetExportInputSchema
>;

const TranscriptionsGetExportResponseSchema = HappyScribeExportSchema;

// ── translations.createTask / getTask ─────────────────────────────────────

const TranslationsCreateTaskInputSchema = z.object({
	sourceTranscriptionId: FileIdSchema.describe('Transcription to translate.'),
	targetLanguage: z
		.string()
		.min(1)
		.describe('BCP-47 code of the language to translate into, e.g. `es`.'),
});

export type TranslationsCreateTaskInput = z.input<
	typeof TranslationsCreateTaskInputSchema
>;

const TranslationsCreateTaskResponseSchema = HappyScribeTranslationTaskSchema;

const TranslationsGetTaskInputSchema = z.object({
	taskId: z
		.string()
		.min(1)
		.describe('Translation task ID from a creation call.'),
});

export type TranslationsGetTaskInput = z.input<
	typeof TranslationsGetTaskInputSchema
>;

const TranslationsGetTaskResponseSchema = HappyScribeTranslationTaskSchema;

// ── meetings.create / meetings.get ────────────────────────────────────────

const MeetingsCreateInputSchema = z.object({
	organizationId: OrganizationIdSchema,
	meetingUrl: z
		.string()
		.min(1)
		.describe(
			'Meeting room URL the notetaker joins, e.g. a Zoom or Meet link.',
		),
	joinAt: z
		.string()
		.min(1)
		.optional()
		.describe(
			'Future ISO 8601 moment, with a UTC offset, for the notetaker to join. Omit to send it now.',
		),
	language: z
		.string()
		.min(1)
		.optional()
		.describe('Spoken language code, e.g. `en`, or `auto`.'),
	participants: z
		.array(
			z.object({
				email: z.string().min(1),
				name: z.string().min(1),
			}),
		)
		.optional()
		.describe('People on the call; the notetaker greets them by name.'),
	// unknown: free-form partner metadata passes through as sent.
	metadata: z
		.record(z.string(), z.unknown())
		.optional()
		.describe('Free-form metadata echoed on the meeting and its webhooks.'),
	botName: z.string().optional().describe('Display name of the notetaker bot.'),
	recordingMode: z
		.enum(['audio_only', 'audio_and_video'])
		.optional()
		.describe('What the notetaker records.'),
	summaryTemplate: z
		.string()
		.optional()
		.describe('Summary template slug, e.g. `sales_call`.'),
	// No access level: the live API answers 400 "access_level is not a bot
	// field" to it, at the top level and inside `settings`.
});

export type MeetingsCreateInput = z.input<typeof MeetingsCreateInputSchema>;

const MeetingsCreateResponseSchema = HappyScribeMeetingSchema;

const MeetingsGetInputSchema = z.object({
	meetingId: z
		.string()
		.min(1)
		.describe('Meeting ID, e.g. `mtg_01k0h4r9s8x7c2dvq3m5n6p4ab`.'),
});

export type MeetingsGetInput = z.input<typeof MeetingsGetInputSchema>;

const MeetingsGetResponseSchema = HappyScribeMeetingSchema;

// ── uploads.getSignedUrl ──────────────────────────────────────────────────

const UploadsGetSignedUrlInputSchema = z.object({
	filename: z
		.string()
		.min(1)
		.describe('File name the upload gets in storage, e.g. `my_media.mp3`.'),
});

export type UploadsGetSignedUrlInput = z.input<
	typeof UploadsGetSignedUrlInputSchema
>;

const UploadsGetSignedUrlResponseSchema = z
	.object({
		// The caller PUTs the file bytes to this S3 URL themselves; it is
		// pre-signed and needs no credentials.
		signedUrl: z.string(),
	})
	.loose();

// ── glossaries.list / styleGuides.list / organizations.list ───────────────

const GlossariesListInputSchema = z.object({
	organizationId: OrganizationIdSchema,
});

export type GlossariesListInput = z.input<typeof GlossariesListInputSchema>;

const GlossariesListResponseSchema = HappyScribeGlossaryListSchema;

const StyleGuidesListInputSchema = z.object({
	organizationId: OrganizationIdSchema,
});

export type StyleGuidesListInput = z.input<typeof StyleGuidesListInputSchema>;

const StyleGuidesListResponseSchema = HappyScribeStyleGuideListSchema;

const OrganizationsListInputSchema = z.object({});

export type OrganizationsListInput = z.input<
	typeof OrganizationsListInputSchema
>;

const OrganizationsListResponseSchema = HappyScribeOrganizationListSchema;

// ── memberships.list / add / updateRole / remove ──────────────────────────

const MembershipsListInputSchema = z.object({
	organizationId: OrganizationIdSchema,
	page: z
		.number()
		.int()
		.min(1)
		.optional()
		.describe('Page to retrieve; memberships count from 1, 25 per page.'),
});

export type MembershipsListInput = z.input<typeof MembershipsListInputSchema>;

const MembershipsListResponseSchema = HappyScribeMembershipListSchema;

const MembershipsAddInputSchema = z.object({
	organizationId: OrganizationIdSchema,
	email: z.string().min(1).describe('Email of the user to add.'),
	role: z.enum(['admin', 'member']).describe('Role the member gets.'),
});

export type MembershipsAddInput = z.input<typeof MembershipsAddInputSchema>;

const MembershipsAddResponseSchema = HappyScribeMembershipAddResultSchema;

const MembershipsUpdateRoleInputSchema = z.object({
	membershipId: z.number().int().describe('Membership ID to change.'),
	role: z.enum(['admin', 'member']).describe('New role for the member.'),
});

export type MembershipsUpdateRoleInput = z.input<
	typeof MembershipsUpdateRoleInputSchema
>;

const MembershipsUpdateRoleResponseSchema =
	HappyScribeMembershipUpdateResultSchema;

const MembershipsRemoveInputSchema = z.object({
	membershipId: z.number().int().describe('Membership ID to remove.'),
});

export type MembershipsRemoveInput = z.input<
	typeof MembershipsRemoveInputSchema
>;

const MembershipsRemoveResponseSchema = z.object({}).loose();

// ── orders.create / createTranslation / get / confirm ─────────────────────

const OrdersCreateInputSchema = z.object({
	url: z
		.string()
		.min(1)
		.describe('Public URL of the media to transcribe or subtitle.'),
	language: z.string().min(1).describe('Spoken language code of the media.'),
	service: z
		.enum(['auto', 'pro'])
		.optional()
		.describe('`auto` (the default) for machine work, `pro` for human work.'),
	confirm: z
		.boolean()
		.optional()
		.describe(
			'Confirm and pay immediately instead of leaving the order incomplete.',
		),
	organizationId: OrganizationIdSchema,
	folderId: z.number().int().optional().describe('Folder ID for the result.'),
	folder: z
		.string()
		.optional()
		.describe('Folder path for the result, e.g. `my_project`.'),
	name: z.string().optional().describe('Name of the ordered transcription.'),
	tags: TagsSchema,
	boost: z.boolean().optional().describe('Pay for faster delivery.'),
	isSubtitle: z
		.boolean()
		.optional()
		.describe('Order subtitling instead of transcription.'),
	webhookUrl: z
		.string()
		.optional()
		.describe('URL notified when the order finishes.'),
	glossaryIds: z
		.array(z.number().int())
		.optional()
		.describe('Glossaries the human translators use.'),
	styleGuideId: z
		.number()
		.int()
		.optional()
		.describe('Style guide the human translators use.'),
});

export type OrdersCreateInput = z.input<typeof OrdersCreateInputSchema>;

const OrdersCreateResponseSchema = HappyScribeOrderSchema;

const OrdersCreateTranslationInputSchema = z.object({
	sourceTranscriptionId: FileIdSchema.describe('Transcription to translate.'),
	targetLanguages: z
		.array(z.string().min(1))
		.min(1)
		.describe('Languages to translate into.'),
	service: z
		.enum(['auto', 'pro'])
		.optional()
		.describe(
			'`auto` (the default) for machine translation, `pro` for human translators.',
		),
	confirm: z.boolean().optional().describe('Confirm and pay immediately.'),
	organizationId: OrganizationIdSchema,
	glossaryIds: z
		.array(z.number().int())
		.optional()
		.describe('Glossaries for the translators.'),
});

export type OrdersCreateTranslationInput = z.input<
	typeof OrdersCreateTranslationInputSchema
>;

const OrdersCreateTranslationResponseSchema = HappyScribeOrderSchema;

const OrdersGetInputSchema = z.object({
	orderId: z.string().min(1).describe('Order ID from an order creation.'),
});

export type OrdersGetInput = z.input<typeof OrdersGetInputSchema>;

const OrdersGetResponseSchema = HappyScribeOrderSchema;

const OrdersConfirmInputSchema = z.object({
	orderId: z
		.string()
		.min(1)
		.describe('Incomplete order to confirm and pay for.'),
});

export type OrdersConfirmInput = z.input<typeof OrdersConfirmInputSchema>;

const OrdersConfirmResponseSchema = HappyScribeOrderSchema;

// ── companies.list / get; people.list / get ───────────────────────────────

const CompaniesListInputSchema = z.object({
	organizationId: OrganizationIdSchema,
	search: z
		.string()
		.optional()
		.describe('Case-insensitive substring match on company name.'),
	domain: z
		.string()
		.optional()
		.describe('Exact match on the primary domain or any known domain.'),
	page: z
		.number()
		.int()
		.min(1)
		.optional()
		.describe('Page to retrieve; companies count from 1.'),
	perPage: IntelligencePerPageSchema,
});

export type CompaniesListInput = z.input<typeof CompaniesListInputSchema>;

const CompaniesListResponseSchema = HappyScribeCompanyListSchema;

// The API answers 400 without organization_id, even on a read by id.
const CompaniesGetInputSchema = z.object({
	companyId: z.number().int().describe('Company ID to retrieve.'),
	organizationId: OrganizationIdSchema,
});

export type CompaniesGetInput = z.input<typeof CompaniesGetInputSchema>;

const CompaniesGetResponseSchema = HappyScribeCompanySchema;

const PeopleListInputSchema = z.object({
	organizationId: OrganizationIdSchema,
	search: z
		.string()
		.optional()
		.describe('Full-text match over name and email fields.'),
	email: z.string().optional().describe('Exact email match, case-insensitive.'),
	companyId: z
		.number()
		.int()
		.optional()
		.describe('Only people of this company.'),
	page: z
		.number()
		.int()
		.min(1)
		.optional()
		.describe('Page to retrieve; people count from 1.'),
	perPage: IntelligencePerPageSchema,
});

export type PeopleListInput = z.input<typeof PeopleListInputSchema>;

const PeopleListResponseSchema = HappyScribePersonListSchema;

const PeopleGetInputSchema = z.object({
	personId: z.number().int().describe('Person ID to retrieve.'),
	organizationId: OrganizationIdSchema,
});

export type PeopleGetInput = z.input<typeof PeopleGetInputSchema>;

const PeopleGetResponseSchema = HappyScribePersonSchema;

// ── registry ──────────────────────────────────────────────────────────────

export type HappyScribeEndpointInputs = {
	transcriptionsList: TranscriptionsListInput;
	transcriptionsCreate: TranscriptionsCreateInput;
	transcriptionsGetDetails: TranscriptionsGetDetailsInput;
	transcriptionsGetSummary: TranscriptionsGetSummaryInput;
	transcriptionsUpdateDetails: TranscriptionsUpdateDetailsInput;
	transcriptionsDelete: TranscriptionsDeleteInput;
	exportsCreate: TranscriptionsCreateExportInput;
	exportsGet: TranscriptionsGetExportInput;
	translationsCreateTask: TranslationsCreateTaskInput;
	translationsGetTask: TranslationsGetTaskInput;
	meetingsCreate: MeetingsCreateInput;
	meetingsGet: MeetingsGetInput;
	uploadsGetSignedUrl: UploadsGetSignedUrlInput;
	glossariesList: GlossariesListInput;
	styleGuidesList: StyleGuidesListInput;
	organizationsList: OrganizationsListInput;
	membershipsList: MembershipsListInput;
	membershipsAdd: MembershipsAddInput;
	membershipsUpdateRole: MembershipsUpdateRoleInput;
	membershipsRemove: MembershipsRemoveInput;
	ordersCreate: OrdersCreateInput;
	ordersCreateTranslation: OrdersCreateTranslationInput;
	ordersGet: OrdersGetInput;
	ordersConfirm: OrdersConfirmInput;
	companiesList: CompaniesListInput;
	companiesGet: CompaniesGetInput;
	peopleList: PeopleListInput;
	peopleGet: PeopleGetInput;
};

export type HappyScribeEndpointOutputs = {
	transcriptionsList: z.infer<typeof TranscriptionsListResponseSchema>;
	transcriptionsCreate: z.infer<typeof TranscriptionsCreateResponseSchema>;
	transcriptionsGetDetails: z.infer<
		typeof TranscriptionsGetDetailsResponseSchema
	>;
	transcriptionsGetSummary: z.infer<
		typeof TranscriptionsGetSummaryResponseSchema
	>;
	transcriptionsUpdateDetails: z.infer<
		typeof TranscriptionsUpdateDetailsResponseSchema
	>;
	transcriptionsDelete: z.infer<typeof TranscriptionsDeleteResponseSchema>;
	exportsCreate: z.infer<typeof TranscriptionsCreateExportResponseSchema>;
	exportsGet: z.infer<typeof TranscriptionsGetExportResponseSchema>;
	translationsCreateTask: z.infer<typeof TranslationsCreateTaskResponseSchema>;
	translationsGetTask: z.infer<typeof TranslationsGetTaskResponseSchema>;
	meetingsCreate: z.infer<typeof MeetingsCreateResponseSchema>;
	meetingsGet: z.infer<typeof MeetingsGetResponseSchema>;
	uploadsGetSignedUrl: z.infer<typeof UploadsGetSignedUrlResponseSchema>;
	glossariesList: z.infer<typeof GlossariesListResponseSchema>;
	styleGuidesList: z.infer<typeof StyleGuidesListResponseSchema>;
	organizationsList: z.infer<typeof OrganizationsListResponseSchema>;
	membershipsList: z.infer<typeof MembershipsListResponseSchema>;
	membershipsAdd: z.infer<typeof MembershipsAddResponseSchema>;
	membershipsUpdateRole: z.infer<typeof MembershipsUpdateRoleResponseSchema>;
	membershipsRemove: z.infer<typeof MembershipsRemoveResponseSchema>;
	ordersCreate: z.infer<typeof OrdersCreateResponseSchema>;
	ordersCreateTranslation: z.infer<
		typeof OrdersCreateTranslationResponseSchema
	>;
	ordersGet: z.infer<typeof OrdersGetResponseSchema>;
	ordersConfirm: z.infer<typeof OrdersConfirmResponseSchema>;
	companiesList: z.infer<typeof CompaniesListResponseSchema>;
	companiesGet: z.infer<typeof CompaniesGetResponseSchema>;
	peopleList: z.infer<typeof PeopleListResponseSchema>;
	peopleGet: z.infer<typeof PeopleGetResponseSchema>;
};

export const HappyScribeEndpointInputSchemas = {
	transcriptionsList: TranscriptionsListInputSchema,
	transcriptionsCreate: TranscriptionsCreateInputSchema,
	transcriptionsGetDetails: TranscriptionsGetDetailsInputSchema,
	transcriptionsGetSummary: TranscriptionsGetSummaryInputSchema,
	transcriptionsUpdateDetails: TranscriptionsUpdateDetailsInputSchema,
	transcriptionsDelete: TranscriptionsDeleteInputSchema,
	exportsCreate: TranscriptionsCreateExportInputSchema,
	exportsGet: TranscriptionsGetExportInputSchema,
	translationsCreateTask: TranslationsCreateTaskInputSchema,
	translationsGetTask: TranslationsGetTaskInputSchema,
	meetingsCreate: MeetingsCreateInputSchema,
	meetingsGet: MeetingsGetInputSchema,
	uploadsGetSignedUrl: UploadsGetSignedUrlInputSchema,
	glossariesList: GlossariesListInputSchema,
	styleGuidesList: StyleGuidesListInputSchema,
	organizationsList: OrganizationsListInputSchema,
	membershipsList: MembershipsListInputSchema,
	membershipsAdd: MembershipsAddInputSchema,
	membershipsUpdateRole: MembershipsUpdateRoleInputSchema,
	membershipsRemove: MembershipsRemoveInputSchema,
	ordersCreate: OrdersCreateInputSchema,
	ordersCreateTranslation: OrdersCreateTranslationInputSchema,
	ordersGet: OrdersGetInputSchema,
	ordersConfirm: OrdersConfirmInputSchema,
	companiesList: CompaniesListInputSchema,
	companiesGet: CompaniesGetInputSchema,
	peopleList: PeopleListInputSchema,
	peopleGet: PeopleGetInputSchema,
};

export const HappyScribeEndpointOutputSchemas = {
	transcriptionsList: TranscriptionsListResponseSchema,
	transcriptionsCreate: TranscriptionsCreateResponseSchema,
	transcriptionsGetDetails: TranscriptionsGetDetailsResponseSchema,
	transcriptionsGetSummary: TranscriptionsGetSummaryResponseSchema,
	transcriptionsUpdateDetails: TranscriptionsUpdateDetailsResponseSchema,
	transcriptionsDelete: TranscriptionsDeleteResponseSchema,
	exportsCreate: TranscriptionsCreateExportResponseSchema,
	exportsGet: TranscriptionsGetExportResponseSchema,
	translationsCreateTask: TranslationsCreateTaskResponseSchema,
	translationsGetTask: TranslationsGetTaskResponseSchema,
	meetingsCreate: MeetingsCreateResponseSchema,
	meetingsGet: MeetingsGetResponseSchema,
	uploadsGetSignedUrl: UploadsGetSignedUrlResponseSchema,
	glossariesList: GlossariesListResponseSchema,
	styleGuidesList: StyleGuidesListResponseSchema,
	organizationsList: OrganizationsListResponseSchema,
	membershipsList: MembershipsListResponseSchema,
	membershipsAdd: MembershipsAddResponseSchema,
	membershipsUpdateRole: MembershipsUpdateRoleResponseSchema,
	membershipsRemove: MembershipsRemoveResponseSchema,
	ordersCreate: OrdersCreateResponseSchema,
	ordersCreateTranslation: OrdersCreateTranslationResponseSchema,
	ordersGet: OrdersGetResponseSchema,
	ordersConfirm: OrdersConfirmResponseSchema,
	companiesList: CompaniesListResponseSchema,
	companiesGet: CompaniesGetResponseSchema,
	peopleList: PeopleListResponseSchema,
	peopleGet: PeopleGetResponseSchema,
};
