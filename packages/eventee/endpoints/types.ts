import { z } from 'zod';

const IdSchema = z.number().int().positive();
const DateTimeSchema = z
	.string()
	.regex(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
const DateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

const EmptyInputSchema = z.object({}).strict();

const EventContentInputSchema = z
	.object({
		date: DateSchema.optional(),
		with_overlapping: z.boolean().optional(),
	})
	.strict();
const HallCreateInputSchema = z
	.object({
		name: z.string().min(1),
		order: z.number().int().nonnegative().optional(),
		stream: z.string().optional(),
	})
	.strict();
const HallUpdateInputSchema = z
	.object({
		hall_id: IdSchema,
		name: z.string().min(1),
		order: z.number().int().nonnegative().optional(),
		stream: z.string().optional(),
	})
	.strict();
const HallDeleteInputSchema = z.object({ hall_id: IdSchema }).strict();

const SessionFields = {
	name: z.string().min(1),
	description: z.string().optional(),
	start: DateTimeSchema,
	end: DateTimeSchema,
	type: z.union([z.literal(0), z.literal(1)]).optional(),
	hall_id: IdSchema,
	speakers: z.array(IdSchema).optional(),
	tracks: z.array(IdSchema).optional(),
	discussion: z.boolean().optional(),
	moderating: z.boolean().optional(),
	polling: z.boolean().optional(),
	checkin: z.boolean().optional(),
	capacity: z.number().int().nonnegative().optional(),
	stream: z.string().optional(),
	virtual_meeting: z.string().optional(),
};
const SessionCreateInputSchema = z.object(SessionFields).strict();
const SessionUpdateInputSchema = z
	.object({
		lecture_id: IdSchema,
		name: z.string().min(1),
		description: z.string().optional(),
		start: DateTimeSchema,
		end: DateTimeSchema,
		type: z.union([z.literal(0), z.literal(1)]).optional(),
		hall_id: IdSchema.optional(),
		speakers: z.array(IdSchema).optional(),
		tracks: z.array(IdSchema).optional(),
		discussion: z.boolean().optional(),
		moderating: z.boolean().optional(),
		polling: z.boolean().optional(),
		capacity: z.number().int().nonnegative().optional(),
		stream: z.string().optional(),
		virtual_meeting: z.string().optional(),
	})
	.strict();
const SessionDeleteInputSchema = z.object({ lecture_id: IdSchema }).strict();

const BreakFields = {
	name: z.string().min(1).max(128),
	description: z.string().optional(),
	start: DateTimeSchema,
	end: DateTimeSchema,
};
const BreakCreateInputSchema = z.object(BreakFields).strict();
const BreakUpdateInputSchema = z
	.object({ pause_id: IdSchema, ...BreakFields })
	.strict();
const BreakDeleteInputSchema = z.object({ pause_id: IdSchema }).strict();

const SpeakerFields = {
	name: z.string().min(1).max(256),
	email: z.string().max(255).optional(),
	photo: z.string().optional(),
	bio: z.string().optional(),
	position: z.string().max(128).optional(),
	company: z.string().max(128).optional(),
	phone: z.string().max(32).optional(),
	web: z.string().max(512).optional(),
	linkedIn: z.string().max(512).optional(),
	twitter: z.string().max(512).optional(),
	facebook: z.string().max(512).optional(),
	instagram: z.string().max(512).optional(),
	country: z.string().length(2).optional(),
	language: z.string().max(24).optional(),
};
const SpeakerCreateInputSchema = z.object(SpeakerFields).strict();
const SpeakerUpdateInputSchema = z
	.object({
		speakerTmp_id: IdSchema,
		name: SpeakerFields.name.optional(),
		email: SpeakerFields.email,
		photo: SpeakerFields.photo,
		bio: SpeakerFields.bio,
		position: SpeakerFields.position,
		company: SpeakerFields.company,
		phone: SpeakerFields.phone,
		web: SpeakerFields.web,
		linkedIn: SpeakerFields.linkedIn,
		twitter: SpeakerFields.twitter,
		facebook: SpeakerFields.facebook,
		instagram: SpeakerFields.instagram,
		country: SpeakerFields.country,
		language: SpeakerFields.language,
	})
	.strict()
	.refine(
		(value) => Object.keys(value).some((key) => key !== 'speakerTmp_id'),
		{
			message: 'At least one speaker field must be provided',
		},
	);
const SpeakerDeleteInputSchema = z.object({ speakerTmp_id: IdSchema }).strict();

const LabelFields = {
	name: z.string().min(1).max(191),
	color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
	order: z.number().int().nonnegative().optional(),
};
const LabelCreateInputSchema = z.object(LabelFields).strict();
const LabelUpdateInputSchema = z
	.object({ track_id: IdSchema, ...LabelFields })
	.strict();
const LabelDeleteInputSchema = z.object({ track_id: IdSchema }).strict();

const PartnerFields = {
	company: z.string().min(1).max(256),
	description: z.string().optional(),
	logo_url: z.string().url().optional(),
	photo_url: z.string().url().optional(),
	booth_number: z.string().max(191).optional(),
	web: z.string().max(512).optional(),
	email: z.string().max(256).optional(),
	phone: z.string().max(32).optional(),
	address: z.string().max(256).optional(),
};
const PartnerCreateInputSchema = z
	.object(PartnerFields)
	.strict()
	.refine(
		(value) => value.logo_url !== undefined || value.photo_url !== undefined,
		{
			message: 'At least one of logo_url or photo_url is required',
		},
	);
const PartnerUpdateInputSchema = z
	.object({ partner_id: IdSchema, ...PartnerFields })
	.strict();
const PartnerDeleteInputSchema = z.object({ partner_id: IdSchema }).strict();

const PartnerUrlSchema = z
	.object({ text: z.string().optional(), url: z.string().optional() })
	.strict();
const PartnerSectionSchema = z.discriminatedUnion('type', [
	z
		.object({
			id: IdSchema.optional(),
			type: z.literal(0),
			title: z.string().optional(),
			align: z.enum(['left', 'center', 'right']).optional(),
		})
		.strict(),
	z
		.object({
			id: IdSchema.optional(),
			type: z.literal(1),
			html: z.string().optional(),
			align: z.enum(['left', 'center', 'right']).optional(),
		})
		.strict(),
	z
		.object({
			id: IdSchema.optional(),
			type: z.literal(2),
			urls: z.array(PartnerUrlSchema).optional(),
		})
		.strict(),
	z
		.object({
			id: IdSchema.optional(),
			type: z.literal(3),
			images: z.array(z.string()).optional(),
		})
		.strict(),
	z
		.object({
			id: IdSchema.optional(),
			type: z.literal(4),
			files: z.array(z.string()).optional(),
		})
		.strict(),
	z
		.object({
			id: IdSchema.optional(),
			type: z.literal(5),
			facebook: z.string().optional(),
			twitter: z.string().optional(),
			linkedIn: z.string().optional(),
			youtube: z.string().optional(),
			instagram: z.string().optional(),
			general: z.string().optional(),
		})
		.strict(),
]);
const PartnerSectionsInputSchema = z
	.object({ partner_id: IdSchema, sections: z.array(PartnerSectionSchema) })
	.strict();
const ListPartnersInputSchema = EmptyInputSchema;

const AttendeeTicketSchema = z
	.object({
		number: z.string().max(512),
		title: z.string().max(256).optional(),
		type: z.enum(['plain', 'barcode', 'qr']).optional(),
	})
	.strict();
const PersonFields = {
	email: z.string().email().max(191),
	first_name: z.string().max(191).optional(),
	last_name: z.string().max(191).optional(),
	company: z.string().max(128).optional(),
	position: z.string().max(512).optional(),
	photo: z.string().optional(),
	phone: z.string().max(32).optional(),
	bio: z.string().optional(),
	web: z.string().max(512).optional(),
	facebook_link: z.string().max(512).optional(),
	twitter_link: z.string().max(512).optional(),
	linked_in_link: z.string().max(512).optional(),
	group_id: IdSchema.optional(),
	send_email: z.boolean().optional(),
};
const InviteAttendeesInputSchema = z
	.object({
		users: z
			.array(
				z
					.object({
						...PersonFields,
						tickets: z.array(AttendeeTicketSchema).optional(),
					})
					.strict(),
			)
			.min(1),
	})
	.strict();
const CheckInAttendeeInputSchema = z
	.object({ attendee_id: IdSchema, checkin: z.boolean() })
	.strict();
const ListParticipantsInputSchema = EmptyInputSchema;
const RemoveAttendeeInputSchema = z
	.object({
		email: z
			.string()
			.min(1)
			.describe('Plain email address; the plugin URL-encodes it for Eventee.'),
	})
	.strict();
const CreateRegistrationsInputSchema = z
	.object({ registrations: z.array(z.object(PersonFields).strict()).min(1) })
	.strict();
const ListRegistrationsInputSchema = EmptyInputSchema;
const RemoveRegistrationInputSchema = z
	.object({
		email: z
			.string()
			.min(1)
			.describe('Plain email address; the plugin URL-encodes it for Eventee.'),
	})
	.strict();
const ListGroupsInputSchema = EmptyInputSchema;
const ListReviewsInputSchema = EmptyInputSchema;

// OpenAPI objects use the default additionalProperties=true. Keep that
// forward-compatible behavior while typing every field the spec describes.
const HallResponseSchema = z
	.object({
		id: IdSchema,
		name: z.string().optional(),
		order: z.number().optional(),
		event_id: z.number().optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
		stream: z.string().nullable().optional(),
	})
	.passthrough();
const DayResponseSchema = z
	.object({
		id: IdSchema,
		date: z.string().optional(),
		event_id: z.number().optional(),
		content_url: z.string().optional(),
	})
	.passthrough();
const SessionStreamResponseSchema = z
	.object({
		code: z.string().optional(),
		url: z.string().optional(),
		available: z.boolean().optional(),
		is_live: z.boolean().optional(),
		streamable_type: z.string().optional(),
		streamable_id: z.number().optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
		availability: z.string().nullable().optional(),
		type: z.string().optional(),
	})
	.passthrough();
const BookingInfoResponseSchema = z
	.object({
		id: z.number().optional(),
		capacity: z.number().optional(),
		speaker_id: z.number().nullable().optional(),
		lecture_id: z.number().optional(),
		available: z.number().optional(),
		booked: z.boolean().optional(),
		booked_attendees: z.array(z.number()).optional(),
	})
	.passthrough();
// Eventee's OpenAPI declares these arrays but omits their item schemas, so unknown avoids inventing item types.
const UndocumentedItemArraySchema = z
	.array(z.unknown())
	.describe(
		'Eventee OpenAPI declares an array without an item schema; this uses unknown[] (rendered as any[] here) rather than assuming a shape.',
	);
const SessionResponseSchema = z
	.object({
		id: IdSchema,
		name: z.string().optional(),
		description: z.string().optional(),
		start: z.string().optional(),
		end: z.string().optional(),
		event_day_id: z.number().optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
		discussion: z.boolean().optional(),
		// Eventee returns false from create and 0 from update and content reads.
		panel_discussion: z.union([z.boolean(), z.number()]).optional(),
		code: z.string().optional(),
		moderating: z.boolean().optional(),
		polling: z.boolean().optional(),
		checkin: z.boolean().optional(),
		type: z.union([z.literal(0), z.literal(1)]).optional(),
		mentoring: z.boolean().optional(),
		hall_id: z.number().optional(),
		speakers: z.array(z.number()).optional(),
		files: UndocumentedItemArraySchema.optional(),
		available: z.number().optional(),
		booked: z.boolean().optional(),
		capacity: z.number().optional(),
		booking_info: z.array(BookingInfoResponseSchema).optional(),
		stream: SessionStreamResponseSchema.nullable().optional(),
		virtual_meeting: z.string().nullable().optional(),
		tracks: z.array(z.number()).optional(),
		event_id: z.number().optional(),
		qr_code_url: z.string().optional(),
		overlapping: z.boolean().optional(),
		visible_in_groups: UndocumentedItemArraySchema.optional(),
		mandatory_for_groups: UndocumentedItemArraySchema.optional(),
		mandatory: z.boolean().optional(),
	})
	.passthrough();
const BreakResponseSchema = z
	.object({
		id: IdSchema,
		name: z.string().optional(),
		description: z.string().optional(),
		start: z.string().optional(),
		end: z.string().optional(),
		event_day_id: z.number().optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
		event_id: z.number().optional(),
	})
	.passthrough();
const SpeakerResponseSchema = z
	.object({
		id: IdSchema,
		name: z.string().optional(),
		email: z.string().optional(),
		phone: z.string().optional(),
		bio_html: z.string().optional(),
		web: z.string().optional(),
		facebook: z.string().optional(),
		twitter: z.string().optional(),
		linkedIn: z.string().optional(),
		instagram: z.string().optional(),
		position: z.string().optional(),
		company: z.string().optional(),
		country: z.string().optional(),
		language: z.string().optional(),
		event_id: z.number().optional(),
		order: z.number().optional(),
		photo: z.string().nullable().optional(),
		thumbnail: z.string().nullable().optional(),
		bio: z.string().optional(),
	})
	.passthrough();
const LabelResponseSchema = z
	.object({
		id: IdSchema,
		name: z.string().optional(),
		color: z.string().optional(),
		order: z.number().optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
	})
	.passthrough();
const EventContentResponseSchema = z
	.object({
		halls: z.array(HallResponseSchema),
		days: z.array(DayResponseSchema),
		lectures: z
			.array(SessionResponseSchema)
			.describe(
				'Nested session fields files, visible_in_groups, and mandatory_for_groups have undocumented array item schemas and remain unknown[].',
			),
		workshops: z
			.array(SessionResponseSchema)
			.describe(
				'Nested session fields files, visible_in_groups, and mandatory_for_groups have undocumented array item schemas and remain unknown[].',
			),
		pauses: z.array(BreakResponseSchema),
		speakers: z.array(SpeakerResponseSchema),
		tracks: z.array(LabelResponseSchema),
	})
	.passthrough();

const PartnerImageResponseSchema = z
	.object({
		id: z.number().optional(),
		width: z.number().optional(),
		height: z.number().optional(),
		type: z.string().optional(),
		url: z.string().optional(),
		thumbnail: z.string().optional(),
		giphy_id: z.string().nullable().optional(),
	})
	.passthrough();
const PartnerSectionResponseSchema = z
	.object({
		id: z.number().optional(),
		type: z.number().optional(),
		data: z.string().optional(),
		order: z.number().optional(),
	})
	.passthrough();
const PartnerResponseSchema = z
	.object({
		id: IdSchema,
		company: z.string().optional(),
		description: z.string().optional(),
		web: z.string().optional(),
		email: z.string().optional(),
		phone: z.string().optional(),
		address: z.string().optional(),
		code: z.string().optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
		sections: z.array(PartnerSectionResponseSchema).optional(),
		exhibitor: z.boolean().optional(),
		sponsor: z.boolean().optional(),
		exhibitor_info: z
			.object({
				booth_number: z.string().optional(),
				order: z.number().optional(),
				photo: PartnerImageResponseSchema.optional(),
			})
			.passthrough()
			.nullable()
			.optional(),
		sponsor_info: z
			.object({
				order: z.number().optional(),
				sponsor_category_id: z.string().nullable().optional(),
				photo: PartnerImageResponseSchema.optional(),
			})
			.passthrough()
			.nullable()
			.optional(),
		logo: PartnerImageResponseSchema.nullable().optional(),
		photo: PartnerImageResponseSchema.nullable().optional(),
		qr_code_url: z.string().optional(),
	})
	.passthrough();
const PartnerListResponseSchema = z.array(PartnerResponseSchema);
const InviteResponseSchema = z
	.object({ url: z.string(), qr_code: z.string() })
	.passthrough();
const AttendeeResponseSchema = z
	.object({
		id: IdSchema,
		email: z.string().optional(),
		first_name: z.string().optional(),
		last_name: z.string().optional(),
		photo: z.string().nullable().optional(),
		thumbnail: z.string().nullable().optional(),
		company: z.string().optional(),
		position: z.string().optional(),
		imported: z.boolean().optional(),
		anonymous: z.boolean().optional(),
		invited: z.boolean().optional(),
		email_valid: z.boolean().optional(),
		has_tickets: z.boolean().optional(),
		tickets_count: z.number().optional(),
		group_id: z.number().nullable().optional(),
		checked_at: z.string().nullable().optional(),
		registered_at: z.string().nullable().optional(),
		account_deleted: z.boolean().optional(),
	})
	.passthrough();
const ParticipantResponseSchema = z
	.object({
		id: IdSchema,
		email: z.string().optional(),
		name: z.string().optional(),
		first_name: z.string().optional(),
		last_name: z.string().optional(),
		company: z.string().optional(),
		position: z.string().optional(),
		role: z.enum(['a', 'm', 'l', 'e']).optional(),
		group_id: z.number().nullable().optional(),
		url: z.string().optional(),
		tickets: z
			.array(
				z
					.object({
						number: z.string().optional(),
						title: z.string().optional(),
						type: z.string().optional(),
					})
					.passthrough(),
			)
			.optional(),
		checked_at: z.string().nullable().optional(),
		registered_at: z.string().nullable().optional(),
		account_deleted: z.boolean().optional(),
	})
	.passthrough();
const ParticipantListResponseSchema = z.array(ParticipantResponseSchema);
const RegistrationResponseSchema = z
	.object({
		id: IdSchema,
		email: z.string().optional(),
		email_valid: z.boolean().nullable().optional(),
		status: z
			.union([z.literal(0), z.literal(1), z.literal(2)])
			.nullable()
			.optional(),
		first_name: z.string().optional(),
		last_name: z.string().optional(),
		photo: z.string().nullable().optional(),
		phone: z.string().optional(),
		bio: z.string().optional(),
		web: z.string().optional(),
		facebook_link: z.string().optional(),
		twitter_link: z.string().optional(),
		linkedIn_link: z.string().optional(),
		position: z.string().optional(),
		company: z.string().optional(),
		answer_histories: UndocumentedItemArraySchema.optional(),
		group_id: z.number().nullable().optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
		form_id: z.string().nullable().optional(),
		form_answers: UndocumentedItemArraySchema.optional(),
		account_deleted: z.boolean().optional(),
	})
	.passthrough();
const RegistrationListResponseSchema = z.array(RegistrationResponseSchema);
const GroupResponseSchema = z
	.object({
		id: IdSchema,
		name: z.string().optional(),
		public_name: z.string().optional(),
		color: z.string().optional(),
		emoji: z.string().optional(),
		agenda: z.boolean().optional(),
		questions: z.boolean().optional(),
		polling: z.boolean().optional(),
		newsfeed: z.boolean().optional(),
		networking: z.boolean().optional(),
		session_ratings: z.boolean().optional(),
		social_wall: z.boolean().optional(),
		gamification: z.boolean().optional(),
		ticket_names: z.array(z.string()).optional(),
		is_default: z.boolean().optional(),
		notification_suffix: z.string().optional(),
		event_id: z.number().optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
		deleted_at: z.string().nullable().optional(),
	})
	.passthrough();
const GroupListResponseSchema = z.array(GroupResponseSchema);
const ReviewResponseSchema = z
	.object({
		id: IdSchema,
		stars: z.number().int().min(1).max(5).optional(),
		comment: z.string().optional(),
		device: z.string().optional(),
		OS: z.string().optional(),
		lecture_id: z.number().optional(),
		user_id: z.number().optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
		username: z.string().optional(),
		userphoto: z.string().optional(),
		account_deleted: z.boolean().optional(),
		lecture: SessionResponseSchema.optional().describe(
			'Nested session fields files, visible_in_groups, and mandatory_for_groups have undocumented array item schemas and remain unknown[].',
		),
	})
	.passthrough();
const ReviewListResponseSchema = z.array(ReviewResponseSchema);
const NoContentResponseSchema = z.undefined();

export const EventeeEndpointInputSchemas = {
	contentGet: EventContentInputSchema,
	contentDeleteAll: EmptyInputSchema,
	hallCreate: HallCreateInputSchema,
	hallUpdate: HallUpdateInputSchema,
	hallDelete: HallDeleteInputSchema,
	sessionCreate: SessionCreateInputSchema,
	sessionUpdate: SessionUpdateInputSchema,
	sessionDelete: SessionDeleteInputSchema,
	breakCreate: BreakCreateInputSchema,
	breakUpdate: BreakUpdateInputSchema,
	breakDelete: BreakDeleteInputSchema,
	speakerCreate: SpeakerCreateInputSchema,
	speakerUpdate: SpeakerUpdateInputSchema,
	speakerDelete: SpeakerDeleteInputSchema,
	labelCreate: LabelCreateInputSchema,
	labelUpdate: LabelUpdateInputSchema,
	labelDelete: LabelDeleteInputSchema,
	partnerCreate: PartnerCreateInputSchema,
	partnerUpdate: PartnerUpdateInputSchema,
	partnerDelete: PartnerDeleteInputSchema,
	partnerUpdateSections: PartnerSectionsInputSchema,
	partnerList: ListPartnersInputSchema,
	attendeeInvite: InviteAttendeesInputSchema,
	attendeeCheckIn: CheckInAttendeeInputSchema,
	attendeeList: ListParticipantsInputSchema,
	attendeeRemove: RemoveAttendeeInputSchema,
	registrationCreate: CreateRegistrationsInputSchema,
	registrationList: ListRegistrationsInputSchema,
	registrationRemove: RemoveRegistrationInputSchema,
	groupList: ListGroupsInputSchema,
	reviewList: ListReviewsInputSchema,
} as const;

export const EventeeEndpointOutputSchemas = {
	contentGet: EventContentResponseSchema,
	contentDeleteAll: NoContentResponseSchema,
	hallCreate: HallResponseSchema,
	hallUpdate: HallResponseSchema,
	hallDelete: NoContentResponseSchema,
	sessionCreate: SessionResponseSchema,
	sessionUpdate: SessionResponseSchema,
	sessionDelete: NoContentResponseSchema,
	breakCreate: BreakResponseSchema,
	breakUpdate: BreakResponseSchema,
	breakDelete: NoContentResponseSchema,
	speakerCreate: SpeakerResponseSchema,
	speakerUpdate: SpeakerResponseSchema,
	speakerDelete: NoContentResponseSchema,
	labelCreate: LabelResponseSchema,
	labelUpdate: LabelResponseSchema,
	labelDelete: NoContentResponseSchema,
	partnerCreate: PartnerResponseSchema,
	partnerUpdate: PartnerResponseSchema,
	partnerDelete: NoContentResponseSchema,
	partnerUpdateSections: PartnerResponseSchema,
	partnerList: PartnerListResponseSchema,
	attendeeInvite: InviteResponseSchema,
	attendeeCheckIn: AttendeeResponseSchema,
	attendeeList: ParticipantListResponseSchema,
	attendeeRemove: NoContentResponseSchema,
	registrationCreate: InviteResponseSchema,
	registrationList: RegistrationListResponseSchema,
	registrationRemove: NoContentResponseSchema,
	groupList: GroupListResponseSchema,
	reviewList: ReviewListResponseSchema,
} as const;

export type EventeeEndpointInputs = {
	[K in keyof typeof EventeeEndpointInputSchemas]: z.infer<
		(typeof EventeeEndpointInputSchemas)[K]
	>;
};
export type EventeeEndpointOutputs = {
	[K in keyof typeof EventeeEndpointOutputSchemas]: z.infer<
		(typeof EventeeEndpointOutputSchemas)[K]
	>;
};
