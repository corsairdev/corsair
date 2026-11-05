import { z } from 'zod';

// Inputs use Follow Up Boss's own parameter names; a comma-separated query
// parameter (people list `id` and `tags`) is an array here and is joined by the
// endpoint. Outputs are `.loose()` and their documented fields nullish, so a
// field FUB adds or omits cannot fail a call that has already happened. Field
// reference: https://docs.followupboss.com/reference

const IdSchema = z.number().int().positive();

// ── shared provider shapes ─────────────────────────────────────────────────

// _metadata block documented on the Pagination guide, present on list
// responses. `next` is the keyset cursor FUB enforces for deep pagination.
const FubMetadataSchema = z
	.object({
		collection: z.string().nullish(),
		offset: z.number().nullish(),
		limit: z.number().nullish(),
		total: z.number().nullish(),
		next: z.string().nullish(),
		nextLink: z.string().nullish(),
	})
	.loose();

const ListQuerySchema = z.object({
	limit: z
		.number()
		.int()
		.min(1)
		.max(100)
		.optional()
		.describe('Number of results to return, 1-100; FUB defaults to 10.'),
	offset: z
		.number()
		.int()
		.min(0)
		.optional()
		.describe('Number of rows to skip before returning results.'),
});

const EmailSchema = z
	.object({
		value: z.string().nullish(),
		type: z.string().nullish(),
	})
	.loose();

const PhoneSchema = z
	.object({
		value: z.string().nullish(),
		type: z.string().nullish(),
	})
	.loose();

const AddressSchema = z
	.object({
		type: z.string().nullish(),
		street: z.string().nullish(),
		city: z.string().nullish(),
		state: z.string().nullish(),
		postalCode: z.string().nullish(),
		country: z.string().nullish(),
	})
	.loose();

// unknown: FUB custom fields are user-defined keys (`customClose Price` and
// similar), so their map cannot be enumerated; values pass through as sent.
const CustomFieldsSchema = z.record(z.string(), z.unknown());

const TimeframeSchema = z
	.object({
		name: z.string().nullish(),
		from: z.string().nullish(),
		to: z.string().nullish(),
	})
	.loose();

// ── people ─────────────────────────────────────────────────────────────────

export const PersonSchema = z
	.object({
		id: IdSchema.nullish(),
		created: z.string().nullish(),
		updated: z.string().nullish(),
		name: z.string().nullish(),
		firstName: z.string().nullish(),
		lastName: z.string().nullish(),
		stage: z.string().nullish(),
		stageUpdated: z.string().nullish(),
		source: z.string().nullish(),
		sourceUrl: z.string().nullish(),
		lastActivity: z.string().nullish(),
		lastCommunication: z.string().nullish(),
		contacted: z.boolean().nullish(),
		price: z.number().nullish(),
		emails: z.array(EmailSchema).nullish(),
		phones: z.array(PhoneSchema).nullish(),
		addresses: z.array(AddressSchema).nullish(),
		tags: z.array(z.string()).nullish(),
		timeframes: z.array(TimeframeSchema).nullish(),
		background: z.string().nullish(),
		picture: z.string().nullish(),
		assignedUserId: z.number().nullish(),
		assignedPondId: z.number().nullish(),
		assignedLenderId: z.number().nullish(),
		assignedPartnerId: z.number().nullish(),
		assignedToList: z.array(z.string()).nullish(),
		customFields: CustomFieldsSchema.nullish(),
	})
	.loose();

export type FollowUpBossPerson = z.infer<typeof PersonSchema>;

const PersonEnvelopeSchema = z
	.object({
		people: z.array(PersonSchema),
		_metadata: FubMetadataSchema.nullish(),
	})
	.loose();

const PeopleListInputSchema = ListQuerySchema.extend({
	id: z
		.array(IdSchema)
		.min(1)
		.optional()
		.describe('Only these people; sent as the comma-separated `id` filter.'),
	sort: z
		.string()
		.optional()
		.describe(
			'Sort order, e.g. `id`, `created`, `updated`, `name`, `stage` or `lastActivity`, optionally prefixed with `-` for descending.',
		),
	fields: z
		.string()
		.optional()
		.describe('Comma separated list of fields to return, or `allFields`.'),
	lastActivityAfter: z.string().nullish().optional(),
	lastActivityBefore: z.string().nullish().optional(),
	name: z.string().optional(),
	firstName: z.string().optional(),
	lastName: z.string().optional(),
	email: z.string().optional(),
	phone: z.string().optional(),
	stage: z
		.string()
		.optional()
		.describe('Stage name to filter by, e.g. `Lead` or `Trash`.'),
	source: z.string().optional(),
	assignedTo: z.string().optional(),
	assignedUserId: z.number().int().optional(),
	assignedPondId: z.number().int().optional(),
	assignedLenderName: z.string().optional(),
	assignedLenderId: z.number().int().optional(),
	contacted: z.boolean().optional(),
	priceAbove: z.number().int().optional(),
	priceBelow: z.number().int().optional(),
	smartListId: z.number().int().optional(),
	includeTrash: z.boolean().optional(),
	includeUnclaimed: z.boolean().optional(),
	tags: z
		.array(z.string())
		.min(1)
		.optional()
		.describe('Tags to match; sent as the comma-separated `tags` filter.'),
});

export type PeopleListInput = z.infer<typeof PeopleListInputSchema>;

const PeopleListResponseSchema = PersonEnvelopeSchema;

export type PeopleListResponse = z.infer<typeof PeopleListResponseSchema>;

const PeopleGetInputSchema = z.object({
	id: IdSchema.describe('The person ID.'),
});

export type PeopleGetInput = z.infer<typeof PeopleGetInputSchema>;

const PeopleGetResponseSchema = PersonSchema;

export type PeopleGetResponse = z.infer<typeof PeopleGetResponseSchema>;

const EmailPhoneBodySchema = z.object({
	emails: z.array(EmailSchema).min(1).optional(),
	phones: z.array(PhoneSchema).min(1).optional(),
});

const PeopleCreateInputSchema = z.object({
	firstName: z.string().optional(),
	lastName: z.string().optional(),
	stage: z.string().optional(),
	source: z.string().optional(),
	sourceUrl: z.string().optional(),
	contacted: z.boolean().optional(),
	price: z.number().int().optional(),
	assignedTo: z.string().optional(),
	assignedUserId: z.number().int().optional(),
	assignedPondId: z.number().int().optional(),
	assignedLenderName: z.string().optional(),
	assignedLenderId: z.number().int().optional(),
	background: z.string().optional(),
	tags: z.array(z.string()).optional(),
	timeframes: z.array(TimeframeSchema).optional(),
	customFields: CustomFieldsSchema.optional(),
	deduplicate: z
		.boolean()
		.optional()
		.describe(
			'When true, the lead is merged into an existing duplicate instead of creating a new person.',
		),
});

export type PeopleCreateInput = z.infer<typeof PeopleCreateInputSchema>;

const PeopleCreateResponseSchema = PersonSchema;

export type PeopleCreateResponse = z.infer<typeof PeopleCreateResponseSchema>;

const PeopleUpdateInputSchema = z.object({
	id: IdSchema.describe('The person ID.'),
	firstName: z.string().optional(),
	lastName: z.string().optional(),
	stage: z.string().optional(),
	source: z.string().optional(),
	contacted: z.boolean().optional(),
	price: z.number().int().optional(),
	assignedTo: z.string().optional(),
	assignedUserId: z.number().int().optional(),
	assignedPondId: z.number().int().optional(),
	assignedLenderName: z.string().optional(),
	assignedLenderId: z.number().int().optional(),
	background: z.string().optional(),
	tags: z.array(z.string()).optional(),
	timeframes: z.array(TimeframeSchema).optional(),
	customFields: CustomFieldsSchema.optional(),
	mergeTags: z
		.boolean()
		.optional()
		.describe(
			'When true, sent tags are merged into the existing tags instead of replacing them.',
		),
});

export type PeopleUpdateInput = z.infer<typeof PeopleUpdateInputSchema>;

const PeopleUpdateResponseSchema = PersonSchema;

export type PeopleUpdateResponse = z.infer<typeof PeopleUpdateResponseSchema>;

// Most FUB deletes answer 200 with the deleted resource (or 204 with no body);
// the envelope is optional and only passed through when present.
const DeletedResponseSchema = z
	.object({
		id: IdSchema,
		// unknown: FUB may echo the deleted resource in the 200 body.
		resource: z.record(z.string(), z.unknown()).nullish(),
	})
	.loose();

export type FollowUpBossDeletedResponse = z.infer<typeof DeletedResponseSchema>;

const PeopleDeleteInputSchema = z.object({
	id: IdSchema.describe('The person ID.'),
});

export type PeopleDeleteInput = z.infer<typeof PeopleDeleteInputSchema>;

const PeopleDeleteResponseSchema = DeletedResponseSchema;

export type PeopleDeleteResponse = z.infer<typeof PeopleDeleteResponseSchema>;

const PeopleCheckDuplicateInputSchema = z
	.object({
		email: z.string().optional(),
		phone: z.string().optional(),
	})
	.refine(
		(input) =>
			(input.email !== undefined && input.email.length > 0) ||
			(input.phone !== undefined && input.phone.length > 0),
		{ message: 'An email or a phone number is required.' },
	);

export type PeopleCheckDuplicateInput = z.infer<
	typeof PeopleCheckDuplicateInputSchema
>;

// checkDuplicate answers 200 with the matching people.
const PeopleCheckDuplicateResponseSchema = PersonEnvelopeSchema;

export type PeopleCheckDuplicateResponse = z.infer<
	typeof PeopleCheckDuplicateResponseSchema
>;

const PeopleUnclaimedInputSchema = ListQuerySchema;

export type PeopleUnclaimedInput = z.infer<typeof PeopleUnclaimedInputSchema>;

const PeopleUnclaimedResponseSchema = PersonEnvelopeSchema;

export type PeopleUnclaimedResponse = z.infer<
	typeof PeopleUnclaimedResponseSchema
>;

const PeopleClaimInputSchema = z.object({
	personId: IdSchema.describe('The unclaimed person to claim.'),
});

export type PeopleClaimInput = z.infer<typeof PeopleClaimInputSchema>;

// The claim answers 200 with the claimed person, or 409 when it is no longer
// unclaimed. The body mirrors the documented `personId` field.
const PeopleClaimResponseSchema = PersonSchema;

export type PeopleClaimResponse = z.infer<typeof PeopleClaimResponseSchema>;

const PeopleIgnoreUnclaimedInputSchema = z.object({
	personId: IdSchema.describe('The unclaimed person to ignore.'),
});

export type PeopleIgnoreUnclaimedInput = z.infer<
	typeof PeopleIgnoreUnclaimedInputSchema
>;

// ignoreUnclaimed answers 204 with no body.
const PeopleIgnoreUnclaimedResponseSchema = z
	.object({
		success: z.literal(true),
		personId: IdSchema,
	})
	.loose();

export type PeopleIgnoreUnclaimedResponse = z.infer<
	typeof PeopleIgnoreUnclaimedResponseSchema
>;

// ── person attachments ─────────────────────────────────────────────────────

export const PersonAttachmentSchema = z
	.object({
		id: IdSchema.nullish(),
		personId: IdSchema.nullish(),
		uri: z.string().nullish(),
		fileName: z.string().nullish(),
		fileSize: z.number().nullish(),
		created: z.string().nullish(),
	})
	.loose();

export type FollowUpBossPersonAttachment = z.infer<
	typeof PersonAttachmentSchema
>;

const PersonAttachmentBodySchema = z.object({
	personId: IdSchema.describe('ID of the person.'),
	uri: z.string().describe('URI of the externally hosted file.'),
	fileName: z.string().describe('Name of the file.'),
	fileSize: z.number().int().optional().describe('Size of the file in bytes.'),
});

const PersonAttachmentCreateInputSchema = PersonAttachmentBodySchema;

export type PersonAttachmentCreateInput = z.infer<
	typeof PersonAttachmentCreateInputSchema
>;

// Create answers 201 with the attachment.
const PersonAttachmentCreateResponseSchema = PersonAttachmentSchema;

export type PersonAttachmentCreateResponse = z.infer<
	typeof PersonAttachmentCreateResponseSchema
>;

const PersonAttachmentGetInputSchema = z.object({
	id: IdSchema.describe('ID of the attachment.'),
});

export type PersonAttachmentGetInput = z.infer<
	typeof PersonAttachmentGetInputSchema
>;

const PersonAttachmentGetResponseSchema = PersonAttachmentSchema;

export type PersonAttachmentGetResponse = z.infer<
	typeof PersonAttachmentGetResponseSchema
>;

const PersonAttachmentUpdateInputSchema = PersonAttachmentBodySchema.extend({
	id: IdSchema.describe('ID of the attachment.'),
});

export type PersonAttachmentUpdateInput = z.infer<
	typeof PersonAttachmentUpdateInputSchema
>;

const PersonAttachmentUpdateResponseSchema = PersonAttachmentSchema;

export type PersonAttachmentUpdateResponse = z.infer<
	typeof PersonAttachmentUpdateResponseSchema
>;

const PersonAttachmentDeleteInputSchema = z.object({
	id: IdSchema.describe('ID of the attachment.'),
});

export type PersonAttachmentDeleteInput = z.infer<
	typeof PersonAttachmentDeleteInputSchema
>;

const PersonAttachmentDeleteResponseSchema = DeletedResponseSchema;

export type PersonAttachmentDeleteResponse = z.infer<
	typeof PersonAttachmentDeleteResponseSchema
>;

// ── people relationships ───────────────────────────────────────────────────

export const PersonRelationshipSchema = z
	.object({
		id: IdSchema.nullish(),
		personId: IdSchema.nullish(),
		firstName: z.string().nullish(),
		lastName: z.string().nullish(),
		type: z.string().nullish(),
		emails: z.array(EmailSchema).nullish(),
		phones: z.array(PhoneSchema).nullish(),
		addresses: z.array(AddressSchema).nullish(),
		created: z.string().nullish(),
		updated: z.string().nullish(),
	})
	.loose();

export type FollowUpBossPersonRelationship = z.infer<
	typeof PersonRelationshipSchema
>;

const PersonRelationshipEnvelopeSchema = z
	.object({
		peopleRelationships: z.array(PersonRelationshipSchema),
		_metadata: FubMetadataSchema.nullish(),
	})
	.loose();

const PeopleRelationshipsListInputSchema = ListQuerySchema.extend({
	sort: z.string().optional(),
	personId: z.number().int().optional(),
	name: z.string().optional(),
	firstName: z.string().optional(),
	lastName: z.string().optional(),
});

export type PeopleRelationshipsListInput = z.infer<
	typeof PeopleRelationshipsListInputSchema
>;

const PeopleRelationshipsListResponseSchema = PersonRelationshipEnvelopeSchema;

export type PeopleRelationshipsListResponse = z.infer<
	typeof PeopleRelationshipsListResponseSchema
>;

const PeopleRelationshipsCreateInputSchema = z.object({
	personId: IdSchema.describe(
		'ID of the person the relationship is associated with.',
	),
	firstName: z.string().optional(),
	lastName: z.string().optional(),
	type: z
		.string()
		.optional()
		.describe('Relationship type, e.g. `Spouse`, `Brother` or `Partner`.'),
	emails: z.array(EmailSchema).optional(),
	phones: z.array(PhoneSchema).optional(),
	addresses: z.array(AddressSchema).optional(),
});

export type PeopleRelationshipsCreateInput = z.infer<
	typeof PeopleRelationshipsCreateInputSchema
>;

const PeopleRelationshipsCreateResponseSchema = PersonRelationshipSchema;

export type PeopleRelationshipsCreateResponse = z.infer<
	typeof PeopleRelationshipsCreateResponseSchema
>;

const PeopleRelationshipsGetInputSchema = z.object({
	id: IdSchema.describe('ID of the relationship.'),
});

export type PeopleRelationshipsGetInput = z.infer<
	typeof PeopleRelationshipsGetInputSchema
>;

const PeopleRelationshipsGetResponseSchema = PersonRelationshipSchema;

export type PeopleRelationshipsGetResponse = z.infer<
	typeof PeopleRelationshipsGetResponseSchema
>;

const PeopleRelationshipsUpdateInputSchema = z.object({
	id: IdSchema.describe('ID of the relationship.'),
	firstName: z.string().optional(),
	lastName: z.string().optional(),
	type: z.string().optional(),
	emails: z.array(EmailSchema).optional(),
	phones: z.array(PhoneSchema).optional(),
	addresses: z.array(AddressSchema).optional(),
});

export type PeopleRelationshipsUpdateInput = z.infer<
	typeof PeopleRelationshipsUpdateInputSchema
>;

const PeopleRelationshipsUpdateResponseSchema = PersonRelationshipSchema;

export type PeopleRelationshipsUpdateResponse = z.infer<
	typeof PeopleRelationshipsUpdateResponseSchema
>;

const PeopleRelationshipsDeleteInputSchema = z.object({
	id: IdSchema.describe('ID of the relationship to delete.'),
});

export type PeopleRelationshipsDeleteInput = z.infer<
	typeof PeopleRelationshipsDeleteInputSchema
>;

const PeopleRelationshipsDeleteResponseSchema = DeletedResponseSchema;

export type PeopleRelationshipsDeleteResponse = z.infer<
	typeof PeopleRelationshipsDeleteResponseSchema
>;

// ── calls ──────────────────────────────────────────────────────────────────

export const CallSchema = z
	.object({
		id: IdSchema.nullish(),
		personId: IdSchema.nullish(),
		phone: z.string().nullish(),
		isIncoming: z.boolean().nullish(),
		duration: z.number().nullish(),
		note: z.string().nullish(),
		outcome: z.string().nullish(),
		toNumber: z.string().nullish(),
		fromNumber: z.string().nullish(),
		created: z.string().nullish(),
		updated: z.string().nullish(),
	})
	.loose();

export type FollowUpBossCall = z.infer<typeof CallSchema>;

const CallEnvelopeSchema = z
	.object({
		calls: z.array(CallSchema),
		_metadata: FubMetadataSchema.nullish(),
	})
	.loose();

const CallsListInputSchema = ListQuerySchema.extend({
	personId: z.number().int().optional(),
	phone: z.string().optional(),
	toNumber: z.string().optional(),
	fromNumber: z.string().optional(),
});

export type CallsListInput = z.infer<typeof CallsListInputSchema>;

const CallsListResponseSchema = CallEnvelopeSchema;

export type CallsListResponse = z.infer<typeof CallsListResponseSchema>;

const CallsCreateInputSchema = z.object({
	personId: IdSchema.describe('The person associated with this call.'),
	phone: z.string().describe('The phone number this call was made to or from.'),
	isIncoming: z.boolean().describe('Whether the call was incoming.'),
	note: z.string().optional(),
	outcome: z
		.string()
		.optional()
		.describe(
			'Call outcome, e.g. `Interested`, `Not Interested`, `Neighborhood` or `Wrong Number`.',
		),
	duration: z
		.number()
		.int()
		.optional()
		.describe('Length of the call in seconds.'),
	toNumber: z.string().optional(),
	fromNumber: z.string().optional(),
});

export type CallsCreateInput = z.infer<typeof CallsCreateInputSchema>;

const CallsCreateResponseSchema = CallSchema;

export type CallsCreateResponse = z.infer<typeof CallsCreateResponseSchema>;

const CallsGetInputSchema = z.object({
	id: IdSchema.describe('The call ID.'),
});

export type CallsGetInput = z.infer<typeof CallsGetInputSchema>;

const CallsGetResponseSchema = CallSchema;

export type CallsGetResponse = z.infer<typeof CallsGetResponseSchema>;

const CallsUpdateInputSchema = z.object({
	id: IdSchema.describe('The call ID.'),
	phone: z.string().optional(),
	isIncoming: z.boolean().optional(),
	note: z.string().optional(),
	outcome: z.string().optional(),
	duration: z.number().int().optional(),
	toNumber: z.string().optional(),
	fromNumber: z.string().optional(),
});

export type CallsUpdateInput = z.infer<typeof CallsUpdateInputSchema>;

const CallsUpdateResponseSchema = CallSchema;

export type CallsUpdateResponse = z.infer<typeof CallsUpdateResponseSchema>;

// ── text messages ──────────────────────────────────────────────────────────

export const TextMessageSchema = z
	.object({
		id: IdSchema.nullish(),
		personId: IdSchema.nullish(),
		message: z.string().nullish(),
		isIncoming: z.boolean().nullish(),
		toNumber: z.string().nullish(),
		fromNumber: z.string().nullish(),
		status: z.string().nullish(),
		externalId: z.string().nullish(),
		externalLabel: z.string().nullish(),
		externalUrl: z.string().nullish(),
		created: z.string().nullish(),
		updated: z.string().nullish(),
	})
	.loose();

export type FollowUpBossTextMessage = z.infer<typeof TextMessageSchema>;

const TextMessageEnvelopeSchema = z
	.object({
		textMessages: z.array(TextMessageSchema),
		_metadata: FubMetadataSchema.nullish(),
	})
	.loose();

const TextMessagesListInputSchema = z.object({
	personId: z.number().int().optional(),
	toNumber: z.string().optional(),
	fromNumber: z.string().optional(),
});

export type TextMessagesListInput = z.infer<typeof TextMessagesListInputSchema>;

const TextMessagesListResponseSchema = TextMessageEnvelopeSchema;

export type TextMessagesListResponse = z.infer<
	typeof TextMessagesListResponseSchema
>;

const TextMessagesCreateInputSchema = z.object({
	personId: IdSchema.describe('The person associated with the text message.'),
	message: z.string().describe('The body of the text message.'),
	toNumber: z.string().describe('The phone number the text was sent to.'),
	fromNumber: z.string().describe('The phone number the text was sent from.'),
	isIncoming: z
		.boolean()
		.optional()
		.describe('Whether the text was incoming rather than outgoing.'),
	externalLabel: z
		.string()
		.optional()
		.describe('Descriptive text shown in the byline of the message.'),
	externalUrl: z
		.string()
		.optional()
		.describe('Link shown in the byline of the message.'),
});

export type TextMessagesCreateInput = z.infer<
	typeof TextMessagesCreateInputSchema
>;

const TextMessagesCreateResponseSchema = TextMessageSchema;

export type TextMessagesCreateResponse = z.infer<
	typeof TextMessagesCreateResponseSchema
>;

const TextMessagesGetInputSchema = z.object({
	id: IdSchema.describe('The text message record ID.'),
});

export type TextMessagesGetInput = z.infer<typeof TextMessagesGetInputSchema>;

const TextMessagesGetResponseSchema = TextMessageSchema;

export type TextMessagesGetResponse = z.infer<
	typeof TextMessagesGetResponseSchema
>;

// ── notes ──────────────────────────────────────────────────────────────────

export const NoteSchema = z
	.object({
		id: IdSchema.nullish(),
		personId: IdSchema.nullish(),
		subject: z.string().nullish(),
		body: z.string().nullish(),
		isHtml: z.boolean().nullish(),
		user: z.record(z.string(), z.unknown()).nullish(),
		created: z.string().nullish(),
		updated: z.string().nullish(),
	})
	.loose();

export type FollowUpBossNote = z.infer<typeof NoteSchema>;

const NoteBodySchema = z.object({
	personId: IdSchema.describe('The person the note is attached to.'),
	subject: z.string().optional(),
	body: z.string().optional(),
	isHtml: z
		.boolean()
		.optional()
		.describe('When true, HTML tags in the body are rendered.'),
});

const NotesCreateInputSchema = NoteBodySchema;

export type NotesCreateInput = z.infer<typeof NotesCreateInputSchema>;

const NotesCreateResponseSchema = NoteSchema;

export type NotesCreateResponse = z.infer<typeof NotesCreateResponseSchema>;

const NotesGetInputSchema = z.object({
	id: IdSchema.describe('The note ID.'),
	includeThreadedReplies: z
		.boolean()
		.optional()
		.describe('Include the threaded replies attached to the note.'),
	includeReactions: z
		.boolean()
		.optional()
		.describe('Include the reactions attached to the note.'),
});

export type NotesGetInput = z.infer<typeof NotesGetInputSchema>;

// The shape unwraps the documented `{ notes: [note] }` single-fetch envelope,
// so the output is the bare note like every other single GET.
const NotesGetResponseSchema = NoteSchema;

export type NotesGetResponse = z.infer<typeof NotesGetResponseSchema>;

const NotesUpdateInputSchema = z.object({
	id: IdSchema.describe('The note ID.'),
	personId: IdSchema.optional(),
	subject: z.string().optional(),
	body: z.string().optional(),
	isHtml: z.boolean().optional(),
});

export type NotesUpdateInput = z.infer<typeof NotesUpdateInputSchema>;

const NotesUpdateResponseSchema = NoteSchema;

export type NotesUpdateResponse = z.infer<typeof NotesUpdateResponseSchema>;

const NotesDeleteInputSchema = z.object({
	id: IdSchema.describe('The note ID to delete.'),
});

export type NotesDeleteInput = z.infer<typeof NotesDeleteInputSchema>;

const NotesDeleteResponseSchema = DeletedResponseSchema;

export type NotesDeleteResponse = z.infer<typeof NotesDeleteResponseSchema>;

// ── events ─────────────────────────────────────────────────────────────────

export const EventSchema = z
	.object({
		id: IdSchema.nullish(),
		type: z.string().nullish(),
		created: z.string().nullish(),
		system: z.string().nullish(),
		source: z.string().nullish(),
		sourceType: z.string().nullish(),
		sourceUrl: z.string().nullish(),
		description: z.string().nullish(),
		message: z.string().nullish(),
		personId: IdSchema.nullish(),
		// unknown: the embedded person and property payloads are provider
		// defined and vary by event type, so they pass through as sent.
		person: z.record(z.string(), z.unknown()).nullish(),
		property: z.record(z.string(), z.unknown()).nullish(),
	})
	.loose();

export type FollowUpBossEvent = z.infer<typeof EventSchema>;

const EventEnvelopeSchema = z
	.object({
		events: z.array(EventSchema),
		_metadata: FubMetadataSchema.nullish(),
	})
	.loose();

const EventsListInputSchema = ListQuerySchema.extend({
	next: z
		.string()
		.optional()
		.describe(
			'Keyset cursor from `_metadata.next`; FUB enforces it for deep pagination.',
		),
	personId: z.number().int().optional(),
	type: z
		.array(z.string())
		.min(1)
		.optional()
		.describe(
			'Event types to include, e.g. `Registration`, `Inquiry`, `Viewed Page`; sent comma separated.',
		),
	hasProperty: z.boolean().optional(),
	propertyAddress: z.string().optional(),
});

export type EventsListInput = z.infer<typeof EventsListInputSchema>;

const EventsListResponseSchema = EventEnvelopeSchema;

export type EventsListResponse = z.infer<typeof EventsListResponseSchema>;

const EventsGetInputSchema = z.object({
	id: IdSchema.describe('The event ID.'),
});

export type EventsGetInput = z.infer<typeof EventsGetInputSchema>;

const EventsGetResponseSchema = EventSchema;

export type EventsGetResponse = z.infer<typeof EventsGetResponseSchema>;

// unknown: the person payload is provider defined (an existing `id`, or the
// lead fields FUB should match or create), so only the documented keys are
// declared and the rest passes through.
const EventPersonSchema = z
	.object({
		id: IdSchema.optional(),
		firstName: z.string().optional(),
		lastName: z.string().optional(),
		stage: z.string().optional(),
		source: z.string().optional(),
		emails: z.array(EmailSchema).optional(),
		phones: z.array(PhoneSchema).optional(),
		tags: z.array(z.string()).optional(),
	})
	.loose();

const EventsCreateInputSchema = z.object({
	system: z
		.string()
		.optional()
		.describe('The name of the system providing the lead.'),
	source: z.string().optional().describe('The name of the lead source.'),
	type: z
		.string()
		.optional()
		.describe(
			'Event type, e.g. `Registration`, `Inquiry`, `Sellers Inquiry`, `Property Inquiry`, `Viewed Page` or `General`.',
		),
	message: z.string().optional(),
	description: z.string().optional(),
	person: EventPersonSchema.optional(),
	property: z.record(z.string(), z.unknown()).optional(),
});

export type EventsCreateInput = z.infer<typeof EventsCreateInputSchema>;

// FUB answers 200 when the person already existed, 201 when created and 204
// with no body, so the whole envelope is optional.
const EventsCreateResponseSchema = z
	.object({
		event: EventSchema.nullish(),
	})
	.loose();

export type EventsCreateResponse = z.infer<typeof EventsCreateResponseSchema>;

// ── tasks ──────────────────────────────────────────────────────────────────

export const TASK_TYPES = [
	'Follow Up',
	'Call',
	'Email',
	'Text Message',
	'Drop-off Mail',
	'Drop-off Package',
	'Meeting',
] as const;

export const TaskSchema = z
	.object({
		id: IdSchema.nullish(),
		personId: IdSchema.nullish(),
		name: z.string().nullish(),
		type: z.string().nullish(),
		isCompleted: z.boolean().nullish(),
		dueDate: z.string().nullish(),
		dueDateTime: z.string().nullish(),
		completed: z.string().nullish(),
		assignedUserId: z.number().nullish(),
		created: z.string().nullish(),
		updated: z.string().nullish(),
	})
	.loose();

export type FollowUpBossTask = z.infer<typeof TaskSchema>;

const TaskEnvelopeSchema = z
	.object({
		tasks: z.array(TaskSchema),
		_metadata: FubMetadataSchema.nullish(),
	})
	.loose();

const TasksListInputSchema = z.object({
	personId: z.number().int().optional(),
	assignedTo: z.string().optional(),
	assignedUserId: z.number().int().optional(),
	name: z.string().optional(),
	type: z.string().optional(),
	isCompleted: z.boolean().optional(),
	due: z
		.string()
		.optional()
		.describe(
			'Due range filter: `today`, `overdue`, `tomorrow`, `thisweek`, `nextweek` or `later`.',
		),
	dueStart: z.string().optional(),
	dueEnd: z.string().optional(),
});

export type TasksListInput = z.infer<typeof TasksListInputSchema>;

const TasksListResponseSchema = TaskEnvelopeSchema;

export type TasksListResponse = z.infer<typeof TasksListResponseSchema>;

const TasksCreateInputSchema = z.object({
	personId: IdSchema.describe('The person this task is related to.'),
	assignedTo: z.string().optional(),
	assignedUserId: z.number().int().optional(),
	name: z.string().optional(),
	type: z.enum(TASK_TYPES).optional(),
	isCompleted: z.boolean().optional(),
	dueDate: z.string().optional().describe('Due date in YYYY-MM-DD format.'),
	dueDateTime: z.string().optional(),
});

export type TasksCreateInput = z.infer<typeof TasksCreateInputSchema>;

const TasksCreateResponseSchema = TaskSchema;

export type TasksCreateResponse = z.infer<typeof TasksCreateResponseSchema>;

const TasksGetInputSchema = z.object({
	id: IdSchema.describe('The task ID.'),
});

export type TasksGetInput = z.infer<typeof TasksGetInputSchema>;

const TasksGetResponseSchema = TaskSchema;

export type TasksGetResponse = z.infer<typeof TasksGetResponseSchema>;

const TasksUpdateInputSchema = z.object({
	id: IdSchema.describe('The task ID.'),
	name: z.string().optional(),
	type: z.enum(TASK_TYPES).optional(),
	isCompleted: z.boolean().optional(),
	dueDate: z.string().optional(),
	dueDateTime: z.string().optional(),
});

export type TasksUpdateInput = z.infer<typeof TasksUpdateInputSchema>;

const TasksUpdateResponseSchema = TaskSchema;

export type TasksUpdateResponse = z.infer<typeof TasksUpdateResponseSchema>;

const TasksDeleteInputSchema = z.object({
	id: IdSchema.describe('The task ID to delete.'),
});

export type TasksDeleteInput = z.infer<typeof TasksDeleteInputSchema>;

const TasksDeleteResponseSchema = DeletedResponseSchema;

export type TasksDeleteResponse = z.infer<typeof TasksDeleteResponseSchema>;

// ── appointments ───────────────────────────────────────────────────────────

export const AppointmentSchema = z
	.object({
		id: IdSchema.nullish(),
		title: z.string().nullish(),
		description: z.string().nullish(),
		startDateTime: z.string().nullish(),
		endDateTime: z.string().nullish(),
		allDay: z.boolean().nullish(),
		location: z.string().nullish(),
		typeId: IdSchema.nullish(),
		persons: z.array(z.record(z.string(), z.unknown())).nullish(),
		users: z.array(z.record(z.string(), z.unknown())).nullish(),
		createdById: IdSchema.nullish(),
		created: z.string().nullish(),
		updated: z.string().nullish(),
	})
	.loose();

export type FollowUpBossAppointment = z.infer<typeof AppointmentSchema>;

const AppointmentEnvelopeSchema = z
	.object({
		appointments: z.array(AppointmentSchema),
		_metadata: FubMetadataSchema.nullish(),
	})
	.loose();

// unknown: invitees are users and/or people referenced by id, so each entry
// passes through as FUB accepts it.
const AppointmentInviteeSchema = z
	.object({
		id: IdSchema,
		type: z.string().optional(),
	})
	.loose();

const AppointmentsListInputSchema = ListQuerySchema.extend({
	personId: z.number().int().optional(),
	userId: z.number().int().optional(),
	start: z.string().optional(),
	end: z.string().optional(),
});

export type AppointmentsListInput = z.infer<typeof AppointmentsListInputSchema>;

const AppointmentsListResponseSchema = AppointmentEnvelopeSchema;

export type AppointmentsListResponse = z.infer<
	typeof AppointmentsListResponseSchema
>;

const AppointmentsCreateInputSchema = z.object({
	title: z.string().describe('Title of the appointment.'),
	start: z
		.string()
		.describe(
			'Beginning date and time, ISO 8601 UTC (e.g. 2026-05-21T17:00:00+00:00).',
		),
	end: z.string().describe('Ending date and time, ISO 8601 UTC.'),
	description: z.string().optional(),
	invitees: z.array(AppointmentInviteeSchema).optional(),
	allDay: z.boolean().optional(),
	location: z.string().optional(),
	typeId: IdSchema.optional(),
	createdById: IdSchema.optional(),
	sendInvitation: z
		.boolean()
		.optional()
		.describe('Send an invitation email to the invitees.'),
});

export type AppointmentsCreateInput = z.infer<
	typeof AppointmentsCreateInputSchema
>;

const AppointmentsCreateResponseSchema = AppointmentSchema;

export type AppointmentsCreateResponse = z.infer<
	typeof AppointmentsCreateResponseSchema
>;

const AppointmentsGetInputSchema = z.object({
	id: IdSchema.describe('The appointment ID.'),
});

export type AppointmentsGetInput = z.infer<typeof AppointmentsGetInputSchema>;

const AppointmentsGetResponseSchema = AppointmentSchema;

export type AppointmentsGetResponse = z.infer<
	typeof AppointmentsGetResponseSchema
>;

const AppointmentsUpdateInputSchema = z.object({
	id: IdSchema.describe('The appointment ID.'),
	title: z.string().optional(),
	start: z.string().optional(),
	end: z.string().optional(),
	description: z.string().optional(),
	invitees: z.array(AppointmentInviteeSchema).optional(),
	allDay: z.boolean().optional(),
	location: z.string().optional(),
	typeId: IdSchema.optional(),
	sendInvitation: z.boolean().optional(),
});

export type AppointmentsUpdateInput = z.infer<
	typeof AppointmentsUpdateInputSchema
>;

const AppointmentsUpdateResponseSchema = AppointmentSchema;

export type AppointmentsUpdateResponse = z.infer<
	typeof AppointmentsUpdateResponseSchema
>;

const AppointmentsDeleteInputSchema = z.object({
	id: IdSchema.describe('The appointment ID to delete.'),
});

export type AppointmentsDeleteInput = z.infer<
	typeof AppointmentsDeleteInputSchema
>;

// DELETE /appointments/{id} answers 204 with no body.
const AppointmentsDeleteResponseSchema = z
	.object({
		success: z.literal(true),
		id: IdSchema,
	})
	.loose();

export type AppointmentsDeleteResponse = z.infer<
	typeof AppointmentsDeleteResponseSchema
>;

// ── appointment types ──────────────────────────────────────────────────────

export const AppointmentTypeSchema = z
	.object({
		id: IdSchema.nullish(),
		name: z.string().nullish(),
		orderWeight: z.number().nullish(),
		created: z.string().nullish(),
	})
	.loose();

export type FollowUpBossAppointmentType = z.infer<typeof AppointmentTypeSchema>;

const AppointmentTypeEnvelopeSchema = z
	.object({
		appointmentTypes: z.array(AppointmentTypeSchema),
		_metadata: FubMetadataSchema.nullish(),
	})
	.loose();

const AppointmentTypesListInputSchema = ListQuerySchema.extend({
	sort: z.string().optional(),
});

export type AppointmentTypesListInput = z.infer<
	typeof AppointmentTypesListInputSchema
>;

const AppointmentTypesListResponseSchema = AppointmentTypeEnvelopeSchema;

export type AppointmentTypesListResponse = z.infer<
	typeof AppointmentTypesListResponseSchema
>;

const AppointmentTypesCreateInputSchema = z.object({
	name: z.string().optional(),
	orderWeight: z
		.number()
		.int()
		.optional()
		.describe('Set this value to enforce a specific sort order.'),
});

export type AppointmentTypesCreateInput = z.infer<
	typeof AppointmentTypesCreateInputSchema
>;

const AppointmentTypesCreateResponseSchema = AppointmentTypeSchema;

export type AppointmentTypesCreateResponse = z.infer<
	typeof AppointmentTypesCreateResponseSchema
>;

const AppointmentTypesGetInputSchema = z.object({
	id: IdSchema.describe('The appointment type ID.'),
});

export type AppointmentTypesGetInput = z.infer<
	typeof AppointmentTypesGetInputSchema
>;

const AppointmentTypesGetResponseSchema = AppointmentTypeSchema;

export type AppointmentTypesGetResponse = z.infer<
	typeof AppointmentTypesGetResponseSchema
>;

const AppointmentTypesUpdateInputSchema = z.object({
	id: IdSchema.describe('The appointment type ID.'),
	name: z.string().optional(),
	orderWeight: z.number().int().optional(),
});

export type AppointmentTypesUpdateInput = z.infer<
	typeof AppointmentTypesUpdateInputSchema
>;

const AppointmentTypesUpdateResponseSchema = AppointmentTypeSchema;

export type AppointmentTypesUpdateResponse = z.infer<
	typeof AppointmentTypesUpdateResponseSchema
>;

const AppointmentTypesDeleteInputSchema = z.object({
	id: IdSchema.describe('The appointment type ID to delete.'),
	assignTypeId: IdSchema.describe(
		'The appointment type that existing appointments are reassigned to.',
	),
});

export type AppointmentTypesDeleteInput = z.infer<
	typeof AppointmentTypesDeleteInputSchema
>;

const AppointmentTypesDeleteResponseSchema = DeletedResponseSchema;

export type AppointmentTypesDeleteResponse = z.infer<
	typeof AppointmentTypesDeleteResponseSchema
>;

// ── timeframes ─────────────────────────────────────────────────────────────

const TimeframesListInputSchema = z.object({});

export type TimeframesListInput = z.infer<typeof TimeframesListInputSchema>;

const TimeframesListResponseSchema = z
	.object({
		timeframes: z.array(TimeframeSchema),
	})
	.loose();

export type TimeframesListResponse = z.infer<
	typeof TimeframesListResponseSchema
>;

// ── smart lists ────────────────────────────────────────────────────────────

export const SmartListSchema = z
	.object({
		id: IdSchema.nullish(),
		name: z.string().nullish(),
		description: z.string().nullish(),
		total: z.number().nullish(),
		created: z.string().nullish(),
		updated: z.string().nullish(),
	})
	.loose();

export type FollowUpBossSmartList = z.infer<typeof SmartListSchema>;

const SmartListEnvelopeSchema = z
	.object({
		smartLists: z.array(SmartListSchema),
		_metadata: FubMetadataSchema.nullish(),
	})
	.loose();

const SmartListsListInputSchema = ListQuerySchema.extend({
	fub2: z
		.boolean()
		.optional()
		.describe('Include smart lists created in FUB 2.0.'),
	all: z.boolean().optional().describe('Show all smart lists.'),
});

export type SmartListsListInput = z.infer<typeof SmartListsListInputSchema>;

const SmartListsListResponseSchema = SmartListEnvelopeSchema;

export type SmartListsListResponse = z.infer<
	typeof SmartListsListResponseSchema
>;

const SmartListsGetInputSchema = z.object({
	id: IdSchema.describe('The smart list ID.'),
});

export type SmartListsGetInput = z.infer<typeof SmartListsGetInputSchema>;

const SmartListsGetResponseSchema = SmartListSchema;

export type SmartListsGetResponse = z.infer<typeof SmartListsGetResponseSchema>;

// ── account ────────────────────────────────────────────────────────────────

export const MeSchema = z
	.object({
		id: IdSchema.nullish(),
		name: z.string().nullish(),
		firstName: z.string().nullish(),
		lastName: z.string().nullish(),
		role: z.string().nullish(),
		email: z.string().nullish(),
		created: z.string().nullish(),
	})
	.loose();

export type FollowUpBossMe = z.infer<typeof MeSchema>;

const MeGetInputSchema = z.object({});

export type MeGetInput = z.infer<typeof MeGetInputSchema>;

const MeGetResponseSchema = MeSchema;

export type MeGetResponse = z.infer<typeof MeGetResponseSchema>;

// FUB publishes no fixed body for /identity beyond the identification data, so
// the known keys are declared and the rest passes through.
const IdentitySchema = z
	.object({
		id: IdSchema.nullish(),
		name: z.string().nullish(),
	})
	.loose();

export type FollowUpBossIdentity = z.infer<typeof IdentitySchema>;

const IdentityGetInputSchema = z.object({});

export type IdentityGetInput = z.infer<typeof IdentityGetInputSchema>;

const IdentityGetResponseSchema = IdentitySchema;

export type IdentityGetResponse = z.infer<typeof IdentityGetResponseSchema>;

// ── type maps ──────────────────────────────────────────────────────────────

export type FollowUpBossEndpointInputs = {
	peopleList: PeopleListInput;
	peopleGet: PeopleGetInput;
	peopleCreate: PeopleCreateInput;
	peopleUpdate: PeopleUpdateInput;
	peopleDelete: PeopleDeleteInput;
	peopleCheckDuplicate: PeopleCheckDuplicateInput;
	peopleUnclaimed: PeopleUnclaimedInput;
	peopleClaim: PeopleClaimInput;
	peopleIgnoreUnclaimed: PeopleIgnoreUnclaimedInput;
	personAttachmentCreate: PersonAttachmentCreateInput;
	personAttachmentGet: PersonAttachmentGetInput;
	personAttachmentUpdate: PersonAttachmentUpdateInput;
	personAttachmentDelete: PersonAttachmentDeleteInput;
	peopleRelationshipsList: PeopleRelationshipsListInput;
	peopleRelationshipsCreate: PeopleRelationshipsCreateInput;
	peopleRelationshipsGet: PeopleRelationshipsGetInput;
	peopleRelationshipsUpdate: PeopleRelationshipsUpdateInput;
	peopleRelationshipsDelete: PeopleRelationshipsDeleteInput;
	callsList: CallsListInput;
	callsCreate: CallsCreateInput;
	callsGet: CallsGetInput;
	callsUpdate: CallsUpdateInput;
	textMessagesList: TextMessagesListInput;
	textMessagesCreate: TextMessagesCreateInput;
	textMessagesGet: TextMessagesGetInput;
	notesCreate: NotesCreateInput;
	notesGet: NotesGetInput;
	notesUpdate: NotesUpdateInput;
	notesDelete: NotesDeleteInput;
	eventsList: EventsListInput;
	eventsGet: EventsGetInput;
	eventsCreate: EventsCreateInput;
	tasksList: TasksListInput;
	tasksCreate: TasksCreateInput;
	tasksGet: TasksGetInput;
	tasksUpdate: TasksUpdateInput;
	tasksDelete: TasksDeleteInput;
	appointmentsList: AppointmentsListInput;
	appointmentsCreate: AppointmentsCreateInput;
	appointmentsGet: AppointmentsGetInput;
	appointmentsUpdate: AppointmentsUpdateInput;
	appointmentsDelete: AppointmentsDeleteInput;
	appointmentTypesList: AppointmentTypesListInput;
	appointmentTypesCreate: AppointmentTypesCreateInput;
	appointmentTypesGet: AppointmentTypesGetInput;
	appointmentTypesUpdate: AppointmentTypesUpdateInput;
	appointmentTypesDelete: AppointmentTypesDeleteInput;
	timeframesList: TimeframesListInput;
	smartListsList: SmartListsListInput;
	smartListsGet: SmartListsGetInput;
	meGet: MeGetInput;
	identityGet: IdentityGetInput;
};

export type FollowUpBossEndpointOutputs = {
	peopleList: PeopleListResponse;
	peopleGet: PeopleGetResponse;
	peopleCreate: PeopleCreateResponse;
	peopleUpdate: PeopleUpdateResponse;
	peopleDelete: PeopleDeleteResponse;
	peopleCheckDuplicate: PeopleCheckDuplicateResponse;
	peopleUnclaimed: PeopleUnclaimedResponse;
	peopleClaim: PeopleClaimResponse;
	peopleIgnoreUnclaimed: PeopleIgnoreUnclaimedResponse;
	personAttachmentCreate: PersonAttachmentCreateResponse;
	personAttachmentGet: PersonAttachmentGetResponse;
	personAttachmentUpdate: PersonAttachmentUpdateResponse;
	personAttachmentDelete: PersonAttachmentDeleteResponse;
	peopleRelationshipsList: PeopleRelationshipsListResponse;
	peopleRelationshipsCreate: PeopleRelationshipsCreateResponse;
	peopleRelationshipsGet: PeopleRelationshipsGetResponse;
	peopleRelationshipsUpdate: PeopleRelationshipsUpdateResponse;
	peopleRelationshipsDelete: PeopleRelationshipsDeleteResponse;
	callsList: CallsListResponse;
	callsCreate: CallsCreateResponse;
	callsGet: CallsGetResponse;
	callsUpdate: CallsUpdateResponse;
	textMessagesList: TextMessagesListResponse;
	textMessagesCreate: TextMessagesCreateResponse;
	textMessagesGet: TextMessagesGetResponse;
	notesCreate: NotesCreateResponse;
	notesGet: NotesGetResponse;
	notesUpdate: NotesUpdateResponse;
	notesDelete: NotesDeleteResponse;
	eventsList: EventsListResponse;
	eventsGet: EventsGetResponse;
	eventsCreate: EventsCreateResponse;
	tasksList: TasksListResponse;
	tasksCreate: TasksCreateResponse;
	tasksGet: TasksGetResponse;
	tasksUpdate: TasksUpdateResponse;
	tasksDelete: TasksDeleteResponse;
	appointmentsList: AppointmentsListResponse;
	appointmentsCreate: AppointmentsCreateResponse;
	appointmentsGet: AppointmentsGetResponse;
	appointmentsUpdate: AppointmentsUpdateResponse;
	appointmentsDelete: AppointmentsDeleteResponse;
	appointmentTypesList: AppointmentTypesListResponse;
	appointmentTypesCreate: AppointmentTypesCreateResponse;
	appointmentTypesGet: AppointmentTypesGetResponse;
	appointmentTypesUpdate: AppointmentTypesUpdateResponse;
	appointmentTypesDelete: AppointmentTypesDeleteResponse;
	timeframesList: TimeframesListResponse;
	smartListsList: SmartListsListResponse;
	smartListsGet: SmartListsGetResponse;
	meGet: MeGetResponse;
	identityGet: IdentityGetResponse;
};

export const FollowUpBossEndpointInputSchemas = {
	peopleList: PeopleListInputSchema,
	peopleGet: PeopleGetInputSchema,
	peopleCreate: PeopleCreateInputSchema,
	peopleUpdate: PeopleUpdateInputSchema,
	peopleDelete: PeopleDeleteInputSchema,
	peopleCheckDuplicate: PeopleCheckDuplicateInputSchema,
	peopleUnclaimed: PeopleUnclaimedInputSchema,
	peopleClaim: PeopleClaimInputSchema,
	peopleIgnoreUnclaimed: PeopleIgnoreUnclaimedInputSchema,
	personAttachmentCreate: PersonAttachmentCreateInputSchema,
	personAttachmentGet: PersonAttachmentGetInputSchema,
	personAttachmentUpdate: PersonAttachmentUpdateInputSchema,
	personAttachmentDelete: PersonAttachmentDeleteInputSchema,
	peopleRelationshipsList: PeopleRelationshipsListInputSchema,
	peopleRelationshipsCreate: PeopleRelationshipsCreateInputSchema,
	peopleRelationshipsGet: PeopleRelationshipsGetInputSchema,
	peopleRelationshipsUpdate: PeopleRelationshipsUpdateInputSchema,
	peopleRelationshipsDelete: PeopleRelationshipsDeleteInputSchema,
	callsList: CallsListInputSchema,
	callsCreate: CallsCreateInputSchema,
	callsGet: CallsGetInputSchema,
	callsUpdate: CallsUpdateInputSchema,
	textMessagesList: TextMessagesListInputSchema,
	textMessagesCreate: TextMessagesCreateInputSchema,
	textMessagesGet: TextMessagesGetInputSchema,
	notesCreate: NotesCreateInputSchema,
	notesGet: NotesGetInputSchema,
	notesUpdate: NotesUpdateInputSchema,
	notesDelete: NotesDeleteInputSchema,
	eventsList: EventsListInputSchema,
	eventsGet: EventsGetInputSchema,
	eventsCreate: EventsCreateInputSchema,
	tasksList: TasksListInputSchema,
	tasksCreate: TasksCreateInputSchema,
	tasksGet: TasksGetInputSchema,
	tasksUpdate: TasksUpdateInputSchema,
	tasksDelete: TasksDeleteInputSchema,
	appointmentsList: AppointmentsListInputSchema,
	appointmentsCreate: AppointmentsCreateInputSchema,
	appointmentsGet: AppointmentsGetInputSchema,
	appointmentsUpdate: AppointmentsUpdateInputSchema,
	appointmentsDelete: AppointmentsDeleteInputSchema,
	appointmentTypesList: AppointmentTypesListInputSchema,
	appointmentTypesCreate: AppointmentTypesCreateInputSchema,
	appointmentTypesGet: AppointmentTypesGetInputSchema,
	appointmentTypesUpdate: AppointmentTypesUpdateInputSchema,
	appointmentTypesDelete: AppointmentTypesDeleteInputSchema,
	timeframesList: TimeframesListInputSchema,
	smartListsList: SmartListsListInputSchema,
	smartListsGet: SmartListsGetInputSchema,
	meGet: MeGetInputSchema,
	identityGet: IdentityGetInputSchema,
} as const;

export const FollowUpBossEndpointOutputSchemas = {
	peopleList: PeopleListResponseSchema,
	peopleGet: PeopleGetResponseSchema,
	peopleCreate: PeopleCreateResponseSchema,
	peopleUpdate: PeopleUpdateResponseSchema,
	peopleDelete: PeopleDeleteResponseSchema,
	peopleCheckDuplicate: PeopleCheckDuplicateResponseSchema,
	peopleUnclaimed: PeopleUnclaimedResponseSchema,
	peopleClaim: PeopleClaimResponseSchema,
	peopleIgnoreUnclaimed: PeopleIgnoreUnclaimedResponseSchema,
	personAttachmentCreate: PersonAttachmentCreateResponseSchema,
	personAttachmentGet: PersonAttachmentGetResponseSchema,
	personAttachmentUpdate: PersonAttachmentUpdateResponseSchema,
	personAttachmentDelete: PersonAttachmentDeleteResponseSchema,
	peopleRelationshipsList: PeopleRelationshipsListResponseSchema,
	peopleRelationshipsCreate: PeopleRelationshipsCreateResponseSchema,
	peopleRelationshipsGet: PeopleRelationshipsGetResponseSchema,
	peopleRelationshipsUpdate: PeopleRelationshipsUpdateResponseSchema,
	peopleRelationshipsDelete: PeopleRelationshipsDeleteResponseSchema,
	callsList: CallsListResponseSchema,
	callsCreate: CallsCreateResponseSchema,
	callsGet: CallsGetResponseSchema,
	callsUpdate: CallsUpdateResponseSchema,
	textMessagesList: TextMessagesListResponseSchema,
	textMessagesCreate: TextMessagesCreateResponseSchema,
	textMessagesGet: TextMessagesGetResponseSchema,
	notesCreate: NotesCreateResponseSchema,
	notesGet: NotesGetResponseSchema,
	notesUpdate: NotesUpdateResponseSchema,
	notesDelete: NotesDeleteResponseSchema,
	eventsList: EventsListResponseSchema,
	eventsGet: EventsGetResponseSchema,
	eventsCreate: EventsCreateResponseSchema,
	tasksList: TasksListResponseSchema,
	tasksCreate: TasksCreateResponseSchema,
	tasksGet: TasksGetResponseSchema,
	tasksUpdate: TasksUpdateResponseSchema,
	tasksDelete: TasksDeleteResponseSchema,
	appointmentsList: AppointmentsListResponseSchema,
	appointmentsCreate: AppointmentsCreateResponseSchema,
	appointmentsGet: AppointmentsGetResponseSchema,
	appointmentsUpdate: AppointmentsUpdateResponseSchema,
	appointmentsDelete: AppointmentsDeleteResponseSchema,
	appointmentTypesList: AppointmentTypesListResponseSchema,
	appointmentTypesCreate: AppointmentTypesCreateResponseSchema,
	appointmentTypesGet: AppointmentTypesGetResponseSchema,
	appointmentTypesUpdate: AppointmentTypesUpdateResponseSchema,
	appointmentTypesDelete: AppointmentTypesDeleteResponseSchema,
	timeframesList: TimeframesListResponseSchema,
	smartListsList: SmartListsListResponseSchema,
	smartListsGet: SmartListsGetResponseSchema,
	meGet: MeGetResponseSchema,
	identityGet: IdentityGetResponseSchema,
} as const;
