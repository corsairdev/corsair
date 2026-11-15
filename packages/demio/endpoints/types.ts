import { z } from 'zod';

// Inputs use Demio's own parameter names and spellings. Outputs are `.loose()`
// and their documented-but-absent fields nullish, so a field Demio adds or
// omits cannot fail a call that has already happened. The one deliberate
// exception is the `status` a caller reads back: Demio spells it with spaces
// there and with hyphens in the filter, so both are declared where each appears.

const EventIdSchema = z
	.number()
	.int()
	.positive()
	.describe('The event id from `events.list` or `events.get`.');

const DateIdSchema = z
	.number()
	.int()
	.positive()
	.describe('The event date id from `events.get` or `events.getDate`.');

// ── events.list ───────────────────────────────────────────────────────────

const EventStatusSchema = z.string();

/** Present for an automated event, null otherwise. */
const AutomatedSchema = z
	.object({
		ready: z.boolean().nullish(),
		duration: z.number().nullish(),
	})
	.loose()
	.nullish();

export const EventSummarySchema = z
	.object({
		id: z.number(),
		labeled_name: z
			.string()
			.nullish()
			.describe('The name prefixed with the event type.'),
		name: z.string(),
		description: z.string().nullish(),
		date_id: z.number().describe('The representative date for this event.'),
		status: EventStatusSchema.describe(
			'The status of that date: `scheduled`, `running`, `finished` or `on-demand`.',
		),
		timestamp: z
			.number()
			.describe('When that date starts, as a Unix timestamp.'),
		zone: z.string().nullish().describe("The date's IANA time zone."),
		registration_url: z
			.string()
			.describe("The event's public registration page."),
		automated: AutomatedSchema,
	})
	.loose();

export type DemioEventSummary = z.infer<typeof EventSummarySchema>;

export const DemioEventsListInputSchema = z.object({
	type: z
		.enum(['upcoming', 'past', 'automated'])
		.optional()
		.describe(
			'Narrows the list. Omit it to receive every event with its nearest date.',
		),
});

export type DemioEventsListInput = z.input<typeof DemioEventsListInputSchema>;

export const DemioEventsListResponseSchema = z.array(EventSummarySchema);

export type DemioEventsListResponse = z.infer<
	typeof DemioEventsListResponseSchema
>;

// ── events.get ────────────────────────────────────────────────────────────

const EventDateSchema = z
	.object({
		date_id: z.number(),
		status: EventStatusSchema,
		// An on-demand date has no fixed time, so all three are null for it.
		timestamp: z.number().nullish(),
		datetime: z.string().nullish(),
		zone: z.string().nullish(),
	})
	.loose();

export type DemioEventDate = z.infer<typeof EventDateSchema>;

export const DemioEventsGetInputSchema = z.object({
	id: EventIdSchema,
	active: z
		.boolean()
		.optional()
		.describe(
			'Receive only dates that are scheduled or running. Demio reads any value other than its own `false` as `true`, so this is sent only when set.',
		),
});

export type DemioEventsGetInput = z.input<typeof DemioEventsGetInputSchema>;

export const DemioEventsGetResponseSchema = z
	.object({
		id: z.number(),
		name: z.string(),
		description: z.string().nullish(),
		registrants_stay_registered: z
			.boolean()
			.nullish()
			.describe('True when registering once covers the whole series.'),
		registration_url: z.string(),
		automated: AutomatedSchema,
		next_date_id: z
			.number()
			.nullish()
			.describe('The first date that has not finished, if any.'),
		dates: z.array(EventDateSchema),
	})
	.loose();

export type DemioEventsGetResponse = z.infer<
	typeof DemioEventsGetResponseSchema
>;

// ── events.getDate ────────────────────────────────────────────────────────

export const DemioEventsGetDateInputSchema = z.object({
	id: EventIdSchema,
	date_id: DateIdSchema,
});

export type DemioEventsGetDateInput = z.input<
	typeof DemioEventsGetDateInputSchema
>;

export const DemioEventsGetDateResponseSchema = z
	.object({
		date_id: z.number(),
		status: z
			.string()
			.describe(
				'`scheduled`, `running` or `finished`. Unlike `events.get`, an on-demand date reports `running` here rather than `on-demand`.',
			),
		timestamp: z
			.number()
			.describe(
				'When the date starts, as a Unix timestamp. For an on-demand date, the moment you asked.',
			),
		datetime: z
			.string()
			.describe(
				"The date's stored start time, formatted in its zone. For an on-demand date this does not describe the same instant as `timestamp`.",
			),
		zone: z.string(),
	})
	.loose();

export type DemioEventsGetDateResponse = z.infer<
	typeof DemioEventsGetDateResponseSchema
>;

// ── registrations.create ──────────────────────────────────────────────────

const RegistrationInputBase = z.object({
	id: EventIdSchema.optional().describe(
		'The event id. Give this or `ref_url`.',
	),
	ref_url: z
		.string()
		.describe("The event's registration page link. Give this or `id`."),
	date_id: DateIdSchema.optional().describe(
		"The event date to register for. Omit it to use the event's next date.",
	),
	name: z
		.string()
		.min(1)
		.describe(
			"The person's full name as one field. Demio rejects a name containing a URL.",
		),
	email: z.email().describe('The email address to register.'),
});

/**
 * Demio identifies the event either by id or by its registration page link and
 * rejects a body that gives neither. Catching it here costs no API call.
 */
export const DemioRegistrationsCreateInputSchema = z
	.object({
		...RegistrationInputBase.shape,
		// Declared here rather than on the base so the refine below can narrow.
		ref_url: RegistrationInputBase.shape.ref_url.optional(),
	})
	.superRefine((input, ctx) => {
		if (input.id === undefined && input.ref_url === undefined) {
			ctx.addIssue({
				code: 'custom',
				path: ['id'],
				message: 'Give either `id` or `ref_url` to identify the event.',
			});
		}
	});

export type DemioRegistrationsCreateInput = z.input<
	typeof DemioRegistrationsCreateInputSchema
>;

export const DemioRegistrationsCreateResponseSchema = z
	.object({
		hash: z
			.string()
			.describe("The registrant's identifier for this event date."),
		join_link: z.string().describe('The link the person opens to join.'),
	})
	.loose();

export type DemioRegistrationsCreateResponse = z.infer<
	typeof DemioRegistrationsCreateResponseSchema
>;

// ── reports.participants ──────────────────────────────────────────────────

/**
 * The filter spells these with hyphens and the response returns them with
 * spaces, so the two spellings are separate declarations rather than one enum.
 */
export const DEMIO_PARTICIPANT_FILTERS = [
	'attended',
	'did-not-attend',
	'completed',
	'left-early',
	'banned',
] as const;

export const DemioReportsParticipantsInputSchema = z.object({
	date_id: DateIdSchema,
	status: z
		.enum(DEMIO_PARTICIPANT_FILTERS)
		.optional()
		.describe('Narrows the list. Omit it to receive every registrant.'),
});

export type DemioReportsParticipantsInput = z.input<
	typeof DemioReportsParticipantsInputSchema
>;

const CustomFieldSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		value: z.string(),
	})
	.loose();

const ParticipantSchema = z
	.object({
		email: z.string(),
		name: z.string(),
		custom_fields: z.array(CustomFieldSchema),
		attended: z.boolean(),
		status: z
			.string()
			.describe(
				'How the person took part, spelled with spaces here: `did not attend`, `left early`, `completed` or `banned`.',
			),
	})
	.loose();

export type DemioParticipant = z.infer<typeof ParticipantSchema>;

export const DemioReportsParticipantsResponseSchema = z
	.object({
		participants: z.array(ParticipantSchema),
	})
	.loose();

export type DemioReportsParticipantsResponse = z.infer<
	typeof DemioReportsParticipantsResponseSchema
>;

// ── ping.ping ─────────────────────────────────────────────────────────────

export const DemioPingInputSchema = z.object({});

export type DemioPingInput = z.input<typeof DemioPingInputSchema>;

export const DemioPingResponseSchema = z
	.object({
		pong: z.boolean().describe('True when the credentials are accepted.'),
		sandbox: z
			.boolean()
			.optional()
			.describe('Present and true only for a sandbox account.'),
	})
	.loose();

export type DemioPingResponse = z.infer<typeof DemioPingResponseSchema>;

// ── registry ──────────────────────────────────────────────────────────────

export const DemioEndpointInputSchemas = {
	eventsList: DemioEventsListInputSchema,
	eventsGet: DemioEventsGetInputSchema,
	eventsGetDate: DemioEventsGetDateInputSchema,
	registrationsCreate: DemioRegistrationsCreateInputSchema,
	reportsParticipants: DemioReportsParticipantsInputSchema,
	pingCheck: DemioPingInputSchema,
} as const;

export const DemioEndpointOutputSchemas = {
	eventsList: DemioEventsListResponseSchema,
	eventsGet: DemioEventsGetResponseSchema,
	eventsGetDate: DemioEventsGetDateResponseSchema,
	registrationsCreate: DemioRegistrationsCreateResponseSchema,
	reportsParticipants: DemioReportsParticipantsResponseSchema,
	pingCheck: DemioPingResponseSchema,
} as const;

export type DemioEndpointInputs = {
	eventsList: DemioEventsListInput;
	eventsGet: DemioEventsGetInput;
	eventsGetDate: DemioEventsGetDateInput;
	registrationsCreate: DemioRegistrationsCreateInput;
	reportsParticipants: DemioReportsParticipantsInput;
	pingCheck: DemioPingInput;
};

export type DemioEndpointOutputs = {
	eventsList: DemioEventsListResponse;
	eventsGet: DemioEventsGetResponse;
	eventsGetDate: DemioEventsGetDateResponse;
	registrationsCreate: DemioRegistrationsCreateResponse;
	reportsParticipants: DemioReportsParticipantsResponse;
	pingCheck: DemioPingResponse;
};
