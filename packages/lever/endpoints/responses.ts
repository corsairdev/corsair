import { z } from 'zod';

// Response records for the Lever Data API, from the attribute tables in
// https://hire.lever.co/developer/documentation. Each record requires its
// identifier and types the documented fields; everything else Lever sends is
// kept (.loose()) so new provider fields pass through. Fields are nullish
// unless Lever documents them as always present, because Lever omits or nulls
// many of them depending on account settings, `include` and `expand`.

// Any JSON object Lever returns whose keys depend on configuration (form
// field values, custom fields, parsed resume data, event metadata).
const LooseObject = z.object({}).loose();
const Text = z.string().nullish();
const Flag = z.boolean().nullish();
// Lever timestamps are milliseconds since the epoch; a few endpoints send
// them as numeric strings (file uploadedAt, EEO appliedAt).
const Timestamp = z.union([z.number(), z.string()]).nullish();
const Strings = z.array(z.string()).nullish();
// Fields that hold an ID by default and a full object when the request uses
// `expand` (owner, stage, posting, followers, ...).
const Expandable = z.union([z.string(), LooseObject]).nullish();
const ExpandableList = z.array(z.union([z.string(), LooseObject])).nullish();

// Lever adds values to status-like fields over time (new origins, states,
// access roles). These stay strings so a new value never fails parsing; the
// known values are listed in the description.
const openEnum = (values: readonly string[]) =>
	z
		.string()
		.describe(`Known values: ${values.join(', ')}`)
		.nullish();

const PhoneRecord = z
	.object({ type: Text, value: z.string().nullish() })
	.loose();

// A form field as returned on feedback, profile forms, referrals, notes and
// templates. Its value type depends on the field type (text, number, date,
// string list, scorecard object).
const FormFieldRecord = z
	.object({
		id: Text,
		type: Text,
		text: Text,
		description: Text,
		required: Flag,
		// unknown: the value's type depends on the field type (string, number,
		// string[] or scorecard object), so no single stricter type fits.
		value: z.unknown().optional(),
		options: z.array(LooseObject).nullish(),
	})
	.loose();

// ── Envelopes ────────────────────────────────────────────────────────────────

// Single resources come back as { data: record }.
export const envelope = <T extends z.ZodType>(record: T) =>
	z.object({ data: record }).loose();

// Every list endpoint returns { data, hasNext, next }. `next` is an opaque
// offset token: pass it back as `offset` to fetch the following page.
export const listOf = <T extends z.ZodType>(record: T) =>
	z
		.object({
			data: z.array(record),
			hasNext: z.boolean().optional(),
			next: z.string().optional(),
		})
		.loose();

// ── Opportunities, applications, contacts ───────────────────────────────────

export const OpportunityRecord = z
	.object({
		id: z.string(),
		name: Text,
		headline: Text,
		contact: Expandable,
		emails: Strings,
		phones: z.array(PhoneRecord).nullish(),
		confidentiality: openEnum(['confidential', 'non-confidential']),
		location: Text,
		locationDetails: LooseObject.nullish(),
		links: Strings,
		archived: z
			.object({ archivedAt: Timestamp, reason: Expandable })
			.loose()
			.nullish(),
		tags: Strings,
		sources: Strings,
		stageChanges: z.array(LooseObject).nullish(),
		origin: openEnum([
			'agency',
			'applied',
			'internal',
			'referred',
			'sourced',
			'university',
		]),
		sourcedBy: Expandable,
		owner: Expandable,
		followers: ExpandableList,
		applications: ExpandableList,
		stage: Expandable,
		resume: Expandable,
		createdAt: Timestamp,
		updatedAt: Timestamp,
		lastInteractionAt: Timestamp,
		lastAdvancedAt: Timestamp,
		snoozedUntil: Timestamp,
		isAnonymized: Flag,
		dataProtection: LooseObject.nullish(),
		urls: z.object({ list: Text, show: Text }).loose().nullish(),
	})
	.loose();

export const ApplicationRecord = z
	.object({
		id: z.string(),
		opportunityId: Text,
		candidateId: Text,
		createdAt: Timestamp,
		type: openEnum(['posting', 'user', 'referral']),
		posting: Expandable,
		postingHiringManager: Expandable,
		postingOwner: Expandable,
		user: Expandable,
		name: Text,
		email: Text,
		phone: z.union([PhoneRecord, z.string()]).nullish(),
		company: Text,
		links: Strings,
		comments: Text,
		customQuestions: z.array(LooseObject).nullish(),
		archived: LooseObject.nullish(),
		requisitionForHire: LooseObject.nullish(),
	})
	.loose();

// Deleted opportunities, applications and postings.
export const DeletedRecord = z
	.object({
		id: z.string(),
		deletedAt: Timestamp,
		opportunityId: Text,
		postingId: Text,
	})
	.loose();

export const FileActionRecord = z
	.object({
		id: z.string(),
		opportunityId: Text,
		type: openEnum(['file-added', 'resume-imported', 'file-remove']),
		occurredAt: Timestamp,
		createdAt: Timestamp,
		user: Expandable,
		meta: LooseObject.nullish(),
	})
	.loose();

export const ContactRecord = z
	.object({
		id: z.string(),
		name: Text,
		headline: Text,
		isAnonymized: Flag,
		location: z.union([z.string(), LooseObject]).nullish(),
		emails: Strings,
		phones: z.array(PhoneRecord).nullish(),
	})
	.loose();

// ── Postings ─────────────────────────────────────────────────────────────────

export const PostingRecord = z
	.object({
		id: z.string(),
		text: Text,
		createdAt: Timestamp,
		updatedAt: Timestamp,
		user: Expandable,
		owner: Expandable,
		hiringManager: Expandable,
		confidentiality: openEnum(['confidential', 'non-confidential']),
		categories: z
			.object({
				team: Text,
				department: Text,
				location: Text,
				commitment: Text,
				level: Text,
				allLocations: Strings,
			})
			.loose()
			.nullish(),
		content: LooseObject.nullish(),
		country: Text,
		followers: ExpandableList,
		tags: Strings,
		state: openEnum([
			'published',
			'internal',
			'closed',
			'draft',
			'pending',
			'rejected',
		]),
		distributionChannels: Strings,
		reqCode: Text,
		requisitionCodes: Strings,
		salaryDescription: Text,
		salaryDescriptionHtml: Text,
		salaryRange: LooseObject.nullish(),
		urls: LooseObject.nullish(),
		workplaceType: openEnum(['onsite', 'remote', 'hybrid', 'unspecified']),
	})
	.loose();

export const ApplicationFormRecord = z
	.object({
		id: z.string(),
		text: Text,
		customQuestions: z.array(LooseObject).nullish(),
		personalInformation: z.array(LooseObject).nullish(),
		urls: z.array(LooseObject).nullish(),
		eeoQuestions: LooseObject.nullish(),
	})
	.loose();

const PostingAccessRecord = z
	.object({
		posting: z.object({ id: z.string(), text: Text }).loose(),
		users: z
			.array(
				z
					.object({
						id: z.string(),
						name: Text,
						email: Text,
						inheritedFromRoleId: Text,
						conditions: LooseObject.nullish(),
					})
					.loose(),
			)
			.nullish(),
		roles: z
			.array(
				z
					.object({
						id: z.string(),
						name: Text,
						isReadOnly: Flag,
						conditions: LooseObject.nullish(),
					})
					.loose(),
			)
			.nullish(),
	})
	.loose();
// Lever documents this response without the usual `data` wrapper; accept
// both forms.
export const PostingAccessOutput = z.union([
	PostingAccessRecord,
	envelope(PostingAccessRecord),
]);

// ── Interviews and panels ────────────────────────────────────────────────────

export const InterviewRecord = z
	.object({
		id: z.string(),
		panel: Expandable,
		subject: Text,
		note: Text,
		interviewers: z.array(LooseObject).nullish(),
		timezone: Text,
		createdAt: Timestamp,
		date: Timestamp,
		duration: z.number().nullish(),
		location: Text,
		feedbackTemplate: Expandable,
		feedbackForms: ExpandableList,
		feedbackReminder: openEnum(['once', 'daily', 'frequently', 'none']),
		user: Expandable,
		stage: Expandable,
		canceledAt: Timestamp,
		postings: ExpandableList,
		gcalEventUrl: Text,
		conferences: z.array(LooseObject).nullish(),
	})
	.loose();

export const PanelRecord = z
	.object({
		id: z.string(),
		applications: ExpandableList,
		canceledAt: Timestamp,
		createdAt: Timestamp,
		start: Timestamp,
		end: Timestamp,
		timezone: Text,
		feedbackReminder: openEnum(['once', 'daily', 'frequently', 'none']),
		user: Expandable,
		stage: Expandable,
		note: Text,
		externallyManaged: Flag,
		externalUrl: Text,
		interviews: z.array(InterviewRecord).nullish(),
	})
	.loose();

// Creating or updating an interview or panel returns { data: { data: [...],
// hasNext } } per Lever's examples; a single record in `data` is accepted too.
export const scheduledOutput = <T extends z.ZodType>(record: T) =>
	envelope(z.union([listOf(record), record]));

// ── Notes, feedback, forms, referrals ───────────────────────────────────────

export const NoteRecord = z
	.object({
		id: z.string(),
		text: Text,
		fields: z.array(FormFieldRecord).nullish(),
		user: Expandable,
		secret: Flag,
		completedAt: Timestamp,
		createdAt: Timestamp,
		deletedAt: Timestamp,
	})
	.loose();

export const NoteWriteRecord = z.object({ noteId: z.string() }).loose();

export const FeedbackRecord = z
	.object({
		id: z.string(),
		type: openEnum(['interview', 'assignment', 'share']),
		text: Text,
		instructions: Text,
		baseTemplateId: Text,
		fields: z.array(FormFieldRecord).nullish(),
		user: Expandable,
		panel: Expandable,
		interview: Expandable,
		createdAt: Timestamp,
		updatedAt: Timestamp,
		completedAt: Timestamp,
		deletedAt: Timestamp,
	})
	.loose();

export const ProfileFormRecord = z
	.object({
		id: z.string(),
		type: Text,
		text: Text,
		instructions: Text,
		baseTemplateId: Text,
		fields: z.array(FormFieldRecord).nullish(),
		user: Expandable,
		stage: Expandable,
		secret: Flag,
		group: z.union([z.string(), LooseObject]).nullish(),
		createdAt: Timestamp,
		completedAt: Timestamp,
		deletedAt: Timestamp,
	})
	.loose();

export const ReferralRecord = z
	.object({
		id: z.string(),
		type: Text,
		text: Text,
		instructions: Text,
		baseTemplateId: Text,
		fields: z.array(FormFieldRecord).nullish(),
		referrer: Expandable,
		user: Expandable,
		stage: Expandable,
		createdAt: Timestamp,
		completedAt: Timestamp,
	})
	.loose();

// Lever's examples show the created feedback or profile form without the
// `data` wrapper its other create endpoints use; accept both forms.
export const recordOrEnvelope = <T extends z.ZodType>(record: T) =>
	z.union([envelope(record), record]);

// ── Templates ────────────────────────────────────────────────────────────────

export const FeedbackTemplateRecord = z
	.object({
		id: z.string(),
		text: Text,
		instructions: Text,
		group: z.union([z.string(), LooseObject]).nullish(),
		fields: z.array(FormFieldRecord).nullish(),
		stage: Expandable,
		createdAt: Timestamp,
		updatedAt: Timestamp,
	})
	.loose();

export const FormTemplateRecord = z
	.object({
		id: z.string(),
		text: Text,
		instructions: Text,
		group: z.union([z.string(), LooseObject]).nullish(),
		secretByDefault: Flag,
		fields: z.array(FormFieldRecord).nullish(),
		createdAt: Timestamp,
		updatedAt: Timestamp,
	})
	.loose();

// ── Files, resumes, offers ───────────────────────────────────────────────────

export const FileRecord = z
	.object({
		id: z.string(),
		downloadUrl: Text,
		ext: Text,
		name: Text,
		uploadedAt: Timestamp,
		status: openEnum(['processing', 'processed', 'unsupported', 'error']),
		size: z.union([z.number(), z.string()]).nullish(),
	})
	.loose();

export const ResumeRecord = z
	.object({
		id: z.string(),
		createdAt: Timestamp,
		file: z
			.object({
				name: Text,
				ext: Text,
				downloadUrl: Text,
				uploadedAt: Timestamp,
				status: Text,
				size: z.union([z.number(), z.string()]).nullish(),
			})
			.loose()
			.nullish(),
		parsedData: LooseObject.nullish(),
	})
	.loose();

const OfferDocumentRecord = z
	.object({ fileName: Text, uploadedAt: Timestamp, downloadUrl: Text })
	.loose();

export const OfferRecord = z
	.object({
		id: z.string(),
		createdAt: Timestamp,
		status: openEnum([
			'draft',
			'approval-sent',
			'approved',
			'sent',
			'sent-manually',
			'opened',
			'denied',
			'signed',
		]),
		creator: Expandable,
		fields: z
			.array(
				z
					.object({
						text: Text,
						identifier: Text,
						// unknown: offer field values are strings, numbers or null
						// depending on the field; Lever documents String|Number|null.
						value: z.unknown().optional(),
					})
					.loose(),
			)
			.nullish(),
		sentDocument: OfferDocumentRecord.nullish(),
		signedDocument: OfferDocumentRecord.nullish(),
	})
	.loose();

// ── Account configuration ────────────────────────────────────────────────────

export const StageRecord = z.object({ id: z.string(), text: Text }).loose();

export const ArchiveReasonRecord = z
	.object({
		id: z.string(),
		text: Text,
		status: openEnum(['active', 'inactive']),
		type: openEnum(['hired', 'non-hired']),
	})
	.loose();

// Sources and tags are identified by their text.
export const TextCountRecord = z
	.object({ text: z.string(), count: z.number().nullish() })
	.loose();

export const UserRecord = z
	.object({
		id: z.string(),
		name: Text,
		username: Text,
		email: Text,
		accessRole: openEnum([
			'super admin',
			'admin',
			'team member',
			'limited team member',
			'interviewer',
		]),
		photo: Text,
		createdAt: Timestamp,
		deactivatedAt: Timestamp,
		externalDirectoryId: Text,
		linkedContactIds: Strings,
		jobTitle: Text,
		managerId: Text,
	})
	.loose();

export const RequisitionRecord = z
	.object({
		id: z.string(),
		requisitionCode: Text,
		name: Text,
		backfill: Flag,
		confidentiality: openEnum(['confidential', 'non-confidential']),
		createdAt: Timestamp,
		creator: Expandable,
		headcountHired: z.number().nullish(),
		headcountTotal: z.union([z.number(), z.string()]).nullish(),
		status: openEnum(['draft', 'open', 'closed', 'onHold']),
		hiringManager: Expandable,
		owner: Expandable,
		compensationBand: LooseObject.nullish(),
		employmentStatus: Text,
		location: Text,
		internalNotes: Text,
		postings: ExpandableList,
		department: Text,
		team: Text,
		offerIds: Strings,
		approval: LooseObject.nullish(),
		customFields: LooseObject.nullish(),
		timeToFillStartAt: Timestamp,
		timeToFillEndAt: Timestamp,
	})
	.loose();

// Also the shape of a single dropdown option returned by addOptions.
export const RequisitionFieldRecord = z
	.object({
		id: z.string(),
		text: Text,
		type: openEnum(['number', 'text', 'date', 'object', 'dropdown']),
		isRequired: Flag,
		subfields: z.array(LooseObject).nullish(),
		options: z.array(LooseObject).nullish(),
	})
	.loose();

export const WebhookRecord = z
	.object({
		id: z.string(),
		url: Text,
		event: openEnum([
			'applicationCreated',
			'candidateHired',
			'candidateStageChange',
			'candidateArchiveChange',
			'candidateDeleted',
			'interviewCreated',
			'interviewUpdated',
			'interviewDeleted',
			'contactCreated',
			'contactUpdated',
		]),
		createdAt: Timestamp,
		updatedAt: Timestamp,
		// Holds the signature token on create, plus any conditions.
		configuration: LooseObject.nullish(),
	})
	.loose();
// Lever's create example nests the webhook one level deeper:
// { data: { data: webhook } }.
export const CreatedWebhookOutput = envelope(
	z.union([envelope(WebhookRecord), WebhookRecord]),
);

export const AuditEventRecord = z
	.object({
		id: z.string(),
		createdAt: Timestamp,
		type: Text,
		// Null for events with no acting user, such as failed logins.
		user: LooseObject.nullish(),
		target: LooseObject.nullish(),
		meta: LooseObject.nullish(),
	})
	.loose();

export const DiversitySurveyRecord = z
	.object({
		id: z.string(),
		text: Text,
		instructions: Text,
		candidateLocations: LooseObject.nullish(),
		fields: z.array(FormFieldRecord).nullish(),
		createdAt: Timestamp,
		updatedAt: Timestamp,
	})
	.loose();

const EeoResponseRecord = z
	.object({
		opportunityId: Text,
		contact: Expandable,
		posting: Expandable,
		currentStage: Expandable,
		hiringManager: Expandable,
		gender: Text,
		race: Text,
		veteran: Text,
		disability: Text,
		disabilitySignatureDate: Text,
		appliedAt: Timestamp,
		eeoSurveyRespondedAt: Timestamp,
		applicationArchivedAt: Timestamp,
		applicationArchivedBy: Expandable,
		hiredDate: Timestamp,
		origin: Text,
		source: Text,
		requisitionCodes: Strings,
	})
	.loose();

// EEO reports wrap an object, not a list, in `data`.
export const EeoResponsesOutput = envelope(
	z.object({ eeoResponses: z.array(EeoResponseRecord) }).loose(),
);

// Disposition stages wrap the pipeline stages and archive reasons in `data`.
export const DispositionStagesOutput = envelope(
	z
		.object({
			stages: z.array(
				z
					.object({
						id: z.string(),
						text: Text,
						pipeline: Text,
						rank: z.number().nullish(),
						hasInterview: Flag,
					})
					.loose(),
			),
			archiveReasons: z
				.array(
					z
						.object({
							id: z.string(),
							text: Text,
							// Lever uses null for non-hired here.
							type: Text,
							status: Text,
						})
						.loose(),
				)
				.nullish(),
		})
		.loose(),
);

export const ApplyOutput = envelope(
	z.object({ applicationId: z.string() }).loose(),
);
